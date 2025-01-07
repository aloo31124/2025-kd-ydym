Ext.define('OA.controller.Work', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.util.InputBlocker', 'OA.client.WK', 'OA.client.Barrier', 'OA.client.Attach', 'OA.client.Member', 'OA.client.SignFlag',
        'OA.view.MenuReceived', 'OA.client.Print', 'OA.view.MenuEdition', 'OA.common.Bridge', "OA.client.AsyncWK"],
    config: {
        refs: {
            oawork: 'oawork',
            suggestion: 'suggestion',

            docList: 'menuList > list',
            toolPaper: 'oawork > #toolPaper',
            toolEdit: 'oawork > #toolEdit',
            toolPen: 'oawork > #toolPen',
            toolPenButton: 'oawork > #toolPen > button',
            panelSymbols: 'oawork > #panelSymbols',
            toolActions: '#toolActions',
            selectZoomRatio: '#zoomRatio',
            butEditorVersion: 'oawork > toolbar > button[action=editorVersion]', //版次Bar
            segdoc: 'oawork > toolbar > segmentedbutton',
            butEdit: 'oawork > toolbar > button[action=edit]',
            butMore: 'oawork > toolbar > button[action=more]',
            butInfo: 'oawork > toolbar > button[action=info]',
            butMode: 'oawork > toolbar > button[action=mode]',
            butSettings: 'oawork > toolbar > button[action=settings]',
            butComments: 'oawork > toolbar > button[action=comments]',
            butSearch: 'oawork > toolbar > button[action=search]',     //收尋

            butPaperAttach: 'oawork > toolbar > button[action=paperAttach]',  //附件

            butClearPaper: 'oawork > toolbar > button[action=clearPaper]',   //清稿
            butNew: 'oawork > toolbar > button[action=new]',                 //新檔
            butAdd: 'oawork > toolbar > button[action=add]',                 //新檔
            butOpen: 'oawork > toolbar > button[action=open]',               //舊檔
            butQuote: 'oawork > toolbar > button[action=quote]',             //引用

            butAttach: 'oawork > toolbar > button[action=attach]',           //附件
            butImport: 'oawork > toolbar > button[action=import]',           //匯入
            butExport: 'oawork > toolbar > button[action=export]',           //匯出
            butFields: 'oawork > toolbar > button[action=fields]',           //欄位
            butParallel: 'oawork > toolbar > button[action=parallel]',       //併列視窗
            butPackage: 'oawork > toolbar > button[action=package]',        //打包
            butBinPacket: 'oawork > toolbar > button[action=binPacket]',        //匯入封包


            butBold: 'oawork > toolbar > button[action=bold]',               //粗體
            butItalic: 'oawork > toolbar > button[action=italic]',           //斜體
            butUnderline: 'oawork > toolbar > button[action=underline]',     //底線
            butSuperscript: 'oawork > toolbar > button[action=superscript]', //上標
            butSubscript: 'oawork > toolbar > button[action=subscript]',     //下標
            butMath: 'oawork > toolbar > button[action=math]',               //轉數字

            butStrike: 'oawork > toolbar > button[action=strike]',       //刪除線
            butPen: 'oawork > toolbar > button[action=pen]',             //螢光筆
            butSticky: 'oawork > toolbar > button[action=sticky]',       //便利貼
            butPicture: 'oawork > toolbar > button[action=picture]',     //圖片
            butSeal: 'oawork > toolbar > button[action=seal]',           //職名章
            butComment: 'oawork > toolbar > button[action=comment]',     //批示
            butPencil: 'oawork > toolbar > button[action=pencil]',       //批示筆
            butEraser: 'oawork > toolbar > button[action=eraser]',       //橡皮擦
            butFhpath: 'oawork > toolbar > button[action=fhpath]',       //設定畫筆模式
            butGrid: 'oawork > toolbar > button[action=grid]',           //表格
            butEditMore: 'oawork > toolbar > button[action=editMore]',   //編輯更多功能
            butUser: 'oawork > toolbar > button[action=user]',           //使用者資訊
            butAddParagraph: 'oawork > toolbar > button[action=addParagraph]',  //新增段落

            butOutdent: 'oawork > toolbar > button[action=outdent]', //外縮
            butIndent: 'oawork > toolbar > button[action=indent]',   //內縮
            butUndo: 'oawork > toolbar > button[action=undo]',       //回覆動作
            butNextdo: 'oawork > toolbar > button[action=nextdo]',   //下一個動作
            butSymbol: 'oawork > toolbar > button[action=symbol]',   //符號
            butZoom: 'oawork > toolbar > button[action=zoom]',       //放大
            butZoomFull: 'oawork > toolbar > button[action=zoomFull]',   //整頁縮放
            butPrint: 'oawork > toolbar > button[action=print]',     //列印
            butSave: 'oawork > toolbar > button[action=save]',       //儲存
            butSaveAs: 'oawork > toolbar > button[action=saveas]',   //另存
            butClose: 'oawork > toolbar > button[action=close]',     //關閉
            butFlowinfo: 'oawork > toolbar > button[action=flowinfo]',  //流程資訊
            butAsync: "oawork > toolbar > button[action=async]", //追修歷程
            ctnParallel: 'oawork > ctnParallel',
            butsaveDraft: 'oawork > toolbar > button[action=saveDraft]',

            formfields: 'FormFields',

            ctnPaper: 'docPaper > ctnPaper',

            butSmallNext: 'docPaper > button[action=next]',
            listPlug: 'docPaper > dataview',

            cpaper: 'cpaper[id=cpaper]',
            docForm: 'docForm',
            docArea: 'docArea',

            fieldActions: '#fieldActions',   //approveSelect > fieldset > fieldActions
            fieldSubject: '#fieldSubject',   //approveSelect > fieldset > fieldSubject
            approveSelectToolbar: 'approveSelect > toolbar',

            formMoreList: 'FormMore',

            FormNewDoc: 'FormNewDoc', //OA.form.FormNewDoc

            suggestionText: '#suggestionText', //suggestion > fieldset > textareafield
            suggestionNotes: 'suggestion > fieldset > toolbar > button[action=suggestionNotes]'
        },
        control: {
            'oawork > toolbar > toolbar > button[group=cando]': {
                tap: 'onGotoStage'
            },
            'suggestion > fieldset > toolbar > button[group=cando]': {
                tap: 'onGotoStage'
            },
            'oawork > docArea > docPaper > button': {
                tap: 'onGotoStage'
            },
            FormNewDoc: {
                onNewDocPaper: 'onNewDocPaper'
            },
            segdoc: {
                toggle: 'onPaperTaggle'
            },
            butMore: {
                tap: function (button) {
                    OA.common.Funcs.show('FormMore', button);
                }
            },
            butZoom: {
                tap: 'onZoomTap'
            },
            butZoomFull: {
                tap: function (button) {
                    this.getCpaper().editActions().zoom(0.67);
                }
            },
            butPrint: {
                tap: 'onPrintTap'
            },
            butEditorVersion: {
                tap: function () {
                    var me = this;
                    me.frameResize('left');
                    Ext.Viewport.toggleMenu("left");
                }
            },
            butInfo: {
                tap: function () {
                    // var xml = OA.common.Paper.main().getSvgPaper().svgCanvasToString();
                    var xml = this.toPrintXml();

                    // var winSetting = 'width=850,height=650,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no';
                    // var printWin =window.open("about:blank", "", winSetting);
                    // printWin.document.write('<textarea style="width: 800px; height: 600px;">' + xml + '</textarea>');

                    var blob = new Blob([xml], { type: "application/xml;charset=utf-8" });
                    saveAs(blob, 'test.svg');
                }
            },
            butMode: {
                tap: 'onModeTap'
            },
            butSearch: { //0319 提醒使用者可用Ctrl+F搜尋來尋找內文關鍵字 Chloe.sia
                tap: function myFunction(button) {
                    var me = this;
                    Ext.Msg.alert('提示', '請按住鍵盤 CTRL+F 進行搜索功能');
                }

            },
            butSettings: {
                tap: function (button) {
                    OA.common.Funcs.show('FormSetting', button);
                }
            },
            butComments: {
                tap: function () {
                    var me = this;
                    if (this.getSuggestion()) {
                        var isHidden = this.getSuggestion().getHidden();
                        this.getSuggestion().setHidden(!isHidden);
                        me.frameResize('right');
                    }
                }
            },
            butEdit: {
                tap: 'onEditTap'
            },
            butClose: {
                tap: 'onCloseTap'
            },
            butSave: {
                tap: 'onSaveTap'
            },
            butSaveAs: {
                tap: 'onSaveTap'
            },
            butsaveDraft: {
                tap: 'onSaveTap'
            },
            butAsync: {
                tap: "onAsyncTap",
            },
            butPaperAttach: {
                tap: function () {
                    OA.common.Fields.popupFromShow('附件上傳');
                }
            },
            butAttach: {
                tap: function () {
                    /*
                    var me = this;
                    // 預先儲存
                    var qs = OA.common.Global.getQ();
                   
                    if (qs.app === 'editor' || qs.app === 'offline') {
                        var openFolder = OA.common.FileMgr.getOpenDialogPath();
                        if (!openFolder) {
                            me.doSaveFolder({ action: 'save', isNotPopup: true }, function () {
                                OA.common.Fields.popupFromShow('附件上傳');
                            });
                            //me.onSaveTap(null, true);//自動命名
                            return;
                        } else {
                            var saveFolder = openFolder.split('\\').pop();
                            if (saveFolder)
                                OA.common.FileMgr.setSaveFolder(saveFolder);
                        }
                    }
                    */
                    OA.common.Fields.popupFromShow('附件上傳');
                }
            },
            listPlug: {
                itemtap: 'onAttachTap'
            },
            butFields: {
                tap: function (button) {
                    OA.common.Funcs.show('FormFields', button);
                }
            },
            butParallel: {
                tap: function (button) {
                    Ext.Viewport.hideMenu('left');
                    this.getSuggestion().setHidden(true);
                    this.frameResize('right');
                    OA.common.Funcs.show('FormParallel', button);
                }
            },
            butPackage: {
                tap: function (button) {
                    OA.common.Paper.main().executeAction('package');
                }
            },
            butStrike: {
                tap: function () {
                    if (this.getCpaper().getIsLockPaper()) return;
                    this.getCpaper().editActions().strike();
                }
            },

            butPen: {
                tap: function (button) {
                    if (this.getCpaper().getIsLockPaper()) return;
                    this.switchToolPen(button.config.action);
                }
            },
            butEditMore: {
                tap: function (button) {
                    OA.common.Funcs.show('FormEditMore', button);
                }
            },
            butAddParagraph: {
                tap: function (button) {
                    this.getCpaper().editActions().addParagraph();
                }
            },
            butUser: {
                tap: function (button) {
                    OA.common.Funcs.show('FormUser', button);
                }
            },
            butSticky: {
                tap: function (button) {
                    // 判斷已存檔功能 - by yi-chi chiu
                    OA.app.isSavedFlag = false;
                    var me = this;
                    var u = OA.common.Global.getCurrentUser();
                    var r = OA.common.Global.getCurrentRole();
                    var qs = OA.common.Global.getQ();

                    var empName = u.empName;
                    var empNo = u.empNo;
                    var jobName = r.jobName;

                    if (qs.isRole15) {
                        var u15 = OA.common.Global.getSourceUser();
                        empName = u15.empName;
                        empNo = u15.empNo;
                        jobName = u15.jobName;
                    }
                    var wk = OA.common.Global.getCurrentWKContent();
                    var sticky = Ext.create('OA.model.Sticky',
                        {
                            empName: empName,
                            empNo: empNo,
                            jobName: jobName,
                            //lastUpdateTime: OA.common.Utils.getChineseDate(),
                            LastUpdateTime: OA.common.Utils.getOldEditChineseDate(),
                            positionX: 350,
                            positionY: 250,
                            tagName: "StickyNote",
                            text: '',
                            version: wk.Version
                        });

                    Ext.getStore('Sticky').add(sticky);
                    // 讓便利貼自動縮放 - by yi chi chiu
                    $('.sticky textarea').css("overflow", "hidden").bind("keydown keyup", function () {
                        $(this).height('0px').height($(this).prop("scrollHeight") + "px");
                    }).keydown();

                    // 判斷已存檔功能 - by yi-chi chiu
                    $('.sticky textarea').bind("input", function () {
                        OA.app.isSavedFlag = false;
                    });
                }
            },
            butSeal: {
                tap: function (button) {
                    // 判斷已存檔功能 - by yi-chi chiu
                    OA.app.isSavedFlag = false;
                    var me = this;
                    var d = OA.common.Global.getCurrentDept();
                    var u = OA.common.Global.getCurrentUser();
                    var r = OA.common.Global.getCurrentRole();
                    var qs = OA.common.Global.getQ();

                    var empName = u.empName;
                    var empNo = u.empNo;
                    var jobName = r.jobName;

                    if (qs.isRole15) {
                        var u15 = OA.common.Global.getSourceUser();
                        empName = u15.empName;
                        empNo = u15.empNo;
                        jobName = u15.jobName;
                    }
                    var wk = OA.common.Global.getCurrentWKContent();

                    var seal = Ext.create('OA.model.Sealinfo',
                        {
                            "isDigitalSign": false,
                            "empno": u.userId,
                            "isassignee": false,
                            "isflowfollow": false,
                            "roleid": r.roleId,
                            "width": "",
                            "emptitle": u.empTitle,
                            "empname": empName,
                            "depName": d.depName,
                            "ispis": false,
                            "positiony": 1000,
                            "voname": 6335782417,
                            "actionname": "用印",
                            "autotype": 1,
                            "version": wk.Version,
                            "depno": d.depNo,
                            "height": 50,
                            "lastUpdateTime": OA.common.Utils.getChineseDate(),
                            "positionx": 80,
                            "isApprover": false,
                            "jobno": r.jobNo,
                            "tagName": "Sealinfo",
                            "signtime": OA.common.Utils.getChineseDate(),
                            "orgno": d.orgNo,
                            "filetype": ""
                        });

                    Ext.getStore('Sealinfo').add(seal);

                    // // 讓便利貼自動縮放 - by yi chi chiu
                    // $('.Seal').css("overflow", "hidden").bind("keydown keyup", function () {
                    //     $(this).height('0px').height($(this).prop("scrollHeight") + "px");
                    // }).keydown();

                    // 判斷已存檔功能 - by yi-chi chiu
                    $('.Seal').bind("input", function () {
                        OA.app.isSavedFlag = false;
                    });
                }
            },
            toolPenButton: {
                tap: function (button) {
                    var status = this.getButEraser().getHidden();
                    var size = Ext.getCmp('selectPenSize').getValue();
                    var _color = button.getStyle().color;

                    if (status) { //螢光筆
                        this.getCpaper().editActions().pen(_color, size);
                    } else { //批示筆
                        this.getButPencil().setStyle({ 'color': _color });
                        this.getCpaper().editActions().comment(_color, size);
                    }
                }
            },
            butIndent: {
                tap: function () {
                    if (this.getCpaper().getIsLockPaper()) return;
                    this.getCpaper().editActions().indent();
                }
            },
            butOutdent: {
                tap: function () {
                    if (this.getCpaper().getIsLockPaper()) return;
                    this.getCpaper().editActions().outdent();
                }
            },
            butBold: {
                tap: function () {
                    this.getCpaper().editActions().bold();
                }
            },
            butItalic: {
                tap: function () {
                    this.getCpaper().editActions().italic();
                }
            },
            butUnderline: {
                tap: function () {
                    this.getCpaper().editActions().underline();
                }
            },
            butSuperscript: {
                tap: function () {
                    this.getCpaper().editActions().superscript();
                }
            },
            butSubscript: {
                tap: function () {
                    this.getCpaper().editActions().subscript();
                }
            },
            butMath: {
                tap: function (button) {
                    OA.common.Funcs.widget('FormChangeNumber', button);
                }
            },
            butUndo: {
                tap: function (button) {
                    OA.common.Paper.main().executeAction('undo');
                }
            },

            butSymbol: {
                tap: 'onSymbolTap'
            },
            butComment: {
                tap: function (button) {
                    if (this.getCpaper().getIsLockPaper()) return;
                    this.switchToolPen(button.config.action);
                    this.getCpaper().editActions().comment();
                }
            },
            butPencil: {
                tap: function (button) {
                    if (this.getCpaper().getIsLockPaper()) return;
                    var size = Ext.getCmp('selectPenSize').getValue();
                    this.getCpaper().editActions().comment();
                }
            },
            butEraser: {
                tap: function (button) {
                    this.getCpaper().editActions().eraser();
                }
            },
            butFhpath: {
                tap: function (button) {
                    this.getCpaper().editActions().fhpath();
                }
            },
            butGrid: {
                tap: function (button) {
                    OA.common.Funcs.widget('FormAddTable', button);
                }
            },
            butClearPaper: {
                tap: function (button) {
                    var me = this, ctr = me.getCpaper(), svg = ctr.getSvgPaper();
                    var currentLayerName = svg.getCurrentDrawing().getCurrentLayerName();

                    me.updateDocAreaHidden('clearPaper', button.getData().todo);
                    if (button.getData().todo == 'clear') {
                        ctr.setIsPreview(true);
                        ctr.clearPaper(true);
                        button.setDisabled(true);
                    } else if (button.getData().todo == 'preview') { //預覧
                        ctr.setIsPreview(true);
                        ctr.clearPaper(false);
                        button.setData({ todo: 'close' });
                        // button.setIconCls('fa-eye-slash');
                    } else {  //結束預覧
                        ctr.setIsPreview(false);
                        ctr.unClearPaper();
                        ctr.typesetting()   //0923 結束預覧清稿時，文字重排 Chloe.sia
                        button.setData({ todo: 'preview' });
                        // button.setIconCls('fa-eye');
                    }
                }
            },
            butNew: {
                tap: function () {
                    //判斷目前是否有文稿提示存檔舊檔
                    var me = this;
                    var buttons = me.getSegdoc().getItems().items;
                    if (buttons && buttons.length > 0) {
                        Ext.Msg.confirm('另開新檔', '是否儲存目前開啟的檔案？', function (fn) {
                            if (fn === 'yes') {
                                me.onSaveTap(null, true);
                                OA.common.Funcs.show('FormNewDoc', null, true);
                            } else {
                                OA.common.Funcs.show('FormNewDoc', null, true);
                            }
                        });
                    } else {
                        OA.common.Funcs.show('FormNewDoc', null, true);
                    }
                }
            },
            butAdd: {
                tap: function (button) {
                    var me = this;

                    me.onPaperTaggle(null, button, true);
                }
            },
            butOpen: {
                tap: 'onOpenTap'
            },
            butImport: {
                tap: function () {
                    OA.common.Paper.main().executeAction('import');
                }
            },
            butExport: {
                tap: function () {
                    OA.common.Funcs.show('FormExport');
                }
            },
            butBinPacket: {
                tap: function () {
                    OA.common.Funcs.show('FormImport');
                }
            },
            butFlowinfo: {
                tap: function () {
                    OA.common.Funcs.show('FormFlowTip');
                }
            },

            'docHistory > list': {
                itemtap: function (list, index, item, record, event) {
                }
            },

            suggestionText: {
                focus: function (ctr, e, eOpts) {
                    var me = this;
                    var svg = me.getCpaper().getSvgPaper();
                    if (svg && svg.getMode() == 'textedit') {
                        svg.setMode('select');
                        me.getCpaper().svgUpdateLayout();  //文字重排
                        me.getCpaper().updateSvgCanvas();  //視圖重刷
                    }
                    me.getCpaper().setIsSuggestionIn(true);
                }, change: function (ctr, newValue, oldValue, eOpts) {
                    this.suggestionUpdate(newValue);
                }, blur: function (ctr, e, eOpts) {
                    var me = this;
                    OA.common.Paper.setActiveStatus('edit');
                    me.getCpaper().setIsSuggestionIn(false);
                }
            },
            suggestionNotes: {
                tap: 'onSuggestionNotesTap'
            },
            selectZoomRatio: {
                change: 'onZoomChange'
            }
        },
        timerId: null,
        winOpen: null,
        sendDataChange: false,
        isRole15Edited: false,
        isDuplicate: false
    },
    uiSetting: function () {
        var me = this;
        var qs = OA.common.Global.getQ();
        if (!qs) return;
        if (qs.v >= '1.0.1') {
            if (me.getButEdit()) me.getButEdit().setHidden(false);
        }
        if (me.getButPrint()) me.getButPrint().setHidden(false);

        me.windowLayout();      //簽核視窗初始化
        me.toolPenInit();       //螢光筆
        me.stickyInit();        //便利貼
        me.SealInit();          //職名章

        if (Ext.os.is.iOS || Ext.os.is.Android) {
            var area = this.getDocArea();
            area.setActiveItem('docForm');
            if (me.getButMode()) me.getButMode().setIconCls('fa-pencil-square-o');
        }
    },
    /**
     * 功能按鈕開啟／關閉
     */
    updateDocAreaHidden: function (methodId, subAction) {
        //console.log(methodId);
        //console.log(subAction);
        var me = this;
        var qs = OA.common.Global.getQ();
        if (methodId == 'hideAll') {
            me.getCtnPaper().setHidden(false);
            me.getCpaper().setHidden(true);
            me.getButSmallNext().setHidden(true);
        } else if (methodId == 'actionButton') {
            me.getCtnPaper().setHidden(false);
            me.getCpaper().setHidden(false);
            me.getListPlug().setHidden(false);
            if (me.getButClearPaper()) {
                me.getButClearPaper().setHidden(false);
                me.getButClearPaper().setDisabled(false);
                me.getButClearPaper().setData({ todo: 'preview' });
            }
            me.getCpaper().setIsClearPaper(false);

            if (qs.app === '') me.getButSmallNext().setHidden(false);
            Ext.getCmp('oawork').toolActionInit();
        } else if (methodId == 'check') {
            me.getCtnPaper().setHidden(false);
            me.getCpaper().setHidden(false);
            me.getListPlug().setHidden(false);
            me.getToolEdit().setHidden(false);
        } else if (methodId == 'history') {
            me.getCtnPaper().setHidden(false);
            me.getCpaper().setHidden(false);
            me.getButSmallNext().setHidden(true);
        } else if (methodId == 'read') {
            me.getCtnPaper().setHidden(false);
            me.getCpaper().setHidden(false);
            me.getCpaper().setStatus('');
            me.getCpaper().getSvgPaper().setMode('touch');
            me.getCpaper().setIsFieldEdit(false);
        } else if (methodId == 'edit') {
            me.getCtnPaper().setHidden(false);
            me.getCpaper().setHidden(false);
            me.getToolPen().setHidden(true);
            me.getToolPaper().setHidden(true);
            if (subAction == 'edit') {
                var menu = Ext.getCmp('sodMenu');
                if (menu) menu.setHidden(true);

                if (qs.app === 'editor' || qs.app === 'draft' || qs.app === 'offline' || qs.app === 'approve') {
                    me.getToolPaper().setHidden(false);
                } else {
                    me.getToolPaper().setHidden(true);
                }
                me.getToolEdit().setHidden(false);

                if (qs.app === 'approve') return;

                if (me.getSuggestion()) me.getSuggestion().setHidden(true);
                if (me.getButEdit()) me.getButEdit().setText('完成');
                me.getListPlug().setHidden(true);
                me.getButSmallNext().setHidden(true);
            } else if (subAction == 'close' || subAction == 'save') {
                me.getCpaper().unClearPaper();

                if (me.getSuggestion()) me.getSuggestion().setHidden(false);

                if (qs.app === 'editor' || qs.app === 'draft' || qs.app === 'approve' || qs.app === 'offline' || qs.reOt === 'F') {
                    me.getToolPaper().setHidden(true);
                } else {
                    me.getToolPaper().setHidden(false);
                }

                me.getToolEdit().setHidden(true);
                if (me.getButEdit()) me.getButEdit().setText('編輯');
                if (Ext.getCmp('sodMenu')) Ext.getCmp('sodMenu').setHidden(false);

                me.updateDocAreaHidden('actionButton');
                me.updateDocAreaHidden('sticky');

                me.getCpaper().setStatus('');
                var svg = me.getCpaper().getSvgPaper();
                svg.setMode('touch');
            }
        } else if (methodId == 'clearPaper') {
            me.getCtnPaper().setHidden(false);
            me.getCpaper().setHidden(false);
            me.getToolPen().setHidden(true);
            if (me.getButSuperscript()) me.getButSuperscript().setHidden(false);
            if (me.getButSubscript()) me.getButSubscript().setHidden(false);
            if (subAction == 'clear') {
                if (me.getButBold()) me.getButBold().setHidden(false);
                if (me.getButItalic()) me.getButItalic().setHidden(false);
                if (me.getButUnderline()) me.getButUnderline().setHidden(false);
                if (me.getButSuperscript()) me.getButSuperscript().setHidden(false);  //2020.10.05 林務局列管需求 開放上標    Chloe.sia
                if (me.getButSubscript()) me.getButSubscript().setHidden(false);      //2020.10.05 林務局列管需求 開放下標    Chloe.sia
                if (me.getButComment()) me.getButComment().setHidden(true);
                if (me.getButStrike()) me.getButStrike().setHidden(true);
                //if (me.getButPen()) me.getButPen().setHidden(true);  //2019.06.19 台北市列管需求 開放螢光筆
                if (me.getButClearPaper()) me.getButClearPaper().setHidden(true);

                Ext.Array.each(me.getToolEdit().getItems().items, function (item) {
                    item.setDisabled(false);
                });
            } else if (subAction == 'preview') {
                Ext.Array.each(me.getToolEdit().getItems().items, function (item) {
                    var todo = (item.getData()) ? item.getData().todo : null;
                    if (todo !== 'preview') item.setDisabled(true);
                });
                if (me.getSegdoc()) me.getSegdoc().setDisabled(true);
                if (me.getToolActions()) me.getToolActions().setHidden(true);
            } else if (subAction == 'hidden') {
                if (me.getButClearPaper()) me.getButClearPaper().setHidden(true);
            } else {
                Ext.Array.each(me.getToolEdit().getItems().items, function (item) {
                    item.setDisabled(false);
                });
                if (me.getSegdoc()) me.getSegdoc().setDisabled(false);
                if (me.getToolActions()) me.getToolActions().setHidden(false);
                if (me.getButBold()) me.getButBold().setHidden(true);
                if (me.getButItalic()) me.getButItalic().setHidden(true);
                if (me.getButUnderline()) me.getButUnderline().setHidden(true);
                if (me.getButSuperscript()) me.getButSuperscript().setHidden(true);
                if (me.getButSubscript()) me.getButSubscript().setHidden(true);
                if (me.getButComment()) me.getButComment().setHidden(false);
                if (me.getButStrike()) me.getButStrike().setHidden(false);
                if (me.getButPen()) me.getButPen().setHidden(false);
            }
        } else if (methodId == 'readOnly') {
            var segItems = me.getSegdoc().getItems().items;
            if (subAction == 'close') {
                //關閉存檔按鈕
                if (me.getButSave()) me.getButSave().setHidden(true);
                //關閉上方工具按鈕
                if (me.getButClearPaper()) me.getButClearPaper().setHidden(true);
                if (me.getButFields()) me.getButFields().setHidden(true);
                if (me.getButEditMore()) me.getButEditMore().setHidden(true);
                if (me.getButOutdent()) me.getButOutdent().setHidden(true);
                if (me.getButIndent()) me.getButIndent().setHidden(true);
                if (me.getButStrike()) me.getButStrike().setHidden(true);
                if (me.getButPen()) me.getButPen().setHidden(true);
                if (me.getButComment()) me.getButComment().setHidden(true);
                if (me.getButSticky()) me.getButSticky().setHidden(true);
                if (me.getButSymbol()) me.getButSymbol().setHidden(true);
            }
            else {
                //關閉存檔按鈕
                if (me.getButSave()) me.getButSave().setHidden(false);
                //開啟上方工具按鈕
                if (me.getButClearPaper()) me.getButClearPaper().setHidden(false);
                if (me.getButFields()) me.getButFields().setHidden(false);
                if (me.getButEditMore()) me.getButEditMore().setHidden(false);
                if (me.getButOutdent()) me.getButOutdent().setHidden(false);
                if (me.getButIndent()) me.getButIndent().setHidden(false);
                if (me.getButStrike()) me.getButStrike().setHidden(false);
                if (me.getButPen()) me.getButPen().setHidden(false);
                if (me.getButComment()) me.getButComment().setHidden(false);
            }
            //附件按鈕關閉新增、刪除、確定，在PanelAttach.js設定
        }

        if (me.getButImport()) me.getButImport().setHidden(false);
        if (me.getButExport()) me.getButExport().setHidden(false);
    },
    /**
     *  創簽稿、新文稿
     */
    onNewDocPaper: function (form, values) {
        console.log(values)
        var me = this;
        var qd = OA.common.Global.getQueryDefault();
        OA.common.Global.setRefreshDocflow(null);    //儲存後 refresh docflow 初始化

        //創稿create OR 新文稿add
        var actionStatus = (values.qIsNew) ? 'create' : 'add';
        values.action = actionStatus;
        me.getCpaper().setStatus(actionStatus);

        var ret;
        if (values.di) {
            if (qd && qd.交換資訊 && qd.交換資訊.評議案件受文者 && qd.交換資訊.評議案件受文者.受文者) {
                if (!Ext.isArray(qd.交換資訊.評議案件受文者.受文者)) {
                    qd.交換資訊.評議案件受文者.受文者 = [qd.交換資訊.評議案件受文者.受文者];
                }
                var paras = OA.common.Global.getInitParas();
                var data = {};
                data.qType = '0';
                data.start = 0;
                data.limit = 1;
                data.depNo = paras.depNo;
                data.empNo = paras.empNo;
                Ext.Array.each(qd.交換資訊.評議案件受文者.受文者, function (item) {
                    data.dep3ChnName = Ext.clone(item.名稱);
                    OA.client.Member.search(data, function (re) {
                        console.log(re);
                        if (re.length != 0 && item.交換代碼 + ''.trim() === '') {
                            item.交換代碼 = re[0].get('dep3No');
                            item.發文方式 = '9';
                            if ((item.地址 + '').trim() == '') {
                                item.地址 = re[0].get('dep3Addr') || '';
                            }

                            if ((item.郵遞區號 + '').trim() == '') {
                                item.郵遞區號 = re[0].get('dep3Zone') || '';
                            }

                        }
                        //比對最後一筆了再新增
                        if (item.名稱 == qd.交換資訊.評議案件受文者.受文者[qd.交換資訊.評議案件受文者.受文者.length - 1].名稱) {
                            ret = OA.common.DIMgr.ImportDI(values.di, values);
                            OA.common.Global.setCurrentWKContent(ret.wkContent);
                            OA.common.Global.setCurrentViewModel(ret.oSVG.vm);
                            me.getCtnPaper().setHidden(false);

                            //增加一筆自已單位的抄本                         
                            /* 高市府先不用
                            if (vm && vm.抄本 != undefined && vm.ContactList == null) {
                                var dept = OA.common.Global.getCurrentDept();
                                if (dept) {

                                    var copyContactList;
                                    var dept = OA.common.Global.getCurrentDept();
                                    if (dept) {
                                        if (dept.depNo == 'A305') {
                                            copyContactList = [{
                                                ADDR: '',
                                                ARCENO: '',
                                                CODE: dept.depNo || '',
                                                CODENAME: dept.depName,
                                                GROUP: "",
                                                GROUPLIST: "",
                                                KEY: "抄本",
                                                PEOPLESEND: "",
                                                REALTRANSTYPE: 5,
                                                TRANSTYPE: '5',
                                                TRANSTYPENAME: "抄本",
                                                TYPE: 1,
                                                VALUE: dept.depName,
                                                tagName: "Contact",
                                                ATTACH: 'Y',
                                                isEdit: true,
                                                editAtt: false,
                                                isChange: 'N',
                                                children: ''
                                            }];
                                        } else {
                                            copyContactList = [{
                                                ADDR: '',
                                                ARCENO: '',
                                                CODE: dept.upDeptNo,
                                                CODENAME: dept.upDeptName,
                                                GROUP: "",
                                                GROUPLIST: "",
                                                KEY: "抄本",
                                                PEOPLESEND: "",
                                                REALTRANSTYPE: 5,
                                                TRANSTYPE: '5',
                                                TRANSTYPENAME: "抄本",
                                                TYPE: 1,
                                                VALUE: dept.upDeptName,
                                                tagName: "Contact",
                                                ATTACH: 'Y',
                                                isEdit: true,
                                                editAtt: false,
                                                isChange: 'N',
                                                children: ''
                                            }];
                                        }
                                    }

                                    Ext.Array.each(qd.交換資訊.評議案件受文者.受文者, function (pojSender) {

                                        var pojTranstype = '2';
                                        var pojIsChange = 'N';
                                        var pojSendtype = "紙本";
                                        if (pojSender.發文方式 != 2) {
                                            pojTranstype = '9';
                                            pojIsChange = 'Y';
                                            pojSendtype = '電子';
                                        }

                                        copyContactList.push({
                                            ADDR: pojSender.地址 || '',
                                            ARCENO: pojSender.郵遞區號 || '',
                                            CODE: pojSender.交換代碼 || '',
                                            CODENAME: pojSender.名稱 || '',
                                            GROUP: "",
                                            GROUPLIST: "",
                                            KEY: "正本",
                                            PEOPLESEND: "",
                                            REALTRANSTYPE: parseInt(pojTranstype),
                                            TRANSTYPE: pojTranstype || '',
                                            TRANSTYPENAME: pojSendtype,
                                            TYPE: 1,
                                            VALUE: pojSender.名稱 || '',
                                            tagName: "Contact",
                                            ATTACH: 'Y',
                                            isEdit: true,
                                            editAtt: false,
                                            isChange: pojIsChange,
                                            children: ''
                                        })
                                    });

                                    vm.ContactList = copyContactList;
                                }
                                //同步WK,VM
                                wk.childNodes[0].childNodes.push({
                                    tagName: "ContactList",
                                    childNodes: copyContactList
                                })

                                OA.common.Global.setCurrentWKContent(wk);
                                OA.common.Global.setCurrentViewModel(vm);
                            }
                            */

                            me.getCpaper().create(ret.oSVG, ret.fields, function () {
                                me.doNewDocPaper(ret, values);
                            });
                        }
                    });
                });
                return;
            } else {
                ret = OA.common.DIMgr.ImportDI(values.di, values);
                var xmlDoc = '';
                try {
                    xmlDoc = $.parseXML(values.sw);
                } catch (err) {
                    if (err) console.log(err);
                    return { err: err };
                }
                var $xml = $(xmlDoc);
                var list = $xml.find('交換表單');
                if (list.length > 0) {
                    Ext.Array.each(list[0].childNodes, function (node) {
                        if (node.tagName === '全銜' || node.tagName === '單位名') {
                            Ext.Array.each(ret.oSVG.vm.ContactList, function (item) {
                                if (node.textContent == item.CODENAME) {
                                    // var b = $(node).nextAll("單位代碼").first().text();
                                    item.CODE = $(node).nextAll("機關代碼").first().text();
                                    item.TRANSTYPE = 9;
                                }
                            });
                        }
                    });
                }
                OA.common.Global.setCurrentWKContent(ret.wkContent);
                OA.common.Global.setCurrentViewModel(ret.oSVG.vm);
            }
        } else {
            if (values.duplicate && values.ret) {   //建立複本
                ret = values.ret;
            } else {
                ret = OA.common.DIMgr.generateNewDoc(values);
                //console.log(Ext.clone(OA.common.Global.getCurrentWKContent()));
            }
        }

        me.getCtnPaper().setHidden(false);
        //模版
        var vm = OA.common.Global.getCurrentViewModel();
        var wk = OA.common.Global.getCurrentWKContent();
        if (vm.templateUrl) {
            OA.client.WK.loadTemplate(vm.templateUrl, function (xml) {
                ret.oSVG.xml = xml;
                me.getCpaper().createForm(ret.oSVG, ret.fields, function () {
                    me.doNewDocPaper(ret, values);
                });
            })
            return;
        }


        
        //增加一筆自已單位的抄本
        //高市府先不用
        /*
        if (vm && vm.抄本 != undefined && vm.ContactList == null) {
            var dept = OA.common.Global.getCurrentDept();
            if (dept) {

                var copyContactList;
                var dept = OA.common.Global.getCurrentDept();
                if (dept) {
                    if (dept.depNo == 'A305') {
                        copyContactList = [{
                            ADDR: '',
                            ARCENO: '',
                            CODE: dept.depNo || '',
                            CODENAME: dept.depName,
                            GROUP: "",
                            GROUPLIST: "",
                            KEY: "抄本",
                            PEOPLESEND: "",
                            REALTRANSTYPE: 5,
                            TRANSTYPE: '5',
                            TRANSTYPENAME: "抄本",
                            TYPE: 1,
                            VALUE: dept.depName,
                            tagName: "Contact",
                            ATTACH: 'Y',
                            isEdit: true,
                            editAtt: false,
                            isChange: 'N',
                            children: ''
                        }];
                    } else {
                        copyContactList = [{
                            ADDR: '',
                            ARCENO: '',
                            CODE: dept.upDeptNo,
                            CODENAME: dept.upDeptName,
                            GROUP: "",
                            GROUPLIST: "",
                            KEY: "抄本",
                            PEOPLESEND: "",
                            REALTRANSTYPE: 5,
                            TRANSTYPE: '5',
                            TRANSTYPENAME: "抄本",
                            TYPE: 1,
                            VALUE: dept.upDeptName,
                            tagName: "Contact",
                            ATTACH: 'Y',
                            isEdit: true,
                            editAtt: false,
                            isChange: 'N',
                            children: ''
                        }];
                    }
                }
                //增加判斷如果有評議受文者加到正本
                if (qd && qd.交換資訊 && qd.交換資訊.評議案件受文者 && qd.交換資訊.評議案件受文者.受文者) {
                    if (!Ext.isArray(qd.交換資訊.評議案件受文者.受文者)) {
                        qd.交換資訊.評議案件受文者.受文者 = [qd.交換資訊.評議案件受文者.受文者];
                    }

                    Ext.Array.each(qd.交換資訊.評議案件受文者.受文者, function (pojSender) {

                        var pojTranstype = '2';
                        var pojIsChange = 'N';
                        var pojSendtype = "紙本";
                        if (pojSender.發文方式 != 2) {
                            pojTranstype = '9';
                            pojIsChange = 'Y';
                            pojSendtype = '電子';
                        }

                        copyContactList.push({
                            ADDR: pojSender.地址 || '',
                            ARCENO: pojSender.郵遞區號 || '',
                            CODE: pojSender.交換代碼 || '',
                            CODENAME: pojSender.名稱 || '',
                            GROUP: "",
                            GROUPLIST: "",
                            KEY: "正本",
                            PEOPLESEND: "",
                            REALTRANSTYPE: parseInt(pojTranstype),
                            TRANSTYPE: pojTranstype || '',
                            TRANSTYPENAME: pojSendtype,
                            TYPE: 1,
                            VALUE: pojSender.名稱 || '',
                            tagName: "Contact",
                            ATTACH: 'Y',
                            isEdit: true,
                            editAtt: false,
                            isChange: pojIsChange,
                            children: ''
                        })
                    });
                }

                vm.ContactList = copyContactList;
            }
            //同步WK,VM
            wk.childNodes[0].childNodes.push({
                tagName: "ContactList",
                childNodes: copyContactList
            })

            OA.common.Global.setCurrentWKContent(wk);
            OA.common.Global.setCurrentViewModel(vm);
        }
        */
       
        //文稿
        if (ret.isPenink && vm && vm.ContactList.length > 0) {
            var paras = OA.common.Global.getInitParas();
            var data = {};
            data.qType = '0';
            data.start = 0;
            data.limit = 1;
            data.depNo = paras.depNo;
            data.empNo = paras.empNo;
            Ext.Array.each(vm.ContactList, function (item) {
                data.dep3ChnName = item.CODENAME
                OA.client.Member.search(data, function (re) {
                    if (re.length != 0 && item.CODE + ''.trim() === '') item.CODE = re[0].get('dep3No');
                    //比對最後一筆了再新增
                    if (item.VALUE == vm.ContactList[vm.ContactList.length - 1].VALUE) {
                        me.getCpaper().create(ret.oSVG, ret.fields, function () {
                            me.doNewDocPaper(ret, values);
                        });
                    }
                });
            });
        } else {
            me.getCpaper().create(ret.oSVG, ret.fields, function () {
                me.doNewDocPaper(ret, values);
            });
        }
    },
    doNewDocPaper: function (option, values) {
        var me = this;
        var qs = OA.common.Global.getQ();
        if (option.record) me.doSticky(option.record.get('StickyNote'));   //便利貼
        if (option.record) me.doseal(option.record.get('Sealinfo'));   //職名章

        if (!values.duplicate) Ext.getStore('Attach').setData(null);  //複製公文不清除附件

        if (values.attachs) {
            var store = Ext.getStore('Attach');
            Ext.Array.each(values.attachs, function (f) {
                f.folderName = 'attach';
                f.status = '1';
                f.personnel = OA.common.Global.getCurrentUser().empName || '';
                f.depName = OA.common.Global.getCurrentDept().depName || '';
                store.add({
                    name: f.fileKey,
                    url: '',
                    format: f.fileType,
                    sort: 'attach',
                    file: f,
                    isEdit: true
                });
            });
        }

        me.loadAttachsCount();      //載入附件及附件計數
        me.getCpaper().getSvgPaper().setMode('select');
        me.getCpaper().setIsFieldEdit(true);
        Ext.getCmp('oawork').toolActionInit();

        me.getCpaper().setIsClearPaper(true);
        me.updateDocAreaHidden('edit', 'edit');
        me.updateDocAreaHidden('clearPaper', 'hidden');

        if (me.getButClearPaper()) me.getButClearPaper().setDisabled(true);

        //創簽稿
        if (values.qIsNew) {
            if (qs.app === 'editor' || qs.app === 'offline') {
                var items = OA.common.VIMgr.create(values);
                me.getSegdoc().setItems(items);
                OA.common.Global.getApp().getController('OA.controller.Menu').segdocPressed();  // on onPaperTaggle
                OA.common.FileMgr.setOpenDialogPath('');  //創新稿後預設存檔路徑要重設為空
                OA.common.FileMgr.setSaveFolder('');
            }
        } else {
            if (qs.app === 'editor' && values.di != '') {  //創稿匯入 Import 行為方式為：取代文稿   Chloe.sia
                me.doSave(values, '', true);
            } else {
                me.doSave(values);
            }

        }
        // OA.client.WK.autoSaveStart();
    },
    /**
     *  複本
     */
    duplicatePaper: function (callback) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var isDestop = Ext.os.deviceType === 'Desktop';
        var count = OA.common.DIMgr.getDraftCount();
        if (count > 61) {
            me.getSegdoc().setPressedButtons([]);
            Ext.Msg.alert('提示', '超過最大稿數！');
            return;
        }

        var doOffline = (qs.app === 'editor' || qs.app === 'offline') && isDestop;
        if (doOffline) {
            //var status = OA.common.Paper.getActiveStatus();
            me.doSaveFolder({ action: 'save', isNotPopup: true }, function () {
                var wk = OA.common.Global.getCurrentWKContent();
                var values = {
                    action: "add",
                    qFormat: wk.DocumentType,
                    qIsNew: false,
                    qNumberWay: '1',
                    qTemplate: wk.DocumentType,
                    qc: '2',
                    duplicate: true
                }
                OA.common.Paper.setActiveStatus('add');

                var modelName = OA.common.DIMgr.getModelName('wk', wk.DocumentType);
                OA.client.WK.setCurrentModelName(modelName);
                var record = Ext.create(modelName);
                var fields = record.getFields().map['layout'].config.mapping();
                
                //var rs = Ext.clone(record.getProxy().getReader().readRecords(Ext.clone(wk)).getRecords()[0]);
                var normalizedWk = wk.hasOwnProperty('data') ? wk : { data: wk };
                // 使用 normalizedWk 來讀取記錄
                var readResult = record.getProxy().getReader().readRecords(Ext.clone(normalizedWk));
                // 調試並檢查讀取結果
                console.log("readResult:", readResult);
                if (readResult && readResult.getRecords) {
                    var records = readResult.getRecords();
                    if (records.length > 0) {
                        readResult = Ext.clone(records[0]);
                        console.log("rs:", readResult); // 檢查 readResult 是否包含期望數據
                    } else {
                        console.warn("No records found in readResult.");
                    }
                } else {
                    console.error("Failed to read records from wk.");
                }
    

                var oSVG = OA.common.DIMgr.generateSvg(modelName, readResult);
                OA.common.Global.setCurrentViewModel(oSVG.vm);
                var ret = { oSVG: oSVG, fields: fields, record: record };

                //模版
                var vm = OA.common.Global.getCurrentViewModel();
                if (vm.templateUrl) {
                    OA.client.WK.loadTemplate(vm.templateUrl, function (xml) {
                        ret.oSVG.xml = xml;
                        me.getCpaper().createForm(ret.oSVG, ret.fields, function () {
                            me.doNewDocPaper(ret, values);
                        });
                    })
                    return;
                }
                //文稿
                me.getCpaper().create(oSVG, fields, function () {
                    me.doNewDocPaper(ret, values);
                });
            });
        } else {
            var wk = OA.common.Global.getCurrentWKContent();
            var modelName = OA.common.DIMgr.getModelName('wk', wk.DocumentType);
            OA.client.WK.setCurrentModelName(modelName);
            var record = Ext.create(modelName);
            var fields = record.getFields().map['layout'].config.mapping();
            //var rs = Ext.clone(record.getProxy().getReader().readRecords(Ext.clone(wk)).getRecords()[0]);

            var normalizedWk = wk.hasOwnProperty('data') ? wk : { data: wk };
            // 使用 normalizedWk 來讀取記錄
            var readResult = record.getProxy().getReader().readRecords(Ext.clone(normalizedWk));
            // 調試並檢查讀取結果
            console.log("readResult:", readResult);
            if (readResult && readResult.getRecords) {
                var records = readResult.getRecords();
                if (records.length > 0) {
                    readResult = Ext.clone(records[0]);
                    console.log("rs:", readResult); // 檢查 readResult 是否包含期望數據
                } else {
                    console.warn("No records found in readResult.");
                }
            } else {
                console.error("Failed to read records from wk.");
            }
    
            var oSVG = OA.common.DIMgr.generateSvg(modelName, readResult);
            OA.common.Global.setCurrentViewModel(oSVG.vm);
            var ret = { oSVG: oSVG, fields: fields, record: record };

            var values = {
                action: "add",
                qFormat: wk.DocumentType,
                qIsNew: false,
                qNumberWay: '1',
                qTemplate: wk.DocumentType,
                qc: '2',
                duplicate: true,
                ret: ret
            }
            //模版
            var vm = OA.common.Global.getCurrentViewModel();
            if (vm.templateUrl) {
                OA.client.WK.loadTemplate(vm.templateUrl, function (xml) {
                    ret.oSVG.xml = xml;
                    me.getCpaper().createForm(ret.oSVG, ret.fields, function () {
                        me.setIsDuplicate(false);
                        me.onNewDocPaper(null, values);
                    });
                })
                return;
            }
            //文稿
            me.getCpaper().create(oSVG, fields, function () {
                me.setIsDuplicate(false);
                me.onNewDocPaper(null, values);
            });
        }
    },

    /**
     * 文稿切換
     *
     * button.config <OA.common.VIMgr < client.vi < model.VI
     */
    onPaperTaggle: function (container, button, isPressed) {
        var me = this;
        var status = OA.common.Paper.getActiveStatus();
        var paperConfig = button.config; //button.config form OA.common.VIMgr.getFolderItems
        var act = paperConfig.action;
        var qs = OA.common.Global.getQ();
        if (me.getCpaper().getSvgPaper()) me.getCpaper().getSvgPaper().clearSelection(true);
        if (!isPressed) return;
        var isSaved = status && status != 'saved';
        //console.log(act);
        if (act == 'add') {

            //會辦簽稿: 會辦時，無單位簽，自動創會辦意見簽 （同科室只開一張，不同科室判斷是否會畢)
            var isNeedReturn = me.doParallelDraft();
            if (isNeedReturn) return;

            //預先儲存
            if (isSaved) {
                if (qs.app === 'editor' || qs.app === 'offline') {
                    var openFolder = OA.common.FileMgr.getOpenDialogPath();
                    if (!openFolder) {
                        me.onSaveTap(null, true);
                    } else {
                        var saveFolder = OA.common.FileMgr.getSaveFolder();
                        if (saveFolder) me.onSaveTap(null, true);
                    }
                } else {
                    var saveFolder = OA.common.FileMgr.getSaveFolder();
                    if (saveFolder) {
                        //if (isSaved) me.onSaveTap(null, true);  //自動命名
                        me.onSaveTap(null, true);  //自動命名
                    } else {
                        //if (isSaved) me.onSaveTap();
                        //等存檔回來再下一動
                        me.onSaveTap(null, false, function () {
                            Ext.Viewport.setMasked(false);
                            var count = OA.common.DIMgr.getDraftCount();
                            if (count > 61) {
                                me.getSegdoc().setPressedButtons([]);
                                Ext.Msg.alert('提示', '超過最大稿數！');
                                return;
                            }
                            me.getSegdoc().setPressedButtons([]);
                            // OA.common.Funcs.show('FormNewDoc');    //OK -> onNewDocPaper

                            //if (qs.sFlag === 'Y' && qs.isImport === undefined){    //1230  密件公文開啟時顯示訊息視窗   Chloe.sia
                            //    Ext.Msg.alert('提示', '請開啟密件公文舊檔');
                            //}else {


                            OA.common.Funcs.show('FormNewDoc');    //OK -> onNewDocPaper
                            var segItems = me.getSegdoc().getItems().items;
                            if (segItems) {
                                var hasPages = false;
                                Ext.Array.each(segItems, function (seg) {
                                    if (seg.config && seg.config.text) {
                                        if ((seg.config.text + '').indexOf('簽') != -1 ||
                                            (seg.config.text + '').indexOf('稿') != -1 ||
                                            (seg.config.text + '').indexOf('來文') != -1) {
                                            hasPages = true;
                                            return false;
                                        }
                                    }
                                })

                                if (!hasPages) {
                                    console.log('have no pages');
                                    //把殘留文稿畫面刷掉
                                    if (me.getCpaper && me.getCpaper().getSvgPaper) {
                                        var svg = me.getCpaper().getSvgPaper();
                                        if (svg) {
                                            svg.clear();
                                        }
                                    }
                                }
                            }

                            var ctrToolPaper = Ext.getCmp('toolPaper');
                            if (ctrToolPaper) ctrToolPaper.getScrollable().getScroller().scrollToEnd();
                        });
                    }
                }
            } else {
                //新增文稿直接存檔避免wk檔沒有存到
                me.onSaveTap(null, false, function () {
                    Ext.Viewport.setMasked(false);
                    var count = OA.common.DIMgr.getDraftCount();
                    if (count > 61) {
                        me.getSegdoc().setPressedButtons([]);
                        Ext.Msg.alert('提示', '超過最大稿數！');
                        return;
                    }
                    me.getSegdoc().setPressedButtons([]);
                    // OA.common.Funcs.show('FormNewDoc');    //OK -> onNewDocPaper

                    //if (qs.sFlag === 'Y' && qs.isImport === undefined){    //1230  密件公文開啟時顯示訊息視窗   Chloe.sia
                    //    Ext.Msg.alert('提示', '請開啟密件公文舊檔');
                    //}else {


                    OA.common.Funcs.show('FormNewDoc');    //OK -> onNewDocPaper
                    var segItems = me.getSegdoc().getItems().items;
                    if (segItems) {
                        var hasPages = false;
                        Ext.Array.each(segItems, function (seg) {
                            if (seg.config && seg.config.text) {
                                if ((seg.config.text + '').indexOf('簽') != -1 ||
                                    (seg.config.text + '').indexOf('稿') != -1 ||
                                    (seg.config.text + '').indexOf('來文') != -1) {
                                    hasPages = true;
                                    return false;
                                }
                            }
                        })

                        if (!hasPages) {
                            console.log('have no pages');
                            //把殘留文稿畫面刷掉
                            if (me.getCpaper && me.getCpaper().getSvgPaper) {
                                var svg = me.getCpaper().getSvgPaper();
                                if (svg) {
                                    svg.clear();
                                }
                            }
                        }
                    }

                    //}

                    var ctrToolPaper = Ext.getCmp('toolPaper');
                    if (ctrToolPaper) ctrToolPaper.getScrollable().getScroller().scrollToEnd();
                });
            }

            /*
            var count = OA.common.DIMgr.getDraftCount();
            if (count > 61) {
                me.getSegdoc().setPressedButtons([]);
                Ext.Msg.alert('提示', '超過最大稿數！');
                return;
            }
            me.getSegdoc().setPressedButtons([]);
            // OA.common.Funcs.show('FormNewDoc');    //OK -> onNewDocPaper

            //if (qs.sFlag === 'Y' && qs.isImport === undefined){    //1230  密件公文開啟時顯示訊息視窗   Chloe.sia
            //    Ext.Msg.alert('提示', '請開啟密件公文舊檔');
            //}else {


            OA.common.Funcs.show('FormNewDoc');    //OK -> onNewDocPaper
            var segItems = me.getSegdoc().getItems().items;
            if (segItems) {
                var hasPages = false;
                Ext.Array.each(segItems, function (seg) {
                    if (seg.config && seg.config.text) {
                        if ((seg.config.text + '').indexOf('簽') != -1 ||
                            (seg.config.text + '').indexOf('稿') != -1 ||
                            (seg.config.text + '').indexOf('來文') != -1) {
                            hasPages = true;
                            return false;
                        }
                    }
                })

                if (!hasPages) {
                    console.log('have no pages');
                    //把殘留文稿畫面刷掉
                    var svg = this.getCpaper().getSvgPaper();
                    if (svg) {
                        svg.clear();
                    }
                }
            }

            //}

            var ctrToolPaper = Ext.getCmp('toolPaper');
            if (ctrToolPaper) ctrToolPaper.getScrollable().getScroller().scrollToEnd();
            */
        } else if (act == 'procnotes') { //會核單
            OA.common.Global.getApp().getController('OA.controller.Work').onSuggestionNotesTap();
            me.getSegdoc().setPressedButtons([]);
        } else if (act == 'change') {
            if (qs.app == 'editor' || qs.app == 'approve') {  //0707  編輯狀態跟簽核狀態，按下雙箭頭時才要存檔，存檔完再開子視窗  Chloe.sia
                if (qs.app == 'editor') {
                    //me.doSaveFolder({ action: 'save', isNotPopup: true }, function () {
                    Ext.Viewport.setMasked(false);
                    OA.common.Funcs.show('FormPaperChange');
                    //});
                } else {
                    //me.doSave({ action: 'save' }, function () {
                    Ext.Viewport.setMasked(false);
                    OA.common.Funcs.show('FormPaperChange');
                    //});
                }
            } else {
                OA.common.Funcs.show('FormPaperChange');
            }
            me.getSegdoc().setPressedButtons([]);//按鈕復原
        } else if (act === 'del') {//刪除會辦簽
            Ext.Msg.confirm('刪除', '是否刪除會辦簽？', function (fn) {
                if (fn === 'yes') {
                    var current = OA.common.VIMgr.getCurrentEdition();
                    if (current && current.會辦簽稿) {
                        Ext.Array.each(current.會辦簽稿, function (item) {
                            if (!Ext.isArray(item.單位)) {
                                if (item.單位.單位) {
                                    if (!Ext.isArray(item.單位.單位)) {
                                        if (item.單位.單位.目前 === 'Y') {
                                            item.單位.單位.文稿代碼 = '';
                                        }
                                    } else {
                                        Ext.Array.each(item.單位.單位, function (dep) {
                                            if (dep.目前 === 'Y') {
                                                dep.文稿代碼 = '';
                                            }
                                        });
                                    }
                                } else {
                                    if (item.單位) {
                                        if (item.單位.目前 === 'Y') {
                                            item.單位.文稿代碼 = '';
                                        }
                                    } else {
                                        if (item.目前 === 'Y') {
                                            item.文稿代碼 = '';
                                        }
                                    }
                                }
                            } else {
                                Ext.Array.each(item.單位, function (dep) {
                                    if (dep.單位) {
                                        if (dep.單位.目前 === 'Y') {
                                            dep.單位.文稿代碼 = '';
                                        }
                                    } else {
                                        if (dep.目前 === 'Y') {
                                            dep.文稿代碼 = '';
                                        }
                                    }
                                });
                            }
                        });
                        me.saveViReload();
                    }
                }
            });
        } else {
            if (isSaved && status != 'create') { //預先儲存
                var oldParas = Ext.clone(OA.common.Global.getInitParas());
                var current = OA.common.VIMgr.getCurrentEdition();
                var currentVersion = Ext.clone(current.版號);

                // 防呆鎖： 防止使用者太過快速切換頁籤而導致WK遭異常複寫
                if (Ext.getCmp('segDocSelector'))
                    Ext.getCmp('segDocSelector').setDisabled(true);


                me.doSave({ action: 'save' }, function () {
                    me.notReloadUpdateVI(oldParas.paperNo, currentVersion);
                    button.config.version = currentVersion;
                    me.onPaperTaggle(container, button, isPressed);

                    // 防呆鎖： 解鎖定時器
                    setTimeout(function () {
                        if (Ext.getCmp('segDocSelector'))
                            Ext.getCmp('segDocSelector').setDisabled(false);
                        console.log('------unlock------');
                    }, 1000);

                });
                return;
            } else {
                //已經有存檔過了會有isTemp，wk檔要抓存檔後的
                var isTemp = (button.config.isTemp || button.config.isTemp == 'Y');
                if (isTemp) {
                    //button.config.lastVersion = OA.common.VIMgr.getCurrentEdition().版號;
                    button.config.version = OA.common.VIMgr.getCurrentEdition().版號;
                    button.config.lastVersion = OA.common.VIMgr.getCurrentEdition().ParentVersion;
                }
            }

            //切換時，初始化正副本
            var contactStore = Ext.getStore('Contact');
            if (contactStore) contactStore.removeAll();

            var data = {
                paperNo: paperConfig.paperNo,
                paperOrder: paperConfig.paperOrder,
                files: paperConfig.files,
                version: paperConfig.lastVersion + '',
                documentType: paperConfig.form,
                kind: paperConfig.kind,
                sendNo: paperConfig.sendNo
            };

            var qd = OA.common.Global.getQueryDefault();
            if (data.kind == '來文') data.files = OA.common.VIMgr.getFollowFiles();//來文找回原DI
            var btnMode = data.kind == '來文' ? 'docCome' : '';
            Ext.getCmp('oawork').toolEditInit(btnMode);

            OA.common.InitParas.readWK(data);
            var isLocal = qs.app === 'editor' || qs.app === 'offline' || paperConfig.openby == 'local' || qs.sFlag === 'Y';
            if (Ext.os.is.iOS || Ext.os.is.Android) isLocal = false;

            if (isLocal) {
                if (status === 'create') {
                    //if (qs.app !== 'offline') OA.client.Member.doDefaultCaseNo(); //檔號預設
                    if (paperConfig.attachs) me.loadAttachs(paperConfig.attachs); //載入附件及附件計數
                    return;
                }
                me.getCtnPaper().setHidden(false);
                OA.common.FileMgr.load(button.config, function (data) {
                    Ext.Viewport.setMasked(false);
                    var menuLeft = Ext.Viewport.getMenus().left;
                    if (menuLeft) menuLeft.setMasked(true);
                    var nos;
                    var ret = JSON.parse(B64.decode(data));

                    if (paperConfig.openby == 'local') {
                        var docflow = OA.common.Global.getCurrentDocFlowRecord();
                        var sentOrg = Ext.Array.filter(qd.交換資訊.發文機關.機關, function (p) {
                            if (p.預設 == "Y") return true;
                        })[0];

                        var words = [];
                        words[0] = sentOrg.發文字;
                        words[1] = docflow.get('doSno').substring(0, 3);
                        words[2] = docflow.get('doSno').substring(3);
                        words[3] = '';

                        nos = [];
                        nos.push({ Key: "發文字號_字", Value: words[0], tagName: "Property" });
                        nos.push({ Key: "發文字號_年度", Value: words[1], tagName: "Property" });
                        nos.push({ Key: "發文字號_流水號", Value: words[2], tagName: "Property" });
                        nos.push({ Key: "發文字號_支號", Value: words[3], tagName: "Property" });
                        var tagText = OA.common.Utils.getTagText(ret.wkContent, '發文字號');
                        if (tagText) tagText.childNodes = nos;

                        ret.oSVG.vm.發文字號_字_1 = words[0];
                        ret.oSVG.vm.發文字號_年度_1 = words[1];
                        ret.oSVG.vm.發文字號_流水號_1 = words[2];
                        ret.oSVG.vm.發文字號_支號_1 = words[3];
                    }

                    //=> status='' qs.sFlag= undefined
                    //造成存檔後再開啟舊檔 沒有帶入存檔檔號 
                    //增加條件不進去清空檔號及保存年限 !(status === '' && qs.sFlag === undefined) <= joshua kang

                    if (status != 'saved' && qs.sFlag !== 'Y' && !(status === '' && qs.sFlag === undefined)) {
                        //清空檔號及保存年限
                        var fileNoText = OA.common.Utils.getTagText(ret.wkContent, '檔號');
                        if (fileNoText && fileNoText.childNodes) {
                            ret.oSVG.vm.年度 = '';
                            ret.oSVG.vm.分類號 = '';
                            ret.oSVG.vm.案次號 = '';
                            nos = [];
                            nos.push({ Key: "年度", Value: '', tagName: "Property" });
                            nos.push({ Key: "分類號", Value: '', tagName: "Property" });
                            nos.push({ Key: "案次號", Value: '', tagName: "Property" });
                            fileNoText.childNodes = nos;
                        }
                        var fileYearText = OA.common.Utils.getTagText(ret.wkContent, '保存年限');
                        if (fileYearText && fileYearText.childNodes) {
                            ret.oSVG.vm.保存年限 = '';
                            nos = [];
                            nos.push({ Key: "保存年限", Value: '', tagName: "Property" });
                            fileYearText.childNodes = nos;
                        }
                    }

                    //每次取檔必需要重組svg xml
                    var reparseData = OA.common.DIMgr.doWkCommon(ret.wkContent.DocumentType, ret.wkContent);
                    if (reparseData) ret.oSVG.xml = reparseData.oSVG.xml;

                    // ret.oSVG.xml=ret.xml;

                    var modelName = OA.common.DIMgr.getModelName('wk', ret.wkContent.DocumentType);
                    var record = Ext.create(modelName);
                    var fields = record.getFields().map['layout'].config.mapping();
                    ret.fields = fields;
                    ret.initParas = OA.common.Global.getInitParas();
                    me.loadAttachs(paperConfig.attachs);        //載入附件及附件計數

                    me.getCpaper().createByParas(ret, null, function () {
                        if (qs.nextStep) {
                            me.autoGoNextStep(); //自動執行下一步
                        } else {
                            me.getCpaper().clearPaper(true);
                            var openFolder = OA.common.FileMgr.getOpenDialogPath();
                            if (openFolder) {
                                var wk = OA.common.Global.getCurrentWKContent();
                                if (wk) {
                                    var dept = OA.common.Global.getCurrentDept();
                                    var role = OA.common.Global.getCurrentRole();

                                    wk.jobNo = role.jobNo;
                                    wk.doDeptno = dept.doDeptno;
                                    wk.depName = dept.depName;
                                    wk.depNo = dept.depNo;
                                    wk.orgId = dept.orgId;
                                    wk.orgNo = dept.orgNo;
                                }
                            }
                            me.doEditAction('edit');
                        }

                        // if (paperConfig.kind !== '來文' && paperConfig.paperNo == 1) {
                        //     if (!qd.稿面註記) {
                        //         me.doSetDraftTopMark();
                        //     }
                        // }
                    });
                });
                return;
            }

            //get wk version
            var title = me.getToolPaper().getTitle();
            if (title) paperConfig.version = title.getTitle();
            me.loadSuggestion(paperConfig);       //設定文稿批示意見
            me.loadAttachs(paperConfig.attachs);  //載入附件及附件計數
            me.markRead();
            //標示已讀
            //console.log(paperConfig);
            if (qs.app == 'draft') {
                me.loadDraftWKRender(paperConfig);
            } else {
                me.loadWKRender(paperConfig);
            }

        }
        me.getCtnPaper().getScrollable().getScroller().scrollToTop();

        //OA.client.Member.doKeepAlive();//切換文稿重新計算timeOut時間
    },
    /**
     * WK
     */
    loadWKRender: function (options) {
        //console.log(options);
        var me = this;
        var qs = OA.common.Global.getQ();
        var vi = OA.common.VIMgr.getViContent();
        var qd = OA.common.Global.getQueryDefault();
        var isDecision = options.isDecision;
        var isAttHasChange = options.attactHasChange;
        Ext.Viewport.setMasked(true);
        var menuLeft = Ext.Viewport.getMenus().left; //左側nemu                   
        if (menuLeft) menuLeft.setMasked(true);
        //console.log('loadWKRender處理中...');
        if (options.kind == '來文') {
            me.addDecisionDocMark(isDecision, false);//決行文稿註記
        } else {
            me.addDecisionDocMark(isDecision, isAttHasChange);//決行文稿註記
        }
        if (isDecision) {
            me.addApproveSeal(options);
        }

        if (options.kind == '來文' && options.files.length == 0) {
            var comePDF = OA.common.Global.getFollowPdfUrl();
            if (comePDF && comePDF.length > 0) {
                me.getCpaper().subFrameSwitch('showPdfUrl');
                Ext.Viewport.setMasked(false);
                if (menuLeft) menuLeft.setMasked(false);
                me.getCpaper().setHidden(false);
                return;
            }
        }

        OA.client.WK.load(options, function (oSVG, record) {
            //record與目前開啟稿不同，重新復歸文稿按鈕及初始化參數
            var nowBtn = me.getSegdoc().getPressedButtons();
            if (nowBtn && nowBtn[0] && nowBtn[0].config && nowBtn[0].config.paperNo != record.get('paperNo')) {
                var docBtn = me.getSegdoc().getItems().items;
                Ext.Array.each(docBtn, function (btn) {
                    if (btn.config && btn.config.paperNo) {
                        if (record.get('paperNo') == btn.config.paperNo) {
                            me.getSegdoc().setPressedButtons(btn);//按鈕復原
                        }
                    }
                });
                Ext.Array.each(OA.common.Global.getInitParasList(), function (init) {
                    if (init.paperNo == record.get('paperNo') && init.version == record.get('version')) {
                        OA.common.Global.setInitParas(init);//初始化參數復原
                    }
                });
            }

            var isTemp = OA.common.VIMgr.getCurrentEdition().isTemp == 'Y';

            //if (options.kind === '來文') {    //來文便利貼                
            //    options.stickNote = record.get('StickyNote');
            //    var stickNote = options.stickNote;
            //    var stickNoteList = [];
            //    if (stickNote) {
            //        Ext.Array.each(stickNote, function (Note) {
            //            var stick = JSON.parse(xml2json(parseXmlString(Note)));
            //            stickNoteList.push(stick);
            //        });
            //        if (stickNoteList) me.doSticky(stickNoteList);
            //    }
            //}
            if (options.kind === '來文' && record.get('pdf')) {  //來文直接開pdf
                Ext.Viewport.setMasked(false);
                if (menuLeft) menuLeft.setMasked(false);
                me.getCpaper().setHidden(false);
                me.getCpaper().subFrameSwitch('showPdfFile', record);
                me.getCpaper().createByPDF();
                me.getCpaper().hideIndicator();

                var isNotCurrentTemp = options.version !== vi.作業版本 && !isTemp;
                //var isNotShowAction = qs.app === 'check' || isNotCurrentTemp || qs.reOt === 'F';
                //=> 修正複閱畫面如果有來文跟簽稿時，簽稿有按鈕，來文沒完成按鈕。
                //var isNotShowAction = (qs.app === 'check' && isNotCurrentTemp) || (qs.app === 'check' && qs.reOt === 'F');
                //=>

                var isNotShowAction = true;
                //第二關第一次開啟，切換來文後切稿無法增修，要檢查options的lastversion==文號
                //if (options.lastVersion && options.lastVersion == options.doSno) {
                OA.common.VIMgr.getCurrentEdition().isTemp = 'Y';
                //}


                var ctrActions1 = Ext.getCmp('toolActions1');
                var ctrActions2 = Ext.getCmp('toolActions2');
                if (isNotShowAction) {
                    if (ctrActions1) ctrActions1.setHidden(true);
                    if (ctrActions2) ctrActions2.setHidden(true);
                    Ext.getCmp('labBarrier').setHidden(true);
                    if (qs.reOt === 'F' || qs.reOt === 'Y') {//重新發文按鈕權限
                        if (ctrActions1) ctrActions1.setHidden(false);
                        if (ctrActions2) ctrActions2.setHidden(false);
                        Ext.getCmp('labBarrier').setHidden(false);
                    }
                } else {
                    if (ctrActions1) ctrActions1.setHidden(false);
                    Ext.getCmp('labBarrier').setHidden(false);
                    if (ctrActions2 && ctrActions2.items && ctrActions2.items.items && ctrActions2.items.items.length > 0) ctrActions2.setHidden(false);
                }
                return;
            }
            if (!oSVG) { //來文pdf
                Ext.Viewport.setMasked(false);
                if (menuLeft) menuLeft.setMasked(false);
                var file = (record.get('files') && record.get('files').length != 0) ? record.get('files')[0] : [];
                if (file && file.length == 0) {
                    var error = record.get('error');
                    Ext.Viewport.hideMenu('left');
                    if (me.getSuggestion()) me.getSuggestion().setHidden(true);
                    if (record.data.dialogType && record.data.dialogType == '4') {
                        if (record.data.version && record.data.version == '0') {
                            return;
                        }
                    }
                    OA.common.Funcs.show('FormNewDoc', Ext.getCmp('segDocSelector'), true);
                    if (error) console.log(error);
                    return;
                }
                if (file && file.fileType.toUpperCase() === 'PDF') {//來文pdf
                    me.getCpaper().subFrameSwitch('showPdf', record);
                    me.getCpaper().createByPDF();
                } else {
                    me.updateDocAreaHidden('hideAll');
                }
                return;
            }
            me.getCpaper().subFrameSwitch('init');
            if (me.getButZoom()) me.getButZoom().setIconCls('fa-search-plus'); //放大按鈕初始化


            //表單模式
            var isDocForm = me.getDocArea().getActiveItem().config.xtype == 'docForm';

            if (isDocForm) {
                me.getDocForm().create(record.get('layout'));
                OA.common.Funcs.show('FormFields', null, { fields: record.get('layout'), action: 'update' });
                Ext.getCmp('FormFields').hide();
                Ext.getCmp('oawork').toolEditInit('docForm');
                me.loadAttachsCount();  //載入附件及附件計數
                Ext.Viewport.setMasked(false);
                if (menuLeft) menuLeft.setMasked(false);
                return;
            }

            var current = OA.common.VIMgr.getCurrentEdition();
            var wkContent = OA.common.Global.getCurrentWKContent();

            isTemp = current.isTemp == 'Y';
            var isFllow = options.kind == '來文';
            var isNotSign = current.簽核狀態 != 1;
            var isAppAllow = qs.app === 'approve' || qs.app == 'editor' || qs.app === 'draft' || qs.app === 'offline';
            var isFirst = wkContent.isFirst == 1;
            var isSameJobNo = OA.common.Global.getInitParas().jobNo == wkContent.jobNo;
            var isMy = qd && qd.交換資訊 && current.簽核人員.使用者職務代碼 === qd.交換資訊.承辦人.jobNo && options.version == current.版號;

            //第二稿也為wk中第一稿，造成無法進入進修
            if (isAppAllow && isNotSign && isFirst && isSameJobNo) {
                me.getCpaper().setIsClearPaper(true); //清稿
            } else {
                me.getCpaper().setIsClearPaper(false);
                if (options.form && options.form == '會辦簽') me.getCpaper().setIsClearPaper(true);
                //2019.06.27_會辦簽直接清稿，主辦文稿不清
            }

            if (qs.epaper === 'N') me.getCpaper().setIsClearPaper(true);


            //2019/06/05 依台北市政府 列管調整回保留追修版本，不自動清稿
            //回承辦人不追修
            //if (isMy) me.getCpaper().setIsClearPaper(true);

            if (current.版號 + '' == '0') {
                me.getCpaper().setIsClearPaper(true);
            } else {
                if (current.簽核人員 && current.簽核人員.使用者職務代碼 && current.ParentVersion + '' == '0') {
                    if (qd.交換資訊.承辦人.jobNo == current.簽核人員.使用者職務代碼) {
                        me.getCpaper().setIsClearPaper(true);
                    }
                }
            }

            options.isTemp = isTemp;
            options.isFllow = isFllow;
            options.isNotSign = isNotSign;
            options.isAppAllow = isAppAllow;
            options.stickNote = record.get('StickyNote');
            options.overPrint = record.get('OverPrint');
            options.SealTitleAndName = record.get('Sealinfo');
            var vm = OA.common.Global.getCurrentViewModel();
            if (vm && vm.templateUrl) {
                if (options.form == 'LINE訊息紀錄單' && qs.epaper === 'N')
                    vm.templateUrl = 'web/LINEMsgRecordNoSeal.svg'
                OA.client.WK.loadTemplate(vm.templateUrl, function (xml) {
                    oSVG.xml = xml;
                    me.getCpaper().createForm(oSVG, record.get('layout'), function () {
                        me.thenPaperCreate(options);
                    });
                });
                return;
            }

            //文稿模式
            me.getCpaper().create(oSVG, record.get('layout'), function () {
                me.thenPaperCreate(options);
            });

            // 解決行動裝置復閱視窗自動隱藏的問題 - by yi-chi chiu
            if (!Ext.os.is.Desktop) {
                if (qs.app == 'review' || qs.app == 'check') {
                    Ext.getCmp('Suggestion').setHidden(false);
                    Ext.getCmp('oawork').setWidth('80%');
                }
            }

            //非創簽稿且有簽核按鈕下面動作才執行
            if (qs.app !== 'editor' && options.isNotShowAction) return;

            //分會預存
            if (vi) {
                if (vi.簽收) {
                    if (vi.簽收.actionName && vi.簽收.actionName.indexOf('會文') != -1 && isTemp) {
                        //console.log(vi);
                        me.doSave({ action: 'save' }, function () {
                            current.isTemp = 'N';
                            Ext.Viewport.setMasked(false);
                        });
                    }
                }
            }
            if (options.kind !== '來文') {
                me.doLevel();
                //me.doSetDraftTopMark();
            }

            //更新vi
            Ext.Array.each(current.簽核文件夾.文稿, function (paper) {  //0915 各文稿決行層級記錄於VI檔中 Chloe.sia
                //var list = Ext.getCmp('segDocSelector');
                //var selectItems = list.getPressedButtons()[0].config.paperNo;
                if (paper.代碼 == options.paperNo) {
                    paper.決行層級 = vm.決行層級_title;
                    OA.common.VIMgr.editionList(current.版號);
                }
            });
            me.getCpaper().setIsClearPaper(true); //追蹤修訂歷程開啟（自動清稿）
            Ext.Viewport.hideMenu('left');
        });
    },
    loadDraftWKRender: function (options) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var vi = OA.common.VIMgr.getViContent();
        var qd = OA.common.Global.getQueryDefault();
        var wk = OA.common.Global.getCurrentWKContent();

        Ext.Viewport.setMasked(true);
        var menuLeft = Ext.Viewport.getMenus().left; //左側nemu                   
        if (menuLeft) menuLeft.setMasked(true);
        //console.log('loadWKRender處理中...');


        var modelName = OA.common.DIMgr.getModelName('wk', wk.DocumentType);

        var record = Ext.create(modelName);
        var fields = record.getFields().map['layout'].config.mapping();
        record.set('layout', fields);
        // 檢查 wk 是否已包含 data 屬性，如果沒有則包裝成 { data: wk }
        var normalizedWk = wk.hasOwnProperty('data') ? wk : { data: wk };
        // 使用 normalizedWk 來讀取記錄
        var readResult = record.getProxy().getReader().readRecords(Ext.clone(normalizedWk));
        // 調試並檢查讀取結果
        console.log("readResult:", readResult);
        if (readResult && readResult.getRecords) {
            var records = readResult.getRecords();
            if (records.length > 0) {
                readResult = Ext.clone(records[0]);
                console.log("rs:", readResult); // 檢查 readResult 是否包含期望數據
             } else {
                console.warn("No records found in readResult.");
            }
        } else {
            console.error("Failed to read records from wk.");
        }
        var oSVG = OA.common.DIMgr.generateSvg(modelName, readResult);
        oSVG.vm.kind = record.get('kind');
        oSVG.vm.layout = record.get('layout');
        OA.common.Global.setCurrentViewModel(oSVG.vm);
        OA.client.WK.setCurrentModelName(modelName);
        //me.addDecisionDocMark(isDecision);//決行文稿註記
        //if (isDecision) {
        //    me.addApproveSeal(options);
        //}

        //OA.client.WK.load(options, function (oSVG, record) {
        //record與目前開啟稿不同，重新復歸文稿按鈕及初始化參數
        //var nowBtn = me.getSegdoc().getPressedButtons();
        //if (nowBtn && nowBtn[0] && nowBtn[0].config && nowBtn[0].config.paperNo != record.get('paperNo')) {
        //    var docBtn = me.getSegdoc().getItems().items;
        //    Ext.Array.each(docBtn, function (btn) {
        //        if (btn.config && btn.config.paperNo) {
        //            if (record.get('paperNo') == btn.config.paperNo) {
        //                me.getSegdoc().setPressedButtons(btn);//按鈕復原
        //            }
        //        }
        //    });
        //    Ext.Array.each(OA.common.Global.getInitParasList(), function (init) {
        //        if (init.paperNo == record.get('paperNo') && init.version == record.get('version')) {
        //            OA.common.Global.setInitParas(init);//初始化參數復原
        //        }
        //    });
        //}

        var isTemp = OA.common.VIMgr.getCurrentEdition().isTemp == 'Y';

        me.getCpaper().subFrameSwitch('init');
        if (me.getButZoom()) me.getButZoom().setIconCls('fa-search-plus'); //放大按鈕初始化


        //表單模式
        var isDocForm = me.getDocArea().getActiveItem().config.xtype == 'docForm';

        if (isDocForm) {
            me.getDocForm().create(record.get('layout'));
            OA.common.Funcs.show('FormFields', null, { fields: record.get('layout'), action: 'update' });
            Ext.getCmp('FormFields').hide();
            Ext.getCmp('oawork').toolEditInit('docForm');
            me.loadAttachsCount();  //載入附件及附件計數
            Ext.Viewport.setMasked(false);
            if (menuLeft) menuLeft.setMasked(false);
            return;
        }

        var current = OA.common.VIMgr.getCurrentEdition();
        var wkContent = OA.common.Global.getCurrentWKContent();

        isTemp = current.isTemp == 'Y';
        var isFllow = options.kind == '來文';
        var isNotSign = current.簽核狀態 != 1;
        var isAppAllow = qs.app === 'approve' || qs.app == 'editor' || qs.app === 'draft' || qs.app === 'offline';
        var isFirst = wkContent.isFirst == 1;
        var isSameJobNo = OA.common.Global.getInitParas().jobNo == wkContent.jobNo;
        //var isMy = qd && current.簽核人員.使用者職務代碼 === qd.承辦人.jobNo && options.version == current.版號;

        //第二稿也為wk中第一稿，造成無法進入進修
        if (isAppAllow && isNotSign && isFirst && isSameJobNo) {
            me.getCpaper().setIsClearPaper(true); //清稿
        } else {
            me.getCpaper().setIsClearPaper(false);
            if (options.form && options.form == '會辦簽') me.getCpaper().setIsClearPaper(true);
            //2019.06.27_會辦簽直接清稿，主辦文稿不清
        }

        if (qs.epaper === 'N') me.getCpaper().setIsClearPaper(true);


        //2019/06/05 依台北市政府 列管調整回保留追修版本，不自動清稿
        //回承辦人不追修
        //if (isMy) me.getCpaper().setIsClearPaper(true);

        if (current.版號 + '' == '0') {
            me.getCpaper().setIsClearPaper(true);
        } else {
            if (current.簽核人員 && current.簽核人員.使用者職務代碼 && current.ParentVersion + '' == '0') {
                if (qd.交換資訊.承辦人.jobNo == current.簽核人員.使用者職務代碼) {
                    me.getCpaper().setIsClearPaper(true);
                }
            }
        }

        options.isTemp = isTemp;
        options.isFllow = isFllow;
        options.isNotSign = isNotSign;
        options.isAppAllow = isAppAllow;
        //options.stickNote = record.get('StickyNote');
        //options.SealTitleAndName = record.get('Sealinfo');
        var vm = OA.common.Global.getCurrentViewModel();
        if (vm && vm.templateUrl) {
            if (options.form == 'LINE訊息紀錄單' && qs.epaper === 'N')
                vm.templateUrl = 'web/LINEMsgRecordNoSeal.svg'
            OA.client.WK.loadTemplate(vm.templateUrl, function (xml) {
                oSVG.xml = xml;
                me.getCpaper().createForm(oSVG, record.get('layout'), function () {
                    me.thenPaperCreate(options);
                });
            });
            return;
        }

        //文稿模式
        me.getCpaper().create(oSVG, record.get('layout'), function () {
            me.thenPaperCreate(options);
        });

        // 解決行動裝置復閱視窗自動隱藏的問題 - by yi-chi chiu
        if (!Ext.os.is.Desktop) {
            if (qs.app == 'review' || qs.app == 'check') {
                Ext.getCmp('Suggestion').setHidden(false);
                Ext.getCmp('oawork').setWidth('80%');
            }
        }

        //非創簽稿且有簽核按鈕下面動作才執行
        if (qs.app !== 'editor' && options.isNotShowAction) return;

        //分會預存
        if (vi) {
            if (vi.簽收) {
                if (vi.簽收.actionName && vi.簽收.actionName.indexOf('會文') != -1 && isTemp) {
                    //console.log(vi);
                    me.doSave({ action: 'save' }, function () {
                        current.isTemp = 'N';
                        Ext.Viewport.setMasked(false);
                    });
                }
            }
        }
        if (options.kind !== '來文') {
            me.doLevel();
            //me.doSetDraftTopMark();
        }

        //更新vi
        //Ext.Array.each(current.簽核文件夾.文稿, function (paper) {  //0915 各文稿決行層級記錄於VI檔中 Chloe.sia
        //    //var list = Ext.getCmp('segDocSelector');
        //    //var selectItems = list.getPressedButtons()[0].config.paperNo;
        //    if (paper.代碼 == options.paperNo) {
        //        paper.決行層級 = vm.決行層級_title;
        //        OA.common.VIMgr.editionList(current.版號);
        //    }
        //});
        //});
    },

    thenPaperCreate: function (options) {
        var me = this;
        console.log(options)
        var qs = OA.common.Global.getQ();
        var isTemp = options.isTemp;
        var isFllow = options.isFllow;
        var isNotSign = options.isNotSign;
        var isAppAllow = options.isAppAllow;
        var stickNote = options.stickNote;
        var overPrint = options.overPrint;
        var SealTitleAndName = options.SealTitleAndName;
        var isLockDoc = options.isLockDoc;

        var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
        var vi = OA.common.VIMgr.getViContent();
        //var wk = OA.common.Global.getCurrentWKContent();
        var role = OA.common.Global.getCurrentRole();

        var isNotCurrentTemp = options.version !== vi.作業版本 && !isTemp;
        var isNotEdit = !options.isEdit;
        //var isPaperReadOnly = qs.app === 'check' || qs.app === 'review' || isNotCurrentTemp || isNotEdit || isFllow || qs.reOt === 'F' || isLockDoc;
        var isPaperReadOnly = qs.app === 'check' || qs.app === 'review' || isNotCurrentTemp || isNotEdit || isFllow || isLockDoc;
        var isNotShowAction = qs.app === 'check' || qs.reOt === 'F' || options.isNotShowAction;



        var parlDraft = OA.common.Global.getParallelWin(); //from doWinParallel
        if (parlDraft) {
            isPaperReadOnly = true;
            isNotShowAction = true;
            me.addParallelDraftName('cpaper', parlDraft.name);
            Ext.getCmp('zoomRatio').setValue(parlDraft.zoom);
        }

        if (options.kind == '來文') {
            isNotShowAction = true;
        }

        if (qs.app == 'draft') {
            isPaperReadOnly = false;
            isNotShowAction = false;
        }

        me.getCpaper().showIndicator();  //文稿強制開拉霸

        var ctrActions = Ext.getCmp('toolActions');
        var ctrActions1 = Ext.getCmp('toolActions1');
        var ctrActions2 = Ext.getCmp('toolActions2');

        if (isNotShowAction) {
            if (ctrActions1) ctrActions1.setHidden(true);
            if (ctrActions2) ctrActions2.setHidden(true);
            // Ext.getCmp('labBarrier').setHidden(true);
            if (qs.dialogType == '4') {
                me.updateDocAreaHidden('readOnly', 'open');
            } else if (qs.reOt === 'F' || qs.reOt === 'Y') {//重新發文按鈕權限
                if (ctrActions1) ctrActions1.setHidden(false);
                if (ctrActions2) ctrActions2.setHidden(false);
                Ext.getCmp('labBarrier').setHidden(false);
                me.updateDocAreaHidden('readOnly', 'close');
            } else {
                me.updateDocAreaHidden('readOnly', 'close');
            }
        } else {
            if (ctrActions1) ctrActions1.setHidden(false);
            if (Ext.getCmp('labBarrier')) Ext.getCmp('labBarrier').setHidden(false);
            if (ctrActions2 && ctrActions2.items && ctrActions2.items.items && ctrActions2.items.items.length > 0) ctrActions2.setHidden(false);
            me.updateDocAreaHidden('readOnly', 'open');
        }
        if (me.getSuggestionText()) {
            //console.log(options);
            var isReadOnly = !options.isSuggest;
            me.getSuggestionText().setReadOnly(isReadOnly);
            if (isReadOnly) Ext.getCmp('suggestionClear').setHidden(true);
            // if (isReadOnly) Ext.getCmp('labBarrier').setHidden(true);
        }

        me.doSticky(stickNote); //便利貼
        me.doOverPrint(overPrint); //套印資料
        me.doseal(SealTitleAndName); //職名章
        OA.common.Paper.main().stickyZoom();
        OA.common.Paper.setActiveStatus('saved');
        //已決行文稿鎖定清稿按鈕
        if (ctrActions && ctrActions.items && ctrActions.items.items) {
            Ext.Array.each(ctrActions.items.items, function (btn) {
                if (['清稿', '編輯'].indexOf(btn.getText()) != -1) {
                    isLockDoc ? btn.setDisabled(true) : btn.setDisabled(false);
                }
            });
        }
        if (ctrActions1 && ctrActions1.items && ctrActions1.items.items) {
            Ext.Array.each(ctrActions1.items.items, function (btn) {
                if (['清稿', '編輯'].indexOf(btn.getText()) != -1) {
                    isLockDoc ? btn.setDisabled(true) : btn.setDisabled(false);
                }
            });
        }
        if (ctrActions2 && ctrActions2.items && ctrActions2.items.items) {
            Ext.Array.each(ctrActions2.items.items, function (btn) {
                if (['清稿', '編輯'].indexOf(btn.getText()) != -1) {
                    isLockDoc ? btn.setDisabled(true) : btn.setDisabled(false);
                }
            });
        }



        if (isPaperReadOnly) { //會辦文稿鎖定
            var svg = me.getCpaper().getSvgPaper();
            if (isLockDoc || isLockDoc == undefined) {
                if (svg) svg.setMode('select');//文稿 已決行文稿可以圈選
                me.getCpaper().setIsLockPaper(true);
            } else {
                if (svg) svg.setMode('touch');//文稿
                me.getCpaper().setIsLockPaper(false);
            }
            Ext.Viewport.setMasked(false);
            if (menuLeft) menuLeft.setMasked(false);
            me.getCpaper().setIsFieldEdit(false);//欄位按鈕鎖定
            //來文可夾附件
            if (isFllow && qs.app !== 'check' && qs.app !== 'review') me.getCpaper().setIsFieldEdit(true);
            return;
        } else {
            me.getCpaper().setIsFieldEdit(true);
            me.getCpaper().setIsLockPaper(false);
        }

        if (qs.reOt === 'F') {
            if (role && role.roleId == '02') {
                if (svg) svg.setMode('select');//文稿 已決行文稿可以圈選
                me.getCpaper().setIsLockPaper(true);
            } else {
                me.getCpaper().setIsFieldEdit(true);
                me.getCpaper().setIsLockPaper(true);
            }
        }

        //會辦單位目前開啟是會辦簽
        var edition = OA.common.VIMgr.getCurrentEdition();
        if (edition) {
            if (edition.簽核人員 && edition.簽核人員.是否會辦 && edition.簽核人員.是否會辦 == '是') {
                var init = OA.common.Global.getInitParas();
                if (init && init.documentType == '會辦簽') me.getCpaper().setIsFieldEdit(true);//欄位
            }
        }

        if (isNotSign && isAppAllow) {
            var editAction = (me.getCpaper().getIsClearPaper()) ? 'clear' : 'edit';
            me.doEditAction(editAction);
        } else {
            me.updateDocAreaHidden('read');
        }
        me.doCaseNo();

        if (options.kind !== '來文') {
            me.doLevel();
        }

        if (OA.common.Paper.main()) OA.common.Paper.main().doGrid();   //處理表單
        Ext.Viewport.setMasked(false);
        if (menuLeft) menuLeft.setMasked(false);
        //me.doAutoSaveStart() //自動儲存
        me.autoGoNextStep(); //自動執行下一步

        if (me.getIsDuplicate()) me.duplicatePaper();     //建立複本

    },

    notReloadUpdateVI: function (paperNo, currentVersion) {
        var me = this;
        var current = OA.common.VIMgr.getCurrentEdition();
        var lastPressedItem = me.getSegdoc().getItems().items.where("( el, i, res, param ) => el.config.paperNo==" + paperNo)[0];
        if (!lastPressedItem) return;

        delete current.isTemp;
        lastPressedItem.config.isClearWK = false;

        lastPressedItem.config.lastVersion = currentVersion;

        var papers = current.簽核文件夾.文稿;
        if (papers && !papers.length) papers = [papers];
        var paper = papers.where("( el, i, res, param ) => el.代碼==" + paperNo)[0];
        if (paper) {
            lastPressedItem.config.suggestContent = paper.批示意見.content;
            lastPressedItem.config.suggestLastTime = paper.批示意見.lastTime;
        }

        // pressedItem.config.version =currentVersion;
        // pressedItem.config.files = [{
        //     fileKey: '',
        //     fileName: src,
        //     folderName: '',
        //     fileType: f.檔案格式.toUpperCase(),
        //     fileContent: null
        // }];
    },
    doAutoSaveStart: function () {
        var me = this;
        OA.client.WK.autoSaveStart(function () {
            me.doSaveFolder({ action: 'save', isNotPopup: true });
        });
    },
    markRead: function () {
        var me = this;
        var but = this.getSegdoc().getPressedButtons()[0];
        if (!but) return;
        but.config.isRead = true;
        but.setUi('confirm');

        var initParas = OA.common.Global.getInitParas();
        var key = initParas.jobNo + '-' + initParas.doDeptno + '-' + initParas.doSno + '-' + initParas.version;
        if (!sessionStorage) return;

        var item = sessionStorage.getItem(key) || '';
        var list = item.split(',');
        var paperNo = initParas.paperNo + '';
        var isSame = list.indexOf(paperNo) >= 0;
        if (!isSame) list.push(paperNo);
        var value = list.join(',');
        sessionStorage.setItem(key, value);

        Ext.Array.each(me.getSegdoc().getItems().items, function (button) {
            var isPaper = typeof button.config.paperNo !== 'undefined';
            if (isPaper) {
                var isDecision = button.config.isDecision; //已決直接標示已讀
                var pNo = button.config.paperNo + '';
                if (list.indexOf(pNo) >= 0 || isDecision) {
                    button.config.isRead = true;
                    button.setUi('confirm');
                }
            }
        });
    },
    /**
     * 便利貼
     */
    stickyInit: function () {
        var me = this;
        var store = Ext.getStore('Sticky');
        var parent = me.getCpaper().up('container');
        var u = OA.common.Global.getCurrentUser();
        // 判斷已存檔功能 - by yi-chi chiu
        var sizeFlag = {};
        store.on('addrecords', function (stickyStore, records, eOpts) {
            // var isNotEdit = me.getButSave() && me.getButSave().getDisabled();
            // console.log(isNotEdit);
            //var ratio = me.getCpaper().getSvgPaper().getZoom();
            // 2019/12/27 來文便利貼StickyNote按鈕，getSvgPaper()帶入ratio
            var ratio = 0.938640873015873;
            if (me.getCpaper().getSvgPaper()) {
                ratio = me.getCpaper().getSvgPaper().getZoom();
            }
            Ext.Array.forEach(records, function (record) {
                var ctrPaper = Ext.getCmp(record.get('byControl')) || me.getCpaper();
                parent = ctrPaper.up('container');
                var _y = parseInt(record.get('positionY'));
                var _x = parseInt(record.get('positionX'));
                var _w = parseInt(record.get('width'));
                var _h = parseInt(record.get('height'));

                var color = '#fcf997';
                var tpls = [];
                tpls.push('<div><h2>{jobName} {empName} ');
                tpls.push('<button class="sticky-button" aria-label="Close Account Info Modal Box">X</button>');
                //tpls.push('<button class="sticky-button-word">詞</button>');
                // 便利貼複製文字功能 - by yi-chi chiu
                tpls.push('<button class="sticky-button-copy">複製文字</button>');
                tpls.push('</h2>');
                var _textarea = Ext.String.format('<textarea  placeholder="請輸入內容" style="background-color:{0};" >', color);
                tpls.push(_textarea);
                tpls.push('{text}</textarea>');
                tpls.push('<br/>');
                tpls.push('<div class="sticky-time">{lastUpdateTime}</div>');
                tpls.push('</div>');

                var floatingPanel = Ext.create('Ext.Container', {
                    id: record.id + '-stricky',
                    top: _y,
                    left: _x,
                    floating: true,
                    tpl: tpls.join(''),
                    style: 'background-color: ' + color + ';',
                    cls: 'sticky',
                    data: record.data,
                    draggable: {
                        constraint: '',
                        direction: 'both',
                        listeners: {
                            dragstart: {
                                fn: function (utilDraggable, e, offsetX, offsetY, eOpts) {
                                    var init = OA.common.Global.getInitParas();
                                    var parent = me.getCpaper().up('container');
                                    if (init && init.kind == '來文') {
                                        parent.getScrollable().getScroller().setDisabled(true);
                                    } else {
                                        parent.getScrollable().getScroller().setDisabled(true);
                                        if (e.target.tagName === 'TEXTAREA') return false;
                                    }
                                },
                                order: 'before'
                            },
                            dragend: function (utilDraggable, e, offsetX, offsetY, eOpts) {
                                var parent = me.getCpaper().up('container');
                                parent.getScrollable().getScroller().setDisabled(false);
                                record.set('positionY', _y + (offsetY / ratio));
                                record.set('positionX', _x + (offsetX / ratio));
                                // 判斷已存檔功能 - by yi-chi chiu
                                OA.app.isSavedFlag = false;
                            }
                        }
                    },
                    listeners: [
                        {
                            element: 'element',
                            event: 'tap',
                            fn: function (ctr) {
                                Ext.getCmp('cpaper').setIsSuggestionIn(false);
                                if (ctr.target.className == 'sticky-button') {
                                    store.remove(record);
                                    // 判斷已存檔功能 - by yi-chi chiu
                                    OA.app.isSavedFlag = false;
                                } else if (ctr.target.className == 'sticky-button-word') {
                                    OA.common.Funcs.show('FormThesaurus', null, record.id + '-stricky');
                                } else if (ctr.target.className == 'sticky-button-copy') {
                                    var item = ctrPaper.down('#' + record.id + '-stricky');
                                    $('#' + record.id + '-stricky').focus();
                                    item.bodyElement.dom.querySelector('textarea').focus();
                                    item.bodyElement.dom.querySelector('textarea').select();
                                    document.execCommand("Copy");
                                    var clipboard = document.querySelector('#clipboardtextarea');
                                    if (!clipboard) {
                                        clipboard = document.createElement("textarea");
                                        clipboard.id = 'clipboardtextarea';
                                        clipboard.style.position = "fixed";
                                        // Prevent scrolling to bottom of page in MS Edge.
                                        document.body.appendChild(clipboard);
                                    }
                                    clipboard.value = window.getSelection();
                                    Ext.Msg.alert("提示: ", "複製便利貼內容成功!");
                                }
                            }
                        },
                        {
                            element: 'element',
                            event: 'resize',
                            fn: function (element) {
                                record.set('width', element.getWidth(true) - 7);
                                record.set('height', element.getHeight(true) - 40);
                                // 判斷已存檔功能 - by yi-chi chiu
                                if (sizeFlag[record.id + '-stricky'])
                                    OA.app.isSavedFlag = false;
                                sizeFlag[record.id + '-stricky'] = true;
                            }
                        },
                        {
                            delegate: 'textarea',
                            element: 'element',
                            event: 'input',
                            fn: function (ctr, dom) {
                                record.set('text', dom.value);
                            }
                        }
                    ]
                });
                ctrPaper.add(floatingPanel);

                var textarea = floatingPanel.element.dom.querySelector('textarea');
                if (textarea) {
                    $(textarea).width(_w);
                    $(textarea).height(_h);
                    // 判斷已存檔功能 - by yi-chi chiu
                    sizeFlag[record.id + '-stricky'] = false;
                }


                if (u.empNo != record.getData().empNo) { //0409 便利貼要是使用者自己才能刪除 Chloe.sia
                    $('.sticky-button').hide();
                }

            });
        });
        store.on('removerecords', function (stickyStore, records, indices, eOpts) {
            Ext.Array.forEach(records, function (record) {
                var ctrPaper = Ext.getCmp(record.get('byControl')) || me.getCpaper();
                var item = ctrPaper.down('#' + record.id + '-stricky');
                ctrPaper.remove(item);
            });
        });
    },
    /**
     * 便利貼
     */
    doSticky: function (data) {
        var store = Ext.getStore('Sticky');
        store.each(function (item, index, length) {
            store.remove(item);
        });
        if (data) store.add(data);
    },
    /**
    * 套印資料
    */
    doOverPrint: function (data) {
        var store = Ext.getStore('OverPrint');
        store.each(function (item, index, length) {
            store.remove(item);
        });
        if (data) store.add(data);
    },
    /**
     * 職名章
     */
    SealInit: function () {
        var me = this;
        var qs = OA.common.Global.getQ();
        var store = Ext.getStore('Sealinfo');
        var parent = me.getCpaper().up('container');
        var u = OA.common.Global.getCurrentUser();
        var previewMode = me.getCpaper().getPreviewMode() || '';
        // 判斷已存檔功能 - by yi-chi chiu
        var sizeFlag = {};
        store.on('addrecords', function (SealStore, records, eOpts) {
            // var ratio = 1.2095238095238094;
            if (records[0].dirty) return;
            if (me.getCpaper().getSvgPaper()) {
                ratio = me.getCpaper().getSvgPaper().getZoom();
            }
            Ext.Array.forEach(records, function (record) {
                //console.log(record);
                record.getData().emptitle = (record.getData().emptitle) ? record.getData().emptitle : '';
                var page = Math.ceil(record.getData().positiony / 1122.52);

                var ctrPaper = Ext.getCmp(record.get('byControl')) || me.getCpaper();
                parent = ctrPaper.up('container');

                //var _y = parseInt(record.get('positiony'));
                //var _x = parseInt(record.get('positionx'));
                // var _w = parseInt(record.get('width'));
                // var _h = parseInt(record.get('height'));

                var svg = ctrPaper.getSvgPaper();
                var ratio = 1;
                if (svg) {
                    ratio = svg.getZoom();
                }
                //console.log(ratio);


                var _y = parseInt(record.get('positiony')) * ratio;
                if (svg) {
                    var elemUnitTitle = svg.getElem('會辦單位_title');
                    if (elemUnitTitle) {
                        var unit_y = parseInt(elemUnitTitle.getAttribute('y'));
                        if (!record.get('sealdiffH')) {
                            _y = unit_y
                            record.set('positiony', _y);
                            record.set('sealdiffH', 0);
                            record.set('olddiffH', 0);
                        } else {
                            _y = unit_y + parseInt(Ext.clone(record.get('sealdiffH')));
                            record.set('olddiffH', parseInt(Ext.clone(record.get('sealdiffH'))));
                            record.set('sealdiffH', 0);
                            //OA.common.Utils.addLine('green', _y, 'green');
                        }
                    }
                }

                _y = _y * ratio;
                //console.log(_y)
                var _x = parseInt(record.get('positionx')) * ratio;
                var _h = 24 * ratio;
                var _w = 112 * ratio;

                var color = '#ffffff';
                var tpls = [];
                tpls.push('<div class="seal" style="width: 100%">'
                    + '<img id="Sealinfoimg-' + record.id + '" src="' + record.get('content') + '" width="' + _w + 'px" height="' + _h + 'px" >');

                var lastUpdateTime = record.get('lastUpdateTime');
                var dt = lastUpdateTime.split(' ');
                var d = dt[0].split('/')[1] + dt[0].split('/')[2];
                var t = dt[1].split(':')[0] + dt[1].split(':')[1];
                tpls.push('<div class="seal-time" >' + d + '<br>' + t + '</div>');  //日期時間

                if (previewMode !== "Draft" && qs.app !== 'check') {
                    tpls.push('<button class="seal-button" style="margin-left: 5px; position: relative; top: -23px; " aria-label="Close Account Info Modal Box">X</button>'); //叉叉
                }

                tpls.push('<br/>');

                tpls.push('</div>');

                if (previewMode == "Draft" || qs.app == 'check') {
                    var floatingPanel = Ext.create('Ext.Container', {
                        id: record.id,
                        top: _y,
                        left: _x,
                        floating: true,
                        tpl: tpls.join(''),
                        style: 'background-color: ' + color + ';',
                        cls: 'Seal',
                        data: record.data
                    });
                    ctrPaper.add(floatingPanel);
                    return true;
                } else {
                    var floatingPanel = Ext.create('Ext.Container', {
                        id: record.id,
                        top: _y,
                        left: _x,
                        floating: true,
                        tpl: tpls.join(''),
                        style: 'background-color: ' + color + ';',
                        cls: 'Seal',
                        data: record.data,
                        draggable: {
                            constraint: '',
                            direction: 'both',
                            listeners: {
                                dragstart: {
                                    fn: function (utilDraggable, e, offsetX, offsetY, eOpts) {
                                        var init = OA.common.Global.getInitParas();
                                        var parent = me.getCpaper().up('container');
                                        if (init && init.kind == '來文') {
                                            parent.getScrollable().getScroller().setDisabled(true);
                                        } else {
                                            parent.getScrollable().getScroller().setDisabled(true);
                                            if (e.target.tagName === 'TEXTAREA') return false;
                                        }
                                    },
                                    order: 'before'
                                },
                                dragend: function (utilDraggable, e, offsetX, offsetY, eOpts) {
                                    var parent = me.getCpaper().up('container');
                                    parent.getScrollable().getScroller().setDisabled(false);

                                    record.set('positiony', (_y + offsetY));
                                    record.set('positionx', (_x + offsetX));

                                    var elemUnitTitle = svg.getElem('會辦單位_title');
                                    if (elemUnitTitle) {
                                        var unit_y = parseInt(elemUnitTitle.getAttribute('y'));
                                        var olddeffH = parseInt(Ext.clone(record.get('olddiffH')));
                                        var move_y = unit_y + offsetY + olddeffH;
                                        //OA.common.Utils.addLine('yUnitTitle', move_y, 'blue');
                                        record.set('positiony', move_y);
                                        record.set('sealdiffH', offsetY);
                                        //console.log(record.get('sealdiffH'));
                                    }

                                    var rect1 = $("#" + record.id)[0].getBoundingClientRect();
                                    var rect2 = $("#gSeal")[0].getBoundingClientRect();

                                    if (rect2.top - rect1.y <= 0 && rect2.bottom - rect1.y >= 0 && rect2.left - rect1.x <= 0 && rect2.right - rect1.x >= 0) {
                                        record.set('sealinside', 0);
                                        record.set('sealoutside', rect2.bottom - rect2.top);
                                        record.set('domposition', rect1.y - rect2.y);
                                    } else {
                                        record.set('sealinside', 1);
                                    }

                                    var t1 = []
                                    t1 = OA.common.Global.getApproveSeal();
                                    for (var i = 0; i < t1.length; i++) {
                                        if (t1[i].sealid == record.id) {
                                            t1[i] = record;
                                            OA.common.Global.setApproveSeal(t1);
                                        }
                                    }
                                    // 判斷已存檔功能 - by yi-chi chiu
                                    OA.app.isSavedFlag = false;
                                }
                            }
                        },
                        listeners: [
                            {
                                element: 'element',
                                event: 'tap',
                                fn: function (ctr) {
                                    Ext.getCmp('cpaper').setIsSuggestionIn(false);
                                    if (ctr.target.className == 'seal-button') {
                                        var u = OA.common.Global.getCurrentUser();

                                        if (u.empNo == record.getData().empno) { //0409 職名章要是使用者自己才能刪除 Chloe.sia
                                            store.remove(record);
                                        }


                                        // 判斷已存檔功能 - by yi-chi chiu
                                        OA.app.isSavedFlag = false;
                                    }
                                }
                            },
                            {
                                element: 'element',
                                event: 'resize',
                                fn: function (element) {
                                    // count++
                                    record.set('width', element.getWidth(true) - 7);
                                    record.set('height', element.getHeight(true) - 40);
                                    // 判斷已存檔功能 - by yi-chi chiu
                                    if (sizeFlag[record.id])
                                        OA.app.isSavedFlag = false;
                                    sizeFlag[record.id] = true;
                                }
                            },
                        ]
                    });
                    ctrPaper.add(floatingPanel);
                }

                record.sealid = record.id;

                /*用不到
                var t2 = [];
                if(OA.common.Global.getApproveSeal()==''){
                    t2.push(record)
                    OA.common.Global.setApproveSeal(t2);
                }else if(OA.common.Global.getApproveSeal()!=''){
                    t2 =OA.common.Global.getApproveSeal()
                    t2.push(record)
                    OA.common.Global.setApproveSeal(t2);
                }
                */

                //console.log(u.empNo);
                //console.log(record.getData().empno);
                if (u.empNo != record.getData().empno) { //0409 職名章要是使用者自己才能刪除 Chloe.sia
                    $('.seal-button').hide();
                }

            });

        });
        store.on('removerecords', function (SealStore, records, indices, eOpts) {
            Ext.Array.forEach(records, function (record) {
                var ctrPaper = Ext.getCmp(record.get('byControl')) || me.getCpaper();
                var item = ctrPaper.down('#' + record.id);
                ctrPaper.remove(item);

                /*
                var t1 =[]
                t1=OA.common.Global.getApproveSeal();
                for(var i =0;i<t1.length;i++){
                    if(t1[i].sealid == record.id){
                        t1.splice(i, 1);
                        OA.common.Global.setApproveSeal(t1);
                    }
                }
                */

            });
        });
    },
    /**
     * 職名章
     */
    doseal: function (data) {
        //console.log(data);
        var store = Ext.getStore('Sealinfo');
        store.each(function (item, index, length) {
            store.remove(item);
        });
        if (data) store.add(data);
    },
    /**
     * 更新檔號
     */
    doCaseNo: function (data) {
        var vm = OA.common.Global.getCurrentViewModel();

        var qd = OA.common.Global.getQueryDefault();
        if (qd.交換資訊.檔號 && qd.交換資訊.檔號.fsKindno) {
            vm.年度 = qd.交換資訊.檔號.fsYear || '';
            vm.分類號 = qd.交換資訊.檔號.fsKindno || '';
            vm.保存年限 = qd.交換資訊.檔號.fsYrlimit || '';
            vm.案次號 = qd.交換資訊.檔號.caseno || '';
            var arr = [];
            arr.push(vm.年度);
            arr.push(vm.分類號);
            if (vm.案次號) arr.push(vm.案次號);
            if (vm.目次號) arr.push(vm.目次號);
            vm.檔號 = arr.join('/');
        }

        //年度號要去前一個0
        if (vm.年度 && vm.年度.length > 3)
            vm.年度 = vm.年度.substring(1, 4);

        var values = {
            年度: vm.年度,
            分類號: vm.分類號,
            保存年限: vm.保存年限,
            案次號: vm.案次號
        }
        if (vm.目次號) values.目次號 = vm.目次號;
        if (OA.common.Paper.main()) OA.common.Paper.main().updateFileYear(values);
    },
    /**
     * 更新決行層級、級別(處理級別)
     */
    doLevel: function (checkChange) {
        var wk = OA.common.Global.getCurrentWKContent();
        var qd = OA.common.Global.getQueryDefault();
        if (wk && qd && qd.交換資訊) {
            if (qd.交換資訊.稿面註記 == undefined || checkChange == true) {
                var DraftTopMark = ['稿面註記', '應用限制', '擬辦方式', '其他擬辦', '分層負責', '處理級別', '決行層級'];
                var Value = {
                    其他擬辦: '',
                    分層負責_title: '',
                    應用限制_title: '',
                    擬辦方式_title: '',
                    決行層級_title: '',
                    稿面註記_title: '',
                    處理級別_title: '',
                };
                var hasLayer = false;
                Ext.Array.each(DraftTopMark, function (item) {
                    var tagText = OA.common.Utils.getTagText(wk, item);
                    if (tagText) {
                        Ext.Array.each(tagText.childNodes, function (n3) {
                            if (n3.Key == item) {
                                var title = item == '其他擬辦' ? item : item + '_title';
                                if (Value[title] != undefined) Value[title] = n3.Value
                                if (item == '分層負責') hasLayer = true;
                            } else if (n3.Key == '分層負責' && !hasLayer) {
                                Value['分層負責_title'] = n3.Value;
                            }

                            if (n3.Key == '決行層級') {
                                if (n3.Value == '-1') {
                                    Value['決行層級_title'] = '一層決行';
                                } else if (n3.Value == '-2') {
                                    Value['決行層級_title'] = '二層決行';
                                } else if (n3.Value == '-3') {
                                    Value['決行層級_title'] = '三層決行';
                                } else if (n3.Value == '-4') {
                                    Value['決行層級_title'] = '四層決行';
                                }
                            }
                        });
                    }
                });
                qd.交換資訊.稿面註記 = Value;
                OA.common.Global.setQueryDefault(qd);

            }
            else {
                var lvlv = qd.交換資訊.稿面註記.決行層級_title
                if (lvlv == -1) {
                    qd.交換資訊.稿面註記.決行層級_title = '一層決行';
                } else if (lvlv == -2) {
                    qd.交換資訊.稿面註記.決行層級_title = '二層決行';
                } else if (lvlv == -3) {
                    qd.交換資訊.稿面註記.決行層級_title = '三層決行';
                } else if (lvlv == -4) {
                    qd.稿面註記.決行層級_title = '四層決行';
                }
            }
            if (OA.common.Paper.main()) {
                OA.common.Paper.main().updateLevel(qd.交換資訊.稿面註記);
            }

            var wkType = OA.common.Global.getCurrentWKContent().DocumentType;
            if (wkType == '簽' || wkType == '簡簽' || wkType == '便簽' || wkType == '上行簽') {
                OA.common.Paper.main().updateUrgencyLevels();    //更新 級別(處理級別)
            }
        }
    },
    /**
     *  拼排視窗
     */
    doWinParallel: function (options) {
        var me = this;
        if (this.getSuggestion()) this.getSuggestion().setHidden(true);

        if (options.isWinOpen) {
            Ext.Viewport.hideMenu('left');
            var winOpen = window.open('../oa/index.html?app=check&dialogType=3&showType=open', "", "_blank");

            winOpen.addEventListener('resize', function (event) {
            }, true);

            winOpen.onresize = function (event) {
                var subFrame = winOpen.document.getElementById('subFrame');
                if (subFrame) {
                    if (winOpen.innerHeight && winOpen.innerWidth) {
                        subFrame.width = winOpen.innerWidth;
                        subFrame.height = winOpen.innerHeight;
                    }
                }
            };

            window.getCurrentUser = function () {
                var initParas = OA.common.Global.getInitParas();
                var paras = Ext.apply({}, initParas);
                paras.version = options.lastVersion + '';
                paras.parallelWin = {
                    name: options.text,
                    paperNo: options.paperNo,
                    zoom: Ext.getCmp('zoomRatio').getValue()
                }
                return paras;
            };
            return;
        }

        this.getOawork().showParallel();
        var oldInitParas = Ext.clone(OA.common.Global.getInitParas());
        var oldVM = Ext.clone(OA.common.Global.getCurrentViewModel());
        var oldWK = Ext.clone(OA.common.Global.getCurrentWKContent());
        var data = {
            paperNo: options.paperNo,
            files: options.files,
            version: options.lastVersion + '',
            documentType: options.form,
            kind: options.kind
        };
        var paras = OA.common.InitParas.readWK(data);

        var qs = OA.common.Global.getQ();
        if (qs.app === 'editor' || qs.app === 'offline') {
            OA.common.FileMgr.load(paras, function (data) {

                var ret = '';
                if (qs.app === 'offline') {
                    ret = JSON.parse(data);
                } else {
                    data = JSON.parse(B64.decode(data));
                }

                var modelName = OA.common.DIMgr.getModelName('wk', ret.wkContent.DocumentType);
                var record = Ext.create(modelName);
                var fields = record.getFields().map['layout'].config.mapping();
                ret.fields = fields;
                ret.initParas = OA.common.Global.getInitParas();
                Ext.getCmp('cpaper2').create(ret.oSVG, fields);
                OA.common.Paper.main().editActions().zoom();
                OA.common.Global.setInitParas(oldInitParas);
            });

            return;
        }

        var notes = [];
        var store = Ext.getStore('Sticky');
        store.each(function (r) {
            var item = Ext.clone(r.data);
            delete item.id;
            notes.push(item);
        });

        function revertValue() {
            OA.common.Paper.main().createByPDF();
            OA.common.Paper.main().editActions().zoom();
            OA.common.Global.setInitParas(oldInitParas);
            OA.common.Global.setCurrentViewModel(oldVM);
            OA.common.Global.setCurrentWKContent(oldWK);

            OA.common.Paper.main().setIsClearPaper(true);
        }

        OA.common.Paper.main().setIsClearPaper(false);
        OA.client.WK.load(options, function (oSVG, record) {
            var fields = record.get('layout');

            var r = OA.common.Global.getCurrentDocFlowRecord();
            me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r);
            //0211併列刷新以及併列字體顏色顯示，留下校搞紀錄

            var ctnPaper2, ctnIframe;
            var ctns = Ext.ComponentQuery.query('#cpaper2 > container');
            Ext.Array.each(ctns, function (ctn) {
                var html = ctn.getHtml() || '';
                var hasIframe = html.substring(0, 7) == '<iframe';
                if (hasIframe) {
                    ctnIframe = ctn;
                } else {
                    ctnPaper2 = ctn;
                }
            });

            if (options.kind === '來文' && record.get('pdf')) {  //來文直接開pdf
                ctnIframe.setHidden(false);
                ctnPaper2.setHidden(true);
                var frame = ctnIframe.innerHtmlElement.dom.firstChild;
                OA.common.Paper.main().subFrameSwitch('showPdfFile', record, frame);
                revertValue();
                return;
            }

            ctnIframe.setHidden(true);
            ctnPaper2.setHidden(false);
            Ext.getCmp('cpaper2').create(oSVG, fields, function () {
                me.addParallelDraftName('cpaper2', options.text);
                var stickyNote = record.get('StickyNote');
                Ext.Array.each(stickyNote, function (note) {
                    var newNote = { byControl: 'cpaper2' };
                    Ext.apply(newNote, note);
                    delete newNote.id;
                    notes.push(newNote);
                });
                me.doSticky(notes);
                revertValue();
            });
        });
    },
    addParallelDraftName: function (ctrName, name) {
        var c2 = Ext.getCmp(ctrName).up('container').up('container');
        var lab = Ext.getCmp('labParallelDraftName');
        if (lab) {
            lab.setHtml('<span class="label label-primary" style="background: yellow;font-size:20px;padding:5px">' + name + '</span>');
        } else {
            c2.add(
                {
                    id: 'labParallelDraftName',
                    xtype: 'label',
                    html: '<span class="label label-primary" style="background: yellow;font-size:20px;padding:5px">' + name + '</span>',
                    style: 'font-size:20px',
                    top: 5,
                    right: 5
                }
            )
        }
    },
    /**
     *  清稿WK
     */
    doClearWK: function (callback) {
        var wk = OA.common.Global.getCurrentWKContent();
        var me = this;

        var svg = me.getCpaper().getSvgPaper();
        if (svg) svg.clearSelection();

        var success = me.getCpaper().saveKDRichTextBlock();
        if (success == false) return;

        me.saveStickyWK();
        me.saveOverPrintWK();
        me.saveSealWK();
        me.getCpaper().setIsClearPaper(true);
        var newWK = OA.common.DIMgr.wkCleanUp(wk);
        OA.common.Global.setCurrentWKContent(newWK);
        me.getCpaper().setIsFieldEdit(true);

        //建立文稿
        var modelName = OA.client.WK.getCurrentModelName();
        var r = Ext.create(modelName);
        //var rs = Ext.clone(r.getProxy().getReader().readRecords(Ext.clone(newWK)).getRecords()[0]);

        var normalizedWk = newWK.hasOwnProperty('data') ? newWK : { data: newWK };
        // 使用 normalizedWk 來讀取記錄
        var readResult = r.getProxy().getReader().readRecords(Ext.clone(normalizedWk));
        // 調試並檢查讀取結果
        console.log("readResult:", readResult);
        if (readResult && readResult.getRecords) {
            var records = readResult.getRecords();
            if (records.length > 0) {
                readResult = Ext.clone(records[0]);
                console.log("rs:", readResult); // 檢查 readResult 是否包含期望數據
            } else {
                console.warn("No records found in readResult.");
            }
        } else {
            console.error("Failed to read records from wk.");
        }

       
        var oSVG = OA.common.DIMgr.generateSvg(modelName, readResult);
        OA.common.Global.setCurrentViewModel(oSVG.vm);
        me.getCpaper().create(oSVG, readResult.data.layout);

        if (callback) callback();
    },
    /**
     * 下一關
     */
    onGotoStage: function (button) {
        console.log(button);
        // 在使用者一按下按鈕（陳會、決行及退文等）時就開啟遮罩，避免重複送出多次請求 - by yi-chi chiu
        Ext.Viewport.setMasked(true);
        var me = this;
        var qs = OA.common.Global.getQ();
        //var isDestop = Ext.os.deviceType === 'Desktop';
        var action = button.config.action;
        var status = OA.common.Paper.getActiveStatus();
        var vm = OA.common.Global.getCurrentViewModel();
        var wk = OA.common.Global.getCurrentWKContent();
        var initParas = OA.common.Global.getInitParas();
        var menuLeft = Ext.Viewport.getMenus().left; //左側menu
        var edition = OA.common.VIMgr.getCurrentEdition();
        var Role = OA.common.Global.getCurrentRole();
        var qd = OA.common.Global.getQueryDefault();
        if (action == 'docEdit') {
            if (qs.isRole15) {
                var ctrToolEdit = Ext.getCmp('toolEdit');
                if (OA.common.VIMgr.isParallel()) {
                    Ext.Array.forEach(ctrToolEdit.getItems().items, function (button) {
                        var isUse = ['sticky', 'save'].indexOf(button.config.action) >= 0;
                        if (isUse) button.setDisabled(false);
                    });
                } else {
                    me.doEditAction('edit');
                    Ext.Array.forEach(ctrToolEdit.getItems().items, function (button) {
                        button.setDisabled(false);
                    });
                    Ext.getCmp('suggestionText').setDisabled(false);
                    Ext.getCmp('suggestionText').setReadOnly(false);
                    var butSuggests = Ext.getCmp('suggestionTip').items.items;
                    Ext.Array.each(butSuggests, function (but) {
                        but.setDisabled(false);
                    });
                    me.getCpaper().setIsLockPaper(false);
                }
                me.setIsRole15Edited(true);
            } else {
                Ext.Msg.confirm("確定清稿？", "將清稿，是否繼續？", function (ok) {
                    if ('yes' == ok) {
                        me.doClearWK();
                        Ext.Viewport.setMasked(false);
                        me.doEditAction('clear');
                    } else {
                        Ext.Viewport.setMasked(false);
                    }
                });
            }
        } else if (action == 'docDelete') {
            var r = OA.common.Global.getCurrentDocFlowRecord();
            OA.common.Paper.setActiveStatus('delete');
            OA.client.WK.excute({ action: 'delete' }, function () {
                me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r);
            });
        } else if (action == 'docSend') {
            //console.log('docSend');
            var isContact = OA.common.Paper.main().hasField("受文者");
            if (isContact && wk.DocumentType !== "會計報告遞送單") {
                var hasContactList =
                    vm.ContactList != null && vm.ContactList.length > 0;
                if (!hasContactList) {
                    Ext.Msg.alert("提示", "沒有任何受文者！");
                    return;
                }
            }

            var isSendate = OA.common.Paper.main().hasField("發文日期");
            //'單一陳情存查表單不檢核
            if (wk.DocumentType === "單一陳情系統案件回復表") {
                if (vm.表單類型 === "FrmCloseAsRef") isSendate = false;
            }
            if (isSendate) {
                var sendate = OA.common.Utils.getWKNames(wk, "發文日期");
                if (sendate && sendate[1].trim() == "") {
                    //不提示自動填入當天
                    var wkDateToday = OA.common.Utils.toWkDates(
                        new Date(),
                        "中華民國"
                    );
                    OA.common.Paper.main().updateContent({
                        發文日期: wkDateToday[0],
                    });
                    if (status != "saved") {
                        me.doSave({ action: "save" }, function () {
                            me.doDocSend();
                            Ext.Viewport.setMasked(false);
                            if (menuLeft) menuLeft.setMasked(false);
                        });
                        return;
                    }
                    me.doDocSend();

                    /*
                    Ext.Msg.confirm("提示", "發文日期空白！是否自動填入今日？", function (
                        fn
                    ) {
                        if (fn == "yes") {
                            var wkDateToday = OA.common.Utils.toWkDates(
                                new Date(),
                                "中華民國"
                            );
                            OA.common.Paper.main().updateContent({
                                發文日期: wkDateToday[0],
                            });
                            if (status != "saved") {
                                me.doSave({ action: "save" }, function () {
                                    me.doDocSend();
                                    Ext.Viewport.setMasked(false);
                                    if (menuLeft) menuLeft.setMasked(false);
                                });
                                return;
                            }
                            me.doDocSend();
                        } else {
                            // 解除遮罩鎖定 - by yi-chi chiu
                            Ext.Viewport.setMasked(false);
                        }
                    });
                    */
                    return;
                }
            }

            if (status != "saved" || edition.isTemp == "Y") {
                me.doSave({ action: "save" }, function () {
                    edition.isTemp = "N";
                    me.doDocSend();
                    Ext.Viewport.setMasked(false);
                    if (menuLeft) menuLeft.setMasked(false);
                });
                return;
            }
            me.doDocSend();
        } else if (action == 'exchange') {
            //console.log('exchange');
            //console.log(button);
            var ctr = ctr = me.getCpaper();
            var isSendate = OA.common.Paper.main().hasField('發文日期');
            if (isSendate) {
                var sendate = OA.common.Utils.getWKNames(wk, '發文日期');

                if (button.get('text') == '（清稿）上傳') {
                    //不提示自動清稿
                    me.doClearWK();
                    me.doEditAction('clear');

                    //檢核支號是否為空白自動補支號（更新VI,WK,VM）

                    if (wk) {
                        var tagDoSno = OA.common.Utils.getTagText(wk, '發文字號');
                        if (tagDoSno) {
                            if (tagDoSno.childNodes && tagDoSno.childNodes.length > 0) {

                                var word = '';
                                var year = '';
                                var number = '';
                                var no = '';
                                Ext.Array.each(tagDoSno.childNodes, function (tag) {
                                    console.log(tag);
                                    if (tag.Key == '發文字號_字') {
                                        word = (tag.Value || '') + '';
                                    } else if (tag.Key == '發文字號_年度') {
                                        year = (tag.Value || '') + '';
                                    } else if (tag.Key == '發文字號_流水號') {
                                        number = (tag.Value || '') + '';
                                    } else if (tag.Key == '發文字號_支號') {
                                        no = (tag.Value || '') + '';
                                    }
                                });

                                //如果除支號外有其他為空從doSno跟qd補
                                if (word == '' || year == '' || number == '') {
                                    console.log(qd);
                                    if (qd && qd.本機關發文字) {
                                        word = qd.本機關發文字;
                                    }

                                    if (qs && qs.doSno) {
                                        console.log(qs.doSno)
                                        if ((qs.doSno + '').trim().length >= 10) {
                                            var yesrNO = (qs.doSno + '').substr(0, 3);
                                            var numberNO = (qs.doSno + '').substr(3, 7);

                                            if (yesrNO) year = yesrNO + '';
                                            if (numberNO) number = numberNO + '';
                                            //console.log(yesrNO);
                                            //console.log(numberNO);
                                        }
                                    }
                                }

                                //支號為空從文稿數判斷目前有多少文稿
                                var paperConfig;
                                var butCurrentPage = me.getSegdoc().getPressedButtons()[0];
                                if (butCurrentPage)
                                    paperConfig = butCurrentPage.config;

                                if (no == '') {
                                    var draftCount = OA.common.DIMgr.getDraftCount();
                                    //console.log(draftCount);
                                    //如果是draftCount是1從0號開編大於1從1開始編
                                    if (draftCount == 1) {
                                        no = '0';
                                    } else {

                                        if (paperConfig) {
                                            //console.log(paperConfig);
                                            if (paperConfig.text) {
                                                if ((paperConfig.text + '').indexOf('(') == -1) {
                                                    //第一稿支號為1
                                                    no = '1';
                                                } else {
                                                    //第二稿以上取()內的支號
                                                    if ((paperConfig.text + '').indexOf('(') != -1 &&
                                                        (paperConfig.text + '').indexOf(')') != -1) {
                                                        var textNO = (paperConfig.text + '').substr((paperConfig.text + '').indexOf('(') + 1,
                                                            (paperConfig.text + '').indexOf(')') - (paperConfig.text + '').indexOf('(') - 1);

                                                        if (textNO) {
                                                            no = (OA.common.DIMgr.flowNoPlus2(parseInt(textNO)) + '');
                                                            //console.log(no);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                if (word && year && number && no) {
                                    //重組發文文號
                                    var sendNO = year + number + no;
                                    if (wk) {
                                        wk.發文文號 = sendNO;
                                        Ext.Array.each(tagDoSno.childNodes, function (tag) {
                                            //console.log(tag);
                                            if (tag.Key == '發文字號_字') {
                                                tag.Value = word;
                                            } else if (tag.Key == '發文字號_年度') {
                                                tag.Value = year;
                                            } else if (tag.Key == '發文字號_流水號') {
                                                tag.Value = number;
                                            } else if (tag.Key == '發文字號_支號') {
                                                tag.Value = no;
                                            }
                                        });
                                        OA.common.Global.setCurrentWKContent(wk);
                                    }
                                    if (vm) {
                                        vm.發文文號 = sendNO;

                                    }

                                    if (paperConfig) {
                                        paperConfig.sendNo = sendNO
                                    }

                                    me.getCpaper().clearSvgSentPaper(
                                        {
                                            發文字號_字_1: word,
                                            發文字號_年度_1: year,
                                            發文字號_支號_1: no,
                                            發文字號_流水號_1: number,
                                            發文定義: '財團法人金融消費評議中心'
                                        }
                                    );
                                    me.getCpaper().svgUpdateLayout();  //文字重排
                                }
                            }
                        }
                    }

                    //判斷還有沒有其他發文稿沒有支號，提醒切換清稿上傳

                    if (sendate && sendate[1].trim() == '') {
                        //if (Role && (Role.roleId == '18' || Role.roleId == '02') {
                        //自動帶入今天
                        var wkDateToday = OA.common.Utils.toWkDates(new Date(), '中華民國');
                        OA.common.Paper.main().updateContent({ 發文日期: wkDateToday[0] });

                        //me.doSave({ action: 'save' }, function () {
                        //Ext.Viewport.setMasked(false);
                        //if (menuLeft) menuLeft.setMasked(false);
                        if (wk.DocumentType === '開會通知單') {
                            var msgStr = '';
                            var chkMettMaster = OA.common.Utils.getWKNames(wk, '主持人');
                            if (chkMettMaster) {
                                if (chkMettMaster.length < 2) {
                                    msgStr = '主持人';
                                } else if (chkMettMaster[1] + ''.trim === '') {
                                    msgStr = '主持人';
                                }
                            }

                            var chkMettDate = OA.common.Utils.getYMD2(wk, '開會時間');
                            if (chkMettDate) {
                                if (chkMettDate.length < 2) {
                                    msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                                } else if (chkMettDate[1] + ''.trim() === '') {
                                    msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                                }
                            }
                            if (msgStr.length > 0) {
                                Ext.Msg.alert('提示', msgStr + '，不可空白！')
                                Ext.Viewport.setMasked(false);
                                return;
                            }
                        }

                        if (vm.發文文號 && (vm.發文文號 + '').length > 11) {
                            Ext.Msg.alert('提示', '發文文號不可大於12碼！');
                            Ext.Viewport.setMasked(false);
                            return;
                        }
                        //直接執行上傳動作
                        me.autoSend(function () {
                            me.saveViReload();
                        });
                        //});
                        return;
                    } else {
                        var dtP = OA.common.Utils.toChineseDateTime(sendate[1].trim());
                        var yearP = parseInt(dtP.getFullYear()) - 1911;
                        var monthDateP = padLeft(dtP.getMonth() + 1, 2);
                        var dayP = padLeft(dtP.getDate(), 2);
                        var sendDayP = parseInt(Ext.String.format('{0}{1}{2}', yearP, monthDateP, dayP));
                        var dtN = new Date();

                        var yearN = parseInt(dtN.getFullYear()) - 1911;
                        var monthDateN = padLeft(dtN.getMonth() + 1, 2);
                        var dayN = padLeft(dtN.getDate(), 2);
                        var sendDayN = parseInt(Ext.String.format('{0}{1}{2}', yearN, monthDateN, dayN));

                        //console.log(sendDayP);
                        //console.log(sendDayN);

                        if (sendDayP < sendDayN) {
                            if (Role && Role.roleId == '18') {
                                //自動帶入今天
                                var wkDateToday = OA.common.Utils.toWkDates(new Date(), '中華民國');
                                OA.common.Paper.main().updateContent({ 發文日期: wkDateToday[0] });
                                //me.doSave({ action: 'save' }, function () {
                                //me.showFormSend();
                                //Ext.Viewport.setMasked(false);
                                //if (menuLeft) menuLeft.setMasked(false);
                                if (wk.DocumentType === '開會通知單') {
                                    var msgStr = '';
                                    var chkMettMaster = OA.common.Utils.getWKNames(wk, '主持人');
                                    if (chkMettMaster) {
                                        if (chkMettMaster.length < 2) {
                                            msgStr = '主持人';
                                        } else if (chkMettMaster[1] + ''.trim === '') {
                                            msgStr = '主持人';
                                        }
                                    }

                                    var chkMettDate = OA.common.Utils.getYMD2(wk, '開會時間');
                                    if (chkMettDate) {
                                        if (chkMettDate.length < 2) {
                                            msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                                        } else if (chkMettDate[1] + ''.trim() === '') {
                                            msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                                        }
                                    }
                                    if (msgStr.length > 0) {
                                        Ext.Msg.alert('提示', msgStr + '，不可空白！')
                                        Ext.Viewport.setMasked(false);
                                        return;
                                    }
                                }

                                if (vm.發文文號 && (vm.發文文號 + '').length > 11) {
                                    Ext.Msg.alert('提示', '發文文號不可大於12碼！');
                                    Ext.Viewport.setMasked(false);
                                    return;
                                }
                                //直接執行上傳動作
                                me.autoSend(function () {
                                    me.saveViReload();
                                });
                                //});
                                return;
                            } else {
                                Ext.Msg.confirm('提示', '發文日期小於今日！是否自動填入今日？', function (fn) {
                                    if (fn == 'yes') {
                                        var wkDateToday = OA.common.Utils.toWkDates(new Date(), '中華民國');
                                        OA.common.Paper.main().updateContent({ 發文日期: wkDateToday[0] });
                                        //me.doSave({ action: 'save' }, function () {
                                        //me.showFormSend();
                                        //Ext.Viewport.setMasked(false);
                                        //if (menuLeft) menuLeft.setMasked(false);
                                        if (wk.DocumentType === '開會通知單') {
                                            var msgStr = '';
                                            var chkMettMaster = OA.common.Utils.getWKNames(wk, '主持人');
                                            if (chkMettMaster) {
                                                if (chkMettMaster.length < 2) {
                                                    msgStr = '主持人';
                                                } else if (chkMettMaster[1] + ''.trim === '') {
                                                    msgStr = '主持人';
                                                }
                                            }

                                            var chkMettDate = OA.common.Utils.getYMD2(wk, '開會時間');
                                            if (chkMettDate) {
                                                if (chkMettDate.length < 2) {
                                                    msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                                                } else if (chkMettDate[1] + ''.trim() === '') {
                                                    msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                                                }
                                            }
                                            if (msgStr.length > 0) {
                                                Ext.Msg.alert('提示', msgStr + '，不可空白！')
                                                Ext.Viewport.setMasked(false);
                                                return;
                                            }
                                        }

                                        if (vm.發文文號 && (vm.發文文號 + '').length > 11) {
                                            Ext.Msg.alert('提示', '發文文號不可大於12碼！');
                                            Ext.Viewport.setMasked(false);
                                            return;
                                        }
                                        //直接執行上傳動作
                                        me.autoSend(function () {
                                            me.saveViReload();
                                        });
                                        //});
                                        return;
                                    } else {
                                        //直接執行上傳動作
                                        me.autoSend(function () {
                                            me.saveViReload();
                                        });
                                    }
                                    return;
                                });
                            }
                        }
                        if (wk.DocumentType === '開會通知單') {
                            var msgStr = '';
                            var chkMettMaster = OA.common.Utils.getWKNames(wk, '主持人');
                            if (chkMettMaster) {
                                if (chkMettMaster.length < 2) {
                                    msgStr = '主持人';
                                } else if (chkMettMaster[1] + ''.trim === '') {
                                    msgStr = '主持人';
                                }
                            }

                            var chkMettDate = OA.common.Utils.getYMD2(wk, '開會時間');
                            if (chkMettDate) {
                                if (chkMettDate.length < 2) {
                                    msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                                } else if (chkMettDate[1] + ''.trim() === '') {
                                    msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                                }
                            }
                            if (msgStr.length > 0) {
                                Ext.Msg.alert('提示', msgStr + '，不可空白！')
                                Ext.Viewport.setMasked(false);
                                return;
                            }
                        }

                        if (vm.發文文號 && (vm.發文文號 + '').length > 11) {
                            Ext.Msg.alert('提示', '發文文號不可大於12碼！');
                            Ext.Viewport.setMasked(false);
                            return;
                        }
                        //直接執行上傳動作
                        me.autoSend(function () {
                            me.saveViReload();
                        });
                    }
                    return;
                } else {

                    if (sendate && sendate[1].trim() == '') {
                        //自動填入今天
                        var wkDateToday = OA.common.Utils.toWkDates(new Date(), '中華民國');
                        OA.common.Paper.main().updateContent({ 發文日期: wkDateToday[0] });
                        if (status != 'saved') {
                            me.doSave({ action: 'save' }, function () {
                                me.showFormSend();
                                Ext.Viewport.setMasked(false);
                                if (menuLeft) menuLeft.setMasked(false);
                            });
                            return;
                        }
                        if (ctr && !ctr.getIsClearPaper()) {
                            Ext.Msg.confirm('提示', '文稿尚未執行清稿，是否自動清稿？', function (fn) {
                                if (fn == 'yes') {
                                    me.doClearWK();
                                    me.doEditAction('clear');
                                    me.showFormSend();
                                }
                            })
                        } else {
                            me.showFormSend();
                        }
                        /*
                        Ext.Msg.confirm('提示', '發文日期空白！是否自動填入今日？', function (fn) {
                            if (fn == 'yes') {
                                var wkDateToday = OA.common.Utils.toWkDates(new Date(), '中華民國');
                                OA.common.Paper.main().updateContent({ 發文日期: wkDateToday[0] });
                                if (status != 'saved') {
                                    me.doSave({ action: 'save' }, function () {
                                        me.showFormSend();
                                        Ext.Viewport.setMasked(false);
                                        if (menuLeft) menuLeft.setMasked(false);
                                    });
                                    return;
                                }
                                if (ctr && !ctr.getIsClearPaper()) {
                                    Ext.Msg.confirm('提示', '文稿尚未執行清稿，是否自動清稿？', function (fn) {
                                        if (fn == 'yes') {
                                            me.doClearWK();
                                            me.doEditAction('clear');
                                            me.showFormSend();
                                        }
                                    })
                                } else {
                                    me.showFormSend();
                                }
                            } else {
                                // 解除遮罩鎖定 - by yi-chi chiu
                                Ext.Viewport.setMasked(false);
                            }
                        });
                        */
                        return;
                    } else {
                        //補判斷日期是否小於今天
                        var dtP = OA.common.Utils.toChineseDateTime(sendate[1].trim());
                        var yearP = parseInt(dtP.getFullYear()) - 1911;
                        var monthDateP = padLeft(dtP.getMonth() + 1, 2);
                        var dayP = padLeft(dtP.getDate(), 2);
                        var sendDayP = parseInt(Ext.String.format('{0}{1}{2}', yearP, monthDateP, dayP));
                        var dtN = new Date();

                        var yearN = parseInt(dtN.getFullYear()) - 1911;
                        var monthDateN = padLeft(dtN.getMonth() + 1, 2);
                        var dayN = padLeft(dtN.getDate(), 2);
                        var sendDayN = parseInt(Ext.String.format('{0}{1}{2}', yearN, monthDateN, dayN));

                        //console.log(sendDayP);
                        //console.log(sendDayN);

                        if (sendDayP < sendDayN) {
                            if (Role && Role.roleId == '18') {
                                var wkDateToday = OA.common.Utils.toWkDates(new Date(), '中華民國');
                                OA.common.Paper.main().updateContent({ 發文日期: wkDateToday[0] });
                                if (status != 'saved') {
                                    me.doSave({ action: 'save' }, function () {
                                        me.showFormSend();
                                        Ext.Viewport.setMasked(false);
                                        if (menuLeft) menuLeft.setMasked(false);
                                    });
                                    return;
                                }
                                if (ctr && !ctr.getIsClearPaper()) {
                                    Ext.Msg.confirm('提示', '文稿尚未執行清稿，是否自動清稿？', function (fn) {
                                        if (fn == 'yes') {
                                            me.doClearWK();
                                            me.doEditAction('clear');
                                            me.showFormSend();
                                        }
                                    })
                                } else {
                                    me.showFormSend();
                                }
                            } else {
                                Ext.Msg.confirm('提示', '發文日期小於今日！是否自動填入今日？', function (fn) {
                                    if (fn == 'yes') {
                                        var wkDateToday = OA.common.Utils.toWkDates(new Date(), '中華民國');
                                        OA.common.Paper.main().updateContent({ 發文日期: wkDateToday[0] });
                                        if (status != 'saved') {
                                            me.doSave({ action: 'save' }, function () {
                                                me.showFormSend();
                                                Ext.Viewport.setMasked(false);
                                                if (menuLeft) menuLeft.setMasked(false);
                                            });
                                            return;
                                        }
                                        if (ctr && !ctr.getIsClearPaper()) {
                                            Ext.Msg.confirm('提示', '文稿尚未執行清稿，是否自動清稿？', function (fn) {
                                                if (fn == 'yes') {
                                                    me.doClearWK();
                                                    me.doEditAction('clear');
                                                    me.showFormSend();
                                                }
                                            })
                                        } else {
                                            me.showFormSend();
                                        }
                                    } else {
                                        // 解除遮罩鎖定 - by yi-chi chiu
                                        me.showFormSend();
                                        Ext.Viewport.setMasked(false);
                                    }
                                });
                            }
                            return;
                        }
                    }
                }
                if (wk.DocumentType === '開會通知單') {
                    var msgStr = '';
                    var chkMettMaster = OA.common.Utils.getWKNames(wk, '主持人');
                    if (chkMettMaster) {
                        if (chkMettMaster.length < 2) {
                            msgStr = '主持人';
                        } else if (chkMettMaster[1] + ''.trim === '') {
                            msgStr = '主持人';
                        }
                    }

                    var chkMettDate = OA.common.Utils.getYMD2(wk, '開會時間');
                    if (chkMettDate) {
                        if (chkMettDate.length < 2) {
                            msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                        } else if (chkMettDate[1] + ''.trim() === '') {
                            msgStr = msgStr.length > 0 ? msgStr + '、開會時間' : '開會時間'
                        }
                    }
                    if (msgStr.length > 0) {
                        Ext.Msg.alert('提示', msgStr + '，不可空白！')
                        Ext.Viewport.setMasked(false);
                        return;
                    }
                }

                if (vm.發文文號 && (vm.發文文號 + '').length > 11) {
                    Ext.Msg.alert('提示', '發文文號不可大於12碼！');
                    Ext.Viewport.setMasked(false);
                    return;
                }

                var check = me.checkAttach(function () {
                    if (ctr && !ctr.getIsClearPaper()) {
                        Ext.Msg.confirm('提示', '文稿尚未執行清稿，是否自動清稿？', function (fn) {
                            if (fn == 'yes') {
                                me.doClearWK();
                                me.doEditAction('clear');
                                me.showFormSend();
                            }
                        })
                    } else {
                        me.showFormSend();
                    }
                });
                if (check) return;

                if (status != 'saved') {
                    me.doSave({ action: 'save' }, function () {
                        if (ctr && !ctr.getIsClearPaper()) {
                            Ext.Msg.confirm('提示', '文稿尚未執行清稿，是否自動清稿？', function (fn) {
                                if (fn == 'yes') {
                                    me.doClearWK();
                                    me.doEditAction('clear');
                                    me.showFormSend();
                                }
                            })
                        } else {
                            me.showFormSend();
                        }
                        Ext.Viewport.setMasked(false);
                        if (menuLeft) menuLeft.setMasked(false);
                    });
                    return;
                }
                if (ctr && !ctr.getIsClearPaper()) {
                    Ext.Msg.confirm('提示', '文稿尚未執行清稿，是否自動清稿？', function (fn) {
                        if (fn == 'yes') {
                            me.doClearWK();
                            me.doEditAction('clear');
                            me.showFormSend();
                        } else {
                            Ext.Viewport.setMasked(false);
                        }
                    })
                } else {
                    me.showFormSend();
                }
            } else {
                //沒有發文日期欄位只做清稿後回傳
                me.doClearWK();
                me.doEditAction('clear');
                me.doSave({ action: 'save' }, function () {
                    Ext.Viewport.setMasked(false);
                    if (menuLeft) menuLeft.setMasked(false);
                });
                return;
            }
        } else if (action == 'docUpload') {
            //console.log('docUpload');
            //非預提不可輸入發文文號取號
            if (qs.genDocNo !== '2') {
                if (vm.發文文號 && (vm.發文文號 + '').length > 0) {
                    Ext.Msg.alert("提示", "非預提文號，不可輸入發文文號！");
                    Ext.Viewport.setMasked(false);
                    return
                }
            } else {
                if (wk && !wk.doSno)
                    wk.doSno = qs.doSno;
            }

            //回第一筆再上傳
            var activeButton = me.getSegdoc().getPressedButtons()[0];
            var firstButton = me.getSegdoc().getItems().items[0];
            if (activeButton.config.paperNo != firstButton.config.paperNo) {
                me.getSegdoc().setPressedButtons(firstButton);
                qs.nextStep = 'docUpload';
                return;
            }


            //密件只能紙本取號
            if (vm.密等 && vm.密等.trim()) {
                if (OA.common.Utils.checkEpaper()) {
                    Ext.Msg.alert('提示', '密等公文無法線上簽核取號！請改由紙本公文製作取號');
                    Ext.Viewport.setMasked(false);
                }
            }
            /*
           if (vm.密等 && vm.密等.trim()) {
               if (OA.common.Utils.checkEpaper()) {
                   Ext.Msg.alert('提示', '密等公文無法線上簽核取號！請改由紙本公文製作取號');
                   Ext.Viewport.setMasked(false);
               } else {
                   qs.sFlag = 'Y';
                   //強制show存檔路徑
                   me.doSaveFolder({ action: 'save', isNotPopup: false }, function () {
                       //要鎖畫面
                       Ext.Viewport.setMasked(true);
                       var menuLeft = Ext.Viewport.getMenus().left;
                       if (menuLeft) menuLeft.setMasked(true);
                       me.doSave({ action: 'upload' });
                   });
               }
               return;
               //Ext.Msg.alert('提示', '密等公文無法取號！');
               //Ext.Viewport.setMasked(false);
               //return;
           } else {
               qs.sFlag = '';
           }*/

            // 來文 不檢查 主旨, 檔號, 其他欄位
            if (vm.kind === '來文') { //vm.kind 會亂變動.....
                OA.common.Paper.setActiveStatus('create');
                me.doSave({ action: 'create' });
                return;
            }

            //要去空格再判斷，不檢核空白，送陳會再檢核
            if (OA.common.Paper.main().hasField('檔號')) {
                if (vm.檔號.trim() === '' || vm.保存年限.toString().trim() === '') {
                    Ext.Msg.alert('提示', '檔號及保存年限不可空白');
                    Ext.Viewport.setMasked(false);
                    return;
                }
                //else if (parseInt(vm.保存年限) >= 99 && OA.common.Utils.checkEpaper()) {
                //    Ext.Msg.alert('提示', '保存年限永久不可使用線上簽核！');
                //    Ext.Viewport.setMasked(false);
                //    return;
                //}
            }

            /*
            　檢核主旨空白（表單不檢核），wk重組後才處理 ，
            　如下公文, 若無主旨, 檢查其他欄位 (參考 二代)
            */
            var checkStringIsEmpty = OA.common.Utils.checkStringIsEmpty;
            //  無主旨, 檢查 說明內容
            if( wk.DocumentType === '便簽' || 
                wk.DocumentType === '令' ||
                wk.DocumentType === '受文者令'
            ) {
                var KDRichTextList = Ext.getCmp('cpaper').getKDRichTextBlockContext();
                if(KDRichTextList.length === 0) {
                    Ext.Msg.alert('提示', '說明內容不可空白！');
                    Ext.Viewport.setMasked(false);
                    return;
                }
            }
            //  無主旨, 檢查 開會事由 是否有效
            else if (wk.DocumentType === '開會通知單') {
                if (checkStringIsEmpty(vm.開會事由)) {
                    Ext.Msg.alert('提示', '開會事由不可空白！');
                    Ext.Viewport.setMasked(false);
                    return;
                }
            }
            //  無主旨, 檢查 會勘事由 是否有效
            else if (wk.DocumentType === '會勘通知單') {
                if (checkStringIsEmpty(vm.會勘事由)) {
                    Ext.Msg.alert('提示', '會勘事由不可空白！');
                    Ext.Viewport.setMasked(false);
                    return;
                }
            }
            //  無主旨, 檢查 新等級或註銷 是否有效
            else if (wk.DocumentType === '機密文書機密等級變更或註銷紀錄單') {
                if (checkStringIsEmpty(vm.新等級或註銷)) {
                    Ext.Msg.alert('提示', '新等級或註銷不可空白！');
                    Ext.Viewport.setMasked(false);
                    return;
                }
            }
            //  無主旨, 檢查 案由 是否有效
            else if (wk.DocumentType === '機密文書機密等級變更或註銷處理意見表') {
                if (checkStringIsEmpty(vm.案由)) {
                    Ext.Msg.alert('提示', '案由不可空白！');
                    Ext.Viewport.setMasked(false);
                    return;
                }
            }
            //  無主旨, 檢查 案情摘要 是否有效
            else if (wk.DocumentType === '簽稿會核單') {
                if (checkStringIsEmpty(vm.案情摘要)) {
                    Ext.Msg.alert('提示', '案情摘要不可空白！');
                    Ext.Viewport.setMasked(false);
                    return;
                }
            }
            //  無主旨, 檢查 主辦機換,會辦機關 是否有效
            else if (wk.DocumentType === '會銜公文會辦單') {
                const valList = vm.會辦機關 ? (vm.會辦機關).split('、') : [];
                const emptyList = valList.filter(e => checkStringIsEmpty(e));
                if (valList.length < 3 || emptyList.length > 0) {
                    Ext.Msg.alert('提示', '所有主辦機關,會辦機關欄位不可空白！');
                    Ext.Viewport.setMasked(false);
                    return;
                }
            }
            //  無主旨, 檢查 會銜主旨 是否有效
            else if (wk.DocumentType === '會銜公文機關印信蓋用續頁表') {
                if (checkStringIsEmpty(vm.會銜主旨)) {
                    Ext.Msg.alert('提示', '主旨(會銜主旨)不可空白！');
                    Ext.Viewport.setMasked(false);
                    return;
                }
            }
            //  有主旨, 檢查 主旨 是否有效
            else if (checkStringIsEmpty(vm.主旨) || vm.主旨.toString().trim() === '主旨') {
                Ext.Msg.alert('提示', '主旨不可空白！');
                //創簽稿要關閉創簽稿選單畫面
                var newDocForm = Ext.getCmp('FormNewDoc');
                if (newDocForm) newDocForm.hide();
                //多稿才復原
                if (qs.app !== "editor") {
                    var docBtn = me.getSegdoc().getItems().items;
                    if (docBtn && docBtn.length > 0) {
                        Ext.Array.each(docBtn, function (btn) {
                            if (btn.config && btn.config.paperNo) {
                                if (paras.paperNo == btn.config.paperNo) {
                                    me.getSegdoc().setPressedButtons(btn);//按鈕復原
                                }
                            }
                        });
                    }
                }

                // 沒有callbak，防呆解鎖
                if (Ext.getCmp('segDocSelector'))
                    Ext.getCmp('segDocSelector').setDisabled(false);
                Ext.Viewport.setMasked(false);
                return;
            }

            OA.common.Paper.setActiveStatus('create');
            me.doSave({ action: 'create' });
            return;
            /*
            if (status != 'saved') {
                //console.log(wk.DocumentType);
                var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                //console.log(wk.DocumentType);
                var needPurpose = ['便簽', 'A4空白簽', '箋函', '便箋', '簡簽', '會辦簽', '機密文書機密等級變更或註銷紀錄單',
                    '機密文書機密等級變更或註銷處理意見表', '簽稿會核單', '任免遷調核薪通知書',
                    '會銜公文會辦單', '會銜公文機關印信蓋用續頁表'].indexOf(wk.DocumentType) >= 0;
                if (wk && needPurpose) {
                    Ext.Msg.prompt("主旨", "請輸入主旨：", function (bu, txt) {
                        if (bu === 'cancel') {
                            Ext.Viewport.setMasked(false);
                            return;
                        }
                        if (txt === '') {
                            Ext.Msg.alert('提示', '主旨不可空白！');
                            Ext.Viewport.setMasked(false);
                            return;
                        } else {
                            //vm,vi要同步更新
                            OA.common.Global.getCurrentViewModel().主旨 = txt;
                            OA.common.VIMgr.getViContent().主旨 = txt;
                            if (ctrWK) ctrWK.doSaveFolder({ action: 'save', isNotPopup: true }, function () {
                                //要鎖畫面
                                Ext.Viewport.setMasked(true);
                                var menuLeft = Ext.Viewport.getMenus().left;
                                if (menuLeft) menuLeft.setMasked(true);
                                me.doSave({ action: 'upload' });
                            });
                            return;
                        }
                    }, this, 400);
                } else {
                    var doOffline = (qs.app === 'editor' || qs.app === 'offline') && isDestop;
                    if (doOffline) {
                        var attachItem = OA.common.InitParas.getAttachItem();
                        var attachs = attachItem.vi.where("( el, i, res, param ) =>el.folderName =='attach'&&el.status!='0'");
                        if (ctrWK) ctrWK.doSaveFolder({
                            action: 'save',
                            isNotPopup: true,
                            attachs: attachs
                        }, function () {
                            //要鎖畫面
                            Ext.Viewport.setMasked(true);
                            var menuLeft = Ext.Viewport.getMenus().left;
                            if (menuLeft) menuLeft.setMasked(true);
                            me.doSave({ action: 'upload' });
                        });
                    } else {
                        OA.common.Paper.setActiveStatus('create');
                        me.doSave({ action: 'create' });
                    }
                    return;
                }
            }
            */
        } else if (action == 'draftUpload') {
            OA.common.Paper.setActiveStatus('create');
            me.doSave({ action: 'draft' });
        } else if (action == 'saveDraft') {
            //console.log('saveDraft');
            me.doSave({ action: 'save' });
        }
        else if (action == 'read') {
            var methodId = qs.reviewFn || 'doReview';
            OA.common.Bridge.goToManagement({ methodId: methodId, gbDocflowId: qs.gbDocflowId });
        } else if (action == 'docExit') {  //紙本離開功能鈕
            //存檔後關閉製作回
            me.doSave({ action: 'save' }, function () {
                qs.docExit = false;
                OA.common.Bridge.doClose();
            });
        } else {
            if (qs.app === 'approve') {
                if (status != 'saved') {
                    if (qs.isRole15) {
                        var isNotEdit = me.getButSave() && me.getButSave().getDisabled();
                        //檢核有無按過編輯
                        if (isNotEdit) {
                            isNotEdit = !me.getIsRole15Edited();
                        }

                        //加判斷版次是否為暫存，如非暫存版次表示已有編修過則需簽章
                        if (edition) {
                            if (edition.isTemp !== 'Y') {
                                isNotEdit = false;
                                me.setIsRole15Edited(true);
                                Ext.Msg.alert('提醒', '此份公文已有編修或存檔過，請簽章！');
                            }
                        }

                        //簽稿收發
                        if (isNotEdit) {
                            var paras = OA.common.InitParas.doWK({ action: action });
                            paras.func = 'doSign';
                            paras.version = OA.common.VIMgr.getCurrentEdition().版號 + ''; //簽核動作採用新版次
                            paras.methodId = action;
                            paras.retDesc = Ext.getCmp('suggestionText').getValue(); //TOD稿問題
                            paras.isAuto = true;
                            OA.common.Bridge.goToManagement(paras);
                            Ext.Viewport.setMasked(false);
                            if (menuLeft) menuLeft.setMasked(false);
                            return;
                        } else {
                            me.doSave({ action: 'save' }, function () {
                                me.onGotoStage(button);
                            });
                        }
                    } else {

                        me.doSave({ action: 'save' }, function () {

                            me.onGotoStage(button);
                        });
                        /*
                        if (button && button.getText() == '會畢') {
                            Ext.Msg.confirm("提醒", "請確認此公文是否為外單位會辦，且無需再送陳至主管？", function (ok) {
                             if ('yes' == ok) {
                                 me.doSave({ action: 'save' }, function () {
                                     me.onGotoStage(button);
                                 });
                             } else {
                                 Ext.Viewport.setMasked(false);
                             }
                         });
                        } else {
                            me.doSave({ action: 'save' }, function () {
                                me.onGotoStage(button);
                            });
                        }
                        */
                    }
                    return;
                }


                //（送陳/會）檢核檔號
                if (OA.common.Paper.main().hasField('檔號')) {
                    if (vm.檔號.trim() === '' || vm.保存年限.toString().trim() === '') {
                        Ext.Msg.alert('提示', '檔號及保存年限不可空白');
                        Ext.Viewport.setMasked(false);
                        return;
                    }
                }


                // 公文管理位置檢查 - by yi-chi chiu
                //第三代介面先不檢核
                /*
                if (!window.opener || OA.app.manageID != localStorage.getItem('manageID')) {
                    //行動版iframe不檢核
                    if (Ext.os.is.Desktop) {
                        Ext.Msg.alert("錯誤", "公文管理已關閉或不在原先功能，請先存檔後將本視窗關閉後自公文管理畫面重新開啟！");
                        Ext.Viewport.setMasked(false);
                        return;
                    }
                    // Ext.Msg.alert("錯誤", "公文管理已關閉或不在原先功能，請先存檔後將本視窗關閉後自公文管理畫面重新開啟！");
                    // Ext.Viewport.setMasked(false);
                    // return;
                }
                */
                var hasNotesOpinion = false;
                var suggestionTextHasValue = false;
                if (Ext.getCmp('suggestionText').getValue().trim()) suggestionTextHasValue = true;

                var isReadAll = true;
                var buttons = me.getSegdoc().getItems().items;
                Ext.Array.each(buttons, function (b) {
                    var cfg = b.config;
                    var isNotNotesOpinion = cfg.text != '會辦簽';
                    var isNotFollow = cfg.text != '來文';
                    if (isNotNotesOpinion && isNotFollow && cfg.isRead == false) isReadAll = false;
                    if (cfg.text == '會辦簽') hasNotesOpinion = true;
                });

                var papers = OA.common.VIMgr.getCurrentEditionPapers();
                var hasFollow = false;
                Ext.Array.each(papers, function (p) {
                    if (p.名稱 == '來文') hasFollow = true;
                });
                var isOnlyFllow = hasFollow && papers.length == 1;
                var p = OA.common.Global.getInitParas();
                var qd = OA.common.Global.getQueryDefault();
                var u = OA.common.Global.getCurrentUser();
                var isOwner = qd && qd.交換資訊 && qd.交換資訊.承辦人.empNo == u.empNo;

                //監印需要強制輸入簽辦意見
                var docflow = OA.common.Global.getCurrentDocFlowRecord();
                var isSealDone = docflow && ['B08', 'B09', 'B11', 'B16'].indexOf(docflow.get('docType')) >= 0;

                if (isOnlyFllow && suggestionTextHasValue == false && isOwner) {
                    Ext.Msg.alert('提示', '未加簽稿，簽核區必須要有簽辦意見！');
                    Ext.Viewport.setMasked(false);
                    return;
                }


                var isForceApprove = true; //強制驗證未核閱
                var isNeedApprove = ['forward', 'approve', 'readlist', 'flowlist'].indexOf(action) >= 0;
                if (!isReadAll && !isOwner) {
                    if (isForceApprove && isNeedApprove) {
                        Ext.MessageBox.YES = [
                            { text: '確定', itemId: 'yes', ui: 'confirm' }
                        ];
                        Ext.Msg.show({
                            title: '提醒',
                            message: '尚有簽稿未核閱!（自動切換）',
                            width: 300,
                            buttons: Ext.MessageBox.YES,
                            iconCls: Ext.MessageBox.INFO,
                            fn: function (buttonId, a, b) {
                                if (buttonId == 'yes') {
                                    Ext.defer(function () {
                                        var ctr = Ext.getCmp('segDocSelector');
                                        var items = ctr.getItems().items;
                                        var pressedItem;
                                        Ext.Array.each(items, function (item) {
                                            var cfg = item.config;
                                            var isNotFollow = cfg.text != '來文';
                                            if (isNotFollow && item.config.isRead == false) {
                                                pressedItem = item;
                                                return false;
                                            }
                                        });
                                        if (pressedItem) me.getSegdoc().setPressedButtons(pressedItem);
                                    }, 10);
                                } else {
                                    Ext.Viewport.setMasked(false);
                                }
                            }
                        });
                        return;
                    } else {
                        Ext.Msg.show({
                            title: '提醒',
                            message: '尚有簽稿未核閱!（自動切換）',
                            width: 300,
                            buttons: Ext.MessageBox.YES,
                            iconCls: Ext.MessageBox.INFO,
                            fn: function (buttonId, a, b) {
                                if (buttonId == 'yes') {
                                    Ext.defer(function () {
                                        var ctr = Ext.getCmp('segDocSelector');
                                        var items = ctr.getItems().items;
                                        var pressedItem;
                                        Ext.Array.each(items, function (item) {
                                            var cfg = item.config;
                                            var isNotNotesOpinion = cfg.text != '會辦簽';
                                            var isNotFollow = cfg.text != '來文';
                                            if (isNotFollow && isNotNotesOpinion && item.config.isRead == false) {
                                                pressedItem = item;
                                                return false;
                                            }
                                        });
                                        if (pressedItem) me.getSegdoc().setPressedButtons(pressedItem);
                                    }, 10);
                                } else {
                                    Ext.Viewport.setMasked(false);
                                }
                                //if (buttonId == 'yes') {
                                //    Ext.defer(function () {
                                //        me.doApproveNext(action);
                                //    }, 10);
                                //} else {
                                //    Ext.Viewport.setMasked(false);
                                //}
                            }
                        });
                        return;
                    }
                }

                // var viLevel = OA.common.VIMgr.getCurrentEditionPapers();
                // var qd = OA.common.Global.getQueryDefault();
                // var qdLevel = qd.稿面註記.決行層級_title
                // var Level = false;
                //
                // Ext.Array.each(viLevel, function (vilevel) { // 送陳會決行層級一致不判別  Chloe.sia
                //     var canLevel = false;
                //
                //     if(vilevel.文稿類型 == '機密文書機密等級變更或註銷紀錄單' ||vilevel.文稿類型 == '機密文書機密等級變更或註銷處理意見表'||vilevel.文稿類型 == '簽稿會核單'||
                //         vilevel.文稿類型 == '會銜公文會辦單'||vilevel.文稿類型 == '會銜公文機關印信蓋用續頁表'||vilevel.文稿類型 == '任免遷調核薪通知書' ||
                //         vilevel.文稿類型 == '公務電話紀錄'  || vilevel.名稱 =='來文'){
                //         canLevel = true;
                //
                //     }
                //
                //     if (vilevel.決行層級 != qdLevel && canLevel == false) {
                //         Level = true;
                //     }
                //     // console.log(canLevel,Level)
                // });
                // // console.log(qdLevel)
                // // console.log(viLevel)
                // if(Level == true){
                //     Ext.Msg.confirm("提醒", "文稿中決行層級不一致，是否需改為一致？", function (ok) {
                //         if ('yes' == ok) {
                //             Ext.Viewport.setMasked(false);
                //             return
                //         } else {
                //             me.doApproveNext(action);  //送下一關
                //         }
                //     });
                // }else {
                //     me.doApproveNext(action);  //送下一關
                // }


                //me.doSave({ action: 'save' }, function () {
                me.doApproveNext(action);
                //});

            } else if (qs.app === 'buchen') {
                //補陳，如果是簽稿收發，不簽章不存檔直接關閉製作 
                if (qs.isRole15) {
                    var win = OA.common.Global.getWinOpener();
                    var topKdmaker = win.kdMaker;
                    var dtreeContent = topKdmaker.getDTreeContent();
                    dtreeContent.backBuchen(qs.gbDocflowId);
                    qs.reload = 'N';
                    setTimeout(function () {
                        OA.common.Bridge.doClose();
                    }, 2000);
                    return;
                } else {
                    me.doSave({ action: 'save' }, function () {
                        me.doBuchen(action);
                    });
                    return;
                }
            } else {
                var main = Ext.getCmp('main');
                main.setActiveItem('StageApprove');  //簽核階段

                var data = OA.common.Global.getCurrentViewModel();
                me.getFieldSubject().setValue(data.主旨);
                me.getApproveSelectToolbar().setTitle('簽核階段 ' + OA.common.Global.getInitParas().doSno);

                if (button.config.action != 'next') {
                    me.getFieldActions().setValue(button.config.action);
                }
            }
        }
    },
    doApproveNext: function (action) {
        var me = this;
        var p = OA.common.Global.getInitParas();
        var review = false; //是否要覆閱
        var suggestionText = Ext.getCmp('suggestionText').getValue();
        var checkAction = action == 'approve' || action == 'readlist';
        var unCheckPaper = [];

        //已決行過的文稿不檢核(抓出已決行過的文稿)
        var vi = OA.common.VIMgr.getViContent();
        if (vi) {
            Ext.Array.each(vi.版次, function (item) {
                if (item.線上簽核資訊 && item.線上簽核資訊.簽核流程 && item.線上簽核資訊.簽核流程.異動別 == '決行') {
                    Ext.Array.each(item.簽核文件夾.文稿, function (paper) {
                        if (unCheckPaper.indexOf(paper.代碼) < 0) {
                            unCheckPaper.push(paper.代碼);
                        }
                    });
                }
            });
        }

        //檢核是否有沒有打意見的文稿
        if (checkAction) {
            var papers = OA.common.VIMgr.getCurrentEditionPapers();
            if (papers) {
                var isNaN = true;
                var chekDocs = [];
                Ext.Array.each(papers, function (doc) {
                    //可以發文之文稿（函,書函,開會通知單,箋函,電子信箱回覆函）
                    //判斷要要不要覆閱
                    if (doc.名稱 !== '來文') {
                        if ((suggestionText + '').trim() !== '') {
                            if ((suggestionText + '').trim().substr(0, 1) !== '發') {
                                review = true;
                            } else if ((suggestionText + '').length >= 2) {
                                review = true;
                            }
                        }

                        if (!review) {
                            if (doc.批示意見 && doc.批示意見.content) {
                                if (doc.批示意見.content != '') {
                                    if ((doc.批示意見.content + '').trim().substr(0, 1) !== '發') {
                                        review = true;
                                    } else if ((doc.批示意見.content + '').trim().length >= 2) {
                                        review = true;
                                    }
                                }
                            }
                        }
                    }

                    var canSendDocs = ['函', '書函', '開會通知單', '箋函', '電子信箱回覆函'];
                    var canSend = canSendDocs.indexOf(doc.文稿類型) >= 0;

                    if (doc.名稱 !== '來文' && canSend) {
                        chekDocs.push(doc);
                    }

                });

                if (chekDocs.length == 0) isNaN = false;
                //console.log(chekDocs);

                //當下文稿要檢核suggestionText
                if (chekDocs.length > 0) {
                    if ((suggestionText + '').trim() !== '') {
                        if ((suggestionText + '').trim().length == 1) {
                            if ((suggestionText + '').trim() == '發') {
                                isNaN = false;
                            }
                        } else {
                            if ((suggestionText + '').trim().substr(0, 1) == '發' ||
                                (suggestionText + '').trim().substr(0, 2) == '不發') {
                                isNaN = false;
                            }
                        }
                    }

                    if (isNaN) {
                        Ext.Array.each(papers, function (doc) {
                            //console.log(doc);
                            if (doc.批示意見 && doc.批示意見.content && (doc.批示意見.content + '').trim() != '') {
                                if ((doc.批示意見.content + '').trim().length == 1) {
                                    if ((doc.批示意見.content + '').trim() == '發') {
                                        isNaN = false;
                                    }
                                } else {
                                    if ((doc.批示意見.content + '').trim().substr(0, 1) == '發' ||
                                        (doc.批示意見.content + '').trim().substr(0, 2) == '不發') {
                                        isNaN = false;
                                    }
                                }
                            }
                        })
                    }
                }

                if (isNaN) {
                    Ext.Msg.alert('提示', '函稿簽核意見應於開頭簽註「發」或「不發！');
                    Ext.Viewport.setMasked(false);
                    var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
                    if (menuLeft) menuLeft.setMasked(false);
                    return;
                }
            }
        }

        if (action == 'readlist' || action == 'flowlist') {
            me.doApprove(action, false, review);
        } else {
            me.doApprove(action, true, review);
        }
    },
    doDocSend: function () {
        var me = this;
        var vm = OA.common.Global.getCurrentViewModel();
        var edition = OA.common.VIMgr.getCurrentEdition();
        var init = OA.common.Global.getInitParas();
        var qs = OA.common.Global.getQ();
        var dosend = false;
        var hadExchange = OA.common.VIMgr.hadExchange();
        if (!hadExchange) dosend = true; //沒轉交換鈕不驗證
        if (vm && vm.DocumentType === '簽') dosend = true;
        if (!dosend && edition.交換狀態 == '1') dosend = true;
        var role = OA.common.Global.getCurrentRole();

        //簡易簽辦不提醒轉交換
        //var isOnlyFollow = OA.common.VIMgr.isOnlyFollow();
        //if (isOnlyFollow) dosend = true;

        if (me.get('sendDataChange')) {
            Ext.Msg.alert('提示', '發文資料已有異動，請重新執行轉交換，上傳發文資料！');
            return;
        }
        if (dosend) {
            edition.線上簽核資訊.簽核流程.異動別 = '發文';
            var version = edition.版號 + '';
            var paras = OA.common.InitParas.doExchange();
            paras.version = version;
            paras.methodId = 'docsend';
            var epaper = OA.common.Global.getCurrentDocFlowRecord().get('epaper');
            if (epaper == undefined) epaper = 'N';

            if (epaper === 'N') {
                OA.common.Bridge.doExit(); //紙本，不簽章
            } else if (epaper === 'N' && !hadExchange) {
                OA.common.Bridge.doExit(); //紙本，不簽章
            } else if (!hadExchange) {
                me.doApprove('checkDone', true);
            } else {
                me.doSave({ action: 'save' }, function () {
                    paras.func = 'doSign';
                    OA.client.File.doFile(paras, function (ret) {
                        OA.common.Bridge.doExit();
                    });
                });

                /*
                //呼叫簽章前先存檔，寫入signFlag
                me.doSave({ action: 'signFlag' }, function () {
                     paras.signFlag = init.signFlag;
                     OA.client.SignFlag.load(paras, function (signRet) {
                         if (signRet.success) {
                             paras.func = 'doSign';
                             OA.client.File.doFile(paras, function (ret) {
                                OA.common.Bridge.doExit();
                             });
                         } else {
                             //兩秒呼叫一次檢查signFlag，檢查超6次，還是false表示異常製作沒有成功存檔，跳出製作，請user重新操作
                             me.doSignFlag(paras, 2);
                         }
                     });
                });
                */
            }
        } else {
            if (role && role.roleId != '02') {
                Ext.Msg.alert('提示', '尚未 （清稿）上傳不可發文！');
            } else {
                Ext.Msg.alert('提示', '尚未轉交換不可發文！');
            }
        }
    },
    /**
     * 2019/06/05 依台北市政府 列管調整回保留追修版本，不自動清稿
     * 產生決行頁面檔
     */
    //onApproveGenpagesTap: function () {
    //    var me = this;
    //    var url = './index.html?app=genpages';
    //    OA.common.Utils.checkEpaper() ? url = url + '&epaper=Y' : url = url + '&epaper=N'
    //    window.open(url, '頁面檔', "width=250,height=250,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
    //    window.getCurrentUser = function () {
    //        var initParas = OA.common.Global.getInitParas();
    //        var paras = Ext.apply({}, initParas);
    //        paras.status = 'docsend';
    //        me.initParas(paras);
    //        return paras;
    //    };
    //    window.goToManagement = function (pageFiles, edition, callback) {
    //        var vm = OA.common.Global.getCurrentViewModel();
    //        edition.線上簽核資訊.簽核流程.異動別 = '發文';
    //        edition.交換狀態 = '1';
    //        OA.common.VIMgr.setCurrentEdition(edition);
    //        var version = edition.版號 + '';
    //        var paras = OA.common.InitParas.doWK({ action: 'docSend' });
    //        paras.pageFiles = pageFiles;
    //        paras.version = version;
    //        paras.methodId = 'docSend';
    //        paras.workFlow = 'N';
    //        paras.tmpCard = 'N';            
    //        paras.func = 'doSign';
    //        paras.path = OA.common.VIMgr.getViContent().入徑;
    //        OA.client.File.doFile(paras, function (ret) {
    //            //簽章完關閉製作畫面
    //            OA.common.Bridge.doExit();
    //        });
    //        //呼叫簽章後關閉頁面檔畫面
    //        if (callback) callback();
    //    }
    //},
    showFormSend: function (button) {
        var vm = OA.common.Global.getCurrentViewModel();
        var paras = OA.common.Global.getInitParas();
        var qs = OA.common.Global.getQ();

        //檢核是否含有一般發文附件及大型附件
        var hasGenBig = false;
        var attach = Ext.getStore('Attach');

        if (attach) {
            var hasGen = false;
            var hasBig = false;
            Ext.Array.each(attach.data.all, function (att) {
                var f = att.get('file');
                if (f) {
                    if (f.folderName == 'big' && f.status == '1') {
                        hasBig = true;
                    } else if (f.folderName == 'attach' && f.status == '1') {
                        hasGen = true;
                    }

                    if (hasGen && hasBig) {
                        hasGenBig = true;
                        return false;
                    }
                }

            })

        }

        if (hasGenBig) {
            Ext.Msg.alert('提示', '檢核發文附件資料中含有，承辦附件（一般附件）及大型附件，請將承辦附件（一般附件），移至大型附件！重新進行上傳動作。')
            return
        }

        var index = 0;
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: '發文資料展開中...' });
        var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
        if (menuLeft) menuLeft.setMasked(true);
        if (vm && vm.ContactList && vm.ContactList.length > 0) {
            Ext.Array.each(vm.ContactList, function (con) {
                if ((con.GROUP + '') == '2') {
                    var data = {};
                    data.qType = '';
                    data.start = 0;
                    data.limit = 1;
                    data.depNo = paras.depNo;
                    data.empNo = paras.empNo;
                    data.dep3ChnName = con.CODENAME;
                    //console.log(data);
                    OA.client.Member.search(data, function (ret) {
                        var childNodes = [];
                        index++;
                        //console.log(ret);
                        if (ret.length != 0 && ret[0].childNodes && ret[0].childNodes.length > 0) {
                            Ext.Array.each(ret[0].childNodes, function (child) {
                                var transType = '2';
                                var transTypename = '紙本';
                                if ((child.get('transType') + '') == '9') {
                                    transType = '9';
                                    transTypename = '電子交換';
                                }
                                childNodes.push({
                                    ADDR: child.get('dep3Addr') || '',
                                    ARCENO: child.get('dep3Zone') || '',
                                    ATTACH: "",
                                    CODE: child.get('dep3No') || '',
                                    CODENAME: child.get('dep3Name') || '',
                                    GROUP: "",
                                    GROUPLIST: "",
                                    KEY: con.KEY,
                                    PEOPLESEND: con.PEOPLESEND,
                                    REALTRANSTYPE: con.REALTRANSTYPE,
                                    TRANSTYPE: transType,
                                    TRANSTYPENAME: transTypename,
                                    TYPE: con.TYPE,
                                    VALUE: child.get('dep3Name') || '',
                                    editAtt: false,
                                    isChange: "N",
                                    isEdit: "Multiple",
                                    tagName: "Contact"
                                })
                            });
                            con.children = childNodes;
                        }
                        //console.log(index);
                        if (index == vm.ContactList.length) {
                            Ext.Viewport.setMasked(false);
                            var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
                            if (menuLeft) menuLeft.setMasked(false);
                            OA.common.Funcs.show('FormSend', null, vm.ContactList);
                        }
                    })

                } else {
                    index++;
                    //console.log(index);
                    if (index == vm.ContactList.length) {
                        Ext.Viewport.setMasked(false);
                        var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
                        if (menuLeft) menuLeft.setMasked(false);
                        OA.common.Funcs.show('FormSend', null, vm.ContactList);
                    }
                }
            });
        } else {
            var paras = OA.common.InitParas.doExchange(false);  //轉交換
            paras.methodId = 'exchange';
            //paras.form = me;
            OA.client.Exchange.excute(paras, function (r) {
                var edition = OA.common.VIMgr.getCurrentEdition();
                edition.交換狀態 = '1';
                //if (qs.projNo) { //評議專案不跳提醒
                //    var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
                //   if (menuLeft) menuLeft.setMasked(false);
                //} else {
                //Ext.Msg.alert('提示', '發文資料上傳完成！');
                var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
                if (menuLeft) menuLeft.setMasked(false);
                //}
            });
        }
    },
    autoReNumber: function (isAutoClear) {
        //console.log('autoReNumber');
        var me = this;
        var initParas = OA.common.Global.getInitParas();
        var butCurrentPage = me.getSegdoc().getPressedButtons()[0];
        var findPaperNo = butCurrentPage.config.paperNo;
        var editPages = OA.common.VIMgr.getCurrentEditionPapers();
        var segItems = me.getSegdoc().getItems().items;

        var preOtSno = '', curOtSno = '';
        // 修改支號錯誤  - by yi-chi chiu
        var subs = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        //var subs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789';
        Ext.Array.each(segItems, function (p) {
            var isNotFollow = p.config.kind != '來文';
            var pNo = p.config.paperNo;
            if (isNotFollow && pNo) {
                if (findPaperNo == pNo) {
                    if (preOtSno && preOtSno.toString().length > 10) {
                        var subNo = preOtSno.toString().Right(1);
                        var idx = subs.indexOf(subNo);
                        var newSubNo = subs.substr(idx + 1, 1);
                        curOtSno = preOtSno.substr(0, 10) + newSubNo;
                    } else {
                        curOtSno = initParas.doSno + '1';
                    }
                    return true;
                }

                var paper = editPages.where("( el, i, res, param ) => el.代碼==" + pNo)[0];
                if (paper.發文文號) preOtSno = paper.發文文號 + '';
            }
        });
        //重覆值最大加一
        if (preOtSno) {
            var maxIdx = 0;
            Ext.Array.each(editPages, function (p) {
                if (p.發文文號) {
                    var subNo = (p.發文文號 + '').Right(1);
                    var idx = subs.indexOf(subNo);
                    if (idx > maxIdx) maxIdx = idx;
                    if (p.發文文號 + '' == curOtSno) {
                        var newSubNo = subs.substr(maxIdx + 1, 1);
                        curOtSno = preOtSno.substr(0, 10) + newSubNo;
                    }
                }
            });
        }
        //console.log(curOtSno);
        if (curOtSno !== '0') {
            Ext.Array.each(editPages, function (p) {
                if (findPaperNo == p.代碼) {
                    p.發文文號 = curOtSno;
                    initParas.sendNo = curOtSno;
                    butCurrentPage.config.sendNo = curOtSno;
                    return true;
                }
            });
        }

        Ext.getCmp('cpaper').sendNoUpdate();
        //if (isAutoClear) {
        //    me.doClearWK(); // create and then sendNoUpdate
        //    me.doEditAction('clear');
        //} else {
        //    //Ext.getCmp('cpaper').sendNoUpdate();
        //}
        Ext.Viewport.setMasked(false);
    },
    autoReNumber2: function (values) {
        //console.log('autoReNumber2');
        var me = this;
        var pages = OA.common.VIMgr.getCurrentEditionPapers();
        var initParas = OA.common.Global.getInitParas();
        var draftCount = 0;
        // 修改支號錯誤  - by yi-chi chiu
        var items = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        //var items = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'.split('');
        Ext.Array.each(pages, function (p) {
            var isIgnore = ['會辦簽', '會核單', '來文'].indexOf(p.名稱) < 0;
            var isDraft = ['簽', '便簽', '便箋', '簡簽', 'A4空白簽'].indexOf(p.文稿類型) < 0;
            if (isDraft && isIgnore) {
                draftCount++;
                p.發文文號 = initParas.doSno + items[draftCount - 1].toString();
            }
        });
        Ext.Array.each(pages, function (p) {
            var isIgnore = ['會辦簽', '會核單', '來文'].indexOf(p.名稱) < 0;
            //var isNotes = ['簽', '便簽', '便箋'].indexOf(p.文稿類型) >= 0;
            var isNotes = OA.common.Utils.isNoteDoc(p.文稿類型);
            if (isNotes && isIgnore) {
                if (values.isNoteAddSubNo) {
                    draftCount++;
                    p.發文文號 = initParas.doSno + items[draftCount - 1].toString();
                } else {
                    p.發文文號 = '';
                }
            }
        });

        me.doClearWK();
        me.doEditAction('clear');

        //Ext.getCmp('cpaper').sendNoUpdate();
    },
    checkAttach: function (callback) {
        var me = this;
        var amount = 0;
        var store = Ext.getStore('Attach');
        Ext.Array.each(store.data.all, function (r) {
            var f = r.get('file');
            if (f.status + '' !== '0' && r.get('sort') == 'attach') {
                amount += f.fileSize;
            }
        });
        //store.each(function (r) {
        //    var f = r.get('file');
        //    if (f.status.toString() !== '0' && r.get('sort') == 'attach') {
        //        amount += f.fileSize;
        //    }
        //})
        var mb = amount / 1024 / 1024;
        if (mb > 10) {
            me.doPanelAttachOK(true, callback);
            return true;
        }
        return false;
    },
    //changeAttachSort: function (checked) {
    //    var store = Ext.getStore('Attach');
    //    // 這種寫法某些情況會造成黑魔法失效 -> 改用Ext Ext.Array.each的語法糖遍歷 - by yi-chi chiu
    //    // store.each(store.getData().all, function(r) {
    //    Ext.Array.each(store.getData().all, function (r) {
    //        var from, to;
    //        if (checked) {
    //            from = 'attach';
    //            to = 'big';
    //        } else {
    //            from = 'big';
    //            to = 'attach';
    //        }
    //        if (r.get('file').status && r.get('file').status + '' !== '0' && r.get('sort') === from) {
    //            r.get('file').folderName = to;
    //            r.set('sort', to);
    //        }
    //    });
    //},
    doPanelAttachOK: function (checked, callback) {
        var me = this;
        var hasBigAttach = false;
        var hasNormalAttach = false;
        var attachCaption = '';
        //var qs = OA.common.Global.getQ();
        var options = {
            action: 'uploadBig',
            biginfo: OA.common.VIMgr.getViContent().入徑.大型資訊,
            attachs: []
        };

        // me.changeAttachSort(checked);

        var store = Ext.getStore('Attach');
        Ext.Array.each(store.getData().all, function (attach) {
            attach.data.isTemp = false;
            if (attach.data.sort === 'big') {
                var f = attach.get('file');
                if (f.status + '' === '1') {
                    options.attachs.push(f);
                    hasBigAttach = true;
                }
            } else if (attach.data.sort === 'attach' && attach.data.file.status + '' !== '0') {
                hasNormalAttach = true;
                /*
                if (attachCaption.length > 0)
                    attachCaption += '、' + attach.data.name.split('.')[0];
                else
                    attachCaption += attach.data.name.split('.')[0];
                */
            }
        });

        if (hasNormalAttach) {
            attachCaption = '如文';
        }

        if (hasBigAttach) {
            var qd = OA.common.Global.getQueryDefault();
            var url = (qd.網址) ? qd.網址.field2 : '';
            attachCaption = '「檔案附件下載請至（' + url + '）」'
        }

        /*
        //自動增加附件檔名及大型附件下載網址至附件說明
        if (hasBigAttach || attachCaption.length > 0) {
            if (hasBigAttach) {
                var qd = OA.common.Global.getQueryDefault();
                console.log(qd);
                var url = (qd.網址) ? qd.網址.field2 : '';
                //2.24.公文線上簽核附件如為大型附件，辦畢以紙本發文，承辦人於送發文上傳發文資料時，針對紙本發文的部分該受文者不修改附件說明為大附件下載區
                Ext.Array.each(options.attachs, function (attachs) {//0217 取得大型附件檔名至附件說明 chloe.sia
                if (attachCaption.length > 0)
                    attachCaption += '、' +attachs.fileKey.split('.')[0];
                else
                    attachCaption +=attachs.fileKey.split('.')[0];
                });
                var current = OA.common.VIMgr.getCurrentEdition();
                //var checkNumber = current.驗證碼;

                //if (!checkNumber) {
                //    checkNumber = OA.common.Utils.checkNumber();
                //    current.驗證碼 = checkNumber;
                //}
                //attachCaption += '，' + '「檔案附件下載請至（' + url + '）' + '驗證碼：' + checkNumber+'」';

                attachCaption += '，' + '「檔案附件下載請至（' + url + '）」'
            }
        }*/

        //檔管驗證用
        //if (qs.app === 'editor' || qs.app === 'offline') {
        //    OA.common.Paper.main().updateContent({ "附件": attachCaption });
        //} else if (hasBigAttach) {
        //    OA.common.Paper.main().updateContent({ "附件": attachCaption });
        //}

        if (!hasBigAttach) {
            var vm = OA.common.Global.getCurrentViewModel();
            if (vm && vm.附件 != undefined) {
                if ((vm.附件 + '').trim() == '') {
                    OA.common.Paper.main().updateContent({ "附件": attachCaption });
                }
            }
        } else {
            OA.common.Paper.main().updateContent({ "附件": attachCaption });
        }


        me.thenPanelAttachSave(callback);
    },
    thenPanelAttachSave: function (callback) {
        var me = this;
        me.loadAttachsCount();
        var qs = OA.common.Global.getQ();
        //取號前不自動存檔
        if (qs.app === 'editor') {
            Ext.Viewport.setMasked(false);
            return;
        }

        /*
        if (qs.app === 'editor' || qs.app === 'offline') {
            this.doSaveFolder({ action: 'save', isNotPopup: true }, callback);
        } else {
            this.doSave({ action: 'save' }, callback);
        }
        */
        this.doSave({ action: 'save', unckFileYear: true }, callback);
    },
    /**
     * 清稿編輯／完成
     */
    onEditTap: function (button) {
        this.doEditAction(button.config.action);
    },
    doEditAction: function (action) {
        var me = this, ctr = me.getCpaper(), svg = ctr.getSvgPaper();
        if (svg) svg.setMode('select');

        if (action === 'clear') {
            me.updateDocAreaHidden('clearPaper', 'clear');
        } else {
            me.updateDocAreaHidden('edit', action);
        }
        Ext.Viewport.setMasked(false);
    },
    /**
     * Save
     */
    onSaveTap: function (button, isNotPopup, callback) {
        if (button && button.config.action == 'save') isNotPopup = false;
        if (!button && callback) {
            this.doSaveFolder({ action: (button) ? button.config.action : 'save', isNotPopup: isNotPopup }, callback);
        } else {
            this.doSaveFolder({ action: (button) ? button.config.action : 'save', isNotPopup: isNotPopup });
        }


    },
    doSaveFolder: function (options, callback) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var action = options.action || 'save';
        var isNotPopup = options.isNotPopup;
        var saveFolder = OA.common.FileMgr.getSaveFolder();
        var openFolder = OA.common.FileMgr.getOpenDialogPath();
        if (!openFolder) action = 'save';

        var values = {
            action: action
        };

        if (options.attachs) values.attachs = options.attachs;

        var isShowInput = false;
        if (saveFolder) isShowInput = false;
        if (!isNotPopup) isShowInput = true;

        if (!openFolder) {
            var isDestop = Ext.os.deviceType === 'Desktop';
            var doOffline = (qs.app === 'editor' || qs.app === 'offline' || qs.sFlag === 'Y') && isDestop;
            if (doOffline) {
                isShowInput = true;
                isNotPopup = false;
            } else {
                isShowInput = false;
            }
        }

        if (isShowInput) {
            var vm = OA.common.Global.getCurrentViewModel();
            var subStr = '';
            if (vm != undefined) {
                if (vm.開會事由 && vm.開會事由.length > 0) vm.主旨 = vm.開會事由;
                if (vm.會勘事由 && vm.會勘事由.length > 0) vm.主旨 = vm.會勘事由;
                if (vm.主旨 != undefined && (vm.主旨 + '').trim() != '') {
                    if (vm.主旨.length > 9) {
                        subStr = vm.主旨.substring(0, 10);
                    } else {
                        subStr = vm.主旨;
                    }
                }
            }
            var newSaveFolder = Ext.util.Format.date(new Date(), "mdHis") + '.' + subStr;
            if (isNotPopup) {
                OA.common.FileMgr.setSaveFolder(newSaveFolder);
                me.doSave(values, callback);
            } else {
                if (qs.sFlag === 'Y') { //密件公文
                    //var hasFolder = OA.common.FileMgr.getOpenDialogPath();
                    //if (hasFolder) {
                    //    me.doSave(values, callback);
                    //} else {
                    //    if (qs.app == 'editor') {
                    //Ext.Msg.prompt('', '儲存本機目錄: ', function (key, value) {
                    //    if (key === 'ok') {
                    //        values.fromOpenFolder = openFolder;
                    //        values.fromSaveFolder = saveFolder;
                    //        values.toSaveFolder = value;
                    //        values.defaultPath = OA.common.FileMgr.getDefaultPath();
                    //        OA.common.FileMgr.setSaveFolder(value);
                    //        OA.common.FileMgr.setOpenDialogPath('');//另存新檔要重設，下次存檔才會是另存位置
                    //        me.doSave(values, callback);
                    //    } else {
                    //        // 當使用者按下取消時解除遮罩鎖定 - by yi-chi chiu
                    //        Ext.Viewport.setMasked(false);
                    //    }
                    //}, this, false, newSaveFolder);
                    //}
                    //}
                    return;
                }
                //創稿匯入 Import 行為方式為：取代文稿   Chloe.sia
                OA.common.FileMgr.setSaveFolder(newSaveFolder);
                me.doSave(values, callback);

                //Ext.Msg.prompt('', '儲存本機目錄: ', function (key, value) {
                //    if (key === 'ok') {
                //        values.fromOpenFolder = openFolder;
                //        values.fromSaveFolder = saveFolder;
                //        values.toSaveFolder = value;
                //        values.defaultPath = OA.common.FileMgr.getDefaultPath();
                //        OA.common.FileMgr.setSaveFolder(value);
                //        OA.common.FileMgr.setOpenDialogPath('');//另存新檔要重設，下次存檔才會是另存位置
                //        me.doSave(values, callback);
                //    } else {
                //    	// 當使用者按下取消時解除遮罩鎖定 - by yi-chi chiu
                //    	 Ext.Viewport.setMasked(false);
                //    }
                //}, this, false, newSaveFolder);
            }
        } else {
            me.doSave(values, callback);
        }
    },
    doSave: function (values, callback, trueImport) {
        // 存檔時鎖定，避免切換函稿造成重複doStoreXDI - by yi-chi chiu
        Ext.Viewport.setMasked(true);
        // 判斷已存檔功能 - by yi-chi chiu
        OA.app.isSavedFlag = true;
        var me = this;
        var qs = OA.common.Global.getQ();
        var vm = OA.common.Global.getCurrentViewModel();
        var wk = OA.common.Global.getCurrentWKContent();
        var paras = OA.common.Global.getInitParas();
        // qs.app === 'check' ,'review', 'editor', 'offline' , historyVerion, 其paper 狀態ActiveStatus 存為 saved 
        OA.common.Paper.setActiveStatus('saved');

        //console.log(qs);
        /*
        //檢查發字號長度是否為11碼,自動補碼
        if (qs.app == 'approve') {
            if (values && values.action === 'save' && wk) {
                var sendtagText = OA.common.Utils.getTagText(wk, '發文字號');
                if (sendtagText) {
                    console.log(sendtagText);
                    if (sendtagText.childNodes) {
                        var flow = '';
                        Ext.Array.each(sendtagText.childNodes, function (node) {
                          
                            if (node.Key == '發文字號_流水號_支號') {
                                flow = node.Value;
                            }
                            if (node.Key == '發文字號_支號') {
                                if ((node.Value + '').trim() == '') {
                                    Ext.Msg.alert("提醒", "發文字  支號為空白！將自補碼");
                                    var draftCount = OA.common.DIMgr.getDraftCount();
                                    if (draftCount == 1) draftCount = 0;
                                    var strFlowNo = OA.common.DIMgr.flowNoPlus(flow, draftCount);
                                  // var strFlowNo = OA.common.DIMgr.flowNoPlus(strFlowNo, draftCount);

                                    console.log(strFlowNo);

                                    node.Value = (strFlowNo + '');
                                }
                            }
                        })
                    }
                }
            }
        }
        */

        //獎懲令wk.DocumentType會帶成令，找不到是從那變的先用paras判斷不一致再替換
        if ((paras.documentType === '獎懲令' || paras.documentType === '派免令') &&
            wk && wk.DocumentType !== paras.documentType && values.action != 'add')
            wk.DocumentType = paras.documentType;

        var historyVerion = OA.common.VIMgr.getHistoryVersion();
        if (qs.app === 'check' || qs.app === 'review' || historyVerion) {
            if (callback) callback();
            return;
        }

        if (qs.app === 'approve') {
            if (values && values.action === 'save' && vm) {
                //要判斷檔號是不是空白,要去空格再判斷 
                if (OA.common.Paper.main().hasField('檔號') && paras.kind !== '來文' && qs.sFlag !== 'Y') {
                    if (values.unckFileYear) {
                    } else {
                        if (vm.檔號.trim() === '' || vm.保存年限.toString().trim() === '') {
                            Ext.Msg.alert('提示', '檔號及保存年限不可空白');
                            me.getSegdoc().setPressedButtons([]);//按鈕復原
                            // 沒有callbak，防呆解鎖
                            if (Ext.getCmp('segDocSelector'))
                                Ext.getCmp('segDocSelector').setDisabled(false);
                            Ext.Viewport.setMasked(false);
                            return;
                        }
                    }
                    /*
                    else if (OA.common.Paper.main().hasField('檔號') && qs.sFlag !== 'Y') {
                        if (parseInt(vm.保存年限) > 30 && OA.common.Utils.checkEpaper() && qs.app !== 'offline') {
                            Ext.Msg.alert('提示', '保存年限超過30年不可使用線上簽核！');
                            me.getSegdoc().setPressedButtons([]);//按鈕復原
                            // 沒有callbak，防呆解鎖
                            if (Ext.getCmp('segDocSelector'))
                                Ext.getCmp('segDocSelector').setDisabled(false);
                            Ext.Viewport.setMasked(false);
                            return;
                        }
                    }
                    */

                    //檢核主旨空白（表單不檢核），wk重組後才處理
                    if (!vm.templateUrl && values.action === 'save' && qs.sFlag !== 'Y') {
                        if (paras.kind !== '來文') {//vm.kind 會亂變動.....
                            var docBtn = me.getSegdoc().getItems().items;
                            //判斷有沒有文稿
                            var hasPaper = false;
                            Ext.Array.each(docBtn, function (btn) {
                                if (btn.config && btn.config.text) {
                                    if (btn.config.text) {
                                        if (btn.config.text.indexOf('稿') != -1) {
                                            hasPaper = true;
                                        } else if (btn.config.text.indexOf('簽') != -1) {
                                            hasPaper = true;
                                        } else if (btn.config.text.indexOf('來文') != -1) {
                                            hasPaper = true;
                                        }
                                    }
                                }
                            });
                            if (hasPaper) {
                                if (!vm.主旨 || vm.主旨 === undefined || vm.主旨.toString().trim() === '') {
                                    Ext.Msg.alert('提示', '主旨不可空白！');
                                    //創簽稿要關閉創簽稿選單畫面
                                    var newDocForm = Ext.getCmp('FormNewDoc');
                                    if (newDocForm) newDocForm.hide();
                                    //多稿才復原                            

                                    if (docBtn && docBtn.length > 0) {
                                        Ext.Array.each(docBtn, function (btn) {
                                            if (btn.config && btn.config.paperNo) {
                                                if (paras.paperNo == btn.config.paperNo) {
                                                    me.getSegdoc().setPressedButtons(btn);//按鈕復原
                                                }
                                            }
                                        });
                                    }
                                    // 沒有callbak，防呆解鎖
                                    if (Ext.getCmp('segDocSelector'))
                                        Ext.getCmp('segDocSelector').setDisabled(false);
                                    Ext.Viewport.setMasked(false);
                                    return;
                                }
                            } else {
                                //沒有文稿 解鎖return
                                Ext.Viewport.setMasked(false);
                                if (callback) callback();
                                return;
                            }
                        }
                    }
                }
            }
        }

        if (!wk) {
            // 沒有callbak，防呆解鎖
            if (Ext.getCmp('segDocSelector'))
                Ext.getCmp('segDocSelector').setDisabled(false);
            Ext.Viewport.setMasked(false);
            if (callback) callback();
            return;
        }

        var ctr = me.getCpaper();
        var svg = ctr.getSvgPaper();
        if (svg) {
            svg.clearSelection();
            svg.textActions.toSelectMode();
            me.getCpaper().svgUpdateLayout();  //文字重排
        }

        me.saveSuggestionVI(); //更新文稿批示意見
        var success = ctr.saveKDRichTextBlock();
        if (success == false) {
            // 沒有callbak，防呆解鎖
            if (Ext.getCmp('segDocSelector'))
                Ext.getCmp('segDocSelector').setDisabled(false);
            Ext.Viewport.setMasked(false);
            return;
        }

        
        ctr.saveFileYear();
        if (paras.kind !== '來文') {
            me.doLevel();
            OA.common.Paper.setActiveStatus('saved'); // 儲存狀態會被重複覆蓋為 edit
        }
        me.saveStickyWK();
        me.saveOverPrintWK();
        me.saveSealWK();
        //預設儲存後下一步
        if (!callback) {
            callback = function (ret) {
                if (values.action == 'upload' || values.action == 'create') {
                    Ext.MessageBox.YESNO = [
                        { text: '確定', itemId: 'yes', ui: 'confirm' },
                        { text: '送陳會', itemId: 'no', ui: 'action' }
                    ];
                    Ext.MessageBox.YES = [
                        { text: '確定', itemId: 'yes', ui: 'confirm' }
                    ];
                    if (qs.epaper === 'N') {
                        if (qs.projNo) { //評議專案內創稿不顯示
                            try {
                                if (OA.common.Global.getWinOpener()._doChangeMenu) {
                                    OA.common.Global.getWinOpener()._doChangeMenu('1');
                                } else {
                                    var dtreeContent = topKdmaker.getDTreeContent();
                                    if (dtreeContent) dtreeContent._doChangeMenu('1');
                                }
                                topKdmaker.doEditorAppFinishReloadList(ret.orgId, ret.doSno);
                            } catch (e) {
                                console.log('_doChangeMenu not found');
                            }
                            OA.common.Bridge.doClose();

                        } else {
                            Ext.Msg.show({
                                title: '取號完成！',
                                //message: ret.orgId + ret.doSno,
                                message: ret.doSno,
                                width: 300,
                                buttons: Ext.MessageBox.YES,
                                iconCls: Ext.MessageBox.INFO,
                                fn: function (buttonId, a, b) {
                                    var topKdmaker = OA.common.Global.getWinOpener().kdMaker;
                                    if (buttonId == 'yes') {
                                        try {
                                            if (OA.common.Global.getWinOpener()._doChangeMenu) {
                                                OA.common.Global.getWinOpener()._doChangeMenu('1');
                                            } else {
                                                var dtreeContent = topKdmaker.getDTreeContent();
                                                if (dtreeContent) dtreeContent._doChangeMenu('1');
                                            }
                                            topKdmaker.doEditorAppFinishReloadList(ret.orgId, ret.doSno);
                                        } catch (e) {
                                            console.log('_doChangeMenu not found');
                                        }
                                        OA.common.Bridge.doClose();
                                    }
                                }
                            });
                        }
                    } else {
                        if (qs.projNo) { //評議專案內創稿不顯示
                            try {
                                if (OA.common.Global.getWinOpener()._doChangeMenu) {
                                    OA.common.Global.getWinOpener()._doChangeMenu('1');
                                } else {
                                    var dtreeContent = topKdmaker.getDTreeContent();
                                    if (dtreeContent) dtreeContent._doChangeMenu('1');
                                }
                                topKdmaker.doEditorAppFinishReloadList(ret.orgId, ret.doSno);
                            } catch (e) {
                                console.log(top);
                                console.log('_doChangeMenu not found');
                            }
                            OA.common.Bridge.doClose();
                        } else {
                            Ext.Msg.show({
                                title: '取號完成！',
                                //message: ret.orgId + ret.doSno,
                                message: ret.doSno,
                                width: 300,
                                buttons: Ext.MessageBox.YES,    //<------- 1224 創簽稿取號後，拿掉送陳會按鈕  Chloe.sia
                                iconCls: Ext.MessageBox.INFO,
                                fn: function (buttonId, a, b) {
                                    var topKdmaker = OA.common.Global.getWinOpener().kdMaker;
                                    if (buttonId == 'yes') {
                                        try {
                                            if (OA.common.Global.getWinOpener()._doChangeMenu) {
                                                OA.common.Global.getWinOpener()._doChangeMenu('1');
                                            } else {
                                                var dtreeContent = topKdmaker.getDTreeContent();
                                                if (dtreeContent) dtreeContent._doChangeMenu('1');
                                            }
                                            topKdmaker.doEditorAppFinishReloadList(ret.orgId, ret.doSno);
                                        } catch (e) {
                                            console.log(top);
                                            console.log('_doChangeMenu not found');
                                        }
                                    } else if (buttonId == 'no') {
                                        topKdmaker.doEditorAppFinish('Y', ret.orgId, ret.doSno);
                                    }
                                    OA.common.Bridge.doClose();
                                }
                            });
                        }
                    }
                    return;
                }

                if (values.action == 'draft') {
                    Ext.Msg.alert('草稿', '草稿上傳完成！');
                    Ext.Viewport.setMasked(false);
                    return
                } else if (qs.app == 'draft' && values.action == 'save') {
                    Ext.Msg.alert('草稿', '草稿儲存完成！');
                    Ext.Viewport.setMasked(false);
                    return
                }

                if (qs.app === 'approve') {
                    if (qs.sFlag === 'Y') {
                        var vi = OA.common.VIMgr.getViContent();
                        var items = OA.common.VIMgr.load(vi);
                        me.getSegdoc().setItems(items);
                        OA.common.Global.getApp().getController('OA.controller.Menu').segdocPressed();  // on onPaperTaggle
                    } else {
                        var r = OA.common.Global.getCurrentDocFlowRecord();
                        if (qs.dialogType == '4') r.set('dialogType', '4');
                        me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r.data);
                    }
                } else if (qs.app === 'editor' || qs.app === 'offline') {
                    var vi = OA.common.VIMgr.getViContent();
                    var init = OA.common.Global.getInitParas();
                    if (init && init.paperOrder == '1') {
                        var vm = OA.common.Global.getCurrentViewModel();
                        if (vm && vm.主旨) {
                            if (vm.開會事由 && vm.開會事由.length > 0) vm.主旨 = vm.開會事由;
                            if (vm.會勘事由 && vm.會勘事由.length > 0) vm.主旨 = vm.會勘事由;
                            vi.主旨 = vm.主旨;
                        }
                    }
                    var items = OA.common.VIMgr.load(vi);
                    me.getSegdoc().setItems(items);
                    OA.common.Global.getApp().getController('OA.controller.Menu').segdocPressed();  // on onPaperTaggle

                    if (trueImport == true) {  //創稿匯入 Import 行為方式為：取代文稿   Chloe.sia
                        var paperNo = Ext.getCmp('segDocSelector').getItems().items[0].config.paperNo
                        me.deleteViReload([paperNo]);
                    }


                }
            }
        }

        /*
        // 防呆鎖： 防止使用者太過快速切換頁籤而導致WK遭異常複寫 - by yi-chi chiu
        if (Ext.getCmp('segDocSelector'))
            Ext.getCmp('segDocSelector').setDisabled(true);
        */
        // on onPaperTaggle
        OA.client.WK.excute(values, callback);

        /*
        // 防呆鎖： 解鎖定時器 - by yi-chi chiu
        setTimeout(function () {
            if (Ext.getCmp('segDocSelector'))
                Ext.getCmp('segDocSelector').setDisabled(false);
            console.log('------unlock------');
        }, 1500);
        */
    },
    /**
     * save 便利貼 wk
     */
    saveStickyWK: function () {
        var wk = OA.common.Global.getCurrentWKContent();
        if (!wk) return;

        var pos = wk.childNodes.map(function (e) {
            if (e) return e.tagName;
        }).indexOf('StickyNote');
        var removeCount = Ext.Array.filter(wk.childNodes, function (child) {
            if (child) return child.tagName == 'StickyNote';
        }).length;
        if (pos < 0) pos = wk.childNodes.length;

        var insertItems = [];
        Ext.getStore('Sticky').each(function (record) {
            var item = record.data;
            item.tagName = 'StickyNote';
            // 處理存檔時便利貼高度變大問題 - by yi-chi chiu
            item.height = parseInt(item.height) - 18;
            // 處理存檔時便利貼寬度變小問題 - by yi-chi chiu
            item.width = parseInt(item.width) + 2;
            item.text = item.text.replace(/\n/g, '&crarr;');
            insertItems.push(item);
        });
        Ext.Array.replace(wk.childNodes, pos, removeCount, insertItems);
    },
    /**
     * save 職名章 wk
     */
    saveSealWK: function () {
        var wk = OA.common.Global.getCurrentWKContent();
        if (!wk) return;
        var pos = wk.childNodes.map(function (e) {
            if (e) return e.tagName;
        }).indexOf('Sealinfo');
        var removeCount = Ext.Array.filter(wk.childNodes, function (child) {
            if (child) return child.tagName == 'Sealinfo';
        }).length;
        if (pos < 0) pos = wk.childNodes.length;

        var insertItems = [];
        Ext.getStore('Sealinfo').each(function (record) {
            var item = record.data;
            item.tagName = 'Sealinfo';
            insertItems.push(item);
        });

        Ext.Array.replace(wk.childNodes, pos, removeCount, insertItems);
    },
    /**
    * save 套印資料 wk
    */
    saveOverPrintWK: function () {
        var wk = OA.common.Global.getCurrentWKContent();
        if (!wk) return;

        var pos = wk.childNodes.map(function (e) {
            if (e) return e.tagName;
        }).indexOf('OverPrint');
        var removeCount = Ext.Array.filter(wk.childNodes, function (child) {
            if (child) return child.tagName == 'OverPrint';
        }).length;
        if (pos < 0) pos = wk.childNodes.length;

        var insertItems = [];
        Ext.getStore('OverPrint').each(function (record) {
            var item = record.data;
            item.tagName = 'OverPrint';
            insertItems.push(item);
        });
        Ext.Array.replace(wk.childNodes, pos, removeCount, insertItems);
    },
    doApprove: function (action, isAuto, review) {
        //console.log(action);
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: '流程處理中...' });
        var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
        var edition = OA.common.VIMgr.getCurrentEdition();
        if (menuLeft) menuLeft.setMasked(true);
        var me = this;
        me.saveSuggestionVI();   //更新文稿批示意見

        var paras = OA.common.InitParas.doWK({ action: action });
        paras.func = 'doSign';
        paras.version = OA.common.VIMgr.getCurrentEdition().版號 + ''; //簽核動作採用新版次
        paras.methodId = action;
        paras.retDesc = Ext.getCmp('suggestionText').getValue(); //TOD稿問題
        paras.isAuto = isAuto;
        paras.signCnt = 1;

        if (review != undefined) {
            if (review) {
                paras.review = 'Y';
            } else {
                paras.review = 'N';
            }
        }

        var approveAuto = false;
        var Role = OA.common.Global.getCurrentRole();
        //Role.roleId = '16';
        //if (Role && Role.roleId == '16') approveAuto = true;
        paras.approveAuto = approveAuto;

        //會辦簽稿
        var currentUnitNote = OA.common.VIMgr.getUnitNote();
        if (currentUnitNote) paras.parlPaperNo = currentUnitNote.文稿代碼;

        var isNotEdit = me.getButSave() && me.getButSave().getDisabled();
        //檢核有無按過編輯
        if (isNotEdit) {
            //console.log(me.getIsRole15Edited());
            isNotEdit = !me.getIsRole15Edited();
        }

        //簽稿收發
        var qs = OA.common.Global.getQ();

        if (qs.isRole15 && edition) {
            if (edition.isTemp !== 'Y') {
                isNotEdit = false;
                me.setIsRole15Edited(true);
                Ext.Msg.alert('提醒', '此份公文已有編修或存檔過，請簽章！');
            }
        }

        if (qs.isRole15 && isNotEdit) {
            //console.log(edition);
            OA.common.Bridge.goToManagement(paras);
            Ext.Viewport.setMasked(false);
            if (menuLeft) menuLeft.setMasked(false);
            return;
        }

        //紙本不簽章
        var epaper = OA.common.Global.getCurrentDocFlowRecord().get('epaper');
        if (epaper === 'N') {
            OA.common.Bridge.goToManagement(paras);
            Ext.Viewport.setMasked(false);
            if (menuLeft) menuLeft.setMasked(false);
            return;
        }



        me.doSave({ action: 'save' }, function () {
            OA.client.File.doFile(paras, function (ret) {
                console.log('呼叫簽章第 ' + paras.signCnt + ' 次');
                if (ret && ret.reSign) {
                    paras.signCnt = ret.signCnt;
                    OA.client.File.doFile(paras, function (ret) {
                        if (!ret) {
                            OA.common.Bridge.goToManagement(paras);
                            Ext.Viewport.setMasked(false);
                            menuLeft.setMasked(false);
                        }
                    });
                } else {
                    OA.common.Bridge.goToManagement(paras);
                    Ext.Viewport.setMasked(false);
                    menuLeft.setMasked(false);
                }
            });
        });

        /*
        me.doSave({ action: 'save' }, function () {
            OA.client.File.doFile(paras, function (ret) {
                OA.common.Bridge.goToManagement(paras);
                Ext.Viewport.setMasked(false);
                menuLeft.setMasked(false);
            });
        })
        */

        /*
        //呼叫簽章前先存檔，寫入signFlag
        me.doSave({ action: 'signFlag' }, function () {
             //檢核是否有簽章flag，有才呼叫簽章
             OA.client.SignFlag.load(paras, function (signRet) {
                 //簽章後回管理走流程
                 if (signRet.success) {
                     OA.client.File.doFile(paras, function (ret) {
                        OA.common.Bridge.goToManagement(paras);
                        Ext.Viewport.setMasked(false);
                        menuLeft.setMasked(false);
                     });
                 } else {
                     me.doSignFlag(paras, 2);
                 }
             });
        });
        */
    },
    doBuchen: function (action) {//補陳
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: '流程處理中...' });
        var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
        if (menuLeft) menuLeft.setMasked(true);
        var me = this;
        me.saveSuggestionVI();   //更新文稿批示意見

        var paras = OA.common.InitParas.doWK({ action: 'approve' });
        paras.func = 'doSign';
        paras.version = OA.common.VIMgr.getCurrentEdition().版號 + ''; //簽核動作採用新版次
        paras.methodId = 'buchen';
        paras.retDesc = Ext.getCmp('suggestionText').getValue(); //TOD稿問題
        paras.isAuto = true;

        //會辦簽稿
        //var currentUnitNote = OA.common.VIMgr.getUnitNote();
        //if (currentUnitNote) paras.parlPaperNo = currentUnitNote.文稿代碼;

        //var isNotEdit = me.getButSave() && me.getButSave().getDisabled();

        ////簽稿收發
        //var qs = OA.common.Global.getQ();
        //if (qs.isRole15 && isNotEdit) {
        //    OA.common.Bridge.goToManagement(paras);
        //    Ext.Viewport.setMasked(false);
        //    menuLeft.setMasked(false);
        //    return;
        //}

        ////紙本不簽章
        //var epaper = OA.common.Global.getCurrentDocFlowRecord().get('epaper');
        //if (epaper === 'N') {
        //    OA.common.Bridge.goToManagement(paras);
        //    Ext.Viewport.setMasked(false);
        //    menuLeft.setMasked(false);
        //    return;
        //}

        //簽章後回管理走流程
        //console.log(paras);
        // OA.client.File.doFile(paras, function (ret) {
        //OA.common.Bridge.goToManagement(paras);
        var win = OA.common.Global.getWinOpener();
        var topKdmaker = win.kdMaker;
        var dtreeContent = topKdmaker.getDTreeContent();
        if (action == 'doBuchen') { //補核
            dtreeContent.doBuchen(paras.gbDocflowId);
        } else if (action == 'backBuchen') {//退回
            dtreeContent.backBuchen(paras.gbDocflowId);
        }
        var qs = OA.common.Global.getQ();
        qs.reload = 'N';
        setTimeout(function () {
            OA.common.Bridge.doClose();
        }, 2000);
        return;
        //Ext.Viewport.setMasked(false);
        //menuLeft.setMasked(false);
        // });
    },
    /**
     * 按下 關閉icon
     */
    onCloseTap: async function (button) {
        const handleClose = OA.common.Bridge.doClose;
        var me = this;
        OA.client.WK.autoSaveStop();

        // 創稿後強制重讀簽核資料夾，已存入草稿
        var item = OA.common.Global.getRefreshDocflow();
        if (item) { 
            var doSno = item.get('doSno');
            var menuId = OA.common.Global.getCurrentMenu();
            OA.client.DocFlow.loadMenu(menuId, function () {
                if (me.getDocList()) {
                    var r = me.getDocList().getStore().findRecord('doSno', doSno);
                    me.getDocList().deselectAll(false);
                    me.getDocList().select(r, false, false);
                }
            });
        }

        
        const confirmDialog = OA.common.Utils.confirmDialog;
        const isClose = await confirmDialog("提醒", "確認是否關閉編輯畫面?");
        if(isClose !== 'yes') {
            return; // 取消關閉視窗
        }
        
        
        // 關閉視窗前, 是否存入草稿, 或 存檔判斷
        const wk = OA.common.Global.getCurrentWKContent();
        const qs = OA.common.Global.getQ();
        if ((qs.app !== 'editor' && qs.app !== 'approve') || !wk) {
            handleClose(); // 不須存入草稿, 直接關閉視窗
        }

        if(qs.app === 'editor') {
            const isSaveDraft = await confirmDialog("提醒", "是否儲存成草稿?");
            if (isSaveDraft === 'yes') {
                me.doSave({ action: 'draft' }, handleClose);// 選擇存入草稿, 成功存入後, 關閉視窗
            } else {
                handleClose(); // 選擇不存入草稿, 直接關閉視窗
            }
        }

        if(qs.app === 'approve') {
            const isSaved = await confirmDialog("提醒", "是否存檔?");
            if (isSaved === 'yes') {
                me.doSave({ action: 'save' }, handleClose); // 選擇存檔, 成功存入後, 關閉視窗
            } else {
                handleClose(); // 選擇不存檔, 直接關閉視窗
            }
        }
    },
    /**
     * 縮放
     */
    onZoomTap: function (button) {
        console.log('onZoomTap');
        var cpaper2 = Ext.getCmp('cpaper2');
        if (this.getCpaper().getRatio() != 2 && this.getCpaper().getRatio() != 0.67) {
            button.setIconCls('fa-search-minus');

            this.getCpaper().editActions().zoom(2);
            this.getCpaper().getParent().setScrollable({
                direction: 'both',
                directionLock: false
            });
            if (cpaper2) {
                cpaper2.editActions().zoom(2);
                cpaper2.getParent().setScrollable({
                    direction: 'both',
                    directionLock: false
                });
            }
        } else {
            button.setIconCls('fa-search-plus');
            this.getCpaper().editActions().zoom();
            this.getCpaper().getParent().getScrollable().getScroller().scrollTo(0);
            this.getCpaper().getParent().setScrollable({
                direction: 'vertical',
                directionLock: true
            });
            if (cpaper2) {
                cpaper2.editActions().zoom();
                cpaper2.getParent().getScrollable().getScroller().scrollTo(0);
                cpaper2.getParent().setScrollable({
                    direction: 'vertical',
                    directionLock: true
                });
            }
        }
    },
    /**
     * 縮放
     */
    onZoomChange: function (ctr, newValue, oldValue, eOpts) {
        if (this.getCpaper().editActions() == false) { //0313 會辦狀態鎖定文稿 正常縮放 Chloe.sia
            this.getCpaper().setIsLockPaper(false);
            this.getCpaper().editActions().zoom(newValue);

            var directionBoth = {
                direction: 'both',
                directionLock: false
            }

            var directionVertical = {
                direction: 'vertical',
                directionLock: true
            }

            var baseValue = 1;
            var selectZoom = Ext.getCmp('zoomRatio');
            selectZoom.getStore().each(function (r, index, length) {
                if (r.get('value') == '頁寬') baseValue = r.get('key')
            });

            var scoller = this.getCpaper().getParent().getScrollable().getScroller();
            var direct = (newValue > baseValue) ? directionBoth : directionVertical;
            if (direct.directionLock) scoller.scrollTo(0);

            this.getCpaper().getParent().setScrollable(direct);

            var cpaper2 = Ext.getCmp('cpaper2');
            if (cpaper2) {
                cpaper2.editActions().zoom(newValue);
                cpaper2.getParent().setScrollable(direct);
            }
            this.getCpaper().setIsLockPaper(true);
        } else {
            this.getCpaper().editActions().zoom(newValue);

            var directionBoth = {
                direction: 'both',
                directionLock: false
            }

            var directionVertical = {
                direction: 'vertical',
                directionLock: true
            }

            var baseValue = 1;
            var selectZoom = Ext.getCmp('zoomRatio');
            selectZoom.getStore().each(function (r, index, length) {
                if (r.get('value') == '頁寬') baseValue = r.get('key')
            });

            var scoller = this.getCpaper().getParent().getScrollable().getScroller();
            var direct = (newValue > baseValue) ? directionBoth : directionVertical;
            if (direct.directionLock) scoller.scrollTo(0);

            this.getCpaper().getParent().setScrollable(direct);

            var cpaper2 = Ext.getCmp('cpaper2');
            if (cpaper2) {
                cpaper2.editActions().zoom(newValue);
                cpaper2.getParent().setScrollable(direct);
            }
        }

    },
    /**
     * 介接參數設定
     */
    initParas: function (options, mode) {
        var me = this;
        var ctr = me.getCpaper();
        ctr.saveKDRichTextBlock();  //更新KDRichTextBlock
        var paras = ctr.getCreateParas() || {};
        paras.wkSource = Ext.clone(paras.wkContent);
        paras.vi = OA.common.VIMgr.getViContent();
        paras.initParas = OA.common.Global.getInitParas();
        paras.sealXml = OA.common.DIMgr.getSealXml();
        paras.approveSeal = OA.common.Global.getApproveSeal();
        paras.queryDefault = OA.common.Global.getQueryDefault();
        if (mode == 'overprint') {
            paras.printdata = options;
            paras.extraTabs = null;
            paras.sendOptions = null;

            //處理變數
            var VariablePrint = Ext.getStore('VariablePrint');
            if (VariablePrint && VariablePrint.data.all.length > 0) {
                paras.VariablePrint = VariablePrint;
            }
        } else if (mode == 'async') {
            //追蹤修訂需要呼叫到wk, paras兩筆資料
            var asyncPapers = OA.common.Global.getOSvgAsync() || [];
            window.asyncPapers = asyncPapers
            window.getAsyncPapers = function () {
                return asyncPapers;
            };

            var asyncWk = Ext.clone(paras.wkSource);
            window.CurrentWKContent = asyncWk;
            window.getCurrentWKContent = function () {
                return asyncWk;
            }

            var asyncParas = Ext.clone(paras);
            window.InitParas = asyncParas;
            window.getInitParas = function () {
                return asyncParas;
            }
        } else if (options) {
            Ext.apply(paras, options);
        } else {
            paras.extraTabs = null;
            paras.sendOptions = null;
        }
        window.initPreviewParas = paras;
        window.getInitPreviewParas = function () {
            // console.log(paras);
            return paras;
        };
        if (typeof require !== 'undefined') {
            require('electron').remote.getGlobal('initParas').preview = JSON.stringify(paras);
        }
    },
    /**
     * 列印(內)
     */
    onPrintTap: function (autoPrint) {

        var me = this;
        var vm = OA.common.Global.getCurrentViewModel();
        var Role = OA.common.Global.getCurrentRole();
        var docSend = false;

        //Role.reload = '02';
        //console.log(Role);
        if (Role && Role.roleId == '02') docSend = true;

        me.initParas();

        var url = './index.html?app=preview&by=dom';
        var qs = OA.common.Global.getQ();
        url = url + '&epaper=' + ((qs.epaper === 'N') ? 'N' : 'Y'); //是否為紙本
        if (qs.app === 'offline') url = url + '&offline=Y';

        //密件公文取號後增加doSno
        if (qs.sFlag && qs.doSno) {
            url = url + '&sFlag=Y' + '&doSno=' + qs.doSno;
        }

        //增加調閱狀態
        if (qs.borrow && qs.borrow === 'Y') {
            url = url + "&borrow=Y" + "&bempNo=" + (qs.bempNo || '') + "&datetime=" + (qs.datetime || '');
        }

        //增加否自動列印狀態
        if (autoPrint) {
            url = url + "&autoPrint=Y";
        }

        // console.log(vm.ContactList);
        // console.log(OA.common.Global.getCurrentWKContent());
        // contactList: OA.common.Utils.getContactListTag(OA.common.Global.getCurrentWKContent()),

        //檢查是否含大型附件
        var hasBig = false;
        var store = Ext.getStore('Attach');
        if (store) {
            Ext.Array.each(store.data.all, function (item) {
                if (item.data.sort && item.data.file.status == '1' && item.data.sort === 'big') {
                    hasBig = true;
                    return false;
                }
            });
        }
        if (hasBig) url = url + '&hasBig=Y';

        var docTotal;
        if (vm && vm.kind !== '來文' && vm.ContactList && vm.ContactList.length > 0) {
            var docTotal = vm.ContactList.where("( el, i, res, param ) => el.TRANSTYPE=='1'||el.TRANSTYPE=='2'");
        }
        //docSend = true;
        if (docSend) {
            var reLoadADDR = [];
            if (vm && vm.kind !== '來文' && vm.ContactList && vm.ContactList.length > 0) {
                reLoadADDR = vm.ContactList.where("( el, i, res, param ) => (el.TRANSTYPE=='1'||el.TRANSTYPE=='2')&&(el.ADDR +'').trim()==''");
                //console.log(reLoadADDR);
            }

            if (reLoadADDR && reLoadADDR.length > 0) {
                Ext.Viewport.setMasked({ xtype: 'loadmask', message: '重新對應空白地址受文者中...' });
                var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
                if (menuLeft) menuLeft.setMasked(true);
                var index = 0;
                var paras = OA.common.Global.getInitParas();
                var data = {};
                data.qType = '';
                data.start = 0;
                data.limit = 1;
                data.depNo = paras.depNo;
                data.empNo = paras.empNo;
                Ext.Array.each(reLoadADDR, function (rel) {
                    data.dep3ChnName = rel.VALUE;
                    OA.client.Member.search(data, function (ret) {
                        index++;
                        if (ret.length != 0) {
                            rel.ADDR = ret[0].get('dep3Addr') || '';
                            rel.CODENAME = ret[0].get('dep3Name') || '';
                            rel.ARCENO = ret[0].get('dep3Zone') || '';
                        }
                        if (index == reLoadADDR.length) {
                            Ext.Viewport.setMasked(false);
                            var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
                            if (menuLeft) menuLeft.setMasked(false);
                            if (docTotal && docTotal.length > 50) {
                                Ext.Msg.confirm('提示', '列印單位超過50筆，將不自動帶入發文列印，請手動執行「進階設定」或「批次列印」，選取部份受文者分次列印！', function (fn) {
                                    if (fn == 'yes')
                                        window.open(url, '列印', "width=1100,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
                                });
                            } else {
                                var hasGroup = false;
                                if (docTotal && docTotal.length > 0) {
                                    hasGroup = (docTotal.where("( el, i, res, param ) => el.GROUP=='2'")).length > 0;
                                }
                                if (hasGroup) {
                                    Ext.Msg.confirm('提示', '列印單位含群組，將不自動帶入發文列印，請手動執行「進階設定」或「批次列印」，選取部份受文者分次列印！', function (fn) {
                                        if (fn == 'yes')
                                            window.open(url, '列印', "width=1100,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
                                    });
                                } else {
                                    if (qs.sendtype != undefined && qs.sendtype.value == 'Divide') {
                                        url = url + '&divide=Y';   //0904 分址分文發文列印狀態 Chloe.sia
                                    } else {
                                        url = url + '&send=Y';  //一文多發發文列印狀態
                                    }
                                    window.open(url, '列印', "width=1100,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
                                }
                            }
                        }
                    });
                });
            } else {

                if (docTotal && docTotal.length > 50) {
                    Ext.Msg.confirm('提示', '列印單位超過50筆，將不自動帶入發文列印，請手動執行「進階設定」或「批次列印」，選取部份受文者分次列印！', function (fn) {
                        if (fn == 'yes')
                            window.open(url, '列印', "width=1100,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
                    });
                } else {
                    var hasGroup = false;
                    if (docTotal && docTotal.length > 0) {
                        hasGroup = (docTotal.where("( el, i, res, param ) => el.GROUP=='2'")).length > 0;
                    }
                    if (hasGroup) {
                        Ext.Msg.confirm('提示', '列印單位含群組，將不自動帶入發文列印，請手動執行「進階設定」或「批次列印」，選取部份受文者分次列印！', function (fn) {
                            if (fn == 'yes')
                                window.open(url, '列印', "width=1100,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
                        });
                    } else {
                        if (qs.sendtype != undefined && qs.sendtype.value == 'Divide') {
                            url = url + '&divide=Y';   //0904 分址分文發文列印狀態 Chloe.sia
                        } else {
                            url = url + '&send=Y';  //一文多發發文列印狀態
                        }
                        window.open(url, '列印', "width=1100,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
                    }
                }
            }
        } else {
            window.open(url, '列印', "width=1100,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
        }
    },
    /**
     * 非即時追蹤修訂
     **/
    onAsyncTap: function () {
        var me = this;
        var re = OA.common.Global.getCurrentDocFlowRecord();
        var init = OA.common.Global.getInitParas();
        re.set('paperNo', init.paperNo);
        OA.client.AsyncWK.load(re, function () {
            //console.log(re);
            var initParas = OA.common.Global.getInitParas();
            me.initParas(initParas, 'async');
            var url = "./index.html?app=async";
            window.open(
                url,
                "追蹤修訂歷程",
                "width=1100,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no"
            )
        });
    },
    /**
     * 打包
     */
    onPackageTap: function () {
        var me = this;
        var vm = OA.common.Global.getCurrentViewModel();

        // var paras = this.getTidyParas();
        // this.initParas(paras);

        // me.initParas();
        var url = './index.html?app=genpages&package=Y';
        OA.common.Utils.checkEpaper() ? url = url + '&epaper=Y' : url = url + '&epaper=N'
        window.open(url, '打包', "width=250,height=250,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
        window.getCurrentUser = function () {
            var initParas = OA.common.Global.getInitParas();
            var paras = Ext.apply({}, initParas);
            //Ext.apply(paras, me.getTidyParas());
            me.initParas(paras);
            return paras;
        };
    },
    /**
    * 匯出
    */
    onExportTap: function (data) {
        var me = this;
        me.initParas();
        var url = "./index.html?app=preview&by=export";
        var qs = OA.common.Global.getQ();
        url = url + "&epaper=" + (qs.epaper === "N" ? "N" : "Y"); //是否為紙本
        if (qs.app === "offline") url = url + "&offline=Y";
        //密件公文取號後增加doSno
        if (qs.sFlag && qs.doSno) {
            url = url + "&sFlag=Y" + "&doSno=" + qs.doSno;
        }
        //增加調閱狀態
        if (qs.borrow && qs.borrow === 'Y') url = url + "&borrow=Y";
        url = url + "&fullname=" + data.fullname + "&fileExt=" + data.fileExt;

        window.open(
            url,
            "匯出",
            "width=1100,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no"
        );
    },
    /**
     * 列印(獨立)
     */
    showPrint: function () {
        var printWindow;
        if (typeof require !== 'undefined') {
            var data = '';

            //console.log(OA.common.Paper.main().getPrintXml());
            if (OA.common.Paper.main().getPrintXml()) {
                data = 'data:image/svg+xml;charset=utf-8;base64,' + B64.encode(OA.common.Paper.main().getPrintXml());
            } else {
                data = 'data:image/svg+xml;charset=utf-8;base64,' + B64.encode(this.toPrintXml());
            }
            printWindow = window.open(data);
            printWindow.eval('setTimeout("print()", 1000)');
        } else {
            var winSetting = 'target=_blank,width=1100,height=600,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no';
            //WScript.Shell 綁定IE列印邊界
            try {
                // Internet Explorer 6-11
                var isIE = /*@cc_on!@*/false || !!document.documentMode;
                if (isIE) {
                    var RegWsh = new ActiveXObject('WScript.Shell');
                    var hkey_root, hkey_path, hkey_key;
                    hkey_root = 'HKEY_CURRENT_USER';
                    hkey_path = '\\Software\\Microsoft\\Internet Explorer\\PageSetup\\';
                    //表頭
                    hkey_key = 'header';
                    RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '');
                    //表尾
                    hkey_key = 'footer';
                    RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, '');
                    //上方邊界
                    hkey_key = 'margin_top';
                    RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, 0);
                    //下方邊界
                    hkey_key = 'margin_bottom';
                    RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, 0);
                    //左方邊界
                    hkey_key = 'margin_left';
                    RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, 0);
                    //右方邊界
                    hkey_key = 'margin_right';
                    RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, 0);
                }

                printWindow = window.open("about:blank", "友善列印", "_blank");
                data = (OA.common.Paper.main().getPrintXml()) ? (OA.common.Paper.main().getPrintXml()) : this.toPrintXml();
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, "image/svg+xml");
                // 獲取SVG元素
                var svgElement = doc.querySelector('svg');
                // 獲取SVG元素的height屬性值
                var heightValue = svgElement.getAttribute('height');
                //chrome 108版更新造成2頁以上第一頁空白處理
                var t = data.indexOf("xmlns=\"http://www.w3.org/2000/svg\"");
                var css = "style =\"position: absolute; manage margins:margin-left: 0;margins:margin-right: auto;\" ";
                var print = '@media print{body {height : ' + heightValue + '} }';
                data = data.slice(0, t) + css + data.slice(t);
                data = data.slice(0, data.indexOf('</style>')) + print + data.slice(data.indexOf('</style>'));

                printWindow.document.write(data);
                printWindow.document.close();
                printWindow.focus();
                printWindow.print();
                setTimeout(function () {
                    printWindow.close();
                }, 500);
            }
            catch (e) {
                if (e.message == 'Automation 伺服程式無法產生物件')
                    alert('未支援ActiveX，請至工具/網際網路選項/安全性/自訂等級，將ActiveX選項中「起始不標示為安全的ActiveX控制項」選擇開啟！');
            }
        }
    },
    /**
     * 列印下載
     */
    onPrintDownloadTap: function (button, options) {
        if (button) {
            button.setText('處理中...');
            button.setDisabled(true);
            button.up('formpanel').setMasked({ xtype: 'loadmask', message: '處理中...' });
        }

        if (typeof require !== 'undefined') {
            var paras = this.getCpaper().getCreateParas();
            paras.oSVG.xml = this.toPrintXml();
            require('electron').remote.getGlobal('initParas').preview = JSON.stringify(paras);
            var win = window.open('./index.html?app=preview&by=print&toolbar=n', "", '');

            // var remote = require('electron').remote;
            // var BrowserWindow = remote.BrowserWindow;
            // var win = new BrowserWindow({ width: 800, height: 600 });
            // var win = require('electron').remote.getCurrentWindow();
            // win.loadUrl(data);
        } else {
            button.up('formpanel').setMasked(false);

            // options.func='pirnt';
            // OA.client.File.doFile(options, function (ret) {
            //
            // })

            // OA.client.Print.exportPDF(options, function () {
            //     if (button) {
            //         button.up('formpanel').setMasked(false);
            //         button.setDisabled(false);
            //         button.setText('列印下載');
            //     }
            // });
        }
    },
    /**
     * 轉換成可列印 svg xml
     */
    toPrintXml: function () {
        var svg = this.getCpaper().getSvgPaper();
        var canvasString = svg.svgCanvasToString();
        canvasString = canvasString.replace(/"#clipSeal_0"/g, '#clipSeal_0').replace(/"#clipSeal_1"/g, '#clipSeal_1');
        var xmlDoc = $.parseHTML(canvasString), $xml = $(xmlDoc);
        var count = 0;
        var baseline = 0;
        var maxTransform = null;
        var maxHeight = 0;
        $xml.find(".gBackground").each(function (i, el) {
            var transform = el.getAttribute('transform');
            var parts = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform);
            if (parts) {
                var v = parseFloat(parts[2]);
                if (v >= baseline) {
                    baseline = v;
                    maxTransform = el;
                    maxHeight = v;
                }
            }
            count = i + 1;
        });

        var margins = [];
        if (maxTransform) {
            var intervalElem = maxTransform.querySelector(".pageInterval");
            if (intervalElem) {
                var interval = parseFloat(intervalElem.getAttribute('height'));
                var lastY = parseFloat(intervalElem.getAttribute('y'));
                $(maxTransform).find("rect[class=pageInterval]").each(function (i, el) {
                    margins.push(parseFloat(el.getAttribute('y')));
                });
                margins = margins.sort(function sortNumber(a, b) {
                    return b - a
                });
                //maxHeight = maxHeight + margins[0] - (count * (interval - 2)) - 5;//會影響最後一頁留空白
                maxHeight = maxHeight + margins[0] - (count * 0.1) - (10 - (count * 0.01));
                //離線版特徵
                if (typeof require !== 'undefined') {
                    maxHeight = maxHeight + margins[0] - (count * interval) + 10;//offline
                }

                $xml.find("rect[class=pageInterval]").each(function (i, el) {
                    el.parentNode.removeChild(el);
                });
            }
        } else {
            $xml.find("rect[class=pageInterval]").each(function (i, el) {
                margins.push(parseFloat(el.getAttribute('y')));
                el.parentNode.removeChild(el);
            });
            margins = margins.sort(function sortNumber(a, b) {
                return b - a
            });
            if (margins[0] == undefined)
                maxHeight = 0;
            else
                maxHeight = margins[0] - 20;

        }
        $xml[0].setAttribute("height", maxHeight);


        //var line =document.createElementNS('http://www.w3.org/2000/svg', 'line');
        //line.setAttribute('id', 'line' + i);
        //line.setAttribute('x1', 0);
        //line.setAttribute('y1', _y);
        //line.setAttribute('x2', 800);
        //line.setAttribute('y2',_y);
        //line.setAttribute('stroke', 'red');
        //line.setAttribute('class', 'test');
        //el.parentNode.appendChild(line);
        //});

        //修正LOGO圖 xlink
        $xml.find("#LOGO_title").each(function (i, el) {
            el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', KangDaAppConfig().logo);
        });
        //barcode
        if (this.getCpaper().getPreviewMode() === "Draft") {
            var href = this.getCpaper().getBarcode();
            if (href == '') {
                $xml.find("#barcode").remove();
            } else {
                $xml.find("#barcode").each(function (i, el) {
                    el.setAttributeNS("http://www.w3.org/1999/xlink", "href", href);
                });
            }
        } else {
            $xml.find("#barcode").remove();
        }


        var stamp = $xml.find("#Stamp");
        if (stamp) {
            if (stamp.length == 0) {
                $xml.find("#Stamp").remove();
            } else {
                $xml.find("#Stamp").each(function (i, el) {
                    if ((el.innerHTML + '').indexOf('xlink') == -1) {
                        el.parentNode.removeChild(el);
                    }
                });
            }
        }

        var divTables = document.querySelectorAll('.customTable');
        Ext.Array.each(divTables, function (div) {
            var rectId = '#rectTable_' + div.id.split('_')[1];
            var $rect = $(rectId, $xml);
            var $table = $('table', div).clone();
            $table.css({
                'left': parseFloat($rect[0].getAttribute('x')) + 8,
                'top': parseFloat($rect[0].getAttribute('y')) + 8,
                'width': parseFloat($rect[0].getAttribute('width')),
                'height': parseFloat($rect[0].getAttribute('height')),
                'zoom': 1,
                'position': 'absolute',
                'border-collapse': 'collapse',
                'border-spacing': 0
            });
            $('td', $table).css({ 'border': 'solid 1px black', 'padding': '8px' });
            $('.lastcol', $table).parent().css({ 'border': 'none' });
            $table.appendTo($xml);
        });

        //只有一頁時移除右邊騎縫章
        $xml.find("#canvas_pagingSeal_1").each(function (i, el) {
            if (OA.common.Paper.main().getPage() == 0) el.parentNode.removeChild(el);
        });

        $xml.find("#canvas_pagingSeal_0").each(function (i, el) {
            if (OA.common.Paper.main().getPage() == 0) el.parentNode.removeChild(el);
        });

        return xmlToString($xml);
    },
    toMailSvgXml: function () {
        //透過產頁面檔方式產SVG（模式：一文多發,自動蓋簽字章）
        var options = { previewMode: "Normal" };
        var wk = Ext.clone(OA.common.Global.getCurrentWKContent());
        var commonData = OA.common.DIMgr.doWkCommon(wk.DocumentType, wk, options);
        //console.log(commonData);
        //var svg = Ext.clone(this.getCpaper().getSvgPaper());
        var canvasString = commonData.oSVG.xml;
        canvasString = canvasString.replace(/"#clipSeal_0"/g, '#clipSeal_0').replace(/"#clipSeal_1"/g, '#clipSeal_1');
        var xmlDoc = $.parseHTML(canvasString), $xml = $(xmlDoc);
        var count = 0;
        var baseline = 0;
        var maxTransform = null;
        var maxHeight = 0;
        //console.log(xmlDoc);
        $xml.find(".gBackground").each(function (i, el) {
            var transform = el.getAttribute('transform');
            var parts = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform);
            if (parts) {
                var v = parseFloat(parts[2]);
                if (v >= baseline) {
                    baseline = v;
                    maxTransform = el;
                    maxHeight = v;
                }
            }
            count = i + 1;
        });

        var margins = [];
        if (maxTransform) {
            var intervalElem = maxTransform.querySelector(".pageInterval");
            if (intervalElem) {
                var interval = parseFloat(intervalElem.getAttribute('height'));
                var lastY = parseFloat(intervalElem.getAttribute('y'));
                $(maxTransform).find("rect[class=pageInterval]").each(function (i, el) {
                    margins.push(parseFloat(el.getAttribute('y')));
                });
                margins = margins.sort(function sortNumber(a, b) {
                    return b - a
                });
                //maxHeight = maxHeight + margins[0] - (count * (interval - 2)) - 5;//會影響最後一頁留空白
                maxHeight = maxHeight + margins[0] - (count * 0.1) - (10 - (count * 0.01));
                //離線版特徵
                if (typeof require !== 'undefined') {
                    maxHeight = maxHeight + margins[0] - (count * interval) + 10;//offline
                }

                $xml.find("rect[class=pageInterval]").each(function (i, el) {
                    el.parentNode.removeChild(el);
                });
            }
        } else {
            $xml.find("rect[class=pageInterval]").each(function (i, el) {
                margins.push(parseFloat(el.getAttribute('y')));
                el.parentNode.removeChild(el);
            });
            margins = margins.sort(function sortNumber(a, b) {
                return b - a
            });
            if (margins[0] == undefined)
                maxHeight = 0;
            else
                maxHeight = margins[0] - 20;

        }



        //移除（稿）
        $xml.find("#發文機關_title").each(function (i, el) {
            //console.log(el);
            el.innerHTML = el.innerHTML.replace('（稿）', '')

        });

        //移除檔號
        $xml.find("#檔號").each(function (i, el) {
            el.innerHTML = '';
        });

        //移除保存年限
        $xml.find("#保存年限").each(function (i, el) {
            el.innerHTML = '';
        });

        //移除核章欄
        $xml.find("#gSeal").each(function (i, el) {
            el.parentNode.removeChild(el);
        });

        $xml.find("#決行層級_title").each(function (i, el) {
            el.parentNode.removeChild(el);
        });

        $xml.find("#迴避要點_title").each(function (i, el) {
            el.parentNode.removeChild(el);
        });

        if (maxHeight == 0) {
            $xml[0].setAttribute("height", this.getCpaper().getPageHeight());
        } else {
            $xml[0].setAttribute("height", maxHeight);
        }



        //var line =document.createElementNS('http://www.w3.org/2000/svg', 'line');
        //line.setAttribute('id', 'line' + i);
        //line.setAttribute('x1', 0);
        //line.setAttribute('y1', _y);
        //line.setAttribute('x2', 800);
        //line.setAttribute('y2',_y);
        //line.setAttribute('stroke', 'red');
        //line.setAttribute('class', 'test');
        //el.parentNode.appendChild(line);
        //});

        //修正LOGO圖 xlink
        $xml.find("#LOGO_title").each(function (i, el) {
            el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', KangDaAppConfig().logo);
        });
        //barcode
        if (this.getCpaper().getPreviewMode() === "Draft") {
            var href = this.getCpaper().getBarcode();
            if (href == '') {
                $xml.find("#barcode").remove();
            } else {
                $xml.find("#barcode").each(function (i, el) {
                    el.setAttributeNS("http://www.w3.org/1999/xlink", "href", href);
                });
            }
        } else {
            $xml.find("#barcode").remove();
        }


        /*
        var ratio = svg.getZoom();
        var divTables = document.querySelectorAll('.customTable');
        Ext.Array.each(divTables, function (div) {
            var rectId = '#rectTable_' + div.id.split('_')[1];
            var $rect = $(rectId, $xml);
            var $table = $('table', div).clone();
            $table.css({
                'left': parseFloat($rect[0].getAttribute('x')) + 8,
                'top': parseFloat($rect[0].getAttribute('y')) + 8,
                'width': parseFloat($rect[0].getAttribute('width')),
                'height': parseFloat($rect[0].getAttribute('height')),
                'zoom': 1,
                'position': 'absolute',
                'border-collapse': 'collapse',
                'border-spacing': 0
            });
            $('td', $table).css({ 'border': 'solid 1px black', 'padding': '8px' });
            $('.lastcol', $table).parent().css({ 'border': 'none' });
            $table.appendTo($xml);
        });
        */

        //只有一頁時移除右邊騎縫章
        $xml.find("#canvas_pagingSeal_1").each(function (i, el) {
            if (OA.common.Paper.main().getPage() == 0) el.parentNode.removeChild(el);
        });

        $xml.find("#canvas_pagingSeal_0").each(function (i, el) {
            if (OA.common.Paper.main().getPage() == 0) el.parentNode.removeChild(el);
        });

        //console.log(xmlToString($xml));
        return xmlToString($xml);
    },
    /**
     * 依各頁邊界刪除換頁BAR
     */
    modifyPrint: function () {
        //修正文稿總高,複本加修正量
        //var svgHeight = margins[0] - (count * interval);

        //var xmlDoc = $.parseXML(canvasString),
        //    $xml = $(xmlDoc),
        //    interval = 0.0,
        //    margins = [];
        //
        //$xml.find("rect[class=pageInterval]").each(function (i, el) {
        //    interval = parseFloat(el.getAttribute('height'));
        //    margins.push(parseFloat(el.getAttribute('y')));
        //});

        ////各結點刪分頁BAR高
        //$xml.find("text[class!=sealText]").each(function (i, item) {
        //    var yText = parseFloat(item.getAttribute('y'));
        //    $.each(margins, function (mIdx, mVal) {
        //        if (yText > mVal) {
        //            var newY = yText - (count - mIdx) * interval;
        //            item.setAttribute("y", newY);
        //            return false;
        //        }
        //    });
        //});
        //
        ////段落跨頁時，刪分頁BAR高
        //$xml.find("text[class=follow_wrap_over]").each(function (i, el) {
        //    Ext.Array.each(el.childNodes, function (n) {
        //        if (n.getAttributeNS) {
        //            var cur_dy = parseFloat((n.getAttributeNS(null, 'dy')));
        //            if (cur_dy > interval) {
        //                var newHeight = cur_dy - interval;
        //                n.setAttribute("dy", newHeight);
        //            }
        //        }
        //    });
        //});

        //$xml.find("g[class=gSeal]").each(function (i, el) {
        //    var transform = el.getAttribute('transform');
        //    var parts  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform);
        //    var t=0;
        //    if (parts)
        //        t =parseFloat(parts[2]) - (count * interval)+10;
        //    else
        //        t = - (count * interval) +10;
        //
        //    el.setAttribute("transform", 'translate(0,' + t + ')');
        //});

        ////分頁BAR高隱藏
        //$xml.find("rect[class=pageInterval]").each(function (i, el) {
        //    el.setAttribute("height", 0);
        //});
        //
    },

    /**
     * save pdf 出現中文無法轉存正確
     */
    savePdf: function (button, e, eOpts) {
        //var doc = new jsPDF();
        //var doc = new jsPDF('p', 'pt', 'a4');
        //doc.text(20, 20, 'Hello world!');
        //doc.text(20, 30, 'This is client-side Javascript, pumping out a PDF.');
        //doc.addPage();
        //doc.text(20, 20, 'Do you like that?');
        //doc.save('Test.pdf');

        //// I recommend to keep the svg visible as a preview
        //var svg = $('#svgcanvas > svg').get(0);
        //// you should set the format dynamically, write [width, height] instead of 'a4'
        //var pdf = new jsPDF('p', 'pt', 'a4');
        //var pdf = new jsPDF();
        //pdf.text(20, 20, 'Hello world!');
        //pdf=svgElementToPdf(svg, pdf, {
        //    scale: 72/96, // this is the ratio of px to pt units
        //    removeInvalid: true // this removes elements that could not be translated to pdf from the source svg
        //});

        //console.log(html2canvas($(container).html()));
        //pdf.addSVG(_svg,0,0);


        //pdf.addSVG(gg.join(''),0,0,width,height);
        //var p =pdf.addSVG(gg.join(''),20,20,width,height);

        //p.save('Test.pdf');

        //pdf.addHTML(svg,function() {
        //
        //    //var s = pdf.output('datauristring');
        //    //console.log(s);
        //    pdf.save('Test.pdf');
        //});

        //console.log(pdf.getFontList());
        //
        //var i=0;
        //Ext.Array.each(_svg.childNodes, function (n) {
        //    //var pdfFontSize = 16;
        //    //if(n.hasAttribute('font-size')) {
        //    //    pdfFontSize = parseInt(n.attr('font-size'));
        //    //}
        //    //console.log(n.textContent);
        //    i++;
        //    //pdf.setFont('標楷體');
        //    pdf.text(20, 20*i, n.textContent);
        //});

        //pdf.text(20, 40, 'End world!');
        //pdf.save('Test.pdf');
        //pdf.output('datauri'); // use output() to get the jsPDF buffer
        //pdf.save('Test.pdf');
    },
    /**
     * 附件
     * 1.URL：安全性低，無法有效管理使用者使用
     * 2.Data Uri-base64 : 有大小、型態、流覽器的限制
     * 3.AP 將base64轉成檔案 或 pdf，回傳連接
     *
     */
    onAttachTap: function (ctr, index, target, record) {
        var f = record.get('file');
        OA.client.Attach.openFile(f);
    },
    /**
     *  載入附件及附件計數
     */
    loadAttachs: function (attachs) {
        var attachCount = 0;
        var storeAttach = Ext.getStore('Attach');
        if (storeAttach) {
            storeAttach.clearFilter();
            storeAttach.setData(attachs);
            Ext.Array.each(attachs, function (attach) {
                if (attach.file.status != '0') attachCount++;
            });
            if (this.getButAttach()) this.getButAttach().setBadgeText(attachCount);
            if (this.getButPaperAttach()) this.getButPaperAttach().setBadgeText(attachCount);
            var panelAttach = Ext.getCmp('PanelAttach');
            if (panelAttach) {
                if (!panelAttach.getHidden()) {
                    var key = panelAttach.getKey() || 'attach';
                    panelAttach.changeSort(key);
                }
            }
        }
        return attachCount;
    },
    /**
     *  更新附件計數
     */
    loadAttachsCount: function () {
        var storeAttach = Ext.getStore('Attach');
        if (storeAttach) {
            var count = 0;
            Ext.Array.each(storeAttach.data.all, function (attach) {
                var status = attach.data.file.status + '';
                if (status !== '0') count++;
            });
            if (this.getButAttach()) this.getButAttach().setBadgeText(count);
            if (this.getButPaperAttach()) this.getButPaperAttach().setBadgeText(count);
        }
    },
    /**
     *  自動切換下一步
     */
    autoGoNextStep: function () {
        var me = this;
        var _nextStep = KangDaAppConfig().nextStep;
        var qs = OA.common.Global.getQ();
        if (qs.nextStep) _nextStep = qs.nextStep;
        if (!_nextStep) return;
        var form;
        // nextStep=forward
        if (_nextStep == 'next') {
            me.onGotoStage(me.getButSmallNext());
        } else if (_nextStep == 'edit') {
            me.onEditTap(me.getButEdit());
        } else if (_nextStep == 'OA.form.FormOrgNo') {
            form = Ext.create(_nextStep);
            form.create();
            Ext.Viewport.add(form);
            form.show();
        } else if (_nextStep == 'OA.form.PanelChange') {
            form = Ext.create(_nextStep);
            form.create('正本', ['正本'], OA.common.Global.getCurrentViewModel());
            Ext.Viewport.add(form);
            form.show();
        } else if (_nextStep == 'forward') {
            if (OA.common.Paper.main().hasField('檔號')) {
                var vm = OA.common.Global.getCurrentViewModel();
                if (vm.檔號.trim() === '' || vm.保存年限.toString().trim() === '') {
                    Ext.Msg.alert('提示', '檔號及保存年限不可空白');
                    Ext.Viewport.setMasked(false);
                    return;
                }
            }
            //me.doSave({ action: 'save' }, function () {
            me.doApprove('forward', false);
            //});
        } else if (_nextStep.indexOf('稿') >= 0) {
            var m = _nextStep.split('-');
            var values = {
                action: "create",
                qFormat: m[1],
                qIsNew: true,
                qNumberWay: "1",
                qTemplate: m[1],
                qc: "2"
            }
            me.onNewDocPaper(null, values);
        }
        else if (_nextStep == 'docUpload') {
            qs.nextStep = '';
            OA.common.Paper.setActiveStatus('edit');
            var vi = OA.common.VIMgr.getViContent();
            var vm = OA.common.Global.getCurrentViewModel();
            vi.主旨 = vm.主旨;
            me.onGotoStage({ config: { action: 'docUpload' } });
        } else if (_nextStep == 'ViReload') {
            me.saveViReload();
        }
        else {
            form = Ext.create(_nextStep);
            form.create(OA.common.Global.getCurrentViewModel());
            Ext.Viewport.add(form);
            form.show();
        }
    },
    switchToolPen: function (action) {
        this.getCpaper().getSvgPaper().clearSelection(true);
        var isUseEraser = action == 'pen';
        if (this.getButEraser()) this.getButEraser().setHidden(isUseEraser);
        if (this.getButPencil()) this.getButPencil().setHidden(isUseEraser);
        if (this.getButFhpath()) this.getButFhpath().setHidden(isUseEraser);
        var status = this.getToolPen().getHidden();
        this.getToolPen().setHidden(!status);
    },
    /**
     * 螢光筆
     */
    toolPenInit: function () {
        var me = this;
        var items = [];
        items.push({ ui: "plain", text: '無', style: { 'color': 'none' } })
        if (OA.common.Global.getQueryDefault()) {
            Ext.Array.each(OA.common.Global.getQueryDefault().交換資訊.colorpalette.palette, function (p) {
                var _color = (p.color.length > 9) ? '#' + p.color.substring(4) : '#' + p.color.substring(3);
                items.push({ ui: "plain", iconCls: 'fa-square', style: { 'color': _color } })
            });
        }
        var _options = [];
        for (var i = 1; i <= 8; i++) {
            _options.push({ text: i + ' px', value: i / 10 });
        }
        items.push({
            id: 'selectPenSize',
            xtype: 'selectfield',
            valueField: 'value',
            displayField: 'text',
            options: _options,
            value: 0.8
        });
        items.push({ ui: "plain", iconCls: 'fa-pencil', action: 'pencil', style: { 'color': 'white' }, hidden: true });
        items.push({
            ui: "plain",
            iconCls: 'fa-location-arrow',
            action: 'fhpath',
            style: { 'color': 'white' },
            hidden: true
        });
        items.push({ ui: "plain", iconCls: 'fa-eraser', action: 'eraser', style: { 'color': 'white' }, hidden: true });

        me.getToolPen().setItems(items);
    },
    /**
     * 簽核視窗初始化
     */
    windowLayout: function () {
        var me = this;
        var qs = OA.common.Global.getQ();
        var parlDraft = OA.common.Global.getParallelWin();
        var isDestop = Ext.os.deviceType === 'Desktop';
        var isPhone = Ext.os.deviceType === 'Phone';
        var isTablet = Ext.os.deviceType === 'Tablet';
        var isPortrait = (Ext.Viewport.getOrientation() == 'portrait');
        // console.log(isPortrait);

        //版本資訊
        if ((qs.app === 'approve' || qs.app === 'check' || qs.app === 'review' || qs.app === 'buchen') && qs.sFlag !== 'Y') {
            var menuRoot = Ext.create("Ext.Menu", {
                ui: 'light',
                layout: "fit",
                style: 'padding:1px;',
                width: '20%',
                items: [
                    { xtype: 'menuEdition', height: Ext.Viewport.getWindowHeight() - 5 }
                ]
            });
            menuRoot.on('hiddenchange', function (ctr, value, oldValue, eOpts) {
                if (value) me.frameResize();
            });
            Ext.Viewport.setMenu(menuRoot, {
                side: 'left',
                reveal: true
            });
            if (isDestop || (isTablet && !isPortrait)) {
                if (!parlDraft) Ext.Viewport.showMenu('left');
            }
        }

        this.getSuggestion().create();

        //意見欄
        var isShowSuggestion = true;
        if (qs.app === 'editor' || qs.app === 'draft' || qs.app === 'offline' || qs.sFlag === 'Y') {
            isShowSuggestion = false;
            this.frameResize();
        }
        if (parlDraft || isPhone || (isTablet && isPortrait)) isShowSuggestion = false;
        if (this.getSuggestion()) this.getSuggestion().setHidden(!isShowSuggestion);

        if (qs.app === 'check' || qs.app === 'review') {
            //console.log(this.getSuggestion().query('#labBarrier'))
            this.getSuggestion().query('#suggestionTitlebar')[0].setHidden(true);
            this.getSuggestion().query('#suggestionTip')[0].setHidden(true);
            this.getSuggestion().query('#suggestionText')[0].setHidden(true);
            this.getSuggestion().query('#suggestionClear')[0].setHidden(true);
            // this.getSuggestion().query('#labBarrier')[0].setHidden(true);
        }

        if (!isShowSuggestion) this.frameResize();

        //var top = Ext.getCmp('tabSuggestionSort').element.dom.offsetTop + 40;
        var top = Ext.getCmp('suggestionTitle').element.dom.offsetTop-20;
        var listHeight = Math.max(Ext.Viewport.getWindowHeight() - top, 10);
        this.getSuggestion().query('list')[0].setHeight(listHeight);
    },
    frameResize: function (by) {
        var menuLeft = Ext.Viewport.getMenus().left;
        var isMenuLeftHidden = (menuLeft) ? menuLeft.getHidden() : true;
        var isSuggestionHidden = this.getSuggestion().getHidden();
        var w = 100;
        if (isMenuLeftHidden == false) w = w - 20;
        if (isSuggestionHidden == false) w = w - 20;

        if (by == 'left') {
            if (isMenuLeftHidden == false) {
                w = w + 20;
            } else {
                w = w - 20;
            }
        }
        Ext.getCmp('oawork').setWidth(w + '%');
    },

    /**
     * 符號表
     */
    onSymbolTap: function (button, opts) {
        var me = this;
        var status = me.getPanelSymbols().getHidden();
        me.getPanelSymbols().setHidden(!status);
        var content = me.getPanelSymbols().getHtml();
        me.getPanelSymbols().config.action = opts.action;

        var symbols = '';
        if (opts.action == 'bullet') {
            symbols = '•‣◦⁃⁌⁍'.split('');
            me.getPanelSymbols().setStyle('font-size:50px;');
        } else {
            me.getPanelSymbols().setStyle('font-size:30px');
            symbols = '，、：；！。‧？○——【】（）「」『』〔〕〈〉《》$&@…一二三四五六七八九十０１２３４５６７８９零壹貳參肆伍陸柒捌玖拾佰仟萬億'.split('');
        }

        var items = [], n = 0;

        items.push('<div><span class="symbol-close"></span>');
        // items.push('<br/>');
        var count = symbols.length;
        if (opts.action == 'bullet') {
            items.push('<p style="font-size:24px;padding:10px;">' + '編號 (一二三)' + '</p>');
            for (n = 0; n < count; n++) {
                items.push('<span style="padding:10px;">' + symbols[n] + '</span>');
            }
        } else {
            for (n = 0; n < count; n++) {
                items.push('<span>' + symbols[n] + '</span>');
            }
            items.push('<p style="font-size:24px; padding:10px; font-weight:bold; color:#FFD700;">原 住 民 羅 馬 字' + '</p>');
            var symbols2 = 'ʼ、⌃、ṟ、é、ɨ、ʉ';
            var count2 = symbols2.length;
            for (n = 0; n < count2; n++) {
                items.push('<span style="padding:10px;">' + symbols2[n] + '</span>');
            }
        }
        items.push('</div>');

        me.getPanelSymbols().setHtml(items.join(''));

        if (me.getCpaper().getIsSuggestionIn()) {
            var suggestiontext = Ext.getCmp('suggestionText');
            if (suggestiontext) {
                var textarea = suggestiontext.getComponent().input.dom;
                if (textarea) {
                    textarea.focus();
                }
            }
        }
    },
    /**
     * 轉致成canvas
     */
    exportCanvas: function (data) {
        var me = this;
        var size = OA.common.Paper.main().getCreateParas().size;
        var subFrame = document.getElementById('subFrame');
        var wnd = subFrame.contentWindow;
        wnd.document.write('<canvas id="c" width="' + size.w + '" height="' + size.h + '" ></canvas>');

        var canvas = wnd.document.getElementById('c');
        var fabricCanvas = new fabric.Canvas(canvas);

        var xml = me.toPrintXml();
        fabric.loadSVGFromString(xml, function (objects, options) {
            fabricCanvas.setBackgroundColor('white');
            var obj = fabric.util.groupSVGElements(objects, options);
            fabricCanvas.add(obj).renderAll();

            if (data.fileExt == 'jpg') {
                canvas.toBlob(function (blob) {
                    saveAs(blob, data.fullname);
                    wnd.document.close();
                    wnd.close();
                }, "image/jpeg");
            } else if (data.fileExt == 'tiff') {
                CanvasToTIFF.toBlob(canvas, function (blob) {
                    saveAs(blob, data.fullname);
                    wnd.document.close();
                    wnd.close();
                });
            } else if (data.fileExt == 'png') {
                canvas.toBlob(function (blob) {
                    saveAs(blob, data.fullname);
                    wnd.document.close();
                    wnd.close();
                });
            } else if (data.fileExt == 'pdf') {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 210;
                var pageHeight = 297;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;


                // jsPDF.API.events['initialized'] = function () {
                //     console.log(this);
                // };
                // jsPDF.API.events['buildDocument'] = function () {
                //     console.log(this);
                // };
                // jsPDF.API.mymethod = function(){
                //     console.log(this);
                // }
                var doc = new jsPDF('p', 'mm', 'a4');
                // doc.mymethod();


                var position = 0;

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
                doc.save(data.fullname);

                // var out = doc.output();
                // console.log(B64.encode(out));

                // var file = doc.output('blob');
                // var fd = new FormData();
                // fd.append('mypdf',file);

                // console.log(fd);

                wnd.document.close();
                wnd.close();

                // var pdf = new jsPDF('p', 'pt', 'a4');
                // pdf.addHTML(canvas, {pagesplit: true,format: 'JPEG'}, function() {
                //     pdf.save(data.fullname);
                // });
            }
        });
    },
    /**
     * 批示意見
     */
    saveSuggestionVI: function () {
        var me = this;
        var edition = OA.common.VIMgr.getCurrentEdition();
        var init = OA.common.Global.getInitParas();
        var papers = edition.簽核文件夾.文稿;
        if (!Ext.isArray(papers)) papers = [papers];
        if (init.paperNo) {
            var paper = null;
            Ext.Array.each(papers, function (item) {
                if (item.代碼 == init.paperNo) {
                    paper = item;
                    if (paper.名稱 == '來文') paper.排序 = 1;
                    return false;
                }
            });
            if (edition && paper) {
                paper.批示意見 = paper.批示意見 || {};
                paper.批示意見.content = Ext.getCmp('suggestionText').getValue().replace(/&/g, '＆').replace(/</g, '＜').replace(/>/g, '＞') || '';
                paper.批示意見.lastTime = OA.common.Utils.getChineseDate();
            }
        }

        //新舊版本併行同步WK意見
        if (paper && paper.批示意見 && paper.批示意見.content) {
            var wk = OA.common.Global.getCurrentWKContent();
            if (wk && wk.childNodes) {
                Ext.Array.each(wk.childNodes, function (node) {
                    if (node.tagName && node.tagName == '批示意見') {
                        node.Version = edition.版號;

                        node.childNodes = [
                            {
                                childNodes: [
                                    paper.批示意見.content
                                ],
                                tagName: "文字"

                            }
                        ]
                    }

                })
            }
        }
    },
    suggestionUpdate: function (newValue) {
        //console.log(newValue);
        var but = this.getSegdoc().getPressedButtons()[0];
        if (but) {
            but.config.suggestContent = newValue;
            but.config.suggestLastTime = OA.common.Utils.getChineseDate();
            OA.common.Paper.setActiveStatus('edit');
        }
    },

    /**
     * 取得 文稿批示意見
     * paperConfig from  OA.common.VIMgr.getFolderItems
     */
    loadSuggestion: function (paperConfig) {
        //文稿批示意見
        var suggestiontxt = Ext.getCmp('suggestionText');
        var edition = OA.common.VIMgr.getCurrentEdition();
        var qs = OA.common.Global.getQ();
        if (suggestiontxt) {
            //console.log(paperConfig.suggestContent);
            suggestiontxt.getComponent().originalValue = paperConfig.suggestContent;   //原始預設意見
            suggestiontxt.setValue(paperConfig.suggestContent || '');
        }

        var key = '承辦';
        var suggestion = Ext.getCmp('Suggestion');

        //發文臺開啟時，右邊簽核區請停在「核決」
        //補核狀態時，右邊簽核區請停在「核決」
        if (OA.common.VIMgr.hadExchange() || qs.reviewFn == 'doReview' || qs.app == 'buchen') {
            key = '核決';
            suggestion.setKey('核決');
        }
        if (suggestion) suggestion.load(paperConfig);

        var tabs = Ext.getCmp('tabSuggestionSort');
        if (tabs) {
            var actItem;
            Ext.Array.each(tabs.items.items, function (tab) {
                if (tab.config.title == key) actItem = tab;
            });
            Ext.getCmp('tabSuggestionSort').setActiveItem(actItem);
        }
    },

    onModeTap: function (button, options, callback) {
        var me = this;
        var area = this.getDocArea();
        var isDocPaper = area.getActiveItem().config.xtype == 'docPaper';
        if (isDocPaper) {
            Ext.getCmp('oawork').toolEditInit('docForm');
            area.setActiveItem('docForm');
            button.setIconCls('fa-pencil-square-o');
            OA.common.Funcs.show('FormFields', button);
            OA.common.Paper.main().saveKDRichTextBlock();
            Ext.getCmp('FormFields').docFormUpdate();
            Ext.getCmp('FormFields').hide();
        } else {
            Ext.getCmp('oawork').toolEditInit();

            area.setActiveItem('docPaper');
            if (button) {
                button.setIconCls('fa-th-list');
                button.setTitle('切換模式');
            }

            me.getSegdoc().setPressedButtons([]);
            var ctrMenu = OA.common.Global.getApp().getController('OA.controller.Menu');
            ctrMenu.segdocPressed();  // raise OA.controller.Work.onPaperTaggle
        }

        Ext.Array.each(me.getSegdoc().getItems().items, function (item) {
            if (item.config && item.config.action && item.config.action == 'add') {
                isDocPaper ? item.setHidden(true) : item.setHidden(false);
            }
        });
        //console.log(me.getSegdoc());

        me.loadAttachsCount();  //載入附件及附件計數

        if (callback && options == null) callback();
    },

    onOpenTap: function (button, options) {
        var me = this;
        var qs = OA.common.Global.getQ();
        if (qs.app === 'editor' || qs.app === 'offline' || qs.app === 'approve') {
            OA.common.FileMgr.open(function (content) {
                if (content == null) return;    //沒有選到任何檔案
                var vi = (content) ? JSON.parse(B64.decode(content)) : '';
                me.getCpaper().setStatus('');  //每次開啟Status要重設
                if (qs.app === 'approve' && qs.sFlag !== 'Y') {
                    //待結案開舊檔
                    var localDoc = vi.版次[0].簽核文件夾;
                    var edit = OA.common.VIMgr.getCurrentEdition();
                    localDoc.公文文號 = edit.簽核文件夾.公文文號;
                    var onlineVi = OA.common.VIMgr.getViContent();
                    onlineVi.版次[0].簽核文件夾 = localDoc;
                    //console.log(onlineVi);

                    OA.common.FileMgr.uploadOld(function (ret) {

                        // ret.status = 'create';
                        // me.excuteOnline(ret, function () {
                        //     if (callback) callback(ret);
                        // });

                    });

                    // var items = OA.common.VIMgr.load(onlineVi);                    
                    // console.log(items);
                    // Ext.Array.each(items, function (item) {
                    //     item.openby = 'local';
                    // });
                    // me.getSegdoc().setItems(items);
                    // Ext.getCmp('oawork').toolActionInit();
                    // OA.common.Global.getApp().getController('OA.controller.Menu').segdocPressed();  // on onPaperTaggle                                    
                    // OA.client.WK.excute({ action: 'upload' });                    
                    return;
                }
                var items = OA.common.VIMgr.load(vi);
                me.getSegdoc().setItems(items);
                Ext.getCmp('oawork').toolActionInit();
                OA.common.Global.getApp().getController('OA.controller.Menu').segdocPressed();  // on onPaperTaggle
                qs.isImport = 'Y';//匯入狀態，選檔號不自動存檔用
            });
            return;
        }
        OA.common.Funcs.show('FormImport', button);
    },

    saveViReload: function (callback) {
        var me = this;
        var qs = OA.common.Global.getQ();
        if (qs.app === 'editor') {
            OA.common.Global.getApp().getController('OA.controller.Menu').segdocPressed();  // on onPaperTaggle  
            Ext.Viewport.setMasked(false);
            if (callback) callback();
            return;
        } else {
            me.doSave({ action: 'save' }, function () {
                if (qs.nextStep === 'ViReload') qs.nextStep = '';
                var r = OA.common.Global.getCurrentDocFlowRecord();
                me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r);
                if (callback) callback();
            });
        }
        /*
        me.doSave({ action: 'save' }, function () {
            if (qs.nextStep === 'ViReload') qs.nextStep = '';
            if (qs.app === 'editor' || qs.app === 'offline'||qs.sFlag==='Y') {
                OA.common.FileMgr.loadVI(function (vi) {
                    var items = OA.common.VIMgr.load(vi);
                    console.log(items)
                    me.getSegdoc().setItems(items);
                    Ext.getCmp('oawork').toolActionInit();
                    OA.common.Global.getApp().getController('OA.controller.Menu').segdocPressed();  // on onPaperTaggle                
                    if (callback) callback();
                });
                return;
            }
            var r = OA.common.Global.getCurrentDocFlowRecord();
            me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r);
            if (callback) callback();
        });
        */
    },
    deleteViReload: function (deleteList, callback) {
        var me = this;
        var qs = OA.common.Global.getQ();
        OA.common.Paper.setActiveStatus('delete');
        OA.client.WK.excute({
            action: 'delete', list: deleteList
        }, function () {
            if (qs.app === 'editor' || qs.app === 'offline' || (qs.sFlag === 'Y' && qs.gbDocflowId !== '')) {
                /*
                OA.common.FileMgr.loadVI(function (vi) {
                    var items = OA.common.VIMgr.load(vi);
                    me.getSegdoc().setItems(items);
                    Ext.getCmp('oawork').toolActionInit();
                    OA.common.Global.getApp().getController('OA.controller.Menu').segdocPressed();  // on onPaperTaggle

                    if (callback) callback();
                });
                */
                OA.common.Global.getApp().getController('OA.controller.Menu').segdocPressed();  // on onPaperTaggle
                if (callback) callback();
                return;
            }

            //qs.app == arrpove
            var r = OA.common.Global.getCurrentDocFlowRecord();
            me.getApplication().getController('OA.controller.Menu').getViBuildSegdoc(r);
            if (callback) callback();
        });
    },

    /**
     * 批示意見總整
     */
    onSuggestionNotesTap: function (button) {
        var paras = this.getTidyParas();
        this.initParas(paras);
        window.open('./index.html?app=tidy&action=init', '總整', "width=900,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
    },

    getTidyParas: function () {
        var me = this;
        var items = [];
        var current = OA.common.VIMgr.getCurrentEdition();
        items.push({
            mode: 'Opinion',
            name: '承辦機關',
            code: '',
            filters: [{ key: '承辦' }]
        });
        var allWithoutCurrent = OA.common.VIMgr.isParallelDraftNoCurrent();  //所有找不到目前，當作會畢
        Ext.getStore('TaskAccordion').each(function (p) {
            var isProcNotes = p.get('nodeType') === 'procNotes';
            if (isProcNotes) {
                Ext.Array.each(p.raw.source, function (raw) {
                    var org = raw.source;
                    var units = org.單位;
                    if (units) {
                        if (!Ext.isArray(units)) units = [units];
                        Ext.Array.forEach(units, function (unit) {
                            var item = {
                                mode: 'Opinion',
                                name: unit.名稱,
                                code: unit.單位代碼,
                                level: 2,
                                filters: [{ key: '會辦', depNo: unit.單位代碼, upDepNo: org.單位代碼 }]
                            }
                            Ext.apply(item, OA.common.Global.getInitParas());
                            if (item.lastVersion) item.version = item.lastVersion;
                            item.text = unit.名稱;
                            item.paperNo = unit.文稿代碼;
                            item.model_wk = 'OA.model.wk.NotesOpinion';
                            item.kind = (unit.refPaperData) ? unit.refPaperData.kind : '';
                            item.files = (unit.refPaperData) ? unit.refPaperData.files : [];

                            //if (unit.會畢 == 'Y' || allWithoutCurrent) items.push(item);  //之前版本
                            // 處理 簽稿會核單(各機關單位)顯示會有欄位重複問題 - joshua kang =>
                            var checkduplicates = items.where("( el, i, res, param ) =>el.code =='" + item.code + "'");
                            if (checkduplicates && checkduplicates.length == 0) {
                                if (unit.會畢 == 'Y' || allWithoutCurrent) items.push(item);
                            }
                            //<=

                        });
                    } else {
                        var item = {
                            mode: 'Opinion',
                            name: org.名稱,
                            code: org.單位代碼,
                            level: 1,
                            filters: [{ key: '會辦', depNo: org.單位代碼, upDepNo: org.單位代碼 }]
                        }
                        Ext.apply(item, OA.common.Global.getInitParas());
                        if (item.lastVersion) item.version = item.lastVersion;
                        item.text = org.名稱;
                        item.paperNo = org.文稿代碼;
                        item.model_wk = 'OA.model.wk.NotesOpinion';
                        item.kind = (org.refPaperData) ? org.refPaperData.kind : '';
                        item.files = (org.refPaperData) ? org.refPaperData.files : [];

                        //if (org.會畢 == 'Y' || allWithoutCurrent) items.push(item); //之前版本
                        // 處理 簽稿會核單(各機關單位)顯示會有欄位重複問題 - joshua kang =>
                        var hasValue = items.where("( el, i, res, param ) =>el.code =='" + item.code + "'");
                        if (hasValue && hasValue.length == 0) {
                            if (org.會畢 == 'Y' || allWithoutCurrent) items.push(item);
                        }
                        //<=
                    }
                });
            }
        });

        //會辦簽的paperno
        var ctr = Ext.getCmp('segDocSelector');
        var papers = [], isFirtNote = false;
        Ext.Array.each(ctr.getItems().items, function (item, idx) {
            var isActionButton = ['add', 'change', 'procnotes'].indexOf(item.config.action) >= 0;
            var isMyProcnotes = item.config && item.config.form && item.config.form.indexOf('會辦簽') >= 0;
            isActionButto = false;
            isMyProcnotes = false;
            if (!isActionButton && !isMyProcnotes) {

                var paper = {
                    text: item.getText(),
                    paperNo: item.config.paperNo,
                    paperOrder: item.config.idx,
                    source: item.config
                };

                //第一個簽或稿輸入，簽稿併陳時則限制在第一個簽輸入意見
                var isNote = ['便簽', '簽', '便箋', '簡簽', 'A4空白簽'];
                if (!isFirtNote && item.config && item.config.form && isNote.indexOf(item.config.form) >= 0) {
                    isFirtNote = true;
                    paper.status = 'first';
                }
                papers.push(paper);
            }
        });
        if (isFirtNote == false) {
            //var isOnlyFollow = OA.common.VIMgr.isOnlyFollow();
            papers[0].status = 'first';
            if (papers[0].text == '來文' && papers.length > 1) {
                papers[1].status = 'first';
            }
        }
        return {
            tidyTabs: items,
            vi: OA.common.VIMgr.getViContent(),
            docflow: OA.common.Global.getCurrentDocFlowRecord(),
            papers: papers
        };
    },
    //會辦簽稿: 會辦時，無單位簽，自動創會辦意見簽 （同科室只開一張，不同科室判斷是否會畢)
    doParallelDraft: function () {
        var current = OA.common.VIMgr.getCurrentEdition();
        var me = this;
        var isParallel = current && current.簽核人員 && current.簽核人員.是否會辦 == '是';
        if (isParallel) {
            var unitNote = {
                文稿代碼: ''
            };
            var isFindCurrent = false;
            if (current.會辦簽稿) {
                var units = current.會辦簽稿.單位;
                if (!Ext.isArray(units)) units = [units];
                Ext.Array.forEach(units, function (unit) {
                    if (unit.單位) {
                        var subUnits = unit.單位;
                        if (!Ext.isArray(subUnits)) subUnits = [subUnits];
                        Ext.Array.forEach(subUnits, function (sub) {
                            if (sub.目前 == 'Y') {
                                unitNote = sub;
                                isFindCurrent = true;
                            }
                        });
                    } else {
                        if (unit.目前 == 'Y') {
                            unitNote = unit;
                            isFindCurrent = true;
                        }
                    }
                });
            }
            if (!isFindCurrent) return false; //找不到目前單位
            var refPaperNo = unitNote.文稿代碼 + '';
            if (!refPaperNo) {
                var v = {
                    qFormat: '會辦簽',
                    qIsNew: false,
                    qNumberWay: '1',
                    qTemplate: '空白簽',
                    qc: '2',
                    qParallel: true
                };
                Ext.apply(v, unitNote);
                me.onNewDocPaper(null, v);
                return true;
            }
        }
        return false;
    },
    addDecisionDocMark: function (decision, isAttHasChange) {
        var c2 = Ext.getCmp('cpaper');
        var lab = Ext.getCmp('labdDecisionDocMark');
        var str = '';
        if (lab) {
            if (decision) {
                str = '決';
                if (isAttHasChange) str = str + '，附件有異動詳細請參閱（附件歷程）！';
                lab.setHtml('<span class="label label-primary" style="background: yellow;font-size:20px;padding:5px">' + str + '</span>');
            } else if (isAttHasChange) {
                str = '附件有異動詳細請參閱（附件歷程）！';
                lab.setHtml('<span class="label label-primary" style="background: yellow;font-size:20px;padding:5px">' + str + '</span>');
            } else {
                c2.remove(lab);
            }
        } else {
            if (decision) {
                str = '決';
                if (isAttHasChange) str = str + '，附件有異動詳細請參閱（附件歷程）！';
                c2.add(
                    {
                        id: 'labdDecisionDocMark',
                        xtype: 'label',
                        html: '<span class="label label-primary" style="background: yellow;font-size:20px;padding:5px">' + str + '</span>',
                        style: 'font-size:20px',
                        top: 5,
                        left: 5
                    }
                )
            } else if (isAttHasChange) {
                str = '附件有異動詳細請參閱（附件歷程）！';
                c2.add(
                    {
                        id: 'labdDecisionDocMark',
                        xtype: 'label',
                        html: '<span class="label label-primary" style="background: yellow;font-size:20px;padding:5px">' + str + '</span>',
                        style: 'font-size:20px',
                        top: 5,
                        left: 5
                    }
                )
            }
        }
    },
    doSignFlag: function (paras, index) {
        var me = this;
        //兩秒呼叫一次檢查signFlag，檢查超6次，還是false表示異常製作沒有成功存檔，請user重新操作
        setTimeout(function () {
            OA.client.SignFlag.load(paras, function (signRet) {
                if (signRet.success) {
                    paras.func = 'doSign';
                    // OA.client.File.doFile(paras, function (ret) {
                    OA.common.Bridge.doExit();
                    // });
                } else {
                    if (index >= 6) {
                        Ext.Msg.alert('提示', '執行簽章過程發生錯誤，請重新操作，謝謝！', callBackFunc);
                        function callBackFunc(id) {
                            if (id == 'ok') {
                                Ext.Viewport.setMasked(false);
                                var menuLeft = Ext.Viewport.getMenus().left;
                                if (menuLeft) menuLeft.setMasked(true);
                            }
                        }
                    } else {
                        ++index;
                        me.doSignFlag(paras, index);
                    }
                }
            });
        }, 2000);
    },
    doSetDraftTopMark: function () {
        var wk = OA.common.Global.getCurrentWKContent();
        var qd = OA.common.Global.getQueryDefault();
        if (wk && qd && qd.交換資訊) {
            var DraftTopMark = ['稿面註記', '應用限制', '擬辦方式', '其他擬辦', '分層負責', '處理級別'];
            var Value = {
                其他擬辦: '',
                分層負責_title: '',
                應用限制_title: '',
                擬辦方式_title: '',
                稿面註記_title: '',
                處理級別_title: '',
            };

            var hasLayer = false;
            Ext.Array.each(DraftTopMark, function (item) {
                var tagText = OA.common.Utils.getTagText(wk, item);
                if (tagText) {
                    Ext.Array.each(tagText.childNodes, function (n3) {
                        if (n3.Key == item) {
                            var title = item == '其他擬辦' ? item : item + '_title';
                            if (Value[title] != undefined) Value[title] = n3.Value
                            if (item == '分層負責') hasLayer = true;
                        } else if (n3.Key == '分層負責' && !hasLayer) {
                            Value['分層負責_title'] = n3.Value;
                        }
                    });
                }
            });
            qd.交換資訊.稿面註記 = Value;
            OA.common.Global.setQueryDefault(qd);
        }
    },
    addApproveSeal: function (option) {
        //console.log(option);
        //抓出決行版次的意見
        var vi = OA.common.VIMgr.getViContent();
        if (vi) {
            var approveEdition;
            var viItems = vi.版次;
            if (viItems && viItems.length > 0) {
                Ext.Array.each(viItems, function (item) {
                    //console.log(item);
                    if (item.線上簽核資訊 && item.線上簽核資訊.簽核流程
                        && item.線上簽核資訊.簽核流程.異動別 &&
                        item.線上簽核資訊.簽核流程.異動別 == "決行") {
                        approveEdition = item;
                        return false
                    }
                });
            }
            if (approveEdition) {
                var opinionWord = '';
                Ext.Array.each(approveEdition.簽核文件夾.文稿, function (paper) {
                    if ((paper.代碼 + '') == (option.paperNo + '') && paper.批示意見) {
                        opinionWord = paper.批示意見.content;
                        return false;
                    }
                });
                if (opinionWord == "發" || opinionWord == "不發") {
                    //console.log(approveEdition);
                    //建立決行章
                    var rows = [];

                    var _x5 = 0;  // 職章位置
                    var _y = 0;

                    var h = 37;
                    var depname = approveEdition.簽核人員.服務單位 || '';
                    var jobname = approveEdition.簽核人員.使用者職稱 || '';
                    var empname = approveEdition.簽核人員.使用者名稱 || '';
                    var time = approveEdition.最後更新時間 || '';
                    var depCount = 0;
                    var empCount = 0;
                    var emp_y = 0;
                    if (depname.length > 5) {
                        var depCount = depname.length / 5;
                        h = h + (depCount * 10);
                    }

                    var w = (5 * 13.5) + (empname.length * 26);
                    var namew = _x5 + (5 * 12.8);

                    if (empname.length > 3) {
                        empCount = empname.length / 3;
                        w = (5 * 13.5) + 80; //固定章寬
                        if (depCount == 0) {
                            h = h + (empCount * 8);
                        }
                    }

                    var format_SealTitleAndName_rect = '<rect id="Chaptersbox" class="{0}" height="{1}" width="{2}" y="{3}" x="{4}" stroke-width="1.5" stroke="#ff0000" fill="#fff"/>';
                    rows.push(Ext.String.format(format_SealTitleAndName_rect, 'Chaptersbox', h, w, _y, _x5));
                    var format_Chapters_text = '<text id="Chapterstext" class="{0}" xml:space="preserve" text-anchor="start" font-family="BiauKai,標楷體" y="{1}" x="{2}" font-size="{3}" stroke-width="0" stroke="{4}" fill="{5}">{6}</text>';
                    if (depCount > 0) {
                        var words = [];
                        for (var i = 0; i < depCount; i++) {
                            if (i == depCount) {
                                words.push(depname.substring(i * 5, depname.length))
                            } else {
                                words.push(depname.substring(i * 5, (i + 1) * 5));
                            }
                        }
                        var fontsize = 20 / depCount;
                        Ext.Array.each(words, function (word, index) {
                            if (index == 0) {
                                _y = (_y + 20) / depCount;
                            } else {
                                _y = (_y + 32) / depCount;
                            }
                            rows.push(Ext.String.format(format_Chapters_text, 'Chapters_depname', _y, _x5 + 4, fontsize, '#ff0000', '#ff0000', word));
                        });
                        emp_y = Ext.clone(_y) - (words.length * 5);
                    } else {
                        rows.push(Ext.String.format(format_Chapters_text, 'Chapters_depname', _y + 14, _x5 + 4, 12, '#ff0000', '#ff0000', depname));
                    }
                    //rows.push(Ext.String.format(format_Chapters_text, 'Chapters_jobname', _y + 30, _x5 + 4, 12, '#ff0000', '#ff0000', jobname));
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_jobname', h - 6, _x5 + 4, 12, '#ff0000', '#ff0000', jobname));

                    if (empCount > 0) {
                        var words = [];
                        for (var i = 0; i < empCount; i++) {
                            if (i == empCount) {
                                words.push(empname.substring(i * 3, empname.length))
                            } else {
                                words.push(empname.substring(i * 3, (i + 1) * 3));
                            }
                        }

                        var fontsize = 42 / words.length;

                        Ext.Array.each(words, function (word, index) {
                            if (index == 0) {
                                if (depCount > 0) {
                                    emp_y = (emp_y - 14) / empCount;
                                } else {
                                    emp_y = (emp_y - 6) / empCount;
                                }
                            } else {
                                if (depCount > 0) {
                                    emp_y = (emp_y + 36) / empCount;
                                } else {
                                    emp_y = (emp_y + 32) / empCount;
                                }
                            }
                            rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', emp_y + 25, namew, fontsize, '#ff0000', '#ff0000', word));
                        });
                    } else {
                        rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', emp_y + 25, namew, 24, '#ff0000', '#ff0000', empname));
                    }
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_time', h + 12, _x5 + 16, 13, 'black', 'black', time));
                    if ((approveEdition.簽核人員.使用者職務角色 + '') !== "16") {
                        rows.push(Ext.String.format(format_Chapters_text, 'opinionWord', h + 12, _x5 + 125, 14, 'black', 'black', "代"));
                    }
                    rows.push(Ext.String.format(format_Chapters_text, 'opinionWord', h + 30, _x5 + 16, 18, '#ff0000', '#ff0000', opinionWord));

                    //console.log(rows);
                    OA.common.Global.setApproveSeal(rows.join(''));
                    //console.log(OA.common.Global);
                }
            }
        }

    },
    autoSend: function (callback) {
        var qs = OA.common.Global.getQ();
        //紙本公文、重新發文，不簽章，不寫SignFlag
        var SignFlag = false;
        if (OA.common.Utils.checkEpaper() && !qs.reOt) SignFlag = true;

        var paras = OA.common.InitParas.doExchange(SignFlag);  //

        paras.methodId = 'exchange';

        OA.client.Exchange.excute(paras, function (r) {
            var newSendNo = r.get('發文字號_字');
            var vm = OA.common.Global.getCurrentViewModel();
            var edition = OA.common.VIMgr.getCurrentEdition();
            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
            edition.交換狀態 = '1';
            ctrWK.set('sendDataChange', false);
            if (newSendNo) {
                vm.發文字號_字_1 = newSendNo;
                //Ext.getCmp('cpaper').sendNoUpdate();
                Ext.getCmp('cpaper').setStatus('edit');

                var wk = OA.common.Global.getCurrentWKContent();
                var tagText = OA.common.Utils.getTagText(wk, '發文字號');
                tagText.childNodes[0].Value = newSendNo;
            }

            if (callback) callback();
            //if (qs.projNo) {

            //} else {
            //Ext.Msg.alert('提示', '發文資料上傳完成！');
            //}
        });
    }
});
