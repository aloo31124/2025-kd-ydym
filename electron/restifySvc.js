'use strict';

var restify = require('restify');
var fs = require('fs');
var p = require('path');

var server = restify.createServer({
    name: 'restService',
    version: '1.0.0'
});

//server.use(restify.fullResponse());
server.use(restify.queryParser());
server.use(restify.bodyParser());
//server.use(restify.acceptParser(server.acceptable));
server.use(restify.CORS());

var client = require('electron-connect').client.create();

//server.opts(/.*/, function (req, res, next) {
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
//    res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
//    res.header('Access-Control-Allow-Credentials', true);
//    res.send(200);
//    return next();
//});

server.post('/pdf/:doSno', function create(req, res, next) {
    try {
        //res.header('Access-Control-Allow-Credentials', true);
        //res.header('Content-Type', 'application/json');

        //var b = new Buffer('SmF2YVNjcmlwdA==', 'base64')
        //var s = b.toString();

        //console.log(res.req.headers);
        client.sendMessage('svc-request', JSON.parse(req.params.data));
        client.on('outParas', function (ret) {
            res.send(ret, {
                'content-type': 'application/json'
            });
            return next();

            //return next();

            //res.setHeader('Content-Type', 'application/pdf');
            //res.writeHead(200);
            //res.end(ret.content.data);
        });
        
        //res.send(data);

    }
    catch (e) {
        console.log(e.name + ':' + e.message);
        res.send({success: true, message: e.message});
        return next();
    }


    //res.header('Access-Control-Allow-Credentials', true);
    //res.setHeader('Content-Type', 'application/json');
    //res.send({success: true});
    //
    //next();
});

//server.get('/pdf/:filename', function (req, res, next) {
//
//
//    var fn = p.join('/Users/apple/Downloads/', req.params.filename);
//    if (fs.existsSync(fn)) {
//
//
//        var data = fs.readFileSync(fn);
//        //res.writeHead(200);
//        return res.end(data, {
//            'Content-Type': 'application/pdf'
//        });
//
//        //fs.readFile(fn, function (err, data) {
//        //
//        //    //res.setHeader('Content-Type', 'application/pdf');
//        //    //res.header('Content-Type', 'application/pdf');
//        //    //res.writeHead(200);
//        //    //res.write(data);
//        //    //return res.end();
//        //    //res.end(data,{
//        //    //    'Content-Type': 'application/pdf'
//        //    //});
//
//        //
//        //});
//
//    } else {
//        var msg = 'file not found :' + fn;
//        return res.send(msg);
//    }
//
//});