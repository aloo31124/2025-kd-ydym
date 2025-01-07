/**
 * 檔案操作
 */

Ext.define('OA.client.File', {
    alias: 'client.File',
    singleton: true,
    requires: ['OA.client.Barrier'],
    config: {
        status: 'unchecked'
    },
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    doFile: function (options, callback) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var action = options.action;
        var files = options.files;

        var when = Ext.util.Format.date(new Date(), "H:i:s");

        me.setStatus('unchecked');
        console.log('------- prepare ( ' + when + ' ) -------');
        console.log(Ext.clone(options));
        //採用簽章元件操作檔案及簽章
        if (typeof require === 'undefined') {
            options.func = (options.func) ? options.func : 'doFile';

            var postTarget;
            if (Ext.browser.is.IE) {
                postTarget = document.getElementById('postFrame').contentWindow;
                postTarget.postMessage({ func: 'init' }, "*");
            } else if (Ext.os.is.Android) {
                if (typeof KdAndroid !== 'undefined') {

                    options.workFlow = 'N';
                    options.tmpCard = 'N';

                    clearTimeout(notWorkTimeout);
                    me.doService(options, function (ret) {
                        options.json = ''; //避免base64 decode error
                        console.log('------- KdAndroid.doSign  -------');
                        console.log(Ext.clone(options));
                        KdAndroid.doSign(B64.encode(JSON.stringify(options)));
                    });

                } else {
                    console.log('KdAndroid undefined');
                    // Android Chrome瀏覽器使用臨時憑證 - by yi-chi chiu
                    if (Ext.browser.is.WebView == false) {
                        //不提醒自動臨憑簽章
                        options.workFlow = 'N';
                        options.tmpCard = 'Y';
                        me.doService(options, function (ret) {
                            if (callback) {
                                callback(ret);
                            }

                        });
                        /*
                        Ext.Msg.confirm("使用臨時憑證", "無法使用雲端憑證，是否申請臨時憑證？ 注意需補簽！", function (ok) {
                            if ('yes' == ok) {
                                options.workFlow = 'N';
                                options.tmpCard = 'Y';
                                me.doService(options, function (ret) {
                                    if (callback) {
                                        callback(ret);
                                    }

                                });
                            } else {
                                Ext.Viewport.setMasked(false);
                                var menuLeft = Ext.Viewport.getMenus().left;
                                if (menuLeft) {
                                    menuLeft.setMasked(false);
                                }

                            }
                        });
                        */
                    } else {
                        options.workFlow = 'N';
                        options.tmpCard = 'N';
                        me.doService(options, function (ret) {
                            options.json = '';
                            //避免base64 decode error
                            console.log('------- callObjFunctionForIOS from default.jsp -------');
                            console.log(Ext.clone(options));
                            top.callObjFunctionForIOS(B64.encode(JSON.stringify(options)));
                        });
                    }
                }
                return;
            } else if (Ext.os.is.iOS) {
                //不提醒自動臨憑簽章
                if (Ext.browser.is.WebView == false) {
                    options.workFlow = 'N';
                    options.tmpCard = 'Y';
                    me.doService(options, function (ret) {
                        if (callback) callback(ret);
                    });
                    /*
                   Ext.Msg.confirm("使用臨時憑證", "無法使用雲端憑證，是否申請臨時憑證？ 注意需補簽！", function (ok) {
                       if ('yes' == ok) {
                           options.workFlow = 'N';
                           options.tmpCard = 'Y';
                           me.doService(options, function (ret) {
                               if (callback) callback(ret);
                           });
                       } else {
                           Ext.Viewport.setMasked(false);
                           var menuLeft = Ext.Viewport.getMenus().left;
                           if (menuLeft) menuLeft.setMasked(false);
                       }
                   });
                   */
                } else {
                    options.workFlow = 'N';
                    options.tmpCard = 'N';
                    me.doService(options, function (ret) {
                        options.json = ''; //避免base64 decode error
                        console.log('------- callObjFunctionForIOS from default.jsp -------');
                        console.log(Ext.clone(options));
                        top.callObjFunctionForIOS(B64.encode(JSON.stringify(options)))
                    });
                }

                return;
            } else {

                if (options.func === 'doSign' && options.approveAuto == true) {
                    options.tmpCard = 'Y';
                    me.doService(options, function (ret) {
                        if (callback) callback(ret);
                    });
                } else {
                    postTarget = window.open(KangDaAppConfig().host_sign, options.func, "height=85, width=85, left=100, top=20");

                    var timer = setInterval(checkChild, 500);

                    function checkChild() {
                        if (postTarget.closed) {
                            /*
                            Ext.Viewport.setMasked(false);
                            var menuLeft = Ext.Viewport.getMenus().left;
                            if (menuLeft) menuLeft.setMasked(false);
                            */
                            clearInterval(timer);
                        }
                    }
                }
            }

            var notWorkTimeout = setTimeout(function () {
                var status = me.getStatus();
                console.log('------- notWorkTimeout ( ' + when + ' ) -------');
                if (postTarget && status === 'unchecked') {
                    if (!Ext.browser.is.IE11) postTarget.close();


                    if (options.func === 'doSign') {
                        if (qs.app === 'genpages') {
                            Ext.Msg.alert('提示', '未啟動簽章元件!');
                            return;
                        }
                        //簽章元件未啟動或未插卡自動臨憑簽章
                        options.workFlow = 'N';
                        options.tmpCard = 'Y';
                        me.doService(options, function (ret) {
                            if (callback) callback(ret);
                        });

                        /*
                        if (qs.app === 'genpages') {
                            Ext.Msg.alert('提示', '未啟動簽章元件!');
                            return;
                        }
                        Ext.Msg.confirm("使用臨時憑證", "未安裝元件，是否申請臨時憑證？ 注意需補簽", function (ok) {
                            if ('yes' == ok) {
                                options.workFlow = 'N';
                                options.tmpCard = 'Y';
                                me.doService(options, function (ret) {
                                    if (callback) callback(ret);
                                });
                            } else {
                                Ext.Viewport.setMasked(false);
                                var menuLeft = Ext.Viewport.getMenus().left;
                                if (menuLeft) menuLeft.setMasked(false);
                            }
                        });
                        */
                    } else {
                        window.removeEventListener('message', returnMessage);
                        Ext.Msg.alert('無法開啟簽章元件', '請檢查是否安裝簽章元件');
                        Ext.Viewport.setMasked(false);
                        var menuLeft = Ext.Viewport.getMenus().left;
                        if (menuLeft) menuLeft.setMasked(false);
                    }
                }
            }, 10000);

            var returnMessage = function (event) {
                try {
                    me.setStatus('ok');
                    var ret = JSON.parse(event.data);
                    console.log('------- return message  -------');
                    console.log(ret);

                    //有卡時，先簽章前准備後AP簽章，無卡時，臨憑Server簽章，皆不跑流程，送回管理端處理
                    //ret.tempfrom S代表使用Server臨憑簽章；C代表使用Client臨憑簽章

                    // 另存時更改儲存位置  - by yi-chi chiu
                    if (ret.newPath) {
                        OA.common.FileMgr.setOpenDialogPath(ret.newPath);
                    }
                    if (ret.status == '0') {
                        clearTimeout(notWorkTimeout);

                        if (ret.defaultPath) {
                            OA.common.FileMgr.setDefaultPath(ret.defaultPath);
                            if (!options.defaultPath) options.defaultPath = ret.defaultPath;
                        }

                        if (options.func === 'init') {
                            window.removeEventListener("message", returnMessage);
                            postTarget.close();
                            if (callback) callback(ret);
                            return;
                        }

                        if (options.func === 'doSign') {
                            options.workFlow = 'N';
                            if (ret.card == 'N' || ret.card == 'X') {
                                if (options.methodId === 'archive') {
                                    //送歸檔不走臨憑
                                   //簽章元件未啟動或未插卡自動臨憑簽章
                                    /*
                                    window.removeEventListener("message", returnMessage);
                                    postTarget.close();
                                    options.tmpCard = 'Y';
                                    me.doService(options, function (ret) {
                                        if (callback) callback(ret);
                                    });
                                    return;
                                    */                                     
                                    Ext.Msg.alert('提示', '讀不到卡片!');
                                    window.removeEventListener("message", returnMessage);
                                    postTarget.close();
                                    return;
                                    
                                }

                                
                                //未插卡多跑5次迴圈                               
                                if (options.signCnt <= 5) {
                                    console.log(options.signCnt);
                                    ret.reSign = true;
                                    ret.signCnt = options.signCnt + 1;
                                    if (callback) callback(ret);
                                    return;
                                }
                                

                                //簽章元件未啟動或未插卡自動臨憑簽章
                                window.removeEventListener("message", returnMessage);
                                postTarget.close();
                                options.tmpCard = 'Y';
                                me.doService(options, function (ret) {
                                    if (callback) callback(ret);
                                });

                                /*
                                Ext.Msg.confirm("是否使用臨時憑證？", "讀不到卡片，是否使用臨時憑證？", function (ok) {
                                    if ('yes' == ok) {
                                        if (ret.tempfrom === 'C') {
                                            options.tmpCard = 'N';

                                            me.doService(options, function () {
                                                console.log('------- post message  -------');
                                                console.log(Ext.clone(options));
                                                postTarget.postMessage(options, "*");
                                            });
                                        } else {
                                            window.removeEventListener("message", returnMessage);
                                            postTarget.close();
                                            options.tmpCard = 'Y';
                                            me.doService(options, function (ret) {
                                                if (callback) callback(ret);
                                            });
                                        }
                                    } else {
                                        window.removeEventListener("message", returnMessage);
                                        postTarget.close();
                                        Ext.Viewport.setMasked(false);
                                        var menuLeft = Ext.Viewport.getMenus().left;
                                        if (menuLeft) menuLeft.setMasked(false);
                                        //    OA.common.Global.getApp().getController('OA.controller.Work').getCpaper().setIsLockPaper(false);
                                        //   console.log( OA.common.Global.getApp().getController('OA.controller.Work').getCpaper().setIsLockPaper(false);)
                                    }
                                });
                                */
                            } else {
                                options.tmpCard = 'N';
                                me.doService(options, function (ret) {
                                    console.log('------- post message  -------');
                                    console.log(Ext.clone(options));
                                    postTarget.postMessage(options, "*");
                                });
                            }
                        } else {
                            console.log('------- post message  -------');
                            console.log(Ext.clone(options));
                            postTarget.postMessage(options, "*");
                        }
                    } else if (ret.status == '-1') {
                        console.log('------- error message  -------');
                        // console.log(ret);
                        if (ret.message !== undefined) {
                            Ext.Msg.alert('錯誤', ret.message);
                        } else if (ret.errorMsg) {
                            Ext.Msg.alert('錯誤', ret.errorMsg);
                        }
                        window.removeEventListener("message", returnMessage);
                        postTarget.close();
                        Ext.Viewport.setMasked(false);
                        var menuLeft = Ext.Viewport.getMenus().left;
                        if (menuLeft) menuLeft.setMasked(false);
                    } else {
                        window.removeEventListener("message", returnMessage);
                        postTarget.close();
                        if (callback) callback(ret);
                    }
                } catch (e) {
                    console.log(e);
                    window.removeEventListener("message", returnMessage);
                    Ext.Viewport.setMasked(false);
                }
            };

            window.removeEventListener('message', returnMessage);
            window.addEventListener("message", returnMessage);
            return;
        }

        //Node 操作檔案
        var fs = require('fs');
        var path = require('path');
        var dialog = require('electron').remote.dialog;

        function checkDirectorySync(directory) {
            try {
                fs.statSync(directory);
            } catch (e) {
                fs.mkdirSync(directory);
            }
        }

        function fileExists(path) {
            try {
                return fs.statSync(path).isFile();
            }
            catch (e) {
                if (e.code == 'ENOENT') { // no such file or directory. File really does not exist
                    // console.log("File does not exist.");
                    return false;
                }
                console.log("Exception fs.statSync (" + path + "): " + e);
                throw e; // something else went wrong, we don't have rights, ...
            }
        }

        var items = [];
        if (action == 'write') {
            checkDirectorySync(options.defaultPath);
            var overlap = options.folder.trim().toLowerCase().indexOf(options.defaultPath.toLowerCase()) >= 0;
            var workPath = overlap ? options.folder : me.pathJoin(options.defaultPath, options.folder);
            if (!options.folder) workPath = options.defaultPath;
            checkDirectorySync(workPath);
            var success = true;
            Ext.Array.each(files, function (f) {
                var folder = workPath;
                if (f.folderName) {
                    folder = me.pathJoin(workPath, f.folderName);
                    checkDirectorySync(folder);
                }
                var fullPath = me.pathJoin(folder, f.fileName);
                try {
                    if (f.folderName === 'attach') { //附件保留原資料儲存
                        fs.writeFileSync(fullPath, f.fileContent, 'base64');
                    } else {
                        fs.writeFileSync(fullPath, f.fileContent); //其他採base64儲存
                    }
                } catch (e) {
                    console.log(e);
                    success = false;
                }
            });
            if (callback) callback({ success: success, workPath: workPath });
        } else if (action == 'read') {
            var retfiles = me.readFiles(options);
            if (callback) callback(retfiles);
        } else if (action == 'folders') {
            Ext.Array.each(files, function (f) {
                checkDirectorySync(f);
            });
        } else if (action == 'fileExists') {
            Ext.Array.each(files, function (f) {
                f.exists = fileExists(f.fullPath);
                items.push(f);
            });
            return items;
        } else if (action == 'open') {
            dialog.showOpenDialog({
                properties: ['openDirectory'],
                defaultPath: options.defaultPath
            }, function (fileNames) {
                console.log(fileNames);
                if (!fileNames) return;
                options.fileNames = fileNames;
                if (callback) callback(options);
            });
        } else if (action == 'exec') {
            var cmdOpen = (process.platform == 'darwin') ? 'open' : 'start';
            var exec = require('child_process').exec;
            var folder = me.pathJoin(options.defaultPath, options.folder);
            var folderAttach = me.pathJoin(folder, 'attach');
            var fullPath = me.pathJoin(folderAttach, options.files[0].fileName);
            exec(cmdOpen + ' ' + fullPath);
        } else if (action == 'openDialog') {
            dialog.showOpenDialog({
                properties: ['openFile', 'multiSelections'],
                defaultPath: options.defaultPath
            }, function (fileNames) {
                if (!fileNames) return;
                options.fileNames = fileNames;
                if (callback) callback(options);
            });
        } else if (action == 'saveDialog') {
            console.log(options);
            dialog.showSaveDialog({
                properties: ['openDirectory', 'createDirectory'],
                defaultPath: options.to
            }, function (fileName) {
                if (fileName === undefined) return;
                if (callback) callback(fileName);
            });
        } else if (action == 'upload') {
            options = me.readFiles(options);
            if (callback) callback(options);
        } else if (action == 'doImport') {
            dialog.showOpenDialog({
                properties: ['openFile'],
                defaultPath: options.defaultPath
            }, function (fileNames) {
                if (!fileNames) return;
                var fullPath = fileNames[0];
                try {
                    fs.statSync(fullPath);
                    options.di = fs.readFileSync(fullPath, 'utf-8');

                    var isbig5 = options.di.indexOf('encoding="big5"') >= 0;
                    if (isbig5) {
                        var iconv = require('iconv-lite');
                        options.di = iconv.decode(fs.readFileSync(fullPath), 'big5');
                    }
                    options.status = '1';
                } catch (e) {
                    console.log(e);
                    options.status = '-1';
                }

                var swFileName = path.basename(fullPath).replace('.di', '') + '.sw';

                var p = path.resolve(fullPath, "../attch/" + swFileName);
                if (callback) callback(options);
            });
        } else if (action == 'init') {
            options.defaultPath = require('electron').remote.app.getPath('documents');
            if (callback) callback(options);
        }
    },
    doService: function (options, callback) {
        if (options.methodId == 'docsend' || options.methodId == 'exchange') {
            OA.client.Exchange.excute(options, function (ret) {
                if (callback) callback(ret);
            });
        } else {
            OA.client.Barrier.execute(options, function (ret) {
                if (callback) callback(ret);
            });
        }
    },
    readFiles: function (options) {
        var me = this;
        var fs = require('fs');
        var type = options.type || 'utf-8';
        Ext.Array.each(options.files, function (f) {
            var folder = options.defaultPath;
            if (f.folderName) folder = me.pathJoin(options.defaultPath, f.folderName);

            var fullPath = me.pathJoin(folder, f.fileName);
            try {
                fs.statSync(fullPath);
                f.fileContent = fs.readFileSync(fullPath, type);
            } catch (e) {
                console.log(e);
            }
        });
        Ext.Array.each(options.attachs, function (f) {
            var folder = options.defaultPath;
            if (f.folderName) folder = me.pathJoin(options.defaultPath, f.folderName);

            var fullPath = me.pathJoin(folder, f.fileName);
            try {
                fs.statSync(fullPath);
                f.fileContent = fs.readFileSync(fullPath, type);
            } catch (e) {
                console.log(e);
            }
        });
        return options;
    },
    readFileList: function (list) {
        var me = this;
        var fs = require('fs');
        var path = require('path');
        var items = [];

        var orgNo = OA.common.Global.getInitParas().orgNo;
        var empName = OA.common.Global.getInitParas().empName;
        var depName = OA.common.Global.getCurrentDept().depName;
        orgNo = (orgNo) ? orgNo : '';
        empName = (empName) ? empName : '';
        depName = (depName) ? depName : '';
        Ext.Array.each(list, function (p) {
            try {
                var stat = fs.statSync(p);
                var folders = path.dirname(p).split(path.sep);
                items.push({
                    fileKey: path.basename(p),
                    fileName: orgNo + padLeft(OA.common.Utils.getRandom(0, 9999999999), 11) + path.extname(p),
                    folderName: folders.pop(),
                    fileType: path.extname(p),
                    // fileContent: B64.encode(fs.readFileSync(p, 'utf-8')),
                    fileContent: fs.readFileSync(p, 'base64'),
                    fileSize: stat.size,
                    status: '1',
                    personnel: empName,
                    depName: depName,
                    operateTime: OA.common.Utils.getChineseDate()
                });
            } catch (e) {
                console.log(e);
            }
        });
        return items;
    },
    pathJoin: function (p1, p2) {
        if (typeof require != 'undefined') {
            var path = require('path');
            return path.join(p1, p2);
        } else {
            return p1 + '/' + p2;
        }
    },
    xcopy: function (from, to) {
        var fs = require('fs');
        var path = require('path');

        /**
         * Look ma, it's cp -R.
         * @param {string} src The path to the thing to copy.
         * @param {string} dest The path to the new copy.
         */
        var copyRecursiveSync = function (src, dest) {
            var exists = fs.existsSync(src);
            var stats = exists && fs.statSync(src);
            var isDirectory = exists && stats.isDirectory();
            if (exists && isDirectory) {
                fs.mkdirSync(dest);
                fs.readdirSync(src).forEach(function (childItemName) {
                    copyRecursiveSync(path.join(src, childItemName),
                        path.join(dest, childItemName));
                });
            } else {
                fs.linkSync(src, dest);
            }
        };

        try {
            copyRecursiveSync(from, to);
        } catch (err) {
            console.error(err)
        }
    }
});