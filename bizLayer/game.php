<?php  
/******************************************************************************
 * game.php
 * Controls the backend game logic
 *****************************************************************************/

require_once("../dataLayer/DB.class.php");

function init($user, $msg) {
    // Set user's game id
    $user->gameId = $msg['gameId'];

    // Set user into db

    // Set user's opponents
}

?>