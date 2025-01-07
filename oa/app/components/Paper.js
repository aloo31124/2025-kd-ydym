/**
 * 公文文稿
 */
Ext.define("OA.components.Paper", {
    extend: "Ext.Container",
    xtype: 'cpaper',
    requires: ['OA.form.*', 'OA.model.seal.*', 'Ext.ux.TouchCalendarView', 'Ext.ux.TouchCalendar'],
    config: {
        layout: "vbox",
        ui: 'plain',
        items: [
            {
                name: 'paperBox',
                xtype: 'container'
            },
            {
                name: 'iframeBox',
                xtype: 'container',
                html: '<iframe id="subFrame" height="1px" width="1px" ></iframe>'
            }
        ],
        svgPaper: null,
        reviseWidth: 0.0,
        pageWidth: 0.0,
        pageHeight: 0.0,
        workWidth: 0.0,
        workHeight: 0.0,
        maxMargin: 0.0,
        marginLeft: 0.0,
        marginRight: 0.0,
        marginTop: 0.0,
        marginBottom: 0.0,
        pagingHeight: 0.0,
        sealHeight: 0.0,
        lineGap: 0.0,
        linePadding: 5,
        currentX: 0.0,
        currentY: 0.0,
        barcodeHeight: 0.0,
        ratio: 1,
        page: 0,
        countLine: 0,
        isDoRevise: false,
        isIME: false,
        imeOldIValue: null,
        multiFormat: null,
        contactFields: null,
        fields: null,
        createParas: null,
        isClearPaper: false,
        isFieldEdit: true,
        isPreview: false,
        status: '',
        selectedElement: null,
        selectedTspan: null,
        previewMode: '',
        barcode: '',
        pageFilter: { first: false, last: false },
        colorVersions: [],
        clearPaperTemp: null,
        currentMode: 'edit',
        isEditingPagging: false, //換頁換行處理
        extendTextContent: '',    //換頁換行處理
        layer: null,
        printXml: '',
        layerTitle: '',
        isStrikeText: false,
        isSuggestionIn: false,
        isLockPaper: false,  //鎖住文稿，但可以圈選復製
        keepVarable: [],     //記錄套印變數的ID跟字串
        varableIndex: 0,      //記錄套印變數
        sealH: 0,
        richAndmultiList: { rich: [], mult: [] },     //重作、還原集合
        unreDoIndex: 0,
        pasteStates: 0,
        binPacket: false
    },
    create: function (oSVG, fields, callback) {
        var me = this;
        var qs = OA.common.Global.getQ();
        OA.common.Paper.register(me);
        me.setFields(fields);
        var ctrFormatType = Ext.getCmp('formatType');
        var mode = this.getPreviewMode();
        var wk = OA.common.Global.getCurrentWKContent();
        me.setReviseWidth(OA.common.DIMgr.getPageWidth());
        me.setPageWidth(OA.common.DIMgr.getPageWidth());
        me.setPageHeight(OA.common.DIMgr.getPageHeight());
        me.setSealHeight(OA.common.DIMgr.getSealHeight());
        me.setBarcodeHeight(OA.common.DIMgr.getBarcodeHeight());

        //開右邊追蹤線模式
        if (oSVG && oSVG.isDoRevise) {
            me.setIsDoRevise(true);
            me.setReviseWidth(OA.common.DIMgr.getPageWidth() * 1.5);
        }

        var svg = me.svgInit();
        var success = me.svgSetSource(oSVG);
        if (success) me.svgParasInit();

        me.initMaxMargin(me.getPage());  //因核章區調整，重新修正最大高

        //preview (createByParas) need paras to init
        me.setCreateParas({
            initParas: OA.common.Global.getInitParas(),
            wkContent: OA.common.Global.getCurrentWKContent(),
            domColors: OA.common.Global.getDomColors(),
            QueryDefault: OA.common.Global.getQueryDefault(),
            Role: OA.common.Global.getCurrentRole(),
            oSVG: oSVG,
            fields: fields,
            contactList: OA.common.Utils.getContactListTag(OA.common.Global.getCurrentWKContent()),
            xml: svg.svgCanvasToString(),
            size: { w: me.getPageWidth(), h: me.getMaxMargin() + me.getMarginBottom() },
            seal: {
                location: OA.common.DIMgr.getSealLocation(),
                h: OA.common.DIMgr.getSealHeight(),
                y: OA.common.DIMgr.getSealY()
            },
            barcode: me.getBarcode(),
            opinion: me.getSvgOpinion2(),
            Stamps: Ext.getStore('Stamps')
        });
        var templateUrl = (oSVG && oSVG.vm) ? oSVG.vm.templateUrl : '';

        /*
        if (mode == 'Normal' && ctrFormatType && qs.app !== 'genpages' && qs.action !== 'render') {
            if (wk && (wk.DocumentType == '簽' || wk.DocumentType == '便簽') &&
                (ctrFormatType.getPressedButtons()[0].getText() == '簽(含簽辦意見)' ||
                    ctrFormatType.getPressedButtons()[0].getText() == '便簽(含簽辦意見)')) {
                console.log(OA.common.Global.getWinOpener().getInitPreviewParas().opinion.xml);
                me.appendOpinion(OA.common.Global.getWinOpener().getInitPreviewParas().opinion.xml)
            }
        }*/
        // console.log(qs);

        if (!templateUrl) me.fireEvent('onCreateCompleted', me); //template need to createForm Completed

        if (callback) callback();

        // 讓便利貼自動縮放 - by yi chi chiu
        $('.sticky textarea').css("overflow", "hidden").bind("keydown keyup", function () {
            $(this).height('0px').height($(this).prop("scrollHeight") + "px");
        }).keydown();

        // 判斷已存檔功能 - by yi-chi chiu
        $('.sticky textarea').bind("input", function () {
            OA.app.isSavedFlag = false;
        });


    },
    createByPDF: function () {
        var me = this;
        me.setCreateParas({ //提供列印用
            initParas: OA.common.Global.getInitParas(),
            opinion: me.getSvgOpinion2()
        });
    },
    /**
     * 滙入及印列採參數創建
     */
    createByParas: function (paras, mode, callback) {
        //console.log(mode);
        var me = this;
        var qs = OA.common.Global.getQ();
        me.setPageFilter(null);
        me.setPreviewMode(mode);
        if (paras.initParas) OA.common.Global.setInitParas(paras.initParas);
        //載入附件及附件計數        
        if (paras.attachs) {
            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
            if (ctrWK) ctrWK.loadAttachs(paras.attachs);
        }
        //載入章戳
        if (paras.StampsData) {
            //console.log(paras.StampsData);
            var datas = [];
            Ext.Array.each(paras.StampsData.all, function (item) {
                //console.log(item);
                var data = { type: item.type, stamp: item.stamp };
                datas.push(data);
            });
            var Stamps = Ext.getStore('Stamps');
            if (Stamps) {
                Stamps.setData(null);
                Stamps.setData(datas);
            }
        }

        if (paras.wkContent) OA.common.Global.setCurrentWKContent(paras.wkContent);
        if (paras.oSVG && paras.oSVG.vm) OA.common.Global.setCurrentViewModel(paras.oSVG.vm);
        if (paras.domColors) OA.common.Global.setDomColors(paras.domColors);
        //核章區
        if (paras.seal) {
            OA.common.DIMgr.setSealLocation(paras.seal.location);
            OA.common.DIMgr.setSealHeight(paras.seal.h);
            OA.common.DIMgr.setSealY(paras.seal.y);
        }
        if (paras.vi) OA.common.VIMgr.setViContent(paras.vi);

        if (mode === 'Opinion') {
            me.create(paras.oSVG);
        } else {
            //開舊檔（表單）
            if (paras.oSVG && paras.oSVG.vm.templateUrl && paras.oSVG.vm.templateUrl.length > 0 && qs.package !== 'Y' && qs.app !== 'genpages') {
                OA.client.WK.loadTemplate(paras.oSVG.vm.templateUrl, function (xml) {
                    paras.oSVG.xml = xml;
                    me.createForm(paras.oSVG, paras.fields, callback);
                });
            } else {
                me.create(paras.oSVG, paras.fields, callback);
            }

            if (mode == 'Send' || mode == 'Send2') {
                if (qs.autoPrint && qs.autoPrint == 'Y') {
                    me.createCopies(mode, paras.cc, function () {
                        //自動列印
                        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                        if (ctrWK) ctrWK.showPrint();
                    });
                } else {
                    me.createCopies(mode, paras.cc);
                }
            } else {
                me.createCopies(mode, paras.cc);
            }
        }
    },
    print: function (initParas) {
        var me = this;

        OA.common.Paper.register(me);

        me.setReviseWidth(OA.common.DIMgr.getPageWidth());
        me.setPageWidth(initParas.size.w);
        me.setPageHeight(initParas.size.h);
        me.setSealHeight(OA.common.DIMgr.getSealHeight());
        me.setBarcodeHeight(OA.common.DIMgr.getBarcodeHeight());

        var svg = me.svgInit();
        var success = me.svgSetSource(initParas.oSVG);

        Ext.Viewport.setMasked(false);

        var win = require('electron').remote.getCurrentWindow();
        var crypto = require("crypto");
        var path = require('path');
        var fs = require('fs');

        var port = crypto.randomBytes(16).toString("hex");
        var fname = 'print-' + port + '.pdf';
        win.webContents.printToPDF({
            pageSize: 'A4',
            marginsType: 1, //no margin
            printBackground: false,
            printSelectionOnly: false,
            landscape: false
        }, function (error, data) {
            if (error) throw error;
            var fn = path.join('/Users/apple/Downloads/', fname);
            fs.writeFile(fn, data, function (error) {
                if (error) console.error(error);
                var msg = 'Write PDF ' + fname + ' successfully.';
                //console.log(msg);
                // win.close();
                // win.destroy();
            });
        });
        // me.updateSvgCanvas();  //視圖重刷
        // me.initMaxMargin(me.getPage());
        // me.fireEvent('onCreateCompleted', me);
        // if (callback) callback();
    },
    /**
     * 表單
     */
    createForm: function (options, fields, callback, osvgvm) {
        var me = this;
        var vm = osvgvm ? osvgvm : OA.common.Global.getCurrentViewModel();
        var wk = OA.common.Global.getCurrentWKContent();
        me.create(options, fields, function () {
            var svg = me.getSvgPaper();
            Ext.Array.each(fields, function (f) {
                var items = (f.group) ? vm[f.key] : [f];
                Ext.Array.each(items, function (item) {
                    var id = item.key;
                    if (item.onlyTitle) id = item.key + '_title';
                    var elem = svg.getElem(id);
                    if (elem) {
                        var text = vm[id] == undefined ? '' : vm[id] + '';
                        if (f.group) {
                            var find = vm[f.key].where("( el, i, res, param ) =>el.key=='" + item.key + "'")[0];
                            if (find) text = find.value;
                        }

                        if (item.key === '發文字號') {
                            //console.log(vm);
                            text = '（' + vm.發文字號_1 + '）';
                            if (vm.templateUrl) {
                                var changeSend = ['web/LINEMsgRecord.svg', 'web/SealCoverApply.svg'];
                                if (changeSend.indexOf(vm.templateUrl) != -1) {
                                    if (vm.發文文號 && vm.發文文號 != undefined)
                                        text = vm.發文文號;
                                }

                            }
                            if (wk) {
                                var items = OA.common.Utils.getDoSnoForWebsvg(wk);
                                if (items && items.length > 1) {
                                    if (items[1] && items[1].trim() !== '') {
                                        text = items[1];
                                    }
                                }
                            }
                        }

                        if (item.key == '電話' && text == '(電話：)') text = Ext.String.format('(電話：{0})', vm.承辦單位電話);

                        elem.textContent = text;

                        if (item.feature === 'center') {
                            var _x = ((me.getPageWidth() - me.getClientWidth(elem)) / 2);  // center
                            elem.setAttribute('x', _x);
                        }

                        me.elemInBoundary(item.key, elem);
                    }
                });
            });

            var docModelName = '', items = [];
            if (OA.client.WK.getCurrentModelName() && !osvgvm) {
                docModelName = OA.client.WK.getCurrentModelName().replace('OA.model.wk.', '');
            } else {
                var ctr = Ext.getCmp('ctnPreview');
                if (ctr) docModelName = KangDaAppConfig().FORMATS[ctr.getCurrentDoctype()].name;
            }

            if (docModelName === 'DraftVerify') { //簽核會核單
                items = (vm.受會單位) ? vm.受會單位.split('、') : [];
                me.doDraftVerify('受會單位', items);
            } else if (docModelName === 'MultiOgnUnit') {
                items = (vm.會辦機關) ? vm.會辦機關.split('、') : [];
                me.doDraftVerify('會辦機關', items);
            }

            me.fireEvent('onCreateCompleted', me);

            //列印預覽（簽稿會核單、會銜會辦單）
            if (callback) callback();
        });
    },
    /**
     * 建立複本及更新進階列印，受文者、正本、副本、抄本
     */
    createCopies: function (mode, items, callback) {
        var me = this;
        var wk = OA.common.Global.getCurrentWKContent();
        if (!items) return;
        if (items.length <= 0) {
            me.fireEvent('onCreateCopiesCompleted', { size: { w: me.getPageWidth() } });
            return;
        }
        var svg = me.getSvgPaper();
        if (!svg) return;
        var ratio = svg.getZoom();
        var cc = Ext.clone(items);
        var interval = me.getSvgPaper().getElem('canvas_interval_1');
        var h_interval = parseFloat(interval.getAttribute("height"));
        //處理第一個為本文部份
        var firstItem = cc.shift();

        //填值
        me.fillInCC(svg.getContentElem(), firstItem);
        //執行設定選項
        me.doOptionsCC(firstItem);
        //因受文者、正副本欄位被更新換行，需重新排列
        me.initMaxMargin(0);
        me.typesetting(null, true, true);
        me.updateSvgPage();

        //處理副本部份
        var gBackground = svg.getContentElem().querySelector('.gBackground');
        var gContent = svg.getContentElem().querySelector('.gContent');

        gBackground.style.visibility = 'hidden';
        gContent.style.visibility = 'hidden';

        //列印因流覧器修正高
        var padding = OA.common.DIMgr.revisePrint({
            page: me.getPage(),
            maxMargin: me.getMaxMargin(),
            marginBottom: me.getMarginBottom()
        }).heightWithPadding;

        //TODO:雙面列印，單數頁，要多補一頁空白
        //雙面列印，（一文多發、分址分文），總頁數為奇數頁，要增加一頁空白
        // var checkDuplex = document.querySelector('#checkDuplex');
        // padding = padding +  OA.common.DIMgr.getPageHeight();
        var isDuplexPush = false;
        var ctr = Ext.getCmp('ctnPreview');
        var checkDuplex = document.querySelector('#checkDuplex');
        if (ctr) {
            if (['Multiple', 'Divide', 'General', 'Send', 'Send2'].indexOf(ctr.getPreviewMode()) >= 0) {
                //是否為奇數頁
                var num = 1;
                var isDo = false;
                do {
                    isDo = gBackground.querySelector('#canvas_page_' + num);
                    if (isDo) num = num + 1;
                } while (isDo);
                if ((num - 1) % 2 != 0)
                    isDuplexPush = true;
            }
        }
        Ext.Array.each(cc, function (item, idx) {
            if (isDuplexPush) {
                if (checkDuplex.check == undefined) {
                    if (checkDuplex.checked)
                        padding = padding + OA.common.DIMgr.getPageHeight() + h_interval;
                } else {
                    if (checkDuplex.check)
                        padding = padding + OA.common.DIMgr.getPageHeight() + h_interval
                }
            }
            var gBackgroundCopy = gBackground.cloneNode(true);
            gBackgroundCopy.style.visibility = 'hidden';
            var typeMark = gBackgroundCopy.querySelector('#canvas_typeMark');
            if (typeMark && wk && wk.DocumentType !== '開會通知單') {
                if (item.key) {
                    var s1 = item.key.substring(0, 1);
                    var s2 = item.key.substring(1, 2);
                    typeMark.style.opacity = '1';
                    typeMark.textContent = s1 + '　' + s2;
                }
            }
            //騎縫章，不同受文者重新產一組位置騎縫章
            var pageHeight = me.getPageHeight();
            var pageWidth = me.getPageWidth();
            var random = Math.floor(Math.random() * 100000000).toString();
            var groupCount = 5;
            var iSum = 0;
            if (random && random.length > 0) {
                for (var i = 0; i < random.length; i++) {
                    iSum += parseInt(random[i]);
                }
            }
            if (iSum > groupCount) iSum = iSum % groupCount;
            var sHeight = pageHeight * 1 / 4;

            switch (iSum) {
                case 1:
                    sHeight = pageHeight * 1 / 3;
                    break;
                case 2:
                    sHeight = pageHeight * 1 / 2;
                    break;
                case 3:
                    sHeight = pageHeight - (pageHeight * 1 / 3);
                    break;
                case 4:
                    sHeight = pageHeight - (pageHeight * 1 / 4);
                    break;
            }

            //左
            var sealH = sHeight + pageHeight;
            var canvas_pagingSeal_0 = gBackgroundCopy.querySelector('#canvas_pagingSeal_0');
            if (canvas_pagingSeal_0) {
                var imageSeal_0 = canvas_pagingSeal_0.querySelector('#imageSeal_0');
                if (imageSeal_0) {
                    var imageSeal_0_y = imageSeal_0.getAttribute('y');
                    if (imageSeal_0_y) {
                        var tranSeal = Ext.String.format('translate({0},{1})', 0, sealH - imageSeal_0_y);
                        canvas_pagingSeal_0.setAttribute("transform", tranSeal);
                    }
                }
            }
            //右
            sealH = sHeight;
            var canvas_pagingSeal_1 = gBackgroundCopy.querySelector('#canvas_pagingSeal_1');
            if (canvas_pagingSeal_1) {
                var imageSeal_1 = canvas_pagingSeal_1.querySelector('#imageSeal_1');
                if (imageSeal_1) {
                    var imageSeal_1_y = imageSeal_1.getAttribute('y')
                    if (imageSeal_1_y) {
                        var tranSeal = Ext.String.format('translate({0},{1})', 0, sealH - imageSeal_1_y);
                        canvas_pagingSeal_1.setAttribute("transform", tranSeal);
                    }
                }
            }

            //因原稿已有background , 將複本background 隱藏
            var b = gBackgroundCopy.querySelector('#canvas_background');
            if (b) b.setAttribute('height', '0');
            gBackground.parentNode.insertBefore(gBackgroundCopy, gBackground.nextSibling);

            var gContentCopy = gContent.cloneNode(true);
            gContentCopy.style.visibility = 'hidden';
            me.fillInCC(gContentCopy, item);
            gContent.parentNode.insertBefore(gContentCopy, gContent.nextSibling);

            //有換頁換行時，應修正原class ,才可以做排版
            var overs = gContentCopy.querySelectorAll("text[class*='_over']");
            Ext.Array.each(overs, function (el) {
                el.setAttribute("class", el.getAttribute('class').replace('_over', ''));
                var tspans = el.querySelectorAll('tspan');
                Ext.Array.each(tspans, function (tspan) {
                    var dy = parseFloat(tspan.getAttribute('dy'));
                    if (dy > 27) tspan.setAttribute("dy", '27');
                });
            });

            me.initMaxMargin(0);
            me.typesetting(gContentCopy, true, true);
            me.updateSvgPage(gBackgroundCopy);

            gBackgroundCopy.setAttribute("class", 'gBackground g' + (idx + 2));
            gContentCopy.setAttribute("class", 'gContent g' + (idx + 2));

            var tl = 'translate(0,' + padding + ')';

            padding = padding + OA.common.DIMgr.revisePrint({
                page: me.getPage(),
                maxMargin: me.getMaxMargin(),
                marginBottom: me.getMarginBottom()
            }).heightWithPadding;

            gBackgroundCopy.setAttribute("transform", tl);
            gContentCopy.setAttribute("transform", tl);

            gBackgroundCopy.style.visibility = 'visible';
            gContentCopy.style.visibility = 'visible';
        });
        gBackground.style.visibility = 'visible';
        gContent.style.visibility = 'visible';

        //重新修正文稿高
        svg.updateCanvas(me.getPageWidth() * ratio, padding * ratio);
        me.fireEvent('onCreateCopiesCompleted', { size: { w: me.getPageWidth(), h: padding } });
        if (callback) callback();
    },
    /**
     * 附意見
     */
    appendOpinion: function (xmlString) {
        var me = this;
        var svg = me.getSvgPaper();
        if (!svg) return;
        var ratio = svg.getZoom();
        var last = me.getMaxMargin() + this.getMarginBottom();
        me.addPaging();
        var newDoc = svgedit.utilities.text2xml(xmlString);
        newDoc.documentElement.getElementsByClassName('gBackground g1')[0].remove()
        var svgcontent = utilInitParas.getDOMDocument().importNode(newDoc.documentElement, true);
        svgcontent.setAttribute('y', last);
        svg.getContentElem().appendChild(svgcontent);

        var gContent = svgcontent.querySelector('.gContent');
        me.layoutOpinions(gContent);

        var padding = OA.common.DIMgr.revisePrint({
            page: me.getPage(),
            maxMargin: me.getMaxMargin(),
            marginBottom: me.getMarginBottom()
        }).heightWithPadding;
        padding = padding + 1000;

        svg.getRootElem().setAttribute('height', padding * ratio);
    },
    fillInCC: function (gContentElem, item) {
        //console.log(item);
        var qs = OA.common.Global.getQ();
        var me = this;
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        if (item.attention != undefined) {
            if (gContentElem.querySelector('#受文者郵遞區號_title'))
                gContentElem.querySelector('#受文者郵遞區號_title').textContent = item.arceno;
            if (gContentElem.querySelector('#受文者地址_title'))
                gContentElem.querySelector('#受文者地址_title').textContent = item.addr;
            me.updateWrapElem(gContentElem, '受文者', item.attention);
        }

        //副本不含附件清除大型附件附件URL
        var att = gContentElem.querySelector('#附件');
        if (att) {
            var isCopyWithoutAttach = item.key === '副本' && item.attach !== 'Y';
            var isTranscriptWithoutAttach = item.key === '抄本' && item.attach !== 'Y';
            if (isCopyWithoutAttach || isTranscriptWithoutAttach) {
                if (qs && qs.hasBig === 'Y')
                    att.textContent = '';
            }
        }

        //列印本別標記
        var typeMark = gContentElem.querySelector('#canvas_typeMark');
        if (typeMark && wk && wk.DocumentType !== '開會通知單') {
            if (item.key) {
                var s1 = item.key.substring(0, 1);
                var s2 = item.key.substring(1, 2);
                typeMark.style.opacity = '1';
                typeMark.textContent = s1 + '　' + s2;
            }
        }

        if (item.original != undefined) me.updateWrapElem(gContentElem, '正本', item.original);
        if (item.duplicate != undefined) me.updateWrapElem(gContentElem, '副本', item.duplicate);
        if (item.preside != undefined) me.updateWrapElem(gContentElem, '主持人', item.preside);
        if (item.attendant != undefined) me.updateWrapElem(gContentElem, '出席者', item.attendant);
        if (item.nonvoting != undefined) me.updateWrapElem(gContentElem, '列席者', item.nonvoting);
        if (item.transcript != undefined) me.updateWrapElem(gContentElem, '抄本', item.transcript);
        if (item.docno != undefined && gContentElem.querySelector('#發文字號_1')) {
            gContentElem.querySelector('#發文字號_1').textContent = item.docno;
        }

        //先還原之前套印的變數
        if (me.getKeepVarable().length > 0) {
            Ext.Array.each(me.getKeepVarable(), function (keep) {
                var textItems = gContentElem.querySelectorAll('text');
                if (textItems) {
                    Ext.Array.each(textItems, function (text) {
                        if (text.id == keep.id) {
                            text.textContent = keep.text;
                        }
                    });
                }
            });
            me.setVarableIndex(0);
            me.setKeepVarable([]);
        }

        //套印變數
        if (vm && vm.KDRichTextBlockList) {
            var KDRBtextList = []
            Ext.Array.each(vm.KDRichTextBlockList, function (KDRb) {
                KDRBtextList.push(KDRb.id + '_context');
            });
            if (KDRBtextList.length > 0) {
                if (item.variable && item.variable.length > 0) {
                    var variable = JSON.parse(item.variable);
                    var textItems = gContentElem.querySelectorAll('text');
                    //console.log(textItems);
                    if (textItems && textItems.length > 0) {
                        if (me.getVarableIndex() == 0) {
                            Ext.Array.each(KDRBtextList, function (kdrId) {
                                //console.log(kdrId);
                                var text = undefined;
                                Ext.Array.each(textItems, function (item) {
                                    if (item.id == kdrId) {
                                        text = item;
                                    }
                                });
                                //var text = textItems.where("( el, i, res, param ) => el.tagName=='Grid'")
                                //console.log(text);
                                if (text && text != undefined) {
                                    Ext.Array.each(variable, function (item) {
                                        var r = text.textContent.indexOf(item.variable);
                                        if (r >= 0) {
                                            var doPush = true;
                                            Ext.Array.each(me.getKeepVarable(), function (varable) {
                                                if (varable.id == text.id) {
                                                    doPush = false;
                                                    return false;
                                                }
                                            });
                                            if (doPush) {
                                                me.getKeepVarable().push(
                                                    {
                                                        id: text.id,
                                                        text: Ext.clone(text.textContent)
                                                    });
                                            }
                                            text.textContent = text.textContent.replace(item.variable, item.actual);
                                        }
                                    });
                                    //console.log(text.textContent);
                                    var text_x = text.getAttribute("x");
                                    var text_y = text.getAttribute("y");
                                    var follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - text_x;
                                    el_new = me.setWrap(text, text_x, text_y, follow_boxWidth);
                                    //console.log(el_new);
                                    me.removeCanvasElem(text);
                                }
                            });
                        }
                        if (me.getKeepVarable().length > 0) {
                            var index = me.getVarableIndex();
                            me.setVarableIndex(++index);
                        }
                    }
                }
            }
        }
    },
    doOptionsCC: function (item) {
        //console.log(item);
        var me = this;
        var svg = me.getSvgPaper();

        //署名顯示
        var elemNames = svg.getElem('署名');
        if (elemNames) {
            if (!item.names) {
                elemNames.style.visibility = 'hidden';
                //elemNames.parentNode.removeChild(elemNames);
            }
        }


        elemNames = svg.getElem('署名_1');
        if (elemNames) {
            if (!item.names) {
                var i = 1;
                do {
                    elemNames = svg.getElem('署名_' + i);
                    if (elemNames) {
                        elemNames.style.visibility = 'hidden';
                        //elemNames.parentNode.removeChild(elemNames);
                    }
                    i++;
                } while (elemNames)
            }
        }

        var elemNamesTitle = svg.getElem('署名_title');
        if (elemNamesTitle) {
            if (!item.names) {
                elemNamesTitle.style.visibility = 'hidden';
                //elemNamesTitle.parentNode.removeChild(elemNamesTitle);
            }
        }

        //身份證遮罩
        if (item.card) this.cardMask(true);

        //分層負責
        var elemLV = svg.getElem('分層負責_title');
        if (elemLV) {
            if (!item.level)
                elemLV.parentNode.removeChild(elemLV);
        }

        //地址及郵遞區號
        if (item.address) {
            var elemAddrNo = svg.getElem('受文者郵遞區號_title');
            elemAddrNo.parentNode.removeChild(elemAddrNo);
            var elemAddr = svg.getElem('受文者地址_title');
            elemAddr.parentNode.removeChild(elemAddr);
        }
    },

    /**
     * 滙入XML
     */
    importXML: function (xml, format, options) {
        var me = this;
        var ret = '';
        var mode = '';
        if (options) mode = options.mode;

        if (format == 'di') {
            /*
            //format
            var idxDoctypeStart = xml.indexOf('<!DOCTYPE') + 9;
            var idxDoctypeEnd = xml.indexOf('SYSTEM') - 1;
            var qFormat = xml.substring(idxDoctypeStart, idxDoctypeEnd);
            */
            //xdi
            var idx;
            if (xml.indexOf(']>') >= 0) {
                idx = xml.indexOf(']>') + 2;
            } else if (xml.indexOf('.dtd') >= 0) {
                idx = xml.indexOf('.dtd') + 6;
            }
            xml = xml.substring(idx);
            OA.common.FileMgr.noServiSignDoImport(xml);
            return;
        } else if (format == 'bin') {
            ret = OA.common.DIMgr.ImportBin(xml);
        } else if (format == 'silverlight') {
            ret = OA.common.DIMgr.ImportSL(xml, mode);
        }

        if (options) ret['cc'] = options.cc;
        me.createByParas(ret, mode);
    },

    /**
     * svg 初始化  , 註冊事件
     */
    svgInit: function () {
        var me = this;
        var qs = OA.common.Global.getQ();
        var container = me.down('container');
        var backId = container.id.substring(container.id.length - 1);
        if (me.id === 'cpaper') {
            backId = '';
            var svg = this.getSvgPaper();
            if (svg != null) return svg;
        }

        var svgcanvasElem = this.element.down("#svgcanvas" + backId);
        if (svgcanvasElem) container.setHtml('');

        var divs = [];

        divs.push('<div id="workarea' + backId + '">');
        divs.push('<div id="svgcanvas' + backId + '"></div>');

        if (me.id === 'cpaper') {
            divs.push('<input id="text" type="text" size="100" class="virtualInput" />');
            //divs.push('<input id="textRange" type="text" size="100" class="virtualInputRange" />');
            divs.push('<img id="barcodeSrc" style="visibility:hidden">');
        }
        divs.push('</div>');
        container.setHtml(divs.join(''));

        var commonContextMenuItems = {
            "cut": { name: "剪下", icon: "cut" },
            "copy": { name: "複製", icon: "copy" },
            "copyAll": { name: "全文複製", icon: "copy" },
            "paste": { name: "貼上", icon: "paste" }
        }
        $.contextMenu({
            selector: '#workarea',
            callback: function (key, options) {
                me.executeAction(key);
            },
            items: commonContextMenuItems
        });
        $.contextMenu({
            selector: 'textarea , input',
            callback: function (key, options) {
                $(this).focus();
                switch (key) {
                    case 'cut':
                        // 右鍵剪貼簿補全功能 - by yi-chi chiu
                        document.execCommand("Cut");
                        var clipboard = document.querySelector('#clipboardtextarea');
                        if (!clipboard) {
                            clipboard = document.createElement("textarea");
                            clipboard.id = 'clipboardtextarea';
                            clipboard.style.position = "fixed";
                            // Prevent scrolling to bottom of page in MS Edge.
                            document.body.appendChild(clipboard);
                        }
                        clipboard.value = window.getSelection();
                        break;
                    case 'copy':
                        // 右鍵剪貼簿補全功能 - by yi-chi chiu
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
                        break;
                    case 'paste':
                        // 右鍵剪貼簿補全功能 - by yi-chi chiu                  
                        navigator.clipboard.readText()
                            .then(text => {
                                //console.log('Pasted content: ', text);
                                // document.activeElement.innerHTML = document.activeElement.innerHTML.slice(0, document.activeElement.selectionStart - 1) + text + document.activeElement.innerHTML.slice(document.activeElement.selectionEnd);
                                // document.activeElement.value =  document.activeElement.value.slice(0, document.activeElement.selectionStart - 1) + text + document.activeElement.value.slice(document.activeElement.selectionEnd);
                                // 有時候會貼上兩次，先註解
                                // document.activeElement.innerHTML = document.activeElement.innerHTML.replace(window.getSelection(), text);

                                //增加判斷是否是在意見欄
                                if (me.getIsSuggestionIn()) {
                                    var suggestiontext = Ext.getCmp('suggestionText');
                                    if (suggestiontext) {
                                        var textarea = suggestiontext.getComponent().input.dom;
                                        if (textarea) {
                                            var prefixStr = textarea.value.substring(0, textarea.selectionStart);
                                            var suffixStr = textarea.value.substring(textarea.selectionEnd);
                                            textarea.value = prefixStr + text + suffixStr;
                                            textarea.selectionStart = prefixStr.length + text.length;
                                            textarea.selectionEnd = prefixStr.length + + text.length;
                                            textarea.focus();
                                        }
                                    }
                                } else {
                                    //增加判斷是否為便利貼
                                    if (document.activeElement && document.activeElement.offsetParent && document.activeElement.offsetParent.id.indexOf('-stricky') != -1) {
                                        var prefixStr = document.activeElement.value.substring(0, document.activeElement.selectionStart);
                                        var suffixStr = document.activeElement.value.substring(document.activeElement.selectionEnd);
                                        document.activeElement.value = prefixStr + text + suffixStr;
                                        document.activeElement.selectionStart = prefixStr.length + text.length;
                                        document.activeElement.selectionEnd = prefixStr.length + text.length;
                                    } else {
                                        document.activeElement.value = document.activeElement.value.replace(window.getSelection(), text);
                                    }
                                }
                            }).catch(err => {
                                document.execCommand("Paste");
                                console.error('Failed to read clipboard contents: ', err);
                            });
                        // document.execCommand("Paste");
                        break;
                }
                // me.executeAction(key,  $(this)[0].id);
            },
            items: commonContextMenuItems
        });

        //svgCanvas Init
        var dom = this.element.down("#svgcanvas" + backId).dom;

        var svgCfg = this.getsvgConfig(me.getReviseWidth(), me.getPageHeight());
        svgCfg.backId = backId;
        svg = new $.SvgCanvas(dom, svgCfg);
        svg.setMode('touch');

        if (me.id !== 'cpaper') {
            this.setSvgPaper(svg);
            return svg;
        }

        var selectedElement = null;
        var selectedRect = null;
        var multiselected = false;
        var $text = $("#text");
        //var $textRange = $("#textRange");

        var selection;

        //events init
        var selectedChanged = function (window, elems) {
            // if elems[1] is present, then we have more than one element
            selectedElement = (elems.length == 1 || elems[1] == null ? elems[0] : null);
            elems = elems.filter(Boolean);
            multiselected = (elems.length >= 2) ? elems : false;
            if (svg.getMode() == 'textedit') return;
            if (elems.length == 0) return;
            if (svg.elementsAreSame(multiselected)) selectedElement = multiselected[0];

            if (selectedElement == null) return;

            svg.runExtensions("selectedChanged", {
                elems: elems,
                selectedElement: selectedElement,
                multiselected: multiselected
            });

            me.setCountLine(selectedElement.querySelectorAll('tspan[dy]:not([dy=""])').length);
            me.setSelectedElement(selectedElement);

            //換頁編輯狀態
            var turns = selectedElement.querySelectorAll('.turn');
            if (turns.length > 0) me.setIsEditingPagging(true);

            me.editingPagging();  //處理換頁編輯時

            selectedRect = selectedElement.getBBox();
            var currentY = 0.0;
            if (selectedRect.y == 0) {
                currentY = parseFloat(selectedElement.getAttribute('y'));
            } else {
                //會影響輸入時位移計算，行距改變後要重新調整乘數 lien.chiu 2019.03.15
                //currentY = parseFloat(selectedRect.y - (me.getWorkHeight() * 0.007875));
                currentY = parseFloat(selectedRect.y - (me.getWorkHeight() * 0.0137));
            }
            me.setCurrentX(parseFloat(selectedElement.getAttribute('x')));
            me.setCurrentY(currentY);

            // OA.common.Utils.testBlueVLine('s1', selectedRect.x, 'blue');

            //virtual input focus and keyboard is fire
            $text.css({
                'top': (selectedRect.y * me.getRatio()) + 20, 'left': selectedRect.x, position: 'absolute'
            });

            var textContent = selectedElement.textContent;

            //edit by job 20190315 checking for 便簽
            var paras = OA.common.Global.getInitParas();
            if (textContent.substring(0, 1) == '\u3000' || textContent.substring(0, 1) == ' ') {
                if ((textContent.trim() != "" && paras.documentType == "A4空白簽" || paras.documentType == "令" || paras.documentType == "簡簽" ||
                    paras.documentType == "受文者令" || paras.documentType == "代辦處令" || paras.documentType == "便箋" ||
                    paras.documentType == "會銜令" || paras.documentType == "會銜受文者令") && selectedElement.id == "KDRichTextBlock_1_context") {
                    //console.log("noneed to remove space");
                } else if (paras.documentType == "受文者令" || paras.documentType == "會銜令" || paras.documentType == "會銜受文者令"
                ) {
                    // 令所有行都要套用規則(留空白) - by yi-chi chiu
                    // console.log("noneed to remove space");
                } else {
                    textContent = textContent.substring(1);
                    me.setCountLine(1);
                }
            }

            $text.val(textContent); //default value
            me.setImeOldIValue(textContent);

            //行動編輯時，將移至最上好放keyboard
            if (!Ext.os.is('Desktop')) {
                var ctr = me.up('ctnPaper').getScrollable().getScroller();
                ctr.scrollTo(0, currentY - 100);
            }
        };
        var texteditChanged = function (win, target) {
            // console.log('texteditChanged target.tagName=' +target.tagName);
            var ctr = me.getParent();
            var isRefresh = target.tagName === 'svg' || (target.tagName === 'text' && !me.getIsClearPaper());
            if (isRefresh) {
                svg.textActions.toSelectMode();
                me.pensClear();
                me.svgUpdateLayout();  //文字重排
            }

            if (qs.app === "approve" || qs.app === "editor" || qs.app === "draft" ||
                qs.app === "check" || qs.app === "async") {
                me.removeSvgPage();
            } else {
                if (isRefresh) me.updateSvgCanvas(); //視圖重刷
            }

            me.setIsEditingPagging(false);
            me.setExtendTextContent('');
            me.editingPagging();
        };
        var fieldSelected = function (win, context) {
            var id = context.getAttribute("id");
            var cls = context.getAttribute("class");
            if (context.tagName == 'tspan') {
                id = context.parentNode.getAttribute("id");
                cls = context.parentNode.getAttribute("class");
            }
            var key = id.split('_')[0];
            var modelName = OA.client.WK.getCurrentModelName();
            if (modelName.indexOf('SealMakeReplace') >= 0) {
                OA.common.Fields.popupFromGrid({ by: 'FormSealApprovalsGrid', key: key });
                return;
            }

            var isKDRichTextBlock = (id) ? id.indexOf('KDRichTextBlock') >= 0 : false;
            //if (modelName.indexOf('MayorNote') >= 0 || modelName.indexOf('Petition') >= 0) {
            //    if (isKDRichTextBlock) key = id;
            //    OA.common.Fields.popupFromShow(key);
            //    return;
            //}
            if (isKDRichTextBlock && context.nextSibling) {
                me.elemReload(context.nextSibling);
                svg.textActions.setCursor(0);
                return;
            }
            var isContact = (cls) ? cls.indexOf('contact') >= 0 : false;
            if (isContact) key = OA.common.Fields.Enum.FormContact;
            OA.common.Fields.popupFromShow(key);
        };

        // bind the selected event to our function that handles updates to the UI
        svg.bind("selected", selectedChanged);
        svg.bind("texteditMouseUp", texteditChanged);
        svg.bind("fieldSelected", fieldSelected);
        svg.bind("tspanMousedown", function (win, target) {
            me.setSelectedTspan(target);
            selection = null;
            me.setIsSuggestionIn(false);
        });

        svg.bind("selection", function (window, skipInput) {
            if (me.getIsIME()) return;

            var isSelection = $text[0].selectionEnd - $text[0].selectionStart > 0;
            if (isSelection) {
                //console.log(window);
                selection = {
                    start: $text[0].selectionStart,
                    end: $text[0].selectionEnd,
                    value: window.getSelection().toString(),
                    full: $text[0].value
                }
            }
            var ctr = me.getParent().getScrollable();
            if (ctr) ctr.getScroller().setDisabled(skipInput);
        });
        svg.textActions.setInputElem($text[0]);

        var doSelectionInput = function (value) {

            if (me.getIsIME()) return;

            var _input = {
                selectedElement: selectedElement,
                selectionStart: selection.start,
                selectionEnd: selection.end,
                value: selection.full,
                cursorPos: selection.end
            }
            me.editActions().strike(_input);

            var s1 = value.slice(0, selection.start);
            var s2 = selection.value;
            var s3 = value.slice(selection.start);

            var output = [s1, s2, s3].join('');

            var count = output.length - me.getImeOldIValue().length;
            _input = {
                selectedElement: selectedElement,
                selectionStart: selection.end + count,
                selectionEnd: selection.end + count,
                value: output,
                cursorPos: selection.end + count
            }

            me.editActions().input(output, _input);
        }
        //IME
        $text.on('compositionstart', function () {
            me.setImeOldIValue(selectedElement.textContent);
            me.setIsIME(true);
        }).on('compositionend', function () {
            me.setIsIME(false);
            var value = this.value;

            if (selection && !me.getIsClearPaper()) {
                doSelectionInput(value);
                return;
            }

            if (me.getIsLockPaper()) return;

            me.editActions().input(value);
        }).on('compositionupdate', function () {
            me.setIsIME(true);
        });

        $text.on('input', function (e) {
            if (!selectedElement || me.getIsLockPaper()) return false;
            me.setSelectedElement(selectedElement);
            var value = this.value;
            if (value.length == 0) value = '　';

            if (selection && !me.getIsClearPaper()) {
                doSelectionInput(value);
                return;
            }

            //me.editActions().input(value);
            if (me.getPasteStates() == 1) {
                var result = me.removeRedundantSpace(value);  //處理空白
                me.editActions().input(result);
                me.setPasteStates(0);
            } else {
                me.editActions().input(value);
            }
        });
        var textKeys = {};
        $text.keyup(function (e) {
            if (me.getIsIME()) svg.textActions.setIMECursor();
            delete textKeys[e.which];
            if (me.getIsIME()) return;
            selection = null;
            if (!selectedElement) {
                return false;
            } else {
                if (selectedElement.nextSibling == null ||
                    selectedElement.previousSibling == null) {
                    selectedElement = document.querySelector('#' + selectedElement.getAttribute('id'));
                }
            }
            svg.textActions.setCursor();
        });

        //$text.on('focus',function (e) {
        //    var ctr = me.up('ctnPaper').getScrollable().getScroller();
        //    if (selectedElement) {

        //        var scroller = me.up('ctnPaper').getScrollable().getScroller();
        //        if (scroller) {
        //            var size = scroller.getSize();
        //            if (size && size.y) {
        //                if (me.getOldScrollerY() == 0) {
        //                    me.setOldScrollerY(size.y);
        //                } else {
        //                    if (me.getOldScrollerY() !== size.y) {
        //                        ctr.scrollTo(0, (me.getCurrentY() * me.getRatio()) - 150);
        //                        me.setOldScrollerY(size.y);
        //                    }
        //                }
        //            }
        //        }              
        //    }
        //});

        var hotkey = key.noConflict();
        hotkey.filter = function (event) {
            if (me.getIsLockPaper()) {
                return false;
            } else {
                return (event.target.id === 'text');  //只有文稿虛擬鍵盤可以用
            }
        }
        hotkey('⌘+c, ctrl+c', function (event, handler) {
            try {
                me.executeAction('copy');
            } catch (err) {
                console.log('error: ' + err.message);
            }
            return false;
        });
        hotkey('⌘+v, ctrl+v', function (event, handler) {
            me.setPasteStates(1);
            //try {
            //    me.executeAction('paste',null,event);
            //} catch (err) {
            //    console.log('error: ' + err.message);
            //}
            //return false;
        });
        // hotkey('⌘+x, ctrl+x', function (event, handler) {
        //     try {
        //         me.executeAction('cut');
        //     } catch (err) {
        //         console.log('error: ' + err.message);
        //     }
        //     return false;
        // });
        hotkey('⌘+z, ctrl+z', function (event, handler) {
            me.executeAction('undo');
            //try {
            //    me.executeAction('undo');
            //} catch (err) {
            //    console.log('error: ' + err.message);
            //}
            return false;
        });
        hotkey('⌘+shift+z, ctrl+y', function (event, handler) {
            var oldValue = event.target.value;
            var newValue = event.target.value;
            if (oldValue == newValue) me.executeAction('redo');
            //try {
            //    var oldValue = event.target.value;
            //    var newValue = event.target.value;
            //    if (oldValue == newValue) me.executeAction('redo');
            //} catch (err) {
            //    console.log('error: ' + err.message);
            //}
            return false;
        });
        hotkey('⌘+a, ctrl+a', function (event, handler) {
            document.execCommand("SelectAll");
            return false;
        });
        hotkey('up', function (event, handler) {
            me.editActions().up();
            return false;
        });
        hotkey('down', function (event, handler) {
            me.editActions().down();
            return false;
        });
        hotkey('enter', function (event, handler) {
            me.editActions().turnLine(event.target.selectionStart);
            return false;
        });
        hotkey('backspace', function (event, handler) {
            var hasFirstSpace = $text[0].value.trim().length == 0;
            var isFirst = event.target.selectionStart == 0 && event.target.selectionEnd == 0;
            // 令要留空白，有空白不刪行 - by yi-chi chiu
            if (isFirst || (hasFirstSpace && OA.common.Global.getCurrentWKContent().DocumentType !== '令' &&
                OA.common.Global.getCurrentWKContent().DocumentType !== '受文者令' &&
                OA.common.Global.getCurrentWKContent().DocumentType !== '代辦處令' &&
                OA.common.Global.getCurrentWKContent().DocumentType !== '會銜令' &&
                OA.common.Global.getCurrentWKContent().DocumentType !== '會銜受文者令')) {
                event.preventDefault();
                me.editActions().deleteLine();
                return true;
            }
            if (me.getIsClearPaper()) return true;
            me.editActions().strike();
            return false;
        });
        hotkey('ctrl+d,del,delete', function (event, handler) {
            // 修正選取文字時按下delete時動作異常的問題 - by yi-chi chiu
            var isCtrlD = handler.key.toUpperCase() == 'CTRL+D';
            // 修正造成刪除線一次刪兩個字的BUG  - by yi-chi chiu
            // var isDel = handler.key.toUpperCase() == 'DEL';
            //  if (event.key.toUpperCase() == handler.key.toUpperCase() || isCtrlD || isDel) {
            if (event.key.toUpperCase() == handler.key.toUpperCase() || isCtrlD) {
                var isBullet = selectedElement.getAttribute('class').indexOf('indent') >= 0;
                if (isBullet) {
                    return false;
                }

                var hasFirstSpace = $text[0].value.trim().length == 0;
                var islast = $text[0].value.length == event.target.selectionEnd;
                // 修正反白全部刪除無效的異常 -> 修正游標在最後的時候無法斷行問題 - by yi-chi chiu
                //  var isSelectedFullContent = $text[0].value.trim().length == (event.target.selectionEnd - event.target.selectionStart) && islast && event.target.selectionStart == 0;
                if ((islast && (event.target.selectionEnd - event.target.selectionStart) == 0) || hasFirstSpace) {
                    // if (islast || hasFirstSpace) {
                    event.preventDefault();
                    me.editActions().down();
                    $text[0].selectionStart = 0;
                    me.editActions().deleteLine();
                    return true;
                }
                if (me.getIsClearPaper()) {
                    return true;
                }

                var isNotSelection = event.target.selectionStart == event.target.selectionEnd;
                var oldLength = Ext.clone($text[0].value).replace(/\s+$/g, "").length;
                if (isNotSelection) {
                    $text[0].selectionStart = $text[0].selectionStart + 1;
                }

                me.editActions().strike();
                var newLength = Ext.clone($text[0].value).replace(/\s+$/g, "").length;
                if (newLength == oldLength && isNotSelection) {
                    $text[0].selectionStart = $text[0].selectionStart + 1;
                }

                return false;
            }
        });
        svg.bind("historyCommand", function (eventType, cmd) {
            me.editActions(true).execute(cmd);  //復原及重做
        });

        this.setSvgPaper(svg);
        return svg;
    },
    /**
     * 處理換頁編輯時
     */
    editingPagging: function () {
        var me = this;

        //採用暫時隱藏核章區
        var isSealShow = (me.getIsEditingPagging()) ? '0.1' : '1';
        var svg = this.getSvgPaper();
        var elemSeal = svg.getElem('gSeal');
        var elemUnitTitle = svg.getElem('會辦單位_title');
        var elemUnit = svg.getElem('會辦單位');
        var elemLV = svg.getElem('決行層級_title');

        //頁碼
        var elemPages = svg.getContentElem().querySelectorAll('.canvasPage');
        var elemBarcode = svg.getElem('barcode');
        if (elemPages) {
            Ext.Array.each(elemPages, function (elemPage) {
                elemPage.setAttribute('opacity', isSealShow);
            })
        }
        if (elemBarcode) elemBarcode.setAttribute('opacity', isSealShow);

        var elemPageIntervals = svg.getContentElem().querySelectorAll('.pageInterval');
        if (elemPageIntervals) {
            Ext.Array.each(elemPageIntervals, function (elemInterval) {
                elemInterval.setAttribute('opacity', isSealShow);
            })
        }


        //簽章時，不使用核章欄
        var qs = OA.common.Global.getQ();

        if (!OA.common.Global.getVerifyConfig()) return;

        var isNotShow = OA.common.Global.getVerifyConfig().hasSealArea == false;
        if (qs.app === 'approve' && isNotShow) isSealShow = 0;

        //非紙本簽核不顯示核章欄
        //if (qs.epaper !== 'N') isSealShow = 0;
        isSealShow = OA.common.Utils.checkEpaper() ? 0 : 1;
        isSealShow = 1; //林務局先預設開啟
        if (elemSeal) {
            var strStyle = (isSealShow == 0) ? 'none' : 'initial';
            if (elemSeal) elemSeal.style.display = strStyle;
            if (elemUnitTitle) elemUnitTitle.style.display = strStyle;
            if (elemUnit) elemUnit.style.display = strStyle;
            if (elemLV) elemLV.style.display = strStyle;

            //會擋到追修操作
            // if (elemSeal) elemSeal.setAttribute('opacity', isSealShow);
            // if (elemUnitTitle) elemUnitTitle.setAttribute('opacity', isSealShow);
            // if (elemUnit) elemUnit.setAttribute('opacity', isSealShow);
            // if (elemLV) elemLV.setAttribute('opacity', isSealShow);
        }

        //採用分離方弍
        // var selectedElement = me.getSelectedElement();
        // if (!me.getIsEditingPagging()) return;
        // var index = [].indexOf.call(selectedElement.childNodes, turns[0]);
        // var count = selectedElement.childNodes.length - index + 1;
        // var wrapping_over = selectedElement.cloneNode(true);
        //
        // var _y = parseFloat(selectedElement.getAttribute('y')) + parseFloat(turns[0].getAttribute('dy'));
        // while (wrapping_over.childNodes.length >= count) {
        //     var _dy = wrapping_over.firstChild.getAttribute('dy');
        //     if (_dy) _y = _y + parseFloat(_dy);
        //
        //     wrapping_over.removeChild(wrapping_over.firstChild);
        // }
        // _y = _y - 27;
        //
        // var newExtendId = wrapping_over.getAttribute('id') + '_extend';
        // wrapping_over.setAttribute('id', newExtendId);
        // wrapping_over.setAttribute('class', 'follow_wrap');
        // wrapping_over.setAttribute('y', _y.toString());
        // wrapping_over.firstChild.setAttribute('dy', '27');
        //
        // while (selectedElement.childNodes.length >= (index + 1)) {
        //     selectedElement.removeChild(selectedElement.lastChild);
        // }
        // selectedElement.setAttribute('class', 'follow_wrap');
        // me.setCountLine(selectedElement.childNodes.length);
        //
        // var turns_wrapping_over = wrapping_over.querySelectorAll('.turn');
        // if (turns_wrapping_over.length >0) {
        //     turns_wrapping_over[0].removeAttribute('class');
        // }
        // selectedElement.parentNode.insertBefore(wrapping_over, selectedElement.nextSibling);
        // me.setExtendTextContent(wrapping_over.textContent);
    },
    /**
     * 設定來源XML初始化
     */
    svgSetSource: function (oSVG) {
        if (!oSVG || !oSVG.xml) return false;
        var svg = this.getSvgPaper();
        if (svg == null) return false;
        var me = this;
        var qs = OA.common.Global.getQ();
        if(qs.app !== "preview") {
            oSVG.xml = me.addSvgXmlTitleRect(oSVG.xml);
        }
        svg.setSvgString(oSVG.xml);
        this.setMultiFormat(oSVG.multiFormat);
        this.setContactFields(oSVG.contactFields);

        //預先塞入第1筆做為undo、redo第0筆用
        var gContent = (svg.tagName == 'g') ? svg : svg.getCurrentDrawing().getCurrentLayer();
        var gContentCopy = gContent.cloneNode(true);
        var els = [];
        Ext.Array.each(gContentCopy.childNodes, function (node) {
            if (node.id.indexOf("KDRichTextBlock") != -1) {
                els.push(node);
            }
        });

        var elmuList = me.getRichAndmultiList();
        var mult = Ext.clone(me.getMultiFormat());
        elmuList.rich.length = 0;
        elmuList.mult.length = 0;
        elmuList.rich.push(els);
        elmuList.mult.push(mult);
        //console.log(mult);

        return true;
    },
    /*
     * 高市府-第三代公文 ,第 6 次專案工作會議
     *  (六) 可 [編輯欄位] 旁(右側5px) 有 [特殊標記] ，方便使用者辨識。
     **    此函式新增 [特殊標記] 為橘色(#eb5000) 直條矩形
     */
    addSvgXmlTitleRect: function (svgXml) {
        // 排除公文格式
        var wk = OA.common.Global.getCurrentWKContent();
        if(['機密文書機密等級變更或註銷紀錄單',
            '機密文書機密等級變更或註銷處理意見表',
            '簽稿會核單',
            '會銜公文會辦單',
            '會銜公文機關印信蓋用續頁表'
        ].filter(x => x === wk.DocumentTemplate).length > 0) {
            return svgXml;
        } 

        // 解析 SVG XML 為 DOM
        const parser = new DOMParser();
        const serializer = new XMLSerializer();
        const svgDoc = parser.parseFromString(svgXml, "application/xml");
        const gContent = svgDoc.querySelector(".gContent");
        if (!gContent) return svgXml;

        // css 屬性選擇器, 選取 gContent 節點內所有 id 帶有 *_title 的 <text>
        const titleTexts = gContent.querySelectorAll(`  
                                        text[id*="_title"],
                                        text[id="KDRichTextBlock_0"], 
                                        text[id="KDRichTextBlock_1"],
                                        text[id="KDRichTextBlock_2"],
                                        text[id="KDRichTextBlock_3"]
                                    `); // 省略 text[id="KDRichTextBlock-1001"],
        Array.from(titleTexts)
            .filter(text => {
                return (text?.textContent.trim().length !== 0) // 若無內容可呈現, 篩選掉
                        // 不呈現之 <text> *_title ,但有 textContent內容 先寫死篩選掉
                        && (text?.getAttribute("id") !== "發文機關_title")
                        && (text?.getAttribute("id") !== "docCaption_title")
                        && (text?.getAttribute("id") !== "決行層級_title")
                        && (text?.getAttribute("id") !== "電話_title")
                        && (text?.getAttribute("id") !== "分層負責_title");
            })
            // 逐個 <text> 加入 <rect> 與 x,y 定位
            .forEach((text) => {

                // <rect> 元素 定位 x,y 參考 對應之 <text> *_title 元素
                const textId = text.getAttribute("id");
                const x = parseFloat(text.getAttribute("x")) || 0;
                const y = parseFloat(text.getAttribute("y")) || 0;

                // 創建新的 <rect> 元素
                const rect = svgDoc.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute("id", `${textId}_rect`);
                rect.setAttribute("x", (x - 5).toString()); // x 定位相較於 *_title 向左位移 5px
                rect.setAttribute("y", y.toString());       // y 定位一致
                rect.setAttribute("width", "5");
                rect.setAttribute("height", "16");
                rect.setAttribute("fill", "#eb5000");

                // 將 rect 插入到 text 元素之前
                gContent.insertBefore(rect, text);
            });
        
        // 將修改後的 SVG DOM 轉回 XML 字串
        return serializer.serializeToString(svgDoc);
    },
    /**
     * 設定來源XML初始化
     */
    svgSetXml: function (oSVG) {
        var me = this;
        if (!oSVG || !oSVG.xml) return false;
        var svg = this.getSvgPaper();
        if (svg == null) return false;

        svg.setSvgString(oSVG.xml);
        var ratio = svg.getZoom();
        var gBackgrounds = svg.getContentElem().querySelectorAll('.gBackground');
        var gContents = svg.getContentElem().querySelectorAll('.gContent');
        var padding = 0;
        var bottomMargin = me.getMarginTop() + me.getWorkHeight();
        var gPage = [];

        Ext.Array.each(gBackgrounds, function (g) {
            var tl = 'translate(0,' + padding + ')';
            g.setAttribute("transform", tl);
            //計算頁數
            var _page = 0;
            var i = 1;
            do {
                var hasPage = g.querySelector('#canvas_page_' + i);
                i = i + 1;
                if (hasPage)
                    _page = _page + 1;
            } while (hasPage)
            gPage.push(_page - 1);
            var maxMargin = bottomMargin + ((_page - 1) * (me.getWorkHeight() + me.getPagingHeight()));
            padding = padding + OA.common.DIMgr.revisePrint({
                page: me.getPage(),
                maxMargin: maxMargin,
                marginBottom: me.getMarginBottom()
            }).heightWithPadding;
        });
        padding = 0;
        var number = 0;
        Ext.Array.each(gContents, function (g) {
            var tl = 'translate(0,' + padding + ')';
            g.setAttribute("transform", tl);
            var maxMargin = bottomMargin + (gPage[number] * (me.getWorkHeight() + me.getPagingHeight()));
            padding = padding + OA.common.DIMgr.revisePrint({
                page: me.getPage(),
                maxMargin: maxMargin,
                marginBottom: me.getMarginBottom()
            }).heightWithPadding;
            number = number + 1;
        });
        svg.setResolution(me.getPageWidth(), padding - 20);
        svg.updateCanvas(me.getPageWidth(), padding);

        me.setPrintXml(svg.svgCanvasToString());
        return true;
    },
    /**
     * 參數初始化
     */
    svgParasInit: function () {
        var me = this;
        var qs = OA.common.Global.getQ();
        var svg = this.getSvgPaper();

        //Margin and Interval Information - Background
        var margin = svg.getElem('canvas_margin');
        me.setWorkHeight(parseFloat(margin.getAttribute("height")));
        me.setWorkWidth(parseFloat(margin.getAttribute("width")));
        me.setMarginLeft(parseFloat(margin.getAttribute("x")));
        me.setMarginTop(parseFloat(margin.getAttribute("y")));

        var rMargin = me.getPageWidth() - me.getWorkWidth() - me.getMarginLeft();
        me.setMarginRight(rMargin);
        var bMargin = me.getPageHeight() - me.getWorkHeight() - me.getMarginTop();
        me.setMarginBottom(bMargin);

        me.setLineGap(0);
        me.setIsLockPaper(false);

        var bottomMargin = me.getMarginTop() + me.getWorkHeight();
        var page = svg.getElem('canvas_page_1');
        if (page) page.setAttribute("x", me.getMarginLeft() + (me.getWorkWidth() - me.getClientWidth(page)) / 2);

        if (page) {
            var modelName = OA.client.WK.getCurrentModelName();
            if (modelName && modelName.indexOf('RewardOrder') > 0) {
                page.setAttribute("y", bottomMargin + me.getClientHeight(page) + 30);
            } else {
                page.setAttribute("y", bottomMargin + me.getClientHeight(page) + 40);
            }
        }
        me.setPage(0);
        me.initMaxMargin(0);

        //創簽稿及簽核模式不顯示Barcode
        if (qs.app !== "approve" && !qs.app !== "editor" && qs.app !== "draft" &&
            qs.app !== "check" && qs.app !== "async") {
            //console.log('dobarcode');
            me.doBarcode();
        }

        me.editActions().zoom();
        me.doCustomHidden();

        me.reviseClear();
        me.pensClear();

        var pagingSeal_0 = document.getElementById("canvas_pagingSeal_0");
        if (pagingSeal_0) pagingSeal_0.style.visibility = 'hidden';

        var topSubj_0 = document.getElementById("canvas_topSubj");
        if (topSubj_0) topSubj_0.style.visibility = 'hidden';

        var qs = OA.common.Global.getQ();
        me.editingPagging();
        //if (qs.app === 'approve' || qs.app === 'review') {
        //    var pagingSeal_1 = document.getElementById("canvas_pagingSeal_1");
        //    if (pagingSeal_1) pagingSeal_1.style.visibility = 'hidden';
        //    if (OA.common.DIMgr.getSealLocation() === 'top') OA.common.DIMgr.setSealY(bottomMargin);
        //}

        //me.sendNoUpdate();

        svg.svgrootUtilInit();
        svg.undoMgr.resetUndoStack();

        // 核章區 加大
        me.increaseHeightSeal(100);

        if (me.getPreviewMode() === 'Opinion') {
            if (qs.app == 'tidy') {
                me.layoutOpinions();
            } else {
                me.layoutOpinions2();
            }
        } else {
            me.svgUpdateLayout();
        }

        //clear tooltip defalut text , 會造成取不到layer
        // var title = me.getSvgPaper().getCurrentDrawing().getCurrentLayer().querySelector('title');
        // if (title) title.innerHTML = '';
    },
    /**
     * 處理表單
     */
    doGrid: function () {
        var me = this;
        var svg = this.getSvgPaper();
        var vm = OA.common.Global.getCurrentViewModel();
        if (!vm.Grid) return;
        Ext.Array.each(vm.Grid, function (item) {
            me.fillIn(item.Key, item.Value);
        });
    },
    /**
     * 條碼
     */
    doBarcode: function (href) {
        var qs = OA.common.Global.getQ();
        var me = this;
        var svg = this.getSvgPaper();
        var hasBarcode = (me.getPreviewMode() === 'Draft' && qs.app !== 'async');
        if (!me.getPreviewMode()) {
            hasBarcode = true;
        }
        var doSno, doDeptno, hasComeMark = false;
        var wk = OA.common.Global.getCurrentWKContent();
        var paras = OA.common.Global.getInitParas();
        var qd = OA.common.Global.getQueryDefault();
        if (paras) {
            doSno = paras.doSno;
            doDeptno = paras.doDeptno;
            hasComeMark = paras.ComeMark == 'Y';
        } else {
            doSno = (wk) ? wk.doSno : '';
            if (doSno == '' && wk) {
                doSno = (wk.發文文號) ? wk.發文文號 : '';
            }
            doDeptno = (wk) ? wk.doDeptno : '';
            if (qs.offline == 'Y') doDeptno = (wk) ? wk.orgId : '';
        }
    
        // 密件列印doBarcode
        if (qs.sFlag && qs.doSno) {
            doSno = qs.doSno;
        }
    
        var subGbDocflowList = [];
        if (hasBarcode && (doSno)) {
            if (!href) {
                if (doSno) {
                    var txtBarcode = doSno + '';
                    var win = OA.common.Global.getWinOpener();
    
                    if (win) {
                        var queryDefault;
                        if (qd) {
                            queryDefault = qd;
                        } else {
                            var initParas = win.getInitPreviewParas();
                            if (initParas) {
                                queryDefault = initParas.queryDefault;
                            }
                        }
    
                        // 處理收文機關文字顯示
                        var inboundOrg = (queryDefault.收文機關 || '') + '';
                        var inboundOrgWidth = inboundOrg.length * 11;
    
                        $('#barcodeOrg').append(inboundOrg);
                        var barcodeOrg = document.querySelectorAll('#barcodeOrg');
                        if (barcodeOrg.length > 0) {
                            var barcodeOrgX = barcodeOrg[0].getAttribute('x');
                            var newBarcodeOrgX = parseInt(barcodeOrgX) - inboundOrgWidth;
                            barcodeOrg[0].setAttribute('x', newBarcodeOrgX);
                        }
    
                        // 使用 canvas 生成條碼
                        var canvas = document.createElement('canvas');
                        if (hasComeMark) {
                            JsBarcode(canvas, txtBarcode, {
                                width: 1,
                                height: 25,
                                displayValue: true,
                                fontSize: 16,
                                textAlign: "left"
                            });
                        } else {
                            JsBarcode(canvas, txtBarcode, {
                                width: 1,
                                height: 25,
                                displayValue: true,
                                fontSize: 16
                            });
                        }
    
                        // 將 canvas 轉換為 base64 圖片 URL
                        href = canvas.toDataURL("image/png");
                        $('#barcodeSrc').attr('src', href);
                    } else {
                        // 沒有 win 的情況下生成條碼
                        var canvas = document.createElement('canvas');
                        JsBarcode(canvas, txtBarcode, {
                            width: 1,
                            height: 25,
                            displayValue: true,
                            fontSize: 16
                        });
                        href = canvas.toDataURL("image/png");
                        $('#barcodeSrc').attr('src', href);
                    }
                }
            }
    
            if (hasComeMark) {
                // 顯示收文日期
                var inboundDate = (queryDefault.來文日期 || '') + ''; // 條碼 收文日期
                if (inboundDate.length > 0) {
                    const elements = [
                        inboundDate.substring(0, 3),
                        inboundDate.substring(3, 5),
                        inboundDate.substring(5, 7)
                    ]; // 修正索引
                    $('#barcodeDate').append(elements.join('/'));
                }
            }
    
            var elem = svg.getElem('barcode');
            if (elem) {
                elem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', href);
                me.setBarcode(href);
            }
    
            // 簽、簡簽，增加彙併辦文號註記（註解部分保留）
            /*
            if (wk && (wk.DocumentType == '簽' || wk.DocumentType == '簡簽')) {
                var winOpen = OA.common.Global.getWinOpener() || false;
                if (!winOpen) return;
                var initPreviewParas = winOpen.getInitPreviewParas() || false;
                if (!initPreviewParas) return;
                var initParas = initPreviewParas.initParas || false;
                if (!initParas) return;
                subGbDocflowList = initParas.subGbDocflowList || [];
                // 判斷是否有彙併文號
                if (subGbDocflowList.length > 0) {
                    // 取得彙併辦子文文號
                    var childSno = [];
                    Ext.Array.each(subGbDocflowList, function (item) {
                        if (item.status == '1') {
                            childSno.push(item.doSno);
                        }
                    });
    
                    var previewParas = win.getInitPreviewParas();
                    if (!previewParas) return;
                    var combineSno = svg.getElem('combineSno');
                    if (combineSno) {
                        Ext.Array.each(childSno, function (sno, index) {
                            if (index == 0) {
                                combineSno.textContent = '併' + sno;
                            } else {
                                combineSno.textContent = combineSno.textContent + '、' + sno;
                                var clientWidth = me.getClientWidth(combineSno);
    
                                // 依文號長度，重新設定 x 位置
                                if (clientWidth > 190) {
                                    var reSetX = 550 - (clientWidth - 190);
                                    combineSno.setAttribute('x', reSetX);
                                    if (clientWidth > 667) {
                                        combineSno.textContent = combineSno.textContent.replace('、' + sno, '…等');
                                        combineSno.setAttribute('x', 70);
                                    }
                                }
                            }
                        });
                    }
                }
            }
            */
        }
    },
    
    /**
     * 設定特定隱藏
     */
    doCustomHidden: function () {
        var qs = OA.common.Global.getQ();
        var svg = this.getSvgPaper();
        var mode = this.getPreviewMode();
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();

        if (mode && mode != 'Draft' && qs.app !== 'async') this.deleteSeal();  //列印預覧函面，除去核章欄

        if (mode && mode == 'Draft' && qs.app != 'async') {  //列印預覧稿面，受文者預設 如正副本行文單位 Chloe.sia
            var elemTo = svg.getElem('受文者');

            if (elemTo && elemTo.textContent == '') {
                if (wk && wk.DocumentType == '開會通知單') {
                    elemTo.textContent = '如出列席單位'
                } else {
                    elemTo.textContent = '如行文單位';
                }
            }
        }

        //分層負責
        var elemLV = svg.getElem('分層負責_title');
        //除函面（稿轉函後之文面），其它皆隱藏
        if (elemLV) {
            //var isShow = ['Multiple', 'Divide', 'General','overprint'].indexOf(mode) >= 0;
            if (!mode) elemLV.parentNode.removeChild(elemLV);
        }

        //來文初始頁
        if (vm && vm.kind == '來文') {
            this.deleteSeal();
            var elemSent = svg.getElem('發文機關_title');
            if (elemSent && elemSent.textContent.match('（稿）')) elemSent.textContent = elemSent.textContent.replace('（稿）', '');
            var copyTran = svg.getElem('抄本_title');
            if (copyTran) {
                copyTran.setAttribute('visibility', 'hidden');
                copyTran.style.display = 'none';
            }
        }

        //擬辦方式應用限制固定都不顯示，一律從稿面註記顯示
        //var hides = ['擬辦方式_title', '決行層級_title', '應用限制_title']
        var hides = ['擬辦方式_title', '應用限制_title']
        Ext.Array.each(hides, function (item) {
            var hideElem = svg.getElem(item);
            if (hideElem) hideElem.setAttribute('visibility', 'hidden');
        });


        //屏東客製除無附件令外其它令範本一律顯示附件欄位
        if (KangDaAppConfig().unit === 'TBPX') {
            if (wk && wk.DocumentTemplate === '無附件令') {
                var elemTitle = svg.getElem('附件_title');
                if (elemTitle) elemTitle.setAttribute('visibility', 'hidden');
                var elem = svg.getElem('附件');
                if (elem) elem.setAttribute('visibility', 'hidden');
            }
        }
    },
    /**
     * 取得 svg 相關設定
     */
    getsvgConfig: function (w, h) {
        return {
            backId: '',
            canvas_expansion: 1,
            dimensions: [w, h],
            initFill: { color: 'fff', opacity: 1 },
            initStroke: { width: 1.5, color: '000', opacity: 1 },
            initOpacity: 1,
            imgPath: 'thirdparty/method-draw/images/',
            extPath: 'thirdparty/method-draw/extensions/',
            jGraduatePath: 'thirdparty/method-draw/jgraduate/images/',
            extensions: [],
            initTool: 'scroll',
            wireframe: false,
            colorPickerCSS: false,
            gridSnapping: false,
            gridColor: "#000",
            baseUnit: 'px',
            snappingStep: 10,
            showRulers: false,
            show_outside_canvas: false,
            no_save_warning: true,
            initFont: 'BiauKai,標楷體'
        };
    },
    /**
     * 取得元素實際高
     */
    getClientHeight: function (el) {
        var h = 0;
        if (!el) return h;
        var cls = el.getAttribute('class') || '';
        if (el.tagName == 'text' && cls.indexOf('_over') < 0) {
            var line_height = this.getLineHeight(el);
            var count = Math.max(el.querySelectorAll('tspan[dy]:not([dy=""])').length, 1);
            h = line_height * count;
        } else {
            if (el.getBBox) h = el.getBBox().height;
        }
        return h;
    },
    /**
     * 取得元素實際寬
     */
    getClientWidth: function (el) {
        var w = 0;
        if (el.getBBox) w = Math.floor(el.getBBox().width);
        return w;
    },
    /**
     * 取得行高
     */
    getLineHeight: function (textnode) {
        var linePadding = this.getLinePadding();
        var isKDRichTextBlock = textnode.id.indexOf('KDRichTextBlock') >= 0;
        var line_height = (isKDRichTextBlock) ? 22 : 16;

        if (!textnode || textnode.textContent.length == 0) return line_height + linePadding;

        var fz = this.getElemFontSize(textnode);
        if (fz) line_height = fz + linePadding;
        // 如果為22px(16pt)的字間距加為兩倍以符合規範 - by yi-chi chiu
        return (isKDRichTextBlock) ? line_height + linePadding : line_height;
    },
    getElemFontSize: function (textnode) {
        var size = window.getComputedStyle(textnode).fontSize;
        if (!size) size = textnode.getAttribute('font-size');
        return parseFloat(size);
        // 設定文字最大大小，避免文字一直往下移的情況 - by yi-chi chiu
        //return parseFloat((size <=22) ? size : 22 );
    },
    /**
     * 取得排版設定
     * Must depend on DIMgr.layout
     */
    getSetting: function (layout, key, cls, pos_x, dy) {
        if (!layout) return;
        var ret = null;
        var vm = OA.common.Global.getCurrentViewModel();
        var wk = OA.common.Global.getCurrentWKContent();
        if (!vm) return;
        var firstBlock = vm.KDRichTextBlockList[0];
        var KDRichTextBlockID = (firstBlock) ? firstBlock.id : 'KDRichTextBlock';
        Ext.Array.forEach(layout, function (p) {
            if (p.key + '_title' == key) {
                var pos = (p.getPos) ? p.getPos(dy) : null;

                if (pos) {
                    ret = pos;
                } else {
                    ret = { feature: null, x: null, y: null };
                }

                if (p.display) ret.display = p.display;
                return false;  //break
            }
            // 可編輯欄位 特殊符號 *_title_rect x座標 定位 基本與 *_title 一致
            else if (p.key + '_title_rect' == key) {
                var pos = (p.getPos) ? p.getPos(dy) : null;

                if (pos) {
                    ret = pos;
                } else {
                    ret = { feature: null, x: null, y: null };
                }

                if (p.display) ret.display = p.display;
                return false;  //break
            }
            else if (key == KDRichTextBlockID && p.key == 'KDRichTextBlock') {
                ret = (p.getPos) ? p.getPos(dy) : null;
                return false;  //break
            }
            else if (key == 'LOGO_title') {
                ret = { feature: 'logo' };
                return false;  //break
            } else if (p.key == '聯絡方式' && cls === 'contact_block') { //聯絡方式
                if (p.getPos) ret = { x: p.getPos().x };
                return false;
            } else if (key == 'LOGOTEXT_title') {
                ret = { feature: 'logoText' };
                return false;  //break
            }
        });

        if(key === '承辦人_title_rect') {
            ret = { x: _x, feature: "max_follow_caption_align_block" };
        }
        if(key.indexOf('KDRichTextBlock') !== -1 && key.indexOf('rect') !== -1) {
            const p = layout.filter(p => p.key.indexOf('KDRichTextBlock')!==-1)[0];
            ret = (p.getPos) ? p.getPos(dy) : null;
        }
        if (cls === 'contact_block') { //聯絡方式
            var _x = (ret && ret.x) ? ret.x : pos_x;
            ret = { x: _x, feature: "max_follow_caption_align_block" };
        }
        return ret;
    },
    /**
     * 取得換行斷點位置
     *
     * var arr = me.getBreakPoints(el)
     *
     * arr=[4,6,45,51,63]
     *
     * @param {Node} el 元素
     * @return {Array}
     */
    getBreakPoints: function (el) {
        var points = [], p = 0;
        Ext.Array.each(el.childNodes, function (node) {
            if (node.nodeName === 'tspan') {
                p = p + node.textContent.length;
                points.push({ rowX: p, rowY: node.getAttribute("dy") });
            }
        });
        return points;
    },
    /**
     * 取得目前最大換行斷點位置
     *
     * max = me.getMaxPos(points, pos, pos_prev, pos_prev_max);
     *
     * max =51
     *
     * @param {Array} breakPoints 換行斷點位置
     * @param {int} pos 目前位置
     * @param {int} pos_prev    上一個位置
     * @return {Array}
     */
    getMaxPos: function (breakPoints, pos, pos_prev) {
        var max = 0;
        var points = [];
        Ext.Array.each(breakPoints, function (p) {
            max = p.rowX;
            if (p.rowX > pos_prev) points.push(p);
            if (pos <= p.rowX) return false;
        });
        return points;
    },
    /**
     * 批示意見 oSVG
     */
    getSvgOpinion: function (isShow) {
        var vi = OA.common.VIMgr.getViContent();
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var initParas = OA.common.Global.getInitParas();
        var title = '';
        var unit = '';
        if (docflow) {
            title = Ext.util.Format.htmlEncode(docflow.get('title')) || '';
            unit = docflow.get('depName') || '';
        }

        var items = [];
        items.push(Ext.String.format('<Plusdatas 決行層級="" 分層負責="" 主辨單位="{0}" 案情摘要="{1}" 核章區文字="">', unit, title));
        items.push(Ext.String.format('<批示意見>'));

        // console.log(initParas);
        // console.log(initParas.paperNo);
        // console.log(vi);
        if (vi) {
            var arr = [];
            var no = 0;
            Ext.Array.each(vi.版次, function (edition, idx) {
                console.log(edition);
                if (edition.版號 == 0) return true;
                if ((initParas && edition.isTemp != 'Y') || isShow) {
                    Ext.Array.each(edition.簽核文件夾.文稿, function (paper) {
                        if (paper.代碼 == initParas.paperNo) {
                            var who = edition.簽核人員;
                            var isMain = who && who.是否會辦 === '否';
                            var isFirstOrLast = edition.版號 == 0 || edition.版號 == vi.作業版本;
                            // if (who && paper.批示意見 && isMain && !isFirstOrLast) {
                            if (who && paper.批示意見 && !isFirstOrLast) {
                                var changeType = edition.線上簽核資訊.簽核流程.異動別 || ' ';
                                //console.log(who);
                                no++;
                                arr = [];
                                arr.push(edition.版號);
                                if (who.代理名稱)
                                    arr.push(Ext.String.format('{0}.{1} {2} {3} (代理：{4} {5}) 　{6}', no, who.服務單位, who.使用者名稱, changeType, who.代理職稱, who.代理名稱, edition.最後更新時間));
                                else
                                    arr.push(Ext.String.format('{0}.{1} {2} {3} {4} {5}', no, who.服務單位, who.使用者職稱, who.使用者名稱, changeType, edition.最後更新時間));
                                arr.push(changeType);
                                arr.push('#FF0000FF');
                                arr.push(who.使用者帳號);
                                arr.push(who.使用者名稱);
                                arr.push(who.單位代碼);
                                arr.push(who.服務單位);
                                arr.push(padLeft(who.使用者職務代碼, 7));
                                arr.push(paper.批示意見.lastTime || '');
                                items.push(Ext.String.format('<意見 version="{0}" BulletText="{1}" AssignText="{2}" Brush="{3}" empNo="{4}" ' +
                                    'empName="{5}" depNo="{6}" depName="{7}" jobNo="{8}" logTime="{9}">',
                                    arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9]));
                                items.push(Ext.String.format('<文字>{0}</文字>', paper.批示意見.content || ''));
                                items.push(Ext.String.format('</意見>'));
                            }
                        }
                    });
                }
            });
        }

        items.push(Ext.String.format('</批示意見>'));
        items.push(Ext.String.format('</Plusdatas>'));

        var xml = items.join('');
        // console.log(xml);
        xml = xml.replace(/&/g, '&amp;');
        var xmlDoc = parseXmlString(xml);
        var plusdatas = xmlDoc.querySelector('Plusdatas');

        if (isShow) return plusdatas

        return OA.common.DIMgr.generateOpinionSvg(plusdatas);
    },

    getSvgOpinion2: function (isShow) {
        var vi = OA.common.VIMgr.getViContent();
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var initParas = OA.common.Global.getInitParas();
        var title = '';
        var unit = '';
        if (docflow) {
            title = Ext.util.Format.htmlEncode(docflow.get('title')) || '';
            unit = docflow.get('depName') || '';
        }

        var items = [];
        items.push(Ext.String.format('<Plusdatas 決行層級="" 分層負責="" 主辨單位="{0}" 案情摘要="{1}" 核章區文字="">', unit, title));
        items.push(Ext.String.format('<批示意見>'));

        // console.log(initParas);
        // console.log(initParas.paperNo);
        // console.log(vi);
        if (vi) {
            var arr = [];
            var no = 0;
            var brandVI = Ext.clone(vi);
            var brand = brandVI.版次.reverse();
            Ext.Array.each(brand, function (edition, idx) {
                //console.log(edition);
                if (edition.版號 == 0) return true;
                if ((initParas && edition.isTemp != 'Y') || isShow) {
                    Ext.Array.each(edition.簽核文件夾.文稿, function (paper) {
                        if (paper.代碼 == initParas.paperNo) {
                            var who = edition.簽核人員;
                            var isMain = who && who.是否會辦 === '否';
                            var isFirstOrLast = edition.版號 == 0 || edition.版號 == vi.作業版本;
                            // if (who && paper.批示意見 && isMain && !isFirstOrLast) {
                            if (who && !isFirstOrLast) {
                                var changeType = edition.線上簽核資訊.簽核流程.異動別 || ' ';
                                //console.log(who);
                                no++;
                                arr = [];
                                arr.push(edition.版號);
                                if (who.代理名稱)
                                    arr.push(Ext.String.format('{0}.{1} {2} {3} (代理：{4} {5}) 　{6}', no, who.服務單位, who.使用者名稱, changeType, who.代理職稱, who.代理名稱, edition.最後更新時間));
                                else
                                    arr.push(Ext.String.format('{0}.{1} {2} {3} {4} {5}', no, who.服務單位, who.使用者職稱, who.使用者名稱, changeType, edition.最後更新時間));
                                arr.push(changeType);
                                arr.push('#FF0000FF');
                                arr.push(who.使用者帳號);
                                arr.push(who.使用者名稱);
                                arr.push(who.單位代碼);
                                arr.push(who.服務單位);
                                arr.push(padLeft(who.使用者職務代碼, 7));
                                arr.push(who.使用者職稱);
                                if (paper.批示意見 && paper.批示意見.文字) {
                                    arr.push(edition.最後更新時間 || '');
                                    items.push(Ext.String.format('<意見 version="{0}" BulletText="{1}" AssignText="{2}" Brush="{3}" empNo="{4}" ' +
                                        'empName="{5}" depNo="{6}" depName="{7}" jobNo="{8}" jobName="{9}" logTime="{10}">',
                                        arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10]));
                                    items.push(Ext.String.format('<文字>{0}</文字>', paper.批示意見.文字 || ''));

                                } else if (paper.批示意見 && paper.批示意見.content) {
                                    arr.push(paper.批示意見.lastTime || '');
                                    items.push(Ext.String.format('<意見 version="{0}" BulletText="{1}" AssignText="{2}" Brush="{3}" empNo="{4}" ' +
                                        'empName="{5}" depNo="{6}" depName="{7}" jobNo="{8}" jobName="{9}" logTime="{10}">',
                                        arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10]));
                                    items.push(Ext.String.format('<文字>{0}</文字>', paper.批示意見.content || ''));
                                } else if (edition.線上簽核資訊 && edition.線上簽核資訊.簽核意見 != undefined) {
                                    arr.push(edition.最後更新時間 || '');
                                    items.push(Ext.String.format('<意見 version="{0}" BulletText="{1}" AssignText="{2}" Brush="{3}" empNo="{4}" ' +
                                        'empName="{5}" depNo="{6}" depName="{7}" jobNo="{8}" jobName="{9}" logTime="{10}">',
                                        arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6], arr[7], arr[8], arr[9], arr[10]));
                                    items.push(Ext.String.format('<文字>{0}</文字>', edition.線上簽核資訊.簽核意見 || ''));
                                }
                                items.push(Ext.String.format('</意見>'));
                            }
                        }
                    });
                }
            });
        }

        items.push(Ext.String.format('</批示意見>'));
        items.push(Ext.String.format('</Plusdatas>'));

        var xml = items.join('');
        // console.log(xml);
        xml = xml.replace(/&/g, '&amp;');
        var xmlDoc = parseXmlString(xml);
        var plusdatas = xmlDoc.querySelector('Plusdatas');

        if (isShow) return plusdatas
        //return OA.common.DIMgr.generateOpinionSvg(plusdatas);
        return OA.common.DIMgr.generateOpinionSvg2(plusdatas);
    },
    /*
     * 取得當前文稿所有 [說明] 之內容  
     */
    getKDRichTextBlockContext: function() {
        var currentLayerNodeList = this.getSvgPaper().getCurrentDrawing().getCurrentLayer().childNodes;
        var KDRichTextList = [];
        Ext.Array.each(currentLayerNodeList, function (el) {
            if(!el.id.includes('KDRichTextBlock')) { // 非富文本區塊跳過
                return;
            }
            if(!el.id.includes('context')) { // 無內容跳過
                return;
            }
            if(el.id.includes('KDRichTextBlock_0')) { // 主旨跳過
                return;
            }
            Ext.Array.each(el.childNodes, function (childNodes) {
                if(childNodes.textContent.trim()) {
                    if(childNodes.textContent === '在此繕寫本文') { // 忽略提示文字
                        return;
                    }
                    if(childNodes.textContent === '在這裡輸入') {  // 忽略提示文字
                        return;
                    }
                    KDRichTextList.push(childNodes.textContent);
                }
            });
        });
        return KDRichTextList;
    },
    /**
     * 找svg中的元素
     */
    svgQuery: function (svg, id) {
        var els = svg.getCurrentDrawing().getCurrentLayer().childNodes;  //return NodeList

        var element = null;
        Ext.Array.each(els, function (el) {
            if (el.id == id) {
                element = el;
                return false;
            }
        });

        return element;
    },
    /**
     * 找 multiFormat
     */
    multiFormatQuery: function (id) {
        var muti = this.getMultiFormat();

        if (!muti) return null;
        var newArray = Ext.Array.filter(muti, function (item) {
            return (item.bindId == id);
        }, this);
        if (newArray.length == 0) return null;
        return newArray[0];
    },
    multiFormatLastQuery: function (id) {
        var muti = this.getMultiFormat();

        if (!muti) return null;
        var newArray = Ext.Array.filter(muti, function (item) {
            return (item.bindId == id);
        }, this);
        if (newArray.length == 0) return null;
        if (newArray.length > 1) {
            var hastrue = false;
            var newItem = undefined;
            Ext.Array.each(newArray, function (item) {
                if (item.hasreplace == true) {
                    hastrue = true;
                } else {
                    newItem = item;
                }
            });
            if (hastrue && newItem) {
                return newItem;
            } else {
                return newArray[newArray.length - 1];
            }
        } else {
            return newArray[newArray.length - 1];
        }
    },
    /**
     * 更新格式，注意更新順序
     */
    multiFormatUpdate: function (f, b) {
        var me = this, mfs = f;

        if (b) mfs = f.concat(b);

        //更新順序
        mfs = mfs.reverse();

        Ext.Array.each(mfs, function (mf) {
            var mu = me.multiFormatQuery(mf.from);
            if (mu) mu.bindId = mf.to;
        });
    },
    /**
     * 執行設定
     * hasKey to init new value, noKey :belong the same last key
     */
    doSetting: function (el, setting, pos) {
        var me = this;
        if (setting == null) return pos;
        var linePadding = me.getLinePadding();
        var mode = this.getPreviewMode();

        if (setting.x) pos.x = setting.x;
        if (setting.y) pos.y = setting.y;
        if (setting.interval) {
            var r = 0.0;
            var parsePercent = setting.interval.indexOf('%') > 0;
            if (parsePercent)
                r = parseFloat(setting.interval) / 100;
            else
                r = parseFloat(setting.interval);
            pos.y = pos.y + (OA.common.DIMgr.getPageHeight() * r);
        }
        if (setting.hidden) {
            el.style.visibility = "hidden";
        }


        if (setting.display) {
            var dsp = (setting.display == 'none') ? 'none' : '';
            el.setAttributeNS(null, "style", 'display:' + dsp);

            var elContent = svgedit.utilities.getElem(el.id.replace('_title', ''));
            if (elContent) elContent.setAttributeNS(null, "style", 'display:' + dsp);
        }

        var clientHeight = 0.0, clientWidth = 0.0;
        if (setting.feature) {
            clientHeight = me.getClientHeight(el);
            clientWidth = me.getClientWidth(el);

            if (setting.feature == 'file_no') {
                pos.y = me.getMarginTop() * 0.5;
                pos.y = me.setPosY(el, pos.y);
                pos.follow_y = pos.y;
                pos.y = pos.y - clientHeight;
                pos.follow_x = pos.x + clientWidth;
            } else if (setting.feature == 'file_year') {
                pos.y = me.getMarginTop() * 0.75;
                pos.y = me.setPosY(el, pos.y);
                pos.follow_y = pos.y;
                pos.y = pos.y - clientHeight;
                pos.follow_x = pos.x + clientWidth;
            } else if (setting.feature == 'todoWay') {
                el.setAttribute("x", me.getMarginLeft());
                //pos.y = me.getMarginTop() * 0.8 + clientHeight - 25;
                pos.y = pos.y - clientHeight;
                pos.y = me.setPosY(el, pos.y);
            } else if (setting.feature == 'draftNote') {
                if (!setting.y) pos.y = pos.y + clientHeight;
                pos.y = me.setPosY(el, pos.y);
                //var tspans = el.querySelectorAll('tspan');
                //if (tspans.length == 0) {
                //    var wrapping = me.setWrap(el.cloneNode(true), me.getMarginLeft(), me.getMarginTop() * 0.5 - clientHeight, 350);
                //    el.parentNode.replaceChild(wrapping, el);
                //} else {
                //    pos.y = me.setPosY(el, me.getMarginTop() * 0.5 - 21);
                //}
            } else if (setting.feature.indexOf('top_center') >= 0) {
                var tspans = el.querySelectorAll('tspan');
                var modelName = OA.client.WK.getCurrentModelName();
                if (tspans.length == 0) {
                    var isWrap = setting.feature.indexOf('wrap') >= 0;
                    var docModelName = OA.client.WK.getCurrentModelName().replace('OA.model.wk.', '');
                    var isSpaceWrap = ['ProposalNotice', 'ExchangeNotice'].indexOf(docModelName) >= 0 || isWrap;
                    var wrapping;
                    if (isSpaceWrap) { //以空白換行
                        wrapping = el.cloneNode(false);
                        var line_height = this.getLineHeight(el);
                        var items = el.textContent.split('　');
                        Ext.Array.each(items, function (line, idx) {
                            var tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                            tspan.setAttributeNS(null, 'dy', line_height);
                            var tspanNode = document.createTextNode(line);
                            tspan.appendChild(tspanNode);
                            wrapping.appendChild(tspan);
                        });
                    } else {
                        wrapping = me.setWrap(el.cloneNode(true), 0, 0, 600);
                    }

                    //title過長，重新處理折行位置
                    if (wrapping.childNodes && wrapping.childNodes.length == 2) {
                        //console.log(wrapping);
                        var titles = wrapping.textContent.split('　');
                        if (titles && titles.length == 2) {
                            var textLength = wrapping.childNodes[0].getAttribute('textLength');
                            if (textLength) {
                                wrapping.childNodes[0].removeAttribute('textLength');
                            }
                            wrapping.childNodes[0].textContent = (titles[0] + '').trim();
                            wrapping.childNodes[1].textContent = (titles[1] + '').trim();
                        }
                    }

                    el.parentNode.replaceChild(wrapping, el);
                    Ext.Array.each(wrapping.childNodes, function (tspan) {
                        if (tspan.nodeType == 1) {
                            var _x = me.getMarginLeft() + ((me.getWorkWidth() - tspan.getComputedTextLength()) / 2);
                            if (modelName.indexOf('AccountingReport') >= 0) {
                                _x = me.getMarginLeft() + ((me.getWorkWidth() + 100 - tspan.getComputedTextLength()) / 2);
                            }
                            tspan.setAttributeNS(null, 'x', _x);

                        }
                    });
                    clientHeight = me.getClientHeight(wrapping);

                    if (modelName.indexOf('RewardOrder') >= 0) {
                        pos.y = me.getMarginTop() + 10;
                    } else {
                        pos.y = me.getMarginTop() - 10;
                    }

                    wrapping.setAttributeNS(null, 'y', pos.y);
                    pos.y = pos.y + clientHeight;
                    pos.follow_y = pos.y; //for fllow
                } else {
                    Ext.Array.each(el.childNodes, function (tspan) {
                        if (tspan.nodeType == 1) {
                            var _x = me.getMarginLeft() + ((me.getWorkWidth() - tspan.getComputedTextLength()) / 2);
                            if (modelName.indexOf('AccountingReport') >= 0) {
                                _x = me.getMarginLeft() + ((me.getWorkWidth() + 100 - tspan.getComputedTextLength()) / 2);
                            }
                            tspan.setAttributeNS(null, 'x', _x);
                        }
                    });
                    clientHeight = me.getClientHeight(el);
                    pos.y = me.getMarginTop() + clientHeight - 10;

                    pos.follow_y = pos.y; //for fllow
                }
                // console.log(tspans);
                // console.log(pos);
            } else if (setting.feature == 'avoid_align_block') {
                var docModelName = OA.client.WK.getCurrentModelName().replace('OA.model.wk.', '');

                //簽要增加高度
                if (docModelName == 'Notes') {
                    pos.y = pos.y + 80;
                }
                var tspans = el.querySelectorAll('tspan');
                if (tspans.length == 0) {
                    wrapping = me.setWrap(el.cloneNode(true), 0, 0, 600);
                    var titles = wrapping.textContent.split('　');
                    wrapping.childNodes[0].textContent = (titles[0] + '').trim();
                    if (wrapping.childNodes.length == 1) {
                        var line_height = this.getLineHeight(el);
                        var addtspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                        addtspan.setAttributeNS(null, 'dy', line_height);
                        var tspanNode = document.createTextNode((titles[1] + '').trim());
                        addtspan.appendChild(tspanNode);
                        wrapping.appendChild(addtspan);
                    } else {
                        wrapping.childNodes[1].textContent = (titles[1] + '').trim();
                    }

                    el.parentNode.replaceChild(wrapping, el);
                    Ext.Array.each(wrapping.childNodes, function (tspan) {
                        var _x = me.getMarginLeft()
                        tspan.setAttributeNS(null, 'x', _x);
                    });
                    clientHeight = me.getClientHeight(wrapping);
                    wrapping.setAttributeNS(null, 'y', pos.y);
                    pos.y = pos.y + clientHeight;
                    pos.follow_y = pos.y; //for fllow
                } else {
                    pos.y = me.setPosY(el, pos.y);
                    clientHeight = me.getClientHeight(el);
                    pos.y = pos.y + clientHeight;
                    pos.follow_y = pos.y; //for fllow

                }
                var max = me.getMaxMargin();
                if (mode == 'Draft') {
                    if (pos.y > max) {
                        me.addPaging(wrapping);
                        pos.y = max + me.getPagingHeight()
                        wrapping.setAttribute("y", pos.y);

                    }
                } else if (mode) {
                    if ((pos.y - 30) > max) {
                        me.addPaging(el);
                        pos.y = max + me.getPagingHeight();
                        el.setAttribute("y", pos.y);
                    }
                }
                pos.y = pos.y + clientHeight
            } else if (setting.feature == 'logo') { //聯徵LOGO
                el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', KangDaAppConfig().logo);
                var docModelName = OA.client.WK.getCurrentModelName().replace('OA.model.wk.', '');
                if (docModelName == 'ImportantMeetingReport') { //出席會議摘要單
                    var logoXNew = document.querySelectorAll('#機關名稱_title')[0].querySelectorAll('tspan')[0].getAttribute('x')
                    el.setAttribute("x", logoXNew - 50);
                    el.setAttribute("y", me.getMarginTop() * 0.9 + 10);
                } else {
                    var logoX = document.querySelectorAll('#發文機關_title')[0].querySelectorAll('tspan')[0].getAttribute('x')
                    el.setAttribute("x", logoX - 50);
                    el.setAttribute("y", me.getMarginTop() * 0.9 + 10);
                }
            } else if (setting.feature == 'logoText') { //聯徵LOGOTEXT
                el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', KangDaAppConfig().logoText);
                var docModelName = OA.client.WK.getCurrentModelName().replace('OA.model.wk.', '');
                if (docModelName == 'ImportantMeetingReport') { //出席會議摘要單
                    var logoXNew = document.querySelectorAll('#機關名稱_title')[0].querySelectorAll('tspan')[0].getAttribute('x')
                    el.setAttribute("x", logoXNew);
                } else {
                    var logoX = document.querySelectorAll('#發文機關_title')[0].querySelectorAll('tspan')[0].getAttribute('x')
                    el.setAttribute("x", logoX);
                }

            } else if (setting.feature == 'paragraph_block') {
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;
                pos.y = me.setPosY(el, pos.y);
                pos.follow_h = me.getLineHeight(el);
                pos.follow_y = pos.y - pos.follow_h + linePadding;
                pos.follow_x = pos.x + clientWidth;
                pos.follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - pos.x - clientWidth;
                //me.addNoteHeight(el, pos)
                //console.log(Ext.String.format('paragraph_block : id ={0} follow_y= {1} pos_y= {2}', key, follow_y, pos_y));
            } else if (setting.feature == 'paragraph_block_first') {
                pos.special = 'frist_row_indent';  //首行縮排
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;
                pos.y = me.setPosY(el, pos.y);
                pos.follow_h = me.getLineHeight(el);
                pos.follow_y = pos.y - pos.follow_h + linePadding;
                pos.follow_x = pos.x + clientWidth;
                pos.follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - pos.x - clientWidth;
            } else if (setting.feature == 'paragraph_block_noindent') {
                pos.special = 'noindent';  //不縮排
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;
                pos.y = me.setPosY(el, pos.y);
                pos.follow_h = me.getLineHeight(el);
                pos.follow_y = pos.y - pos.follow_h + linePadding;
                pos.follow_x = pos.x + clientWidth;
                pos.follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - pos.x - clientWidth;
            } else if (setting.feature == 'follow_caption_block') {
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;
                pos.y = me.setPosY(el, pos.y);
                pos.y = pos.y - clientHeight;
                pos.follow_x = pos.x + clientWidth;
                pos.follow_y = pos.y; //for follow_wrap
                pos.follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - pos.x - clientWidth;
                pos.follow_h = clientHeight;
            } else if (setting.feature == 'max_follow_caption_align_block') { //跟隨標題 且 延伸不換行  follow_caption_block + follow_align_block
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;
                pos.y = me.setPosY(el, pos.y);
                pos.y = pos.y - clientHeight;
                pos.follow_x = pos.x + clientWidth;
                pos.follow_y = pos.y; //for follow_wrap
                pos.follow_h = me.getLineHeight(el);
                // pos.x = pos.x + clientWidth;
                // pos.follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - pos.x - clientWidth;
                // pos.follow_h = clientHeight;
            } else if (setting.feature == 'addr') {
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;
                pos.y = me.setPosY(el, pos.y);
                //for follow normal
                pos.y = pos.y - clientHeight;
                pos.follow_x = pos.x + clientWidth;
                pos.follow_y = pos.y; //for follow_wrap
                pos.follow_boxWidth = (0.48 * me.getWorkWidth());
                pos.follow_h = clientHeight;
            } else if (setting.feature == 'attn_block') {
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;
                // pos.y = me.addSealHeight(el, pos);
                pos.y = me.setPosY(el, pos.y);
                //for follow normal
                pos.y = pos.y - clientHeight;
                pos.follow_x = pos.x + clientWidth;
                pos.follow_y = pos.y; //for follow_wrap
                pos.follow_boxWidth = (0.38 * me.getWorkWidth());
                pos.follow_h = clientHeight;
            } else if (setting.feature == 'follow_page_block') {
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;

                pos.y = me.setPosY(el, pos.y);
                //for follow normal
                pos.y = pos.y - clientHeight;
                pos.follow_x = pos.x + clientWidth;
                pos.follow_y = pos.y; //for follow_wrap
                pos.follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - pos.x - clientWidth;
                pos.follow_h = clientHeight;
            } else if (setting.feature == 'follow_align_block') {
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;
                //  pos.y = me.addSealHeight(el, pos);//增加核章欄高度
                pos.y = me.setPosY(el, pos.y);
                //follow item init
                pos.follow_h = me.getLineHeight(el);
                pos.y = pos.y - clientHeight;
                pos.x = pos.x + clientWidth;
                pos.follow_y = pos.y;
            } else if (setting.feature == 'right') {
                pos.x = me.getMarginLeft() + ((me.getWorkWidth() - clientWidth));
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight;
                var vis = el.getAttribute('visibility');
                if (vis != 'hidden') pos.y = me.setPosY(el, pos.y);
            } else if (setting.feature == 'caption_only') {
                el.setAttribute("x", pos.x);
                if (!setting.y) pos.y = pos.y + clientHeight + linePadding;
                pos.y = me.setPosY(el, pos.y);
            } else if (setting.feature == 'center') {
                pos.x = me.getMarginLeft() + ((me.getWorkWidth() - clientWidth) / 2);
                el.setAttribute("x", pos.x);

                if (!setting.y) pos.y = pos.y + clientHeight;
                pos.y = me.setPosY(el, pos.y);

                //for follow normal
                pos.y = pos.y - clientHeight;
                pos.follow_x = pos.x + clientWidth;
                pos.follow_y = pos.y; //for follow_wrap
                pos.follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - pos.x - clientWidth;
                pos.follow_h = clientHeight;
            } else if (setting.feature == 'input_todoWay') {
                pos.y = me.getMarginTop() * 0.5;
                pos.y = me.setPosY(el, pos.y);
                pos.follow_y = pos.y;
                pos.y = pos.y - clientHeight;
            }
            pos.toContinue = true;
        }

        // 非 特殊符號 rect , 提早 return, 不須 '第二次' y座標 校正
        if(el.id.indexOf('_title_rect') === -1 && el.id.indexOf('KDRichTextBlock_') === -1) {
            return pos;
        }

        // 特殊符號 rect , '第二次' y座標 校正
        var wk = OA.common.Global.getCurrentWKContent();
        let addY = 0;
        if(el.id === '檔號_title_rect' || el.id === '保存年限_title_rect') {
            addY = 6;
        }
        else if(el.id === 'KDRichTextBlock_1_rect') { 
            addY = -14; // 說明
            addY = (wk.DocumentTemplate === '公告')? -180 : addY; // 依據
            addY = (wk.DocumentTemplate === '受文者公告')? -260 : addY; // 依據
        }
        else if(el.id === 'KDRichTextBlock_2_rect') { // 擬辦
            addY = -14;
        }
        else if(el.id === '敬陳_title_rect') {
            addY = 46;
        }
        else if(el.id === '核示_title_rect') {
            addY = 12;
        }
        else if(el.id === '會辦單位_title_rect') {
            addY = 34;
            addY = (wk.DocumentTemplate.indexOf('簽') !== -1)? 80 : addY;
            addY = (wk.DocumentTemplate === '令')? 96 : addY;
        }
        me.setPosY(el, pos.y + addY);
        return pos;
    },
    /**
     * 排版
     */
    typesetting: function (root, isClear, isNotRedo, turnLine) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var wk = OA.common.Global.getCurrentWKContent();
        var pos_x = 0.0, pos_y = 0.0;
        var follow_x = 0.0, follow_y = 0.0, follow_boxWidth = me.getWorkWidth(), follow_h = 0.0, special = '';
        var el_new, linePadding = me.getLinePadding(), isTable = false, gridRightMax = 0.0, grids = [], rowX = 0.0, rowY = 0.0;
        var clientHeight = 0.0, clientWidth = 0.0, firstTspan;
        var layout = OA.common.Utils.removeSupport(me.getFields());
        me.setPage(0);
        me.initMaxMargin(0); //需初始化邊界，進行重繪

        if (!root) root = me.getSvgPaper();
        if (root == null) return;
        var gContent = (root.tagName == 'g') ? root : root.getCurrentDrawing().getCurrentLayer();

        // console.log( OA.common.Paper.main().getIsClearPaper());
        // console.log(gContent.getAttribute('class') + ' typesetting...');
        // console.log(gContent.getAttribute('class') + '-isClear: ' + isClear );
        gContent.style.visibility = 'hidden';  //暫時隱藏以提昇效能
        var els = gContent.childNodes;
        var vm = OA.common.Global.getCurrentViewModel();
        Ext.Array.each(els, function (el) {
            var el_h, ind, fz;
            var key = el.id;
            var cls = el.className.baseVal;
            if (cls === 'test') return true;

            //console.log(key);

            //聯絡方式欄位處理
            if (cls === 'contact_block') {
                var contactId = key.replace('_title', '');
                var isEmpty = vm[contactId] != undefined && vm[contactId].trim().length == 0;
                if (isEmpty) {
                    el.setAttribute('visibility', 'hidden');
                    el.setAttribute('x', '-999');
                    pos_y = pos_y - me.getLineHeight(el);
                    //return true;
                } else {
                    el.setAttribute('visibility', 'visible');
                }
            }

            var tspanDone = el.tagName == 'text' && el.childNodes.length > 1;  //text是否存有tspan
            //pos_y = me.revisePos(el, pos_y);  //分層負責引起補章區間隔重算

            //核章區隨文時(新增內容時)，最後取得座標
            //console.log(key);
            if (key === 'gSeal') {
                var paddingY = me.getPage() == 0 ? 30 : 0;
                me.moveSeal(pos_y - paddingY);
                // me.moveSealTDGK(me.getSealH(), 'gSeal');
                // return true; //continue
            } else if (key == 'gCornerSeal') {
                var isCornerSealShow = 0;
                //稿面顯示就好
                if (me.getPreviewMode() == 'Draft') isCornerSealShow = 1;
                el.setAttribute('opacity', isCornerSealShow);
                if (isCornerSealShow == 0) return true; //continue
            }
            var setting = me.getSetting(layout, key, cls, pos_x, pos_y);
            if (isTable && setting) setting.y = rowY; //表格修正Y為表格底Y

            // if (el.id =='KDRichTextBlock_1' || el.id =='KDRichTextBlock_1_context') {
            // console.log(pos.follow_y);
            // console.log(key +' ' + follow_y);
            // }

            var pos = me.doSetting(el, setting, {
                x: pos_x,
                y: pos_y,
                follow_x: follow_x,
                follow_y: follow_y,
                follow_boxWidth: follow_boxWidth,
                follow_h: follow_h,
                special: special,
                toContinue: false
            });

            if(key.indexOf('_rect') !== -1) {
                return;
            }

            if (pos.x) pos_x = pos.x;
            if (pos.y) pos_y = pos.y;
            if (pos.follow_x) follow_x = pos.follow_x;
            if (pos.follow_y) follow_y = pos.follow_y;
            if (pos.follow_boxWidth) follow_boxWidth = pos.follow_boxWidth;
            if (pos.follow_h) follow_h = pos.follow_h;
            if (pos.special) special = pos.special;

            if (el.id.indexOf('_extend') >= 0) {
                pos_y = parseFloat(el.getAttribute('y'));
                follow_y = pos_y;
            }

            if (isTable) follow_x = rowX; //表格修正X為表格右

            //draw grid
            var gd = me.doDrawGrid(el, {
                setting: setting,
                pos: pos,
                isTable: isTable,
                gridRightMax: gridRightMax,
                grids: grids,
                rowX: rowX,
                rowY: rowY
            });
            isTable = gd.isTable;
            gridRightMax = gd.gridRightMax;
            grids = gd.grids;
            rowX = gd.rowX;
            rowY = gd.rowY;
            if (setting && setting.table == 'end') pos_y = gd.pos.y;

            if (cls == 'addr') {
                el_new = me.setWrap(el, pos_x, follow_y, follow_boxWidth);
                pos_y = follow_y + me.getClientHeight(el_new);
            }

            if (pos.toContinue) return pos.toContinue;

            clientHeight = me.getClientHeight(el);

            if (el.style && el.style.display == 'none') clientHeight = 0;

            if (!isNotRedo) el.setAttribute("x", pos_x);

            if (key == '機關') {
                el_new = me.setWrap(el, pos_x, follow_y, 330);
                pos_y = follow_y + me.getClientHeight(el_new);
                return true;
            }

            var isParagraph = cls.indexOf("indent") >= 0;  //段落 編號 縮排
            if (isParagraph) {

                //清稿預覧時,清稿後段落修正，無內容應去除                
                if (isClear && me.getIsPreview()) {
                    var noValue = me.noValueNeedClear(gContent, el);
                    if (noValue) {
                        el.setAttribute('visibility', 'hidden');
                        el.style.display = 'none';
                        follow_y = pos_y - clientHeight;
                        return true;
                    }
                } else {
                    el.setAttribute('visibility', 'visible');
                    el.style.display = '';
                }


                var l = OA.common.Utils.toLvNumber(cls);
                var lv = l.lv;
                ind = 0.0;
                if (lv) {
                    fz = me.getLineHeight(el) - me.getLinePadding();
                    ind = lv * fz;
                    follow_x = pos_x + ind;
                    if (lv == 0) pos_y = pos_y + fz;
                } else
                    follow_x = pos_x;

                if (special === 'frist_row_indent') { //首行縮排
                    if (wk.DocumentType == '電子信箱回覆函' && el.id == 'KDRichTextBlock_1') {
                    } else {
                        el.textContent = '';
                        follow_x = me.getMarginLeft();
                        ind = 0;
                    }
                }

                if (cls == 'wrap_indent-1') {
                    follow_boxWidth = me.getWorkWidth() - ind;
                } else {
                    el.setAttribute("x", follow_x);

                    clientWidth = me.getClientWidth(el);
                    follow_boxWidth = me.getWorkWidth() - ind - clientWidth;
                    follow_x = follow_x + clientWidth;

                    if (special === 'noindent') {  //不縮排
                        follow_x = pos_x;
                        follow_boxWidth = me.getWorkWidth() - clientWidth;
                    }

                }
                //console.log(Ext.String.format('key ={0} cls={1} pos_y= {2} text={3} isNaN={4}', key,cls, pos_y, el.textContent,isNaN(l.no)));

                el_h = clientHeight;
                pos_y = pos_y + el_h + me.getLineGap();

                if (isNotRedo && el.id == 'KDRichTextBlock_1') pos_y = pos_y - me.getLinePadding();
                if (isNotRedo && el.id == 'KDRichTextBlock_2') pos_y = pos_y - me.getLinePadding();

                pos_y = me.setPosY(el, pos_y);
                follow_y = pos_y - el_h;

                if (me.removeCanvasElem(el)) return true;
                return true;
            }
            if (cls == 'follow') {
                el.setAttribute("x", follow_x);
                el.setAttribute("y", follow_y);
            } else if (cls.indexOf('follow_wrap') >= 0 || cls == 'contact_wrap') {

                if (wk && wk.DocumentType == '令' && cls == 'follow_wrap' && el.id.indexOf('KDRichTextBlock') >= 0) {
                    if (key.indexOf('-') == -1) {
                        if (el.textContent.length <= 1 && el.textContent == '') {
                            el.textContent = '在此繕寫本文';
                        }

                    }
                }

                //換頁時強制重算
                var forceRedraw = false;
                //console.log(isNotRedo);
                if (isNotRedo) {
                    var testWrapY = follow_y + clientHeight;
                    if (testWrapY > me.getMaxMargin()) forceRedraw = true;
                }

                if (isNotRedo && forceRedraw == false) {
                    el.setAttribute("y", follow_y);
                    pos_y = follow_y + clientHeight;
                } else {
                    //TODO:處理換行的效能，但會影響編輯
                    // if (tspanDone) {
                    //     pos_y = me.tspanWrappingRevise(el, follow_y);
                    // } else {

                    //if (Ext.getCmp('cpaper').getIsStrikeText()) {
                    //    el_new = el;
                    //    el_new.setAttributeNS(null, 'x', follow_x + 0);
                    //    console.log(el_new.id);
                    //}else
                    el_new = me.setWrap(el, follow_x, follow_y, follow_boxWidth);
                    pos_y = follow_y + me.getClientHeight(el_new);
                    if (el_new.getAttribute('class').indexOf('_over') > 0) {
                        pos_y = pos_y + me.getLinePadding();
                        var tpans = el_new.querySelectorAll('tspan');

                        // 條例第二層，換行頁時，會多加一空白行高
                        // pos_y = pos_y + me.getLineHeight(el_new) ;
                    }

                    var isContext = key.indexOf('_context') >= 0;
                    if (isContext && el_new && ((el_new.textContent + '').trim()).length == 0) { //補全型空白，留下元素
                        el_new.textContent = '　';
                        el_new.setAttribute("x", follow_x);
                        el_new.setAttribute("y", pos_y);
                    }

                    //合併格式追修
                    var el_style = me.mergeStyle(gContent, el_new, isClear);
                    if (el_style && special === 'frist_row_indent' && cls !== 'contact_wrap') {
                        firstTspan = el_style.querySelectorAll('tspan')[0];
                        if (firstTspan) {
                            if (wk && wk.DocumentType == '電子信箱回覆函') {
                                if (el_style.id == 'KDRichTextBlock_0_context' || el_style.id == 'KDRichTextBlock_1_context') {
                                } else {

                                    var tspans = el_style.querySelectorAll('tspan');
                                    Ext.Array.each(tspans, function (tspan, index) {
                                        if (el_style.id == 'KDRichTextBlock_2_context') {

                                        } else {

                                        }

                                    })
                                    if (el_style.id == 'KDRichTextBlock_2_context') {
                                        firstTspan.setAttribute('x', follow_x + 40);
                                        if (firstTspan.getAttribute('textLength')) firstTspan.setAttribute('textLength', follow_boxWidth - 40);
                                    } else {
                                        //console.log(el_style.id);
                                        firstTspan.setAttribute('x', follow_x + 80);
                                        if (firstTspan.getAttribute('textLength')) firstTspan.setAttribute('textLength', follow_boxWidth - 80);
                                    }
                                }
                            } else {
                                firstTspan.setAttribute('x', follow_x + 44);
                                if (firstTspan.getAttribute('textLength')) firstTspan.setAttribute('textLength', follow_boxWidth - 44);
                            }
                            pos_y = pos_y + 5;
                        }
                    }

                    if (special === 'frist_row_indent' && cls !== 'contact_wrap') { //首行縮排
                        firstTspan = el_new.querySelectorAll('tspan')[0];
                        if (firstTspan) {
                            if (wk && wk.DocumentType == '電子信箱回覆函') {
                                if (el_new.id !== 'KDRichTextBlock_0_context' && el_new.id !== 'KDRichTextBlock_1_context') {
                                    var setting = me.getSetting(me.getFields(), vm.KDRichTextBlockList[0].id);
                                    if (el_new.id == 'KDRichTextBlock_2_context') {
                                        var allTspan = el_new.querySelectorAll('tspan')
                                        if (allTspan && allTspan.length > 0) {
                                            Ext.Array.each(allTspan, function (tspan, index) {
                                                tspan.setAttribute('x', setting.x + 44);
                                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                            })
                                        } else {
                                            el_new.setAttribute('x', setting.x + 44);
                                            if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 44);
                                        }
                                        //padding = 44;
                                    } //else if (wrapping.id == 'KDRichTextBlock_3_context') {
                                    else if (el_new.id.indexOf('_context') != -1) {
                                        var allTspan = el_new.querySelectorAll('tspan')
                                        if (allTspan && allTspan.length > 0) {
                                            Ext.Array.each(allTspan, function (tspan, index) {
                                                //console.log(Ext.clone(follow_boxWidth));
                                                if (index == 0) {
                                                    tspan.setAttribute('x', setting.x + 80);
                                                    if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 80);
                                                } else {
                                                    tspan.setAttribute('x', setting.x + 44);
                                                    if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                                }
                                            })
                                        } else {
                                            el_new.setAttribute('x', setting.x + 80);
                                            if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 80);
                                        }
                                        //padding = 80;
                                    }
                                }
                            } else {
                                firstTspan.setAttribute('x', follow_x + 44);
                                if (firstTspan.getAttribute('textLength')) firstTspan.setAttribute('textLength', follow_boxWidth - 44);
                            }
                            pos_y = pos_y + 5;
                        }
                    } else if (special === 'noindent') {
                        // console.log(el_new);
                        // el_new.setAttribute("x",0);
                    }
                }


                // console.log(key +' ' + me.getClientHeight(el_new));
                // console.log(key +' ' +follow_y);
                // console.log(key +' ' +pos_y);
            } else if (cls.indexOf('paragraph_desc') >= 0) {

                follow_h = me.getLineHeight(el);
                if (((el.textContent + '').trim()).length == 0) {
                    el.textContent = '　';//補全型空白，留下元素
                    el.setAttribute("x", follow_x);
                    el.setAttribute("y", pos_y);
                    return true;
                }

                var _y = pos_y - follow_h;
                //換頁時強制重算
                var forceDescRedraw = false;
                if (isNotRedo) {
                    var testDescY = _y + clientHeight;
                    if (testDescY > me.getMaxMargin()) {
                        forceDescRedraw = true;
                    }
                }
                if (isNotRedo && forceDescRedraw == false) {
                    el.setAttribute("y", _y);
                    pos_y = follow_y + clientHeight;

                } else {
                    var hasSpace = cls.indexOf('paragraph_desc_space') >= 0;
                    if (hasSpace) {
                        var count = parseInt(cls.replace('paragraph_desc_space', ''));
                        el.textContent = Ext.String.repeat('　', count) + el.textContent.trim();
                    }

                    el_new = me.setWrap(el, follow_x, _y, follow_boxWidth);

                    if (special === 'frist_row_indent') { //首行縮排
                        firstTspan = el_new.querySelectorAll('tspan')[0];
                        if (firstTspan) {
                            if (wk && wk.DocumentType == '電子信箱回覆函') {
                                if (el_new.id !== 'KDRichTextBlock_0_context' && el_new.id !== 'KDRichTextBlock_1_context') {
                                    var setting = me.getSetting(me.getFields(), vm.KDRichTextBlockList[0].id);
                                    if (el_new.id == 'KDRichTextBlock_2_context') {
                                        var allTspan = el_new.querySelectorAll('tspan')
                                        if (allTspan && allTspan.length > 0) {
                                            Ext.Array.each(allTspan, function (tspan, index) {
                                                tspan.setAttribute('x', setting.x + 44);
                                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                            })
                                        } else {
                                            el_new.setAttribute('x', setting.x + 44);
                                            if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 44);
                                        } 
                                        //padding = 44;
                                    } //else if (wrapping.id == 'KDRichTextBlock_3_context') {
                                    else if (el_new.id.indexOf('_context') != -1) {
                                        var allTspan = el_new.querySelectorAll('tspan')
                                        if (allTspan && allTspan.length > 0) {
                                            Ext.Array.each(allTspan, function (tspan, index) {
                                                //console.log(Ext.clone(follow_boxWidth));
                                                if (index == 0) {
                                                    tspan.setAttribute('x', setting.x + 80);
                                                    if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 80);
                                                } else {
                                                    tspan.setAttribute('x', setting.x + 44);
                                                    if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                                }
                                            })
                                        } else {
                                            el_new.setAttribute('x', setting.x + 80);
                                            if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 80);
                                        }
                                        //padding = 80;
                                    }
                                }
                            } else {
                                firstTspan.setAttribute('x', follow_x + 44);
                                if (firstTspan.getAttribute('textLength')) firstTspan.setAttribute('textLength', follow_boxWidth - 44);
                            }
                            pos_y = pos_y + 5;
                        }
                    } else if (special === 'noindent') {   //不縮排
                        pos_y = pos_y + 5;
                    }

                    var h = (me.getClientHeight(el_new) > 0) ? me.getClientHeight(el_new) : follow_h;
                    pos_y = pos_y - follow_h + h;
                    follow_y = pos_y;

                    var mergeEl = me.mergeStyle(gContent, el_new, isClear);
                    if (mergeEl && ((mergeEl.textContent + '').trim()).length == 0) { //補全型空白，留下元素
                        mergeEl.textContent = '　';
                        mergeEl.setAttribute("x", follow_x);
                        mergeEl.setAttribute("y", pos_y);
                    }

                    //追修首行縮排
                    if (mergeEl && special === 'frist_row_indent') {
                        firstTspan = mergeEl.querySelectorAll('tspan')[0];
                        if (firstTspan) {
                            if (wk && wk.DocumentType == '電子信箱回覆函')
                                if (el_new.id !== 'KDRichTextBlock_0_context' && el_new.id !== 'KDRichTextBlock_1_context') {
                                    var setting = me.getSetting(me.getFields(), vm.KDRichTextBlockList[0].id);
                                    if (el_new.id == 'KDRichTextBlock_2_context') {
                                        var allTspan = el_new.querySelectorAll('tspan')
                                        if (allTspan && allTspan.length > 0) {
                                            Ext.Array.each(allTspan, function (tspan, index) {
                                                tspan.setAttribute('x', setting.x + 44);
                                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                            })
                                        } else {
                                            el_new.setAttribute('x', setting.x + 44);
                                            if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 44);
                                        }
                                        //padding = 44;
                                    } //else if (wrapping.id == 'KDRichTextBlock_3_context') {
                                    else if (el_new.id.indexOf('_context') != -1) {
                                        var allTspan = el_new.querySelectorAll('tspan')
                                        if (allTspan && allTspan.length > 0) {
                                            Ext.Array.each(allTspan, function (tspan, index) {
                                                //console.log(Ext.clone(follow_boxWidth));
                                                if (index == 0) {
                                                    tspan.setAttribute('x', setting.x + 80);
                                                    if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 80);
                                                } else {
                                                    tspan.setAttribute('x', setting.x + 44);
                                                    if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                                }
                                            })
                                        } else {
                                            el_new.setAttribute('x', setting.x + 80);
                                            if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 80);
                                        }
                                        //padding = 80;
                                    }
                                    /*
                                    if (mergeEl.id == 'KDRichTextBlock_0_context' || mergeEl.id == 'KDRichTextBlock_1_context') {
                                    } else {
                                        var allTspan = el_new.querySelectorAll('tspan');
                                        Ext.Array.each(allTspan, function (tspan, index) {
                                            if (index == 0 && el_new.id !== 'KDRichTextBlock_2_context') {
                                                //tspan.setAttribute('x', setting.x + 80);
                                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 80);
                                            } else {
                                                //tspan.setAttribute('x', setting.x + 44);
                                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                            }
                                        })
                                    }
                                    */
                                } else {
                                    firstTspan.setAttribute('x', follow_x + 44);
                                    if (firstTspan.getAttribute('textLength')) firstTspan.setAttribute('textLength', follow_boxWidth - 44);
                                }
                        }
                    }
                }
            }
            else if (cls == 'wrap_indent-1') {
                el_new = me.setWrap(el, follow_x, pos_y, follow_boxWidth);
                pos_y = pos_y + me.getClientHeight(el_new);
                me.mergeStyle(gContent, el_new, isClear);
            }
            else if (cls == 'align_wrap') {

                el_h = clientHeight;
                pos_y = pos_y + el_h;

                pos_y = me.setPosY(el, pos_y);

                // console.log('follow_y update');
                //beacuse maybe pos_y add pagingHeight
                follow_y = pos_y - el_h;
            }
            else if (cls == 'attn_wrap') {
                el_new = me.setWrap(el, follow_x, follow_y, follow_boxWidth);
                pos_y = follow_y + me.getClientHeight(el_new);
            }
            else {
                if (el.tagName == 'title') {
                    //TODO:svg tooltip暫停，清title，會造成 svg.getCurrentDrawing().current_layer 取錯
                    //if (el.textContent) me.setLayerTitle(el.textContent);
                    //el.textContent = '';
                } else if (el.tagName == 'rect' && cls !== 'table' && key.indexOf('_rect') === -1) {
                    el.parentNode.removeChild(el);
                } else if (cls == 'gWritingPad') {
                    var pads = el.childNodes;
                    Ext.Array.each(pads, function (pad) {
                        if (isClear) pad.parentNode.removeChild(pad);
                    });
                } else if (key.indexOf('署名') >= 0 || key.indexOf('敬會') >= 0 || key.indexOf('敬陳') >= 0 || key.indexOf('敬致') >= 0 || key.indexOf('局處單位') >= 0) {

                    if (el.textContent.trim()) {
                        el.setAttributeNS(null, "style", "display:inline");
                    } else {
                        el.setAttributeNS(null, "style", "display:none");
                    }

                    var reSetPostY = false;
                    if (key.indexOf('署名') >= 0) {
                        if (el && el.textContent) {
                            var txt = el.textContent.replace(/\s*/g, "");
                            //console.log(txt);
                            if (txt.indexOf('財團法人金融消費評議中心') != -1) {
                                el = me.setWrap(el, pos_x, follow_y, 650);
                                reSetPostY = true;
                            }
                        }
                    }
                    clientHeight = me.getClientHeight(el);//重抓不然clientHeight會是0

                    if (key.indexOf('敬會') >= 0 || key.indexOf('敬陳') >= 0 || key.indexOf('敬致') >= 0 || key.indexOf('局處單位') >= 0) {
                        if (key.indexOf('_title') == -1) {
                            //不是title重設x
                            el.setAttribute('x', me.getMarginLeft());
                        }
                        if (key.indexOf('敬陳') >= 0 || key.indexOf('敬致') >= 0) {
                            clientHeight = clientHeight * 2;
                        }
                    }

                    if (key.indexOf('署名') != -1 && key.indexOf('_title') == -1) {
                        //console.log(key);
                        if (key.indexOf('_1') == -1) {
                            clientHeight = clientHeight * 1.6;
                        } else {
                            clientHeight = 10;
                        }
                    }

                    el_h = clientHeight;
                    pos_y = pos_y + el_h + (me.getLinePadding() * 2);

                    if (!reSetPostY)
                        pos_y = me.setPosY(el, pos_y);

                    //beacuse maybe pos_y add pagingHeight
                    follow_y = pos_y - el_h;
                    //OA.common.Utils.addLine('follow_y', follow_y, 'yellow');
                } else if (cls === 'table') {
                    pos_y = pos_y + 10;

                    // console.log(el);
                    Ext.Array.each(el.childNodes, function (child) {
                        var ctnId = 'ctnTable_' + key.split('_')[1];
                        var ctr = Ext.getCmp(ctnId);
                        if (ctr) {
                            // console.log(ctr.element.getHeight(true));
                            var _top = (pos_y + me.getLineGap()) * me.getRatio();
                            ctr.setTop(_top); // floating 要算放大比例
                            ctr.setLeft(child.getAttribute("x") * me.getRatio());
                            pos_y = me.setPosY(child, pos_y + me.getLineGap());

                            pos_y = pos_y + clientHeight;
                        }
                    });
                } else if (key == '分層負責_title') {
                    console.log(pos_y);
                    //增加章戳
                    var isAddStampMode = ['Normal', 'Multiple', 'Divide', 'General', 'Send', 'Send2'];
                    if (isAddStampMode.indexOf(me.getPreviewMode()) != -1) {
                        var svg = me.getSvgPaper();
                        if (null == svg) return;

                        /*
                         * 0：機關章
                         * 1：署名章
                         * 2：代辦局章
                         */

                        var mode = OA.common.Utils.getStampOrSignature(layout, wk.DocumentType);
                        if (mode !== 'null') {
                            //var stamp = svg.getElem('Stamp1');
                            var stamp = svg.getElem('Stamp' + mode) || null;
                            if (stamp) {
                                //扣除clientHeight
                                pos_y = pos_y - clientHeight;
                                var stamp_y = pos_y;
                                var elemSA = svg.getElem('署名_1');
                                if (elemSA) {
                                    var int = 0;
                                    do {
                                        int = int + 1;
                                        elemSA = svg.getElem("署名_" + int);
                                        if (elemSA) {
                                            //if (int == 1) {
                                            //    stamp_y = Ext.clone(elemSA.getAttribute('y'));
                                            //}
                                            elemSA.parentNode.removeChild(elemSA);
                                        }
                                    } while (elemSA);
                                }
                                var elemSA_Title = svg.getElem('署名_title');
                                if (elemSA_Title) elemSA_Title.parentNode.removeChild(elemSA_Title);
                                //console.log(Ext.clone(stamp_y));
                                var max = me.getMaxMargin();
                                var areaHeight = me.getPageHeight() * 0.04;
                                stamp_y = stamp_y + areaHeight;
                                //console.log(stamp_y);
                                if ((stamp_y + 80) > max) {
                                    stamp_y = me.getMaxMargin() + me.getPagingHeight() + areaHeight;
                                    me.addPaging(stamp);
                                }
                                stamp.childNodes[0].setAttribute('y', stamp_y);
                                stamp.childNodes[0].setAttribute('opacity', '1');
                                pos_y = stamp_y + 100;
                            }
                        }
                    } else {
                        //抓迴避要點
                        var svg = me.getSvgPaper();
                        var elemAD = svg.getElem('迴避要點_title');
                        if (elemAD) {
                            if (elemAD.getAttribute) {
                                var elemADY = elemAD.getAttribute('y');

                                if (elemADY) {
                                    if (parseInt(elemADY) >= pos_y) {
                                        pos_y = pos_y + 50;
                                    }
                                    console.log(elemADY)
                                }
                            }
                            console.log(elemAD);
                        }
                    }
                    pos_y = me.revisePos(el, pos_y);  //分層負責引起補章區間隔重算
                    el_h = clientHeight;
                    pos_y = me.setPosY(el, pos_y);
                    follow_y = pos_y - el_h;
                } else {
                    el_h = clientHeight;
                    var svg = me.getSvgPaper();
                    var elemSubmit_Title = svg.getElem('敬會_title');
                    /*
                    var edition = OA.common.VIMgr.getCurrentEdition();
                    // 更新vi
                    if (edition) {
                        Ext.Array.each(edition.簽核文件夾.文稿, function (paper) {
                            if (paper.名稱 != '來文' && elemSubmit_Title != undefined) { //來文wk.DocumentType也是簽，排除掉來文   Chloe.sia
                                if (wk) {
                                    if (wk.DocumentType == '簡簽' || wk.DocumentType == '簽' || wk.DocumentType == '上行簽') {
                                        if (elemSubmit_Title.textContent == '（按此處新增敬會）') elemSubmit_Title.setAttributeNS(null, "style", "opacity:0.5");
                                    }
                                }
                            }
                        })
                    }*/



                    if (key.indexOf('註記') != -1) {
                        el.setAttributeNS(null, "style", "opacity:0.5");
                        pos_y = pos_y - me.getLineGap();
                    }
                    if (key.indexOf('謹簽') != -1 || key == '科長_title' || key == '組（室）核稿_title') {
                        //console.log(me.getLineGap());
                        pos_y = pos_y - me.getLineGap();
                    } else {
                        pos_y = pos_y + el_h;
                    }
                    pos_y = me.setPosY(el, pos_y);

                    //beacuse maybe pos_y add pagingHeight

                    follow_y = pos_y - el_h;

                    //console.log(Ext.String.format('key ={0} cls={1} pos_y= {2} text={3}', key,cls, pos_y, el.textContent));
                }
            }


            if (turnLine && el_new && el_new.id == turnLine.id) {
                var svg = me.getSvgPaper();
                svg.textActions.setCurtext(el_new); //focus again
                me.setSelectedElement(el_new);
            }

            //核章區固定頁首時，先計算會辦單位
            if (key == '會辦單位') {
                me.moveSeal();
            }

        });

        me.drawGridLast(grids);


        //0709 併列 上行簽不顯示會辦單位 Chloe.sia
        // var modelName = OA.client.WK.getCurrentModelName();
        // if (modelName.indexOf('NotesTop') >= 0) {
        //     me.deleteSeal()
        // }


        //只有一頁不放騎縫章
        var pagingSeal_R = document.getElementById("canvas_pagingSeal_0");
        if (pagingSeal_R)
            pagingSeal_R.style.visibility = (me.getPage() == 0) ? 'hidden' : 'visible';

        var pagingSeal_L = document.getElementById("canvas_pagingSeal_1");
        if (pagingSeal_L)
            pagingSeal_L.style.visibility = (me.getPage() == 0) ? 'hidden' : 'visible';


        gContent.style.visibility = 'visible';

        //創簽稿及簽核模式不顯示
        if (qs.app === "approve" || qs.app === "editor" || qs.app === "draft" ||
            qs.app === "check" || qs.app === "async") {
            me.removeSvgPage();
        } else {
            me.updateSvgPage();     // update page number
        }
    },
    removeCanvasElem: function (el) {
        if (!this.getPageFilter()) return;
        var mode = this.getPreviewMode();

        if (mode == 'Multiple') {
            //一文多發,只保留第一頁
            if (this.getPageFilter().first && this.getPage() > 0) {
                if (el.parentNode) el.parentNode.removeChild(el);
                return true;
            }
        } else if (mode == 'Divide') {
            //分址分文
        } else if (mode == 'General') {
            //受文者統稱
        }
    },
    removeCanvasPage: function () {
        var me = this;
        if (!me.getPageFilter()) return;

        var svg = me.getSvgPaper();
        if (!svg) return;

        var mode = me.getPreviewMode();
        if (mode == 'Multiple') {
            //一文多發,只保留第一頁
            if (me.getPageFilter().first && me.getPage() > 0) {
                var svgPages = svg.getRootElem().querySelectorAll('.canvasPage');
                Ext.Array.each(svgPages, function (p) {
                    var isFirst = p.getAttribute("id") === 'canvas_page_1';
                    if (!isFirst) {
                        var no = p.getAttribute("id").split('_')[2];
                        p.parentNode.removeChild(p);
                        var item = svg.getElem("canvas_interval_" + no);
                        if (item) item.parentNode.removeChild(item);
                    }
                });
            }
        } else if (mode == 'Divide') {
            //分址分文
        } else if (mode == 'General') {
            //受文者統稱
        }
    },
    //清稿後段落修正，無內容應去除
    noValueNeedClear: function (gContent, el) {
        var me = this;
        var noValue = false;
        var elemfirst;
        if (el.id === 'KDRichTextBlock_1') {
            elemfirst = gContent.querySelector('#KDRichTextBlock-1001_context')
            if (elemfirst) {
                noValue = elemfirst.textContent.trim().length == 0;
            } else {
                elemfirst = gContent.querySelector('#KDRichTextBlock_1_context')
                if (elemfirst) noValue = elemfirst.textContent.trim().length == 0;
            }
        } else if (el.id === 'KDRichTextBlock_2') {
            elemfirst = gContent.querySelector('#KDRichTextBlock-2001_context');
            if (elemfirst) {
                noValue = elemfirst.textContent.trim().length == 0;
            } else {
                elemfirst = gContent.querySelector('#KDRichTextBlock_2_context')
                if (elemfirst) noValue = elemfirst.textContent.trim().length == 0;
            }
        } else if (el.id === 'KDRichTextBlock_3') {
            elemfirst = gContent.querySelector('#KDRichTextBlock-3001_context');
            if (elemfirst) {
                noValue = elemfirst.textContent.trim().length == 0;
            } else {
                elemfirst = gContent.querySelector('#KDRichTextBlock_3_context')
                if (elemfirst) noValue = elemfirst.textContent.trim().length == 0;
            }
        } else {
            var _id = el.id + '_context';
            _id = _id.replace(/([^A-Za-z0-9_\u00A1-\uFFFF-])/g, "\\$1");
            var elemContent = gContent.querySelector('#' + _id);
            if (elemContent) {
                noValue = elemContent.textContent.trim().length == 0;
                var mu = me.multiFormatQuery(_id);
                if (mu) {
                    var isDelete = false;
                    var thisCount = elemContent.textContent.length;
                    Ext.Array.each(mu.multiFormat, function (item, idx) {
                        if (item.styles) {
                            Ext.Array.each(item.styles.items, function (sty) {
                                if (sty.action == 'StrikeText') {
                                    isDelete = true;
                                    var delCount = item.styles.end - item.styles.start;
                                    thisCount = thisCount - delCount;
                                }
                            });
                        }
                    })
                    if (isDelete && thisCount == 0) noValue = true;
                }
            }
        }
        return noValue;
    },
    layoutOpinions: function (gContent) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var svg = me.getSvgPaper();
        if (!gContent) gContent = svg.getContentElem().querySelector('.gContent');
        me.setPage(0);
        var pos_y = me.getMarginTop();
        var follow_x = me.getMarginLeft(), follow_boxWidth = me.getWorkWidth(), follow_h = 0.0;
        var el_new;

        gContent.style.visibility = 'hidden';
        var els = gContent.childNodes;  //return NodeList


        Ext.Array.each(els, function (el) {
            if (el.tagName == 'title') return true;
            var cls = el.className.baseVal;
            follow_h = me.getLineHeight(el);

            if (cls === 'kind' || cls === 'paper' || cls === 'normal') {
                pos_y = pos_y + follow_h + me.getLineGap();
                if (el.textContent.length == 0) pos_y = pos_y + follow_h;

                if (cls === 'kind') pos_y = pos_y + 8;
                if (cls === 'paper') pos_y = pos_y + 3;
                pos_y = me.setPosY(el, pos_y);

                if (cls === 'kind' || cls == 'paper') {
                    $('line' + el.id).remove();

                    var json = {
                        "element": "line",
                        "curStyles": true,
                        "attr": {
                            "id": 'line' + el.id,
                            "x1": follow_x,
                            "y1": pos_y + 5,
                            "x2": follow_x + follow_boxWidth,
                            "y2": pos_y + 5,
                            'stroke': 'black',
                            "class": 'test'
                        }
                    };
                    if (cls == 'kind') json.attr['stroke-dasharray'] = "2,5";

                    svg.addSvgElementFromJson(json);
                }
            } else {
                pos_y = pos_y + follow_h + me.getLineGap() + 5;
                var h_el = (me.getClientHeight(el) > 0) ? me.getClientHeight(el) : follow_h;
                if (h_el + pos_y > me.getMaxMargin())
                    pos_y += me.getMarginBottom() + me.getMarginTop() - h_el + 5;
                else
                    pos_y = pos_y - h_el - me.getLineGap();

                el_new = me.setWrap(el, follow_x, pos_y, follow_boxWidth);

                var h = (me.getClientHeight(el_new) > 0) ? me.getClientHeight(el_new) : follow_h;
                pos_y = pos_y + h + me.getLineGap() + me.getLineGap();

                if (el_new.getAttribute('class').indexOf('_over') > 0) {
                    pos_y = pos_y + me.getLineHeight(el_new) + h_el;
                }
            }
            // console.log(Ext.String.format('key ={0} pos_y= {1} text={2} cls={3} page={4}', key, pos_y, el.textContent, cls, me.getPage()));
        });

        gContent.style.visibility = 'visible';
    },
    /**
     * 意見排版
     */
    layoutOpinions2: function (gContent) {
        var me = this;
        var svg = me.getSvgPaper();
        if (!gContent) gContent = svg.getContentElem().querySelector('.gContent');
        me.setPage(0);
        var pos_y = me.getMarginTop();
        var follow_x = me.getMarginLeft() + 5, follow_boxWidth = me.getWorkWidth() - 180, follow_h = 0.0;
        var el_new;
        var last_format_line_y;
        gContent.style.visibility = 'hidden';
        var els = gContent.childNodes;  //return NodeList
        var boxH = 44;  //default Chapters box height
        var depname_long = false;
        var isFirst = true;
        Ext.Array.each(els, function (el) {
            if (el.tagName == 'title') return true;
            var cls = el.className.baseVal;
            var id = el.getAttribute("id");
            follow_h = me.getLineHeight(el);

            if (cls === 'kind' || cls === 'paper' || cls === 'normal') {

                pos_y = pos_y + follow_h + me.getLineGap();

                if (el.textContent.length == 0) pos_y = pos_y + follow_h;

                if (cls === 'kind') pos_y = pos_y + 8;
                if (cls === 'paper') pos_y = pos_y + 3;
                pos_y = me.setPosY(el, pos_y);

                if (cls === 'normal') {
                    if (id.indexOf('by') != -1) {
                        el.textContent = '';
                    }

                    if (id !== '意見' && id !== '簽辦人員')
                        pos_y = pos_y + 10;
                }

                if (id == '意見' || id == '簽辦人員') {
                    pos_y = pos_y - follow_h
                }

                if (cls === 'kind' || cls == 'paper') {
                    $('line' + el.id).remove();

                    var json = {
                        "element": "line",
                        "curStyles": true,
                        "attr": {
                            "id": 'line' + el.id,
                            "x1": follow_x,
                            "y1": pos_y + 5,
                            "x2": follow_x + follow_boxWidth,
                            "y2": pos_y + 5,
                            'stroke': 'black',
                            "class": 'test'
                        }
                    };
                    if (cls == 'kind') json.attr['stroke-dasharray'] = "2,5";

                    svg.addSvgElementFromJson(json);
                }
            } else if (cls === 'opinionline_h') {
                //OA.common.Utils.addLine('sealBaseY', pos_y, 'yellow');
                pos_y = pos_y + 8;

                if (isFirst) {
                    el.setAttribute("y1", pos_y - 3);
                    el.setAttribute("y2", pos_y - 3);
                } else {
                    el.setAttribute("y1", pos_y);
                    el.setAttribute("y2", pos_y);

                    if (last_format_line_y) {
                        last_format_line_y = null;
                    }
                }

                if (el.getAttribute("y1") > me.getPageHeight() * (me.getPage() + 1) - 200) {
                    pos_y = pos_y + 276;
                    last_format_line_y = Ext.clone(pos_y);
                }

            } else if (cls === 'opinionline_k') {
                //OA.common.Utils.addLine('sealBaseY', pos_y, 'yellow');
                pos_y = pos_y;
                if (isFirst) {
                    el.setAttribute("y1", pos_y - 3);
                    el.setAttribute("y2", pos_y - 3);
                } else {
                    if (last_format_line_y) {
                        el.setAttribute("y1", pos_y - 24);
                        el.setAttribute("y2", pos_y - 24);
                    } else {
                        el.setAttribute("y1", pos_y);
                        el.setAttribute("y2", pos_y);
                    }
                }
            } else if (cls === 'opinionline_v') {
                //OA.common.Utils.addLine('sealBaseY', last_format_line_y, 'yellow');

                if (isFirst) {
                    el.setAttribute("y1", pos_y - 55);
                    el.setAttribute("y2", pos_y + 5);
                } else {
                    if (last_format_line_y) {
                        el.setAttribute("y1", last_format_line_y - follow_h - 3);
                        el.setAttribute("y2", pos_y + 8);
                    } else {
                        el.setAttribute("y1", pos_y - 55 - boxH - follow_h);
                        el.setAttribute("y2", pos_y + 8);
                    }
                }

            } else if (cls.indexOf('Chapters') != -1) {
                if (cls == 'Chaptersbox') {
                    Chapters_depname_count = 0;
                    el.setAttribute("y", pos_y - 26);   //框
                    boxH = parseInt(el.getAttribute("height"));
                    //console.log(boxH / 2);
                } else if (cls == 'Chapters_depname') { //所屬單位
                    el.setAttribute("y", pos_y - 14);
                    //console.log(el);
                    if (el.textContent && (el.textContent + '').trim().length > 7) depname_long = true;

                } else if (cls == 'Chapters_jobname') { //職稱
                    if (el.nextSibling && el.nextSibling.getAttribute("class") == 'Chapters_jobname') {
                        el.setAttribute("y", pos_y + (boxH - 40));
                    } else {
                        el.setAttribute("y", pos_y + (boxH - 30));
                    }
                } else if (cls == 'Chapters_empname') { //人名
                    if (depname_long) {
                        if (el.nextSibling && el.nextSibling.getAttribute("class") == 'Chapters_empname') {
                            el.setAttribute("y", pos_y + (boxH - 43));
                        } else if (el.previousSibling && el.previousSibling.getAttribute("class") == 'Chapters_empname') {
                            el.setAttribute("y", pos_y + (boxH - 29));
                            depname_long = false;
                        } else {
                            el.setAttribute("y", pos_y + (boxH - 38));
                            depname_long = false;
                        }
                    } else {
                        if (el.nextSibling && el.nextSibling.getAttribute("class") == 'Chapters_empname' &&
                            el.nextSibling.nextSibling && el.nextSibling.nextSibling.getAttribute("class") == 'Chapters_empname') {
                            el.setAttribute("y", pos_y + (boxH - 56));

                        } else if (el.nextSibling && el.nextSibling.getAttribute("class") == 'Chapters_empname' &&
                            el.previousSibling && el.previousSibling.getAttribute("class") == 'Chapters_empname') {
                            el.setAttribute("y", pos_y + (boxH - 42));

                        } else if (el.previousSibling && el.previousSibling.getAttribute("class") == 'Chapters_empname' &&
                            el.previousSibling.previousSibling && el.previousSibling.previousSibling.getAttribute("class") == 'Chapters_empname') {
                            el.setAttribute("y", pos_y + (boxH - 30));

                        } else if (el.nextSibling && el.nextSibling.getAttribute("class") == 'Chapters_empname') {
                            el.setAttribute("y", pos_y + (boxH - 50));
                        } else if (el.previousSibling && el.previousSibling.getAttribute("class") == 'Chapters_empname') {
                            el.setAttribute("y", pos_y + (boxH - 35));
                        } else {
                            el.setAttribute("y", pos_y + (boxH - 42));
                        }
                    }
                } else if (cls == 'Chapters_time') {
                    el.setAttribute("y", pos_y + (boxH - 14));
                    isFirst = false;
                }
            } else {
                pos_y = pos_y + follow_h + me.getLineGap() + 5;
                var h_el = (me.getClientHeight(el) > 0) ? me.getClientHeight(el) : follow_h;

                if (h_el + pos_y > me.getMaxMargin()) {
                    pos_y += me.getMarginBottom() + me.getMarginTop() - h_el + 5;
                } else {
                    pos_y = pos_y - h_el - me.getLineGap();
                }

                if (id == '主旨') {
                    el_new = me.setWrap(el, follow_x, pos_y, me.getWorkWidth());
                } else {
                    el_new = me.setWrap(el, follow_x, pos_y - 20, follow_boxWidth);
                }

                var h = (me.getClientHeight(el_new) > 0) ? me.getClientHeight(el_new) : follow_h;
                pos_y = pos_y + h + me.getLineGap() + me.getLineGap();

                if (el_new.getAttribute('class').indexOf('_over') > 0) {
                    pos_y = pos_y + me.getLineHeight(el_new) + h_el;
                }
            }
            // console.log(Ext.String.format('key ={0} pos_y= {1} text={2} cls={3} page={4}', key, pos_y, el.textContent, cls, me.getPage()));
        });

        gContent.style.visibility = 'visible';
    },
    /**
     * 重排版，駐點
     */
    svgUpdateLayout: function (_svg, element) {
        var me = this;
        if (!_svg) _svg = me.getSvgPaper();
        me.typesetting(_svg, me.getIsClearPaper());
        if (element) me.elemReload(element);
    },
    elemReload: function (element) {
        var me = this;
        var _svg = me.getSvgPaper();
        var focusElemId = element.getAttribute("id");
        var el_reload = me.svgQuery(_svg, focusElemId);
        _svg.setMode('select');
        _svg.textActions.start(el_reload); //focus again , rasie selectedChanged
    },
    /**
     * 分層負責引起補章區間隔重算
     */
    revisePos: function (element, pos_y) {
        var me = this;
        if (element.id === '分層負責_title') {
            //console.log(pos_y);
            //console.log(me.getMaxMargin().toFixed(2));

            //OA.common.Utils.testLine(element.id +'test1' ,me.getMaxMargin());
            var max = me.getMaxMargin() - me.getClientHeight(element);
            var areaHeight = me.getPageHeight() * 0.04;
            pos_y = pos_y + areaHeight;
            if (pos_y > max) {

                //OA.common.Utils.testLine(element.id +'test1' ,me.getMaxMargin() + me.getPagingHeight() + areaHeight);
                //OA.common.Utils.testBlueLine(element.id +'test2' ,me.getMaxMargin() + me.getPagingHeight());
                //console.log(pos_y.toFixed(2) + ' > ' + max.toFixed(2));
                pos_y = me.getMaxMargin() + me.getPagingHeight() + areaHeight;

                this.addPaging(element);
            }
            //OA.common.Utils.testLine(element.id +'test1' ,pos_y);
        }
        return pos_y;
    },
    /**
     * 執行清稿
     */
    clearPaper: function (isFieldEdit) {
        //console.log(isFieldEdit);
        var me = this;
        //強制清稿面
        me.setIsClearPaper(true);
        me.setStatus('edit');
        me.typesetting(null, true);
        me.setIsFieldEdit(isFieldEdit);

        //2019.06.19 台北市列管需求 保留螢光筆
        //自動清稿不清螢光筆
        if (!isFieldEdit) me.pensClear();

        me.reviseClear();

        if (isFieldEdit == false) me.getSvgPaper().setMode('touch');
    },
    /**
     * 結束清稿預覧
     */
    unClearPaper: function () {
        var me = this;
        me.setIsClearPaper(false);
        me.setIsFieldEdit(true);
        me.typesetting(null, false);  //0923 結束預覧清稿時，文字重排 Chloe.sia
        me.getSvgPaper().setMode('select');
    },
    /**
     * 更新頁碼
     */
    paging: function (page, gBackground) {
        this.initMaxMargin(page);
        this.setPage(page);
        this.updateSvgPage(gBackground);
        this.updateSvgCanvas();

        // console.log(Ext.String.format('p.{0} maxMargin={1}', this.getPage(), this.getMaxMargin().toFixed(2)));
        // OA.common.Utils.addLine('max', this.getMaxMargin(), 'red');
    },
    addPaging: function (node) {
        console.log(node);
        var me = this;
        var qs = OA.common.Global.getQ();
        //創簽稿及簽核模式不增頁
        if (qs.app === "approve" || qs.app === "editor" || qs.app === "draft" ||
            qs.app === "check" || qs.app === "async") {
            return;
        }
        var page = this.getPage() + 1;
        if (node && node.parentNode && node.parentNode.getAttribute) {
            var clsName = node.parentNode.getAttribute('class');
            if (clsName) {
                var clsList = clsName.split(' ');

                var cls = clsName;
                if (clsList.length > 0) cls = '.gBackground.' + clsList[1];
                var gback = node.parentNode.parentNode.querySelector(cls);
                this.paging(page, gback);
            }
        } else {
            this.paging(page);
        }
    },
    /**
     * 初始化最大邊界及換頁寬
     */
    initMaxMargin: function (page, max, dy, pageSecond) {
        var bottomMargin = this.getMarginTop() + this.getWorkHeight();

        var svg = this.getSvgPaper();
        if (!svg) return;
        var interval = svg.getElem('canvas_interval_1');

        if (!interval) return;
        var h_interval = parseFloat(interval.getAttribute("height"));

        if (page == 0) {
            var pagging;
            if (max) {
                pagging = h_interval + this.getMarginTop() + this.getPageHeight() - max;  //修正核章區計自高
            } else {
                max = bottomMargin;
                pagging = h_interval + this.getMarginTop() + this.getMarginBottom();
            }

            // OA.common.Utils.testLine('p' + page, this.getPageHeight());
            // OA.common.Utils.addLine('p' + page, max, 'red');
            this.setMaxMargin(max);
            this.setPagingHeight(pagging);

            // console.log('p.' + page + ':' + max + ' PagingHeight：' + pagging);

            return;
        }

        pagging = h_interval + this.getMarginTop() + this.getMarginBottom();
        this.setPagingHeight(pagging);
        var maxMargin = bottomMargin + (page * (this.getWorkHeight() + this.getPagingHeight())); //max bottom Margin
        this.setMaxMargin(maxMargin);

        if (page != 0 && pageSecond == true) {
            maxMargin = (maxMargin + this.getSealHeight()) - pagging
            this.setMaxMargin(maxMargin);
        }
        // console.log('p.' + page + ':' + max + ' PagingHeight：' + pagging);
        // OA.common.Utils.addLine('p' + page, maxMargin + this.getMarginBottom(), 'blue');
    },
    /**
     * 每頁：頁碼、來文浮水印、裝訂線、騎縫章
     */
    updateSvgPage: function (root) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var vm = OA.common.Global.getCurrentViewModel();
        var wk = OA.common.Global.getCurrentWKContent();
        var subjStr = vm.主旨;
        if (wk && wk.DocumentType == '開會通知單') subjStr = vm.開會事由;
        //console.log(subjStr);
        if (subjStr == '主旨') subjStr = '';
        //if ((subjStr + '').length > 40) {
        //    subjStr = (subjStr + '').substr(0, 40);
        //}
        if (!root) root = me.getSvgPaper();
        var gBackground = (root.tagName == 'g') ? root : root.getRootElem().querySelector('.gBackground');
        var page1 = gBackground.querySelector('#canvas_page_1');
        if (!page1) return;
        var interval1 = gBackground.querySelector('#canvas_interval_1');
        if (!interval1) return;
        var interval1_h = parseFloat(interval1.getAttribute("height"));
        var gutter1 = gBackground.querySelector('#canvas_gutter_1');
        var pagingSeal_1 = gBackground.querySelector('#canvas_pagingSeal_1');
        var waterMark_1 = gBackground.querySelector(
            "#canvas_watermark_1"
        );
        var waterMarkWord_1 = gBackground.querySelector(
            "#canvas_watermarkWord_1"
        );

        var topSubj = gBackground.querySelector(
            "#canvas_topSubj"
        );
        var pageHeight = me.getPageHeight();
        var y, vy;
        var pages = [];

        for (var i = 0; i <= me.getPage(); i++) {
            var page = i + 1;
            var totalPage = me.getPage() + 1;
            var idPage = "canvas_page_" + page;
            var idInterval = "canvas_interval_" + page;
            var idWatermark = "canvas_watermark_" + page;
            //var idWatermarkWord = "canvas_watermarkWord_" + page;
            var idGutter = "canvas_gutter_" + page;
            var idTopSubj = "canvas_topSubj_" + page;
            var padding = (pageHeight + interval1_h) * i;
            pages.push(idPage);


            var el = gBackground.querySelector('#' + idPage);
            if (el) {
                el.textContent = Ext.String.format('第{0}頁，共{1}頁', page, totalPage);
            } else {
                var v = interval1.cloneNode(true);
                v.id = idInterval;
                vy = parseFloat(interval1.getAttribute("y")) + padding;
                v.setAttributeNS(null, 'y', vy.toString());

                var n = page1.cloneNode(true);
                n.id = idPage;
                y = parseFloat(page1.getAttribute("y")) + padding;
                n.setAttributeNS(null, 'y', y.toString());
                n.textContent = Ext.String.format('第{0}頁，共{1}頁', page, totalPage);

                var d = page1.nextSibling;
                gBackground.insertBefore(n, d);
                gBackground.insertBefore(v, d);
            }


            //增加浮水印
            //if (qs.package === "Y" || qs.borrow === "Y") {
            //console.log(me.getPreviewMode());
            if (waterMark_1) {
                if (me.getPreviewMode() != '' && me.getPreviewMode() !== 'Draft') {

                    waterMark_1.childNodes[0].setAttribute("opacity", "1");
                    var waterMark = gBackground.querySelector(
                        "#" + idWatermark
                    );
                    if (!waterMark) {
                        var mark = waterMark_1.cloneNode(true);
                        mark.id = idWatermark;
                        var tf = "translate(0," + padding + ")";
                        mark.setAttribute("transform", tf);
                        mark.childNodes[0].setAttribute("opacity", "1");
                        waterMark_1.parentNode.insertBefore(
                            mark,
                            waterMark_1.nextSibling
                        );
                    }
                }
            }

            if (topSubj) {
                if (me.getPreviewMode() == 'Draft' && qs.app != 'async') {
                    if (page > 1) {
                        var topSubjNext = gBackground.querySelector(
                            "#" + idTopSubj
                        );
                        if (!topSubjNext) {
                            var mark = topSubj.cloneNode(true);
                            mark.id = idTopSubj;
                            var tf = "translate(0," + padding + ")";
                            mark.setAttribute("transform", tf);
                            mark.setAttribute("opacity", "1");
                            mark.style.visibility = 'visible';
                            mark.textContent = '（案由：' + subjStr + '）'
                            var topSubjelem = me.setWrap(mark, mark.getAttribute('x'), mark.getAttribute('y'), 630);
                            if (topSubjelem.childNodes && topSubjelem.childNodes.length > 1) {
                                subjStr = topSubjelem.childNodes[0].innerHTML + '）';
                                mark.textContent = subjStr;
                            }
                            topSubj.parentNode.insertBefore(
                                mark,
                                topSubj.nextSibling
                            );
                        }

                    }
                }
            }

            /*
                if (qs.borrow === "Y") {
                    if (waterMarkWord_1) {
                        waterMarkWord_1.setAttribute("opacity", "0.2");
                        //var waterMarkWord = gBackground.querySelector(
                        //    "#" + idWatermarkWord
                        //);
                        //if (!waterMarkWord) {
                        //    var mark = waterMarkWord_1.cloneNode(true);
                        //    mark.id = idWatermarkWord;
                        //    var tf = "translate(0," + padding + ")";
                        //    mark.setAttribute("transform", tf);
                        //    mark.setAttribute("opacity", "0.2");
                        //    waterMarkWord_1.parentNode.insertBefore(
                        //        mark,
                        //        waterMarkWord_1.nextSibling
                        //    );
                        //}
                    }
                }
            */
            //}

            //裝訂線
            var gutter = gBackground.querySelector('#' + idGutter);
            if (!gutter) {
                var tl = 'translate(0,' + padding + ')';
                if (me.getPreviewMode()) {
                    //console.log(me.getPreviewMode());
                    var moveX = 686;
                    if (vm && (vm.templateUrl || (me.getPreviewMode() == 'DraftVerify'))) moveX = 713;
                    var gutterX = page % 2 === 0 ? moveX : 0;
                    tl = 'translate(' + gutterX + ',' + padding + ')';
                }
                var gtr = gutter1.cloneNode(true);
                gtr.id = idGutter;
                gtr.setAttribute("transform", tl);
                gutter1.parentNode.insertBefore(gtr, gutter1.nextSibling);

            }

            //騎縫章
            if (KangDaAppConfig().Seal_A_1) {
                if (page > 2) {
                    var random = Math.floor(Math.random() * 100000000).toString();
                    var groupCount = 5;
                    var iSum = 0;
                    if (random && random.length > 0) {
                        for (var k = 0; k < random.length; k++) {
                            iSum += parseInt(random[k]);
                        }
                    }
                    if (iSum > groupCount) iSum = iSum % groupCount;
                    var sHeight = pageHeight * 1 / 4;
                    var rightSealHTML = KangDaAppConfig().Seal_A_1;
                    var leftSealHTML = KangDaAppConfig().Seal_A_2;
                    switch (iSum) {
                        case 1:
                            sHeight = pageHeight * 1 / 3;
                            rightSealHTML = KangDaAppConfig().Seal_A_1;
                            leftSealHTML = KangDaAppConfig().Seal_A_2;
                            break;
                        case 2:
                            sHeight = pageHeight * 1 / 2;
                            rightSealHTML = KangDaAppConfig().Seal_B_1;
                            leftSealHTML = KangDaAppConfig().Seal_B_2;
                            break;
                        case 3:
                            sHeight = pageHeight - (pageHeight * 1 / 3);
                            rightSealHTML = KangDaAppConfig().Seal_C_1;
                            leftSealHTML = KangDaAppConfig().Seal_C_2;
                            break;
                        case 4:
                            sHeight = pageHeight - (pageHeight * 1 / 4);
                            rightSealHTML = KangDaAppConfig().Seal_D_1;
                            leftSealHTML = KangDaAppConfig().Seal_D_2;
                            break;
                    }
                    //右
                    var sealH = sHeight;
                    //先建上一頁右章
                    var idPagingSealR = "canvas_pagingSeal_" + ((page * 2) - 3);
                    var canvas_pagingSealRight = document.querySelector('#' + idPagingSealR);
                    if (!canvas_pagingSealRight) {
                        var copyPagingSealRight = gBackground.querySelector('#canvas_pagingSeal_1');
                        if (copyPagingSealRight) {
                            copyPagingSealRight.style.visibility = 'visible';
                            var rightSeal_y = copyPagingSealRight.childNodes[0].getAttribute('y');
                            var rightSeal = copyPagingSealRight.cloneNode(true);
                            rightSeal.innerHTML = rightSeal.innerHTML.replace(/png;base64,[^>]*\"/g, rightSealHTML + '\"');
                            rightSeal.id = idPagingSealR;
                            var rightTran = Ext.String.format('translate({0},{1})', 0, (padding - pageHeight) + (sealH - rightSeal_y));
                            rightSeal.setAttribute("transform", rightTran);
                            copyPagingSealRight.parentNode.insertBefore(rightSeal, copyPagingSealRight.nextSibling);
                        }
                    }
                    //再建目前頁左章
                    var idPagingSealL = "canvas_pagingSeal_" + ((page * 2) - 4);
                    var canvas_pagingSealLeft = document.querySelector('#' + idPagingSealL);
                    if (!canvas_pagingSealLeft) {
                        var copyPagingSealLeft = gBackground.querySelector('#canvas_pagingSeal_0');
                        if (copyPagingSealLeft) {
                            copyPagingSealLeft.style.visibility = 'visible';
                            var leftSeal_y = copyPagingSealLeft.childNodes[0].getAttribute('y');
                            var leftSeal = copyPagingSealLeft.cloneNode(true);
                            leftSeal.innerHTML = leftSeal.innerHTML.replace(/png;base64,[^>]*\"/g, leftSealHTML + '\"');
                            leftSeal.id = idPagingSealL;
                            var leftTran = Ext.String.format('translate({0},{1})', 0, (padding + (sealH - leftSeal_y) + 10));
                            leftSeal.setAttribute("transform", leftTran);
                            copyPagingSealLeft.parentNode.insertBefore(leftSeal, copyPagingSealLeft.nextSibling);
                        }
                    }
                }
            }
        }

        var PreviewMode = me.getPreviewMode();
        //console.log(PreviewMode);
        var svgPages = gBackground.querySelectorAll('.canvasPage');
        Ext.Array.each(svgPages, function (p) {
            var isFind = pages.indexOf(p.getAttribute("id")) >= 0;
            if (!isFind) {
                var no = p.getAttribute("id").split('_')[2];
                p.parentNode.removeChild(p);

                //分頁
                var item = gBackground.querySelector('#canvas_interval_' + no);
                if (item) item.parentNode.removeChild(item);

                //裝訂線
                var itemGutter = gBackground.querySelector('#canvas_gutter_' + no);
                if (itemGutter) itemGutter.parentNode.removeChild(itemGutter);

                //騎縫章
                if (!PreviewMode) {
                    var leftPagingSeal = gBackground.querySelector('#canvas_pagingSeal_' + (parseInt(no) - 1));
                    if (leftPagingSeal)
                        parseInt(no) > 2 ? leftPagingSeal.parentNode.removeChild(leftPagingSeal) : leftPagingSeal.style.visibility = 'hidden';

                    var rightPagingSeal = gBackground.querySelector('#canvas_pagingSeal_' + no);
                    if (rightPagingSeal)
                        parseInt(no) > 2 ? rightPagingSeal.parentNode.removeChild(rightPagingSeal) : rightPagingSeal.style.visibility = 'hidden';
                }
            }
        });
    },
    /**
     * 創簽稿及簽核模式全部移除，增加效能
     */
    removeSvgPage: function (root) {
        //console.log('removeSvgPage');
        var me = this;
        if (!root) root = me.getSvgPaper();
        var gBackground =
            root.tagName == "g"
                ? root
                : root.getRootElem().querySelector(".gBackground");
        var object = [];
        var page1 = gBackground.querySelector("#canvas_page_1");
        if (page1) {
            page1.parentNode.removeChild(page1);
        }
        var interval1 = gBackground.querySelector("#canvas_interval_1");
        if (interval1) {
            interval1.parentNode.removeChild(interval1);
        }
        //var interval1_h = parseFloat(interval1.getAttribute("height"));
        var gutter1 = gBackground.querySelector("#canvas_gutter_1");
        if (gutter1) {
            gutter1.parentNode.removeChild(gutter1);
        }
        var pagingSeal_1 = gBackground.querySelector("#canvas_pagingSeal_1");
        if (pagingSeal_1) {
            pagingSeal_1.parentNode.removeChild(pagingSeal_1);
        }

        var pagingSeal_0 = gBackground.querySelector("#canvas_pagingSeal_0");
        if (pagingSeal_0) {
            pagingSeal_0.parentNode.removeChild(pagingSeal_0);
        }
        var watermark_1 = gBackground.querySelector("#canvas_watermark_1");
        if (watermark_1) {
            watermark_1.parentNode.removeChild(watermark_1);
        }

        var svg = this.getSvgPaper();
        if (null == svg) return;
        var layout = OA.common.Utils.removeSupport(me.getFields());

        if (layout.length > 0) {
            var index = layout.length;
            do {
                var exit = false;
                index--;
                if (layout[index] && layout[index].key && layout[index].key !== '決行層級') {
                    var key = layout[index].key;
                    var lastElem;
                    if (layout[index].key == "署名") {    //署名特別處理
                        var int = 1;
                        key = "署名_1";
                        lastElem = svg.getElem(key);
                        if (lastElem) {
                            var elemSA
                            do {
                                int = int + 1;
                                elemSA = svg.getElem("署名_" + int);
                                if (elemSA) lastElem = elemSA;
                            } while (elemSA);
                        } else {
                            lastElem = svg.getElem('署名_title');
                        }
                    } else {
                        lastElem = svg.getElem(key);
                        if (!lastElem) {
                            lastElem = svg.getElem(key + '_title');
                        }
                        if (svg.getElem("gSeal")) {  //有顯示核章欄，Elem改取核章欄
                            lastElem = svg.getElem("gSeal");
                        }
                    }
                    if (lastElem) {
                        var lastY = parseInt(Ext.clone(lastElem.getAttribute("y")));
                        if (lastY) {
                            var page_default_height = OA.common.DIMgr.getPageHeight();
                            var ratio = svg.getZoom();

                            //除於page_default__height，有餘數無條件進一位
                            var page = parseInt(lastY / page_default_height);
                            var page_new_height = Ext.clone(page_default_height);
                            if (page > 0) {
                                page_new_height = (page + 1) * page_default_height;
                            }

                            //如果有顯示核章欄，要補上核章欄高度
                            var elemSeal = svg.getElem("gSeal");
                            if (elemSeal) {
                                page_new_height = page_new_height + elemSeal.getBBox().height;
                            }
                            svg.updateCanvas(me.getReviseWidth() * ratio, page_new_height * ratio);
                            exit = true;
                        }
                    }
                }

                if (index == 0) exit = true;

            } while (!exit)
        }
    },
    /**
     * 視圖重刷
     */
    updateSvgCanvas: function (max) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var svg = this.getSvgPaper();
        if (null == svg) return;

        var ratio = svg.getZoom();
        var page_new_height = max;
        if (!max) {
            me.initMaxMargin(me.getPage());
            page_new_height = me.getMaxMargin() + me.getMarginBottom();
        }
        if (qs.app === "approve" || qs.app === "editor" || qs.app === "draft" ||
            qs.app === "check" || qs.app === "async") {
            me.removeSvgPage();
        } else {
            svg.updateCanvas(me.getReviseWidth() * ratio, page_new_height * ratio);
        }
        //svg.updateCanvas(me.getReviseWidth() * ratio, page_new_height * ratio);
    },
    /**
     * 重定Y點
     * 修正因分頁
     */
    setPosY: function (el, y) {
        //console.log(Ext.String.format('p.{0} y={1} max={2} text={3}',
        //    this.getPage(), y.toFixed(2), this.getMaxMargin().toFixed(2), el.textContent.substring(0, 10)));
        var max = this.getMaxMargin();

        var qs = OA.common.Global.getQ();
        //創簽稿及簽核模式不增頁
        if (qs.app === "approve" || qs.app === "editor" || qs.app === "draft" ||
            qs.app === "check" || qs.app === "async") {
            if (!isNaN(y)) el.setAttribute("y", y);
            return y;
        }

        if (y > max) {
            y = this.getUpperMargin() + this.getClientHeight(el);
            this.addPaging(el);
        }

        if (!isNaN(y)) el.setAttribute("y", y);

        // var padding =Math.floor(y)-Math.floor(el.getAttribute("y"));
        // el.setAttribute('transform','translate(0,' + padding + ')');
        return y;
    },
    /**
     * svg 處理自動換行
     */
    setWrap: function (textnode, x_pos, y_pos, boxwidth, linegap) {
        //console.log(textnode);
        var me = this;
        var vm = OA.common.Global.getCurrentViewModel();
        var setting = me.getSetting(me.getFields(), vm.KDRichTextBlockList[0].id);
        var follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - me.getCurrentX(); //wrap
        var padding = 0;
        if (!linegap) linegap = 0;
        var line_height = me.getLineHeight(textnode) + linegap;

        // if (!this.getSvgPaper()) return;
        // var svgElem = this.getSvgPaper().getRootElem();

        if (!this.getSvgPaper()) {
            svgElem = textnode.parentNode;
        } else {
            var svgElem = this.getSvgPaper().getRootElem();
        }

        // Clone the original text node to store and display the final wrapping text.
        var wrapping = textnode.cloneNode(false); // False means any TSPANs in the textnode will be discarded
        wrapping.setAttributeNS(null, 'visibility', 'hidden');
        wrapping.setAttributeNS(null, 'x', x_pos + padding);
        wrapping.setAttributeNS(null, 'y', y_pos + padding);
        // Make a copy of this node and hide it to progressively draw, measure and calculate line breaks.
        var testing = wrapping.cloneNode(false);
        testing.setAttributeNS(null, 'visibility', 'hidden');  // Comment this out to debug

        var testingTSPAN = document.createElementNS(null, 'tspan');
        var testingTEXTNODE = document.createTextNode(textnode.textContent);
        testingTSPAN.appendChild(testingTEXTNODE);

        testing.appendChild(testingTSPAN);
        svgElem.appendChild(testing);

        var words = textnode.textContent.split("");

        var IStemplateUrlWrap = false; //判斷表單是否有手動換行符號
        if (vm && vm.templateUrl) {
            if (words.indexOf('\n').length != -1) IStemplateUrlWrap = true;
        }

        //console.log(IStemplateUrlWrap);

        var line = "", line2 = "", linecounter = 0, testwidth, appendWord = '';
        var count = words.length, numLength = 0, vocLength = 0;
        //console.log(words);

        //刪除線文字，不逐字計算，改用段落計算，增加效能
        //if (Ext.getCmp('cpaper').getIsStrikeText() && textnode.id.indexOf('KDRichTextBlock') >= 0) {
        //    count = textnode.childNodes.length;
        //    words = textnode.childNodes;
        //    for (var n = 0; n < count; n++) {
        //        line2 = line + words[n].textContent + appendWord;
        //        testing.textContent = line2;
        //        testwidth = me.getClientWidth(testing);

        //        //超過邊界，換行
        //        var isTurn = (testwidth + 2 * padding) > boxwidth;
        //        if (isTurn) {
        //            console.log(testingTSPAN);
        //            testingTSPAN = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        //            testingTSPAN.setAttributeNS(null, 'x', x_pos + padding);
        //            testingTSPAN.setAttributeNS(null, 'dy', line_height);
        //            //分散對齊
        //            testingTSPAN.setAttributeNS(null, 'textLength', Math.abs(boxwidth));
        //            testingTEXTNODE = document.createTextNode(line);
        //            testingTSPAN.appendChild(testingTEXTNODE);
        //            wrapping.appendChild(testingTSPAN);
        //            line = words[n].textContent + appendWord;
        //        } else {
        //            line = line2
        //        }
        //    }
        //} else {
        for (var n = 0; n < count; n++) {
            line2 = line + words[n] + appendWord;
            testing.textContent = line2;
            testwidth = me.getClientWidth(testing);

            //超過邊界，換行
            var isTurn = (testwidth + 2 * padding) > boxwidth;



            //數字時，強制不換行
            if (Ext.isNumeric(words[n])) {
                numLength++;
                isTurn = false;

                //數字成行時，造成過長
                var isOver = (testwidth + 2 * padding) > boxwidth;
                if (isOver) {
                    //長度超過1時才截取
                    if (line2.length - numLength > 1) {
                        line = line2.substring(0, line2.length - numLength);
                        n = n - numLength + 1;
                    }
                    isTurn = true;
                }
            } else {
                numLength = 0; //內含數字未過邊界
            }

            //單字不成行
            var pattern = /[a-zA-Z]/g;
            if (pattern.test(words[n])) {
                vocLength++;
                isTurn = false;

                //英文單字成行時，造成過長
                var isOverVoc = (testwidth + 2 * padding) > (boxwidth);
                if (isOverVoc) {
                    //長度超過1時才截取
                    if (line2.length - vocLength > 1) {
                        line = line2.substring(0, line2.length - vocLength);
                        n = n - vocLength + 1;
                    }
                    isTurn = true;
                }
            } else {
                vocLength = 0; //內含單字未過邊界
            }

            //單一符號不成行
            if (isTurn) {
                var symbol = words[n].match(/[!"\[\]{}%^&*:@~#';.<>。\\|`]/g);
                if (symbol) isTurn = false;
            }

            //表單遇到換行符號強制換行，不分散對齊
            if (IStemplateUrlWrap && words[n] == '\n') {
                isTurn = true;
            }

            if (isTurn) {
                numLength = 0;
                vocLength = 0;

                testingTSPAN = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                testingTSPAN.setAttributeNS(null, 'x', x_pos + padding);
                testingTSPAN.setAttributeNS(null, 'dy', line_height);

                //分散對齊
                if (!IStemplateUrlWrap)//表單換行不做分散對齊
                    testingTSPAN.setAttributeNS(null, 'textLength', Math.abs(boxwidth));


                // var lSpace = line.match(/^\s*/);
                var rSpace = line.match(/\s+$/);
                //
                // var formatCdata = '![CDATA[{0}]]';
                // var cdata;
                // if (lSpace && lSpace[0].length > 0) {
                //     cdata = Ext.String.format('![CDATA[{0}]]', ' '.repeat(lSpace[0].length));
                //     line = cdata + line.substring(lSpace[0].length);
                // }
                // if (rSpace && rSpace[0].length > 0) {
                //     cdata = Ext.String.format('![CDATA[{0}]]', ' '.repeat(rSpace[0].length));
                //     line = line.substring(0, line.length - rSpace[0].length) + cdata;
                // }

                // console.log(line);
                // console.log(rSpace);
                testingTEXTNODE = document.createTextNode(line);
                testingTSPAN.appendChild(testingTEXTNODE);
                wrapping.appendChild(testingTSPAN);

                line = words[n] + appendWord;
                linecounter++;
            }
            else {
                line = line2;
            }
        }
        //}
        // console.log(line);
        testingTSPAN = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');

        //箋函主旨下一行的姓名前方應挪抬一全型空格
        var modelName = OA.client.WK.getCurrentModelName();
        //console.log(modelName);
        if (modelName) {
            if (modelName.indexOf('Letterhead') >= 0) {
                if (wrapping.id == 'KDRichTextBlock_1_context') {
                    padding = 22;
                }
            }
        }
        if (modelName) {
            if (modelName.indexOf('MayorNote') >= 0 &&
                wrapping.id !== 'KDRichTextBlock_0_context' && wrapping.id !== 'KDRichTextBlock_1_context') {
                if (wrapping.id == 'KDRichTextBlock_2_context') {
                    var allTspan = wrapping.querySelectorAll('tspan')
                    if (allTspan && allTspan.length > 0) {
                        Ext.Array.each(allTspan, function (tspan, index) {
                            tspan.setAttribute('x', setting.x + 44);
                            if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                        })
                    } else {
                        wrapping.setAttribute('x', setting.x + 44);
                        if (wrapping.getAttribute('textLength')) wrapping.setAttribute('textLength', follow_boxWidth - 44);
                    }
                    padding = 44;
                } //else if (wrapping.id == 'KDRichTextBlock_3_context') {
                else if (wrapping.id.indexOf('_context') != -1) {
                    var allTspan = wrapping.querySelectorAll('tspan')
                    if (allTspan && allTspan.length > 0) {
                        Ext.Array.each(allTspan, function (tspan, index) {
                            //console.log(Ext.clone(follow_boxWidth));
                            if (index == 0) {
                                tspan.setAttribute('x', setting.x + 80);
                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 80);
                            } else {
                                tspan.setAttribute('x', setting.x + 44);
                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                            }
                        })
                    } else {
                        wrapping.setAttribute('x', setting.x + 80);
                        if (wrapping.getAttribute('textLength')) wrapping.setAttribute('textLength', follow_boxWidth - 80);
                    }
                    //padding = 80;
                }
            }
        }

        //console.log(wrapping);

        testingTSPAN.setAttributeNS(null, 'x', x_pos + padding);
        testingTSPAN.setAttributeNS(null, 'dy', line_height);
        testingTEXTNODE = document.createTextNode(line);
        testingTSPAN.appendChild(testingTEXTNODE);

        wrapping.appendChild(testingTSPAN);

        me.tspanWrapping(wrapping, textnode);

        if (testing.parentNode) testing.parentNode.removeChild(testing);

        if (textnode.parentNode) textnode.parentNode.replaceChild(wrapping, textnode);

        wrapping.setAttributeNS(null, 'visibility', 'visible');
        wrapping.style.visibility = 'visible';
        return wrapping;
    },
    /**
     * svg 處理自動換行，表單
     */
    setWrapBoundary: function (textnode, x_pos, y_pos, boxwidth, boxheight, linegap) {
        var me = this;
        var padding = 0;
        if (!linegap) linegap = 0;
        var line_height = me.getLineHeight(textnode) + linegap;

        // if (!this.getSvgPaper()) return;
        // var svgElem = this.getSvgPaper().getRootElem();

        if (!this.getSvgPaper()) {
            svgElem = textnode.parentNode;
        } else {
            var svgElem = this.getSvgPaper().getRootElem();
        }

        // Clone the original text node to store and display the final wrapping text.
        var wrapping = textnode.cloneNode(false); // False means any TSPANs in the textnode will be discarded
        wrapping.setAttributeNS(null, 'visibility', 'hidden');
        wrapping.setAttributeNS(null, 'x', x_pos + padding);
        wrapping.setAttributeNS(null, 'y', y_pos + padding);
        // Make a copy of this node and hide it to progressively draw, measure and calculate line breaks.
        var testing = wrapping.cloneNode(false);
        testing.setAttributeNS(null, 'visibility', 'hidden');  // Comment this out to debug

        var testingTSPAN = document.createElementNS(null, 'tspan');
        var testingTEXTNODE = document.createTextNode(textnode.textContent);
        testingTSPAN.appendChild(testingTEXTNODE);

        testing.appendChild(testingTSPAN);
        svgElem.appendChild(testing);

        var words = textnode.textContent.split("");
        var line = "", line2 = "", linecounter = 0, testwidth, appendWord = '';
        var count = words.length, numLength = 0, vocLength = 0;
        // console.log(words);
        for (var n = 0; n < count; n++) {
            line2 = line + words[n] + appendWord;
            testing.textContent = line2;
            testwidth = me.getClientWidth(testing);

            //超過邊界，換行
            var isTurn = (testwidth + 2 * padding) > boxwidth;

            //數字時，強制不換行
            if (Ext.isNumeric(words[n])) {
                numLength++;
                isTurn = false;

                //數字成行時，造成過長
                var isOver = (testwidth + 2 * padding) > boxwidth;
                if (isOver) {
                    //長度超過1時才截取
                    if (line2.length - numLength > 1) {
                        line = line2.substring(0, line2.length - numLength);
                        n = n - numLength + 1;
                    }
                    isTurn = true;
                }
            } else {
                numLength = 0; //內含數字未過邊界
            }

            //單字不成行
            var pattern = /[a-zA-Z]/g;
            if (pattern.test(words[n])) {
                vocLength++;
                isTurn = false;

                //英文單字成行時，造成過長
                var isOverVoc = (testwidth + 2 * padding) > (boxwidth);
                if (isOverVoc) {
                    //長度超過1時才截取
                    if (line2.length - vocLength > 1) {
                        line = line2.substring(0, line2.length - vocLength);
                        n = n - vocLength + 1;
                    }
                    isTurn = true;
                }
            } else {
                vocLength = 0; //內含單字未過邊界
            }

            //單一符號不成行
            if (isTurn) {
                var symbol = words[n].match(/[!"\[\]{}%^&*:@~#';.<>。\\|`]/g);
                if (symbol) isTurn = false;
            }
            if (isTurn) {
                numLength = 0;
                vocLength = 0;

                testingTSPAN = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                testingTSPAN.setAttributeNS(null, 'x', x_pos + padding);
                testingTSPAN.setAttributeNS(null, 'dy', line_height);

                //分散對齊
                testingTSPAN.setAttributeNS(null, 'textLength', Math.abs(boxwidth));

                var rSpace = line.match(/\s+$/);

                testingTEXTNODE = document.createTextNode(line);
                testingTSPAN.appendChild(testingTEXTNODE);
                wrapping.appendChild(testingTSPAN);

                line = words[n] + appendWord;
                linecounter++;
                //console.log(linecounter);

            }
            else {
                line = line2;
            }
            if ((line_height * (linecounter + 1)) + line_height > boxheight) {
                break;
            }
        }
        // console.log(line);
        testingTSPAN = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');

        testingTSPAN.setAttributeNS(null, 'x', x_pos + padding);
        testingTSPAN.setAttributeNS(null, 'dy', line_height);
        testingTEXTNODE = document.createTextNode(line);
        testingTSPAN.appendChild(testingTEXTNODE);

        wrapping.appendChild(testingTSPAN);

        me.tspanWrapping(wrapping, textnode);

        if (testing.parentNode) testing.parentNode.removeChild(testing);

        if (textnode.parentNode) textnode.parentNode.replaceChild(wrapping, textnode);

        wrapping.setAttributeNS(null, 'visibility', 'visible');
        wrapping.style.visibility = 'visible';
        return wrapping;
    },
    /**
     *
     */
    tspanWrapping: function (wrapping, textnode) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var _y = parseFloat(wrapping.getAttributeNS(null, 'y'));
        var vm = OA.common.Global.getCurrentViewModel();

        // OA.common.Utils.addLine('max', me.getMaxMargin(), 'red');

        //創簽稿及簽核模式不增頁
        if (qs.app === "approve" || qs.app === "editor" || qs.app === "draft" ||
            qs.app === "check" || qs.app === "async") {
            return;
        }

        Ext.Array.each(wrapping.childNodes, function (n, idx) {
            var cur_dy = parseFloat((n.getAttributeNS(null, 'dy')));
            _y = _y + cur_dy;
            // console.log(Ext.String.format('p.{0} max={1} text={2}...', me.getPage(), me.getMaxMargin().toFixed(2), n.textContent.substring(0, 5)));
            if (_y > me.getMaxMargin()) {

                //一文多發受文者長度換行造成換頁兩次,會造成
                var notWork = ['Send', 'Send2', 'Multiple', 'Divide', 'General'].indexOf(me.getPreviewMode()) >= 0;
                if (notWork) {
                    var tspans = textnode.querySelectorAll('tspan');
                    if (tspans.length == 0) return true;
                }


                var curcls = n.getAttribute(null, 'class');

                var _dy = me.getUpperMargin() - _y + cur_dy + cur_dy;
                n.setAttributeNS(null, 'dy', _dy.toString());
                n.setAttribute('class', 'turn');

                var cls = wrapping.getAttribute('class');
                var oldClassName = cls;
                // oldClassName為null時會報錯，導致字數限制功能異常，會跑版 - by yi-chi chiu
                if (oldClassName) {
                    var newClassName = (oldClassName.indexOf('_over') >= 0) ? cls : cls + '_over';
                    wrapping.setAttribute('class', newClassName);
                }
                // var newClassName = (oldClassName.indexOf('_over') >= 0) ? cls : cls + '_over';
                // wrapping.setAttribute('class', newClassName);
                _y = _y + _dy - cur_dy;
                //修正回來

                //表單除（簽稿會核單、會銜會辦單）都不做addPaging
                if (vm && vm.templateUrl) {
                    if (vm.templateUrl !== 'web/DraftVerify.svg' && vm.templateUrl !== 'web/MultiOgnUnit.svg')
                        return;
                }
                me.addPaging(textnode);
            }
        });
    },
    /**
     *
     */
    tspanWrappingRevise: function (wrapping, follow_y) {
        var me = this;

        wrapping.setAttribute("y", follow_y);
        var _y = parseFloat(wrapping.getAttributeNS(null, 'y'));
        var first = wrapping.childNodes[0];
        var cur_dy = parseFloat((first.getAttributeNS(null, 'dy')));
        Ext.Array.each(wrapping.childNodes, function (n) {
            _y = _y + cur_dy;
            // console.log(Ext.String.format('p.{0} max={1} text={2}', me.getPage(), me.getMaxMargin().toFixed(2),n.textContent.substring(0,5)));

            if (_y > me.getMaxMargin()) {
                var _dy = me.getUpperMargin() - _y + cur_dy + cur_dy;
                n.setAttributeNS(null, 'dy', _dy.toString());
                var oldClassName = wrapping.getAttribute('class');
                var newClassName = (oldClassName.indexOf('_over') >= 0) ? wrapping.getAttribute('class') : wrapping.getAttribute('class') + '_over';
                wrapping.setAttribute('class', newClassName);
                _y = _y + _dy - cur_dy; //修正回來
                me.addPaging(wrapping);
            } else {
                n.setAttributeNS(null, 'dy', cur_dy.toString());
            }
        });
        return _y;
    },
    getUpperMargin: function () {
        var me = this;

        if (!me.getSvgPaper()) return;
        // OA.common.Utils.testLine('line' +  me.getPage(), me.getMaxMargin());

        var bottomMargin = me.getMarginTop() + me.getWorkHeight();
        var interval = me.getSvgPaper().getElem('canvas_interval_1');
        var h_interval = 0;
        if (interval) {
            h_interval = parseFloat(interval.getAttribute("height"));
            //interval.visibility = "hidden";
        }
        //var h_interval = parseFloat(interval.getAttribute("height"));
        var pagging = h_interval + me.getMarginTop() + me.getMarginBottom();

        //var maxUpperMargin = bottomMargin + (me.getPage() * (me.getWorkHeight() + me.getPagingHeight()))+pagging;
        //console.log(me.getPage());
        //var maxUpperMargin = (me.getPage() * me.getPageHeight())+h_interval + me.getMarginTop();
        //OA.common.Utils.testBlueLine("UpperMargin_" + (me.getPage() + 2), maxUpperMargin);
        //OA.common.Utils.testLine(wrapping.getAttribute('id') + "_test", nextUpperMargin);
        //OA.common.Utils.testLine(wrapping.getAttribute('id') + "_test", _y-cur_dy);

        var upperMargin = bottomMargin + (me.getPage() * (me.getWorkHeight() + pagging)) + pagging;

        // OA.common.Utils.testLine('line' + me.getPage(), upperMargin - me.getMarginTop() - h_interval);

        return upperMargin;
    },
    /**
     * 核章區加大, 核章欄高度增加, 高度向上拉伸
     *   高市府三代公文, 第 6 次專案工作會議 - (三)
     */
    increaseHeightSeal: function (addHeight) {
        var wk = OA.common.Global.getCurrentWKContent();
        if(wk.DocumentTemplate !== "函稿(核章區加大)" && wk.DocumentTemplate !== "簽(核章區加大)") {
            return 0;
        }
        const svg = this.getSvgPaper();
        const gContent = svg.getCurrentDrawing().getCurrentLayer();
        const els = gContent.childNodes;
        els.forEach(el => {
            if(el.id === 'gSeal'){
                const lineList = el.querySelectorAll('line');
                lineList.forEach((line, index) => {
                    if(index === 0) {
                        line.setAttribute('y1', (line.getAttribute('y1') - addHeight));
                        line.setAttribute('y2', (line.getAttribute('y2') - addHeight));
                    } else if(index === 1) {
                        line.setAttribute('y1', (line.getAttribute('y1') - addHeight));
                    } else if(index === 2) {
                    } else if(index === 3) {
                        line.setAttribute('y2', (line.getAttribute('y2') - addHeight));
                    } else if(index === 4) {
                        line.setAttribute('y1', (line.getAttribute('y1') + 30 - addHeight));
                        line.setAttribute('y2', (line.getAttribute('y2') + 30 - addHeight));
                    }
                });
                // 核章區, 內層欄位向上位移。
                const textList = el.querySelectorAll('text')
                textList.forEach(text => {
                    if(text.id === 'totalnumber') return;
                    text.setAttribute('y', (text.getAttribute('y') - addHeight));
                });
            }
        });
    },
    /**
     * 核章區
     */
    moveSeal: function (pos_y) {
        
        var me = this;
        var location = OA.common.DIMgr.getSealLocation();
        var mode = this.getPreviewMode();
        var svg = this.getSvgPaper();
        var elemSeal = svg.getElem("gSeal");
        var totalnum = svg.getElem("totalnumber");
        var elemUnitTitle = svg.getElem("會辦單位_title");
        var elemUnit = svg.getElem("會辦單位");
        var elemLV = svg.getElem("決行層級_title");
        var elemSA = svg.getElem("署名_1");

        var wk = OA.common.Global.getCurrentWKContent();
        // 核章區加大
        const isGSealBigger = wk.DocumentTemplate === "函稿(核章區加大)" || wk.DocumentTemplate === "簽(核章區加大)"
        //if (wk && wk.DocumentType == '單一陳情系統案件回復表')
        //    elemUnitTitle = svg.getElem('聯絡電話_title');

        // if (previewMode == 'Draft') {
        var qs = OA.common.Global.getQ();
        if (!elemSeal) {
            if (elemUnitTitle) elemUnitTitle.setAttribute("opacity", "0");
            if (elemUnit) elemUnit.setAttribute("opacity", "0");
            if (elemLV) elemLV.setAttribute("opacity", "0");
            return;
        }

        //決行層級
        var isSealShow = "1";
        // if (qs.epaper !== "N") isSealShow = 0;  //核章欄顯示決行層級
        if (elemLV) elemLV.setAttribute("opacity", isSealShow);

        if (elemSeal.getAttribute("opacity") == "0") return;

        var hUnit =
            Math.max(
                this.getClientHeight(elemUnitTitle),
                this.getClientHeight(elemUnit)
            ) - 5;
        var sealBaseY = parseFloat(OA.common.DIMgr.getSealY());
        var yUnitTitle = sealBaseY - hUnit;


        var dy = 0.0;
        if (elemUnit) {
            if (elemUnit.firstChild) {
                if (elemUnit.firstChild.getAttribute != undefined) {
                    dy = parseFloat(elemUnit.firstChild.getAttribute("dy"));
                    elemUnit.firstChild.setAttribute("dy", "0");
                }
            }
        }


        if (location == "top" && mode == 'Draft' && qs.app !== 'preview') {

            if (!pos_y) {
                //OA.common.Utils.addLine('yUnitTitle',yUnitTitle,'blue');
                if (elemUnitTitle) elemUnitTitle.setAttribute("y", yUnitTitle + 5);
                if (elemUnit) elemUnit.setAttribute("y", yUnitTitle + 5);
                this.initMaxMargin(this.getPage(), yUnitTitle - 10, dy);
                if (svg.getMode() == "textedit") {
                    var $text = $("#text");
                    var cur = $text[0].selectionStart;
                    var chardata = svg.textActions.getChardata()[cur];
                    if (chardata) {
                        var isPageOver = chardata.y > yUnitTitle;

                        if (isPageOver) {
                            var ctr = me.up("ctnPaper").getScrollable().getScroller();
                            ctr.scrollTo(0, yUnitTitle);
                            // svg.textActions.setCursor($text.selectionEnd);
                        }
                    }
                }
            } else {
                this.initMaxMargin(this.getPage(), '', '', true);
            }
            if (elemLV) {
                var yLV = elemSeal.getBBox().y;
                var hLV = this.getClientHeight(elemLV);
                elemLV.setAttribute("y", yLV + hLV);
            }
        } else {
            if (!pos_y) return; //核章區隨文時，最後取得座標

            // if (elemLV) elemLV.setAttribute("y", me.getMarginTop());  //核章欄 決行層級 Chloe.sia
            var sealHeight = parseFloat(this.getSealHeight());
            var sealY = pos_y + sealHeight + hUnit;
            var max = this.getMaxMargin();
            var padding = pos_y - sealBaseY + hUnit;
            var r = me.getPage();

            //第一頁時置於下方
            //console.log(pos_y);
            //有署名時需把署名高度增加到核章欄記算
            var addPadding = 0;
            if (elemSA) {
                //計算署名筆數
                addPadding = 15;
                var int = 1;
                do {
                    if (elemSA.textContent.trim() !== "") {
                        addPadding = int == 1 ? addPadding + 40 : addPadding + 10; //每筆署名增加高度
                    }
                    int = int + 1;
                    elemSA = svg.getElem("署名_" + int);
                } while (elemSA);

                //依署名高度重新調整核章欄相關數值
                sealHeight = sealHeight + addPadding; //核章欄+署名高度
                sealY = pos_y + sealHeight + addPadding; //核章欄位置（署名+核章欄+目前posy）
                padding =
                    sealY - OA.common.DIMgr.getSealY() - sealHeight + (addPadding - int * 15);
            } else if (sealBaseY > padding) {
                //開啟舊檔後修正
                padding = pos_y - elemSeal.getBBox().y + 30;
            }

            if (wk && wk.DocumentType == '令' || wk.DocumentType == '簽' || wk && wk.DocumentType == '便簽' || wk && wk.DocumentType == '箋函' || wk && wk.DocumentType == '公示送達') {
                sealY = pos_y + sealHeight + 80; //簽類型及箋函核章欄位置（核示+核章欄）
            }

            //save 時重刷已更新y ,故不再padding
            if (
                Math.round(elemSeal.getBBox().y) >=
                Math.round(OA.common.DIMgr.getSealY())
            ) {
                padding =
                    sealY - sealHeight - elemSeal.getBBox().y + addPadding + hUnit + 20;

            }

            //換頁後核章欄高度要複原
            if (sealY > max) {
                sealHeight = OA.common.DIMgr.getSealHeight();
                sealBaseY = parseFloat(OA.common.DIMgr.getSealY());
            }

            yUnitTitle = padding + elemSeal.getBBox().y + 5;

            //換頁時(留4cm空間時換頁)
            if (sealY - 80 > max) {
                if (qs.app === "approve" || qs.app === "editor" || qs.app === "draft") {

                } else {
                    padding = max + me.getPagingHeight() - sealBaseY + 40 + hUnit;
                    me.addPaging();
                }
            }

            if (elemLV) { //核章欄 決行層級
                elemLV.setAttribute("y", padding + totalnum.getBBox().y - 260 - (isGSealBigger?40:0));
            }
            padding = padding + (isGSealBigger?60:0);
            console.log('moveSeal : ', padding);
            var tl = "translate(0," + padding + ")";
            elemSeal.setAttribute("transform", tl);
            yUnitTitle = padding + elemSeal.getBBox().y + 5;

            //核章欄 會辦單位文字長度擷取
            if (elemUnit) {
                if (elemUnit.textContent.length > 36) {
                    var substr = elemUnit.textContent.substring(0, 36);
                    var lastnum = substr.lastIndexOf("、");
                    substr = substr.substring(0, lastnum) + "等";
                    elemUnit.textContent = substr;
                }
                elemUnitTitle.setAttribute("y", padding + totalnum.getBBox().y - 290 - (isGSealBigger?100:0));
                elemUnit.setAttribute("y", padding + totalnum.getBBox().y - 290 - (isGSealBigger?100:0));
            }

        }
        return pos_y;
    },

    moveSealTDGK: function (pos_y, key) {
        var me = this;
        var location = OA.common.DIMgr.getSealLocation();
        var svg = this.getSvgPaper();
        var elemSeal = svg.getElem('gSeal');
        var elemUnitTitle = svg.getElem('會辦單位_title');
        var elemUnit = svg.getElem('會辦單位');
        var elemLV = svg.getElem('決行層級_title');
        var elemSA = svg.getElem('署名_1');
        var modelName = OA.client.WK.getCurrentModelName();
        //var qs = OA.common.Global.getQ();
        //if (!elemSeal) {
        //    if (elemUnitTitle) elemUnitTitle.setAttribute('opacity', '0');
        //    if (elemUnit) elemUnit.setAttribute('opacity', '0');
        //    if (elemLV) elemLV.setAttribute('opacity', '0');
        //    return;
        //}

        //if (elemUnitTitle) elemUnitTitle.setAttribute('opacity', '0');
        //if (elemUnit) elemUnit.setAttribute('opacity', '0');;

        //決行層級
        //var isSealShow = '1';
        //if (qs.epaper !== 'N') isSealShow = 0;
        //if (elemLV) elemLV.setAttribute('opacity', isSealShow);

        //if (elemSeal.getAttribute('opacity') == '0') return;

        //var hUnit = Math.max(this.getClientHeight(elemUnitTitle), this.getClientHeight(elemUnit)) - 5;
        //var sealBaseY = parseFloat(OA.common.DIMgr.getSealY());
        //console.log(sealBaseY);
        //var yUnitTitle = sealBaseY - hUnit;
        //0827 簽類型，移除seal 核章欄 Chloe.sia



        if (modelName == 'OA.model.wk.Notes' || modelName == 'OA.model.wk.NoteSticky' || modelName == 'OA.model.wk.NoteEasy' ||
            modelName == 'OA.model.wk.NoteMemo' || modelName == 'OA.model.wk.NotesTop' ||
            modelName == 'OA.model.wk.NotesOpinion') {
            if (elemSeal) elemSeal.parentNode.removeChild(elemSeal);

            //if (elemLV) elemLV.setAttribute('opacity', '0');
        }

        //console.log(elemUnitTitle);

        //無選入會辦單位時文稿畫面不顯示
        if (elemUnitTitle && elemUnit) {
            if ((elemUnit.textContent) + '' == '') {
                elemUnitTitle.setAttribute('opacity', '0');
                elemUnit.setAttribute('opacity', '0');
            }
        }

        if (elemSeal) {
            //console.log(me.getMarginLeft());
            //console.log(pos_y);
            var t2 = 'translate(0,' + pos_y + ')';
            elemSeal.setAttribute("transform", t2);
            //elemSeal1.setAttribute('visibility', 'hidden');
        }
        //if (!elemUnitTitle) return;

        //var dy = 0.0;
        //if (elemUnit) {
        //    if (elemUnit.firstChild) {
        //        if (elemUnit.firstChild.getAttribute != undefined) {
        //            dy = parseFloat(elemUnit.firstChild.getAttribute('dy'));
        //            elemUnit.firstChild.setAttribute('dy', '0');
        //        }
        //    }
        //}

    },
    /**
     * 核章區
     */
    visibleSeal: function (isVisible) {
        var svg = this.getSvgPaper();
        if (!svg) return;

        var elemSeal = svg.getElem('gSeal');
        var elemUnitTitle = svg.getElem('會辦單位_title');
        var elemUnit = svg.getElem('會辦單位');
        var elemLV = svg.getElem('決行層級_title');
        var strVisible = (isVisible) ? 'visible' : 'hidden';

        if (elemSeal) elemSeal.setAttribute('visibility', strVisible);
        if (elemUnitTitle) elemUnitTitle.setAttribute('visibility', strVisible);
        if (elemUnit) elemUnit.setAttribute('visibility', strVisible);
        if (elemLV) elemLV.setAttribute('visibility', strVisible);
    },
    /**
     * 核章區
     */
    deleteSeal: function () {
        var svg = this.getSvgPaper();

        if (!svg) return;

        var elemSeal = svg.getElem('gSeal');
        var elemUnitTitle = svg.getElem('會辦單位_title');
        var elemUnit = svg.getElem('會辦單位');
        var elemLV = svg.getElem('決行層級_title');

        if (elemSeal) elemSeal.parentNode.removeChild(elemSeal);
        if (elemUnitTitle) elemUnitTitle.parentNode.removeChild(elemUnitTitle);
        if (elemUnit) elemUnit.parentNode.removeChild(elemUnit);
        if (elemLV) elemLV.parentNode.removeChild(elemLV);
    },
    /**
     * 更新換行形文字區
     */
    updateWrapElem: function (elem, updateId, text) {
        var me = this;
        var originalElem = elem.querySelector('#' + updateId);
        if (originalElem) {
            originalElem.textContent = text;
            var x_pos_original = parseFloat(originalElem.getAttribute("x"));
            var y_pos_original = parseFloat(originalElem.getAttribute("y"));
            var boxWidth_original = me.getPageWidth() - x_pos_original - me.getMarginRight();
            me.setWrap(originalElem, x_pos_original, y_pos_original, boxWidth_original, 0);
        }
    },
    /**
     * 合併樣式:重新切片重組
     */
    mergeStyle: function (root, el, isClear) {
        var me = this;
        var mu = me.multiFormatQuery(el.id);
        if (!mu || !mu.multiFormat) return;
        //if (!mu) return;

        if (mu.multiFormat.length == 0) {
            //檢核el中是否有文字，沒有文字return
            if (el.textContent.length == 0 || (el.textContent + "").trim() == "") return;
        }
        var pos = 0, pos_prev = 0, pos_prev_max = 0, _x = 0.0, _dy = 0;
        var _textLength;
        // if (el.firstChild && el.firstChild.getAttribute) {
        //     _textLength = el.firstChild.getAttribute("textLength");
        // }
        //chrome 96版更新造成文字寬度計算異常
        if (el.firstChild && el.firstChild.getAttribute) {
            //_textLength = el.firstChild.getAttribute("textLength");
            // console.log(el.firstChild.getAttribute("textLength"));
        }

        var points = me.getBreakPoints(el);
        var x_start = parseFloat(el.getAttribute("x"));

        var nodeNew = el.cloneNode(true);
        nodeNew.setAttributeNS(null, 'visibility', 'hidden');
        nodeNew.textContent = '';

        // console.log(el);
        // console.log(mu.multiFormat);

        var pos_cur = 0;
        var revise = {};
        Ext.Array.each(mu.multiFormat, function (item, idx) {
            var itemText = (item.text) ? item.text : '';
            if (idx == 0) {
                _x = x_start;
            } else {
                _x = null;
                _dy = null;
            }
            pos = pos + itemText.length;
            var maxPoints = me.getMaxPos(points, pos, pos_prev);
            //console.log('---------------------------------------');
            //console.log(item.text);
            //console.log(item);
            //console.log(maxPoints);
            //console.log('----------------------------------------');
            item.fromBindId = mu.bindId;
            item.fromItemIdx = idx;
            Ext.Array.each(maxPoints, function (p) {
                var items = [], newItem, newText;
                if (pos > pos_prev_max) {
                    newItem = Ext.clone(item);
                    if (pos > p.rowX) {
                        //console.log(Ext.clone(item).text);
                        //console.log(newItem.text);

                        if (pos_prev_max == p.rowX) {
                            pos_cur = pos_prev_max - pos_prev;
                            newText = itemText.substring(0, pos_prev_max - pos_prev);

                            if (revise.x) _x = revise.x
                            if (revise.dy) _dy = revise.dy;
                        }
                        else {
                            //console.log(pos_prev + ' | ' + pos_prev_max + ' | ' + pos + ' | ' + p.rowX + ' | ' + itemText);

                            if (pos_prev_max == pos_prev && pos_prev != 0) {
                                pos_cur = pos_prev_max - pos_prev;
                            }

                            newText = itemText.substring(pos_cur, pos_cur + p.rowX - pos_prev_max);
                            _x = x_start;
                            _dy = p.rowY;
                            pos_cur = pos_cur + newText.length;
                            //console.log(pos_prev + ' | ' + pos_prev_max + ' | ' + pos + ' | '  + ' ' + itemText);
                        }
                        newItem.text = newText;
                        items.push({ x: _x, dy: _dy, textLength: _textLength, item: newItem });
                        //console.log(pos_prev + ' | ' + pos_prev_max + ' | ' + pos + ' | '  + ' ' + itemText);
                    }
                    else {
                        newText = itemText.substring(itemText.length - (pos - pos_prev_max));
                        newItem.text = newText;
                        items.push({ x: x_start, dy: p.rowY, textLength: _textLength, item: newItem });
                        //console.log(pos_prev + ' | ' + pos_prev_max + ' | ' + pos + ' | '  + ' ' + itemText);
                    }
                    //console.log(pos_prev + ' | ' + pos_prev_max + ' | ' + pos + ' | '  + ' ' + newText);
                } else {
                    if (revise.x) _x = revise.x;
                    items.push({ x: _x, dy: revise.dy, textLength: _textLength, item: item });
                    //console.log(pos_prev + ' | ' + pos_prev_max + ' | ' + pos + ' | '  + ' ' + itemText);
                }


                //console.log(items);
                revise = me.addTspan(nodeNew, items, isClear);
                pos_prev = pos;
                pos_prev_max = p.rowX;
            });
        });

        //修正最後一行不應排列整齊
        var elems = nodeNew.querySelectorAll('tspan[dy]:not([dy=""])');
        var lastElem = elems[elems.length - 1];
        if (lastElem) lastElem.removeAttribute("textLength");
        if (el.parentNode) el.parentNode.replaceChild(nodeNew, el);

        /*2019.06.19 台北市列管需求 保留螢光筆 lien.chiu
        *if (!isClear) me.addMark(root, nodeNew);
        */
        if (!isClear) {
            me.addMark(root, nodeNew);
        } else {
            Ext.Array.each(nodeNew.childNodes, function (n) {

                var api = $(n).qtip('api');
                if (api && api.options && api.options.tag && api.options.tag.action && api.options.tag.action == 'Highlight') {
                    var rootBack = root.parentNode.querySelector('#canvas_background');
                    api.set({
                        'show.delay': 1000,
                        'show.solo': true
                    });
                    var tag = api.get('tag');
                    if (tag.brush) me.addPen(n, tag, rootBack);
                }
            });
        }
        //2019.06.19 台北市列管需求 保留螢光筆 lien.chiu

        nodeNew.setAttributeNS(null, 'visibility', 'visible');
        return nodeNew;
    },
    /**
     * 增加 tspan , 含權限內容
     *
     * var node_new = me.addTspan(nodeNew, items);
     *
     * @param {Node} parentNode 父元素
     * @param {Array} items
     * @param {Boolean} isClear
     * @return {Node}
     */
    addTspan: function (parentNode, items, isClear) {
        var me = this;
        var revise = {};
        Ext.Array.each(items, function (it) {
            var tspanNew = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "tspan"
            );
            if (it.x) tspanNew.setAttributeNS(null, "x", it.x);
            if (it.dy) tspanNew.setAttributeNS(null, "dy", it.dy);
            if (it.dy > 27) {
                tspanNew.setAttributeNS(null, "class", "turn");
            }
            if (it.textLength)
                tspanNew.setAttributeNS(null, "textLength", it.textLength);

            var textnodeNew = document.createTextNode(it.item.text);
            tspanNew.appendChild(textnodeNew);

            var styles = it.item.styles;
            if (styles) {
                if (styles.fontWeight == "Bold")
                    tspanNew.setAttributeNS(null, "font-weight", "bold");
                if (styles.fontStyle == "Italic")
                    tspanNew.setAttributeNS(null, "style", "font-style: italic;");
                if (styles.underline == "Underline")
                    tspanNew.setAttributeNS(null, "text-decoration", "underline");
                if (styles.baselineShift) {
                    tspanNew.setAttributeNS(null, "baseline-shift", styles.baselineShift);
                    tspanNew.setAttributeNS(null, "font-size", "small");
                }

                var tips = [],
                    actionName = "",
                    desc = "",
                    tag = {};
                Ext.Array.each(styles.items, function (item) {
                    var textColor = OA.common.Utils.pickColor(item.version);
                    if (isClear) textColor = "black";
                    if (item.action == "StrikeText") {
                        actionName = "刪文";
                        if (isClear) {
                            // tspanNew.textContent = '';
                            tspanNew.setAttributeNS(null, "style", "display:none");

                            revise.x = tspanNew.getAttributeNS(null, "x");
                            revise.dy = tspanNew.getAttributeNS(null, "dy");
                        } else {
                            // tspanNew.setAttributeNS(null, "style", "display:inline");
                            tspanNew.setAttributeNS(null, "text-decoration", "line-through");
                            tspanNew.setAttributeNS(null, "stroke", textColor);
                            desc = styles.data;
                        }
                    } else if (item.action == "InsertText") {
                        actionName = "插文";
                        desc = styles.data;
                        if (!isClear) tspanNew.setAttributeNS(null, "fill", textColor);
                        // if (!isClear && !me.getIsClearPaper()) {
                        //     tspanNew.setAttributeNS(null, "text-decoration", "underline");
                        //     tspanNew.setAttributeNS(null, "style", "fill:red;");
                        // }
                    } else if (item.action == "Highlight") {
                        actionName = "光筆";
                    }
                    item.desc =
                        item.userName +
                        " " +
                        actionName +
                        ":" +
                        desc +
                        "</br>" +
                        item.lastUpdateTime;
                    item.fromBindId = it.item.fromBindId;
                    item.fromItemIdx = it.item.fromItemIdx;
                    tag = item;
                    tips.push('<p style="font-size:130%;">');
                    tips.push(item.desc);
                    tips.push("</p>");
                });

                if (!isClear && !me.getIsClearPaper()) {
                    if (styles.items && styles.items.length > 0 && tag.lastUpdateTime) {
                        $(tspanNew).qtip({
                            tag: tag,
                            content: {
                                text: tips.join(""),
                            },
                            position: {
                                // target: 'mouse'
                                my: "bottom left",
                                at: "right top",
                            },
                            style: {
                                classes: "qtip-green",
                            },
                            show: {
                                delay: 1000,
                                solo: true,
                            },
                        });
                    }
                } else if (tag.action == "Highlight") {
                    //2019.06.19 台北市列管需求 保留螢光筆
                    if (styles.items && styles.items.length > 0 && tag.lastUpdateTime) {
                        $(tspanNew).qtip({
                            tag: tag,
                            content: {
                                text: tips.join(""),
                            },
                            position: {
                                // target: 'mouse'
                                my: "bottom left",
                                at: "right top",
                            },
                            style: {
                                classes: "qtip-green",
                            },
                            show: {
                                delay: 1000,
                                solo: true,
                            },
                        });
                    }
                }
            }
            parentNode.appendChild(tspanNew);
        });

        return revise;
    },
    /**
     * 顯目標示
     */
    addMark: function (root, node) {
        var me = this;
        if (!root) return;
        if (!root.parentNode) return;
        var rootBack = root.parentNode.querySelector('#canvas_background');
        var notSupportReviseLine = ['InsertText', 'Highlight'];
        Ext.Array.each(node.childNodes, function (n) {
            var api = $(n).qtip('api');
            if (api) {
                api.set({
                    'show.delay': 1000,
                    'show.solo': true
                });
                var tag = api.get('tag');
                if (tag.brush) me.addPen(n, tag, rootBack);

                //追蹤線
                // if (notSupportReviseLine.indexOf(tag.action) < 0) me.addReviseLine(n, tag, rootBack);
            }
        });
    },
    /**
     * 追蹤線
     */
    addReviseLine: function (n, data, rootBack) {
        if (n.getNumberOfChars() <= 0) return;

        var me = this;
        var ratio = me.getSvgPaper().getZoom();

        var startPoint = n.getStartPositionOfChar(0);
        var pos = { x1: startPoint.x * ratio, y1: startPoint.y * ratio + 5 };
        pos.x2 = me.getReviseWidth() * ratio * 0.7;
        pos.y2 = pos.y1;
        if (me.getIsDoRevise()) {
            var svgRoot = me.getSvgPaper().getRootElem();

            var g = me.getSvgPaper().getElem('gRevise');
            if (!g) {
                g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.setAttribute('id', 'gRevise');
                svgRoot.appendChild(g);
            }
            var parentId = n.parentNode.getAttribute('id');
            var lineId = parentId + '_reviseLine';
            var line = me.getSvgPaper().getElem(lineId);
            if (!line) {
                line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('id', lineId);
                line.setAttribute('stroke', 'red');
                line.setAttribute('class', 'test');
                line.setAttribute('stroke-dasharray', '5, 10');
                g.appendChild(line);
            }
            line.setAttribute('x1', pos.x1);
            line.setAttribute('y1', pos.y1);
            line.setAttribute('x2', pos.x2);
            line.setAttribute('y2', pos.y2);

            var textId = parentId + '_reviseText';
            var text = me.getSvgPaper().getElem(textId);
            if (!text) {
                text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('id', textId);
                text.setAttribute('class', 'test');
                g.appendChild(text);
            }
            text.textContent = data.desc;
            text.setAttribute("x", pos.x2);
            text.setAttribute("y", pos.y2);
            if (data.action == 'StrikeText') {
                var mu = me.multiFormatQuery(data.fromBindId);
                var mf = mu.multiFormat[data.fromItemIdx];
                mf.text = '';
                n.textContent = '';
            }
        }
    },
    /**
     * 螢光筆
     */
    addPen: function (n, tag, rootBack) {
        var me = this;
        if (n.getNumberOfChars() <= 0) return;

        var SVGRect = n.getExtentOfChar(0);
        var _color = OA.common.Utils.getBrushColor(tag.brush);

        var pos = n.getNumberOfChars() - 1;
        var w = n.getEndPositionOfChar(pos).x - SVGRect.x;
        var percent = (tag.penSpecies) ? tag.penSpecies / 0.8 : 0.8;

        var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        var h = SVGRect.height * percent;
        var t = SVGRect.y + (1 - percent) * SVGRect.height;

        // console.log(tag);
        rect.setAttribute("id", tag.fromBindId + '_rect_' + tag.fromItemIdx);
        rect.setAttribute("x", SVGRect.x);
        rect.setAttribute("y", t);
        rect.setAttribute("width", w.toString());
        rect.setAttribute("height", h.toString());
        rect.setAttribute("fill", _color);
        rect.setAttribute("class", 'pen');
        rootBack.parentNode.insertBefore(rect, rootBack.nextSibling);
    },
    /**
     * 更新基本內容
     *
     * 增加 tspan , 含權限內容
     *
     * 視圖模型  update view model
     * work檔   update CurrentWKContent
     * svg Dom  update svg dom
     * 重繪      svgUpdateLayout
     *
     * @param {object} values
     */
    updateContent: function (values) {
        console.log(values)
        var me = this;
        var svg = this.getSvgPaper();
        if (!svg) return;

        var vm = OA.common.Global.getCurrentViewModel();
        var wk = OA.common.Global.getCurrentWKContent();
        var name, svgElem, idx = 0;

        var count = Object.keys(values).length;
        var isChangeLv = false;
        var newLV = 0;
        var doctype = '';
        if (wk && wk.DocumentType && wk.DocumentType) doctype = wk.DocumentType;
        for (name in values) {
            idx++;
            if (values.hasOwnProperty(name)) {
                if (name == '會銜公文') values[name] = '會銜' + values[name] + '會辦單';

                //update view model
                vm[name] = values[name];

                //地址
                var upperKey = '', content = values[name];
                if (values.hasOwnProperty('地址')) {
                    upperKey = '地址';
                    content = values['地址'];
                    if (values['辦公地址']) content = values['地址'] + '（' + values['辦公地址'] + '）';
                }

                //聯絡方式
                if (me.getContactFields()) {
                    var isContact = me.getContactFields().indexOf(name) >= 0;
                    if (isContact) {
                        upperKey = OA.common.Fields.Enum.FormContact;

                        values[name] = name + '：' + values[name];
                    }
                }

                //update CurrentWKContent
                me.saveWKField(name, values[name], upperKey);

                // 儲存 [輸入擬辦方式]
                if(values.hasOwnProperty('擬辦方式_title')) {
                    const todoWayElem = svg.getElem('輸入擬辦方式');
                    todoWayElem.textContent = "(" + (values['擬辦方式_title'] || "其他") + ")";
                }

                //update svg dom
                var id = name;
                if (name.indexOf('_title') < 0) id = name + '_title';
                svgElem = svg.getElem(id);
                if (svg.getElem(name)) svgElem = svg.getElem(name);
                if (svgElem) {
                    //console.log(content);
                    if (name == '決行層級_title') {

                        var v = content;
                        if (Ext.isNumeric(v)) {
                            //console.log(KangDaAppConfig().DCSNS[lv].ofDesc);
                            content = KangDaAppConfig().DCSNS[v].name;
                        } else {
                            return content;
                        }
                    }
                    svgElem.textContent = content;
                    var doHide = true;
                    doHide = me.elemInBoundary(name, svgElem);

                    if (doHide != undefined && idx == count) return doHide;
                }

                // 同名多欄時
                var elems = svg.getContentElem().querySelectorAll('#' + name);
                Ext.Array.each(elems, function (elem) {
                    elem.textContent = content;
                    me.elemInBoundary(name, elem);
                });

                if (name == '承辦單位電話') {
                    var sealText = svg.getContentElem().querySelectorAll("text[class*='sealText']");
                    if (sealText && sealText.length > 0) {
                        var text = sealText[0];
                        var word = '承辦單位 電話：' + values[name];
                        var times = (word.length <= 8) ? 9 : Math.abs(23 - word.length);
                        if (word.length > 23) times = 0;
                        //console.log(doctype);
                        if (doctype === '簽' || doctype === '便簽' || doctype === 'A4空白簽' || doctype === '簡簽')
                            word = word + Ext.String.repeat('　', times) + '審核　　　　　　　　決行';
                        else
                            word = word + Ext.String.repeat('　', times) + '核稿　　　　　　　　　　決行';

                        text.textContent = word;
                    }
                }

                /*
                if (name == '會辦單位') {
                    if (svgElem) {
                        //1106  會辦單位超過3，隱藏並詳見附簽稿會核單  Chloe.sia
                        var c = (svgElem.textContent) ? svgElem.textContent.trim() : '', names = [];
                        if (c) names = c.split('、');
                        var data2 = "";
                        if (names.length > 3) {
                            for (var i = 0; i <= 2; i++) {
                                if (i == 2) {
                                    data2 = data2 + names[i] + "（詳見附簽稿會核單）";
                                } else {
                                    data2 = data2 + names[i] + "、";
                                }
                            }
                            svgElem.textContent = data2;
                        }


                        var svgElemTitle = svg.getElem(name + '_title');
                        if ((svgElem.textContent + '') != '') {
                            if (svgElemTitle) svgElemTitle.setAttribute("opacity", "1");
                            svgElem.setAttribute("opacity", "1");
                        } else {
                            if (svgElemTitle) svgElemTitle.setAttribute("opacity", "0");
                            svgElem.setAttribute("opacity", "0");

                        }
                    }
                }
                */

                //0120 電子信箱回覆函 日期  Chloe.sia
                //if (name == '年月日_title' && wk.DocumentType == '電子信箱回覆函') {
                //    svgElem.textContent = '日期：' + values[name];
                //}

                if (name == '局處單位_title' && wk.DocumentType == '便簽') {
                    console.log(values[name])
                    svgElem.textContent = values[name];
                }

                // last data to update layout
                if (idx == count) me.svgUpdateLayout();
            }
        }

        /*
        if (isChangeLv && newLV !== 0) {
            if (doctype === '簽') {
                Ext.Msg.confirm("提醒", "決行層級已變更，是否變更敬陳人員？", function (ok) {
                    if ('yes' == ok) {
                        var qb = OA.common.Global.getQueryDefault();
                        if (qb && qb.敬陳對象 && qb.敬陳對象.length > 0) {
                            Ext.Array.each(qb.敬陳對象, function (item) {
                                if (item.層級 == newLV) {
                                    if (item.對象) {
                                        var personnels = (item.對象 + '').split(',');
                                        if (personnels && personnels.length > 0) {
                                            var noteSubs = {};
                                            Ext.Array.each(personnels, function (personnel, index) {
                                                var int = index + 1;
                                                noteSubs = Object.assign(noteSubs, { ['敬陳_' + int]: personnel });
                                            });
                                            noteSubs = Object.assign(noteSubs, { 敬陳數: personnels.length });
                                            OA.common.Paper.main().updateNoteSubmit(noteSubs, '敬陳');
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
        */

        //箋函更新發文日期時一起更新年月日
        if (name == '發文日期' && doctype == '箋函') {
            if ((values[name] + '').trim() != '') {
                me.updateContent({ 年月日_title: (values[name] + '').replace('中華民國', '') });
            }
        }

        me.setStatus('edit');
    },
    /**
     * 基本欄位WK
     */
    saveWKField: function (key, value, upperKey) {
        key = key.replace('_title', '');
        var vm = OA.common.Global.getCurrentViewModel();
        var qb = OA.common.Global.getQueryDefault();
        var IStemplateUrlWrap = false; //判斷表單是否有手動換行符號
        // if (vm && vm.templateUrl) {
        //     if (value.indexOf('\n').length != -1) IStemplateUrlWrap = true;
        // }
        //特例：決行層級
        if (key == OA.common.Fields.Enum.FormApproveLevel) {
            if (value == "一層決行") value = -1;
            else if (value == "二層決行") value = -2;
            else if (value == "三層決行") value = -3;
            else if (value == "四層決行") value = -4;
        }
        if (!upperKey) upperKey = key;
        var wkContent = OA.common.Global.getCurrentWKContent();
        var tagText = OA.common.Utils.getTagText(wkContent, upperKey);
        if (upperKey == '聯絡人及電話') {
            var people = value.split('、');
            var nodes = [];
            Ext.Array.each(people, function (person) {
                var items = person.split(' ');
                nodes.push({ Key: "姓名", Value: items[0], tagName: "Property" });
                nodes.push({ Key: "職稱", Value: items[1], tagName: "Property" });
                nodes.push({ Key: "電話", Value: items[2], tagName: "Property" });
            });

            tagText.childNodes = nodes;
            return;
        } else if (upperKey == '會辦單位' && tagText.childNodes && tagText.childNodes.length > 1) {
            var people = value.split('、');
            var nodes = [];
            Ext.Array.each(people, function (person) {
                var items = person.split(' ');
                nodes.push({ Key: "會辦單位", Value: items[0], tagName: "Property" });

            });
            tagText.childNodes = nodes;
            return;
        }

        if (tagText && upperKey == '承辦單位電話') {
            if (tagText.Key == key) {
                tagText.Value = value;
                return false;
            }
        }

        if (tagText) {
            Ext.Array.each(tagText.childNodes, function (n3) {
                if (n3.Key === key) {
                    if (IStemplateUrlWrap)
                        n3.Value = value.replace(/\n/g, '&crarr;');
                    else
                        n3.Value = value;
                    return false;
                }

                if (key === '機關') {
                    n3.Key = value;
                    return false;
                }
                //if (key === '註記') {
                //    n3.Key = value;
                //    return false;
                //}
                if (key === '結尾自稱語') {
                    n3.Key = value;
                    return false;
                }
                if (upperKey == '聯絡方式' && key == '聯絡電話') {
                    if (n3.Key === '電話') {
                        n3.Value = value;
                        return false;
                    }
                }
            });
        } else {
            tagText = Ext.clone(OA.common.DIMgr.TEMPLATE.Header[key]);
            if (!tagText) {
                tagText = {
                    "BeginX": 0,
                    "FontSize": 21,
                    "Index": 10,
                    "LineHeight": 2,
                    "TagCaption": key,
                    "Title": key,
                    "VisibleState": "Visible",
                    "tagName": "Text",
                    "childNodes": [
                        {
                            "Key": key,
                            "Value": "",
                            "tagName": "Property"
                        }
                    ],
                    "Alignment": "Left"
                }
            }
            Ext.Array.each(tagText.childNodes, function (n3) {
                if (n3.Key === key) {
                    n3.Value = value;
                    return false;
                }
            });
            wkContent.childNodes[0].childNodes.push(tagText);
        }
    },
    /**
     * 更新基本內容
     *
     * @param {object} values
     */
    updateSealApprGrid: function (values) {
        var me = this;
        var svg = this.getSvgPaper();
        var vm = OA.common.Global.getCurrentViewModel();
        var name, svgElem, idx = 0;

        var count = Object.keys(values).length;
        for (name in values) {
            idx++;
            if (values.hasOwnProperty(name)) {
                me.fillIn(name, values[name]);
            }
        }

        me.saveWKSealApprGrid();
        me.setStatus('edit');
    },
    fillIn: function (key, value) {
        var me = this;
        var svg = this.getSvgPaper();
        var svgElem = svg.getElem(key + '_title');
        if (svg.getElem(key)) svgElem = svg.getElem(key);
        if (svgElem) {
            svgElem.textContent = value;
            me.elemInBoundary(key, svgElem);
        }
    },
    elemInBoundary: function (key, svgElem) {
        var me = this;
        var svg = this.getSvgPaper();
        key = key.replace('_title', '');
        var elemBoundary = svg.getElem(key + '_boundary');
        if (elemBoundary) {
            var x_pos = parseFloat(elemBoundary.getAttribute('x'));
            var y_pos = parseFloat(elemBoundary.getAttribute('y')) - 10;
            var boxwidth = parseFloat(elemBoundary.getAttribute('width'));
            var boxheight = parseFloat(elemBoundary.getAttribute('height'));

            var linegap = 0;

            if (key.indexOf('機關名稱') < 0) {
                //依文字長度調整字型大小
                var fontSize = parseFloat(svgElem.getAttribute('font-size'));
                if (!svgElem.getAttribute('oldFont-size')) {
                    svgElem.setAttribute('oldFont-size', fontSize);
                } else {
                    fontSize = svgElem.getAttribute('oldFont-size');
                    svgElem.setAttribute('font-size', fontSize)
                }

                var reSet = false;
                var svgElem_ = svgElem;
                var elem;
                var isOutside = false;
                var WordCount = 0;
                do {
                    elem = me.setWrap(svgElem_, x_pos, y_pos, boxwidth, boxheight, linegap);
                    if (elem && elem.childElementCount) {
                        var textheight = parseFloat(me.getLineHeight(elem) * elem.childElementCount);
                        if (textheight > boxheight) {
                            fontSize = fontSize - 1;
                            elem.setAttribute('font-size', fontSize);
                            svgElem_ = elem;
                            reSet = true;
                        } else {
                            reSet = false;
                        }
                    }
                    if (fontSize < 10) {
                        fontSize = 10;
                        var BoundaryElem = Ext.clone(svgElem);
                        BoundaryElem.setAttribute('font-size', fontSize);
                        var Boundaryelem = me.setWrapBoundary(BoundaryElem, x_pos, y_pos, boxwidth, boxheight, linegap);
                        isOutside = true;
                        reSet = false;
                        //計算限制字數
                        WordCount = Boundaryelem.textContent.length - 1;
                    }
                } while (reSet);

                if (!reSet) {
                    if (isOutside) {
                        Ext.Msg.alert('提醒', '請調整字數在' + WordCount + '字內，避免文字超出框格！');
                        //回到輸入文字的視窗，並帶入原有輸入的文字
                        if (elem) {
                            var vm = OA.common.Global.getCurrentViewModel();
                            if (vm[key]) {
                                vm[key] = elem.textContent;
                                //OA.common.Fields.popupFromShow(key);
                                elem.textContent = '';
                                return false;
                            }
                        }
                    }
                    if (elem) svgElem = elem;
                    svgElem.setAttribute('font-size', fontSize)
                }
            }

            var elem_new = me.setWrap(svgElem, x_pos, y_pos, boxwidth, linegap);

            if (svgElem.parentNode) svgElem.parentNode.replaceChild(elem_new, svgElem);

            //垂直居中
            var dy = (me.getClientHeight(elemBoundary) - me.getClientHeight(elem_new)) / 2;
            var yOriginal = parseFloat(elem_new.getAttribute("y"));
            elem_new.setAttribute('y', yOriginal + dy + 2);

            //機關名稱自動水平居中
            if (key.indexOf('機關名稱') >= 0) {
                var tspans = elem_new.querySelectorAll('tspan');
                if (tspans.length > 0) {
                    Ext.Array.each(tspans, function (tspan) {
                        var dx = (boxwidth - me.getClientWidth(tspan)) / 2;
                        tspan.setAttribute('x', x_pos + dx);
                    })
                }
            }
            return elem_new;
        }
    },
    /**
     * 重建儲存 KDRichTextBlock WK
     */
    saveWKSealApprGrid: function () {
        var me = this;
        var wkContent = OA.common.Global.getCurrentWKContent();
        if (!wkContent) return;

        var vm = OA.common.Global.getCurrentViewModel();
        var p = OA.common.Global.getInitParas();
        var nodes = wkContent.childNodes.filter(function (n1) {
            return (n1 !== null);
        });
        var items = nodes.where("( el, i, res, param ) => el.tagName=='Grid'");
        var rtb = items[0];
        if (items.length == 0) {
            nodes.push({
                "tagName": "Grid",
                "childNodes": []
            });
            rtb = nodes.where("( el, i, res, param ) => el.tagName=='Grid'")[0];
        }

        var newItems = [];
        var svg = me.getSvgPaper();
        if (!svg) return;
        var gContent = svg.getContentElem().querySelector('.gContent');
        var textItems = gContent.querySelectorAll('text');
        Ext.Array.each(textItems, function (elem) {
            newItems.push({
                Key: elem.id,
                Value: elem.textContent,
                tagName: "Text"
            });
        });
        rtb.childNodes = newItems;

        OA.common.Global.setCurrentWKContent(wkContent);
        //console.log(wkContent);
    },
    /**
     * 更新發文機關、文號、署名、稿署名、敬陳、敬會、敬致、局處單位
     *
     * 視圖模型      update current view model
     * work檔       update CurrentWKContent
     * svg Dom      update svg dom
     * svg redraw   svgUpdateLayout
     *
     * @param {array} values
     */
    updateSentPaper: function (values) {
        var me = this;
        var wkContent = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        var qd = OA.common.Global.getQueryDefault();

        values.發文文號 = values['發文字號_年度_1'] + values['發文字號_流水號_1'] + values['發文字號_支號_1'];
        Ext.apply(OA.common.Global.getCurrentViewModel(), values);
        //0706 判別標題抬頭 文稿類型 顯示 Chloe.sia
        if (wkContent.DocumentType.indexOf('會銜受文者') > -1)
            wkContent.DocumentType = wkContent.DocumentType.replace('會銜受文者', '');
        else if (wkContent.DocumentType.indexOf('會銜') > -1)
            wkContent.DocumentType = wkContent.DocumentType.replace('會銜', '');
        else if ((wkContent.DocumentType.indexOf('受文者') > -1))
            wkContent.DocumentType = wkContent.DocumentType.replace('受文者', '');
        else if (wkContent.DocumentType.indexOf('獎懲令') > -1)
            wkContent.DocumentType = wkContent.DocumentType.replace('獎懲', '');
        else if (wkContent.DocumentType.indexOf('派免令') > -1)
            wkContent.DocumentType = wkContent.DocumentType.replace('派免', '');
        else if (wkContent.DocumentType.indexOf('派免遷調令') > -1)
            wkContent.DocumentType = wkContent.DocumentType.replace('派免遷調', '')
        else if (wkContent.DocumentType.indexOf('代辦處') > -1)
            wkContent.DocumentType = wkContent.DocumentType.replace('代辦處', '')

        if (values.發文層級 == 1) {
            var svg = this.getSvgPaper();
            var svgElem_Title, svgElem

            svgElem_Title = svg.getElem('承辦單位_title');
            if (svgElem_Title) {
                svgElem_Title.textContent = '承辦機關：'
            }

            svgElem = svg.getElem('承辦單位');
            if (svgElem) {
                var orgName = qd.機構名稱 || '';
                svgElem.textContent = orgName;
            }

            var tagFile = OA.common.Utils.getTagText(wkContent, '承辦單位');
            if (tagFile) {
                tagFile.Title = '承辦機關：';
                tagFile.childNodes = [{ Key: "承辦單位", Value: orgName, tagName: "Property" }];
            }
            if (vm && vm.承辦單位) vm.承辦單位 = orgName;
        }

        me.saveWKSent(values);
        me.updateSvgSentPaper(values);
        me.updateSvgSentNames(values);
        me.svgUpdateLayout();


        var qs = OA.common.Global.getQ();
        var isGenDocNo = false;
        if (qs.app === 'editor' || qs.app === 'offline') {
            if (values['發文字號_年度_1'] && values['發文字號_流水號_1']) isGenDocNo = true;
            if (qs.genDocNo === '2') isGenDocNo = true;
        }

        if (isGenDocNo) {
            wkContent.genDocNo = '2';
            wkContent.給號方式 = '預先提號';
            wkContent.doSno = values.發文文號;
            wkContent.doDeptno = OA.common.Global.getCurrentDept().doDeptno;
        }

        var initParas = OA.common.Global.getInitParas();
        var pages = OA.common.VIMgr.getCurrentEditionPapers();

        if (qs.status == 'new') {
            initParas.paperNo = 1
        }

        var paper = pages.where("( el, i, res, param ) => el.代碼==" + initParas.paperNo);
        var current = OA.common.VIMgr.getCurrentEdition();
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');

        var otSno = values.發文文號;
        if (!values.發文字號_支號_1) {
            otSno = '';
            paper[0].發文文號 = '';
            initParas.sendNo = '';
        }

        initParas.sendNo = otSno;
        paper[0].發文文號 = otSno;
        var segItems = ctrWK.getSegdoc().getItems().items;
        Ext.Array.each(segItems, function (item) {
            if (initParas.paperNo == item.config.paperNo) item.config.sendNo = otSno;
        });
        wkContent.發文文號 = otSno;

        me.setStatus('edit');
    },
    /**
     * 聯絡
     */
    updateWKContactList: function (values) {
        var me = this;
        var store = Ext.getStore('Contact');
        var all = store.getData().all;
        var items = [];
        Ext.Array.forEach(all, function (item) {
            items.push(item.getData());
        });

        //vm
        var data = { ContactList: items };
        Ext.apply(OA.common.Global.getCurrentViewModel(), data);
        Ext.apply(OA.common.Global.getCurrentViewModel(), values);

        //wk
        var wkContent = OA.common.Global.getCurrentWKContent();
        var tagContactList = OA.common.Utils.getContactListTag(wkContent);
        if (tagContactList) {
            tagContactList.childNodes = items;
        } else {
            wkContent.childNodes[0].childNodes.push({
                tagName: "ContactList",
                childNodes: items
            })
        }
        var nodes = [];
        Ext.Array.forEach(items, function (item) {
            var t = { Key: item.KEY, Value: item.VALUE, tagName: "Property" };
            if (nodes.hasOwnProperty(item.KEY))
                nodes[item.KEY].push(t);
            else
                nodes[item.KEY] = [t];
        });

        //view
        for (var name in values) {
            if (values.hasOwnProperty(name)) {
                var tagText = OA.common.Utils.getTagText(wkContent, name);
                if (tagText) {
                    tagText.childNodes = nodes[name];
                    var svgElem = me.getSvgPaper().getElem(name);
                    if (svgElem) svgElem.textContent = values[name];
                } else {
                    // var newtag = {
                    //     "BeginX": 0,
                    //     "Index": 2,
                    //     "VisibleState": "Visible",
                    //     "tagName": "Text",
                    //     "childNodes": nodes[name],
                    //     "FontSize": 16,
                    //     "Alignment": "Left",
                    //     "TagCaption": name,
                    //     "LineHeight": 0,
                    //     "Title": name + "："
                    // }
                }
            }
        }

        me.svgUpdateLayout();

        me.setStatus('edit');
    },
    /**
     * 發文機關
     */
    saveWKSent: function (values) {
        var wkContent = OA.common.Global.getCurrentWKContent();
        var tagText = OA.common.Utils.getTagText(wkContent, '發文機關');
        if (!tagText) return;

        // console.log(tagText);

        var count = values.機關數;
        var name = '', code = '', s1 = '', s2 = '', s3 = '', s4 = '', s5 = '', s6 = '', names = [], codes = [], nos = [], signs = [];
        for (var i = 1; i <= count; i++) {
            name = '發文機關_' + i.toString();
            code = '機關代碼_' + i.toString();
            s1 = '發文字號_字_' + i.toString();
            s2 = '發文字號_年度_' + i.toString();
            s3 = '發文字號_流水號_' + i.toString();
            s4 = '發文字號_支號_' + i.toString();

            names.push(values[name]);
            codes.push(values[code]);

            nos.push({ Key: "發文字號_字", Value: values[s1], tagName: "Property" });
            nos.push({ Key: "發文字號_年度", Value: values[s2], tagName: "Property" });
            nos.push({ Key: "發文字號_流水號", Value: values[s3], tagName: "Property" });
            nos.push({ Key: "發文字號_支號", Value: values[s4], tagName: "Property" });

            var countSignName = values['署名數' + i.toString()];
            var countSignAlias = values['稿署名數' + i.toString()];
            if (countSignName == 0) {
                signs.push({ Key: "署名", Type: values[name], Value: '', tagName: "Property" });
            } else {
                for (var j = 1; j <= countSignName; j++) {
                    s5 = '署名' + i.toString() + '_' + j.toString();
                    signs.push({ Key: "署名", Type: values[name], Value: values[s5], tagName: "Property" });
                }
            }

            if (countSignAlias == 0) {
                signs.push({ Key: "稿署名", Type: values[name], Value: '', tagName: "Property" });
            } else {
                for (var k = 1; k <= countSignAlias; k++) {
                    s6 = '稿署名' + i.toString() + '_' + k.toString();
                    signs.push({ Key: "稿署名", Type: values[name], Value: values[s6], tagName: "Property" });
                }
            }
        }

        tagText.childNodes[0].Key = names.join('、') + '；' + values.發文定義;
        tagText.childNodes[0].Value = codes.join('、');
        tagText.childNodes[1] = tagText.childNodes[1] || {
            "Value": "",
            "Key": "發文層級",
            "tagName": "Property"
        };
        tagText.childNodes[1].Value = values.發文層級;

        //發文字號
        tagText = OA.common.Utils.getTagText(wkContent, '發文字號');
        if (!tagText) return;
        tagText.childNodes = nos;

        //署名
        tagText = OA.common.Utils.getTagText(wkContent, '署名');
        if (!tagText) return;
        tagText.childNodes = signs;

        //稿署名
        tagText = OA.common.Utils.getTagText(wkContent, '稿署名');
        if (!tagText) return;
        tagText.childNodes = signs;
    },
    /**
     * 更新發文機關、文號
     *
     * @param {array} values
     */
    updateSvgSentPaper: function (values) {
        console.log(values);
        var svg = this.getSvgPaper();
        var svgElem, svgElemNext, svgElemCurrent;
        var wk = OA.common.Global.getCurrentWKContent();
        var title = values.發文定義 + '　' + wk.DocumentType + '（稿）';
        var unDraft = ['出席會議報告單'];
        if (unDraft.indexOf(wk.DocumentType) >= 0) {
            if (values.發文定義.length == 0) {
                var qd = OA.common.Global.getQueryDefault();
                values.發文定義 = qd.交換資訊.發文機關全銜 || '';
            }
            title = values.發文定義 + '　' + wk.DocumentType;
        }
        if (wk.DocumentTemplate == '通用函') {
            title = values.發文定義 + '　' + '（稿）';
        }
        svgElem = svg.getElem('發文機關_title');
        if (svgElem) svgElem.textContent = title;
        var count = values['機關數'];

        var s = '', s1 = '', s2 = '', s3 = '', s4 = '';
        for (var i = 1; i <= count; i++) {
            s1 = '發文字號_字_' + i.toString();
            s2 = '發文字號_年度_' + i.toString();
            s3 = '發文字號_流水號_' + i.toString();
            s4 = '發文字號_支號_' + i.toString();
            s = values[s1] + '字第' + values[s2] + values[s3] + values[s4] + '號';

            svgElem = svg.getElem('發文字號_' + i.toString());
            if (svgElem) {
                svgElemNext = svg.getElem('發文字號_' + (i + 1).toString());
                svgElem.textContent = s;
                if (!svgElemNext && i != count) {
                    var elnew = svg.copyElem(svgElem);

                    s1 = '發文字號_字_' + (i + 1).toString();
                    s2 = '發文字號_年度_' + (i + 1).toString();
                    s3 = '發文字號_流水號_' + (i + 1).toString();
                    s4 = '發文字號_支號_' + (i + 1).toString();
                    s = values[s1] + '字第' + values[s2] + values[s3] + values[s4] + '號';

                    elnew.setAttribute('id', '發文字號_' + (i + 1).toString());
                    elnew.textContent = s;
                    svgElem.parentNode.insertBefore(elnew, svgElem.nextSibling);
                }

                //remove last after all
                if (i == count && svgElemNext) {
                    svgElemCurrent = svgElemNext;
                    var isLastAfter = false;
                    do {
                        svgElemNext = svgElemCurrent.nextSibling;
                        svgElemCurrent.parentNode.removeChild(svgElemCurrent);

                        svgElemCurrent = svgElemNext;
                        if (svgElemNext)
                            isLastAfter = svgElemNext.getAttribute("id").indexOf('發文字號') >= 0;
                        else
                            isLastAfter = false;
                    }
                    while (isLastAfter);
                }
            }
        }
    },
    clearSvgSentPaper: function (values) {
        Ext.apply(OA.common.Global.getCurrentViewModel(), values);
        var svg = this.getSvgPaper();
        var svgElem, svgElemNext, svgElemCurrent;
        var wk = OA.common.Global.getCurrentWKContent();
        var title = values.發文定義 + '　' + wk.DocumentType;
        svgElem = svg.getElem('發文機關_title');
        if (svgElem) svgElem.textContent = title;
        var count = 1;

        var s = '', s1 = '', s2 = '', s3 = '', s4 = '';
        for (var i = 1; i <= count; i++) {
            s1 = '發文字號_字_' + i.toString();
            s2 = '發文字號_年度_' + i.toString();
            s3 = '發文字號_流水號_' + i.toString();
            s4 = '發文字號_支號_' + i.toString();
            s = values[s1] + '字第' + values[s2] + values[s3] + values[s4] + '號';

            svgElem = svg.getElem('發文字號_' + i.toString());
            if (svgElem) {
                svgElemNext = svg.getElem('發文字號_' + (i + 1).toString());
                svgElem.textContent = s;
                if (!svgElemNext && i != count) {
                    var elnew = svg.copyElem(svgElem);

                    s1 = '發文字號_字_' + (i + 1).toString();
                    s2 = '發文字號_年度_' + (i + 1).toString();
                    s3 = '發文字號_流水號_' + (i + 1).toString();
                    s4 = '發文字號_支號_' + (i + 1).toString();
                    s = values[s1] + '字第' + values[s2] + values[s3] + values[s4] + '號';

                    elnew.setAttribute('id', '發文字號_' + (i + 1).toString());
                    elnew.textContent = s;
                    svgElem.parentNode.insertBefore(elnew, svgElem.nextSibling);
                }

                //remove last after all
                if (i == count && svgElemNext) {
                    svgElemCurrent = svgElemNext;
                    var isLastAfter = false;
                    do {
                        svgElemNext = svgElemCurrent.nextSibling;
                        svgElemCurrent.parentNode.removeChild(svgElemCurrent);

                        svgElemCurrent = svgElemNext;
                        if (svgElemNext)
                            isLastAfter = svgElemNext.getAttribute("id").indexOf('發文字號') >= 0;
                        else
                            isLastAfter = false;
                    }
                    while (isLastAfter);
                }
            }
        }
    },
    /**
     * 更新署名、稿署名
     *
     * @param {array} values
     */
    updateSvgSentNames: function (values) {
        var svg = this.getSvgPaper();
        var svgElem, svgElemNext, svgElemCurrent;
        var wkContent = OA.common.Global.getCurrentWKContent();
        var items = [], count = 0;
        for (var i = 1; i <= values['機關數']; i++) {
            count = values['稿署名數' + i.toString()];
            for (var j = 1; j <= count; j++) {
                var key = '稿署名' + i.toString() + '_' + j.toString();
                items.push(values[key]);
            }
        }

        count = items.length;
        for (i = 1; i <= count; i++) {
            svgElem = svg.getElem('署名_' + i.toString());
            if (svgElem) {
                svgElemNext = svg.getElem('署名_' + (i + 1).toString());
                svgElem.textContent = items[i - 1];
                if (!svgElemNext && i != count) {
                    var elnew = svg.copyElem(svgElem);

                    elnew.setAttribute('id', '署名_' + (i + 1).toString());
                    elnew.textContent = items[i + 1];
                    svgElem.parentNode.insertBefore(elnew, svgElem.nextSibling);
                }

                //remove last after all
                if (i == count && svgElemNext) {
                    svgElemCurrent = svgElemNext;
                    var isLastAfter = false;
                    do {
                        svgElemNext = svgElemCurrent.nextSibling;
                        svgElemCurrent.parentNode.removeChild(svgElemCurrent);

                        svgElemCurrent = svgElemNext;

                        if (svgElemNext)
                            isLastAfter = svgElemNext.getAttribute("id").indexOf('署名') >= 0;
                        else
                            isLastAfter = false;
                    }
                    while (isLastAfter);
                }
            }
        }

    },
    /**
     * 敬會、敬陳、敬致、局處單位
     */
    updateNoteSubmit: function (values, key) {
        var me = this;
        Ext.apply(OA.common.Global.getCurrentViewModel(), values);
        //更新WK
        var submit = [], s = '';
        var wkContent = OA.common.Global.getCurrentWKContent();
        var tagText = OA.common.Utils.getTagText(wkContent, key);
        if (!tagText) return true;
        var countSubmit = values[key + '數'];
        for (var j = 1; j <= countSubmit; j++) {
            s = key + '_' + j.toString();
            submit.push({ Key: key, Value: values[s], tagName: "Property" });
        }
        tagText.childNodes = submit;
        //更新SVG
        var svg = this.getSvgPaper();
        var svgElem, svgElemNext, svgElemCurrent;
        for (i = 1; i <= countSubmit; i++) {
            svgElem = svg.getElem(key + '_' + i.toString());

            if (svgElem) {
                svgElemNext = svg.getElem(key + '_' + (i + 1).toString());
                svgElem.textContent = values[key + '_' + i];
                if (!svgElemNext && i != countSubmit) {
                    var elnew = svg.copyElem(svgElem);
                    elnew.setAttribute('id', key + '_' + (i + 1).toString());
                    elnew.textContent = values[key + '_' + (i + 1)];
                    svgElem.parentNode.insertBefore(elnew, svgElem.nextSibling);
                }

                //remove last after all
                if (i == countSubmit && svgElemNext) {
                    svgElemCurrent = svgElemNext;
                    var isLastAfter = false;
                    do {
                        svgElemNext = svgElemCurrent.nextSibling;
                        svgElemCurrent.parentNode.removeChild(svgElemCurrent);

                        svgElemCurrent = svgElemNext;

                        if (svgElemNext)
                            isLastAfter = svgElemNext.getAttribute("id").indexOf(key) >= 0;
                        else
                            isLastAfter = false;
                    }
                    while (isLastAfter);
                }

                //1116 敬會若為空，則顯示按此處新增   Chloe.sia
                if (key == '敬會') {
                    svgTitle = svg.getElem('敬會_title');
                    if (svgTitle) svgTitle.textContent = '敬會';
                    if (svgTitle && values.敬會_1 == "" && countSubmit == 1) svgTitle.textContent = '（按此處新增敬會）';
                }
            }
        }

        me.svgUpdateLayout();

        me.setStatus('edit');
    },
    /**
     * 更新檔號
     *
     * @param {object} values
     */
    updateFileYear: function (values) {
        var me = this;
        //更vm新檔號
        var arr = [];
        arr.push(values.年度);
        arr.push(values.分類號);
        if (values.案次號) arr.push(values.案次號);
        if (values.目次號) arr.push(values.目次號);
        values.檔號 = arr.join('/');
        Ext.apply(OA.common.Global.getCurrentViewModel(), values);
        var wkContent = OA.common.Global.getCurrentWKContent();
        var tagFile = OA.common.Utils.getTagText(wkContent, '檔號');
        var tagYear = OA.common.Utils.getTagText(wkContent, '保存年限');
        var items = [];
        items.push({ Key: "年度", Value: values['年度'], tagName: "Property" });
        items.push({ Key: "分類號", Value: values['分類號'], tagName: "Property" });
        if (values.案次號) {
            items.push({ Key: "案次號", Value: values['案次號'], tagName: "Property" });
        } else {
            items.push({ Key: "案次號", Value: '', tagName: "Property" });
        }
        if (values.目次號) {
            items.push({ Key: "目次號", Value: values['目次號'], tagName: "Property" });
        }
        if (tagFile) tagFile.childNodes = items;
        if (tagYear) tagYear.childNodes = [{ Key: "保存年限", Value: values['保存年限'], tagName: "Property" }];
        OA.common.Global.setCurrentWKContent(wkContent);
        var vm = OA.common.Global.getCurrentViewModel();
        if (vm && vm.kind == '來文') return;
        var content = (values['案次號']) ? values['年度'] + '/' + values['分類號'] + '/' + values['案次號'] : values['年度'] + '/' + values['分類號'];
        //var content = values['年度'] + '/' + values['分類號'];
        if (values.目次號) {
            content = content + '/' + values['目次號'];
        }
        if (content.length <= 1) content = '';
        var svg = this.getSvgPaper();
        if (svg) {
            var svgElem = svg.getElem('檔號');
            if (svgElem) svgElem.textContent = content;
            svgElem = svg.getElem('保存年限');
            if (svgElem) {
                if (values['保存年限'] == '99')
                    svgElem.textContent = '永久';
                else
                    svgElem.textContent = values['保存年限'];
            }
        }
        me.setStatus('edit');

    },
    /**
     * 存檔號
     *
     * @param {object} values
     */
    saveFileYear: function () {
        var me = this;
        var wkContent = OA.common.Global.getCurrentWKContent();
        if (!wkContent) return;

        var vm = OA.common.Global.getCurrentViewModel();
        var tagFile = OA.common.Utils.getTagText(wkContent, '檔號');
        var tagYear = OA.common.Utils.getTagText(wkContent, '保存年限');
        var items = [];
        items.push({ Key: "年度", Value: vm['年度'], tagName: "Property" });
        items.push({ Key: "分類號", Value: vm['分類號'], tagName: "Property" });
        if (vm.案次號) {
            items.push({ Key: "案次號", Value: vm['案次號'], tagName: "Property" });
        } else {
            items.push({ Key: "案次號", Value: '', tagName: "Property" });
        }
        if (vm.目次號) {
            items.push({ Key: "目次號", Value: vm['目次號'], tagName: "Property" });
        }

        if (tagFile) tagFile.childNodes = items;
        if (tagYear) tagYear.childNodes = [{ Key: "保存年限", Value: vm['保存年限'], tagName: "Property" }];
    },
    /**
     * 更新決行層級
     *
     * @param {object} values
     */
    updateLevel: function (values) {
        var me = this;
        if (me.getStatus() == 'add') return;
        //更vm新檔號
        Ext.apply(OA.common.Global.getCurrentViewModel(), values);
        var wkContent = OA.common.Global.getCurrentWKContent();

        var tagFile = OA.common.Utils.getWKText(wkContent, '決行層級');
        var tagYear = OA.common.Utils.getWKText(wkContent, '分層負責');
        var items = [];

        items.push({ Key: "決行層級", Value: values['決行層級_title'], tagName: "Property" });
        items.push({ Key: "分層負責", Value: values['分層負責_title'], tagName: "Property" });

        if (tagFile) tagFile.childNodes = [{ Key: "決行層級", Value: values['決行層級_title'], tagName: "Property" }];
        if (tagYear) tagYear.childNodes = [{ Key: "分層負責", Value: values['分層負責_title'], tagName: "Property" }];

        OA.common.Global.setCurrentWKContent(wkContent);
        var vm = OA.common.Global.getCurrentViewModel();
        if (vm && vm.kind == '來文') return;

        var svg = this.getSvgPaper();

        if (svg) {
            var svgElem = svg.getElem('決行層級_title');
            if (svgElem) svgElem.textContent = values['決行層級_title']

        }


        me.svgUpdateLayout();
        me.setStatus('edit');

    },
    /**
     * 更新擬辦方式裡速別(處理級別)
     *
     * @param {object} values
     */
    updateUrgencyLevels: function () {
        var me = this;
        if (me.getStatus() == 'add') return;

        // //更vm新檔號
        //Ext.apply(OA.common.Global.getCurrentViewModel(), values);
        var wkContent = OA.common.Global.getCurrentWKContent();

        var tagFile = OA.common.Utils.getWKText(wkContent, '處理級別');

        OA.common.Global.setCurrentWKContent(wkContent);
        var vm = OA.common.Global.getCurrentViewModel();
        if (vm && vm.kind == '來文') return;

        var svg = this.getSvgPaper();

        if (svg) {
            var svgElem = svg.getElem('處理級別_title');
            if (svgElem) svgElem.textContent = tagFile;

        }


        me.svgUpdateLayout();
        me.setStatus('edit');

    },
    /**
     * 更新解密條件或保密期限
     *
     * @param {array} values
     */
    updateSecurity: function (values) {
        var me = this;

        Ext.apply(OA.common.Global.getCurrentViewModel(), values);

        if (values['解密條件或保密期限'] == '本件至某年某月某日解密') {
            values['解密條件或保密期限'] = values['本件至某年某月某日解密文'];
        } else if (values['解密條件或保密期限'] == '其他') {
            values['解密條件或保密期限'] = values['其他']
            values['其他'] = true;
        }

        var wkContent = OA.common.Global.getCurrentWKContent();
        var tagFile = OA.common.Utils.getTagText(wkContent, '密等及解密條件或保密期限');
        var items = [];
        items.push({ Key: "密等", Value: values['密等'], tagName: "Property" });
        if (values['其他'] == true) {
            if (values['解密條件或保密期限'].trim().length > 0) {
                items.push({ Key: "解密條件或保密期限", Value: '其他：' + values['解密條件或保密期限'], tagName: "Property" });
            } else {
                items.push({ Key: "解密條件或保密期限", Value: '其他', tagName: "Property" });
            }
        } else {
            items.push({ Key: "解密條件或保密期限", Value: values['解密條件或保密期限'], tagName: "Property" });
        }
        tagFile.childNodes = items;
        OA.common.Global.setCurrentWKContent(wkContent);

        var svg = this.getSvgPaper();
        var svgElem = svg.getElem('密等及解密條件或保密期限');

        var l = values['密等'].trim().length;
        var content = '';
        if (l > 0) {
            if (values['其他'] == true) {
                if (values['解密條件或保密期限'].trim().length > 0) {
                    content = values['密等'] + '(其他：' + values['解密條件或保密期限'] + ')';
                } else {
                    content = values['密等'] + '(其他)';
                }
            }
            else {
                if ((values['解密條件或保密期限'])) {
                    if ((values['解密條件或保密期限'] + '').trim() != '') {
                        content = values['密等'] + '(' + values['解密條件或保密期限'] + ')'
                    } else {
                        content = values['密等'];
                    }
                } else {
                    content = values['密等'];
                }
                //content = (values['解密條件或保密期限']) ? values['密等'] + '(' + values['解密條件或保密期限'] + ')' : values['密等'];
            }
        }
        if (svgElem) svgElem.textContent = content;
        me.svgUpdateLayout();

        me.setStatus('edit');
    },
    /**
     * 更新開會時間
     *
     * @param {string} key
     * @param {object} values
     */
    updateDateFiled: function (key, values) {
        var me = this;

        Ext.apply(OA.common.Global.getCurrentViewModel(), values);
        var wkContent = OA.common.Global.getCurrentWKContent();
        var tagFile = OA.common.Utils.getTagText(wkContent, key);

        var items = [];
        items.push({ Key: "年月日", Value: values.年月日, tagName: "Property" });
        items.push({ Key: "星期", Value: values.星期, tagName: "Property" });
        items.push({ Key: "時分", Value: values.時分, tagName: "Property" });

        if (values.年月日止) items.push({ Key: "年月日止", Value: values.年月日止, tagName: "Property" });
        if (values.星期止) items.push({ Key: "星期止", Value: values.星期止, tagName: "Property" });
        if (values.時分止) items.push({ Key: "時分止", Value: values.時分止, tagName: "Property" });

        tagFile.childNodes = items;
        OA.common.Global.setCurrentWKContent(wkContent);

        var svg = this.getSvgPaper();
        var svgElem = svg.getElem(key);
        if (svgElem) {
            svgElem.textContent = values[key];
            me.elemInBoundary(key, svgElem);
        }

        me.svgUpdateLayout();
        me.setStatus('edit');
    },
    /**
     * checkbox
     *
     * @param {string} key
     * @param {object} values
     */
    doCheckboxFiled: function (key) {
        var vm = OA.common.Global.getCurrentViewModel();
        if (key === '其他') {
            var checkbox = svgedit.utilities.getElem(key + '_title');
            var desc = '';
            if (checkbox) {
                var isCheck = checkbox.textContent.indexOf('■') >= 0;
                if (isCheck) {
                    //this.updateCheckboxFiled(key, '                          ');
                    this.updateCheckboxFiled(key, '', true);
                    return;
                }

                //var idx = checkbox.textContent.indexOf('請說明：') + 4;
                //desc = checkbox.textContent.substring(idx);
                var exp = svgedit.utilities.getElem('請說明');
                if (exp) {
                    var idx = exp.textContent.lastIndexOf('）');
                    if (idx > 0) {
                        desc = exp.textContent.substring(0, idx);

                    } else {
                        desc = '';
                    }

                }
                //desc = desc.replace('）', '').trim();
            }
            Ext.Msg.prompt('', '請說明: ', function (ok, value) {
                if (ok === 'ok') {
                    this.updateCheckboxFiled(key, value, true);
                }
            }, this, false, desc);
        } else {
            //check is SealCoverApply
            if (vm && vm.templateUrl && vm.templateUrl == 'web/SealCoverApply.svg') {
                this.updateCheckboxFiled(key, '', true);
            } else {
                this.updateCheckboxFiled(key);
            }
        }
    },
    /**
     * checkbox
     *
     * @param {string} key
     * @param {object} values
     */
    updateCheckboxFiled: function (key, value, status) {
        // 判斷已存檔功能 - by yi-chi chiu
        OA.app.isSavedFlag = false;
        var me = this;
        var checkbox = svgedit.utilities.getElem(key + '_title');
        if (checkbox) {
            //if (value) {
            // 修正蓋用印信申請表點選除了其他以外的欄位，說明顯示undifined - by yi-chi chiu
            // value = value + '）';
            if (key == '其他') {
                value = (value) ? value + '）' : '）';
                var exp = svgedit.utilities.getElem('請說明');
                if (exp) {
                    exp.textContent = value;
                    me.elemInBoundary('請說明', exp);
                }
            }
            //var exp = svgedit.utilities.getElem('請說明');
            //if (exp) {
            //    exp.textContent = value + '）';
            //}
            //var idx = checkbox.textContent.indexOf('請說明：') + 4;
            //var desc = checkbox.textContent.substring(0, idx) + value + '）';
            //checkbox.textContent = desc;
            //}
            if (status) {
                var isCheck = checkbox.textContent.indexOf('□') >= 0;
                if (isCheck) {
                    checkbox.textContent = checkbox.textContent.replace('□', '■');
                } else {
                    checkbox.textContent = checkbox.textContent.replace('■', '□');
                }
            }
        }

        var group = OA.common.Fields.Enum.properties[key].group;
        var boxValues = {};
        for (var it in OA.common.Fields.Enum.properties) {
            if (OA.common.Fields.Enum.properties.hasOwnProperty(it)) {
                var pro = OA.common.Fields.Enum.properties[it];
                if (group === pro.group) {
                    checkbox = svgedit.utilities.getElem(pro.code + '_title');
                    boxValues[pro.code] = checkbox.textContent;
                }
            }
        }
        // console.log(boxValues);
        // Ext.apply(OA.common.Global.getCurrentViewModel(), boxValues);

        var wkContent = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        var tag = OA.common.Utils.getTagText(wkContent, group);
        var items = [];
        var vmItems = [];
        for (var id in boxValues) {
            if (boxValues.hasOwnProperty(id)) {
                items.push({ Key: id, Value: boxValues[id], tagName: "Property" });
                vmItems.push({ key: id, value: boxValues[id], group: group, onlyTitle: true });
            }
        }
        vm.書狀名稱 = vmItems;//同步更新VM
        tag.childNodes = items;
        vm.請說明 = value;
        var expTag = OA.common.Utils.getTagText(wkContent, '請說明');
        if (expTag) {
            expTag.childNodes = [{ Key: '請說明', Value: value, tagName: "Property" }];
            //console.log(expTag);
        }
        OA.common.Global.setCurrentWKContent(wkContent);
        me.setStatus('edit');
    },
    /**
     * 本件至某年某月某日解密
     */
    openSecurityDate: function (ctr) {
        var me = this;
        Ext.override(Ext.field.Text, {
            setValue: function (value) {
                if (this.config.dateFormat && value) {
                    if (Ext.isDate(value)) {
                        value = Ext.Date.format(value, this.config.dateFormat);
                    } else {
                        var d = new Date(value);
                        value = Ext.Date.format(d, this.config.dateFormat);
                    }
                }
                this.callSuper(arguments);
            }
        });
        var dt = (ctr.getValue()) ? new Date(ctr.getValue()) : new Date();
        var toolbarItems = [
            {
                xtype: 'textfield',
                name: 'start',
                width: 230,
                value: dt,
                clearIcon: false,
                dateFormat: "Y/m/d",
                listeners: {
                    keyup: function (ctr, e, eOpts) {
                        var tryDateStart = Ext.Date.parse(ctr.getValue(), "Y/m/d", true);
                        if (!tryDateStart) {
                            Ext.Msg.alert('格式不符', '如： 2017/01/01');
                            return;
                        }
                        calendarView.setValue(tryDateStart);
                        calendarView.currentDate = tryDateStart;
                        calendarView.refresh();
                    }
                }
            },
            {
                xtype: 'spacer'
            },
            {
                text: '清空',
                ui: 'action',
                handler: function (button) {
                    ctr.setValue('');
                    button.up('panel').hide();
                }
            },
            {
                text: '完成',
                ui: 'action',
                handler: function (button) {
                    var ctrStartDateTime = this.up('panel').down('textfield[name=start]');
                    var tryDateStart = Ext.Date.parse(ctrStartDateTime.getValue(), "Y/m/d", true);
                    if (!tryDateStart) {
                        Ext.Msg.alert('格式不符', '如： 2017/01/01');
                        return;
                    }
                    var value;
                    if (Ext.isDate(calendarView.getValue())) {
                        value = Ext.Date.format(calendarView.getValue(), ctr.config.dateFormat);
                    } else {
                        var d = new Date(calendarView.getValue());
                        value = Ext.Date.format(d, ctr.config.dateFormat);
                    }
                    ctr.setValue(value);
                    button.up('panel').hide();
                }
            }
        ];

        // 民國年欄位(本件至某年某月某日解密) - by yi-chiu chiu
        var toolbarItems2DefaultValue = (dt.getFullYear() - 1911).toString() + "/" + (dt.getMonth() + 1).toString().padStart(2, '0') + "/" + dt.getDate().toString().padStart(2, '0');
        var toolbarItems2 = [
            {
                xtype: 'textfield', name: 'start2', width: 230, value: toolbarItems2DefaultValue, clearIcon: false,
                listeners: {
                    keyup: function (ctr, e, eOpts) {
                        // 西元年欄位連動 - by yi-chi chiu
                        var index = ctr.getValue().indexOf("/");
                        if (!index) return;
                        var testDate = (parseInt(ctr.getValue().slice(0, index)) + 1911).toString() + ctr.getValue().slice(index);
                        var tryDateStart = Ext.Date.parse(testDate, "Y/m/d", true);
                        if (!tryDateStart) {
                            return;
                        }
                        calendarView.setValue(tryDateStart);
                        calendarView.currentDate = tryDateStart;
                        calendarView.refresh();
                        var ctrStartDateTime = this.up('panel').down('textfield[name=start]');
                        ctrStartDateTime.setValue(tryDateStart);
                    }
                }
            },
            {
                xtype: 'spacer'
            },
            {
                text: '清空',
                ui: 'action',
                handler: function (button) {
                    ctr.setValue('');
                    button.up('panel').hide();
                }
            },
            {
                text: '完成',
                ui: 'action',
                handler: function (button) {
                    var ctrStartDateTime = this.up('panel').down('textfield[name=start]');
                    var tryDateStart = Ext.Date.parse(ctrStartDateTime.getValue(), "Y/m/d", true);
                    var ctrStartDateTime2 = this.up('panel').down('textfield[name=start2]');
                    var index = ctrStartDateTime2.getValue().indexOf("/");
                    if (!index) {
                        Ext.Msg.alert('格式不符', '如：108/01/01');
                        return;
                    }
                    var testDate = (parseInt(ctrStartDateTime2.getValue().slice(0, index)) + 1911).toString() + ctrStartDateTime2.getValue().slice(index);
                    var tryDateStart2 = Ext.Date.parse(testDate, "Y/m/d", true);
                    if (!tryDateStart2 || !tryDateStart) {
                        Ext.Msg.alert('格式不符', '如： 108/01/01');
                        return;
                    }
                    // var value;
                    // if (Ext.isDate(calendarView.getValue())) {
                    //     value = Ext.Date.format(calendarView.getValue(), ctr.config.dateFormat);
                    // } else {
                    //     var d = new Date(calendarView.getValue());
                    //     value = Ext.Date.format(d, ctr.config.dateFormat);
                    // }
                    // ctr.setValue(value);
                    ctr.setValue(ctrStartDateTime2.getValue());
                    button.up('panel').hide();
                    // 判斷已存檔功能 - by yi-chi chiu
                    OA.app.isSavedFlag = false;
                }
            }
        ];

        var calendarView = Ext.createByAlias('widget.touchcalendarview', {
            viewMode: 'month',
            value: dt,
            width: 350,
            height: 300,
            layout: {
                type: 'fit'
            }
        });
        calendarView.on('selectionchange', function (ctr, newValue, oldValue) {
            var ctrTxtDateTime = ctr.up('panel').down('textfield[name=start]');
            var times = ctrTxtDateTime.getValue().split(' ');
            var d = Ext.Date.clearTime(newValue, true);
            var dtSelect = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            ctrTxtDateTime.setValue(dtSelect);

            // 民國欄位連動 - by yi-chi chiu
            var ctrTxtDateTime2 = ctr.up('panel').down('textfield[name=start2]');
            ctrTxtDateTime2.setValue((d.getFullYear() - 1911).toString() + "/" + (d.getMonth() + 1).toString().padStart(2, '0') + "/" + d.getDate().toString().padStart(2, '0'));
        });
        Ext.create('Ext.Panel', {
            top: 100,
            left: 100,
            modal: true,
            hideOnMaskTap: true,
            fullscreen: true,
            floating: true,
            layout: {
                type: 'vbox'
            },
            items: [
                calendarView,
                {
                    xtype: 'toolbar',
                    items: toolbarItems,
                    // 隱藏西元年欄位 - by yi-chi chiu
                    hidden: true
                },
                {
                    xtype: 'toolbar',
                    items: toolbarItems2
                }
            ]
        }).showBy(ctr);
    },
    /**
     * 發文日期
     */
    openPickerDate: function (key) {
        Ext.override(Ext.field.Text, {
            setValue: function (value) {
                if (this.config.dateFormat && value) {
                    if (Ext.isDate(value)) {
                        value = Ext.Date.format(value, this.config.dateFormat);
                    } else {
                        var d = new Date(value);
                        value = Ext.Date.format(d, this.config.dateFormat);
                    }
                }
                this.callSuper(arguments);
            }
        });
        var me = this;
        var data = OA.common.Global.getCurrentViewModel();
        var preCaption = '';
        if (key == OA.common.Fields.Enum.FormYMD) {
            key = key + '_title';
        }
        else if (key == OA.common.Fields.Enum.FormSentDate) {
            preCaption = '中華民國';
        }

        var d = (data[key]) ? data[key].trim() : null;
        var dt = (d) ? OA.common.Utils.toChineseDateTime(d) : new Date();
        var toolbarItems = [
            {
                xtype: 'textfield',
                name: 'start',
                width: 230,
                value: dt,
                clearIcon: false,
                dateFormat: "Y/m/d",
                listeners: {
                    keyup: function (ctr, e, eOpts) {
                        var tryDateStart = Ext.Date.parse(ctr.getValue(), "Y/m/d", true);
                        if (!tryDateStart) {
                            Ext.Msg.alert('格式不符', '如： 2017/01/01');
                            return;
                        }
                        calendarView.setValue(tryDateStart);
                        calendarView.currentDate = tryDateStart;
                        calendarView.refresh();
                    }
                }
            },
            {
                xtype: 'spacer'
            },
            {
                text: '清空',
                ui: 'action',
                handler: function (button) {
                    var o = {};
                    o[key] = ' ';
                    me.updateContent(o);
                    button.up('panel').hide();
                }
            },
            {
                text: '完成',
                ui: 'action',
                handler: function (button) {
                    var ctrStartDateTime = this.up('panel').down('textfield[name=start]');
                    var tryDateStart = Ext.Date.parse(ctrStartDateTime.getValue(), "Y/m/d", true);
                    if (!tryDateStart) {
                        Ext.Msg.alert('格式不符', '如： 2017/01/01');
                        return;
                    }
                    var wkDateStart = OA.common.Utils.toWkDates(tryDateStart, preCaption);
                    var o = {};
                    o[key] = wkDateStart[0];
                    me.updateContent(o);
                    button.up('panel').hide();
                    me.setStatus('edit');
                }
            }
        ];

        // 民國年欄位(發文日期) - by yi-chiu chiu
        var toolbarItems2DefaultValue = (dt.getFullYear() - 1911).toString() + "/" + (dt.getMonth() + 1).toString().padStart(2, '0') + "/" + dt.getDate().toString().padStart(2, '0');
        var toolbarItems2 = [
            {
                xtype: 'textfield', name: 'start2', width: 230, value: toolbarItems2DefaultValue, clearIcon: false,
                listeners: {
                    keyup: function (ctr, e, eOpts) {
                        // 西元年欄位連動 - by yi-chi chiu
                        var index = ctr.getValue().indexOf("/");
                        if (!index) return;
                        var testDate = (parseInt(ctr.getValue().slice(0, index)) + 1911).toString() + ctr.getValue().slice(index);
                        var tryDateStart = Ext.Date.parse(testDate, "Y/m/d", true);
                        if (!tryDateStart) {
                            return;
                        }
                        calendarView.setValue(tryDateStart);
                        calendarView.currentDate = tryDateStart;
                        calendarView.refresh();
                        var ctrStartDateTime = this.up('panel').down('textfield[name=start]');
                        ctrStartDateTime.setValue(tryDateStart);
                    }
                }
            },
            { xtype: 'spacer' },
            {
                text: '清空',
                id: 'YMDclear',
                ui: 'action',
                handler: function (button) {
                    var o = {};
                    o[key] = ' ';
                    me.updateContent(o);
                    button.up('panel').hide();
                }
            },
            {
                text: '完成',
                ui: 'action',
                handler: function (button) {
                    var ctrStartDateTime = this.up('panel').down('textfield[name=start]');
                    var ctrStartDateTime2 = this.up('panel').down('textfield[name=start2]');
                    var tryDateStart = Ext.Date.parse(ctrStartDateTime.getValue(), "Y/m/d", true);
                    var index = ctrStartDateTime2.getValue().indexOf("/");
                    if (!index) {
                        Ext.Msg.alert('格式不符', '如：108/01/01');
                        return;
                    }
                    var testDate = (parseInt(ctrStartDateTime2.getValue().slice(0, index)) + 1911).toString() + ctrStartDateTime2.getValue().slice(index);
                    var tryDateStart2 = Ext.Date.parse(testDate, "Y/m/d", true);
                    if (!tryDateStart2 || !tryDateStart) {
                        Ext.Msg.alert('格式不符', '如： 108/01/01');
                        return;
                    }
                    var wkDateStart = OA.common.Utils.toWkDates(tryDateStart, preCaption);
                    var o = {};
                    o[key] = wkDateStart[0];
                    me.updateContent(o);

                    button.up('panel').hide();
                    me.setStatus('edit');
                    // 判斷已存檔功能 - by yi-chi chiu
                    OA.app.isSavedFlag = false;
                }
            }
        ];

        var calendarView = Ext.createByAlias('widget.touchcalendarview', {
            viewMode: 'month',
            value: dt,
            width: 350,
            height: 300,
            layout: {
                type: 'fit'
            }
        });
        calendarView.on('selectionchange', function (ctr, newValue, oldValue) {
            var ctrTxtDateTime = ctr.up('panel').down('textfield[name=start]');
            var times = ctrTxtDateTime.getValue().split(' ');
            var d = Ext.Date.clearTime(newValue, true);
            var dtSelect = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            ctrTxtDateTime.setValue(dtSelect);

            // 民國欄位連動 - by yi-chi chiu
            var ctrTxtDateTime2 = ctr.up('panel').down('textfield[name=start2]');
            ctrTxtDateTime2.setValue((d.getFullYear() - 1911).toString() + "/" + (d.getMonth() + 1).toString().padStart(2, '0') + "/" + d.getDate().toString().padStart(2, '0'));
        });
        var but = OA.common.Global.getApp().getController('OA.controller.Work').getButFields();
        Ext.create('Ext.Panel', {
            top: 100,
            left: 100,
            modal: true,
            hideOnMaskTap: true,
            fullscreen: true,
            floating: true,
            layout: {
                type: 'vbox'
            },
            items: [
                calendarView,
                {
                    xtype: 'toolbar',
                    items: toolbarItems,
                    // 隱藏西元年欄位 - by yi-chi chiu
                    hidden: true
                },
                {
                    xtype: 'toolbar',
                    items: toolbarItems2
                }
            ]
        }).showBy(but);

        //0224 電子信箱回覆函 強制押上日期  Chloe.sia
        //var docType = OA.common.Global.getInitParas() || '';
        //if (docType.documentType == '電子信箱回覆函') {
        //    Ext.getCmp('YMDclear').setHidden(true);
        //}

    },
    openPickerDateMobile: function (key) {
        var me = this;
        var data = OA.common.Global.getCurrentViewModel();

        var preCaption = '';
        if (key == OA.common.Fields.Enum.FormYMD)
            key = key + '_title';
        else if (key == OA.common.Fields.Enum.FormSentDate)
            preCaption = '中華民國';

        var d = (data[key]) ? data[key].trim() : null;
        var dt = (d) ? OA.common.Utils.toChineseDateTime(d) : new Date();
        var toolbarItems = [
            { xtype: 'spacer' },
            {
                text: '清空',
                ui: 'action',
                handler: function (button) {
                    var o = {};
                    o[key] = ' ';
                    me.updateContent(o);
                    button.up('panel').hide();
                }
            },
            {
                text: '完成',
                ui: 'action',
                handler: function (button) {
                    var wkDate = OA.common.Utils.toWkDates(calendarView.getValue(), preCaption);
                    var o = {};
                    o[key] = wkDate[0];
                    me.updateContent(o);
                    button.up('panel').hide();
                }
            }
        ];

        var picker = Ext.getCmp('pickerDateTime');
        if (!picker) {
            picker = Ext.create('Ext.picker.Date', {
                id: 'pickerDateTime',
                useTitles: false,
                doneButton: false,
                cancelButton: false,
                hidden: true,
                minuteInterval: 1,
                destroyPickerOnHide: false,
                hideOnMaskTap: true,
                slotOrder: ['year', 'month', 'day'],
                toolbar: {
                    xtype: 'toolbar'
                }
            });
            Ext.Viewport.add(picker);
        }

        picker.getToolbar().setItems(toolbarItems);
        picker.setValue(dt);
        picker.show();
    },
    /**
     * 開會時間
     */
    openPickerDateTime: function (key) {
        var me = this;
        var data = OA.common.Global.getCurrentViewModel();
        var d = OA.common.Utils.toChineseDateTime(data.年月日, data.時分);
        var dt = d || new Date();
        Ext.override(Ext.field.Text, {
            setValue: function (value) {
                if (this.config.dateFormat && value) {
                    if (Ext.isDate(value)) {
                        value = Ext.Date.format(value, this.config.dateFormat);
                    } else {
                        var d = new Date(value);
                        value = Ext.Date.format(d, this.config.dateFormat);
                    }
                }
                this.callSuper(arguments);
            }
        });
        var toolbarItems = [
            {
                xtype: 'textfield',
                width: 230,
                value: dt,
                clearIcon: false,
                dateFormat: "Y/m/d H:i"
            },
            {
                xtype: 'spacer'
            },
            {
                text: '完成',
                ui: 'action',
                handler: function () {
                    var ctrTxtDateTime = this.up('panel').down('textfield');
                    var tryDate = Ext.Date.parse(ctrTxtDateTime.getValue(), "Y/m/d H:i", true);
                    //if (!tryDate) tryDate = Ext.Date.parse(ctrTxtDateTime.getValue().trim(), "Y/m/d", true);
                    if (!tryDate) {
                        Ext.Msg.alert('格式不符', '如： 2017/01/01 14:30');
                        //Ext.Msg.alert('格式不符', '如： 2017/01/01 14:30、 2017/01/01');
                        return;
                    }
                    var wkDate = OA.common.Utils.toWkDates(tryDate, '中華民國');
                    var v = wkDate[0] + ' (' + wkDate[2] + ') ' + wkDate[1];
                    var o = {};
                    o.年月日 = wkDate[0];
                    o.星期 = wkDate[2];
                    o.時分 = wkDate[1];
                    o[key] = v;
                    OA.common.Paper.main().updateDateFiled(key, o);
                    this.up('panel').hide();
                    me.setStatus('edit');
                }
            }
        ];

        // 民國年欄位(開會時間) - by yi-chiu chiu
        var toolbarItems2DefaultValue = (dt.getFullYear() - 1911).toString() + "/" + (dt.getMonth() + 1).toString().padStart(2, '0') + "/" + dt.getDate().toString().padStart(2, '0') + " " + dt.getHours().toString().padStart(2, '0') + ":" + dt.getMinutes().toString().padStart(2, '0');
        var toolbarItems2 = [
            {
                xtype: 'textfield',
                name: 'start2',
                width: 230,
                value: toolbarItems2DefaultValue,
                clearIcon: false,
                listeners: {
                    keyup: function (ctr, e, eOpts) {
                        // 西元年欄位連動 - by yi-chi chiu
                        var index = ctr.getValue().indexOf("/");
                        if (!index) {
                            return;
                        }
                        var testDate = (parseInt(ctr.getValue().slice(0, index)) + 1911).toString() + ctr.getValue().slice(index);
                        var tryDate = Ext.Date.parse(testDate, "Y/m/d H:i", true);
                        if (!tryDate) {
                            return;
                        }
                        calendarView.setValue(tryDate);
                        calendarView.currentDate = tryDate;
                        calendarView.refresh();
                        var ctrStartDateTime = this.up('panel').down('textfield');
                        ctrStartDateTime.setValue(tryDate);
                    }
                }
            },
            {
                xtype: 'spacer'
            },
            {
                text: '完成',
                ui: 'action',
                handler: function () {
                    var ctrTxtDateTime = this.up('panel').down('textfield');
                    var ctrTxtDateTime2 = this.up('panel').down('textfield[name=start2]');
                    var tryDate = Ext.Date.parse(ctrTxtDateTime.getValue(), "Y/m/d H:i", true);
                    //if (!tryDate) tryDate = Ext.Date.parse(ctrTxtDateTime.getValue().trim(), "Y/m/d", true);
                    var index = ctrTxtDateTime2.getValue().indexOf("/");
                    if (!index) {
                        Ext.Msg.alert('格式不符', '如：108/01/01');
                        return;
                    }
                    var testDate = (parseInt(ctrTxtDateTime2.getValue().slice(0, index)) + 1911).toString() + ctrTxtDateTime2.getValue().slice(index);
                    var tryDate2 = Ext.Date.parse(testDate, "Y/m/d H:i", true);
                    if (!tryDate || !tryDate2) {
                        Ext.Msg.alert('格式不符', '如： 108/01/01 14:30');
                        //Ext.Msg.alert('格式不符', '如： 2017/01/01 14:30、 2017/01/01');
                        return;
                    }
                    var wkDate = OA.common.Utils.toWkDates(tryDate, '中華民國');
                    var v = wkDate[0] + ' (' + wkDate[2] + ') ' + wkDate[1];
                    var o = {};
                    o.年月日 = wkDate[0];
                    o.星期 = wkDate[2];
                    o.時分 = wkDate[1];
                    o[key] = v;
                    OA.common.Paper.main().updateDateFiled(key, o);
                    this.up('panel').hide();
                    me.setStatus('edit');
                    // 判斷已存檔功能 - by yi-chi chiu
                    OA.app.isSavedFlag = false;
                }
            }
        ];

        var calendarView = Ext.createByAlias('widget.touchcalendarview', {
            viewMode: 'month',
            value: dt,
            width: 350,
            height: 300,
            layout: {
                type: 'fit'
            }
        });
        calendarView.on('selectionchange', function (ctr, newValue, oldValue) {
            var ctrTxtDateTime = ctr.up('panel').down('textfield');
            var times = ctrTxtDateTime.getValue().split(' ');
            var d = Ext.Date.clearTime(newValue, true);
            var t = Ext.Date.parse(times[1], "H:i");
            var dtSelect = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes());
            ctrTxtDateTime.setValue(dtSelect);

            // 民國欄位連動 - by yi-chi chiu
            var ctrTxtDateTime2 = ctr.up('panel').down('textfield[name=start2]');
            ctrTxtDateTime2.setValue((d.getFullYear() - 1911).toString() + "/" + (d.getMonth() + 1).toString().padStart(2, '0') + "/" + d.getDate().toString().padStart(2, '0') + " " + t.getHours().toString().padStart(2, '0') + ":" + t.getMinutes().toString().padStart(2, '0'));
        });
        var but = OA.common.Global.getApp().getController('OA.controller.Work').getButFields();
        Ext.create('Ext.Panel', {
            top: 100,
            left: 100,
            modal: true,
            hideOnMaskTap: true,
            fullscreen: true,
            floating: true,
            layout: {
                type: 'hbox'
            },
            items: [
                calendarView,
                {
                    xtype: 'toolbar',
                    docked: 'bottom',
                    items: toolbarItems,
                    // 隱藏西元年欄位 - by yi-chi chiu
                    hidden: true
                },
                {
                    xtype: 'toolbar',
                    docked: 'bottom',
                    items: toolbarItems2
                }
            ]
        }).showBy(but);
    },
    /**
     * 通訊時間
     */
    pickerBetweenDateTime: function (key) {
        var me = this;
        var data = OA.common.Global.getCurrentViewModel();
        var dtStart = OA.common.Utils.toChineseDateTime(data.年月日, data.時分) || new Date();
        var dtEnd = OA.common.Utils.toChineseDateTime(data.年月日止, data.時分止) || new Date();
        Ext.override(Ext.field.Text, {
            setValue: function (value) {
                if (this.config.dateFormat && value) {
                    if (Ext.isDate(value)) {
                        value = Ext.Date.format(value, this.config.dateFormat);
                    } else {
                        var d = new Date(value);
                        value = Ext.Date.format(d, this.config.dateFormat);
                    }
                }
                this.callSuper(arguments);
            }
        });
        var toolbarItems = [
            {
                xtype: 'textfield',
                name: 'start',
                width: 230,
                value: dtStart,
                clearIcon: false,
                dateFormat: "Y/m/d H:i"
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'label',
                html: ' ~ ',
                style: 'margin:0px 0px 0px 100px'
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'textfield',
                name: 'end',
                width: 230,
                value: dtEnd,
                clearIcon: false,
                dateFormat: "Y/m/d H:i",
                style: 'margin:0px 0px 0px 60px'
            },
            {
                xtype: 'spacer'
            },
            {
                text: '完成',
                ui: 'action',
                handler: function () {
                    var ctrStartDateTime = this.up('panel').down('textfield[name=start]');
                    var ctrEndDateTime = this.up('panel').down('textfield[name=end]');
                    var tryDateStart = Ext.Date.parse(ctrStartDateTime.getValue(), "Y/m/d H:i", true);
                    if (!tryDateStart) {
                        Ext.Msg.alert('格式不符', '如： 2017/01/01 14:30');
                        return;
                    }
                    var tryDateEnd = Ext.Date.parse(ctrEndDateTime.getValue(), "Y/m/d H:i", true);
                    if (!tryDateEnd) {
                        Ext.Msg.alert('格式不符', '如： 2017/01/01 14:30');
                        return;
                    }
                    var wkDateStart = OA.common.Utils.toWkDates(tryDateStart);
                    var wkDateEnd = OA.common.Utils.toWkDates(tryDateEnd);
                    var v = wkDateStart[0] + wkDateStart[1] + '起至' + wkDateEnd[0] + wkDateEnd[1] + '止';
                    var o = {};
                    o.年月日 = wkDateStart[0];
                    o.星期 = wkDateStart[2];
                    o.時分 = wkDateStart[1];
                    o.年月日止 = wkDateEnd[0];
                    o.星期止 = wkDateEnd[2];
                    o.時分止 = wkDateEnd[1];
                    o[key] = v;
                    OA.common.Paper.main().updateDateFiled(key, o);
                    this.up('panel').hide();
                    me.setStatus('edit');
                }
            }
        ];

        // 民國年欄位(通訊時間) - by yi-chiu chiu
        var toolbarItems2DefaultValue = (dtStart.getFullYear() - 1911).toString() + "/" + (dtStart.getMonth() + 1).toString().padStart(2, '0') + "/" + dtStart.getDate().toString().padStart(2, '0') + " " + dtStart.getHours().toString().padStart(2, '0') + ":" + dtStart.getMinutes().toString().padStart(2, '0');
        var toolbarItems2_2DefaultValue = (dtEnd.getFullYear() - 1911).toString() + "/" + (dtEnd.getMonth() + 1).toString().padStart(2, '0') + "/" + dtEnd.getDate().toString().padStart(2, '0') + " " + dtEnd.getHours().toString().padStart(2, '0') + ":" + dtEnd.getMinutes().toString().padStart(2, '0');
        var toolbarItems2 = [
            {
                xtype: 'textfield',
                name: 'start2',
                width: 230,
                value: toolbarItems2DefaultValue,
                clearIcon: false,
                listeners: {
                    keyup: function (ctr, e, eOpts) {
                        // 西元年欄位連動 - by yi-chi chiu
                        var index = ctr.getValue().indexOf("/");
                        if (!index) {
                            return;
                        }
                        var testDate = (parseInt(ctr.getValue().slice(0, index)) + 1911).toString() + ctr.getValue().slice(index);
                        var tryDate = Ext.Date.parse(testDate, "Y/m/d H:i", true);
                        if (!tryDate) {
                            return;
                        }
                        calendarView.setValue(tryDate);
                        calendarView.currentDate = tryDate;
                        calendarView.refresh();
                        var ctrStartDateTime = this.up('panel').down('textfield[name=start]');
                        ctrStartDateTime.setValue(tryDate);
                    }
                }
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'label',
                html: ' ~ ',
                style: 'margin:0px 0px 0px 100px'
            },
            {
                xtype: 'spacer'
            },
            {
                xtype: 'textfield',
                name: 'end2',
                width: 230,
                value: toolbarItems2_2DefaultValue,
                clearIcon: false,
                style: 'margin:0px 0px 0px 60px',
                listeners: {
                    keyup: function (ctr, e, eOpts) {
                        // 西元年欄位連動 - by yi-chi chiu
                        var index = ctr.getValue().indexOf("/");
                        if (!index) {
                            return;
                        }
                        var testDate = (parseInt(ctr.getValue().slice(0, index)) + 1911).toString() + ctr.getValue().slice(index);
                        var tryDate = Ext.Date.parse(testDate, "Y/m/d H:i", true);
                        if (!tryDate) {
                            return;
                        }
                        calendarView1.setValue(tryDate);
                        calendarView1.currentDate = tryDate;
                        calendarView1.refresh();
                        var ctrStartDateTime = this.up('panel').down('textfield[name=end]');
                        ctrStartDateTime.setValue(tryDate);
                    }
                }
            },
            {
                xtype: 'spacer'
            },
            {
                text: '完成',
                ui: 'action',
                handler: function () {
                    var ctrStartDateTime = this.up('panel').down('textfield[name=start]');
                    var ctrStartDateTime2 = this.up('panel').down('textfield[name=start2]');
                    var ctrEndDateTime = this.up('panel').down('textfield[name=end]');
                    var ctrEndDateTime2 = this.up('panel').down('textfield[name=end2]');
                    var tryDateStart = Ext.Date.parse(ctrStartDateTime.getValue(), "Y/m/d H:i", true);
                    var index = ctrStartDateTime2.getValue().indexOf("/");
                    if (!index) {
                        Ext.Msg.alert('格式不符', '如：108/01/01 14:30');
                        return;
                    }
                    var testDate = (parseInt(ctrStartDateTime2.getValue().slice(0, index)) + 1911).toString() + ctrStartDateTime2.getValue().slice(index);
                    var tryDateStart2 = Ext.Date.parse(testDate, "Y/m/d H:i", true);
                    if (!tryDateStart || !tryDateStart2) {
                        Ext.Msg.alert('格式不符', '如： 108/01/01 14:30');
                        return;
                    }
                    var tryDateEnd = Ext.Date.parse(ctrEndDateTime.getValue(), "Y/m/d H:i", true);
                    var index2 = ctrEndDateTime2.getValue().indexOf("/");
                    if (!index2) {
                        Ext.Msg.alert('格式不符', '如：108/01/01 14:30');
                        return;
                    }
                    var testDate2 = (parseInt(ctrEndDateTime2.getValue().slice(0, index)) + 1911).toString() + ctrEndDateTime2.getValue().slice(index);
                    var tryDateEnd2 = Ext.Date.parse(testDate2, "Y/m/d H:i", true);
                    if (!tryDateEnd || !tryDateEnd2) {
                        Ext.Msg.alert('格式不符', '如： 108/01/01 14:30');
                        return;
                    }
                    var wkDateStart = OA.common.Utils.toWkDates(tryDateStart);
                    var wkDateEnd = OA.common.Utils.toWkDates(tryDateEnd);
                    var v = wkDateStart[0] + wkDateStart[1] + '起至' + wkDateEnd[0] + wkDateEnd[1] + '止';
                    var o = {};
                    o.年月日 = wkDateStart[0];
                    o.星期 = wkDateStart[2];
                    o.時分 = wkDateStart[1];
                    o.年月日止 = wkDateEnd[0];
                    o.星期止 = wkDateEnd[2];
                    o.時分止 = wkDateEnd[1];
                    o[key] = v;
                    OA.common.Paper.main().updateDateFiled(key, o);
                    this.up('panel').hide();
                    me.setStatus('edit');
                    // 判斷已存檔功能 - by yi-chi chiu
                    OA.app.isSavedFlag = false;
                }
            }
        ];
        var calendarView = Ext.createByAlias('widget.touchcalendarview', {
            viewMode: 'month',
            value: dtStart,
            width: 320,
            height: 300,
            layout: {
                type: 'fit'
            }
        });
        calendarView.on('selectionchange', function (ctr, newValue, oldValue) {
            var ctrTxtDateTime = ctr.up('panel').down('textfield[name=start]');
            var times = ctrTxtDateTime.getValue().split(' ');
            var d = Ext.Date.clearTime(newValue, true);
            var t = Ext.Date.parse(times[1], "H:i");
            var dtSelect = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes());
            ctrTxtDateTime.setValue(dtSelect);

            // 民國欄位連動 - by yi-chi chiu
            var ctrTxtDateTime2 = ctr.up('panel').down('textfield[name=start2]');
            ctrTxtDateTime2.setValue((d.getFullYear() - 1911).toString() + "/" + (d.getMonth() + 1).toString().padStart(2, '0') + "/" + d.getDate().toString().padStart(2, '0') + " " + t.getHours().toString().padStart(2, '0') + ":" + t.getMinutes().toString().padStart(2, '0'));
        });
        var calendarView1 = Ext.createByAlias('widget.touchcalendarview', {
            viewMode: 'month',
            value: dtEnd,
            width: 320,
            height: 300,
            layout: {
                type: 'fit'
            },
            style: 'margin:0px 0px 0px 50px'
        });
        calendarView1.on('selectionchange', function (ctr, newValue, oldValue) {
            var ctrTxtDateTime = ctr.up('panel').down('textfield[name=end]');
            var times = ctrTxtDateTime.getValue().split(' ');
            var d = Ext.Date.clearTime(newValue, true);
            var t = Ext.Date.parse(times[1], "H:i");
            var dtSelect = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.getHours(), t.getMinutes());
            ctrTxtDateTime.setValue(dtSelect);

            // 民國欄位連動 - by yi-chi chiu
            var ctrTxtDateTime2 = ctr.up('panel').down('textfield[name=end2]');
            ctrTxtDateTime2.setValue((d.getFullYear() - 1911).toString() + "/" + (d.getMonth() + 1).toString().padStart(2, '0') + "/" + d.getDate().toString().padStart(2, '0') + " " + t.getHours().toString().padStart(2, '0') + ":" + t.getMinutes().toString().padStart(2, '0'));
        });
        var but = OA.common.Global.getApp().getController('OA.controller.Work').getButFields();
        Ext.create('Ext.Panel', {
            top: 100,
            left: 100,
            modal: true,
            hideOnMaskTap: true,
            fullscreen: true,
            floating: true,
            layout: {
                type: 'hbox'
            },
            items: [
                calendarView,
                calendarView1,
                {
                    xtype: 'toolbar',
                    docked: 'bottom',
                    items: toolbarItems,
                    // 隱藏西元年欄位 - by yi-chi chiu
                    hidden: true
                },
                {
                    xtype: 'toolbar',
                    docked: 'bottom',
                    items: toolbarItems2
                }
            ]
        }).showBy(but);
    },
    /**
     * 開會時間
     */
    openPickerDateTimeMobile: function (key) {
        var me = this;
        var data = OA.common.Global.getCurrentViewModel();
        var d = OA.common.Utils.toChineseDateTime(data.年月日, data.時分);
        var dt = d || new Date();
        var toolbarItems = [
            {
                text: '今天',
                handler: function () {
                    picker.setValue(new Date());
                }
            },
            { xtype: 'spacer' },
            {
                text: '完成',
                ui: 'action',
                handler: function () {
                    var thisCtr = OA.common.Paper.main();

                    var wkDate = OA.common.Utils.toWkDates(picker.getValue(true), '中華民國');

                    var v = wkDate[0] + ' ' + wkDate[2] + ' ' + wkDate[1];
                    var o = {};
                    o.年月日 = wkDate[0];
                    o.星期 = wkDate[2];
                    o.時分 = wkDate[1];
                    o[key] = v;
                    thisCtr.updateDateFiled(key, o);

                    picker.hide();
                    me.setStatus('edit');
                }
            }
        ];
        var picker = Ext.getCmp('dtPicker');
        if (!picker) {
            picker = Ext.create('OA.common.DateTimePicker', {
                id: 'dtPicker',
                useTitles: false,
                doneButton: false,
                cancelButton: false,
                destroyPickerOnHide: false,
                hideOnMaskTap: true,
                minuteInterval: 1,
                slotOrder: ['year', 'month', 'day', 'hour', 'minute'],
                toolbar: {
                    xtype: 'toolbar'
                }
            });
            Ext.Viewport.add(picker);
        }

        picker.getToolbar().setItems(toolbarItems);
        picker.setValue(dt);
        picker.show();
    },
    /**
     * 更新 KDRichTextBlock WK
     */
    doKDRichTextBlock: function (el) {
        var wkContent = OA.common.Global.getCurrentWKContent();
        var nodes = wkContent.childNodes.filter(function (n1) {
            return (n1 !== null);
        });
        var items = nodes.where("( el, i, res, param ) => el.tagName=='KDRichTextBlock'");
        if (items.length < 0) return;

        var rtb = items[0], idx_start = 0, newItems = [], id_raw = '';
        var id_new = el.getAttribute('id'), text = '';

        Ext.Array.each(rtb.childNodes, function (p, idx) {
            if (p.tagName == "Bullet") {
                idx_start = idx;
                id_raw = 'KDRichTextBlock-' + p.LvNumber + '_context';

                newItems.push(p);
                text = '';
            } else if (p.tagName == "Newline") {
                if (text) {
                    newItems.push({
                        FontSize: 21,
                        FontWeight: "Normal",
                        Highlight: "None",
                        Insert: "None",
                        Strike: "None",
                        BaselineShift: "",
                        Style: "B1",
                        Underline: "",
                        childNodes: [text],
                        tagName: "Text"
                    });
                }
                newItems.push(p);
                text = '';
            } else {

                //修改區
                if (id_new == id_raw) {
                    text = text + el.textContent;
                } else {
                    Ext.Array.each(p.childNodes, function (p1) {
                        if (typeof (p1) == 'string')
                            text = text + p1;
                    });
                }
            }
        });
        rtb.childNodes = newItems;
        OA.common.Global.setCurrentWKContent(wkContent);
    },
    /**
     * 重建儲存 KDRichTextBlock WK
     */
    saveKDRichTextBlock: function () {
        var me = this;
        var wkContent = OA.common.Global.getCurrentWKContent();
        if (!wkContent) return;

        var vm = OA.common.Global.getCurrentViewModel();
        var p = OA.common.Global.getInitParas();
        var nodes = wkContent.childNodes.filter(function (n1) {
            return (n1 !== null);
        });
        var items = nodes.where("( el, i, res, param ) => el.tagName=='KDRichTextBlock'");
        if (items.length < 0) return;

        if (p.doDeptno) wkContent.doDeptno = p.doDeptno;
        if (p.depName) wkContent.depName = p.depName;
        if (p.depNo) wkContent.depNo = p.depNo;
        if (p.empName) wkContent.empName = p.empName;
        if (p.empNo) wkContent.empNo = p.empNo;
        if (p.jobNo) wkContent.jobNo = p.jobNo;
        if (p.orgId) wkContent.orgId = p.orgId;
        if (p.orgNo) wkContent.orgNo = p.orgNo;
        if (p.roleId) wkContent.roleId = p.roleId;

        //主旨特別註名
        var cNodes = wkContent.childNodes.filter(function (n1) {
            return (n1 !== null);
        });
        var purpose = cNodes.where("( el, i, res, param ) => el.tagName=='主旨'");
        if (purpose.length > 0) purpose[0].childNodes[0].childNodes = [vm.主旨];

        var rtb = items[0], newItems = [];
        var _ParagraphNumber = 0, _KDRichTextBlockList = [], _parentid = '';
        var svg = me.getSvgPaper();
        if (!svg) return;
        var els = svg.getCurrentDrawing().getCurrentLayer().childNodes;  //return NodeList

        var errorArticle = false;
        var oldId = '';
        // 取出 白色編輯頁面 之 html node, 逐個node 檢查, 整理
        Ext.Array.each(els, function (el) {
            var isRich = el.id.indexOf('KDRichTextBlock') >= 0;
            var cls = el.getAttribute('class');
            if(typeof cls !== 'string') {
                return;
            }
            if (isRich) {
                var isBullet = cls.indexOf('indent') >= 0;
                if (isBullet) {
                    if (cls.indexOf('indent-0') >= 0) _parentid = el.id;
                    if (el.id.split('_').length > 1) {
                        _KDRichTextBlockList.push({ id: el.id, parentid: '' });
                    } else {
                        var count = el.id.split('.').length;
                        if (count == 1) {
                            _KDRichTextBlockList.push({ id: el.id, parentid: _parentid });
                        } else {
                            var _pid = el.id.substring(0, el.id.lastIndexOf("."));

                            //var oldNum = '';
                            //var thisNum = '';

                            //if (oldId.split('.').length > 1) {
                            //    oldNum = oldId.substring(oldId.indexOf("-") + 1, oldId.indexOf("."));
                            //} else {
                            //    oldNum = oldId.substring(oldId.indexOf("-") + 1, oldId.length);
                            //}

                            //thisNum = _pid.substring(_pid.indexOf("-") + 1, _pid.length);

                            ////檢驗跳號
                            //if (oldNum !== thisNum) {
                            //    if (parseInt(thisNum) - parseInt(oldNum) > 1) {
                            //        console.log('跳號');
                            //    }
                            //} else {
                            _KDRichTextBlockList.push({ id: el.id, parentid: _pid });
                            //}
                        }
                    }
                    var ln = OA.common.Utils.toLvNumber(cls);
                    var _LvNumber = (isNaN(ln.no)) ? ln.lv : ln.lv + '.' + ln.no;
                    var _ThisLayerNumber = (isNaN(ln.no)) ? 0 : ln.no;
                    var _BulletType = (isNaN(ln.no)) ? "Text" : "Indent";


                    //轉換時驗證階層錯誤
                    var compareId = el.id.substring(0, oldId.length);
                    if (oldId != '' && el.id.length > oldId.length) {
                        var plus = el.id.length - oldId.length;
                        compareId = el.id.substring(0, (oldId.length + plus));
                    }
                    var needCompare = oldId.indexOf('_') < 0;
                    if (oldId.length == compareId.length && needCompare) {
                        if (compareId < oldId) {
                            errorArticle = true;
                            console.log('條例階層錯誤 ' + el.id);
                        }
                    }

                    //取不到則延用上一個段落編號
                    var pn = el.id.split('_')[1];
                    if (pn) _ParagraphNumber = pn;

                    newItems.push({
                        BulletNo: el.textContent,
                        BulletText: stringFill3('　', ln.lv) + el.textContent,
                        BulletType: _BulletType,
                        DisplayPanelName: "Context",
                        FontSize: 21,
                        Insert: "None",
                        LvNumber: _LvNumber,
                        MainLayerNumber: 0,
                        ParagraphNumber: _ParagraphNumber,
                        Style: "B1",
                        ThisLayer: ln.lv,
                        ThisLayerNumber: _ThisLayerNumber,
                        tagName: "Bullet"
                    });

                    oldId = el.id;
                } else {
                    Ext.Array.each(el.childNodes, function (p1) {
                        var api = $(p1).qtip('api');
                        var tag = {};
                        if (api) {
                            api.set({
                                'show.delay': 1000,
                                'show.solo': true
                            });
                            tag = api.get('tag');
                        }

                        //決解最後一空白最忽略
                        var textContent = p1.textContent;
                        var lSpace = p1.textContent.match(/^\s*/);
                        var rSpace = p1.textContent.match(/\s+$/);

                        var cdata;
                        if (lSpace && lSpace[0].length > 0) {
                            // 令須保留全形空白 - by yi-chi chiu
                            cdata = (OA.common.Global.getCurrentWKContent().DocumentType !== '令' &&
                                OA.common.Global.getCurrentWKContent().DocumentType !== '受文者令' &&
                                OA.common.Global.getCurrentWKContent().DocumentType !== '代辦處令' &&
                                OA.common.Global.getCurrentWKContent().DocumentType !== '會銜令' &&
                                OA.common.Global.getCurrentWKContent().DocumentType !== '會銜受文者令') ? Ext.String.format('![CDATA[{0}]]', ' '.repeat(lSpace[0].length)) : Ext.String.format('![CDATA[{0}]]', lSpace[0]);
                            textContent = cdata + p1.textContent.substring(lSpace[0].length);
                        }
                        if (rSpace && rSpace[0].length > 0) {
                            cdata = Ext.String.format('![CDATA[{0}]]', ' '.repeat(rSpace[0].length));
                            textContent = p1.textContent.substring(0, p1.textContent.length - rSpace[0].length) + cdata;
                        }

                        var item = {
                            FontSize: 21,
                            FontWeight: "Normal",
                            BaselineShift: "",
                            Highlight: "None",
                            Insert: "None",
                            Strike: "None",
                            Style: "B1",
                            Underline: "",
                            childNodes: [textContent],
                            tagName: "Text"
                        };

                        var isSpace = cls.indexOf('paragraph_desc_space') >= 0;
                        if (isSpace) item.Space = parseInt(cls.replace('paragraph_desc_space', ''));

                        if (p1.getAttribute) {
                            if (p1.getAttribute("font-weight")) item.FontWeight = 'Bold';

                            if (p1.getAttribute("style")) {
                                if (p1.getAttribute("style") == "font-style: italic;")
                                    item.FontWeight = 'Italic';
                            };

                            if (p1.getAttribute("baseline-shift")) item.BaselineShift = p1.getAttribute("baseline-shift");

                            var dt = p1.getAttribute("text-decoration");
                            if (dt == 'underline') item.Underline = 'Underline';
                            if (dt == 'line-through') {
                                item.Strike = 'Exist';
                                var strikeItems = [];
                                strikeItems.push({
                                    //LastUpdateTime: OA.common.Utils.getChineseDate(),
                                    LastUpdateTime: OA.common.Utils.getOldEditChineseDate(),
                                    Name: padLeft(OA.common.Utils.getRandom(1000000000, 9999999999), 10),
                                    UserId: tag.userId,
                                    UserName: tag.userName,
                                    Version: tag.version,
                                    tagName: "StrikeText"
                                });
                                strikeItems.push(p1.textContent);
                                item.childNodes = strikeItems;
                            }

                            if (p1.getAttribute("fill")) {
                                item.Insert = 'Exist';
                                var insertItems = [];
                                insertItems.push({
                                    //LastUpdateTime: OA.common.Utils.getChineseDate(),
                                    LastUpdateTime: OA.common.Utils.getOldEditChineseDate(),
                                    Name: padLeft(OA.common.Utils.getRandom(1000000000, 9999999999), 10),
                                    UserId: tag.userId,
                                    UserName: tag.userName,
                                    Version: tag.version,
                                    tagName: "InsertText"
                                });
                                insertItems.push(p1.textContent);
                                item.childNodes = insertItems;
                            }

                            var tagHigh = p1.getAttribute("tag");
                            if (tagHigh) {
                                var _tag = JSON.parse(tagHigh);
                                item.Highlight = 'Exist';
                                item.childNodes = [
                                    {
                                        Brush: '#FF' + _tag.color.substring(1),
                                        //LastUpdateTime: OA.common.Utils.getChineseDate(),
                                        LastUpdateTime: OA.common.Utils.getOldEditChineseDate(),
                                        Name: padLeft(OA.common.Utils.getRandom(1000000000, 9999999999), 10),
                                        PenSpecies: _tag.penSpecies,
                                        UserId: tagHigh.userId,
                                        UserName: tagHigh.userName,
                                        Version: tagHigh.version,
                                        tagName: "Highlight"
                                    },
                                    p1.textContent];
                            }

                            if (p1.getAttribute("style") === 'display:none') item.childNodes = [];
                        }

                        if (tag.action) {
                            item.Highlight = 'Exist';
                            if (tag.action == 'InsertText' && lSpace && lSpace[0].length > 0) {
                                item.childNodes = [
                                    {
                                        Brush: tag.brush,
                                        LastUpdateTime: tag.lastUpdateTime,
                                        Name: tag.name,
                                        PenSpecies: tag.penSpecies,
                                        UserId: tag.userId,
                                        UserName: tag.userName,
                                        Version: tag.version,
                                        tagName: tag.action
                                    },
                                    textContent];
                            } else {
                                item.childNodes = [
                                    {
                                        Brush: tag.brush,
                                        LastUpdateTime: tag.lastUpdateTime,
                                        Name: tag.name,
                                        PenSpecies: tag.penSpecies,
                                        UserId: tag.userId,
                                        UserName: tag.userName,
                                        Version: tag.version,
                                        tagName: tag.action
                                    },
                                    p1.textContent];
                            }
                        }
                        newItems.push(item);
                    });

                    newItems.push({ Type: "Text", tagName: "Newline" });

                    vm[el.id] = el.textContent;
                }
            } else if (cls == 'table') {
                newItems.push({ Type: "Table", tagName: "Table" });
            }
        });
        rtb.childNodes = newItems;

        //update view model
        var blocks = OA.common.Utils.getKDRichTextBlock(wkContent);
        //console.log(_KDRichTextBlockList);
        //console.log(blocks);
        vm.KDRichTextBlockList = _KDRichTextBlockList;
        for (var i = 0; i < _KDRichTextBlockList.length; i++) {
            var id = _KDRichTextBlockList[i].id;
            vm[id] = blocks[i];
        }

        OA.common.Global.setCurrentWKContent(wkContent);

        // 無 [主旨] 之公文, 取其他欄位存入 [主旨] , 作為 [主旨摘要] 呈現:
        if(wkContent.DocumentType === '便簽' ||
            wkContent.DocumentType === '令' ||
            wkContent.DocumentType === '受文者令'
        ) { // 取內容 第一行 為 [主旨摘要]
            const KDRichTextList = me.getKDRichTextBlockContext();
            vm.主旨 = KDRichTextList[0];
        }
        else if (wkContent.DocumentType === '開會通知單') {
            vm.主旨 = vm.開會事由;
        }
        else if (wkContent.DocumentType === '會勘通知單') {
            vm.主旨 = vm.會勘事由;
        }
        else if (wkContent.DocumentType === '機密文書機密等級變更或註銷紀錄單') {
            vm.主旨 = vm.新等級或註銷;
        }
        else if (wkContent.DocumentType === '機密文書機密等級變更或註銷處理意見表') {
            vm.主旨 = vm.案由;
        }
        else if (wkContent.DocumentType === '簽稿會核單') {
            vm.主旨 = vm.案情摘要;
        }
        else if (wkContent.DocumentType === '會銜公文會辦單') {
            vm.主旨 = "會銜會辦單(" + vm.會辦機關 + ")";
        }
        else if (wkContent.DocumentType === '會銜公文機關印信蓋用續頁表') {
            vm.主旨 = vm.會銜主旨;
        }


        if (errorArticle) {
            Ext.Msg.alert('錯誤', '條例階層錯誤！');
            return false;
        } else {
            return true;
        }
    },
    /**
     * 編輯動作
     */
    editActions: function (notAddHistory) {
        var me = this;
        if (me.getIsLockPaper()) return false;
        var svg = this.getSvgPaper();
        var selectedElement = me.getSelectedElement();
        var $text = $("#text");
        var wk = OA.common.Global.getCurrentWKContent();


        function addCmdHistroy(options) {
            //console.log(options);
            //console.log(selectedElement);
            OA.common.Paper.setActiveStatus('edit');

            if (notAddHistory) return;
            /*
            if (svg) {
                var gContent = (svg.tagName == 'g') ? svg : svg.getCurrentDrawing().getCurrentLayer();
                var gContentCopy = gContent.cloneNode(true);
                var els = [];
                Ext.Array.each(gContentCopy.childNodes, function (node) {
                    if (node.id.indexOf("KDRichTextBlock") != -1) {
                        if (selectedElement && selectedElement.id == node.id) {
                            if (options.action) {
                                //node.options = options;
                                node.setAttributeNS(null, 'action', options.action);
                                //console.log(node);
                            }
                        }
                        els.push(node);
                    }
                });

                var elmuList = me.getRichAndmultiList();
                var mult = Ext.clone(me.getMultiFormat());

                if (elmuList) {
                    if (elmuList.rich.length == 10) {
                        elmuList.rich.shift();
                        elmuList.mult.shift();
                    }
                    if (me.getUnreDoIndex() < elmuList.rich.length - 1) {
                        var index = me.getUnreDoIndex() + 1;
                        elmuList.rich.splice(index, 0, els);
                        elmuList.mult.splice(index, 0, mult);
                        me.setUnreDoIndex(index);
                    } else {

                        elmuList.rich.push(els);
                        elmuList.mult.push(mult);
                        me.setUnreDoIndex(elmuList.rich.length - 1);
                    }
                }
            }
            me.saveKDRichTextBlock();
            */

            var batchCmd = new svgedit.history.BatchCommand(options.actionName);
            batchCmd.addSubCommand(new svgedit.history.TextLineCommand(options));
            svg.undoMgr.addCommandToHistory(batchCmd);
        }

        function getCmdHistroyOptions(fromId, toId, action) {
            var escapeFromId = fromId.replace(/([^A-Za-z0-9_\u00A1-\uFFFF-])/g, "\\$1");
            var escapeToId = toId.replace(/([^A-Za-z0-9_\u00A1-\uFFFF-])/g, "\\$1");
            var options = {
                action: action,
                elem: svgedit.utilities.getElem(escapeToId),
                oldElem: svgedit.utilities.getElem(escapeFromId)
            }
            return options;
        }

        function doSimpleAction(options, input) {
            var _applyStyles = {};
            var _actionName = '';
            var _cursorPos = $text[0].selectionStart;
            var action = options.action;
            //console.log(action)
            if (action == 'bold') {
                _actionName = '粗體';
                _applyStyles = { fontWeight: 'Bold' };
            } else if (action == 'italic') {
                _actionName = '斜體';
                _applyStyles = { fontStyle: 'Italic' };
            } else if (action == 'underline') {
                _actionName = '底線';
                _applyStyles = { underline: 'Underline' };
            } else if (action == 'superscript') {
                _actionName = '上標';
                _applyStyles = { baselineShift: 'super' };
            } else if (action == 'subscript') {
                _actionName = '下標';
                _applyStyles = { baselineShift: 'sub' };
            } else if (action == 'strike') {
                _actionName = '刪除';
                _applyStyles = { action: 'StrikeText' };
                if ($text[0].selectionStart == $text[0].selectionEnd) {
                    _cursorPos = $text[0].selectionEnd - 1;
                }
            } else if (action == 'Highlight') {
                _actionName = options.actionName;
                _applyStyles = options;
                _cursorPos = $text[0].selectionEnd;
                if ($text[0].selectionStart == $text[0].selectionEnd) _cursorPos = $text[0].selectionEnd - 1;
                if (_cursorPos < 0) return;
            } else if (action == 'InsertText') {
                _actionName = '插入文字';
                //var isApply = (!me.getIsClearPaper() && !me.getIsIME());
                var isApply = !me.getIsIME();
                if (!isApply) return;
                var oldValue = selectedElement.textContent;
                var isFirstSpace = me.getImeOldIValue().length == 0;

                if (me.getImeOldIValue() || isFirstSpace) {
                    oldValue = me.getImeOldIValue();

                    //處理說明第一個字有時會無追修
                    var trimFirstSpace = oldValue.trim().length == 0;
                    if (trimFirstSpace) oldValue = '';
                }

                options.oldValue = oldValue;
                _applyStyles = options;
                _cursorPos = $text[0].selectionStart;
                if ($text[0].selectionStart == $text[0].selectionEnd) _cursorPos = $text[0].selectionEnd - 1;
            }

            var _input = {
                selectedElement: selectedElement,
                selectionStart: $text[0].selectionStart,
                selectionEnd: $text[0].selectionEnd,
                value: $text[0].value,
                cursorPos: _cursorPos
            }
            var _selectedElement = selectedElement;
            if (input) {
                _input = input;
                _selectedElement = input.selectedElement;
                _cursorPos = input.cursorPos;
            }
            _applyStyles.input = _input;

            var old = Ext.clone(me.getMultiFormat());
            me.mergeMultiFormat(_selectedElement, _applyStyles);
            if (action === 'InsertText') {
                me.setImeOldIValue(selectedElement.textContent);
            } else {
                if (action === 'strike') Ext.getCmp('cpaper').setIsStrikeText(true);
                me.pensClear();
                me.svgUpdateLayout(svg, _selectedElement);
                svg.textActions.setCursor(_cursorPos);
                Ext.getCmp('cpaper').setIsStrikeText(false);
            }

            var history = {
                elem: me.getMultiFormat(),
                oldElem: old,
                actionName: _actionName,
                input: _input,
                cursorPos: _cursorPos
            }
            if (action === 'InsertText') {
                history.oldValue = _applyStyles.oldValue;
                history.newValue = _applyStyles.newValue;
            }
            if (typeof action == 'object') {
                Ext.apply(history, action);
            } else {
                history.action = action;
            }
            addCmdHistroy(history);
        }

        function doMove(action) {
            var selectedTspan = me.getSelectedTspan();
            if (selectedTspan && selectedTspan.parentNode) {
                var currentPos = $text[0].selectionStart;
                var points = [], idx = 0, preIdx = 0, pre = 0, pad = 0;
                Ext.Array.each(selectedTspan.parentNode.childNodes, function (tspan) {
                    pad = currentPos - idx;
                    pre = preIdx + pad;
                    preIdx = idx;
                    var count = tspan.textContent.length;
                    idx = idx + count;
                    points.push(idx);
                    if (currentPos <= idx) {
                        if (action == 'up') {
                            svg.textActions.setCursor(pre);
                        } else {
                            svg.textActions.setCursor(preIdx + pad + count);
                        }
                        return false;
                    }
                });

                if (action == 'up') {
                    if (points.length != 1) return;
                } else {
                    if (points.length != 0 && points.length != selectedTspan.parentNode.childNodes.length) return;
                }
            }

            var finding = true;
            if (action == 'up') {
                var prev = selectedElement;
                do {
                    if (!prev) return;
                    prev = prev.previousSibling;
                    if (!prev) return;
                    finding = prev && prev.getAttribute('id') && prev.getAttribute('id').indexOf('_context') < 0;
                }
                while (finding);
                me.elemReload(prev);
                var lastTspan = prev.childNodes[prev.childNodes.length - 1];
                me.setSelectedTspan(lastTspan);
            } else {
                var next = selectedElement;
                do {
                    if (!next) return;
                    next = next.nextSibling;
                    if (!next) return;
                    finding = next.getAttribute('id').indexOf('_context') < 0;
                }
                while (finding);

                var isBullet = next.getAttribute('class').indexOf('indent') >= 0;
                if (isBullet) return;


                me.elemReload(next);
                var firstTspan = next.childNodes[0];
                me.setSelectedTspan(firstTspan);
                svg.textActions.setCursor(pad);
            }
        }

        return {
            execute: function (cmd) {
                var name = cmd['do'];
                me.pensClear();
                var elem = null;
                if (name == 'undo' || name == 'redo') notAddHistory = true;
                if (name == 'undo') {
                    //if (cmd.action == 'turn' || cmd.action == 'delete') {
                    //    elem = cmd.elem;
                    //} else if (cmd.action == 'indent' || cmd.action == 'outdent') {
                    //    elem = cmd.oldElem;
                    //}

                    //2018.04.16 chiu.lien
                    //turn、indent is elem；  
                    //delete、  outdent is oldElem
                    if (cmd.action == 'turn' || cmd.action == 'indent') {
                        elem = cmd.elem;
                    } else if (cmd.action == 'delete' || cmd.action == 'outdent') {
                        elem = cmd.oldElem;
                    }
                } else if (name == 'redo') {
                    if (cmd.action == 'turn' || cmd.action == 'delete') {
                        elem = cmd.oldElem;
                    } else if (cmd.action == 'indent' || cmd.action == 'outdent') {
                        elem = cmd.elem;
                    }
                }
                if (elem) me.elemReload(elem);

                var isSimpleActions = ['bold', 'strike', 'italic', 'underline', 'superscript', 'subscript',
                    'Highlight'].indexOf(cmd.action) >= 0;
                if (name == 'undo') {
                    if (cmd.action == 'turn') {
                        me.editActions(true).deleteLine();
                    } else if (cmd.action == 'delete') {
                        me.editActions(true).turnLine(cmd.cursorPos);
                    } else if (cmd.action == 'indent') {
                        me.editActions(true).outdent();
                    } else if (cmd.action == 'outdent') {
                        me.editActions(true).indent();
                    } else if (cmd.action == 'InsertText') {
                        me.elemReload(cmd.input.selectedElement);
                        me.setMultiFormat(cmd.oldElem);

                        $text[0].value = cmd.oldValue;
                        me.editActions(true).input(cmd.oldValue);

                        setTimeout(function () {
                            svg.textActions.setCursor(cmd.input.cursorPos);
                        });
                    } else if (isSimpleActions) {
                        me.setMultiFormat(cmd.oldElem);
                        me.svgUpdateLayout(svg, cmd.input.selectedElement);
                        svg.textActions.setCursor(cmd.input.cursorPos);
                    }
                } else if (name == 'redo') {
                    if (cmd.action == 'turn') {
                        me.editActions().turnLine(cmd.cursorPos);
                    } else if (cmd.action == 'delete') {
                        me.editActions().deleteLine();
                    } else if (cmd.action == 'indent') {
                        me.editActions().indent();
                    } else if (cmd.action == 'outdent') {
                        me.editActions().outdent();
                    } else if (cmd.action == 'bold') {
                        me.editActions().bold(cmd.input);
                    } else if (cmd.action == 'italic') {
                        me.editActions().italic(cmd.input);
                    } else if (cmd.action == 'underline') {
                        me.editActions().underline(cmd.input);
                    } else if (cmd.action == 'superscript') {
                        me.editActions().superscript(cmd.input);
                    } else if (cmd.action == 'subscript') {
                        me.editActions().subscript(cmd.input);
                    } else if (cmd.action == 'strike') {
                        me.editActions().strike(cmd.input);
                    } else if (cmd.action == 'Highlight') {
                        me.editActions().pen(cmd.brush, cmd.penSpecies, cmd.input);
                    } else if (cmd.action == 'InsertText') {
                        me.setMultiFormat(cmd.elem);
                        me.elemReload(cmd.input.selectedElement);
                        $text[0].value = cmd.newValue;
                        me.editActions(true).input(cmd.newValue);
                        setTimeout(function () {
                            svg.textActions.setCursor(cmd.input.cursorPos);
                        });
                    }
                }
            },
            turnLine: function (selectionStart) {
                if (!selectedElement) return;

                //簡簽不檢核，主旨可分段
                var isEasyNote = false;
                if (wk && wk.DocumentType == '簡簽' || wk && wk.DocumentType == '令') isEasyNote = true;

                //主旨不可分段
                if (selectedElement.previousSibling && selectedElement.previousSibling.textContent == '主旨：') {
                    Ext.Msg.alert("提示", "主旨不可分段！", function () {
                        svg.textActions.setCursor();
                    });
                    return;
                }

                //空白條例不可換行（從條例斷行）
                var hereId = selectedElement.getAttribute("id");
                if (hereId && hereId.indexOf('KDRichTextBlock') != -1 && !isEasyNote) {
                    var hereSplit = hereId.split('_');
                    //在條例列時才判斷
                    if (hereSplit && hereSplit.length < 3) {
                        if (selectedElement.textContent.trim().length == 0) {
                            Ext.Msg.alert("提示", "條例不可空白！", function () {
                                svg.textActions.setCursor();
                            });
                            return;
                        } else {
                            //在有文字條例上連續enter，要判斷上一行是否為條例列，如為空白條例列則不可斷行
                            if (selectedElement.previousElementSibling && selectedElement.previousElementSibling.previousSibling) {
                                var previousEL = selectedElement.previousElementSibling.previousSibling;
                                var previousId = previousEL.getAttribute("id");
                                //上一行也是本文
                                if (previousId && previousId.indexOf('KDRichTextBlock') != -1) {
                                    //判斷是否是條例
                                    var previousSplit = previousId.split('_');
                                    if (previousSplit && previousSplit.length < 3) {
                                        if (previousEL.textContent.trim().length == 0) {
                                            Ext.Msg.alert("提示", "上行條例不可空白！", function () {
                                                svg.textActions.setCursor();
                                            });
                                            return;
                                        } else {
                                            //判斷下一行是否也是條例
                                            if (selectedElement.nextElementSibling && selectedElement.nextElementSibling.nextSibling) {
                                                var nextEl = selectedElement.nextElementSibling.nextSibling;
                                                var nextId = nextEl.getAttribute("id");
                                                //下一行是不是本文
                                                if (nextId && nextId.indexOf('KDRichTextBlock') != -1) {
                                                    //判斷是否是條例
                                                    var nextSplit = nextId.split('_');
                                                    if (nextSplit && nextSplit.length < 3) {
                                                        if (nextEl.textContent.trim().length == 0) {
                                                            Ext.Msg.alert("提示", "下行條例不可空白！", function () {
                                                                svg.textActions.setCursor();
                                                            });
                                                            return;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        //上一行是段名行（說明、擬辦....）
                                        //判斷下一行是否也是條例
                                        if (selectedElement.nextElementSibling && selectedElement.nextElementSibling.nextSibling) {
                                            var nextEl = selectedElement.nextElementSibling.nextSibling;
                                            var nextId = nextEl.getAttribute("id");
                                            //下一行是不是本文
                                            if (nextId && nextId.indexOf('KDRichTextBlock') != -1) {
                                                //判斷是否是條例
                                                var nextSplit = nextId.split('_');
                                                if (nextSplit && nextSplit.length < 3) {
                                                    if (nextEl.textContent.trim().length == 0) {
                                                        Ext.Msg.alert("提示", "下行條例不可空白！", function () {
                                                            svg.textActions.setCursor();
                                                        });
                                                        return;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        //段名行enter（說明、擬辦....），判斷下一行是否為條例
                        if (selectedElement.nextElementSibling && selectedElement.nextElementSibling.nextSibling) {
                            var nextEl = selectedElement.nextElementSibling.nextSibling;
                            var nextId = nextEl.getAttribute("id");
                            //下一行是不是本文
                            if (nextId && nextId.indexOf('KDRichTextBlock') != -1) {
                                //判斷是否是條例
                                var nextSplit = nextId.split('_');
                                if (nextSplit && nextSplit.length < 3) {
                                    if (nextEl.textContent.trim().length == 0) {
                                        Ext.Msg.alert("提示", "下行條例不可空白！", function () {
                                            svg.textActions.setCursor();
                                        });
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }


                var el_new = me.turnLine(selectedElement, selectionStart);
                me.setCurrentY(me.getCurrentY() + me.getLineHeight(el_new));

                me.svgUpdateLayout(svg, el_new);
                svg.textActions.setCursor(0);

                var options = {
                    action: 'turn',
                    actionName: '換行',
                    elem: el_new,
                    oldElem: selectedElement,
                    cursorPos: selectionStart
                }
                addCmdHistroy(options);

                //var scroller = me.up("ctnPaper").getScrollable().getScroller();
                //scroller.scrollTo(0, me.getCurrentY());
                me.removeSvgPage(); //重新定義SvgPaper高

                //TODO:初始位置有誤
                var scroller = me.up('ctnPaper').getScrollable().getScroller();
                scroller.scrollTo(0, (me.getCurrentY() * me.getRatio()) - 150);

                me.showIndicator();
            },
            deleteLine: function () {
                if (selectedElement.getAttribute('id').indexOf('KDRichTextBlock') < 0) return;

                if (selectedElement.nextSibling == null ||
                    selectedElement.previousSibling == null) {
                    selectedElement = document.querySelector('#' + selectedElement.getAttribute('id'));
                }

                var el_new = me.deleteLine(selectedElement);
                if (!el_new) return;
                if (el_new.id == 'KDRichTextBlock_1_context' && el_new.cursorPos == 0) {
                    if (!el_new.textContent) el_new.textContent = '　';//補全型空白，留下元素
                } else if (el_new.id == 'KDRichTextBlock_2_context' && el_new.cursorPos == 0) {
                    if (!el_new.textContent) el_new.textContent = '　';//補全型空白，留下元素
                } else {
                    me.setCurrentY(me.getCurrentY() - me.getLineHeight(el_new));
                }
                me.svgUpdateLayout(svg, el_new);
                svg.textActions.setCursor(el_new.cursorPos);

                var options = {
                    action: 'delete',
                    actionName: '刪行',
                    elem: el_new,
                    oldElem: selectedElement,
                    cursorPos: el_new.cursorPos
                }
                addCmdHistroy(options);

                me.removeSvgPage(); //重新定義SvgPaper高
            },
            indent: function () {
                if (!selectedElement) return;
                if (wk.DocumentType === '令' || wk.DocumentType === '受文者令' || wk.DocumentType === '會銜令' || wk.DocumentType === '會銜受文者令') return;
                var options;
                var id = selectedElement.getAttribute("id");
                var isNote = ['便箋', '簡簽', 'A4空白簽'].indexOf(wk.DocumentType) >= 0 && id == 'KDRichTextBlock_1_context';
                var fromId = id.split('_')[0];
                svg.clearSelection(selectedElement);

                if (isNote) {
                    var cls = selectedElement.getAttribute('class');
                    var value = (cls == 'paragraph_desc') ? '0' : cls.replace('paragraph_desc_space', '');
                    var count = parseInt(value);
                    count++;
                    selectedElement.setAttribute('class', 'paragraph_desc_space' + count);
                    me.svgUpdateLayout(svg, selectedElement);
                    options = getCmdHistroyOptions(fromId, id, 'space');
                    options.actionName = '縮白';
                } else {
                    var toId = me.moveLine(fromId, 1);
                    if (!toId) {
                        // 解決當無法縮排時，無法繼續打字（失去焦點） - by yi-chi chiu
                        me.svgUpdateLayout(svg, selectedElement);
                        return;
                    }
                    me.svgUpdateLayout(svg, selectedElement);
                    options = getCmdHistroyOptions(fromId, toId, 'indent');
                    options.actionName = '縮排';
                }

                addCmdHistroy(options);
            },
            outdent: function () {
                if (wk.DocumentType === '令' || wk.DocumentType === '受文者令' || wk.DocumentType === '會銜令' || wk.DocumentType === '會銜受文者令') return;
                var options;
                var id = selectedElement.getAttribute("id");
                var isNote = ['便箋', '簡簽', 'A4空白簽'].indexOf(wk.DocumentType) >= 0 && id == 'KDRichTextBlock_1_context';
                var fromId = selectedElement.getAttribute("id").split('_')[0];
                svg.clearSelection(selectedElement);
                if (isNote) {
                    var cls = selectedElement.getAttribute('class');
                    var value = (cls == 'paragraph_desc') ? '0' : cls.replace('paragraph_desc_space', '');
                    var count = parseInt(value);
                    if (count >= 1) count--;
                    selectedElement.setAttribute('class', 'paragraph_desc_space' + count);
                    me.svgUpdateLayout(svg, selectedElement);
                    options = getCmdHistroyOptions(fromId, id, 'space');
                    options.actionName = '前白';
                } else {
                    var toId = me.moveLine(fromId, -1);
                    if (!toId) {
                        // 解決當無法縮排時，無法繼續打字（失去焦點） - by yi-chi chiu
                        me.svgUpdateLayout(svg, selectedElement);
                        return;
                    }
                    me.svgUpdateLayout(svg, selectedElement);
                    options = getCmdHistroyOptions(fromId, toId, 'outdent');
                    options.actionName = '前排';
                }
                addCmdHistroy(options);
            },
            bold: function (input) {
                doSimpleAction({ action: 'bold' }, input);
            },
            italic: function (input) {
                doSimpleAction({ action: 'italic' }, input);
            },
            underline: function (input) {
                doSimpleAction({ action: 'underline' }, input);
            },
            superscript: function (input) {
                doSimpleAction({ action: 'superscript' }, input);
            },
            subscript: function (input) {
                doSimpleAction({ action: 'subscript' }, input);
            },
            strike: function (input) {
                doSimpleAction({ action: 'strike' }, input);
            },
            pen: function (color, penSpecies, input) {
                doSimpleAction({ action: 'Highlight', actionName: '光筆', brush: color, penSpecies: penSpecies }, input);
            },
            comment: function (color, penSpecies) {
                //TODO:動作未流暢，也未實作記錄動作歷史
                if (!color) color = OA.common.Utils.getBrushColor(OA.common.Global.getQueryDefault().交換資訊.colorpalette.palette[0].color);
                if (!penSpecies) penSpecies = Ext.getCmp('selectPenSize').getValue();
                var size = (penSpecies) ? penSpecies * 15 : 1.5;

                var ctr = me.getParent().getScrollable();
                if (ctr) ctr.getScroller().setDisabled(true);
                svg.setMode('fhpath');

                svg.setColor('stroke', color);
                svg.changeSelectedAttribute('stroke-width', size);
            },
            eraser: function () {
                svg.setMode('fhpath');

                if (selectedElement != null) {
                    svg.deleteSelectedElements();
                }
                if (svg.pathActions.getNodePoint()) {
                    svg.pathActions.deletePathNode();
                }
            },
            fhpath: function () {
                svg.setMode('fhpath');
            },
            input: function (newValue, input) {
                if (!selectedElement) return;

                //clear pen init
                newValue = newValue.replace(/</g, '〈').replace(/>/g, '〉');
                if (!me.getIsClearPaper()) {
                    Ext.Array.each(selectedElement.childNodes, function (el) {
                        var api = $(this).qtip('api');
                        if (api) {
                            api.set({
                                'show.delay': 1000,
                                'show.solo': true
                            });
                            var tag = api.get('tag');
                            var rectId = tag.fromBindId + '_rect_' + tag.fromItemIdx;

                            var escapeFromId = rectId.replace(/([^A-Za-z0-9_\u00A1-\uFFFF-])/g, "\\$1");
                            var pen = document.querySelector('#' + escapeFromId);
                            if (pen) pen.parentNode.removeChild(pen);
                        }
                    });
                }

                OA.common.Paper.setActiveStatus('edit');

                var vm = OA.common.Global.getCurrentViewModel();

                //print text and wrap
                var oldValue = selectedElement.textContent;


                if (oldValue == '在此繕寫本文') {
                    newValue = window.event.data
                    $text[0].value = newValue
                    me.setImeOldIValue(newValue);
                    $text[0].selectionStart = 1;
                    $text[0].selectionEnd = 1;

                }

                var follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - me.getCurrentX(); //wrap
                svg.changeSelectedAttribute("#text", newValue, [selectedElement]); //print text

                if (newValue.length == 0) return;

                var el_new = me.setWrap(selectedElement, me.getCurrentX(), me.getCurrentY(), follow_boxWidth);
                //回覆函縮排
                var modelName = OA.client.WK.getCurrentModelName();
                if (modelName.indexOf('MayorNote') >= 0 &&
                    el_new.id !== 'KDRichTextBlock_0_context' && el_new.id !== 'KDRichTextBlock_1_context') {
                    var setting = me.getSetting(me.getFields(), vm.KDRichTextBlockList[0].id);
                    if (el_new.id == 'KDRichTextBlock_2_context') {
                        var allTspan = el_new.querySelectorAll('tspan')
                        if (allTspan && allTspan.length > 0) {
                            Ext.Array.each(allTspan, function (tspan, index) {
                                tspan.setAttribute('x', setting.x + 44);
                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                            })
                        } else {
                            el_new.setAttribute('x', setting.x + 44);
                            if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 44);
                        }
                        //padding = 44;
                    } //else if (wrapping.id == 'KDRichTextBlock_3_context') {
                    else if (el_new.id.indexOf('_context') != -1) {
                        var allTspan = el_new.querySelectorAll('tspan')
                        if (allTspan && allTspan.length > 0) {
                            Ext.Array.each(allTspan, function (tspan, index) {
                                //console.log(Ext.clone(follow_boxWidth));
                                if (index == 0) {
                                    tspan.setAttribute('x', setting.x + 80);
                                    if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 80);
                                } else {
                                    tspan.setAttribute('x', setting.x + 44);
                                    if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                }
                            })
                        } else {
                            el_new.setAttribute('x', setting.x + 80);
                            if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 80);
                        }
                        //padding = 80;
                    }
                }

                /*
                if (modelName.indexOf('MayorNote') >= 0 &&
                    el_new.id !== 'KDRichTextBlock_0_context' && el_new.id !== 'KDRichTextBlock_1_context') {
                    var setting = me.getSetting(me.getFields(), vm.KDRichTextBlockList[0].id);
                    var allTspan = el_new.querySelectorAll('tspan')
                    if (allTspan && allTspan.length > 0) {
                        Ext.Array.each(allTspan, function (tspan, index) {
                            if (index == 0 && el_new.id !== 'KDRichTextBlock_2_context') {
                                tspan.setAttribute('x', setting.x + 80);
                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 80);
                            } else {
                                tspan.setAttribute('x', setting.x + 44);
                                if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                            }
                        })
                    }
                }*/

                svg.textActions.setCurtext(el_new);   //focus again
                me.setSelectedElement(el_new);
                //var e = window.event;//抓事件
                ////增加input動到至Histroy，讓ctrl+z、y，能動作同段處理lien.chiu 2019.03.15
                //if (me.getIsClearPaper()) {
                //    if (e !== undefined) {
                //        var options = {
                //            action: 'input',
                //            actionName: '加字',
                //            inputType: e.inputType
                //        }
                //    } else {
                //        var options = {
                //            action: 'input',
                //            actionName: '加字',
                //            inputType: undefined
                //        }
                //    }

                //    //如果是Undo事件或無inputType，不增加到addCmdHistroy中
                //    if (e !== undefined && e.inputType && e.inputType != 'historyUndo') {
                //        addCmdHistroy(options);
                //    }
                //}

                if (me.getIsIME()) return;   //輸入法完成時才更新狀態，因注音輸入法必需要顯示輸入

                //承辦人編輯狀態，呈現文字特效（底線、粗體、底線）
                if (me.getMultiFormat() && me.getIsClearPaper()) {
                    if (me.getImeOldIValue()) {
                        if (oldValue.length > me.getImeOldIValue().length)
                            oldValue = me.getImeOldIValue();
                        Ext.Array.each(me.getMultiFormat(), function (mu) {
                            if (mu.bindId == el_new.id) {
                                me.mergeMultiFormat(selectedElement, {
                                    action: 'InsertText',
                                    newValue: newValue,
                                    oldValue: oldValue
                                });
                            }
                        });
                    }
                }

                var isSame = me.getImeOldIValue() == selectedElement.textContent;
                if (!isSame) {
                    //doSimpleAction({ action: 'InsertText', newValue: newValue }, input);  //styles when not clearpaper and IME
                    doSimpleAction({ action: 'InsertText', newValue: newValue }, input);
                }

                //追修時，更新狀態
                if (!me.getIsClearPaper()) {
                    var el_mrg = me.mergeStyle(me.getSvgPaper(), el_new);
                    if (el_mrg) {
                        var modelName = OA.client.WK.getCurrentModelName();
                        if (modelName.indexOf('MayorNote') >= 0 &&
                            el_new.id !== 'KDRichTextBlock_0_context' && el_new.id !== 'KDRichTextBlock_1_context') {
                            var setting = me.getSetting(me.getFields(), vm.KDRichTextBlockList[0].id);
                            if (el_new.id == 'KDRichTextBlock_2_context') {
                                var allTspan = el_new.querySelectorAll('tspan')
                                if (allTspan && allTspan.length > 0) {
                                    Ext.Array.each(allTspan, function (tspan, index) {
                                        tspan.setAttribute('x', setting.x + 44);
                                        if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                    })
                                } else {
                                    el_new.setAttribute('x', setting.x + 44);
                                    if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 44);
                                }
                                //padding = 44;
                            } //else if (wrapping.id == 'KDRichTextBlock_3_context') {
                            else if (el_new.id.indexOf('_context') != -1) {
                                var allTspan = el_new.querySelectorAll('tspan')
                                if (allTspan && allTspan.length > 0) {
                                    Ext.Array.each(allTspan, function (tspan, index) {
                                        //console.log(Ext.clone(follow_boxWidth));
                                        if (index == 0) {
                                            tspan.setAttribute('x', setting.x + 80);
                                            if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 80);
                                        } else {
                                            tspan.setAttribute('x', setting.x + 44);
                                            if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                        }
                                    })
                                } else {
                                    el_new.setAttribute('x', setting.x + 80);
                                    if (el_new.getAttribute('textLength')) el_new.setAttribute('textLength', follow_boxWidth - 80);
                                }
                                //padding = 80;
                            }
                        }
                        /*
                        if (modelName.indexOf('MayorNote') >= 0
                            && el_mrg.id !== 'KDRichTextBlock_0_context' && el_mrg.id !== 'KDRichTextBlock_1_context') {
                            var setting = me.getSetting(me.getFields(), vm.KDRichTextBlockList[0].id);
                            var allTspan = el_mrg.querySelectorAll('tspan')
                            if (allTspan && allTspan.length > 0) {
                                Ext.Array.each(allTspan, function (tspan, index) {
                                    if (index == 0 && el_mrg.id !== 'KDRichTextBlock_2_context') {
                                        tspan.setAttribute('x', setting.x + 80);
                                        if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 80);
                                    } else {
                                        tspan.setAttribute('x', setting.x + 44);
                                        if (tspan.getAttribute('textLength')) tspan.setAttribute('textLength', follow_boxWidth - 44);
                                    }
                                })
                            }
                        }
                        */

                        svg.textActions.setCurtext(el_mrg);   //focus again
                        me.setSelectedElement(el_mrg);
                    }

                    if (input) {
                        $text[0].value = el_mrg.textContent;
                        $text[0].selectionStart = input.selectionStart;
                        $text[0].selectionEnd = input.selectionEnd;
                    }
                }

                //編輯時換行換頁
                var isTurnLine = (me.getCountLine() != el_new.childNodes.length);
                if (!me.getIsEditingPagging()) {
                    if (isTurnLine) {
                        if (modelName.indexOf('MayorNote') >= 0) {
                            var id = selectedElement.getAttribute("id");
                            var fromId = id.split('_')[0];
                            var toId = me.moveLine(fromId, 1);
                            if (!toId) {
                                // 解決當無法縮排時，無法繼續打字（失去焦點） - by yi-chi chiu
                                me.svgUpdateLayout(svg, selectedElement);
                                return;
                            }
                        }
                        //me.typesetting(null, false, true);
                    }
                    //if (isTurnLine) me.typesetting(null, false, true);
                    me.setCountLine(me.getSelectedElement().querySelectorAll('tspan[dy]:not([dy=""])').length);

                }
                if (isTurnLine) {
                    me.svgUpdateLayout(svg, el_new);
                    //me.typesetting(null, false, true, el_new);  //有換行時一律重新排版
                }

                if (selectedElement && selectedElement.id == 'KDRichTextBlock_0_context') {
                    vm.主旨 = newValue;
                }
                // 判斷已存檔功能 - by yi-chi chiu
                OA.app.isSavedFlag = false;
            },
            input2: function (newValue) {
                if (!selectedElement) return;

                var oldValue = selectedElement.textContent;
                var follow_boxWidth = me.getWorkWidth() + me.getMarginLeft() - me.getCurrentX(); //wrap
                svg.changeSelectedAttribute("#text", newValue, [selectedElement]); //print text

                // svg.setTextContent(newValue); //print text

                // console.log(selectedElement);

                var cur = $text[0].selectionStart;
                var chardata = svg.textActions.getChardata();
                // console.log(chardata);
                var startChar = chardata[cur];
                var rowIdx = (startChar) ? startChar.rowIdx : -1;
                var tspans = selectedElement.querySelectorAll('tspan');
                // console.log('rowIdx =' + rowIdx + ' tspans=' + tspans.length);


                // var el_new = me.setWrap(selectedElement, me.getCurrentX(), me.getCurrentY(), follow_boxWidth);
                // svg.textActions.setCurtext(el_new); //focus again
                // me.setSelectedElement(el_new);


                // window.requestAnimationFrame(function() {
                // });


                // var el_new;
                // if (rowIdx <= 0) {
                //     el_new = me.setWrap(selectedElement, me.getCurrentX(), me.getCurrentY(), follow_boxWidth);
                // } else {
                //     console.log(selectedElement);
                //     var tspans = selectedElement.querySelectorAll('tspan');
                //     console.log(tspans);
                //     var tspan_new = me.setWrap(tspans[rowIdx], me.getCurrentX(), me.getCurrentY(), follow_boxWidth);
                //     tspans[rowIdx] = tspan_new;
                //
                //     el_new = selectedElement;
                // }


                // //turnning
                // var isTurnLine = (me.getCountLine() != el_new.childNodes.length);
                // if (isTurnLine) {
                //     me.typesetting(null, false, true);
                // }
                // me.setCountLine(el_new.querySelectorAll('tspan[dy]:not([dy=""])').length);
                //
                // //styles
                // if (!me.getIsClearPaper()) {
                //     if (!me.getIsIME()) {
                //         if (me.getImeOldIValue()) oldValue = me.getImeOldIValue();
                //         me.mergeMultiFormat(selectedElement, {
                //             action: 'InsertText',
                //             newValue: newValue,
                //             oldValue: oldValue
                //         });
                //     }
                // }
            },
            //insertWord: function (word) {
            //    var pos = $text[0].selectionStart;
            //    var newValue = $text[0].value.substring(0, pos) + word + $text[0].value.substring(pos);
            //    $text.val(newValue);
            //    svg.textActions.setCursor(pos + word.length);

            //    me.editActions().input(newValue);
            //    OA.common.Paper.setActiveStatus('edit');
            //},
            insertWord: function (word) {
                navigator.clipboard
                    .readText()
                    .then((text) => {
                        var pos = $text[0].selectionStart;
                        let selectionStart = $text[0].selectionStart;
                        let selectionEnd = $text[0].selectionEnd;
                        let newValue =
                            $text[0].value.substring(0, selectionStart) +
                            text +
                            $text[0].value.substring(selectionEnd);

                        var result = me.removeRedundantSpace(newValue);
                        $text.val(result);
                        svg.textActions.setCursor(pos + text.length);
                        me.editActions().input(result);
                        OA.common.Paper.setActiveStatus("edit");
                    })
                    .catch((err) =>
                        log('Async readText failed with error: "' + err + '"')
                    );
            },
            insertWordSymbols: function (word) {
                var pos = $text[0].selectionStart;
                var newValue =
                    $text[0].value.substring(0, pos) +
                    word +
                    $text[0].value.substring(pos);
                $text.val(newValue);
                svg.textActions.setCursor(pos + word.length);

                me.editActions().input(newValue);
                OA.common.Paper.setActiveStatus("edit");
            },
            changeBulletSymbol: function (word) {
                var ids = selectedElement.getAttribute("id").split('.');
                var currentLV = ids.length;

                var success = me.saveKDRichTextBlock();
                if (success == false) return;

                var vm = OA.common.Global.getCurrentViewModel();
                Ext.Array.each(vm.KDRichTextBlockList, function (kb) {
                    var ph = vm[kb.id];
                    if (ph.layer != 0 && currentLV == ph.layer) {
                        if (word == 'bullet') {
                            var lvno = ph.lv.toString().split('.');
                            var oNumber = {
                                intVaule: 0,
                                lv: parseInt(lvno[0]),
                                no: parseInt(lvno[1])
                            }
                            ph.no = OA.common.Utils.doChineseNumberString(oNumber);
                        } else {
                            ph.no = word;
                        }

                        var escapeId = kb.id.replace(/([^A-Za-z0-9_\u00A1-\uFFFF-])/g, "\\$1");
                        var elem = svg.getElem(escapeId);
                        elem.textContent = ph.no;
                    }
                });
                if (svg && svg.getMode() == 'textedit') svg.setMode('select');
                me.svgUpdateLayout();
            },
            changeNumberText: function (formats) {
                var input = $("#text")[0];
                var selStart = input.selectionStart;
                var selEnd = input.selectionEnd;
                var selValue = input.value.substring(selStart, selEnd).toString().trim();
                var replaceValue = '';
                if (Ext.isString(formats)) {
                    var items = selValue.split(' ');
                    // 中華民國{0}年{1}月{2}日{3}時{4}分
                    var y, m, d, h, i;
                    if (items.length > 1) {
                        var _date = items[0];
                        var _date1;
                        if (Ext.isNumeric(_date)) {
                            if (_date.length >= 7) {
                                y = _date.substring(0, 3);
                                m = parseInt(_date.substring(3, 5));
                                d = parseInt(_date.substring(5, 7));
                                _date1 = Ext.String.format('中華民國{0}年{1}月{2}日', y, m, d);
                            } else {
                                m = parseInt(_date.substring(0, 2));
                                d = parseInt(_date.substring(2, 4));
                                _date1 = Ext.String.format('{0}月{1}日', m, d);
                            }
                        }
                        var _time = items[1];
                        var t = Ext.Date.parse(_time, "H:i", true);
                        replaceValue = Ext.String.format('{0}{1}時{2}分', _date1, t.getHours(), t.getMinutes());
                    } else {
                        var _value = items[0];
                        var tryDate = Ext.Date.parse(_value, "H:i", true);
                        if (tryDate) {
                            replaceValue = Ext.Date.format(tryDate, 'H時i分');
                        } else {
                            if (Ext.isNumeric(_value)) {
                                y = parseInt(_value.substring(0, 3));
                                m = parseInt(_value.substring(3, 5));
                                d = parseInt(_value.substring(5, 7));
                                replaceValue = Ext.String.format('中華民國{0}年{1}月{2}日', y, m, d);
                            } else {
                                var ys = _value.split('年');
                                var ms, ds, hs, is;
                                var yy, mm, dd, hh;
                                if (ys.length > 1) {
                                    y = ys[0].replace('中華民國', '');
                                    yy = ys[1];
                                } else {
                                    yy = ys[0];
                                }

                                ms = yy.split('月');
                                if (ms.length > 1) {
                                    if (ms[0].length < 2)
                                        m = '0' + ms[0];
                                    else
                                        m = ms[0];
                                    mm = ms[1];
                                } else {
                                    mm = ms[0];
                                }

                                ds = mm.split('日');
                                if (ds.length > 1) {
                                    if (ds[0].length < 2)
                                        d = '0' + ds[0];
                                    else
                                        d = ds[0];
                                    dd = ds[1];
                                } else {
                                    dd = ds[0];
                                }

                                hs = dd.split('時');
                                if (hs.length > 1) {
                                    h = hs[0];
                                    hh = hs[1];
                                } else {
                                    hh = hs[0];
                                }

                                is = hh.split('分');
                                i = is[0];
                                replaceValue = (y || '') + (m || '') + (d || '');
                                if (replaceValue) replaceValue = replaceValue + ' ';
                                if (h) replaceValue = replaceValue + (h || '') + ':' + (i || '');
                                replaceValue = replaceValue.trim();
                            }
                        }
                    }
                } else {
                    var AllNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                        '０', '１', '２', '３', '４', '５', '６', '７', '８', '９',
                        '〇', '一', '二', '三', '四', '五', '六', '七', '八', '九',
                        '零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
                    selValue.split('').map(function (c) {
                        if (c === '十' || c === '拾') {
                            replaceValue = replaceValue + formats[10];
                        } else {
                            var idx = AllNumbers.indexOf(c) % 10;
                            replaceValue = replaceValue + formats[idx];
                        }
                    });
                }
                var str = input.value.substring(0, selStart) + replaceValue + input.value.substring(selEnd);
                if (!str) return;
                svg.changeSelectedAttribute("#text", str, [selectedElement]);
                me.svgUpdateLayout(svg, selectedElement);
            },
            //print
            lineUp: function () {
                var gap = me.getWorkHeight() * 0.003;
                //var newgap = me.getLineGap() + gap;
                var newgap = me.getLinePadding() + gap;
                //console.log(me.getPreviewMode());
                if (newgap <= (gap * 7)) {
                    //me.setLineGap(newgap);
                    me.setLinePadding(newgap);

                    if (me.getPreviewMode() == 'Opinion')
                        me.layoutOpinions();
                    else
                        me.typesetting();
                }
                me.updateSvgCanvas();
            },
            lineDown: function () {
                var gap = me.getWorkHeight() * 0.001;
                //var newgap = me.getLineGap() - gap;
                var newgap = me.getLinePadding() - gap;
                me.getPreviewMode()
                if (newgap >= 0) {
                    //me.setLineGap(newgap);
                    me.setLinePadding(newgap);
                    console.log(newgap);

                    if (me.getPreviewMode() == 'Opinion')
                        me.layoutOpinions();
                    else
                        me.typesetting();
                }
                me.updateSvgCanvas();
            },
            //preview
            zoom: function (ratio, max) {
                me.zoom(ratio);
                me.stickyZoom();
                me.updateSvgCanvas(max);
            },
            up: function () {
                doMove('up');
            },
            down: function () {
                doMove('down');
            },
            addParagraph: function () {
                //TODO:新增段落，需更新 wk,mutiformat  , vm?

                if (!selectedElement) return;
                //console.log(selectedElement);
            },
            addTable: function (values) {
                if (!selectedElement) return;
                var x = parseFloat(selectedElement.getAttribute('x'));
                var y = me.getCurrentY() + me.getLineHeight(selectedElement) + me.getLineGap() + 5;
                var ratio = svg.getZoom();
                var w = (me.getPageWidth() - x - me.getMarginRight());
                var u = OA.common.Global.getCurrentUser();

                var cols = values.colCount;
                var rows = values.rowCount;
                var tbWidth = parseInt(100 / cols) + '%';
                var tb = [];

                tb.push(
                    '<table ' +
                    'width="' + w + '" ' +
                    'style="table-layout:fixed;' +
                    'zoom: ' + ratio + ';' +
                    'font-family:Times New Roman,BiauKai,標楷體;' +
                    '">'
                );

                for (var a = 1; a <= rows; a++) {
                    tb.push('<tr>');
                    for (var e = 1; e <= cols; e++) {
                        tb.push("<td class='c" + (e - 1) + " r" + (a - 1) + "' colspan='1' rowspan='1' width='" + tbWidth + "'>")
                        tb.push("<div contenteditable='true'>&nbsp;</div>");
                        tb.push("</td>");
                    }
                    tb.push("<td class='c" + cols + " r" + (a - 1) + "' colspan='1' rowspan='1' width='5' style='border:none;'>");
                    tb.push("<div contenteditable='true' class='lastcol'>&nbsp;</div>");
                    tb.push("</td>");

                    tb.push('</tr>');
                }
                tb.push('</table>');
                var _code = tb.join('');
                var table = Ext.create('OA.model.Octet',
                    {
                        empName: u.empName,
                        empNo: u.empNo,
                        jobName: u.jobName,
                        lastUpdateTime: OA.common.Utils.getChineseDate(),
                        positionX: x,
                        positionY: y,
                        tagName: "Octet",
                        text: '',
                        ratio: ratio,
                        version: OA.common.VIMgr.getCurrentEdition().版號,
                        code: B64.encode(_code),
                        type: 'table'
                    });
                Ext.getStore('Octet').add(table);

                me.setStatus('edit');
            }
        }
    },
    executeAction: function (action, textId, event) {
        var me = this;
        var svg = this.getSvgPaper();
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        var text = document.querySelector('#text');
        //var textRange = document.querySelector('#textRange');
        if (textId) {
            text = document.querySelector('#' + textId);
            //console.log(textId);
        }

        // Copies a string to the clipboard. Must be called from within an
        // event handler such as click. May return false if it failed, but
        // this is not always possible. Browser support for Chrome 43+,
        // Firefox 42+, Safari 10+, Edge and IE 10+.
        // IE: The clipboard feature may be disabled by an administrator. By
        // default a prompt is shown the first time the clipboard is
        // used (per session).
        function actionToClipboard(action, txt) {
            if (window.clipboardData && window.clipboardData.setData) {
                // IE specific code path to prevent textarea being shown while dialog is visible.
                return clipboardData.setData("Text", txt);

            } else if (document.queryCommandSupported && document.queryCommandSupported(action)) {
                var textarea = document.querySelector('#clipboardtextarea');
                if (!textarea) {
                    textarea = document.createElement("textarea");
                    textarea.id = 'clipboardtextarea';
                    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
                    document.body.appendChild(textarea);
                }

                textarea.textContent = txt;
                textarea.select();
                try {
                    text.focus();
                    if (action == 'cut' && !me.getIsClearPaper()) {
                        me.editActions().strike();
                    }
                    document.execCommand(action);  // Security exception may be thrown by some browsers.
                } catch (ex) {
                    console.warn(action + " to clipboard failed.", ex);
                    return false;
                } finally {
                    // document.body.removeChild(textarea);
                }
            }
        }

        function insertAtCursor(myField, myValue) {
            //IE support
            if (document.selection) {
                myField.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
            }
            //MOZILLA and others
            else if (myField.selectionStart || myField.selectionStart == '0') {
                var startPos = myField.selectionStart;
                var endPos = myField.selectionEnd;
                // myField.value = myField.value.substring(0, startPos)
                //     + myValue
                //     + myField.value.substring(endPos, myField.value.length);
                var t = myField.value.substring(0, startPos)
                    + myValue
                    + myField.value.substring(endPos, myField.value.length);

                // me.editActions().input( t );

                // me.editActions().input( myValue );

                setTimeout(function () {
                    // me.editActions().input(myValue);
                    me.editActions().insertWord(myValue);
                });

                // var svg = me.getSvgPaper();
                // svg.changeSelectedAttribute("#text", t);
            } else {
                myField.value += myValue;
            }
        }

        removeRedundantSpace = (text) => {
            return new Promise(resolve => {
                var result = "";
                var resource = text.split("");
                for (i = 0; i < resource.length; i++) {
                    if (i !== 0 && (resource[i] == " " || resource[i] == "　" || resource[i].charCodeAt(0) == 10)) {
                        if ((resource[i - 1] !== undefined) && (resource[i + 1] !== undefined)) {
                            if ((resource[i - 1].charCodeAt(0) >= 65 && resource[i - 1].charCodeAt(0) <= 90)
                                || (resource[i - 1].charCodeAt(0) >= 97 && resource[i - 1].charCodeAt(0) <= 122)
                                || (resource[i - 1].charCodeAt(0) >= 48 && resource[i - 1].charCodeAt(0) <= 57)
                                || (resource[i + 1].charCodeAt(0) >= 65 && resource[i + 1].charCodeAt(0) <= 90)
                                || (resource[i + 1].charCodeAt(0) >= 97 && resource[i + 1].charCodeAt(0) <= 122)
                                || (resource[i + 1].charCodeAt(0) >= 48 && resource[i + 1].charCodeAt(0) <= 57)
                            ) {
                                result = result + resource[i];
                            }
                        }
                    } else {
                        result = result + resource[i];
                    }
                }
                return resolve(result);
            })
        }

        pendingResult = (result) => {
            return new Promise(resolve => {
                Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });
                // 右鍵剪貼簿補全功能 - by yi-chi chiu
                setTimeout(function () {
                    me.editActions().insertWord(result);
                });
                setTimeout(function () {
                    me.svgUpdateLayout(me.getSvgPaper(), OA.common.Global.getApp().getController('OA.controller.Work').getCpaper().getSelectedElement());
                    Ext.Viewport.setMasked(false);
                });
                return resolve();
            });
        }

        onPaste = async (e) => {
            console.log(e);
            if (text) text.focus();
            var content;
            if (e) e.preventDefault();
            if (e && e.originalEvent && e.originalEvent.clipboardData) {
                content = (e.originalEvent || e).clipboardData.getData("text/plain");
                document.execCommand("insertText", false, content);
            } else if (window.clipboardData) {
                content = window.clipboardData.getData("Text");
                if (window.getSelection)
                    window
                        .getSelection()
                        .getRangeAt(0)
                        .insertNode(document.createTextNode(content));
            } else {
                var clipboard = document.querySelector("#clipboardtextarea");
                if (clipboard) {
                    console.log(clipboard);
                    var result = await removeRedundantSpace(clipboard.value);
                    await pendingResult(result);
                } else {
                    var clipboard = document.querySelector('#clipboardtextarea');
                    if (!clipboard) {
                        clipboard = document.createElement("textarea");
                        clipboard.id = 'clipboardtextarea';
                        clipboard.style.position = "fixed";
                        // Prevent scrolling to bottom of page in MS Edge.
                        document.body.appendChild(clipboard);
                    }

                    navigator.clipboard.readText()
                        .then(text => {
                            console.log('Pasted content: ', text);
                            clipboard.value = text;
                        }).catch(err => {
                            document.execCommand("Paste");
                            console.error('Failed to read clipboard contents: ', err);
                        });
                    var result = await removeRedundantSpace(clipboard.value);
                    await pendingResult(result);

                    //document.execCommand("Paste");
                }
                // insertAtCursor(text, clipboard.value);
            }
        }

        console.log('action= ' + action);
        if (action == 'undo') {
            /*
            //改從集合復原
            console.log('undo');
            var oldElMu = me.getRichAndmultiList();
            var unIndex = me.getUnreDoIndex() - 1;
            if (unIndex == -1) return;
            var oldEl = Ext.clone(oldElMu.rich[unIndex]);
            //var oldMu = Ext.clone(oldElMu.mult[unIndex]);
            var svg = me.getSvgPaper();
            //console.log(oldEl)
            if (svg) {
                var gContent = (svg.tagName == 'g') ? svg : svg.getCurrentDrawing().getCurrentLayer();
                var lastRichIndex = 0;
                var richCount = 0;
                Ext.Array.each(gContent.childNodes, function (node, index) {
                    var isHas = false;
                    Ext.Array.each(oldEl, function (old) {
                        if (node.id == old.id) {
                            isHas = true;
                            Ext.apply(node, old);
                            return true;
                        }
                    });
                    if (node.id.indexOf("KDRichTextBlock") != -1) {
                        if (oldEl[richCount] && node.id != oldEl[richCount].id) {
                            if (lastRichIndex == 0) {
                                lastRichIndex = index;
                            }
                        }
                        richCount++
                    }
                    if (!isHas) {
                        if (node.id.indexOf("KDRichTextBlock") != -1) {
                            //先檢核目前index的集合el的action
                            var old_els = oldElMu.rich[me.getUnreDoIndex()];
                            if (old_els) {
                                //找出有action的node
                                var action_node;
                                Ext.Array.each(old_els, function (els) {
                                    if (els.getAttribute('action') != null) {
                                        action_node = els;
                                    }
                                });
                                //var old_node = old_els[richCount];
                                if (action_node) {
                                    var old_action = action_node.getAttribute('action')
                                    if (old_action) {
                                        if (old_action == 'indent') {
                                            //還原縮排=重作增排.outdent();
                                            var selectNode;
                                            Ext.Array.each(gContent.childNodes, function (nodes) {
                                                if (nodes.id == action_node.id) {
                                                    selectNode = nodes;
                                                }
                                            });
                                            if (selectNode) {
                                                me.setSelectedElement(selectNode);
                                                me.editActions(true).outdent(); //執行增排
                                                var nowNodes = oldElMu.rich[unIndex];
                                                //var nodeID = selectNode.id + '_context';
                                                console.log(selectNode.id);
                                                var now_node = nowNodes.where("( el, i, res, param ) =>el.id=='" + selectNode.id + "'");
                                                if (now_node.length != 0) {
                                                    now_node[0].setAttributeNS(null, 'action', 'outdent');
                                                    //重新檢核帶入
                                                    Ext.Array.each(gContent.childNodes, function (node, index) {
                                                        Ext.Array.each(oldEl, function (old) {
                                                            if (node.id == old.id) {
                                                                Ext.apply(node, old);
                                                            }
                                                        });
                                                    });
                                                }
                                                //old_node.setAttribute('action', 'outdent');
                                                return false;
                                            }
                                        } else if (old_action == 'outdent') {
                                            //還原增排=重作縮排.indent();
                                            var selectNode;
                                            Ext.Array.each(gContent.childNodes, function (nodes) {
                                                if (nodes.id == action_node.id) {
                                                    selectNode = nodes;
                                                }
                                            });
                                            if (selectNode) {
                                                me.setSelectedElement(selectNode);
                                                me.editActions().indent();  //執行縮排
                                                var nowNodes = oldElMu.rich[unIndex];
                                                //var nodeID = selectNode.id + '_context';
                                                console.log(selectNode.id);
                                                var now_node = nowNodes.where("( el, i, res, param ) =>el.id=='" + selectNode.id + "'");
                                                if (now_node.length != 0) {
                                                    now_node[0].setAttributeNS(null, 'action', 'indent');
                                                    //重新檢核帶入
                                                    Ext.Array.each(gContent.childNodes, function (node, index) {
                                                        Ext.Array.each(oldEl, function (old) {
                                                            if (node.id == old.id) {
                                                                Ext.apply(node, old);
                                                            }
                                                        });
                                                    });
                                                }
                                                return false;
                                            }
                                        }
                                    }
                                }
                            }
                            //remove
                            node.remove();
                        } else {
                            //turnLine
                            if (richCount != 0 && oldEl.length > richCount) {
                                var lastRichNode;
                                if (lastRichIndex == 0) {
                                    lastRichNode = node;
                                } else {
                                    lastRichNode = gContent.childNodes[lastRichIndex];
                                }
                                console.log(lastRichNode);
                                if (lastRichNode.previousSibling && lastRichNode.previousSibling.id.indexOf("KDRichTextBlock") != -1) {
                                    var turnLineNode = lastRichNode.previousSibling;
                                    var el_new = me.turnLine(turnLineNode, turnLineNode.textContent.length);
                                    if (el_new) {
                                        var old_el = oldEl.where("( el, i, res, param ) =>el.id=='" + el_new.id + "'");
                                        if (old_el.length != 0) {
                                            Ext.apply(el_new, old_el[0]);
                                        }
                                    }
                                }
                                return false;
                            }
                        }
                    }
                });
               //me.setMultiFormat(oldMu);
                me.typesetting(svg, true);
            }


            me.setUnreDoIndex(unIndex);
            */

            if (svg.undoMgr.getUndoStackSize() > 0) {
                svg.undoMgr.undo();
            }
        } else if (action == 'redo') {
            /*
            //改從集合重作
            console.log('redo');

            var oldElMu = me.getRichAndmultiList();
            var reIndex = me.getUnreDoIndex() + 1;
            if (reIndex >= oldElMu.rich.length) return;
            var oldEl = Ext.clone(oldElMu.rich[reIndex]);
            var oldMu = Ext.clone(oldElMu.mult[reIndex]);
            var svg = me.getSvgPaper();
            //console.log(oldEl)
            if (svg) {
                var lastRichIndex = 0;
                var richCount = 0;
                var gContent = (svg.tagName == 'g') ? svg : svg.getCurrentDrawing().getCurrentLayer();
                Ext.Array.each(gContent.childNodes, function (node, index) {
                    var isHas = false;
                    Ext.Array.each(oldEl, function (old) {
                        if (node.id == old.id) {
                            isHas = true;
                            Ext.apply(node, old);
                            return true;
                        }
                    });
                    if (node.id.indexOf("KDRichTextBlock") != -1) {
                        if (oldEl[richCount] && node.id != oldEl[richCount].id) {
                            if (lastRichIndex == 0) {
                                lastRichIndex = index;
                            }
                        }
                        richCount++
                    }
                    if (!isHas) {
                        if (node.id.indexOf("KDRichTextBlock") != -1) {
                            //先檢核目前index的集合el的action
                            var old_els = oldElMu.rich[me.getUnreDoIndex()];
                            if (old_els) {
                                //找出有action的node
                                var action_node;
                                Ext.Array.each(old_els, function (els) {
                                    if (els.getAttribute('action') != null) {
                                        action_node = els;
                                    }
                                });
                                //var old_node = old_els[richCount];
                                if (action_node) {
                                    var old_action = action_node.getAttribute('action')
                                    if (old_action) {
                                        if (old_action == 'indent') {
                                            //還原縮排=重作增排.outdent();
                                            var selectNode;
                                            Ext.Array.each(gContent.childNodes, function (nodes) {
                                                if (nodes.id == action_node.id) {
                                                    selectNode = nodes;
                                                }
                                            });
                                            if (selectNode) {
                                                me.setSelectedElement(selectNode);
                                                me.editActions(true).outdent(); //執行增排
                                                var nowNodes = oldElMu.rich[reIndex];
                                                //var nodeID = selectNode.id + '_context';
                                                console.log(selectNode.id);
                                                var now_node = nowNodes.where("( el, i, res, param ) =>el.id=='" + selectNode.id + "'");
                                                if (now_node.length != 0) {
                                                    now_node[0].setAttributeNS(null, 'action', 'outdent');
                                                    //重新檢核帶入
                                                    Ext.Array.each(gContent.childNodes, function (node, index) {
                                                        Ext.Array.each(oldEl, function (old) {
                                                            if (node.id == old.id) {
                                                                Ext.apply(node, old);
                                                            }
                                                        });
                                                    });
                                                }
                                                //old_node.setAttribute('action', 'outdent');
                                                return false;
                                            }
                                        } else if (old_action == 'outdent') {
                                            //還原增排=重作縮排.indent();
                                            var selectNode;
                                            Ext.Array.each(gContent.childNodes, function (nodes) {
                                                if (nodes.id == action_node.id) {
                                                    selectNode = nodes;
                                                }
                                            });
                                            if (selectNode) {
                                                me.setSelectedElement(selectNode);
                                                me.editActions(true).indent();  //執行縮排
                                                var nowNodes = oldElMu.rich[reIndex];
                                                //var nodeID = selectNode.id + '_context';
                                                console.log(selectNode.id);
                                                var now_node = nowNodes.where("( el, i, res, param ) =>el.id=='" + selectNode.id + "'");
                                                if (now_node.length != 0) {
                                                    now_node[0].setAttributeNS(null, 'action', 'indent');
                                                    //重新檢核帶入
                                                    Ext.Array.each(gContent.childNodes, function (node, index) {
                                                        Ext.Array.each(oldEl, function (old) {
                                                            if (node.id == old.id) {
                                                                Ext.apply(node, old);
                                                            }
                                                        });
                                                    });
                                                }
                                                //old_node.setAttribute('action', 'indent');
                                                return false;
                                            }
                                        }
                                    }
                                }
                            }
                            //remove
                            node.remove();
                        } else {
                            //turnLine
                            if (richCount != 0 && oldEl.length > richCount) {
                                var lastRichNode;
                                if (lastRichIndex == 0) {
                                    lastRichNode = node;
                                } else {
                                    lastRichNode = gContent.childNodes[lastRichIndex];
                                }
                                console.log(lastRichNode);
                                if (lastRichNode.previousSibling && lastRichNode.previousSibling.id.indexOf("KDRichTextBlock") != -1) {
                                    var turnLineNode = lastRichNode.previousSibling;
                                    var el_new = me.turnLine(turnLineNode, turnLineNode.textContent.length);
                                    if (el_new) {
                                        var old_el = oldEl.where("( el, i, res, param ) =>el.id=='" + el_new.id + "'");
                                        if (old_el.length != 0) {
                                            Ext.apply(el_new, old_el[0]);
                                        }
                                    }
                                }
                                return false;
                            }
                        }
                    }
                });
                me.setMultiFormat(oldMu);
                me.typesetting(svg);
            }

            me.setUnreDoIndex(reIndex);
            */

            if (svg.undoMgr.getRedoStackSize() > 0) {
                svg.undoMgr.redo();
            }
        } else if (action == 'thesaurus') {
            OA.common.Funcs.show('FormThesaurus', null, 'paper');
        } else if (action === 'overPrint') {
            OA.common.Funcs.show('PanelOverprint');
        } else if (action === 'export') {
            OA.common.Funcs.show('FormExport');
        } else if (action === 'import') {
            var reader = new FileReader();
            var again = false;
            var r = new Resumable({ target: 'index.html', fileType: ['di'], maxFiles: 1 });
            var subStr = '';
            var vm = OA.common.Global.getCurrentViewModel();
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
            OA.common.FileMgr.setSaveFolder(newSaveFolder);
            reader.onloadend = function () {
                var name = reader.source.name;
                var xml = reader.result;

                if (!again) {
                    var isbig5 = xml.indexOf('encoding="big5"') >= 0;
                    if (isbig5) {
                        reader.readAsText(reader.source, 'big5');
                        again = true;
                    }
                }
                OA.common.FileMgr.noServiSignDoImport(xml);
            };
            var ctr = Ext.getCmp('import');
            r.assignBrowse(ctr.element.dom);           // addEventListener('click')
            r.on('fileAdded', function (file, event) {
                r.upload();
            });
            r.on('fileSuccess', function (rf) {
                again = false;
                reader.source = rf.file;
                // var fileExt = ctrFileExt.getValue();
                reader.readAsText(rf.file);
                r.removeFile(rf);
            });
            r.on('error', function (message, rf) {
            });
            // var status = OA.common.Paper.getActiveStatus();
            // var isSaved = status && status != 'saved';
            // if (isSaved) { //預先儲存
            //     ctrWK.doSaveFolder({ action: 'save', isNotPopup: true }, function () {
            //         OA.common.FileMgr.doImport();
            //     });
            //     return;
            // } else {
            //     var qs = OA.common.Global.getQ();
            //     if (qs.app === 'editor' || qs.app === 'offline') {
            //         OA.common.FileMgr.doImport();
            //     } else {
            //         if (OA.common.Utils.checkEpaper()) {
            //             ctrWK.doSave({ action: 'save' }, function () {
            //                 OA.common.FileMgr.doImport();
            //             });
            //         } else {
            //             OA.common.FileMgr.doImport();
            //         }
            //     }
            // }
        } else if (action === 'symbol') {
            ctrWK.onSymbolTap(null, { action: 'symbol' });
        } else if (action === 'bullet') {
            ctrWK.onSymbolTap(null, { action: 'bullet' });
        } else if (action === 'quote' || action === 'quoteCourse') {
            OA.common.Funcs.show('PanelReference');
        } else if (action === 'attCourse') {
            OA.common.Funcs.show('FormAttachCourse');
        } else if (action === 'cut') {
            if (text) {
                text.focus();
                actionToClipboard('cut', text.value.substring(text.selectionStart, text.selectionEnd));
            } else {
                document.execCommand("Cut");
            }
        } else if (action === 'copy') {
            if (text) {
                var clipboard = document.querySelector('#clipboardtextarea');
                if (!clipboard) {
                    clipboard = document.createElement("textarea");
                    clipboard.id = 'clipboardtextarea';
                    clipboard.style.position = "fixed";
                    // Prevent scrolling to bottom of page in MS Edge.
                    document.body.appendChild(clipboard);
                }

                navigator.clipboard.writeText(text.value.substring(text.selectionStart, text.selectionEnd))
                    .then(() => {
                        console.log("Text copied to clipboard...")
                    })
                    .catch(err => {
                        console.log('Something went wrong', err);
                    })

                actionToClipboard(
                    "copy",
                    text.value.substring(text.selectionStart, text.selectionEnd)
                );

                $(text).trigger(
                    jQuery.Event('keydown', { keyCode: 67, which: 67, ctrlKey: true })
                );
            } else {
                document.execCommand("Copy");
            }

            /*
            if (text) {
                text.focus();
                //if (textRange && textRange.value!='') {
                //    actionToClipboard('copy', textRange.value);
                //}
                actionToClipboard(
                    "copy",
                    text.value.substring(text.selectionStart, text.selectionEnd)
                );
            } else {
                document.execCommand("Copy");
            }

            /*
            if (text) {
                text.focus();
                actionToClipboard(
                    "copy",
                    text.value.substring(text.selectionStart, text.selectionEnd)
                );
                $(text).trigger(
                    jQuery.Event('keydown', { keyCode: 67, which: 67, ctrlKey: true })
                );
            } else {
                document.execCommand("Copy");
            }
            */
        } else if (action === 'paste') {
            onPaste(event);
        } else if (action === 'copyAll') {
            //抓出KDRich內所有文字
            var vm = OA.common.Global.getCurrentViewModel();
            if (vm && vm.KDRichTextBlockList) {

                var strAll = '';
                Ext.Array.each(vm.KDRichTextBlockList, function (rich) {
                    var richid = rich.id + '_context';
                    if (vm[richid]) {
                        //console.log(vm[richid])
                        if (vm[richid] != '') {
                            strAll += vm[richid];
                        }
                    }
                })

                if (strAll != '') {
                    var clipboard = document.querySelector('#clipboardtextarea');
                    if (!clipboard) {
                        clipboard = document.createElement("textarea");
                        clipboard.id = 'clipboardtextarea';
                        clipboard.style.position = "fixed";
                        // Prevent scrolling to bottom of page in MS Edge.
                        document.body.appendChild(clipboard);
                    }
                    //console.log(strAll);
                    clipboard.value = strAll;
                    clipboard.select();
                    document.execCommand('copy');

                    var content = strAll;
                    navigator.clipboard.writeText(content)
                        .then(() => {
                            console.log("Text copied to clipboard...")
                        })
                        .catch(err => {
                            console.log('Something went wrong', err);
                        })
                }
            }
        } else if (action === 'grid') {
            OA.common.Funcs.show('FormAddTable');
        } else if (action === 'mergeCells') {
            if (ctrWK) ctrWK.tableInit().mergeCells();
        } else if (action === 'deleteRow') {
            if (ctrWK) ctrWK.tableInit().deleteRow();
        } else if (action === 'picture') {
        } else if (action === 'duplicate') {
            ctrWK.duplicatePaper();
        } else if (action === 'math') {
            OA.common.Funcs.widget('FormChangeNumber');
        } else if (action === 'package') {
            ctrWK.onPackageTap();
        } else if (action === 'binPacket') {
            OA.common.Funcs.show('FormImport');
            OA.common.Paper.main().setBinPacket(true);
        } else if (action === 'changeSubject') {
            Ext.Msg.prompt("主旨", "請輸入主旨：", function (bu, txt) {
                if (bu === 'cancel') {
                    Ext.Viewport.setMasked(false);
                    return;
                }
                if (txt === '') {
                    Ext.Msg.alert('提示', '主旨不可空白！');
                    return;
                } else {
                    var vi = OA.common.VIMgr.getViContent();
                    var vm = OA.common.Global.getCurrentViewModel();
                    vm.主旨 = txt;
                    if (vm && vm.主旨) vi.主旨 = vm.主旨;
                    return;
                }
            }, this, 400, OA.common.Global.getCurrentViewModel().主旨);
        }
    },
    /**
     * 放大
     */
    zoom: function (ratio) {
        var me = this;
        var svg = this.getSvgPaper();
        if (null == svg) return;
        var qs = OA.common.Global.getQ();
        if (qs.app == 'async' && ratio == undefined) {
            ratio = 1;
        }
        var parent = this.up('container');
        var workWidth = parent.element.getWidth(true);
        var ort = Ext.Viewport.getOrientation();
        if (ort == 'portrait')
            workWidth = Ext.getBody().getSize().width * 1;

        var toolbarZoom = Ext.getCmp('oaWorkToolbarZoom');
        var toolbarZoomEdit = Ext.getCmp('oaWorkToolbarZoomEdit');

        if (ratio) {
            ratio = Math.max(ratio, 0.5);
            if (ratio == 0.67) {
                if (toolbarZoom) toolbarZoom.setIconCls('fa-search-plus');
                if (toolbarZoomEdit) toolbarZoomEdit.setIconCls('fa-search-plus');
            } else {
                if (toolbarZoom) toolbarZoom.setIconCls('fa-search-minus');
                if (toolbarZoomEdit) toolbarZoomEdit.setIconCls('fa-search-minus');
            }

        } else {
            ratio = Math.max(workWidth / me.getPageWidth(), 0.5);
            if (toolbarZoom) toolbarZoom.setIconCls('fa-search-plus');
            if (toolbarZoomEdit) toolbarZoomEdit.setIconCls('fa-search-plus');
        }


        var selectZoom = Ext.getCmp('zoomRatio');
        if (selectZoom && ratio != selectZoom.getValue()) {
            var zoomItems = [
                { value: '50%', key: '0.5' },
                { value: '75%', key: '0.75' },
                { value: '90%', key: '0.9' },
                { value: '100%', key: '1' },
                { value: '125%', key: '1.25' },
                { value: '150%', key: '1.50' },
                { value: '200%', key: '2' }
            ]

            var oldValue;
            Ext.Array.each(zoomItems, function (item, index) {
                var key = parseFloat(item.key);
                if (ratio > oldValue && ratio < key) {
                    Ext.Array.insert(zoomItems, index, [{ value: '頁寬', key: ratio + '' }]);
                }
                oldValue = key;
            });
            selectZoom.updateOptions(zoomItems);
            ratio = '1';
            selectZoom.setValue(ratio);
        }

        this.setRatio(ratio);
        svg.setZoom(ratio);

        var divTables = document.querySelectorAll('.customTable');
        Ext.Array.each(divTables, function (div) {
            var id = div.id.split('_')[1];
            var ctnId = 'ctnTable_' + id;
            var rectId = 'rectTable_' + id;
            var rect = document.querySelector('#' + rectId);
            if (rect) {
                var _x = parseFloat(rect.getAttribute('x')) * ratio;
                var _y = parseFloat(rect.getAttribute('y')) * ratio;
                var ctnTable = Ext.getCmp(ctnId);
                ctnTable.setLeft(_x);
                ctnTable.setTop(_y);
                $('table', div).css('zoom', ratio);
            }
        })
    },
    /**
     * 便利貼縮放
     */
    stickyZoom: function () {
        var me = this;
        var ratio = this.getRatio();

        var store = Ext.getStore('Sticky');
        store.each(function (record, index, length) {
            var stricky = me.down('#' + record.id + '-stricky');
            if (stricky) {
                var _x = parseInt(record.get('positionX')) * ratio;
                var _y = parseInt(record.get('positionY')) * ratio;
                stricky.setLeft(_x);
                stricky.setTop(_y);
            }
        });
    },
    /**
     * Enter 換行
     *
     * 增加同層一行、編號＋1 、同層以下部份重編號
     */
    turnLine: function (textnode, pos) {
        var me = this;
        //console.log(pos);
        var wk = OA.common.Global.getCurrentWKContent();
        var x_pos = textnode.getAttribute("x");
        var y_pos = textnode.getAttribute("y");
        var id = textnode.getAttribute("id");
        var t = textnode.textContent;

        var tFront = t.substring(0, pos);
        var tBack = t.substring(pos);

        if (tFront.length == 0) tFront = '\u00A0';//全型空格

        var padding = 0;
        var line_height = me.getLineHeight(textnode);

        // Clone the original text node to store and display the final wrapping text.
        var wrapping = textnode.cloneNode(false); // False means any TSPANs in the textnode will be discarded
        wrapping.setAttributeNS(null, 'x', x_pos + padding);
        wrapping.setAttributeNS(null, 'y', y_pos + padding);

        var testingTSPAN = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        testingTSPAN.setAttributeNS(null, 'x', x_pos + padding);
        testingTSPAN.setAttributeNS(null, 'dy', line_height);
        var testingTEXTNODE = document.createTextNode(tFront);
        testingTSPAN.appendChild(testingTEXTNODE);
        wrapping.appendChild(testingTSPAN);

        var previous = textnode.previousSibling;
        if (!previous) return;

        var id_previous = previous.getAttribute("id");
        var cls_previous = previous.getAttribute("class");

        //說明欄最頂層時初始
        var isParent = cls_previous.indexOf('indent-0') >= 0;
        if (isParent) {
            id_previous = 'KDRichTextBlock-' + (parseInt(id_previous.split('_')[1]) * 1000);
            cls_previous = 'indent-1.0';
        }
        var wrapping2 = previous.cloneNode(false);
        var y2 = previous.getAttribute("y") + wrapping.getBBox().height + padding;
        wrapping2.setAttributeNS(null, 'x', previous.getAttribute("x") + padding);
        wrapping2.setAttributeNS(null, 'y', y2);

        var id_previousPlus = OA.common.Utils.dotSplitPlus(id_previous, 1);
        wrapping2.setAttributeNS(null, 'id', id_previousPlus);
        var cls_previousPlus = OA.common.Utils.toLvNumberStringPlus(cls_previous, 1);
        wrapping2.setAttributeNS(null, 'class', cls_previousPlus);

        if (wk.DocumentType === '受文者令' || wk.DocumentType === '會銜令' ||
            wk.DocumentType === '會銜受文者令' || wk.DocumentType === '箋函') { //可換行，不可分段
            wrapping2.textContent = '';
        } else {
            //簡簽第一跟第三段，可換行不分段，不要段名
            var isEasyEmpty = false;
            /*
            if (wk.DocumentType == '簡簽' || wk.DocumentType === '令' ) {
                //判斷是否為第一或第二段
                var wrap2Id = wrapping2.id;
                if (wrap2Id.indexOf('-') != -1) {
                    var wrap2Arr = wrap2Id.split('-');
                    var checkId = wrap2Arr[1];

                    if (checkId.length >= 4) {
                        //判斷是否為第第三段
                        var firstWord = checkId.substring(0, 1);
                        if (firstWord == '2') {
                            isEasyEmpty = true;
                        }
                    } else {
                        //小於4碼階為第一段
                        isEasyEmpty = true;
                    }
                }
            }
            */
            if (isEasyEmpty) {
                wrapping2.textContent = '';
            } else {
                var escapeId = id_previous.replace(/([^A-Za-z0-9_\u00A1-\uFFFF-])/g, "\\$1");
                var previousElem = me.getSvgPaper().getElem(escapeId);

                var isSymbol = previousElem && '•‣◦⁃⁌⁍'.split('').indexOf(previousElem.textContent) >= 0;
                if (isSymbol) {
                    wrapping2.textContent = previousElem.textContent;
                } else {
                    wrapping2.textContent = OA.common.Utils.ChineseNumberStringPlus(cls_previous, 1);
                }
            }
        }

        var wrapping3 = textnode.cloneNode(false);
        wrapping3.setAttributeNS(null, 'x', x_pos + padding);
        wrapping3.setAttributeNS(null, 'y', y2);
        wrapping3.setAttributeNS(null, 'id', id_previousPlus + '_context');

        if (tBack.length == 0) tBack = '\u00A0';//全型空格

        testingTSPAN = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        testingTSPAN.setAttributeNS(null, 'x', x_pos + padding);
        testingTSPAN.setAttributeNS(null, 'dy', line_height);
        testingTEXTNODE = document.createTextNode(tBack);
        testingTSPAN.appendChild(testingTEXTNODE);
        wrapping3.appendChild(testingTSPAN);

        textnode.parentNode.replaceChild(wrapping3, textnode);
        wrapping3.parentNode.insertBefore(wrapping2, wrapping3);
        wrapping2.parentNode.insertBefore(wrapping, wrapping2);

        // var f = me.renameBullet(wrapping3.previousSibling, 1);        
        //me.multiFormatUpdate(f);
        me.renameBullet(wrapping3.previousSibling, 1);
        me.correctnessKDRichID(previous);

        //每次正規後要清除，追修替換記錄標記
        Ext.Array.each(me.getMultiFormat(), function (mu) {
            mu.hasreplace = false;
        });

        var posBreak = (pos == 0 && tFront.length == 1) ? 0 : tFront.length; //修正補全型空格位差
        me.mfSplit(id, id_previousPlus + '_context', pos, t.length, posBreak);

        $('#text').val(wrapping3.textContent);
        return wrapping3;
    },
    /**
     * 刪行
     * 回補內容，更換編號，更新虛擬輸欄內容，更新WK內容,更新駐點位置
     */
    deleteLine: function (textnode) {
        var me = this;
        var currentContent = textnode;
        var currentBullet = textnode.previousSibling;
        var previousContent = currentBullet.previousSibling;
        var isForemost = currentBullet.getAttribute("class").indexOf('indent-0') >= 0;
        if (isForemost) return;
        var isContentIncludeIndent = currentContent.getAttribute("class").indexOf('indent') >= 0;
        if (isContentIncludeIndent) return;
        //sam.hsu 20180710 條例下還有資料不可刪除
        //console.log(textnode.previousSibling.getAttribute("class"));
        //console.log(textnode.nextSibling.getAttribute("class"));
        var wk = OA.common.Global.getCurrentWKContent();
        if (textnode.nextSibling.getAttribute("class").indexOf('indent') >= 0) {
            var svg = this.getSvgPaper();
            var i = textnode.previousSibling.getAttribute("class").substring(7, 8);
            var j = textnode.nextSibling.getAttribute("class").substring(7, 8);
            var k = textnode.previousSibling.getAttribute("class").substring(9, 10);
            if (i < j && k == 1) {
                Ext.Msg.alert("提示", "條例下尚有資料，編號不可跳號！", function () {
                    svg.textActions.setCursor();
                });
                return;
            }
        }

        var pid = previousContent.getAttribute("id");
        var pContent = previousContent.textContent;
        var cid = currentContent.getAttribute("id");

        // var previousTextConet =previousContent.textContent;
        // var _pos = previousContent.textContent.length;
        var previousTextConet
        var unTrimLeft = ['便箋', '令', '受文者令', '會銜令', '會銜受文者令', 'A4空白簽'].indexOf(wk.DocumentType) >= 0 && pid == 'KDRichTextBlock_1_context';
        // 令刪行一律留前面空白 - by yi-chi chiu
        if ('令' === wk.DocumentType || wk.DocumentType === '受文者令' || wk.DocumentType === '會銜令' ||
            wk.DocumentType === '會銜受文者令') {
            unTrimLeft = true;
        }
        if (unTrimLeft) {
            previousTextConet = previousContent.textContent;
        } else {
            previousTextConet = previousContent.textContent.replace(/^\s+/, ''); //trimLeft
        }
        var _pos = previousTextConet.length;

        previousContent.textContent = previousTextConet + currentContent.textContent;
        if (previousContent.textContent.trim().length == 0) previousContent.textContent = ' ';

        //說明描述與條例
        if (pid == 'KDRichTextBlock_1_context' && cid == 'KDRichTextBlock-1_context' && _pos == 0) {
            previousContent.textContent = ' ';
            var mu1 = me.multiFormatQuery('KDRichTextBlock-1_context');
            if (mu1) Ext.Array.remove(this.getMultiFormat(), mu1);
        }


        //說明描述與條例
        if (pid == 'KDRichTextBlock_2_context' && cid == 'KDRichTextBlock-2_context' && _pos == 0) {
            previousContent.textContent = ' ';
            var mu1 = me.multiFormatQuery('KDRichTextBlock-2_context');
            if (mu1) Ext.Array.remove(this.getMultiFormat(), mu1);
        }


        //TODO:enter斷行後增加文字，於上行最未del，文字異常, 可能跟條例內容有無有關
        // //說明
        // var is1001 = pid == 'KDRichTextBlock_1_context' && cid == 'KDRichTextBlock-1001_context';
        // if (is1001) {
        //     var mu1001 = me.multiFormatQuery('KDRichTextBlock-1001_context');
        //     if (mu1001) {
        //         mu1001.bindId = 'KDRichTextBlock_1_context';
        //         Ext.Array.each(mu1001.multiFormat, function (p) {
        //             p.fromBindId = 'KDRichTextBlock_1_context';
        //         })
        //     }
        // }
        // //擬辦
        // var is1002 = pid == 'KDRichTextBlock_2_context' && cid == 'KDRichTextBlock-2001_context';
        // if (is1002) {
        //     var mu1002 = me.multiFormatQuery('KDRichTextBlock-2001_context');
        //     if (mu1002) {
        //         mu1002.bindId = 'KDRichTextBlock_2_context';
        //         Ext.Array.each(mu1002.multiFormat, function (p) {
        //             p.fromBindId = 'KDRichTextBlock_2_context';
        //         })
        //     }
        // }

        this.renameBullet(currentBullet, -1);

        //var f = this.renameBullet(currentBullet, -1);

        var cmf = me.multiFormatLastQuery(cid);
        //var cmf = me.multiFormatQuery(cid);
        if (cmf) {
            me.mfMerge(pid, cid, _pos, pContent);
        } else {
            //要回補本列按鈕
            // console.log(  Ext.clone(me.getMultiFormat()));
            // console.log(pid);
            var pmf = me.multiFormatQuery(pid);
            //var pmf = me.multiFormatQuery(pid);
            if (pmf) {
                var last = Ext.clone(pmf.multiFormat[pmf.multiFormat.length - 1]);
                last.fromItemIdx = last.fromItemIdx + 1;
                last.text = currentContent.textContent;
                last.styles = undefined;
                pmf.multiFormat.push(last);
            }
        }

        //me.multiFormatUpdate(f);
        me.correctnessKDRichID(textnode);
        //每次正規後要清除，追修替換記錄標記
        Ext.Array.each(me.getMultiFormat(), function (mu) {
            mu.hasreplace = false;
        });
        currentBullet.parentNode.removeChild(currentBullet);
        currentContent.parentNode.removeChild(currentContent);

        $('#text').val(previousContent.textContent);

        previousContent.cursorPos = _pos;
        return previousContent;
    },
    /**
     * 切換縮排
     */
    moveLine: function (fromId, intValue) {
        var me = this;
        var escapeFromId = fromId.replace(/([^A-Za-z0-9_\u00A1-\uFFFF-])/g, "\\$1");
        var current = svgedit.utilities.getElem(escapeFromId);
        // 解決無foucus時的UI BUG  - by yi-chi chiu
        if (!current) {
            return;
        }
        var fromBullet = current.cloneNode(false);
        var currentBullet = current;
        var prevBullet = me.previousBullet(currentBullet, intValue);

        //一層不可向前縮排
        var isFrontMoveOut =
            intValue < 0 &&
            currentBullet.getAttribute("class").indexOf("indent-1") >= 0;
        //不可超過8層
        var isBackMoveOut =
            intValue > 0 &&
            currentBullet.getAttribute("class").indexOf("indent-8") >= 0;
        //右縮排起始，不可再縮
        var bb = OA.common.Utils.toLvNumber(current.getAttribute("class"));
        if (intValue > 0 && bb.no == 1) isBackMoveOut = true;

        if (isFrontMoveOut || isBackMoveOut) return;

        //向上找同級編號為基準，子系全部重編(增縮排不做追蹤修訂，累加)
        //var b = me.updateBullet(currentBullet, prevBullet, 1);
        //var f = me.renameFollowingBullet(currentBullet, fromBullet, intValue);
        //var c = me.correctnessKDRichID(currentBullet);
        //if (!me.getIsClearPaper()) {
        //    me.multiFormatUpdate(f, b);
        //    me.multiFormatUpdate(c);
        //}
        me.updateBullet(currentBullet, prevBullet, 1);
        me.renameFollowingBullet(currentBullet, fromBullet, intValue);
        me.correctnessKDRichID(currentBullet);
        //每次正規後要清除，追修替換記錄標記
        Ext.Array.each(me.getMultiFormat(), function (mu) {
            mu.hasreplace = false;
        });
        return currentBullet.getAttribute("id");
    },
    /**
     * 更新項次編號
     */
    updateBullet: function (currentBullet, updateElem, intValue) {
        var bulletId = currentBullet.getAttribute("id");
        var bulletClassName = currentBullet.getAttribute("class");
        var newID = null,
            newClsName = null,
            newContent = null,
            updateId = "",
            updateClassName = "";

        var mfUpdate;
        var hasReplace = false;
        if (updateElem == null) {
            newID = OA.common.Utils.dotSplitPlus(bulletId, -1) + ".1";
            newClsName = OA.common.Utils.toLvStringPlus(bulletClassName, 1, 1);
            newContent = OA.common.Utils.ChineseNumberStringPlus(newClsName, 0);
        } else {
            updateId = updateElem.getAttribute("id");
            updateClassName = updateElem.getAttribute("class");
            newID = OA.common.Utils.dotSplitPlus(updateId, intValue);
            //先判斷是否為子層，如果是子層，因該與上一層ID相同
            if (bulletId.indexOf(".") >= 0) {
                if (
                    currentBullet.previousSibling &&
                    currentBullet.previousSibling.previousSibling
                ) {
                    var previous = currentBullet.previousSibling.previousSibling;
                    var previousID = previous.getAttribute("id");
                    if (previousID.indexOf("KDRichTextBlock") >= 0) {
                        var previousArr = previousID.split(".");
                        var bullettArr = bulletId.split(".");
                        var updateArr = Ext.clone(updateId.split("."));
                        var newArr = Ext.clone(newID.split("."));
                        var previousClassName = previous.getAttribute("class");
                        if (previousArr[0] !== bullettArr[0] && updateArr.length > 1) {
                            updateId = previousArr[0];
                            updateClassName = updateElem.getAttribute("class");
                            if (bullettArr.length > previousArr.length) {
                                //上下不同層，且下層階層數大於上層
                                var no = updateArr[updateArr.length - 1];
                                if (previousArr.length == 1) no = newArr[newArr.length - 1]; //上一層為為最top層no要為1
                                Ext.Array.each(previousArr, function (r, index) {
                                    if (index > 0) updateId = updateId + "." + r;
                                });
                                newID = updateId + "." + no;
                                hasReplace = true;
                            } else if (bullettArr.length == previousArr.length) {
                                //上下同層
                                Ext.Array.each(previousArr, function (r, index) {
                                    if (index > 0) updateId = updateId + "." + r;
                                });
                                intValue = 1;
                                newID = OA.common.Utils.dotSplitPlus(updateId, intValue);
                                updateClassName = previousClassName;
                                hasReplace = true;
                            } else if (previousArr.length > bullettArr.length) {
                                //上階數大於下層
                                //上階數大於下層，向上選找同階層Bullet
                                var stairsBullet = this.previousStairs(currentBullet, updateClassName);
                                if (stairsBullet) { //有找到同階層，直接用這個階層+1
                                    intValue = 1;
                                    var stairsId = stairsBullet.getAttribute("id");
                                    newID = OA.common.Utils.dotSplitPlus(stairsId, intValue);
                                    updateClassName = stairsBullet.getAttribute("class");
                                    hasReplace = true;
                                }
                            }
                        } else if (
                            bullettArr.length > previousArr.length &&
                            updateArr.length > 1
                        ) {
                            //上下不同層，且下層階層數大於上層（可能還會有問題，要再調整）
                            updateId = previousArr[0];
                            var no = updateArr[updateArr.length - 1];
                            Ext.Array.each(previousArr, function (r, index) {
                                if (index > 0) updateId = updateId + "." + r;
                            });
                            updateId = updateId + "." + no;
                            updateClassName = updateElem.getAttribute("class");
                            newID = OA.common.Utils.dotSplitPlus(updateId, intValue);
                            hasReplace = true;
                            //} else if (
                        } else if (
                            bullettArr.length == previousArr.length &&
                            previousArr.length == updateArr.length &&
                            updateArr.length == newArr.length &&
                            updateArr.length > 1
                        ) {
                            //同層no之前ID相同no+1
                            updateId = previousID;
                            intValue = 1;
                            updateClassName = previousClassName;
                            newID = OA.common.Utils.dotSplitPlus(updateId, intValue);
                            hasReplace = true;
                        }
                    }
                }
            }

            newClsName = OA.common.Utils.toLvNumberStringPlus(
                updateClassName,
                intValue
            );
            newContent = OA.common.Utils.ChineseNumberStringPlus(
                updateClassName,
                intValue
            );
        }
        currentBullet.setAttributeNS(null, "id", newID);
        currentBullet.setAttributeNS(null, "class", newClsName);
        currentBullet.textContent = newContent;

        if (currentBullet.nextSibling) {
            var source = bulletId + "_context";
            var destination = newID + "_context";
            //var mu = this.multiFormatQuery(source);
            var mu = this.multiFormatLastQuery(source);
            //用替換的不要用update，將追蹤修訂的ID替換成新ID
            //ID會重覆.......
            if (mu && !mu.hasreplace) {
                mu.bindId = destination;
                if (hasReplace) {
                    mu.hasreplace = true;
                } else {
                    //如果是TOP層要記錄replace，不然會影響下層有同ID的TOP追修
                    if (newID.indexOf('.') == -1) mu.hasreplace = true;
                }
            }
            //if (mu) mfUpdate = { from: source, to: destination };
            currentBullet.nextSibling.setAttributeNS(null, "id", destination);
        }
        // this.doKDRichTextBlock(currentBullet);

        return mfUpdate;
    },
    updateJumpBullet: function (currentBullet, updateElem, intValue, setJump) {
        var bulletId = Ext.clone(currentBullet.getAttribute("id"));

        var newID = null,
            newClsName = null,
            newContent = null,
            updateId = "";

        var mfUpdate;

        updateId = updateElem.getAttribute("id");
        currentClassName = currentBullet.getAttribute("class");
        newID = OA.common.Utils.dotJumpSplitPlus(updateId, intValue);
        newClsName = OA.common.Utils.toLvStringPlus(currentClassName, -1);

        newContent = OA.common.Utils.ChineseNumberStringPlus(newClsName, 0);

        currentBullet.setAttributeNS(null, "id", newID);
        currentBullet.setAttributeNS(null, "class", newClsName);
        if (setJump) currentBullet.setAttributeNS(null, "isJump", "1"); //跳號註記
        currentBullet.textContent = newContent;

        if (currentBullet.nextSibling) {
            var source = bulletId + "_context";
            var destination = newID + "_context";
            //console.log(this.getMultiFormat());
            var mu = this.multiFormatLastQuery(source);
            //用替換的不要用update，將追蹤修訂的ID替換成新ID
            //ID會重覆.......
            if (mu && !mu.hasreplace) {
                mu.bindId = destination;
                mu.hasreplace = true;
            }
            //if (mu) mfUpdate = { from: source, to: destination };
            currentBullet.nextSibling.setAttributeNS(null, "id", destination);
        }
        // this.doKDRichTextBlock(currentBullet);

        return mfUpdate;
    },
    /**
     * 向上尋找項次編號
     */
    previousBullet: function (currentBullet, intValue) {
        var prevClsId = OA.common.Utils.toLvStringPlus(
            currentBullet.getAttribute("class"),
            intValue
        );
        var bb = OA.common.Utils.toLvNumber(prevClsId);

        var finding = true,
            notFound = true,
            prev = currentBullet,
            endline = false;
        do {
            prev = prev.previousSibling;
            finding = prev.getAttribute("id").indexOf("KDRichTextBlock") >= 0;
            var isIndent = prev.getAttribute("class").indexOf("indent") >= 0;
            if (isIndent) {
                //第1次出現，且計算更新停止線（同系）
                var nb = OA.common.Utils.toLvNumber(prev.getAttribute("class"));
                if (nb.lv <= bb.lv - 1 && endline == false) endline = true;

                if (nb.lv == bb.lv && !endline) {
                    finding = false;
                    notFound = false;
                }
            }
        } while (finding);

        if (notFound) prev = null;

        return prev;
    },
    /**
     * 向上尋找同一階層
     */
    previousStairs: function (currentBullet, cls) {
        var prevClsId = cls;
        var bb = OA.common.Utils.toLvNumber(prevClsId);
        var finding = true,
            notFound = true,
            prev = currentBullet,
            endline = false;
        do {
            prev = prev.previousSibling;
            finding = prev.getAttribute("id").indexOf("KDRichTextBlock") >= 0;
            var isIndent = prev.getAttribute("class").indexOf("indent") >= 0;
            if (isIndent) {
                //第1次出現，且計算更新停止線（同系）
                var nb = OA.common.Utils.toLvNumber(prev.getAttribute("class"));
                if (nb.lv <= bb.lv - 1 && endline == false) endline = true;

                if (nb.lv == bb.lv && !endline) {
                    finding = false;
                    notFound = false;
                }
            }
        } while (finding);

        if (notFound) prev = null;

        return prev;
    },
    /**
     * 更新項次編號
     */
    renameBullet: function (currentBullet, intValue) {
        var wk = OA.common.Global.getCurrentWKContent();
        intValue = intValue || 0;
        var bb = OA.common.Utils.toLvNumber(currentBullet.getAttribute("class"));
        var next = currentBullet,
            endline = false,
            mfs = [],
            pdlineend = false;
        do {
            next = next.nextSibling;
            if (!next) break;

            if (next.tagName == "text") {
                var nextID = next.getAttribute("id");
                var nextCLS = next.getAttribute("class");

                var isParagraph = nextID.indexOf("KDRichTextBlock_") >= 0;
                if (isParagraph) endline = true;

                var isIndent = nextCLS.indexOf("indent") >= 0;
                if (isIndent) {
                    //第1次出現，且計算更新停止線（同系）
                    var nb = OA.common.Utils.toLvNumber(nextCLS);
                    // console.log(bb);
                    // console.log(nb);
                    if (nb.lv <= bb.lv - 1 && endline == false) endline = true;
                    if (nb.lv == bb.lv && !endline) {
                        var newID = OA.common.Utils.dotSplitPlus(nextID, intValue);

                        next.setAttributeNS(null, 'id', newID);
                        var newClsName = OA.common.Utils.toLvNumberStringPlus(nextCLS, intValue);
                        next.setAttributeNS(null, 'class', newClsName);
                        if (wk.DocumentType === '受文者令' || wk.DocumentType === '會銜令' ||
                            wk.DocumentType === '會銜受文者令' || wk.DocumentType === '箋函') {//可換行，不可分段
                            next.textContent = '';
                        } else {
                            //簡簽第一跟第三段，可換行不分段，不要段名
                            var isEasyEmpty = false;
                            /*
                            if (wk.DocumentType == '簡簽' || wk.DocumentType == '令') {
                                //判斷是否為第一或第二段
                                var wrap2Id = next.id;
                                if (wrap2Id.indexOf('-') != -1) {
                                    var wrap2Arr = wrap2Id.split('-');
                                    var checkId = wrap2Arr[1];

                                    if (checkId.length >= 4) {
                                        //判斷是否為第第三段
                                        var firstWord = checkId.substring(0, 1);
                                        if (firstWord == '2') {
                                            isEasyEmpty = true;
                                        }
                                    } else {
                                        //小於4碼階為第一段
                                        isEasyEmpty = true;
                                    }
                                }
                            }*/

                            if (isEasyEmpty) {
                                next.textContent = '';
                            } else {
                                next.textContent = OA.common.Utils.ChineseNumberStringPlus(nextCLS, intValue);
                            }
                        }
                        var nextContent = next.nextSibling;
                        if (nextContent) {
                            var source = nextID + "_context";
                            var destination = newID + "_context";
                            //var mu = this.multiFormatQuery(source);
                            //if (mu) mfs.push({ from: source, to: destination });
                            var mu = this.multiFormatLastQuery(source);
                            //用替換的不要用update，將追蹤修訂的ID替換成新ID
                            //ID會重覆.......
                            if (mu && !mu.hasreplace) {
                                mu.bindId = destination;
                                mu.hasreplace = true;
                            }
                            nextContent.setAttributeNS(null, "id", destination);
                        }
                    } else if (intValue == -1) {
                        //檢核刪行後是否跳號了
                        var previous = currentBullet.previousSibling;
                        do {
                            previous = previous.previousSibling;
                            if (!previous) break;
                            if (previous.tagName == "text") {
                                var previousID = previous.getAttribute("id");
                                var previousCLS = previous.getAttribute("class");
                                var ispdParagraph = previousID.indexOf("KDRichTextBlock_") >= 0;
                                if (ispdParagraph) pdlineend = true;
                                var ispdIndent = previousCLS.indexOf("indent") >= 0;
                                if (ispdIndent) {
                                    var pb = OA.common.Utils.toLvNumber(previousCLS);
                                    //上下同層且下層大於下層no只有1，表示有接續，停止更新
                                    if (
                                        bb.lv == pb.lv &&
                                        bb.no > pb.no &&
                                        bb.no - pb.no == 1 &&
                                        pdlineend == false
                                    ) {
                                        pdlineend = true;
                                    }
                                    //pb跟nb的lv為同層，且上層大於下層lv
                                    if (pb.lv == nb.lv && pb.lv > bb.lv) {
                                        //要補判斷no有無接續(上層大於下層no)or(下層減上層no大於1)皆為跳號
                                        if ((pb.no > nb.no || nb.no - pb.no > 1) && !pdlineend) {
                                            //取上層的no，重新編碼下層no
                                            var newID = OA.common.Utils.dotSplitPlus(previousID, 1);

                                            next.setAttributeNS(null, 'id', newID);
                                            var newClsName = OA.common.Utils.toLvNumberStringPlus(previousCLS, 1);
                                            next.setAttributeNS(null, 'class', newClsName);
                                            if (wk.DocumentType === '受文者令' || wk.DocumentType === '會銜令' ||
                                                wk.DocumentType === '會銜受文者令' || wk.DocumentType === '箋函') {//可換行，不可分段
                                                next.textContent = '';
                                            } else {
                                                //簡簽第一跟第三段，可換行不分段，不要段名
                                                var isEasyEmpty = false;
                                                /*
                                                if (wk.DocumentType == '簡簽' || wk.DocumentType == '令' ) {
                                                    //判斷是否為第一或第二段
                                                    var wrap2Id = next.id;
                                                    if (wrap2Id.indexOf('-') != -1) {
                                                        var wrap2Arr = wrap2Id.split('-');
                                                        var checkId = wrap2Arr[1];

                                                        if (checkId.length >= 4) {
                                                            //判斷是否為第第三段
                                                            var firstWord = checkId.substring(0, 1);
                                                            if (firstWord == '2') {
                                                                isEasyEmpty = true;
                                                            }
                                                        } else {
                                                            //小於4碼階為第一段
                                                            isEasyEmpty = true;
                                                        }
                                                    }
                                                }*/

                                                if (isEasyEmpty) {
                                                    next.textContent = '';
                                                } else {
                                                    next.textContent = OA.common.Utils.ChineseNumberStringPlus(
                                                        previousCLS,
                                                        1
                                                    );
                                                }
                                            }
                                            var nextContent = next.nextSibling;
                                            if (nextContent) {
                                                var source = previousID + "_context";
                                                var destination = newID + "_context";
                                                var mu = this.multiFormatLastQuery(source);
                                                //用替換的不要用update，將追蹤修訂的ID替換成新ID
                                                //ID會重覆.......
                                                if (mu && !mu.hasreplace) {
                                                    mu.bindId = destination;
                                                    mu.hasreplace = true;
                                                }
                                                //var mu = this.multiFormatQuery(source);
                                                //if (mu) mfs.push({ from: source, to: destination });
                                                nextContent.setAttributeNS(null, "id", destination);
                                                var me = this;
                                                var pnfs = me.renamejumpNoBullet(
                                                    next,
                                                    1,
                                                    newID,
                                                    newClsName
                                                );
                                                if (pnfs) mfs.push(pnfs);
                                                pdlineend = true;
                                            }
                                        }
                                    }
                                }
                            }
                        } while (!pdlineend);
                    }
                }
            }
        } while (!endline);
        return mfs;
    },
    /**
     * 更新以下項次編號
     */
    renameFollowingBullet: function (toBullet, fromBullet, intValue) {
        var me = this;
        var fb = OA.common.Utils.toLvNumber(fromBullet.getAttribute("class"));
        var bb = OA.common.Utils.toLvNumber(toBullet.getAttribute("class"));
        var next = toBullet,
            fbEndLine = false,
            bbEndLine = false;

        var mfs = [];
        do {
            next = next.nextSibling;
            var nextCLS = next.getAttribute("class");
            var isJump = next.getAttribute("isJump");
            var isIndent = nextCLS.indexOf("indent") >= 0;
            if (isIndent) {
                var nb = OA.common.Utils.toLvNumber(nextCLS);
                //第1次出現，且計算更新停止線(子系）
                if (nb.lv <= fb.lv - 1 && fbEndLine == false) fbEndLine = true;
                //第1次出現，且計算更新停止線（同系）
                if (nb.lv <= bb.lv - 1 && bbEndLine == false) bbEndLine = true;
                //起始層
                if (nb.lv == fb.lv && !fbEndLine && !isJump) {
                    //console.log(nb.no);
                    //console.log(fb.no);
                    //console.log(bb.no);
                    //console.log(fv);
                    var fv = nb.no - fb.no - 1;
                    if (intValue < 0) fv = nb.no - fb.no - fb.no;

                    //console.log(nextCLS);
                    //console.log(nb.no);
                    //console.log(fb.no);
                    //console.log(fv);
                    var mfStart = me.updateBullet(next, fromBullet, fv);
                    if (mfStart) mfs.push(mfStart);
                }

                //目的層
                if (nb.lv == bb.lv && !bbEndLine && !isJump) {
                    //console.log(nb.no);
                    //console.log(fb.no);
                    //console.log(bb.no);
                    var bv = nb.no;
                    if (intValue < 0) bv = nb.no - bb.no + 1;
                    var mfEnd = me.updateBullet(next, toBullet, bv);
                    if (mfEnd) mfs.push(mfEnd);
                }

                //檢查跟上一層是否跨行了
                if (next.previousSibling && next.previousSibling.previousSibling) {
                    var previous = next.previousSibling.previousSibling;
                    if (previous.getAttribute("id").indexOf("KDRichTextBlock") >= 0) {
                        var previousCLS = previous.getAttribute("class");

                        var isIndentP = previousCLS.indexOf("indent") >= 0;
                        if (isIndentP) {
                            var pb = OA.common.Utils.toLvNumber(previousCLS);
                            if (nb.lv - 1 > pb.lv) {
                                //編碼要往上一層
                                var mfP = me.updateJumpBullet(next, previous, nb.no, false);
                                if (mfP) mfs.push(mfP);

                                //判斷下一行是否為同層
                                var storey = next.nextSibling;
                                do {
                                    var isEnd =
                                        storey.getAttribute("id").indexOf("KDRichTextBlock") >= 0;
                                    if (isEnd) {
                                        var storeyCLS = storey.getAttribute("class");
                                        var isIndentS = storeyCLS.indexOf("indent") >= 0;
                                        if (isIndentS) {
                                            var sb = OA.common.Utils.toLvNumber(storeyCLS);
                                            if (sb.lv == nb.lv) {
                                                var mfS = me.updateJumpBullet(
                                                    storey,
                                                    previous,
                                                    sb.no,
                                                    true
                                                );
                                                if (mfS) mfs.push(mfS);
                                            } else {
                                                isEnd = false;
                                            }
                                        }
                                    }
                                    storey = storey.nextSibling;
                                } while (isEnd);
                            } else if (nb.lv - 1 == pb.lv) {    //下層為子層，補判斷ID是否一致
                                var nextID = next.getAttribute("id");
                                var previousID = previous.getAttribute("id");
                                var nextArr = nextID.split('.');
                                var previousArr = previousID.split('.');
                                if (nextArr[0] !== previousArr[0] && nextArr.length > 1) {//子層才檢核
                                    console.log('子母層ID不一致！');
                                    console.log(previousArr[0]);
                                    console.log(nextArr[0]);
                                    //替換子層ID
                                    var no = nextArr[nextArr.length - 1];
                                    var newID = previousArr[0];
                                    Ext.Array.each(previousArr, function (r, index) {
                                        if (index > 0) newID = newID + '.' + r;
                                    });
                                    newID = newID + '.' + no;
                                    console.log('修正後ID');
                                    console.log(newID);
                                    next.setAttributeNS(null, "id", newID);
                                    var nextContent = next.nextSibling;
                                    if (nextContent) {
                                        var source = nextID + "_context";
                                        var destination = newID + "_context";
                                        var mu = this.multiFormatLastQuery(source);
                                        //用替換的不要用update，將追蹤修訂的ID替換成新ID
                                        //ID會重覆.......
                                        if (mu && !mu.hasreplace) {
                                            mu.bindId = destination;
                                            mu.hasreplace = true;
                                        }
                                        //var mu = this.multiFormatQuery(source);
                                        //if (mu) mfs.push({ from: source, to: destination });
                                        nextContent.setAttributeNS(null, "id", destination);
                                    }
                                }
                            }
                        }
                    }
                }

                //if (fbEndLine){
                //    console.log(nextCLS + ' ' +next.textContent);
                //}else{
                //    console.log(nextCLS + ' ' +next.textContent + ' <');
                //}

                //if (bbEndLine){
                //    console.log(nextCLS + ' ' +next.textContent);
                //}else{
                //    console.log(nextCLS + ' ' +next.textContent + ' <');
                //}
            }
            if (isJump) next.removeAttribute("isJump");
            var isKDRichTextBlock =
                next.getAttribute("id").indexOf("KDRichTextBlock") >= 0;
        } while (isKDRichTextBlock);

        return mfs;
    },
    /**
     * 正規條例ID
     */
    correctnessKDRichID: function (currentBullet) {
        //檢查唯一性及跳號
        var wk = OA.common.Global.getCurrentWKContent();
        var check = currentBullet,
            idList = [],
            mfs = [];

        do {
            var checkCLS = check.getAttribute("class");
            if(!checkCLS.indexOf("indent")) break;
            var isIndent = checkCLS.indexOf("indent") >= 0;
            var checkID = check.getAttribute("id");
            if (isIndent) {
                if (idList.indexOf(checkID) == -1) {
                    if (check.getAttribute("id").indexOf("KDRichTextBlock") >= 0) {
                        //判斷是否為子層
                        var nextID = check.getAttribute("id");
                        if (nextID.indexOf(".") >= 0) {
                            //取上層ID判斷ID是否同階
                            if (
                                check.previousSibling &&
                                check.previousSibling.previousSibling
                            ) {
                                var previous1 = check.previousSibling.previousSibling;
                                if (
                                    previous1.getAttribute("id").indexOf("KDRichTextBlock") >= 0
                                ) {
                                    var previous1ID = previous1.getAttribute("id");
                                    var nextArr = nextID.split(".");
                                    var previous1Arr = previous1ID.split(".");
                                    if (nextArr[0] !== previous1Arr[0]) {
                                        console.log("跳號！");
                                        console.log(nextID);
                                        console.log("上層ID");
                                        console.log(previous1ID);
                                        var newID = previous1Arr[0];
                                        var no = nextArr[nextArr.length - 1];
                                        if (
                                            nextArr.length !== previous1Arr.length &&
                                            nextArr.length > previous1Arr.length
                                        ) {
                                            //上下不同層，下層階層較多
                                            Ext.Array.each(previous1Arr, function (item, index) {
                                                if (index > 0) newID = newID + "." + item;
                                            });
                                            newID = newID + "." + no;
                                        } else if (
                                            nextArr.length !== previous1Arr.length &&
                                            previous1Arr.length > nextArr.length
                                        ) {
                                            //上下不同層，上層階層較多
                                            Ext.Array.each(nextArr, function (item, index) {
                                                if (index > 0) newID = newID + "." + item;
                                            });
                                        } else {
                                            Ext.Array.each(previous1Arr, function (item, index) {
                                                //上下同層
                                                if (index > 0 && index != previous1Arr.length - 1)
                                                    newID = newID + "." + item;
                                            });
                                            newID = newID + "." + no;
                                        }

                                        //檢查新ID是否有重覆
                                        if (idList.indexOf(newID) !== -1) {
                                            console.log("跳號後修正重複ID！");
                                            console.log(newID);
                                            var previous = check.previousSibling.previousSibling;
                                            if (previous.getAttribute("id").indexOf("KDRichTextBlock") >= 0) {
                                                var previousID = previous.getAttribute("id");
                                                var checkArr = newID.split(".");
                                                var previousArr = previousID.split(".");
                                                console.log("上層ID");
                                                console.log(previousArr[0]);
                                                if (checkArr[0] !== previousArr[0]) {
                                                    //子母層ID不一致
                                                    newID = previousArr[0];
                                                    Ext.Array.each(checkArr, function (item, index) {
                                                        if (index > 0) newID = newID + "." + item;
                                                    });
                                                } else if (checkArr.length == previousArr.length) {
                                                    //同層上下層no要為接續
                                                    newID = OA.common.Utils.dotSplitPlus(previousID, 1); //要接續跳號後的ID
                                                    var pnextCLS2 = previous.getAttribute("class");
                                                    var newClsName2 = OA.common.Utils.toLvNumberStringPlus(
                                                        pnextCLS2,
                                                        1
                                                    );
                                                    check.textContent = OA.common.Utils.ChineseNumberStringPlus(
                                                        pnextCLS2,
                                                        1
                                                    ); //要接續跳號後的CLS
                                                    check.setAttributeNS(null, "class", newClsName2);
                                                } else if (previousArr.length > checkArr.length) {
                                                    //上層階層大於下層
                                                    //重複ID直接+1
                                                    newID = OA.common.Utils.dotSplitPlus(newID, 1); //要接續跳號後的ID
                                                    var pnextCLS3 = check.getAttribute("class");
                                                    var newClsName3 = OA.common.Utils.toLvNumberStringPlus(
                                                        pnextCLS3,
                                                        1
                                                    );
                                                    check.textContent = OA.common.Utils.ChineseNumberStringPlus(
                                                        pnextCLS3,
                                                        1
                                                    ); //要接續跳號後的CLS
                                                    check.setAttributeNS(null, "class", newClsName3);
                                                }
                                            }
                                        }

                                        console.log("修正後ID");
                                        console.log(newID);
                                        check.setAttributeNS(null, "id", newID);
                                        var nextContent = check.nextSibling;
                                        if (nextContent) {
                                            var source = nextID + "_context";
                                            var destination = newID + "_context";
                                            var mu = this.multiFormatLastQuery(source);
                                            //用替換的不要用update，將追蹤修訂的ID替換成新ID
                                            //ID會重覆.......
                                            if (mu && !mu.hasreplace) {
                                                mu.bindId = destination;
                                                mu.hasreplace = true;
                                            }
                                            //var mu = this.multiFormatQuery(source);
                                            //if (mu) mfs.push({ from: source, to: destination });
                                            nextContent.setAttributeNS(null, "id", destination);
                                        }
                                        idList.push(newID);
                                    } else {
                                        idList.push(nextID);
                                    }
                                }
                            }
                        } else {
                            idList.push(nextID);
                        }
                    }
                } else {
                    //ID重複
                    //先判斷是母層或子層，子層有.
                    //如果是母層要延續上母層的排序
                    //子層則抓上層的ID替換
                    console.log("重複ID！");
                    console.log(checkID);
                    if (checkID.indexOf(".") >= 0) {
                        if (
                            check.previousSibling &&
                            check.previousSibling.previousSibling
                        ) {
                            var previous = check.previousSibling.previousSibling;
                            if (previous.getAttribute("id").indexOf("KDRichTextBlock") >= 0) {
                                var previousID = previous.getAttribute("id");
                                var checkArr = checkID.split(".");
                                var previousArr = previousID.split(".");
                                console.log("上層ID");
                                console.log(previousArr[0]);
                                if (checkArr[0] !== previousArr[0]) {
                                    //子母層ID不一致
                                    var newID1 = previousArr[0];

                                    Ext.Array.each(checkArr, function (item, index) {
                                        if (index > 0) newID1 = newID1 + "." + item;
                                    });

                                    console.log("修正後ID");
                                    console.log(newID1);
                                    check.setAttributeNS(null, "id", newID1);
                                    var nextContent1 = check.nextSibling;
                                    if (nextContent1) {
                                        var source1 = checkID + "_context";
                                        var destination1 = newID1 + "_context";
                                        var mu = this.multiFormatLastQuery(source1);
                                        //用替換的不要用update，將追蹤修訂的ID替換成新ID
                                        //ID會重覆.......
                                        if (mu && !mu.hasreplace) {
                                            mu.bindId = destination1;
                                            mu.hasreplace = true;
                                        }
                                        //var mu = this.multiFormatQuery(source1);
                                        //if (mu) mfs.push({ from: source1, to: destination1 });
                                        nextContent1.setAttributeNS(null, "id", destination1);
                                    }
                                    idList.push(newID1);
                                } else if (checkArr.length == previousArr.length) {
                                    //同層上下層no要為接續

                                    var newID2 = OA.common.Utils.dotSplitPlus(previousID, 1); //要接續跳號後的ID
                                    var pnextCLS = previous.getAttribute("class");
                                    check.setAttributeNS(null, "id", newID2);
                                    var newClsName = OA.common.Utils.toLvNumberStringPlus(
                                        pnextCLS,
                                        1
                                    );

                                    check.textContent = OA.common.Utils.ChineseNumberStringPlus(
                                        pnextCLS,
                                        1
                                    ); //要接續跳號後的CLS

                                    console.log("修正後ID");
                                    console.log(newID2);
                                    check.setAttributeNS(null, "class", newClsName);

                                    var nextContent2 = check.nextSibling;
                                    if (nextContent2) {
                                        var source2 = checkID + "_context";
                                        var destination2 = newID2 + "_context";
                                        var mu = this.multiFormatLastQuery(source2);
                                        //用替換的不要用update，將追蹤修訂的ID替換成新ID
                                        //ID會重覆.......
                                        if (mu && !mu.hasreplace) {
                                            mu.bindId = destination2;
                                            mu.hasreplace = true;
                                        }
                                        //var mu = this.multiFormatQuery(source2);
                                        //if (mu) mfs.push({ from: source2, to: destination2 });
                                        nextContent2.setAttributeNS(null, "id", destination2);
                                    }
                                    idList.push(newID2);
                                } else if (previousArr.length > checkArr.length) {
                                    //上層階層大於下層
                                    //重複ID直接+1
                                    var newID3 = OA.common.Utils.dotSplitPlus(checkID, 1);
                                    var index = 1;
                                    if (idList.indexOf(newID3) !== -1) {
                                        do {
                                            index++;
                                            var hasId = Ext.clone(newID3);
                                            newID3 = OA.common.Utils.dotSplitPlus(hasId, 1);
                                        } while (idList.indexOf(newID3) !== -1)
                                    }
                                    console.log(newID3);
                                    //要接續跳號後的ID
                                    var pnextCLS1 = check.getAttribute("class");
                                    check.setAttributeNS(null, "id", newID3);
                                    var newClsName1 = OA.common.Utils.toLvNumberStringPlus(
                                        pnextCLS1,
                                        index
                                    );

                                    check.textContent = OA.common.Utils.ChineseNumberStringPlus(
                                        pnextCLS1,
                                        index
                                    ); //要接續跳號後的CLS

                                    console.log("修正後ID");
                                    console.log(newID3);
                                    check.setAttributeNS(null, "class", newClsName1);

                                    var nextContent3 = check.nextSibling;
                                    if (nextContent3) {
                                        var source3 = checkID + "_context";
                                        var destination3 = newID3 + "_context";
                                        var mu = this.multiFormatLastQuery(source3);
                                        //用替換的不要用update，將追蹤修訂的ID替換成新ID
                                        //ID會重覆.......
                                        if (mu && !mu.hasreplace) {
                                            mu.bindId = destination3;
                                            mu.hasreplace = true;
                                        }
                                        //var mu = this.multiFormatQuery(source3);
                                        //if (mu) mfs.push({ from: source3, to: destination3 });
                                        nextContent3.setAttributeNS(null, "id", destination3);
                                    }
                                    idList.push(newID3);
                                }
                            }
                        }
                    }
                }
            }

            var isKDRichTextBlock =
                check.getAttribute("id").indexOf("KDRichTextBlock") >= 0;

            check = check.nextSibling;
        } while (isKDRichTextBlock);

        //console.log(idList);
        return mfs;
    },
    /**
     * 更新跳號以下項次編號
     */
    renamejumpNoBullet: function (currentBullet, intValue, pnextID, pnextCLS) {
        var wk = OA.common.Global.getCurrentWKContent();
        intValue = intValue || 0;
        var bb = OA.common.Utils.toLvNumber(currentBullet.getAttribute("class"));
        var next = currentBullet,
            endline = false,
            mfs = [];
        do {
            next = next.nextSibling;
            if (!next) break;

            if (next.tagName == "text") {
                var nextID = next.getAttribute("id");
                var nextCLS = next.getAttribute("class");

                var isParagraph = nextID.indexOf("KDRichTextBlock_") >= 0;
                if (isParagraph) endline = true;

                var isIndent = nextCLS.indexOf("indent") >= 0;
                if (isIndent) {
                    //第1次出現，且計算更新停止線（同系）
                    var nb = OA.common.Utils.toLvNumber(nextCLS);
                    if (nb.lv <= bb.lv - 1 && endline == false) endline = true;
                    if (nb.lv == bb.lv && !endline) {
                        var newID = OA.common.Utils.dotSplitPlus(pnextID, intValue);//要接續跳號後的ID
                        next.setAttributeNS(null, 'id', newID);
                        var newClsName = OA.common.Utils.toLvNumberStringPlus(pnextCLS, intValue);//要接續跳號後的CLS
                        next.setAttributeNS(null, 'class', newClsName);
                        if (wk.DocumentType === '受文者令' || wk.DocumentType === '會銜令' ||
                            wk.DocumentType === '會銜受文者令' || wk.DocumentType === '箋函') {
                            //可換行，不可分段
                            next.textContent = '';
                        } else {
                            //簡簽第一跟第三段，可換行不分段
                            var isEasyEmpty = false;
                            /*
                            if (wk.DocumentType == '簡簽' || wk.DocumentType == '令' ) {
                                //判斷是否為第一或第二段
                                var wrap2Id = next.id;
                                if (wrap2Id.indexOf('-') != -1) {
                                    var wrap2Arr = wrap2Id.split('-');
                                    var checkId = wrap2Arr[1];

                                    if (checkId.length >= 4) {
                                        //判斷是否為第第三段
                                        var firstWord = checkId.substring(0, 1);
                                        if (firstWord == '2') {
                                            isEasyEmpty = true;
                                        }
                                    } else {
                                        //小於4碼階為第一段
                                        isEasyEmpty = true;
                                    }
                                }
                            }*/

                            if (isEasyEmpty) {
                                next.textContent = '';
                            } else {
                                next.textContent = OA.common.Utils.ChineseNumberStringPlus(pnextCLS, intValue); //要接續跳號後的CLS
                            }
                        }
                        var nextContent = next.nextSibling;
                        if (nextContent) {
                            var source = nextID + "_context";
                            var destination = newID + "_context";
                            var mu = this.multiFormatLastQuery(source);
                            //用替換的不要用update，將追蹤修訂的ID替換成新ID
                            //ID會重覆.......
                            if (mu && !mu.hasreplace) {
                                mu.bindId = destination;
                                mu.hasreplace = true;
                            }
                            //var mu = this.multiFormatQuery(source);
                            //if (mu) mfs.push({ from: source, to: destination });
                            nextContent.setAttributeNS(null, "id", destination);
                        }
                    }
                }
            }
        } while (!endline);
        return mfs;
    },
    /**
     * 編輯時合併樣式
     */
    mergeMultiFormat: function (selectedElement, values) {
        var qs = OA.common.Global.getQ();
        var me = this;
        var action = values.action;
        var oldValue = values.oldValue;
        var newValue = values.newValue;
        var applyStyles = values.applyStyles;
        var wk = OA.common.Global.getCurrentWKContent();
        var p = OA.common.Global.getInitParas();
        var isRole15 = false;
        if (p.subRoleId == '15' && p.subEmpName) isRole15 = true;

        var input = $("#text")[0];
        if (values.input) input = values.input;

        var len = 0;
        var selStart = 0;
        var selEnd = input.selectionEnd;
        var style = {
            action: action,
            //lastUpdateTime: OA.common.Utils.getChineseDate(),
            lastUpdateTime: OA.common.Utils.getOldEditChineseDate(),
            name: padLeft(OA.common.Utils.getRandom(0, 9999999999), 10),
            userId: p.empNo,
            userName: isRole15 ? p.subEmpName : p.empName,
            version: OA.common.VIMgr.getCurrentEdition().版號
        };

        if (action == 'InsertText') {
            // 2022.12.26 非即時追修狀態不記錄 lien.chiu
            if (qs.app != 'async') return;
            len = newValue.length - oldValue.length;
            selStart = input.selectionEnd - len;
            applyStyles = { items: [style] };
        } else if (action == 'StrikeText') {
            // 2022.12.26 非即時追修狀態不記錄 lien.chiu
            if (qs.app != 'async') return;
            selStart = input.selectionStart;
            applyStyles = { items: [style] };
        } else if (action == 'Highlight') {
            selStart = input.selectionStart;
            style.brush = values.brush;
            style.penSpecies = values.penSpecies;
            applyStyles = { items: [style] };
        } else {
            selStart = input.selectionStart;
            applyStyles = {} || applyStyles;
            Ext.apply(applyStyles, values);
        }
        if (selStart == selEnd) {
            selEnd = selStart;
            selStart = selStart - 1;
        }

        if (selStart < 0) selStart = 0;

        var selValue = input.value.substring(selStart, selEnd);
        var selItem = {
            styles: { start: selStart, end: selEnd, data: selValue },
            text: selValue
        };
        Ext.apply(selItem.styles, applyStyles);

        var isStyleNone = style.brush == 'none';
        var id = selectedElement.getAttribute("id");
        var mu = me.multiFormatQuery(id);
        if (mu == null) {
            mu = {
                bindId: id,
                multiFormat: OA.common.Utils.getLumps(selectedElement.textContent, [selItem.styles])
            };
            if (!isStyleNone) me.getMultiFormat().push(mu);
            return mu;
        }
        if (mu.multiFormat.length == 0) {
            if (!isStyleNone) mu.multiFormat = OA.common.Utils.getLumps(selectedElement.textContent, [selItem.styles]);
            return mu;
        }
        if (action == 'InsertText') {
            selItem.newValue = newValue;
            selItem.oldValue = oldValue;
            mu.multiFormat = me.getInsertMF(mu.multiFormat, selItem);
        } else { //action=='StrikeText' || fontWeight: 'Bold' || underline: 'Underline' || baselineShift
            mu.multiFormat = me.getSelectionMF(mu.multiFormat, selItem);
        }
        //on texteditChanged raise typsetting

        // if (mu.multiFormat.length==0)  Ext.Array.remove(me.getMultiFormat(), mu);
        return mu;
    },
    getInsertMF: function (multiFormat, selItem) {
        var me = this;
        var newItem = Ext.clone(selItem);

        // console.log(Ext.clone(multiFormat));
        // console.log(Ext.clone(selItem));

        var selStart = newItem.styles.start;
        var selEnd = newItem.styles.end;
        var newValue = newItem.newValue;
        var oldValue = newItem.oldValue;
        var len = newValue.length - oldValue.length;

        var _start = 0, _end = 0, addValue = 0, items = [];
        Ext.Array.each(multiFormat, function (item) {
            // console.log(Ext.clone(item));
            _start = (item.styles) ? item.styles.start : _end;
            _end = (item.styles) ? item.styles.end : _start + item.text.length;
            // console.log('----------' + _start + ' ~ ' + _end + ' : ' + item.text);
            if (selStart > _start && selStart <= _end) {
                addValue = len;
                var selValue = newValue.substring(_start, _end + len);

                if (!me.getIsClearPaper()) {
                    var item1 = Ext.clone(item);
                    item1.text = item1.text.substring(0, selStart - _start);
                    if (item1.styles) {
                        item1.styles.end = selStart;
                        item1.styles.data = item1.text;
                    }
                    if (item1.text) {
                        items.push(item1);
                    }
                    items.push(newItem);
                    item.text = item.text.substring(selEnd - _start - addValue);
                    if (item.styles) {
                        // item.styles.start = _end - item.text.length;
                        item.styles.start = _end - item.text.length + addValue;
                        item.styles.data = item.text;
                        //and last to push
                    }
                } else {
                    item.text = selValue;
                    if (item.styles) item.styles.data = selValue;
                }

            } else {
                if (selStart == 0 && _start == 0) {
                    items.push(newItem);
                    addValue = len;
                }

                if (item.styles) {
                    item.styles.start = _start + addValue;
                }
            }

            if (item.styles) {
                item.styles.end = _end + addValue;
            }

            if (item.text) {
                items.push(item);
            }
        });

        // console.log(items);
        return items;
    },
    getSelectionMF: function (multiFormat, selItem) {
        var me = this;

        selItem = Ext.clone(selItem);
        var selStart = selItem.styles.start;
        var selEnd = selItem.styles.end;

        // console.log('selStart: ' + selStart + ' selEnd: ' + selEnd);
        // console.table(multiFormat);
        // console.log('----------START-----------------');
        var _start = 0, _end = 0, items = [], tmpItem = null, addValue = 0;
        var theSameVersion = true;
        Ext.Array.each(multiFormat, function (item) {
            _start = (item.styles) ? item.styles.start : _end;
            _end = (item.styles) ? item.styles.end : _start + item.text.length;
            // console.log(_start + ' ~ ' + _end + ' : ' + item.text);
            // console.log(Ext.clone(item));
            if (_end <= selStart) {
                items.push(item);
            } else {

                if (tmpItem == null) {
                    var item1 = Ext.clone(item);
                    item1.text = (item1.text + '').substring(0, selStart - _start);
                    if (item1.styles) {
                        item1.styles.end = selStart;
                        item1.styles.data = item1.text;
                    }
                    if (item1.text) {
                        items.push(item1);
                    }
                }
                if (_end <= selEnd) {
                    tmpItem = selItem;
                    theSameVersion = true;
                    if (_start < selEnd) {
                        if (selItem.styles.items) {
                            var update = selItem.styles.items[0];
                            if (item.styles) {
                                Ext.Array.each(item.styles.items, function (it) {
                                    if (it.action == 'InsertText' && update.action == 'StrikeText' &&
                                        it.version == update.version) {
                                        theSameVersion = false;
                                    }
                                });
                            }
                        }
                        tmpItem = me.switchStyles(item, tmpItem);
                    }
                } else {
                    var item2;

                    //這裡會影響已有追修，造正定位算錯 , 但說明描述必需要跑這段
                    // addValue = 0;

                    if (tmpItem == null) {
                        if (_start < selEnd) {
                            theSameVersion = true;
                            if (item.styles) {
                                if (selItem.styles.items !== undefined) update = selItem.styles.items[0];
                                Ext.Array.each(item.styles.items, function (it) {
                                    if (it.action == 'InsertText' && update.action == 'StrikeText' &&
                                        it.version == update.version) {
                                        theSameVersion = false;
                                        addValue = -(selItem.text.length);
                                        selItem.text = '';
                                    }
                                });
                                selItem.styles = undefined;
                                var isNone = selItem.styles && selItem.styles.items[0].brush == 'none';
                                if (isNone) selItem.styles.items = [];
                            }
                            if (theSameVersion) items.push(selItem);
                        }
                    } else {
                        if (theSameVersion) {
                            items.push(tmpItem);
                        } else {
                            addValue = -(tmpItem.text.length);
                        }
                    }

                    item2 = Ext.clone(item);
                    var item2Start = 0;
                    if (_start < selEnd) {
                        item2Start = selEnd - _start;
                        item2.text = (item2.text + '').substring(item2Start, _end - _start);
                    } else {


                        // if (selItem.styles && selItem.styles.items[0]){
                        //     console.log(selItem);
                        // }
                        // if (selItem.text) addValue = -(selItem.text.length);

                    }
                    if (item2.styles) {
                        item2.styles.start = _end - (item2.text + '').length + addValue;
                        item2.styles.end = _end + addValue;
                        item2.styles.data = item2.text;
                    }

                    items.push(item2);

                    tmpItem = null;
                }
            }
        });
        if (tmpItem != null) {
            if (theSameVersion) {
                items.push(tmpItem);
            }
        }

        // console.log('-------------END------------------');
        //
        // console.table(items);
        // console.log(items);
        // console.log('-------------END------------------');
        // console.log(' ');

        return items;
    },
    switchStyles: function (currentItem, updateItem) {
        if (!currentItem.styles) return updateItem;
        if (currentItem.styles.fontWeight == 'Bold') updateItem.styles.fontWeight = undefined;
        if (currentItem.styles.fontStyle == 'Italic') updateItem.styles.fontStyle = undefined;
        if (currentItem.styles.underline == 'Underline') updateItem.styles.underline = undefined;
        if (currentItem.styles.baselineShift == 'Underline') updateItem.styles.baselineShift = undefined;
        if (currentItem.styles.baselineShift == 'super') updateItem.styles.baselineShift = undefined;    //1005 轉換上標後回復原本字體樣式 上標   Chloe.sia
        if (currentItem.styles.baselineShift == 'sub') updateItem.styles.baselineShift = undefined;      //1005 轉換下標後回復原本字體樣式 下標   Chloe.sia

        // console.log(Ext.clone(currentItem));

        if (updateItem.styles.items) {
            var cur;
            if (currentItem.styles && currentItem.styles.items) cur = currentItem.styles.items[0];
            var action, version;
            if (cur) {
                action = cur.action;
                version = cur.version;
            } else {
                return updateItem;
            }
            Ext.Array.each(updateItem.styles.items, function (it) {
                // console.log(action);
                // console.log(it.action);
                // console.log(it.version);
                // console.log(it);
                // console.log(it.brush=='none');
                if (it.action == action && it.version == version || it.brush == 'none') {
                    Ext.Array.remove(updateItem.styles.items, it);
                } else if (action == 'StrikeText' && it.action == 'StrikeText') {
                    Ext.Array.remove(updateItem.styles.items, it);
                }
            });
        }
        // console.log(Ext.clone(updateItem));
        return updateItem;
    },
    mfSplit: function (id, plusId, posStart, posEnd, posBreak) {
        var me = this;
        var m = me.multiFormatQuery(id);
        if (!m) return;
        if (posEnd == posBreak) return;   //行最後Enter 不用處理

        var selItemFront = { styles: { start: posStart, end: posEnd, items: [{ action: 'split' }] } };
        var selItemBack = { styles: { start: 0, end: posStart, items: [{ action: 'split' }] } };
        var mfFront = me.getSelectionMF(m.multiFormat, selItemFront);
        var mfBack = me.getSelectionMF(m.multiFormat, selItemBack);
        var mfFrontNew = Ext.Array.clone(mfFront).splice(0, mfFront.length - 1);
        var mfBackNew = Ext.Array.clone(mfBack);
        if (posBreak != 0) mfBackNew = Ext.Array.clone(mfBack).splice(1);

        var _start = 0, _end = 0;
        Ext.Array.each(mfBackNew, function (item) {
            _start = (item.styles) ? item.styles.start - posBreak : _end;
            _end = (item.styles) ? item.styles.end - posBreak : _start + item.text.length;
            if (item.styles) {
                item.styles.start = _start;
                item.styles.end = _end;
            }
        });
        var idx = me.getMultiFormat().map(function (x) {
            return x.bindId;
        }).indexOf(id);
        Ext.Array.insert(me.getMultiFormat(), idx + 1, [{
            bindId: plusId,
            multiFormat: mfBackNew
        }]);

        m.multiFormat = mfFrontNew;
    },
    mfMerge: function (pid, cid, pos, pContent) {
        var me = this;
        var pmf = me.multiFormatQuery(pid);
        var cmf = me.multiFormatQuery(cid);

        if (!cmf) return;

        if (cmf.hasreplace) {
            //檢查有沒有兩筆以上
            var muti = this.getMultiFormat();
            if (!muti) return null;
            var newArray = Ext.Array.filter(muti, function (item) {
                return (item.bindId == cid);
            }, this);
            //刪除沒有記號hasreplace的
            if (newArray && newArray.length > 1) {
                Ext.Array.each(newArray, function (mu) {
                    if (mu.hasreplace == undefined) {
                        Ext.Array.remove(me.getMultiFormat(), mu);
                    }
                });
            }
            return;
        }

        if (!pmf) {
            me.getMultiFormat().push({
                bindId: pid, multiFormat: [{
                    fromBindId: pid,
                    fromItemIdx: 0,
                    text: pContent || ''
                }]
            });
            pmf = me.multiFormatQuery(pid);
        }

        var _start = 0, _end = 0;
        Ext.Array.each(cmf.multiFormat, function (item) {
            _start = (item.styles) ? item.styles.start + pos : _end;
            _end = (item.styles) ? item.styles.end + pos : _start + item.text.length;

            if (item.styles) {
                item.styles.start = _start;
                item.styles.end = _end;
            }

            pmf.multiFormat.push(item);
        });

        Ext.Array.remove(me.getMultiFormat(), cmf);

    },
    /**
     *  身份證遮罩
     */
    cardMask: function (isMask) {

        var vm = OA.common.Global.getCurrentViewModel();
        var svg = this.getSvgPaper();
        var elemRoot = svg.getRootElem().querySelector('#KDRichTextBlock_0');
        if (!elemRoot) elemRoot = svg.getRootElem().querySelector('#KDRichTextBlock_1');

        var isLastAfter = false;
        var elemCurrent = elemRoot;
        var elemNext;
        do {
            //console.log(elemCurrent);
            //console.log(elemCurrent.textContent);

            //身份證遮罩條件
            var id = elemCurrent.getAttribute('id');
            var needMask = id.match('context');
            var idMold = /[A-Z][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/g;

            if (needMask) {
                if (isMask) {
                    if (elemCurrent.textContent.match(idMold)) {
                        var matchs = elemCurrent.textContent.match(idMold);
                        for (i = 0, ln = matchs.length; i < ln; i++) {
                            var k = matchs[i].toString().substring(0, 6) + '****';
                            elemCurrent.textContent = elemCurrent.textContent.replace(matchs[i], k);
                        }
                    }
                } else {
                    elemCurrent.textContent = vm[id];
                }
            }
            //console.log(elemCurrent.textContent);
            elemNext = elemCurrent.nextSibling;
            elemCurrent = elemNext;
            isLastAfter = elemCurrent.getAttribute("id").indexOf('KDRichTextBlock') >= 0;


            var svgRoot = OA.common.Paper.main().getSvgPaper().getRootElem(); //get svgRoot Elem   Chloe.sia
            elems = svgRoot.querySelectorAll('#敬會_title');
            Ext.Array.each(elems, function (elem) {
                if (elem.textContent == '（按此處新增敬會）') {  //1215 列印中身分證遮罩，敬會若為空則不顯示   Chloe.sia
                    elem.setAttribute('visibility', 'hidden');
                }
            });

        }
        while (isLastAfter);

        this.typesetting();
    },
    /**
     *  清畫筆
     */
    pensClear: function (gContent) {
        var me = this;
        if (!gContent) gContent = svgedit.utilities.getElem('canvas_background').parentNode;
        var pens = gContent.querySelectorAll('.pen');
        Ext.Array.each(pens, function (pen) {
            pen.parentNode.removeChild(pen);
        });

        // $('[data-tooltip!=""]').qtip({ // Grab all elements with a non-blank data-tooltip attr.
        // var api =$('[data-tooltip!=""]').qtip({ // Grab all elements with a non-blank data-tooltip attr.
        //     content: {
        //         attr: 'data-tooltip' // Tell qTip2 to look inside this attr for its content
        //     }
        // });
        // console.log(api);

        // $('[data-hasqtip!=""]').each(function(idx,a) { // Notice the .each() loop, discussed below


        // var root =me.getSvgPaper().getRootElem();
        // var underlines = root.querySelectorAll('tspan[text-decoration=underline]');
        // // var underlines = gContent.querySelectorAll('tspan[text-decoration=underline]');
        // Ext.Array.each(underlines, function (item) {
        //     console.log(item);
        //     // item.removeAttribute('text-decoration');
        //     // item.removeAttribute('style');
        //     item.setAttribute('text-decoration','');
        //     console.log('removeAttribute');
        //     // pen.parentNode.removeChild(pen);
        //     // $(item).removeAttr('text-decoration');
        // });

        // $('[data-hasqtip]').each(function(idx,el) { // Notice the .each() loop, discussed below
        //     // $(this).remove();
        //
        //     $(this).removeData('qtip');
        //     $('.qtip :visible').remove();
        //     $(this).removeData('text-decoration');
        //     $(this).removeAttr('text-decoration');
        // el.qtip("destroy",true);
        // extra cleanup
        // el.removeData("hasqtip");
        // el.removeAttr("data-hasqtip");
        // $(this).qtip('api').destroy();
        // $(this).data('qtip').destroy();
        //     // $(this).qtip('api').destroy();
        //     // $(this).qtip('destroy', true);
        //     // $(this).qtip('api').removeAttr('text-decoration');
        //     // $(this).removeAttr('text-decoration');
        //     // el.removeAttribute('text-decoration');
        //     // el.setAttributeNS(null,'text-decoration','');
        //     // el.removeAttribute('style');
        //         // text-decoration="underline"
        //     // console.log(el);
        //     // console.log($(this));
        //     // console.log($(this));
        //     // $(this).qtip({
        //     //     content: {
        //     //         text: $(this).next('div') // Use the "div" element next to this for the content
        //     //     }
        //     // });
        // });

        //TODO:BUG 清稿時，els因共用被清除，無法回復
        //console.log(isClear);
        //var els;
        //if (this.getClearPaperTemp()) {
        //    els = this.getClearPaperTemp();
        //    console.log(els);
        //} else {
        //    els = svg.getCurrentDrawing().current_layer.childNodes;  //return NodeList
        //    if (isClear) this.setClearPaperTemp(Ext.clone(els));
        //    console.log(els);
        //}
    },
    /**
     *  清追
     */
    reviseClear: function () {
        if (!this.getSvgPaper()) return;

        var g = this.getSvgPaper().getElem('gRevise');
        if (g) g.parentNode.removeChild(g);
    },
    /**
     *  追踨修訂隱藏
     */
    reviseHidden: function (isPortrait) {
        if (!this.getSvgPaper()) return;
        var g = this.getSvgPaper().getElem('gRevise');
        if (g) g.style.visibility = (isPortrait) ? 'hidden' : 'visible';
    },
    /**
     *  職名章
     */
    updateSealTitleAndName: function () {

    },
    /**
     *  切換iframe 用來呈現pdf
     */
    subFrameSwitch: function (action, record, myframe) {
        var ctnCpaperMain = this.down('container');
        var subFrame = document.getElementById('subFrame');
        var ctrArea = Ext.getCmp('docArea');

        if (myframe) subFrame = myframe;

        var ctnPaper = this.down('container[name=paperBox]');
        var ctnIframe = this.down('container[name=iframeBox]');
        var ctnIframe2 = Ext.getCmp('cpaper2').down('container[name=iframeBox]');

        var _width = 1, _hight = 1;
        if (action === 'init') {
            ctnCpaperMain.setHidden(false);
            ctnIframe.removeCls('iframe-holder');
        } else if (action === 'showPdf') {
            var file = record.get('files')[0];
            if (file.fileType.toUpperCase() === 'PDF') {
                ctnCpaperMain.setHidden(true);

                _width = ctrArea.element.getWidth(true);
                _hight = ctrArea.element.getHeight(true);

                //chrome 79版PDF會被iframe-holder蓋住，先取消add
                //ctnIframe.addCls('iframe-holder');
                OA.client.Attach.showByFrame(file, subFrame);
            }
        } else if (action === 'showPdfUrl') {
            ctnCpaperMain.setHidden(true);
            _width = ctrArea.element.getWidth(true);
            _hight = ctrArea.element.getHeight(true);
            if (window.parent.document &&
                window.parent.document.pdfImg &&
                window.parent.document.pdfImg.frameElement &&
                window.parent.document.pdfImg.frameElement.src) {
                subFrame.src = Ext.clone(window.parent.document.pdfImg.frameElement.src);
            } else {
                var hostURL = Ext.clone(OA.common.UrlMgr.getHost());
                if (hostURL) {
                    hostURL = hostURL.replace('rest/', '');
                }
                subFrame.src = Ext.clone(hostURL + (OA.common.Global.getFollowPdfUrl() + '').replace('&amp;', '&'));
                console.log(subFrame.src);
            }
        } else if (action === 'showPdfFile') {
            if (myframe) {
                ctnCpaperMain.setHidden(false);

                //chrome 79版PDF會被iframe-holder蓋住，先取消add
                //ctnIframe2.addCls('iframe-holder');
            } else {
                ctnCpaperMain.setHidden(true);

                //chrome 79版PDF會被iframe-holder蓋住，先取消add
                //ctnIframe.addCls('iframe-holder');
            }

            _width = ctrArea.element.getWidth(true);
            _hight = ctrArea.element.getHeight(true);

            if (Ext.os.is.iOS || Ext.os.is.Android) {
                var isDocForm = ctrArea.getActiveItem().config.xtype == 'docForm';
                if (isDocForm) {
                    ctrArea.setActiveItem('docPaper');
                }
            }

            if (OA.common.Global.getFollowPdfUrl()) {
                var hostURL = Ext.clone(OA.common.UrlMgr.getHost());
                if (hostURL) {
                    hostURL = hostURL.replace('rest/', '');
                }

                subFrame.src = Ext.clone(hostURL + (OA.common.Global.getFollowPdfUrl() + '').replace('&amp;', '&').replace('/tdym/', ''));;
            } else {
                OA.client.Attach.showByFrame(record.get('pdf'), subFrame);
            }
        }

        subFrame.width = _width;
        subFrame.height = _hight;
    },
    /**
     *  發文文號，僅在轉交換完自行編號，
     */
    sendNoUpdate: function () {
        //列印時，來文、來文＋單稿不給支號
        // if (this.getPreviewMode() && OA.common.DIMgr.getDraftCount() > 1) return;
        //多稿無法正常更新支號 , 雙稿有時也要能清支號，
        var svg = this.getSvgPaper();
        var vm = OA.common.Global.getCurrentViewModel();
        var wk = OA.common.Global.getCurrentWKContent();
        var qs = OA.common.Global.getQ();
        // console.log(vm);
        // console.log(wk);
        if (!vm) return;
        var sendno = '', otSno = '';
        var initParas = OA.common.Global.getInitParas();
        if (initParas && initParas.sendNo && initParas.sendNo.toString().length > 10) {
            sendno = Ext.String.format('{0}字第{1}號', vm.發文字號_字_1, initParas.sendNo);
            vm.發文字號_支號_1 = initParas.sendNo.toString().Right(1);
            otSno = initParas.sendNo;
        } else {
            var subNo = '';
            if (this.getPreviewMode()) {  //列印時以傳回為準
                subNo = vm.發文字號_支號_1;
            } else {
                var isSingle = OA.common.DIMgr.getDraftCount() == 1;
                if (isSingle) vm.發文字號_支號_1 = '';
                subNo = (OA.common.VIMgr.hadExchange()) ? vm.發文字號_支號_1 : '';

                vm.發文字號_支號_1 = '';
            }

            if (vm.發文字號_年度_1) {
                otSno = Ext.String.format('{0}{1}{2}', vm.發文字號_年度_1, vm.發文字號_流水號_1, subNo);
                sendno = Ext.String.format('{0}字第{1}號', vm.發文字號_字_1, otSno);
            }
        }

        if (wk) {
            var tagDoSno = OA.common.Utils.getTagText(wk, '發文字號');
            if (tagDoSno) tagDoSno.childNodes[3].Value = vm.發文字號_支號_1;
            if (wk) wk.發文文號 = otSno;
        }
        var elemSentNo = svg.getElem('發文字號_1');
        if (elemSentNo) elemSentNo.textContent = sendno;
    },

    doDrawGrid: function (el, options) {
        var me = this;
        var pos = options.pos;
        var setting = options.setting;
        var isTable = options.isTable;
        if (setting && setting.table == 'start') isTable = true;
        var gridRightMax = options.gridRightMax;
        var grids = options.grids;
        var rowX = options.rowX;
        var rowY = options.rowY;

        var ret = {};

        if (!isTable) return { isTable: isTable, gridRightMax: gridRightMax, grids: grids, rowX: rowX, rowY: rowY };

        var isTitle = el.id.indexOf('_title') >= 0;
        if (isTitle) {
            var isTurn = el.childNodes.length > 1;
            var hasTspan = el.querySelectorAll('tspan').length > 0;

            var fz = me.getLineHeight(el);
            var rows = setting.rows || 1;
            if (hasTspan) pos.y = pos.y + fz;

            var pos_line = { id: el.id, x: pos.x, y: pos.y + (fz * rows) + 5 };

            if (!isTurn) {
                if (pos.x + me.getClientWidth(el) > gridRightMax) gridRightMax = pos.x + me.getClientWidth(el) + 5;
            }

            pos_line.gridRightMax = gridRightMax;
            if (setting.table === 'start') {
                isTable = true;
                grids.push({ type: 'tableStart', y: pos.y });
            } else if (setting.table === 'end') {
                grids.push({ type: 'tableEnd', y: pos_line.y + 5 });
                pos_line.x = me.getMarginLeft();
            }

            if (setting.tr === 'start') {
                pos_line.type = 'start';
                pos_line.gridTop = pos.y;
                grids.push(pos_line);
                gridRightMax = pos.x + me.getClientWidth(el) + 5;
            } else if (setting.tr === 'end') {
                pos_line.type = 'end';
                grids.push(pos_line);
            } else if (setting.tr === 'alone') {
                pos_line.type = 'alone';
            }
            me.drawGridDown(el, pos_line);

            rowX = gridRightMax;
            rowY = pos_line.y + fz;

            if (isTurn & !hasTspan) {
                var wrapping = el.cloneNode(false);
                Ext.Array.each(el.childNodes, function (item, idx) {
                    var tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                    tspan.setAttributeNS(null, 'x', el.getAttribute('x'));
                    if (idx != 0) tspan.setAttributeNS(null, 'dy', fz);
                    var textNode = document.createTextNode(item.textContent);
                    tspan.appendChild(textNode);
                    wrapping.appendChild(tspan);
                });
                if (el.parentNode) el.parentNode.replaceChild(wrapping, el);
            } else {
                el.setAttribute('y', (pos.y + pos_line.y + fz) / 2);
            }
        } else {

            // console.log(el);
            //     var elem = svgedit.utilities.getElem(el.id + '_titlelineDown');
            //     if (elem) {
            //         elem.setAttribute('y1', pos.y + me.getClientHeight(el) + 5);
            //         elem.setAttribute('y2', pos.y + me.getClientHeight(el) + 5);
            //     }
            // ret.y = rowY;
        }

        if (setting && setting.table === 'end') {
            isTable = false;
            pos.y = pos_line.y + 2;
        }

        return { isTable: isTable, gridRightMax: gridRightMax, grids: grids, rowX: rowX, rowY: rowY, pos: pos };
    },
    drawGridLast: function (grids) {
        // console.log(grids);
        if (grids.length < 1) return;

        var me = this;
        var svg = OA.common.Paper.main().getSvgPaper();
        var lines = [], pos = {}, posFrame = {}, tableTop = 0.0, tableButtom = 0.0;
        Ext.Array.each(grids, function (p) {
            if (p.type == 'tableStart') {
                tableTop = p.y;
            } else if (p.type == 'tableEnd') {
                tableButtom = p.y;
            }

            if (p.type == 'start') {
                pos = {};
                pos.id = p.id + '_gridLineRight';
                pos.y1 = p.gridTop;
            } else if (p.type == 'end') {
                pos.x1 = p.gridRightMax;
                pos.x2 = p.gridRightMax;
                pos.y2 = p.y + 2;
                lines.push(pos);
                tableButtom = p.y + 2;
            } else if (p.type == 'alone') {
                pos = {};
                pos.id = p.id + '_gridLineAlone';
                pos.x1 = p.gridRightMax;
                pos.x2 = p.gridRightMax;
                pos.y1 = p.gridTop;
                pos.y2 = p.y + 2;
                lines.push(pos);
                tableButtom = p.y + 2;
            }
        })
        // console.log(lines);
        Ext.Array.each(lines, function (p) {
            $(p.id).remove();
            svg.addSvgElementFromJson({
                "element": "line",
                "curStyles": true,
                "attr": Ext.apply(p, {
                    'stroke': 'black',
                    "class": 'test'
                })
            });
        });

        var pRight = {};
        pRight.id = 'table_right';
        pRight.x1 = me.getPageWidth() - me.getMarginRight();
        pRight.x2 = me.getPageWidth() - me.getMarginRight();
        pRight.y1 = tableTop;
        pRight.y2 = tableButtom;
        $(pRight.id).remove();
        svg.addSvgElementFromJson({
            "element": "line",
            "curStyles": true,
            "attr": pRight
        });

        var pLeft = {};
        pLeft.id = 'table_left';
        pLeft.x1 = me.getMarginLeft();
        pLeft.x2 = me.getMarginLeft();
        pLeft.y1 = tableTop;
        pLeft.y2 = tableButtom;
        $(pLeft.id).remove();
        svg.addSvgElementFromJson({
            "element": "line",
            "curStyles": true,
            "attr": pLeft
        });

        var pTop = {};
        pTop.id = 'table_top';
        pTop.x1 = me.getMarginLeft();
        pTop.x2 = me.getPageWidth() - me.getMarginRight();
        pTop.y1 = tableTop;
        pTop.y2 = tableTop;
        $(pTop.id).remove();
        svg.addSvgElementFromJson({
            "element": "line",
            "curStyles": true,
            "attr": pTop
        });
    },
    drawGridDown: function (el, pos) {
        var me = this;
        var svg = OA.common.Paper.main().getSvgPaper();
        if (!el.id) return;

        var lineDown = el.id + 'lineDown';
        $(lineDown).remove();
        svg.addSvgElementFromJson({
            "element": "line",
            "curStyles": true,
            "attr": {
                "id": lineDown,
                "x1": pos.x,
                "y1": pos.y + 2,
                "x2": me.getPageWidth() - me.getMarginRight(),
                "y2": pos.y + 2,
                'stroke': 'black',
                "class": 'test'
            }
        });
    },
    /**
     *  簽核會核單
     */
    doDraftVerify: function (key, items) {
        var me = this;
        var svg = me.getSvgPaper();
        if (!svg) return;
        if (items.length == 0) return;
        var ratio = svg.getZoom();

        var gBackground = svg.getContentElem().querySelector('.gBackground');
        var gContent = svg.getContentElem().querySelector('.gContent');
        gBackground.style.visibility = 'hidden';
        gContent.style.visibility = 'hidden';

        var first3Items = items.slice(0, 6), baseElem;
        if (first3Items.length < 6) first3Items.push('');

        var options = { key: key, items: first3Items };
        if (key == '受會單位') {
            options.direction = 'vertical';
            options.id = '受會單位_title';
            options.padding = 110;
            options.interval = 95;
        } else if (key == '會辦機關') {
            options.direction = 'horizontal';
            options.id = '機關單位';
            options.padding = 130;
            options.interval = 180;
        }
        me.contentFillIn(gContent, options);

        me.setPage(0);

        var boxWidth = key == '受會單位' ? 100 : 160;
        var _y = key == '受會單位' ? 60 : 40;
        var contentItems = items.slice(0, 6);
        me.updateWrapElemByBox(gContent, key + '_0', contentItems[0], boxWidth, _y);
        me.updateWrapElemByBox(gContent, key + '_1', contentItems[1], boxWidth, _y);
        me.updateWrapElemByBox(gContent, key + '_2', contentItems[2], boxWidth, _y);
        me.updateWrapElemByBox(gContent, key + '_3', contentItems[3], boxWidth, _y);
        me.updateWrapElemByBox(gContent, key + '_4', contentItems[4], boxWidth, _y);
        me.updateWrapElemByBox(gContent, key + '_5', contentItems[5], boxWidth, _y);


        //列印因流覧器修正高
        var padding = OA.common.DIMgr.revisePrint({
            page: me.getPage(),
            maxMargin: me.getMaxMargin(),
            marginBottom: me.getMarginBottom()
        }).heightWithPadding;

        var total = Math.ceil(items.length / 6);
        var start = 6;

        for (var i = 1; i < total; i++) {
            var className = 'gContent g' + (i + 1);
            var old = gContent.parentNode.querySelector('.g' + (i + 1));
            if (old) gContent.parentNode.removeChild(old);

            me.setPage(i);
            contentItems = items.slice(start, start + 6);

            var gContentCopy = gContent.cloneNode(true);
            gContentCopy.style.visibility = 'hidden';

            if (key == '會辦機關') {
                var elem = gContentCopy.querySelector('#主辦機關_title');
                elem.textContent = '會 辦 機 關';
            }

            _y = key == '受會單位' ? 8 : -10;
            me.updateWrapElemByBox(gContentCopy, key + '_0', contentItems[0], boxWidth, _y);
            me.updateWrapElemByBox(gContentCopy, key + '_1', contentItems[1], boxWidth, _y);
            me.updateWrapElemByBox(gContentCopy, key + '_2', contentItems[2], boxWidth, _y);
            me.updateWrapElemByBox(gContentCopy, key + '_3', contentItems[3], boxWidth, _y);
            me.updateWrapElemByBox(gContentCopy, key + '_4', contentItems[4], boxWidth, _y);
            me.updateWrapElemByBox(gContentCopy, key + '_5', contentItems[5], boxWidth, _y);

            gContent.parentNode.insertBefore(gContentCopy, gContent.nextSibling);
            gContentCopy.setAttribute("class", className);

            var tl = 'translate(0,' + padding + ')';
            gContentCopy.setAttribute("transform", tl);
            gContentCopy.style.visibility = 'visible';

            padding = padding + OA.common.DIMgr.revisePrint({
                page: me.getPage(),
                maxMargin: me.getMaxMargin(),
                marginBottom: me.getMarginBottom()
            }).heightWithPadding;
            start = start + 6;
        }

        me.updateSvgPage();

        gBackground.style.visibility = 'visible';
        gContent.style.visibility = 'visible';

        me.updateCanvasReset(padding);
    },
    contentFillIn: function (gContent, options) {
        var baseElem = gContent.querySelector('#' + options.id);
        if (!baseElem) return;

        Ext.Array.each(options.items, function (item, idx) {
            var _id = options.key + '_' + idx;
            var elem = gContent.querySelector('#' + _id);
            if (!elem) {
                elem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                elem.setAttribute('id', _id);
                elem.setAttributeNS(null, "font-size", "20");
                gContent.appendChild(elem);
            }

            elem.textContent = item;
            if (options.direction === 'vertical') {
                elem.setAttribute('x', baseElem.getAttribute('x'));
                elem.setAttribute('y', parseFloat(baseElem.getAttribute('y')) + options.padding + (idx) * options.interval);
            } else {
                elem.setAttribute('x', parseFloat(baseElem.getAttribute('x')) + options.padding + (idx) * options.interval);
                elem.setAttribute('y', baseElem.getAttribute('y'));
            }
        });
    },
    updateWrapElemByBox: function (elem, updateId, text, boxwidth, y) {
        var me = this;
        var originalElem = elem.querySelector('#' + updateId);
        if (originalElem) {
            originalElem.textContent = text;
            var x_pos_original = parseFloat(originalElem.getAttribute("x"));
            var y_pos_original = parseFloat(originalElem.getAttribute("y")) - y;
            if (updateId.indexOf('會辦機關_') >= 0) {
                var reSet = false;
                var boxheight = 59;
                var fontSize = 20;
                originalElem.setAttribute('font-size', fontSize);
                var index = updateId.indexOf('_') + 1;
                var num = updateId.substring(index, updateId.length);
                x_pos_original = x_pos_original - (parseInt(num) * 5);
                do {
                    elem = me.setWrap(originalElem, x_pos_original, y_pos_original, boxwidth, 0);
                    if (elem && elem.childElementCount) {
                        var textheight = parseFloat(me.getLineHeight(elem) * elem.childElementCount);
                        if (textheight > boxheight) {
                            fontSize = fontSize - 1;
                            elem.setAttribute('font-size', fontSize);
                            originalElem = elem;
                            reSet = true;
                        } else {
                            reSet = false;
                        }
                    }
                } while (reSet)
            } else {
                me.setWrap(originalElem, x_pos_original, y_pos_original, boxwidth, 0);
            }
        }
    },
    updateCanvasReset: function (h) {
        var me = this;
        var svg = me.getSvgPaper();
        var ratio = svg.getZoom();
        svg.setResolution(me.getPageWidth(), h);
        svg.updateCanvas(me.getPageWidth() * ratio, h * ratio); //視圖重刷
    },
    hasField: function (name) {
        var fields = OA.common.Paper.main().getFields();
        var exists = false;
        Ext.Array.each(fields, function (field) {
            if (field.key == name) exists = true;
        });
        return exists;
    },
    showIndicator: function () {
        var scrollable = this.up('ctnPaper').getScrollable();
        var scroller = scrollable.getScroller();
        var indicator = scrollable.getIndicators().y;
        scrollable.getIndicators().y.setAutoHide(false);
        //new Ext.util.Draggable({
        //    element: indicator.element,
        //    listeners: {
        //    	drag: function(ctr, e, offsetX, offsetY, eOpts) {
        //            var size = scroller.getSize(),
        //                cntSize = scroller.getContainerSize();
        //            if (offsetY < 0) {
        //                scroller.scrollToTop();
        //            } else if (offsetY >= (cntSize.y - indicator.getLength())) {
        //                scroller.scrollToTop();
        //                scroller.scrollToEnd();
        //                return;
        //            } else {
        //                scroller.scrollTo(offsetX, size.y * (offsetY / cntSize.y));
        //            }
        //        }
        //    }
        //});

        // 替換捲動規則與indicatorWith相似，並在切換版號時手動歸零卷軸offset - by yi-chi chiu
        if ((typeof elList) === 'undefined') {
            elList = [];
        } else {
            var i = 0;
            while (i <= 99) {
                if (elList[0].managedListeners['ext-util-draggable-' + i.toString()])
                    elList[0].managedListeners['ext-util-draggable-' + i.toString()]['drag'][0]['scope']['offset'].y = 0;
                i++;
            }
        }
        if (!this.config.isExist) {
            elList.push(indicator.element);
            new Ext.util.Draggable({
                element: indicator.element,
                listeners: {
                    drag: function (ctr, e, offsetX, offsetY, eOpts) {
                        var size = scroller.getSize(),
                            cntSize = scroller.getContainerSize();
                        if (offsetY < 0) {
                            scroller.scrollToTop();
                        } else if (offsetY >= (cntSize.y - indicator.getLength())) {
                            scroller.scrollToTop();
                            scroller.scrollToEnd();
                            return;
                            //} else if (offsetY >= (cntSize.y - indicator.gapLength)) {
                            //    scroller.scrollToTop();
                            //    scroller.scrollToEnd();
                            //    offsetY = cntSize.y - indicator.gapLength;
                        } else {
                            scroller.scrollTo(offsetX, size.y * (offsetY / cntSize.y));
                        }
                        //console.log(indicator.lastOffset + ', ' + offsetY);
                    }
                }
            });

            this.config.isExist = true;
        }

        indicator.show();
    },
    hideIndicator: function () {
        var scrollable = this.up('ctnPaper').getScrollable();
        var scroller = scrollable.getScroller();
        var indicator = scrollable.getIndicators().y;
        scrollable.getIndicators().y.setAutoHide(false);
        indicator.hide();
    },
    addSealHeight: function (el, pos) {
        var me = this;
        var svg = this.getSvgPaper();
        var modelName = OA.client.WK.getCurrentModelName();
        var previewMode = me.getPreviewMode();
        //if (!previewMode || previewMode == '' || previewMode == 'Draft') {
        if (previewMode == 'Draft') {
            if ((modelName == 'OA.model.wk.Order' || modelName == 'OA.model.wk.Publish') && el.id == '發文日期_title') {
                //console.log(Ext.clone(pos.y));
                me.setSealH(Ext.clone(pos.y - 25));
                pos.y = pos.y + me.getSealHeight() + 20;//增加核章欄高度
                //OA.common.Utils.addLine('sealY', pos.y, 'blue');
                //console.log(pos.y);
            } else if (el.id == '受文者_title') {
                //console.log(Ext.clone(pos.y));
                me.setSealH(Ext.clone(pos.y - 25));
                pos.y = pos.y + me.getSealHeight();//增加核章欄高度
                //OA.common.Utils.addLine('sealY',Ext.clone(pos.y), 'blue');
                //console.log(Ext.clone(pos.y));
            }
            if ((modelName == 'OA.model.wk.AgentLetter' || modelName == 'OA.model.wk.AgentBookLetter') &&
                el.id == '受文者_title') { //0824 列印時seal 核章欄擺放位置 Chloe.sia
                me.setSealH(Ext.clone(pos.y - 400));
                pos.y = pos.y + me.getSealHeight() - 250;//增加核章欄高度
            }
            if ((modelName == 'OA.model.wk.AgentOrder' || modelName == 'OA.model.wk.AgentPublish') &&
                el.id == '發文日期_title') { //0824 列印時seal 代辦核章欄擺放位置 Chloe.sia
                //console.log(Ext.clone(pos.y));
                me.setSealH(Ext.clone(pos.y - 25));
                pos.y = pos.y + me.getSealHeight() + 100;//增加核章欄高度
            }
            if (modelName == 'OA.model.wk.MeetingReport' && el.id == '部室別_title') {
                //0824 列印時seal 代辦核章欄擺放位置 Chloe.sia
                //console.log(Ext.clone(pos.y));
                me.setSealH(Ext.clone(pos.y - 25));
                pos.y = pos.y + me.getSealHeight();//增加核章欄高度
            }
            if (modelName == 'OA.model.wk.ImportantMeetingReport' && el.id == '參加會議人員姓名_title') {
                //0824 列印時seal 代辦核章欄擺放位置 Chloe.sia
                //console.log(Ext.clone(pos.y));
                me.setSealH(Ext.clone(pos.y - 25));
                pos.y = pos.y + me.getSealHeight();//增加核章欄高度
            }
            if (modelName == 'OA.model.wk.Notice' && el.id == '發文日期_title') {
                //0824 列印時seal 代辦核章欄擺放位置 Chloe.sia
                //console.log(Ext.clone(pos.y));
                me.setSealH(Ext.clone(pos.y));
                pos.y = pos.y + me.getSealHeight() + 20;//增加核章欄高度
            }
        } else {
            var elemSeal = svg.getElem('gSeal');
            if (elemSeal) elemSeal.parentNode.removeChild(elemSeal);
            if ((modelName == 'OA.model.wk.MeetingReport' && el.id == '部室別_title') ||
                (modelName == 'OA.model.wk.ImportantMeetingReport' && el.id == '參加會議人員姓名_title')) {
                //0824 列印時seal 代辦核章欄擺放位置 Chloe.sia
                pos.y = pos.y + 80;//增加高度
            }
        }
        return pos.y;
    },
    removeRedundantSpace: function (text) {
        var result = "";
        var resource = text.split("");
        for (i = 0; i < resource.length; i++) {
            if (
                i !== 0 &&
                (resource[i] == " " ||
                    resource[i] == "　" ||
                    resource[i].charCodeAt(0) == 10)
            ) {
                if (
                    resource[i - 1] !== undefined &&
                    resource[i + 1] !== undefined
                ) {
                    if (
                        (resource[i - 1].charCodeAt(0) >= 65 &&
                            resource[i - 1].charCodeAt(0) <= 90) ||
                        (resource[i - 1].charCodeAt(0) >= 97 &&
                            resource[i - 1].charCodeAt(0) <= 122) ||
                        (resource[i - 1].charCodeAt(0) >= 48 &&
                            resource[i - 1].charCodeAt(0) <= 57) ||
                        (resource[i + 1].charCodeAt(0) >= 65 &&
                            resource[i + 1].charCodeAt(0) <= 90) ||
                        (resource[i + 1].charCodeAt(0) >= 97 &&
                            resource[i + 1].charCodeAt(0) <= 122) ||
                        (resource[i + 1].charCodeAt(0) >= 48 &&
                            resource[i + 1].charCodeAt(0) <= 57)
                    ) {
                        result = result + resource[i];
                    }
                }
            } else {
                result = result + resource[i];
            }
        }
        return result;
    },
    addNoteHeight: function (el, pos) {  //1127 簽類型 列印若沒有敬會 調整顯示位置 Chloe.sia
        var me = this;
        var svg = this.getSvgPaper();
        var modelName = OA.client.WK.getCurrentModelName();
        var previewMode = me.getPreviewMode();
        var elemNote = svg.getElem('敬會_title');
        //if (!previewMode || previewMode == '' || previewMode == 'Draft') {

        if (me.getBinPacket() == true) { //0702 如果是匯入封包，PreviewMode變更狀態，解決 按此處新增敬會 位移問題 ， 不影響列印 Chloe.sia
            me.setPreviewMode('');
            me.setBinPacket(false)
        }

        if (previewMode == 'Draft') { //稿面
            if ((modelName == 'OA.model.wk.NoteEasy') && elemNote.textContent == '（按此處新增敬會）') { //簡簽   便簽
                me.setSealH(Ext.clone(pos.y - 25));
                pos.y = pos.y - 100
            } else if ((modelName == 'OA.model.wk.NotesTop' || modelName == 'OA.model.wk.Notes') && elemNote.textContent == '（按此處新增敬會）' && el.id == 'KDRichTextBlock_0') { // 簽  上行簽
                el.setAttributeNS(null, 'y', pos.y - 100);
                me.setSealH(Ext.clone(pos.y - 25));
                pos.y = pos.y - 100
            }
        } else if (previewMode == 'Normal') {
            if ((modelName == 'OA.model.wk.NoteEasy') && elemNote.textContent == '（按此處新增敬會）') {
                me.setSealH(Ext.clone(pos.y - 25));
                pos.y = pos.y - 100
            } else if ((modelName == 'OA.model.wk.NotesTop' || modelName == 'OA.model.wk.Notes') && elemNote.textContent == '（按此處新增敬會）' && el.id == 'KDRichTextBlock_0') {
                el.setAttributeNS(null, 'y', pos.y - 100);
                me.setSealH(Ext.clone(pos.y - 25));
                pos.y = pos.y - 100
            }
        }
        return pos.y;
    },
    addStamps: function (raw) { //增加章戳
        //console.log(raw);
        var me = this;
        var svg = me.getSvgPaper();
        if (null == svg) return;
        /*
         * 0：機關章
         * 1：署名章
         */
        //var stamp = svg.getElem('Stamp1');
        var gContent = svg.getContentElem().querySelectorAll('.gContent');
        if (gContent && gContent.length > 0) {
            Ext.Array.each(gContent, function (gSvg) {
                //console.log(gContent);
                var stamp = gSvg.parentElement.querySelector('#Stamp') || null;
                if (stamp) {

                    var elemSA = gSvg.querySelector('#署名_1');
                    if (elemSA) {
                        var int = 0;
                        do {
                            int = int + 1;
                            elemSA = gSvg.querySelector("#署名_" + int);
                            if (elemSA) {
                                elemSA.style.display = 'none';
                            }
                        } while (elemSA);
                    }

                    var stamp_y = 0;

                    var elemSA_Title = gSvg.querySelector('#署名_title');
                    if (elemSA_Title) elemSA_Title.style.display = 'none';

                    var elemSA_1 = gSvg.querySelector('#署名_1');

                    if (elemSA_Title && elemSA_1) {
                        stamp.id = Ext.clone(stamp.id) + '_' + (gSvg.getAttribute("class") + '').replace('gContent', '').trim();
                        //console.log(stamp);
                        stamp.childNodes[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', raw.stamp);
                        stamp_y = parseFloat(elemSA_1.getAttribute("y"));
                        stamp.childNodes[0].setAttribute('y', stamp_y);
                        stamp.childNodes[0].setAttribute('opacity', '1');
                    } else {
                        //沒有署名改抓分層負責
                        var elemAD = gSvg.querySelector('#迴避要點_title');
                        if (elemAD) {
                            stamp.id = Ext.clone(stamp.id) + '_' + (gSvg.getAttribute("class") + '').replace('gContent', '').trim();
                            //console.log(stamp);
                            stamp.childNodes[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', raw.stamp);
                            stamp_y = parseFloat(elemAD.getAttribute("y")) + 40;
                            stamp.childNodes[0].setAttribute('y', stamp_y);
                            stamp.childNodes[0].setAttribute('opacity', '1');
                        }

                    }
                } else {
                    var stamp = gSvg.parentElement.querySelector('#Stamp_' + (gSvg.getAttribute("class") + '').replace('gContent', '').trim());
                    if (stamp) {
                        stamp.childNodes[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', raw.stamp);
                    }
                }
            });
        }
    }
});