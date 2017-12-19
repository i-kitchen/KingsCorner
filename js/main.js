var socket;
var cardsSvg;
var gameBoard;
var userId;
var snap;

// Paths
var host = "ws://serenity.ist.rit.edu:9000/442/proj/serviceLayer"
var loginUrl = "./bizLayer/Authenticate.php";
var templateUrl = "./bizLayer/TemplateController.php";

$(document).ready(function() {
    if(isWebSocketSupported()) {
        if(onScreen == 'login') {
            // do stuff
        }
        else {
            // Connect to WS server
            Socket.connect();

            // Set user's id
            userId = getCookie('uname');

            // Set the snap obj
            snap = Snap(document.getElementsByTagName('svg')[0]);

            // Initialize game controls
            $('#logout').on('click', gameControls.logout);
            $('#createGame').on('click', gameControls.createGame);
        }
    }
    else {
        // Display not supported error
        $('body').html("<h1>GET A BETTER BROWSER</h1>");
    }
});

function onConnected() {
    
}

/**
 * Sends request to initiate user
 * 
 * @param loginForm - the username form element
 * @return false to prevent default form submission
 */
function validateLogin(loginForm) {
    //displayModal(false, false, '<div class="loader"></div><div class="loadingText">Authenticating...</div>', 'modalLoader');

    // Get form submission elements
    var form = $(loginForm);
    var user = encodeURI(form.find('input[name=uname]').val());
    var pass = encodeURI(form.find('input[name=psw]').val());

    // Send ajax request for login confirmation
    requestData(loginUrl, {command: 'login', user: user, password: pass}, function(res) {
        var response = JSON.parse(res);

        if(response.user != 'error') {
            console.log(res);

            // Connect to the websocket server
            Socket.connect();

            userId = response.id;

            // Get the game board
            requestData(templateUrl, {template: '../templates/gameArea.tpl'}, function(res) {
                $('body').html(res);

                // Set welcome message
                $('#usersName').text(getCookie('uname'));
            });
        }
        else {
            // Close modal and display error
            displayModal(true);
            addNotification(false, 'body', response.reason);

            // Clear inputs
            var form = $(loginForm);
            form.find('input[name=uname]').val('');
            form.find('input[name=psw]').val('');
        }
    });

    // Prevent default submission
    return false;
}

function gameInit(message) {
    console.log(message);
}

/**
 * Constructs and sends the ajax request to the API gateway
 * 
 * @param params - Data to pass in the request
 * @param doneFunct - Function to be called when a response is given
 */
