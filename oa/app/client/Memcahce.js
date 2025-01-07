/**
 * Memcahce Client
 */

Ext.define('OA.client.Memcahce', {
    alias: 'client.Memcahce',
    singleton: true,
    requires: [
        'OA.model.Memcahce', 'OA.common.UrlMgr'
    ],
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    /**
     * 登入 ， 異步返回 callback
     *
     * @param {Object} record
     * @param {Function} callback
     */
    load: function (record, callback) {
        var doSno = record.get('doSno');
        var client = Ext.create('OA.model.Memcahce');
        var qs = OA.common.Global.getQ();

        var params = {token: OA.common.UrlMgr.getToken()};
        if (qs.reOt) params.reOt = qs.reOt;
        params.app = qs.app;
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('checkMemcache', doSno));
        client.getProxy().setExtraParams(params);
        client.save({
            success: function (record, operation) {
                Ext.Viewport.setMasked(false);
                var loginResponse = Ext.JSON.decode(operation.getResponse().responseText);
                //載入核章欄SVG
                var sealModel = '';
                me.loadSealSvg('web/gSeal1.svg', function (sealXml) {
                    if (sealXml) {
                        OA.common.DIMgr.setSealXml(sealXml);
                    }
                    Ext.callback(callback(loginResponse, record));
                });

            },
            failure: function (record, operation) {
                Ext.callback(callback({ isExist: false }));
                //Ext.Viewport.setMasked(false);
                //var message = '';
                //if (operation.getResponse() == null) {
                //    message = '未正確連線!請檢查網路!';
                //} else {
                //    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                //    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                //}
                //Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });

                // Ext.callback(callback(null, record));
            }
        });
    },
    clear: function (record, callback) {
        var doSno = record.get('doSno');
        var client = Ext.create('OA.model.Memcahce');
        var qs = OA.common.Global.getQ();

        var params = { token: OA.common.UrlMgr.getToken() };
        if (qs.reOt) params.reOt = qs.reOt;
        params.app = qs.app;
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('clearMemcache', doSno));
        client.getProxy().setExtraParams(params);
        client.save({
            success: function (record, operation) {
                Ext.Viewport.setMasked(false);
                var loginResponse = Ext.JSON.decode(operation.getResponse().responseText);
                Ext.callback(callback(loginResponse));
            },
            failure: function (record, operation) {
                Ext.callback(callback({ isExist: false }));
                //Ext.Viewport.setMasked(false);
                //var message = '';
                //if (operation.getResponse() == null) {
                //    message = '未正確連線!請檢查網路!';
                //} else {
                //    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                //    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                //}
                //Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });

                // Ext.callback(callback(null, record));
            }
        });
    }
});