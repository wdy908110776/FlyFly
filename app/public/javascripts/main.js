var host = document.location.host.replace(/:.*/, '');
var ws = null; 
var gameStarted = false;
var bubbleTrack = document.querySelector('.bubble-track');

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
    // if (data.selftype == bubble) {
    var countdown = document.querySelector('#countdown');
    if (data.tie) {
        countdown.innerHTML = 'IT\'S A TIE';
        endGame();
    }
    else if (data.win === true) {
        countdown.innerHTML = 'YOU WIN!';
        endGame();
    }
    else if (data.win === false) {
        countdown.innerHTML = 'YOU LOSE';
        endGame();
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
   document.querySelector('#bubbleimg').innerHTML = '';
   document.querySelector('#shield').innerHTML = '';
   
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
        type:'charge'
    }));
}
document.querySelector('#bubble').onclick = function() {
    // socketSend(JSON.stringify({
    //     value: 1,
    //     type:'bubble'
    // }));
    var bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.classList.add('copper');
    bubble.classList.add('rtl');
    bubble.innerHTML = 'BUBBLE';
    bubbleTrack.appendChild(bubble);
    setTimeout(function() { bubbleTrack.removeChild(bubble); }, 10000);
}
document.querySelector('#copperbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 2,
        type:'bubble'
    }));
}
document.querySelector('#ironbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 3,
        type:'bubble'
    }));
}
document.querySelector('#goldbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 4,
        type:'bubble'
    }));
}
document.querySelector('#crystalbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 5,
        type:'bubble'
    }));
}
document.querySelector('#diamondbubble').onclick = function() {
    socketSend(JSON.stringify({
        value: 6,
        type:'bubble'
    }));
}
document.querySelector('#normal').onclick = function() {
    socketSend(JSON.stringify({
        value: 15,
        type:'shield'
    }));
}
document.querySelector('#super').onclick = function() {
    socketSend(JSON.stringify({
        value: 16,
        type:'shield'
    }));
}