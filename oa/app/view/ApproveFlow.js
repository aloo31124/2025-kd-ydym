Ext.define('OA.view.ApproveFlow', {
    extend: 'Ext.Container',
    xtype: "approveFlow",
    requires: [
        'OA.view.ApproveSelect',
        'OA.view.ApproveWorkflow'
    ],
    config: {
        layout: {
            type: 'hbox'
        },
        items: [
            {
                xtype: 'approveSelect',
                width: '50%'
            },
            {
                xtype: 'approveWorkflow',
                width: '50%'
            }
        ]
    },
    initialize: function () {
    }
});