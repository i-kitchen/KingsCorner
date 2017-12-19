function Foundation(rotation, group) {
    this.base = snap.select('#'+group+'_base');
    this.groupName = group;
    this.group = snap.select('#'+group);
    this.posX = this.base.attr('x');
    this.posY = this.base.attr('y');
    this.rotation = rotation;
    this.offsetX;
    this.offsetY;
    this.topCard;
    this.bottomCard;
    this.corner = (this.rotation ==  45 || this.rotation == -45) ? true : false;

    if(this.rotation == 90) {
        this.offsetX = 105.5;
        this.offsetY = 20;
    }
    else if(this.rotation == 45) {
        this.offsetX = 57;
        this.offsetY = -15;
    }
    else if(this.rotation == -45) {
        this.offsetX = -32;
        this.offsetY = 47;
    }
    else {
        this.offsetX = 0;
        this.offsetY = 0;
    }

    this.cards = [];

    // Set click function to display list of cards on foundation pile
    $("#"+this.groupName).on('click', function() {
        console.log(this.id);
    });
}

Foundation.prototype = {
    addCard: function(card, isNew, fill) {
        // Add this card to the foundation's list
        this.cards.push(card);

        var x = this.posX;
        var y = this.posY;
        var stackOffset = 30;

        // Since it's rotated, need to add these values cause math
        x = Number(x) + this.offsetX;
        y = Number(y) + this.offsetY;

        var amtOfCards = this.cards.length;
        var offsetLength = 0;

        // IF there's more than one card, offset the cards location relative to what's already on the pile
        if(amtOfCards >= 2) {
            offsetLength = 1;
        }

        // Only display the bottom and top card. They are the only one's that matter
        if(this.groupName == 'north') {
            y -= offsetLength*stackOffset;
        }
        else if(this.groupName == 'south') {
            y += offsetLength*stackOffset;
        }
        else if(this.groupName == 'east') {
            x += offsetLength*stackOffset;
        }
        else if(this.groupName == 'west') {
            x -= offsetLength*stackOffset;
        }
        else if(this.groupName == 'northWest') {
            x -= offsetLength*stackOffset;
            y -= offsetLength*stackOffset;
        }
        else if(this.groupName == 'northEast') {
            x += offsetLength*stackOffset;
            y -= offsetLength*stackOffset;
        }
        else if(this.groupName == 'southWest') {
            x -= offsetLength*stackOffset;
            y += offsetLength*stackOffset;
        }
        else if(this.groupName == 'southEast') {
            x += offsetLength*stackOffset;
            y += offsetLength*stackOffset;
        }

        // Create the card element
        var newEle;
        var id;
        if(isNew) {
            newEle = this.group.use();
            newEle.attr("xlink:href", card.svgId);
            id = card.id;
        }
        else {
            newEle = card;
            id = card.attr('id');
        }

        newEle.attr({
            fill: fill,
            transform: "translate("+x+","+y+") scale(0.5) rotate("+this.rotation+")",
            id: id
        });
        newEle.appendTo(this.group);

        // Set card's element variable
        card.svgEle = newEle;
        card.foundation = this.group;

        // Set the foundation's top and/or bottom card as these are the only one's we care about
        if(this.cards.length == 1) {
            this.bottomCard = card;
            this.topCard = card;
        }
        else {
            this.topCard = card;
        }

        return newEle;
    },
    setDrag: function() {
        this.group.drag(drag.move, drag.start, drag.stop);
    },
    clear: function() {
        this.cards = [];
        this.topCard = '';
        this.bottomCard = '';
        $.each(this.group.children(), function(index, ele) {
            ele.remove();
        });
    },
    prepareForWS: function() {
        var returnArr = [];
        $.each(this.cards, function(index, ele) {
            returnArr.push(ele.id);
        });

        return returnArr;
    }
}