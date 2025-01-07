Ext.define('OA.view.Main', {
    id:'main',
    extend: 'Ext.Container',
    xtype: "oamain",
    requires: [
        'OA.view.StageOfficialDoc',
        'OA.view.StageApprove'
    ],
    config: {
        layout:"card",
        ui: 'light',
        items: [
            {
                xtype: 'StageOfficialDoc'
            },
            {
                xtype: 'StageApprove'
            }
        ]
    }
});