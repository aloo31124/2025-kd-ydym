/*
 常用檔號（目前沒用到）
 */
Ext.define('OA.form.FormCaseNoTemplates', {
    extend: 'Ext.Panel',
    xtype: "FormCaseNoTemplates",
    id: 'FormCaseNoTemplates',
    config: {
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        width: '50%',
        height: '70%',
        style: 'font-size:20px',
        activeTab: 1,
        defaults: {
            scrollable: true
        },
        layout: 'vbox',
        items: [
            {
                height: 500,
                autoHeight: true,
                xtype: 'list',
                scrollable: 'vertical',
                id: 'listTemplatesCaseNo',

                itemTpl: new Ext.XTemplate(
                    /*
                    '<table>',
                    '<tr>',
                    '<td width="55%">',
                    '<p style="font-size:90%;">',
                    '{fsKindname} (   {startDate}   )  ',
                    '</p>',
                    '<p style="font-size:110%;"> 分類號：{fsKindno}     案次號：{caseno}    年限：{fsYrlimit}</p>',
                    '</td>',
                    '<td width="5%"><span class="flow-move"></span></td>',
                    '</tr>',
                    '</table>'
                    */
                    '<tpl if="this.forEver(fsYrlimit)">',
                    '<p style="font-size:110%;">{fsKindno} / {caseno} - {fsYrlimit}   ( {casenoName} )</p>',
                    '<tpl else>',
                    '<p style="font-size:110%;">{fsKindno} / {caseno} - {fsYrlimit}年 ( {casenoName} )</p>',
                    '</tpl>',
                    {
                        forEver: function (fsYrlimit) {
                            return ('永久' == fsYrlimit);
                        }
                    }
                ),
                infinite: true,
                variableHeights: true,
                plugins: [{xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move'}],
                listeners: [{
                    event: 'dragsort',
                    fn: function (listObject, row, to, from) {
                        var store = Ext.getCmp('listTemplatesCaseNo').getStore();
                        if (store) {
                            // var data = [];
                            // Ext.Array.each(store.data.all, function(item) {
                            //     data.push(item.data);
                            // });
                            // OA.client.Localforage.setCommonlyCaseNo(data);
                            
                            // 常用檔號移至資料庫 - by yi-chi chiu
                            var data = [];
                            var _idx = 0;
                            Ext.Array.each(store.data.all, function(item) {
                                item.data.sortNo = (_idx++).toString();
                                data.push(item.data);
                            });
                            OA.client.Localforage.updateCommonlyCaseNo(data);
                        }
                    }
                }]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {
                        text: '刪除', ui: 'decline', action: 'del', width: '20%',
                        handler: function (button) {
                            // 常用檔號移至資料庫 - by yi-chi chiu
                            var list = Ext.getCmp('listTemplatesCaseNo');
                            if (list.selected.items.length > 0) {
                                // OA.client.Localforage.getCommonlyCaseNo(function(value) {
                                //     if (!value)  {
                                //         return;
                                //     }
                                    
                                //     Ext.Array.each(value, function(item) {
                                //         if (item && item.fsKindno == list.selected.items[0].getData().fsKindno)  {
                                //             Ext.Array.remove(value, item);
                                //         }
                                        
                                //         OA.client.Localforage.setCommonlyCaseNo(value, function() {
                                //             Ext.getCmp('FormCaseNoTemplates').create();
                                //             list.selected.items = [];
                                //         });
                                //     });
                                // });

                                OA.client.Localforage.getCommonlyCaseNo2(function(value) {
                                    if (!value)  {
                                        return;
                                    }
                                    
                                    var formValues = Ext.getCmp('FormFileYear').getValues();
                                    
                                    Ext.Array.each(value, function(item) {
                                        var _item = {
                                            phraseId: item.phraseId,
                                            phrase: JSON.parse(B64.decode(item.phrase)),
                                            phraseNo: item.phraseNo,
                                            sortNo: item.sortNo
                                        }
                                        if (_item && _item.phrase.fsKindno == list.selected.items[0].getData().fsKindno)  {
                                            //console.log(_item.phraseId);
                                            var input = {
                                                phraseId: _item.phraseId,
                                                action: 'delete'
                                            }
                                            OA.client.Phrase.excute(input, function (resp) {
                                                Ext.getCmp('FormCaseNoTemplates').create();
                                                list.selected.items = [];
                                                if(_item.phrase.caseno === formValues.案次號 && _item.phrase.startDate === formValues.年度 &&  _item.phrase.分類號 === formValues.fsKindno &&  _item.phrase.fsYrlimit === formValues.保存年限) {
                                                    var addcommonly = Ext.getCmp('AddCommonlyCaseNo');
                                                    if (addcommonly) {
                                                            addcommonly.iconElement.dom.style.color = '';
                                                    }
                                                }
                                            });
                                        }
                                        
                                        // OA.client.Localforage.setCommonlyCaseNo(value, function() {
                                        //     Ext.getCmp('FormCaseNoTemplates').create();
                                        //     list.selected.items = [];
                                        // });
                                    });
                                });
                            }
                        }
                    },
                    {xtype: 'spacer'},
                    {
                        text: '確定', action: 'open', ui: 'confirm', width: '20%',
                        handler: function (button) {
                            var list = Ext.getCmp('listTemplatesCaseNo');
                            if (list.selected.items.length > 0) {
                                var data = {
                                    年度: list.selected.items[0].getData().startDate,
                                    分類號: list.selected.items[0].getData().fsKindno,
                                    案次號: list.selected.items[0].getData().caseno,
                                    保存年限: list.selected.items[0].getData().fsYrlimit
                                };
                                OA.common.Paper.main().updateFileYear(data);
                                button.up('panel').hide();
                                Ext.getCmp('FormFileYear').hide();
                                // 判斷已存檔功能 - by yi-chi chiu
                                OA.app.isSavedFlag = false;
                            }
                        }
                    },
                    {
                        text: '關閉', action: 'no', width: '20%',
                        handler: function (button) {
                            button.up('panel').hide();
                            Ext.getCmp('FormFileYear').create();
                        }
                    }
                ]
            }
        ]
    },
    create: function () {
        // OA.client.Localforage.getCommonlyCaseNo(function(value) {
        //     if (!value)  {
        //         return;
        //     }
            
        //     //過濾同人同職務單位
        //     value = value.filter(function(item) {
        //         return OA.common.Global.getCurrentUser().empNo == item.empNo && OA.common.Global.getCurrentDept().depNo == item.depNo;
        //     });
        //     var templatesCaseNo = Ext.create("Ext.data.Store", {
        //             id: 'templatesCaseNo',
        //             autoLoad: true,
        //             autoSync: true,
        //             data: value.length > 0 ? value : null
        //         });
        //     Ext.getCmp('listTemplatesCaseNo').setStore(templatesCaseNo);
        //     OA.common.Utils.indicatorWith('listTemplatesCaseNo');
        // });

        OA.client.Localforage.getCommonlyCaseNo2(function(value) {
            // 常用檔號移至資料庫 - by yi-chi chiu
            if (!value)  {
                return;
            }

            var _value = [];
            value.forEach(function(item){
                var _phrase = JSON.parse(B64.decode(item.phrase));
                _value.push({
                    sortNo: item.sortNo,
                    phraseId: item.phraseId,
                    fsKindname: _phrase.fsKindname,
                    startDate: _phrase.startDate,
                    fsKindno: _phrase.fsKindno,
                    fsYrlimit: _phrase.fsYrlimit,
                    caseno: _phrase.caseno,
                    empNo: _phrase.empNo,
                    depNo: _phrase.depNo,
                    orgId: _phrase.orgId
                })
            });


            //過濾同人同職務單位
            _value = _value.filter(function(item) {
                return OA.common.Global.getCurrentUser().empNo == item.empNo && OA.common.Global.getCurrentDept().depNo == item.depNo;
            });

            var templatesCaseNo = Ext.create("Ext.data.Store", {
                    id: 'templatesCaseNo',
                    autoLoad: true,
                    autoSync: true,
                    data: _value.length > 0 ? _value : null
                });
            Ext.getCmp('listTemplatesCaseNo').setStore(templatesCaseNo);
            OA.common.Utils.indicatorWith('listTemplatesCaseNo');
        });
    }
});