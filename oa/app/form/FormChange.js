/*
 機關代碼交換
 */

Ext.define('OA.form.FormChange', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormChange',
    xtype: "FormChange",
    config: {
        width: '80%',
        height: 480,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
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
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                defaults: {
                    labelWidth: '20%'
                },
                items: [
                    {
                        xtype: 'selectfield',
                        name: 'KEY',
                        label: '本　　別',
                        id: 'keyType',
                        valueField: 'value',
                        displayField: 'key',
                        listeners: {
                            change: function (ctr, newValue, oldValue, eOpts, e) {
                                if (oldValue) {
                                    var me = ctr.up('formpanel');
                                    var Record = me.getRecord();
                                    if (Record && Record.data.KEY == oldValue) {
                                        Record.set('KEY', newValue);
                                        if (newValue && newValue === '正本') {
                                            Record.set('ATTACH', 'Y');
                                        } else if(newValue && newValue === '副本') {
                                            Record.set('ATTACH', 'N');
                                        }
                                        me.create(Record);
                                    }

                                }
                                var panelchange = Ext.getCmp('PanelChange');
                                if (panelchange && oldValue) {
                                    panelchange.changeSort(oldValue);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'selectfield',
                        name: 'TRANSTYPE',
                        label: '傳送方式',
                        valueField: 'ofCode',
                        displayField: 'ofDesc',
                        store: 'SendWay',
                        listeners: {
                            change: function (ctr, newValue, oldValue, eOpts) {
                                var form = ctr.up('formpanel');
                                if (form.getRecord()) {
                                    var jsonItems = form.getRecord().get('children');
                                    if (jsonItems && jsonItems.length > 0) {
                                        try {
                                            var items = JSON.parse(jsonItems);
                                            Ext.Array.each(items, function (item) {
                                                item.transType = newValue;
                                            });
                                            form.getRecord().set('children', JSON.stringify(items));
                                        } catch (e) {
                                            console.log(jsonItems);
                                        }
                                    }

                                    if (newValue && newValue == '2') {
                                        form.setValues({ PEOPLESEND: 'Y', REALTRANSTYPE: '2' });
                                        //form.doLzwzip();
                                    }
                                    var hasAtt = Ext.getCmp('hasAtt');
                                    if (hasAtt) {
                                        hasAtt.setDisabled(false);
                                        if (ctr.record.get('ofDesc') == '內部傳遞') {
                                            hasAtt.setValue('含附件');
                                            hasAtt.setDisabled(true);
                                        }
                                    }                                   
                                }
                            }
                        }
                    },
                    {
                        xtype: 'selectfield',
                        name: 'ATTACH',
                        label: '含附件',
                        id: 'hasAtt',
                        valueField: 'value',
                        displayField: 'key',
                        hidden: true,
                        disabled: false
                    },
                    {
                        label: '是否郵寄',
                        xtype: 'textfield',
                        name: 'PEOPLESEND',
                        hidden: true
                    },
                    {
                        label: '受文者全銜',
                        name: 'CODENAME',
                        id: 'codename',
                        xtype: 'autocompletefield',
                        config: {
                            store: 'Dep3List',
                            proxy: {
                                type: 'rest',
                                useDefaultXhrHeader: false,
                                withCredentials: true,
                                writer: {
                                    type: 'json',
                                    encodeRequest: true
                                },
                                reader: {
                                    type: 'json',
                                    rootProperty: 'children'
                                }
                            },
                            resultsHeight: 300
                        },
                        listeners: {
                            select: function (ctr, record, eOpts) {
                                var me = ctr.up('formpanel');
                                if (record.data.children && record.data.children.length > 0) {
                                    if (!me.getRecord().data.children || me.getRecord().data.children.length == 0) {
                                        me.getRecord().data.children = record.data.children;
                                        me.getRecord().data.VALUE = record.data.dep3Name;
                                        me.setValues({ VALUE: record.data.dep3Name });
                                        me.getRecord().data.GROUP = '1';                                        
                                    }
                                }
                                //me.setValues({ CODE: record.get('dep3No') });
                                //修復受文者全銜用刪除文字的方式 並不會強制更新代碼錯誤 -- by joshua kang
                                me.setValues({ CODE: record.get('dep3No'), VALUE: record.get('dep3Name'), ARCENO: record.get('dep3Zone'), ADDR: record.get('dep3Addr') });

                            }
                        }
                        // xtype: 'textfield',
                        // listeners: {
                        //     focus: function (ctr, e, eOpts) {
                        //         var me = ctr.up('formpanel');
                        //         me.setOldValue(me.getValues().CODENAME);
                        //     },
                        //     blur: function (ctr, e, eOpts) {
                        //         var me = ctr.up('formpanel');
                        //         me.g2bSearch({dep3No: '', dep3ChnName: me.getValues().CODENAME});
                        //     }
                        // }
                    },
                    {
                        label: '機關代碼',
                        xtype: 'textfield',
                        name: 'CODE',
                        readOnly: true,
                        listeners: {
                            focus: function (ctr, e, eOpts) {
                                var me = ctr.up('formpanel');
                                me.setOldValue(me.getValues().CODENAME);
                            },
                            blur: function (ctr, e, eOpts) {
                                var me = ctr.up('formpanel');
                                me.g2bSearch({dep3No: me.getValues().CODE, dep3ChnName: ''});
                            }
                        }
                    },
                    {
                        label: '受文者名稱',
                        xtype: 'textfield',
                        name: 'VALUE',
                        listeners: {
                            focus: function (ctr, e, eOpts) {
                                var me = ctr.up('formpanel');
                                me.setOldValue(me.getValues().VALUE);
                            },
                            blur: function (ctr, e, eOpts) {
                                var me = ctr.up('formpanel');
                                var store = Ext.getStore('Contact');
                                var has = false;
                                Ext.Array.each(store.getData().all, function (r) {
                                    if (r.get('VALUE') == ctr.getValue() &&
                                        ctr.getValue() != me.getOldValue() &&
                                        r.get('id') != me.getRecord().get('id')) has = true;
                                });

                                if (has) {
                                    Ext.Msg.alert('已有相同受文者！');
                                    ctr.setValue(me.getOldValue());
                                }
                            }
                        }
                    },
                    {
                        label: '郵遞區號',
                        xtype: 'textfield',
                        name: 'ARCENO',
                        listeners: {
                            focus: function (ctr, e, eOpts) {
                                var me = ctr.up('formpanel');
                                me.setOldValue(me.getValues().ARCENO);
                            },
                            blur: function (ctr, e, eOpts) {
                                var me = ctr.up('formpanel');
                                if ((me.getValues().TRANSTYPE + '').trim() == '2') {
                                    if ((me.getValues().ARCENO + '').trim() != '' &&
                                        (me.getValues().ARCENO + '').trim() !== (me.getOldValue() + '').trim()) {
                                        me.doAddressZip();
                                    }
                                }
                            }
                        }
                    },
                    {
                        label: '地　　址',
                        xtype: 'textfield',
                        name: 'ADDR',
                        listeners: {
                            blur: function (ctr, e, eOpts) {
                                var values = ctr.up('formpanel').getValues();
                                // if (values.ADDR) ctr.up('formpanel').doLzwzip();
                            }
                        }
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [                   
                    {xtype: 'spacer'},
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '10%',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var r = form.getRecord();
                            var values = form.getValues();

                            if (values.CODENAME == undefined) {
                                var codename = Ext.getCmp('codename');
                                if (codename) {
                                    values.CODENAME = codename.currentShownValue;
                                }
                            }

                            if (values.TRANSTYPE == '9') {
                                if (values.CODE == '' || values.CODE == undefined) {
                                    Ext.Msg.alert('提示', '電子交換，機關代碼與受文者全銜不可空白！');
                                    return;
                                }
                            }

                            if (values.KEY == '抄本') {
                                Ext.Msg.confirm("提醒", "抄本將不列印紙本送發，請再確認是變更為抄本？", function (ok) {
                                    if ('yes' == ok) {
                                        var store = Ext.getStore('Contact');

                                        var has = false;
                                        store.each(function (item) {
                                            var isSameValue = item.get('VALUE') == values.VALUE;
                                            if (isSameValue && item.get('ARCENO') == '') {
                                                item.set('ARCENO', values.ARCENO);
                                            }
                                            var isNotSameId = item.get('id') != r.get('id');
                                            if (isSameValue && isNotSameId) {
                                                has = true;
                                            }
                                        });

                                        if (has) {
                                            Ext.Msg.alert('已有相同受文者！');
                                            return;
                                        }

                                        //
                                        var doCheckCangeSendDate = false;
                                        var edition = OA.common.VIMgr.getCurrentEdition();
                                        var hadExchange = OA.common.VIMgr.hadExchange();
                                        if (edition.交換狀態 == '1' && hadExchange) doCheckCangeSendDate = true;
                                        if (doCheckCangeSendDate && r.stores) {
                                            var old = r.stores[0].getData();
                                            if (old.all && old.all.length > 0) {
                                                var oldData = old.items[old.all.length - 1];
                                                var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                                                if (oldData != undefined) {
                                                    for (var name in values) {
                                                        if (oldData.get(name)) {
                                                            if ((oldData.get(name) + '') !== values[name]) {
                                                                if (ctrWK) ctrWK.set('sendDataChange', true);
                                                                //console.log(ctrWK.get('sendDataChange'));
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    if (ctrWK) ctrWK.set('sendDataChange', true);
                                                }
                                            }
                                        }

                                        for (var name in values) {
                                            if (values.hasOwnProperty(name) && r) r.set(name, values[name]);
                                        }
                                        //要設為null不然下次點會抓到前一筆
                                        form.setRecord(null);
                                        form.hide();

                                        form.restoreScroller();
                                        // 判斷已存檔功能 - by yi-chi chiu
                                        OA.app.isSavedFlag = false;


                                    } else {
                                        return
                                    }
                                });
                                return;
                            } else {
                                var store = Ext.getStore('Contact');

                                var has = false;
                                store.each(function (item) {
                                    var isSameValue = item.get('VALUE') == values.VALUE;
                                    if (isSameValue && item.get('ARCENO') == '') {
                                        item.set('ARCENO', values.ARCENO);
                                    }
                                    var isNotSameId = item.get('id') != r.get('id');
                                    if (isSameValue && isNotSameId) {
                                        has = true;
                                    }
                                });

                                if (has) {
                                    Ext.Msg.alert('已有相同受文者！');
                                    return;
                                }

                                //
                                var doCheckCangeSendDate = false;
                                var edition = OA.common.VIMgr.getCurrentEdition();
                                var hadExchange = OA.common.VIMgr.hadExchange();
                                if (edition.交換狀態 == '1' && hadExchange) doCheckCangeSendDate = true;
                                if (doCheckCangeSendDate && r.stores) {
                                    var old = r.stores[0].getData();
                                    if (old.all && old.all.length > 0) {
                                        var oldData = old.items[old.all.length - 1];
                                        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                                        if (oldData != undefined) {
                                            for (var name in values) {
                                                if (oldData.get(name)) {
                                                    if ((oldData.get(name) + '') !== values[name]) {
                                                        if (ctrWK) ctrWK.set('sendDataChange', true);
                                                        //console.log(ctrWK.get('sendDataChange'));
                                                    }
                                                }
                                            }
                                        } else {
                                            if (ctrWK) ctrWK.set('sendDataChange', true);
                                        }
                                    }
                                }

                                for (var name in values) {
                                    if (values.hasOwnProperty(name) && r) r.set(name, values[name]);
                                }
                                //要設為null不然下次點會抓到前一筆
                                form.setRecord(null);
                                form.hide();

                                form.restoreScroller();
                                // 判斷已存檔功能 - by yi-chi chiu
                                OA.app.isSavedFlag = false;

                            }                            
                        }
                    }
                ]
            }
        ],
        oldValue: '',
        yPosition:0
    },
    create: function (data) {
        this.setRecord(null);   //0707 正本 副本 打開內容 點擊空白處亂跳問題 Chloe.sia
        var toolbarSort = Ext.getCmp('toolbarSort');
        if (toolbarSort) {
            var keyType = Ext.getCmp('keyType');
            var ctr = toolbarSort.getItems();
            var items = [];
            Ext.Array.each(ctr.items, function (item) {
                if (!item.config.text || item.config.text == '刪除全部' || item.config.text == '更新郵遞區號') return true;
                items.push({value: item.getText(), key: item.getText()});
            });
            var hasAtt = Ext.getCmp('hasAtt');
            if (hasAtt) {
                hasAtt.setOptions([{ value: 'N', key: '不含附件' }, { value: 'Y', key: '含附件' }]);
                if (data.getData().KEY == '副本') {
                    hasAtt.setHidden(false);
                    if (data.getData().ATTACH === 'Y') {
                        hasAtt.setValue('含附件');
                    }

                    //內部傳遞一律含附件不可調整
                    if ((data.getData().TRANSTYPE + '') == '8') {
                        data.set('ATTACH', 'Y');
                        hasAtt.setValue('含附件');
                        hasAtt.setDisabled(true);
                    } else {
                        hasAtt.setDisabled(false);
                    }
                } else {
                    hasAtt.setHidden(true);
                    data.getData().ATTACH = 'Y';
                }
            }

            keyType.setOptions(items);
            keyType.setValue(data.getData().KEY);


            Ext.getStore('SendWay').setData(null);
            if (data.getData().KEY === '抄本') {

                var qd = OA.common.Global.getQueryDefault();
                //console.log(qd);
                if (!qd) return;

                var sendways = qd.傳送方式;
                if (sendways) {
                    var ways = [];
                    for (var ofkey in sendways) {
                        if (sendways.hasOwnProperty(ofkey)) {
                            var way = sendways[ofkey];
                            if (way.ofDesc == '抄本') {
                                ways.push({ ofDesc: way.ofDesc, ofCode: way.ofCode, dcsnLevel: way.dcsnLevel });
                                Ext.getStore('SendWay').addData(ways);
                            }
                            ///var isEnable = way.isEnable == 'N';
                            //if (!isEnable) ways.push({ ofDesc: way.ofDesc, ofCode: way.ofCode, dcsnLevel: way.dcsnLevel });
                        }
                    }
                }

            } else {               
                Ext.getStore('SendWay').doInit(true);
            }
        }
        this.setRecord(data);
        this.setYPosition(data.getData().yPosition);
    },

    doAddressZip: function () {
        var me = this;
        var values = me.getValues();
        var zipcode = Ext.clone(values.ARCENO);
        if (!zipcode) return;

        me.setMasked({ xtype: 'loadmask', message: '處理中...' });

        OA.client.Lzwzip.Addresszip(zipcode, function (resp) {
            if (resp.success && resp.zipAddr != '') {
                if ((values.ADDR + '').trim() == '') {
                    me.setValues({ ADDR: resp.zipAddr });
                    me.setMasked(false);
                } else if ((me.getOldValue() + '').trim() != '' &&
                    (resp.zipAddr + '').trim() !== (me.getOldValue() + '').trim()) {
                    Ext.Msg.confirm('提醒', '郵遞區號已變更是否變更地址？', function (fn) {
                        if (fn === 'yes') {
                            me.setValues({ ADDR: resp.zipAddr });
                            me.setMasked(false);
                        } else {
                            me.setMasked(false);
                        }
                    });
                }
            } else {
                me.setMasked(false);
            }
        });
    },

    doLzwzip: function () {
        var me = this;
        var values = me.getValues();
        var addr = values.ADDR;
        if (!addr) return;

        me.setMasked({xtype: 'loadmask', message: '處理中...'});
        OA.client.Lzwzip.excute({action: 'getZipCode32', source: addr}, function (resp) {
            me.setMasked(false);
            me.setValues({ARCENO: resp.code}); //resp.address <- new address
        });
    },

    g2bSearch: function (options) {
        var me = this;
        if (options.dep3ChnName && options.dep3ChnName == me.getOldValue()) return;
        if (options.dep3No && options.dep3No == me.getOldValue()) return;

        var data = {};
        data.dep3No = options.dep3No;
        data.dep3ChnName = options.dep3ChnName;

        var paras = OA.common.Global.getInitParas();
        data.qType = '0';
        data.start = 0;
        data.limit = 1;
        data.depNo = paras.depNo;
        data.empNo = paras.empNo;

        OA.client.Member.search(data, function (ret) {
            if (options.dep3ChnName) {
                if (ret.length == 0) {
                    me.setValues({CODE: ''});
                    return;
                }
                var dep3No = ret[0].get('dep3No');
                var dep3Name = ret[0].get('dep3Name');

                if (dep3Name == data.dep3ChnName) {
                    me.setValues({CODE: dep3No, VALUE: dep3Name});
                } else {
                    me.setValues({CODE: ''});
                }
            } else {
                if (ret.length == 0) {
                    Ext.Msg.alert('找不到可用的機關代碼');
                    return;
                }
                if (ret[0].get('dep3No') !== data.dep3No) Ext.Msg.alert('找不到可用的機關代碼');
            }
        });
    },

    restoreScroller:function(){
        //回復上次捲軸位置
        var list =Ext.getCmp('PanelChange').query('list')[0];
        list.getScrollable().getScroller().scrollTo(0, this.getYPosition(), {duration: 0});
    }
});