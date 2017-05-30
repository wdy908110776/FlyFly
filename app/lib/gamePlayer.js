'use strict';
// var opponent = []; 
class GamePlayer {
    constructor(socket) {
        this.index = 0;
        this.choice = null;
        this.choicename = null;
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
        if (this.choice == null) {
            console.log('Player 1 Message', message);
            message = JSON.parse(message);
            this.choice = parseInt(message.value);
            this.choicename = message.name;
            this.onMove(this);
            // opponent.push(JSON.parse(message).name);
            // console.log(opponent);
        }
    }
    onSocketClose() {
        console.log('Player 1 Disconnected');
        // player1 = null;
        // gameStarted = false;
    }
}

exports = module.exports = GamePlayer;