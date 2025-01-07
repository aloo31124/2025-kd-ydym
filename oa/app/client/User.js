/**
 * User Client
 */

Ext.define('OA.client.User', {
    alias: 'client.User',
    singleton: true,
    requires: [
        'OA.model.User', 'OA.common.UrlMgr'
    ],
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    /**
     * 登入 ， 異步返回 callback
     *
     * @param {String} username
     * @param {String} password
     * @param {Function} callback
     */
    login: function (username, password, callback) {
        var user = Ext.create('OA.model.User', {username: username, password: password});
        //'Authorization': 'Basic bXlVc2VybmFtZTpteVBhc3N3b3Jk'
        //user.getProxy().setHeaders({'Authorization': 'Basic bXlVc2VybmFtZTpteVBhc3N3b3Jk'});
        user.getProxy().setUrl(OA.common.UrlMgr.restUrl('user', 'login'));
        user.save(callback); //POST /user/login
    },
    logout: function (callback) {
        var user = Ext.create('OA.model.User', {username: "lagout", password: null});
        user.getProxy().setUrl(OA.common.UrlMgr.restUrl('user', 'logout'));
        user.save(callback); //POST /user/logout

    },
    ssoLogin: function (qs,_callback) {
        // Ext.Viewport.setMasked({xtype: 'loadmask', message: '登入中...'});
        Ext.data.JsonP.request({
            url: OA.common.UrlMgr.getSSO(qs.ssoToken1),
            callbackKey: 'callback',
            success: function (result) {
                // Ext.Viewport.setMasked(false);
                
                if (result && result.ssoValid == 'Y') {
                    OA.common.Global.getApp().getController('OA.controller.Login').onSignInCommand(null, result.ssoEmpNo, result.ssoPswd,false);
                    if (_callback) _callback();
                }else{
                    Ext.Msg.alert('登入失敗！','檢查帳密是否失效？',function(){
                        window.location.replace(OA.common.UrlMgr.getSSOHome());
                    });
                }
            }
        });
    }
});