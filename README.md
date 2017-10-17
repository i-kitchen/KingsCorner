# Kings Corners


# Rules of Play
This game is for 2 - 4 players using a standard 52 card pack. Ace is considered the lowest card.
### Deal
* Dealer deals 7 cards to each player.
* The remaining cards are placed in the middle of the board face down. This will be known as the _**stock**_.
* Flip four cards face-up from the stock, and place them North, East, South, and West from the stock pile to create 4 _**foundation piles**_.

### Play
 Players take turns clockwise, starting with the player to dealer's left. On your turn, you may make any number of moves of the following types in any order:

* Play a card from your hand on one of the foundation piles. The card you play must be the next lower in rank and opposite in color - For example: you can play a red ten on a black jack. The cards on the foundation piles are overlapped slightly so that all can be seen. Since aces are the lowest cards, nothing can be played on a foundation pile that has an ace on top.
* Place a king from your hand to start a new foundation pile in an empty space in one of the four diagonal corners of the stock (NE, SE, NW, SW). It will then be possible to build on this king in the same way as on the original foundations, adding a queen of the opposite color, then a jack of the same color as the king, and so on.
* Move an entire foundation pile onto another foundation pile if the bottom card of the moving pile is one rank lower and opposite in color to the top card of the pile you are moving it onto. Example: a pile consisting of red 4 - black 3 may be moved on top of a pile consisting of black 7 - red 6 - black 5.
* Play any card from your hand to any of the original (N, E, S, W) foundation piles that has become empty (because the card(s) that were originally in it have been moved to another pile). 

If you manage to play all the cards in your hand, you have won, and play ceases. Otherwise, after you have played any cards you can or wish to, you must draw one card from the stock. This ends your turn. If you are unable to or do not wish to play any cards, you simply draw one card.

If in the original layout, a king is dealt any of the original foundation piles (N, E, S, W), it can be moved to a corner position. The player to the left of dealer will have the benefit of making this move and playing a card from hand to replace the moved king.

It may also happen that one of the dealt foundation cards will immediately fit on another, being one rank lower and of opposite color. In this case the player to the left of dealer will be able to move this card and replace it with a card from hand.

If the center stock runs out, play continues without drawing.

The play ends when someone manages to get rid of all the cards from their hand, or when a stalemate is reached where the stock has run out and everyone is unable or unwilling to play any further cards. 

Rules from https://www.pagat.com/layout/kingscorners.html



# Architecture

* Layered approach
  * Data layer - Handles transactions with the database
  * Application layer - Main game logic. Contains the methods for generating new games, shuffling/dealing cards, determing valid moves, etc.
  * Presentaion layer - Creates the view for the player. Generates and displays SVG graphics, chat room, game lobby, etc.
* React for view
* Redux for state
