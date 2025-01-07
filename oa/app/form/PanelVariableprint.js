/*
 套印管理/編輯變數
 */
Ext.define('OA.form.PanelVariableprint', {
    extend: 'Ext.Panel',
    xtype: "PanelVariableprint",
    alias: 'widget.PanelVariableprint',
    id: 'PanelVariableprint',
    requires: ['Ext.SegmentedButton', 'Ext.Toolbar', 'Ext.plugin.SortableList'],
    config: {
        ui: 'dark',
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        width: '50%',
        height: '80%',
        style: 'font-size:20px',
        activeTab: 1,
        defaults: {
            scrollable: true
        },
        layout: 'vbox',
        items: [
            {
                // id: 'toolbarSort',
                xtype: 'toolbar',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector',
                items: [
                    {
                        text: '新增', action: 'new',
                        handler: function (button) {
                            OA.common.Funcs.show('FormVariableprint');
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
                        action: 'no',
                        handler: function (button) {
                            var form = button.up('panel');
                            form.hide();
                        }
                    }
                ],
                defaults: {
                    handler: function (button, e, eOpts) {

                    }
                }
            },
            {
                flex: 1,
                xtype: 'list',
                scrollable: 'vertical',
                id: 'variablePrintList',
                itemTpl: new Ext.XTemplate(
                    '<table>',
                    '<tr>',
                    '<td width="5%"><span class="flow-delete">&nbsp;</span></td>',

                    '<td width="10%">',
                    '<p style="font-size:110%;">',
                    ' {variable} ',
                    '</p>',
                    '</td>',

                    '<td width="10%">',
                    '<p style="font-size:110%;">',
                    ' {actual} ',
                    '</p>',
                    '</td>',

                    //'<td width="5%"><span class="flow-move"></span></td>',
                    '</tr>',
                    '</table>'
                ),
                plugins: [{xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move'}],
                infinite: true,
                variableHeights: true,
                listeners: {
                    itemtap: function (list, index, item, record, event) {
                        if (event.getTarget('.flow-delete')) {
                            var store = Ext.getStore('variableContact');
                            store.remove(record);
                            store.sync();
                        }
                        else {
                            OA.common.Funcs.show('FormVariableprint', null, record);
                        }
                    }
                }
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [                    
                    { xtype: 'spacer' },
                    {
                        text: '確定', action: 'yes', ui: 'confirm',
                        handler: function (button) {
                            var form = button.up('panel');
                            var variableContact = Ext.getStore('variableContact');
                            var variable = [];
                            if (variableContact && variableContact.data.all.length > 0) {
                                Ext.Array.each(variableContact.data.all, function (item) {
                                    variable.push({ variable: item.get('variable'), actual: item.get('actual') });
                                });
                            }

                            if (variable.length > 0) {
                                //console.log(JSON.stringify(variable));
                                var record = form.getRecord();
                                if (record) {
                                    record.set('variable', JSON.stringify(variable));
                                    //console.log(record);
                                }
                            }
                            //console.log(form.getOver().setValue('variable', JSON.stringify(variable)));
                            //form.getOver().variable = JSON.stringify(variable);
                            //console.log(form.getValues());
                            form.hide();
                        }
                    }
                ]
            }
        ]
    },
    initialize: function () {
    },
    addRows: function (data) {
        var variableContact = Ext.getStore('variableContact');
        if (variableContact) {
            variableContact.addData(data);
        }
    },
    create: function (data) {
        if (data != undefined) {
            var variablePrintList = Ext.getCmp('variablePrintList');
            if (variablePrintList) {
                var items = [];
                var variableJSON = data.get('variable');
                if (variableJSON != undefined && variableJSON != '') {
                    items = JSON.parse(variableJSON);
                }
                
                
                var variableContact = Ext.getStore('variableContact');
                if (variableContact) variableContact = null;

                variableContact = Ext.create("Ext.data.Store", {
                    id: 'variableContact',
                    model: 'OA.model.Variableprint',
                    autoSync: true,
                    autoLoad: true,
                    data: items
                });
                variablePrintList.setStore(variableContact);                
            }
        }
        this.setRecord(data);
    }
});