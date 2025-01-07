Ext.define('OA.view.CtnPaper', {
    extend: 'Ext.Container',
    xtype: 'ctnPaper',
    requires: ['OA.components.Paper'],
    config: {
        layout: {
            type: 'vbox',
            align: 'center'
        },
        ui: 'plain',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [
            {
                id:'cpaper',
                xtype: 'cpaper'
            }
        ]
    }
});
