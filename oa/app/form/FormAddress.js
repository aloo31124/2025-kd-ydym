/*
 地址
 */

Ext.define('OA.form.FormAddress', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormAddress',
    xtype: "FormAddress",
    config: {
        width: 500,
        height: 350,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            labelWidth: '30%'
        },
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    { xtype: 'spacer' },
                    {
                        ui: 'plain', text: '✖', action: 'no',
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    },
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                items: [
                    {
                        xtype: 'textareafield',
                        name: '地址',
                        label: '地址'
                    },
                    {
                        xtype: 'textareafield',
                        name: '辦公地址',
                        label: '辦公'
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
                            OA.common.Paper.main().updateContent(form.getValues());
                            form.hide();
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                        }
                    }
                ]
            }
        ]
    }
});