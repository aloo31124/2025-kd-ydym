/*
 受文者/正,副本
 */
Ext.define('OA.form.PanelChange', {
    extend: 'Ext.Panel',
    xtype: "PanelChange",
    alias: 'widget.PanelChange',
    id: 'PanelChange',
    requires: ['Ext.SegmentedButton', 'Ext.Toolbar', 'Ext.plugin.SortableList', 'OA.components.AutocompleteField'],
    config: {
        ui: 'dark',
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        width: '80%',
        height: '80%',
        style: 'font-size:20px',
        activeTab: 1,
        stopUpdata:false,
        defaults: {
            scrollable: true
        },
        layout: 'vbox',
        items: [
            {
                id: 'toolbarSort',
                xtype: 'toolbar',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector',
                items: [],
                defaults: {
                    handler: function (button, e, eOpts) {
                        if (!button.config.text) return;
                        if (button.config.text == '刪除全部') {
                            Ext.Msg.confirm('提示', '確定刪除全部受文者？', function (fn) {
                                if (fn === 'yes') {
                                    var store = Ext.getStore('Contact');
                                    if (store) {
                                        store.setData(null);
                                    }
                                } else {
                                    return;
                                }
                            });
                        } else if (button.config.text == '更新郵遞區號') {
                            Ext.getCmp('PanelChange').setStopUpdata(false);
                            //Ext.getCmp('PanelChange').updateDoLzwzip(true, 0);
                        } else if (button.config.text == '副本') {
                            Ext.getCmp('PanelChange').changeSort(button.config.text);
                            Ext.getCmp('PanelChange').getKey()
                        } else if (button.config.text == '正本') {
                            Ext.getCmp('PanelChange').changeSort(button.config.text);
                            Ext.getCmp('PanelChange').getKey()
                        } else if (button.config.text == '抄本') {
                            Ext.getCmp('PanelChange').changeSort(button.config.text);
                            Ext.getCmp('PanelChange').getKey()
                        } else {
                            Ext.getCmp('PanelChange').changeSort(button.config.text);
                        }
                    }
                }
            },
            {
                flex: 1,
                xtype: 'list',
                scrollable: 'vertical',
                store: 'Contact',
                plugins: [{ xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move' }],
                infinite: true,
                variableHeights: true,
                height: '100%',
                listeners: [{
                    event: 'itemtap',
                    fn: function (list, index, item, record, event) {
                        var me = Ext.getCmp('PanelChange');
                        if (event.getTarget('.flow-delete')) {
                            var store = Ext.getStore('Contact');
                            store.remove(record);
                            store.sync();
                            var key = record.get('KEY') || '';
                            me.changeSort(key);
                        } else if (event.getTarget('.flow-group')) {
                            OA.common.Funcs.show('FormChildrenOrgNo', null, record);
                        } else {
                            //註記目前捲軸目前位置
                            record.set('yPosition', list.getScrollable().getScroller().position.y);
                            OA.common.Funcs.show('FormChange', null, record);
                        }
                    }
                    //}]
                },
                {
                    event: 'dragsort',
                    fn: function (list, row, from, to) {
                        if (row && row.getRecord()) {
                            var me = Ext.getCmp('PanelChange');
                            var key = row.getRecord().get('KEY') || '';
                            me.changeSort(key)
                        }
                    }
                }]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                scrollable: false,
                items: [
                    {
                        id: 'inputRecipient',
                        xtype: 'autocompletefield',
                        width: '50%',
                        value: '',
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
                        }
                    },
                    {
                        ui: 'plain', text: '新增', action: 'add',
                        handler: function (button) {
                            var me = Ext.getCmp('PanelChange');
                            var ctr = Ext.getCmp('inputRecipient');

                            setTimeout(function () {
                                ctr.listPanel.hide();
                            }, 500);

                            var item;
                            var key = me.getKey();
                            var items = [];

                            if (key == '抄本') {
                                Ext.Msg.confirm("提醒", "抄本將不列印紙本送發，請再確認是新增為抄本？", function (ok) {
                                    if ('yes' == ok) {
                                        //判斷是否為連續新增受文者
                                        if (ctr.getComponent().getValue().indexOf(',') != -1 && ctr.recordsTemp.length > 1) {

                                            //從recordsTemp中抓出有輸入的受文者名稱
                                            var values = ctr.getComponent().getValue().split(',');
                                            var recordsTemp = ctr.recordsTemp;

                                            Ext.Array.each(values, function (name) {
                                                var rec = recordsTemp.where("( el, i, res, param ) => el.dep3Name=='" + name + "'");
                                                if (rec && rec.length > 0) {
                                                    item = rec[0];
                                                    if (item.children) item.group = '2';
                                                    items.push({
                                                        ADDR: item.dep3Addr || '',
                                                        ARCENO: item.dep3Zone || '',
                                                        CODE: item.dep3No || '',
                                                        CODENAME: item.dep3Name || '',
                                                        GROUP: item.group,
                                                        GROUPLIST: "",
                                                        KEY: key,
                                                        PEOPLESEND: item.peopleSend,
                                                        REALTRANSTYPE: key == '抄本' ? 5 : 9,
                                                        TRANSTYPE: key == '抄本' ? '5' : item.transType,
                                                        TRANSTYPENAME: key == '抄本' ? "抄本" : "紙本",
                                                        TYPE: 1,
                                                        VALUE: item.dep3Name || '',
                                                        tagName: "Contact",
                                                        ATTACH: key == '副本' ? 'N' : 'Y',
                                                        isEdit: true,
                                                        editAtt: (key == '副本'),
                                                        isChange: item.transType != '2' && item.transType != '5' ? 'Y' : 'N',
                                                        children: item.children || ''
                                                    });
                                                };
                                            });
                                            ctr.recordsTemp = [];
                                            ctr.getComponent().setValue('');
                                        } else {
                                            if (ctr.getRecord())
                                                item = ctr.getRecord();
                                            else if (ctr.resultsStore.getData().length > 0) {
                                                Ext.Array.each(ctr.resultsStore.getData().items, function (dep3) {
                                                    if (dep3.raw.dep3Name == ctr.getValue()) {
                                                        item = dep3;
                                                        return false;
                                                    }
                                                });
                                            }

                                            if (item) {
                                                if (item.get('children')) item.set('group', '2');
                                                items.push({
                                                    ADDR: item.get('dep3Addr') || '',
                                                    ARCENO: item.get('dep3Zone') || '',
                                                    CODE: item.get('dep3No') || '',
                                                    CODENAME: item.get('dep3Name') || '',
                                                    GROUP: item.get('group'),
                                                    GROUPLIST: "",
                                                    KEY: key,
                                                    PEOPLESEND: item.get('peopleSend'),
                                                    REALTRANSTYPE: key == '抄本' ? 5 : 9,
                                                    TRANSTYPE: key == '抄本' ? '5' : item.get('transType'),
                                                    TRANSTYPENAME: key == '抄本' ? "抄本" : "紙本",
                                                    TYPE: 1,
                                                    VALUE: item.get('dep3Name') || '',
                                                    tagName: "Contact",
                                                    ATTACH: key == '副本' ? 'N' : 'Y',
                                                    isEdit: true,
                                                    editAtt: (key == '副本'),
                                                    isChange: item.get('transType') != '2' && item.get('transType') != '5' ? 'Y' : 'N',
                                                    children: item.get('children') || ''
                                                });
                                            } else {
                                                if (Ext.util.Format.trim(ctr.getValue() || '') != '') {
                                                    if (!OA.common.Utils.checkSymbolStr(ctr.getValue())) return;
                                                    items.push({
                                                        ADDR: '',
                                                        ARCENO: '',
                                                        CODE: '',
                                                        CODENAME: Ext.util.Format.trim(ctr.getValue()),
                                                        GROUP: '',
                                                        GROUPLIST: "",
                                                        KEY: key,
                                                        PEOPLESEND: '',
                                                        REALTRANSTYPE: key == '抄本' ? 5 : 2,
                                                        TRANSTYPE: key == '抄本' ? '5' : '2',
                                                        TRANSTYPENAME: key == '抄本' ? "抄本" : "紙本",
                                                        TYPE: 1,
                                                        VALUE: Ext.util.Format.trim(ctr.getValue()),
                                                        tagName: "Contact",
                                                        ATTACH: key == '副本' ? 'N' : 'Y',
                                                        isEdit: true,
                                                        editAtt: (key == '副本'),
                                                        isChange: 'N'
                                                    });
                                                }
                                            }
                                        }

                                        me.addContact(items);
                                        ctr.setRecord(null);
                                        ctr.setValue('');
                                        ctr.focus();
                                    } else {
                                        return;
                                    }
                                });
                                return;
                            } else {

                                //判斷是否為連續新增受文者
                                if (ctr.getComponent().getValue().indexOf(',') != -1 && ctr.recordsTemp.length > 1) {

                                    //從recordsTemp中抓出有輸入的受文者名稱
                                    var values = ctr.getComponent().getValue().split(',');
                                    var recordsTemp = ctr.recordsTemp;

                                    Ext.Array.each(values, function (name) {
                                        var rec = recordsTemp.where("( el, i, res, param ) => el.dep3Name=='" + name + "'");
                                        if (rec && rec.length > 0) {
                                            item = rec[0];
                                            if (item.children) item.group = '2';
                                            items.push({
                                                ADDR: item.dep3Addr || '',
                                                ARCENO: item.dep3Zone || '',
                                                CODE: item.dep3No || '',
                                                CODENAME: item.dep3Name || '',
                                                GROUP: item.group,
                                                GROUPLIST: "",
                                                KEY: key,
                                                PEOPLESEND: item.peopleSend,
                                                REALTRANSTYPE: key == '抄本' ? 5 : 9,
                                                TRANSTYPE: key == '抄本' ? '5' : item.transType,
                                                TRANSTYPENAME: key == '抄本' ? "抄本" : "紙本",
                                                TYPE: 1,
                                                VALUE: item.dep3Name || '',
                                                tagName: "Contact",
                                                ATTACH: key == '副本' ? 'N' : 'Y',
                                                isEdit: true,
                                                editAtt: (key == '副本'),
                                                isChange: item.transType != '2' && item.transType != '5' ? 'Y' : 'N',
                                                children: item.children || ''
                                            });
                                        };
                                    });
                                    ctr.recordsTemp = [];
                                    ctr.getComponent().setValue('');
                                } else {
                                    if (ctr.getRecord())
                                        item = ctr.getRecord();
                                    else if (ctr.resultsStore.getData().length > 0) {
                                        Ext.Array.each(ctr.resultsStore.getData().items, function (dep3) {
                                            if (dep3.raw.dep3Name == ctr.getValue()) {
                                                item = dep3;
                                                return false;
                                            }
                                        });
                                    }

                                    if (item) {
                                        if (item.get('children')) item.set('group', '2');
                                        items.push({
                                            ADDR: item.get('dep3Addr') || '',
                                            ARCENO: item.get('dep3Zone') || '',
                                            CODE: item.get('dep3No') || '',
                                            CODENAME: item.get('dep3Name') || '',
                                            GROUP: item.get('group'),
                                            GROUPLIST: "",
                                            KEY: key,
                                            PEOPLESEND: item.get('peopleSend'),
                                            REALTRANSTYPE: key == '抄本' ? 5 : 9,
                                            TRANSTYPE: key == '抄本' ? '5' : item.get('transType'),
                                            TRANSTYPENAME: key == '抄本' ? "抄本" : "紙本",
                                            TYPE: 1,
                                            VALUE: item.get('dep3Name') || '',
                                            tagName: "Contact",
                                            ATTACH: key == '副本' ? 'N' : 'Y',
                                            isEdit: true,
                                            editAtt: (key == '副本'),
                                            isChange: item.get('transType') != '2' && item.get('transType') != '5' ? 'Y' : 'N',
                                            children: item.get('children') || ''
                                        });
                                    } else {
                                        if (Ext.util.Format.trim(ctr.getValue() || '') != '') {
                                            if (!OA.common.Utils.checkSymbolStr(ctr.getValue())) return;
                                            items.push({
                                                ADDR: '',
                                                ARCENO: '',
                                                CODE: '',
                                                CODENAME: Ext.util.Format.trim(ctr.getValue()),
                                                GROUP: '',
                                                GROUPLIST: "",
                                                KEY: key,
                                                PEOPLESEND: '',
                                                REALTRANSTYPE: key == '抄本' ? 5 : 2,
                                                TRANSTYPE: key == '抄本' ? '5' : '2',
                                                TRANSTYPENAME: key == '抄本' ? "抄本" : "紙本",
                                                TYPE: 1,
                                                VALUE: Ext.util.Format.trim(ctr.getValue()),
                                                tagName: "Contact",
                                                ATTACH: key == '副本' ? 'N' : 'Y',
                                                isEdit: true,
                                                editAtt: (key == '副本'),
                                                isChange: 'N'
                                            });
                                        }
                                    }
                                }

                                me.addContact(items);
                                ctr.setRecord(null);
                                ctr.setValue('');
                                ctr.focus();
                            }
                        }
                    },
                    {
                        ui: 'plain', text: '群組', action: 'select',
                        handler: function (button) {
                            //var me = button.up('panel');
                            //if (me.getKey() === '抄本') {
                            //    var SendWay = Ext.getStore('SendWay');
                            //    if (SendWay) {
                            //        var Data = SendWay.data.all.filter(function (n1) {
                            //            return n1.data.ofDesc === '抄本';
                            //        });
                            //        if (Data) SendWay.setData(Data);
                            //    }
                            //} else {
                            Ext.getStore('SendWay').setData(null);
                            Ext.getStore('SendWay').doInit();
                            //}
                            OA.common.Funcs.show('FormOrgNo');
                        }
                    },
                    {
                        text: '匯入', id: 'butDep3FileImExport', hidden: true
                    },
                    {
                        text: '匯出', id: 'butDep3FileExport', hidden: true,
                        handler: function (button) {
                            var form = button.up('panel');
                            form.doExport();
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        text: '確定', action: 'yes', ui: 'confirm',
                        handler: function (button) {
                            var me = button.up('panel');
                            var items = [], data = {};
                            var store = Ext.getStore('Contact');
                            store.clearFilter();
                            Ext.getCmp('toolbarSort').getItems().each(function (item) {
                                if (!item.config.text) return true;
                                items = [];
                                store.filter('KEY', item.getText());
                                store.each(function (r) {
                                    var otherTag = '';
                                    //if (r.get('KEY') === '副本' && r.get('ATTACH') === 'Y')
                                    //    items.push(r.get('VALUE') + '(含附件)');
                                    //else
                                    //    items.push(r.get('VALUE'));

                                    if (r.get('KEY') === '副本' && r.get('ATTACH') === 'Y')
                                        otherTag += '（含附件）';

                                    if (r.get('TRANSTYPE') == '2' && r.get('ADDR') && r.get('ADDR').length > 0)
                                        // otherTag += '(' + r.get('ADDR') + ')';  //正本+地址
                                        otherTag

                                    items.push(r.get('VALUE') + otherTag);
                                });
                                data[item.getText()] = items.join('、');
                                store.clearFilter();  //要清除條件不然第一筆空值，後面的會找不到
                            });
                            OA.common.Paper.main().updateWKContactList(data);

                            var warnMsg = '';

                            store.clearFilter();
                            store.each(function (r) {
                                var transtype = r.get('TRANSTYPE') || '';
                                if (transtype.toString() == '9') {
                                    r.set('isChange', 'Y');
                                    r.set('TRANSTYPENAME', '電子');
                                } else if (transtype.toString() == '2') {
                                    r.set('isChange', 'N');
                                    r.set('TRANSTYPENAME', '紙本');
                                    var addr = r.get('ADDR') || '';
                                    var arceno = r.get('ARCENO') || '';

                                    //群組不檢核
                                    if (r.get('GROUP') == undefined || r.get('GROUP') == 'undefined' || r.get('GROUP') == null) {
                                        if ((r.get('VALUE') + '').trim() != '' && r.get('VALUE') != undefined) {
                                            if ((addr + '').length <= 6) {
                                                if (warnMsg == '') {
                                                    warnMsg += '（' + r.get('VALUE') + '）地址長度不足'
                                                } else {
                                                    warnMsg += '、（' + r.get('VALUE') + '）地址長度不足'
                                                }

                                            }

                                            var checkArceno = true;
                                            //當地址為Email時不檢核郵遞區號
                                            if ((addr + '').length > 2 && (addr + '').indexOf('@') != -1 && (addr + '').indexOf('.') != -1) {
                                                checkArceno = false;
                                            }
                                            if (checkArceno) {
                                                if ((arceno + '').length < 3) {
                                                    if (warnMsg == '') {
                                                        warnMsg += '（' + r.get('VALUE') + '）郵遞區號長度不足';
                                                    } else {
                                                        warnMsg += '、（' + r.get('VALUE') + '）郵遞區號長度不足';
                                                    }
                                                }
                                            }
                                        }
                                    }

                                } else if (transtype.toString() == '8') {
                                    r.set('isChange', 'Y');
                                } else {
                                    r.set('isChange', 'N');
                                }
                            });

                            if (warnMsg != '') {
                                var key = me.getKey();
                                me.changeSort(key);
                                Ext.Msg.alert('提醒', warnMsg + '，請重新調整！');
                                return;
                            }

                            var form = button.up('panel');
                            form.hide();
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                        }
                    }                    
                ]
            }
        ],
        key: '',
        total: [],
    },
    initialize: function () {
        var list = this.down('list');
        var store = Ext.getStore('SendWay');
        var func = {};
        var me = this;
        var qs = OA.common.Global.getQ();

        var tpl = [];
        tpl.push('<table>');
        tpl.push('<tr>');
        tpl.push('<td width="5%">{number}. </td>');
        tpl.push('<tpl if="(isEdit)">');
        tpl.push('<td width="5%"><span class="flow-delete">&nbsp;</span></td>');
        tpl.push('</tpl>');
        tpl.push('<td width="5%">');

        store.each(function (r) {
            var name = r.get('ofCode') + '';
            var text = r.get('ofDesc'), cls = 'recipient-mail';

            if (name == '9') {
                cls = 'recipient-online';
                text = '電';
            } else if (name == '1') {
                cls = 'recipient-paper';
                text = '紙';
            } else if (name == '2') {
                cls = 'recipient-mail';
                text = '寄';
            } else if (name == '6') {
                cls = 'recipient-bulletin';
                text = '貼';
            }

            tpl.push('<tpl if="this.is' + name + '(TRANSTYPE)"><span class="' + cls + '">' + text + '</span></tpl>');
            func['is' + name] = function (TRANSTYPE) {
                return name == TRANSTYPE;
            }
        });

        func['hasAttach'] = function (KEY, ATTACH) {
            return (KEY === '副本' && ATTACH === 'Y');
        };
        func['isGroup'] = function (GROUP) {
            var _group = GROUP + '';
            return _group && _group === '2' || _group === '1' || _group === '3';
        };

        tpl.push('</td>');
        tpl.push('<td width="35%">');
        tpl.push('<p style="font-size:110%;">');

        tpl.push('<tpl if="this.hasAttach(KEY,ATTACH)">');
        tpl.push(' {VALUE} (含附件) ');
        tpl.push('<tpl else>');
        tpl.push(' {VALUE} ');
        tpl.push('</tpl>');

        tpl.push('</p>');
        tpl.push('<p style="font-size:110%;">');
        tpl.push(' {CODE} ');
        tpl.push('</p>');
        tpl.push('</td>');

        tpl.push('<td width="50%">');

        tpl.push('<p style="font-size:110%;">');
        tpl.push('{ARCENO}  {ADDR} ');
        tpl.push('</p>');
        tpl.push('</td>');

        tpl.push('<tpl if="this.isGroup(GROUP)">');
        tpl.push('<td><span class="flow-group"></span></td>');
        tpl.push('</tpl>');

        tpl.push('<tpl if="(isEdit)">');
        tpl.push('<td width="5%"><span class="flow-move"></span></td>');
        tpl.push('</tpl>');
        tpl.push('</tr>');
        tpl.push('</table>');
        tpl.push(func);

        list.setItemTpl(new Ext.XTemplate(tpl));


        //受文者匯入
        if (typeof require !== 'undefined') {
            Papa = require("./resources/thirdparty/PapaParse/papaparse.min.js");
        }

        var reader = new FileReader();
        reader.onloadend = function (e) {
            var paras = OA.common.Global.getInitParas();
            var csvstr = reader.result;
            var csvItems = Papa.parse(csvstr).data;
            csvItems.shift();//移掉第1筆title
            var groupChild = [];
            var data = {};
            var sortKeys = [];
            Ext.getCmp('toolbarSort').getItems().each(function (item) {
                if (!item.config.text) return true;
                sortKeys.push(item.getText());
            });
            var imContact = [];
            Ext.Array.each(csvItems, function (csv) {
                var sendType = '1';//預設紙本
                if (csv[5] == '電子交換') {
                    sendType = '9';
                } else if (csv[5] == '郵寄') {
                    sendType = '2';
                }else if(csv[5] == '人工郵寄'){
                	//added by job 20190326
                	sendType = '2';
                	
                }
				
                var hasAtt = 'Y';
                if (csv[2] == '副本') {
                    if (csv[6] && csv[6] == 'N')
                        hasAtt = 'N';
                }
                if (sortKeys.indexOf(csv[2]) >= 0 && csv[0].trim().length > 0) {
                    if (csv.length == 8) {//從筆硯匯入
                        imContact.push({
                            ADDR: csv[4] || '',
                            ARCENO: csv[3] || '',
                            CODE: '',
                            CODENAME: csv[0] || '',
                            GROUP: '',
                            GROUPLIST: "",
                            KEY: csv[2],
                            PEOPLESEND: '',
                            REALTRANSTYPE: csv[2] == '抄本' ? 5 : 9,
                            //TRANSTYPE: csv[5] == '電子交換' ? 9 : 1,
                            TRANSTYPE: sendType,
                            TRANSTYPENAME: csv[2] == '抄本' ? "抄本" : "紙本",
                            TYPE: 1,
                            VALUE: csv[1] || '',
                            tagName: "Contact",
                            ATTACH: hasAtt,
                            isEdit: true,
                            editAtt: (csv[2] == '副本'),
                            isChange: csv[5] == '電子交換' ? 'Y' : 'N',
                            children: ''
                        });
                    } else if (csv.length == 11) {//從新製作匯入
                        if (csv[7] && csv[9]) {//群組
                            var notPush = false;
                            if (groupChild.indexOf(csv[7]) >= 0) notPush = true;
                            if (!notPush) {
                                var childArray = []
                                csvItems.filter(function (item) {
                                    if (item[7] == csv[7]) {
                                        childArray.push({
                                            dep3Name: item[0],
                                            dep3Zone: item[3],
                                            dep3Addr: item[4],
                                            dep3No: item[10]
                                        })
                                    }
                                });
                                csvItems = csvItems.filter(function (item) {
                                    return item[7] != csv[7];
                                });
                                groupChild.push(csv[7]);
                                imContact.push({
                                    ADDR: '',
                                    ARCENO: '',
                                    CODE: '',
                                    CODENAME: csv[7] || '',
                                    GROUPLIST: "",
                                    KEY: csv[2],
                                    PEOPLESEND: '',
                                    REALTRANSTYPE: csv[2] == '抄本' ? 5 : 9,
                                    //TRANSTYPE: csv[5] == '電子交換' ? 9 : 1,
                                    TRANSTYPE: sendType,
                                    TRANSTYPENAME: csv[2] == '抄本' ? "抄本" : "紙本",
                                    TYPE: 1,
                                    VALUE: csv[1] || '',
                                    tagName: "Contact",
                                    ATTACH: hasAtt,
                                    isEdit: true,
                                    editAtt: (csv[2] == '副本'),
                                    isChange: csv[5] == '電子交換' ? 'Y' : 'N',
                                    children: childArray || '',
                                    except: csv[8],
                                    GROUP: csv[9]
                                });
                            }
                        } else {
                            imContact.push({
                                ADDR: csv[4] || '',
                                ARCENO: csv[3] || '',
                                CODE: '',
                                CODENAME: csv[0] || '',
                                GROUPLIST: "",
                                KEY: csv[2],
                                PEOPLESEND: '',
                                REALTRANSTYPE: csv[2] == '抄本' ? 5 : 9,
                                //TRANSTYPE: csv[5] == '電子交換' ? 9 : 1,
                                TRANSTYPE: sendType,
                                TRANSTYPENAME: csv[2] == '抄本' ? "抄本" : "紙本",
                                TYPE: 1,
                                VALUE: csv[1] || '',
                                tagName: "Contact",
                                ATTACH: hasAtt,
                                isEdit: true,
                                editAtt: (csv[2] == '副本'),
                                isChange: csv[5] == '電子交換' ? 'Y' : 'N',
                                children: csv[7],
                                except: csv[8],
                                GROUP: csv[9]
                            });
                        }
                    }
                }
            });            
            data.qType = '0';
            data.start = 0;
            data.limit = 1;
            data.depNo = paras.depNo;
            data.empNo = paras.empNo;
            //=> 修正匯入受文者資料龐大時無機關代碼 休息50毫秒LOAD機關代碼 -JOSHUA KANG
            var goToRest = 1;
            me.setMasked({ xtype: 'loadmask', message: '處理中...' });
            Ext.Array.each(imContact, function (item) {
                setTimeout(function timer() {
                    data.dep3ChnName = item.CODENAME;
                    OA.client.Member.search(data, function (ret) {
                            if (ret.length != 0) {
                                item.CODE = ret[0].get('dep3No');
                                if (item.children == '' && ret[0].get('children')) {
                                    item.children = ret[0].get('children');
                                    item.GROUP = '2';
                                }
                            }
                            //比對最後一筆了再新增
                            if (item.VALUE == imContact[imContact.length - 1].VALUE) {
                                me.addContact(imContact);
                                me.setMasked(false);
                            }
                        });
                    }, goToRest * 50);
                    goToRest = goToRest + 1;
            });
            //<=

            //Ext.Array.each(imContact, function (item) {
            //    console.log('item:');
            //    console.log(item);
            //    data.dep3ChnName = item.CODENAME
            //    OA.client.Member.search(data, function (ret) {
            //        console.log('ret:');
            //        console.log(ret);
            //        if (ret.length != 0) item.CODE = ret[0].get('dep3No');
            //        //比對最後一筆了再新增
            //        if (item.VALUE == imContact[imContact.length - 1].VALUE)
            //            me.addContact(imContact);
            //    });
            //});
        };

        Ext.getCmp('butDep3FileImExport').setHidden(false);
        Ext.getCmp('butDep3FileExport').setHidden(false);

        var ctr = Ext.getCmp('butDep3FileImExport');
        //離線版不適用index.html
        function addClick() {
            OA.common.FileMgr.openDialog({}, function (files) {
                me.addRows(files[0].fileContent);
            });
        }
        if (qs.app === 'offline') {
            ctr.setHandler(addClick);
            return;
        }
       
        var r = new Resumable({ target: 'index.html' });
        r.assignBrowse(ctr.element.dom);           // addEventListener('click')
        r.on('fileAdded', function (file, event) {
            r.upload();
        });
        r.on('fileSuccess', function (rf) {
            reader.source = rf.file;
            reader.readAsText(rf.file, 'Big5');
            r.removeFile(rf);
        });
        r.on('error', function (message, rf) {
            Ext.Msg.alert("上傳錯誤", message);
        });
    },
    create: function (key, layout, data) {
        var ctr = Ext.getCmp('toolbarSort');
        var items = [];       

        Ext.Array.each(layout, function (lay) {
            var idx = ['正本', '副本', '抄本', '主持人', '出席者', '列席者', '會議主席' , '出列席機關人員' , '敬陳' , '敬致'].indexOf(lay.key);
            if (idx >= 0) {
                //如果有傳key，key的本別要放在最前面
                if (key && key.length > 0 && lay.key == key) {
                    items.unshift({ text: lay.key })
                } else {
                    items.push({ text: lay.key })
                }
            }
        });

        items.push(
            {
                ui: 'plain', text: '含附件', id: 'btnContainAtt', action: 'containAtt', hidden: true,
                handler: function (button) {
                    OA.common.Funcs.show('FormContainAttCC');
                }
            },
            { xtype: 'spacer' },
            // { text: '更新郵遞區號'},           
            { text: '刪除全部' },
            
        );

        items.push(
            { xtype: 'spacer' },
            {
                ui: 'plain',
                text: '✖',
                action: 'no',
                handler: function (button) {
                    var form = button.up('panel');
                    form.hide();
                }
            });
       
        if (!ctr) return;
        if (items.length <= 0) return;
        ctr.setItems(items);


        Ext.Array.each(data.ContactList, function (p) {
            p.isEdit = true;
        });

        //初始化
        var store = Ext.getStore('Contact');
        if (store) {
            store.clearFilter();
            store.setData(null);
            store.sync();
        }

        //依上面本別按鈕重新排序Contact，不然會造成移動失效        
        Ext.Array.each(items, function (item) {
            Ext.Array.each(data.ContactList, function (contact) {
                if (contact.KEY === item.text) {
                    store.addData(contact);
                }
            });
        });

        OA.client.Member.dbInit();

        this.changeSort(key);
    },
    addContact: function (data) {
        var me = this;
        if (!data.length > 0) return;
        var key = this.getKey();
        var store = Ext.getStore('Contact');
        var has = false;
        Ext.Array.each(store.data.all, function (item) {
            if (item.data.VALUE + ''.trim() == data[0].VALUE + ''.trim()) {
                has = true;
                return false;
            }

            if (item.data.children && item.data.children.length > 0) {
                var child = [];
                if (Ext.isArray(item.data.children)) {
                    child = item.data.children;
                } else {
                    child = JSON.parse(item.data.children);
                }

                var except = [];
                if (item.data.except && item.data.except.length > 0) {
                    except = (item.data.except + '').split('、');
                }
                Ext.Array.each(child, function (c) {
                    if (c.dep3Name.trim() == data[0].VALUE.trim() && except.indexOf(data[0].VALUE.trim()) < 0) {
                        has = true;
                        return false;
                    }
                });
            }
        });
        if (!has) {
            store.addData(data);
            store.filter('KEY', key);
        } else {            
            Ext.Msg.alert('已有相同受文者！');
        }

        me.changeSort(key);
    },
    changeSort: function (key) {
        var me = this;
        me.setKey(key);
        Ext.getCmp('toolbarSort').getItems().each(function (item) {
            if (!item.config.text || item.config.ui == 'plain') return true;
            if (item.getText() == key)
                item.setUi('confirm');
            else if (item.getText() == '刪除全部')
                item.setUi('decline');
            else if (item.getText() == '更新郵遞區號')
                item.setUi('action');
            else
                item.setUi('action');
        });

        var store = Ext.getStore('Contact');
        store.clearFilter();
        store.filter('KEY', key);

        var btn = Ext.getCmp('btnContainAtt');
        if (btn) key == '副本' ? btn.setHidden(false) : btn.setHidden(true);

        var num = 1;
        Ext.Array.each(store.data.all, function (item) {
            if (item.get('KEY') == key) {
                item.set('number', num);
                ++num;
                //console.log(num);
            }
        });
        
        // indicatorWith已經包含置頂，這幾行會造成畫面顯示異常 - by yi-chi chiu
        //置頂
        //var list = this.query('list')[0];
        //if (list)  {
        //    list.getScrollable().getScroller().scrollTo(0, -10000, {
        //        duration: 0
        //    });
        //}

        OA.common.Utils.indicatorWith(this);
    },
    doExport: function () {
        var me = this;
        var output = [];
        var store = Ext.getStore('Contact');
        Ext.Array.each(store.data.all, function (record) {
            var d = Ext.clone(record.data);
            delete d.id;
            var sendType = '紙本';//預設紙本
            if (d.TRANSTYPE == '9') {
                sendType = '電子交換';
            } else if (d.TRANSTYPE == '2') {
                sendType = '郵寄';
            }

            //群組要轉成json
            if (d.GROUP && d.children.length > 0) {
                var child = [];
                if (Ext.isArray(d.children)) {
                    child = d.children;
                } else {
                    child = JSON.parse(d.children);
                }
                Ext.Array.each(child, function (item) {
                    output.push({
                        受文者: item.dep3Name || '',
                        顯示名稱: d.VALUE || '',
                        本別: d.KEY || '',
                        郵遞區號: item.dep3Zone || '',
                        地址: item.dep3Addr || '',
                        //發文方式: d.TRANSTYPE == '9' ? '電子交換' : '紙本' || '',
                        發文方式: sendType || '',
                        含附件: d.ATTACH || '',
                        群組: d.CODENAME,
                        除外: d.except || '',
                        群組類別: d.GROUP,
                        機關代碼: item.dep3No
                    });
                });
            } else {
                output.push({
                    受文者: d.CODENAME || '',
                    顯示名稱: d.VALUE || '',
                    本別: d.KEY || '',
                    郵遞區號: d.ARCENO || '',
                    地址: d.ADDR || '',
                    //發文方式: d.TRANSTYPE == '9' ? '電子交換' : '紙本' || '',
                    發文方式: sendType || '',
                    含附件: d.ATTACH || '',
                    群組: '',
                    除外: d.except || '',
                    群組類別: '',
                    機關代碼: ''
                });
            }
        });
        var csv = Papa.unparse(output);
        var blob = new Blob(["\ufeff", csv], {type: "text/csv;charset=utf-8"});
        saveAs(blob, '受文者.csv');
    },
    addRows: function (base64FileContent) {
        var me = this;
        var csvstring = B64.decode(base64FileContent);
        var items = Papa.parse(csvstring).data;
        items.splice(0, 1);       
        Ext.Array.each(items, function (csv) {
            var csvs = [];
            var groupChild = [];
            var sendType = '1';//預設紙本
            if (csv[5] == '電子交換') {
                sendType = '9';
            } else if (csv[5] == '郵寄') {
                sendType = '2';
            }

            var hasAtt = 'Y';
            if (csv[2] == '副本') {
                if (csv[6] && csv[6] == 'N')
                    hasAtt = 'N';
            }

            if (csv[7] && csv[9]) {//群組
                var notPush = false;
                if (groupChild.indexOf(csv[7]) >= 0) notPush = true;
                if (!notPush) {
                    var childArray = []
                    items.filter(function (item) {
                        if (item[7] == csv[7]) {
                            childArray.push({
                                dep3Name: item[0],
                                dep3Zone: item[3],
                                dep3Addr: item[4],
                                dep3No: item[10]
                            })
                        }
                    });
                    items = items.filter(function (item) {
                        return item[7] != csv[7];
                    });
                    groupChild.push(csv[7]);
                    csvs.push({
                        ADDR: '',
                        ARCENO: '',
                        CODENAME: csv[7] || '',
                        GROUPLIST: "",
                        KEY: csv[2],
                        PEOPLESEND: '',
                        REALTRANSTYPE: csv[2] == '抄本' ? 5 : 9,
                        //TRANSTYPE: csv[5] == '電子交換' ? 9 : 1,
                        TRANSTYPE: sendType,
                        TRANSTYPENAME: csv[2] == '抄本' ? "抄本" : "紙本",
                        TYPE: 1,
                        VALUE: csv[1] || '',
                        tagName: "Contact",
                        //ATTACH: csv[2] == '副本' ? 'N' : 'Y',
                        ATTACH: hasAtt,
                        isEdit: true,
                        editAtt: (csv[2] == '副本'),
                        isChange: csv[5] == '電子交換' ? 'Y' : 'N',
                        children: childArray || '',
                        except: csv[8],
                        GROUP: csv[9]
                    });
                }
                me.addContact(csvs);
            } else {
                csvs.push({
                    ADDR: csv[4] || '',
                    ARCENO: csv[3] || '',
                    CODE: csv[10] || '',
                    CODENAME: csv[0] || '',
                    GROUPLIST: "",
                    KEY: csv[2],
                    PEOPLESEND: '',
                    REALTRANSTYPE: csv[2] == '抄本' ? 5 : 9,
                    //TRANSTYPE: csv[5] == '電子交換' ? 9 : 1,
                    TRANSTYPE: sendType,
                    TRANSTYPENAME: csv[2] == '抄本' ? "抄本" : "紙本",
                    TYPE: 1,
                    VALUE: csv[1] || '',
                    tagName: "Contact",
                    //ATTACH: csv[2] == '副本' ? 'N' : 'Y',
                    ATTACH: hasAtt,
                    isEdit: true,
                    editAtt: (csv[2] == '副本'),
                    isChange: csv[5] == '電子交換' ? 'Y' : 'N',
                    children: csv[7],
                    except: csv[8],
                    GROUP: csv[9]
                });
                me.addContact(csvs);
            }
        });
    },
    updateDoLzwzip: function (first, index) {
        me = this;
        var store = Ext.getStore('Contact');
        if (first) {
            total = [];           
            if (store && store.data.all.length > 0) {
                Ext.Array.each(store.data.all, function (item) {
                    total.push(item.getData());
                });
            }
        }

        if (total.length > 0) {
            var num = index + 1;
            me.setMasked(true);

            if (index == total.length) {
                Ext.MessageBox.YES = [
                    { text: '確定', itemId: 'yes', ui: 'confirm' }
                ];
                Ext.Msg.show({ message: '更新完成', buttons: Ext.MessageBox.YES });
                me.setMasked(false);
                return;
            }

            var addr = total[index].ADDR;
            var sendType = total[index].TRANSTYPE + '';
            if (!addr || sendType != '2') {
                //me.updateDoLzwzip(false, ++index);
                return;
            }

            var codeName = store.data.all[index].get('CODENAME') || '';
            var msg = Ext.String.format('正在處理第{0}筆資料...<br>{1}', num, codeName);
            Ext.MessageBox.YES = [
                { text: '取消更新', itemId: 'yes', ui: 'decline' }
            ];
            var progress = Ext.Msg.show({
                title: '提示',
                message: msg,
                buttons: Ext.MessageBox.YES,
                width: 400,
                fn: callBackFunc
            });
            function callBackFunc(id, text) {
                me.setMasked(false);
                me.setStopUpdata(true);
                return false;
            }

            //避免太過頻繁呼叫，延遲每秒送一次
            setTimeout(function () {
                OA.client.Lzwzip.batchExcute({ action: 'getZipCode32', source: addr }, function (resp) {
                    //me.setValues({ ARCENO: resp.code }); //resp.address <- new address   
                    if (resp.code != undefined) {
                        if (resp.code != '') store.data.all[index].set('ARCENO', resp.code);
                        if (!me.getStopUpdata()) {
                            me.updateDoLzwzip(false, ++index);
                        } else {
                            progress.setHidden(true)
                        }
                    } else if (resp == 'err') {
                        Ext.Msg.confirm('提示', '更新 ' + codeName + ' 郵遞區號失敗，是否繼續更新？', function (fn) {
                            if (fn === 'yes') {
                                me.updateDoLzwzip(false, ++index);
                            } else {
                                me.setMasked(false);
                                return;
                            }
                        });
                    }
                });
            }, 1000);
        }
    }
});