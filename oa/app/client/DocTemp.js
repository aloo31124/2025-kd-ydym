/**
 * DocTemp Client
 */

Ext.define('OA.client.DocTemp', {
    alias: 'client.DocTemp',
    singleton: true,
    requires: [
        'OA.model.DocTemp', 'OA.common.UrlMgr'
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
        var url = OA.common.UrlMgr.restUrl('editor', 'getDocTemps');
        var token = OA.common.UrlMgr.getToken();
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
                'Content-Type': 'application/json'
            },
            params: {
                token: token
            },
            jsonData: paras,
            success: function (response) {
                Ext.Viewport.setMasked(false);
                var responseData = Ext.JSON.decode(response.responseText);
                Ext.callback(callback(responseData.data));
            },
            failure: function (response) {
                Ext.Viewport.setMasked(false);
                var message = '未正確連線!請檢查網路!';
                if (response.responseText) {
                    var failureResponse = Ext.JSON.decode(response.responseText);
                    message = failureResponse.message + ' Error Code:' + failureResponse.code;
                }
                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
            }
        });
    }
});