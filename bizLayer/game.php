<?php  
/******************************************************************************
 * game.php
 * Controls the backend game logic
 *****************************************************************************/

require_once("../dataLayer/DB.class.php");
require_once("../bizLayer/Deck.class.php");

$db = new DB();

function init($user, $msg, $socket) {
    global $db;
    // Create a deck
    $gameDeck = new Deck();
    $deckString = $gameDeck->deckToString();

    // Create a game instance in the db
    $result = $db->createGame($user->userId, $deckString, $gameDeck->hand1, $gameDeck->hand2, $gameDeck->north, $gameDeck->south, $gameDeck->east, $gameDeck->west);

    // Update user entry to include game id as well as user's websocket id
    $numRows = $db->updateUser((int)$user->userId, $user->id, (int)$result);

    // Return deck and card layouts to client
    $returnData = array(
        'deck'  => $gameDeck->deck,
        'hand'  => $gameDeck->hand1,
        'north' => $gameDeck->north,
        'south' => $gameDeck->south,
        'east'  => $gameDeck->east,
        'west'  => $gameDeck->west,
        'error' => $result
    );

    $socket->sendMessage($user, $returnData);
}

function nextTurn($user, $data, $socket) {
    global $db;
    $numRows = $db->changeTurn($data);

    $message = 'error';

    if($numRows > 0) {
        $message = 'success';
    }

    $socket->sendMessage($user, $message);
}

function createUser($uname, $socketId) {
    global $db;

    $result = $db->createUser($uname, $socketId);
}

?>