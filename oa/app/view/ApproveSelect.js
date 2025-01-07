Ext.define('OA.view.ApproveSelect', {
    extend: 'Ext.Container',
    xtype: "approveSelect",
    requires: ['Ext.form.FieldSet', 'Ext.field.Select'],
    config: {
        ui: 'light',
        layout: {
            type: 'vbox'
        },
        masked: false,
        items: [
            {
                xtype: 'toolbar',
                title: '簽核階段',
                cls: 'segdoc-selector'
            },
            {
                flex: 1,
                xtype: 'fieldset',
                defaults: {
                    labelWidth: '30%'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'fieldSubject',
                        id: 'fieldSubject',
                        label: '主旨',
                        readOnly: true
                    },
                    {
                        label: '動作',
                        xtype: 'selectfield',
                        id: 'fieldActions',
                        name: 'fieldActions',
                        store: 'SignAction',
                        displayField: 'name',
                        valueField: 'methodId'
                    },
                    {
                        label: '下一關',
                        xtype: 'selectfield',
                        id: 'fieldBarriers',
                        name: 'fieldBarriers',
                        store: 'Barrier',
                        displayField: 'lv',
                        valueField: 'code'
                    },
                    {
                        xtype: 'textareafield',
                        name: 'fieldNote',
                        id: 'fieldNote',
                        label: '加註意見',
                        height: 300
                    },
                    {
                        xtype: 'dataview',
                        inline: {wrap: true},
                        itemTpl: '<div style="padding:5px;font-size:18px;cursor: pointer;">{text}</div>',
                        store: {
                            fields: ['text'],
                            data: [
                                {text: '如擬'},
                                {text: '請查照'},
                                {text: '礙難同意'},
                                {text: '應從緩議'},
                                {text: '同意照辦'}
                            ]
                        },
                        minHeight: 150
                    }
                ]
            }
        ]
    }
});