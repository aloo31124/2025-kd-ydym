/*
 會辦單位
 */

Ext.define('OA.form.FormCoOrg', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormCoOrg',
    xtype: 'FormCoOrg',
    requires: ['OA.client.Member'],
    config: {
        width: '80%',
        height: '78%',
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        KEY: '',
        layout: {
            type: 'vbox'
        },
        scrollable: false,
        items: [
            {
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        id: 'nlistDep',
                        xtype: 'nestedlist',
                        width: '50%',
                        height: 400,
                        displayField: 'depName',
                        emptyText: '沒有資料',
                        loadingText: "Loading...",
                        getItemTextTpl: function () {
                            var items = [];
                            items.push('<p style="font-size:110%;">');
                            items.push('{' + this.getDisplayField() + '}');
                            items.push('<tpl if="(isAdd)">');
                            items.push('<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">已加</span>');
                            items.push('<tpl else>');
                            items.push('<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">新增</span>');
                            items.push('</tpl>');
                            items.push('</p>');
                            return items.join('');
                        },
                        listeners: {
                            itemtap: function (nestedList, list, index, target, record, e, eOpts) {
                                var me = nestedList.up('formpanel');

                                if (me.isAddButton(e)) {
                                    if (!record.get('isAdd')) {
                                        record.set('leaf', true);
                                        record.set('isAdd', true);
                                    } else {
                                        //TODO: 如何解決不往樹走？？
                                    }
                                } else {
                                    //不要問為什麼反正就是很神奇
                                    if (record.childNodes && record.childNodes.length > 0) {
                                        record.set('children', record.childNodes)
                                    }

                                    if (null == record.get('children')) {
                                        record.set('leaf', true);
                                    }else {
                                        record.set('leaf', false);
                                    }
                                }
                            },
                            leafitemtap: function (nestedList, list, index, target, record, e, eOpts) {
                                var me = nestedList.up('formpanel');
                                if (!me.isAddButton(e)) return;

                                var data = record.getData();
                                data.isDelete = true;
                                Ext.getStore('DeptList').add(data);
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
                                xtype: 'toolbar',
                                cls: 'segdoc-selector',
                                docked: 'top',
                                items: [
                                    {
                                        id: 'txtDept',
                                        xtype: 'textfield'
                                    },
                                    {
                                        ui: 'plain', text: '加入', action: 'add',
                                        handler: function (button) {
                                            var ctr = Ext.getCmp('txtDept');
                                            if (Ext.util.Format.trim(ctr.getValue()) != '') {
                                                var storeCo = Ext.getStore('DeptList');
                                                storeCo.add({
                                                    depName: Ext.util.Format.trim(ctr.getValue()),
                                                    isAfter: false,
                                                    isDelete: true
                                                });
                                            }
                                            ctr.focus(false, 100);
                                            ctr.setValue('');
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
                                id: 'listDep',
                                height: 400,
                                xtype: 'list',
                                scrollable: 'vertical',
                                disableSelection: true,
                                store: 'DeptList',
                                itemTpl: new Ext.XTemplate(
                                    '<p style="font-size:110%;">',

                                    '<tpl if="(isDelete)">',
                                    '<span class="flow-delete">&nbsp;</span>',
                                    '</tpl>',

                                    ' {depName} ',

                                    '<tpl if="(isAfter)">',
                                    '<input type="checkbox" id="checkAfter" style="zoom: 2;" checked=true>',
                                    '</tpl>',
                                    '<tpl if="(!isAfter)">',
                                    ' <input type="checkbox" id="checkAfter" style="zoom: 1.6;">',
                                    '</tpl>',
                                    '<label for= "checkAfter" style="color:red"> 後會</label></input>',

                                    '<tpl if="(isDelete)">',
                                    '<span class="flow-move"></span>',
                                    '</tpl>',

                                    '</p>'
                                ),
                                plugins: [{ xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move' }],
                                infinite: true,
                                variableHeights: true,
                                listeners: [{
                                    event: 'itemtap',
                                    fn: function (list, index, item, record, event) {
                                        var me = this;
                                        if (event.getTarget('.flow-delete')) {
                                            var deptTree = Ext.getStore('DeptTree');
                                            if (deptTree) {
                                                Ext.Array.each(deptTree.data.all, function (n) {
                                                    if (record.get('depName') == n.get('depName')) {
                                                        n.set('isAdd', false);
                                                    }
                                                });
                                            }
                                            var listDep = Ext.getStore('DeptList');
                                            listDep.remove(record);
                                            listDep.sync();
                                        } else if (event.getTarget('#checkAfter')) {
                                            if (record.get('isAfter')) {
                                                record.set('isAfter', false);
                                            }
                                            else {
                                                record.set('isAfter', true);
                                            }
                                        }
                                    }
                                },
                                {
                                    event: 'dragsort',
                                    fn: function (listObject, row, to, from) {

                                    }
                                }]
                            }]
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [                   
                    { xtype: 'spacer' },
                    {
                        ui: 'confirm',
                        text: '確定',
                        action: 'ok',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var formKey = form.getKEY()
                            var items = [];
                            Ext.getStore('DeptList').each(function (item) {

                                if (item.get('isAfter')) {
                                    if (item.get('depName').indexOf('（後會）') == -1) {
                                        items.push(item.get('depName') + '（後會）');
                                    } else {
                                        items.push(item.get('depName'));
                                    }
                                } else {
                                    items.push(item.get('depName').replace('（後會）', ''));
                                }

                                //items.push(item.get('depName'));
                            });
                            var data = form.getValues();

                            var docModelName = OA.client.WK.getCurrentModelName().replace('OA.model.wk.', '');
                            if (docModelName === 'DraftVerify') { //簽核會核單
                                OA.common.Paper.main().doDraftVerify('受會單位', items);

                                var vm = OA.common.Global.getCurrentViewModel();
                                vm['受會單位'] = items.join('、');
                                OA.common.Paper.main().saveWKField('受會單位', items.join('、'));
                            } else {
                                var wk = OA.common.Global.getCurrentWKContent();
                                if (wk && wk.DocumentType.indexOf('簽') != -1 && formKey == '敬會') {
                                    var keys = [];
                                    items.forEach((key, i) => keys.push('敬會_' + (i + 1)));
                                    keys.push('敬會數');
                                    items.push(items.length);
                                    var result = {};
                                    keys.forEach((key, i) => result[key] = items[i]);

                                    if (result.敬會數 == 0) { //1211 簽類型 敬會若為空 預設第一筆 使資料不等於0 否則敬會標題會消失  Chloe.sia
                                        result = { 敬會_1: "" };
                                        result.敬會數 = 1;
                                    }

                                    OA.common.Paper.main().updateNoteSubmit(result, '敬會');
                                } else if (wk && wk.DocumentType.indexOf('簽') != -1 && formKey == '敬致') {
                                    var keys = [];
                                    items.forEach((key, i) => keys.push('敬致_' + (i + 1)));
                                    keys.push('敬致數');
                                    items.push(items.length);
                                    var result = {};
                                    keys.forEach((key, i) => result[key] = items[i]);

                                    if (result.敬致數 == 0) {//1218 簽類型 敬致若為空 預設第一筆 使資料不等於0 否則敬會標題會消失  Chloe.sia
                                        result = { 敬致_1: "" };
                                        result.敬致數 = 1;
                                    }

                                    OA.common.Paper.main().updateNoteSubmit(result, '敬致');
                                } else {

                                    data['會辦單位'] = items.join('、');
                                    OA.common.Paper.main().updateContent(data);
                                }
                            }
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
        var h = (Ext.Viewport.getWindowHeight() * 0.7) - 60;
        Ext.getCmp('nlistDep').setHeight(h + 40);
        Ext.getCmp('listDep').setHeight(h);
        this.callParent(arguments);
    },
    create: function (key, data) {
        this.setKEY(key);
        var c = (data[key]) ? data[key].trim() : '', names = [];
        if (c) names = c.split('、');
        var storeCo = Ext.getStore('DeptList');
        storeCo.setData(null);
        var wk = OA.common.Global.getCurrentWKContent();
        if (wk && wk.DocumentType.indexOf('簽') != -1 && key == '敬會') {
            if (data['敬會數']) {
                var num = parseInt(data['敬會數']);
                for (var i = 0; i < num; i++) {
                    var key = '敬會_' + (i + 1);
                    if (data[key] && (data[key] + '').trim() != '') {

                        if ((data[key] + '').indexOf('（後會）') != -1) {
                            storeCo.add({ depName: data[key], isDelete: true, isAfter: true });
                        } else {
                            storeCo.add({ depName: data[key], isDelete: true, isAfter: false });
                        }
                    }
                }
            }
        } else if (wk && wk.DocumentType.indexOf('簽') != -1 && key == '敬致') {
            if (data['敬致數']) {
                var num = parseInt(data['敬致數']);
                for (var i = 0; i < num; i++) {
                    var key = '敬致_' + (i + 1);
                    if (data[key] && (data[key] + '').trim() != '') {
                        if ((data[key] + '').indexOf('（後會）') != -1) {
                            storeCo.add({ depName: data[key], isDelete: true, isAfter: true });
                        } else {
                            storeCo.add({ depName: data[key], isDelete: true, isAfter: false });
                        }
                        //storeCo.add({ depName: data[key], isDelete: true });
                    }
                }
            }
        } else {
            Ext.Array.each(names, function (name) {
                if ((name + '').indexOf('（後會）') != -1) {
                    storeCo.add({ depName: (name + '').replace('（後會）', ''), isDelete: true, isAfter: true });
                } else {
                    storeCo.add({ depName: name, isDelete: true, isAfter: false });
                }
                //storeCo.add({ depName: name, isDelete: true });
            });
        }
        this.loadDept(names);
    },
    loadDept: function (names) {
         // 發送 Ajax 請求獲取數據
         Ext.Ajax.request({
            url: OA.common.UrlMgr.getAjaxWorkFlow(),
            method: 'GET', // 或 'POST'
            params: {
                q: 1,
                method: 'getDataCollection', // 指定後端處理方法
                type: 'Odaf01',
                kind: 2,
                _dc: new Date().getTime(), // 避免緩存
            },
            headers: {
                'Content-Type': 'application/json', // 確保請求格式
            },
            success: function (response) {
                try {
                    // 解析 JSON 數據
                    var items = Ext.decode(response.responseText);
                    var dataCos = [];
        
                    // 遍歷後端數據並添加 'isAdd' 屬性
                    Ext.Array.each(items, function (co) {
                        var isAdd = false;
        
                        // 遍歷 `names` 數組，判斷是否匹配
                        Ext.Array.each(names, function (name) {
                            if (name === co.depName) {
                                isAdd = true;
                            }
                        });
        
                        // 設置屬性並添加到數據列表
                        co.isAdd = isAdd;
                        dataCos.push(co);
                    });
        
                    // 創建 TreeStore 並加載數據
                    var nlistDepStore = Ext.create('Ext.data.TreeStore', {
                        fields: ['depNo', 'depName', 'jobName', 'isAdd', 'children'], // 定義字段
                        root: {
                            expanded: true,
                            children: dataCos.length > 0 ? dataCos : [],
                        },
                    });
        
                    // 更新 Tree 組件的 Store
                    var treePanel = Ext.getCmp('nlistDep');
                    if (treePanel) {
                        treePanel.setStore(nlistDepStore);
                    }
        
                    // 顯示加載指示器
                    OA.common.Utils.indicatorWith('listDep');
                } catch (e) {
                    console.error('解析 JSON 數據時出錯:', e);
                }
            },
            failure: function (response) {
                console.error('請求失敗:', response.status, response.statusText);
            },
        });
        
        
           
        /*
        Ext.Ajax.request({
            url: OA.common.UrlMgr.getAjaxWorkFlow(),
            withCredentials: true,
            useDefaultXhrHeader: false,
            success: function (response) {

                var items = JSON.parse(response.responseText);
                var dataCos = [];
                Ext.Array.each(items, function (co) {
                    var isAdd = false;
                    Ext.Array.each(names, function (name) {
                        if (name == co.depName) isAdd = true;
                    });
                    co.isAdd = isAdd,
                        dataCos.push(co);
                });
                //console.log(items);
                var nlistDepStore = Ext.create("Ext.data.TreeStore", {
                    id: 'nlistDepStore',
                    mode: 'OA.model.DeptTree',
                    data: dataCos.length > 0 ? dataCos : null
                });

                Ext.getCmp('nlistDep').setStore(nlistDepStore);


                
                OA.common.Utils.indicatorWith('listDep');
                r.set('isAdd', isAdd);
            }
        });*/

        // OA.client.Member.ajaxWorkFlow({
        //     callback: function (records, operation, success) {
        //         Ext.getCmp('nlistDep').setStore('DeptTree');
        //     }
        // });
    },
    isAddButton: function (e) {
        var _isButton = false;
        if (!e) return _isButton;
        if (e.target.className === 'x-button-normal x-button') _isButton = true;
        return _isButton;
    }
});