'use strict';

var fs = require('fs');
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
app.listen(16888);

function handler(req, res) {
    try {
        fs.readFile(__dirname + '/index.html',
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading index.html');
                }
                res.writeHead(200);
                res.end(data);
            });
    } catch (e) {
        res.status(500).send(e.message);
    }
}

io.on('connection', function (socket) {
    console.log('socket.io open connection');
    socket.on('doSign', function (data, fn) {
        console.log(data);

        io.emit('private message',{success: true, version: data.version});
    });
    //socket.on('disconnect', function () {
    //    io.emit('user disconnected');
    //});
});


