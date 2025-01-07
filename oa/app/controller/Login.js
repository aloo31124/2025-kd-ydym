/**
 *   view.Login:signInCommand > controller.Login > OA.client.User.login > signInSuccess() >
 *   controller.Menu:onSelectRoleChanged > OA.client.DocFlow.load
 *
 */
Ext.define('OA.controller.Login', {
    extend: 'Ext.app.Controller',
    requires: [
        'OA.client.User'
    ],
    config: {
        refs: {
            loginView: 'loginview'
        },
        control: {
            loginView: {
                signInCommand: 'onSignInCommand'
            }
        }
    },

    // Session token
    sessionToken: null,

    // Transitions
    getSlideLeftTransition: function () {
        return {type: 'slide', direction: 'left'};
    },

    getSlideRightTransition: function () {
        return {type: 'slide', direction: 'right'};
    },

    onSignInCommand: function (view, username, password, isHash) {
        var me = this,
            loginView = me.getLoginView(), hashPwd = null;

        var check = true;
        if (KangDaAppConfig().autoLogin) {
            var ur = Ext.device.Storage.getItem('username');
            var pw = Ext.device.Storage.getItem('password');

            if (ur && pw) {
                if (ur.length > 0 && pw.length > 0) {
                    username = ur;
                    hashPwd = pw;
                    check = false;
                }
            }
        }
        if (check) {
            if (username.length === 0 || password.length === 0) {
                loginView.showSignInFailedMessage('請輸入帳號密碼');
                return;
            }

            if (isHash == false) {
                hashPwd = password;
            } else {
                var hashObj = new jsSHA(password, "TEXT");
                hashPwd = hashObj.getHash("SHA-1", "HEX");
            }
        }

        if (loginView) {
            loginView.setMasked({
                xtype: 'loadmask',
                message: '登入中  ...'
            });
        }
        OA.client.User.login(username, hashPwd, {
            success: function (record, operation) {
                Ext.device.Storage.setItem('username', username);
                Ext.device.Storage.setItem('password', hashPwd);
                var loginResponse = Ext.JSON.decode(operation.getResponse().responseText);
                if (loginResponse.success == true) {
                    OA.common.Global.setCurrentUser(loginResponse.user);
                    OA.common.UrlMgr.setToken(loginResponse.token);
                    if (loginResponse.isMgr) OA.common.Global.setIsMgr(loginResponse.isMgr);
                    OA.common.Global.setVerifyConfig(loginResponse.verifyconfig);
                    OA.common.Global.setQueryDefault(loginResponse.交換資訊);
                    me.sessionToken = loginResponse.token;

                    var qs =OA.common.Global.getQ();
                    if (qs.app === 'offline'){
                        OA.client.Localforage.setLoginInfo(loginResponse,function(){
                            Ext.device.Storage.setItem('isFirstTime', false);
                            me.getApplication().doEditorOffline(qs);
                        });
                    }else{
                        me.signInSuccess(loginResponse);
                    }
                   
                } else {
                    me.signInFailure(loginResponse.message);
                }
            },
            failure: function (record, operation) {
                var message = '';
                if (operation.getResponse() == null) {
                    message = '未正確連線!請檢查網路!';
                } else {
                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                    Ext.device.Storage.setItem('password', '');
                }

                me.sessionToken = null;
                me.signInFailure(message);
            }
        });
    },

    signInSuccess: function (respone) {
        var m = Ext.create('OA.view.Main');
        Ext.Viewport.animateActiveItem(m, this.getSlideLeftTransition());
        var roles = respone.roles;
        var depts = respone.depts;

        var sotreDept = Ext.getStore('Dept');
        sotreDept.setData(depts);
        sotreDept.sync();

        var sotreRole = Ext.getStore('Role');
        sotreRole.setData(roles);
        sotreRole.sync();

        console.log(respone);
        var selectDept = Ext.getCmp('selectDept');
        if (selectDept) selectDept.setValue(respone.user.depNo);

        this.getApplication().getController('OA.controller.Menu').uiSetting();
        this.getApplication().getController('OA.controller.Work').uiSetting();
        this.getApplication().getController('OA.controller.Approve').uiSetting();

        if (this.getLoginView()) this.getLoginView().setMasked(false);

        if (KangDaAppConfig().welcome) {
            var overlay = Ext.create('OA.view.Welcome');
            Ext.Viewport.add(overlay);
            overlay.show();
        }
    },
    signInFailure: function (message) {
        var loginView = this.getLoginView();
        if (loginView) {
            loginView.showSignInFailedMessage(message);
            loginView.setMasked(false);
        }
    }
});