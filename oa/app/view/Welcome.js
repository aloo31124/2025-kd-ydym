Ext.define('OA.view.Welcome', {
    extend: 'Ext.Panel',
    xtype: "ol",
    config: {
        cls: "welcome",
        centered: true,
        width: 600,
        height: 400,
        html: [
            //"<div class='message'>",
            //'<h2>Welcome to <em>康大資訊</em></h2>',
            //'<br/>',
            //'<p style="font-size:160%;">歡迎使用行動簽核</p></h2>',
            //"</div>"
            '<img src="resources/login.png"  height="390" width="590">'
        ].join(""),
        hidden: true,
        showAnimation: Ext.browser.is.ie || Ext.browser.is.AndroidStock ? null : {
            type: "fadeIn",
            duration: 250
        },
        hideAnimation: Ext.browser.is.ie || Ext.browser.is.AndroidStock ? null : {
            type: "fadeOut",
            duration: 250
        }
    },

    initialize: function () {
        this.element.on({
            tap: {
                fn: function () {
                    this.hide();
                    Ext.Viewport.toggleMenu("left");
                },
                single: true,
                scope: this
            }
        })
    }
});