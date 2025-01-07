/*
重新發文/勾選要發文的受文者
 */
Ext.define('OA.form.FormReSendSelect', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormReSendSelect',
    xtype: 'FormReSendSelect',
    requires: ['OA.client.Member', 'Ext.plugin.ListPaging', 'Ext.plugin.SortableList', 'OA.common.NestedListPaging'],
    config: {
        width: '50%',
        height: '80%',
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        scrollable: false,
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    {
                        ui: 'plain', text: '全選', action: 'allIn',
                        handler: function (button) {
                            Ext.getStore('Dep3Child').each(function (item, index, length) {
                                item.set('isElect', true);
                            });
                        }
                    },
                    {
                        ui: 'plain', text: '全刪', action: 'allDel',
                        handler: function (button) {
                            Ext.getStore('Dep3Child').each(function (item, index, length) {
                                item.set('isElect', false);
                            });
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
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
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'container',
                        width: '100%',
                        layout: {
                            type: 'vbox'
                        },
                        items: [
                            {
                                id: 'dep3reSendlist',
                                height: 400,
                                xtype: 'list',
                                scrollable: 'vertical',
                                disableSelection: true,
                                store: 'Dep3Child',
                                itemTpl: new Ext.XTemplate(
                                    '<table>',
                                    '<tr>',

                                    '<td width="5%">',
                                    '<tpl if="(isElect)">',
                                    '<input type="checkbox" id="checkExcept" style="zoom: 2;" checked >',
                                    '<tpl else>',
                                    '<input type="checkbox" id="checkExcept" style="zoom: 2;" >',
                                    '</input>',
                                    '</tpl>',
                                    '</td>',

                                    '<td width="90%">{dep3Name}</td>',

                                    '<tpl if="(isEdit)">',
                                    '<td width="5%"><span class="flow-move"></span></td>',
                                    '</tpl>',

                                    '</tr>',
                                    '</table>'
                                ),
                                plugins: [{ xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move' }],
                                infinite: true,
                                variableHeights: true,
                                listeners: {
                                    itemtap: function (list, index, item, record, event) {
                                        if (event.getTarget('#checkExcept')) {
                                            if (record.get('isElect')) {
                                                record.set('isElect',false);
                                            }
                                            else {
                                                record.set('isElect', true);
                                            }                                           
                                        }
                                    }
                                }
                            }]
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    { ui: 'plain', text: '請勾選要重發的受文者' },
                    {xtype: 'spacer'},
                    {
                        ui: 'confirm',
                        text: '確定送發',
                        action: 'ok',
                        handler: function (button, e, eOpts) {
                            var store = Ext.getStore('Dep3Child');
                            var checkHasElect = store.data.all.where("( el, i, res, param ) => (el.data.isElect)");
                            if (checkHasElect && checkHasElect.length > 0) {
                                var form = button.up('formpanel');
                                var formSend = Ext.getCmp('formSend');
                                if (formSend)
                                    formSend.doSend();
                                form.hide();
                            } else
                                Ext.Msg.alert('提示', '沒有選擇任何受文者');
                        }
                    }
                ]
            }
        ]
    },
    initialize: function () {
        var h = (Ext.Viewport.getWindowHeight() * 0.9) - 170;
        Ext.getCmp('dep3reSendlist').setHeight(h);
    },
    create: function (data) {
        var store = Ext.getStore('Dep3Child');
        if (store) {
            store.removeAll();
            store.sync();
        }
        store.addData(data);

        OA.common.Utils.indicatorWith('dep3reSendlist');
    }
});