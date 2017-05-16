var socket = require('../../socket');
var wss = socket.server;

if (!wss) throw new Error('No WebSocket server');












var player1 = null;
var player2 = null;
var playersWaiting = [];

var round = 0;
var gameStarted = false;

var p1choice = null;
var p2choice = null;

var p1energy = 0;
var p2energy = 0;

var gamecontinue = false;

function decide() {
    
    if (p1choice == null || p2choice == null) return;
    
    var alive1 = true;
    var alive2 = true;

    var temp = p1choice;
    if (p1choice == 15) {
        p1choice = 0;
    }else if (p1choice == 16) {
        p1choice = 1;
    }
    p1energy -= p1choice;
    p1choice = temp;
    if (p1energy < 0) {
        alive1 = false;
    }
    temp = p2choice;
    if (p2choice == 15) {
        p2choice = 0;
    }else if (p2choice == 16) {
        p2choice = 1;
    }
    p2energy -= p2choice;
    p2choice = temp;
    if (p2energy < 0) {
        alive2 = false;
    }
    console.log(p1energy);
    console.log(p2energy);
    if (p1choice == 6 && p2choice != 15) {
        alive2 = false;
    }
    else if (p2choice == 6 && p1choice != 16) {
        alive1 = false;
    }
    else if (p1choice == 15 || p1choice == 16) {
        p1choice = p2choice;
    }
    else if (p2choice == 15 || p2choice == 16) {
        p2choice = p1choice;
    }
    else if (p1choice > p2choice) {
        alive2 = false;
    }
    else if (p2choice > p1choice) {
        alive1 = false;
    }
    if (alive1 == alive2) {
        if (alive1) {
            gamecontinue = true;
        }
        else {
            console.log('tie');
        }
    }
    else if (!alive1) {
        player1.send(JSON.stringify({
            win: false
        }));
        player2.send(JSON.stringify({
            win: true
        }));
    }
    else if (!alive1) {
        player2.send(JSON.stringify({
            win: false
        }));
        player1.send(JSON.stringify({
            win: true
        }));
    }
    
    p1choice = null;
    p2choice = null;
    
    round++;
    updateClients();
}

function startGame() {
    round = 1;
    p1choice = null;
    p2choice = null;
    p1energy = 0;
    p2energy = 0;
}

function updateClients() {
    player1.send(JSON.stringify({
        round: round,
        chargeyihao: p1energy
    }));
    player2.send(JSON.stringify({
        round: round,
        chargeyihao: p2energy
    }));
}

function player1Moved(value) {
    if (!gameStarted) return;
    if (!p1choice) p1choice = value;
    decide();
}

function player2Moved(value) {
    if (!gameStarted) return;
    if (!p2choice) p2choice = value;
    decide();
}


wss.on('connection', function(ws) {
    
    if (player1 == null) {
        player1 = ws;
        ws.send(JSON.stringify({
            player: 'Player 1'
        }));
        ws.on('message', function(message) {
            console.log('Player 1 Message', message);
            player1Moved(parseInt(JSON.parse(message).value));
        });
        ws.on('close', function() {
            console.log('Player 1 Disconnected');
            player1 = null;
            gameStarted = false;
        });
    }
    else if (player2 == null) {
        player2 = ws;
        ws.send(JSON.stringify({
            player: 'Player 2'
        }));
        ws.on('message', function(message) {
            console.log('Player 2 Message', message);
            player2Moved(parseInt(JSON.parse(message).value));
        });
        ws.on('close', function() {
            console.log('Player 2 Disconnected');
            player1 = null;
            gameStarted = false;
        });
    }
    if (player1 && player2) {
        gameStarted = true;
        startGame();
        updateClients();
    }
});

