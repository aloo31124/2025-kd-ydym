/*
 發文群組
 */
Ext.define('OA.form.FormOrgNo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormOrgNo',
    xtype: 'FormOrgNo',
    requires: ['OA.client.Member', 'Ext.plugin.ListPaging', 'Ext.plugin.SortableList', 'OA.common.NestedListPaging'],
    config: {
        width: '90%',
        height: '90%',
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
                        id: 'selectDep3',
                        xtype: 'selectfield',
                        name: 'q_type',
                        valueField: 'value',
                        displayField: 'key',
                        value: '2',
                        store: {
                            data: [
                                { key: '共用', value: '1' },
                                //{ key: '機關', value: '2' },
                                { key: '單位', value: '4' },
                                { key: '自訂', value: '3' }                                
                            ]
                        },
                        listeners: {
                            change: function (ctr) {
                                Ext.getStore('Dep3Tree').setData(null);
                                Ext.getStore('Dep3Tree').sync();
                                ctr.up('panel').loadDep3();
                            }
                        }
                    },
                    {
                        id: 'selectTransType',
                        xtype: 'selectfield',
                        name: 'transType',
                        valueField: 'ofCode',
                        displayField: 'ofDesc',
                        store: 'SendWay'
                    },
                    {xtype: 'spacer'},
                    {
                        id: 'txtDep3List',
                        xtype: 'textfield',
                        listeners: {
                            clearicontap: function (ctr, e, eOpts) {
                                var Dep3List = Ext.getStore('Dep3List');
                                if (Dep3List) Dep3List.clearFilter();
                            },
                            keyup: function (ctr, e, eOpts) {
                                var Dep3List = Ext.getStore('Dep3List');
                                if (Dep3List) {
                                    Dep3List.clearFilter();
                                    Dep3List.filterBy(function (rec, id) {
                                        if (rec.data.dep3Name && rec.data.dep3Name.indexOf(ctr.getValue()) >= 0)
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
                        id: 'nlistDep3',
                        xtype: 'list',
                        width: '50%',
                        height: 400,
                        displayField: 'dep3Name',
                        //emptyText: '沒有資料',
                        loadingText: "Loading...",
                        //toolbar: {
                        //    xtype: 'titlebar',
                        //    docked: 'top',
                        //    items: [
                        //        {
                        //            ui: 'plain',
                        //            type: 'text',
                        //            align: 'right',
                        //            action: 'showpage',
                        //            text: 'p.1'
                        //        },
                        //        {
                        //            iconCls: 'home',
                        //            align: 'right',
                        //            handler: function (button) {
                        //                button.up('panel').loadDep3();
                        //            }
                        //        }
                        //    ]
                        //},
                        store: 'Dep3Tree',
                        itemTpl: new Ext.XTemplate(
                            '<table>',
                            '<tr>',
                            '<td width="90%">',
                            '<p>{dep3Name}</p>',
                            '</td>',
                            '<td width="10%">',
                            '<tpl if="(isAdd)">',
                            '<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">已加</span>',
                            '<tpl else>',
                            '<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">新增</span>',
                            '</tpl>',
                            '</td>',
                            '</tr>',
                            '</table>'),
                        listeners: {
                            itemtap: function (list, index, item, record, e) {
                                var me = list.up('FormOrgNo');
                                //if (me.isAddButton(e)) {
                                //record.set('leaf', true);
                                //判斷母群組中是否含以增加子類別
                                if (record.data.children && record.data.children.length > 0) {
                                    var repeat = false;
                                    Ext.Array.each(Ext.getStore('Dep3List').data.items, function (n) {
                                        if (n.data.dep3Name == record.data.dep3Name) {
                                            repeat = true;
                                            return true;
                                        }
                                        if (n.data.children && n.data.children.length > 0) {
                                            Ext.Array.each(n.data.children, function (nn) {
                                                var r = record.data.children.where("( el, i, res, param ) => el.dep3Name=='" + nn.dep3Name + "'");
                                                if (r.length > 0) {
                                                    repeat = true;
                                                    return true;
                                                }
                                            });
                                        } else {
                                            var r = record.data.children.where("( el, i, res, param ) => el.dep3Name=='" + n.data.dep3Name + "'");
                                            if (r.length > 0) {
                                                repeat = true;
                                                return true;
                                            }
                                        }
                                        //var r = record.data.children.where("( el, i, res, param ) => el.dep3Name=='" + n.data.dep3Name + "'");                                            
                                    });
                                    var contact = Ext.getStore('Contact');
                                    if (contact && contact.data.all.length > 0) {
                                        Ext.Array.each(contact.data.all, function (n) {
                                            if (n.data.CODENAME == record.data.dep3Name) {
                                                repeat = true;
                                                return true;
                                            }

                                            if (n.data.children || record.data.children) {
                                                if (n.data.children && record.data.children) {
                                                    Ext.Array.each(n.data.children, function (nn) {
                                                        var r = record.data.children.where("( el, i, res, param ) => el.dep3Name=='" + nn.dep3Name + "'");
                                                        if (r.length > 0) {
                                                            repeat = true;
                                                            return true;
                                                        }
                                                    });

                                                } else if (n.data.children) {
                                                    var r = n.data.children.where("( el, i, res, param ) => el.dep3Name=='" + record.data.dep3Name + "'");
                                                    if (r.length > 0) {
                                                        repeat = true;
                                                        return true;
                                                    }
                                                } else if (record.data.children) {
                                                    var r = record.data.children.where("( el, i, res, param ) => el.dep3Name=='" + n.data.CODENAME + "'");
                                                    if (r.length > 0) {
                                                        repeat = true;
                                                        return true;
                                                    }
                                                }
                                            }
                                        });
                                    }
                                    if (repeat) {
                                        Ext.Msg.alert('提示', '群組中已含選入之單位');
                                        return;
                                    }
                                }
                                var sendType = Ext.getCmp('selectTransType').getValue();

                                if ((sendType + '').trim() == '5') {
                                    Ext.Msg.confirm("提醒", "抄本將不列印紙本送發，請再確認是否選入？", function (ok) {

                                        if ('yes' == ok) {
                                            var groupType = Ext.getCmp('selectDep3').getValue();

                                            record.set('group', groupType);
                                            //群組展開
                                            if (record.data.children && record.data.children.length > 0) {
                                                Ext.Msg.confirm("提示", "是否要展開群組", function (fn) {
                                                    if (fn == 'yes') {
                                                        Ext.Array.each(record.data.children, function (chid) {
                                                            chid.transType = sendType;
                                                            chid.isAdd = true;
                                                            chid.isEdit = true;
                                                            Ext.getStore('Dep3List').add(chid);
                                                        });

                                                        // 處理卷軸顯示  - by yi-chi chiu
                                                        OA.common.Utils.indicatorWith('listDep3');
                                                    } else {
                                                        Ext.Array.each(record.data.children, function (chid) {
                                                            chid.transType = sendType;
                                                        });
                                                        record.data.transType = sendType;
                                                        me.setStorge(record);
                                                        record.set('isAdd', true);

                                                        // 處理卷軸顯示  - by yi-chi chiu
                                                        OA.common.Utils.indicatorWith('listDep3');
                                                    }
                                                });
                                            }
                                            else {
                                                record.data.transType = sendType;
                                                me.setStorge(record);
                                                record.set('isAdd', true);

                                                // 處理卷軸顯示  - by yi-chi chiu
                                                OA.common.Utils.indicatorWith('listDep3');
                                            }
                                        } else {
                                            return;
                                        }
                                    })
                                    return;
                                }

                                var groupType = Ext.getCmp('selectDep3').getValue();

                                record.set('group', groupType);
                                //群組展開
                                if (record.data.children && record.data.children.length > 0) {
                                    Ext.Msg.confirm("提示", "是否要展開群組", function (fn) {
                                        if (fn == 'yes') {
                                            Ext.Array.each(record.data.children, function (chid) {
                                                chid.transType = sendType;
                                                chid.isAdd = true;
                                                chid.isEdit = true;
                                                Ext.getStore('Dep3List').add(chid);
                                            });

                                            // 處理卷軸顯示  - by yi-chi chiu
                                            OA.common.Utils.indicatorWith('listDep3');
                                        } else {
                                            Ext.Array.each(record.data.children, function (chid) {
                                                chid.transType = sendType;
                                            });
                                            record.data.transType = sendType;
                                            me.setStorge(record);
                                            record.set('isAdd', true);

                                            // 處理卷軸顯示  - by yi-chi chiu
                                            OA.common.Utils.indicatorWith('listDep3');
                                        }
                                    });
                                }
                                else {
                                    record.data.transType = sendType;
                                    me.setStorge(record);
                                    record.set('isAdd', true);

                                    // 處理卷軸顯示  - by yi-chi chiu
                                    OA.common.Utils.indicatorWith('listDep3');
                                }
                                //    } else {
                                //        //開啟子類分頁
                                //        //OA.common.Funcs.show('FormChildrenOrgNo', null, record);
                                //        //return;
                                //    }
                            }
                        }
                    },
                    {
                        xtype: 'container',
                        width: '50%',
                        layout: {
                            type: 'vbox'
                        },
                        items: [
                            {
                                id: 'listDep3',
                                height: 400,
                                xtype: 'list',
                                scrollable: 'vertical',
                                disableSelection: true,
                                store: 'Dep3List',
                                itemTpl: new Ext.XTemplate(
                                    '<table>',
                                    '<tr>',

                                    '<tpl if="(isEdit)">',
                                    '<td width="5%"><span class="flow-delete">&nbsp;</span></td>',
                                    '</tpl>',

                                    '<td width="70%">{dep3Name}</td>',

                                    '<tpl if="(group==2||group==3||group==1)">',
                                    '<td width="15%">',
                                    '<span class="x-button-normal x-button" style="float:right;bottom:2px;font-size:90%;">編輯</span>',
                                    '</td>',
                                    '</tpl>',

                                    '<tpl if="(isEdit)">',
                                    '<td width="10%"><span class="flow-move" style="bottom:16px"></span></td>',
                                    '</tpl>',

                                    '</tr>',
                                    '</table>'
                                ),
                                plugins: [{ xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move' }],
                                infinite: true,
                                variableHeights: true,
                                listeners: {
                                    itemtap: function (list, index, item, record, event) {
                                        var me = list.up('FormOrgNo');
                                        if (event.getTarget('.flow-delete')) {
                                            Ext.Array.each(Ext.getCmp('nlistDep3').getStore('Dep3Tree').data.items, function (n) {
                                                if (record.data.dep3Name === n.data.dep3Name)
                                                    n.set('isAdd', false);
                                            });
                                            Ext.getStore('Dep3List').remove(record);
                                        } else if (me.isAddButton(event)) {
                                            //開啟子類分頁
                                            OA.common.Funcs.show('FormChildrenOrgNo', null, record);
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
                        id: 'txtDep3Tree',
                        xtype: 'textfield',
                        listeners: {
                            clearicontap: function (ctr, e, eOpts) {
                                var Dep3Tree = Ext.getStore('Dep3Tree');
                                if (Dep3Tree) Dep3Tree.clearFilter();
                            },
                            keyup: function (ctr, e, eOpts) {
                                var Dep3Tree = Ext.getStore('Dep3Tree');
                                if (Dep3Tree) {
                                    Dep3Tree.clearFilter();
                                    Dep3Tree.filterBy(function (rec, id) {
                                        if (rec.data.dep3Name && rec.data.dep3Name.indexOf(ctr.getValue()) >= 0)
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
                        text: '確定',
                        action: 'ok',
                        handler: function (button, e, eOpts) {
                            var me = this;
                            var items = [];
                            var key = Ext.getCmp('PanelChange').getKey();
                            Ext.getStore('Dep3List').each(function (item, index, length) {
                                var except = '';
                                if(item.get('except')){
                                    except = item.get('dep3Name') + '(' + item.get('except') + '除外)';
                                }
                                items.push({
                                    ADDR: item.get('dep3Addr'),
                                    ARCENO: item.get('dep3Zone'),
                                    CODE: item.get('dep3No'),
                                    CODENAME: item.get('dep3Name'),
                                    GROUP: item.get('group') || '',
                                    GROUPLIST: "",
                                    KEY: key,
                                    PEOPLESEND: item.get('peopleSend'),
                                    REALTRANSTYPE: 9,
                                    TRANSTYPE: item.get('transType'),
                                    TRANSTYPENAME: "紙本",
                                    TYPE: 1,
                                    VALUE: except ? except : item.get('dep3Name'),
                                    children: item.get('children'),
                                    tagName: "Contact",
                                    ATTACH: key == '副本' ? 'N' : 'Y',
                                    isEdit: true,
                                    editAtt: (key == '副本'),
                                    isChange: item.get('transType') != '2' ? 'Y' : 'N',
                                    except: item.get('except') || ''
                                });
                            });

                            Ext.getCmp('PanelChange').addContact(items);
                            var form = button.up('formpanel');
                            form.hide();

                            // xxx
                            setTimeout(function() {
                            	OA.common.Utils.indicatorWith(Ext.getCmp('PanelChange'));
                            	Ext.getCmp('PanelChange').getScrollable().getScroller().scrollToTop();
                            }, 300);
                        }
                    }
                ]
            }
        ]
    },
    initialize: function () {
        var h = (Ext.Viewport.getWindowHeight() * 0.9) - 110;
        Ext.getCmp('nlistDep3').setHeight(h);
        Ext.getCmp('listDep3').setHeight(h);
    },
    create: function () {
        Ext.getStore('Dep3List').setData(null);
        this.loadDep3();
    },
    loadDep3: function (params) {
        var paras = OA.common.Global.getInitParas();
        if (!paras) return;

        var data = {};
        data.qType = Ext.getCmp('selectDep3').getValue();
        data.start = 0;
        data.limit = 200;
        data.depNo = paras.depNo;
        data.empNo = paras.empNo;

        if (params) {
            data.dep3No = params.dep3No;
            data.dep3ChnName = params.dep3ChnName;
        } else {
            data.dep3No = '';
            data.dep3ChnName = '';
        }
        //OA.client.Member.loadDep3(data);
        OA.client.Member.loadGroup(data,function(){
            OA.common.Utils.indicatorWith('nlistDep3');
            // 在這裡使用並不會出現卷軸（無資料），用途是做第二次初始化時候隱藏卷軸  by yi-chi chiu
            OA.common.Utils.indicatorWith('listDep3');
        });
    },
    isAddButton: function (e) {
        var _isButton = false;
        if (!e)
            return _isButton;
        if (e.target.className === 'x-button-normal x-button')
            _isButton = true;
        return _isButton;
    },
    setStorge: function (record) {
        var data = {};
        data.dep3No = record.get('dep3No');
        data.dep3Zone = record.get('dep3Zone');
        data.dep3Addr = record.get('dep3Addr');
        data.peopleSend = record.get('peopleSend');
        data.dep3Name = record.get('dep3Name');
        data.transType = record.get('transType');
        data.group = record.get('group');
        data.children = record.get('children');
        data.isEdit = true;
        Ext.getStore('Dep3List').add(data);
    }
});