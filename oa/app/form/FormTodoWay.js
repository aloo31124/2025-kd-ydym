/*
   擬辦方式（目前沒用到）已經整合到稿面註記
 */

Ext.define('OA.form.FormTodoWay', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormTodoWay',
    xtype: "FormTodoWay",
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
                        id: 'todoWaySelect',
                        name: '擬辦方式',
                        label: '擬辦方式',
                        valueField: 'key',
                        displayField: 'value',
                        store: {
                            data: [
                                { value: ' ', key: ' '},
                                { value: '先簽後稿', key: '先簽後稿'},
                                { value: '簽稿併陳', key: '簽稿併陳'},
                                { value: '以稿代簽', key: '以稿代簽' },
                                { value: '其他', key: '其他' }
                            ]
                        },
                        listeners: {
                            change: function (ctr, Value) {
                                var txtOther = Ext.ComponentQuery.query('textareafield[name=其他]')[0];
                                if (Value == '其他') {
                                    txtOther.setHidden(false);
                                } else {
                                    txtOther.setHidden(true);
                                    txtOther.setValue('');
                                }
                            }
                        }
                    },
                    {
                        xtype: 'textareafield',
                        name: '其他',
                        label: '其他',
                        hidden: true
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
                            if (data['擬辦方式'] == '其他')
                                data['擬辦方式'] = data['其他'];
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