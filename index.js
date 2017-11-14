var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var router = express.Router();
var browser = require('browser-detect');

server.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

router.get('/', function (req, res, next) {
    var result = browser(req.headers['user-agent']);
    console.log(result);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'messaging')));

io.on('connection', function (socket) {
    console.log('connected');
});