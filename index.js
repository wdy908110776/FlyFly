var express = require('express');
var http = require('http');
var url = require('url');
var WebSocket = require('ws');

var app = express();
var server = http.createServer(app);
var wss = new WebSocket.Server({ server });

var player1 = null;
var player2 = null;
var playersWaiting = [];

var p2 = null;
var p1 = null;

var result;
var gamecontinue=false;


function startGame() {
  setTimeout(function() {
    player1.send(JSON.stringify({ start: true}));
    player2.send(JSON.stringify({ start: true}));
  }, 1000);

  player1.on('message', function(message) {
    console.log('Player1', message);
    p1 = JSON.parse(message).choice;
  });
  player2.on('message', function(message) {
    console.log('Player2', message);
    p2 = JSON.parse(message).choice;
  });

  setTimeout(function() {
    console.log('CHECKING FOR WINNER', p1, p1);
      if (p1.value == 6 && p2.value != "==") {
        result = "p1 wins";
        return;
      }else if (p2.value == 6 && p1.value != "==") {
        result = "p2 wins";
        return;
      }else if (!p1.value/1) {
        p1.value = p2.value;
      }else if(!p2.value/1) {
        p2.value = p1.value;
      }else if (p1.value == p2.value) {
        result = "tie";
        gamecontinue=true;
      }if (p1.value>p2.value){
        result = "player1 wins";
      }else if(p2.value>p1.value){
        result = "player2 wins";
}
    // if (player1Choice == player2Choice) {
    //   player1.send(JSON.stringify({ tie: true }));
    //   player2.send(JSON.stringify({ tie: true }));
    // } else {
    //   if (player1Choice == 'ROCK' && player2Choice == 'PAPER') {
    //     player1.send(JSON.stringify({ win: false }));
    //     player2.send(JSON.stringify({ win: true }));
    //   } else if (player1Choice == 'PAPER' && player2Choice == 'ROCK') {
    //     player1.send(JSON.stringify({ win: true }));
    //     player2.send(JSON.stringify({ win: false }));
    //   } else if (player1Choice == 'ROCK' && player2Choice == 'SCISSOR') {
    //     player1.send(JSON.stringify({ win: true }));
    //     player2.send(JSON.stringify({ win: false }));
    //   } else if (player1Choice == 'SCISSOR' && player2Choice == 'ROCK') {
    //     player1.send(JSON.stringify({ win: false }));
    //     player2.send(JSON.stringify({ win: true }));
    //   } else if (player1Choice == 'PAPER' && player2Choice == 'SCISSOR') {
    //     player1.send(JSON.stringify({ win: false }));
    //     player2.send(JSON.stringify({ win: true }));
    //   } else if (player1Choice == 'SCISSOR' && player2Choice == 'PAPER') {
    //     player1.send(JSON.stringify({ win: true }));
    //     player2.send(JSON.stringify({ win: false }));
    //   }
    // }
  }, 8000);
}

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('index');
});

wss.on('connection', function(ws) {
  if (player1 == null) {
    player1 = ws;
    ws.send(JSON.stringify({ player: 'Player 1' }));
  } else if (player2 == null) {
    player2 = ws;
    ws.send(JSON.stringify({ player: 'Player 2' }));
  }
  if (player1 && player2) {
    startGame();
  }
});

server.listen(8080, function() {
  console.log('Listening on port 8080');
});
