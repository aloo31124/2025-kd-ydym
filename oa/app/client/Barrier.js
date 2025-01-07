Ext.define('OA.client.Barrier', {
    alias: 'client.Barrier',
    singleton: true,
    requires: ['OA.common.UrlMgr'],

    /**
     * 加載數據
     * @param {String} methodId
     * @param {Object} data
     * @param {Function} callback
     */
    load: function (methodId, data, callback) {
        var url = OA.common.UrlMgr.restUrl('editor/barrier', methodId) + 
                  '?tmpcard=' + encodeURIComponent(data.tmpcard || '') + 
                  '&workflow=' + encodeURIComponent(data.workflow || '');

        this.sendRequest(url, 'POST', data, callback);
    },

    /**
     * 執行操作
     * @param {Object} options
     * @param {Function} callback
     */
    execute: function (options, callback) {
        var methodId = options.methodId;
        var url = OA.common.UrlMgr.restUrl('editor/barrier', methodId) + 
                  '?tmpcard=' + encodeURIComponent(options.tmpCard || '') + 
                  '&workflow=' + encodeURIComponent(options.workFlow || '');

        this.sendRequest(url, 'POST', options, callback, 1800000); // 設定超時時間
    },

    /**
     * 統一的請求處理
     * @param {String} url
     * @param {String} method
     * @param {Object} data
     * @param {Function} callback
     * @param {Number} timeout
     */
    sendRequest: function (url, method, data, callback, timeout = 30000) {
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });

        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
                'Content-Type': 'application/json'
            },
            params: {
                token: OA.common.UrlMgr.getToken()
            },
            jsonData: data,
            timeout: timeout,
            success: function (response) {
                Ext.Viewport.setMasked(false);
                var responseData = Ext.JSON.decode(response.responseText);
                if (callback) callback(null, responseData);
            },
            failure: function (response) {
                Ext.Viewport.setMasked(false);
                var message = '未正確連線!請檢查網路!';
                if (response.responseText) {
                    try {
                        var failureResponse = Ext.JSON.decode(response.responseText);
                        message = failureResponse.message + ' Error Code:' + failureResponse.code;
                    } catch (e) {
                        message = '未知錯誤: ' + response.responseText;
                    }
                }
                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                if (callback) callback(message, null);
            }
        });
    }
});
