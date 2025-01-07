/*
 憑證資訊
 */

Ext.define('OA.form.FormSignData', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormSignData',
    xtype: "FormSignData",
    config: {
        width: 700,
        height: 500,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                defaults: {
                    labelWidth: '30%'
                },
                items: [
                    {
                        label: 'CN',
                        xtype: 'textfield',
                        name: 'CN',
                        readOnly:true
                    },
                    {
                        label: 'SDN',
                        xtype: 'textfield',
                        name: 'SDN',
                        readOnly:true
                    },
                    {
                        label: 'IDN',
                        xtype: 'textfield',
                        name: 'IDN',
                        readOnly:true
                    },
                    {
                        label: 'SerialNumber',
                        xtype: 'textfield',
                        name: 'SerialNumber',
                        readOnly:true
                    },
                    {
                        label: 'ValidateDate',
                        xtype: 'textfield',
                        name: 'ValidateDate',
                        readOnly:true
                    },
                    {
                        label: 'SignDateTime',
                        xtype: 'textfield',
                        name: 'SignDateTime',
                        readOnly:true
                    },
                    {
                        label: 'X509Data',
                        xtype: 'textareafield',
                        name: 'X509Data',
                        readOnly:true
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
                            button.up('formpanel').hide();
                        }
                    }
                ]
            }
        ]
    },
    create: function (data) {
        this.setValues(data);
    }
});