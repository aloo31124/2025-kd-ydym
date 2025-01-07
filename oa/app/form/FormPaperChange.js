/*
 文稿刪除/排序
 */
Ext.define('OA.form.FormPaperChange', {
    extend: 'Ext.Panel',
    xtype: "FormPaperChange",
    alias: 'widget.FormPaperChange',
    id: 'FormPaperChange',
    config: {
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        width: '55%',
        height: '70%',
        style: 'font-size:20px',
        activeTab: 1,
        defaults: {
            scrollable: true
        },
        layout: 'vbox',
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    //{ xtype: 'spacer' },
                    {
                        text: '刪除', ui: 'decline', width: '20%', id: 'rubbish',
                        handler: function (button) {
                            var me = Ext.getCmp('FormPaperChange');
                            var list = Ext.getCmp('listPaperChange');
                            var store = list.getStore();
                            var selectItems = list.getSelection();
                            var selectItem = selectItems[0];
                            var qs = OA.common.Global.getQ();

                            if (selectItem.get('text') === '來文' || selectItem.get('text').indexOf('(已決行)') != -1) return;



                            if (qs.app !== 'editor' && qs.app !== 'offline') {
                                if (store.getData().length == 1 && selectItem.get('text') !== '來文') {
                                    //紙本不檢核
                                    if (OA.common.Utils.checkEpaper()) {
                                        Ext.Msg.alert("提示", '線上簽核公文，不可將所有文稿刪除！');
                                        return;
                                    }
                                }
                            }

                            store.remove(selectItem);

                            var data = selectItem.getData().paperNo;
                            if (me.getDeleteList()) {
                                me.getDeleteList().push(data);
                            } else {
                                me.setDeleteList([data]);
                            }

                        }
                    },
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
                        action: 'no',
                        handler: function (button) {
                            button.up('panel').hide();
                        }

                    }
                ]
            },
            {
                height: '100%',
                xtype: 'list',
                scrollable: 'vertical',
                id: 'listPaperChange',
                store: 'Paper',
                itemTpl: new Ext.XTemplate(
                    '<table>',
                    '<tr>',
                    '<td width="55%">',
                    '<p style="font-size:90%;">',
                    '{text}　{otherName}',
                    '</p>',
                    '<p style="font-size:110%;"></p>',
                    '</td>',
                    // '<tpl if="(isOther)">',
                    // '<td width="8%"><button style="font-size:110%;" class="other-name">別名</button></td>',
                    // '</tpl>',
                    // '<tpl if="(isChange)">',
                    // '<td width="8%"><button style="font-size:110%;" class="change-type">轉換</button></td>',
                    // '</tpl>',
                    '<td width="5%"><span class="flow-move"></span></td>',
                    '</tr>',
                    '</table>'
                ),
                infinite: true,
                variableHeights: true,
                plugins: [{ xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move' }],
                listeners: [
                    {
                        event: 'itemtap',
                        fn: function (list, index, item, record, event) {
                            if (event.getTarget('.other-name')) {
                                Ext.Msg.prompt(record.get('text'), '請輸入別名', function (key, value) {
                                    if (key === 'ok') {
                                        record.set('otherName', value);
                                        var edition = OA.common.VIMgr.getCurrentEdition();
                                        //更新vi
                                        if (edition) {
                                            Ext.Array.each(edition.簽核文件夾.文稿, function (paper) {
                                                if (paper.代碼 == record.get("paperNo")) {
                                                    paper.別名 = value;
                                                    OA.common.VIMgr.editionList(edition.版號);
                                                    return false;
                                                }
                                            });
                                        }
                                    }
                                }, this, false, record.get('otherName'));

                            } else if (event.getTarget('.change-type')) {
                                var me = item.up('panel');
                                me.docTypeChange(record);
                            }
                        }
                    },
                    {
                        event: 'dragsort',
                        fn: function (listObject, row, to, from) {
                            var list = Ext.getCmp('listPaperChange');
                            var store = list.getStore();
                            var idx = 1;
                            store.each(function (r) {
                                r.set('paperOrder', idx);
                                idx++;
                            });
                        }
                    }]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                   
                    // {
                    //     text: '建立複本', width: '20%', id: 'duplicate',
                    //     handler: function (button) {
                    //         var me = Ext.getCmp('FormPaperChange');
                    //         var count = OA.common.DIMgr.getDraftCount();
                    //         if (count > 60) {
                    //             Ext.Msg.alert('提示', '超過最大稿數！');
                    //             return;
                    //         }
                    //         var list = Ext.getCmp('listPaperChange');
                    //         var selectItems = list.getSelection();
                    //         var selectItem = selectItems[0];
                    //         var init = OA.common.Global.getInitParas();
                    //         var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                    //         if (ctrWK) {
                    //             if (selectItem && selectItem.raw && selectItem.raw != undefined && init) {
                    //                 if (selectItem.raw.paperNo + '' == init.paperNo + '') {
                    //                     var isDocForm = ctrWK.getDocArea().getActiveItem().config.xtype == 'docForm';  //簡易模式
                    //                     if (isDocForm) {    //先切換回文稿模式
                    //                         var modBtn = Ext.getCmp('modeChange');
                    //                         if (modBtn) {
                    //                             ctrWK.onModeTap(modBtn, null, function () {
                    //                                 ctrWK.duplicatePaper();
                    //                                 me.hide();
                    //                             });
                    //                         }
                    //                     } else {
                    //                         ctrWK.duplicatePaper();
                    //                         me.hide();
                    //                     }
                    //                 } else {
                    //                     //切換文稿後再做複本
                    //                     if (ctrWK) {
                    //                         var segdoc = Ext.getCmp('segDocSelector');
                    //                         Ext.Array.forEach(segdoc.getItems().items, function (button) {
                    //                             if (button.config && button.config.paperNo) {
                    //                                 if (button.config.paperNo + '' == selectItem.raw.paperNo + '') {
                    //                                     var isDocForm = ctrWK.getDocArea().getActiveItem().config.xtype == 'docForm';  //簡易模式
                    //                                     if (isDocForm) {    //先切換回文稿模式
                    //                                         var modBtn = Ext.getCmp('modeChange');
                    //                                         if (modBtn) {
                    //                                             ctrWK.onModeTap(modBtn, null, function () {
                    //                                                 ctrWK.setIsDuplicate(true);
                    //                                                 ctrWK.onPaperTaggle(segdoc, button, true);
                    //                                                 me.hide();
                    //                                             });
                    //                                         }
                    //                                     } else {
                    //                                         ctrWK.setIsDuplicate(true);
                    //                                         ctrWK.onPaperTaggle(segdoc, button, true);
                    //                                         me.hide();
                    //                                     }
                    //                                     return false;
                    //                                 }
                    //                             }
                    //                         });
                    //                     }
                    //                 }
                    //             } else {
                    //                 Ext.Msg.alert('提醒', '請選擇要建立複本的文稿！');
                    //             }
                    //         }
                    //     }
                    // },
                    { xtype: 'spacer' },
                    {
                        text: '確定', ui: 'confirm', width: '20%',
                        handler: function (button) {
                            var me = button.up('panel');
                            // 避免使用者誤動作造成簽稿異常 - by yi-chi chiu
                            Ext.Viewport.setMasked(true);
                            me.doOK();
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                        }
                    }
                ]
            }
        ],
        deleteList: null
    },
    create: function () {
        this.setDeleteList(null);
        var o = OA.common.VIMgr.getViContent();
        var ctr = Ext.getCmp('segDocSelector');
        var items = ctr.getItems().items;
        var list = [];
        var oldApproved = [];
        Ext.Array.forEach(o.版次, function (oldEdition) {
            if (oldEdition.線上簽核資訊 && oldEdition.線上簽核資訊.簽核流程.異動別 === '決行')
                oldApproved.push(oldEdition);
        });
        var isApprovedDoc = [];
        if (oldApproved && oldApproved.length > 0) {
            Ext.Array.each(oldApproved, function (item) {
                if (item.簽核文件夾.文稿) {
                    Ext.Array.each(item.簽核文件夾.文稿, function (doc) {
                        if (isApprovedDoc.indexOf(doc.代碼) == -1)
                            isApprovedDoc.push(doc.代碼);
                    });
                }
            });
        }

        Ext.Array.each(items, function (item, idx) {
            var isActionButton = item.config.action === 'add' || item.config.action === 'change';
            if (!isActionButton) {
                var isOther = false;
                var isChange = false;
                if (item.config.form == '函' && item.config.text != '來文' || item.config.form == '書函' || item.config.form == '簽' || item.config.form == '簡簽') isChange = true;
                if (item.config.form !== '會核單') isOther = true;
                //console.log(item);
                //if(item.config)
                if (item.getText() == '會核單') {
                    //1126 如果是會核單，不顯示FormPaperChange裡   Chloe.sia
                } else{
                    list.push({
                        text: isApprovedDoc.indexOf(item.config.paperNo) != -1 ? item.getText() + '(已決行)' : item.getText(),
                        paperNo: item.config.paperNo,
                        Approved: isApprovedDoc.indexOf(item.config.paperNo) != -1,
                        // paperOrder: (item.config.idx) ? item.config.idx + 1 : idx + 1,
                        paperOrder: item.config.paperOrder,
                        source: item.config,
                        otherName: item.config.otherName + '',
                        isOther: isOther,
                        isChange: isChange
                    });
            }
            }
        });
        Ext.getStore('Paper').setData(list);


        // //1202 陳核內會，同機關單位，無+號，隱藏建立副本及刪除按鈕  Chloe.sia
        // var checks = o.版次.where("( el, i, res, param ) => el.簽核狀態==1");
        // var isSign = checks.length > 0;
        // var isAdd = !isSign;
        // if(!isAdd){
        //     Ext.getCmp('duplicate').setHidden(true);
        //     Ext.getCmp('rubbish').setHidden(true);
        // }
        //-------------------------------------------

        // if (OA.common.VIMgr.hadExchange() && OA.common.Utils.checkEpaper()) {
        //     Ext.getCmp('duplicate').setHidden(true);//在決行狀態下建立複本按鈕隱藏
        //     //OA.common.Utils.checkEpaper()是線上簽核模式
        //     //OA.common.VIMgr.hadExchange()轉交換按鈕
        // }
        OA.common.Utils.indicatorWith(this);
    },
    doOK: function () {
        var me = Ext.getCmp('FormPaperChange');
        me.hide();
        if (me.getDeleteList()) {
            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
            ctrWK.deleteViReload(me.getDeleteList());
            return;
        }
        me.doMove();
    },
    doMove: function () {
        var current = OA.common.VIMgr.getCurrentEdition();
        var papers = current.簽核文件夾.文稿;
        var qs = OA.common.Global.getQ();
        var initParas = OA.common.Global.getInitParas();
        if (!papers.length) papers = [papers];

        var onePaper;
        var list = Ext.getCmp('listPaperChange');
        var store = list.getStore();
        store.each(function (r) {
            var paper = papers.where("( el, i, res, param ) => el.代碼==" + r.getData().paperNo)[0];
            if (paper && r.getData().paperOrder) {
                paper.排序 = r.getData().paperOrder;
                if (paper.排序 === 1) onePaper = paper;
            }
        });

        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        if (qs.app !== 'editor' && qs.app !== 'offline') {
            if (onePaper && onePaper.代碼) {
                if (initParas.paperNo != onePaper.代碼) {
                    if (qs.sFlag && qs.sFlag == 'Y') {
                        ctrWK.saveViReload();
                        return;
                    }
                    var pressedItem = ctrWK.getSegdoc().getItems().items.where("( el, i, res, param ) => el.config.paperNo==" + onePaper.代碼);
                    if (!pressedItem || pressedItem.length == 0) pressedItem = ctrWK.getSegdoc().getItems().items[0];
                    ctrWK.getSegdoc().setPressedButtons(pressedItem);
                    qs.nextStep = 'ViReload';
                    return;
                } else {
                    ctrWK.saveViReload();
                }
            } else {
                ctrWK.saveViReload();
            }
        } else {
            ctrWK.saveViReload();
        }
    },
    docTypeChange: function (record) {
        var me = Ext.getCmp('FormPaperChange');
        var list = Ext.getCmp('listPaperChange');
        var selectItems = list.getSelection();
        var selectItem = selectItems[0];
        // var qs = OA.common.Global.getQ();
        var init = OA.common.Global.getInitParas();
        var segdoc = Ext.getCmp('segDocSelector');
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        var segItems = ctrWK.getSegdoc().getItems().items;
        var pages = OA.common.VIMgr.getCurrentEditionPapers();

        if (record) selectItem = record;


        if (selectItem.get('text') === '來文' || selectItem.get('text').indexOf('(已決行)') != -1) return;

        if (selectItem && selectItem.raw && selectItem.raw != undefined && init) {   //文稿切換BAR跟FormPaperChange 文稿選擇一樣時，會跑這段
            if (selectItem.raw.paperNo + '' == init.paperNo + '') {
                if (selectItem.getData().source.form == '函') {
                    Ext.Msg.confirm("提醒", "文稿類型「函」轉換成「書函」，請確認？", function (ok) {
                        if (ok == 'yes') {
                            // Ext.Array.forEach(segdoc.getItems().items, function (button) {
                            //
                            //     if (button.config && button.config.paperNo) {
                            //         if (button.config.paperNo + '' == selectItem.raw.paperNo + '') {

                            //更變CurrentWKContent
                            var wk = OA.common.Global.getCurrentWKContent();
                            wk.DocumentTemplate = '書函';
                            wk.DocumentType = '書函';
                            var oldWK = Ext.clone(OA.common.Global.getCurrentWKContent());
                            OA.common.Global.setCurrentWKContent(oldWK);


                            //更變InitParas
                            init.documentType = '書函';
                            //  init.model_di = OA.common.DIMgr.getModelName('di', init.documentType);
                            //  init.model_wk = OA.common.DIMgr.getModelName('wk', init.documentType);
                            var oldinit = Ext.clone(OA.common.Global.getInitParas());
                            OA.common.Global.setInitParas(oldinit);


                            //更變selectItem
                            selectItem.getData().source.form = '書函';
                            selectItem.getData().source.model_di = OA.common.DIMgr.getModelName('di', selectItem.getData().source.form);
                            selectItem.getData().source.model_wk = OA.common.DIMgr.getModelName('wk', selectItem.getData().source.form);
                            var oldselectItem = Ext.clone(selectItem.getData());
                            selectItem.setData(oldselectItem);

                            if (segItems && segItems.length > 0) {
                                Ext.Array.each(segItems, function (item) {
                                    if (item.config && item.config.paperNo && item.config.paperNo == selectItem.raw.paperNo) {
                                        Ext.apply(item.config, oldselectItem.source)

                                    }
                                });
                            }

                            //更變vi文稿類型
                            Ext.Array.each(pages, function (p) {
                                if (p.代碼 == init.paperNo) {
                                    p.文稿類型 = "書函"
                                }
                            });
                            var oldCurrent = Ext.clone(OA.common.VIMgr.getCurrentEditionPapers());
                            OA.common.VIMgr.setCurrentEditionPapers(oldCurrent)

                            //更變InitParasList
                            var initparaslist = OA.common.Global.getInitParasList()[0];
                            initparaslist.documentType = '書函';
                            var oldinitparaslist = Ext.clone(OA.common.Global.getInitParasList());
                            OA.common.Global.setInitParasList(oldinitparaslist);


                            ctrWK.saveViReload();
                            //ctrWK.doSave({ action: 'save' });
                            me.hide();

                        } else {
                            return;
                        }
                    });
                } else if (selectItem.getData().source.form == '書函') {
                    Ext.Msg.confirm("提醒", "文稿類型「書函」轉換「函」，請確認？", function (ok) {
                        if (ok == 'yes') {

                            //更變CurrentWKContent
                            var wk = OA.common.Global.getCurrentWKContent();
                            wk.DocumentTemplate = '函稿';
                            wk.DocumentType = '函';
                            var oldWK = Ext.clone(OA.common.Global.getCurrentWKContent());
                            OA.common.Global.setCurrentWKContent(oldWK);


                            //更變InitParas
                            init.documentType = '函';
                            // init.model_di = OA.common.DIMgr.getModelName('di', init.documentType);
                            // init.model_wk = OA.common.DIMgr.getModelName('wk', init.documentType);
                            var oldinit = Ext.clone(OA.common.Global.getInitParas());
                            OA.common.Global.setInitParas(oldinit);


                            //更變selectItem
                            selectItem.getData().source.form = '函';
                            selectItem.getData().source.model_di = OA.common.DIMgr.getModelName('di', selectItem.getData().source.form);
                            selectItem.getData().source.model_wk = OA.common.DIMgr.getModelName('wk', selectItem.getData().source.form);
                            var oldselectItem = Ext.clone(selectItem.getData());
                            selectItem.setData(oldselectItem);

                            if (segItems && segItems.length > 0) {
                                Ext.Array.each(segItems, function (item) {
                                    if (item.config && item.config.paperNo && item.config.paperNo == selectItem.raw.paperNo) {
                                        Ext.apply(item.config, oldselectItem.source)

                                    }
                                });
                            }

                            //更變vi文稿類型
                            Ext.Array.each(pages, function (p) {
                                if (p.代碼 == init.paperNo) {
                                    p.文稿類型 = "函"
                                }
                            });
                            var oldCurrent = Ext.clone(OA.common.VIMgr.getCurrentEditionPapers());
                            OA.common.VIMgr.setCurrentEditionPapers(oldCurrent)

                            //更變InitParasList
                            var initparaslist = OA.common.Global.getInitParasList()[0];
                            initparaslist.documentType = '函';
                            var oldinitparaslist = Ext.clone(OA.common.Global.getInitParasList());
                            OA.common.Global.setInitParasList(oldinitparaslist);


                            ctrWK.saveViReload();
                            //ctrWK.doSave({ action: 'save' });
                            me.hide();
                        } else {
                            return;
                        }
                    });
                }else if (selectItem.getData().source.form == '簽') {
                    Ext.Msg.confirm("提醒", "文稿類型「簽」轉換「簡簽」，請確認？", function (ok) {
                        if (ok == 'yes') {

                            //更變CurrentWKContent
                            var wk = OA.common.Global.getCurrentWKContent();
                            wk.DocumentTemplate = '簡簽';
                            wk.DocumentType = '簡簽';
                            var oldWK = Ext.clone(OA.common.Global.getCurrentWKContent());
                            OA.common.Global.setCurrentWKContent(oldWK);


                            //更變InitParas
                            init.documentType = '簡簽';
                            // init.model_di = OA.common.DIMgr.getModelName('di', init.documentType);
                            // init.model_wk = OA.common.DIMgr.getModelName('wk', init.documentType);
                            var oldinit = Ext.clone(OA.common.Global.getInitParas());
                            OA.common.Global.setInitParas(oldinit);


                            //更變selectItem
                            selectItem.getData().source.form = '簡簽';
                            selectItem.getData().source.model_di = OA.common.DIMgr.getModelName('di', selectItem.getData().source.form);
                            selectItem.getData().source.model_wk = OA.common.DIMgr.getModelName('wk', selectItem.getData().source.form);
                            var oldselectItem = Ext.clone(selectItem.getData());
                            selectItem.setData(oldselectItem);

                            if (segItems && segItems.length > 0) {
                                Ext.Array.each(segItems, function (item) {
                                    if (item.config && item.config.paperNo && item.config.paperNo == selectItem.raw.paperNo) {
                                        Ext.apply(item.config, oldselectItem.source)

                                    }
                                });
                            }

                            //更變vi文稿類型
                            Ext.Array.each(pages, function (p) {
                                if (p.代碼 == init.paperNo) {
                                    p.文稿類型 = "簡簽"
                                }
                            });
                            var oldCurrent = Ext.clone(OA.common.VIMgr.getCurrentEditionPapers());
                            OA.common.VIMgr.setCurrentEditionPapers(oldCurrent)

                            //更變InitParasList
                            var initparaslist = OA.common.Global.getInitParasList()[0];
                            initparaslist.documentType = '簡簽';
                            var oldinitparaslist = Ext.clone(OA.common.Global.getInitParasList());
                            OA.common.Global.setInitParasList(oldinitparaslist);


                          //   var values = {
                          //       action: "add",
                          //       qFormat: '簡簽',
                          //       qIsNew: false,
                          //       qNumberWay: '1',
                          //       qTemplate: '簡簽',
                          //       qc: '2',
                          //       duplicate: true
                          //   };
                          //   var modelName = OA.common.DIMgr.getModelName('wk', selectItem.getData().source.form);
                          //   var record = Ext.create(modelName);
                          //   var fields = record.getFields().map['layout'].config.mapping();
                          //   var wk = OA.common.DIMgr.generateNewWK(fields, values);
                          //   OA.common.Global.setCurrentWKContent(wk);
                          //
                          //   var rs = Ext.clone(record.getProxy().getReader().readRecords(Ext.clone(wk)).getRecords()[0]);
                          //   rs.copyNotes = true;
                          //   var oSVG = OA.common.DIMgr.generateSvg(modelName, rs);
                          //   OA.common.Paper.main().saveKDRichTextBlock();
                          //   OA.common.Global.setCurrentViewModel(oSVG.vm);
                          //   console.log(oSVG.vm.KDRichTextBlockList)
                          //   var aaa = OA.common.Global.getCurrentViewModel()
                          //   aaa.KDRichTextBlockList = oSVG.vm.KDRichTextBlockList
                          //   console.log(aaa)
                          //   var oldaaa = Ext.clone(aaa);
                          //   OA.common.Global.setCurrentViewModel(oldaaa);
                          //
                          // //  OA.common.Global.setCurrentViewModel(oSVG.vm);
                          //
                          //   console.log(OA.common.Global.getCurrentWKContent())
                          //   console.log(OA.common.Global.getCurrentViewModel())
                          //   console.log(rs)
                          //   console.log(oSVG)


                            ctrWK.saveViReload();
                            //ctrWK.doSave({ action: 'save' });
                            me.hide();
                        } else {
                            return;
                        }
                    });
                }else if (selectItem.getData().source.form == '簡簽') {
                    Ext.Msg.confirm("提醒", "文稿類型「簡簽」轉換「簽」，請確認？", function (ok) {
                        if (ok == 'yes') {

                            //更變CurrentWKContent
                            var wk = OA.common.Global.getCurrentWKContent();
                            wk.DocumentTemplate = '簽';
                            wk.DocumentType = '簽';
                            var oldWK = Ext.clone(OA.common.Global.getCurrentWKContent());
                            OA.common.Global.setCurrentWKContent(oldWK);


                            //更變InitParas
                            init.documentType = '簽';
                            // init.model_di = OA.common.DIMgr.getModelName('di', init.documentType);
                            // init.model_wk = OA.common.DIMgr.getModelName('wk', init.documentType);
                            var oldinit = Ext.clone(OA.common.Global.getInitParas());
                            OA.common.Global.setInitParas(oldinit);


                            //更變selectItem
                            selectItem.getData().source.form = '簽';
                            selectItem.getData().source.model_di = OA.common.DIMgr.getModelName('di', selectItem.getData().source.form);
                            selectItem.getData().source.model_wk = OA.common.DIMgr.getModelName('wk', selectItem.getData().source.form);
                            var oldselectItem = Ext.clone(selectItem.getData());
                            selectItem.setData(oldselectItem);

                            if (segItems && segItems.length > 0) {
                                Ext.Array.each(segItems, function (item) {
                                    if (item.config && item.config.paperNo && item.config.paperNo == selectItem.raw.paperNo) {
                                        Ext.apply(item.config, oldselectItem.source)

                                    }
                                });
                            }

                            //更變vi文稿類型
                            Ext.Array.each(pages, function (p) {
                                if (p.代碼 == init.paperNo) {
                                    p.文稿類型 = "簽"
                                }
                            });
                            var oldCurrent = Ext.clone(OA.common.VIMgr.getCurrentEditionPapers());
                            OA.common.VIMgr.setCurrentEditionPapers(oldCurrent)

                            //更變InitParasList
                            var initparaslist = OA.common.Global.getInitParasList()[0];
                            initparaslist.documentType = '簽';
                            var oldinitparaslist = Ext.clone(OA.common.Global.getInitParasList());
                            OA.common.Global.setInitParasList(oldinitparaslist);



                            ctrWK.saveViReload();
                            //ctrWK.doSave({ action: 'save' });
                            me.hide();
                        } else {
                            return;
                        }
                    });
                } else {
                    Ext.Msg.alert("提示", "轉換文稿類型需為「函」、「書函」、「簽」、「簡簽」");
                    return;
                }
            } else { //文稿切換BAR跟FormPaperChange 文稿選擇不一樣時，會跑這段
                var segdoc = Ext.getCmp('segDocSelector');

                Ext.Array.forEach(segdoc.getItems().items, function (button) {

                    if (button.config && button.config.paperNo) {
                        if (button.config.paperNo + '' == selectItem.raw.paperNo + '') {

                            if (selectItem.getData().source.form == '函') {

                                ctrWK.onPaperTaggle(segdoc, button, true);    //先切換文稿，再做轉換文稿類型
                                Ext.getCmp('segDocSelector').setPressedButtons([button]);

                                Ext.Msg.confirm("提醒", "文稿類型「函」轉換成「書函」，請確認？", function (ok) {
                                    if (ok == 'yes') {
                                        //更變CurrentWKContent
                                        var wk = OA.common.Global.getCurrentWKContent();
                                        wk.DocumentTemplate = '書函';
                                        wk.DocumentType = '書函';
                                        var oldWK = Ext.clone(OA.common.Global.getCurrentWKContent());
                                        OA.common.Global.setCurrentWKContent(oldWK);


                                        //更變InitParas
                                        init.documentType = '書函';
                                        //  init.model_di = OA.common.DIMgr.getModelName('di', init.documentType);
                                        //  init.model_wk = OA.common.DIMgr.getModelName('wk', init.documentType);
                                        var oldinit = Ext.clone(OA.common.Global.getInitParas());
                                        OA.common.Global.setInitParas(oldinit);


                                        //更變selectItem
                                        selectItem.getData().source.form = '書函';
                                        selectItem.getData().source.model_di = OA.common.DIMgr.getModelName('di', selectItem.getData().source.form);
                                        selectItem.getData().source.model_wk = OA.common.DIMgr.getModelName('wk', selectItem.getData().source.form);
                                        var oldselectItem = Ext.clone(selectItem.getData());
                                        selectItem.setData(oldselectItem);

                                        if (segItems && segItems.length > 0) {
                                            Ext.Array.each(segItems, function (item) {
                                                if (item.config && item.config.paperNo && item.config.paperNo == selectItem.raw.paperNo) {
                                                    Ext.apply(item.config, oldselectItem.source)

                                                }
                                            });
                                        }

                                        //更變vi文稿類型
                                        Ext.Array.each(pages, function (p) {
                                            if (p.代碼 == init.paperNo) {
                                                p.文稿類型 = "書函"
                                            }
                                        });
                                        var oldCurrent = Ext.clone(OA.common.VIMgr.getCurrentEditionPapers());
                                        OA.common.VIMgr.setCurrentEditionPapers(oldCurrent)

                                        //更變InitParasList
                                        var initparaslist = OA.common.Global.getInitParasList()[0];
                                        initparaslist.documentType = '書函';
                                        var oldinitparaslist = Ext.clone(OA.common.Global.getInitParasList());
                                        OA.common.Global.setInitParasList(oldinitparaslist);


                                        ctrWK.saveViReload();
                                        //ctrWK.doSave({ action: 'save' });
                                        me.hide();

                                    } else {
                                        return;
                                    }
                                });
                            } else if (selectItem.getData().source.form == '書函') {

                                ctrWK.onPaperTaggle(segdoc, button, true);   //先切換文稿，再做轉換文稿類型
                                Ext.getCmp('segDocSelector').setPressedButtons([button]);

                                Ext.Msg.confirm("提醒", "文稿類型「書函」轉換「函」，請確認？", function (ok) {
                                    if (ok == 'yes') {

                                        //更變CurrentWKContent
                                        var wk = OA.common.Global.getCurrentWKContent();
                                        wk.DocumentTemplate = '函稿';
                                        wk.DocumentType = '函';
                                        var oldWK = Ext.clone(OA.common.Global.getCurrentWKContent());
                                        OA.common.Global.setCurrentWKContent(oldWK);


                                        //更變InitParas
                                        init.documentType = '函';
                                        // init.model_di = OA.common.DIMgr.getModelName('di', init.documentType);
                                        // init.model_wk = OA.common.DIMgr.getModelName('wk', init.documentType);
                                        var oldinit = Ext.clone(OA.common.Global.getInitParas());
                                        OA.common.Global.setInitParas(oldinit);


                                        //更變selectItem
                                        selectItem.getData().source.form = '函';
                                        selectItem.getData().source.model_di = OA.common.DIMgr.getModelName('di', selectItem.getData().source.form);
                                        selectItem.getData().source.model_wk = OA.common.DIMgr.getModelName('wk', selectItem.getData().source.form);
                                        var oldselectItem = Ext.clone(selectItem.getData());
                                        selectItem.setData(oldselectItem);

                                        if (segItems && segItems.length > 0) {
                                            Ext.Array.each(segItems, function (item) {
                                                if (item.config && item.config.paperNo && item.config.paperNo == selectItem.raw.paperNo) {
                                                    Ext.apply(item.config, oldselectItem.source)

                                                }
                                            });
                                        }

                                        //更變vi文稿類型
                                        Ext.Array.each(pages, function (p) {
                                            if (p.代碼 == init.paperNo) {
                                                p.文稿類型 = "函"
                                            }
                                        });
                                        var oldCurrent = Ext.clone(OA.common.VIMgr.getCurrentEditionPapers());
                                        OA.common.VIMgr.setCurrentEditionPapers(oldCurrent)


                                        //更變InitParasList
                                        var initparaslist = OA.common.Global.getInitParasList()[0];
                                        initparaslist.documentType = '函';
                                        var oldinitparaslist = Ext.clone(OA.common.Global.getInitParasList());
                                        OA.common.Global.setInitParasList(oldinitparaslist);


                                        ctrWK.saveViReload();
                                        //ctrWK.doSave({ action: 'save' });
                                        me.hide();
                                    } else {
                                        return;
                                    }
                                });
                            }else if (selectItem.getData().source.form == '簽') {

                                ctrWK.onPaperTaggle(segdoc, button, true);   //先切換文稿，再做轉換文稿類型
                                Ext.getCmp('segDocSelector').setPressedButtons([button]);

                                Ext.Msg.confirm("提醒", "文稿類型「簽」轉換「簡簽」，請確認？", function (ok) {
                                    if (ok == 'yes') {

                                        //更變CurrentWKContent
                                        var wk = OA.common.Global.getCurrentWKContent();
                                        wk.DocumentTemplate = '簡簽';
                                        wk.DocumentType = '簡簽';
                                        var oldWK = Ext.clone(OA.common.Global.getCurrentWKContent());
                                        OA.common.Global.setCurrentWKContent(oldWK);


                                        //更變InitParas
                                        init.documentType = '簡簽';
                                        // init.model_di = OA.common.DIMgr.getModelName('di', init.documentType);
                                        // init.model_wk = OA.common.DIMgr.getModelName('wk', init.documentType);
                                        var oldinit = Ext.clone(OA.common.Global.getInitParas());
                                        OA.common.Global.setInitParas(oldinit);


                                        //更變selectItem
                                        selectItem.getData().source.form = '簡簽';
                                        selectItem.getData().source.model_di = OA.common.DIMgr.getModelName('di', selectItem.getData().source.form);
                                        selectItem.getData().source.model_wk = OA.common.DIMgr.getModelName('wk', selectItem.getData().source.form);
                                        var oldselectItem = Ext.clone(selectItem.getData());
                                        selectItem.setData(oldselectItem);

                                        if (segItems && segItems.length > 0) {
                                            Ext.Array.each(segItems, function (item) {
                                                if (item.config && item.config.paperNo && item.config.paperNo == selectItem.raw.paperNo) {
                                                    Ext.apply(item.config, oldselectItem.source)

                                                }
                                            });
                                        }

                                        //更變vi文稿類型
                                        Ext.Array.each(pages, function (p) {
                                            if (p.代碼 == init.paperNo) {
                                                p.文稿類型 = "簡簽"
                                            }
                                        });
                                        var oldCurrent = Ext.clone(OA.common.VIMgr.getCurrentEditionPapers());
                                        OA.common.VIMgr.setCurrentEditionPapers(oldCurrent)


                                        //更變InitParasList
                                        var initparaslist = OA.common.Global.getInitParasList()[0];
                                        initparaslist.documentType = '簡簽';
                                        var oldinitparaslist = Ext.clone(OA.common.Global.getInitParasList());
                                        OA.common.Global.setInitParasList(oldinitparaslist);


                                        ctrWK.saveViReload();
                                        //ctrWK.doSave({ action: 'save' });
                                        me.hide();
                                    } else {
                                        return;
                                    }
                                });
                            }else if (selectItem.getData().source.form == '簡簽') {

                                ctrWK.onPaperTaggle(segdoc, button, true);   //先切換文稿，再做轉換文稿類型
                                Ext.getCmp('segDocSelector').setPressedButtons([button]);

                                Ext.Msg.confirm("提醒", "文稿類型「簡簽」轉換「簽」，請確認？", function (ok) {
                                    if (ok == 'yes') {

                                        //更變CurrentWKContent
                                        var wk = OA.common.Global.getCurrentWKContent();
                                        wk.DocumentTemplate = '簽';
                                        wk.DocumentType = '簽';
                                        var oldWK = Ext.clone(OA.common.Global.getCurrentWKContent());
                                        OA.common.Global.setCurrentWKContent(oldWK);


                                        //更變InitParas
                                        init.documentType = '簽';
                                        // init.model_di = OA.common.DIMgr.getModelName('di', init.documentType);
                                        // init.model_wk = OA.common.DIMgr.getModelName('wk', init.documentType);
                                        var oldinit = Ext.clone(OA.common.Global.getInitParas());
                                        OA.common.Global.setInitParas(oldinit);


                                        //更變selectItem
                                        selectItem.getData().source.form = '簽';
                                        selectItem.getData().source.model_di = OA.common.DIMgr.getModelName('di', selectItem.getData().source.form);
                                        selectItem.getData().source.model_wk = OA.common.DIMgr.getModelName('wk', selectItem.getData().source.form);
                                        var oldselectItem = Ext.clone(selectItem.getData());
                                        selectItem.setData(oldselectItem);

                                        if (segItems && segItems.length > 0) {
                                            Ext.Array.each(segItems, function (item) {
                                                if (item.config && item.config.paperNo && item.config.paperNo == selectItem.raw.paperNo) {
                                                    Ext.apply(item.config, oldselectItem.source)

                                                }
                                            });
                                        }

                                        //更變vi文稿類型
                                        Ext.Array.each(pages, function (p) {
                                            if (p.代碼 == init.paperNo) {
                                                p.文稿類型 = "簽"
                                            }
                                        });
                                        var oldCurrent = Ext.clone(OA.common.VIMgr.getCurrentEditionPapers());
                                        OA.common.VIMgr.setCurrentEditionPapers(oldCurrent)


                                        //更變InitParasList
                                        var initparaslist = OA.common.Global.getInitParasList()[0];
                                        initparaslist.documentType = '簽';
                                        var oldinitparaslist = Ext.clone(OA.common.Global.getInitParasList());
                                        OA.common.Global.setInitParasList(oldinitparaslist);


                                        ctrWK.saveViReload();
                                        //ctrWK.doSave({ action: 'save' });
                                        me.hide();
                                    } else {
                                        return;
                                    }
                                });
                            } else {
                                Ext.Msg.alert("提示", "轉換文稿類型需為「函」、「書函」、「簽」、「簡簽」");
                                return;
                            }
                        }
                    }
                });
            }
        } else {
            Ext.Msg.alert('提醒', '請選擇要轉換的文稿！');
        }
    }
});