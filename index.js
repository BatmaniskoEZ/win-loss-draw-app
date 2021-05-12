const http = require('express');
const { app, BrowserWindow } = require('electron')
var path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose(); //https://www.sqlitetutorial.net/sqlite-update/
let db = new sqlite3.Database('data.db');

//kod pro express post/get
const expressApp = http();

expressApp.use(http.urlencoded({ extended: true }));
expressApp.use(http.json());
expressApp.use(http.static(__dirname));

expressApp.post('/reset', (req, res) => {
    console.log("reset");
    db.serialize(()=>{
        db.run('UPDATE stats SET win_count = 0 WHERE id = 1');
        db.run('UPDATE stats SET draw_count = 0 WHERE id = 1');
        db.run('UPDATE stats SET loss_count = 0 WHERE id = 1');
    });
    res.redirect('./');
});

expressApp.post('/win', (req, res) => {
    console.log("vyhra");
    db.serialize(()=>{
        db.run('UPDATE stats SET win_count = win_count+1 WHERE id = 1');
    });
    res.redirect('./');
});

expressApp.post('/draw', (req, res) => {
    console.log("remiza");
    db.serialize(()=>{
        db.run('UPDATE stats SET draw_count = draw_count+1 WHERE id = 1');
    });
    res.redirect('./');
});

expressApp.post('/loss', (req, res) => {
    console.log("prohra");
    db.serialize(()=>{
        db.run('UPDATE stats SET loss_count = loss_count+1 WHERE id = 1');
    });
    res.redirect('./');
});

expressApp.post('/init', (req, res) => {
    if (fs.existsSync("data.db") && fs.existsSync("db-created.nothing")) {
        console.log("init_prepared_already");
        res.redirect('./');
    } else {
        console.log("init");
        db.serialize(() => {
            db.run('CREATE TABLE stats (id INTEGER NOT NULL DEFAULT 1, win_count INTEGER NOT NULL DEFAULT 0, draw_count INTEGER NOT NULL DEFAULT 0, loss_count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(id));');
            db.run('INSERT INTO stats VALUES(1,0,0,0)');
        });
        try {
            fs.writeFileSync("db-created.nothing", "");
        } catch (error) {
            console.log(error);
        }

        res.redirect('./');
    }
});

expressApp.get('/', (req, res) => {
    res.sendFile('./index.html', { root: path.join(__dirname, './') });
})


expressApp.listen('80', () => {
    console.log("server bezi");
})