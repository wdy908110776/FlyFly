'use strict';

var GamePlayer = require('./gamePlayer');

class GameSession {
    constructor() {
        this.isGameStarted = false;
        this.numberOfPlayers = 0;
        this.players = [];
    }
    startGame() {
        this.round = 1;
        this.isGameStarted = true;
        for (var p of this.players) {
            p.energy = 0;
        }
    }
    updatePlayers() {
        for (var p of this.players) {
            p.sendMessage({
                round: this.round,
                chargeyihao: p.energy
            })
        }
    }
    onPlayerMove(player) {
        var everyoneMoved = true;
        for (var p of this.players) {
            if (p.didMove() == false) {
                everyoneMoved = false;
                break;
            }
        }
        if (everyoneMoved) {
            this.decide();
        }
    }
    addPlayer(player) {
        if (this.players.length < 2 && this.isGameStarted == false) {
            this.players.push(player);
            this.numberOfPlayers = this.players.length;
            
            player.onMove = this.onPlayerMove.bind(this);
            player.sendMessage({ player: 'Player ' + this.numberOfPlayers });
        }
        if (this.numberOfPlayers == 2) {
            this.startGame();
        }
    }

    decide() {
        
        var p1 = this.players[0];
        var p2 = this.players[1];

        var p1choice = p1.choice;
        var p2choice = p2.choice;
        
        var p1energy = p1.energy;
        var p2energy = p2.energy;
        
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
            p1choice = -2;
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
            p2choice = -2;
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
        console.log('1' + alive1);
        console.log('2' + alive2);
        
        p1.choice = null;
        p2.choice = null;
        p1.energy = p1energy;
        p2.energy = p1energy;

        if (alive1 && alive2) {
            this.round++;
            this.updatePlayers();
        } else if (!alive1) {
            p1.sendMessage({ win: false });
            p2.sendMessage({ win: true });
        } else if (!alive2) {
            p1.sendMessage({ win: true });
            p2.sendMessage({ win: false });
        } else if (!alive1 && !alive2) {
            p1.sendMessage({ tie: true });
            p2.sendMessage({ tie: false });
        }
    }
}

exports = module.exports = GameSession;