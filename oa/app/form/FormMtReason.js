/*

開會通知單/開會事由

 */
Ext.define('OA.form.FormMtReason', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormMtReason',
    xtype: "FormMtReason",
    config: {
        width: 400,
        height: 240,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            labelWidth: '40%'
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
                items: [ {
                    name: '開會事由',
                    label: '開會事由:',
                    xtype: 'textareafield'
                }]
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