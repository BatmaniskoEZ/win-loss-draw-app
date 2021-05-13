const http = require('express');
const { app, BrowserWindow, globalShortcut } = require('electron');
var path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('data.db');
const fetch = require('node-fetch');

//weird memory shit i had to put this here cuz of
require('events').EventEmitter.defaultMaxListeners = 4;

//elektron kod

function createWindow() {
    const win = new BrowserWindow({
        width: 270,
        height: 135
    })
    win.removeMenu()
    win.loadURL('http://localhost:90/index.html')
    /*win.on('resized', function () {
        var size   = win.getSize();
        var width  = size[0];
        var height = size[1];
        console.log("width: " + width);
        console.log("height: " + height);
    });*/
    win.setResizable(false);
    //console.log(__dirname);

    //listeners for shortcuts
    globalShortcut.register('CmdOrCtrl+num7', () => {
        fetch("http://localhost:90/win", { method: "POST" }).then(res => {
            //console.log("win");
        });
        win.loadURL('http://localhost:90/index.html');
    })

    globalShortcut.register('CmdOrCtrl+num8', () => {
        fetch("http://localhost:90/draw",
            {
                method: "POST",
                body: { draw: '' },
                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
            }).then((res) => {
                //console.log("draw");
            });
        win.loadURL('http://localhost:90/index.html');
    })

    globalShortcut.register('CmdOrCtrl+num9', () => {
        fetch("http://localhost:90/loss", { method: "POST" }).then((res) => {
            //console.log("loss");
        });
        win.loadURL('http://localhost:90/index.html');
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//kod pro express post/get
const expressApp = http();

expressApp.use(http.urlencoded({ extended: true }));
expressApp.use(http.json());
expressApp.use(http.static(__dirname));

expressApp.post('/reset', (req, res) => {
    //console.log("reset");
    db.serialize(() => {
        db.run('UPDATE stats SET win_count = 0 WHERE id = 1');
        db.run('UPDATE stats SET draw_count = 0 WHERE id = 1');
        db.run('UPDATE stats SET loss_count = 0 WHERE id = 1');
    });
    res.redirect('./');
});

expressApp.post('/win', (req, res) => {
    //console.log("vyhra");
    //console.log(req.body);
    db.serialize(() => {
        db.run('UPDATE stats SET win_count = win_count+1 WHERE id = 1');
    });
    res.redirect('./');
});

expressApp.post('/draw', (req, res) => {
    //console.log("remiza");
    db.serialize(() => {
        db.run('UPDATE stats SET draw_count = draw_count+1 WHERE id = 1');
    });
    res.redirect('./');
});

expressApp.post('/loss', (req, res) => {
    //console.log("prohra");
    db.serialize(() => {
        db.run('UPDATE stats SET loss_count = loss_count+1 WHERE id = 1');
    });
    res.redirect('./');
});

expressApp.post('/init', (req, res) => {
    if (fs.existsSync("data.db") && fs.existsSync("db-created.nothing")) {
        //console.log("init_prepared_already");
        res.redirect('./');
    } else {
        //console.log("init");
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

expressApp.get('/getdata', (req, res) => {
    if (!fs.existsSync("db-created.nothing")) {
        res.send({ win: 0, draw: 0, loss: 0 });
        fetch('http://localhost:90/init', { method: 'POST' });
    } else {
        db.serialize(() => {
            db.get('SELECT * FROM stats WHERE id = 1', (err, row) => {
                //console.log(row);
                res.send({ win: row.win_count, draw: row.draw_count, loss: row.loss_count });
            }).on("error", () => {
                console.log("db error");
            });
        });
    }
    //res.send({win: 0, draw: 0, loss: 0});
})


expressApp.listen('90', () => {
    //console.log("server bezi");
})