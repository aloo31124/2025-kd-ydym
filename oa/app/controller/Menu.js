Ext.define('OA.controller.Menu', {
    extend: 'Ext.app.Controller',
    requires: [
        'OA.client.VI', 'OA.client.DocFlow', 'OA.common.VIMgr', 'OA.client.SI',
        'OA.client.Odaf31Stamp', 'OA.client.SignStatus'
    ],
    config: {
        refs: {
            menuLeftUser: 'menuLeft > label',
            menuLeftBulletin: 'menuLeft > button[menu=bulletin]', //公告
            menuLeftWait: 'menuLeft > button[menu=wait]',         //待辦
            menuLeftDone: 'menuLeft > button[menu=done]',         //對方未簽
            menuLeftOthers: 'menuLeft > button[menu=others]',     //其他
            menuLeftNewdoc: 'menuLeft > button[menu=newdoc]',     //創簽稿
            menuLeftLogout: 'menuLeft > button[menu=logout]',     //登出

            mainWork: 'mainWork',
            viewMenu: 'oamenu',

            list: '#vList',
            menuList: 'menuList > list',
            segdoc: 'oawork > toolbar > segmentedbutton',  //fire on OA.controller.Work
            toolbar: 'oawork > toolbar',
            menuVersionToolbar: 'menuVersion > toolbar',
            menuVersionList: 'menuVersion > list',
            menuEditionTree: 'menuEdition > touchtreegrid',
            editionFolding: 'menuEdition > toolbar > button[action=editionFolding]', //版次收合

            selectDept: '#selectDept',
            selectRole: '#selectRole',
            segSort: 'menuList > toolbar > segmentedbutton'
        },
        control: {
            menuLeftBulletin: {
                tap: 'onMenuLeftBulletinTap'
            },
            menuLeftWait: {
                tap: 'onMenuFunctionTap'
            },
            menuLeftDone: {
                tap: 'onMenuFunctionTap'
            },
            menuLeftOthers: {
                tap: 'onMenuFunctionTap'
            },
            menuLeftNewdoc: {
                tap: 'onNewDocTap'
            },
            menuLeftLogout: {
                tap: 'onDoLogoutTap'
            },
            segSort: {
                toggle: 'onFolderTaggle'
            },
            'menuList > toolbar > button[id=butListLeft]': {
                tap: 'onShowMainMenu'
            },
            'menuList > toolbar > button[id=butListRight]': {
                tap: 'onMenuListToolbarTap'
            },
            'menuVersion > toolbar > button[action=close]': {
                tap: 'onMenuVersionToolbarTap'
            },
            menuList: {
                select: 'onMenuListSelect'
            },
            menuVersionList: {
                itemtap: 'onMenuVersionTap'
            },
            selectDept: {
                change: 'onSelectDeptChanged'
            },
            selectRole: {
                change: 'onSelectRoleChanged'
            },
            menuEditionTree: {
                leafItemTap: 'onMenuEditionTreeLeafTap',
                nodeItemTap: 'onMenuEditionTreeNodeTap'
            },
            editionFolding: {
                tap: function (ctr) {
                    var me = this;
                    var iconCls = ctr.getIconCls();
                    if (iconCls == 'fa-toggle-on') {
                        OA.common.VIMgr.editionList();
                        ctr.setIconCls('fa-toggle-off');
                    } else {
                        var edition = OA.common.VIMgr.getCurrentEdition();
                        OA.common.VIMgr.editionList(edition.版號);
                        ctr.setIconCls('fa-toggle-on');
                        var r = OA.common.Global.getCurrentDocFlowRecord();
                        var version = edition.版號;
                        var qs = OA.common.Global.getQ();
                        if (qs.app === 'check' || qs.app === 'review') {
                            if (qs.dialogType) r.set('dialogType', qs.dialogType);
                            version = '';
                        }

                        if (qs.app !== 'check' && qs.app !== 'review') {
                            me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r, { version: version });
                        }
                    }

                    var menu = Ext.getCmp('menuEdition');
                    OA.common.Utils.indicatorWith(menu);

                    // 判斷是否顯示卷軸的計時器 - by yi-chi chiu
                    setInterval(function () {
                        var scrollable = Ext.getCmp('menuEdition').query('list')[0].getScrollable();
                        var scroller = scrollable.getScroller();
                        var indicator = scrollable.getIndicators().y;
                        var gap = Math.round(indicator.gapLength);
                        if (gap == 0) {
                            indicator.setAutoHide(true);
                            scrollable.doHideIndicators();
                        } else {
                            indicator.setAutoHide(false);
                            indicator.show();
                        }
                    }, 100);
                }
            }
        }
    },
    /**
     * UI介面配制
     */
    uiSetting: function () {
        var me = this;
        var q = OA.common.Global.getQ();
        if (!q) return;
        if (!me.getMenuLeftOthers()) return;
        me.getMenuLeftOthers().setHidden(false);
        if (q.v >= '1.0.1') {
            me.getMenuLeftNewdoc().setHidden(false);
        }
    },
    /**
     * 取得公文待辦資料夾
     */
    loadDocFlow: function (menuId) {
        this.getViewMenu().setHidden(false);
        this.getMainWork().setActiveItem('oawork');

        var me = this;
        OA.common.Global.setCurrentMenu(menuId);
        if (menuId == 'wait') {
            //do this to trigger onFolderTaggle()
            me.getSegSort().setItems([
                { text: '最 新', sort: 'newest', pressed: true },
                { text: '速 別', sort: 'speed' },
                { text: '限 辦', sort: 'dateline' }
            ]);
        } else {
            me.getSegSort().setItems([]);

            OA.client.DocFlow.loadMenu(menuId, {
                sort: ''
            });
        }
    },
    /**
     * 左側主功能
     */
    onMenuFunctionTap: function (button, e, eOpts) {

        if (this.canAllowUse()) {
            this.loadDocFlow(button.config.menu);
        } else {
            Ext.Msg.alert('ERROR', '無使用權限');
        }
    },
    /**
     * 創簽稿
     */
    onNewDocTap: function (button, e, eOpts) {
        // Ext.Viewport.hideMenu("left");
        OA.common.Funcs.show('FormNewDoc', null, true);
    },
    /**
     * 資料夾分類切換
     */
    onFolderTaggle: function (container, button, isPressed, eOpts) {
        var me = this;
        if (!isPressed) return;

        var menuId = OA.common.Global.getCurrentMenu();
        OA.client.DocFlow.loadMenu(menuId, {
            sort: button.config.sort,
            callback: function (records, operation, success) {
                var item = me.getMenuList().getItemAt(0);
                if (item) {
                    var current = item.getRecord();
                    me.getMenuList().select(current);
                }
            }
        });
    },
    /**
     * 登出
     */
    onDoLogoutTap: function (button, e, eOpts) {
        Ext.Msg.show({
            title: '登出',
            message: '確定要登出嗎?',
            width: 300,
            buttons: Ext.MessageBox.YESNO,
            //multiLine: true,
            //prompt : { maxlength : 180, autocapitalize : true },
            fn: function (buttonId, a, b) {
                if (buttonId == 'yes') {

                    Ext.device.Storage.setItem('username', '');
                    Ext.device.Storage.setItem('password', '');

                    window.location.reload();

                    //var username =Ext.device.Storage.getItem('username');
                    //OA.client.User.logout(username, {
                    //    success: function (record, operation) {
                    //        me.sessionToken = null;
                    //    },
                    //    failure: function (record, operation) {
                    //
                    //        var message = '';
                    //        if (operation.getResponse() == null) {
                    //            message = '未正確連線!請檢查網路!';
                    //        } else {
                    //            var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                    //            message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                    //        }
                    //
                    //        me.sessionToken = null;
                    //
                    //    }
                    //});
                }
            }
        });
    },
    /**
     * 切換左主功能
     */
    onShowMainMenu: function () {
        Ext.Viewport.toggleMenu("left");
    },
    /**
     * 公文資料夾 Toolbar button
     */
    onMenuListToolbarTap: function (button, e, eOpts) {
        this.getViewMenu().setActiveItem('menuVersion');
        this.getSegdoc().setItems([]);
        var title = OA.common.Global.getCurrentDocFlowRecord().get('doSno') + ' 版次';
        this.getMenuVersionToolbar().setTitle(title);
        this.getMenuVersionList().deselectAll();
        this.updateDocAreaHidden('hideAll');
        var svgPaper = OA.common.Paper.main().getSvgPaper();
        if (svgPaper) svgPaper.clear();
    },
    /**
     * 版次資料夾 Toolbar button
     */
    onMenuVersionToolbarTap: function (button, e, eOpts) {
        this.getViewMenu().setActiveItem('menuList');

        var me = this;
        var version = OA.common.VIMgr.getViContent().作業版本;
        if (!version) return;

        //多文稿按鈕
        var items = OA.common.VIMgr.doEdition(version);
        me.getSegdoc().setItems(items);

        //default pressed tab button
        var idx = OA.common.VIMgr.getCurrentEdition().簽核文件夾.預設開啟文稿 - 1;
        var pressedItem = me.getSegdoc().getItems().items[idx];
        me.getSegdoc().setPressedButtons(pressedItem);

        //動作
        var uiActions = OA.common.VIMgr.getActions('sign');
        var sotreSignAction = Ext.getStore('SignAction');
        sotreSignAction.setData(uiActions);
        me.updateDocAreaHidden('actionButton');

        this.getToolbar().setTitle(null);
        // Ext.Viewport.hideMenu("left");
    },
    /**
     * 公文資料夾
     */
    onMenuListSelect: function (list, record, eOpts) {
        OA.common.Global.setCurrentDocFlowRecord(record);
        this.getViBuildSegdoc(record);  //toolbar tab
        this.getToolbar().setTitle(null);
        // Ext.Viewport.hideMenu("left");
    },
    /**
     * 版次資料夾 Item Tap
     */
    onMenuVersionTap: function (list, index, item, record, event) {
        var me = this;
        var version = record.get('版號');

        //多文稿按鈕
        var items = OA.common.VIMgr.doEdition(version);
        me.getSegdoc().setItems(items);
        me.segdocPressed(); //預設開啟文稿
        me.updateDocAreaHidden('history');
    },
    /**
     * 取得文稿VI，更新多稿切換
     *
     * client.VI.load --> 自動按預設文稿 --> OA.controller.Work.onPaperTaggle
     *
     */
    getViBuildSegdoc: function (r, options) {
        var me = this;
        var qs = OA.common.Global.getQ();
        //Ext.Viewport.setMasked({ xtype: 'loadmask', transparent: true, message: '處理中...' });
        if (options) {
            //r.set('version', options.version);
            r.version = options.version;
        } else {
            if (qs.app === 'check') {
                r.version = ''
            } else {
                var version = padLeft(OA.common.Utils.getRandom(0, 9999999999), 11);
                r.version = version;
            }
        }

        //紙本一律給版號0
        if ((qs.dialogType + '') == '4') {
            r.set('version', '0');
        }

        OA.client.VI.load(r, {
            success: function (record, operation) {
                var qs = OA.common.Global.getQ();
                var viContent= record.get('viContent')

                //console.log(viContent);
                me.initColors(viContent);      //色版初始化
                me.beenReceived(record);       //簽收
                me.initSegdocItems(viContent); //多文稿按鈕及預設、版次初始化
                me.initSubGbDocflowList();     //彙併辦
                //me.checkLastSignatureData(viContent, r);    //檢核上一關簽核是否完整

                //if(qs.roleId !== '15') Ext.Viewport.hideMenu('left'); //主秘版本資訊預設展開 ，其餘版本資訊預設不展開


                /*
                //檢核目前會辦的版次，後面是否有版次已有簽章
                if (OA.common.VIMgr.isParallel() && viContent.版次 && viContent.版次.length > 0) {
                    var parallelEdition = OA.common.VIMgr.getCurrentEdition();
                    var firstEdition = viContent.版次[0];
                    if ((firstEdition.版號 + '') !== (parallelEdition.版號 + '')) {
                        if (firstEdition.簽核狀態 && (firstEdition.簽核狀態 + '') == '1') {

                            var init = OA.common.Global.getInitParas();
                            var paras = Ext.apply({}, init);
                            paras.version = parallelEdition.版號;
                            OA.client.SignStatus.load(paras, function (signRet) {
                                //重新reload VI
                                Ext.Viewport.setMasked(true);
                                var re = OA.common.Global.getCurrentDocFlowRecord();
                                //console.log(re);
                                me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(re);
                            });
                            return;
                        }
                    }
                }
                */

                var ctrBarrier = Ext.getCmp('labBarrier');
                if (ctrBarrier) {
                    var Role = OA.common.Global.getCurrentRole();
                    if (Role && Role.roleId === '02') {
                        ctrBarrier.setHidden(true);
                    } else {
                        //待結案公文不要顯示下個流程
                        var thsNone = false;
                        var uiActions = OA.common.VIMgr.getActions('doc');
                        if (uiActions && uiActions.length > 0) {
                            Ext.Array.each(uiActions, function (action) {
                                if (action.methodId && action.methodId == 'docSend') {
                                    thsNone = true;
                                    return false;
                                }
                            });
                        }
                        var uiBarriers = OA.common.VIMgr.getBarriers('forward');
                        if (uiBarriers) {
                            var empName = uiBarriers.defaultItem.EmpName || '';
                            var jobName = uiBarriers.defaultItem.JobName || '';
                            var text = (empName) ? jobName + ' ' + empName : '無';
                            if (thsNone) text = '無';
                            var html = Ext.String.format('<p style="text-align: center;padding:3px;font-size: 17px;">下個流程：{0}</p>'+
                                '<p style="text-align: center;padding:3px;font-size: 14px;color:#4F85A3;">(開啟陳會清單)</p>', text);
                            ctrBarrier.setHtml(html);
                        }
                    }
                }

                var methodId = (qs.app === 'check') ? 'check' : 'actionButton';
                me.updateDocAreaHidden(methodId);
                var success = record.parallelWin ? me.segdocPressed(null,record.raw.parallelWin) : me.segdocPressed();   //預設開啟文稿 raise OA.controller.Work.onPaperTaggle
                if (!success) {
                    Ext.Viewport.setMasked(false);
                    me.updateDocAreaHidden('hideAll');
                    if (OA.common.Paper.main()) OA.common.Paper.main().setHidden(false);
                    return;
                }
                if (qs.app === 'check' || qs.app === 'review') {
                    Ext.Viewport.setMasked(false);
                    return;
                }
                var current = OA.common.VIMgr.getCurrentEdition();

                //第一次以清稿模式
                if (current && current.ParentVersion == 0) {
                    var ctrWK = me.getApplication().getController('OA.controller.Work');
                    ctrWK.getCpaper().setIsClearPaper(true);
                    ctrWK.getCpaper().setIsFieldEdit(true);
                    me.updateDocAreaHidden('clearPaper', 'clear');
                }

                /*               
                //console.log(current);
                //缺少簽核代碼，重讀VI
                if (current.簽核人員) {
                    if (current.簽核人員.簽核代碼 == undefined) {
                        Ext.Viewport.setMasked({ xtype: 'loadmask', transparent: true, message: '處理中...' });
                        var qs = OA.common.Global.getQ();
                        if (options) {
                            r.set('version', options.version);
                        } else {
                            if (qs.app === 'check') {
                                r.set('version', '');
                            } else {
                                var version = padLeft(OA.common.Utils.getRandom(0, 9999999999), 11);
                                r.set('version', version);
                            }
                        }
                        OA.client.VI.load(r, {
                            success: function (record, operation) {
                                var qs = OA.common.Global.getQ();
                                var viContent = record.get('viContent');
                                me.initColors(viContent);      //色版初始化
                                me.beenReceived(record);       //簽收
                                me.initSegdocItems(viContent); //多文稿按鈕及預設、版次初始化
                                me.initSubGbDocflowList();     //彙併辦
                                //me.checkLastSignatureData(viContent);   //檢核上一關簽核是否完整

                                //檢核目前會辦的版次，後面是否有版次已有簽章
                                if (OA.common.VIMgr.isParallel() && viContent.版次 && viContent.版次.length > 0) {
                                    var parallelEdition = OA.common.VIMgr.getCurrentEdition();
                                    var firstEdition = viContent.版次[0];
                                    if ((firstEdition.版號 + '') !== (parallelEdition.版號 + '')) {
                                        if (firstEdition.簽核狀態 && (firstEdition.簽核狀態 + '') == '1') {

                                            var init = OA.common.Global.getInitParas();
                                            var paras = Ext.apply({}, init);
                                            paras.version = parallelEdition.版號;
                                            OA.client.SignStatus.load(paras, function (signRet) {
                                                //重新reload VI
                                                Ext.Viewport.setMasked(true);
                                                var re = OA.common.Global.getCurrentDocFlowRecord();
                                                //console.log(re);
                                                me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(re);
                                            });
                                            return;
                                        }
                                    }
                                }

                                var ctrBarrier = Ext.getCmp('labBarrier');
                                if (ctrBarrier) {
                                    var Role = OA.common.Global.getCurrentRole();
                                    if (Role && Role.roleId === '02') {
                                        ctrBarrier.setHidden(true);
                                    } else {
                                        //待結案公文不要顯示下個流程
                                        var thsNone = false;
                                        var uiActions = OA.common.VIMgr.getActions('doc');
                                        if (uiActions && uiActions.length > 0) {
                                            Ext.Array.each(uiActions, function (action) {
                                                if (action.methodId && action.methodId == 'docSend') {
                                                    thsNone = true;
                                                    return false;
                                                }
                                            });
                                        }

                                        var uiBarriers = OA.common.VIMgr.getBarriers('forward');
                                        if (uiBarriers) {
                                            var empName = uiBarriers.defaultItem.EmpName || '';
                                            var jobName = uiBarriers.defaultItem.JobName || '';
                                            var text = (empName) ? jobName + ' ' + empName : '無';
                                            if (thsNone) text = '無';
                                            var html = Ext.String.format('<p style="text-align: center;padding:3px;">下個流程(開啟陳會清單)：{0}</p>', text);
                                            ctrBarrier.setHtml(html);
                                        }
                                    }
                                }

                                var methodId = (qs.app === 'check') ? 'check' : 'actionButton';
                                me.updateDocAreaHidden(methodId);
                                var success = r.raw.parallelWin ? me.segdocPressed(null, r.raw.parallelWin) : me.segdocPressed();   //預設開啟文稿 raise OA.controller.Work.onPaperTaggle
                                if (!success) {
                                    Ext.Viewport.setMasked(false);
                                    me.updateDocAreaHidden('hideAll');
                                    if (OA.common.Paper.main()) OA.common.Paper.main().setHidden(false);
                                    return;
                                }
                                if (qs.app === 'check' || qs.app === 'review') {
                                    Ext.Viewport.setMasked(false);
                                    return;
                                }

                                //第一次以清稿模式
                                var current = OA.common.VIMgr.getCurrentEdition();
                                if (current.ParentVersion == 0) {
                                    var ctrWK = me.getApplication().getController('OA.controller.Work');
                                    ctrWK.getCpaper().setIsClearPaper(true);
                                    ctrWK.getCpaper().setIsFieldEdit(true);
                                    me.updateDocAreaHidden('clearPaper', 'clear');
                                }
                                me.initSignActionStore(record);  //動作 raise event onFieldActionsChanged
                                Ext.Viewport.setMasked(false);
                            },
                            failure: function (record, operation) {
                                var message = '';
                                if (operation.getResponse() == null) {
                                    message = '未正確連線!請檢查網路!';
                                } else {
                                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                                }
                                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                                Ext.Viewport.setMasked(false);
                            }
                        });
                    }
                }
                */


                me.initSignActionStore(record);  //動作 raise event onFieldActionsChanged
                //Ext.Viewport.setMasked(false);
            },
            failure: function (record, operation) {
                var message = '';
                if (operation.getResponse() == null) {
                    message = '未正確連線!請檢查網路!';
                } else {
                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                }
                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                Ext.Viewport.setMasked(false);
            }
        });
    },
    getdraftgBuildSegdoc: function (resp, options) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var dept = OA.common.Global.getCurrentDept();
        var viContent = resp.vi.版本資訊;
        //viContent = undefined;
        //resp.wk = undefined;
        //console.log(resp);
        //有WK檔直接拿WK用
        if (resp.wk) {

            var draftWK = resp.wk
            draftWK.orgNo = dept.orgNo;
            draftWK.Version = '0';
            OA.common.Global.setCurrentWKContent(draftWK);
            if (viContent == undefined) {

                var values = {
                    qIsNew: true
                }

                if (resp.vi && resp.vi.草稿 && resp.vi.草稿.草稿编號) {
                    values.draftVersion = (resp.vi.草稿.草稿编號 + '');
                    draftWK.Version = (resp.vi.草稿.草稿编號 + '');
                }

                OA.common.VIMgr.create(values);
                var e = OA.common.VIMgr.getViContent();

                //console.log(e);
                me.initSegdocItems(e); //多文稿按鈕及預設、版次初始化

            } else {
                if (resp.diName) {
                    draftWK.Version = resp.diName;
                }
                me.initSegdocItems(viContent); //多文稿按鈕及預設、版次初始化
            }
        } else {
            //沒有WK或WK異常用DI組成WK
            if (resp.di) {
                var di = resp.di;
                OA.common.DIMgr.ImportDI(di, { kind: 'draft' }, function (oWK) {
                    //console.log(oWK)

                    var draftWK = oWK.wkContent;

                    if (resp.vi && resp.vi.草稿 && resp.vi.草稿.草稿编號) {
                        draftWK.Version = (resp.vi.草稿.草稿编號 + '');
                    } else if (resp.diName) {
                        draftWK.Version = resp.diName;
                    }

                    OA.common.Global.setCurrentWKContent(draftWK);
                    //console.log(draftWK);

                    if (viContent == undefined) {


                        var values = {
                            qIsNew: true
                        }

                        if (resp.vi && resp.vi.草稿 && resp.vi.草稿.草稿编號) {
                            values.draftVersion = (resp.vi.草稿.草稿编號 + '');
                        } else if (resp.diName) {
                            values.draftVersion = resp.diName;
                        }

                        OA.common.VIMgr.create(values);
                        var e = OA.common.VIMgr.getViContent();

                        //console.log(e);
                        me.initSegdocItems(e); //多文稿按鈕及預設、版次初始化
                    } else {
                        me.initSegdocItems(viContent); //多文稿按鈕及預設、版次初始化
                    }

                    var methodId = (qs.app === 'check') ? 'check' : 'actionButton';
                    me.updateDocAreaHidden(methodId);
                    var success = me.segdocPressed();   //預設開啟文稿 raise OA.controller.Work.onPaperTaggle
                    if (!success) {
                        Ext.Viewport.setMasked(false);
                        me.updateDocAreaHidden('hideAll');
                        if (OA.common.Paper.main()) OA.common.Paper.main().setHidden(false);
                        return;
                    }
                    var ctrWK = me.getApplication().getController('OA.controller.Work');
                    ctrWK.getCpaper().setIsClearPaper(true);
                    ctrWK.getCpaper().setIsFieldEdit(true);
                    me.updateDocAreaHidden('clearPaper', 'clear');

                });
                return
            }
        }

        var methodId = (qs.app === 'check') ? 'check' : 'actionButton';
        me.updateDocAreaHidden(methodId);
        var success = me.segdocPressed();   //預設開啟文稿 raise OA.controller.Work.onPaperTaggle
        if (!success) {
            Ext.Viewport.setMasked(false);
            me.updateDocAreaHidden('hideAll');
            if (OA.common.Paper.main()) OA.common.Paper.main().setHidden(false);
            return;
        }
        var ctrWK = me.getApplication().getController('OA.controller.Work');
        ctrWK.getCpaper().setIsClearPaper(true);
        ctrWK.getCpaper().setIsFieldEdit(true);
        me.updateDocAreaHidden('clearPaper', 'clear');
    },

    //預設開啟文稿
    segdocPressed: function (pressedItem, parallelWin) {
        var me = this;
        if (!OA.common.VIMgr.getCurrentEdition()) return;
        var idx = parallelWin ? parallelWin.paperNo : OA.common.VIMgr.getCurrentEdition().簽核文件夾.預設開啟文稿;
        pressedItem = me.getSegdoc().getItems().items.where("( el, i, res, param ) => el.config.paperNo==" + idx);
        if (!pressedItem || pressedItem.length == 0) pressedItem = me.getSegdoc().getItems().items[0];
        if (pressedItem) {
            me.getSegdoc().setPressedButtons(pressedItem);
            return true;
        } else {
            return false;
        }
    },

    //更新簽收
    beenReceived: function (record) {
        var viContent = record.get('viContent');
        //更新目前狀態(gbAction)
        var sotreDocFlow = Ext.getStore('DocFlow');
        var index = sotreDocFlow.findExact('gbDocflowId', record.get('gbDocflowId'));
        var r = sotreDocFlow.getAt(index);
        if (viContent.簽收) {
            if (r) r.set('state', viContent.簽收.actionName);
            if (viContent.簽收.docType) record.raw.docType = viContent.簽收.docType;
        }
    },

    //色版
    initColors: function (viContent) {
        var xmlColors = B64.decode(viContent.Colors);
        var domColors = parseXmlString(xmlColors);
        OA.common.Global.setDomColors(domColors);
    },

    //多文稿按鈕及預設、版次初始化,設定目前版次
    initSegdocItems: function (viContent) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var items = OA.common.VIMgr.load(viContent);
        if (qs.app === 'check' || qs.app === 'review') {
            items = Ext.Array.filter(items, function (item) {
                return !(item.action == 'add' || item.action == 'change')
            });
        }
        if (me.getSegdoc()) {
            me.getSegdoc().setItems(items);
            var segdoc = Ext.getCmp('segDocSelector');
            Ext.Array.forEach(segdoc.getItems().items, function (button) {
                if (button.config.title) {
                    $(button.bodyElement.dom).qtip({
                        content: {
                            text: '<p style="font-size:190%;">' + button.config.title + '</p>'
                        },
                        position: {
                            my: 'bottom left',
                            at: 'top right'
                        },
                        show: {
                            'delay': 500,
                            'solo': true
                        }
                    });
                }
            });
        }
    },

    //動作 raise event onFieldActionsChanged
    initSignActionStore: function(record) {
        var uiActions = OA.common.VIMgr.getActions('sign');
        var storeSignAction = Ext.getStore('SignAction');
        storeSignAction.removeAll();
    
        if (uiActions && uiActions.length > 1) {
            var roleId = record.raw.roleId;
            var sequiActions = [];
    
            // 判斷是否為特定角色
            if (roleId === '16' || roleId === '17') {
                var priorityActions = uiActions.filter(function(action) {
                    return action.name === '決行' || action.name === '會畢';
                });
                var otherActions = uiActions.filter(function(action) {
                    return action.name !== '決行' && action.name !== '會畢';
                });
                sequiActions = priorityActions.concat(otherActions);
            } else {
                var sendActions = uiActions.filter(function(action) {
                    return action.name === '送陳/會';
                });
                var remainingActions = uiActions.filter(function(action) {
                    return action.name !== '送陳/會';
                });
                sequiActions = sendActions.concat(remainingActions);
            }
    
            // 預處理 uiActions，將 BeforeScriptParams 確保為字串
            sequiActions = sequiActions.map(function(action) {
                if (typeof action.BeforeScriptParams === 'object') {
                    action.BeforeScriptParams = JSON.stringify(action.BeforeScriptParams);
                }
                return action;
            });
    
            storeSignAction.setData(sequiActions);
        } else {
            // 預處理 uiActions，確保 BeforeScriptParams 是字串
            if(uiActions && uiActions.length > 0) {
                uiActions = uiActions.map(function(action) {
                    if (typeof action.BeforeScriptParams === 'object') {
                        action.BeforeScriptParams = JSON.stringify(action.BeforeScriptParams);
                    }
                    return action;
                });
            }
            storeSignAction.setData(uiActions);
        }
    },
    
    //彙併辦
    initSubGbDocflowList: function () {

        /**
        var current = OA.common.VIMgr.getCurrentEdition();
        var combineInfo = current.彙併案資訊;
        if (!combineInfo) return;
        var isCombine = combineInfo.是否為彙併案 === '是';
        var combineList = combineInfo.併文清單;
        if (isCombine && combineList) {
            var paras = OA.common.Global.getInitParas();
            var subGbDocflowList = [];
            Ext.Array.each(combineList.子文, function (son) {
                subGbDocflowList.push({
                    doSno: son.content.toString(),
                    doDeptno: son.doDeptno
                })
            });
            paras.subGbDocflowList = subGbDocflowList;
        }
         */


        /**
         * 抓ParentVersion的版次
         * 判斷子文內容有沒有一致
         * 如果有變動表示彙併辦有變
         * */
        var current = OA.common.VIMgr.getCurrentEdition();
        if (!current) return;
        var combineInfo = current.彙併案資訊;
        if (!combineInfo) return;
        var oldEdition;

        Ext.Array.each(OA.common.VIMgr.getViContent().版次, function (item) {
            if (item.版號 + '' == current.ParentVersion + '') {
                oldEdition = item;
                return false;
            }
        });

        var isCombine = combineInfo.是否為彙併案 === '是';
        var paras = OA.common.Global.getInitParas();
        var subGbDocflowList = [];
        //判斷是否有加併彙
        if (isCombine) {
            var isOldcombine = false;
            if (oldEdition && oldEdition.彙併案資訊) {
                isOldcombine = oldEdition.彙併案資訊.是否為彙併案 === '是';
            }
            var combineList;
            if (!isOldcombine) {
                combineList = combineInfo.併文清單;
                if (combineList) {
                    Ext.Array.each(combineList.子文, function (son) {
                        subGbDocflowList.push({
                            doSno: (son.content + ''),
                            doDeptno: son.doDeptno,
                            status: '1'//1：增併
                        })
                    });
                }
            } else {
                //目前作業版次增加之子案：增彙併
                if (combineInfo.併文清單 && combineInfo.併文清單.子文) {
                    Ext.Array.each(combineInfo.併文清單.子文, function (son) {
                        var isPush = true;
                        if (oldEdition.彙併案資訊.併文清單 && oldEdition.彙併案資訊.併文清單.子文) {
                            Ext.Array.each(oldEdition.彙併案資訊.併文清單.子文, function (oldson) {
                                if (son.doDeptno == oldson.doDeptno && son.content == oldson.content) isPush = false;
                            });
                        }
                        if (isPush) {
                            subGbDocflowList.push({
                                doSno: (son.content + ''),
                                doDeptno: son.doDeptno,
                                status: '1'//1：增併
                            })
                        }
                    });
                }

                //目前作業版次減少之子案：解彙併
                if (oldEdition.彙併案資訊.併文清單 && oldEdition.彙併案資訊.併文清單.子文) {
                    Ext.Array.each(oldEdition.彙併案資訊.併文清單.子文, function (oldson) {
                        var isPush = true;
                        if (combineInfo.併文清單 && combineInfo.併文清單.子文) {
                            Ext.Array.each(combineInfo.併文清單.子文, function (son) {
                                if (son.doDeptno == oldson.doDeptno && son.content == oldson.content) isPush = false;
                            });
                        }

                        if (isPush) {
                            subGbDocflowList.push({
                                doSno: (oldson.content + ''),
                                doDeptno: oldson.doDeptno,
                                status: '0'//0：解併
                            })
                        }
                    });
                }
            }
        } else {
            //判斷是否解併
            var isOldcombine = false;
            if (oldEdition && oldEdition.彙併案資訊) {
                isOldcombine = oldEdition.彙併案資訊.是否為彙併案 === '是';
            }
            if (isOldcombine) {
                if (oldEdition.彙併案資訊.併文清單 && oldEdition.彙併案資訊.併文清單.子文) {
                    Ext.Array.each(oldEdition.彙併案資訊.併文清單.子文, function (oldson) {
                        subGbDocflowList.push({
                            doSno: (oldson.content + ''),
                            doDeptno: oldson.doDeptno,
                            status: '0'//0：解併
                        })
                    });
                }
            }
        }
        paras.subGbDocflowList = subGbDocflowList;
        //console.log(paras.subGbDocflowList);

    },
    /**
     * 功能按鈕開啟／關閉
     */
    updateDocAreaHidden: function (methodId, uiActions) {
        this.getApplication().getController('OA.controller.Work').updateDocAreaHidden(methodId, uiActions);
    },
    /**
     * 選機關
     */
    onSelectDeptChanged: function (button, e, eOpts) {
        if (e == null) //not finished
            return;
        var me = this,
            deptNo = me.getSelectDept().getValue(),
            jobNo = me.getSelectRole().getValue(),
            data = me.getSelectDept().getRecord().getData();
        OA.common.Global.setCurrentDept(data);
        //管理者帶入全角色，不依deptNo過慮
        if ('N' == OA.common.Global.getIsMgr()) {
            var sotreRole = Ext.getStore('Role');
            sotreRole.filter("depNo", deptNo);
            jobNo = sotreRole.getAt(0).get('jobNo');
        }
        me.getSelectRole().setValue(jobNo);
    },
    /**
     * 選角色
     */
    onSelectRoleChanged: function (button, e, eOpts) {
        if (e == null) return; //not finished
        var user = OA.common.Global.getCurrentUser();
        //使用者資訊
        this.getMenuLeftUser().setHtml('<span style="color: white;"> ' +
            user.empName + ' ( ' + user.empNo + ' ) ' + '</span>');
        var data = this.getSelectRole().getRecord().getData();
        OA.common.Global.setCurrentRole(data);
        if (this.canAllowUse()) {
            var menuId = OA.common.Global.getCurrentMenu();
            if (menuId == 'bulletin') {
                this.onMenuLeftBulletinTap();
            } else {
                this.loadDocFlow('wait');
            }
        } else {
            Ext.Msg.alert('ERROR', '無使用權限');
        }
    },

    onMenuLeftBulletinTap: function (button) {
        OA.common.Global.setCurrentMenu('bulletin');
        this.getViewMenu().setHidden(true);
        this.getMainWork().setActiveItem('ctnBulletin');
    },
    canAllowUse: function () {
        var role = OA.common.Global.getCurrentRole();
        var isAllow = false;
        var allowRoles = KangDaAppConfig().allowRoles || [];
        if (allowRoles.length == 0) {
            isAllow = true;
        } else {
            isAllow = allowRoles.indexOf(role.roleId) >= 0;
        }
        return isAllow;
    },
    onMenuEditionTreeLeafTap: function (ctr, list, index, target, record, e) {
        this.openEditionItem(record);
    },
    onMenuEditionTreeNodeTap: function (ctr, list, index, target, record, e) {
        var yPositionOld = list.getScrollable().getScroller().position.y;
        record.set('expandable', true);
        if (e.getTarget('.edition-doc')){            
            this.openEditionItem(record);
        } 
        //回復 expandable 造成scrollbar 置頂
        list.getScrollable().getScroller().scrollTo(0, yPositionOld, { duration: 0 });
    },
    openEditionItem: function (record) {
        var me = this;
        var current = OA.common.VIMgr.getCurrentEdition();
        var nodeType = record.get('nodeType');
        var data = record.get('source');
        var qs = OA.common.Global.getQ();


        var isReadonly = false;
        if (['attach', 'ref', 'big'].indexOf(data.sort) != -1) isReadonly = true;
        if (qs.app === 'check') isReadonly = true;


        //var isOnlyFollow = OA.common.VIMgr.isOnlyFollow();
        if (!isReadonly) {
            var status = OA.common.Paper.getActiveStatus();
            // 只有簽稿才需存檔 - by yi-chi chiu
            //var isSaved = status && status != 'saved' && (record.data.text.indexOf('簽') > -1 || record.data.text.indexOf('稿') > -1);
            var isSaved = status && status != 'saved';
            if (isSaved && status != 'create') { //預先儲存
                var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                var oldParas = Ext.clone(OA.common.Global.getInitParas());
                var currentVersion = Ext.clone(current.版號);

                ctrWK.doSave({ action: 'save' }, function () {
                    ctrWK.notReloadUpdateVI(oldParas.paperNo, currentVersion);
                    me.openEditionItem(record);
                    // 開啟會辦需解鎖 - by yi-chi chiu
                    Ext.Viewport.setMasked(false);
                });
                return;
            }
        }

        record.set('expandable', false);

        var pressedItem, idx = 0, isSameVersion = true, items;
        var showType = '';
        if (data.會畢) {
            showType = 'folder';
        } else if (data.狀態 == '引用') {
            showType = 'ref';
        } else if (data.狀態 == '彙併案') {
            showType = 'combine';
        } else if (data.paperNo) {
            showType = 'paper';
        } else {
            showType = 'attach';
        }

        //var allWithoutCurrent = OA.common.VIMgr.isParallelDraftNoCurrent();

        var isOver = (data.會畢 == 'Y');

        var isCurrent = (data.目前 == 'Y');
        if (isCurrent) isOver = true;
        if (data.簽核文件夾) {
            showType = 'folder';
            isOver = true;
        }
        if (showType == 'paper') isOver = true;

        if (nodeType === "procNotes") {
            OA.common.Global.getApp().getController('OA.controller.Work').onSuggestionNotesTap();
            return;
        }

        if (showType == 'folder') {
            if (!isOver) {
                Ext.Msg.alert('提示', '尚未會畢！');
                return;
            }
            if (data.版號) {
                isSameVersion = current.版號 == data.版號;
                items = [];
                if (isSameVersion) {  //多文稿按鈕
                    items = OA.common.VIMgr.doEdition(data.版號);
                } else {
                    items = OA.common.VIMgr.getEdition(data.版號);
                }

                me.getSegdoc().setItems(items);
                OA.common.Paper.main().setIsClearPaper(false);
                //default pressed tab button
                idx = data.簽核文件夾.預設開啟文稿 - 1;
                pressedItem = me.getSegdoc().getItems().items[idx];
                if (!pressedItem) pressedItem = me.getSegdoc().getItems().items[0];

                OA.common.Paper.setActiveStatus('saved');
                if (!isSameVersion) pressedItem.config.isClearWK = false;
                if (!isSameVersion && qs.app !== 'review') pressedItem.config.isNotShowAction = true;
                me.getSegdoc().setPressedButtons(pressedItem);
            } else {
                var findPaperNo = data.paperNo || data.文稿代碼;
                var segItems = me.getSegdoc().getItems().items;
                Ext.Array.each(segItems, function (item) {
                    if (findPaperNo == item.config.paperNo) idx = item.config.idx;
                });

                // console.log(data);
                if (idx >= 0) {
                    OA.common.Global.getApp().getController('OA.controller.Work').onSuggestionNotesTap();
                    // return;

                    // pressedItem = me.getSegdoc().getItems().items[idx];
                    // me.getSegdoc().setPressedButtons(pressedItem);
                } else {
                    if (!data.文稿代碼) {
                        Ext.Msg.alert('提示', '尚無資料！');
                        return;
                    }
                    var edition = OA.common.VIMgr.getCurrentEdition();
                    var p = OA.common.VIMgr.getFolderItems(edition.版號, edition.簽核文件夾, data.文稿代碼);
                    var but = {
                        config: {
                            paperNo: p.paperNo,
                            files: p.files,
                            attachs: p.attachs,
                            lastVersion: p.lastVersion,
                            form: p.form,
                            kind: p.kind,
                            model_wk: p.model_wk,
                            isProcessing: true, //是否歸於會辦意見
                            isOver: isOver,  //開啟會畢開啟
                            isClearWK: false,
                            depNo: data.單位代碼
                        }
                    };
                    OA.common.Global.getApp().getController('OA.controller.Work').onPaperTaggle(null, but, true);
                    me.getSegdoc().setPressedButtons([]);
                }
            }
        } else if (showType == 'paper') {
            var version = data.version;
            isSameVersion = current.版號 == version;

            var qs = OA.common.Global.getQ();
            if (qs.app === 'check' || qs.app === 'review') isSameVersion = false;
            // console.log(current.版號);
            // console.log(version);
            items = [];
            if (isSameVersion) {  //多文稿按鈕
                OA.common.VIMgr.setHistoryVersion('');
                items = OA.common.VIMgr.doEdition(version);
            } else {
                OA.common.VIMgr.setHistoryVersion(version);
                items = OA.common.VIMgr.getEdition(version);
            }

            Ext.Array.each(me.getSegdoc().getItems().items, function (oldItem) {
                Ext.Array.each(items, function (newItem) {
                    if (oldItem.config.paperNo == newItem.paperNo && oldItem.config.isRead && newItem.model_wk) {
                        newItem.isRead = true;
                    }
                });
            });
            me.getSegdoc().setItems(items);
            Ext.Array.each(me.getSegdoc().getItems().items, function (button) {
                if (button.config.isRead) button.setUi('confirm');
            });

            idx = 0;
            Ext.Array.each(items, function (item, index) {
                if (item.paperNo == data.paperNo) idx = index;
            });
            pressedItem = me.getSegdoc().getItems().items[idx];
            if (!pressedItem) pressedItem = me.getSegdoc().getItems().items[0];
            if (!isSameVersion) {
                pressedItem.config.isClearWK = false;
                pressedItem.config.isSuggest = false;
            }
            if (!isSameVersion && qs.app !== 'review') pressedItem.config.isNotShowAction = true;


            OA.common.Paper.main().setIsClearPaper(false);
            OA.common.Paper.setActiveStatus('saved');
            me.getSegdoc().setPressedButtons(pressedItem);
        } else if (showType == 'ref') {
            window.open('../oa/index.html?app=check&dialogType=3&showType=ref', "", "_blank");
            window.getCurrentUser = function () {
                var initParas = OA.common.Global.getInitParas();
                var paras = Ext.apply({}, initParas);
                paras.doSno = data.公文文號.toString();
                paras.gbDocflowId = undefined;
                return paras;
            };
        } else if (showType == 'combine') {
            window.open('../oa/index.html?app=check&dialogType=3', "", "_blank");
            window.getCurrentUser = function () {
                var initParas = OA.common.Global.getInitParas();
                var paras = Ext.apply({}, initParas);
                paras.doSno = data.content + '';
                paras.doDeptno = data.doDeptno;
                if (paras.subGbDocflowList) {
                    Ext.Array.each(paras.subGbDocflowList, function (subGbDoc) {
                        if (subGbDoc.doSno == paras.doSno) {
                            paras.doDeptno = subGbDoc.doDeptno;
                            return true;
                        }
                    });
                }
                paras.gbDocflowId = undefined;
                paras.dialogType = '3';
                return paras;
            };
        } else {
            if (data.file.fileType) data.file.modType = data.file.fileType;
            OA.client.Attach.load(data.file);
        }
    },
    checkLastSignatureData: function (viContent, r) {
        var me = this;
        if (!OA.common.Utils.checkEpaper()) return;     //紙本流程不處理
        var current = OA.common.VIMgr.getCurrentEdition();
        if (current && current.ParentVersion + '' !== '0' && viContent.版次.length > 2) {
            var parentVersion = current.ParentVersion + '';
            var lastEditions = viContent.版次.where("( el, i, res, param ) => el.版號=='" + parentVersion + "'");
            if (lastEditions) {
                var lastEdition = lastEditions[0];
                if (lastEdition) {
                    //簽核
                    if (lastEdition.簽核狀態 + '' == '0' && lastEdition.SignatureData == undefined) {
                        //上一關簽核資料異常，需回補
                        var FlowUri = 'FlowUri_' + parentVersion;
                        r.set('FlowUri', FlowUri);
                        OA.client.SI.load(r, {
                            success: function (record, operation) {
                                var reader = record.getProxy().getReader();
                                var signFlowDefineDoc = reader.rawData.signFlowDefineXml;
                                var signFlowDoc = reader.rawData.signFlowXml;
                                if (signFlowDefineDoc && signFlowDoc) {
                                    //由SI補回簽核資訊
                                    //console.log(signFlowDoc);
                                    //console.log(signFlowDefineDoc);

                                    //回補簽核狀態
                                    lastEdition.簽核狀態 = 1;

                                    //回補異動別
                                    var signFlowXml = parseXmlString(signFlowDoc);
                                    var signMode = signFlowXml.documentElement.getAttribute('異動別');
                                    if (signMode) {
                                        lastEdition.線上簽核資訊.簽核流程.異動別 = signMode;
                                    }

                                    //回補雜湊值
                                    var signFlowDefineXml = parseXmlString(signFlowDefineDoc);
                                    if (signFlowDefineXml) {
                                        var signFlowDefine = JSON.parse(xml2json(signFlowDefineXml));
                                        var signX509 = signFlowDefineXml.querySelector("X509Certificate");
                                        var reXvi = OA.common.VIMgr.getSignatureXVI(lastEdition, signFlowDefine, signX509);

                                        //回存
                                        var data = {};
                                        var paras = OA.common.Global.getInitParas();
                                        data.version = lastEdition.版號 + '';
                                        var paperFiles = [];
                                        paperFiles.push({
                                            fileKey: '',
                                            fileName: paras.doSno + ".vi",
                                            folderName: 'XC',
                                            fileType: 'vi',
                                            fileContent: B64.encode(reXvi)
                                        });

                                        data.files = paperFiles;
                                        Ext.apply(paras, data);
                                        paras.status = 'save';
                                        paras.jobNo = lastEdition.簽核人員.使用者職務代碼;
                                        paras.depNo = lastEdition.簽核人員.單位代碼;
                                        var init = OA.common.Global.getInitParas();
                                        var modelName = OA.common.DIMgr.getModelName('wk', init.documentType);
                                        OA.client.WK.setCurrentModelName(modelName);
                                        OA.client.WK.excuteOnline(paras, function () {
                                            //重新reload VI
                                            Ext.Viewport.setMasked(true);
                                            var modelName = OA.common.DIMgr.getModelName('wk', paras.documentType);
                                            OA.client.WK.setCurrentModelName(modelName);
                                            var re = OA.common.Global.getCurrentDocFlowRecord();
                                            //console.log(re);
                                            me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(re, { version: r.get('version') });

                                        });
                                        //console.log(lastEdition);
                                        //console.log(JSON.stringify(lastEdition));
                                    }
                                } else {
                                    //SI中沒有簽核資訊不回補
                                    Ext.Viewport.setMasked(false);
                                }
                            },
                            failure: function (record, operation) {
                                var message = '';
                                if (operation.getResponse() == null) {
                                    message = '未正確連線!請檢查網路!';
                                } else {
                                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                                    if (faliureResponse.code == '4001') {
                                        Ext.Viewport.setMasked(false);
                                        return;
                                    }
                                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                                }
                                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                                Ext.Viewport.setMasked(false);
                            }
                        });
                    }
                }
            }
        }
    },
    getOdaf31Stamp: function (callback) {
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: '章戳載入中...' });
        var store = Ext.getStore('Stamps');
        if (store) store.setData(null);
        var p = OA.common.Global.getInitParas();
        var r = { depNo: p.depNo };
        OA.client.Odaf31Stamp.load(r, {
            success: function (record, operation) {
                var reader = record.getProxy().getReader();
                var stamps = reader.rawData;
                var datas = [];
                if (stamps && stamps.length > 0) {
                    Ext.Array.each(stamps, function (s) {
                        var data = { type: s.type, stamp: 'data:image/png;base64,' + s.stamp };
                        datas.push(data)
                    });
                }

                store.setData(datas);
                //console.log(store);
                if (callback) callback();
                Ext.Viewport.setMasked(false);
            },
            failure: function (record, operation) {
                var message = '';
                if (operation.getResponse() == null) {
                    message = '無法取得章戳資料!請檢查網路!';
                } else {
                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                    if (faliureResponse.code == '4001') {
                        Ext.Viewport.setMasked(false);
                        //return;
                    }
                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                }
                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                Ext.Viewport.setMasked(false);
                if (callback) callback();
            }
        });
    }
});
