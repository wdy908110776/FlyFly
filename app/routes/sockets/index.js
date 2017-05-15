var socket = require('../../socket');
var wss = socket.server;

if (!wss) throw new Error('No WebSocket server');


var player1 = null;
var player2 = null;
var playersWaiting = [];

var p2 = 0;
var p1 = 0;

var gamecontinue = false;
var p1energy = 0;
var p2energy = 0;

var alive1 = true;
var alive2 = true;

function startGame() {
    round++;
        player1.send(JSON.stringify({
            round: 'round ' + round
        }));
        player1.send(JSON.stringify({
            chargeyihao: 'charge ' + p1energy
        }));
        player2.send(JSON.stringify({
            round: 'round ' + round
        }));
        player2.send(JSON.stringify({
            chargeyihao: 'charge ' + p1energy
        }));
    gamecontinue = false;
    player1.on('message', function(message) {
        p1 = parseInt(JSON.parse(message).value);
    });
    player2.on('message', function(message) {
        p2 = parseInt(JSON.parse(message).value);
    });
    setTimeout(function() {
        var temp = p1;
        if (p1 == 15) {
            p1 = 0;
        }else if (p1 == 16) {
            p1 = 1;
        }
        p1energy -= p1;
        p1 = temp;
        if (p1energy < 0) {
            alive1 = false;
        }
        temp = p2;
        if (p2 == 15) {
            p2 = 0;
        }else if (p2 == 16) {
            p2 = 1;
        }
        p2energy -= p2;
        p2 = temp;
        if (p2energy < 0) {
            alive2 = false;
        }
        console.log(p1energy);
        console.log(p2energy);
        if (p1 == 6 && p2 != 15) {
            alive2 = false;
        }
        else if (p2 == 6 && p1 != 16) {
            alive1 = false;
        }
        else if (p1 == 15 || p1 == 16) {
            p1 = p2;
        }
        else if (p2 == 15 || p2 == 16) {
            p2 = p1;
        }
        else if (p1 > p2) {
            alive2 = false;
        }
        else if (p2 > p1) {
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
        if (gamecontinue) {
            startGame();
        }
    }, 8000);
}

var round = 0;
wss.on('connection', function(ws) {
    if (player1 == null) {
        player1 = ws;
        ws.send(JSON.stringify({
            player: 'Player 1'
        }));
    }
    else if (player2 == null) {
        player2 = ws;
        ws.send(JSON.stringify({
            player: 'Player 2'
        }));
    }
    if (player1 && player2) {
        startGame();
    }
});
