/**
 * Odaf03Dtl Client
 */

Ext.define('OA.client.Odaf03Dtl', {
    alias: 'client.Odaf03Dtl',
    singleton: true,
    requires: [
        'OA.model.Odaf03Dtl', 'OA.common.UrlMgr'
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
        var client = Ext.create('OA.model.Odaf03Dtl', paras);
        var params = { token: OA.common.UrlMgr.getToken() };
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('getJsonChgOdaf03Dtl'));
        //console.log(params);
        client.getProxy().setExtraParams(params);
        client.save({
            success: function (record, operation) {

                Ext.callback(callback(operation.getResponse().responseText, record));
            },
            failure: function (record, operation) {
                Ext.Viewport.setMasked(false);
                var message = '';
                if (operation.getResponse() == null) {
                    message = '未正確連線!請檢查網路!';
                } else {
                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                }
                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
            }
        });
    }
});