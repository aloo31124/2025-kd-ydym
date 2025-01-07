/*
   套印/受文者設定
 */

Ext.define('OA.form.FormOverprint', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormOverprint',
    xtype: "FormOverprint",
    config: {
        width: 500,
        height: 340,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
                        action: 'no',
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                defaults: {
                    labelWidth: '30%'
                },
                items: [
                    {
                        label: '受文者：',
                        xtype: 'textfield',
                        name: 'name'
                    },
                    
                    {
                        label: '郵遞區號：',
                        xtype: 'textfield',
                        name: 'addNo'
                    },
                    {
                        label: '地址：',
                        xtype: 'textfield',
                        name: 'addr'
                    },                  
                    {
                        label: '變數：',
                        xtype: 'textfield',
                        name: 'variable',
                        readOnly: true
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    { xtype: 'spacer' },
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '20%',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var r = form.getRecord();
                            var values = form.getValues();
                            var name;
                            if (r != undefined) {
                                for (name in values) {
                                    if (values.hasOwnProperty(name))
                                        r.set(name, values[name]);
                                }
                            }
                            else {
                                var overPrint = Ext.getCmp('PanelOverprint');
                                if (overPrint)
                                    overPrint.create(values);
                            }
                            form.hide();
                        }
                    }
                ]
            }
        ]
    },
    create: function (data) {
        this.setRecord(data);
    }
});