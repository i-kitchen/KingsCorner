#!/usr/bin/env php
<?php

require_once('./websockets.php');
require_once('../bizLayer/game.php');

class Server extends WebSocketServer {
    
    protected function process($user, $message) {
        $msg = json_decode($message);

        switch($msg['command']) {
            case 'init':
                init($user, $msg);

                break;
            
            default:
                # code...
                break;
        }
        $this->send($user,$message);
    }

    protected function connected($user) {
        // set user into db under
    }

    protected function closed($user) {
        
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