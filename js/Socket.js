/***************************************************************************//**
 * Socket.js
 * JavaScript interface for handling websockets
 ******************************************************************************/

Socket = {};

Socket.status = -1;         // Status of the websocket connection
                            // -1: No connection
                            //  0: Connection in progress
                            //  1: Connection established

Socket.server = "ws://serenity.ist.rit.edu:9000/442/proj/serviceLayer";
Socket.failedConnect = -1;  // How many times its failed to find the board.
Socket.retry = false;       // If its a retry connection
Socket.queue = [];          // Stores nodes issued before the
                            // websocket connection is made

/******************************************************************************
 * websocket()
 * Sends a command to the ws server. If the connection has not been made yet it
 * queues the request and initiates a new WebSocket.
 *
 * \param command       What we are doing
 * \param data          Data command needs 
 * \param callback      Javascript function callback
 *****************************************************************************/
Socket.websocket = function(command, data, callback) {
    var message = {};
    message.command = command;
    message.data = data;
    message.callback = callback;
    
    if(Socket.status != 1) {
        // No connection. If one is not in progress we create a new WebSocket.
        if(Socket.status == -1) {
            Socket.connect();
        }
    } else {
        Socket.connection.send(JSON.stringify(message));
    }
};

Socket.connect = function() {
    
    if(isWebSocketSupported())
    {
        console.log('Creating websocket connection.');
        
        if(Socket.connection){
            Socket.connection.close();
        }
        
        Socket.connection = new WebSocket(Socket.server);
        
        // Handler for connection established
        Socket.connection.onopen = function(){
            console.log('Websocket connection created.');
            Socket.status = 1;
            
            if(Socket.retry)
            {
                // Display reconnected notification
                /*setTimeout(function() {
                    Notifications.hide("error");
                    Notifications.add("success", "Reconnected to the server. Refreshing...", true);
                    setTimeout(function() {
                        location.reload();
                    }, 3000);
                },1000);*/
            }
            
            Socket.failedConnect = -1;
            Socket.retry = false;
        }

        // Handler for connection closed. Check to see if it was an error
        Socket.connection.onclose = function(event) {
            console.log('Websocket connection closed.');
            
            if(Socket.status == 1) {
                // Websocket server went down
                if(event.code == 1006) {
                    // Display ws connection lost message

                    Socket.retry = true;
                    setTimeout(function() {
                        Socket.connect();
                    }, 2000);
                }
            } else {
                setTimeout(function() {
                    Socket.connect();
                }, 1000);
            }
            
            Socket.failedConnect++;
        }
        
        // Makes the callback any time a message is received.
        Socket.connection.onmessage = function(event) {
            var message = jQuery.parseJSON(event.data);
            window[message.callback](message);
        }
    } else {
        console.log("Websocket not supported in browser.");
    }
    
    Socket.status = 0;
}
