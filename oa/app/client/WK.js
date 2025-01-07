/**
 * WK Client
 */

Ext.define('OA.client.WK', {
    alias: 'client.WK',
    singleton: true,
    requires: [
        'OA.common.UrlMgr', 'OA.model.wk.*', 'OA.common.FileMgr'
    ],
    config: {
        currentModelName: null,    //WK Model Name
        timerId: null
    },
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    /**
     * 執行模型 ， 異步返回 callback
     *
     * OA.common.DIMgr.asynExcute('OA.model.wk.Letter', '10300010001.di', function (xSVG, record) {})
     *
     * @param {String} options
     * @param {Function} callback
     */
    load: function (options, callback) {
        //console.log(options);
        var me = this;
        var modelName = options.model_wk;
        me.setCurrentModelName(modelName);
        var paras = OA.common.Global.getInitParas();
        paras.actionId = 'get';
        //console.log(options);
        //併列時另開，要換版次,但有時會影響唯讀模式取WK
        var qs = OA.common.Global.getQ();
        if (qs.app === 'check' && options.version && qs.showType !== 'ref' && qs.dialogType !== '3') {
            paras.version = options.version;
        }

        if (qs.app === 'check' && qs.showType == 'open') {
            paras.version = options.version;
        }


        //會辦簽WK會缺少版次，改抓DI的版次。
        if (qs.app == 'tidy' && options.model_wk == 'OA.model.wk.NotesOpinion') {
            var notesVersion = '';
            Ext.Array.each(paras.files, function (file) {
                if (file.fileType == 'DI') {
                    var start = file.fileName.lastIndexOf('_');
                    var end = file.fileName.lastIndexOf('.');
                    notesVersion = file.fileName.substring(start + 1, end);
                }
            });
            if (notesVersion != '') paras.version = notesVersion;
        }



        var client = Ext.create(modelName, paras);
        if (!client) {
            OA.common.Utils.error(modelName + " not found!!");
            Ext.callback(callback(null));
            return;
        }

        //記錄初始化參數list
        var isPush = true;
        var initparaslist = OA.common.Global.getInitParasList();
        Ext.Array.each(initparaslist, function (init) {
            if (init.paperNo == paras.paperNo && init.version == paras.version) isPush = false;
            return false;
        });
        if (isPush) initparaslist.push(Ext.apply({}, paras));

        var edition = OA.common.VIMgr.getCurrentEdition();
        var role = OA.common.Global.getCurrentRole();
        var dept = OA.common.Global.getCurrentDept();
        //Post wk/getData/  InitParas
        var url = OA.common.UrlMgr.restUrl('editor', 'wk');
        client.getProxy().setHeaders({
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        });
        client.getProxy().setUrl(url);
        client.getProxy().setExtraParams({ token: OA.common.UrlMgr.getToken() });
        client.getProxy().setTimeout(1800000);
        client.save({
            success: function (record, operation) {

                if (record.raw) OA.common.Global.setInitParas(record.raw);
                document.title = '公文簽核 v' + qs.v + '_' + paras.version;
                var isFllow = record.get('kind') == '來文';
                var reader = client.getProxy().getReader();
                var wk, oSVG, oWK, oldRd;
                if (isFllow) {
                    var hasDI = options.files && options.files[0] && options.files[0].fileType.toLowerCase() === 'di';

                    if (hasDI) {
                        var notDo = false;
                        try {
                            var di = B64.decode(reader.rawData.code);
                        } catch (ex) {
                            notDo = true;
                        }
                        if (reader.rawData.pdf) {
                            record.set('pdf', { fileType: 'PDF', fileContent: reader.rawData.pdf })
                            //有PDF就不處理來文DI
                            notDo = true;
                        }
                        oldRd = Ext.apply({}, reader);

                        if (!notDo) {
                            oWK = OA.common.DIMgr.ImportDI(di, { kind: record.get('kind') });
                            if (oWK.err) {
                                //Ext.Msg.alert('ERROR', oWK.err);
                                Ext.callback(callback(null, record));
                                return;
                            }
                            wk = oWK.wkContent;
                            OA.common.Global.setCurrentWKContent(wk);
                            oSVG = oWK.oSVG;
                        }
                    } else {
                        var file = (record.get('files')) ? record.get('files')[0] : [];
                        if (file.length == 0) {
                            Ext.callback(callback(oSVG, record));
                            return;
                        }
                        var isFollowPDF = file.fileType.toUpperCase() === 'PDF';
                        file.fileContent = reader.rawData.code;
                        if (isFollowPDF) {
                            oWK = OA.common.DIMgr.ImportDI(OA.common.DIMgr.generateNewNoteDI(), { kind: record.get('kind') });
                            wk = oWK.wkContent;
                            var docflow = OA.common.Global.getCurrentDocFlowRecord();
                            if (docflow) oWK.oSVG.vm.主旨 = docflow.get('title');

                            if (oWK.oSVG && oWK.oSVG.vm) {
                                oWK.oSVG.vm.年度 = reader.rawData.fsYear || '';
                                oWK.oSVG.vm.分類號 = reader.rawData.fsKindno || '';
                                oWK.oSVG.vm.案次號 = reader.rawData.caseno || '';
                                oWK.oSVG.vm.保存年限 = reader.rawData.fsYrlimit || '';
                                oWK.oSVG.vm.檔號 = oWK.oSVG.vm.年度 + '/' + oWK.oSVG.vm.分類號 + '/' + oWK.oSVG.vm.案次號;
                            }

                            OA.common.Global.setCurrentViewModel(oWK.oSVG.vm);
                            OA.common.Global.setCurrentWKContent(wk);
                            oSVG = null;
                            if (reader.rawData.pdf) {
                                record.set('pdf', { fileType: 'PDF', fileContent: reader.rawData.pdf });
                            }
                        } else {
                            if (reader && reader.rawData && reader.rawData.pdf) {
                                record.set('pdf', { fileType: 'PDF', fileContent: reader.rawData.pdf });
                            }
                            var notDo = false;
                            try {
                                var di = B64.decode(reader.rawData.code);
                            } catch (ex) {
                                notDo = true;
                            }
                            oldRd = Ext.apply({}, reader);

                            if (!notDo) {
                                oWK = OA.common.DIMgr.ImportDI(di, { kind: record.get('kind') });
                                if (oWK.err) {
                                    //Ext.Msg.alert('ERROR', oWK.err);
                                    Ext.callback(callback(null, record));
                                    return;
                                }
                                wk = oWK.wkContent;
                                OA.common.Global.setCurrentWKContent(wk);
                                oSVG = oWK.oSVG;
                            } else {
                                Ext.callback(callback(null, record));
                                return;
                            }
                        }
                    }

                    if (oSVG && oSVG.vm && oldRd && oldRd.rawData) {
                        oSVG.vm.年度 = oldRd.rawData.fsYear || '';
                        oSVG.vm.分類號 = oldRd.rawData.fsKindno || '';
                        oSVG.vm.案次號 = oldRd.rawData.caseno || '';
                        oSVG.vm.保存年限 = oldRd.rawData.fsYrlimit || '';
                        oSVG.vm.檔號 = oSVG.vm.年度 + '/' + oSVG.vm.分類號 + '/' + oSVG.vm.案次號;
                    }
                } else {
                    console.log(reader.rawData.data);
                    wk =  reader.rawData.data;                    
                    //遇到令，要補判斷DocumentTemplate確定格式
                    if (wk.DocumentType === '令') {
                        if (wk.DocumentTemplate !== '令' && wk.DocumentTemplate !== '會銜令') {
                            if (wk.DocumentTemplate === '獎懲令(1人格式)' || wk.DocumentTemplate === '獎懲令(多人格式)') {
                                wk.DocumentType = '獎懲令';
                            } else if (wk.DocumentTemplate === '派免令(1人格式)' || wk.DocumentTemplate === '派免令(多人格式)') {
                                wk.DocumentType = '派免令';
                            } else
                                wk.DocumentType = '受文者令';
                        }
                    }

                    //每次讀WK都要重塞發文文號
                    /*
                    if (wk) {
                        var tagText = OA.common.Utils.getTagText(wk, '發文字號');
                        if (tagText && tagText.childNodes && tagText.childNodes.length >= 4) {
                            var year = tagText.childNodes[1].Value || '';
                            var number = tagText.childNodes[2].Value || '';
                            var no = '';
                            if (Ext.isNumber(tagText.childNodes[3].Value)) {
                                no = tagText.childNodes[3].Value;
                            } else {
                                no = tagText.childNodes[3].Value || '';
                            }
                            var otSno = Ext.String.format('{0}{1}{2}', year, number, no);
                            //console.log(options);
                            if (otSno == ''||(number + '').length > 7) {
                                if (options && options.sendNo && (options.sendNo + '').length > 10) {
                                    
                                    year = (options.sendNo + '').substr(0, 3);
                                    var flow = (options.sendNo + '').substring(3);
                                    var count = flow.length;
;                                    var number = (flow+'').substring(0, count - 1);
                                    var no = (flow + '').substring(count - 1);

                                    tagText.childNodes[1].Value = year;
                                    tagText.childNodes[2].Value = number
                                    tagText.childNodes[3].Value = no;
                                    otSno = Ext.String.format('{0}{1}{2}', year, number, no);
                                }
                            }
                            //console.log(otSno);
                            if (otSno == '') {
                                wk.發文文號 = otSno;
                            } else {
                                wk.發文文號 = parseInt(otSno);
                            }                           
                            //console.log(wk);
                        }
                        if (dept && dept.depName) {
                            wk.depName = dept.depName;
                        }
                    }
                    */


                    //紙本直接清稿
                    //if (!OA.common.Utils.checkEpaper()) {
                    //    wk = OA.common.DIMgr.wkCleanUp(wk);
                    //    record = Ext.clone(reader.read(wk).getRecords()[0]);
                    //}                    

                    //2019.06.27_會辦單位，開啟會辦簽預設清稿，承辦文稿不清稿
                    if (OA.common.VIMgr.isParallel()) {
                        if (options.form == '會辦簽') {
                            wk = OA.common.DIMgr.wkCleanUp(wk);
                            record = Ext.clone(reader.read(wk).getRecords()[0]);
                        }
                    }
                    OA.common.Global.setCurrentWKContent(wk);
                    oSVG = OA.common.DIMgr.generateSvg(modelName, record);
                }
                if (oSVG) {
                    oSVG.vm.kind = record.get('kind');
                    oSVG.vm.layout = record.get('layout');
                    oSVG.vm.sendNo = options.sendNo;
                    //增加檢核VM檔號是否空白，如果空白再檢核record.data.json，有值則補入
                    if (oSVG.vm.檔號 != undefined && (oSVG.vm.檔號 + '').trim() == '') {
                        if (record.data.json) {
                            var vo = JSON.parse(record.data.json);
                            if (vo.odbf01VO) {
                                oSVG.vm.年度 = vo.odbf01VO.fsYear || '';
                                oSVG.vm.分類號 = vo.odbf01VO.fsKindno || '';
                                oSVG.vm.案次號 = vo.odbf01VO.caseno || '';
                                oSVG.vm.保存年限 = vo.odbf01VO.fsYrlimit || '';
                            }
                        }
                    }

                    OA.common.Global.setCurrentViewModel(oSVG.vm);
                }
                Ext.callback(callback(oSVG, record));
            },
            failure: function (record, operation) {
                var showErr = true;
                var backNull = true;
                if (operation.success == false) {
                    if (operation.getResponse()) {
                        var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                        if (faliureResponse && faliureResponse.code == '3004') {
                            if (record.data) {
                                if (record.data.dialogType && record.data.dialogType == '4') {
                                    if (record.data.version && record.data.version == '0') {
                                        if (record.data.files && record.data.files.length == 0) {
                                            showErr = false;
                                        }
                                    }
                                }
                            }
                        } else if (faliureResponse && faliureResponse.code == '3005') {//3005取不到WK版次，改抓上一個版次WK檔
                            var viList = OA.common.VIMgr.getViContent().版次;
                            if (viList && viList.length > 1) {

                                if (viList[0].版號 && viList[0].ParentVersion) {
                                    paras.version = viList[0].ParentVersion;
                                } else {
                                    paras.version = viList[1].ParentVersion;
                                }

                                var client = Ext.create(modelName, paras);
                                if (!client) {
                                    OA.common.Utils.error(modelName + " not found!!");
                                    Ext.callback(callback(null));
                                    return;
                                }
                                client.getProxy().setUrl(OA.common.UrlMgr.restUrl('wk', 'getData'));
                                client.getProxy().setExtraParams({ token: OA.common.UrlMgr.getToken() });
                                client.getProxy().setTimeout(1800000);
                                showErr = false;
                                backNull = false;
                                client.save({
                                    success: function (record, operation) {

                                        if (record.raw) OA.common.Global.setInitParas(record.raw);
                                        document.title = '公文簽核 v' + qs.v + '_' + paras.version;
                                        var isFllow = record.get('kind') == '來文';
                                        var reader = client.getProxy().getReader();
                                        var wk, oSVG, oWK, oldRd;
                                        if (isFllow) {
                                            var hasDI = options.files && options.files[0] && options.files[0].fileType.toLowerCase() === 'di';
                                            if (hasDI) {
                                                var di = B64.decode(reader.rawData.code);
                                                if (reader.rawData.pdf) {
                                                    record.set('pdf', { fileType: 'PDF', fileContent: reader.rawData.pdf })
                                                }
                                                oldRd = Ext.apply({}, reader);

                                                oWK = OA.common.DIMgr.ImportDI(di, { kind: record.get('kind') });
                                                if (oWK.err) {
                                                    //Ext.Msg.alert('ERROR', oWK.err);
                                                    Ext.callback(callback(null, record));
                                                    return;
                                                }
                                                wk = oWK.wkContent;
                                                OA.common.Global.setCurrentWKContent(wk);
                                                oSVG = oWK.oSVG;
                                            } else {
                                                var file = (record.get('files')) ? record.get('files')[0] : [];
                                                if (file.length == 0) {
                                                    Ext.callback(callback(oSVG, record));
                                                    return;
                                                }
                                                var isFollowPDF = file.fileType.toUpperCase() === 'PDF';
                                                file.fileContent = reader.rawData.code;
                                                if (isFollowPDF) {
                                                    oWK = OA.common.DIMgr.ImportDI(OA.common.DIMgr.generateNewNoteDI(), { kind: record.get('kind') });
                                                    wk = oWK.wkContent;
                                                    var docflow = OA.common.Global.getCurrentDocFlowRecord();
                                                    if (docflow) oWK.oSVG.vm.主旨 = docflow.get('title');

                                                    if (oWK.oSVG && oWK.oSVG.vm) {
                                                        oWK.oSVG.vm.年度 = reader.rawData.fsYear || '';
                                                        oWK.oSVG.vm.分類號 = reader.rawData.fsKindno || '';
                                                        oWK.oSVG.vm.案次號 = reader.rawData.caseno || '';
                                                        oWK.oSVG.vm.保存年限 = reader.rawData.fsYrlimit || '';
                                                        oWK.oSVG.vm.檔號 = oWK.oSVG.vm.年度 + '/' + oWK.oSVG.vm.分類號 + '/' + oWK.oSVG.vm.案次號;
                                                    }

                                                    OA.common.Global.setCurrentViewModel(oWK.oSVG.vm);
                                                    OA.common.Global.setCurrentWKContent(wk);
                                                    oSVG = null;
                                                    if (reader.rawData.pdf) {
                                                        record.set('pdf', { fileType: 'PDF', fileContent: reader.rawData.pdf });
                                                    }
                                                } else {
                                                    di = B64.decode(reader.rawData.code);
                                                    oWK = OA.common.DIMgr.ImportDI(di, { kind: record.get('kind') });
                                                    oSVG = oWK.oSVG;
                                                    wk = oWK.wkContent;
                                                    OA.common.Global.setCurrentWKContent(wk);
                                                }
                                            }

                                            if (oSVG && oSVG.vm && oldRd && oldRd.rawData) {
                                                oSVG.vm.年度 = oldRd.rawData.fsYear || '';
                                                oSVG.vm.分類號 = oldRd.rawData.fsKindno || '';
                                                oSVG.vm.案次號 = oldRd.rawData.caseno || '';
                                                oSVG.vm.保存年限 = oldRd.rawData.fsYrlimit || '';
                                                oSVG.vm.檔號 = oSVG.vm.年度 + '/' + oSVG.vm.分類號 + '/' + oSVG.vm.案次號;
                                            }
                                        } else {
                                            //console.log(reader.rawData);
                                            //console.log(record);
                                            wk = reader.rawData;
                                            //遇到令，要補判斷DocumentTemplate確定格式
                                            if (wk.DocumentType === '令') {
                                                if (wk.DocumentTemplate !== '令' && wk.DocumentTemplate !== '會銜令') {
                                                    if (wk.DocumentTemplate === '獎懲令(1人格式)' || wk.DocumentTemplate === '獎懲令(多人格式)') {
                                                        wk.DocumentType = '獎懲令';
                                                    } else if (wk.DocumentTemplate === '派免令(1人格式)' || wk.DocumentTemplate === '派免令(多人格式)') {
                                                        wk.DocumentType = '派免令';
                                                    } else
                                                        wk.DocumentType = '受文者令';
                                                }
                                            }

                                            /*
                                            //每次讀WK都要重塞發文文號
                                            if (wk) {
                                                var tagText = OA.common.Utils.getTagText(wk, '發文字號');
                                                if (tagText && tagText.childNodes && tagText.childNodes.length >= 4) {
                                                    var year = tagText.childNodes[1].Value || '';
                                                    var number = tagText.childNodes[2].Value || '';
                                                    var no = '';
                                                    if (Ext.isNumber(tagText.childNodes[3].Value)) {
                                                        no = tagText.childNodes[3].Value;
                                                    } else {
                                                         no = tagText.childNodes[3].Value || '';
                                                    }
                                                   
                                                    var otSno = Ext.String.format('{0}{1}{2}', year, number, no);
                                                    //console.log(options);
                                                    if (otSno == '' || (number+'').length>7) {
                                                        if (options && options.sendNo && (options.sendNo + '').length > 10) {

                                                            year = (options.sendNo + '').substr(0, 3);
                                                            var flow = (options.sendNo + '').substring(3);
                                                            var count = flow.length;
                                                            var number = (flow + '').substring(0, count - 1);
                                                            var no = (flow + '').substring(count - 1);

                                                            tagText.childNodes[1].Value = year;
                                                            tagText.childNodes[2].Value = number
                                                            tagText.childNodes[3].Value = no;
                                                            otSno = Ext.String.format('{0}{1}{2}', year, number, no);
                                                        }
                                                    }
                                                    //console.log(otSno);
                                                    if (otSno == '') {
                                                        wk.發文文號 = otSno;
                                                    } else {
                                                        wk.發文文號 = parseInt(otSno);
                                                    }
                                                    //console.log(wk);
                                                }
                                                if (dept && dept.depName) {
                                                    wk.depName = dept.depName;
                                                }
                                            }
                                            */

                                            //評議中心套非即時修訂版本_直接清稿
                                            //if (!OA.common.Utils.checkEpaper()) {
                                            //    wk = OA.common.DIMgr.wkCleanUp(wk);
                                            //    record = Ext.clone(reader.read(wk).getRecords()[0]);
                                            //}


                                            //2019.06.27_會辦單位，開啟會辦簽預設清稿，承辦文稿不清稿
                                            //if (OA.common.VIMgr.isParallel()) {
                                            //    if (options.form == '會辦簽') {
                                            //        wk = OA.common.DIMgr.wkCleanUp(wk);
                                            //        record = Ext.clone(reader.read(wk).getRecords()[0]);
                                            //    }
                                            //}

                                            OA.common.Global.setCurrentWKContent(wk);
                                            oSVG = OA.common.DIMgr.generateSvg(modelName, record);
                                        }
                                        if (oSVG) {
                                            oSVG.vm.kind = record.get('kind');
                                            oSVG.vm.layout = record.get('layout');
                                            oSVG.vm.sendNo = options.sendNo;
                                            //增加檢核VM檔號是否空白，如果空白再檢核record.data.json，有值則補入
                                            if (oSVG.vm.檔號 != undefined && (oSVG.vm.檔號 + '').trim() == '') {
                                                if (record.data.json) {
                                                    var vo = JSON.parse(record.data.json);
                                                    if (vo.odbf01VO) {
                                                        oSVG.vm.年度 = vo.odbf01VO.fsYear || '';
                                                        oSVG.vm.分類號 = vo.odbf01VO.fsKindno || '';
                                                        oSVG.vm.案次號 = vo.odbf01VO.caseno || '';
                                                        oSVG.vm.保存年限 = vo.odbf01VO.fsYrlimit || '';
                                                    }
                                                }
                                            }

                                            OA.common.Global.setCurrentViewModel(oSVG.vm);
                                        }
                                        Ext.callback(callback(oSVG, record));
                                    },
                                    failure: function (record, operation) {
                                        showErr = true;
                                        backNull = true;
                                    }
                                });
                            }
                        }
                    }
                    if (showErr)
                        Ext.Msg.show({ message: '連線不正確' + OA.common.UrlMgr.restUrl('wk', 'getData'), buttons: Ext.MessageBox.YES });
                }
                if (showErr) {
                    if (operation.getResponse()) {
                        var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                        var message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                        Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                        record.set('error', faliureResponse);
                    }
                }
                if (backNull)
                    Ext.callback(callback(null, record));
            }

        });
    },
    excute: function (options, callback) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var isDestop = Ext.os.deviceType === 'Desktop';
        var doOffline = (qs.app === 'editor' || qs.app === 'draft' || qs.app === 'offline' || qs.sFlag === 'Y') && isDestop;
        var status = OA.common.Paper.getActiveStatus();
        var paras = OA.common.InitParas.doWK(options);
        paras.status = status;
        //增加是否含發文文稿及數量給管理（'canSend','sendCnt'）
        var canSend = 'N';
        var sendCnt = 0;
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        if (ctrWK) {
            var pages = OA.common.VIMgr.getCurrentEditionPapers();
            //console.log(pages);
            if (pages) {
                var canSendDocs = ['函', '書函', '開會通知單', '箋函', '電子信箱回覆函'];
                Ext.Array.each(pages, function (page) {
                    if (page.名稱 && page.名稱 != '來文') {
                        if (page.文稿類型) {
                            if (canSendDocs.indexOf(page.文稿類型) != -1) {
                                canSend = 'Y';
                                sendCnt++
                            }
                        }
                    }
                })
            }
        }

        var signText = '';
        var papers = OA.common.VIMgr.getCurrentEditionPapers();
        if (papers) {
            Ext.Array.each(papers, function (doc) {
                if (doc.名稱 !== '來文') {
                    if (doc.批示意見 && doc.批示意見.content && (doc.批示意見.content + '').trim() != '') {
                        if ((signText + '').trim() == '') {
                            signText = (doc.批示意見.content + '').trim();
                        } else {
                            signText = signText + ';' + (doc.批示意見.content + '').trim();
                        }
                    }
                }
            })
        }

        paras.canSend = canSend;
        paras.sendCnt = sendCnt;

        if (signText != '') {
            paras.signText = signText;
        }

        //console.log(paras);

        // console.log('doSave... ' + options.action);
        // console.log(Ext.clone(paras));

        // console.log(B64.decode(Ext.clone(paras).files[3].fileContent));
        // var wk = OA.common.Global.getCurrentWKContent();
        // console.log(Ext.clone(wk));
        // if (options.action == 'upload' ) return;

        // return;

        if (doOffline) {
            if (options.action == 'upload') {
                OA.common.UrlMgr.setToken('debug');

                if (qs.app === 'offline') {
                    OA.common.FileMgr.upload(function (ret) {
                        ret.status = 'create';
                        me.excuteOnline(ret, function () {
                            if (callback) callback(ret);
                        });
                    });
                } else if (qs.app === 'editor') {
                    OA.common.FileMgr.upload(function (ret) {
                        if (callback) callback(ret);
                    });
                }

                return;
            } else if (options.action == 'create') {
                paras.status = 'create';
                if (qs.app == 'draft' && paras.attachs.length > 0) {
                    Ext.Viewport.setMasked({ xtype: 'loadmask', message: '附件處理中...' });
                    var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
                    if (menuLeft) menuLeft.setMasked(true);
                    var int = paras.attachs.length - 1;
                    Ext.Array.each(paras.attachs, function (draftAtt, index) {
                        if (!draftAtt.fileContent) {
                            OA.client.Attach.loadDraftfFileContent(draftAtt, function (att) {
                                if (att.fileContent) {
                                    draftAtt.fileContent = att.fileContent;
                                    if (index == int) {
                                        me.excuteOnline(paras, function (ret) {
                                            if (callback) callback(ret);
                                        });
                                    }
                                }

                            });
                        } else {

                            if (index == int) {
                                me.excuteOnline(paras, function (ret) {
                                    if (callback) callback(ret);
                                });
                            }
                        }
                    })
                } else {
                    me.excuteOnline(paras, function (ret) {
                        if (callback) callback(ret);
                    });
                }
                return
            } else if (options.action == 'draft' || qs.app == 'draft') {
                paras.status = 'draft';
                //console.log(paras)
                if (paras.attachs.length > 0) {
                    Ext.Viewport.setMasked({ xtype: 'loadmask', message: '附件處理中...' });
                    var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
                    if (menuLeft) menuLeft.setMasked(true);
                    var int = paras.attachs.length - 1;
                    Ext.Array.each(paras.attachs, function (draftAtt, index) {
                        if (!draftAtt.fileContent) {
                            OA.client.Attach.loadDraftfFileContent(draftAtt, function (att) {
                                if (att.fileContent) {
                                    draftAtt.fileContent = att.fileContent;
                                    if (index == int) {
                                        me.excuteOnline(paras, function () {
                                            if (callback) callback(paras);
                                        });
                                    }
                                }

                            });
                        } else {

                            if (index == int) {
                                me.excuteOnline(paras, function () {
                                    if (callback) callback(paras);
                                });
                            }
                        }
                    })

                } else {
                    me.excuteOnline(paras, function () {
                        if (callback) callback(paras);
                    });
                }
                return;
            } 

            me.excuteOffline(paras);

            //要鎖畫面
            Ext.Viewport.setMasked(true);
            var menuLeft = Ext.Viewport.getMenus().left;
            if (menuLeft) menuLeft.setMasked(true);
            if (options.action == 'saveas') {
                OA.common.FileMgr.saveas(options, function (ret) {
                    if (callback) callback(ret);
                });
            } else {
                var openFolder = OA.common.FileMgr.getOpenDialogPath();
                var fileOptions = { toPath: openFolder, attachs: options.attachs };
                OA.common.FileMgr.save(fileOptions, function (ret) {
                    if (callback) callback(ret);
                });
            }
            return;
        }

        if (options.action == 'add') {
            paras.status = 'add';
        }
        me.excuteOnline(paras, callback);
    },
    // 執行保存等操作
    excuteOnline: function (paras, callback) {
        var me = this;
        var status = paras.status;
        paras.actionId = status
        var modelName = me.getCurrentModelName();

        var client = Ext.create(modelName, paras);
        if (!client) {
            OA.common.Utils.error(modelName + " not found!!");
            Ext.callback(callback(null));
            return;
        }
        // 根據操作類型設置 URL 和 HTTP 方法
        const urlId = status === 'draft' ? 'draft' : 'wk';
        const url = OA.common.UrlMgr.restUrl('editor', urlId);
        // 設置代理 URL 和方法
        client.getProxy().setUrl(url);
        client.getProxy().setExtraParams({ token: OA.common.UrlMgr.getToken() });
        client.getProxy().setTimeout(90000);
        client.getProxy().setHeaders({
            'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        });

        // 執行相應方法
        if (status === 'create' || status === 'update' || status === 'add'  || status === 'draft' || status === 'saved') {
            client.save({
                success: function (record, operation) {
                    if (status !== 'saved') OA.common.Global.setRefreshDocflow(record);
                    OA.common.Paper.setActiveStatus('saved');
                    if (callback) callback(record.data);
                },
                failure: function (record, operation) {
                    var message = '操作失敗!';
                    if (operation.getResponse()) {
                        var failureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                        message = failureResponse.message + ' Error Code: ' + failureResponse.code;
                    }
                    Ext.Msg.alert('錯誤', message);
                    Ext.Viewport.setMasked(false);
                }
            });
        } else if (status === 'delete') {
            client.erase({
                success: function () {
                    if (callback) callback(true);
                    else Ext.Msg.alert('刪除成功!');
                },
                failure: function (record, operation) {
                    Ext.Msg.alert('刪除失敗!', '操作失敗！');
                    Ext.Viewport.setMasked(false);
                }
            });
        } else if (status === 'read') {
            client.load({
                callback: function (records, operation, success) {
                    if (success && callback) callback(records);
                    else Ext.Msg.alert('讀取失敗!', '無法獲取數據');
                }
            });
        }
    },

    excuteOffline: function (paras) {
        var status = OA.common.Paper.getActiveStatus();
        var qs = OA.common.Global.getQ();
        if (status === 'add') {
            paras.qIsNew = false;
            OA.common.VIMgr.create(paras);
        }
        var papers = paras;
        var vi = OA.common.VIMgr.getViContent();
        if (vi) {
            vi.版次[0].簽核文件夾.預設開啟文稿 = paras.paperNo;
            papers = vi.版次[0].簽核文件夾.文稿;
            if (qs && qs.sFlag === 'Y') {
                Ext.Array.each(vi.版次, function (vs) {
                    if (vs.版號 == paras.version) {
                        vs.簽核文件夾.預設開啟文稿 = paras.paperNo
                        papers = vs.簽核文件夾.文稿;
                    }
                });
            }
        }
        if (!papers.length) papers = [papers];
        var paper = papers.where("( el, i, res, param ) => el.代碼==" + paras.paperNo)[0];

        var attachList = [], attachRef = [], attachBig = [];
        var store = Ext.getStore('Attach');
        store.clearFilter();
        store.filterBy(function (rec) {
            return (rec.data.file.status != '0');
        });
        Ext.Array.each(store.data.all, function (p) {
            var f = p.get('file');
            var item = {
                ID: padLeft(OA.common.Utils.getRandom(0, 9999999999), 10),
                jobNo: paras.jobNo,
                名稱: f.fileKey,
                Src: f.fileName,
                檔案格式: f.fileType,
                empNo: paras.empNo,
                status: f.status,
                empName: f.status == '1' ? f.personnel : '',
                depName: f.depName,
                version: paras.version,
                uploadTime: f.status == '1' ? f.operateTime : '',
                delEmpNo: f.status == '0' ? paras.empNo : '',
                delEmpName: f.status == '0' ? f.personnel : '',
                delVersion: f.status == '0' ? paras.version : '',
                delTime: f.status == '0' ? f.operateTime : '',
                fileSize: f.fileSize,
                addTime: f.addTime || '',
                addDepName: f.addDepName || '',
                addEmpName: f.addEmpName || '',
                reTime: f.reTime || '',
                reDepName: f.reDepName || '',
                reEmpName: f.reEmpName || '',
                filePath: f.filePath || ''
            };
            if (f.folderName == "attach") {
                attachList.push(item);
            } else if (f.folderName == "ref") {
                attachRef.push(item);
            } else if (f.folderName == "big") {
                attachBig.push(item);
            }
        });
        //store.each(function (p) {
        //    var f = p.get('file');
        //    var item = {
        //        ID: padLeft(OA.common.Utils.getRandom(0, 9999999999), 10),
        //        jobNo: paras.jobNo,
        //        名稱: f.fileKey,
        //        Src: f.fileName,
        //        檔案格式: f.fileType,
        //        empNo: paras.empNo,
        //        status: f.status,
        //        empName: f.status == '1' ? f.personnel : '',
        //        depName: f.depName,
        //        version: paras.version,
        //        uploadTime: f.status == '1' ? f.operateTime : '',
        //        delEmpNo: f.status == '0' ? paras.empNo : '',
        //        delEmpName: f.status == '0' ? f.personnel : '',
        //        delVersion: f.status == '0' ? paras.version : '',
        //        delTime: f.status == '0' ? f.operateTime : '',
        //        fileSize: f.fileSize,
        //        addTime: f.addTime || '',
        //        addDepName: f.addDepName || '',
        //        addEmpName: f.addEmpName || '',
        //        reTime: f.reTime || '',
        //        reDepName: f.reDepName || '',
        //        reEmpName: f.reEmpName || '',
        //        filePath: f.filePath || ''
        //    };
        //    if (f.folderName == "attach") {
        //        attachList.push(item);
        //    } else if (f.folderName == "ref") {
        //        attachRef.push(item);
        //    } else if (f.folderName == "big") {
        //        attachBig.push(item);
        //    }
        //});

        //附件如刪除要更新回去
        if (paper) {
            paper.檔案清單.附件清單.附件 = attachList.length > 0 ? attachList : undefined;
            paper.檔案清單.附件清單.參考附件 = attachRef.length > 0 ? attachRef : undefined;
            paper.檔案清單.附件清單.大型附件 = attachBig.length > 0 ? attachBig : undefined;
        }
    },
    /**
     */
    createPaper: function (model, previewMode, callback) {
        OA.client.WK.load({ model_wk: model }, function (oSVG, record) {
            var qs = OA.common.Global.getQ();
            var vm = OA.common.Global.getCurrentViewModel();
            if (Ext.getCmp('attachTitle')) Ext.getCmp('attachTitle').setHidden(true);
            var ctr = OA.common.Paper.main();     //get OA.components.Paper
            var paras = {
                wkContent: OA.common.Global.getCurrentWKContent(),
                oSVG: oSVG,
                fields: record.get('layout')
            };
            ctr.createByParas(paras, previewMode);
            if (callback) Ext.callback(callback());
        });
    },
    /**
     */
    createTidy: function (options, callback) {
        var me = this;
        var ctrPaper = OA.common.Paper.main();     //get OA.components.Paper
        if (options.mode === 'Opinion') { //意見欄
            var oXML = OA.common.DIMgr.generateTidyOpinion2(options);
            ctrPaper.createByParas({ oSVG: oXML }, 'Opinion');
            if (callback) Ext.callback(callback());
        } else { //會辦簽
            if (!options.paperNo) {
                if (callback) Ext.callback(callback());
                return;
            }
            var overriteData = { model_wk: options.model_wk, isClearWK: true };//會核單要清稿
            if (options.version) overriteData.version = options.version;

            me.load(overriteData, function (oSVG, record) {
                if (Ext.getCmp('attachTitle')) Ext.getCmp('attachTitle').setHidden(true);
                var paras = {
                    wkContent: OA.common.Global.getCurrentWKContent(),
                    oSVG: oSVG,
                    fields: record.get('layout')
                };
                ctrPaper.createByParas(paras, 'ClearDraft');
                if (callback) Ext.callback(callback());
            });
        }
    },
    /**
     * 自動儲存
     */
    autoSaveStart: function (callback) {
        var me = this;
        OA.client.Localforage.getSetting(function (data) {
            if (!data) return;
            if (!data.autoSave) {
                me.autoSaveStop();
                return;
            }
            var interal = data.autoSave * 1000 * 60; //autoSave 分鐘
            if (interal == 0) return;

            function doTimer() {
                var timerId = Ext.Function.defer(doTimer, interal);
                me.setTimerId(timerId);
                if (callback) callback();
            }

            Ext.Function.defer(doTimer, interal);
        });
    },
    /**
     * 停止自動儲存
     */
    autoSaveStop: function () {
        clearTimeout(this.getTimerId());
    },
    loadTemplate: function (templateUrl, callback) {
        var qs = OA.common.Global.getQ();
        if (typeof require !== 'undefined') {
            var fs = require('fs');
            var path = require('path');
            var url = path.join(__dirname, '../' + templateUrl);
            var str = fs.readFileSync(url, 'utf8')
            if (callback) callback(str);
        } else {
            Ext.Ajax.request({
                url: templateUrl,
                withCredentials: true,
                useDefaultXhrHeader: false,
                success: function (response) {
                    if (callback) callback(response.responseText)
                }
            });
        }
    },
    openTemplate: function (url) {
        var vm = OA.common.Global.getCurrentViewModel();
        var qs = OA.common.Global.getQ();
        if (!url) return;
        if (qs.app === 'offline') {

            var path = require('path');
            url = path.join(__dirname, '../web/' + url);

            window.open(url);

            //TODO:採直接開啟
            // var shell = require('electron').shell;
            // var remote = require('electron').remote;
            // var app = remote.app;
            // var fs = require('fs');
            // var tmp = path.join(app.getPath('temp', 'file'));
            // var ws = fs.createWriteStream(tmp);
            // fs.createReadStream(url).pipe(ws);
            // ws.on('finish',function(){
            //     shell.openItem(tmp);
            // });
            // var a =path.join(__dirname, '../web/', url);
            // var spawn = require('child_process').spawn;
            // var child = spawn(a);
        } else {
            window.open('template/' + url);
        }
    }
});