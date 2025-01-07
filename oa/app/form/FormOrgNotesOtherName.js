/*
 簽加註備註（目前沒用到）
 */

Ext.define('OA.form.FormOrgNotesOtherName', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormOrgNotesOtherName',
    xtype: "FormOrgNotesOtherName",
    config: {
        width: 550,
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
    },
    create: function (data) {
        var me = this;
        var field = me.query('fieldset')[0];
        field.setItems([
            {
                name: '註記',
                label: '註記:',
                xtype: 'textareafield',
                value: data['註記_title'],
            }
        ]);
        me.setValues(data);
    }
});