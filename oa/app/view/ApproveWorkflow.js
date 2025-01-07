Ext.define('OA.view.ApproveWorkflow', {
    extend: 'Ext.Container',
    xtype: "approveWorkflow",
    requires: [
        'OA.view.CtnWorkflow'
    ],
    config: {
        ui: 'light',
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    { text: '新增', action: 'new' ,hidden:true},
                    { text: '編輯', action: 'edit' ,right: 50,hidden:true},
                    { ui: 'plain', iconCls: 'fa-picture-o', action: 'show' ,right: 0,hidden:true}
                ]
            },
            {
                flex: 1,
                xtype: 'ctnWorkflow'
            }
        ]
    },
    initialize: function () {
    }
});

