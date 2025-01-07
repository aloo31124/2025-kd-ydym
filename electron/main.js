'use strict';

const fs = require('fs');
const path = require('path');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const client = require('electron-connect').client;
const ipcMain = require('electron').ipcMain;
const crypto = require("crypto");
var config = require('./config');

function createWindow() {
    var subWindow = new BrowserWindow({width: 1024, height: 1500, show: false});
    subWindow.on('unresponsive', function() {
        console.log('subWindow unresponsive!!!');
    });

    try {
        var fn = 'file://' + path.join(__dirname,config.oaPath);
        console.log('createWindow ( ' + fn + ' )');
        subWindow.loadURL(fn);
    } catch (e) {
        console.error(e.message);
    }
    return subWindow;
}

function readyWindow() {
    var isShow =config.isShowBrowserWindow;
    var mainWindow = new BrowserWindow({show: isShow});
    var connectClient = client.create(mainWindow);

    var input = null;
    var subWindow = null;
    connectClient.on('inputParas', function (data) {
        input = data;
        subWindow = createWindow();
    });

    ipcMain.on('sync-electron-inputParas', function (event, arg) {
        event.returnValue = input;
    });
    ipcMain.on('asyn-electron-printToPDF', function (event, arg) {
        var port = crypto.randomBytes(16).toString("hex");
        var fname = 'print-' + port + '.pdf';

        subWindow.webContents.on("did-finish-load", function() {
            console.log('did-finish-load...');
        });
        
        console.log('asyn-electron-printToPDF...');
        subWindow.webContents.printToPDF({
            pageSize: 'A4',
            marginsType: 1, //no margin
            printBackground: false,
            printSelectionOnly: false,
            landscape: false
        }, function (error, data) {
            if (error) throw error;

            var fnOut = (config.fnOut=='')? '' : path.join(config.fnOut, fname);
            console.log('writeFile  ' + fnOut);
            fs.writeFile(fnOut, data, function (error) {
                if (error) console.error(error);
            
                var msg = 'Write PDF ' + fname + ' successfully.';
                connectClient.sendMessage('svc-response', {success: true, message: msg, name: fname, content: data});
                console.log(msg);
                subWindow.close();
                subWindow.destroy();
            });

        });
    });
}

app.on('ready', readyWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    //if (mainWindow === null) {
    //    createWindow();
    //}
});