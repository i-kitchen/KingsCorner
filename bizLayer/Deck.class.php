<?php

/**
 * The deck class contains functions for shuffling the deck, and setting up
 * player's hands, and foundation piles
 */
class Deck {
    public $hand1  = ''; // Player 1's hand
    public $hand2  = ''; // Player 2's hand
    public $north  = ''; // North foundation pile
    public $south  = ''; // South foundation pile
    public $east   = ''; // East foundation pile
    public $west   = ''; // West foundation pile
    public $northE = ''; // North East
    public $northW = ''; // North West
    public $southE = ''; // South East
    public $southW = ''; // South West
    public $deck;        // Shuffled deck 

    private $gameId;
    private $cards = [
        '1_spade',
        '2_spade',
        '3_spade',
        '4_spade',
        '5_spade',
        '6_spade',
        '7_spade',
        '8_spade',
        '9_spade',
        '10_spade',
        'jack_spade',
        'queen_spade',
        'king_spade',
        '1_club',
        '2_club',
        '3_club',
        '4_club',
        '5_club',
        '6_club',
        '7_club',
        '8_club',
        '9_club',
        '10_club',
        'jack_club',
        'queen_club',
        'king_club',
        '1_heart',
        '2_heart',
        '3_heart',
        '4_heart',
        '5_heart',
        '6_heart',
        '7_heart',
        '8_heart',
        '9_heart',
        '10_heart',
        'jack_heart',
        'queen_heart',
        'king_heart',
        '1_diamond',
        '2_diamond',
        '3_diamond',
        '4_diamond',
        '5_diamond',
        '6_diamond',
        '7_diamond',
        '8_diamond',
        '9_diamond',
        '10_diamond',
        'jack_diamond',
        'queen_diamond',
        'king_diamond'
    ];

    /**
     * [__construct description]
     */
    public function __construct() {
        $this->deck = $this->shuffleDeck();
        $this->dealHands();
        $this->initialFoundations();
    }

    /**
     * [deckToString description]
     * @return [type] [description]
     */
    public function deckToString() {
        return implode(',', $this->deck);
    }

    /**
     * [dealHands description]
     * @return [type] [description]
     */
    private function dealHands() {
        $hand1arr = array();
        $hand2arr = array();
        for($i = 1; $i <= 14; $i++) {
            // Take the first element from the array and evenly disperse 7 cards to each hand
            if($i % 2 != 0) {
                $hand1arr[] = array_shift($this->deck);
            }
            else {
                $hand2arr[] = array_shift($this->deck);
            }
        }

        // Get rid of the trailing commas
        $this->hand1 = implode(',', $hand1arr);
        $this->hand2 = implode(',', $hand2arr);
    }

    /**
     * [initialFoundations description]
     * @return [type] [description]
     */
    private function initialFoundations() {
        // Initially, all foundation piles only have one card
        $this->north = array_shift($this->deck);
        $this->south = array_shift($this->deck);
        $this->east = array_shift($this->deck);
        $this->west = array_shift($this->deck);
    }

    /**
     * [shuffleDeck description]
     * @return [type] [description]
     */
    private function shuffleDeck() {
        $deck = $this->cards;
        shuffle($deck);
        return $deck;
    }
}