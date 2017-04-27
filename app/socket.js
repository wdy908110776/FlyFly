var WebSocket = require('ws');
var socket = { server: null, onCreate: function(){} };

socket.createServer = function(server) {
    this.server = new WebSocket.Server({ server });
    this.onCreate(this.server);
}

exports = module.exports = socket;