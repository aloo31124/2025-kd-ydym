/*
 （目前沒用到）
 */

Ext.define('OA.form.FormSalaryNoticeTextArea', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormSalaryNoticeTextArea',
    xtype: "FormSalaryNoticeTextArea",
    config: {
        width: 500,
        height: 520,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            //margin: '5',
            labelWidth: '40%'
        },
        scrollable: false,
        items: [
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                items: []
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
                            var doHide = true;
                            //console.log(form.getValues());
                            doHide = OA.common.Paper.main().updateContent(form.getValues());
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                            doHide = doHide == undefined ? true : doHide;
                            if (doHide) form.hide();
                        }
                    }
                ]
            }
        ],
        number: '',
    },
    create: function (key, data) {
        var me = this;
        if (!key) return;
        var field = me.query('fieldset')[0];
        var number = (key+'').trim().substring(key.length - 1, key.length);
        me.setNumber(number);

        //console.log(me.getNumber());

        var fields = ['姓名', '身分證字號', '原任服務單位', '原任職稱', '異動類別', '新任服務單位', '新任職稱', '暫實支俸級', '生效日期'];

        var items = [];
        Ext.Array.each(fields, function (item) {
            items.push(
                {
                    name: item + number,
                    label: item + ':',
                    xtype: 'textfield'
                }
            );
        });
        field.setItems(items);
       
        me.setValues(data);
    }
});