var socket = require('../../socket');
var wss = socket.server;

if (!wss) throw new Error('No WebSocket server');

var sessions = [];

var GamePlayer = require('../../lib/gamePlayer');
var GameSession = require('../../lib/gameSession');


function onConnection(socket) {
    var openSession = null;
    var newPlayer = new GamePlayer(socket);
    
    for (var s of sessions) {
        if (s.numberOfPlayers < 2) {
            openSession = s;
        }
    }
    
    if (openSession) {
        openSession.addPlayer(newPlayer);
    } else {
        var newSession = new GameSession();
        newSession.addPlayer(newPlayer);
        sessions.push(newSession);
    }
    console.log(sessions);
}

wss.on('connection', onConnection);
