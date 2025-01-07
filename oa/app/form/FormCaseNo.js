/*
 檔號分類號/查詢視窗
 */

/* 抽離通用模板 commonTpl : 查詢視窗列表內容, 檔號-分類號 item */
const itemTitle = '{fsKindno} / {caseno} - {fsYrlimit}'; // 主標題
const itemDetailContent = itemTitle + ' {casenoName} '; // 詳細內容
const itemDetailIcon = '<span style="float: right;" id="showDetail">...</span>'; //  '...' 細節 icon
const commonTpl = new Ext.XTemplate( // 通用模板 commonTpl 共用
    '<tpl if="this.forEver(fsYrlimit)">',
    '<p style="font-size:110%;" title="' + itemDetailContent + '" >'+ itemTitle + itemDetailIcon +'</p>',
    '<tpl else>',
    '<p style="font-size:110%;" title="' + itemDetailContent + '年" >' + itemTitle + ' 年 ' + itemDetailIcon + '</p>',
    '</tpl>',
    {
        forEver: function (fsYrlimit) {
            return fsYrlimit === '永久';
        }
    }
);


Ext.define('OA.form.FormCaseNo', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormCaseNo',
    xtype: 'FormCaseNo',
    requires: ['OA.client.Member'],
    config: {
        standardSubmit: false,
        listeners: {
            beforesubmit: function (form, values, options, eOpts) {
                return false;
            }
        },
        width: '50%',
        height: '70%',
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
                        id: 'selectCaseNo',
                        xtype: 'selectfield',
                        valueField: 'value',
                        displayField: 'key',
                        value: '1',
                        store: {
                            data: [
                                { key: '分類號', value: '1' },
                                { key: '案名（依名稱搜尋）', value: '2' }
                            ]
                        }
                    },
                    {
                        id: 'txtCaseNo',
                        xtype: 'textfield',
                        listeners: {
                            clearicontap: function (ctr, e, eOpts) {
                                var stroe = Ext.getStore('CaseNo');
                                if (stroe) stroe.clearFilter();
                            }
                            // ,keyup: function (ctr, e, eOpts) {
                            //     var stroe = Ext.getStore('CaseNo');
                            //     var key = Ext.getCmp('selectCaseNo');
                            //     // console.log(ctr.getValue());
                            //     // console.log(newValue);
                            //     if (stroe) {
                            //         stroe.clearFilter();
                            //         if (key.getValue() == '1') {
                            //             stroe.filterBy(function (rec, id) {
                            //                 if (rec.data.fsKindno && rec.data.fsKindno.indexOf(ctr.getValue()) >= 0)
                            //                     return true;
                            //                 else
                            //                     return false;
                            //             });
                            //         } else {
                            //             stroe.filterBy(function (rec, id) {
                            //                 if (rec.data.fsKindname && rec.data.fsKindname.indexOf(ctr.getValue()) >= 0)
                            //                     return true;
                            //                 else
                            //                     return false;
                            //             });
                            //         }
                            //     }
                            // }
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
                id: 'listQuery',
                height: 450,
                xtype: 'list',
                scrollable: 'vertical',
                store: 'CaseNo',
                itemTpl: commonTpl,
                listeners: {
                    itemtap: function (list, index, item, record, event) {

                        // 按下 ..., 跳出完整名稱
                        if(event.target.id.indexOf("showDetail") === 0) {
                            this.up('formpanel').showFsKindnoDetail(record);
                            return; 
                        }
                        list.up('formpanel').hide();
                        // 更新 FormFileYear視窗欄位
                        this.up('formpanel').setFormFileYear(record,false);
                    }
                }
            },
            {
                id: 'listKind',
                hide: true,
                height: 450,
                //height: 500,
                xtype: 'list',
                scrollable: 'vertical',
                store: 'CaseNo',
                itemTpl: commonTpl,
                listeners: {
                    itemtap: function (list, index, item, record, event) {

                        // 按下 ..., 跳出完整名稱
                        if(event.target.id.indexOf("showDetail") === 0) {
                            this.up('formpanel').showFsKindnoDetail(record);
                            return; 
                        }
                        list.up('formpanel').hide();
                        // 更新 FormFileYear視窗欄位
                        this.up('formpanel').setFormFileYear(record,true);
                    }
                }
            },
            {
                id: 'listCase',
                height: 450,
                hide: true,
                xtype: 'list',
                scrollable: 'vertical',
                store: 'CaseNo',
                itemTpl: commonTpl,
                listeners: {
                    itemtap: function (list, index, item, record, event) {

                        // 按下 ..., 跳出完整名稱
                        if(event.target.id.indexOf("showDetail") === 0) {
                            this.up('formpanel').showFsKindnoDetail(record);
                            return; 
                        }
                        list.up('formpanel').hide();
                        // 更新 FormFileYear視窗欄位
                        this.up('formpanel').setFormFileYear(record,true);
                    }
                }
            }            
        ]
    },
    initialize: function () {
        var me = this;
        this.callParent(arguments);

        var txtCaseNo = Ext.getCmp('txtCaseNo');
        var input = txtCaseNo.element.dom.querySelector('input');
        //IME
        var ime = false;
        $(input).on('compositionstart', function () {
            ime = true;
        }).on('compositionend', function () {
            ime = false;
            me.doChange(this.value);
        }).on('compositionupdate', function () {
            ime = true;
        });
        $(input).on('input', function () {
            if (ime) return;
            me.doChange(this.value);
        })
    },
    create: function (data) {
        var yearNo = '';
        var txtCaseNo = Ext.getCmp('txtCaseNo');
        var fileyearForm = Ext.getCmp('FormFileYear');
        var store = Ext.getStore('CaseNo');
        if (store) store.clearFilter();
        if (fileyearForm) {
            var values = fileyearForm.getValues();
            if (values && values.年度 && values.年度.trim().length > 0) {
                yearNo = values.年度.trim();
            } else {
                var dt = new Date();
                yearNo = dt.getFullYear() - 1911;
            }
        }
        //console.log(data);
        if (data) {
            var selectCaseNo = Ext.getCmp('selectCaseNo');
            if (selectCaseNo) selectCaseNo.setValue('1');
            if (store) {
                if (data.key == 'case') {
                    Ext.getCmp('listQuery').setHidden(true);
                    Ext.getCmp('listKind').setHidden(true);
                    Ext.getCmp('listCase').setHidden(false);
                    if (txtCaseNo) txtCaseNo.setValue(data.value);
                    store.filterBy(function (rec, id) {
                        if (rec.data.fsKindno && rec.data.fsKindno.indexOf(data.value) >= 0)
                            return true;
                        else
                            return false;
                    });

                    OA.common.Utils.indicatorWith('listCase');
                } else {
                    var kindlist = [];
                    store.filterBy(function (rec, id) {
                        if (kindlist.length > 0) {
                            if (kindlist.indexOf(rec.data.kindName + '-' + rec.data.fsKindno) >= 0) {
                                return false;
                            } else {
                                kindlist.push(rec.data.kindName + '-' + rec.data.fsKindno);
                                return true;
                            }
                        } else {
                            kindlist.push(rec.data.kindName + '-' + rec.data.fsKindno);
                            return true;
                        }
                    });
                    if (txtCaseNo) txtCaseNo.setValue('');
                    Ext.getCmp('listQuery').setHidden(true);
                    Ext.getCmp('listKind').setHidden(false);
                    Ext.getCmp('listCase').setHidden(true);

                    OA.common.Utils.indicatorWith('listKind');
                }
            }
        }
        else {
            txtCaseNo.setValue('');
            Ext.getCmp('listQuery').setHidden(false);
            Ext.getCmp('listKind').setHidden(true);
            Ext.getCmp('listCase').setHidden(true);

            OA.client.Member.loadCaseNo(OA.common.Global.getCurrentDept().depNo, yearNo, function () {
                OA.common.Utils.indicatorWith('listQuery');
            });
        }
    },
    doChange: function (value) {
        var stroe = Ext.getStore('CaseNo');
        var key = Ext.getCmp('selectCaseNo');
        if (stroe) {
            stroe.clearFilter();
            if (key.getValue() == '1') {
                stroe.filterBy(function (rec, id) {
                    if (rec.data.fsKindno && rec.data.fsKindno.indexOf(value) >= 0)
                        return true;
                    else
                        return false;
                });
            } else {
                stroe.filterBy(function (rec, id) {
                    if (rec.data.fsKindname && rec.data.fsKindname.indexOf(value) >= 0)
                        return true;
                    else
                        return false;
                });
            }
        }
    },
    
    /*
     * (一) 公文製作中選擇檔號時，增加顯示分類號的內容描述。
     * (第 6 次專案工作會議) 
     */
    showFsKindnoDetail(record) {
        const fsKindno = record.get('fsKindno');
        const caseno = record.get('caseno');
        const fsYrlimit = record.get('fsYrlimit');
        const casenoName = record.get('casenoName');
        Ext.Msg.alert("", fsKindno + "/" + caseno + "-" + fsYrlimit + "(" + casenoName + ")");
        return;
    },
    /*
     * 於 年份檔號視窗 FormFileYear.js 帶入值 
     */
    setFormFileYear(record, isListKind) {
        var searchForm = Ext.getCmp('FormCaseNoSearch');
        if (searchForm) searchForm.hide();
        var vm = OA.common.Global.getCurrentViewModel();
        vm.保存年限 = record.get(isListKind?'':'fsYrlimit');
        vm.分類號 = record.get('fsKindno').toString();
        vm.案次號 = record.get(isListKind?'':'caseno').toString();
        vm.年度 = record.get('startDate');
        if (Ext.getCmp('txtCaseNo')) Ext.getCmp('txtCaseNo').setValue('');
        OA.common.Fields.popupFromShow('檔號');
    }
});