function requestData(destination, params, doneFunct) {
    $.ajax({
        url: destination,
        method:"GET",
        data: params
    }).done(function(data) {
        // console.log(data);
        try {
            //var response = JSON.parse(data);

            // Call the finish function
            doneFunct(data);
        } catch(e) {
            // Close any modals
            displayModal(true, false);
            addNotification(false, 'body', "An error has occurred. Please refresh or try again later")
        }

    }).fail(function(xhr, status, error) {
        // Handle error
        addNotification(false, 'body', "A network error has occurred. Please refresh or try again later");
    });
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

/**
 * Displays a popup modal
 * 
 * @param remove - true to remove the popup 
 * @param slide - true to animate adding or removing popup
 * @param content - What should be displayed in the popup
 * @param modalClass - any classes to add to the content separated by a space
 * @param closable - true if the popup can be closed
 * @param header - content for the header, if blank, there won't be a header
 */
function displayModal(remove, slide, content, modalClass, closable, header) {
    // IF we want to display the modal
    if(!remove) {
        // Add wrapper divs
        var modHtml = '<div class="modal">'+
                        '<div class="modalContent vcenter '+modalClass+'" style="display:none;">';

        // IF there is a header defined
        if(header) {
            // Add a header to the modal
            modHtml += '<div class="modalHeader">'+
                          '<h3>'+header+'</h3>'+
                        '</div>';
        }

        // Add content and close wrapper divs
        modHtml += content+'</div></div>';

        // Display the modal
        $('body').append(modHtml);
        if(slide) {
            $('.modalContent').slideDown();
        }
        else {
            $('.modalContent').show();
        }

        if(closable) {
            // Set window onclick function to remove the modal
            window.onclick = function(event) {
                if(event.target == document.getElementsByClassName('modal')[0]) {
                    displayModal(true, true);
                }
            }
        }
    }
    else {
        // remove the modal from the screen
        if(slide) {
            $('.modalContent').slideUp(400, function(){
                $('.modal').last().remove();
            });
        }
        else {
            $('.modal').last().remove();
        }
    }
}

/**
 * Adds a notification to the desired area
 * 
 * @param dismiss - true if we just want to remove the notification
 * @param area - the element where we want to put the notification
 * @param text - what the notification should say
 * @param severity - defines the color of the notification
 */
function addNotification(dismiss, area, text, severity) {
    if(!dismiss) {
        // IF there is already a notification on the screen, get rid of it
        if($(".alert").length > 0) {
            $(".alert").remove();
        }

        var notificationHtml = '<div class="alert '+severity+'">'+
                                 '<span onclick="addNotification(true)" class="closebtn">&times;</span>'+
                                 text+
                               '</div>';

        $(area).prepend(notificationHtml);
    }
    else {
        $(".alert").remove();
    }
}

/**
 * Sets a new cookie or overwrites one of the same name
 * 
 * @param name - the name of the cookie
 * @param value - what the cookie should contain
 * @param hours - the amount of hours before the cookie expires
 */
function setCookie(name, value, hours)
{
    // Calculate the expire time
    var d = new Date();
    d.setTime(d.getTime() + (hours*60*60*1000));
    var expires = "expires="+ d.toUTCString();

    // Set the cookie
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * Gets a cookie from the cookie string
 * 
 * @param name - the name of the cookie requested
 * @return - The value of the cookie with the matching name or an empty string
 *           if not found
 */
function getCookie(name)
{
    var name = name + "=";

    // Get cookie string and split it up by cookie
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');

    // Loop through all cookies
    for(var i = 0; i < ca.length; i++)
    {
        var cookie = ca[i];
        while(cookie.charAt(0) == ' ')
        {
            cookie = cookie.substring(1);
        }

        // IF we find a match, return the value of that cookie
        if(cookie.indexOf(name) == 0)
        {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

/**
 * Snap hover-over plugin written by Serdar Sanri
 * https://codepen.io/ssanri/pen/yaPoYk?editors=0010
 * https://github.com/adobe-webplatform/Snap.svg/issues/285
 */
Snap.plugin(function(Snap, Element, Paper, global, Fragment) {
  Element.prototype.checkUnder = function(query, overCallback, afterCallback) {
    var that = this;
    var gABox = this.getBBox();
    var isOver = 0;
    var snapElUnder = false;
    var others = Snap.selectAll(query);
    others.forEach(function(box) { // Snap.selectAll returns a set
      var gBBox = box.getBBox();
      if (gABox && gBBox && Snap.path.isBBoxIntersect(gABox, gBBox) && box.id != that.id) { // box.id!=that.id added so it won't look for self.
        snapElUnder = Snap(box);
        isOver = 1;
      }
    });

    if (isOver && snapElUnder) {
      if (typeof this.data('isOver') === 'undefined') {
        if (typeof overCallback != "undefined") {
          overCallback.call(this, snapElUnder);
          this.data('isOver', snapElUnder);
          // also let's add the event handler disabled in original code so we can listen
          eve("snap.drag.over." + this.id, this, snapElUnder);
        }
      }
    } else {
      if (typeof this.data('isOver') !== 'undefined') {
        if (typeof overCallback != "undefined" && typeof afterCallback != "undefined") {
          afterCallback.call(this, this.data('isOver'));
          this.removeData('isOver');
          // and is out listener
          eve("snap.drag.out." + this.id, this, snapElUnder);
        }
      }
    }
  }
});
