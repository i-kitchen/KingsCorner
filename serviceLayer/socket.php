#!/usr/bin/env php
<?php

require_once('./websockets.php');
require_once('../bizLayer/game.php');

class Server extends WebSocketServer {

    protected $users = array();
    
    protected function process($user, $message) {
        $this->stdout($user->socket);
        $this->stdout($message);
        $msg = json_decode($message, true);

        // Set user variables
        $user->currentCallback = $msg['callback'];

        switch($msg['command']) {
            case 'init':
                $user->userId = $msg['data']['userId'];

                init($user, $msg, $this);

                break;

            case 'createUser':
                if(isset($users[$msg['uname']])) {
                    // Set websocket id in db to new ws id
                }
                else {
                    // Create user in db
                    $dbId = createUser($msg['uname'], $user->id);
                    $user->dbId = $dbId;

                    // Set user into array with the value being the dbId
                }

                break;
            
            case 'endTurn':
                nextTurn($user, $msg['data'], $this);
                break;

            default:
                # code...
                break;
        }
        //$this->send($user,$message);
    }

    protected function connected($user) {
        // Send login template to user
        $this->stdout($user->socket);
    }

    protected function closed($user) {
        // Notify opponents of disconnect
    }

    public function sendMessage($user, $message) {
        $data = array(
            'callback' => $user->currentCallback,
            'message'  => $message
        );

        $this->send($user, json_encode($data));
    }
}

// Start up websocket server
$serve = new Server("0.0.0.0","9000");

try {
    $serve->run();
}
catch (Exception $e) {
    $serve->stdout($e->getMessage());
}