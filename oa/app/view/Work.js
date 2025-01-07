Ext.define('OA.view.Work', {
    extend: 'Ext.Container',
    id: 'oawork',
    xtype: "oawork",
    requires: ['Ext.SegmentedButton', 'Ext.Toolbar', 'OA.view.DocArea', 'OA.view.CtnParallel'],
    config: {
        layout: "hbox",
        ui: 'plain',
        style: 'font-size:19px',
        items: [
            {
                id: 'toolPaper',
                xtype: 'toolbar',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector',
                defaults: {
                    style: 'margin: 6px .0em;padding:0.3em 0.3em'
                }
            },
            {
                id: 'toolEdit',
                xtype: 'toolbar',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector',
                defaults: {
                    style: 'padding: 0px 3px'
                },
                style: 'border-bottom: #ccc;' // 新增底部邊框
            },
            {
                id: 'toolPen',
                xtype: 'toolbar',
                docked: 'top',
                hidden: true,
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector'
            },
            //{
            //    id: 'toolSeach',
            //    xtype: 'toolbar',
            //    docked: 'top',
            //    hidden: false,
            //    scrollable: {
            //        direction: 'horizontal',
            //        indicators: false
            //    },
            //    defaults: {
            //        style: 'background-color:'
            //    },
            //    cls: 'search-result',
            //    items: [
            //        {
            //            id: 'searchField',
            //            xtype: 'searchfield',
            //            label: '',
            //            name: 'query',
            //            width: '50%'
            //        },
            //        {
            //            text: '搜尋',
            //            ui: 'plain',
            //            handler: function (button) {
            //                var me = button.up('oawork');
            //                console.log(me);
            //                var svg = OA.common.Paper.main().getSvgPaper();
            //                var value = Ext.getCmp('searchField').getValue();
            //                if (!svg || !value) return;
            //                if (value == me.getOldValue()) {
            //                    //搜尋條件未變，拿上次相似比數繼續比對

            //                } else {
            //                    me.setOldValue(value);
            //                    var gContent = svg.getContentElem().querySelector('.gContent');
            //                    var textItems = gContent.querySelectorAll('text');
            //                    if (textItems) {
            //                        var likeTotal = [];
            //                        Ext.Array.each(textItems, function (text) {
            //                            if (text.id.indexOf('KDRichTextBlock') != -1 && text.textContent.indexOf(value) != -1) {
            //                                likeTotal.push(text);
            //                            }
            //                        });
            //                        if (likeTotal) {
            //                            me.setSearchLike(likeTotal);
            //                            //第一次搜尋，找出第一個筆中第一個相似的文字
            //                            var r = likeTotal[0].textContent.indexOf(value);
            //                            //圈選？要怎麼做？

            //                        }
            //                    }
            //                }
            //            }
            //        }
            //    ]
            //},
            {
                id: 'panelSymbols',
                xtype: 'panel',
                html: '',
                hidden: true,
                width: '30%',
                top: 5,
                right: 10,
                style: 'font-size:30px;background-color: transparent;padding:0px;',
                margin: '15 10 0 25',
                action: '',
                listeners: {
                    element: 'element',
                    tap: function (e, target) {
                        var me = Ext.getCmp('panelSymbols');
                        if (target.className === 'symbol-close') {
                            me.hide();
                            return;
                        }
                        var action = me.config.action;
                        var text = (target.tagName === 'SPAN' || target.tagName === 'P') ? target.textContent : '';
                        if (action === 'bullet') {
                            if (text.indexOf('編號') >= 0) text = 'bullet';
                            OA.common.Paper.main().editActions().changeBulletSymbol(text);
                        } else {
                            //判斷目前游標是否在意見欄
                            if (Ext.getCmp('cpaper').getIsSuggestionIn()) {
                                var suggestiontext = Ext.getCmp('suggestionText');
                                if (suggestiontext) {
                                    var textarea = suggestiontext.getComponent().input.dom;
                                    if (textarea) {
                                        var prefixStr = textarea.value.substring(0, textarea.selectionStart);
                                        var suffixStr = textarea.value.substring(textarea.selectionEnd);
                                        textarea.value = prefixStr + text + suffixStr;
                                        textarea.selectionStart = prefixStr.length + 1;
                                        textarea.selectionEnd = prefixStr.length + 1;
                                        textarea.focus();
                                        me.hide();
                                    }
                                }
                            } else {
                                //OA.common.Paper.main().editActions().insertWord(text);
                                OA.common.Paper.main().editActions().insertWordSymbols(text);
                                me.hide();
                            }
                        }
                    }
                }
            },
            {
                flex: 1,
                xtype: 'docArea'
            },
            {
                flex: 1,
                xtype: 'ctnParallel',
                hidden: true
            },
            {
                xtype: 'container',
                html: '<iframe id="postFrame" height="1px" width="1px" style="overflow: auto;top:0px;left:0px;position:absolute;"></iframe>'
            }
        ],
        listeners: {
            painted: function (ctr, eOpts) {
                if (Ext.browser.is.IE) {
                    var postFrame = document.getElementById('postFrame');
                    //console.log(postFrame);
                    postFrame.src = 'http://localhost:16888/doPostMsg';
                }
            }
        },
        showMode: '',
        extraActions: [],
        oldValue: '',
        searchLike: []
    },
    initialize: function () {
        this.toolPaperInit();
        this.toolEditInit();
    },
    toolPaperInit: function () {
        var items = [];
        var qs = OA.common.Global.getQ();
        var isDesktop = Ext.os.deviceType === 'Desktop';

        var ctrToolPaper = Ext.getCmp('toolPaper');
        //console.log(ctrToolPaper);
        if (qs.app === 'editor' || qs.app === 'draft' || qs.app === 'approve' || qs.app === 'offline') {
            items.push({ id: 'segDocSelector', xtype: 'segmentedbutton' });
            items.push({ xtype: 'spacer' });
            items.push({ xtype: 'spacer' });

            // items.push({ title: '設定', ui: 'plain', iconCls: 'settings', action: 'settings', docked: 'right' });

            //離線版不開放表單模式
            if (qs.app !== 'offline' && qs.app !== 'editor') items.push({
                title: '切換模式（簡易）',
                ui: 'plain',
                iconCls: 'fa-th-list',
                docked: 'right',
                action: 'mode',
                id: 'modeChange'
            });

            items.push({
                xtype: 'selectfield',
                width: '15%',
                id: 'zoomRatio',
                name: 'zoomRatio',
                valueField: 'key',
                displayField: 'value',
                docked: 'right',
                store: {
                    data: [
                        { value: '50%', key: '0.5' },
                        { value: '75%', key: '0.75' },
                        { value: '90%', key: '0.9' },
                        { value: '100%', key: '1' },
                        { value: '125%', key: '1.25' },
                        { value: '150%', key: '1.50' },
                        { value: '200%', key: '2' }
                    ]
                },
                value: 1
            });

            items.push({
                title: '搜尋',
                ui: 'plain',
                iconCls: 'fas fa-search',
                docked: 'right',
                action: 'search',
                id: 'search'
            });    //0319 增加「尋找」關鍵字的功能按鈕 Chloe.sia

            items.push({
                defaults: { docked: 'left' },
                id: 'toolActions',
                xtype: 'toolbar',
                docked: 'right',
                width: '45%',
                style: 'border-left:none;',
                scrollable: { direction: 'horizontal', directionLock: true }
            });

            ctrToolPaper.setHidden(false);
            ctrToolPaper.setDocked('bottom');
        }
        else if (qs.app === 'review' || qs.app === 'buchen') {
            items.push({ id: 'segDocSelector', xtype: 'segmentedbutton' });
            items.push({ xtype: 'spacer' });
            items.push({
                xtype: 'selectfield',
                width: '15%',
                id: 'zoomRatio',
                name: 'zoomRatio',
                valueField: 'key',
                displayField: 'value',
                docked: 'right',
                store: {
                    data: [
                        { value: '50%', key: '0.5' },
                        { value: '75%', key: '0.75' },
                        { value: '90%', key: '0.9' },
                        { value: '100%', key: '1' },
                        { value: '125%', key: '1.25' },
                        { value: '150%', key: '1.50' },
                        { value: '200%', key: '2' }
                    ]
                },
                value: 1
            });
            items.push({
                defaults: { docked: 'left' },
                id: 'toolActions',
                xtype: 'toolbar',
                docked: 'right',
                width: '45%',
                style: 'border-left:none;'
            });
            ctrToolPaper.setHidden(false);
            ctrToolPaper.setDocked('bottom');
        }
        else if (qs.app === 'check') {
            items.push({ id: 'segDocSelector', xtype: 'segmentedbutton' });
            items.push({ xtype: 'spacer' });
            items.push({
                xtype: 'selectfield',
                width: '15%',
                id: 'zoomRatio',
                name: 'zoomRatio',
                valueField: 'key',
                displayField: 'value',
                docked: 'right',
                store: {
                    data: [
                        { value: '50%', key: '0.5' },
                        { value: '75%', key: '0.75' },
                        { value: '90%', key: '0.9' },
                        { value: '100%', key: '1' },
                        { value: '125%', key: '1.25' },
                        { value: '150%', key: '1.50' },
                        { value: '200%', key: '2' }
                    ]
                },
                value: 1
            });
            ctrToolPaper.setHidden(false);
            ctrToolPaper.setDocked('bottom');
        } else {
            if (KangDaAppConfig().unit === 'TBPX') {

            } else {
                items.push({ ui: 'plain', iconCls: 'settings', docked: 'right', action: 'settings', hidden: false });
                items.push({ ui: 'plain', iconCls: 'info', docked: 'right', action: 'info', hidden: false });
            }

            items.push({ id: 'segDocSelector', xtype: 'segmentedbutton' });
            items.push({ xtype: 'spacer' });
            items.push({ ui: 'plain', iconCls: 'fa-print', docked: 'right', action: 'print', hidden: true });
            items.push({
                ui: 'plain',
                iconCls: 'fa-search-plus',
                docked: 'right',
                action: 'zoom',
                id: 'oaWorkToolbarZoom'
            });
            items.push({ ui: 'plain', iconCls: 'fa-ellipsis-h', docked: 'right', action: 'more', hidden: false });
            items.push({
                ui: "plain",
                iconCls: 'fa-paperclip',
                docked: 'right',
                action: 'paperAttach',
                badgeCls: 'icobadge'
            });
            items.push({ text: '編輯', action: 'edit', docked: 'right', hidden: true });
            items.push({ text: '發文', action: 'send', docked: 'right', hidden: true });
        }
        ctrToolPaper.setItems(items);
        Ext.Array.forEach(ctrToolPaper.getItems().items, function (button) {
            if (button.config.title) {
                if ($(button.bodyElement.dom).qtip) {
                    $(button.bodyElement.dom).qtip({
                        content: {
                            text: '<p style="font-size:200%;">' + button.config.title + '</p>'
                        },
                        position: {
                            my: 'bottom right',
                            at: 'top left'
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
    toolEditInit: function (mode) {
        var tools = [];
        tools[0] = { title: '引用案件', ui: "plain", iconCls: 'fa-quote-right', action: 'quote', badgeCls: 'icobadge' };
        tools[1] = { title: '附件', ui: "plain", iconCls: 'fa-paperclip', action: 'attach', badgeCls: 'icobadge' };
        //tools[2] = { title: '匯入', ui: "plain", iconCls: 'fa-cloud-download', action: 'import', hidden: false, id: 'import' };
        tools[2] = { title: '匯入', ui: "plain", iconCls: 'fa-cloud-download', action: 'binPacket', hidden: false };
        tools[3] = { title: '匯出', ui: "plain", iconCls: 'fa-external-link', action: 'export' };
        tools[4] = { title: '欄位', ui: "plain", iconCls: 'fa-th-large', action: 'fields', hidden: false };
        tools[5] = { title: '併列', ui: "plain", iconCls: 'fa-columns', action: 'parallel' };
        tools[6] = { title: '粗體', ui: "plain", iconCls: 'fa-bold', action: 'bold', hidden: true };
        tools[7] = { title: '斜體', ui: "plain", iconCls: 'fa-italic', action: 'italic', hidden: true };
        tools[8] = { title: '底線', ui: "plain", iconCls: 'fa-underline', action: 'underline', hidden: true };
        tools[9] = { title: '上標', ui: "plain", iconCls: 'fa-superscript', action: 'superscript', hidden: true };
        tools[10] = { title: '下標', ui: "plain", iconCls: 'fa-subscript', action: 'subscript', hidden: true };
        //tools[11] = { title: '數字', ui: "plain", iconCls: 'fa-sort-numeric-asc', action: 'math' };
        tools[12] = { title: '刪除', ui: "plain", iconCls: 'fa-strikethrough', action: 'strike' };
        tools[13] = { title: '凸排', ui: "plain", iconCls: 'fa-outdent', action: 'outdent' };
        tools[14] = { title: '縮排', ui: "plain", iconCls: 'fa-indent', action: 'indent' };
        tools[15] = { title: '螢光筆', ui: "plain", iconCls: 'fa-paint-brush', action: 'pen' };
        tools[16] = { title: '便利貼', ui: "plain", iconCls: 'fa-sticky-note-o', action: 'sticky', id: 'stickybtn' };
        tools[17] = { title: '符號', ui: "plain", iconCls: 'fa-at', action: 'symbol' };
        tools[18] = { title: '筆', ui: "plain", iconCls: 'fa-pencil', action: 'comment' };
        //tools[19] = { title: '插入表格', ui: "plain", iconCls: 'fa-table', action: 'grid' };
        tools[20] = { title: '清稿預覧', ui: "plain", iconCls: 'fa-eye', action: 'clearPaper', data: { todo: 'preview' } };
        tools[21] = { title: '復原', ui: "plain", iconCls: 'fa-undo', action: 'undo' };
        tools[22] = { title: '取消復原', ui: "plain", iconCls: 'fa-repeat', action: 'redo' };
        tools[23] = { title: '剪下', ui: "plain", iconCls: '', action: 'cut' };
        tools[24] = { title: '複製', ui: "plain", iconCls: '', action: 'copy' };
        tools[25] = { title: '貼上', ui: "plain", iconCls: '', action: 'paste' };
        //tools[26] = { title: '項目符號', ui: "plain", iconCls: '', action: '' };
        tools[27] = { title: '行距微調', ui: "plain", iconCls: '', action: '' };
        tools[28] = { title: '常用詞彙', ui: "plain", iconCls: '', action: 'thesaurus' };
        tools[29] = { title: '版次', ui: "plain", iconCls: "fa-bars", action: 'editorVersion' };
        //tools[30] = { title: '合併儲存格', ui: "plain", iconCls: '', action: 'mergeCells' };
        tools[31] = { title: '圖', ui: "plain", iconCls: 'fa-picture-o', action: 'picture' };
        tools[32] = { title: '章戳', ui: "plain", iconCls: 'fa-ticket', action: 'seal' };
        tools[33] = { title: '更多', ui: 'plain', text: '...', action: 'editMore' };
        tools[34] = { title: '放大', ui: 'plain', iconCls: 'fa-search-plus', action: 'zoom', id: 'oaWorkToolbarZoomEdit' };
        tools[35] = { title: '列印', ui: 'plain', iconCls: 'fa-print', action: 'print' };
        tools[36] = { title: '存檔', ui: "plain", text: '', iconCls: 'fa-floppy-o', action: 'save' };
        tools[37] = { title: '關閉', ui: "plain", iconCls: 'fa-times', action: 'close' };
        tools[38] = { title: '新檔', ui: 'plain', text: '', iconCls: 'fa-file-o', action: 'new' };
        tools[39] = { title: '舊檔', ui: 'plain', text: '', iconCls: 'fa-folder-open-o', action: 'open' };
        tools[40] = { title: '另存', ui: 'plain', text: '', iconCls: 'fa-share-square-o', action: 'saveas' };
        tools[41] = { title: '整頁', ui: 'plain', text: '', iconCls: 'fa-file-text-o', action: 'zoomFull' };
        tools[42] = { title: '取號', ui: 'confirm', text: '取號', iconCls: '', action: 'upload' };
        tools[43] = { title: '設定', ui: 'plain', iconCls: 'settings', action: 'settings' };
        tools[44] = { title: '意見', ui: 'plain', iconCls: 'fa-step-forward', action: 'comments' };
        tools[45] = { title: '套印管理', ui: 'plain', iconCls: '', action: 'overPrint' };
        tools[46] = { title: '', ui: 'plain', iconCls: 'fa-user-circle', action: 'user', docked: 'right' };
        tools[47] = { title: '新增段落', ui: 'plain', iconCls: 'fa-paragraph', action: 'addParagraph' };
        //tools[48] = { title: '表格刪除列', ui: "plain", iconCls: '', action: 'deleteRow' };
        //tools[49] = { title: '項目符號', ui: "plain", iconCls: '', action: 'bullet' };
        tools[50] = { title: '複製公文', ui: "plain", iconCls: '', action: 'duplicate' };
        tools[51] = { title: '附件歷程', ui: "plain", iconCls: '', action: 'attCourse' };
        tools[52] = { title: '引用歷程', ui: "plain", iconCls: '', action: 'quoteCourse' };
        tools[53] = { title: '整批下載', ui: "plain", iconCls: 'fa-download', action: 'package' };
        tools[54] = { title: '儲存草稿', ui: "plain", text: '', iconCls: 'fa-floppy-o', action: 'saveDraft' };
        //tools[55] = { title: '匯入封包', ui: "plain", iconCls: '', action: 'binPacket' };
        //tools[55] = { title: '匯入DI', ui: "plain", text: 'DI', iconCls: '', action: 'import', id: 'import' };
        tools[56] = { title: '追蹤修訂歷程', ui: 'plain', iconCls: 'fa-async', action: 'async' };

        var items = [];
        var initHidden = false;
        var qs = OA.common.Global.getQ();
        var isDesktop = Ext.os.deviceType === 'Desktop';

        var ctrToolEdit = Ext.getCmp('toolEdit');
        if (mode === 'docForm') {  //表單模式
            items.push(tools[29]);
            items.push(tools[1]);
            items.push(tools[4]);
            ctrToolEdit.setItems(items);
            this.setBtnTitel(ctrToolEdit);
            return;
        }

        if (mode === 'docCome') {
            items.push(tools[29]);
            //items.push(tools[35]);
            items.push(tools[1]);
            if (qs.app !== 'check') {
                items.push(tools[36]);
                items.push(tools[34]);
                //items.push(tools[2]);
                //items.push(tools[1]);
                //items.push(tools[4]);   // 增加欄位按鈕可輸入檔號
                //items.push(tools[16]);  // 來文便利貼
            }
            // items.push(tools[53]);
            if (qs.isRole15) {
                Ext.Array.each(items, function (item) {
                    var isUse = ['editorVersion', 'close', 'comments', 'attach', 'print', 'package'].indexOf(item.action) < 0;
                    if (isUse) item.disabled = true;
                });
            }
            ctrToolEdit.setItems(items);
            this.setBtnTitel(ctrToolEdit);
            return;
        }

        //console.log('this');
        if (qs.app === 'editor' || qs.app === 'draft') {
            if (qs.app === 'editor')
                items.push(tools[38]);
            //items.push(tools[39]);
            if (qs.app === 'draft')
                items.push(tools[54]);
            //items.push(tools[40]);
            //if (qs.app === 'editor')
            items.push(tools[1]);
            items.push(tools[35]);
            if (qs.app === 'editor')
                items.push(tools[2]);
            items.push(tools[3]);
            items.push(tools[4]);
            items.push(tools[21]);
            items.push(tools[13]);
            items.push(tools[14]);
            items.push(tools[15]);  //2019.06.19 台北市列管需求 開放螢光筆
            items.push(tools[17]);
            //items.push(tools[11]);
            // items.push(tools[16]);
        } else if (qs.app === 'offline') {
            items.push(tools[38]);
            items.push(tools[39]);
            items.push(tools[36]);
            items.push(tools[40]);
            items.push(tools[1]);
            items.push(tools[35]);

            items.push(tools[2]);
            items.push(tools[3]);
            items.push(tools[4]);
            items.push(tools[21]);
            items.push(tools[13]);
            items.push(tools[14]);
            items.push(tools[17]);
            //items.push(tools[11]);
        } else if (qs.app === 'approve') {
            if (qs.sFlag !== 'Y') items.push(tools[29]);
            items.push(tools[56]);
            var addBtn = OA.common.VIMgr.getAddBtn();
            if (addBtn) {
                items.push({
                    title: '新增文稿',
                    ui: 'plain',
                    text: '',
                    iconCls: 'fa-file-o',
                    action: 'add'
                });
            }
            //紙本流程都不鎖開舊檔
            // var isOpen = false;
            // var FlowRecord = OA.common.Global.getCurrentDocFlowRecord();
            // if (FlowRecord) {
            //     var epaper = FlowRecord.get('epaper');
            //     isOpen = epaper === 'N';
            // } else {
            //     isOpen = qs.epaper === 'N';
            // }
            // if (isOpen) items.push(tools[39]);

            //密件公文製作不鎖開舊檔
            if (qs.sFlag === 'Y') {
                //items.push(tools[38]);
                items.push(tools[39]);
            }

            items.push(tools[36]);
            items.push(tools[1]);
            if (isDesktop) items.push(tools[35]);
            items.push(tools[4]);
            items.push(tools[21]);
            // items.push(tools[6]);
            // items.push(tools[7]);
            items.push(tools[8]);
            // items.push(tools[9]);
            // items.push(tools[10]);
            items.push(tools[17]);
            //items.push(tools[11]);
            items.push(tools[12]);
            items.push(tools[13]);
            items.push(tools[14]);
            items.push(tools[15]);
            //items.push(tools[18]);
            // items.push(tools[32]);
            //線上簽核有轉交換按鈕不要有匯入DI跟封包按鈕

            if (OA.common.VIMgr.hadExchange() &&
                OA.common.Utils.checkEpaper()) {

            } else {
                items.push(tools[2]);
            }
            items.push(tools[3]);
            items.push(tools[16]);
            //0915 受會單位不顯示清稿預覧按鈕 Chloe.sia
            if (!OA.common.VIMgr.isParallel()) {
                if (OA.common.VIMgr.hadExchange()) {  //0923 決行 待結案 bar顯示清稿預覧按鈕 Chloe.sia
                    items.push(tools[20]);
                } else {
                    if (!OA.common.Utils.checkEpaper())
                        items.push(tools[20]);
                }
            }
        } else if (qs.app === 'check' || qs.app === 'review' || qs.app === 'buchen') {
            items.push(tools[29]);
            items.push(tools[56]);
            items.push(tools[35]);
            items.push(tools[53]);
            items.push(tools[3]);
            items.push(tools[1]);
        } else {
            if (KangDaAppConfig().unit === 'TBPX') {
                items.push(tools[36]);
                items.push({ xtype: 'spacer' });
                items.push(tools[1]);
                items.push(tools[2]);
                items.push(tools[3]);
                items.push(tools[4]);
                items.push({ xtype: 'spacer' });
                items.push(tools[6]);
                items.push(tools[7]);
                items.push(tools[8]);
                items.push(tools[9]);
                items.push(tools[10]);
                //items.push(tools[11]);
                items.push(tools[12]);
                items.push(tools[13]);
                items.push(tools[14]);
                items.push(tools[15]);
                // items.push(tools[16]);
            } else {
                items.push(tools[36]);
                items.push({ xtype: 'spacer' });
                items.push(tools[1]);
                items.push(tools[2]);
                items.push(tools[3]);
                items.push(tools[4]);
                items.push(tools[21]);
                items.push(tools[5]);
                items.push({ xtype: 'spacer' });
                // items.push(tools[6]);
                // items.push(tools[7]);
                items.push(tools[8]);
                // items.push(tools[9]);
                // items.push(tools[10]);
                items.push(tools[12]);
                items.push(tools[13]);
                items.push(tools[14]);
                items.push(tools[15]);
                // items.push(tools[16]);
                items.push(tools[17]);
                //items.push(tools[11]);
                //items.push(tools[18]);
            }
            initHidden = true;
        }

        if (qs.app === 'check' || qs.app === 'review' || qs.app === 'buchen') {
            items.push(tools[33]);
        } else {
            if (KangDaAppConfig().unit === 'TBPX') {
                items.push({ xtype: 'spacer' });
                items.push(tools[34]);
                items.push(tools[35]);
            } else {
                items.push(tools[5]);
                if (qs.app === 'offline') {
                    items.push({ xtype: 'spacer' });
                } else {
                    items.push(tools[33]);
                    items.push({ xtype: 'spacer' });
                }

            }
        }

        if (qs.app === 'offline' && typeof mode === 'undefined') items.push(tools[46]);

        //簽稿收發
        if (qs.isRole15) {
            Ext.Array.each(items, function (item) {
                var isUse = ['editorVersion', 'close', 'comments', 'attach', 'print', 'package'].indexOf(item.action) < 0;
                if (isUse) item.disabled = true;
            });
        }
        
        
        // 公文編輯, 所有 頁面都需 關閉按鈕
        items.push(tools[37]); 
        if (qs.app === 'approve' && qs.sFlag !== 'Y') {
            items.push(tools[44]); //簽核有[意見]
        }
        
        ctrToolEdit.setItems(items);
        ctrToolEdit.setHidden(initHidden);

        var extraActions = [];
        if (qs.app === 'check' || qs.app === 'review' || qs.app === 'buchen') {
            extraActions.push(tools[51]);
            extraActions.push(tools[52]);
        } else {
            if (qs.app === 'approve' || qs.app === 'editor' || qs.app === 'draft') {

                if (qs.app === 'approve') extraActions.push(tools[53]);
                extraActions.push(tools[45]);   //套印
                // extraActions.push(tools[0]);
            }
            //extraActions.push(tools[49]);
            // extraActions.push(tools[28]);
            if (qs.app === 'approve') {
                extraActions.push(tools[0]);    //引用案件

            }
        }
        // if (qs.app === 'editor' || qs.app === 'offline') extraActions.push(tools[50]);

        this.setExtraActions(extraActions);
        this.setBtnTitel(ctrToolEdit);
    },
    toolActionInit: function () {
        var items = [];
        var qs = OA.common.Global.getQ();
        var p = OA.common.Global.getInitParas();

        if (qs.app === 'approve') {
            if (qs.sFlag === 'Y') return;
            //var isOnlyFollow = OA.common.VIMgr.isOnlyFollow();
            var uiActions = OA.common.VIMgr.getActions();
            Ext.Array.each(uiActions, function (item, idx) {
                if (item.methodId && item.methodId == 'tempsend') return true;  //林務局不使用暫送機制
                if (item.name) {
                    var isAdd = true;
                    if (qs.isRole15) { //簽稿收發,無送陳、決行，編輯要簽章
                        if (item.methodId == 'approve' || item.methodId == 'forward') isAdd = false;
                        if (item.methodId == 'docEdit') item.name = '編輯';
                    }

                    // 單一來文，不要驗證，關閉轉交換
                    //if (isOnlyFollow && item.methodId == 'exchange') isAdd = false;
                    if (isAdd) {
                        items.push({ text: item.name, action: item.methodId, title: '', group: 'cando' });
                    }
                }
            });
        } else if (qs.app === 'editor') {
            items.push({ text: '取號', action: 'docUpload', group: 'cando', title: '', ui: 'confirm', id: 'takeNumber' });
            //評議專案內不顯示
            if (qs.projNo) {

            } else {
                items.push({ text: '上傳草稿', action: 'draftUpload', group: 'cando', title: '', ui: 'confirm' });
            }

        } else if (qs.app === 'draft') {
            items.push({ text: '取號', action: 'docUpload', group: 'cando', title: '', ui: 'confirm' });
            items.push({ text: '儲存', action: 'saveDraft', group: 'cando', title: '', ui: 'confirm' });
            items.push({ text: '另存草稿', action: 'draftUpload', group: 'cando', title: '', ui: 'confirm' });

        } else if (qs.app == 'review') {
            items.push({ text: '完成', action: 'read', group: 'cando', title: '', ui: 'confirm' });
        } else if (qs.app == 'buchen') {

            if (!qs.isRole15)//簽稿收發只有退回按鈕
                items.push({ text: '補核', action: 'doBuchen', group: 'cando', title: '', ui: 'confirm' });

            items.push({ text: '退回', action: 'backBuchen', group: 'cando', title: '', ui: 'cancel' });
        }

        var tool = Ext.getCmp('toolActions');
        var tool1 = Ext.getCmp('toolActions1');
        var tool2 = Ext.getCmp('toolActions2');

        if (tool1 && qs.app !== 'editor' && qs.app !== 'draft') {
            tool1.removeAll(true, true);
            if (tool2) {
                tool2.removeAll(true, true);
                if (items.length > 3) tool2.setHidden(false); else tool2.setHidden(true);
            }

            var items1 = [], items2 = [];
            var wrapCount = (items.length == 4) ? 2 : 3;
            Ext.Array.each(items, function (item, idx) {
                item.flex = 1;
                if (idx < wrapCount) {
                    if (idx == 0) item.style = 'background-color:#4F85A3';
                    if (idx == 1) item.style = 'background-color:#AABECC';
                    if (idx == 2) item.style = 'background-color:#D97B6D';

                    if (items.length == 2 && p.roleId == '02') { //府發文台
                        if (idx == 0) item.style = 'background-color:#4F85A3';
                        if (idx == 1) item.style = 'background-color:#D97B6D';
                    }
                    items1.push(item);
                } else {
                    item.style = 'background-color:#4F85A3;';

                    if (item.text.length > 2) item.cls = 'tool-actions-btn-small';
                    items2.push(item);
                }
            });
            if (tool1) tool1.setItems(items1);
            if (tool2) tool2.setItems(items2);
            if (tool) tool.setHidden(true);
            return;
        }

        if (tool) {
            tool.removeAll(true, true);
            //console.log(items);
            tool.setItems(items);
            tool.setHidden(false);
        }
    },
    showParallel: function () {
        var ctn = this.down('ctnParallel');
        if (ctn) ctn.setHidden(false);
        this.setShowMode('parallel');
    },
    hideParallel: function () {
        var ctn = this.down('ctnParallel');
        if (ctn) ctn.setHidden(true);
        this.setShowMode('');
        OA.common.Paper.main().editActions().zoom();
        if (Ext.getCmp('labParallelDraftName')) Ext.getCmp('labParallelDraftName').setHtml('');
    },
    setBtnTitel: function (ctrToolEdit) {
        Ext.Array.forEach(ctrToolEdit.getItems().items, function (button) {
            if (button.config.title) {
                if ($(button.bodyElement.dom).qtip) {
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
    }
});