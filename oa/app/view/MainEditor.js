Ext.define('OA.view.MainEditor', {
    id:'main',
    extend: 'Ext.Container',
    xtype: "mainEditor",
    requires: [
        'OA.view.StageApprove',
        'OA.view.StageEditor'
    ],
    config: {
        layout:"card",
        ui: 'light',
        items: [
            {
                xtype: 'StageEditor'
            },
            {
                xtype: 'StageApprove'
            }
        ]
    }
});