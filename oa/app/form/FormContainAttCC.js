/*
 副本選擇含附件
 */

Ext.define('OA.form.FormContainAttCC', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormContainAttCC',
    xtype: 'FormContainAttCC',
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
                        text: '全選', action: 'allIn',
                        handler: function (button) {
                            Ext.getStore('Dep3ContainAtt').each(function (item, index, length) {
                                item.set('isElect', true);
                            });
                        }
                    },
                    {
                       text: '全刪', action: 'allDel',
                        handler: function (button) {
                            Ext.getStore('Dep3ContainAtt').each(function (item, index, length) {
                                item.set('isElect', false);
                            });
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        ui: 'plain', text: '✖', action: 'no',
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    },
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
                                id: 'containAttCClist',
                                height: 400,
                                xtype: 'list',
                                scrollable: 'vertical',
                                disableSelection: true,
                                store: 'Dep3ContainAtt',
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

                                    '<td width="90%">{VALUE}</td>',

                                    //'<tpl if="(isEdit)">',
                                    //'<td width="5%"><span class="flow-move"></span></td>',
                                    //'</tpl>',

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
                                                record.set('isElect', false);
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
                    { ui: 'plain', text: '請勾選要含附件的副本受文者' },
                    { xtype: 'spacer' },
                    {
                        ui: 'confirm',
                        text: '確定',
                        action: 'ok',
                        handler: function (button, e, eOpts) {
                            var store = Ext.getStore('Dep3ContainAtt');
                            Ext.Array.each(store.data.all, function (dep) {
                                dep.get('isElect') ? dep.set('ATTACH', 'Y') : dep.set('ATTACH', 'N');
                            });
                            button.up('formpanel').hide();
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                        }
                    }
                ]
            }
        ]
    },
    initialize: function () {
        var h = (Ext.Viewport.getWindowHeight() * 0.9) - 170;
        Ext.getCmp('containAttCClist').setHeight(h);
    },
    create: function () {
        //濾出所有副本受文者
        var CC = [];
        var store = Ext.getStore('Contact');
        if (store) {
            Ext.Array.each(store.data.all, function (dep) {
                if ((dep.get('TRANSTYPE') + '') == '8') return true;    //內部傳遞一律含附件不可調整
                if (dep.get('KEY') == '副本') {
                    if (dep.get('ATTACH') == 'Y') {
                        dep.set('isElect', true);
                    } else {
                        dep.set('isElect', false);
                    }
                    CC.push(dep);
                }
            });
        }
        var store = Ext.getStore('Dep3ContainAtt');
        if (store) {
            store.removeAll();
            store.sync();
        }
        //console.log(CC);
        store.addData(CC);

        OA.common.Utils.indicatorWith('containAttCClist');
    }
});