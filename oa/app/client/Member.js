/**
 * User Client
 */

Ext.define('OA.client.Member', {
    alias: 'client.Member',
    singleton: true,
    requires: [
        'OA.common.UrlMgr', 'OA.common.LocalPagingProxy'
    ],
    config: {
        timerId: null
    },
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    /**
     *
     * @param {Function} depNo
     * @param {Function} nodeType
     * @param {Function} callback
     */
    loadDept: function (depNo, nodeType, callback) {
        var store = Ext.getStore('DeptTree');
        store.getProxy().setUrl(OA.common.UrlMgr.getDept(depNo, nodeType));
        store.load(callback); //Get /rest/dept/{depNo}?nodeType=2
    },
    loadDeptList: function (_callback) {
        Ext.Ajax.request({
            url: OA.common.UrlMgr.getAjaxWorkFlow(),
            withCredentials: true,
            useDefaultXhrHeader: false,
            success: function (response) {
                //console.log(response);
                var items = JSON.parse(response.responseText);
                //console.log(items);
                if (items && items.length > 0) {
                    var deptAll = Ext.getStore('DeptAll');
                    if (deptAll) {
                        deptAll.setData(null);
                        deptAll.setData(items)
                    }
                }
                if (_callback) _callback();
            }
        });
    },
    /**
     *
     * @param {Function} depNo
     * @param {Function} nodeType
     * @param {Function} callback
     */
    ajaxWorkFlow: function (callback) {
        var store = Ext.getStore('DeptTree');
        store.getProxy().setUrl(OA.common.UrlMgr.getAjaxWorkFlow());
        store.getProxy().setUseDefaultXhrHeader(false);
        store.getProxy().setWithCredentials(true);
        store.load(callback); //Get /rest/dept/{depNo}?nodeType=2
    },


    /**
     *
     */
    loadEmps: function (options, scope) {
        var me = this;
        options = options || {};
        if (Ext.isFunction(options)) {
            options = {
                callback: options,
                scope: scope || this
            };
        }

        var data = {};
        data.depNo = options.depNo;
        data.nodeType = options.nodeType;
        data.empNo = options.empNo;

        var storeEmp = Ext.getStore('Emp');
        storeEmp.getProxy().setUrl(OA.common.UrlMgr.getEmps(data));
        storeEmp.load(options); //Get /rest/emp/{depNo}?empNo=1234&nodeType=1

        return me;
    },


    getDep3Rows: function (options) {
        var rows = [];
        var db = OA.common.Global.getDatabase();
        if (!db) return;

        var q = [];
        q.push('SELECT * FROM g2b WHERE qType=$qType ');
        if (options.dep3ChnName) q.push('AND dep3Name LIKE "%' + options.dep3ChnName + '%" ');
        if (options.dep3No) q.push('AND dep3No LIKE "%' + options.dep3No + '%" ');
        q.push('LIMIT $start,$limit');
        var stmt = db.prepare(q.join(''));

        stmt.bind({$qType: options.qType, $start: options.start, $limit: options.limit});
        while (stmt.step()) {
            var row = stmt.getAsObject();
            if (row.children) row.children = JSON.parse(row.children.replace(/&quot;/g, '"'));
            rows.push(row);
        }
        stmt.free();
        return rows;
    },
    /**
     *
     * @param {Function} data
     * @param {Function} _callback
     */
    loadDep3: function (data, _callback) {
        var me = this;
        var store = Ext.getStore('Dep3Tree');
        var qs = OA.common.Global.getQ();
        if (qs.app === 'offline' && qs.action != 'build-db-g2b') {
            var db = OA.common.Global.getDatabase();
            var rows;
            if (db) {
                rows = me.storeDep3TreeInit(data);
                // rows = me.getDep3Rows(data);
                store.currentPage = 1;
                store.searchBy = data;
                store.setData(rows);
                store.setPageSize(data.limit);
                if (_callback) _callback(rows);
                return;
            }

            //local
            // me.dbInit();
            // rows =me.storeDep3TreeInit(data);
            // if (_callback) _callback(rows);
            // return;

            //remote
            var url = OA.common.UrlMgr.restUrl('../oa/') + 'db.sqlite';
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);

            xhr.responseType = 'arraybuffer';
            Ext.Viewport.setMasked({xtype: 'loadmask', transparent: true, message: '下載中...'});
            xhr.onload = function (e) {
                me.dbInit(this.response);
                rows = me.storeDep3TreeInit(data);
                Ext.Viewport.setMasked(false);
                if (_callback) _callback(rows);
            };
            xhr.send();
        } else {

            var ctrNlistDep3 = Ext.getCmp('nlistDep3');
            if (ctrNlistDep3) ctrNlistDep3.setMasked({xtype: 'loadmask', message: '處理中...'});
            // var store = Ext.create('Ext.data.TreeStore', {
            //     model: 'OA.model.Dep3Tree',
            //     defaultRootProperty: 'children',
            //     // root: records
            // });
            // if (ctrNlistDep3) ctrNlistDep3.setStore('Dep3Tree');

            store.setProxy({
                type: 'rest',
                useDefaultXhrHeader: false,
                withCredentials: true,
                url: OA.common.UrlMgr.restUrl('code', 'g2b'),
                writer: {
                    type: 'json',
                    encodeRequest: true
                },
                reader: {
                    type: 'json',
                    rootProperty: 'children'
                }
            });

            store.currentPage = 1;
            store.setPageSize(data.limit);
            store.searchBy = {InputDep3: data};
            store.setClearOnLoad(true);
            store.setClearOnPageLoad(true);
            store.load({
                params: {InputDep3: data},
                callback: function (records, operation, success) {
                    if (ctrNlistDep3) ctrNlistDep3.setMasked(false);
                    // Ext.Array.each(records, function (r) {
                    //     if (r.get('children')) {
                    //         Ext.Array.each(r.get('children'), function (child) {
                    //             child.leaf = false
                    //         });
                    //     }
                    // });

                    var contact = Ext.getStore('Contact');
                    if (contact && contact.data.all.length > 0) { //群組
                        Ext.Array.each(contact.data.all, function (n) {
                            var record = records.where("( el, i, res, param ) => el.data.dep3Name=='" + n.data.CODENAME + "'");
                            if (record.length > 0) record[0].set('isAdd', true);
                            else { //子類
                                Ext.Array.each(records, function (k) { //有子類
                                    if (k.childNodes.length > 0) {
                                        var childRecord = k.childNodes.where("( el, i, res, param ) => el.data.dep3Name=='" + n.data.CODENAME + "'");
                                        if (childRecord.length > 0) childRecord[0].set('isAdd', true);
                                    }
                                });
                            }
                        });
                    }
                    // if (ctrNlistDep3) ctrNlistDep3.setStore('Dep3Tree');
                    if (_callback) _callback(records);
                }
            });
        }
    },
    loadGroup: function (data, _callback) {
        var me = this;
        var ctrNlistDep3 = Ext.getCmp('nlistDep3');
        ctrNlistDep3.setMasked({xtype: 'loadmask', message: '處理中...'});
        var store = Ext.getStore('Dep3Tree');
        // store.removeAll();
        // store.setData(null);
        Ext.Ajax.request({
            url: OA.common.UrlMgr.restUrl('editor', 'g2b'),
            method: "POST",
            params: Ext.JSON.encode(data),
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
            useDefaultXhrHeader: false,
            writer: {
                type: 'json',
                encodeRequest: true
            },
            reader: {
                type: 'json',
                rootProperty: 'children'
            },
            success: function (response) {
                var resp = JSON.parse(response.responseText);
                //console.log(resp);
                Ext.Array.each(resp, function (p) {
                    Ext.Array.each(resp.children, function (child) {
                        var item = [];
                        item.push({
                            children: child.children,
                            dep3Name: child.dep3Name,
                            dep3No: child.dep3No,
                            group: '2',
                            id: child.id,
                            leaf: child.leaf,
                            size: child.size,
                            transType: child.transType,
                            except:''
                        });
                        store.addData(item);
                    });
                });

                if (_callback) _callback();
                ctrNlistDep3.setMasked(false);
            }
        });
    },
    dbInit: function (buffer) {
        var qs = OA.common.Global.getQ();
        if (qs.app !== 'offline') return;

        if (!buffer) {
            var fs = require('fs');
            var path = require('path');
            var srcDB = path.join(__dirname, '../db.sqlite');
            //console.log(srcDB);
            buffer = fs.readFileSync(srcDB);
        }

        var uInt8Array = new Uint8Array(buffer);
        var db = new SQL.Database(uInt8Array);
        OA.common.Global.setDatabase(db);
    },
    storeDep3TreeInit: function (data) {
        var rows = this.getDep3Rows(data);
        var store = Ext.getStore('Dep3Tree');
        store.searchBy = data;
        store.setProxy({
            type: 'memory',
            data: rows,
            writer: {
                type: 'json',
                rootProperty: "input"
            },
            reader: {
                type: 'json',
                rootProperty: 'children'
            }
        });
        store.setPageSize(data.limit);
        //console.log('storeDep3TreeInit');
        if (Ext.getCmp('nlistDep3')) Ext.getCmp('nlistDep3').setStore('Dep3Tree');

        return rows;
    },

    /**
     *
     * @param {Function} data
     * @param {Function} callback
     */
    search: function (data, callback) {
        var me = this;
        var store = Ext.getStore('Dep3Tree');
        var qs = OA.common.Global.getQ();

        store.setProxy({
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            url: OA.common.UrlMgr.restUrl('code', 'g2b'),
            writer: {
                type: 'json',
                encodeRequest: true
            },
            reader: {
                type: 'json',
                rootProperty: 'children'
            }
        });

        store.currentPage = 1;
        store.setPageSize(data.limit);
        store.load({
            params: {InputDep3: data},
            callback: function (records, operation, success) {
                if (callback) callback(records);
            }
        });
    },

    buildG2B: function () {
        if (typeof require == 'undefined')  return;

        function getInsertSqlStr(qType, records) {
            var sqlstr = '';
            Ext.Array.each(records, function (r) {
                var item = r.data;
                // console.log(item);
                var arr = [];
                arr.push(qType);
                (item.transType) ? arr.push('"' + item.transType + '"') : arr.push("null");
                (item.dep3No) ? arr.push('"' + item.dep3No + '"') : arr.push("null");
                (item.dep3Zone) ? arr.push('"' + item.dep3Zone + '"') : arr.push("null");
                (item.dep3Addr) ? arr.push('"' + item.dep3Addr.replace(/\"/g, '&quot;') + '"') : arr.push("null");
                (item.peopleSend) ? arr.push('"' + item.peopleSend + '"') : arr.push("null");
                (item.dep3Name) ? arr.push('"' + item.dep3Name + '"') : arr.push("null");
                (item.children) ? arr.push('"' + JSON.stringify(item.children).replace(/\"/g, '&quot;') + '"') : arr.push("null");
                arr.push((item.leaf) ? 1 : 0);
                sqlstr += 'INSERT INTO g2b VALUES (' + arr.join(',') + ');';
            });
            return sqlstr;
        }

        function perSave(records, setting) {
            var per = 100;
            var times = records.length / per;

            var count = 0;
            for (var i = 0; i < times; i++) {
                var tmp = records.splice(0, per);
                var tmpSqlStr = getInsertSqlStr(setting.qType, tmp);
                // console.log(tmpSqlStr);
                db.run(tmpSqlStr);

                // var fn = window['runMe'];
                // if (typeof fn === "function") fn();

                var buffer = new Buffer(eval('db.export()'));
                fs.writeFileSync(dbName, buffer);
                count = count + tmp.length;
                //console.log('type' + setting.qType + ' : ' + count + ' done');
            }
        }

        var dbName = 'db.sqlite';
        var dbAction = 'update';

        var tbName = 'g2b';

        var data0 = {};
        data0.qType = 0;
        data0.start = 0;
        data0.limit = 70000;

        var data1 = {};
        data1.qType = 1;
        data1.start = 0;
        data1.limit = 1000;
        data1.depNo = 'AAAA';

        var data2 = {};
        data2.qType = 2;
        data2.start = 0;
        data2.limit = 1000;
        // data2.depNo = 'AAAA';
        // data2.empNo = '250090';

        var fs = require('fs');
        var db;
        if (dbAction == 'update') {
            var filebuffer = fs.readFileSync(dbName);
            db = new SQL.Database(filebuffer);
        } else {
            db = new SQL.Database();
        }
        var sqlstr = 'DROP TABLE IF EXISTS ' + tbName + ';';
        sqlstr += 'CREATE TABLE ' + tbName + '(qType integer,transType text,dep3No text,dep3Zone text,dep3Addr text,peopleSend text,dep3Name text,children text,leaf integer);';
        db.run(sqlstr);

        //console.log('start..');
        OA.client.Member.loadDep3(data0, function (records0) {
            //console.log('type' + data0.qType + ' ' + records0.length + ' doing..');
            perSave(records0, data0);
            OA.client.Member.loadDep3(data1, function (records1) {
                //console.log('type' + data1.qType + ' ' + records1.length + ' doing..');
                perSave(records1, data1);
                //console.log('all done');
                // OA.client.Member.loadDep3(data2, function (records2) {
                //     console.log('type' + data2.qType + ' ' + records2.length + ' doing..');
                //     perSave(records2, data2);
                //     console.log('all done');
                // });
            });
            // var items=[];
            // Ext.Array.each(records, function (r) {
            //     var item = r.data;
            //     items.push(item);
            // });
            //
            // fs.writeFileSync("g2b1.json", JSON.stringify(items));
        });
    },
    /**
     *
     * @param {String} depNo
     * @param {Function} callback
     */
    loadCaseNo: function (depNo, yearNo, callback) {
        var qs = OA.common.Global.getQ();  // 獲取查詢參數
        if (qs.app === 'offline') return;  // 若是離線模式則返回
    
        var DocFlow = OA.common.Global.getCurrentDocFlowRecord();  // 獲取當前文檔流程記錄
        var store = Ext.getStore('CaseNo');  // 獲取 CaseNo store
    
        var url = '';
        if (DocFlow && DocFlow.data.doDeptno && DocFlow.data.doSno) {
            var flowdoSno = DocFlow.data.doDeptno + DocFlow.data.doSno;
            url = OA.common.UrlMgr.getCaseNo(depNo, flowdoSno, yearNo);  // 根據條件生成請求的 URL
        } else {
            url = OA.common.UrlMgr.getCaseNo(depNo, null, yearNo);  // 如果沒有 DocFlow，使用預設的 URL
        }
    
        // 若有專案代號，將其加到 URL 中
        if (qs.projNo) {
            url = url + '&projNo=' + qs.projNo;
        }
    
        // 檢查 Store 是否已經有數據且 URL 沒有變動
        if (store.getData().all.length == store.rawCount && store.getProxy().getUrl() == url) {
            var items = [];
            Ext.Array.forEach(store.getData().all, function (r) {
                items.push(r.data);  // 將所有數據推送到 items 陣列中
            });
            if (callback) callback(items);  // 調用回調函數
            return;
        }
    
        store.setData(null);  // 清空 store
        store.getProxy().setUrl(url);  // 設置新的 URL
        store.load({
            callback: function (records, operation, success) {
                if (success) {
                    if (!records[0]) {
                        // 如果數據為空，調用回調函數並傳遞預設值
                        if (callback) callback({
                            fsKindno: '',
                            fsKindname: '',
                            fsYrlimit: '',
                            caseno: '',
                            kindName: '',
                            casenoName: '',
                            startDate: ''
                        });
                        return;
                    }
                    
                    // 處理返回數據
                    var r = records[0].raw.data;
                    var data = [];
                    Ext.Array.forEach(r.children, function (item) {
                        if (typeof (item) == 'object') {
                            if (item.constructor === Array) {
                                data.push({
                                    fsKindno: item[0],
                                    fsKindname: (item[1]) ? item[1].trim() : '',
                                    fsYrlimit: item[2],
                                    caseno: item[3],
                                    kindName: item[4],
                                    casenoName: item[5],
                                    startDate: r.fsYear
                                });
                            } else {
                                data.push(item);
                            }
                        } else {
                            var kanme = (item[1]) ? item[1].trim() : '';
                            if (KangDaAppConfig().unit == 'TBPX') {
                                data.push({
                                    fsKindno: item[0],
                                    fsKindname: kanme,
                                    fsYrlimit: item[2],
                                    startDate: r.fsYear
                                });
                            } else {
                                data.push({
                                    fsKindno: item[0],
                                    fsKindname: kanme,
                                    startDate: item[2],
                                    fsYrlimit: item[3]
                                });
                            }
                        }
                    });
                    
                    // 設置新數據並更新 rawCount
                    store.setData(data);
                    if (data.length != 0) store.rawCount = data.length;
    
                    if (callback) callback(data);  // 調用回調函數傳遞數據
                } else {
                    // 錯誤處理
                    var message = '';
                    if (operation.getResponse() == null) {
                        message = '未正確連線!請檢查網路!';
                    } else {
                        var failureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                        message = failureResponse.message + ' Error Code:' + failureResponse.code;
                    }
                    Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                }
            }
        });
    },

    /*
    loadCaseNo: function (depNo, yearNo, callback) {
        var qs = OA.common.Global.getQ();
        if (qs.app === 'offline') return;
        var DocFlow = OA.common.Global.getCurrentDocFlowRecord();
        var store = Ext.getStore('CaseNo');

        var url = '';
        if (DocFlow && DocFlow.data.doDeptno && DocFlow.data.doSno) {
            var flowdoSno = DocFlow.data.doDeptno + DocFlow.data.doSno;
            url = OA.common.UrlMgr.getCaseNo(depNo, flowdoSno, yearNo);
        } else {
            url = OA.common.UrlMgr.getCaseNo(depNo, null, yearNo);
        }

        //評議專案代號
        if (qs.projNo) {
            url = url + '&projNo=' + qs.projNo;
        }

        if (store.getData().all.length == store.rawCount && store.getProxy().getUrl() == url) {
            var items = [];
            Ext.Array.forEach(store.getData().all, function (r) {
                items.push(r.data);
            });
            if (callback) callback(items);
            return;
        }

        store.setData(null);
        store.getProxy().setUrl(url);
        store.load({
            callback: function (records, operation, success) {
                if (success) {
                    if (!records[0]) {
                        if (callback) callback({
                            fsKindno: '',
                            fsKindname: '',
                            fsYrlimit: '',
                            caseno: '',
                            kindName: '',
                            casenoName: '',
                            startDate: ''
                        });
                        return;
                    }
                    var r = records[0].raw;
                    var data = [];
                    Ext.Array.forEach(r.children, function (item) {
                        if (typeof (item) == 'object') {
                            if (item.constructor === Array) {
                                data.push({
                                    fsKindno: item[0],
                                    fsKindname: (item[1]) ? item[1].trim() : '',
                                    fsYrlimit: item[2],
                                    caseno: item[3],
                                    kindName: item[4],
                                    casenoName: item[5],
                                    startDate: r.fsYear
                                });
                            } else {
                                data.push(item);
                            }

                        } else {
                            var kanme = (item[1]) ? item[1].trim() : '';
                            if (KangDaAppConfig().unit == 'TBPX') {
                                data.push({
                                    fsKindno: item[0],
                                    fsKindname: kanme,
                                    fsYrlimit: item[2],
                                    startDate: r.fsYear
                                });
                            } else {
                                data.push({
                                    fsKindno: item[0],
                                    fsKindname: kanme,
                                    startDate: item[2],
                                    fsYrlimit: item[3]
                                });
                            }
                        }
                    });
                    store.setData(data);

                    // console.log(store);
                    // console.log(store.getProxy().getUrl());
                    if (data.length != 0) store.rawCount = data.length;

                    if (callback) callback(data);
                } else {
                    var message = '';

                    if (operation.getResponse() == null) {
                        message = '未正確連線!請檢查網路!';
                    } else {
                        var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                        message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                    }
                    Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                }
            }
        });
    },
    */
    verifyCaseNo: function (values, callback) {
        if (!OA.common.Paper.main()) {
            //TODO:簡易模式如何取檔號來驗證？
            if (callback) callback();
            return;
        }

        var hasCaseNo = false;
        Ext.Array.each(OA.common.Paper.main().getFields(), function (f) {
            if (f.key == '檔號') hasCaseNo = true;
        });

        if (hasCaseNo) {
            OA.client.Member.loadCaseNo(OA.common.Global.getCurrentDept().depNo, values['年度'], function (data) {
                var store = Ext.getStore('CaseNo');
                var hasValue = false;
                var yrIsChange = false;
                store.each(function (r) {
                    if (r.get('startDate') == values['年度'] && r.get('fsKindno') == values['分類號'] && r.get('caseno') == values['案次號']) {
                        if (r.get('fsYrlimit') !== values['保存年限']) {
                            yrIsChange = true;
                            return false;
                        }
                        if (r.get('caseno')) {
                            if (r.get('caseno') == values['案次號']) hasValue = true;
                            return false;
                        } else {
                            hasValue = true;
                            return false;
                        }
                    }
                });
                if (yrIsChange) {
                    Ext.Msg.alert('提示', '此檔號，保存年限已更新，請移除並重新加入常用！');
                } else {
                    if (hasValue) {
                        if (callback) callback(data);
                    } else {
                        Ext.Msg.alert('提示', '無此檔號，請重新輸入');
                    }
                }
            });
        } else {
            if (callback) callback();
        }
    },
    doDefaultCaseNo: function () {
       //檔號預設，先檢查是否有常用
        // OA.client.Localforage.getCommonlyCaseNo(function(list) {
        //     var values = {};
        //     if (!list || list.length == 0) {
        //         var dt = new Date();
        //         var nowYear = dt.getFullYear() - 1911;
        //         OA.client.Member.loadCaseNo(OA.common.Global.getCurrentDept().depNo, nowYear, function(data) {
        //             //預帶第0筆
        //             values = {
        //                 年度: data[0].startDate || '',
        //                 分類號: data[0].fsKindno || '',
        //                 案次號: data[0].caseno || '',
        //                 保存年限: data[0].fsYrlimit || ''
        //             };
        //             OA.common.Paper.main().updateFileYear(values);
        //         });
        //     } else {
        //         var item = list.where("( el, i, res, param ) => el.empNo=='" + OA.common.Global.getCurrentUser().empNo + "' &&" + "el.depNo=='" + OA.common.Global.getCurrentDept().depNo + "'")[0];
        //         if (item) {
        //             values = {
        //                 年度: item.startDate,
        //                 分類號: item.fsKindno,
        //                 案次號: item.caseno,
        //                 保存年限: item.fsYrlimit
        //             };
        //             OA.client.Member.verifyCaseNo(values, function() {
        //                 OA.common.Paper.main().updateFileYear(values);
        //             });
        //         }
        //     }
        // });

        // 常用檔號移至資料庫 - by yi-chi chiu
        OA.client.Localforage.getCommonlyCaseNo2(function(list) {
            var values = {};
            if (!list || list.length == 0) {
                var dt = new Date();
                var nowYear = dt.getFullYear() - 1911;
                OA.client.Member.loadCaseNo(OA.common.Global.getCurrentDept().depNo, nowYear, function(data) {
                    //預帶第0筆
                    if (!Ext.isArray(data)) data = [data];
                    values = {
                        年度: data[0].startDate || '',
                        分類號: data[0].fsKindno || '',
                        案次號: data[0].caseno || '',
                        保存年限: data[0].fsYrlimit || ''
                    };
                    OA.common.Paper.main().updateFileYear(values);
                });
            } else {
                var itemList = list.where("( el, i, res, param ) => JSON.parse(B64.decode(el.phrase)).empNo=='" + OA.common.Global.getCurrentUser().empNo + "' &&" + " JSON.parse(B64.decode(el.phrase)).depNo=='" + OA.common.Global.getCurrentDept().depNo + "'");

                if (!Ext.isArray(itemList)) itemList = [itemList];
                //console.log(itemList);
                // 保存年限超過30年不可採線上簽核- by yi-chi chiu
                //itemList =  itemList.filter(item => !(OA.common.Utils.checkEpaper() && parseInt(JSON.parse(B64.decode(item.phrase)).fsYrlimit) > 30 && OA.common.Global.getQ().app !== 'offline'));

                itemList = itemList.filter(function(item)  {
                    return !(OA.common.Utils.checkEpaper() && parseInt(JSON.parse(B64.decode(item.phrase)).fsYrlimit) > 30 && OA.common.Global.getQ().app !== 'offline');
                });

                if (itemList.length) {
                    item = JSON.parse(B64.decode(itemList[0].phrase));
                    values = {
                        年度: item.startDate,
                        分類號: item.fsKindno,
                        案次號: item.caseno,
                        保存年限: item.fsYrlimit
                    };
                    OA.client.Member.verifyCaseNo(values, function() {
                        OA.common.Paper.main().updateFileYear(values);
                    });
                }
            }
        });
    },

    doKeepAlive: function (callback) {
        var me = this;

        //重新進入或有切換文稿，關閉之前ID，重新60分timeOut計時
        var oldTimerId = me.getTimerId();
        if (oldTimerId)
            clearTimeout(oldTimerId);

        var interal = 60 * 1000 * 60;

        function doTimer() {
            //30分鐘沒有動作timeOut，關閉60分的timerId，重新計算1分鐘內無動作關閉製作視窗
            var timeOutId = me.getTimerId();
            clearTimeout(timeOutId);

            //啟動1分鐘動作計算時間
            me.doActiveTimeOut();

            Ext.Ajax.request({
                url: OA.common.UrlMgr.restUrl('check'),
                withCredentials: true,
                useDefaultXhrHeader: false,
                success: function (response) {
                    if (callback) callback(response.responseText)
                }
            });
            return;
        }

        //60分鐘記時ID
        var timerId = Ext.Function.defer(doTimer, interal);
        me.setTimerId(timerId);
    },
    doActiveTimeOut: function () {
        var me = this;
        //5分鐘動作計時
        var activeInteral = 5 * 1000 * 60;

        Ext.Msg.show({
            title: '提醒',
            message: '已經60分鐘無切換文稿動作，是否繼續編輯文稿？',
            width: 300,
            buttons:  [
                {text: '確定', itemId: 'yes', ui: 'confirm'},
                {text: '登出', itemId: 'no', ui: 'cancel'}
            ],
            iconCls: Ext.MessageBox.INFO,
            fn: function (buttonId, a, b) {
                if (buttonId == 'yes') {
                    //關閉10分鐘動作內計時，重啟60分切換文稿動作計時
                    var stopActiveId = me.getTimerId();
                    // 系統自動關閉不提示訊息 - by yi-chi chiu
                    OA.app.autoClose = true;
                    localStorage.setItem('oa_isAutoClose', 'true');
                    if (stopActiveId) {
                        clearTimeout(stopActiveId);
                    }
                    me.doKeepAlive();
                    return;
                } else {
                    //按離開關閉視窗
                    var stopActiveId = me.getTimerId();
                    if (stopActiveId) {
                        clearTimeout(stopActiveId);
                        //OA.common.Bridge.doClose();
                        window.close();
                    }
                }
            }
        });

        function doTimer() {
            //1分鐘後無任何動作自動關閉視窗
            var activeTimeOutId = me.getTimerId();
            // 系統自動關閉不提示訊息 - by yi-chi chiu
            OA.app.autoClose = true;
            localStorage.setItem('oa_isAutoClose', 'true');
            if (activeTimeOutId)
                clearTimeout(activeTimeOutId);
            window.close();
            //OA.common.Bridge.doClose();
        }

        //1分鐘動作計時ID
        var activeTimerId = Ext.Function.defer(doTimer, activeInteral);
        me.setTimerId(activeTimerId);
    }
});