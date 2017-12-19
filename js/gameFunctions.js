
var game = {
    stock:'',
    north:'',
    south:'',
    east:'',
    west:'',
    northWest:'',
    northEast:'',
    southWest:'',
    southEast:'',
    deck:new Array(),
    hand:{},
    allCards:{},
    player2cards:7,
    nyt: true,
    gameLog: '',
    addToHand: function(card) {
        var handContainer = snap.select('#hand');
        var handBBox = snap.select('#hand_base').getBBox();

        // Create the card element
        var newEle;
        var id;
        if(card.svgId) {
            newEle = handContainer.use();
            newEle.attr("xlink:href", card.svgId);
            id = card.id;
        }
        else {
            newEle = card;
        }

        //Calculate location
        var y = handBBox.y;
        var offset;
        var inHand = Object.keys(game.hand).length+1;
        if(inHand == 1) {
            offset = 0
        }
        else {
            offset = 40;
        }
        var x = handBBox.x+(offset*(inHand-1));

        newEle.attr({
            transform: "translate("+x+","+y+") scale(0.5)",
            id: card.id
        });
        //newEle.appendTo(handContainer);

        // Convert hand to hand of card objects
        card.svgEle = newEle;
        card.setDrag();
        this.hand[card.id] = card;
    },
    shiftHand: function() {
        var handArr = this.hand;

        this.hand = {};

        // Set hand
        $.each(handArr, function(index, ele) {
            ele.svgEle.remove();
            game.addToHand(ele, index+1);
        });
    },
    endTurn: function() {
        game.nyt = true;

        // Add next card to hand
        game.addToHand(game.deck.shift());

        // Prepare data for ws transmission
        var deckArr = [];
        $.each(game.deck, function(index, ele) {
            deckArr.push(ele.id);
        });

        var handArr = [];
        $.each(game.hand, function(index, ele) {
            handArr.push(ele.id);
        });

        // Send end of turn
        Socket.websocket('endTurn', {
            deck: deckArr,
            north: game.north.prepareForWS(),
            south: game.south.prepareForWS(),
            east: game.east.prepareForWS(),
            west: game.west.prepareForWS(),
            neast: game.northEast.prepareForWS(),
            nwest: game.northWest.prepareForWS(),
            seast: game.southEast.prepareForWS(),
            swest: game.southWest.prepareForWS(),
            hand: handArr
        }, 'endOfTurn');
    }
}

function initGame(message) {
    console.log(message);
    game.gameLog = $('.logArea');

    // Set stock and deck
    game.stock = new Foundation(0, 'stock');
    game.stock.addCard(new Card('back'), true, 'blue');
    var deckArr = message.message.deck;
    var currCard;
    for(var i = 0, loopLength = deckArr.length; i < loopLength; i++) {
        currCard = new Card(deckArr[i]);
        game.deck.push(currCard);
        game.allCards[currCard.id] = currCard;
    }
    // Set what happens when you click the stock
    game.stock.group.click(game.endTurn);

    // Set North
    game.north = new Foundation(0, 'north');
    currCard = new Card(message.message.north);
    game.allCards[currCard.id] = currCard;
    game.north.addCard(currCard, true, '');
    //game.north.setDrag();

    // Set south
    game.south = new Foundation(0, 'south');
    currCard = new Card(message.message.south);
    game.allCards[currCard.id] = currCard;
    game.south.addCard(currCard, true, '');
    //game.south.setDrag();

    // Set east
    game.east = new Foundation(90, 'east');
    currCard = new Card(message.message.east);
    game.allCards[currCard.id] = currCard;
    game.east.addCard(currCard, true, '');
    //game.east.setDrag();

    // Set west
    game.west = new Foundation(90, 'west');
    currCard = new Card(message.message.west);
    game.allCards[currCard.id] = currCard;
    game.west.addCard(currCard, true, '');
    //game.west.setDrag();

    // Setup the king's corners
    game.northWest = new Foundation(-45, 'northWest');
    game.northEast = new Foundation(45, 'northEast');
    game.southWest = new Foundation(45, 'southWest');
    game.southEast = new Foundation(-45, 'southEast');

    // Set hand
    var handArr = message.message.hand.split(',');
    for(var i = 0, loopLength = handArr.length; i < loopLength; i++) {
        currCard = new Card(handArr[i]);
        game.addToHand(currCard, i+1);
        game.allCards[currCard.id] = currCard;
    }

    game.nyt = false;
}// END initGame

function endOfTurn(message) {
    $(game.gameLog).append("Next Players Turn<br/>")
}

var drag={

    move:function(dx, dy, x, y, e){
        this.checkUnder(".dragover", function(o) { // over an object
            console.log("You just hit ", o)
        }, function(o) { // out of object
            console.log("You just left ", o);
        });
        // var snapInvMatrix = this.transform().diffMatrix.invert();
        // snapInvMatrix.e = snapInvMatrix.f = 0;
        // tdx = snapInvMatrix.x( dx,dy ); tdy = snapInvMatrix.y( dx,dy );
        // this.transform( "t" + [ tdx, tdy ] + this.data('ot') );
        this.attr({
            transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
        });
    },

    start:function() {
        console.log(this);
        this.data('ot', this.transform().local );
        this.data("next_sibling" , this.node.nextElementSibling);

        this.data('origTransform', this.transform().local );
        this.paper.append( this ); // small hack to bring element front
    },

    stop:function() {
        if (typeof this.data("isOver") != "undefined" && !game.nyt) { // we are over a foundation pile
            console.log(this.data("isOver").node.id);

            // It's a single card
            var underId = this.data("isOver").node.id.substr(0, this.data("isOver").node.id.indexOf('_'));
            if(this.type == "use") {
                // Get the card's and foundation's id
                var cardId = this.node.id;

                // Check for valid move
                var valid = game.allCards[cardId].checkHit(game[underId]);

                if(!valid) {
                    // Snap back to original location
                    this.transform(this.data('ot'));
                    if(this.data("next_sibling")) {
                        Snap(this.data("next_sibling")).before(this); // Put it back in same hierarchy 
                    }
                    $(game.gameLog).append("Invalid Move!<br/>");
                }
                else {
                    // Add card to foundation pile
                    game.hand[cardId].svgEle.remove();
                    game[underId].addCard(game.hand[cardId], true);

                    // shift hand
                    delete game.hand[cardId];
                    game.shiftHand();
                }
            }
            else { // It's a foundation
                var foundationId = this.node.id;

                var valid = game[foundationId].bottomCard.checkHit(game[underId]);
                if(!valid || game[underId] === game[foundationId]) {
                    // Snap back to original location
                    this.transform(this.data('ot'));
                    if(this.data("next_sibling")) {
                        Snap(this.data("next_sibling")).before(this); // Put it back in same hierarchy 
                    }
                }
                else {

                }
            }
        }
        else {
            this.transform(this.data('ot'));
            if(this.data("next_sibling")) {
                Snap(this.data("next_sibling")).before(this); // Put it back in same hierarchy 
            }

            if(game.nyt) {
                $(game.gameLog).append("NOT YOUR TURN!<br/>");
            }
        }
    }
}