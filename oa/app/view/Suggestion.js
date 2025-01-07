Ext.define('OA.view.Suggestion', {
    extend: 'Ext.Container',
    xtype: 'suggestion',
    id: 'Suggestion',
    requires: ['Ext.form.FieldSet', 'Ext.field.Select'],
    config: {
        ui: 'light',
        layout: {
            type: 'vbox'
        },
        items: [
            {
                flex: 1,
                xtype: 'fieldset',
                border: false,
                style: 'margin: 0;'
            }
        ],
        //key: '承辦',
        //key: '全部',
        paras: null
    },
    initialize: function () {
    },
    create: function () {
        var p = OA.common.Global.getInitParas();
        var fieldset = this.query('fieldset')[0];
        if (!fieldset) return;
        var items = [];

        items.push({
            id: 'suggestionTitlebar',
            xtype: 'titlebar',
            title: '我的意見',
            cls: 'suggestion-titlebar',
            items: [
                {
                    id: 'suggestionsEdit',
                    title: '意見編輯',
                    //align: 'right',
                    ui: "plain",
                    iconCls: "fa-bulb",
                    action: 'editSgt',
                    handler: function (button) {
                        //意見編輯視窗
                        OA.common.Funcs.show('FormSuggestionTextArea', null, Ext.getCmp('suggestionText').getValue());
                    }
                },
                { xtype: 'spacer' },
                {
                    align: 'right',
                    html: '<p style="font-weight:bold;color:#fff;">詞庫</p>',
                    action: 'suggest',
                    handler: function (button) {
                         OA.common.Funcs.show('FormThesaurus', null);                       
                    }
                }
            ]
        });

        /* 高市府不用快捷選詞庫
        var tipItems = [];
        tipItems.push({
            html: '<p style="font-size:120%;margin:0 5px;-webkit-font-smoothing: antialiased; color:black;">如擬</p>',
            action: 'insertWord',
            word: '如擬'
        });
        
        items.push({
            id: 'suggestionTip',
            xtype: 'toolbar',
            scrollable: {
                direction: 'horizontal',
                indicators: false
            },
            cls: 'segdoc-tip-selector',
            items: tipItems,
            defaults: {
                ui: 'plain',
                style: 'margin:0;padding:0;',
                handler: function (button) {
                    var me = button.up('suggestion');
                    var action = button.config.action;
                    if (action === 'suggest') {
                        OA.common.Funcs.show('FormThesaurus', null);
                    } else if (action === 'insertWord') {
                        var word = button.config.word;
                        me.write(word);
                    } else if (action === 'close') {
                        OA.common.Global.getApp().getController('OA.controller.Work').onCloseTap(button);
                    }
                }
            }
        });
        */

        items.push({
            xtype: 'container',
            layout: 'vbox',  // 使用垂直布局
            items: [{
                xtype: 'textareafield',
                id: 'suggestionText',
                name: 'fieldNote',
                //height: 100,
                clearIcon: false,
                cls: 'textareafield-notresize textareafield-with-border',  // 使用更新的樣式
                style: 'border: 2px solid rgba(128, 128, 128, 0.5); border-radius: 10px; padding: 10px; font-size: 16px; width: 100%; box-sizing: border-box; background: #fff;',  // 設置背景色為白色
                listeners: {
                    element: 'element',
                    tap: function () {
                        Ext.getCmp('cpaper').setIsSuggestionIn(true);
                    }
                }
            }]
        }
        
        );

        items.push({
            id: 'suggestionClear',
            xtype: 'toolbar',
            scrollable: {
                direction: 'horizontal',
                indicators: false
            },
            cls: 'segdoc-clear',
            items: [
                {
                    html: '<u style="font-size:120%;margin:0 30px 8px 0;-webkit-font-smoothing: antialiased; color:#4F85A3;cursor: pointer;text-decoration: underline;">清除意見內容</u>',
                    action: 'clear'
                }, {
                    html: '<u style="font-size:120%;margin:0 0 8px 0;-webkit-font-smoothing: antialiased; color:#4F85A3;cursor: pointer;text-decoration: underline;">還原意見內容</u>',
                    action: 'undo'
                }],
            defaults: {
                ui: 'plain',
                style: 'margin:0;padding:0;',
                handler: function (button) {
                    var me = button.up('suggestion');
                    var action = button.config.action;
                    if (action === 'clear') {
                        me.clearValue();
                    } else if (action === 'undo') {
                        me.originalValue();
                    }

                }
            }
        });
        var qs = OA.common.Global.getQ();

        if (qs.app === 'review') {
            items.push({
                xtype: 'titlebar',
                title: '複閱',
                cls: 'suggestion-titlebar'
            });
            items.push({
                xtype: 'label',
                height: '150px',
                html: '<p style="text-align: center;line-height:150px;padding:3px;">本文已決行，確認後請按完成!</p>'
            });
            items.push({
                id: 'toolActions1',
                xtype: 'toolbar',
                cls: 'tool-actions-only'
            });
        } else {
            if (qs.app !== 'check') {
                items.push({
                    id: 'toolActions1',
                    xtype: 'toolbar',
                    cls: 'tool-actions'
                });
                items.push({
                    id: 'toolActions2',
                    xtype: 'toolbar',
                    cls: 'tool-actions'
                });
            }
        }

        items.push({
            id: 'labBarrier',
            xtype: 'label',
            html: '<p style="text-align: center;padding:3px;font-size: 17px;">下個流程：無</p>'+
                '<p style="text-align: center;padding:3px;font-size: 14px;color:#4F85A3;">(開啟陳會清單)</p>',
            style: "color:blue;cursor: pointer;",
            listeners: {
                element: 'element',
                tap: function () {
                    var paras = OA.common.Global.getInitParas();
                    var p = [];
                    p.push('doDeptno=' + paras.doDeptno);
                    p.push('doSno=' + paras.doSno);
                    window.open('../tbkn/aosda/AOSDA006F_s16.jsp?' + p.join('&'), "_blank", "width=800,height=600");
                }
            }
        });
        items.push({
            xtype: 'titlebar',
            title: '意見彙整',
            id: 'suggestionTitle',
            cls: 'suggestion-titlebar',
            items: [
                {
                    title: '意見彙整',
                    //align: 'right',
                    ui: "plain",
                    iconCls: "fa-file-all",
                    action: 'showAll',
                    handler: function (button) {
                        var dom = Ext.getCmp('cpaper').getSvgOpinion2(true);
                        if (dom) {
                            var opinions = dom.querySelectorAll('批示意見 > 意見');
                            if (opinions && opinions.length > 0) {
                                var size = OA.common.DIMgr.getDefaultFontSize();
                                var rowH = OA.common.DIMgr.getRowHeight();
                                var pageMargin = OA.common.DIMgr.getPageMargin();
                                var rows = [];

                                var _x = pageMargin.left;
                                var _y = pageMargin.top;
                                var color = 'black';
                                var idxPeople = 0;
                                var idxOpinion = 0;
                                var formatDef = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="{4}" fill="{5}">{6}<br></text>';
                                
                                // 依照 [單位機關] 排序 [意見彙整]
                                opinions = Array.from(opinions).sort(function (a, b) {
                                    var depNoA = a.getAttribute('depNo');
                                    var depNoB = b.getAttribute('depNo');
                                    return parseInt(depNoA, 10) - parseInt(depNoB, 10);
                                });

                                let currentDepNo = null;
                                rows.push('<div class="suggestion-container">');
                                Ext.Array.each(opinions, function (opinion) {
                                    // 使用 html5 details,  summary 實現不同 [單位機關] 收合效果。
                                    const depNo = opinion.getAttribute('depNo');
                                    const depName = opinion.getAttribute('depName');
                                    if (currentDepNo !== depNo) {
                                        rows.push((currentDepNo !== null)?'</details>':'');
                                        rows.push('<details class="suggestion-depno-block">');
                                        rows.push('<summary>' + depName + '<div class="toggle-icon"></div>' + '</summary>');
                                        currentDepNo = depNo; 
                                    }

                                    // [意見彙整] 每項之 標題
                                    idxPeople++;
                                    _y = _y + rowH;
                                    var txt = opinion.getAttribute('BulletText').toString() // 意見彙整開啟 意見資訊
                                        .replace(depName, '')   // 移除 重複部門名稱
                                        .split('.')[1];         // 取 {數字}. 右邊值
                                    var spaceIndex = txt.indexOf(" ");
                                    rows.push('<div class="suggestion-item">');
                                    rows.push(Ext.String.format(formatDef, 'by' + idxPeople, _x, _y, size, 'normal', color, txt));
                                    idxOpinion++;
                                    _y = _y + rowH;

                                    // [意見彙整] 每項之 內容
                                    var elem = opinion.querySelector('文字'); //意見彙整開啟 意見內容
                                    if (elem) {
                                        var lines = elem.textContent.split('\n');
                                        Ext.Array.each(lines, function (p) {
                                            rows.push('<p>' + Ext.String.format(formatDef, 'op' + idxOpinion, _x, _y, size, 'paragraph_desc', color, p)+ '</p>');
                                        })
                                    }
                                    rows.push('</div>');
                                });
                                rows.push((currentDepNo !== null)?'</details>':'');
                                rows.push('</div>');
                                // 引入 css樣式, 美化 不同 [單位機關] 收合效果。
                                var cssPath = OA.common.UrlMgr.getDomain() + '/oa/resources/css/sencha-touch.css';
                                var myWindow = window.open("", "", "width=500,height=500");
                                myWindow.document.write(`
                                    <html>
                                        <head>
                                            <title>意見彙整</title>
                                            <link rel="stylesheet" type="text/css" href="${cssPath}">
                                        </head>
                                        <body>
                                            ${rows.join('')}
                                        </body>
                                    </html>
                                `);
                            }
                        }
                    }
                }
            ]
        });

        
        /*
        items.push({
            id: 'tabSuggestionSort',
            xtype: 'tabpanel',
            cls: 'tab-segdoc-selector',
            items: [
                
                {
                    id: 'sugNoteDo', title: '承辦'
                },
                {
                    id: 'sugNoteCo', title: '會辦'
                },                
                {
                    id: 'sugNoteOK', title: '核決'
                }               
               
            ],
            listeners: {
                activeitemchange: function (ctr, value, oldValue, eOpts) {
                    var key = value.config.title;
                    Ext.getCmp('Suggestion').setKey(key);
                    Ext.getCmp('Suggestion').load();
                }
            }
        });
        */
        

        items.push({
            xtype: 'list',
            id: 'listSuggest',
            store: 'Suggestion',
            indexBar: false,
            grouped: false,
            pinHeaders: false,
            disableSelection: true,
            autoHeight: true,
            itemTpl: new Ext.XTemplate(
                //'<tpl if="this.showOpinionLast(values)">{[values.htmlOpnionLast]}</tpl>',
                '<tpl if="this.showOpinion(values)">{[values.htmlOpnion]}</tpl>',
                '<tpl if="this.isProxy(values)">',
                '<p style="font-size:90%;text-align: left;line-height: 200%;" class="version-user" id="{[values.id]}"> {[values.簽核人員.服務單位]} {[values.簽核人員.使用者名稱]} (代理：{[values.簽核人員.代理職稱]} {[values.簽核人員.代理名稱]})',
                '</p>',
                '<tpl else>',
                '<p style="font-size:90%;text-align: left;line-height: 200%;" class="version-user" id="{[values.id]}"> {[values.簽核人員.服務單位]} {[values.簽核人員.使用者職稱]} {[values.簽核人員.使用者名稱]}',
                '</p>',
                '</tpl>',
                '<p style="font-size:80%;text-align: left;">',
                '<tpl if="this.isNormalCard(values.卡片使用狀態,values.SignatureData)"><span class="version-card" style="color:green"></span></tpl>',
                '<tpl if="this.isTempCard(values.卡片使用狀態)"><span class="version-card" style="color:gold"></span></tpl>',
                ' {[values.線上簽核資訊.簽核流程.異動別]} {[values.最後更新時間]}',
                '</p>',
                {
                    isNormalCard: function (status, data) {
                        var isNormal = '正常' == status;
                        var hasData = false;
                        if (data) hasData = true;
                        return isNormal & hasData;
                    },
                    isTempCard: function (status) {
                        return ('臨時憑證' == status);
                    },
                    isErrorCard: function (data) {
                        var hasData = false;
                        if (data) hasData = true;
                        return !hasData;
                    },
                    /*
                    isShowLast: function (data) {
                        var html = [];
                        if (data.show === 'last') {
                            var content = data.批示意見.content || '';
                            if (content.toString().trim()) {
                                html.push('<p style="font-size:110%;color:blue;width:100%;border: 1px solid black;padding:3px;background-color:white">');
                                html.push(data.批示意見.content);
                                html.push('</p>');
                            }
                            return html.join('');
                        }
                    },
                    */
                    isShow: function (data) {
                        return data == 'show';
                    },
                    showOpinion: function (data) {
                       
                        if (data.批示意見.content == '' && data.線上簽核資訊 && data.線上簽核資訊.簽核意見) {
                            data.批示意見.content = data.線上簽核資訊.簽核意見;
                        }
                        //if (data.show !== 'show') return;
                        var html = [];
                        var content = data.批示意見.content || '';
                        if (content.toString().trim()) {
                            var lines = content.toString().split('\n');
                            html.push('<div style="font-size:110%;color:blue;padding:1px;">');
                            Ext.Array.each(lines, function (line) {
                                html.push('<p>' + line + '</p>');
                            });
                            html.push('</div>');
                            data.htmlOpnion = html.join('');
                        }
                        return true;
                    },
                    showOpinionLast: function (data) {
                        return;
                        if (data.批示意見.content == '' && data.線上簽核資訊 && data.線上簽核資訊.簽核意見) {
                            data.批示意見.content = data.線上簽核資訊.簽核意見;
                        }
                       //if (data.show !== 'last') return;
                        var html = [];
                        var content = data.批示意見.content || '';
                        if (content.toString().trim()) {
                            var lines = content.toString().split('\n');
                            html.push('<div style="font-size:110%;color:blue;width:100%;border: 1px solid black;padding:3px;background-color:white">');
                            Ext.Array.each(lines, function (line) {
                                html.push('<p>' + line + '</p>');
                            });
                            html.push('</div>');
                            data.htmlOpnionLast = html.join('');
                        }
                        return true;
                    },
                    isProxy: function (data) {
                        return data.簽核人員 && data.簽核人員.代理名稱
                    }
                }),
            listeners: {
                itemtap: function (list, index, item, record, event) {
                    if (event.getTarget('.version-card')) {
                        var data = record.get('SignatureData');
                        OA.common.Funcs.show('FormSignData', item, data);
                    }
                }
            }
        });
        fieldset.setItems(items);
        Ext.Array.forEach(fieldset.getItems().items, function (button) { //0316 右手邊我的意見及意見彙整按鈕彈跳說明 Chloe.sia
            if (button.config.title) {
                if (button.config.items[0]) {  //0707 如果有值才做  Chloe.sia
                    $(button.bodyElement.dom).qtip({
                        content: {
                            text: '<p style="font-size:200%;">' + button.config.items[0].title + '</p>'
                        },
                        position: {
                            my: 'top left',
                            at: 'bottom left'
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
    load: function (data) {
        var me = this;
        if (data) me.setParas(data); else data = me.getParas();
       
        //data.key = me.getKey();
        var store = Ext.getStore('Suggestion');
        store.doFilter(data);

        //console.log(store);

         /* 高市府不用快捷選詞庫 意見全部顯示不分類
        var tipItems = [];
        if (data.form.indexOf('簽') >= 0 || data.kind == '來文') {
            tipItems.push({
                html: '<p>如擬</p>',
                action: 'insertWord',
                word: '如擬'
            });
            tipItems.push({
                html: '<p>可</p>',
                action: 'insertWord',
                word: '可'
            });
        } else {
            tipItems.push({
                html: '<p>發</p>',
                action: 'insertWord',
                word: '發'
            });
        }
        tipItems.push(
            { xtype: 'spacer' },
            {
                html: '<p style="font-weight:bold;color:blue;">詞庫</p>',
                action: 'suggest'
            }
        );

        Ext.getCmp('suggestionTip').setItems(tipItems);
       

        //承辦單位與其他情境僅呈現「承辦」、「核決」
        //未決行前，會辦單位僅顯示「承辦」、「會辦」
        //決行後會時，會辦單位顯示「承辦」、「會辦」、「核決」
        //發文臺開啟時，右邊簽核區請停在「核決」
        //補核狀態時，右邊簽核區請停在「核決」
        var butSugNoteCo = Ext.getCmp('sugNoteCo'); //會辦
        var butSugNoteOK = Ext.getCmp('sugNoteOK'); //核決
        if (!OA.common.VIMgr.hadApproved() && OA.common.VIMgr.isParallel()) {
            if (butSugNoteCo) butSugNoteCo.setHidden(false);
            if (butSugNoteOK) butSugNoteOK.setHidden(true);
        }
        if (OA.common.VIMgr.hadApproved() || OA.common.VIMgr.hadApprovedBack()) {
            if (butSugNoteCo) butSugNoteCo.setHidden(false);
            if (butSugNoteOK) butSugNoteOK.setHidden(false);
        }
        var p = OA.common.Global.getInitParas();
        // var qd = OA.common.Global.getQueryDefault();
        // var u = OA.common.Global.getCurrentUser();
        // var isOwner = qd && qd.承辦人.empNo == u.empNo;

        if (p.roleId == '16' || p.roleId == '17') {
            if (butSugNoteCo) butSugNoteCo.setHidden(false);
        }
        */

        /*
         * 林務局意見輸入規則：
         * 會辦單位都開放輸入意見
         * 如果有加會辦簽只能在會辦簽輸入意見
         */

        var parallelLock = data.isSuggest ? false : true;


        /**
         * 舊台北市規則，不適用林務局  
         * 
        多簽稿且受會單位採在文稿右方簽核區簡單簽辦受會意見時，
        會辦意見僅可在第一個簽或稿輸入，簽稿併陳時則限制在第一個簽輸入意見。
        紙本來文登入來文有可能是簽，需再補判斷第一個簽是否為來文，
        （本項亦適用後會）
        續辦狀態且受會單位採在文稿右方簽核區簡單簽辦受會意見時，則在續辦後後第一簽或第一稿輸入，有簽先找簽，沒簽再找稿。
         var parallelLock = false;
        if (OA.common.VIMgr.isParallel() && OA.common.VIMgr.getUnitNote()) parallelLock = true;
         var isPaperFirst = data.noteStatus == 'first';
         if (isPaperFirst) parallelLock = false;

        1230 會辦狀態判別有無會辦簽，無會辦簽則開放第一個文稿輸入意見  Chloe.sia
        var segdoc = Ext.getCmp('segDocSelector');
        Ext.Array.forEach(segdoc.getItems().items, function (button) {
            if(button.getText() == '＋' && OA.common.VIMgr.isParallel()){
                var isPaperFirst = data.noteStatus == 'first';
                if (isPaperFirst) parallelLock = false;
            }
        });

        1030 會辦狀態增加會辦簽，只能在會辦簽輸入意見  Chloe.sia
        有加會辦簽的狀態下才成立
         if(data.form == '會辦簽'){
             parallelLock = false;
         }
         */


        var qs = OA.common.Global.getQ();
        if (qs.isRole15) parallelLock = true;
        if (data.kind && data.kind == '來文') parallelLock = true;    //來文鎖定不能登打意見

        Ext.getCmp('suggestionText').setDisabled(parallelLock);
        if (parallelLock) Ext.getCmp('suggestionText').setStyle({ cursor: 'not-allowed' });

        if (qs.app == 'approve') {
            Ext.getCmp('suggestionClear').setHidden(parallelLock);
        } else {
            if (parallelLock) Ext.getCmp('suggestionClear').setHidden(parallelLock);
        }

        Ext.getCmp('suggestionsEdit').setHidden(parallelLock);

        /*
        var butSuggests = Ext.getCmp('suggestionTip').items.items;
        Ext.Array.each(butSuggests, function (but) {
            but.setDisabled(parallelLock);
        });
        */

        var elemList = Ext.getCmp('listSuggest').element.dom;
        $('.version-user', elemList).qtip({
            content: {
                text: function (event, api) {
                    var id = $(this).attr('id');
                    var r = store.getById(id);
                    var tel = r.get('承辦單位電話') || '';
                    return '<p style="font-size:200%;">' + tel + '</p>';
                }
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

       //Ext.getCmp('Suggestion').load();
        OA.common.Utils.indicatorWith('listSuggest');

    },
    write: function (word) {
        var suggestiontext = Ext.getCmp('suggestionText');
        if (suggestiontext) {
            var textarea = suggestiontext.getComponent().input.dom;
            if (textarea) {
                var prefixStr = textarea.value.substring(0, textarea.selectionStart);
                var suffixStr = textarea.value.substring(textarea.selectionEnd);
                textarea.value = prefixStr + word + suffixStr;
                textarea.focus();
            }
        }
    },
    clearValue: function () {
        Ext.getCmp('suggestionText').setValue('');
        var suggestiontext = Ext.getCmp('suggestionText');
        if (suggestiontext) {
            var textarea = suggestiontext.getComponent().input.dom;
            if (textarea) textarea.value = '';
            suggestiontext.focus();
        }
    },
    originalValue: function () {
        var suggestiontext = Ext.getCmp('suggestionText');
        if (suggestiontext) {
            suggestiontext.reset();
            suggestiontext.focus();
        }
    },
    test: function (e) {
        var item = {};
        var text = e.type + ' ' + (event.key || '');
        if (e.type == 'focus') text = 'focus v2';

        var v = Ext.getCmp('suggestionText').getValue();
        item.簽核人員 = { 服務單位: text };
        item.線上簽核資訊 = { 簽核意見: "", 簽核流程: { 異動別: " " } };
        item.批示意見 = { content: v, lastTime: '' };

        var store = Ext.getStore('Suggestion');
        store.clearFilter();
        store.add(item);
    }
});