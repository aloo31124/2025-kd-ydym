/**
 * DocTempContent Client
 */

Ext.define('OA.client.DocTempContent', {
    alias: 'client.DocTempContent',
    singleton: true,
    requires: [
        'OA.model.DocTempContent', 'OA.common.UrlMgr'
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
    load: function (fileName, callback) {
        //console.log('this');
        /* 
        var input = {};
        var qs = OA.common.Global.getQ();
        Ext.apply(input, OA.common.Global.getSourceUser());
        Ext.apply(input, qs);

        OA.common.Global.setInitParas(input);
        if (input.parallelWin) OA.common.Global.setParallelWin(input.parallelWin);
         */
        var paras = OA.common.Global.getInitParas();
        paras.docTempName = fileName;

        
        var url = OA.common.UrlMgr.restUrl('editor', 'getDocTempContent');
        var token = OA.common.UrlMgr.getToken();
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });
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
                Ext.callback(callback(responseData.data.di));
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