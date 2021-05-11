const http = require('express');
var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data.db');

const app = http();

app.use(http.urlencoded({extended: true}));
app.use(http.json());

app.post('/win',(req,res)=>{
    console.log("vyhra");
    res.redirect('./');
});

app.post('/draw',(req,res)=>{
    console.log("remiza");
    res.redirect('./');
});

app.post('/loss',(req,res)=>{
    console.log("prohra");
    res.redirect('./');
});

app.post('/test',(req,res)=>{
    console.log("test");
    res.redirect('./');
});

app.post('/init',(req,res)=>{
    console.log("init");
    db.serialize(()=>{
        db.run('CREATE TABLE data (win_count INT, draw_count INT, loss_count INT)');
    });
    res.redirect('./');
});

app.get('/',(req, res)=>{
    res.sendFile('./index.html', { root: path.join(__dirname, './') });
})


app.listen('80', ()=>{
    console.log("server bezi");
})