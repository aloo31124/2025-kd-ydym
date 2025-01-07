/**
 * Lzwzip Client
 */

Ext.define('OA.client.Lzwzip', {
    alias: 'client.Lzwzip',
    singleton: true,
    requires: ['OA.common.UrlMgr', 'OA.model.Lzwzip'],
    /**
     * 執行模型 ， 異步返回 callback
     *
     * @param {String} options
     * @param {Function} callback
     */
    excute: function (options, callback) {
        var me = this;
        var client = Ext.create('OA.model.Lzwzip', options);
        var methodId = options.action;

        // var url ='http://172.16.30.36:8080/tcqb_odf/rest/lzwzip/' + methodId;
        // var url ='http://172.16.30.153:8080/tcqb/rest/lzwzip/' + methodId;
        // client.getProxy().setUrl(url);
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('lzwzip', methodId));
        client.getProxy().setExtraParams({token: OA.common.UrlMgr.getToken()});
        //Post lzwzip/getZipCode32/  inputLzwzip
        client.save({
            success: function (record, operation) {
                var resp = Ext.JSON.decode(operation.getResponse().responseText);
                console.log(resp);
                if (resp) {
                    if (callback) Ext.callback(callback(resp));
                }
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

                Ext.Viewport.setMasked(false);

                if (callback) {
                    Ext.callback(callback(""));

                }
            }
        });
    },
    Addresszip: function (zipCode, callback) {
        var client = Ext.create('OA.model.Addresszip');
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('addresszip', zipCode));
        client.getProxy().setExtraParams({ token: OA.common.UrlMgr.getToken() });
        //Post lzwzip/getZipCode32/  inputLzwzip
        client.save({
            success: function (record, operation) {
                var resp = Ext.JSON.decode(operation.getResponse().responseText);
                if (resp) {
                    if (callback) Ext.callback(callback(resp));
                }
            }, failure: function (record, operation) {
                var resp = Ext.JSON.decode(operation.getResponse().responseText);
                if (resp) {
                    if (callback) Ext.callback(callback(resp));
                }
            }
        });
    },
    batchExcute: function (options, callback) {
        var me = this;
        var client = Ext.create('OA.model.Lzwzip', options);
        var methodId = options.action;

        // var url ='http://172.16.30.36:8080/tcqb_odf/rest/lzwzip/' + methodId;
        // var url ='http://172.16.30.153:8080/tcqb/rest/lzwzip/' + methodId;
        // client.getProxy().setUrl(url);
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('lzwzip', methodId));
        client.getProxy().setExtraParams({ token: OA.common.UrlMgr.getToken() });
        //Post lzwzip/getZipCode32/  inputLzwzip
        client.save({
            success: function (record, operation) {
                var resp = Ext.JSON.decode(operation.getResponse().responseText);
                if (resp) {
                    if (callback) Ext.callback(callback(resp));
                }
            },
            failure: function (record, operation) {
                Ext.Viewport.setMasked(false);
                //var message = '';
                //if (operation.getResponse() == null) {
                //    message = '未正確連線!請檢查網路!';
                //} else {
                //    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                //    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                //}
                //Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });

                //Ext.Viewport.setMasked(false);

                if (callback) {
                    Ext.callback(callback('err'));
                }
            }
        });
    }
});