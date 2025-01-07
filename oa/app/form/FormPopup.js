/*
 聯絡方式
 */
Ext.define('OA.form.FormPopup', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormPopup',
    xtype: "FormPopup",
    config: {
        width: 400,
        height: 400,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            // margin: '0 0 5 0',
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
                items: []
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
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
    },
    create: function (fields) {
        var me = this;
        var _fieldset = this.getComponent('fieldset');
        _fieldset.removeAll(true);
        _fieldset.add(fields);
    }
});