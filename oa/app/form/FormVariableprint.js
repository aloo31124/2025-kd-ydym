/*
   套印/新增變數
 */

Ext.define('OA.form.FormVariableprint', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormVariableprint',
    xtype: "FormVariableprint",
    config: {
        width: 400,
        height: 240,
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
                        label: '變數：',
                        xtype: 'textfield',
                        name: 'variable'
                    },
                    {
                        label: '值：',
                        xtype: 'textfield',
                        name: 'actual'
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {xtype: 'spacer'},
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
                                var variablePrint = Ext.getCmp('PanelVariableprint');
                                if (variablePrint) 
                                    variablePrint.addRows(values);
                            }
                            form.hide();
                        }
                    }
                ]
            }
        ]
    },
    create:function(data){
        this.setRecord(data);
    }
});