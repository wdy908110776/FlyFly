var host = document.location.host.replace(/:.*/, '');
var ws = new WebSocket('wss://' + host);
console.log('wss://' + host);
console.log(ws);
ws.onopen = function() {
    console.log('open', arguments);
}
ws.onerror = function() {
    console.log('error', arguments);
}
ws.onmessage = function(event) {
    console.log(event.data);
    var data = JSON.parse(event.data);
    if (data.player) {
        document.querySelector('#player').innerHTML = data.player;
    }
    if (data.round) {
        document.querySelector('#round').innerHTML = 'Round' + data.round;
    }
    if (data.chargeyihao) {
        document.querySelector('#chargeyihao').innerHTML = 'Charge' + data.chargeyihao;
    }
    var countdown = document.querySelector('#countdown');
    if (data.start) {
        setTimeout(function() {
            countdown.innerHTML = 'Pao'
        }, 1000);
        setTimeout(function() {
            countdown.innerHTML = 'Pao'
        }, 3000);
        setTimeout(function() {
            countdown.innerHTML = 'Yun'
        }, 5000);
    }
    if (data.tie) {
        countdown.innerHTML = 'IT\'S A TIE';
    }
    else if (data.win === true) {
        countdown.innerHTML = 'YOU WIN!';
    }
    else if (data.win === false) {
        countdown.innerHTML = 'YOU LOSE';
    }
}
document.querySelector('#charge').onclick = function() {
    ws.send(JSON.stringify({
        value: -1
    }));
}
document.querySelector('#bubble').onclick = function() {
    ws.send(JSON.stringify({
        value: 1
    }));
}
document.querySelector('#copperbubble').onclick = function() {
    ws.send(JSON.stringify({
        value: 2
    }));
}
document.querySelector('#ironbubble').onclick = function() {
    ws.send(JSON.stringify({
        value: 3
    }));
}
document.querySelector('#goldbubble').onclick = function() {
    ws.send(JSON.stringify({
        value: 4
    }));
}
document.querySelector('#crystalbubble').onclick = function() {
    ws.send(JSON.stringify({
        value: 5
    }));
}
document.querySelector('#diamondbubble').onclick = function() {
    ws.send(JSON.stringify({
        value: 6
    }));
}
document.querySelector('#normal').onclick = function() {
    ws.send(JSON.stringify({
        value: 15
    }));
}
document.querySelector('#super').onclick = function() {
    ws.send(JSON.stringify({
        value: 16
    }));
}
window.onbeforeunload = function() {
    ws.onclose = function() {};
    ws.close()
};
