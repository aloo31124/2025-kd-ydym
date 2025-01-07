/*
 機關
 */

Ext.define('OA.form.FormOrg', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormOrg',
    xtype: "FormOrg",
    config: {
        width: 550,
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
                items: [
                    {
                        name: '機關',
                        label: '簽辦機關（單位）:',
                        xtype: 'textfield'
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