console.log("app.js loaded");
document.addEventListener('DOMContentLoaded', function() {
    fetch('/getdata').then(res => res.json()).then(data => {
        console.log(data);
        document.getElementById('Wins').innerHTML=data.win;
        document.getElementById('Draws').innerHTML=data.draw;
        document.getElementById('Losses').innerHTML=data.loss;
    });
}, false);