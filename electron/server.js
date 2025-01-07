var express = require('express');
var path = require('path');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/doPostMsg', function (req, res) {
    var filePath =path.join(__dirname,'public/index.html');
    res.sendfile(filePath);
});
app.listen(16888, function () {
    console.log('Example app listening on port 16888');
});
