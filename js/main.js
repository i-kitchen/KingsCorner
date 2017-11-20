var socket;
var host = "ws://serenity.ist.rit.edu:9000/442/proj/serviceLayer"

$(document).ready(function() {
    // if(isWebSocketSupported()) {
    //     Socket.connect();
    // }
});

function validateLogin(loginForm) {
    var form = $(loginForm);

    // Display authenticating modal
    displayModal(false, false, '<div class="loader"></div><div class="loadingText">Authenticating...</div>', 'modalLoader');

    // Prevent default submission
    return false;
}

/**
 * Constructs and sends the ajax request to the API gateway
 * 
 * @param params - Data to pass in the request
 * @param doneFunct - Function to be called when a response is given
 */
function requestData(dest, params, doneFunct) {
    $.ajax({
        url: dest,
        method:"GET",
        data: params
    }).done(function(data) {
        // console.log(data);
        try {
            var response = JSON.parse(data);

            // Call the finish function
            doneFunct(response);
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
 * Adds a notiication to the desired area
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
