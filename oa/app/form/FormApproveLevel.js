/*
   決行層級（目前沒用到）
 */

Ext.define('OA.form.FormApproveLevel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormApproveLevel',
    xtype: "FormApproveLevel",
    config: {
        width: 400,
        height: 150,
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
                        id:'selectApproveLV',
                        xtype: 'selectfield',
                        name: '決行層級_title',
                        label: '決行層級',
                        valueField: 'value',
                        displayField: 'key',
                        store: {
                            data: [
                                { key: '一層決行', value: '-1' },
                                { key: '二層決行', value: '-2' },
                                { key: '三層決行', value: '-3' },
                                { key: '四層決行', value: '-4' }
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
                    { xtype: 'spacer' },
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
    }, create: function (data) {
        console.log(data);
        var me = this;
        var value = '-1';

        if (data.決行層級_title) {
            try {
                var level = data.決行層級_title;
                if (level != NaN && level != 'NaN') {
                    value = KangDaAppConfig().DCSNS[level].value + '';
                }
            } catch (ex) {

            }

            var tmps = [-1, -2, -3, -4];
            Ext.Array.each(tmps, function (dcsns) {
                //console.log(dcsns);
                if (KangDaAppConfig().DCSNS[dcsns].ofDesc == data.決行層級_title) {
                    value = KangDaAppConfig().DCSNS[dcsns].value + '';
                    return false;
                }
            });

            //console.log(value);

            var selectApproveLV = Ext.getCmp('selectApproveLV');
            if (selectApproveLV) {
                selectApproveLV.setValue(value);
            }         

        }
    }
});