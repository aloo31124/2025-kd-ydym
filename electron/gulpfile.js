'use strict';

var gulp = require('gulp');
var gls = require('gulp-live-server');
var config = require('./config');

var electron = require('electron-connect').server.create({
    //verbose: true
});

electron.on('svc-request', function (data) {
    electron.broadcast('inputParas', data);
});
electron.on('svc-response', function (data) {
    electron.broadcast('outParas', data);
});

gulp.task('serve', function () {
    electron.start(function () {
        console.log('electron.start...');
    });
    var server = gls.new('nodeSvc.js');
    server.start();
    gulp.watch('nodeSvc.js', function () {
        server.start.bind(server)();
        console.log('nodeSvc start...');
    });
    // Restart browser process
    gulp.watch('main.js', electron.restart);
    // Reload renderer process
    // gulp.watch(['index.html', 'electron.html'], electron.reload);
});

gulp.task('svc', function () {
    var server = gls.new('server.js');
    server.start();
    gulp.watch('server.js', function () {
        server.start.bind(server)();
        console.log('express server start...');
    });
});

gulp.task('socket', function () {
    var server = gls.new('socketSvc.js');
    server.start();
    gulp.watch('socketSvc.js', function () {
        server.start.bind(server)();
        console.log('socketSvc server start...');
    });
});

gulp.task('reload:browser', function () {
    // Restart main process
    electron.restart();
});

gulp.task('reload:renderer', function () {
    // Reload renderer process
    electron.reload();
});

gulp.task('default', ['serve']);
