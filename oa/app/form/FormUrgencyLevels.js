/*
   處理級別（目前沒用到）已經整合到稿面註記
 */

Ext.define('OA.form.FormUrgencyLevels', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormUrgencyLevels',
    xtype: "FormUrgencyLevels",
    config: {
        width: 400,
        height: 200,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            labelWidth: '50%'
        },
        items: [
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                items: [
                    {
                        xtype: 'selectfield',
                        name: '處理級別',
                        label: '處理級別',
                        valueField: 'key',
                        displayField: 'value',
                        store: {
                            data: [
                                { value: ' ', key: ' '},
                                { value: '普通件', key: '普通件'},
                                { value: '速件', key: '速件'},
                                { value: '最速件', key: '最速件'}
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
                    {
                        text: '取消', action: 'no', width: '20%',
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    },
                    {xtype: 'spacer'},
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '20%',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var data = form.getValues();
                            OA.common.Paper.main().updateContent(data);
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