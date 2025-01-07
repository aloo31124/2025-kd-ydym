/*
 重新發文挑選要發文機關視窗
 */

Ext.define('OA.form.FormChildrenOrgNo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormChildrenOrgNo',
    xtype: 'FormChildrenOrgNo',
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
                        id: 'groupName',
                        text: '',
                        handler: function (button) {
                            var Dep3Child = Ext.getStore('Dep3Child');                           
                            if (Dep3Child) {
                                Dep3Child.clearFilter();
                            }
                        }
                    },
                    { xtype: 'spacer' },                    
                    {
                        ui: 'plain', text: '全選', action: 'allIn',id:'allInDep3Child',
                        handler: function (button) {
                            Ext.getStore('Dep3Child').each(function (item, index, length) {
                                item.set('isElect', true);
                            });
                        }
                    },
                    {
                        ui: 'plain', text: '全刪', action: 'allDel',id:'allDelDep3Child',
                        handler: function (button) {
                            Ext.getStore('Dep3Child').each(function (item, index, length) {
                                item.set('isElect', false);
                            });
                        }
                    },
                    {
                        xtype: 'toolbar',
                        cls: 'segdoc-selector',
                        docked: 'top',
                        items: [
                            { xtype: 'spacer' },
                            {
                                ui: 'plain', text: '✖', action: 'no',
                                handler: function (button) {
                                    button.up('formpanel').hide();
                                }
                            },
                        ]
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
                                id: 'dep3ChildList',
                                height: 420,
                                xtype: 'list',
                                scrollable: 'vertical',
                                disableSelection: true,
                                store: 'Dep3Child',
                                itemTpl: new Ext.XTemplate(
                                    '<table>',
                                    '<tr>',

                                    '<td width="5%">{number}. </td>',
                                    '<td width="5%">',
                                    '<tpl if="(isElect)">',
                                    '<input type="checkbox" id="checkExcept" style="zoom: 2;" checked >',
                                    '<tpl else>',
                                    '<input type="checkbox" id="checkExcept" style="zoom: 2;" >',
                                    '</input>',
                                    '</tpl>',
                                    '</td>',

                                    '<td width="90%">{dep3Name}</td>',

                                    //'<tpl if="(isEdit)">',
                                    //'<td width="5%"><span class="flow-move"></span></td>',
                                    //'</tpl>',

                                    '</tr>',
                                    '</table>'
                                ),
                                //plugins: [{ xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move' }],
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
                    {
                        id: 'txtDep3Child',
                        xtype: 'textfield',
                        listeners: {
                            clearicontap: function (ctr, e, eOpts) {
                                var Dep3Child = Ext.getStore('Dep3Child');
                                if (Dep3Child) {
                                    Dep3Child.clearFilter();
                                }
                            },
                            keyup: function (ctr, e, eOpts) {
                                var Dep3Child = Ext.getStore('Dep3Child');
                                if (Dep3Child) {
                                    Dep3Child.clearFilter();
                                    Dep3Child.filterBy(function (rec, id) {
                                        if (rec.data.dep3Name.indexOf(ctr.getValue()) >= 0)
                                            return true;
                                        else
                                            return false;
                                    });
                                }
                            }
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        ui: 'confirm',
                        id: 'dep3ChildOK',
                        text: '確定',
                        action: 'ok',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var record = form.getRecord();
                            var unElect = [];

                            Ext.getStore('Dep3Child').each(function (item, index, length) {
                                if (!item.data.isElect) unElect.push(item.data.dep3Name);
                            });
                            var except = unElect.join('、') || '';
                            record.set('except', except);

                            if (record.data.tagName === 'Contact') {                                
                                record.set('VALUE', except ? record.data.CODENAME + '(' + except + '除外)' : record.data.CODENAME);
                            }

                            var txtDep3Child = Ext.getCmp('txtDep3Child');
                            if (txtDep3Child) txtDep3Child.setValue('');

                            form.hide();
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
        Ext.getCmp('dep3ChildList').setHeight(h);
    },
    create: function (master) {
        var qs = OA.common.Global.getQ();
        var unHidden = qs.app === 'check' ? true : false;
        Ext.getCmp('dep3ChildOK').setHidden(unHidden);
        Ext.getCmp('dep3ChildList').setDisabled(unHidden);
        Ext.getCmp('allInDep3Child').setHidden(unHidden);
        Ext.getCmp('allDelDep3Child').setHidden(unHidden);

        var title = master.data.dep3Name ? master.data.dep3Name : master.data.CODENAME;
        if (title.indexOf('（') >= 0) {
            var str = title.split('（')[0];
            title = str;
        }
        Ext.getCmp('groupName').setText(title);
        var store = Ext.getStore('Dep3Child');
        store.removeAll();
        store.sync();
        store.clearFilter();
        if (master.data.children) {
            var unElect = [];
            if (master.data.except) {
                unElect = master.data.except.split('、');
            }

            var child;
            if (Ext.isArray(master.data.children)) {
                child = master.data.children;
            } else {
                child = JSON.parse(master.data.children);
            }

            var index = 1;
            Ext.Array.each(child, function (dep3) {
                var item = [];
                item.push({
                    number: index,
                    dep3Name: dep3.dep3Name,
                    dep3No: dep3.dep3No,
                    dep3Zone: dep3.dep3Zone,
                    dep3Addr: dep3.dep3Addr,
                    peopleSend: dep3.peopleSend,
                    transType: dep3.transType,
                    isEdit: true,
                    isElect: unElect.indexOf(dep3.dep3Name) == -1 ? true : false
                });
                index = index + 1;
                store.addData(item);
            });
        }
        this.setRecord(master);

        OA.common.Utils.indicatorWith('dep3ChildList');
    }
});