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

function startGame() {
  setTimeout(function() {
    player1.send(JSON.stringify({ start: true }))
    player2.send(JSON.stringify({ start: true }))
  }, 1000);
}
app.set('view engine', 'ejs');

app.get('/', function(req,res) {
  res.render('index');
});

wss.on('connection', function(ws) {
  if (player1 == null) {
    player1 = ws;
    player1.send(JSON.stringify({ player: player1 }))
  }else if (player2 == null) {
    player2 = ws;
    player2.send(JSON.stringify({ player: player2 }))
  }
  if (player1 && player2) {
    startGame();
  }
});
server.listen(process.env.PORT, function() {
  console.log('Listening on port 8080');
});

