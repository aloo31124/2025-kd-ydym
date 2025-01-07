/*
 分址分文選附件
 */

Ext.define('OA.form.FormChooseAtt', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormChooseAtt',
    xtype: 'FormChooseAtt',
    requires: ['OA.model.ChooseAtt', 'Ext.plugin.ListPaging', 'Ext.plugin.SortableList', 'OA.common.NestedListPaging'],
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
                        id: 'codeName',
                        text: ''
                    },
                    { xtype: 'spacer' },                    
                    {
                        ui: 'plain', text: '全選', action: 'allIn', id:'allInChooseAtt',
                        handler: function (button) {
                            Ext.getStore('chooseAttStore').each(function (item, index, length) {
                                item.set('isElect', true);
                            });
                        }
                    },
                    {
                        ui: 'plain', text: '全刪', action: 'allDel', id:'allDelChooseAtt',
                        handler: function (button) {
                            Ext.getStore('chooseAttStore').each(function (item, index, length) {
                                item.set('isElect', false);
                            });
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
                                id: 'chooseAttList',
                                height: 420,
                                xtype: 'list',
                                scrollable: 'vertical',
                                disableSelection: true,
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
                                   
                                    '<td width="80%">',
                                    '<p style="font-size:130%;">',
                                    '&emsp;{ attName }',
                                    '</p>',
                                    '</td >' ,                                    
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
                        id: 'txtChooseAtt',
                        xtype: 'textfield',
                        listeners: {
                            clearicontap: function (ctr, e, eOpts) {
                                var Dep3Child = Ext.getStore('chooseAttStore');
                                if (Dep3Child) {
                                    Dep3Child.clearFilter();
                                }
                            },
                            keyup: function (ctr, e, eOpts) {
                                var chooseAttStore = Ext.getStore('chooseAttStore');
                                if (chooseAttStore) {
                                    chooseAttStore.clearFilter();
                                    chooseAttStore.filterBy(function (rec, id) {
                                        //console.log(rec);
                                        if (rec.data.attName.indexOf(ctr.getValue()) >= 0)
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
                        text: '關閉',
                        action: 'no',
                        scope: this,
                        hasDisabled: false,
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    },
                    {
                        ui: 'confirm',
                        id: 'dep3ChildOK',
                        text: '確定',
                        action: 'ok',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var record = form.getRecord();
                            var choose = [];

                            Ext.getStore('chooseAttStore').each(function (item, index, length) {
                                if (item.data.isElect) choose.push(item.data.attName);
                            });
                            var atts = choose.join('、') || '';
                            //console.log(record)
                            record.set('chooseAtt', atts);

                            //更新VM中的受文者資料
                            var vm = OA.common.Global.getCurrentViewModel();
                            if (vm && vm.ContactList) {
                                //console.log(record);
                                Ext.Array.each(vm.ContactList, function (contact) {
                                    if (contact.VALUE == record.get('VALUE') &&
                                        contact.CODENAME == record.get('CODENAME')) {
                                        contact.chooseAtt = atts;
                                    }
                                })
                            }
                            OA.common.Global.setCurrentViewModel(vm);

                            var txtChooseAtt = Ext.getCmp('txtChooseAtt');
                            if (txtChooseAtt) txtChooseAtt.setValue('');

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
        Ext.getCmp('chooseAttList').setHeight(h);
    },
    create: function (record) {
        //console.log(record);
        var title = record.get('CODENAME');

        Ext.getCmp('codeName').setText(title);
        var store = Ext.getStore('chooseAttStore');
        if (!store) {
            store = Ext.create("Ext.data.Store", {
                id: 'chooseAttStore',
                model: 'OA.model.ChooseAtt',
                autoSync: true,
                autoLoad: true
            });
        }
        store.removeAll();
        store.sync();
        store.clearFilter();

        var beforeChoose = [];

        if (record.get('chooseAtt') && record.get('chooseAtt').length > 0) {
            beforeChoose = record.get('chooseAtt').split('、');
        }

        //取出所可發文的附件       
        var attachItem = OA.common.InitParas.getAttachItem();
        if (attachItem && attachItem.vi) {
            var attachsAdd = attachItem.vi.where("( el, i, res, param ) =>el.folderName =='attach'&&el.status!='0'");
            if (attachsAdd && attachsAdd.length > 0) {
                var index = 1;
                Ext.Array.each(attachsAdd, function (att) {
                    //console.log(beforeChoose);
                    if (beforeChoose.indexOf(att.fileKey) != -1) {
                        store.addData({
                            number: index,
                            attName: att.fileKey,
                            isElect: true
                        });
                    } else {
                        store.addData({
                            number: index,
                            attName: att.fileKey,
                            isElect: false
                        });
                    }
                   
                    //canSendAtts.push();
                    //store.addData(canSendAtts);
                    index++;
                })
            }
        }

        //console.log(store);  
        Ext.getCmp('chooseAttList').setStore(store);
        OA.common.Utils.indicatorWith('chooseAttList');
       
        this.setRecord(record);      
    }
});