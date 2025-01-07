/**
 * Editor Client
 */

Ext.define('OA.client.Editor', {
    alias: 'client.Editor',
    singleton: true,
    requires: ['OA.common.UrlMgr', 'OA.model.Editor'],

    /**
     * 執行模型 ， 異步返回 callback
     *
     * @param {String} options
     * @param {Function} callback
     */
    load: function (options, callback) {
        var me = this;
        var url = OA.common.UrlMgr.restUrl('editor', 'getData');
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
            jsonData: options,
            success: function (response) {
                Ext.Viewport.setMasked(false);
                var loginResponse = me.doSuccess(response.responseText);
                Ext.callback(callback(loginResponse));
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
    },

    doSuccess: function (responseText) {
        var loginResponse = Ext.JSON.decode(responseText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        
        OA.common.Global.setCurrentUser(loginResponse.data.user);
        OA.common.UrlMgr.setToken('debug');
        OA.common.Global.setIsMgr(loginResponse.data.isMgr);
        OA.common.Global.setVerifyConfig(loginResponse.data.verifyconfig || {});
        OA.common.Global.setQueryDefault(loginResponse.data.交換資訊);
        OA.common.Global.setCurrentRole(loginResponse.data.role);
        //OA.common.Global.setFollowPdfUrl(loginResponse.data['來文PDF']);
        OA.common.Global.setFollowPdfUrl(loginResponse.data.來文PDF);
        
        loginResponse.data.dept.orgNo = loginResponse.data.dept.orgNo || loginResponse.data.user.orgNo || '0000000000';
        OA.common.Global.setCurrentDept(loginResponse.data.dept);

        Ext.apply(OA.common.Global.getVerifyConfig(), {hasSealArea: false});  //簽核時關閉核章區
        Ext.getStore('SendWay').doInit(); //傳送方式

        var r = Ext.create('OA.model.DocFlow', loginResponse.data.docflow);
        OA.common.Global.setCurrentDocFlowRecord(r);
        return loginResponse.data;
    },

    excute: function (callback) {
        var me = this;
        var action = OA.common.Paper.getActiveStatus();
        var modelName = me.getCurrentModelName();

        var paras = OA.common.InitParas.doWK({ action: action });

        var url = '';
        if (action === 'create' || action === 'add' || action === 'delete')
            url = OA.common.UrlMgr.restUrl('wk', action);
        else
            url = OA.common.UrlMgr.restUrl('wk', 'save'); //saved , edit

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
                'Content-Type': 'application/json'
            },
            params: {
                token: OA.common.UrlMgr.getToken()
            },
            jsonData: paras,
            success: function (response) {
                if (action !== 'saved') OA.common.Global.setRefreshDocflow(response);
                OA.common.Paper.setActiveStatus('saved');
                Ext.Viewport.setMasked(false);

                if (callback) {
                    callback();
                } else {
                    Ext.Msg.alert('完成!');
                }
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
    },

    loadSealSvg: function (model, callback) {
        if (typeof require !== 'undefined') {
            var fs = require('fs');
            var path = require('path');
            var url = path.join(__dirname, '../' + model);
            var str = fs.readFileSync(url, 'utf8');
            if (callback) callback(str);
        } else {
            Ext.Ajax.request({
                url: model,
                withCredentials: true,
                useDefaultXhrHeader: false,
                success: function (response) {
                    if (callback) callback(response.responseText);
                }
            });
        }
    },

    loadDraft: function (options, callback) {
        var url = OA.common.UrlMgr.restUrl('editor', 'getDraft');
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
            jsonData: options,
            success: function (response) {
                Ext.Viewport.setMasked(false);
                var responseData = Ext.JSON.decode(response.responseText);
                Ext.callback(callback(null, responseData));
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
    },
});
