/**
 * 預覽列印
 */
Ext.define('OA.view.CtnPreview', {
    extend: 'Ext.Container',
    xtype: 'ctnPreview',
    id: 'ctnPreview',
    requires: ['OA.components.Paper', 'OA.client.Print'],
    config: {
        layout: {
            type: 'vbox',
            align: 'center'
        },
        ui: 'plain',
        scrollable: {
            direction: 'vertical',
            directionLock: true
        },
        items: [
            {
                id: 'toolbarPreview',
                xtype: 'toolbar',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector'
            },
            {
                id: 'cpaper',
                xtype: 'cpaper'
            },
            {
                id: 'toolbarOthers',
                xtype: 'toolbar',
                docked: 'bottom',
                cls: 'checkboxOnly',
                style: 'height:30px;'
            },
            {
                id: 'listOthersPreview',
                xtype: 'list',
                flex: 1,
                mode: "SINGLE",
                itemTpl: '{name}',
                style: 'height:250px;width:300px;',
                listeners: {
                    itemtap: function (list, index, item, record, event) {
                        var me = Ext.getCmp('ctnPreview');
                        var qs = OA.common.Global.getQ();
                        if (qs.app === 'tidy') {
                            me.onTidyListItemTap(record);
                        } else {
                            Ext.getCmp('ctnPreview').doNewTab({ text: record.get('name'), mode: record.get('value') });
                        }
                        Ext.getCmp('listOthersPreview').setHidden(true);
                    }
                }
            },
            {
                id: 'listBatchPreview',
                xtype: 'list',
                flex: 1,
                mode: "SINGLE",
                itemTpl: '{name}',
                style: 'height:250px;width:300px;',
                listeners: {
                    itemtap: function (list, index, item, record, event) {
                        var batchToText;
                        var batchToMode;
                        if (record.get('value') === 'BatchToMultiple') {
                            batchToText = '一文多發';
                            batchToMode = 'Multiple';
                        } else {
                            batchToText = '分址分文';
                            batchToMode = 'Divide';
                        }

                        //計算總共有多少紙本受文者，並提供輸入列印範圍
                        var ctr = Ext.getCmp('ctnPreview');
                        var initParas = ctr.getInitParas();
                        //var contactList = initParas.contactList;

                        // 當initParas抓不到值時就從WK抓，解決未取號時批次列印功能無效的問題 - by yi-chi chiu
                        var wkContact = OA.common.Utils.getContactList(OA.common.Global.getCurrentWKContent());
                        var objContactList = (wkContact) ? { childNodes: wkContact } : undefined;
                        var contactList = initParas.contactList || objContactList;

                        if (contactList && contactList.childNodes && contactList.childNodes.length > 0) {
                            var docItems = [];

                            //依文本內容排序
                            var keySort = ['正本', '副本', '抄本', '主持人', '出席者', '列席者', '會議主席', '出列席機關人員'];
                            Ext.Array.each(keySort, function (key) {
                                Ext.Array.each(contactList.childNodes, function (contact) {
                                    if (contact.KEY == key) {
                                        if (contact.TRANSTYPE == '1' || contact.TRANSTYPE == '2') {
                                            if (contact.children) {
                                                var children = JSON.parse(contact.children);
                                                var except = contact.except.split('、');
                                                Ext.Array.each(children, function (child) {
                                                    if (except.indexOf(child.dep3Name) < 0) {
                                                        var item = {
                                                            ADDR: child.dep3Addr,
                                                            ARCENO: child.dep3Zone,
                                                            ATTACH: "",
                                                            CODE: child.dep3No,
                                                            CODENAME: child.dep3Name,
                                                            GROUP: "",
                                                            GROUPLIST: "",
                                                            KEY: contact.KEY,
                                                            PEOPLESEND: contact.PEOPLESEND,
                                                            REALTRANSTYPE: contact.REALTRANSTYPE,
                                                            TRANSTYPE: contact.TRANSTYPE,
                                                            TRANSTYPENAME: contact.TRANSTYPENAME,
                                                            TYPE: contact.TYPE,
                                                            VALUE: child.dep3Name
                                                        };
                                                        docItems.push(item);
                                                    }
                                                });
                                            } else {
                                                docItems.push(contact);
                                            }
                                        }
                                    }
                                });
                            });

                            if (docItems.length > 0) {
                                Ext.Msg.prompt("批次列印", "請輸入列印範圍(開始位置) 1~" + docItems.length + "：", function (bu, txt) {
                                    var startIndex = '';
                                    var endIndex = '';
                                    if (txt != '' && !isNaN(parseInt(txt))) {
                                        startIndex = parseInt(txt);
                                        if (startIndex > docItems.length || startIndex < 1) {
                                            Ext.Msg.alert("超出列印範圍！");
                                        } else {
                                            Ext.Msg.prompt("批次列印", "請輸入列印範圍(結束位置) " + startIndex + "~" + docItems.length + "：", function (bu1, txt1) {
                                                if (txt1 != '' && !isNaN(parseInt(txt1))) {
                                                    endIndex = parseInt(txt1);
                                                    if (endIndex > docItems.length || endIndex < startIndex) {
                                                        Ext.Msg.alert("超出列印範圍！");
                                                    } else {
                                                        var printItem = docItems.slice(startIndex - 1, endIndex);
                                                        if (printItem && printItem.length > 0) {
                                                            var storePapers = Ext.getStore('previewPapers');
                                                            if (!storePapers) {
                                                                storePapers = Ext.create("Ext.data.Store", {
                                                                    id: 'previewPapers',
                                                                    model: 'OA.model.Contact',
                                                                    autoSync: true,
                                                                    autoLoad: true,
                                                                    data: printItem
                                                                });
                                                            } else {
                                                                storePapers.setData(printItem);
                                                            }
                                                            ctr.doNewTab({ text: batchToText, mode: batchToMode });
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                Ext.Msg.alert("沒有任何紙本受文者！");
                            }
                        }
                        Ext.getCmp('listBatchPreview').setHidden(true);
                    }
                }
            }
        ],
        previewMode: null,
        currentDoctype: '',
        meta: null,
        commonData: null,
        previewSetting: { isDownload: false },
        listUpload: {},
        renderStack: { Normal: 0, Draft: 1, ClearDraft: 2, Opinion: 3, Finish: 99 },
        sourceWK: null
    },
    Enum: {
        Normal: 'Normal',
        Draft: 'Draft',
        ClearDraft: 'ClearDraft',
        Opinion: 'Opinion',
        Multiple: 'Multiple',
        Divide: 'Divide',
        General: 'General',
        properties: {
            Normal: { name: "函面", value: 'Normal', isDraft: false },
            Draft: { name: "稿面", value: 'Draft', isDraft: true },
            ClearDraft: { name: "清稿後", value: 'ClearDraft', isDraft: true },
            Opinion: { name: "簽辦意見", value: 'Opinion', isDraft: false },
            Multiple: { name: "一文多發", value: 'Multiple', isDraft: false },
            Divide: { name: "分址分文", value: 'Divide', isDraft: false },
            General: { name: "受文者統稱", value: 'General', isDraft: false }
        }
    },
    initialize: function () {
        var me = this;
        var q = OA.common.Global.getQ();
        if (q.toolbar !== 'n') {
            me.create();
        } else {
            Ext.getCmp('toolbarPreview').setHidden(true);
            Ext.getCmp('toolbarOthers').setHidden(true);
            Ext.getCmp('listOthersPreview').setHidden(true);
            Ext.getCmp('listBatchPreview').setHidden(true);

        }
        me.setPreviewSetting({ isDownload: true });
        var ctrCpaper = this.down('cpaper');
        OA.common.Paper.register(ctrCpaper);
        ctrCpaper.on('onCreateCompleted', me.onCreateCompleted);
        ctrCpaper.on('onCreateCopiesCompleted', me.onCreateCopiesCompleted);
    },
    onCreateCompleted: function (paper) {
        var me = Ext.getCmp('ctnPreview');
        var mode = me.getPreviewMode();
        Ext.Viewport.setMasked(false);
        var qs = OA.common.Global.getQ();
        if (qs.by === 'dom') me.switchMode(mode);
        if (qs.action === 'render') me.renderNext();
    },
    onCreateCopiesCompleted: function (ret) {
        var ctrCpaper = OA.common.Paper.main();
        var paras = ctrCpaper.getCreateParas();
        if (ret.h) paras.size = ret.size;
        ctrCpaper.setCreateParas(paras);

        Ext.Viewport.setMasked(false);
        var qs = OA.common.Global.getQ();
        if (qs.toolbar == 'n') {
            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
            if (ctrWK) document.write(ctrWK.toPrintXml());
        }

        //run node
        if (typeof require !== 'undefined') {
            var ipcRenderer = require('electron').ipcRenderer;
            ipcRenderer.send('asyn-electron-printToPDF');
        }
    },
    renderNext: function () {
        var me = this;
        var mode = me.getPreviewMode();
        var list = me.getListUpload();
        list[mode] = OA.common.Global.getApp().getController('OA.controller.Work').toPrintXml();
        var prepare = me.getRenderStack();

        var nextMode = '';
        for (var next in prepare) {
            if (!list.hasOwnProperty(next)) {
                nextMode = next;
                break;
            }
        }
        var qs = OA.common.Global.getQ();
        if (nextMode == 'Finish') {
            parent.$('body').trigger('onIframeRenderCompleted', list);
        } else {
            var ctr = Ext.getCmp('formatType');
            var idx = prepare[next];
            ctr.setPressedButtons(ctr.getItems().items[idx]);
        }
    },
    /**
     *  建立函稿切換
     */
    createTabs: function (extra, documentTemplate) {
        //console.log(extra);
        var me = this;
        var qs = OA.common.Global.getQ();
        var doctype = '';
        if (me.getCurrentDoctype()) doctype = me.getCurrentDoctype();
        var wk = OA.common.Global.getCurrentWKContent();
        if (wk) doctype = wk.DocumentType;

        var ctrFormatType = Ext.getCmp('formatType');
        var items = [];

        items.push({ text: doctype, mode: me.Enum.Normal });
        if(doctype === '函' || doctype === '簽') {
            const btnText = doctype === '函' ? doctype + '稿' : doctype;
            items.push({ text: btnText + '(核章區正常)', mode: me.Enum.Draft, pressed: documentTemplate.indexOf('加大') === -1 });
            items.push({ text: btnText + '(核章區加大)', mode: me.Enum.Draft, pressed: documentTemplate.indexOf('加大') !== -1 });
        } else {
            items.push({ text: doctype + '(稿)', mode: me.Enum.Draft, pressed: true });
        }
        if (extra) items = items.concat(extra);
        items.push({ text: '簽辦意見', mode: me.Enum.Opinion });
        /*
        if ((doctype == '簽' || doctype == '便簽') && qs.app !== 'genpages' && qs.action !== 'render') {
            items.push({ text: doctype + '(含簽辦意見)', mode: me.Enum.Normal });
        } else {
            items.push({ text: '簽辦意見', mode: me.Enum.Opinion });
        }*/


        if (qs.send === 'Y') items.push({ text: '一文多發', mode: 'Send' });
        if (qs.divide === 'Y') items.push({ text: '分址分文', mode: 'Send2' });   //0904  轉交換上傳後，判斷分址分文狀態按鈕，預帶所有紙本受文者為列印單位  Chloe.sia

        if (items.length <= 0) return;
        if (ctrFormatType) ctrFormatType.setItems(items);

        //其它表單，上行簽為簽辦單
        var data;
        if (doctype == '上行簽') {
            data = [
                { name: '簽辦單', value: 'NotesVerify' },
                { name: '會銜會辦單', value: 'MultiOgnUnit' }
            ];
        } else {
            //1102 取號後才能列印簽稿會核單，創稿不顯示簽稿會核單 Chloe.sia
            if (OA.common.Global.getWinOpener().getInitPreviewParas().wkContent.doSno == '') {
                data = [
                    // { name: '簽稿會核單', value: 'DraftVerify' },
                    { name: '簽稿會核單（空白）', value: 'EmptyDraftVerify' },
                    { name: '會銜會辦單', value: 'MultiOgnUnit' }
                ];
            } else {
                data = [
                    { name: '簽稿會核單', value: 'DraftVerify' },
                    { name: '簽稿會核單（空白）', value: 'EmptyDraftVerify' },
                    { name: '會銜會辦單', value: 'MultiOgnUnit' }
                ];
            }

        }
        var ctrOtherspreviw = Ext.getCmp('listOthersPreview');
        var store = ctrOtherspreviw.getStore();
        if (store) {
            store.removeAll();
            store.sync();
        }
        ctrOtherspreviw.setData(data);

        // 批次列印 增加一文多發 & 分址分文    
        var batchData = [
            { name: '一文多發', value: 'BatchToMultiple' },
            { name: '分址分文', value: 'BatchToDivide' }
        ];
        var ctrBatchPreview = Ext.getCmp('listBatchPreview');
        var store = ctrBatchPreview.getStore();
        if (store) {
            store.removeAll();
            store.sync();
        }
        ctrBatchPreview.setData(batchData);
        // <= 批次列印 增加一文多發 & 分址分文

        if (qs.send === 'Y') {
            ctrFormatType.setPressedButtons(ctrFormatType.getItems().items[3]);
        }
        if (qs.divide === 'Y') {
            ctrFormatType.setPressedButtons(ctrFormatType.getItems().items[3]);
        }


        window.doDraft = function () {
            ctr.setPressedButtons(ctrFormatType.getItems().items[0]);
        }
    },
    /**
     *  綜整
     */
    createTidyTabs: function (tabs) {
        var me = this;
        var noteTabs = [];

        noteTabs.push(tabs[0]); //承辦
        Ext.Array.each(tabs, function (tab) {
            if (tab.paperNo) {
                var item = {};
                Ext.apply(item, tab);
                item.mode = tab.code;
                noteTabs.push(item);
            }
        });

        me.doRenderStackInit(noteTabs);

        var ctrOtherForm = Ext.getCmp('otherForm');
        ctrOtherForm.setText('簽稿會核單(各機關單位)&nbsp;&nbsp;<span class="chevron-down" />');
        ctrOtherForm.setUi('normal');

        Ext.getCmp('listOthersPreview').setData(tabs);
        return noteTabs;
    },
    doRenderStackInit: function (noteTabs) {
        var me = this;
        var ctr = Ext.getCmp('formatType');
        if (ctr) ctr.setItems(noteTabs);
        var stk = {};
        Ext.Array.each(noteTabs, function (p, idx) {
            if (idx != 0) stk[p.code] = idx;
        });
        stk.Finish = 99;
        me.setRenderStack(stk);
    },
    /**
     *  初始建立
     */
    create: function () {
        this.createToolbarPreview();
        this.createToolbarOthers();
    },
    /**
     *  建立上方功能欄
     */
    createToolbarPreview: function () {
        var qs = OA.common.Global.getQ();
        var html = [];
        html.push('<input type="checkbox" id="checkDuplex" style="zoom: 2;margin:2px 0px 0px 0px;" >');
        html.push('<label for="checkDuplex"> </label></input>');

        var itemsLeft = [
            {
                title: '列印', ui: 'plain', iconCls: 'fa-print', action: 'print',
                handler: function (button) {
                    var me = Ext.getCmp('ctnPreview');
                    var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                    if (ctrWK) ctrWK.showPrint();
                }
            },
            {
                title: '匯出', ui: "plain", iconCls: 'fa-external-link', action: 'export', hidden: true,
                handler: function (button) {
                    OA.common.Funcs.show('FormExport');
                }
            },
            {
                title: '下載PDF',
                id: 'butPreviewPdfDownload',
                ui: 'plain',
                iconCls: 'fa-file-pdf-o',
                action: 'download',
                hidden: true,
                handler: function (button) {
                    var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                    var data = Ext.getCmp('ctnPreview').getCommonData();
                    data.previewMode = Ext.getCmp('ctnPreview').getPreviewMode();
                    if (ctrWK) ctrWK.onPrintDownloadTap(null, { type: 'pdf', printData: data });
                }
            },
            {
                title: '圖檔', ui: 'plain', iconCls: 'fa-file-image-o', action: 'printImage', hidden: true,
                handler: function (button) {
                    var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                    var options = { type: 'pdf', xml: B64.encode(ctrWK.toPrintXml()) };
                    //OA.client.File.exportPDF(options);
                }
            },
            {
                title: '放大', ui: 'plain', iconCls: 'fa-search-plus', action: 'previewZoom',
                handler: function (button) {
                    Ext.getCmp('ctnPreview').zoomIn();
                }
            },
            {
                title: '縮小', ui: 'plain', iconCls: 'fa-search-minus', action: 'previewZoom',
                handler: function (button) {
                    Ext.getCmp('ctnPreview').zoomOut();
                }
            },
            {
                id: 'butStamps',
                title: '章戳', ui: "plain", iconCls: 'fa-ticket', action: 'seal', hidden: true,
                handler: function (button) {
                    OA.common.Funcs.show('FormStamps', button);
                }
            },
            {
                id: 'butPreviewAttach',
                title: '附件', ui: "plain", iconCls: 'fa-paperclip', action: 'attach', badgeCls: 'icobadge', hidden: true,
                handler: function (button) {
                    OA.common.Fields.popupFromShow('附件上傳');
                }
            },
            { xtype: 'spacer' }
        ];

        var itemsTidy = [  //0706 會核單開啟修正 chloe.sia
            {
                id: 'butTidy',
                xtype: 'button',
                text: '簽稿會核單(綜整)',
                ui: 'confirm',
                handler: function (button) {
                    var me = Ext.getCmp('ctnPreview');
                    var qs = OA.common.Global.getQ();
                    qs.action = 'init';
                    me.doTidy();
                }
            }
        ];


        var itemsSeg = [
            {
                //建立文稿切換按鈕
                id: 'formatType',
                xtype: 'segmentedbutton',
                listeners: {
                    toggle: function (container, button, pressed) {
                        if (!pressed) return;
                        var mode = button.config.mode;
                        var ctnPreview = Ext.getCmp('ctnPreview');
                        ctnPreview.setPreviewMode(mode);
                        var qs = OA.common.Global.getQ();
                        var checkDuplex = document.querySelector('#checkDuplex');
                        if (checkDuplex)
                            checkDuplex.check = undefined;
                        if (qs.by === 'import') {
                            ctnPreview.switchMode(mode);
                        } else if (button.config.grouping) {
                            //分群列印
                            var storePapers = Ext.getStore('previewPapers');
                            if (!storePapers) {
                                storePapers = Ext.create("Ext.data.Store", {
                                    id: 'previewPapers',
                                    model: 'OA.model.Contact',
                                    autoSync: true,
                                    autoLoad: true,
                                    data: button.config.grouping
                                });
                            } else {
                                storePapers.setData(button.config.grouping);
                            }
                            ctnPreview.load(button.config);
                        } else {
                            ctnPreview.load(button.config);
                        }
                    }
                }
            },
            {
                //其它表單
                id: 'otherForm',
                ui: 'plain',
                iconCls: '',
                text: '其它表單',
                handler: function (button) {
                    var ctrOthersPreview = Ext.getCmp('listOthersPreview');
                    var isHidden = ctrOthersPreview.isHidden();
                    if (isHidden || isHidden == null) {
                        ctrOthersPreview.showBy(button);
                    } else {
                        ctrOthersPreview.setHidden(true);
                    }
                }
            },
            {
                iconCls: 'fa-wpforms',
                text: html.join(''),
                title: '雙面列印',
                sort: 'Duplex',
                style: "border: 0px;background-image: none;background-color: #1468a2;",
                handler: function (button) {
                    var checkDuplex = document.querySelector('#checkDuplex');
                    var ctr = Ext.getCmp('ctnPreview');
                    if (ctr) {
                        if (['Multiple', 'Divide', 'General', 'Send'].indexOf(ctr.getPreviewMode()) >= 0) {
                            var initParas = ctr.getInitParas();
                            checkDuplex.check = checkDuplex.checked ? false : true;
                            ctr.loadDom(ctr.getPreviewMode(), initParas);
                        }
                    }
                    var itemGutter = [];
                    var no = 1;
                    do {
                        itemGutter = document.querySelectorAll('#canvas_gutter_' + no);
                        if (itemGutter) {
                            if (no % 2 == 0) {
                                var me = Ext.getCmp('ctnPreview');
                                var initParas = me.getInitParas();
                                Ext.Array.each(itemGutter, function (item) {
                                    var transform = item.getAttribute("transform");
                                    var moveY = transform.split(',')[1].replace(')', '');
                                    var _X = 686;
                                    if (initParas.oSVG && initParas.oSVG.vm.templateUrl) _X = 713;
                                    var moveX = checkDuplex.checked ? 0 : _X;
                                    var tranGutter = Ext.String.format('translate({0},{1})', moveX, moveY);
                                    item.setAttribute("transform", tranGutter);
                                });
                            }
                            no++;
                        }
                    }
                    while (itemGutter.length > 0);
                }
            },
            { xtype: 'spacer' }
        ]

        var itemRight = [
            {
                title: '上頁', ui: 'plain', iconCls: 'fa-arrow-up', action: 'pageUp', right: 120,
                handler: function (button) {
                    Ext.getCmp('ctnPreview').getScrollable().getScroller().scrollToTop();
                }
            },
            {
                title: '下頁', ui: 'plain', iconCls: 'fa-arrow-down', action: 'pageDown', right: 80,
                handler: function (button) {
                    Ext.getCmp('ctnPreview').getScrollable().getScroller().scrollToEnd();
                }
            },
            {
                title: '增加行距', ui: 'plain', iconCls: 'fa-angle-double-down', action: 'LineUp', right: 40,
                hidden: false,
                handler: function (button) {
                    OA.common.Paper.main().editActions().lineUp();
                }
            },
            {
                title: '減少行距', ui: 'plain', iconCls: 'fa-angle-double-up', action: 'LineDown', right: 0,
                hidden: false,
                handler: function (button) {
                    OA.common.Paper.main().editActions().lineDown();
                }
            },
            { xtype: 'spacer' }
        ];




        var items = [];
        if (qs.app == 'tidy') {
            items = itemsLeft.concat(itemsTidy).concat(itemsSeg);
            items.push({ xtype: 'spacer' });
        } else {
            items = itemsLeft.concat(itemsSeg).concat(itemRight);
        }

        if (qs.debug === 'y') {
            items.push({
                text: 'sl', ui: 'plain', iconCls: '', right: 320,
                handler: function (button) {
                    var initParas = window.opener.getInitPreviewParas();
                    var wnd = window.open("about:blank", "", "_blank");
                    wnd.document.write('<textarea style="width: 800px; height: 600px;">' + initParas.xml + '</textarea>');
                }
            });
            items.push({
                text: 'wk', ui: 'plain', iconCls: '', right: 280,
                handler: function (button) {
                    var initParas = window.opener.getInitPreviewParas();
                    var text = JSON.stringify(OA.common.Global.getCurrentWKContent());
                    var wnd = window.open("about:blank", "", "_blank");
                    wnd.document.write('<textarea style="width: 800px; height: 600px;">' + text + '</textarea>');
                }
            });
            items.push({
                text: 'svg',
                ui: 'plain', iconCls: '', action: 'svgExport', right: 240,
                handler: function (button) {
                    var size = OA.common.Paper.main().getCreateParas().size;
                    var svg = OA.common.Paper.main().getSvgPaper();
                    //console.log(size);
                    svg.setResolution(size.w * svg.getZoom(), (size.h) * svg.getZoom());

                    var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                    var orginXML = ctrWK.toPrintXml();

                    var xml = orginXML.replace(/<image/g, '<img');
                    var wnd = window.open("about:blank", "", "_blank");
                    wnd.document.write('<textarea style="width: 800px; height: 600px;">' + xml + '</textarea>');
                }
            });
        }
        Ext.getCmp('toolbarPreview').setItems(items);

        Ext.Array.forEach(Ext.getCmp('toolbarPreview').getItems().items, function (button) {
            if (button.config.title) {
                if (button.config.title.length > 3) {
                    $(button.bodyElement.dom).qtip({
                        content: {
                            text: '<p style="font-size:200%;">' + button.config.title + '</p>'
                        },
                        position: {
                            my: 'top right',
                            at: 'bottom center'
                        },
                        show: {
                            'delay': 500,
                            'solo': true
                        }
                    });

                } else {
                    $(button.bodyElement.dom).qtip({
                        content: {
                            text: '<p style="font-size:200%;">' + button.config.title + '</p>'
                        },
                        position: {
                            my: 'top left',
                            at: 'bottom center'
                        },
                        show: {
                            'delay': 500,
                            'solo': true
                        }
                    });
                }
            }
        });
    },
    /**
     *  建立下方功能欄
     */
    createToolbarOthers: function () {
        var items = [
            //{ xtype: 'spacer' },
            {
                id: 'checkStratify',
                xtype: 'checkboxfield',
                name: 'level',
                label: '分層負責',
                labelWidth: '40%',
                style: 'margin:-5px 0px 0px 0px;',
                checked: false,
                listeners: {
                    check: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').stratify(true);
                    },
                    uncheck: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').stratify(false);
                    }
                }
            },
            {
                id: 'checkSeal',
                xtype: 'checkboxfield',
                name: 'seal',
                labelWidth: '40%',
                label: '隱藏核章欄',
                style: 'margin:-5px 0px 0px 0px;',
                checked: false,
                listeners: {
                    check: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').seal(false);
                    },
                    uncheck: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').seal(true);
                    }
                }
            },
            {
                xtype: 'checkboxfield',
                name: 'card',
                labelWidth: '40%',
                label: '身分證遮罩',
                style: 'margin:-5px 0px 0px 0px;',
                checked: false,
                listeners: {
                    check: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').mask(true);
                    },
                    uncheck: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').mask(false);
                    }
                }
            },
            {
                xtype: 'checkboxfield',
                name: 'copy',
                label: '抄本',
                labelWidth: '20%',
                style: 'margin:-5px 0px 0px 0px;',
                checked: false,
                listeners: {
                    check: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').copyDisplay(true);
                        Ext.getCmp('ctnPreview').nameDisplay(false);
                    },
                    uncheck: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').copyDisplay(false);
                        Ext.getCmp('ctnPreview').nameDisplay(true);
                    }
                }
            },
            /*
            {
                id: 'checkInk',
                xtype: 'checkboxfield',
                name: 'ink',
                label: '墨水',
                labelWidth: '20%',
                style: 'margin:-5px 0px 0px 0px;',
                checked: false,
                listeners: {
                    check: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').inkDisplay(true);
                    },
                    uncheck: function (ctr, e, eOpts) {
                        Ext.getCmp('ctnPreview').inkDisplay(false);
                    }
                }
            },
            */
            {
                ui: 'plain', text: '進階設定', style: 'font-size: 26px;margin:-5px 0px 0px 0px;', action: 'printCtrl',
                handler: function (button) {
                    var me = Ext.getCmp('ctnPreview');
                    var options = Ext.clone(Ext.getCmp('ctnPreview').getPreviewSetting());
                    //var initParas = me.getInitParas();
                    var ctrCpaper = me.down('cpaper');
                    if (ctrCpaper && ctrCpaper.element) {
                        var canvasPage = ctrCpaper.element.dom.getElementsByClassName('canvasPage');
                        if (canvasPage && canvasPage.length > 0) {
                            var lastPage = canvasPage[canvasPage.length - 1];
                            var lastPageStr = lastPage.textContent.split('，')[1];
                            //lastPageStr = '共23頁';
                            //var s1 = lastPageStr.textContent.indexOf('共');
                            //var e1 = lastPageStr.textContent.indexOf('頁');
                            var pageNum = lastPageStr.substring(1, lastPageStr.indexOf('頁'));
                            console.log(pageNum);
                            options.pageNum = pageNum;
                        }

                    }
                    //var options = Ext.getCmp('ctnPreview').getPreviewSetting();
                    OA.common.Funcs.show('FormPreviewSetting', null, options);

                    /*
                    //var resetContactList = [];
                    console.log(initParas.contactList);
                    if (initParas && initParas.contactList &&
                        initParas.contactList.childNodes && initParas.contactList.childNodes.length > 0) {
                        var index = 0;
                        me.setMasked({ xtype: 'loadmask', message: '群組資料載入中...' });
                        Ext.Array.each(initParas.contactList.childNodes, function (item) {
                            item.children = null;
                            var doArr = [];
                            doArr.push(item)
                            var data = {};
                            data.empNo = '';
                            data.jsonArrayString = JSON.stringify(doArr);
                            //console.log(data);
                            OA.client.Odaf03Dtl.load(data, function (arrayString) {
                                index++;
                                var jsonArray;
                                if (arrayString !== '') {
                                    arrayString = arrayString.replace(/\\"/g, "").replace(/\"\\/g, "");
                                    //console.log(arrayString);
                                    jsonArray = JSON.parse(arrayString);
                                    item.children = Ext.clone(jsonArray);
                                }
                                if (index == initParas.contactList.childNodes.length) {
                                    me.setMasked(false);
                                    options.printData = initParas.contactList.childNodes;
                                    //console.log(Ext.clone(options.printData));
                                    OA.common.Funcs.show('FormPreviewSetting', null, options);
                                }
                            });
                        });
                    } else {
                        OA.common.Funcs.show('FormPreviewSetting', null, options);
                    }
                    */
                }
            },
            { xtype: 'spacer' },
            // {
            //     ui: 'plain', text: '批次列印', style: 'font-size: 26px;margin:-5px 0px 0px 0px;', action: 'batchCtrl',
            //     handler: function (button) {
            //         var ctrBatchPreview = Ext.getCmp('listBatchPreview');
            //         var isHidden = ctrBatchPreview.isHidden();
            //         if (isHidden || isHidden == null) {
            //             ctrBatchPreview.showBy(button);
            //             //var options = Ext.getCmp('ctnPreview').getPreviewSetting();
            //             //OA.common.Funcs.show('FormPreviewSetting', null, options);
            //         } else {
            //             ctrBatchPreview.setHidden(true);
            //         }
            //     }
            // },
            { xtype: 'spacer' }
        ];
        Ext.getCmp('toolbarOthers').setItems(items);

        // 重新設定卷軸大小，解決批次列印設定後畫面上只能看到兩頁的問題 - by yi-chi chiu
        OA.common.Utils.indicatorWith(Ext.getCmp('toolbarOthers'));
    },
    doNewTab: function (tab) {
        var qs = OA.common.Global.getQ();
        var ctr = Ext.getCmp('formatType');
        var count = ctr.getItems().items.length;
        if (count > 3) ctr.removeAt(3);
        ctr.add(tab);
        var pressedItem;
        pressedItem = ctr.getItems().items[ctr.items.length - 1];
        ctr.setPressedButtons(pressedItem);  // raise event load
    },
    getInitParas: function () {
        //console.log('this');
        var qs = OA.common.Global.getQ();
        var win = OA.common.Global.getWinOpener();
        var initParas;
        if (qs.app === 'genpages') {   // win.showBy = 'opener'

            console.log(win);
            initParas = win.getCurrentUser();
            //initParas = win.parent.getCurrentUser();
            Ext.apply(initParas, qs);
            return initParas;
        }

        if (qs.app === 'tidy') {
            initParas = win.getInitPreviewParas();
            Ext.apply(initParas, qs);
            return initParas;
        }
        if (win.showBy === 'opener') {
            if (typeof require !== 'undefined') {
                var jInitParas = require('electron').remote.getGlobal('initParas').preview;
                initParas = JSON.parse(jInitParas);
            } else {
                initParas = win.getInitPreviewParas();
                //console.log(initParas);
            }
        } else {
            //run node
            if (typeof require !== 'undefined') {
                var ipcRenderer = require('electron').ipcRenderer;
                var ret = ipcRenderer.sendSync('sync-electron-inputParas');
                initParas = { xml: ret.printXML, cc: ret.cc };
                mode = ret.previewMode;
                qs.by = 'electron';
            } else {
                if (win.showBy == 'parent') {
                    initParas = win.initPreviewParas;
                } else {
                    initParas = {
                        data: {
                            orgNo: qs.orgNo,
                            doDeptno: qs.doDeptno,
                            doSno: qs.doSno,
                            paperNo: qs.paperNo,
                            version: qs.version,
                            token: qs.token
                        }
                    };
                }
            }
        }

        return initParas;
    },
    /**
     *  qs.by === 'dom' , mode=null to init createTabs
     */
    load: function (paperConfig, options) {
        var me = this;
        var mode = paperConfig.mode;
        var qs = OA.common.Global.getQ();
        var initParas = me.getInitParas();
        //console.log(Ext.clone(initParas));
        var toolbarOthers = Ext.getCmp('toolbarOthers');
        var butStamps = Ext.getCmp('butStamps');
        var commonData;

        //console.log(Ext.clone(qs.app));
        if (qs.app === 'genpages') {
            me.doGenpages(initParas);
            return;
        } else if (qs.app === 'tidy') {
            toolbarOthers.setHidden(true);
            Ext.getCmp('listOthersPreview').setHidden(true);
            me.doTidy(paperConfig);
            return;
        }
        var xml = initParas.xml;
        if (qs.by === 'import' || qs.by === 'svc') {
            OA.common.Global.setInitParas(initParas.data);
        } else if (qs.by === 'b64') {
            xml = B64.decode(xml);
        }

        if (qs.by === 'import') {
            OA.common.Funcs.show('FormImport');  //匯入
        } else if (qs.by === 'svc') {
            OA.common.UrlMgr.setToken(initParas.data.token);
            if (initParas.data.documentType) {
                var model = OA.common.DIMgr.getModelName('wk', initParas.data.documentType);
                OA.client.WK.createPaper(model, mode);
            } else {
                var testModel = OA.common.DIMgr.getModelName('wk', '函');
                OA.client.WK.load({ model_wk: testModel }, function (testSVG, testRecord) {
                    //取得 DocumentType
                    var wk = OA.common.Global.getCurrentWKContent();
                    testModel = OA.common.DIMgr.getModelName('wk', wk.DocumentType);
                    OA.client.WK.createPaper(testModel, mode);
                });
            }
        } else if (qs.by === 'dom') {
            me.loadDom(mode, initParas, paperConfig.text);
        } else if (qs.by === 'print') {
            OA.common.Paper.main().print(initParas);
        } else if (qs.by === 'data') {
            var data = JSON.parse(initParas.printData);
            var modelName = OA.common.DIMgr.getModelName('wk', data.wkContent.DocumentType);
            var record = Ext.create(modelName);
            var fields = record.getFields().map['layout'].config.mapping();
            data.fields = fields;
            OA.common.Paper.main().createByParas(data, mode);
        } else if (qs.by === 'overprint') {
            me.loadDom('overprint', initParas);
            me.switchMode('Normal');
        } else if (qs.by === 'export') {
            me.loadDom('Draft', initParas);
        } else { //by xml
            if (!xml) {
                Ext.Msg.alert('XML NOT FOUND');
                return;
            }
            commonData = OA.common.DIMgr.ImportSL(xml, mode);
            if (mode == 'init') {
                me.setCurrentDoctype(commonData.meta.DocumentType);
                me.setMeta(commonData.meta);
                me.createTabs();
            } else if (mode == 'DraftVerify' || mode == 'MultiOgnUnit' || mode == 'EmptyDraftVerify' || mode == 'NotesVerify') {
                Ext.Ajax.request({
                    url: 'web/' + mode + '.svg',
                    withCredentials: true,
                    useDefaultXhrHeader: false,
                    success: function (response) {
                        OA.common.Paper.main().createForm({ xml: response.responseText });
                    }
                });
                // initParas.oSVG.vm.templateUrl='web/' + mode + '.svg';
                // OA.client.WK.loadTemplate(function (xml) {
                //     OA.common.Paper.main().createForm({xml: xml});
                // });

            } else {
                commonData.cc = (initParas.cc) ? initParas.cc : me.getAdvancedSettings(mode);
                commonData.meta = me.getMeta();
                commonData.printXML = xml;
                commonData.oSVG.isDoRevise = true; //追蹤修訂
                //console.log(initParas);
                OA.common.Paper.main().createByParas(commonData, mode);
            }
            me.setCommonData(commonData);
        }

        if (mode === 'Draft' || mode === 'Normal') {
            toolbarOthers.setHidden(false);
        } else {
            toolbarOthers.setHidden(true);
        }

        if (butStamps) {
            if (initParas && initParas.Role) {
                if (initParas.Role.roleId == '02') {
                    //console.log(mode);
                    mode == 'Draft' ? butStamps.setHidden(true) : butStamps.setHidden(false);
                }
            }
        }


        //Ext.getCmp('checkInk').setHidden(mode === 'Normal'); //數位墨水

        Ext.getCmp('checkSeal').setHidden(mode === 'Normal'); //核章欄

        //表單列印不顯示其它表單
        if (initParas.oSVG && initParas.oSVG.vm.templateUrl)
            Ext.getCmp('otherForm').setHidden(true);
        else
            Ext.getCmp('otherForm').setHidden(false);

        //wait for onCreateCompleted to do svg
    },
    loadDom: function (mode, initParas, btnText = '') {
        var me = this;
        var qs = OA.common.Global.getQ();
        if (mode == 'init') {

            // if (typeof require !== 'undefined') {
            //     var win = require('electron').remote.getCurrentWindow();
            //     win.webContents.openDevTools();
            // }

            if (!initParas.wkContent) {
                var ctrFormatType = Ext.getCmp('formatType');
                var items = [];
                items.push({ text: '簽辦意見', mode: me.Enum.Opinion });
                //其它表單
                var data = [
                    { name: '簽稿會核單（空白）', value: 'EmptyDraftVerify' }
                ];
                var ctrOtherspreviw = Ext.getCmp('listOthersPreview');
                var store = ctrOtherspreviw.getStore();
                if (store) {
                    store.removeAll();
                    store.sync();
                }
                ctrOtherspreviw.setData(data);
                if (ctrFormatType) ctrFormatType.setItems(items);
                ctrFormatType.setPressedButtons(ctrFormatType.getItems().items[0]);
            } else {
                me.setCurrentDoctype(initParas.wkContent.DocumentType);
                me.createTabs(initParas.extraTabs, initParas.wkContent.DocumentTemplate);
                if (!OA.common.Global.getCurrentViewModel()) {
                    if (initParas.oSVG) OA.common.Global.setCurrentViewModel(initParas.oSVG.vm);
                }
            }

        } else if (mode === 'Opinion') {
            OA.common.Paper.main().createByParas({ oSVG: initParas.opinion }, mode);
        } else if (mode == 'DraftVerify' || mode == 'MultiOgnUnit' || mode == 'EmptyDraftVerify' || mode == 'NotesVerify') {
            if (mode == 'DraftVerify' || mode == 'MultiOgnUnit') {
                var values = {
                    action: 'create',
                    qc: '2',
                    qFormat: mode == 'DraftVerify' ? '簽稿會核單' : '會銜公文會辦單',
                    qIsNew: true,
                    qNumberWay: '1',
                    qTemplate: mode == 'DraftVerify' ? '簽稿會核單' : '會銜公文會辦單'
                }
                var modelName = OA.common.DIMgr.getModelName('wk', values.qFormat);
                var record = Ext.create(modelName);
                var fields = record.getFields().map['layout'].config.mapping();
                OA.common.Global.setQueryDefault(initParas.QueryDefault);
                OA.common.Global.setInitParas(initParas.initParas);
                me.setCurrentDoctype(values.qFormat);
                var options = { previewMode: mode };
                var wk = OA.common.DIMgr.generateNewWK(fields, values);
                var vm = OA.common.Global.getCurrentViewModel();
                //var rs = Ext.clone(record.getProxy().getReader().readRecords(Ext.clone(wk)).getRecords()[0]);

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
                var initParas = OA.common.Global.getInitParas().documentType;
                var oSVGVm = OA.common.Global.getWinOpener().getInitPreviewParas().oSVG

                if (mode == 'DraftVerify') {
                    if (initParas) {
                        if (oSVGVm && oSVGVm.vm && oSVGVm.vm.KDRichTextBlockList) {
                            if (initParas == '便簽') {
                                var richText = oSVGVm.vm.KDRichTextBlock_1_context
                                if (richText.match(/ | |　/g) != null) { //判別是否全部空值或全部空格 Chloe.sia
                                    if (richText.match(/ | |　/g).length == richText.length) {
                                        if (oSVGVm.vm['KDRichTextBlock-10001_context'] != undefined) {
                                            vm.主旨 = oSVGVm.vm['KDRichTextBlock-10001_context']
                                        }
                                    } else {
                                        vm.主旨 = oSVGVm.vm.KDRichTextBlock_1_context
                                    }
                                } else {
                                    vm.主旨 = oSVGVm.vm.KDRichTextBlock_1_context
                                }
                            } else {
                                if (oSVGVm.vm.KDRichTextBlock_0_context != undefined) {
                                    vm.主旨 = oSVGVm.vm.KDRichTextBlock_0_context
                                }
                            }
                        }
                    }
                    //簽稿會核單
                    oSVG.vm.案情摘要 = vm.主旨 || '';
                    oSVG.vm.檔號 = vm.檔號 || '';
                    oSVG.vm.總收文號 = vm.發文文號 || '';
                    if (oSVG.vm.總收文號 == '') {
                        oSVG.vm.總收文號 = (wk.doSno + '') || '';
                    }
                    oSVG.vm.受會單位 = vm.會辦單位 || '';
                } else {
                    //會銜會辦單
                    oSVG.vm.會辦機關 = vm.發文定義 + '（' + OA.common.Global.getCurrentWKContent().depName + '）' || '';
                }
            }
            else if (mode == 'NotesVerify') {
                var values = {
                    action: 'create',
                    qc: '2',
                    qFormat: '會辦單',
                    qIsNew: true,
                    qNumberWay: '1',
                    qTemplate: '會辦單'
                }
                var modelName = OA.common.DIMgr.getModelName('wk', values.qFormat);
                var record = Ext.create(modelName);
                var fields = record.getFields().map['layout'].config.mapping();
                OA.common.Global.setQueryDefault(initParas.QueryDefault);
                OA.common.Global.setInitParas(initParas.initParas);
                me.setCurrentDoctype(values.qFormat);
                var options = { previewMode: mode };
                var wk = OA.common.DIMgr.generateNewWK(fields, values);
                var vm = OA.common.Global.getCurrentViewModel();
                //var rs = Ext.clone(record.getProxy().getReader().readRecords(Ext.clone(wk)).getRecords()[0]);


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

                oSVG.vm.會辦機關 = vm.會辦單位 || '';
                oSVG.vm.承辦機關 = vm.承辦單位 || '';
                //  oSVG.vm.承辦人 = vm.承辦人 || '';

            }

            OA.client.WK.loadTemplate('web/' + mode + '.svg', function (xml) {
                OA.common.Paper.main().setPreviewMode(mode);
                OA.common.Paper.main().createForm({ xml: xml }, fields, null, (oSVG) ? oSVG.vm : null);
            });

        } else {
            var isWkCleanUp = true;
            if (OA.common.Paper.main()) {
                OA.common.Paper.main().setIsPreview(true);
                OA.common.Paper.main().setIsClearPaper(true);

                if (mode == 'Normal') {
                } else if (mode == 'ClearDraft') {
                    mode = 'Draft';
                } else if (mode == 'Draft') {
                    OA.common.Paper.main().setIsClearPaper(false);   //0901 稿面不清稿，於下toolbar墨水調整為清除墨水，呈現清稿後文稿狀態 Chloe.sia
                    isWkCleanUp = false;
                    //var isInk = Ext.getCmp('checkInk').getChecked(); //數位墨水
                    //if (isInk) {
                    //    OA.common.Paper.main().setIsClearPaper(true);  //0901 稿面不清稿，於下toolbar墨水調整為清除墨水，呈現清稿後文稿狀態 Chloe.sia
                    //    isWkCleanUp = true;
                    //}

                    //清稿前頁面檔，保留數位墨水
                    if (qs.action && qs.action == 'render') {
                        OA.common.Paper.main().setIsClearPaper(false);
                        isWkCleanUp = false;
                    }

                } else if (mode == 'overprint') {
                    me.setCurrentDoctype(initParas.wkContent.DocumentType);
                    //console.log(initParas);
                } else if (mode == 'Send' || mode == 'Send2') {
                    me.setCurrentDoctype(initParas.wkContent.DocumentType);
                }
            }

            if (initParas.oSVG && initParas.oSVG.vm && initParas.oSVG.vm.templateUrl) {
                var templateUrl = initParas.oSVG.vm.templateUrl;
                if (templateUrl) {
                    OA.common.Paper.main().setPreviewMode(mode);
                    OA.client.WK.loadTemplate(templateUrl, function (xml) {
                        initParas.oSVG.xml = xml;
                        OA.common.Paper.main().createForm(initParas.oSVG, initParas.fields);
                    });
                    return;
                }
            }

            var options = { previewMode: mode };
            options.sealXml = initParas.sealXml;
            var ctrPreviewSetting = Ext.getCmp('formPreviewSetting');

            if (ctrPreviewSetting) {
                Ext.apply(options, ctrPreviewSetting.getValues());

                var cfg = {};
                var ctrFields = Ext.getCmp('formPreviewSetting').query('button[type=checkbox]');
                Ext.Array.each(ctrFields, function (ctr) {
                    cfg[ctr.config.name] = ctr.config.value == 1 ? true : false;
                });
                Ext.apply(options, cfg);
            }

            var wk = initParas.wkSource;
            if (isWkCleanUp) wk = OA.common.DIMgr.wkCleanUp(initParas.wkContent);
            //遇到令、公告，要補判斷DocumentTemplate確定格式
            if (wk.DocumentType === '令') {
                if (wk.DocumentTemplate !== '令' && wk.DocumentTemplate !== '會銜令') {
                    if (wk.DocumentTemplate === '獎懲令(1人格式)' || wk.DocumentTemplate === '獎懲令(多人格式)') {
                        wk.DocumentType = '獎懲令';
                    } else if (wk.DocumentTemplate === '派免令(1人格式)' || wk.DocumentTemplate === '派免令(多人格式)') {
                        wk.DocumentType = '派免令';
                    } else
                        wk.DocumentType = '受文者令';
                }
            } else if (wk.DocumentType === '公告' && wk.DocumentTemplate === '受文者公告') {
                wk.DocumentType = '受文者公告';
            }

            if (initParas.approveSeal) {
                options.approveSeal = initParas.approveSeal;
            }

            //載入章戳
            if (initParas.Stamps) {
                var datas = [];
                Ext.Array.each(initParas.Stamps.getData().all, function (item) {
                    var data = { type: item.get('type'), stamp: item.get('stamp') };
                    datas.push(data);
                });
                var Stamps = Ext.getStore('Stamps');
                if (Stamps) {
                    Stamps.setData(null);
                    Stamps.setData(datas);
                }
            }

            if (mode == 'Send' || mode == 'Send2') {
                if (wk && wk.DocumentTemplate && (wk.DocumentTemplate + '').indexOf('評議決定通知函') != -1) {
                    OA.common.Paper.main().setLinePadding(2.8);
                }
            }


            var ctr = OA.common.Global.getApp().getController('OA.controller.Work');
            if (ctr) ctr.SealInit();

            //console.log(options);
            var commonData = OA.common.DIMgr.doWkCommon(wk.DocumentType, wk, options);
            commonData.mode = mode;
            commonData.cc = me.getAdvancedSettings(mode, initParas);
            commonData.wkContent = wk;
            commonData.domColors = initParas.domColors;
            commonData.opinion = initParas.opinion;
            commonData.seal = initParas.seal;
            me.setCommonData(commonData);
            if (qs.by === 'export') {
                var ctnPreview = Ext.getCmp('ctnPreview');
                ctnPreview.setPreviewMode(mode);
                OA.common.Paper.main().createByParas(commonData, mode, function () {
                    var ctr = OA.common.Global.getApp().getController('OA.controller.Work');
                    var options = {
                        func: 'doFile',
                        action: 'fileto',
                        xml: ctr.toPrintXml(),
                        name: qs.fullname,
                        ext: qs.fileExt
                    };
                    // OA.client.File.doFile(options, function (ret) {
                    OA.common.Bridge.doClose();
                    // });
                });
            } else {
                if(wk.DocumentType === '函' || wk.DocumentType === '簽') {
                    commonData.wkContent.DocumentTemplate = btnText;
                }
                OA.common.Paper.main().createByParas(commonData, mode);
            }
        }
    },
    /**
     *  取得進階設定
     */
    getAdvancedSettings: function (mode, initparas) {
        var me = this;
        var cfg = {};
        var appoint = false;

        if (initparas && initparas.wkContent) {
            if (initparas.wkContent && initparas.wkContent.DocumentTemplate) {
                if ((initparas.wkContent.DocumentTemplate + '').indexOf('預審委員指派') != -1) {
                    appoint = true;
                }
            }
        }

        var ctrFields = this.query('checkboxfield');
        Ext.Array.each(ctrFields, function (ctr) {
            cfg[ctr.getName()] = ctr.getChecked();
        });

        if (Ext.getCmp('formPreviewSetting')) {
            ctrFields = Ext.getCmp('formPreviewSetting').query('button[type=checkbox]');
            Ext.Array.each(ctrFields, function (ctr) {
                cfg[ctr.config.name] = ctr.config.value;
            });
        }

        var storePapers = Ext.getStore('previewPapers');
        var storeUnHides = Ext.getStore('previewUnHides');
        var items = [];

        //套印
        if (mode === 'overprint') {
            if (initparas != undefined) {
                Ext.Array.each(initparas.printdata.all, function (paras) {
                    var item = {};
                    Ext.apply(item, {
                        attention: paras.get('name'),
                        addr: paras.get('addr'),
                        arceno: paras.get('addNo'),
                        docno: paras.get('docNo'),
                        category: paras.get('category'),
                        original: paras.get('original'),
                        duplicate: paras.get('duplicate'),
                        level: paras.get('level') == 'show' ? true : false,
                        names: paras.get('signname') == 'show' ? true : false,
                        variable: paras.get('variable')
                    });
                    items.push(item);
                });
            }
        }

        if (mode === 'Send') {  //0904  轉交換一文多發上傳後，判斷目前所有受文者中是否含有紙本受文者，自動建立進階設定一文多發狀態按鈕，預帶所有紙本受文者為列印單位   Chloe.sia
            var contactList = initparas.contactList;
            items = [];
            //console.log(contactList);
            if (contactList && contactList.childNodes) {
                Ext.Array.each(contactList.childNodes, function (contact) {
                    if ((contact.TRANSTYPE == '1' || contact.TRANSTYPE == '2') && contact.KEY !== '抄本') {
                        var jsonItems = contact.children;
                        if (jsonItems && jsonItems.length > 0) {
                            try {
                                var children = JSON.parse(jsonItems);
                                var except = contact.except.split('、')
                                Ext.Array.each(children, function (child) {
                                    var item = {};
                                    if (except.indexOf(child.dep3Name) < 0) {
                                        Ext.apply(item, cfg);
                                        Ext.apply(item, {
                                            attention: (child.dep3Name + '').replace('（含附錄）', '').replace('(含附錄)', ''),
                                            addr: child.dep3Addr,
                                            arceno: child.dep3Zone,
                                            key: contact.KEY,
                                            attach: contact.ATTACH,
                                            names: false
                                        });
                                        items.push(item);
                                    }
                                });
                            } catch (e) {
                                console.log(jsonItems);
                            }
                        } else {
                            var item = {};
                            Ext.apply(item, cfg);
                            Ext.apply(item, {
                                attention: (contact.VALUE + '').replace('（含附錄）', '').replace('(含附錄)', ''),
                                addr: contact.ADDR,
                                arceno: contact.ARCENO,
                                key: contact.KEY,
                                attach: contact.ATTACH,
                                names: false
                            });
                            items.push(item);
                        }
                    }
                });
            } else {
                var item = {};
                Ext.apply(item, cfg);
                Ext.apply(item, {
                    attention: '',
                    addr: '',
                    arceno: '',
                    key: '',
                    attach: '',
                    names: false
                });
                items.push(item);

            }
        }
        if (mode === 'Send2') {   //0904  轉交換分址分文上傳後，判斷目前所有受文者中是否含有紙本受文者，自動建立進階設定分址分文狀態按鈕，預帶所有紙本受文者為列印單位  Chloe.sia
            //分址分文：每筆列印單位都要獨自印一份，正副本只會顯示受文單位和不隱藏的單位
            var contactList = initparas.contactList;
            items = [];

            var unHidesOriginal = [];   //正本
            var unHidesDuplicate = [];  //副本
            var unHidesPreside = [];    //主持人
            var unHidesAttendant = [];  //出席者
            var unHidesNonvoting = [];  //列席者
            var unHidesTranscript = []; //抄本
            var unHidesPreside2 = []; //會議主席
            var unHidesAttendant2 = []; //出列席機關人員

            //抓出主持人及副本
            Ext.Array.each(contactList.childNodes, function (r) {
                if (r.KEY == '主持人') unHidesPreside.push(r.VALUE);
                if (r.KEY == '副本') unHidesDuplicate.push(r.VALUE);
            });

            Ext.Array.each(contactList.childNodes, function (r) {
                if (r.TRANSTYPE == '1' || r.TRANSTYPE == '2') {
                    var value = false;
                    var _original = [];
                    var _duplicate = [];
                    var _preside = [];
                    var _attendant = [];
                    var _nonvoting = [];
                    var _transcript = [];
                    var _preside2 = [];
                    var _attendant2 = [];
                    if (r.KEY == '正本') {
                        unHidesOriginal.some(function (v) {
                            if (v === r.VALUE)
                                value = true;
                        });
                        if (!value)
                            _original.push(r.VALUE);
                    } else if (r.KEY == '副本') {
                        unHidesDuplicate.some(function (v) {
                            if (v === r.VALUE)
                                value = true;
                        });
                        if (!value)
                            _duplicate.push(r.VALUE);
                    } else if (r.KEY == '主持人') {
                        unHidesPreside.some(function (v) {
                            if (v === r.VALUE)
                                value = true;
                        });
                        if (!value)
                            _preside.push(r.VALUE);
                    } else if (r.KEY == '出席者') {
                        unHidesAttendant.some(function (v) {
                            if (v === r.VALUE)
                                value = true;
                        });
                        if (!value)
                            _attendant.push(r.VALUE);
                    } else if (r.KEY == '列席者') {
                        unHidesNonvoting.some(function (v) {
                            if (v === r.data.VALUE)
                                value = true;
                        });
                        if (!value)
                            _nonvoting.push(r.VALUE);
                    } else if (r.KEY == '會議主席') {
                        unHidesPreside2.some(function (v) {
                            if (v === r.VALUE)
                                value = true;
                        });
                        if (!value)
                            _nonvoting.push(r.VALUE);
                    } else if (r.KEY == '出列席機關人員') {
                        unHidesAttendant2.some(function (v) {
                            if (v === r.VALUE)
                                value = true;
                        });
                        if (!value)
                            _nonvoting.push(r.VALUE);
                    }


                    _original = _original.concat(unHidesOriginal);//正本
                    _duplicate = _duplicate.concat(unHidesDuplicate);//副本
                    _preside = _preside.concat(unHidesPreside);//主持人
                    _attendant = _attendant.concat(unHidesAttendant);//出席者
                    _nonvoting = _nonvoting.concat(unHidesNonvoting);//列席者
                    _transcript = _transcript.concat(unHidesTranscript);//抄本
                    _preside2 = _preside2.concat(unHidesPreside2);//會議主席
                    _attendant2 = _attendant2.concat(unHidesAttendant2);//出列席機關人員
                    var ogl = (_original.length > 0) ? _original.join('、') : '';
                    var dpl = (_duplicate.length > 0) ? _duplicate.join('、') : '';
                    var prd = (_preside.length > 0) ? _preside.join('、') : '';
                    var atd = (_attendant.length > 0) ? _attendant.join('、') : '';
                    var non = (_nonvoting.length > 0) ? _nonvoting.join('、') : '';
                    var tsp = (_transcript.length > 0) ? _transcript.join('、') : '';
                    var prd2 = (_preside2.length > 0) ? _preside2.join('、') : '';
                    var atd2 = (_attendant2.length > 0) ? _attendant2.join('、') : '';
                    var item = {};
                    Ext.apply(item, cfg);
                    Ext.apply(item, {
                        attention: r.VALUE,
                        addr: r.ADDR,
                        arceno: r.ARCENO,
                        key: r.KEY,
                        attach: r.ATTACH,
                        original: ogl,
                        duplicate: dpl,
                        preside: prd,
                        attendant: atd,
                        nonvoting: non,
                        transcript: tsp,
                        preside2: prd2,
                        attendant2: atd2
                    });
                    items.push(item);
                }
            });
        }

        //沒有任何紙本受文者時
        if (storePapers == undefined || storePapers.data.length === 0) {
            Ext.Array.each(items, function (im) {
                if (im.attention) {
                    var ckEndStr = (im.attention + '').trim().substr((im.attention + '').trim().length - 1);

                    if (ckEndStr == ')') {
                        for (var k = im.attention.length; k >= 0; k--) {
                            var ckstaStr = (im.attention + '').trim().substr(k, 1);
                            if (ckstaStr == '(') {
                                var removeStr = im.attention.substring(k);
                                im.attention = im.attention.replace(removeStr, '');
                                console.log(im.attention)
                                return true;
                            }
                        }
                    } else if (ckEndStr == '）') {
                        for (var k = im.attention.length; k >= 0; k--) {
                            var ckstaStr = (im.attention + '').trim().substr(k, 1);
                            if (ckstaStr == '（') {
                                var removeStr = im.attention.substring(k);
                                im.attention = im.attention.replace(removeStr, '');
                                console.log(im.attention)
                                return true;
                            }
                        }
                    }
                }
                /*
                if (im.attention && im.attention.indexOf('(') != -1 && im.attention.indexOf(')') != -1) {
                    var removeStr = im.attention.substring(im.attention.indexOf('('), (im.attention.indexOf(')') + 1));
                    im.attention = im.attention.replace(removeStr, '')

                } else if (im.attention && im.attention.indexOf('（') != -1 && im.attention.indexOf('）') != -1) {
                    var removeStr2 = im.attention.substring(im.attention.indexOf('（'), (im.attention.indexOf('）') + 1));
                    im.attention = im.attention.replace(removeStr2, '')

                }
                */
            })
            return items;
        }
        if (mode === me.Enum.Multiple) { //進階設定裡的一文多發


            //一文多發：每筆列印單位都要獨自印一份，正副本不更動？
            storePapers.each(function (r) {
                var item = {};
                Ext.apply(item, cfg);
                Ext.apply(item, {
                    attention: r.get('VALUE'),
                    addr: r.get('ADDR'),
                    arceno: r.get('ARCENO'),
                    key: r.get('KEY'),
                    attach: r.get('ATTACH')
                });
                items.push(item);
            });
        } else if (mode === me.Enum.Divide) {//進階設定裡的分址分文
            //分址分文：每筆列印單位都要獨自印一份，正副本只會顯示受文單位和不隱藏的單位
            var unHidesOriginal = [];   //正本
            var unHidesDuplicate = [];  //副本
            var unHidesPreside = [];    //主持人
            var unHidesAttendant = [];  //出席者
            var unHidesNonvoting = [];  //列席者
            var unHidesTranscript = []; //抄本
            var unHidesPreside2 = []; //會議主席
            var unHidesAttendant2 = []; //出列席機關人員

            if (storeUnHides != undefined) {
                storeUnHides.each(function (r) {
                    if (r.get('KEY') == '正本') {
                        unHidesOriginal.push(r.get('VALUE'));
                    } else if (r.get('KEY') == '副本') {
                        unHidesDuplicate.push(r.get('VALUE'));
                    } else if (r.get('KEY') == '主持人') {
                        unHidesPreside.push(r.get('VALUE'));
                    } else if (r.get('KEY') == '出席者') {
                        unHidesAttendant.push(r.get('VALUE'));
                    } else if (r.get('KEY') == '列席者') {
                        unHidesNonvoting.push(r.get('VALUE'));
                    } else if (r.get('KEY') == '會議主席') {
                        unHidesPreside2.push(r.get('VALUE'));
                    } else if (r.get('KEY') == '出列席機關人員') {
                        unHidesAttendant2.push(r.get('VALUE'));
                    } else {
                        unHidesTranscript.push(r.get('VALUE'));
                    }
                });
            }
            storePapers.each(function (r) {
                var value = false;
                var _original = [];
                var _duplicate = [];
                var _preside = [];
                var _attendant = [];
                var _nonvoting = [];
                var _transcript = [];
                var _preside2 = [];
                var _attendant2 = [];
                if (r.get('KEY') == '正本') {
                    unHidesOriginal.some(function (v) {
                        if (v === r.data.VALUE)
                            value = true;
                    });
                    if (!value)
                        _original.push(r.get('VALUE'));
                } else if (r.get('KEY') == '副本') {
                    unHidesDuplicate.some(function (v) {
                        if (v === r.data.VALUE)
                            value = true;
                    });
                    if (!value)
                        _duplicate.push(r.get('VALUE'));
                } else if (r.get('KEY') == '主持人') {
                    unHidesPreside.some(function (v) {
                        if (v === r.data.VALUE)
                            value = true;
                    });
                    if (!value)
                        _preside.push(r.get('VALUE'));
                } else if (r.get('KEY') == '出席者') {
                    unHidesAttendant.some(function (v) {
                        if (v === r.data.VALUE)
                            value = true;
                    });
                    if (!value)
                        _attendant.push(r.get('VALUE'));
                } else if (r.get('KEY') == '列席者') {
                    unHidesNonvoting.some(function (v) {
                        if (v === r.data.VALUE)
                            value = true;
                    });
                    if (!value)
                        _nonvoting.push(r.get('VALUE'));
                } else if (r.get('KEY') == '會議主席') {
                    unHidesPreside2.some(function (v) {
                        if (v === r.data.VALUE)
                            value = true;
                    });
                    if (!value)
                        _nonvoting.push(r.get('VALUE'));
                } else if (r.get('KEY') == '出列席機關人員') {
                    unHidesAttendant2.some(function (v) {
                        if (v === r.data.VALUE)
                            value = true;
                    });
                    if (!value)
                        _nonvoting.push(r.get('VALUE'));
                } else {
                    //分址分文都不顯示
                    //unHidesTranscript.some(function (v) {
                    //    if (v === r.data.VALUE)
                    //        value = true;
                    //});
                    //if (!value)
                    //    _transcript.push(r.get('VALUE'));
                }

                _original = _original.concat(unHidesOriginal);
                _duplicate = _duplicate.concat(unHidesDuplicate);
                _preside = _preside.concat(unHidesPreside);
                _attendant = _attendant.concat(unHidesAttendant);
                _nonvoting = _nonvoting.concat(unHidesNonvoting);
                _transcript = _transcript.concat(unHidesTranscript);
                _preside2 = _preside2.concat(unHidesPreside2);
                _attendant2 = _attendant2.concat(unHidesAttendant2);
                var ogl = (_original.length > 0) ? _original.join('、') : '';
                var dpl = (_duplicate.length > 0) ? _duplicate.join('、') : '';
                var prd = (_preside.length > 0) ? _preside.join('、') : '';
                var atd = (_attendant.length > 0) ? _attendant.join('、') : '';
                var non = (_nonvoting.length > 0) ? _nonvoting.join('、') : '';
                var tsp = (_transcript.length > 0) ? _transcript.join('、') : '';
                var prd2 = (_preside2.length > 0) ? _preside2.join('、') : '';
                var atd2 = (_attendant2.length > 0) ? _attendant2.join('、') : '';
                var item = {};
                Ext.apply(item, cfg);
                Ext.apply(item, {
                    attention: (r.get('VALUE') + '').replace('（含附錄）', '').replace('(含附錄)', ''),
                    addr: r.get('ADDR'),
                    arceno: r.get('ARCENO'),
                    key: r.get('KEY'),
                    attach: r.get('ATTACH'),
                    original: ogl,
                    duplicate: dpl,
                    preside: prd,
                    attendant: atd,
                    nonvoting: non,
                    transcript: tsp,
                    preside2: prd2,
                    attendant2: atd2
                });
                items.push(item);
            });
        } else if (mode === me.Enum.General) {
            //受文者統稱：受文者一律顯示“如行文單位”，地址不顯示，不管有多少受文者，只需列印一份
            var wk = OA.common.Global.getCurrentWKContent();
            if (wk && wk.DocumentType == '開會通知單') {
                Ext.apply(cfg, { attention: '如出列席單位', address: false });
            } else {
                Ext.apply(cfg, { attention: '如行文單位', address: false });
            }
            cfg.arceno = '';
            cfg.addr = '';
            items.push(cfg);
        }

        //指派函正本受文者只會有三個人，印在同一張
        if (appoint) {
            var appoinItems = [];
            var other = [];
            var appoinName = '';
            Ext.Array.each(items, function (item) {
                if (item.key == '正本') {
                    if (appoinName == '') {
                        appoinName = (item.attention + '').replace('（含附錄）', '').replace('(含附錄)', '');
                    } else {
                        appoinName = appoinName + '、' + (item.attention + '').replace('（含附錄）', '').replace('(含附錄)', '');;
                    }
                } else {
                    other.push(item);
                }
            });
            var item1 = {};
            Ext.apply(item1, cfg);
            Ext.apply(item1, {
                attention: appoinName,
                arceno: '',
                addr: ''
            })
            appoinItems.push(item1);
            appoinItems.concat(other)
            return appoinItems;
        }

        Ext.Array.each(items, function (im) {
            if (im.attention) {
                var ckEndStr = (im.attention + '').trim().substr((im.attention + '').trim().length - 1);

                if (ckEndStr == ')') {
                    for (var k = im.attention.length; k >= 0; k--) {
                        var ckstaStr = (im.attention + '').trim().substr(k, 1);
                        if (ckstaStr == '(') {
                            var removeStr = im.attention.substring(k);
                            im.attention = im.attention.replace(removeStr, '');
                            console.log(im.attention)
                            return true;
                        }
                    }
                } else if (ckEndStr == '）') {
                    for (var k = im.attention.length; k >= 0; k--) {
                        var ckstaStr = (im.attention + '').trim().substr(k, 1);
                        if (ckstaStr == '（') {
                            var removeStr = im.attention.substring(k);
                            im.attention = im.attention.replace(removeStr, '');
                            console.log(im.attention)
                            return true;
                        }
                    }
                }
            }

            /*
            if (im.attention && im.attention.indexOf('(') != -1 && im.attention.indexOf(')') != -1) {
                var removeStr = im.attention.substring(im.attention.indexOf('('), (im.attention.indexOf(')')+1));
                im.attention = im.attention.replace(removeStr,'')
                
            } else if (im.attention &&im.attention.indexOf('（') != -1 && im.attention.indexOf('）') != -1) {
                var removeStr2 = im.attention.substring(im.attention.indexOf('（'),( im.attention.indexOf('）')+1));
                im.attention = im.attention.replace(removeStr2, '')

            }
            */
        })
        console.log(items);
        return items;
    },
    doGroupPrevie: function (group) {
        var me = this;
        var ctr = Ext.getCmp('formatType');
        var count = ctr.getItems().items.length;
        if (count > 3) {
            for (var k = count; k >= 3; k--) {
                ctr.removeAt(k);
            }
        }

        var previewType = Ext.getCmp('selectPreviewType');
        if (previewType) {
            var data = previewType.getRecord().getData();
            if (data) {
                Ext.Array.each(group, function (item) {
                    ctr.add({ text: item.scope, mode: data.value, grouping: item.data });
                });

            } else {
                Ext.Array.each(group, function (item) {
                    ctr.add({ text: item.scope, mode: 'Multiple', grouping: item.data });
                });
            }
        } else {
            Ext.Array.each(group, function (item) {
                ctr.add({ text: item.scope, mode: 'Multiple', grouping: item.data });
            });
        }




    },
    /**
     *  放大
     */
    zoomIn: function () {
        var ctr = OA.common.Paper.main();
        var value = ctr.getRatio() + 0.1;
        if (value < 3) {
            var max = ctr.getCreateParas().size.h;
            ctr.editActions().zoom(value, max);
            ctr.getParent().setScrollable({
                direction: 'both',
                directionLock: false
            });
        }
        var gContentS = ctr.getSvgPaper().getRootElem().querySelectorAll('.gContent');
        if (gContentS)
            ctr.updateSvgCanvas(gContentS.length * max);
    },
    /**
     *  縮小
     */
    zoomOut: function () {
        var ctr = OA.common.Paper.main();
        var value = ctr.getRatio() - 0.1;
        if (value > 0) {
            var max = ctr.getCreateParas().size.h;
            ctr.editActions().zoom(value, max);
            //this.getCpaper().getParent().getScrollable().getScroller().scrollTo(0);
            ctr.getParent().setScrollable({
                direction: 'vertical',
                directionLock: true
            });
            var gContentS = ctr.getSvgPaper().getRootElem().querySelectorAll('.gContent');
            if (gContentS)
                ctr.updateSvgCanvas(gContentS.length * max);
        }
    },
    /**
     *  署名顯示
     */
    nameDisplay: function (isDisplay) {
        //console.log('nameDisplay');
        var mode = this.getPreviewMode();
        var canDo = Ext.Array.indexOf(['Normal', 'Draft'], mode) >= 0;
        if (!canDo) return;

        var elem = svgedit.utilities.getElem('署名_1');
        if (elem) {
            var value = (isDisplay) ? 'visible' : 'hidden';
            elem.setAttribute('visibility', value);
            elem.style.display = (isDisplay) ? '' : 'none';
        }
    },
    /**
     *  抄本章顯示
     */
    copyDisplay: function (isDisplay) {
        var elem = svgedit.utilities.getElem('canvas_copySeal');
        if (elem) {
            var value = (isDisplay) ? '1' : '0';
            elem.setAttribute('opacity', value);
        }
    },
    /**
     *  數位墨水
     */
    inkDisplay: function (isDisplay) {
        this.load({ mode: 'Draft' });
    },
    /**
     *  分層負責
     */
    stratify: function (isDisplay) {
        var elem = svgedit.utilities.getElem('分層負責_title');
        //console.log(elem);
        if (elem) {
            var value = (isDisplay) ? 'visible' : 'hidden';
            elem.setAttribute('visibility', value);
        }
    },
    /**
     *  身份證遮罩
     */
    mask: function (isMask) {
        OA.common.Paper.main().cardMask(isMask);
    },
    /**
    *  核章欄
    */
    seal: function (isDisplay) {
        var value = (isDisplay) ? 'visible' : 'hidden';
        var elemSeal = svgedit.utilities.getElem('gSeal');
        if (elemSeal) {
            elemSeal.setAttribute('visibility', value);
        }
        var elemUnitTitle = svgedit.utilities.getElem("會辦單位_title");
        if (elemUnitTitle) {
            elemUnitTitle.setAttribute('visibility', value);
        }
        var elemUnit = svgedit.utilities.getElem("會辦單位");
        if (elemUnit) {
            elemUnit.setAttribute('visibility', value);
        }
        var elemLV = svgedit.utilities.getElem("決行層級_title");
        if (elemLV) {
            elemLV.setAttribute('visibility', value);
        }

        var elemLD = svgedit.utilities.getElem("分層負責_title");
        if (elemLD) {
            elemLD.setAttribute('visibility', value);
        }
    },
    /**
     *  切換模式
     */
    switchMode: function (mode) {
        //console.log(mode);
        if (mode == 'Opinion') return;
        var qs = OA.common.Global.getQ();
        var cfg = {};
        var ctrFields = this.query('checkboxfield');
        var vm = OA.common.Global.getCurrentViewModel();
        var wk = OA.common.Global.getCurrentWKContent();
        Ext.Array.each(ctrFields, function (ctr) {
            cfg[ctr.getName()] = ctr.getChecked();
        });

        var checkDuplex = document.querySelector('#checkDuplex');
        if (checkDuplex.check == undefined) checkDuplex.checked = true;

        //增減行距稿面、函面才顯示（一文多發、分址分文跨頁排版會亂掉）
        var toolbarPreview = Ext.getCmp('toolbarPreview');
        if (toolbarPreview) {
            toolbarPreview.getItems().items.filter(function (item) {
                if (item.config && item.config.action) {
                    if (item.config.action == 'LineUp' || item.config.action == 'LineDown') {
                        if (mode !== 'Draft' && mode !== 'ClearDraft' && mode !== 'Normal') {
                            item.setHidden(true);
                        } else {
                            item.setHidden(false);
                        }
                    }
                }
            });
        }

        //署名顯示
        if (cfg.names == false) this.nameDisplay(false);
        if (wk && wk.DocumentType == '公告') this.nameDisplay(false);
        //身份證遮罩
        if (cfg.card) OA.common.Paper.main().cardMask(true);


        //分層負責
        if (mode == 'Draft' || mode == 'ClearDraft') {
            Ext.getCmp('ctnPreview').stratify(false);
        }

        if (cfg.level) {
            Ext.getCmp('ctnPreview').stratify(true);
        } else {
            Ext.getCmp('ctnPreview').stratify(false);
        }

        //抄本
        if (cfg.copy) Ext.getCmp('ctnPreview').copyDisplay(true);

        //列印正式文時不要有抄本章顯示
        if (mode !== 'Draft' && mode !== 'Normal') {
            Ext.getCmp('ctnPreview').copyDisplay(false);
        }

        var isVisible = (mode === 'Draft' || mode === 'ClearDraft');
        var strVisible = (isVisible) ? 'visible' : 'hidden';


        //var unDraft = ['出席會議報告單', '電子信箱回覆函'];
        //if (wk && wk.DocumentType) {
        //    if (unDraft.indexOf(wk.DocumentType) != -1)
        //        isVisible = false;
        //}

        var svgRoot = OA.common.Paper.main().getSvgPaper().getRootElem();

        var elems = svgRoot.querySelectorAll('#發文機關_title');
        Ext.Array.each(elems, function (elem) {
            if (isVisible) {
                if (elem.textContent.match('（稿）') == null) elem.textContent += '（稿）';
            } else {
                if (elem.textContent.match('（稿）')) elem.textContent = String(elem.textContent).replace('（稿）', '');
            }
        });

        elems = svgRoot.querySelectorAll('#處理級別_title');
        Ext.Array.each(elems, function (elem) {
            elem.setAttribute('visibility', strVisible);
        });

        elems = svgRoot.querySelectorAll('#檔號');
        Ext.Array.each(elems, function (elem) {
            elem.setAttribute('visibility', strVisible);
            elem.style.display = isVisible ? '' : 'none';
        });

        elems = svgRoot.querySelectorAll('#保存年限');
        Ext.Array.each(elems, function (elem) {
            if (elem.textContent == '99') elem.textContent = '永久';
            elem.setAttribute('visibility', strVisible);
            elem.style.display = isVisible ? '' : 'none';
        });

        elems = svgRoot.querySelectorAll('#抄本_title');
        Ext.Array.each(elems, function (elem) {
            elem.setAttribute('visibility', strVisible);
            elem.style.display = isVisible ? '' : 'none';
        });

        elems = svgRoot.querySelectorAll('#抄本');
        Ext.Array.each(elems, function (elem) {
            if (!isVisible) elem.textContent = '';
            elem.setAttribute('visibility', strVisible);
            elem.style.display = isVisible ? '' : 'none';
        });

        elems = svgRoot.querySelectorAll('#稿面註記_title');
        Ext.Array.each(elems, function (elem) {
            elem.setAttribute('visibility', strVisible);
            elem.style.display = isVisible ? '' : 'none';
        });

        elems = svgRoot.querySelectorAll('#承辦單位_title');
        Ext.Array.each(elems, function (elem) {
            elem.setAttribute('visibility', strVisible);
            elem.style.display = isVisible ? '' : 'none';
        });

        elems = svgRoot.querySelectorAll('#承辦單位');
        Ext.Array.each(elems, function (elem) {
            elem.setAttribute('visibility', strVisible);
            elem.style.display = isVisible ? '' : 'none';
        });

        elems = svgRoot.querySelectorAll('#敬會_title');
        Ext.Array.each(elems, function (elem) {
            if (elem.textContent == '（按此處新增敬會）') {
                elem.setAttribute('visibility', strVisible);
                elem.style.display = isVisible ? 'none' : 'none';
            }
        });

        elems = svgRoot.querySelectorAll('#決行層級_title');
        Ext.Array.each(elems, function (elem) {
            //console.log(strVisible);
            elem.setAttribute('visibility', strVisible);
            elem.style.display = isVisible ? '' : 'none';
        });

        //會計報告遞送單
        if (wk && wk.DocumentType === '會計報告遞送單') {
            elems = svgRoot.querySelectorAll('#人員_title');
            if (elems) {
                Ext.Array.each(elems, function (elem) {
                    elem.setAttribute('visibility', strVisible);
                    elem.style.display = isVisible ? '' : 'none';
                });
            }
        }

        //令、公告（附件欄位函面不顯示）
        var hidenAtt = ['令', '公告'];
        if (wk && hidenAtt.indexOf(wk.DocumentType) != -1) {
            if (mode !== 'Draft') {
                elems = svgRoot.querySelectorAll('#附件');
                if (elems) {
                    Ext.Array.each(elems, function (elem) {
                        elem.setAttribute('visibility', strVisible);
                        elem.style.display = isVisible ? '' : 'none';
                    });
                }
                elems = Ext.clone(svgRoot.querySelectorAll('#附件_title'));
                if (elems) {
                    Ext.Array.each(elems, function (elem) {
                        elem.setAttribute('visibility', strVisible);
                        elem.style.display = isVisible ? '' : 'none';
                    });
                }
            }
        }


        //1030 箋函（副本欄位函面不顯示） Chloe.sia
        var hideAtt = ['箋函'];
        if (wk && hideAtt.indexOf(wk.DocumentType) != -1) {
            if (mode !== 'Draft') {
                elems = svgRoot.querySelectorAll('#副本');
                if (elems) {
                    Ext.Array.each(elems, function (elem) {
                        elem.setAttribute('visibility', strVisible);
                        elem.style.display = isVisible ? '' : 'none';
                    });
                }
                elems = Ext.clone(svgRoot.querySelectorAll('#副本_title'));
                if (elems) {
                    Ext.Array.each(elems, function (elem) {
                        elem.setAttribute('visibility', strVisible);
                        elem.style.display = isVisible ? '' : 'none';
                    });
                }
            }
        }

        //校對、發文、監印
        //var draftMark = svgedit.utilities.getElem('canvas_draftMark');
        //if (draftMark) {
        //    var markDocs = [
        //        '函',
        //        '書函',
        //        '移文單',
        //        '獎懲建議函',
        //        '交辦案件通知單',
        //        '交議案件通知單',
        //        '催辦案件通知單',
        //        '開會通知單',
        //        '會勘通知單',
        //        '令',
        //        '獎懲令',
        //        '受文者令',
        //        '公告',
        //        '受文者公告',
        //        '機密文書機密等級變更或註銷建議單',
        //        '機密文書機密等級變更或註銷通知單',
        //        '會銜函',
        //        '會銜公告',
        //        '呈',
        //        '箋函'];

        //    if (isVisible && qs.epaper === 'N' && markDocs.indexOf(wk.DocumentType) >= 0)
        //        draftMark.setAttribute('opacity', '1');
        //    else
        //        draftMark.setAttribute('opacity', '0');
        //}

        if (!vm) return;

        var i = 0, key = '', id = '';
        for (i = 1; i <= vm.機關數; i++) {
            if (isVisible) {
                var countSignAlias = vm['稿署名數' + i.toString()];
                for (var k = 1; k <= countSignAlias; k++) {

                    id = (countSignAlias == 1) ? '#署名' : '#署名_' + k.toString();
                    elems = svgRoot.querySelectorAll(id);
                    Ext.Array.each(elems, function (elem) {
                        key = '稿署名' + i.toString() + '_' + k.toString();
                        elem.textContent = vm[key];
                    });
                }
            } else {
                var countSignName = vm['署名數' + i.toString()];
                for (var j = 1; j <= countSignName; j++) {
                    id = (countSignName == 1) ? '#署名' : '#署名_' + j.toString();
                    elems = svgRoot.querySelectorAll(id);
                    Ext.Array.each(elems, function (elem) {
                        key = '署名' + i.toString() + '_' + j.toString();
                        elem.textContent = vm[key];
                    });
                }
            }
        }
    },
    doGenpages: function (initParas) {
        //console.log(initParas);
        var me = this;
        var qs = OA.common.Global.getQ();
        var ctrMenu = OA.common.Global.getApp().getController('OA.controller.Menu');
        var paperList = [], pIdx = 0, pageFiles = [], pageButtons = {};
        $(document).off('onIframeRenderCompleted');
        $(document).on('onIframeRenderCompleted', function (e, pageFile) {
            var page;
            var p = OA.common.Global.getInitParas();
            var edition = OA.common.VIMgr.getCurrentEdition();
            //抓回最新版次
            var o = OA.common.VIMgr.getViContent();
            if (edition.版號 !== o.作業版本) {
                var items = o.版次.where("( el, i, res, param ) => el.版號=='" + o.作業版本 + "'");
                if (items && items.length > 0) {
                    edition = items[0];
                } else {
                    //抓第最後0筆
                    edition = o.版次[0];
                }
                OA.common.VIMgr.setCurrentEdition(edition);
            }
            //console.log(edition);
            var version = edition.版號 + '';
            var docPapers = [];
            for (page in pageFile) {
                if (pageFile.hasOwnProperty(page)) {
                    var pageType = '', pageSort = '';
                    if (page == 'Normal') {
                        pageType = '呈現檔';
                        pageSort = 'browse';
                    } else if (page == 'Draft') {
                        pageType = '清稿前';
                        pageSort = 'before';
                    } else if (page == 'ClearDraft') {
                        pageType = '清稿後';
                        pageSort = 'after';
                    } else if (page == 'Opinion') {
                        pageType = '意見';
                        pageSort = 'opinion';
                    }

                    if (p.text == '來文') {
                        //return true;
                    } else {
                        var fn = Ext.String.format('{0}_{1}_{2}({3})', p.doSno, p.paperNo, version, pageSort);
                        if (pageSort) docPapers.push({ ID: '', fileNo: '', 檔案格式: 'pdf', 種類: pageSort, Src: fn });

                        pageFiles.push({
                            fileKey: '',
                            fileName: fn,
                            folderName: '',
                            fileType: 'pdf',
                            fileContent: pageFile[page],
                            group: p.text
                        });
                    }
                }
            }

            pageButtons[p.paperNo] = p.text;

            var papers = edition.簽核文件夾.文稿;

            if (papers) {
                if (!papers.length) papers = [papers];
            } else {
                papers = [];
            }
            var paper = papers.where("( el, i, res, param ) => el.代碼==" + p.paperNo)[0];
            paper.文稿頁面 = {};
            paper.文稿頁面.檔案 = docPapers;
            pIdx++;
            if (pIdx < paperList.length) {
                me.doGenpagesWK(paperList[pIdx]);
            } else {
                if (qs.package === 'Y') {
                    me.doPackageDone(pageFiles, pageButtons);
                } else {
                    me.doGenpagesDone(pageFiles, null);
                }
            }
        });

        OA.client.VI.loadByEditor(initParas, function (items) {
            console.log(items);
            paperList = items;
            var start = paperList[0];
            if (paperList[0].kind === '來文' && items.length > 1) {
                if (qs.package !== 'Y') {
                    start = paperList[1];
                    pIdx++;
                }
            }
            //if (OA.common.VIMgr.isOnlyFollow()) start = paperList[0];

            me.doGenpagesWK(start);
        });
    },
    doGenpagesWK: function (paper) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var current = OA.common.VIMgr.getCurrentEdition();
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        var subFrame = document.getElementById('subFrame');
        var data = {
            paperNo: paper.paperNo,
            files: paper.files,
            version: paper.lastVersion + '',
            documentType: paper.form,
            kind: paper.kind,
            text: paper.text
        };

        /*
        //來文PDF, 以空白簽直接送陳頁面檔
        if (OA.common.VIMgr.isOnlyFollow()) {
            var version = paper.version;
            if (current.isTemp !== 'Y') version = current.ParentVersion;
            //整批下載，子案可能沒有重產DI檔要使用原始DI
            if (qs.package === 'Y' && paper.files && paper.files.length > 0) {
                data.files = paper.files;
            } else {
                if (version == 0) {
                    data.files = paper.files;
                } else {
                    data.files = [{
                        fileContent: null,
                        fileKey: '',
                        fileName: paper.doSno + '_' + paper.paperNo + '_' + version + '.di',
                        fileType: 'di',
                        folderName: ""
                    }];
                }
            }
        }
        */

        OA.common.InitParas.readWK(data);
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: paper.paperNo + '.' + paper.form + ' 處理中...' });
        OA.client.WK.createPaper(paper.model_wk, 'Normal', function () {
            var tab = {};
            tab.extraTabs = [{ text: '清稿後', mode: 'ClearDraft' }];
            ctrWK.initParas(tab);
            //console.log(Ext.clone(me.getPreviewMode()));
            ctrWK.loadAttachs(paper.attachs);
            var src = './index.html?app=preview&by=dom&action=render';
            var qs = OA.common.Global.getQ();
            if (qs.package === 'Y') src = src + '&package=Y';
            OA.common.Utils.checkEpaper() ? src = src + '&epaper=Y' : src = src + '&epaper=N'
            subFrame.src = src;
        });
    },
    doGenpagesDone: function (pageFiles, init) {
        Ext.Viewport.setMasked(false);
        var edition = OA.common.VIMgr.getCurrentEdition();
        var version = edition.版號 + '';


        //送歸檔頁面檔
        var r = OA.common.Global.getCurrentDocFlowRecord();
        edition.線上簽核資訊 = {};
        edition.線上簽核資訊.簽核意見 = '';
        edition.線上簽核資訊.簽核流程 = { 異動別: r.get('state') };
        edition.卡片使用狀態 = { 狀態: '正常' };

        //預先儲存組待簽章SI
        var parasPrepare = OA.common.InitParas.doWK({ action: 'saved' });

        parasPrepare.version = version; //簽核動作採用新版次
        parasPrepare.methodId = 'archive';
        parasPrepare.workFlow = 'N';
        parasPrepare.tmpCard = 'N';
        parasPrepare.func = 'doSign';
        parasPrepare.pageFiles = pageFiles;
        parasPrepare.path = OA.common.VIMgr.getViContent().入徑;

        OA.client.File.doFile(parasPrepare, function (ret) {
            var win = OA.common.Global.getWinOpener();
            var topKdmaker = win.kdMaker;
            var dtreeContent = topKdmaker.getDTreeContent();
            if (dtreeContent) dtreeContent.clickFunctionMenu();

            OA.common.Bridge.doClose();
        });
    },
    doPackageDone: function (pageFiles, pageButtons) {
        console.log(pageFiles);
        console.log(pageButtons);
        var me = this;
        Ext.Viewport.setMasked(false);
        var viContent = OA.common.VIMgr.getViContent();
        var edition = OA.common.VIMgr.getCurrentEdition();
        var version = edition.版號 + '';

        var items = [];
        Ext.Array.each(pageFiles, function (p) {
            var need = p.fileName.indexOf('after') >= 0 || p.fileName.indexOf('opinion') >= 0;
            if (p.group == '來文') need = p.fileName.indexOf('opinion') >= 0;
            if (need) items.push(p);

        })

        //替換文稿頁碼
        Ext.Array.each(items, function (item) {
            if (item.fileName.indexOf('after') >= 0) {
                var docPage = 0;
                var optionPage = 0;
                var xmlDoc = $.parseHTML(item.fileContent), $xml = $(xmlDoc);
                var OptionName = item.fileName.replace('after', 'opinion') + '';
                var itemOption = items.filter(function (n) {
                    return n.fileName == OptionName;
                });

                if (itemOption) {
                    var xmlOption = $.parseHTML(itemOption[0].fileContent), $xml1 = $(xmlOption);

                    $xml.find("text[class=canvasPage]").each(function (i, el) {
                        docPage = docPage + 1;
                    });
                    $xml1.find("text[class=canvasPage]").each(function (i, el) {
                        optionPage = optionPage + 1;
                    });

                    for (k = 1; k <= docPage; k++) {
                        $xml.find("text[id=canvas_page_" + k + "]").each(function (i, el) {
                            el.textContent = '第' + k + '頁 共' + (optionPage + docPage) + '頁';
                        });
                    }

                    for (k = 1; k <= optionPage; k++) {
                        $xml1.find("text[id=canvas_page_" + k + "]").each(function (i, el) {
                            el.textContent = '第' + (k + docPage) + '頁 共' + (optionPage + docPage) + '頁';
                        });
                    }
                    item.fileContent = xmlToString($xml);
                    itemOption[0].fileContent = xmlToString($xml1);
                }
            }
        });

        var paras = {};
        paras.func = 'doFile';
        paras.action = 'doExportAll';
        paras.biginfo = OA.common.VIMgr.getViContent().入徑.大型資訊;
        paras.pageFiles = items;

        var attachs = [];
        var papers = OA.common.VIMgr.getCurrentEditionPapers();
        Ext.Array.each(papers, function (paper) {
            var group = pageButtons[paper.代碼];
            if (paper.名稱 == '來文') {
                group = '來文';
                var follow = OA.common.VIMgr.getFollowFile();
                if (follow && follow.檔案格式 == 'DI') {
                    var followSP = follow.Src.split('.');
                    if (followSP && followSP.length > 0) {
                        var fileStr = '';
                        Ext.Array.each(followSP, function (sp, index) {
                            if ((index + 1) == followSP.length) {
                                fileStr = fileStr + '.pdf';
                            } else {
                                if (fileStr == '') {
                                    fileStr = sp;
                                } else {
                                    fileStr = fileStr + '.' + sp;
                                }
                            }
                        })
                        if (fileStr != '') {
                            attachs.push({
                                fileKey: fileStr,
                                fileName: fileStr,
                                folderName: '',
                                fileType: 'PDF',
                                group: group
                            });
                        }
                    } else {
                        attachs.push({
                            fileKey: follow.Src.split('.')[0] + '.pdf',
                            fileName: follow.Src.split('.')[0] + '.pdf',
                            folderName: '',
                            fileType: 'PDF',
                            group: group
                        });
                    }

                } else {
                    if (follow) {
                        attachs.push({
                            fileKey: follow.名稱,
                            fileName: follow.Src,
                            folderName: '',
                            fileType: follow.檔案格式,
                            group: group

                        });

                    }
                }
            }
            Ext.Array.each(paper.檔案清單.附件清單.附件, function (attach) {
                if (group === '來文' || attach.status == '1') {
                    attachs.push({
                        fileKey: attach.名稱,
                        fileName: attach.Src,
                        folderName: 'attach',
                        fileType: attach.檔案格式,
                        group: group
                    });

                }
            });

            Ext.Array.each(paper.檔案清單.附件清單.大型附件, function (attach) {//1090302 norman 整批下載增加下載VI大型附件標籤Tag的附件，路徑由attach找
                if (group === '來文' || attach.status == '1') {
                    attachs.push({
                        fileKey: attach.名稱,
                        fileName: attach.Src,
                        folderName: 'attach',
                        fileType: attach.檔案格式,
                        group: group
                    });


                }
            });

            Ext.Array.each(paper.檔案清單.附件清單.參考附件, function (attach) {
                //if (group === '來文' || attach.status == '1') {
                if (attach.status == '1') {     //來文可夾參考附件，有濾掉已刪除的附件
                    attachs.push({
                        fileKey: attach.名稱,
                        fileName: attach.Src,
                        folderName: 'refAttach',
                        fileType: attach.檔案格式,
                        group: group
                    });
                }
            });
        });
        paras.attachs = attachs;

        /*
        //整批下載會核單 transform有誤，2018.10.23已修正
        var v = viContent.版次.where("( el, i, res, param ) => el.版號=='" + edition.ParentVersion + "'");
        if (v[0] && v[0].會辦簽稿) {
            var qs = OA.common.Global.getQ();
            qs.action = 'init';
            qs.app = 'tidy';
            me.doTidy(null, function (oSVG) {
                oSVG.xml = oSVG.xml.replace(/&nbsp;/g, ' ');
                paras.pageFiles.push({
                    fileContent: oSVG.xml,
                    fileKey: '',
                    fileName: 'tidy',
                    fileType: 'pdf',
                    folderName: '',
                    group: '會核單'
                });

                console.log(paras);

                // OA.client.File.doFile(paras, function (ret) {
                    OA.common.Bridge.doClose();
                // });
            });
            return;
        }
        */

        console.log(paras)
        OA.client.File.doFile(paras, function (ret) {
            OA.common.Bridge.doClose();
        });
    },

    onTidyListItemTap: function (record) {
        var me = this;
        var initParas = me.getInitParas();
        var code = record.get('code');
        me.setPreviewMode(code);
        var find = initParas.tidyTabs.where("( el, i, res, param ) =>el.code=='" + code + "'")[0];
        var ctrOtherForm = Ext.getCmp('otherForm');
        ctrOtherForm.setText(find.name + '&nbsp;&nbsp;<span class="chevron-down" />');
        ctrOtherForm.setUi('confirm');
        var butTidy = Ext.getCmp('butTidy');
        butTidy.setUi('normal');
        var toolbarOthers = Ext.getCmp('toolbarOthers');
        toolbarOthers.setHidden(true);

        var storeAttach = Ext.getStore('Attach');
        if (find.paperNo) {
            var item = {};
            Ext.apply(item, find);
            item.mode = find.code;
            me.doRenderStackInit([item]);

            var current = OA.common.VIMgr.getCurrentEdition();
            var folder = OA.common.VIMgr.getFolderItems(current.版號, current.簽核文件夾, find.paperNo);
            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
            var attachCount = ctrWK.loadAttachs(folder.attachs);

            Ext.getCmp('butPreviewAttach').setHidden(false);
            Ext.getCmp('butPreviewAttach').setBadgeText(attachCount);
        } else {
            storeAttach.setData(null);
            Ext.getCmp('butPreviewAttach').setHidden(true);
            Ext.getCmp('butPreviewAttach').setBadgeText('');
        }
        me.doTidy(find);
    },
    /**
     *  綜整
     */
    doTidy: function (paperConfig, callback) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        var subFrame = document.getElementById('subFrame');
        var ctrFormatType = Ext.getCmp('formatType');
        var initParas = me.getInitParas();
        if (!initParas) return;

        if (qs.action == 'init') {
            OA.common.VIMgr.setViContent(initParas.vi);
            OA.common.Global.setCurrentDocFlowRecord(initParas.docflow)
            var tabs = me.createTidyTabs(initParas.tidyTabs);

            qs.action = 'render';
            var pressedItem = ctrFormatType.getItems().items[0];
            pressedItem.config.filters = [{ key: '承辦' }, { key: '會辦' }, { key: '核決' }];
            ctrFormatType.setPressedButtons(pressedItem);  // raise event load

            var butTidy = Ext.getCmp('butTidy');
            if (butTidy) butTidy.setUi('confirm');

            var butPreviewAttach = Ext.getCmp('butPreviewAttach');
            if (butPreviewAttach) butPreviewAttach.setHidden(true);

            var paperList = [], pIdx = 0, pageFiles = [];
            $(document).off('onIframeRenderCompleted');
            $(document).on('onIframeRenderCompleted', function (e, pageFile) {
                var ctr = Ext.getCmp('formatType');
                if (ctr) ctr.setItems([]);
                me.setRenderStack([]);

                //意見補到後面
                var rows = [];
                rows.push('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" version="1.1">');
                rows.push('<style type="text/css">');
                rows.push('<![CDATA[');
                rows.push('text  {font-family:"Times New Roman",BiauKai,標楷體;}');
                rows.push('@page { margin: 0cm 0cm 0cm 0cm; }');
                rows.push(']]>');
                rows.push('</style>');
                Ext.Array.each(tabs, function (p) {
                    var xml = pageFile[p.mode];
                    if (xml) {
                        var g = xml.substring(xml.indexOf('<g'), xml.lastIndexOf('</g>') + 4);
                        rows.push(g);
                    }
                });
                rows.push('</svg>');

                var oSVG = { xml: rows.join('') };

                if (callback) {
                    if (OA.common.Paper.main().svgSetXml(oSVG)) {
                        oSVG.xml = OA.common.Paper.main().getPrintXml();
                        callback(oSVG);
                    }
                    return;
                }

                OA.common.Paper.main().svgSetXml(oSVG);
                Ext.Viewport.setMasked(false);
            });
        } else if (qs.action == 'render') {

            // if (paperConfig.paperNo>1 ) paperConfig.kind ='';

            OA.common.InitParas.readWK(paperConfig);
            OA.common.UrlMgr.setToken('debug');
            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                message: paperConfig.paperNo + '.' + paperConfig.text + ' 處理中...'
            });
            var options = {
                model_wk: paperConfig.model_wk,
                mode: paperConfig.mode,
                filters: paperConfig.filters,
                paperNo: paperConfig.paperNo,
                opinion: initParas.opinion,
                papers: initParas.papers
            }
            //console.log(options);
            Ext.getCmp('cpaper').setIsClearPaper(true);
            Ext.getCmp('cpaper').setIsPreview(true);
            me.setPreviewMode(paperConfig.mode);

            if (paperConfig.mode != 'Opinion') {
                var current = OA.common.VIMgr.getCurrentEdition();
                var papers = current.簽核文件夾.文稿;
                if (!Ext.isArray(papers)) papers = [papers];
                var paper = papers.where("( el, i, res, param ) =>el.代碼==" + paperConfig.paperNo)[0];
                var files = paper.檔案清單.檔案;
                if (!Ext.isArray(files)) files = [files];
                options.version = files[0].Src.split('_')[2].split('.')[0];
            }

            options.doDeptno = initParas.initParas.doDeptno;
            options.doSno = initParas.initParas.doSno;
            OA.client.WK.createTidy(options, function () {

            });
        }
    },
    doMail: function (paperConfig, callback) {
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        var subFrame = document.getElementById('subFrame');
        var data = {
            paperNo: paper.paperNo,
            files: paper.files,
            version: paper.lastVersion + '',
            documentType: paper.form,
            kind: paper.kind,
            text: paper.text
        };

        /*
        //來文PDF, 以空白簽直接送陳頁面檔
        if (OA.common.VIMgr.isOnlyFollow()) {
            var version = paper.version;
            if (current.isTemp !== 'Y') version = current.ParentVersion;
            //整批下載，子案可能沒有重產DI檔要使用原始DI
            if (qs.package === 'Y' && paper.files && paper.files.length > 0) {
                data.files = paper.files;
            } else {
                if (version == 0) {
                    data.files = paper.files;
                } else {
                    data.files = [{
                        fileContent: null,
                        fileKey: '',
                        fileName: paper.doSno + '_' + paper.paperNo + '_' + version + '.di',
                        fileType: 'di',
                        folderName: ""
                    }];
                }
            }
        }
        */
        OA.common.InitParas.readWK(data);
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: paper.paperNo + '.' + paper.form + ' 處理中...' });
        OA.client.WK.createPaper(paper.model_wk, 'Normal', function () {
            var tab = {};
            tab.extraTabs = [{ text: '清稿後', mode: 'ClearDraft' }];
            ctrWK.initParas(tab);
            //console.log(Ext.clone(me.getPreviewMode()));
            ctrWK.loadAttachs(paper.attachs);
            var src = './index.html?app=preview&by=dom&action=render';
            var qs = OA.common.Global.getQ();
            if (qs.package === 'Y') src = src + '&package=Y';
            OA.common.Utils.checkEpaper() ? src = src + '&epaper=Y' : src = src + '&epaper=N'
            subFrame.src = src;
        });


    }
});
