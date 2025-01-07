/*
 檔號分類號搜尋（目前沒用到）
 */

Ext.define('OA.form.FormCaseNoSearch', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormCaseNoSearch',
    xtype: 'FormCaseNoSearch',
    requires: ['OA.client.Member'],
    id: 'FormCaseNoSearch',
    config: {
        width: '35%',
        height: '55%',
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        scrollable: false,
        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {
                        text: '選擇',
                        action: 'total',
                        handler: function (button) {
                            OA.common.Funcs.show('FormCaseNo');
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        text: '關閉',
                        action: 'no',
                        scope: this,
                        hasDisabled: false,
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '搜尋條件：',
                items: [
                    {
                        xtype: 'selectfield',
                        name: 'Key',
                        label: '',
                        valueField: 'value',
                        displayField: 'text',
                        options: [
                            { text: '分類號', value: 'no' },
                            { text: '案名', value: 'name' }
                        ],
                        value: 'no'
                    },
                    {
                        id: 'txtValue',
                        xtype: 'textfield'
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    { xtype: 'spacer' },
                    {
                        ui: 'confirm',
                        text: '搜尋',
                        handler: function (button) {
                            var form = button.up('formpanel');
                            var data = {};
                            data.key = form.getValues().Key || '';
                            data.value = Ext.getCmp('txtValue').getValue() || '';
                            data.depNo = OA.common.Global.getCurrentDept().depNo
                            OA.common.Funcs.show('FormCaseNo', null, data);
                        }
                    }
                ]
            }
        ]
    },
    initialize: function () {
    },
    create: function (data) {

    }
});