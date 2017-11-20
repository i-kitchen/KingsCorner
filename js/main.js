var socket;
var host = "ws://serenity.ist.rit.edu:9000/442/proj/serviceLayer"

$(document).ready(function() {
    connect();
});

function connect() {
    // Connect to the ws server
    try {
        socket = new WebSocket(host);
        console.log('WebSocket - status '+socket.readyState);

        // Set the callback functions
        socket.onopen = function(msg) { 
            console.log("Welcome - status "+this.readyState); 
        };
        socket.onmessage = function(msg) { 
            console.log("Received: "+msg.data); 
        };
        socket.onclose = function(msg) { 
            console.log("Disconnected - status "+this.readyState); 
        };
    }
    catch(ex){ 
        console.log(ex); 
    }
}

/**
 * Checks to see if the browser supports websockets
 * 
 * @return true if websockets are supported
 */
function isWebSocketSupported() {
    if(typeof isWebSocketSupported.value === 'undefined' || isWebSocketSupported.value === null) {
        isWebSocketSupported.value = ('WebSocket' in window || 'MozWebSocket' in window);
    }
    return isWebSocketSupported.value;
}
