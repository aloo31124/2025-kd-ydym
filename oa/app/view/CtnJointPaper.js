Ext.define('OA.view.CtnJointPaper', {
    extend: 'Ext.Container',
    xtype: 'ctnJointPaper',
    requires: ['OA.components.JointPaper'],
    config: {
        layout: "vbox",
        ui: 'plain',
        scrollable: {
            direction: 'vertical',
            directionLock: false
        },
        items: [
            {
                xtype: 'jointPaper'
            }
        ]
    }
});
