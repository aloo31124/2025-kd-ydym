/*
套印管理/主視窗
*/
Ext.define('OA.form.PanelOverprint', {
    extend: 'Ext.Panel',
    xtype: "PanelOverprint",
    alias: 'widget.PanelOverprint',
    id: 'PanelOverprint',
    requires: ['Ext.SegmentedButton', 'Ext.Toolbar', 'Ext.plugin.SortableList'],
    config: {
        ui: 'dark',
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        width: '90%',
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
                        text: '新增', action: 'new', hidden: 'true',
                        handler: function (button) {
                            OA.common.Funcs.show('FormOverprint');
                        }
                    },                   
                    {
                        id: 'butSortImport',
                        text: '匯入套印範本', action: 'import' // addClick
                    },
                    {
                        id: 'butSortExport',
                        text: '匯出套印範本', action: 'export',
                        handler: function (button) {
                            var panel = button.up('panel');
                            panel.doExport();
                        }
                    },
                    { xtype: 'spacer' },      
                    {
                        xtype: 'selectfield',
                        id: 'overprintSignname',
                        label: '署名',
                        valueField: 'value',
                        displayField: 'key',
                        store: {
                            data: [
                                { value: 'hide', key: '隱藏' },
                                { value: 'show', key: '顯示' }
                            ]
                        }
                    },
                    {
                        xtype: 'selectfield',
                        id: 'overprintLevel',
                        label: '分層負責',
                        valueField: 'value',
                        displayField: 'key',
                        store: {
                            data: [
                                { value: 'hide', key: '隱藏' },
                                { value: 'show', key: '顯示' }
                            ]
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
                id: 'overPrintList',
                store: 'OverPrint',
                itemTpl: new Ext.XTemplate(
                    '<table>',
                    '<tr>',
                    '<td width="5%"><span class="flow-delete">&nbsp;</span></td>',

                    '<td width="10%">',
                    '<p style="font-size:110%;">',
                    ' {name} ',
                    '</p>',
                    '</td>',

                    // '<td width="10%">',
                    // '<p style="font-size:110%;style="visibility:hidden"">',
                    // ' {category} ',
                    // '</p>',
                    // '</td>',
                    //
                    // '<td width="10%">',
                    // '<p style="font-size:110%;">',
                    // ' {docNo} ',
                    // '</p>',
                    // '</td>',

                    '<td width="10%">',
                    '<p style="font-size:110%;">',
                    '{addNo} ',
                    '</p>',
                    '<p style="font-size:110%;">',
                    '{addr} ',
                    '</p>',
                    '</td>',

                    '<td width="10%">',
                    '<p style="font-size:110%;">',
                    ' {original} ',
                    '</p>',
                    '</td>',

                    '<td width="10%">',
                    '<p style="font-size:110%;">',
                    ' {duplicate} ',
                    '</p>',
                    '</td>',


                    '<td width="10%"><button style="font-size:120%;" class="overp-group">編輯變數</button></td>',

                    '<td width="5%"><span class="flow-move"></span></td>',
                    '</tr>',
                    '</table>'
                ),
                plugins: [{ xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move' }],
                infinite: true,
                variableHeights: true,
                listeners: {
                    itemtap: function (list, index, item, record, event) {
                        if (event.getTarget('.flow-delete')) {
                            var store = Ext.getStore('OverPrint');
                            store.remove(record);
                            store.sync();
                        } else if (event.getTarget('.overp-group')) {
                            OA.common.Funcs.show('PanelVariableprint', null, record);
                        } else {
                            OA.common.Funcs.show('FormOverprint', null, record);
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
                            var store = Ext.getStore('OverPrint');
                            if (store) {
                                if (store.data.all.length > 0) {
                                    var level = Ext.getCmp('overprintLevel').getValue();
                                    var signname = Ext.getCmp('overprintSignname').getValue();
                                    Ext.Array.each(store.data.all, function (item) {
                                        item.set('level', level);
                                        item.set('signname', signname);
                                    });
                                    //console.log(store.data);
                                    var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                                    //store 套印資料用傳的
                                    ctrWK.initParas(store.data, 'overprint');
                                    window.open('./index.html?app=preview&by=overprint', "", '');
                                }
                            }
                            form.hide();
                        }
                    }
                ]
            }
        ],
        resumable: null
    },
    initialize: function () {
        var me = this;
        var ctr = Ext.getCmp('butSortImport');
        var qs = OA.common.Global.getQ();

        if (typeof require !== 'undefined') {
            Papa = require("./resources/thirdparty/PapaParse/papaparse.min.js");
        }

        var reader = new FileReader();
        reader.onloadend = function (e) {
            var paras = OA.common.Global.getInitParas();
            var csvstr = reader.result;
            me.addRows(null, csvstr);
        }

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
        // r.on('fileProgress', function (rf) {
        // });
    },
    addRows: function (base64FileContent, csvstr) {
        Ext.Msg.confirm("提示", "匯入後將清除目前套印資料", function (ok) {
            if (ok == 'yes') {
                var store = Ext.getCmp('overPrintList').getStore();
                if (store) {
                    store.clearFilter();
                    store.setData(null);
                    store.sync();
                }

                var csvstring = '';
                if (base64FileContent) {
                    csvstring = B64.decode(base64FileContent);
                } else {
                    csvstring = csvstr;
                }

                var items = Papa.parse(csvstring).data;
                var names = Ext.clone(items[0]);
                items.splice(0, 1);

                //判別csv字串中是否有逗號
                //if (csvstring.indexOf(',') != -1 || csvstring.indexOf('，') != -1) {
                //    Ext.Msg.alert("提示", "滙入資料中不可含有逗號！");
                //    return false;
                //}


                var nameEmtpy = '';
                var variableEmtpy = '';

                Ext.Array.each(items, function (item, index) {
                    var ispush = true;
                    var variableJson = '';
                    if (item.length > 2) {
                        //缺少受文者
                        if ((item[0] + '').trim() == '') {
                            if (nameEmtpy.length > 0) {
                                nameEmtpy = nameEmtpy + '<br>' + '第' + (index + 1) + '筆 受文者不可空白'
                            } else {
                                nameEmtpy = '第' + (index + 1) + '筆 受文者不可空白';
                            }
                            ispush = false;
                        }
                        Ext.Array.each(item, function (value, index) {
                            var str = '';
                            if (index > 4 && ispush) {
                                if ((value + '').trim() == '') {
                                    if (variableEmtpy.length > 0) {
                                        variableEmtpy = variableEmtpy + '<br>' + item[0] + ' 缺少變數值';
                                    } else {
                                        variableEmtpy = item[0] + ' 缺少變數值';
                                    }
                                    ispush = false;
                                    return false;
                                }

                                if (variableJson == '') variableJson = '[';

                                if (index == item.length - 1) {
                                    str = Ext.String.format('{"variable":"{0}","actual":"{1}"}]', names[index], value);
                                } else if (index > 4) {
                                    str = Ext.String.format('{"variable":"{0}","actual":"{1}"},', names[index], value);
                                }
                                variableJson = variableJson + str;
                            }
                        });

                        if (ispush) {
                            //console.log(item)
                            var values = {
                                name: item[0] || '',
                                // category: item[1] || '',
                                // docNo: item[2] || '',
                                addNo: item[1] || '',
                                addr: item[2] || '',
                                original: item[3] || '',
                                duplicate: item[4] || '',
                                variable: variableJson
                            };
                            store.addData(values);
                        }
                        //console.log(variableEmtpy);
                    }
                });

                if (nameEmtpy.length > 0) {
                    Ext.Msg.alert("提示", nameEmtpy);
                } else if (variableEmtpy.length > 0) {
                    Ext.Msg.alert("提示", variableEmtpy);
                }
            }
        });
    },
    create: function (valus) {
        if (valus != undefined) {
            var store = Ext.getStore('OverPrint');
            var has = false;
            store.each(function (record) {
                if (record.data.name == valus.name) {
                    has = true;
                    return false;
                }
            });
            if (!has)
                store.addData(valus);
        }
    },
    doExport: function () {
        var me = this;
        var vm = OA.common.Global.getCurrentViewModel();
        var output = [];
        var store = Ext.getStore('OverPrint');


        store.each(function (record) {
            var d = Ext.clone(record.data);
            delete d.id;

            var value = {
                受文者: d.name,
                // 本別: d.category,
                // 文號: d.docNo,
                郵遞區號: d.addNo,
                地址: d.addr,
                正本: d.original,
                副本: d.duplicate
            };

            if (d.variable && d.variable.length > 0) {
                var variable = JSON.parse(d.variable);
                var str = '';
                Ext.Array.each(variable, function (item) {
                    str = Ext.String.format('{"{0}":"{1}"}', item.variable, item.actual);
                    var strJson = JSON.parse(str)
                    value = Object.assign(value, strJson);
                    //console.log(value);
                });
            }
            output.push(value);
        });


        //增加目前文稿內受文者資料
        console.log(vm);
        if (vm.ContactList == null || vm && vm.ContactList.length > 0) {
            Ext.Array.each(vm.ContactList, function (item) {
                if (item.TRANSTYPENAME == '紙本') {
                    var isHas = false;
                    Ext.Array.each(output, function (out) {
                        if (out.受文者 == item.VALUE) {
                            isHas = true;
                            return false;
                        }
                    })
                    //console.log(isHas);
                    if (!isHas) {
                        var value = {
                            受文者: item.VALUE,
                            // 本別: item.KEY,
                            // 文號: '',
                            郵遞區號: item.ARCENO,
                            地址: item.ADDR,
                            正本: '',
                            副本: ''
                        }
                        str = Ext.String.format('{"{0}":"{1}"}', '*變數*', '');
                        var strJson = JSON.parse(str)
                        value = Object.assign(value, strJson);
                        output.push(value);
                    }
                }
            });
        }

        //沒有任何匯出資料增加一筆空白資料
        if (output.length == 0) {
            var value = {
                受文者: '',
                // 本別: d.category,
                // 文號: d.docNo,
                郵遞區號: '',
                地址: '',
                正本: '',
                副本: ''
            };
            str = Ext.String.format('{"{0}":"{1}"}', '*變數*', '');
            var strJson = JSON.parse(str)
            value = Object.assign(value, strJson);
            output.push(value);
        }


        var csv = Papa.unparse(output);

        var blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
        saveAs(blob, '套印.csv');
    }
});