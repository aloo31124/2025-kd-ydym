/*
 結尾自稱語（目前沒用到）
 */

Ext.define('OA.form.FormAppellationSelf', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormAppellationSelf',
    xtype: "FormAppellationSelf",
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
                items: [
                    {
                        name: '結尾自稱語',
                        label: '結尾自稱語:',
                        xtype: 'textfield',
                        maxLength: 14,
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

                            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                            var initParas = OA.common.Global.getInitParas();
                            var pages = OA.common.VIMgr.getCurrentEditionPapers();
                            var paper = pages.where("( el, i, res, param ) => el.代碼==" + initParas.paperNo);
                            var segItems = ctrWK.getSegdoc().getItems().items;

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