Ext.define('OA.view.StageOfficialDoc', {
    extend: 'Ext.Container',
    xtype: "StageOfficialDoc",
    requires: [
        'OA.view.Menu',
        'OA.view.MainWork'
    ],
    config: {
        layout:"hbox",
        ui: 'light',
        items: [
            {
                id: 'sodMenu',
                xtype: 'oamenu',
                flex: 1
            },
            {
                xtype: 'mainWork',
                flex: 2
            }
        ]
    },
    // Fires when the Panel is initialized
    initialize: function () {
        Ext.Viewport.on('orientationchange', 'handleOrientationChange', this, {buffer: 50 });
        this.handleOrientationChange(this,'landscape');
    },
    handleOrientationChange: function(e, newOrientation){
        var ctrPaper =OA.common.Paper.main();
        var ctlMenu =Ext.getCmp('sodMenu');

        var isPortrait = (newOrientation=='portrait');
        if (ctrPaper) {
            if (ctrPaper.getStatus() == 'edit') {
                if (ctlMenu) ctlMenu.setHidden(true);
            } else {
                if (ctlMenu) ctlMenu.setHidden(isPortrait);
            }
            ctrPaper.reviseHidden(isPortrait);
            ctrPaper.editActions().zoom();
        }
    }
});