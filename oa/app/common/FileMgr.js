/**
 * 檔案處理
 */

Ext.define('OA.common.FileMgr', {
    alias: 'client.FileMgr',
    singleton: true,
    requires: ['OA.client.File'],
    config: {
        defaultPath: '',
        saveFolder: null,
        openDialogPath: ''
    },
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },
    init: function (callback) {
        var me = this;
        me.setOpenDialogPath('');
        if (typeof require != 'undefined') {
            OA.client.Localforage.getSetting(function (values) {
                if (values && values.defaultPath) {
                    me.setDefaultPath(values.defaultPath);

                    if (callback) callback();
                    return;
                } else {
                    OA.client.File.doFile({ func: 'init', action: 'init' }, function (ret) {
                        var p = { defaultPath: ret.defaultPath, savePath: ret.defaultPath };
                        OA.client.Localforage.setSetting(p);
                        me.setDefaultPath(p.defaultPath);
                        if (callback) callback();
                    });
                }
            })
        } else {
            OA.client.File.doFile({ func: 'init', action: 'init' }, function (ret) {
                me.setDefaultPath(ret.defaultPath);
                if (callback) callback();
            });
        }
    },
    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    save: function (options, callback) {
        var me = this;
        var toPath = options.toPath;
        var paras = OA.common.Global.getInitParas();
        var list = [];
        Ext.Array.each(paras.files, function (f) {
            list.push(f);
        });
        Ext.Array.each(paras.attachs, function (f) {
            list.push(f);
        });
        var createParas = Ext.clone(OA.common.Paper.main().getCreateParas());
        createParas.oSVG.vm = OA.common.Global.getCurrentViewModel();
        // var canvasString = OA.common.Paper.main().getSvgPaper().svgCanvasToString(); //update editing content
        // createParas.oSVG.xml = canvasString.replace(/"#clipSeal_0"/g, '#clipSeal_0').replace(/"#clipSeal_1"/g, '#clipSeal_1');

        createParas.oSVG.xml = '';
        createParas.xml = '';
        createParas.Stamps = '';
        list.push({
            fileKey: '',
            fileName: paras.paperNo + '.json',
            folderName: '',
            fileType: 'json',
            fileContent: B64.encode(JSON.stringify(createParas))
        });

        list.push({
            fileKey: '',
            fileName: 'vi.json',
            folderName: '',
            fileType: 'json',
            fileContent: B64.encode(JSON.stringify(OA.common.VIMgr.getViContent()))
        });

        var folder = me.getSaveFolder();
        var defaultPath = OA.common.FileMgr.getDefaultPath();
        //修正異地開啟舊檔後存檔錯誤問題,因mac取檔號完位置不正確
        if (toPath) {
            folder = toPath.replace(me.getDefaultPath(), '');

            var fds = folder.split('/');
            if (fds.length > 1) {
                folder = fds[fds.length - 1];
                defaultPath = toPath.substring(0, toPath.lastIndexOf('/'));
            }

            fds = folder.split('\\');
            if (fds.length > 1) {
                folder = fds[fds.length - 1];
                defaultPath = toPath.substring(0, toPath.lastIndexOf('\\'));
            }
        }
        var fileOptions = {
            action: 'write',
            defaultPath: defaultPath,
            folder: (folder) ? folder : '',
            localPath: '',
            files: list
        };

        if (options.attachs) fileOptions.attachs = options.attachs;
        OA.client.File.doFile(fileOptions, function (ret) {
            var store = Ext.getStore('Attach');
            store.clearFilter();
            //store.each(function (p) {
            //    var file = p.get('file');
            //    file.fileContent = null;
            //});
            Ext.Array.each(store.data.all, function (p) {
                var file = p.get('file');
                file.fileContent = null;
            });
            OA.common.Paper.setActiveStatus('saved');

            me.setOpenDialogPath(ret.workPath);

            if (callback) callback(ret);
        });
    },
    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    saveas: function (options, callback) {
        var me = this;

        //console.log(options);
        var paras = { action: 'saveDialog', from: options.fromOpenFolder, to: options.toSaveFolder };
        OA.client.File.doFile(paras, function (saveto) {

            var qs = OA.common.Global.getQ();
            if (qs.app === 'offline') OA.client.File.xcopy(options.fromOpenFolder, saveto);

            if (callback) callback();
        });

    },

    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    open: function (callback) {
        var me = this;
        var options = {
            action: 'open',
            defaultPath: me.getDefaultPath(),
            localPath: '',
            files: [
                {
                    fileKey: '',
                    fileName: 'vi.json',
                    folderName: '',
                    fileType: 'json',
                    fileContent: null
                }
            ]
        };

        OA.client.File.doFile(options, function (ret) {
            var content = ret.files[0].fileContent;
            var path = ret.localPath;
            if (ret.fileNames) {
                ret.action = 'read';
                ret.localPath = ret.fileNames[0];
                //大小寫要一致
                var folder = ret.localPath.toLowerCase().replace(ret.defaultPath.toLowerCase(), '');

                var defaultPath = '';
                var fds = folder.split('/');
                if (fds.length > 1) {
                    folder = fds[fds.length - 1];
                    defaultPath = ret.fileNames[0].substring(0, ret.fileNames[0].lastIndexOf('/'));
                }

                fds = folder.split('\\');
                if (fds.length > 1) {
                    folder = fds[fds.length - 1];
                    defaultPath = ret.fileNames[0].substring(0, ret.fileNames[0].lastIndexOf('\\'));
                }
                ret.files[0].folderName = folder;
                ret.defaultPath = defaultPath;

                var respByNode = OA.client.File.readFiles(ret);
                content = respByNode.files[0].fileContent;
                path = ret.fileNames[0];

            }
            if (content != null) {
                me.setOpenDialogPath(path);
                me.setSaveFolder('');
            }

            if (callback) callback(content);
        });
    },
    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    openDialog: function (options, callback) {
        var me = this;
        options = Ext.apply(options, {
            action: 'openDialog',
            defaultPath: me.getDefaultPath(),
            folder: me.getSaveFolder().replace(me.getDefaultPath(), ''),
            localPath: '',
            orgNo: OA.common.Global.getInitParas().orgNo,
            files: []
        });

        OA.client.File.doFile(options, function (p) {
            var files = p.files;
            if (p.fileNames) files = OA.client.File.readFileList(p.fileNames);
            if (callback) callback(files);
        });
    },
    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    openBig: function (options, callback) {
        var me = this;
        options = Ext.apply(options, {
            action: 'openBig',
            attachs: []
        });

        OA.client.File.doFile(options, function (p) {
            var files = p.attachs;
            if (p.fileNames) files = OA.client.File.readFileList(p.fileNames);
            if (callback) callback(files);
        });
    },

    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    loadVI: function (callback) {
        var me = this;
        var options = {};
        options.action = 'read';
        if (me.getOpenDialogPath()) {
            options.defaultPath = this.getOpenDialogPath();
        } else {
            options.defaultPath = this.getDefaultPath();
            options.folder = this.getSaveFolder();
        }

        options.files = [
            {
                fileKey: '',
                fileName: 'vi.json',
                folderName: '',
                fileType: 'json',
                fileContent: null
            }
        ]
        OA.client.File.doFile(options, function (p) {
            if (p.files.length > 0) {
                var data = JSON.parse(B64.decode(p.files[0].fileContent));
                if (callback) callback(data);
            }
        });
    },

    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    load: function (paras, callback) {
        var me = this;
        var options = {};
        options.action = 'read';
        var modelName = paras.model_wk;
        OA.client.WK.setCurrentModelName(modelName);

        if (me.getOpenDialogPath()) {
            options.defaultPath = this.getOpenDialogPath();
        } else {
            options.defaultPath = this.getDefaultPath();
            options.folder = this.getSaveFolder();
        }
        options.files = [
            {
                fileKey: '',
                fileName: paras.paperNo + '.json',
                folderName: '',
                fileType: 'json',
                fileContent: null
            }
        ]
        OA.client.File.doFile(options, function (p) {
            if (p.files.length > 0) {
                if (callback) callback(p.files[0].fileContent);
            }
        });
    },
    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    loadAttach: function (paras, callback) {
        var me = this;
        var options = {};
        options.action = 'read';
        options.type = 'base64';

        if (me.getOpenDialogPath()) {
            options.defaultPath = this.getOpenDialogPath();
        } else {
            options.defaultPath = this.getDefaultPath();
            options.folder = this.getSaveFolder();
        }
        options.files = paras.files;
        OA.client.File.doFile(options, function (files) {
            if (callback) callback(files);
        });
    },

    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    exec: function (data, callback) {
        var me = this;
        var saveFolder = OA.common.FileMgr.getSaveFolder();
        var openFolder = OA.common.FileMgr.getOpenDialogPath();
        var folder = openFolder.replace(me.getDefaultPath(), '');

        // console.log(saveFolder);
        // console.log(folder);

        var options = {
            action: 'exec',
            defaultPath: me.getDefaultPath(),
            folder: folder,
            files: [
                data.file
            ]
        };

        OA.client.File.doFile(options, function (ret) {
            if (callback) callback(ret);
        });
    },
    /**
     *
     * @param {String} options
     * @param {Function} callback
     */
    downloadBig: function (data, callback) {
        var me = this;

        var f = Ext.clone(data.file);
        //console.log(f);
        //f.folderName = 'attach';

        var options = {
            action: 'downloadBig',
            biginfo: OA.common.VIMgr.getViContent().入徑.大型資訊,
            attachs: [f]
        };

        OA.client.File.doFile(options, function (ret) {
            if (callback) callback(ret);
        });
    },

    setNewSaveFolder: function () {
        var folder = this.uuid(8, 16);
        this.setSaveFolder(folder);
    },
    uuid: function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    },
    upload: function (callback) {
        var paras = OA.common.Global.getInitParas();
        paras.action = 'upload';
        paras.url = OA.common.UrlMgr.restUrl('wk', 'create') + '?token=' + OA.common.UrlMgr.getToken();
        paras.defaultPath = OA.common.FileMgr.getOpenDialogPath();
        OA.client.File.doFile(paras, function (ret) {
            if (callback) callback(ret);
        });
    },
    uploadOld: function (callback) {
        var paras = OA.common.Global.getInitParas();
        // console.log(Ext.clone(paras));

        paras.action = 'upload';
        paras.url = OA.common.UrlMgr.restUrl('wk', 'save') + '?token=' + OA.common.UrlMgr.getToken();
        paras.defaultPath = OA.common.FileMgr.getOpenDialogPath();
        OA.client.File.doFile(paras, function (ret) {
            if (callback) callback(ret);
        });
    },
    doImport: function () {
        var qs = OA.common.Global.getQ();
        var vi = OA.common.VIMgr.getViContent();
        var paras = {};
        paras.func = 'doFile';
        paras.action = 'doImport';
        paras.biginfo = (vi) ? vi.入徑.大型資訊 : '';
        var defaultPath = OA.common.FileMgr.getDefaultPath();
        var openFolder = OA.common.FileMgr.getOpenDialogPath();
        var folder = openFolder.replace(defaultPath, '');
        paras.defaultPath = defaultPath;
        paras.folder = folder;

        //OA.client.File.doFile(paras, function (ret) {
        OA.common.FileMgr.openDialog(options, function (files) {
            if (ret.status !== -1) {
                var xdi, xsw;
                if (qs.app === 'approve' || qs.app === 'editor') {   //取號後匯入
                    xdi = B64.decode(ret.files[0].fileContent);
                    if (ret.files.length > 1)
                        xsw = B64.decode(ret.files[1].fileContent);
                } else if (qs.app === 'offline') {
                    xdi = ret.di;
                    xsw = ret.sw;
                }

                var idx;
                if (xdi.indexOf(']>') >= 0) {
                    idx = xdi.indexOf(']>') + 2;
                } else if (xdi.indexOf('.dtd') >= 0) {
                    idx = xdi.indexOf('.dtd') + 6;
                }
                xdi = xdi.substring(idx);

                idx = 0;
                if (xsw) {
                    if (xsw.indexOf(']>') >= 0) {
                        idx = xsw.indexOf(']>') + 2;
                    } else if (xsw.indexOf('.dtd') >= 0) {
                        idx = xsw.indexOf('.dtd') + 6;
                    }
                    xsw = xsw.substring(idx);
                }
                var xmlDoc = '';
                try {
                    xmlDoc = $.parseXML(xdi);
                } catch (err) {
                    if (err) console.log(err);
                    return { err: err };
                }
                var $xml = $(xmlDoc);
                var qFormat = $xml.context.documentElement.nodeName.trim();

                //函、令類別
                var hasCategory = ['函', '令'];
                if (hasCategory.indexOf(qFormat) >= 0) {
                    var childNodes = $xml.context.documentElement.childNodes;
                    if (childNodes) {
                        Ext.Array.each(childNodes, function (nodes) {
                            if (nodes.nodeName.trim().indexOf(qFormat + '類別') >= 0) {
                                if (nodes.attributes && nodes.attributes.length > 0) {
                                    Ext.Array.each(nodes.attributes, function (attr) {
                                        if (attr.nodeName == '代碼') {
                                            if (attr.value && attr.value != '')
                                                qFormat = attr.value.trim();
                                        }
                                    });
                                }
                            }
                        });
                    }
                }

                var values = {
                    qFormat: qFormat,
                    qNumberWay: "1",
                    qTemplate: qFormat,
                    qc: "2",
                    di: xdi,
                    sw: xsw,
                    attachs: ret.attachs
                }

                if (vi) {
                    values.action = 'add';
                    values.qIsNew = false;
                } else {
                    values.action = 'create';
                    values.qIsNew = true;
                    values.attachs = []; //此時尚未有資料夾，需重夾附件
                }
                if (ret.action == 'doImport') {//判別匯入DI檔時，是否有檔號，如果有檔號跳出資訊提示  Chloe.sia 0423
                    var str = values.di;
                    var n = str.indexOf("年度");
                    if (n > 0 && n < 10) {
                        Ext.Msg.alert('提示', '請確認匯入相關資料的內容<br>(如:受文者、檔號等)');
                    }
                }
                OA.common.Global.getApp().getController('OA.controller.Work').onNewDocPaper(null, values);
            }
        });
    },
    noServiSignDoImport: function (XML) {
        var qs = OA.common.Global.getQ();
        var vi = OA.common.VIMgr.getViContent();
        var paras = {};
        paras.func = 'doFile';
        paras.action = 'doImport';
        paras.biginfo = (vi) ? vi.入徑.大型資訊 : '';
        var defaultPath = OA.common.FileMgr.getDefaultPath();
        var openFolder = OA.common.FileMgr.getOpenDialogPath();
        var folder = openFolder.replace(defaultPath, '');
        paras.defaultPath = defaultPath;
        paras.folder = folder;

        // OA.client.File.doFile(paras, function (ret) {
        // if (ret.status !== -1) {
        var xdi, xsw;
        if (qs.app === 'approve' || qs.app === 'editor') {   //取號後匯入
            xdi = XML
            // if (ret.files.length > 1)
            xsw = XML
        } else if (qs.app === 'offline') {
            xdi = XML
            xsw = XML
        }

        var idx;
        if (xdi.indexOf(']>') >= 0) {
            idx = xdi.indexOf(']>') + 2;
        } else if (xdi.indexOf('.dtd') >= 0) {
            idx = xdi.indexOf('.dtd') + 6;
        }
        xdi = xdi.substring(idx);

        idx = 0;
        if (xsw) {
            if (xsw.indexOf(']>') >= 0) {
                idx = xsw.indexOf(']>') + 2;
            } else if (xsw.indexOf('.dtd') >= 0) {
                idx = xsw.indexOf('.dtd') + 6;
            }
            xsw = xsw.substring(idx);
        }
        var xmlDoc = '';
        try {
            xmlDoc = $.parseXML(xdi);
        } catch (err) {
            if (err) console.log(err);
            return { err: err };
        }
        var $xml = $(xmlDoc);
        var qFormat = $xml.context.documentElement.nodeName.trim();

        //函、令類別
        var hasCategory = ['函', '令'];
        if (hasCategory.indexOf(qFormat) >= 0) {
            var childNodes = $xml.context.documentElement.childNodes;
            if (childNodes) {
                Ext.Array.each(childNodes, function (nodes) {
                    if (nodes.nodeName.trim().indexOf(qFormat + '類別') >= 0) {
                        if (nodes.attributes && nodes.attributes.length > 0) {
                            Ext.Array.each(nodes.attributes, function (attr) {
                                if (attr.nodeName == '代碼') {
                                    if (attr.value && attr.value != '')
                                        qFormat = attr.value.trim();
                                }
                            });
                        }
                    }
                });
            }
        }


        var jobTitle = Ext.getCmp('jobTitle');
        var qJobTitle = -1;
        if (jobTitle) {
            qJobTitle = jobTitle.getValue();
        }

        var values = {
            qFormat: qFormat,
            qNumberWay: "1",
            qTemplate: qFormat,
            qc: "2",
            di: xdi,
            sw: xsw,
            qJobTitle: qJobTitle
            // attachs: ret.attachs
        }

        if (vi) {
            values.action = 'add';
            values.qIsNew = false;
        } else {
            values.action = 'create';
            values.qIsNew = true;
            values.attachs = []; //此時尚未有資料夾，需重夾附件
        }
        // if (ret.action == 'doImport') {//判別匯入DI檔時，是否有檔號，如果有檔號跳出資訊提示  Chloe.sia 0423
        var str = values.di;
        var n = str.indexOf("年度");
        if (n > 0 && n < 10) {
            Ext.Msg.alert('提示', '請確認匯入相關資料的內容<br>(如:受文者、檔號等)');
        }
        // }
        OA.common.Global.getApp().getController('OA.controller.Work').onNewDocPaper(null, values);
        // }
        // });
    }
});