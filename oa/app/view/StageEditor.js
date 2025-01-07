Ext.define('OA.view.StageEditor', {
    extend: 'Ext.Container',
    xtype: "StageEditor",
    requires: [
        'OA.view.Work', 'OA.view.Suggestion'
    ],
    config: {
        ui: 'light',
        layout: {
            type: 'hbox'
        },
        items: [
            {
                xtype: 'oawork',
                width: '60%'
            },
            {
                xtype: 'suggestion',
                width: '20%'
            }
        ]
    },
    initialize: function () {
        if (Ext.browser.is.Firefox) this.setCls('firefox-compatibility');
        Ext.Viewport.on('orientationchange', 'handleOrientationChange', this, {buffer: 50});
    },
    handleOrientationChange: function (e, newOrientation) {
        var isPortrait = (newOrientation == 'portrait');
        var isTablet = Ext.os.deviceType === 'Tablet';
        if (isTablet) {
            if (isPortrait) {
                Ext.Viewport.hideMenu('left');
                Ext.getCmp('Suggestion').setHidden(true);
            } else {
                Ext.Viewport.showMenu('left');
                Ext.getCmp('Suggestion').setHidden(false);
            }
            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
            if (ctrWK) ctrWK.frameResize();
        }
        var ctrPaper = OA.common.Paper.main();
        if (ctrPaper) {
            ctrPaper.reviseHidden(isPortrait);
            if (ctrPaper.editActions())
                ctrPaper.editActions().zoom();
        }
    }
});