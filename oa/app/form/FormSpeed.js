/*
   速別
 */

Ext.define('OA.form.FormSpeed', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormSpeed',
    xtype: "FormSpeed",
    config: {
        width: 400,
        height: 200,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox',
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
                        scope: this,
                        hasDisabled: false,
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
                    labelWidth: '50%'
                },
                items: [
                    {
                        xtype: 'selectfield',
                        name: '速別',
                        label: '速別',
                        valueField: 'key',
                        displayField: 'value',
                        store: {
                            data: [
                                { value: '普通件', key: '普通件'},
                                { value: '速件', key: '速件'},
                                { value: '最速件', key: '最速件'},
                                { value: '', key: ''}
                            ]
                        }
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
                        ui: 'confirm',
                        text: '確定',
                        action: 'ok',
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