/**
 * SignFlag Client
 */

Ext.define('OA.client.SignFlag', {
    alias: 'client.SignFlag',
    singleton: true,
    requires: [
        'OA.model.SignFlag', 'OA.common.UrlMgr'
    ],
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    /**
     * 登入 ， 異步返回 callback
     *
     * @param {Object} paras
     * @param {Function} callback
     */
    load: function (paras, callback) {
        var client = Ext.create('OA.model.SignFlag', paras);
        var qs = OA.common.Global.getQ();

        var params = { token: OA.common.UrlMgr.getToken() };
        if (qs.reOt) params.reOt = qs.reOt;
        params.app = qs.app;

        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('getSignFlag'));
        client.getProxy().setExtraParams(params);
        client.save({//POST /getSignFlag/   InitParas
            success: function (record, operation) {
                var loginResponse = Ext.JSON.decode(operation.getResponse().responseText);
                Ext.callback(callback(loginResponse));
            },
            failure: function (record, operation) {               
                var message = '';
                if (operation.getResponse() == null) {
                    message = '未正確連線!請檢查網路!';
                    Ext.Viewport.setMasked(false);
                } else {
                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                    if (faliureResponse.success == false) {
                        Ext.callback(callback(faliureResponse));
                        return;
                    }                    
                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                }
                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                Ext.Viewport.setMasked(false);
            }
        });
    }
});