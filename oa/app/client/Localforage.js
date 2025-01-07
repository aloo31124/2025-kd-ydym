/**
 * Attach Client
 */

Ext.define('OA.client.Localforage', {
    alias: 'client.Localforage',
    singleton: true,
    requires: [],
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    setLoginInfo: function (data, callback) {
        localforage.setItem('loginInfo', JSON.stringify(data), function (err) {
            if (err) {
                console.log(err);
            } else {
                if (callback) callback();
            }
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    initParas: function () {
        localforage.getItem('loginInfo', function (err, value) {
            if (err) {
                console.log(err);
            } else {
                var info = JSON.parse(value);
                if (info) {
                    OA.common.Global.setQueryDefault(info.交換資訊);
                    OA.common.Global.setCurrentUser(info.user);
                    OA.common.Global.setVerifyConfig(info.verifyconfig);

                    console.log(info);
                    // 用depNo找不到對的人
                    // var d = info.depts.where("( el, i, res, param ) =>el.depNo=='" + info.user.depNo + "'")[0];
                    // var r = info.roles.where("( el, i, res, param ) =>el.depNo=='" + info.user.depNo + "'")[0];
                    var d = info.depts[0];
                    var r = info.roles[0];
                    OA.common.Global.setCurrentDept(d);
                    OA.common.Global.setCurrentRole(r);

                    var input = {
                        dialogType: '2',
                        //組織
                        orgNo: d.orgNo,
                        depName: d.depName,
                        orgId: d.orgId,
                        doDeptno: d.doDeptno,
                        //角色
                        jobNo: r.jobNo,
                        roleId: r.roleId,
                        //使用者
                        userId: info.user.userId,
                        empNo: info.user.empNo,
                        depNo: info.user.depNo,
                        empName: info.user.empName
                    };
                    OA.common.Global.setInitParas(input);

                    Ext.getStore('SendWay').doInit();
                }
            }
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    setCommonlyDoc: function (data, callback) {
        localforage.setItem('commonlyDoc', JSON.stringify(data), function (err) {
            if (err) {
                console.log(err);
            } else {
                if (callback) callback();
            }
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    getCommonlyDoc: function (callback) {
        localforage.getItem('commonlyDoc', function (err, value) {
            if (err) {
                console.log(err);
            } else {
                var data = JSON.parse(value);
                if (callback) callback(data);
            }
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    setCommonlyCaseNo: function (data, callback) {
        localforage.setItem('commonlyCaseNo', JSON.stringify(data), function (err) {
            if (err) {
                console.log(err);
            } else {
                if (callback) callback();
            }
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    setCommonlyCaseNo2: function(data, callback) {
        // 常用檔號移至資料庫 - by yi-chi chiu
        var _paras = OA.common.Global.getInitParas();
        var _input = {
            empNo: _paras.empNo,
            phrase: B64.encode(JSON.stringify(data)),
            action: 'create',
            kindNo: '999'
        };
        console.log(data);
        OA.client.Phrase.excute(_input, function (value) {
            var data = value.children;
            if (callback)  {
                callback(data);
            }
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    getCommonlyCaseNo: function (callback) {
        localforage.getItem('commonlyCaseNo', function (err, value) {
            if (err) {
                console.log(err);
            } else {
                var data = JSON.parse(value);
                if (callback) callback(data);
            }
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    getCommonlyCaseNo2: function(callback) {
        // 常用檔號移至資料庫 - by yi-chi chiu
        var _paras = OA.common.Global.getInitParas();
        var _input = {
            empNo: _paras.empNo,
            action: 'query',
            kindNo: '999'
        };
        OA.client.Phrase.excute(_input, function (value) {
            var data = value.children;
            if (callback)  {
                callback(data);
            }
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    updateCommonlyCaseNo: function(data) {
        // 常用檔號移至資料庫 - by yi-chi chiu
        var _paras = OA.common.Global.getInitParas();
        data.forEach(function(_data){
            var _input = {
                empNo: _paras.empNo,
                phrase: B64.encode(JSON.stringify(_data)),
                action: 'update',
                kindNo: '999',
                phraseId: _data.phraseId,
                sortNo: _data.sortNo
            };
            console.log(_data);
            OA.client.Phrase.excute(_input, function (value) {
                var data = value.children;
            });
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    initCommonlyCaseNo: function (initdata, callback) {
        console.log(initdata);
        var me = this;
        me.getCommonlyCaseNo(function (value) {
            if (!value) {
                me.setCommonlyCaseNo([initdata], function () {
                    if (callback) callback();
                });
            }
            var has = false;
            Ext.Array.each(value, function (item) {
                //=> 修正 兩個以上案次號 檔案無法加入我的最愛 by joshua kang
                if (item.empNo == OA.common.Global.getCurrentUser().empNo &&
                    item.depNo == OA.common.Global.getCurrentDept().depNo &&
                    item.fsKindno+item.caseno === initdata.fsKindno + initdata.caseno
                    ) has = true;
            });
            //=>

            //    if (item.empNo == OA.common.Global.getCurrentUser().empNo &&
            //        item.depNo == OA.common.Global.getCurrentDept().depNo &&
            //        item.fsKindno == initdata.fsKindno
            //        ) has = true;
            //});
            if (!has) {
                console.log(value);
                value.push(initdata);
                me.setCommonlyCaseNo(value, function () {
                    if (callback) callback();
                });
            }
            else
                Ext.Msg.alert('提示', '已有加入常用檔號中');
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    initCommonlyCaseNo2: function(initdata, callback) {
        // 常用檔號移至資料庫 - by yi-chi chiu
        console.log(initdata);
        var me = this;
        me.getCommonlyCaseNo2(function(value) {
            if (!value) {
                me.setCommonlyCaseNo2([
                    initdata
                ], function() {
                    if (callback)  {
                        callback();
                    }
                    
                });
            }
            var has = false;
            Ext.Array.each(value, function(item) {
                //=> 修正 兩個以上案次號 檔案無法加入我的最愛 by joshua kang
                var _item = JSON.parse(B64.decode(item.phrase));
                if (_item.empNo == OA.common.Global.getCurrentUser().empNo && _item.depNo == OA.common.Global.getCurrentDept().depNo && _item.fsKindno + _item.caseno === initdata.fsKindno + initdata.caseno)  {
                    has = true;
                }
            });
            if (!has) {
                console.log(value);
                me.setCommonlyCaseNo2(initdata, function() {
                    if (callback)  {
                        callback();
                    }
                    
                });
            } else  {
                Ext.Msg.alert('提示', '已有加入常用檔號中');
            }
            
        });
    },
    /**
     *
     */
    getSetting: function (callback) {
        var store =localforage.getItem('setting', function (err, value) {
            if (err) {
                console.log(err);
            } else {
                if(callback) callback(JSON.parse(value));
            }
        });
        return store;
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    setSetting: function (input, callback) {
        localforage.getItem('setting').then(function(value) {
            var data =JSON.parse(value) ||{};
            Ext.apply(data,input);
            return data;
        }).then(function(newValue) {
            localforage.setItem('setting', JSON.stringify(newValue), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    if (callback) callback();
                }
            });
        }).catch(function(err) {
            // This code runs if there were any errors
            console.log(err);
        });
    }
});