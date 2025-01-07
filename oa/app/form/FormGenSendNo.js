/*
 地址
 */

Ext.define('OA.form.FormGenSendNo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormGenSendNo',
    xtype: "FormGenSendNo",
    config: {
        width: 400,
        height: 200,
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
                items: [
                    {
                        align: 'left',
                        labelWidth: '85%',
                        labelAlign: 'right',
                        clearIcon: false,
                        xtype: 'checkboxfield',
                        name: 'isAddSubNo',
                        label: '是否自動加支號?',
                        checked: true
                    },
                    {
                        align: 'left',
                        labelWidth: '85%',
                        labelAlign: 'right',
                        clearIcon: false,
                        xtype: 'checkboxfield',
                        name: 'isNoteAddSubNo',
                        label: '是否簽給支號?',
                        checked: true
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
                            //var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                            //ctrWK.autoReNumber2(form.getValues());
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