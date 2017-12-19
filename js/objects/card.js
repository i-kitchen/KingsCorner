function Card(type) {
    var types = type.split("_");
    this.id = type;
    this.number = types[0];
    this.suit = types[1];
    this.svgId = "templates/svg-cards-indented.svg#"+type;
    this.svgEle;
    this.oppositeSuits = [];

    // Determine opposite suits
    if(this.suit == 'heart' || this.suit == 'diamond') {
        this.oppositeSuits.push('club', 'spade');
    }
    else {
        this.oppositeSuits.push('heart', 'diamond');
    }

    if(this.number == 'king') {
        this.number = 13;
    }
    else if(this.number == 'queen') {
        this.number = 12;
    }
    else if(this.number == 'jack') {
        this.number = 11;
    }

    // Cast to an actual number
    this.number = Number(this.number);

    // return this piece object
    return this;
}

Card.prototype = {
    setDrag: function() {
        this.svgEle.drag(drag.move, drag.start, drag.stop);
    },
    checkHit: function(underEle) {
        var topCard = underEle.topCard;
        console.log(topCard);

        // If it's an empty foundation
        if(underEle.cards.length == 0) {
            // If it's a corner
            if(underEle.corner == false) {
                // Empty and not a corner is a valid move
                return true;
            }
            else {
                if(this.number == 13) {
                    // empty and a corner and a king is valid
                    return true;
                }
                else {
                    // empty and corner and not king is not valid
                    return false;
                }
            }
        }
        else {
            if(this.oppositeSuits[0] == topCard.suit || this.oppositeSuits[1] == topCard.suit) {
                if(topCard.number-1 == this.number) {
                    // If the card underneath is of opposite colored suit and a higher number by 1, this is valid
                    return true;
                }
                else {
                    // lower number and opposite colored suit is not valid
                    return false;
                }
            }
            else {
                // same colored suit is not valid
                return false;
            }
        }
    }
}