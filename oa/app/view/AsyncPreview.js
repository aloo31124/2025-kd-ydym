/**
 * 非即時追蹤修訂
 */
Ext.define('OA.view.AsyncPreview', {
    extend: 'Ext.Container',
    xtype: 'AsyncPreview',
    id: 'asyncPreview',
    requires: [
        'OA.components.Paper'
    ],
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
                xtype: 'suggestion',
                docked: 'right',
                //scrollable: {
                //    direction: 'vertical',
                //    indicators: false
                //},
                items: [
                    {
                        xtype: 'titlebar',
                        title: '追蹤修訂歷程',
                        cls: 'tab-segdoc-selector'
                    },
                    {
                        id: 'toolbarPreview',
                        height: '90%',
                        scrollable: 'vertical',
                        cls: "segdoc-async-selector",
                    }
                ],

                width: '25%'
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
                //style: 'height:30px;'
            }
        ],
        oSvgAsyncs: null,
        firstLoad: false, 
        asyncrs:null
    }, maxKDRich:[],
    initialize: function () {
        var me = this;
        var q = OA.common.Global.getQ();
        me.create();
        var scrollable = me.getScrollable();
        if (scrollable) {
            scrollable.getIndicators().y.setAutoHide(false);
            var indicator = scrollable.getIndicators().y;
            if (indicator) indicator.show();
        }
    },
    /**
     *  建立函稿切換
     */
    createTabs: function (extra) {
        var me = this;

        if (extra) me.setOSvgAsyncs(extra);
        var ctrFormatType = Ext.getCmp('formatType');
        var items = [];


        Ext.Array.each(extra, function (paper, index) {
            var empName = paper.wk.empName || '';
            var depName = paper.wk.depName || '';
            var _color = me.pickColor(paper.domColors, paper.wk.Version);
            //console.log(paper);
            var lastTime = paper.wk.LastUpdateTime || '';
            paper.version = paper.wk.Version;
            //堆疊追蹤修訂
            //console.log(paper);
            items.push({
                docked: 'top',
                oSVG: paper,
                index: index,
                initParas: extra.initParas,
                version: paper.wk.Version + '',
                depName: depName,
                empName: empName,
                _color: _color,
                lastTime: lastTime,
                html: '<label style="font-size:160%;color:' + _color + '">■   </label>' +
                    '<text  style="font-size:90%; font-family: Microsoft JhengHei;">' + depName + ' - ' + empName + '</text > ' +
                    '<text  style="font-size:75%; font-family: Microsoft JhengHei;">' + '</p>&emsp;' + lastTime + '</text >'
            });
        });
        me.setFirstLoad(true);
        if (ctrFormatType) ctrFormatType.setItems(items);
        var last = items.length - 1;
        ctrFormatType.setPressedButtons(ctrFormatType.getItems().items[last]);
        //console.log(ctrFormatType);
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
        var itemsSeg = [
            {
                //建立文稿切換按鈕
                id: 'formatType',
                xtype: 'segmentedbutton',
                listeners: {
                    toggle: function (container, button, pressed) {
                        if (!pressed) return;
                        //console.log(pressed);
                        var asyncPreview = Ext.getCmp('asyncPreview');
                        asyncPreview.getMultiFormat(Ext.clone(button.config), true);
                    }
                }
            }
        ]

        Ext.getCmp('toolbarPreview').setItems(itemsSeg);

    },
    /**
     *  建立下方功能欄
     */
    createToolbarOthers: function () {
        var items = [
            { xtype: 'spacer' },
            {
                title: '放大', ui: 'plain', iconCls: 'fa-search-plus', action: 'previewZoom',
                handler: function (button) {
                    Ext.getCmp('asyncPreview').zoomIn();
                }
            },
            {
                title: '縮小', ui: 'plain', iconCls: 'fa-search-minus', action: 'previewZoom',
                handler: function (button) {
                    Ext.getCmp('asyncPreview').zoomOut();
                }
            },
        ];

        Ext.getCmp('toolbarOthers').setItems(items);
    },
    getInitParas: function () {
        var qs = OA.common.Global.getQ();
        var win = OA.common.Global.getWinOpener();
        var initParas = win.getAsyncPapers();
        //追蹤修訂問題修訂
        this.setAsyncrs(win.getasyncrs());//將WIN上的資料存到OA.view.AsyncPreview.asyncrs中
        OA.common.Global.setCurrentWKContent(win.getCurrentWKContent());//將window中的資料載入
        OA.common.Global.setInitParas(win.getInitParas());  //將window中的資料載入
        initParas.initParas = win.getInitPreviewParas().initParas;
        //console.log(initParas);
        return initParas;
    },
    /**
     *  qs.by === 'dom' , mode=null to init createTabs
     */
    load: function () {
        var me = this;
        var initParas = me.getInitParas();
        me.createTabs(initParas);
    },
    loadDom: function (mode, initParas) {
        //console.log(initParas);
        var me = this;
        var qs = OA.common.Global.getQ();
        // var commonData = OA.common.DIMgr.doWkCommon(wk.DocumentType, wk, options);
        var commonData = {};
        commonData.mode = mode;
        commonData.wkContent = initParas.oSVG.wk;
        commonData.domColors = initParas.oSVG.domColors;
        commonData.fields = initParas.oSVG.fields;
        var modelName = OA.common.DIMgr.getModelName('wk', initParas.oSVG.wk.DocumentType);
        //console.log(modelName);
        OA.client.WK.setCurrentModelName(modelName);
        commonData.initParas = initParas.initParas;
        //commonData.opinion = initParas.opinion;
        //commonData.seal = initParas.seal;
        commonData.oSVG = initParas.oSVG;
        //me.setCommonData(commonData);
        OA.common.Paper.main().createByParas(commonData, mode);
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
     *  建立追蹤修訂
     */
    getMultiFormat: function (config, notFirst) {
        //console.log(notFirst);
        var me = this;
        var dmp = new diff_match_patch();


        var multiFormats = [];
        var revises = [];
        var oSvgAsyncs = me.getOSvgAsyncs();
        var oSvgLast = oSvgAsyncs[parseInt(config.index) - 1];
        var firstLoad = me.getFirstLoad();

        if (!oSvgLast) {
            me.loadDom('Normal', config);
            return;
        }

        var oSvgList = [];
        //console.log(oSvgAsyncs);
        //console.log(config.index);
        Ext.Array.each(oSvgAsyncs, function (osvg, index) {
            if (index <= parseInt(config.index)) {
                oSvgList.push(osvg);
            }
        })
        //計算缺少段落ID
        var config = me.addReviseParagraph(oSvgList, config);
        Ext.Array.each(oSvgList, function (osvg, index) {

            if (index == 0) return true;

            var vmNow = osvg.vm;
            var vmLast = oSvgList[index - 1].vm;
            var version = osvg.wk.Version;
            var isAddKDRich = [];
            var isReduceDKRich = [];
            var isSameKDRich = [];
            var xmlDoc = osvg.xml;
            var $xml = $(xmlDoc);
            var revise = false;


            var richNow = vmNow.KDRichTextBlockList;
            var richLast = vmLast.KDRichTextBlockList;

            Ext.Array.each(richNow, function (now) {
                //console.log(now);
                var isPushAdd = true;
                Ext.Array.each(richLast, function (last) {
                    if (now.id == last.id) {
                        //isSameKDRich.push(now.id);
                        isPushAdd = false;                        
                    }
                    
                });
                if (me.maxKDRich.indexOf(now.id) == -1) { //將有出現過的段落ID通通存到maxKDRich中
                    me.maxKDRich.push(now.id);
                }
                if (isPushAdd) {
                    isAddKDRich.push(now.id);
                    //if (me.maxKDRich.indexOf(now.id) == -1) { //將有出現過的段落ID通通存到maxKDRich中
                    //    me.maxKDRich.push(now.id);
                    //}
                }
            });

            Ext.Array.each(richLast, function (last) {
                var isPushReduce = true;
                Ext.Array.each(richNow, function (now) {
                    if (now.id == last.id) {
                        isPushReduce = false;
                    }                   
                })
                if (me.maxKDRich.indexOf(last.id) == -1) { //將有出現過的段落ID通通存到maxKDRich中
                    me.maxKDRich.push(last.id);
                }
                if (isPushReduce)
                    isReduceDKRich.push(last.id);
            });

            if (isAddKDRich.length > 0 || isReduceDKRich.length > 0) revise = true;

            //console.log(isAddKDRich);
            //console.log(isReduceDKRich);
            //console.log(isSameKDRich);

            //增行
            if (isAddKDRich.length > 0) {
                Ext.Array.each(isAddKDRich, function (id, index) {
                    var rich = vmNow[id];
                    var KDRichID = id + '_context'
                    var multiFormat = {
                        bindId: KDRichID,
                        fromItemIdx: index,
                        styles: {
                            items: [
                                {
                                    action: "InsertText",
                                    //brush: undefined,
                                    //desc: "基01 刪文:測</br>109/07/01 14:25:49",
                                    fromBindId: KDRichID,
                                    //fromItemIdx: 1,
                                    //lastUpdateTime: "109/07/01 14:25:49",
                                    //name: "8901307205",
                                    //penSpecies: undefined,
                                    //userId: "k1701",
                                    //userName: "基01",
                                    version: version,
                                }
                            ], data: rich.text, start: 0, end: rich.text.length - 1
                        },
                        text: rich.text
                    }

                    multiFormats.push({
                        bindId: KDRichID,
                        multiFormat: multiFormat,
                        textClear: rich.text
                    });

                });
            }

            //刪行
            if (isReduceDKRich.length > 0) {
                Ext.Array.each(isReduceDKRich, function (id, index) {
                    var rich = vmLast[id];
                    var KDRichID = id + '_context'
                    var multiFormat = {
                        bindId: KDRichID,
                        fromItemIdx: index,
                        styles: {
                            underline: "Underline",
                            items: [
                                {
                                    action: "StrikeText",
                                    //brush: undefined,
                                    //desc: "基01 刪文:測</br>109/07/01 14:25:49",
                                    fromBindId: KDRichID,
                                    //fromItemIdx: 1,
                                    //lastUpdateTime: "109/07/01 14:25:49",
                                    //name: "8901307205",
                                    //penSpecies: undefined,
                                    //userId: "k1701",
                                    //userName: "基01",
                                    underline: "Underline",
                                    version: version,
                                }
                            ], data: rich.text, start: 0, end: rich.text.length - 1
                        },
                        text: rich.text
                    }
                    multiFormats.push({
                        bindId: KDRichID,
                        multiFormat: multiFormat,
                        textClear: rich.text
                    });

                });
            }

            //插文，刪文
            var changeText = [];

            if (me.maxKDRich.length > 0) {

                Ext.Array.each(me.maxKDRich, function (id, index) {

                    //要抓上一關的做比對，內容沒有一致，抓出增刪文字
                    //避免抓不到新增段落文字而出錯
                    try {
                        var nowTextClear = vmNow[id].text;
                    } catch (err){
                        var nowTextClear = "";
                    }
                    try {
                        var lastTextClear = vmLast[id].text;
                    } catch (err){
                        var lastTextClear = "";
                        var isLastTextNull = true;
                    }
                    var KDRichID = id + '_context';
                    //判斷multiFormats有沒有同ID，如果有同ID要整併在一起
                    var changeMulti = false;
                    var findFormats;
                    Ext.Array.each(multiFormats, function (multi) {
                        if (multi.bindId == KDRichID) {
                            findFormats = Ext.clone(multi);
                            lastTextClear = Ext.clone(multi.textClear);
                            changeMulti = true;
                            return false;

                        }
                    });
                    //當上版次刪除內容與現在新增相同時避免顯示錯誤
                    if (isLastTextNull && lastTextClear == nowTextClear && nowTextClear != "") {
                        lastTextClear += " ";
                    }
                    if (nowTextClear !== lastTextClear) {
                        //console.log(lastTextClear);
                        //console.log(nowTextClear);                      

                        var oldmulti = [];
                        //將上一個版次該條例追修逐字拆出來
                        if (changeMulti) {
                            Ext.Array.each(findFormats.multiFormat, function (find) {
                                //console.log(find);
                                var mun = 0;
                                if (find.styles && find.styles.data) {
                                    for (var i = 0; i < find.styles.data.length; i++) {
                                        var chrTag = Ext.clone(find);
                                        var styles = Ext.clone(find.styles);
                                        styles.start = i;
                                        styles.end = i + 1;
                                        styles.data = chrTag.styles.data.substring(i, i + 1);
                                        oldmulti.push({
                                            fromItemIdx: find.fromItemIdx,
                                            text: chrTag.styles.data.substring(mun + i, mun + i + 1),
                                            styles: styles
                                        });
                                    }
                                    mun = mun + find.styles.data.length;
                                } else {
                                    for (var i = 0; i < find.text.length; i++) {
                                        oldmulti.push({
                                            fromItemIdx: find.fromItemIdx,
                                            text: find.text.substring(mun + i, mun + i + 1)
                                        });
                                    }
                                    mun = mun + find.text.length;
                                }
                            });
                        }

                        //if (findFormats && findFormats.length > 0) {
                        //    var oldmulti = findFormats[0].multiFormat;
                        //    console.log(oldmulti);
                        //    lastTextClear = findFormats[0].textClear;
                        //    changeMulti = true;
                        //}
                        var multiFormat = [];
                        var diff = dmp.diff_main(lastTextClear, nowTextClear, false);
                        //console.log(diff);
                        if (diff && diff.length > 0) {
                            //console.log(oldmulti);
                            var diffTextClear = '';
                            var num = 0;
                            Ext.Array.each(diff, function (d) {
                                diffTextClear = diffTextClear + d[1];
                                if (d[0] == 0) {    //相同

                                    //有重覆ID保留原始追修
                                    if (changeMulti && oldmulti) {
                                        //內容一樣就延用上次追修
                                        var lastmuti = oldmulti.slice(num, (num + d[1].length));
                                        if (lastmuti && lastmuti.length > 0) {
                                            //console.log(d);
                                            for (var i = 0; i < d[1].length; i++) {
                                                var chr = d[1].substring(i, i + 1);
                                                //console.log(lastmuti[i]);
                                                if (lastmuti[i] && chr == lastmuti[i].text) {
                                                    var same = {
                                                        bindId: KDRichID,
                                                        fromItemIdx: index,
                                                        text: chr
                                                    }
                                                    
                                                    if (lastmuti[i] && lastmuti[i].styles) {
                                                        if (lastmuti[i].styles.items && lastmuti[i].styles.items[0]) {
                                                            var styleItem = lastmuti[i].styles.items[0];
                                                            if (styleItem && styleItem.action == 'InsertText') {
                                                                //console.log(lastmuti[i].styles);
                                                                same.styles = lastmuti[i].styles
                                                                same.styles.data = chr
                                                            }
                                                        }
                                                    }
                                                    multiFormat = multiFormat.concat(same);
                                                    
                                                } else {
                                                    var same = {
                                                        bindId: KDRichID,
                                                        fromItemIdx: index,
                                                        text: chr
                                                    }
                                                    if (lastmuti[i] && lastmuti[i].styles) {
                                                        same.styles = lastmuti[i].styles
                                                        same.styles.data = chr
                                                    }
                                                    multiFormat = multiFormat.concat(same);
                                                }
                                            }
                                           
                                        } else {
                                            var same = {
                                                bindId: KDRichID,
                                                fromItemIdx: index,
                                                text: d[1]
                                            }
                                            //num = num + d[1].length;
                                            multiFormat.push(same);
                                        }
                                        //num = num + d[1].length;
                                        //console.log(lastmuti);
                                        //multiFormat = multiFormat.concat(lastmuti)
                                    } else {
                                        var same = {
                                            bindId: KDRichID,
                                            fromItemIdx: index,
                                            text: d[1]
                                        }
                                        //num = num + d[1].length;
                                        multiFormat.push(same);
                                    }
                                    //num = num + d[1].length;
                                } else if (d[0] == 1) { //增加
                                    //revise = true;
                                    //console.log('add');
                                    var add = {
                                        //bindId: KDRichID,
                                        fromItemIdx: index,
                                        styles: {
                                            items: [
                                                {
                                                    action: "InsertText",
                                                    //brush: undefined,
                                                    //desc: "基01 刪文:測</br>109/07/01 14:25:49",
                                                    fromBindId: KDRichID,
                                                    fromItemIdx: index,
                                                    //lastUpdateTime: "109/07/01 14:25:49",
                                                    //name: "8901307205",
                                                    //penSpecies: undefined,
                                                    //userId: "k1701",
                                                    //userName: "基01",
                                                    version: version,
                                                }
                                            ], data: d[1], start: num, end: num + d[1].length - 1
                                        },
                                        text: d[1]
                                    }
                                    if (changeMulti && oldmulti) {
                                        num = num - d[1].length;
                                    }
                                    revise = true;
                                    multiFormat.push(add);
                                } else {
                                    //revise = true;
                                    //console.log('reduce');
                                    //減少
                                    //有重覆ID保留原始追修
                                    if (changeMulti && oldmulti) {
                                        var lastmuti = oldmulti.slice(num, (num + d[1].length));
                                        //if (oldmulti.length > lastmuti.length) {
                                        //    console.log(d);
                                        //    lastmuti = lastmuti + oldmulti.slice(lastmuti.length, oldmulti.length);
                                        //}
                                        //原本lastmuti是增字的要變成刪字
                                        //var end = 0;
                                        //console.log()
                                        Ext.Array.each(lastmuti, function (last, index) {
                                            //console.log(last);                          
                                            if (last.styles && last.styles.items) {
                                                if (last.styles.items[0].action == 'InsertText') {
                                                    last.styles.underline = "Underline";
                                                    last.styles.items[0].action = "StrikeText";
                                                    last.styles.items[0].underline = "Underline";
                                                    last.styles.items[0].version = version;
                                                    revise = true;
                                                    last.textClear = '';
                                                }
                                                //console.log(last);
                                                multiFormat = multiFormat.concat(last);
                                            } else {
                                                //console.log(last)
                                                var reduce = {
                                                    // bindId: KDRichID,
                                                    fromItemIdx: last.fromItemIdx,
                                                    styles: {
                                                        underline: "Underline",
                                                        items: [
                                                            {
                                                                action: "StrikeText",
                                                                //brush: undefined,
                                                                //desc: "基01 刪文:測</br>109/07/01 14:25:49",
                                                                fromBindId: KDRichID,
                                                                fromItemIdx: last.fromItemIdx,
                                                                //lastUpdateTime: "109/07/01 14:25:49",
                                                                //name: "8901307205",
                                                                //penSpecies: undefined,
                                                                //userId: "k1701",
                                                                //userName: "基01",
                                                                underline: "Underline",
                                                                version: version,
                                                            }
                                                        ], data: last.text, start: num, end: num + 1
                                                    },
                                                    text: last.text,
                                                    textClear: ''
                                                }
                                                revise = true;
                                                multiFormat = multiFormat.concat(reduce);
                                            }
                                        })
                                    } else {
                                        var reduce = {
                                            // bindId: KDRichID,
                                            fromItemIdx: index,
                                            styles: {
                                                underline: "Underline",
                                                items: [
                                                    {
                                                        action: "StrikeText",
                                                        //brush: undefined,
                                                        //desc: "基01 刪文:測</br>109/07/01 14:25:49",
                                                        fromBindId: KDRichID,
                                                        fromItemIdx: index,
                                                        //lastUpdateTime: "109/07/01 14:25:49",
                                                        //name: "8901307205",
                                                        //penSpecies: undefined,
                                                        //userId: "k1701",
                                                        //userName: "基01",
                                                        underline: "Underline",
                                                        version: version,
                                                    }
                                                ], data: d[1], start: num, end: num + d[1].length - 1
                                            },
                                            text: d[1],
                                            textClear:''
                                        }
                                        multiFormat.push(reduce);
                                        revise = true;
                                    }
                                    //num = num + d[1].length;
                                }
                                num = num + d[1].length;
                            });
                            changeText.push({
                                id: KDRichID,
                                text: diffTextClear
                            })
                        }
                        //console.log(multiFormat);

                        if (!changeMulti) {

                            multiFormats.push({
                                bindId: KDRichID,
                                multiFormat: multiFormat,
                                textClear: diffTextClear
                            });
                        } else {
                            //findFormats.multiFormat = multiFormat
                            //findFormats.textClear = textClear;
                            Ext.Array.each(multiFormats, function (item) {
                                if (item.bindId == KDRichID) {
                                    //console.log(multiFormat);
                                    //console.log(Ext.clone(oldmulti);
                                    item.multiFormat = multiFormat;
                                    //item.multiFormat = item.multiFormat.push(multiFormat)
                                    item.textClear = diffTextClear;
                                }
                            });
                        }
                    }
                });
            }
            //console.log(changeText);
            if (changeText && changeText.length > 0) {
                $xml.find("text").each(function (i, txt) {
                    if (txt.id && txt.id.indexOf("KDRichTextBlock") != -1)
                        Ext.Array.each(changeText, function (change) {
                            if (change.id == txt.id) {
                                txt.textContent = change.text;
                            }
                        });
                });
            }
            osvg.xml = xmlToString($xml);
            if (firstLoad && revise) {
                revises.push(osvg.version);
            }
        });

        if (firstLoad) {
            me.reviseMake(revises);
        }

        config.oSVG.multiFormat = multiFormats;
        me.loadDom('Normal', config);
    },
    pickColor: function (domColors, version) {
        var color = 'black';
        if (domColors) {
            var domColor = domColors.querySelector("Root > Color[Version='" + version + "']");
            if (domColor) {
                color = domColor.getAttribute("Color");
            } else {

                domColor = domColors.querySelector("Root > Color[Version='0" + version + "']");
                if (domColor) {
                    color = domColor.getAttribute("Color");
                }
            }
        }
        return color;
    },
    reviseMake: function (revises) {
        if (revises.length == 0) return;
        //console.log(revises);
        var me = this;

        var ctrFormatType = Ext.getCmp('formatType');
        if (ctrFormatType) {
            var items = ctrFormatType.getItems().items;
            if (items) {
                Ext.Array.each(items, function (item) {
                    if (revises.indexOf(item.config.version) != -1) {
                        var makeHtml = '<label style="font-size:160%;color:' + item.config._color + '">■   </label>' +
                            '<text style="font-size:90%; font-family: Microsoft JhengHei; text-decoration:underline;">' + item.config.depName + ' - ' + item.config.empName + '</text> ' +
                            '<text  style="font-size:75%; font-family: Microsoft JhengHei;">' + '</p>&emsp;' + item.config.lastTime + '</text >';
                        item.set('html', makeHtml);
                    }
                });
            }
        }

        var ctr = Ext.getCmp('toolbarPreview').getScrollable().getScroller();
        if (ctr) ctr.scrollToEnd();
        me.setFirstLoad(false);
    }, 
    //新增缺失段落
    addReviseParagraph: function (oSvg, config) {
        //console.log(oSvg, config);
        var modelName = config.oSVG.modelName
        var rs = $.extend(true, {}, this.getAsyncrs());
        var numberOfVer = oSvg.length - 1;//計算現在版本數量
        var oSvgAllId = [];//放置文件該出現的ID
        //抓出所有的段名跟ID
        var allparagraph = [];
        Ext.Array.each(oSvg, function (svg) {
            if (svg.vm.KDRichTextBlockList) {
                Ext.Array.each(svg.vm.KDRichTextBlockList, function (list) {
                    if (list.id.indexOf('KDRichTextBlock_') != -1 && list.id.indexOf('-') == -1) {
                        var isPust = true;
                        Ext.Array.each(allparagraph, function (paragraph) {
                            if (paragraph.id == list.id) {
                                isPust = false;
                                return false;
                            }
                        })
                        if (isPust) {
                            allparagraph.push({
                                id: list.id,
                                paragraph: svg.vm[list.id].paragraph,
                                no: svg.vm[list.id].no
                            })
                        }
                    }
                })
            }
        });
        //console.log(allparagraph);

        oSvgAllId.push(JSON.parse(JSON.stringify(oSvg[0].vm.KDRichTextBlockList)));
        //console.log(oSvgAllId, oSvg, numberOfVer);//test
        
        var setNo = [
            [],
            ["", "一、", "二、", "三、", "四、", "五、", "六、", "七、", "八、", "九", "十"],
            ["", "(一)", "(二)", "(三)", "(四)", "(五)", "(六)", "(七)", "(八)", "(九)", "(十)"],
            ["", "1、", "2、", "3、", "4、", "5、", "6、", "7、", "8、", "9、", "10、"],
            ["", "(1)", "(2)", "(3)", "(4)", "(5)", "(6)", "(7)", "(8)", "(9)", "(10)"],
            ["", "甲、", "乙、", "丙、", "丁、", "戊、", "己、", "庚、", "辛、", "壬、", "癸、"],
            ["", "(甲)", "(乙)", "(丙)", "(丁)", "(戊)", "(己)", "(庚)", "(辛)", "(壬)", "(癸)"],
            ["", "子、", "丑、", "寅、", "卯、", "辰、", "巳、", "午、", "未、", "申、", "酉、", "戌、", "亥、"],
            ["", "(子)", "(丑)", "(寅)", "(卯)", "(辰)", "(巳)", "(午)", "(未)", "(申)", "(酉)", "(戌)", "(亥)"]
        ];
        var setTag = ["", ">>", ">>>", ">>>>", ">>>>>", ">>>>>>", ">>>>>>>", ">>>>>>>>", ">>>>>>>>>"];
        for (var i = 1; i <= numberOfVer; i++) {//文件對應該有段落 ,總共有幾個版本
            var text = JSON.parse(JSON.stringify(oSvgAllId[i - 1]));//先以上個版本為基礎
            Ext.Array.each(oSvg[i].vm.KDRichTextBlockList, function (nel) {//目前版本有的ID
                var flagle = true;//是否新增依據
                Ext.Array.each(oSvgAllId[i - 1], function (lel) {//上個版本有出現過的ID
                    if (nel.id == lel.id) flagle = false;//找到相同ID則不新增
                });
                if (flagle && nel.id != "") {//缺少ID則新增 &&避免有人全刪發生錯誤
                    text.push(nel);
                }
            });
            oSvgAllId.push(text);
        }
        //console.log(oSvgAllId, rs);
        var nowText = oSvg[numberOfVer].vm.KDRichTextBlockList;//存放現在版本有的ID
        Ext.Array.each(oSvgAllId[numberOfVer], function (oel) {//段落是否有缺少，以所有該出現的ID為依據
            var flagle = true;
            Ext.Array.each(nowText, function (nel) {//現在版本有的ID
                if (oel.id == nel.id) {
                    flagle = false;
                    //console.log(oel, nowText);
                }
            });
            if (flagle) {//補上缺少的ID
                //console.log(oel);

                //判斷是否為段名從allparagraphName把段名整個補回

                if (oel.id.indexOf('KDRichTextBlock_') != -1 && oel.id.indexOf('-') == -1 &&
                    oel.id.indexOf('_context') == -1) {
                    var theParagraph = allparagraph.where("( el, i, res, param ) => el.id=='" + oel.parentid + "'");
                    //console.log(theParagraph);
                    if (theParagraph && theParagraph.length > 0) {
                        rs[numberOfVer].data.KDRichTextBlock.items.splice(0, 0, {
                            layer: "0",
                            layerNo: "0",
                            lv: "0",
                            mainLayer: 0,
                            multiFormat: null,
                            no: theParagraph[0].no,
                            paragraph: theParagraph[0].paragraph,
                            secLayer: 0,
                            tag: ">",
                            text: "",
                            textClear: ""
                        });
                    }

                } else {
                    //var paragraphId = oel.id.split("KDRichTextBlock-100")[1].split(".");//階層資訊
                    var paragraphId = oel.id.split(oel.id.substring(0, oel.id.length - 2))[1].split(".");//階層資訊
                    //console.log(paragraphId)
                    //該層的paragraph
                    var nowParagraph = oel.id.substring(16, 17);
                    //console.log(nowParagraph)
                    var p_l = paragraphId.length;
                    var LastParagraphId = paragraphId[p_l - 1].length > 1 ? paragraphId[p_l - 1].split("0")[1] : paragraphId[p_l - 1];
                    var lv = p_l + "." + LastParagraphId;
                    var mainLayer = paragraphId[0].length == 1 ? Number(paragraphId[0]) : Number(paragraphId[0].split("0")[1]);
                    var no;

                    Ext.Array.each(rs[numberOfVer].data.KDRichTextBlock.items, function (el, index, items) {
                        if (index > 0) {
                            if (el.paragraph == nowParagraph) {//先找出同段層
                                if (el.layer == p_l) {//再找同階層
                                    //if ( Number(mainLayer) == el.mainLayer) {
                                    //    if ((Number(LastParagraphId) - 1) == el.layerNo) {
                                    //        no = index + 1;
                                    //        return false;
                                    //    }
                                    //}
                                    if ( Number(mainLayer) >= el.mainLayer) {
                                        if ((Number(LastParagraphId) - 1) == el.layerNo) {
                                            no = index + 1;
                                            return false;
                                        }
                                    }    
                                }
                            }
                            //if (items[index - 1].mainLayer == mainLayer && items[index - 1].layer == p_l - 1 + '' &&
                            //    el.layer != p_l + '' && items[index - 1].paragraph == el.paragraph) {
                            //    no = index;
                            //    return false;
                            //} else if (items[index - 1].mainLayer == mainLayer && items[index - 1].layer >= p_l + '' &&
                            //    el.layer < p_l && items[index - 1].paragraph == el.paragraph) {
                            //    no = index;
                            //    return false;
                            //} else if (index == items.length - 1) {
                            //    no = items.length;
                            //}
                        }
                    });
                    if (no) {
                        rs[numberOfVer].data.KDRichTextBlock.items.splice(no, 0, {
                            layer: p_l + '',
                            layerNo: LastParagraphId,
                            lv: lv,
                            mainLayer: mainLayer,//需要數字才能正常顯示出文字
                            multiFormat: null,
                            no: setNo[p_l][LastParagraphId],
                            //paragraph: "1",
                            paragraph: nowParagraph,
                            secLayer: 1,
                            tag: setTag[p_l],
                            text: "",
                            textClear: ""
                        });
                    } else {
                        rs[numberOfVer].data.KDRichTextBlock.items.push({
                            layer: p_l + '',  //這個是階
                            layerNo: mainLayer + '',
                            lv: lv,
                            mainLayer: mainLayer,//需要數字才能正常顯示出文字
                            multiFormat: null,
                            no: setNo[p_l][LastParagraphId],
                            //paragraph: "1",
                            paragraph: nowParagraph,//這個是層
                            secLayer: 0,
                            tag: setTag[p_l],
                            text: "",
                            textClear: ""
                        });
                    }
                }
            }
        });
        var rsxml = OA.common.DIMgr.generateSvg(modelName, rs[numberOfVer], { isAsync: true });
        config.oSVG.xml = rsxml.xml;//更新XML內容 
        return config;
    }
});
