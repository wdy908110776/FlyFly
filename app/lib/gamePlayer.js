'use strict';

class GamePlayer {
    constructor(socket) {
        this.index = 0;
        this.choice = null;
        this.energy = null;
        this.socket = socket;
        this.socket.on('close', this.onSocketClose.bind(this));
        this.socket.on('message', this.onSocketMessage.bind(this));
        this.onMove = function(){};
    }
    didMove() {
        return this.choice != null;
    }
    sendMessage(message) {
        if (this.socket && this.socket.readyState == 1) {
            this.socket.send(JSON.stringify(message));
        } 
    }
    onSocketMessage(message) {
        console.log('Player 1 Message', message);
        this.choice = parseInt(JSON.parse(message).value);
        this.onMove(this);
    }
    onSocketClose() {
        console.log('Player 1 Disconnected');
        // player1 = null;
        // gameStarted = false;
    }
}

exports = module.exports = GamePlayer;