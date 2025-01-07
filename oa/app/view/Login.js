/**
 * 登入
 */
Ext.define('OA.view.Login', {
    extend: 'Ext.form.Panel',
    alias: "widget.loginview",
    requires: ['Ext.form.FieldSet', 'Ext.form.Password', 'Ext.Label', 'Ext.Img', 'Ext.util.DelayedTask'],
    config: {
        title: '登入',
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items: [
            //{
            //xtype: 'image',
            //src: Ext.Viewport.getOrientation() == 'portrait' ? 'resources/icons/icon.png' : 'resources/icons/icon.png',
            //style: Ext.Viewport.getOrientation() == 'portrait' ? 'width:80px;height:80px;margin:auto' : 'width:40px;height:40px;margin:auto'
            //},
            {
                xtype: 'label',
                html: 'Login failed. Please enter the correct credentials.',
                itemId: 'signInFailedLabel',
                hidden: true,
                hideAnimation: 'fadeOut',
                showAnimation: 'fadeIn',
                style: 'color:#990000;margin:5px 0px;'
            },
            {
                xtype: 'fieldset',
                title: '使用者登入',
                width: '40%',
                height: 140,
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: '帳號',
                        itemId: 'userNameTextField',
                        name: 'userNameTextField',
                        required: true,
                        listeners: {
                            painted: function (field, e) {

                                //擋enter submit
                                document.addEventListener("keydown", function(e){
                                    if (e.key=='Enter') e.preventDefault();
                                }, false);
                            }
                        }
                    },
                    {
                        xtype: 'passwordfield',
                        placeHolder: '密碼',
                        itemId: 'passwordTextField',
                        name: 'passwordTextField',
                        required: true
                    }
                ]
            },
            {
                xtype: 'button',
                itemId: 'logInButton',
                ui: 'action',
                width: '20%',
                padding: '10px',
                text: '登入'
            },
            {
                id: 'labVersion',
                xtype: 'label',
                style: 'color:#990000;margin:5px 0px;'
            }
        ],
        listeners: [{
            delegate: '#logInButton',
            event: 'tap',
            fn: 'onLogInButtonTap'
        }]
    },
    initialize: function () {
        var v = OA.common.Global.getQ().v;
        if (v) {
            var ctr = Ext.getCmp('labVersion');
            ctr.setHtml('v ' + v);
        }

        //自動登入
        if (KangDaAppConfig().autoLogin) this.onLogInButtonTap();
    },
    onLogInButtonTap: function () {
        var me = this,
            usernameField = me.down('#userNameTextField'),
            passwordField = me.down('#passwordTextField'),
            label = me.down('#signInFailedLabel'),
            username = usernameField.getValue(),
            password = passwordField.getValue();

        label.hide();

        var task = Ext.create('Ext.util.DelayedTask', function () {
            label.setHtml('');

            me.fireEvent('signInCommand', me, username, password);

            usernameField.setValue('');
            passwordField.setValue('');
        });

        task.delay(500);
    },
    showSignInFailedMessage: function (message) {
        var label = this.down('#signInFailedLabel');
        label.setHtml(message);
        label.show();
    }
});