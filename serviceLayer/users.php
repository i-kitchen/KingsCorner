<?php

class WebSocketUser {

  public $socket;
  public $id;
  public $gameId;
  public $headers = array();
  public $handshake = false;

  // Store the user's opponents
  public $opponents = array();

  public $handlingPartialPacket = false;
  public $partialBuffer = "";

  public $sendingContinuous = false;
  public $partialMessage = "";
  
  public $hasSentClose = false;

  function __construct($id, $socket) {
    $this->id = $id;
    $this->socket = $socket;
  }
}