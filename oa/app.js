Ext.MessageBox.YES = [
    { text: '確定', itemId: 'yes' }
];
Ext.MessageBox.YESNO = [
    { text: '確定', itemId: 'yes', ui: 'action' },
    { text: '取消', itemId: 'no' }   
];
Ext.MessageBox.OKCANCEL = [
    { text: '確定', itemId: 'ok', ui: 'action' },
    { text: '取消', itemId: 'cancel' }   
];

Ext.Date.monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
Ext.Date.dayNames = ['日', '一', '二', '三', '四', '五', '六'];

Ext.Date.getShortDayName = function (day) {
    return Ext.Date.dayNames[day];
};

var mouseWheelHandler = function (e) {
    var e = window.event || e,
        el = e.target,
        cmp,
        offset,
        scroller,
        delta,
        _results = [];
    e.preventDefault(); // prevent scrolling when in iframe

    while (el !== document.body) {
        var isDo = el && el.className && el.className.indexOf && el.className.indexOf('x-container') >= 0;
        if (el.id == "dvAttach") isDo = false;
        if (isDo) {
            cmp = Ext.getCmp(el.id);
            if (cmp && typeof cmp.getScrollable == 'function' && cmp.getScrollable()) {
                scroller = cmp.getScrollable().getScroller();
                if (scroller) {
                    delta = e.detail ? e.detail * (-120) : e.wheelDelta;
                    offset = { x: 0, y: -delta * 0.5 };
                    scroller.fireEvent('scrollstart', scroller, scroller.position.x, scroller.position.y, e);
                    scroller.scrollBy(offset.x, offset.y);
                    scroller.snapToBoundary();
                    scroller.fireEvent('scrollend', scroller, scroller.position.x, scroller.position.y - offset.y);
                    break;
                }
            }
        }
        _results.push(el = el.parentNode);
    }
    return _results;
};
Ext.application({
    name: 'OA',
    requires: ['OA.common.Global', 'OA.common.Paper', 'OA.common.InitParas', 'OA.common.MouseWheelDrag',
        'OA.common.UrlMgr', 'OA.common.VIMgr', 'OA.common.DIMgr', 'OA.common.DateTimePicker', 'OA.common.Funcs',
        'OA.common.Fields', 'OA.common.Bridge', 'OA.client.Editor', 'OA.client.Localforage', 'Ext.device.Storage', 'Ext.data.reader.Xml',
        'Ext.field.TextArea', 'Ext.MessageBox', 'OA.client.Lzwzip', 'OA.client.Memcahce', 'OA.client.Odaf31Stamp', 'OA.client.DocTemp', 'OA.model.DocTemp',
        'OA.client.DocTempContent'],
    models: ['OA.model.VI'],
    controllers: ['OA.controller.Login', 'OA.controller.Menu', 'OA.controller.Work', 'OA.controller.Approve'],
    views: ['OA.view.Login', 'OA.view.Main', 'OA.view.Menu', 'OA.view.Work', 'OA.view.Welcome', 'OA.view.CtnPreview',
        'OA.view.MainEditor', 'OA.view.AsyncPreview'],
    stores: ['DocFlow', 'History', 'Attach', 'Dept', 'Role', 'SignAction', 'Barrier', 'WorkFlow', 'Sticky', 'Sealinfo', 'DeptTree',
        'Emp', 'DeptList', 'Contact', 'Dep3Tree', 'Dep3List', 'CaseNo', 'Octet', 'TaskAccordion', 'Cip',
        'Quote', 'Phrase', 'OverPrint', 'Variableprint', 'Suggestion', 'Paper', 'SendWay', 'Dep3Child',
        'Petition', 'Dep3ContainAtt', 'Stamps' , 'DeptAll'],
    Enum: {
        approve: 'approve',
        editor: 'editor',
        byreturn: 'byreturn',
        paper: 'paper',
        draft: 'draft',
        billboard: 'billboard',
        preview: 'preview',
        spa: 'spa',
        offline: 'offline',
        review: 'review',
        readonly: 'readonly',
        buchen: 'buchen',
        properties: {
            '1': { by: "approve", code: "簽核", value: 1 },  //文稿W、意見W
            '2': { by: "editor", code: "製作", value: 2 },   //文稿W、意見N
            '3': { by: "check", code: "查閱", value: 3 },    //文稿R、意見R、簽章N、簽核動作N
            '4': { by: "byreturn", code: "函覆", value: 4 }, //紙本
            '5': { by: "paper", code: "轉紙本", value: 5 },
            '8': { by: "draft", code: "草稿", value: 8 },
            '6': { by: "billboard", code: "第三類公佈欄", value: 6 },
            '9': { by: "preview", code: "預覧列印", value: 9 },
            '10': { by: "spa", code: "內開", value: 10 },       //崁div開啟
            '11': { by: "offline", code: "離線", value: 11 },   //文稿W、意見N
            '12': { by: "genpages", code: "轉頁面檔", value: 12 },
            '13': { by: "review", code: "複閱", value: 13 },  //與check相同，加判斷 reviewFn帶入參數
            '14': { by: "tidy", code: "總整", value: 14 }, //意見綜整
            '16': { by: "package", code: "打包", value: 16 }, //整批下載
            '17': { by: "buchen", code: "補陳", value: 17 } //與複閱相同，可打意見要簽章，要有退回按鈕
            // '15': {by: "readonly", code: "唯讀", value: 15} //文稿R、意見N、簽章N、簽核動作N
        }
    },
    launch: function () {
        var me = this;
        var appTypes = me.Enum;
        Ext.Msg.defaultAllowedConfig.showAnimation = false;
        Ext.Msg.defaultAllowedConfig.hideAnimation = false;
        OA.common.Global.setApp(this.getApplication());
        var qs = Ext.Object.fromQueryString(location.search.substring(1));
        qs.v = '0.1.4';
        if (qs.app === 'preload') return; //準備load js用
        me.featureCheck();

        // 製作關閉提示開關 - by yi-chi chiu
        qs.disableEditorCloseNotification = KangDaAppConfig().disableEditorCloseNotification || false;

        // 系統自動關閉不提示訊息 - by yi-chi chiu
        if (qs.app !== 'genpages') {
            localStorage.setItem('oa_isAutoClose', 'false');
        } else {
            localStorage.setItem('oa_isAutoClose', 'true');
        }

        // 公文管理位置檢查 - by yi-chi chiu
        OA.app.manageID = localStorage.getItem('manageID');
        // 判斷已存檔功能 - by yi-chi chiu
        OA.app.isSavedFlag = true;

        // IOS來文PDF第一次載入 - by yi-chi chiu
        OA.app.initExcept = 0;

        // 同步系統剪貼簿 - by yi-chi chiu
        //window.setInterval(function () {
        if (typeof (navigator.clipboard) !== 'undefined') {
            navigator.clipboard.readText()
                .then(text => {
                    var clipboard = document.querySelector('#clipboardtextarea');
                    if (!clipboard) {
                        clipboard = document.createElement("textarea");
                        clipboard.id = 'clipboardtextarea';
                        clipboard.style.position = "fixed";
                        document.body.appendChild(clipboard);
                    }
                    if (clipboard.value !== text) clipboard.value = text;
                }).catch(err => {
                    // console.error('Failed to sync clipboard contents: ', err);
                });
        }
        //}, 300);

        // 製作關閉提示訊息 - by yi-chi chiu
        window.onbeforeunload = function (e) {
            if (qs.docExit) {
                Ext.Msg.alert("提醒", "建議使用公文製作中「關閉」，離開公文製作！");
                OA.app.autoClose = false;
                e.returnValue = "test";               
                return "test";
            } else {
                var dialogText = "test";
                if (localStorage.getItem('oa_isAutoClose') || qs.app === 'preview' || qs.app === 'genpages') {
                    OA.app.autoClose = true;
                }

                // 公文管理位置檢查 - by yi-chi chiu
                if (!qs.disableEditorCloseNotification && (localStorage.getItem('oa_isAutoClose') === 'false' || !OA.app.autoClose) && !OA.app.isSavedFlag) {
                    e.returnValue = dialogText;
                    return dialogText;
                }
            }
        };
        // 製作關閉管理解鎖 - by yi-chi chiu
        /* 已癈
        window.onunload = function () {
            //刪除Memcahce
            if (qs.isMemcahce) {
                if (OA.common.Global.getCurrentDocFlowRecord() && OA.common.Global.getCurrentDocFlowRecord().data) {
                    var dfr = OA.common.Global.getCurrentDocFlowRecord();
                    OA.client.Memcahce.clear(dfr, function (resp) {

                    });
                }
            }
            localStorage.setItem('docMarkIsExist', 'false');
            window.opener.stopInterval();
        };
        */

        if (!qs.app) qs.app = KangDaAppConfig().appMode;
        if (qs.dialogType) {
            if (qs.app !== 'buchen') {
                var appType = me.Enum.properties[qs.dialogType];
                if (appType) qs.app = appType.by;
            }
        }
        OA.common.Global.setQ(qs);
        me.bindMouseWheel(qs);

        //去除不合法的query string 
        if (qs.ePaper) qs.epaper = qs.ePaper;
        for (var ppt in qs) {
            if (qs.hasOwnProperty(ppt) && qs[ppt] == 'undefined') delete qs[ppt];
        }


        //行動裝置，觸碰後製作視窗被背景化
        //document.addEventListener('touchstart', function (e) {
        //    window.focus();
        //    $(':focus').focus();
        //});

        //行動裝置實機爆力解決在iframe無法輸入
        if (Ext.os.is.iPad || Ext.os.is.Android) {
            document.addEventListener('keydown', function (e) {
                window.focus();
                $(':focus').focus();
            });
        }

        var win;
        if (window.opener) {
            win = window.opener;
            win.showBy = 'opener';
        } else {
            if (window.parent) {
                win = window.parent;
                win.showBy = 'parent';
            } else {
                win = window;
                win.showBy = 'me';
            }
        }
        OA.common.Global.setWinOpener(win);

        var user = {};
        if (win.kdMaker) {
            user = win.kdMaker.getCurrentUser();
            if (!user && win.getCurrentUser) user = win.getCurrentUser();
            if (!user && win.parent.getCurrentUser) user = win.parent.getCurrentUser();
            if (!user && win.opener.parent.getCurrentUser) user = win.opener.parent.getCurrentUser();
        } else {
            if (win.getCurrentUser) user = win.getCurrentUser();
        }
        OA.common.Global.setSourceUser(user);

        if (user && user.roleId == '15') qs.isRole15 = true;

        if (qs.reviewFn) {
            qs.app = 'review';
            qs.dialogType = 3;
        }
        var isOpenEditorOnline = ['approve', 'editor', 'check', 'review','signText', 'byreturn', 'buchen', 'draft'].indexOf(qs.app) >= 0;

        //複閱採簽核模式相同 , 標記為複閱狀態
        if (qs.app === 'byreturn') {
            qs.isByReturn = true;
            qs.epaper = 'N';
            qs.app = 'approve';
        }

        if (qs.projNo != undefined) {
            var userInput;
            if (win.kdMaker && win.kdMaker.getUserInput) {
                userInput = win.kdMaker.getUserInput();
            } else {
                userInput = {
                    doQualCase: "303",
                    doQuality: "3",
                    docDesc: "測試評議案管主旨介接",
                    docNo: "110年評字第002676號",
                    qualityCode: "16"
                }
            }
            
            Ext.apply(qs, userInput);
            console.log(qs);
        }



        if (qs.app === 'preview' || qs.app === 'genpages' || qs.app === 'tidy') {
            if (qs.app === 'genpages') window.resizeTo(250, 250);
            me.doPreview();
        } else if (qs.app === 'async') {
            me.doAsyncPreview();
        }else if (isOpenEditorOnline) {
            me.doEditor(qs);
        } else if (qs.app === 'offline') {
            if (qs.action == 'install') {
                Ext.Viewport.add(Ext.create('OA.view.Login'));
            } else if (qs.action == 'build-db-g2b') {
                OA.client.Member.buildG2B();
            } else {
                //第一次要先安裝預存資料
                Ext.device.Storage.getItem('isFirstTime');
                if (Ext.device.Storage.getItem('isFirstTime') !== "false") {
                    Ext.Viewport.add(Ext.create('OA.view.Login'));
                } else {
                    me.doEditorOffline(qs);
                }
            }
        } else {
            if (!qs.v && KangDaAppConfig().version) qs.v = KangDaAppConfig().version;
            if (qs.app === appTypes.spa) {
                Ext.getBody().removeCls('x-desktop');
            } else {
                me.doApp();
            }
        }

        // ['cut', 'copy', 'paste'].forEach(function(event) {
        //     function actionEvent(e) {
        //         console.log('catch event ' + event);
        //         OA.common.Paper.main().executeAction(event);
        //         // e.preventDefault();
        //     }
        //     document.removeEventListener(event,actionEvent);
        //     document.addEventListener(event,actionEvent);
        // });

        if (Ext.browser.is.ChromeMobile || Ext.browser.is.Chrome) {
            if (qs.app === 'genpages' || qs.app === 'offline') return false;

            $(window).on('beforeunload', function () {
                if (qs.reload !== 'N' && win.reloadMe) win.reloadMe();
                if (win.winRefresh) {
                    win.winRefresh();
                }
                // console.log(isNotWarn);
                // if (isNotWarn !== false) {
                //     OA.common.Global.getApp().getController('OA.controller.Work').onCloseTap();
                //     return 'You are about to leave the website.';
                // } else {
                //     return ;
                // }
            });
        } else {
            window.onpagehide = function (e) {
                if (window.isWarnNotFinished !== false) {
                    OA.common.Global.getApp().getController('OA.controller.Work').onCloseTap();
                    alert('你將要離開！');
                } else {
                    return false;
                }
            }
        }
    },
    //行動
    doApp: function () {
        document.title = '行動簽核';
        var isAllow = false;
        var items = KangDaAppConfig().allowDevices;
        if (items) {
            Ext.Array.forEach(items, function (os) {
                if (Ext.os.is(os)) isAllow = true;
            });
            if (items.length == 0) isAllow = true;
        } else {
            isAllow = true
        }
        if (!isAllow) {
            Ext.Msg.alert('裝置限制', '不支援此裝置');
            return;
        }
        var qs = OA.common.Global.getQ();
        if (qs.ssoToken1) {
            OA.client.User.ssoLogin(qs);
        } else {
            var loginview = Ext.create('OA.view.Login');
            Ext.Viewport.add(loginview);
        }
        //this.doFirstTime();
    },
    //列印
    doPreview: function () {
        document.title = '列印預覧';
        Ext.Viewport.setMasked({ xtype: 'loadmask', transparent: false, message: '處理中...' });
        var container = Ext.create('OA.view.CtnPreview');
        Ext.Viewport.add(container);
        container.load({ mode: 'init' });
    },
    //追蹤修訂歷程預覧
    doAsyncPreview: function () {
        console.log('doAsyncPreview');
        document.title = '追蹤修訂歷程預覧';
        //Ext.Viewport.setMasked({ xtype: 'loadmask', transparent: false, message: '處理中...' });
        var container = Ext.create('OA.view.AsyncPreview');
        Ext.Viewport.add(container);
        container.load({ mode: 'init' });
    },
    //製作
    doEditor: function (qs) {
        var me = this;
        var appTypes = this.Enum;
        var appName = (qs.app === this.Enum.approve) ? '公文簽核' : '公文製作';

        if (qs.app == this.Enum.draft) appName = '公文草稿';

        document.title = appName + ' v' + qs.v;

        //spa mode
        var renderTo = Ext.Viewport.getRenderTo();
        var editor;
        if (!renderTo) {
            Ext.Viewport.setRenderTo(Ext.get('my-modal-body'));
            editor = Ext.create('OA.view.MainEditor');
        }
        var input = {};
        Ext.apply(input, OA.common.Global.getSourceUser());
        Ext.apply(input, qs);

        OA.common.Global.setInitParas(input);
        if (input.parallelWin) OA.common.Global.setParallelWin(input.parallelWin);

        if (qs.app == 'draft') {
             OA.client.Editor.load(input, function (r, resp) {
                Ext.Viewport.animateActiveItem(editor, { type: 'slide', direction: 'left' });
                me.getApplication().getController('OA.controller.Work').uiSetting();
                me.getApplication().getController('OA.controller.Approve').uiSetting();
                OA.client.Editor.loadDraft(input, function (resp, r) {                   
                    if (r.data.vi) {
                        var options;
                        if (input.version) {
                            options = {};
                            options.version = input.version;
                        }
                        me.getApplication().getController('OA.controller.Menu').getdraftgBuildSegdoc(r.data, options);
                    }
                });
            });            
        } else {

            //評議暫時用不到
            //取得目前所有單位
            //try {
            //    OA.client.Member.loadDeptList(function () {

            //    });
            //} finally {

            OA.client.Editor.load(input, function (resp) {
                Ext.Viewport.animateActiveItem(editor, { type: 'slide', direction: 'left' });
                me.getApplication().getController('OA.controller.Work').uiSetting();
                me.getApplication().getController('OA.controller.Approve').uiSetting();

                //先取範本清單
                var paras = OA.common.Global.getInitParas();
                OA.client.DocTemp.load(paras, function (r) {

                    if (r && r.length > 0) {
                        var docTemp = [];
                        Ext.Array.each(r, function (doc) {
                            docTemp.push(doc.split('.')[0])
                        });
                        if (docTemp.length > 0) {
                            OA.common.Global.setDocTempList(docTemp);
                        }
                    }


                    if (input.status == 'new') {
                        if (!KangDaAppConfig().nextStep) {
                            OA.common.Funcs.show('FormNewDoc', null, true);
                        } else {
                            OA.common.Global.getApp().getController('OA.controller.Work').autoGoNextStep(); //自動執行下一步
                        }
                    } else {
                        var options;
                        if (input.version) {
                            options = {};
                            options.version = input.version;
                        }

                        //總發文載入章戳
                        if (resp&&resp.role&&resp.role.roleId== '02') {
                            me.getApplication().getController('OA.controller.Menu').getOdaf31Stamp(function () {
                                me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(input, options);
                            });
                        } else {
                            me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(input, options);
                        }

                        //dialogType:1,roleId:15'16'02，getcheckMemcahce
                        //if (r.get('dialogType') == '1' && ['02', '15', '16'].indexOf(r.get('roleId') > 0)) {
                        //    OA.client.Memcahce.load(r, function (re) {
                        //        if (re && !re.isExist) {
                        //            me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r, options);
                        //        } else {
                        //            if (resp.role.jobNo == re.jobNo && r.raw.empName !== re.empName) {
                        //                Ext.Msg.confirm("提示", re.jobName + "：" + re.empName + "  正在簽核此公文，是否繼續開啟", function (ok) {
                        //                    if (ok == 'yes') {
                        //                        qs.isMemcahce = true;
                        //                        me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r, options);
                        //                    } else {
                        //                        return
                        //                    }
                        //                });
                        //            } else {
                        //                if (resp.role.jobNo == re.jobNo && r.raw.empName == re.empName)
                        //                    qs.isMemcahce = true;
                        //                me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r, options);
                        //            }
                        //        }
                        //    });
                        //} else {
                        //    if (r.get('roleId') == '02') {
                        //        me.getApplication().getController('OA.controller.Menu').getOdaf31Stamp(function () {

                        //            me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r, options);
                        //        });
                        //    } else {
                        //        me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r, options);
                        //    }
                        //}

                        //me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r, options);
                    }
                });

            });
            //}
        }
        //OA.client.Member.doKeepAlive(); //keep session
    },
    //離線製作
    doEditorOffline: function (qs) {
        var version = '';
        if (qs) {
            version = qs.v;
        } else {
            version = OA.common.Global.getQ().v;
        }

        document.title = '離線製作' + ' v' + version;
        var me = this;
        var ctrWK = me.getApplication().getController('OA.controller.Work');

        OA.client.Localforage.initParas();
        OA.common.FileMgr.init(function () {
            ctrWK.autoGoNextStep();
        });

        var editor = Ext.create('OA.view.MainEditor');
        Ext.Viewport.animateActiveItem(editor, { type: 'slide', direction: 'left' });

        ctrWK.uiSetting();
        ctrWK.updateDocAreaHidden('edit', 'edit');
        me.getApplication().getController('OA.controller.Approve').uiSetting();

        OA.common.Paper.register(Ext.getCmp('cpaper'));
        if (!KangDaAppConfig().nextStep) OA.common.Funcs.show('FormNewDoc', null, true);

    },

    //流覧器必需支援相依
    featureCheck: function () {
        //SVG must need
        if (!Ext.feature.has.Svg) {
            Ext.Msg.alert('必需要有支援svg流覧器');
            return;
        }
        // Check for the various File API support.
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
        } else {
            Ext.Msg.alert('File APIs不支援此流覧器');
        }
    },
    //WelCome
    doFirstTime: function () {
        Ext.device.Storage.getItem('isFirstTime');
        if (Ext.device.Storage.getItem('isFirstTime') !== "false") {
            Ext.device.Storage.setItem('isFirstTime', false);

            var overlay = Ext.create('OA.view.Welcome');
            Ext.Viewport.add(overlay);
            overlay.show();
        }
    },
    doHidden: function (isHidden) {
        var display = (isHidden) ? 'none' : 'block';
        Ext.Viewport.setStyle({ 'display': display });
    },
    //滑鼠滾輪
    bindMouseWheel: function (qs) {
        var dom = document;
        if (qs.app === 'spa') {
            dom = document.getElementById("my-modal-body");
        } else {

        }
        if (dom.addEventListener) {
            // IE9, Chrome, Safari, Opera
            // disable passive event listeners - by yi-chi chiu
            // dom.addEventListener('mousewheel', mouseWheelHandler, false);
            dom.addEventListener('mousewheel', mouseWheelHandler, { passive: false });
            // Firefox
            dom.addEventListener('DOMMouseScroll', mouseWheelHandler, false);
        } else {
            // IE 6/7/8
            dom.attachEvent('onmousewheel', mouseWheelHandler);
        }
    }
});