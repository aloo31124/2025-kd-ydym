Ext.define('OA.view.MainWork', {
    extend: 'Ext.Container',
    xtype: "mainWork",
    requires: [
        'OA.view.Work',
        'OA.view.CtnBulletin'
    ],
    config: {
        layout:"card",
        ui: 'light',
        items: [
            {
                xtype: 'oawork'
            },
            {
                xtype: 'ctnBulletin'
            }
        ]
    }
});