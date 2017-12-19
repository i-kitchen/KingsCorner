<?php

class User {
    private $username;
    private $gameId;

    public function __construct($username) {
        $this->username = $username;
    }

    public function setGameId($gameId) {
        $this->gameId = $gameId;
    }
}