/**
 * Print Client
 */

Ext.define('OA.client.Print', {
    alias: 'client.Print',
    singleton: true,
    requires: [
        'OA.common.UrlMgr', 'OA.model.Print'
    ],
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    /**
     */
    exportPDF: function (options, callback) {
        var me = this;

        var client = Ext.create('OA.model.Print', {printData: Ext.JSON.encode(options.printData)});
        if (!client) {
            if (callback) Ext.callback(callback(null));
            return;
        }

        // Post svg/donload/  InitParas
        // client.getProxy().setUrl(OA.common.UrlMgr.restUrl('svg', 'download'));
        // client.getProxy().setExtraParams({token: OA.common.UrlMgr.getToken()});
        // client.save({
        //     success: function (record, operation) {
        //         var resp =Ext.JSON.decode(operation.getResponse().responseText);
        //         var byteArray = new Uint8Array(resp.content.data);
        //         var blob = new Blob([byteArray], {type: "application/pdf"});
        //         saveAs(blob, resp.name);
        //
        //         if (callback) callback();
        //     },
        //     failure: function (record, operation) {
        //         //console.log(operation);
        //         if (operation.getResponse()) {
        //             var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
        //             Ext.Msg.alert('ERROR', faliureResponse.message + '(' + faliureResponse.code + ')');
        //         }
        //         if (callback) Ext.callback(callback(null, record));
        //     }
        // });

        // var socket = io.connect('http://localhost:8081');
        // var socket = io.connect('http://172.16.55.15:8081');
        var socket = io.connect('http://172.16.30.149:8081');
        socket.on('connect', function () {
            socket.emit('doPdf', options.printData, function (ret) {
                var byteArray = new Uint8Array(ret.content.data);
                var blob = new Blob([byteArray], {type: "application/pdf"});
                saveAs(blob, ret.name);
                if (callback) callback();
            });
        });
    }
});

//by window open
//window.initPreviewParas = this.getCpaper().getCreateParas();
//window.initPreviewParas = {};
//window.initPreviewParas.printData = options.printData;
//window.getInitPreviewParas = function () {
//    return window.initPreviewParas;
//};
//window.open('./index.html?app=preview&by=data&toolbar=n', "", '');
//var n = '../oa/index.html?app=preview&by=svc&orgNo=376530000A&doDeptno=0000&doSno=10500000900&paperNo=1&version=6710718642&documentType=%E5%87%BD&token=debug&print=y';


//by ajax
//Ext.Viewport.setMasked({xtype: 'loadmask', message: '處理中...'});
//Ext.Ajax.request({
//    url: 'http://localhost:8081/pdf/download',
//    method: 'POST',
//    useDefaultXhrHeader: false,
//    //withCredentials: true,
//    //responseType : 'blob',
//    params :{'data':Ext.JSON.encode(options.printData)},
//    success: function(response, opts) {
//        Ext.Viewport.setMasked(false);
//
//        var obj = Ext.decode(response.responseText);
//        var url ='http://localhost:8081/pdf/' + obj.name;
//        //window.open(url, "", "_blank");
//
//        //var blob = new Blob([response.responseBytes], {type: "application/pdf"});
//        //saveAs(blob, "test.pdf");
//    },
//    failure: function(response, opts) {
//        Ext.Viewport.setMasked(false);
//        console.log('server-side failure with status code ' + response.status);
//    }
//});