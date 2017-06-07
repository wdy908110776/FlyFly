var host = document.location.host.replace(/:.*/, '');
var ws = null; 
var gameStarted = false;
var bubbleTrack = document.querySelector('.bubble-track');
var self = null;
var selfc = 0, oppc = 0, chargeerhao, chargesanhao, da, opda;






 
function showMenu() {
    document.querySelector('.menu').style.display = 'block';
}

function hideMenu() {
    document.querySelector('.menu').style.display = 'none';
}

function socketSend(message) {
    if (ws && ws.readyState == 1) {
        ws.send(message);
    }
}

function socketOnOpen() {
    hideMenu();
}


function socketOnError(error) {
    alert('Error Occurred');
    showMenu();
}

function socketOnMessage(event) {
    
    console.log(event.data);
    var data = JSON.parse(event.data);
    if (data.player) {
        document.querySelector('#player-name').innerHTML = data.player + '(you)';
        document.querySelector('#opponent-name').innerHTML = 'opponent';
    }
    if (data.round) {
        document.querySelector('#round').innerHTML = 'Round' + data.round + '\n';
    }
    if (data.chargeyihao != undefined) {
        document.querySelector('#chargeyihao').innerHTML = 'Charge: ' + data.chargeyihao;
    }
    if (data.opponentmove && self) {
        var player= document.querySelector('.player');
        var opponent= document.querySelector('.opponent');
        if (self != 'charge' && self != 'normal' && self != 'super') {
            addBubble(self);
        }
        console.log(data.opponentmove.name);
        if (data.opponentmove.name != 'charge' && data.opponentmove.name != 'super' && data.opponentmove.name != 'normal' ) {
            addOpponentBubble(data.opponentmove.name);
        }
        chargeerhao = data.selfchoice;
        chargesanhao = data.opponentmove.value;
        if(chargeerhao > 6) {
            chargeerhao -= 7;
        }
        if(chargesanhao > 6) {
            chargesanhao -= 7;
        }
        oppc -= chargesanhao;
        selfc -= chargeerhao;
        opda = 0.2*(oppc) + 1;
        da = 0.2*(selfc) + 1;
        player.style.transform = 'scale('+ da +')';
        opponent.style.transform = 'scale('+ opda +')';
    }
    var countdown = document.querySelector('#countdown');
    if (data.tie) {
        setTimeout(function() {
            countdown.innerHTML = 'IT\'S A TIE';
            endGame();
        }, 5000)
    }
    else if (data.win === true) {
        setTimeout(function() {
            countdown.innerHTML = 'YOU WIN!';
            endGame();
        }, 5000);
    }
    else if (data.win === false) {
        setTimeout(function() {
            countdown.innerHTML = 'YOU LOSE';
            endGame();
        }, 5000)
    }
    
    function addBubble(a) { 
    var bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.classList.add(a);
    bubble.classList.add('rtl');
    bubble.innerHTML = a;
    bubbleTrack.appendChild(bubble); 
    if(data.selfchoice<=data.opponentmove.value){
        setTimeout(function() { bubbleTrack.removeChild(bubble); }, 2500);
        
    }else{
        setTimeout(function() { bubbleTrack.removeChild(bubble); }, 5000);
    }
}



function addOpponentBubble(a) { 
    var bubble1 = document.createElement('div');
    bubble1.classList.add('bubble');
    bubble1.classList.add(a);
    bubble1.classList.add('ltr');
    bubble1.innerHTML = a;
    bubbleTrack.appendChild(bubble1); 
    
    if(data.opponentmove.value>=data.selfchoice){
        setTimeout(function() { bubbleTrack.removeChild(bubble1); }, 2500);
    }else{
        setTimeout(function() { bubbleTrack.removeChild(bubble1); }, 5000);
    }
}

    
    
    
    
    
}







function endGame() {
   if (ws != null) {
       ws.close();
       ws = null;
   } 
   showMenu();
}

function startGame() {
   endGame();
   
   document.querySelector('#countdown').innerHTML = '';
   document.querySelector('#chargeyihao').innerHTML = '';
//   document.querySelector('#bubbleimg').innerHTML = '';
//   document.querySelector('#shield').innerHTML = '';
   
   ws = new WebSocket('wss://' + host);
   ws.onopen = socketOnOpen;
   ws.onerror = socketOnError;
   ws.onmessage = socketOnMessage;
   ws.onclose = function() {};
   
   console.log('wss://' + host);
   console.log(ws);
}

window.onbeforeunload = function() {
    endGame();
};

document.querySelector('#start').addEventListener('click', startGame);


document.querySelector('#charge').onclick = function() {
    socketSend(JSON.stringify({
        value: -1,
        name:'charge'
    }));
    self = 'charge';
}
document.querySelector('#bubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 1,
        name:'bubble'
    }));
    self = 'bubble';
}
document.querySelector('#copperbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 2,
        name:'copper'
    }));
    self = 'copper';
}
document.querySelector('#ironbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 3,
        name:'iron'
    }));
    self = 'iron';
}
document.querySelector('#goldbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 4,
        name:'gold'
    }));
    self = 'gold';
}
document.querySelector('#crystalbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 5,
        name:'crystal'
    }));
    self = 'crystall';
}
document.querySelector('#diamondbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 6,
        name:'diamond'
    }));
    self = 'diamond';
}
document.querySelector('#normal').onclick = function() {
    socketSend(JSON.stringify({
        value: 7,
        name:'normal'
    }));
    self = 'normal';
}
document.querySelector('#super').onclick = function() {
    socketSend(JSON.stringify({
        value: 8,
        name:'super'
    }));
    self = 'super';
}
// var player= document.querySelector('.player');
        // var opponent= document.querySelector('.opponent');
        
        // var da = 0.2*(data.chargeyihao) + 1;
        // if (self == 'charge') {
        //     player.style.transform = 'scale(' + da + ')';
        // }else {
        //     player.style.transform = 'scale(' + Math.Pow(da,data.selfchoice) + ')';
        // }
        
        // var opda = 0.2*(data.opponentchargeyihao) + 1;
        // if (data.opponentmove == 'charge') {
        //     opponent.style.transform = 'scale(' + opda + ')';
        // }else {
        //     opponent.style.transform = 'scale(' + Math.Pow(opda,data.opponentvalue) + ')';
        // }