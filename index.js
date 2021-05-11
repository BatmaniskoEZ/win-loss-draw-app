const http = require('express');
var path = require('path');
const fs = require('fs');
var sqlite3 = require('sqlite3').verbose(); //https://www.sqlitetutorial.net/sqlite-update/
var db = new sqlite3.Database('data.db');

const app = http();

app.use(http.urlencoded({ extended: true }));
app.use(http.json());

app.post('/win', (req, res) => {
    console.log("vyhra");
    db
    res.redirect('./');
});

app.post('/draw', (req, res) => {
    console.log("remiza");
    res.redirect('./');
});

app.post('/loss', (req, res) => {
    console.log("prohra");
    res.redirect('./');
});

app.post('/init', (req, res) => {
    if (fs.existsSync("data.db") && fs.existsSync("db-created.nothing")) {
        console.log("init_fileexists");
        res.redirect('./');
    } else {
        console.log("init");
        db.serialize(() => {
            db.run('CREATE TABLE wins (win_count INT)');
            db.run('CREATE TABLE draw (draw_count INT)');
            db.run('CREATE TABLE loss (loss_count INT)');
        });
        try {
            fs.writeFileSync("db-created.nothing", "");
        } catch (error) {
            console.log(error);
        }

        res.redirect('./');
    }
});

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: path.join(__dirname, './') });
})


app.listen('80', () => {
    console.log("server bezi");
})