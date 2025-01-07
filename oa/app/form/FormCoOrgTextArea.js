/*
會銜會辦機關（目前沒用到）
 */

Ext.define('OA.form.FormCoOrgTextArea', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormCoOrgTextArea',
    xtype: "FormCoOrgTextArea",
    config: {
        width: 500,
        height: 400,
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
                xtype: 'label',
                html: '請按 Enter 換行'
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

                            var vm = OA.common.Global.getCurrentViewModel();
                            var items = [];
                            items.push(vm.主辦機關);
                            items = items.concat(form.getValues().會辦機關.split('\n'));

                            OA.common.Paper.main().doDraftVerify('會辦機關', items);

                            vm['會辦機關'] = items.join('、');
                            OA.common.Paper.main().saveWKField('會辦機關', items.join('、'));
                            form.hide();
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                        }
                    }
                ]
            }
        ]
    },
    create: function (key, data) {
        var me = this;
        var field = me.query('fieldset')[0];

        field.setItems([
            {
                name: key,
                label: key + ':',
                xtype: 'textareafield',
                value: '機關1\n機關2\n機關3',
                maxRows: 10
            }
        ]);

        var d = Ext.clone(data);
        var items = (d.會辦機關) ? d.會辦機關.split('、') : ['主機關', '機關1', '機關2'];
        items.shift();
        d.會辦機關 = items.join('\n');
        me.setValues(d);
    }
});