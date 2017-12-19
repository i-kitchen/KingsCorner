var gameControls = {
    logout: function() {
        requestData(loginUrl, {command: 'logout'}, function(res) {
            // Refresh the page
            location.reload();
        });
    },

    createGame: function() {
        Socket.websocket('init', {userId: userId}, 'initGame');
    }
}