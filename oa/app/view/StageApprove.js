Ext.define('OA.view.StageApprove', {
    extend: 'Ext.Container',
    xtype: "StageApprove",
    id: 'frmApprove',
    requires: [
        'OA.view.ApproveFlow'
    ],
    config: {
        ui: 'light',
        layout: {
            type: 'vbox'
        },
        items: [
            {
                id:'approveFlow',
                xtype: 'approveFlow',
                height:'90%'
            },
            {
                id:'approveConfirm',
                xtype: 'container',
                masked: false,
                defaults: {
                    xtype: 'button',
                    style: 'margin: .5em',
                    flex: 1
                },
                layout: {
                    type: 'hbox'
                },
                height:'10%',
                items: [
                    {
                        text: '上一頁',
                        action:'no',
                        scope: this,
                        hasDisabled: false
                    },
                    {
                        ui:'confirm',
                        text: '執行',
                        action:'ok'
                    }
                ]
            }
        ]
    },
    initialize: function () {
    }
});