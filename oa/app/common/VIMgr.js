/**
 * VIMgr
 */
Ext.define('OA.common.VIMgr', {
    alias: 'common.VIMgr',
    singleton: true,
    ACTIONS: {
        FORWARD: 1,
        APPROVE: 2,
        BACKWARD: 3,
        READ: 4,
        PARALLEL: 5,
        DOCEDIT: 6,
        DOCDELETE: 7,
        DOCSEND: 8,
        DOCUPLOAD: 9,
        EXCHANGE: 10,
        properties: {
            1: { name: 'flowlist', value: 1, code: '送陳/會', group: 'sign' },
            2: { name: 'approve', value: 2, code: '決行', group: 'sign' },
            3: { name: 'backward', value: 3, code: '退文', group: 'sign' },
            4: { name: 'read', value: 4, code: '覆閱', group: 'sign' },
            5: { name: 'parallel', value: 5, code: '會畢', group: 'sign' },
            6: { name: 'docEdit', value: 6, code: '編輯', group: 'sign' },
            7: { name: 'docDelete', value: 7, code: '刪除文稿', group: 'doc' },
            8: { name: 'docSend', value: 8, code: '發文', group: 'doc' },
            9: { name: 'docUpload', value: 9, code: '取號', group: 'doc' },
            10: { name: 'exchange', value: 10, code: '轉交換', group: 'doc' },
            11: { name: 'tempsend', value: 11, code: '暫送', group: 'sign' },  //與送陳相近，不提示下一關
            12: { name: 'sealDone', value: 12, code: '監印完畢', group: 'sign' },
            13: { name: 'backDraft', value: 13, code: '退稿', group: 'sign' },
            14: { name: 'flowlist', value: 14, code: '變更流程', group: 'sign' },
            15: { name: 'readlist', value: 15, code: '變更複閱', group: 'sign' }
        },

        //目前depno 與 odcf01.ac_deptno 相同 ,  odbf01.io_deplno
        //承辦人：送陳
        //主管：會畢、決行、送陳
        order: {
            '18': [2, 1, 3, 6, 14, 5, 4, 7, 10, 8],
            '17': [2, 1, 3, 6, 14, 15, 5, 4, 10, 8],
            '15': [6, 11, 3],
            '16': [2, 1, 3, 11, 14, 15, 6, 5, 4],
            '02': [8, 10, 12, 13, 3]
        }
    },
    TEMPLATE: {
        vi: {
            "作業版本": '0',
            "簽收": {
                "docType": "C60",
                "actionName": "創稿待辦"
            },
            "作業文號": "",
            "版次": [
                {
                    "彙併案資訊": {
                        "是否為彙併案": "否"
                    },
                    "最後更新時間": "104/12/23 11:23:06",
                    "版號": 0,
                    "簽核文件夾": {
                        "預設開啟文稿": 1,
                        "文稿": {
                            "文稿類型": "開會通知單",
                            "檔案清單": {
                                "附件清單": {
                                    "附件": [
                                        // {
                                        //     "status": 1,
                                        //     "delVersion": "",
                                        //     "Src": "XC0099934011439993071.pdf",
                                        //     "empNo": "ed01",
                                        //     "delEmpNo": "",
                                        //     "delTime": "",
                                        //     "delEmpName": "",
                                        //     "version": "",
                                        //     "empName": "測試自然人1",
                                        //     "名稱": "電子公文節能減紙續階方案(103.03修訂).pdf",
                                        //     "ID": 1143999307,
                                        //     "jobNo": "",
                                        //     "uploadTime": "104/12/23 11:22:55",
                                        //     "檔案格式": "pdf"
                                        // }
                                    ]
                                },
                                "檔案": [
                                    {
                                        "種類": "本文",
                                        "Src": "1.di",
                                        "名稱": "1.di",
                                        "ID": "",
                                        "fileNo": "",
                                        "檔案格式": "DI"
                                    },
                                    {
                                        "種類": "SW",
                                        "Src": "1.sw",
                                        "名稱": "1.sw",
                                        "ID": "",
                                        "fileNo": "",
                                        "檔案格式": "SW"
                                    }
                                ]
                            },
                            "發文文號": "",
                            "名稱": "創稿",
                            "來文時戳": "",
                            "代碼": 1,
                            "排序": 1
                        },
                        "公文文號": ""
                    },
                    "isTemp": "Y"
                }
            ],
            "入徑": {
                "大型附件": "DOCMAKER/104/XC00999340/0000/10412342852/big",
                "參考附件": "DOCMAKER/104/XC00999340/0000/1041234852/refAttach",
                "附件": "DOCMAKER/104/XC00999340/0000/1041234852/attach"
            }
        },
        sFlagvi: {
            "作業版本": '0',
            "簽收": {
                "docType": "C60",
                "actionName": "創稿待辦"
            },
            "作業文號": "",
            "版次": [
                {
                    "彙併案資訊": {
                        "是否為彙併案": "否"
                    },
                    "最後更新時間": "104/12/23 11:23:06",
                    "版號": 0,
                    "簽核文件夾": {
                        "預設開啟文稿": 1,
                        "文稿": {
                            "文稿類型": "函",
                            "檔案清單": {
                                "附件清單": {
                                    "附件": [
                                    ]
                                },
                            },
                            "發文文號": "",
                            "名稱": "來文",
                            "來文時戳": "",
                            "代碼": 0,
                            "排序": 0
                        },
                        "公文文號": ""
                    },
                    "isTemp": "Y"
                }
            ],
            "入徑": {
                "大型附件": "DOCMAKER/104/XC00999340/0000/1041234852/big",
                "參考附件": "DOCMAKER/104/XC00999340/0000/1041234852/refAttach",
                "附件": "DOCMAKER/104/XC00999340/0000/1041234852/attach"
            }
        }
    },
    config: {
        viContent: null,        //整個VI
        currentEdition: null,   //目前的工作版次
        currentEditionFiles: null,
        currentEditionPapers: null,
        currentEditionSugList: null,
        everSign: false,
        historyVersion: '',
        paperNo: '',
        addBtn: false
    },
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },
    /*
     簽核文件夾,簽核人員,線上簽核資訊
     */
    load: function (o) {
        console.log(o);
        var me = this;
        var qs = OA.common.Global.getQ();
        var FlowRecord = OA.common.Global.getCurrentDocFlowRecord();
        var isEpaper = true;
        if (FlowRecord) {
            var Flowepaper = FlowRecord.get('epaper');
            if (Flowepaper === 'N') isEpaper = false;
        } else {
            if (qs.epaper === 'N') isEpaper = false;
        }

        //修正VI檔內

        OA.common.VIMgr.setViContent(o);
        //console.log(o);
        var version = o.作業版本;
        if (qs.sFlag === 'Y')
            version = '0';
        var items = me.doEdition(version);
        me.editionList(version);
        me.setHistoryStore(o);
        me.setSuggestionStore(o);
        return items;
    },
    /*
     處理版次
     */
    doEdition: function (version) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var o = OA.common.VIMgr.getViContent();
        if (!version || version == '原稿') version = 0;


        //if (qs.app == 'draft') {
        if (!Ext.isArray(o.版次)) {
            o.版次 = [o.版次];
        }
        //}

        var canSendDocs = ['函', '書函', '開會通知單', '箋函', '電子信箱回覆函'];
        Ext.Array.each(o.版次, function (oi) {
            //console.log(oi);
            if (oi.簽核文件夾 && oi.簽核文件夾.文稿) {
                if (Ext.isArray(oi.簽核文件夾.文稿)) {
                    Ext.Array.each(oi.簽核文件夾.文稿, function (ois) {
                        if (ois.名稱 && ois.名稱 != '來文') {
                            if (ois.文稿類型) {

                                if (canSendDocs.indexOf(ois.文稿類型) == -1) {
                                    ois.名稱 = '創簽';
                                } else {
                                    ois.名稱 = '創稿';
                                }
                            }
                        }
                    })

                } else {
                    if (oi.簽核文件夾.文稿.名稱 && oi.簽核文件夾.文稿.名稱 != '來文') {
                        if (oi.簽核文件夾.文稿.文稿類型) {

                            if (canSendDocs.indexOf(oi.簽核文件夾.文稿.文稿類型) == -1) {
                                oi.簽核文件夾.文稿.名稱 = '創簽';
                            } else {
                                oi.簽核文件夾.文稿.名稱 = '創稿';
                            }
                        }
                    }
                }
            }
        });



        //else {
        var editions = o.版次.where("( el, i, res, param ) => el.版號==" + version);
        //}
        if (editions.length < 1) editions = o.版次.where("( el, i, res, param ) => el.版號=='" + version + "'");

        if (editions.length < 1) {
            console.log(o.版次);
            console.log(version);
            console.log(editions);
            return;
        }

        var current = editions[0]; //目前版次
        if (!current) return;

        if (!current.簽核文件夾) {
            //線上簽核直接return
            if (OA.common.Utils.checkEpaper()) {
                return;
            } else {
                //紙本簽核單一版次
                if (editions.length == 1) {
                    current.簽核文件夾 = {
                        'Number': '0',
                        '公文文號': o.作業文號 + '',
                        '預設開啟文稿': '1'
                    }
                }
            }
        }

        //唯讀模式抓最後一個版次
        if (qs.app === 'check' || qs.app === 'review') {
            var checkEditions = o.版次[o.版次.length - 1];
            if (checkEditions) {
                if (checkEditions.ParentVersion) {
                    editions = o.版次.where("( el, i, res, param ) => el.版號=='" + checkEditions.ParentVersion + "'");
                    if (editions) {
                        current = editions[0];
                        if (qs.showType == 'ref') {
                            version = current.版號;
                        }
                    }
                } else
                    current = checkEditions;
                if (o.作業版本 == '') {
                    version = current.版號;
                }
            }
        }

        //產頁面檔版次，先抓決行版次
        if (qs.app == 'genpages' && qs.package !== 'Y') {
            if (version != 0) {
                var oldApproved = [];
                Ext.Array.forEach(o.版次, function (oldEdition) {
                    if (oldEdition.線上簽核資訊 && oldEdition.線上簽核資訊.簽核流程.異動別 == '決行')
                        oldApproved.push(oldEdition);
                });
                if (oldApproved.length > 0) {
                    current = oldApproved[oldApproved.length - 1];
                }
            }
        }

        //清除交換狀態
        if (!me.getCurrentEdition()) {
            if (current.交換狀態 && current.交換狀態 == '1') {
                current.交換狀態 = '0';
            }
        }

        me.setCurrentEdition(current);
        //簽核文件夾
        var dosno = current.簽核文件夾.公文文號;
        //自動生成VI，虛version ,找回上一個version

        // console.log(current.isTemp);

        //覆閱無按鈕修正
        if (qs.app === 'review') {
            var papers = current.簽核文件夾.文稿;
            if (!Ext.isArray(papers)) papers = [papers];
            var p = papers.where("( el, i, res, param ) =>el.文稿類型!='會辦簽' && el.文稿類型!='來文' && el.名稱!='來文'");
            if (p && p.length > 0) {
                version = current.版號;
            }
        }

        //會影響到送陳後第一次開啟無法編修文稿問題
        if (current.isTemp == 'Y') {
            version = (current.ParentVersion) ? current.ParentVersion : '0';
        }


        var items = me.getFolderItems(version, current.簽核文件夾);
        var paperFiles = [], followRemove = [];
        Ext.each(items, function (p) {

            if (p.kind === '來文' && p.files.length == 0) {
                //補判斷有沒有來文PDF
                var comePDF = OA.common.Global.getFollowPdfUrl();
                if (!comePDF) {
                    followRemove.push(p);
                }
            }

            //舊系統轉入
            if (p.kind === '創稿' || p.kind === '創簽') {
                if (p.files.length == 0) {
                    followRemove.push(p);
                }
            }

            Ext.each(p.files, function (f) {
                paperFiles.push(f);
            });

            paperFiles.push({
                fileKey: '',
                fileName: dosno + '_' + p.paperNo + ".xml",
                folderName: 'WK',
                fileType: 'wk',
                fileContent: null
            });
        });

        /*
        //紙本來文轉線上，檢核是否含來文檔案，（check模式、開引用案件、重新發文）不檢核
        if (followRemove && OA.common.Utils.checkEpaper() && qs.app != 'check' && qs.showType != 'ref' && qs.reOt == undefined) {
            Ext.Msg.show({ message: '缺少來文！\n請重新執行紙本轉線上動作並勾選「清除公文製作」！', buttons: Ext.MessageBox.YES });
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: '' });
            var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
            if (menuLeft) menuLeft.setMasked(true);
            return false;
        }
        */

        if (followRemove.length > 0) {
            Ext.Array.each(followRemove, function (remove) {
                Ext.Array.remove(items, remove); //紙本來文登入無檔案
            })
        }

        paperFiles.push({ fileKey: null, fileName: dosno + ".vi", folderName: 'XC', fileType: 'vi', fileContent: null });
        me.setCurrentEditionFiles(paperFiles);

        //簽章後不得新增、刪除、移動文稿，退回承辦人時，如何處理？採續辦
        var checks = o.版次.where("( el, i, res, param ) => el.簽核狀態==1");
        var isSign = checks.length > 0;
        //續辦(主承辦人、決行後有送陳）可加稿  , 後會時？
        var hadApproved = me.hadApproved();
        var isDocflowUser = false;
        var qd = OA.common.Global.getQueryDefault();
        var u = OA.common.Global.getCurrentUser();
        var Role = OA.common.Global.getCurrentRole();
        //承辦人待結案判斷轉交換及發文按鈕，不可加簽稿
        if (qd && qd.交換資訊 && qd.交換資訊.承辦人) {
            var isAgent = qd && current && current.簽核人員 && qd.交換資訊.承辦人.jobNo == current.簽核人員.使用者職務代碼;
            if (qd.交換資訊.承辦人.empNo == u.empNo || isAgent) {
                isDocflowUser = true
                if (me.hadExchange() && OA.common.Utils.checkEpaper()) isDocflowUser = false;
            }
        }
        if (hadApproved && me.hadApprovedBack() && isDocflowUser) isSign = false;
        if (isDocflowUser) isSign = false; //待結按不可加稿，續辦可加
        // console.log(u.empNo);
        // console.log(q.承辦人);
        // console.log(q.承辦人.empNo == u.empNo);
        // console.log(q && q.承辦人.empNo == u.empNo || isAgent);
        // console.log(isSign);

        me.setEverSign(isSign);
        me.checkLockDoc(items);


        //if (current.會辦簽稿) items.push({ text: '會核單', action: 'procnotes' });

        //if (me.isParallel()) {
        //    if (me.isParallelFirst()) {
        //        if (qs.app !== 'genpages') {
        //            if (!me.hadParallelDraft()) {
        //                if (qs.app == 'tidy') {   ////0706 單一會辦，文稿會核單顯示 chloe.sia
        //                    var papers = current.簽核文件夾.文稿;

        //                    if (!Ext.isArray(papers)) papers = [papers];
        //                    var p = papers.where("( el, i, res, param ) =>el.文稿類型!='會辦簽' && el.文稿類型!='來文'");
        //                    me.setCurrentEditionPapers(p);

        //                    return items;
        //                }
        //                var isParalleladd = true
        //                var Role = OA.common.Global.getCurrentRole();
        //                if (Role && Role.roleId === '16') isParalleladd = false;
        //                if (isParalleladd) {
        //                    if (q.局處代碼 !== current.簽核人員.單位代碼)
        //                        items.push({ text: '＋', action: 'add' });
        //                }
        //            } else
        //                items.push({ text: '-', action: 'del' });
        //        }
        //    }
        //} else {
        var isAdd = !isSign;
        if (qs.app == 'genpages') isAdd = false;
        //發文人員不可加簽稿

        if (Role && (Role.roleId == '02' || Role.roleId == '08')) isAdd = false;
        if (isAdd) {  //是否加稿判斷
            if (qs.app !== 'editor' && qs.app !== 'draft' && !me.isParallel()) {
                items.push({ text: '＋', title: '新增文稿', action: 'add' });
                OA.common.VIMgr.setAddBtn(true);
            }
        }
        if (OA.common.VIMgr.hadExchange() || isAdd) {
            //這裡會處理頁面檔，請註意多於按鍵，造成無法轉頁面檔
            if (qs.app !== 'genpages' && qs.app !== 'draft' && !me.isParallel() && qs.app !== 'editor') {
                if (Role.roleId != '08')
                    items.push({ iconCls: 'fa-exchange', title: '文稿刪除、排序', action: 'change' });
            }
        }
        //}

        var papers = current.簽核文件夾.文稿;

        //導正文稿名稱避免支號異常
        if (papers) {
            var canSendDocs = ['函', '書函', '開會通知單', '箋函', '電子信箱回覆函'];
            Ext.Array.each(papers, function (paper) {
                if (paper.文稿類型 && paper.名稱 && paper.名稱 !== '來文') {
                    if (canSendDocs.indexOf(paper.文稿類型) == -1) {
                        paper.名稱 = '創簽';
                    } else {
                        paper.名稱 = '創稿';
                    }
                }
            });
        }

        if (!Ext.isArray(papers)) papers = [papers];
        var p = papers.where("( el, i, res, param ) =>el.文稿類型!='會辦簽' && el.文稿類型!='來文'");
        me.setCurrentEditionPapers(p);

        return items;
    },
    /*
     * 併列處理版次
     * */
    doParallelEdition: function (version) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var o = OA.common.VIMgr.getViContent();
        if (!version || version == '原稿') version = 0;

        var editions = o.版次.where("( el, i, res, param ) => el.版號==" + version);
        if (editions.length < 1) editions = o.版次.where("( el, i, res, param ) => el.版號=='" + version + "'");

        if (editions.length < 1) {
            console.log(o.版次);
            console.log(version);
            console.log(editions);
            return;
        }

        var current = editions[0]; //目前版次
        if (!current || !current.簽核文件夾) return;

        //唯讀模式抓最後一個版次
        if (qs.app === 'check' || qs.app === 'review') {
            var checkEditions = o.版次[o.版次.length - 1];
            if (checkEditions) {
                if (checkEditions.ParentVersion) {
                    editions = o.版次.where("( el, i, res, param ) => el.版號=='" + checkEditions.ParentVersion + "'");
                    if (editions) {
                        current = editions[0];
                        if (qs.showType == 'ref') {
                            version = current.版號;
                        }
                    }
                } else
                    current = checkEditions;
                if (o.作業版本 == '') {
                    version = current.版號;
                }
            }
        }

        if (version != 0) {
            var qd = OA.common.Global.getQueryDefault();
            var isMy = qd && qd.交換資訊 && current.簽核人員.使用者職務代碼 === qd.交換資訊.承辦人.jobNo;
            if (qs.app == 'genpages' && isMy) {
                var oldApproved = [];
                Ext.Array.forEach(o.版次, function (oldEdition) {
                    if (oldEdition.線上簽核資訊 && oldEdition.線上簽核資訊.簽核流程.異動別 === '決行')
                        oldApproved.push(oldEdition);
                });
                if (oldApproved.length > 0) {
                    current = oldApproved[oldApproved.length - 1];
                }
            }
        }
        //me.setCurrentEdition(current);
        //簽核文件夾
        var dosno = current.簽核文件夾.公文文號;
        //自動生成VI，虛version ,找回上一個version

        // console.log(current.isTemp);

        //覆閱無按鈕修正
        if (qs.app === 'review') {
            var papers = current.簽核文件夾.文稿;
            if (!Ext.isArray(papers)) papers = [papers];
            var p = papers.where("( el, i, res, param ) =>el.文稿類型!='會辦簽' && el.文稿類型!='來文' && el.名稱!='來文'");
            if (p && p.length > 0) {
                version = current.版號;
            }
        }

        //會影響到送陳後第一次開啟無法編修文稿問題
        if (current.isTemp == 'Y') {
            version = (current.ParentVersion) ? current.ParentVersion : '0';
        }


        var items = me.getFolderItems(version, current.簽核文件夾);
        var paperFiles = [], followRemove;
        Ext.each(items, function (p) {
            if (p.kind === '來文' && p.files.length == 0) followRemove = p;
            Ext.each(p.files, function (f) {
                paperFiles.push(f);
            });

            paperFiles.push({
                fileKey: '',
                fileName: dosno + '_' + p.paperNo + ".xml",
                folderName: 'WK',
                fileType: 'wk',
                fileContent: null
            });
        });

        /*
        //紙本來文轉線上，檢核是否含來文檔案，（check模式、開引用案件、重新發文）不檢核
        if (followRemove && OA.common.Utils.checkEpaper() && qs.app != 'check' && qs.showType != 'ref' && qs.reOt == undefined) {
            Ext.Msg.show({ message: '缺少來文！\n請重新執行紙本轉線上動作並勾選「清除公文製作」！', buttons: Ext.MessageBox.YES });
            Ext.Viewport.setMasked({ xtype: 'loadmask', message: '' });
            var menuLeft = Ext.Viewport.getMenus().left; //左側nemu
            if (menuLeft)menuLeft.setMasked(true);
            return false;
        }
        */

        if (followRemove) Ext.Array.remove(items, followRemove); //紙本來文登入無檔案

        paperFiles.push({ fileKey: null, fileName: dosno + ".vi", folderName: 'XC', fileType: 'vi', fileContent: null });
        me.setCurrentEditionFiles(paperFiles);

        //簽章後不得新增、刪除、移動文稿，退回承辦人時，如何處理？採續辦
        var checks = o.版次.where("( el, i, res, param ) => el.簽核狀態==1");
        var isSign = checks.length > 0;
        //續辦(主承辦人、決行後有送陳）可加稿  , 後會時？
        var hadApproved = me.hadApproved();
        var isDocflowUser = false;
        var qd = OA.common.Global.getQueryDefault();
        var u = OA.common.Global.getCurrentUser();
        var Role = OA.common.Global.getCurrentRole();
        //承辦人待結案判斷轉交換及發文按鈕，不可加簽稿
        if (qd && qd.交換資訊 && qd.交換資訊.承辦人) {
            var isAgent = current && current.簽核人員 && qd.交換資訊.承辦人.jobNo == current.簽核人員.使用者職務代碼;
            if (qd.交換資訊.承辦人.empNo == u.empNo || isAgent) {
                isDocflowUser = true
                if (me.hadExchange() && OA.common.Utils.checkEpaper()) isDocflowUser = false;
            }
        }
        if (hadApproved && me.hadApprovedBack() && isDocflowUser) isSign = false;
        if (isDocflowUser) isSign = false; //待結按不可加稿，續辦可加

        // console.log(u.empNo);
        // console.log(q.承辦人);
        // console.log(q.承辦人.empNo == u.empNo);
        // console.log(q && q.承辦人.empNo == u.empNo || isAgent);
        // console.log(isSign);

        me.setEverSign(isSign);
        me.checkLockDoc(items);

        //if (current.會辦簽稿) items.push({ text: '會核單', action: 'procnotes' });

        if (me.isParallel()) {
            if (me.isParallelFirst()) {
                if (qs.app !== 'genpages') {
                    if (!me.hadParallelDraft()) {
                        var isParalleladd = true
                        var Role = OA.common.Global.getCurrentRole();
                        if (Role && Role.roleId === '16') isParalleladd = false;
                        if (isParalleladd)
                            items.push({ text: '＋', title: '新增會辦簽', action: 'add' });
                    } else
                        items.push({ text: '-', title: '刪除會辦簽', action: 'del' });
                }
            }
        } else {
            var isAdd = !isSign;
            if (qs.app == 'genpages') isAdd = false;
            //發文人員不可加簽稿

            if (Role && Role.roleId === '02') isAdd = false;
            if (isAdd) {  //是否加稿判斷
                if (qs.app != 'editor' && qs.app === 'draft') {
                    items.push({ text: '＋', title: '新增文稿', action: 'add' });
                    OA.common.VIMgr.setAddBtn(true);
                }
            }

            if (OA.common.VIMgr.hadExchange() || isAdd) {  //1202 陳核內會，同機關單位，無加稿(+號)，隱藏雙箭頭  Chloe.sia
                //這裡會處理頁面檔，請註意多於按鍵，造成無法轉頁面檔
                if (qs.app !== 'genpages' && qs.app != 'editor' && qs.app === 'draft') {
                    items.push({ iconCls: 'fa-exchange', title: '文稿刪除、排序', action: 'change' });
                }
            }

        }

        var papers = current.簽核文件夾.文稿;

        if (!Ext.isArray(papers)) papers = [papers];
        var p = papers.where("( el, i, res, param ) =>el.文稿類型!='會辦簽' && el.文稿類型!='來文'");
        me.setCurrentEditionPapers(p);

        return items;
    },
    /*
     處理版次
     */
    getEdition: function (version) {
        var me = this;
        var o = OA.common.VIMgr.getViContent();
        if (!version || version == '原稿') version = 0;

        var editions = o.版次.where("( el, i, res, param ) => el.版號==" + version);
        if (editions.length < 1) editions = o.版次.where("( el, i, res, param ) => el.版號=='" + version + "'");

        if (editions.length < 1) {
            return;
        }

        var current = editions[0]; //目前版次
        if (!current || !current.簽核文件夾) return;
        //簽核文件夾
        var dosno = current.簽核文件夾.公文文號;

        // console.log(current.isTemp);
        //自動生成VI，虛version ,找回上一個version
        if (current.isTemp == "Y") {
            version = (current.ParentVersion) ? current.ParentVersion : '0';
        }

        var items = me.getFolderItems(version, current.簽核文件夾);
        me.checkLockDoc(items);
        return items;
    },
    /*
     取得資料夾內
     */
    getFolderItems: function (version, folder, retPaperNo) {
        var me = this;
        if (!folder) return;
        var qs = OA.common.Global.getQ();
        var dosno = folder.公文文號;
        var papers = folder.文稿;
        var o = OA.common.VIMgr.getViContent();
        if (qs.app == 'draft') {
            o.入徑 = { 附件: '', 參考附件: '', 大型附件: '' };
        }
        var path_attach = o.入徑.附件;
        var path_refAttach = o.入徑.參考附件;
        var path_big = o.入徑.大型附件;

        var current = this.getCurrentEdition();
        var currentUnitNote = this.getUnitNote();
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var qd = OA.common.Global.getQueryDefault();
        var qs = OA.common.Global.getQ();
        var items = [], paperFiles = [], tmpDisplays = [], refPaper = {}, idx = 0, isFirtNote = false;

        if (!papers) return [];

        //密件公文制作，沒有開啟路徑，直以創簽稿方式開啟
        if (qs.sFlag == 'Y') {
            var hasFolder = OA.common.FileMgr.getOpenDialogPath();
            if (!hasFolder) {
                return [];
            }
        }

        var gpsList = [];
        if (qs.app == 'genpages') {
            Ext.Array.each(o.版次, function (gol) {
                if (gol.版號 == version) {
                    Ext.Array.each(gol.簽核文件夾.文稿, function (golp) {
                        gpsList.push(golp);
                    });
                }
            });
        }

        Ext.each(papers, function (p) {
            //console.log(p);
            var paperNo = p.代碼;
            var paperOrder = p.排序;
            var text = p.文稿類型;
            var kind = p.名稱;
            var sendNo = p.發文文號;
            var fileList = p.檔案清單.檔案;
            var attactList = p.檔案清單.附件清單;
            var otherName = p.別名 || '';
            if (fileList == undefined) return true;
            var qs = OA.common.Global.getQ();
            if (qs.app == 'genpages') {
                Ext.Array.each(gpsList, function (gps) {
                    if (gps.代碼 == p.代碼) {
                        attactList = gps.檔案清單.附件清單;
                    }
                });
            }
            var files = [], attachs = [];
            var lastVersion = version;

            Ext.each(fileList, function (f) {
                var folderName = ''; //DI
                if (f.種類 == '本文') {
                    var filevo_di = {
                        fileKey: f.ID,
                        fileName: f.Src,
                        folderName: folderName,
                        fileType: f.檔案格式,
                        fileContent: null
                    };
                    files.push(filevo_di);
                    paperFiles.push(filevo_di);
                    var pos = f.Src.lastIndexOf('_');
                    var _last = "0";

                    if (pos >= 0) {
                        var arr = f.Src.substring(pos + 1).split('.');
                        _last = arr[0];
                    }
                    // if (pos >= 0) _last = f.Src.substring(pos + 1, f.Src.length - 3);

                    lastVersion = _last;
                }
            });

            var filevo_wk = {
                fileKey: '',
                fileName: dosno + '_' + paperNo + ".xml",
                folderName: 'WK',
                fileType: 'wk',
                fileContent: null
            };
            paperFiles.push(filevo_wk);

            var attactHasChange = false;

            //folderName: 'big', 'ref','attach'   ,fileType = Q = NOT SAVE
            if (attactList) {
                var url = '';
                Ext.each(attactList.附件, function (att) {
                    url = OA.common.UrlMgr.getAttachUrl(path_attach, att.Src);
                    var file = {
                        fileKey: att.名稱,
                        fileName: att.Src,
                        folderName: 'attach',
                        fileType: att.檔案格式,
                        fileContent: null,
                        // status: att.status || 1,
                        status: att.status,
                        personnel: att.status == '1' ? att.empName : att.delEmpName,
                        depName: att.depName,
                        operateTime: att.status == '1' ? att.uploadTime : att.delTime,
                        fileSize: att.fileSize,
                        addTime: att.addTime || '',
                        addDepName: att.addDepName || '',
                        addEmpName: att.addEmpName || '',
                        reTime: att.reTime || '',
                        reDepName: att.reDepName || '',
                        reEmpName: att.reEmpName || '',
                        filePath: att.filePath || '',
                        otherFileName: att.otherFileName || '' //0918 來文附件中新增別名紀錄VI Chloe.sia
                    };
                    if (file.status == '0' || file.reTime != '') {
                        if (o.版次 && o.版次.length > 2) {
                            attactHasChange = true;
                        } else if (o.版次 && o.版次.length == 2) {
                            Ext.Array.each(o.版次, function (v) {
                                if ((v.版號 + '') == '0') {
                                    if (v.簽核人員) {
                                        //版次0有簽核人員表示為創簽稿，第二版次調整附件要有記錄
                                        attactHasChange = true;
                                        return false;
                                    }
                                }
                            })
                        }
                    }
                    attachs.push({ name: att.名稱, url: url, format: att.檔案格式, sort: 'attach', file: file, isEdit: true, otherFileName: att.otherFileName });
                });

                Ext.each(attactList.參考附件, function (att) {
                    url = OA.common.UrlMgr.getAttachUrl(path_refAttach, att.Src);
                    var file = {
                        fileKey: att.名稱,
                        fileName: att.Src,
                        folderName: 'ref',
                        fileType: att.檔案格式,
                        fileContent: null,
                        // status: att.status || 1,
                        status: att.status,
                        personnel: att.status == '1' ? att.empName : att.delEmpName,
                        depName: att.depName,
                        operateTime: att.status == '1' ? att.uploadTime : att.delTime,
                        fileSize: att.fileSize,
                        addTime: att.addTime || '',
                        addDepName: att.addDepName || '',
                        addEmpName: att.addEmpName || '',
                        reTime: att.reTime || '',
                        reDepName: att.reDepName || '',
                        reEmpName: att.reEmpName || '',
                        filePath: att.filePath || ''
                    };
                    if (file.status == '0' || file.reTime != '') {
                        //承辦人創稿或函復第一關卡變動不記錄
                        if (o.版次 && o.版次.length > 2) {
                            attactHasChange = true;
                        }
                    }
                    attachs.push({ name: att.名稱, url: url, format: att.檔案格式, sort: 'ref', file: file, isEdit: true });
                });

                Ext.each(attactList.大型附件, function (att) {
                    url = OA.common.UrlMgr.getAttachUrl(path_big, att.Src);
                    var file = {
                        fileKey: att.名稱,
                        fileName: att.Src,
                        folderName: 'big',
                        fileType: att.檔案格式,
                        fileContent: null,
                        // status: att.status || 1,
                        status: att.status,
                        personnel: att.status == '1' ? att.empName : att.delEmpName,
                        depName: att.depName,
                        operateTime: att.status == '1' ? att.uploadTime : att.delTime,
                        fileSize: att.fileSize,
                        addTime: att.addTime || '',
                        addDepName: att.addDepName || '',
                        addEmpName: att.addEmpName || '',
                        reTime: att.reTime || '',
                        reDepName: att.reDepName || '',
                        reEmpName: att.reEmpName || '',
                        filePath: att.filePath || ''
                    };
                    if (file.status == '0' || file.reTime != '') {
                        if (o.版次 && o.版次.length > 2) {
                            attactHasChange = true;
                        }
                    }
                    attachs.push({ name: att.名稱, url: url, format: att.檔案格式, sort: 'big', file: file, isEdit: true });
                });
            }

            var doctype = p.文稿類型.split('(');
            if (doctype.length > 0) doctype = doctype[0];

            var isShow = true;
            // console.log(doctype)
            if (p.名稱 == '來文') {
                text = '來文';
                // if (files.length == 0) isShow = false;
            } else if (doctype == '上行簽') {  //0706 上行簽文稿類型為'簽' 在公文格式選單中除了簽格式之外的格式都顯示為稿 Chloe.sia
                text = '簽';
            } else if (doctype == '簽') {
                text = doctype;
            } else if (doctype == '會辦簽') {
                text = doctype;
                if (currentUnitNote) {
                    isShow = (currentUnitNote.文稿代碼 == p.代碼);
                } else {
                    isShow = false;
                }
            } else {
                text = p.名稱.substring(1);
            }

            //會辦單位只開放意見登打，不能改稿
            var displayId = tmpDisplays.where("( el, i, res, param ) => el=='" + text + "'").length;
            var isEdit = false, isSuggest = false;
            if (currentUnitNote) {
                isEdit = (currentUnitNote.文稿代碼 == p.代碼);
                isSuggest = (currentUnitNote.文稿代碼 == p.代碼);
                //isSuggest = true;   //2019.06.18 修正判斷 lien.chiu
            } else {
                var isMain = current && current.簽核人員 && current.簽核人員.是否會辦 == '否';

                if (isMain) {
                    isEdit = true;
                    //已決行不是紙本不可編輯
                    //me.checkLockDoc(p);
                    //if (OA.common.Utils.checkEpaper()) {
                    //    isEdit = false;
                    //}
                }
                isSuggest = true;
            }
            // console.log('p.' + paperNo + ' isEdit=' + isEdit + ' isSuggest=' + isSuggest);

            //監印完畢
            var isSealDone = docflow && ['B08', 'B09', 'B11', 'B16'].indexOf(docflow.get('docType')) >= 0;
            if (isSealDone) isEdit = false;

            //校畢完畢
            var hadExchange = OA.common.VIMgr.hadExchange();
            var isCheckDone = docflow && ['B07', 'B10', 'B14'].indexOf(docflow.get('docType')) >= 0;
            if (isCheckDone && !hadExchange) isEdit = false;

            // if (hadExchange) isEdit = false;

            //有退稿不能編
            var hadBackDraft = OA.common.VIMgr.hadBackDraft();
            if (hadBackDraft) isEdit = false;

            var qs = OA.common.Global.getQ();
            if (qs.isRole15) {
                isEdit = false;
                isSuggest = false;
            }

            var item = {
                idx: idx,
                text: (displayId == 0) ? text : text + '(' + displayId + ')',
                form: doctype,
                model_di: OA.common.DIMgr.getModelName('di', doctype),
                model_wk: OA.common.DIMgr.getModelName('wk', doctype),
                model_open: 'wk',
                kind: kind,
                files: files,
                attachs: attachs,
                version: version,
                paperNo: paperNo,
                paperOrder: paperOrder,
                doSno: dosno,
                sendNo: sendNo,
                lastVersion: lastVersion,
                suggestContent: (p.批示意見) ? p.批示意見.content : '',
                suggestLastTime: (p.批示意見) ? p.批示意見.lastTime : '',
                isEdit: isEdit,
                isSuggest: isSuggest,
                isRead: false,
                otherName: otherName,
                attactHasChange: attactHasChange
            };

            if (isShow) {
                tmpDisplays.push(text);
                items.push(item);
                idx++;
            }
            //2019.06.18 修正判斷 lien.chiu
            if (!isFirtNote && (['便簽', '簽', '便箋', 'A4空白簽'].indexOf(p.文稿類型) >= 0) && p.名稱 !== '來文' && p.文稿類型 !== '會辦簽') {
                isFirtNote = true;
                item.noteStatus = 'first';
            }

            //承辦人第0版次及第一個簽核版次預設清稿
            if ((current.版號 + '') == '0') {
                item.isClearWK = true;
            } else {
                if (current.簽核人員 && current.簽核人員.使用者職務代碼 && (current.ParentVersion + '') == '0') {
                    if (qd.交換資訊.承辦人.jobNo == current.簽核人員.使用者職務代碼) {
                        item.isClearWK = true;
                    }
                }
            }

            //紙本直接清稿
            if (!OA.common.Utils.checkEpaper()) {
                item.isClearWK = true;
            }

            if (retPaperNo == paperNo) {
                refPaper = item;
                return false; //break;
            }
        });

        //找不到簽，第1稿為主稿，有來文時，第2稿為主稿，只有來文時第1個為主稿
        if (isFirtNote == false) {
            if (items[0] && items[0].text != '來文') {
                if (items[0]) items[0].noteStatus = 'first';
            } else {
                if (items.length == 1) {
                    items[0].noteStatus = 'first';
                } else {
                    if (items[1]) items[1].noteStatus = 'first';
                }
            }
        }

        if (currentUnitNote && items) {
            var hasIsSuggest = false;
            Ext.Array.each(items, function (paper) {
                if (paper.isSuggest) hasIsSuggest = true;
            });
            if (!hasIsSuggest) {
                Ext.Array.each(items, function (paper) {
                    if (paper.noteStatus == 'first') paper.isSuggest = true;
                });
            }
        }

        if (retPaperNo) return refPaper;

        Ext.Array.sort(items, function (record1, record2) {
            return record1.paperOrder > record2.paperOrder ? 1 : -1;
        });


        return items;
    },
    /*
     版次列表
     */
    editionList: function (currentVersion) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var vi = OA.common.VIMgr.getViContent();
        var editions = vi.版次;
        var items = [];
        //var formatOpen = '<table><tr><td width="90%">{0}</td><td width="50px" ><span class="edition-open"></span></td></tr></table>';
        //var formatOverflow = '<table><tr><td width="90%" class="edition-name">{0}</td><td width="50px" ><span class="edition-open"></span></td></tr></table>';

        var formatOpen = '<table><tr><td width="90%" class="edition-doc">{0}</td><td width="50px" ></td></tr></table>';
        var formatOverflow = '<table><tr><td width="90%" class="edition-name">{0}</td><td width="50px" ></tr></table>';

        var parentVersion;
        if (currentVersion == '') {
            parentVersion = (qs.app === 'check' || qs.app === 'review') ? me.getCurrentEdition().ParentVersion : '';
        }

        Ext.Array.each(editions, function (edition) {
            var nodeEdition = {};
            nodeEdition.items = [];
            var verion = (edition.版號 == 0) ? '原稿' : edition.版號;
            var who = '';
            if (edition.簽核人員) {

                if (edition.簽核人員.是否會辦 && edition.簽核人員.是否會辦 == '是') {
                    if (edition.簽核狀態 == '1') {
                        if (edition.SignatureData == undefined) {
                            return true;
                        }
                    }
                }

                //有子文簽核文件夾的版次也不顯示
                if (edition.子文簽核文件夾 && edition.子文簽核文件夾.文稿) {
                    return true;
                }

                if (edition.簽核人員.是否為代理 && edition.簽核人員.是否為代理 == '是') {
                    who = edition.簽核人員.服務單位 + ' (代理：' + edition.簽核人員.使用者職稱 + ' ' + edition.簽核人員.代理名稱 + ') ' + edition.簽核人員.使用者名稱;
                } else {
                    who = edition.簽核人員.服務單位 + ' ' + edition.簽核人員.使用者職稱 + ' ' + edition.簽核人員.使用者名稱;
                }
            }
            var when = '';
            if (edition.線上簽核資訊) {
                when = edition.最後更新時間;
                if (edition.線上簽核資訊.簽核流程.異動別 !== undefined)
                    when = when + ' ' + edition.線上簽核資訊.簽核流程.異動別;
            }
            var html = [];
            var textColor = OA.common.Utils.pickColor(edition.版號);
            html.push('<p class="edition-who" style="color:' + textColor + ';">' + who + '</p>');
            html.push('<p class="edition-when">' + when + '</p>');
            nodeEdition.text = html.join('');
            nodeEdition.source = edition;

            //資料夾
            var papers = me.getFolderItems(edition.版號, edition.簽核文件夾);
            var paperItems = [], bringItems = [];
            Ext.each(papers, function (p) {
                if (p.files == null || p.files == undefined || p.files.length == 0) {
                    //console.log('this')
                    return true;
                }
                var nodePaper = Ext.clone(p);
                 /*
                var sendNo = '';
                if (p && p.sendNo != undefined && p.sendNo != '') {
                    sendNo = p.sendNo;
                }
               
                if (p.otherName) {
                    nodePaper.text = Ext.String.format(formatOpen, p.text + '：' + p.otherName);
                } else {
                    nodePaper.text = Ext.String.format(formatOpen, p.text + " " + sendNo);
                }
                */
                nodePaper.text = Ext.String.format(formatOpen, p.text);

                nodePaper.source = p;
                nodePaper.expanded = true;
                nodePaper.items = [];

                var nodeAttach = { text: '<p>附件</p>', expanded: true };
                nodeAttach.items = [];
                var nodeRefAttach = { text: '<p>參考附件</p>', expanded: true };
                nodeRefAttach.items = [];
                var nodeBigAttach = { text: '<p>大型附件</p>', expanded: true };
                nodeBigAttach.items = [];
                Ext.each(p.attachs, function (f) {
                    //console.log(f);
                    if (f.file.status == 1 || p.kind == '來文') {
                        if (f.sort == 'ref' && f.file.status == 1) {
                            nodeRefAttach.items.push({
                                text: Ext.String.format(formatOverflow, f.name),
                                source: f,
                                leaf: true
                            });
                        } else {
                            //if (f.sort !== 'ref') {
                            //    nodeAttach.items.push({
                            //        text: Ext.String.format(formatOverflow, f.name),
                            //        source: f,
                            //        leaf: true
                            //    });
                            //}
                            if (f.sort == 'ref') {
                                nodeRefAttach.items.push({
                                    text: Ext.String.format(formatOverflow, f.name),
                                    source: f,
                                    leaf: true
                                });
                            } else if (f.sort == 'big') {
                                nodeBigAttach.items.push({
                                    text: Ext.String.format(formatOverflow, f.name),
                                    source: f,
                                    leaf: true
                                });
                            } else {
                                nodeAttach.items.push({
                                    text: Ext.String.format(formatOverflow, f.name),
                                    source: f,
                                    leaf: true
                                });
                            }
                        }
                    }
                });
                if (nodeAttach.items.length > 0) nodePaper.items.push(nodeAttach);
                if (nodeRefAttach.items.length > 0) nodePaper.items.push(nodeRefAttach);
                if (nodeBigAttach.items.length > 0) nodePaper.items.push(nodeBigAttach);

                if (p.kind == '來文') {
                    nodeEdition.items.push(nodePaper);
                } else {
                    paperItems.push(nodePaper);
                }
            });

            if (edition.彙併案資訊) {
                var combineItem = { text: '<p>' + '彙併案資訊' + '</p>', items: [], expanded: true };
                if (edition.彙併案資訊.併文清單) {
                    var son = edition.彙併案資訊.併文清單.子文;
                    var combineItems = (Ext.isArray(son)) ? son : [son];
                    Ext.each(combineItems, function (item) {
                        item.狀態 = '彙併案';
                        combineItem.items.push({
                            text: Ext.String.format(formatOpen, item.content),
                            source: item,
                            leaf: true
                        });
                    });

                    nodeEdition.items.push(combineItem);
                }
            }

            if (paperItems.length > 0) {
                nodeEdition.items.push({
                    text: '簽辦',
                    expanded: true,
                    source: edition,
                    items: paperItems,
                    nodeType: 'paperFolder'
                });
            }

            if (edition.會辦簽稿) {
                var units = edition.會辦簽稿.單位;
                if (!Ext.isArray(units)) units = [units];

                var _items = [];
                Ext.Array.forEach(units, function (unit) {
                    if (unit.單位) {
                        var _subItems = [];
                        var subUnits = unit.單位;
                        if (!Ext.isArray(subUnits)) subUnits = [subUnits];

                        var isCurrentUnit = false;
                        Ext.Array.forEach(subUnits, function (sub) {
                            var nodePaper = {
                                text: Ext.String.format(formatOpen, sub.名稱),
                                source: sub,
                                leaf: true,
                                items: []
                            };
                            if (sub.文稿代碼) {
                                nodePaper.leaf = false;
                                var p = me.getFolderItems(edition.版號, edition.簽核文件夾, sub.文稿代碼);
                                nodePaper.source.refPaperData = p;
                                var nodeAttach = { text: '<p>附件</p>' };
                                nodeAttach.items = [];
                                Ext.each(p.attachs, function (f) {
                                    if (f.file.status == 1) {
                                        nodeAttach.items.push({
                                            text: Ext.String.format(formatOverflow, f.name),
                                            source: f,
                                            leaf: true
                                        });
                                    }
                                });

                                if (nodeAttach.items.length > 0)
                                    nodePaper.items.push(nodeAttach);
                            }

                            if (sub.目前 == 'Y') {
                                isCurrentUnit = true;
                            }
                            _subItems.push(nodePaper);
                        });
                        _items.push({ text: unit.名稱, source: unit, items: _subItems, expanded: isCurrentUnit });
                    } else {
                        var nodePaper = {
                            text: Ext.String.format(formatOpen, unit.名稱),
                            leaf: true,
                            source: unit,
                            items: [],
                            expanded: true
                        };
                        if (unit.文稿代碼) {
                            nodePaper.leaf = false;
                            var p = me.getFolderItems(edition.版號, edition.簽核文件夾, unit.文稿代碼);
                            nodePaper.source.refPaperData = p;
                            var nodeAttach = { text: '<p>附件</p>' };
                            nodeAttach.items = [];
                            Ext.each(p.attachs, function (f) {
                                if (f.file.status == 1) {
                                    nodeAttach.items.push({
                                        text: Ext.String.format(formatOverflow, f.name),
                                        source: f,
                                        leaf: true
                                    });
                                }
                            });
                            if (nodeAttach.items.length > 0)
                                nodePaper.items.push(nodeAttach);
                        }
                        _items.push(nodePaper);
                    }
                });

                nodeEdition.items.push({
                    text: Ext.String.format(formatOpen, '會辦'),
                    items: _items,
                    expanded: true,
                    source: _items,
                    nodeType: 'procNotes'
                });
            }

            var refItems = [];
            if (edition.引用案件資訊) {
                var refItem = { text: '<p>' + '引用案件' + '</p>', items: [], expanded: true };

                var caseItems = edition.引用案件資訊.引用案件;
                Ext.each(caseItems, function (item) {
                    if (item.狀態 == '引用') {
                        refItem.items.push({ text: Ext.String.format(formatOpen, item.公文文號), source: item, leaf: true });
                    }
                });
                refItems.push(refItem);
            }

            if (refItems.length > 0) {
                nodeEdition.items.push({
                    text: '<p>參考資訊</p>',
                    items: refItems,
                    nodeType: 'reference',
                    expanded: true
                });
            }

            nodeEdition.expanded = true;

            if (parentVersion) {
                if (parentVersion == edition.ParentVersion && parentVersion !== edition.版號) {
                    items.push(nodeEdition);
                }
            } else {
                if (currentVersion) {
                    if (currentVersion == edition.版號) items.push(nodeEdition);
                } else {
                    if (edition.版號 != 0) items.push(nodeEdition);
                }
            }
        });



        var isSetTaskAccordion = true;
        var editionFolding = Ext.ComponentQuery.query('#menuEdition > toolbar> button[action=editionFolding]');
        if (editionFolding && editionFolding.length > 0) {
            var iconCls = editionFolding[0].getIconCls();
            if (iconCls == 'fa-toggle-off') isSetTaskAccordion = false;
        }

        if (isSetTaskAccordion)
            Ext.getStore('TaskAccordion').setData(items);


        /*
        $('.edition-name').qtip({
            content: {
                text: function (event, api) {
                    return '<p style="font-size:130%;">' + $(this).text() + '</p>';
                }
            },
            position: {
                my: 'top left',
                at: 'bottom center'
            },
            show: {
                'delay': 50,
                'solo': true
            }
        });
        */
    },
    getUnitNote: function () {
        var paras = OA.common.Global.getInitParas();
        var current = this.getCurrentEdition();

        var unitNote = null;
        if (current && current.會辦簽稿) {
            var units = current.會辦簽稿.單位;
            if (!Ext.isArray(units)) units = [units];
            Ext.Array.forEach(units, function (unit) {
                if (unit.單位) {
                    var inUnits = unit.單位;
                    if (!Ext.isArray(inUnits)) inUnits = [inUnits];
                    Ext.Array.forEach(inUnits, function (subUnit) {
                        if (subUnit.目前 == 'Y') unitNote = subUnit;
                    });
                } else {
                    if (unit.目前 == 'Y') unitNote = unit;
                }
            });
        }
        if (unitNote) {
            var isLV = paras.roleId == '16';
            var isMain = current.簽核人員.是否會辦 == '否';
            if (isLV && isMain) unitNote = null;
        }

        return unitNote;
    },

    //簽核意見列表
    setSuggestionStore: function (o) {
        // console.log(o);
        var paras = OA.common.Global.getInitParas();
        var store = Ext.getStore('Suggestion');
        store.setData(null);
        var items = [], d = {}, isStart = false;
        //var hadApproved = OA.common.VIMgr.hadApproved();
        var current = OA.common.VIMgr.getCurrentEdition();

        var list = Ext.clone(o.版次);

        //TODO:退文時如何處制
        // Ext.Array.sort(list, function (item1, item2) {
        //     var dep1 = (item1.簽核人員) ? item1.簽核人員.單位代碼 : '';
        //     var org1 = (item1.簽核人員) ? item1.簽核人員.所屬機構代碼 : '';
        //     var dep2 = (item2.簽核人員) ? item2.簽核人員.單位代碼 : '';
        //     var org2 = (item2.簽核人員) ? item2.簽核人員.所屬機構代碼 : '';
        //     var opt1 = (item1.最後更新時間) ? item1.最後更新時間 : '';
        //     var opt2 = (item2.最後更新時間) ? item2.最後更新時間 : '';
        //
        //     if (org1 < org2) return -1;
        //     if (org1 > org2) return 1;
        //     if (dep1 < dep2) return -1;
        //     if (dep1 > dep2) return 1;
        //
        //     // console.log(item1);
        //     if (opt1 > opt2) return -1;
        //     if (opt1 < opt2) return 1;
        //     return 0;
        // });

        Ext.Array.each(list, function (v) {
            var vItem = {};
            vItem.簽核人員 = (v.簽核人員) ? v.簽核人員 : { 服務單位: "" };
            vItem.線上簽核資訊 = (v.線上簽核資訊) ? v.線上簽核資訊 : { 簽核意見: "", 簽核流程: { 異動別: " " } };
            vItem.版號 = v.版號;
            vItem.最後更新時間 = (v.最後更新時間) ? v.最後更新時間 : '';
            vItem.SignatureData = v.SignatureData;
            vItem.卡片使用狀態 = (v.卡片使用狀態) ? v.卡片使用狀態.狀態 : '';

            //var isApprove = vItem.線上簽核資訊.簽核流程.異動別 == '決行' || vItem.線上簽核資訊.簽核流程.異動別 == '補核';
            //var isParallel = vItem.簽核人員.是否會辦 == '是';

           
            var sSort = '';
             /* 高市府意見不分類
              var sSort = '';
            if (isApprove) {
                vItem.意見分類 = '核決';
                sSort = 'ok';
                isStart = true;
            } else if (isParallel) {
                vItem.意見分類 = '會辦';
                sSort = 'co';
            } else {
                vItem.意見分類 = '承辦';
                sSort = 'do';
            }*/

            //決行後會、決行後續辦必須開放此判斷
            // if (!isStart && hadApproved) return true;

            var isFirstOrLast = v.版號 == 0 || v.版號 == o.作業版本;
            if (isFirstOrLast) return true;

            var isWithout = v.SignatureData == undefined;
            if (isWithout) {
                // console.log(v);
                return true;
            }

            var isSentFile = v.線上簽核資訊 && v.線上簽核資訊.簽核流程.異動別 === '送歸檔';
            if (isSentFile) return true;
            //var isSent = v.線上簽核資訊 && v.線上簽核資訊.簽核流程.異動別 === '發文';
            //if (isSent) return true;

            var sortKey = sSort + (vItem.簽核人員.單位代碼 || '');
            var hasProperty = false;
            for (var ppt in d) {
                if (d.hasOwnProperty(sortKey)) hasProperty = true;
            }

            var who = current.簽核人員 || {};
            var isSameUnit = vItem.簽核人員.單位代碼 == who.單位代碼;
            //高市府意見不分類 皆不遮蔽

            /*
            if (!hasProperty) {
                d[sortKey] = vItem.簽核人員;
                if (isSameUnit && !hadApproved) {
                    vItem.show = 'show';
                } else {
                    vItem.show = 'last';
                }
            } else {
                // console.log(vItem.簽核人員.單位代碼  + ' ' + current.簽核人員.單位代碼 );
                if (isSameUnit && vItem.簽核人員.是否會辦 == '是') { //同科室會辦意見獨立
                    vItem.show = 'show';
                } else {
                    vItem.show = 'none';
                }
            }
            */

            //vItem.show = 'show';

            //console.log(vItem);

            //長官意見皆不遮蔽 高市府一律不遮蔽
            //if (vItem.簽核人員.使用者職務角色 == 16 || vItem.簽核人員.使用者職務角色 == 17) {
                vItem.show = 'last';
            //}

            if (v.簽核人員 && v.簽核人員.聯絡方式) {
                var ways = v.簽核人員.聯絡方式;
                if (!Ext.isArray(ways)) ways = [ways];
                var way = ways.where("( el, i, res, param ) =>el.名稱=='聯絡電話'");
                if (way.length > 0) vItem.承辦單位電話 = way[0].content;
            }

            var papers = v.簽核文件夾.文稿;
            if (!Ext.isArray(papers)) papers = [papers];
            Ext.Array.each(papers, function (p) {
                //目前文稿的才顯示
                console.log(p);
                var item = {};
                Ext.apply(item, vItem);
                item.代碼 = p.代碼;
                if (p.批示意見 && p.批示意見.文字) {
                    item.批示意見 = { content: p.批示意見.文字, lastTime: vItem.最後更新時間 };
                } else if (p.批示意見 == undefined && vItem.線上簽核資訊 && vItem.線上簽核資訊.簽核意見) {
                    item.批示意見 = { content: vItem.線上簽核資訊.簽核意見, lastTime: vItem.最後更新時間 };
                } else if (p.批示意見 && p.批示意見.文字 != undefined && p.批示意見.文字 == '' && vItem.線上簽核資訊 && vItem.線上簽核資訊.簽核意見) {
                    item.批示意見 = { content: vItem.線上簽核資訊.簽核意見, lastTime: vItem.最後更新時間 };
                } else {
                    item.批示意見 = (p.批示意見) ? p.批示意見 : { content: '', lastTime: '' };
                }
                items.push(item);
            });
        });

        store.setData(items);
        var filters = [];
        filters.push(new Ext.util.Filter({
            property: '版號',
            value: o.作業版本
        }));
        store.filter(filters);


        //意見欄log
        // var tmp = [];
        // store.getData().all.forEach(function (r) {
        //     tmp.push({
        //         '代碼': r.get('代碼'),
        //         '意見分類': r.get('意見分類'),
        //         '使用者名稱': r.get('簽核人員').使用者名稱,
        //         '批示意見': r.get('批示意見').content,
        //         'show': r.get('show'),
        //         '單位代碼': r.get('簽核人員').單位代碼,
        //         '所屬機構': r.get('簽核人員').所屬機構
        //     });
        // });
        // console.table(tmp);
    },

    //簽核歷程列表
    setHistoryStore: function (o) {
        Ext.getStore('History').setData(null);

        var editons = o.版次.reverse();
        var historyList = [];
        Ext.each(editons, function (v) {
            var history = {};
            history.簽核人員 = (v.簽核人員) ? v.簽核人員 : { 服務單位: "" };
            history.線上簽核資訊 = (v.線上簽核資訊) ? v.線上簽核資訊 : { 簽核意見: "", 簽核流程: { 異動別: " " } };
            history.版號 = (v.版號) ? v.版號 : '原稿';
            history.最後更新時間 = (v.最後更新時間) ? v.最後更新時間 : '';
            if (v.版號 == 0 || v.版號 == o.作業版本) {
            } else {
                historyList.push(history);
            }
        });
        Ext.getStore('History').setData(historyList);
    },

    create: function (values) {
        var wk = OA.common.Global.getCurrentWKContent();
        var qs = OA.common.Global.getQ();
        var newVI = Ext.clone(this.TEMPLATE.vi);
        //var isNote = OA.common.Utils.isNoteDoc(wk.DocumentType);
        var canSendDocs = ['函', '書函', '開會通知單', '箋函', '電子信箱回覆函'];
        var isNote = canSendDocs.indexOf(wk.DocumentType) == -1;
        //var isNote = ['簽', '便簽', '便箋'].indexOf(wk.DocumentType) >= 0;
        newVI.版次[0].簽核文件夾.文稿.名稱 = (isNote) ? '創簽' : '創稿';
        newVI.版次[0].簽核文件夾.文稿.文稿類型 = wk.DocumentType;
        newVI.版次[0].最後更新時間 = OA.common.Utils.getChineseDate();
        if (values.attachs) {
            var list = [];
            Ext.Array.each(values.attachs, function (attach) {
                var att = {
                    名稱: attach.fileKey,
                    Src: attach.fileName,
                    種類: 'attach',
                    // folderName: 'attach',
                    檔案格式: attach.fileType,
                    filePath: attach.filePath,
                    status: 1
                    // personnel: att.status == '1' ? att.empName : att.delEmpName,
                    // depName: att.depName,
                    // operateTime: att.status == '1' ? att.uploadTime : att.delTime,
                    // fileSize: att.fileSize,
                    // addTime: att.addTime || '',
                    // addDepName: att.addDepName || '',
                    // addEmpName: att.addEmpName || '',
                    // reTime: att.reTime || '',
                    // reDepName: att.reDepName || '',
                    // reEmpName: att.reEmpName || ''
                };
                list.push(att);
            })

            newVI.版次[0].簽核文件夾.文稿.檔案清單.附件清單.附件 = list;
        }

        //創簽稿
        if (values.qIsNew) return this.load(newVI);

        //新增文稿
        var vi = this.getViContent();
        var oldPapers = vi.版次[0].簽核文件夾.文稿;
        if (qs && qs.sFlag === 'Y') {
            Ext.Array.each(vi.版次, function (vs) {
                if (vs.版號 == values.version) {
                    oldPapers = vs.簽核文件夾.文稿;
                }
            });
        }

        if (!Ext.isArray(oldPapers)) oldPapers = [oldPapers];
        var newPaper = newVI.版次[0].簽核文件夾.文稿;



        newPaper.代碼 = oldPapers[oldPapers.length - 1].代碼 + 1;
        newPaper.排序 = oldPapers[oldPapers.length - 1].排序 + 1;
        if (values.draftVersion) {
            newPaper.代碼 = values.draftVersion;
        }

        var files = [];
        files.push({
            "種類": "本文",
            "Src": newPaper.代碼 + ".di",
            "名稱": newPaper.代碼 + ".di",
            "ID": "",
            "fileNo": "",
            "檔案格式": "DI"
        });
        files.push({
            "種類": "SW",
            "Src": newPaper.代碼 + ".sw",
            "名稱": newPaper.代碼 + ".sw",
            "ID": "",
            "fileNo": "",
            "檔案格式": "SW"
        });
        newPaper.檔案清單.檔案 = files;
        vi.版次[0].簽核文件夾.文稿 = oldPapers.concat(newPaper);
        vi.版次[0].簽核文件夾.預設開啟文稿 = newPaper.代碼;
        if (values.draftVersion) {
            vi.版次[0].草稿編號 = values.draftVersion;
        }

        if (qs && qs.sFlag === 'Y') {
            Ext.Array.each(vi.版次, function (vs) {
                if (vs.版號 == values.version) {
                    vs.簽核文件夾.文稿 = oldPapers.concat(newPaper);
                    vs.簽核文件夾.預設開啟文稿 = newPaper.代碼;
                }
            });
        }

        return this.load(vi);
    },
    //動作
    getActions: function (group) {
        //console.log(group);
        var me = this, current = me.getCurrentEdition();
        var qs = OA.common.Global.getQ();
        var Role = OA.common.Global.getCurrentRole();

        if (!current) return;
        if (!current.簽核動作) return;

        var p = OA.common.Global.getInitParas();
        var items = [];
        Ext.each(current.簽核動作.動作, function (f) {
            var _methodId = '', _name = '', _group = '';
            for (var key in me.ACTIONS.properties) {
                if (me.ACTIONS.properties.hasOwnProperty(key)) {
                    var pro = me.ACTIONS.properties[key];
                    if (f.名稱 == pro.code) {
                        _methodId = pro.name;
                        _name = (f.OtherName) ? f.OtherName : pro.code;

                        if (_methodId == 'forward') {
                            _name = '陳會'
                        };
                        if (_methodId == 'backward') _name = '退回';
                        _group = pro.group;
                        if (pro.code == '編輯') {
                            _name = '清稿';
                        }
                        if (pro.name == 'docDelete') _name = '';

                        if (f.OtherName == '校畢') {
                            _name = '完成校稿';
                        }
                        if (pro.code == '監印完畢') {
                            _name = '完成監印';
                        }

                        break;
                    }
                }
            }
            var sameGroup = (group) ? group == _group : true;
            if (_methodId && sameGroup) {
                //送陳流程中不要顯示清稿按鈕
                var qd = OA.common.Global.getQueryDefault();
                var u = OA.common.Global.getCurrentUser();

                //非原承辦人表示在外面跑流程
                var isOwner = qd && qd.交換資訊 && qd.交換資訊.承辦人 && qd.交換資訊.承辦人.empNo == u.empNo;
                if (_name == '清稿') {
                    var isUseClear = qs.isRole15 || isOwner;
                    //檢核是否代理人
                    if (!isUseClear) {
                        if (current && current.簽核人員) {
                            if (current.簽核人員.代理人帳號 && current.簽核人員.代理人帳號 == u.empNo)
                                isUseClear = true;
                        }
                    }
                    if (!isUseClear) return true;
                }



                items.push({
                    methodId: _methodId,
                    AfterScript: f.AfterScript,
                    AfterScriptParams: f.AfterScriptParams,
                    BeforeScript: f.BeforeScript,
                    BeforeScriptParams: f.BeforeScriptParams,
                    name: _name,
                    isSign: false //  f.是否加簽
                });

                if (!qs.isRole15) {
                    if (_methodId == 'approve') {
                        if (p.roleId.toString() == '16') {
                            //items.push({
                            //    methodId: 'readlist',
                            //    AfterScript: f.AfterScript,
                            //    AfterScriptParams: f.AfterScriptParams,
                            //    BeforeScript: f.BeforeScript,
                            //    BeforeScriptParams: f.BeforeScriptParams,
                            //    name: '變更複閱',
                            //    isSign: true //  f.是否加簽
                            //});
                        }
                    }


                    else if (_methodId == 'forward') {
                        items.push({
                            methodId: 'flowlist',
                            AfterScript: f.AfterScript,
                            AfterScriptParams: f.AfterScriptParams,
                            BeforeScript: f.BeforeScript,
                            BeforeScriptParams: f.BeforeScriptParams,
                            name: '變更流程',
                            isSign: true //  f.是否加簽
                        });
                    }

                }
            }
        });

        //會中陳簽核收發要補編輯
        if (qs.isRole15 && OA.common.VIMgr.isParallel()) {
            items.push({
                AfterScript: "doAfter",
                AfterScriptParams: null,
                BeforeScript: "doBefore",
                BeforeScriptParams: '',
                isSign: true,
                methodId: "docEdit",
                name: "清稿"
            });
        }

        /*
        //模擬轉交換按鈕
        items.push({
            AfterScript: "doAfter",
            AfterScriptParams: null,
            BeforeScript: "doBefore",
            BeforeScriptParams: "{'subId':'549','subDocType':'000','subActionId':'8','subActionName':'轉交換','subActionUrl':'','subRoleId':'18','subFolderId':'03','subActionUrlx':'','buttonName':'000081803','isLast':'Y','meetNodeId':'192849','meetNo':'180751','online':'Y'}",
            name: "轉交換",
            methodId: "exchange",
            isSign: true
        });
        */

        if ((p.roleId = '') == '16' || (p.roleId = '') == '17' || (p.roleId = '') == '18' || (p.roleId = '') == '02' || qs.isRole15) {
            var idx = p.roleId.toString();
            if (qs.isRole15) idx = '15';
            var orders = OA.common.VIMgr.ACTIONS.order[idx];
            var orderItems = [];
            Ext.Array.each(orders, function (idx) {
                var a = OA.common.VIMgr.ACTIONS.properties[idx];
                Ext.Array.each(items, function (item) {
                    if (a.name == item.methodId) orderItems.push(item);
                });
            });
            return orderItems;
        }

        //重新排序按鈕
        if (items.length > 1) {
            //承辦人角色如果有清稿跟上傳按鈕（合併按鈕直接執行上傳動作不清稿上傳動作不用開發文資料上傳畫面）
            var hasSend = false;
            var hasEdit = false;
            if (Role && (Role.roleId + '') != '02') {
                Ext.Array.each(items, function (item) {
                    if (item.name == '上傳') hasSend = true;
                    if (item.name == '清稿') hasEdit = true;
                });
            }

            if (hasSend && hasEdit) {
                //合併上傳按鈕
                var newItems = [];
                Ext.Array.each(Ext.clone(items), function (item) {
                    if (item.name != '清稿') {
                        if (item.name == '上傳') {
                            item.name = '（清稿）上傳';
                        }
                        newItems.push(item)
                    }
                });

                items = newItems;
            }

            var itemSort = [];
            Ext.Array.each(items, function (item) {
                switch (item.methodId) {
                    case 'docEdit':
                        itemSort.splice(0, 0, item);
                        break;
                    case 'exchange':
                        itemSort.splice(1, 0, item);
                        break;
                    case 'docSend':
                        itemSort.splice(2, 0, item);
                        break;
                    default:
                        itemSort.push(item);
                }
            });
            return itemSort;
        }
        //判斷紙本是否只有一顆清搞按鈕，多增加關閉製作按鈕並存檔
        //console.log(items);
        if (items.length == 1) {
            if (items[0].name && items[0].name == '清稿') {
                if (qs) qs.docExit = true;
                document.addEventListener('keydown', function (e) {
                    if (e.keyCode == 116) {
                        if (qs) qs.docExit = false;
                    }
                });
                items.push({
                    AfterScript: "doAfter",
                    AfterScriptParams: null,
                    BeforeScript: "doBefore",
                    BeforeScriptParams: '',
                    isSign: false,
                    methodId: "docExit",
                    name: "關閉"
                })
            }
        }
        return items;
    },
    //驗證VI中流程選項
    hasFlowSelectItems: function (methodId) {
        var me = this,
            vi = me.getViContent();

        var ret = false;
        if (methodId == 'approve') {
            ret = (vi.下一關.決行.決行選項) ? true : false;
        } else if (methodId == 'forward') {
            ret = (vi.下一關.送陳) ? true : false;
        } else if (methodId == 'backward') {
            ret = (vi.下一關.退文.退文選項) ? true : false;
        } else if (methodId == 'read') {
            ret = (vi.下一關.覆閱) ? true : false;
        } else if (methodId == 'parallel') {
            ret = (vi.下一關.會畢.選項) ? true : false;
        }

        return ret;
    },
    //下一關
    getBarriers: function (methodId) {

        var me = this,
            vi = me.getViContent(),
            selected = null,
            defaultItem = {},
            items = [],
            flows = [],
            step = null;

        //console.log(methodId)
        //console.log(vi);

        if (methodId == 'approve') {
            flows = vi.下一關.決行.陳核流程.收件者;
            Ext.each(vi.下一關.決行.決行選項, function (p) {
                items.push({
                    lv: p.content,
                    code: p.key,
                    selectItems: flows
                });
            });
            selected = vi.下一關.決行.預設層級;
            step = vi.下一關.決行;
        } else if (methodId == 'forward') {
            var i = 0;
            if (!vi.下一關) return null;
            if (!vi.下一關.送陳) return null;
            Ext.each(vi.下一關.送陳.陳核流程, function (p) {
                flows = p.收件者;
                items.push({
                    lv: p.決行層級,
                    jobNo: p.JobNo,
                    code: (i++).toString(),
                    selectItems: flows
                });
            });
            selected = '0';
            step = vi.下一關.送陳;
        } else if (methodId == 'backward') {
            flows = vi.下一關.退文.陳核流程.收件者;
            Ext.each(vi.下一關.退文.退文選項, function (p) {
                var item = {
                    lv: p.content,
                    code: p.key.toString(),
                    selectItems: flows
                };
                Ext.applyIf(item, p);
                items.push(item);
            });
            selected = vi.下一關.退文.預設層級;
            step = vi.下一關.退文;
        } else if (methodId == 'read') {
            items = vi.下一關.覆閱.陳核流程.收件者;
            step = vi.下一關.覆閱;
        } else if (methodId == 'parallel') {
            flows = vi.下一關.會畢.陳核流程.收件者;
            Ext.each(vi.下一關.會畢.選項, function (p) {
                items.push({
                    lv: p.content,
                    code: p.key,
                    selectItems: flows
                });
            });
            selected = vi.下一關.會畢.預設;
            step = vi.下一關.會畢;
        } else {
            step = {};
            step.陳核流程 = {};
        }

        var stepFlow = step.陳核流程;
        if (Ext.isArray(step.陳核流程)) stepFlow = step.陳核流程[0];
        Ext.Array.each(stepFlow.收件者, function (f) {
            if (f.JobNo == stepFlow.JobNo) defaultItem = f;
        });

        return {
            selected: selected,
            defaultItem: defaultItem,
            items: items
        };
    },
    //處理 vi xml
    getXVI: function (paras, currentAttachs, deletePaperNoList, doSignFlag) {
        //console.log(paras);
        //沒有任何文稿
        if (paras && paras.paperNo == undefined) {
            paras.paperNo = '';
        }
        var me = this;
        paras = paras || {};
        var doSno = paras.doSno, paperNo = paras.paperNo, defaultNo = paras.paperNo;
        var qs = OA.common.Global.getQ();
        var e = OA.common.VIMgr.getCurrentEdition();
        var papers = e.簽核文件夾.文稿;
        var signFlag = '';
        if (papers) {
            if (!papers.length) papers = [papers];
        } else {
            papers = [];
        }



        //線上製作加入新文稿，離線製作不採用
        if (paras.paper) {
            papers.push(paras.paper);
        }

        if (deletePaperNoList) {
            //記錄目前文稿最大數
            if (qs.app !== 'editor' && qs.app !== 'offline' && qs.app === 'draft') {
                var No = Ext.clone(papers[papers.length - 1].代碼 + '');
                OA.common.VIMgr.setPaperNo(No);
            }
            Ext.Array.each(deletePaperNoList, function (deletePaperNo) {
                papers = papers.where("( el, i, res, param ) => el.代碼!=" + deletePaperNo);
            });
            defaultNo = (papers[papers.length - 1]) ? papers[papers.length - 1].代碼 : 1;

            //update vi dom
            var vi = OA.common.VIMgr.getViContent();
            var vid = vi.作業版本;
            var results = vi.版次.where("( el, i, res, param ) => el.版號==" + vid);
            if (results.length == 0) results = vi.版次.where("( el, i, res, param ) => el.版號=='" + vid + "'");
            var edition = results[0];
            //文稿序號要重新排序
            var index = 1;
            Ext.Array.each(papers, function (paper) {
                paper.排序 = index;
                ++index;
            });
            edition.簽核文件夾.文稿 = papers;
            edition.簽核文件夾.Number = defaultNo;
            edition.簽核文件夾.預設開啟文稿 = defaultNo;
        }

        //console.log(papers);

        if (!defaultNo && papers && papers.length > 0) defaultNo = papers[0].代碼;

        //在VI中增加簽章flag，給管理判斷，是否可執行簽章寫檔動作
        if (doSignFlag) {
            //signFlag，每次產一組變數，給管理判斷存檔是否成功
            var text = '';
            var possible = "abcdefghijklmnopqrstuvwxyz";
            for (var i = 0; i < 6; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            signFlag = ' signFlag="' + text + '"';
            paras.signFlag = text;
        } else {
            paras.signFlag = undefined;
        }

        if (paras.status == 'forward') {
            defaultNo = '';
            var firstPaper;
            Ext.Array.forEach(papers, function (paper) {
                var paperType = paper.文稿類型;
                var notNeed = ['會辦簽', '來文'].indexOf(paper.名稱) < 0;
                if (notNeed) {
                    if (!firstPaper) firstPaper = paper
                }
                //var isNote = ['簽', '便簽', '便箋'].indexOf(paperType) >= 0;
                var isNote = OA.common.Utils.isNoteDoc(paperType);
                if (isNote) {
                    defaultNo = paper.代碼;
                    return false;
                }
            });
            if (firstPaper) {
                if (!defaultNo) defaultNo = firstPaper.代碼;
            } else {
                defaultNo = papers[0].代碼;
            }
        }

        var items = [];

        var hasExchange = false;
        hasExchange = e.交換狀態 != undefined && e.交換狀態 === '1';
        if (!hasExchange)
            hasExchange = paras.isExchange != undefined && paras.isExchange === '1';
        var exChangeType = hasExchange ? ' 交換狀態="1"' : ' 交換狀態="0"';

        items.push('<?xml version="1.0" encoding="UTF-8"?>');
        var parentVersion = e.ParentVersion || 0;
        items.push('<版次 版號="' + e.版號 + '" 最後更新時間="' + OA.common.Utils.getChineseDate() +
            '" 簽核狀態="0"' + exChangeType + ' ParentVersion="' + parentVersion + '"' + signFlag + '>');
        items.push('<彙併案資訊>');
        if (e.彙併案資訊.併文清單) {
            items.push('<是否為彙併案>是</是否為彙併案>');
            var combineList = e.彙併案資訊.併文清單;
            if (combineList) {
                items.push('<併文清單>');
                Ext.Array.each(combineList.母文, function (son) {
                    //console.log(son.content);
                    items.push('<母文 doDeptno="' + son.doDeptno + '">' + son.content.toString() + '</母文>');
                });

                Ext.Array.each(combineList.子文, function (son) {
                    //console.log(son.content);
                    items.push('<子文 doDeptno="' + son.doDeptno + '">' + son.content.toString() + '</子文>');
                });
                items.push('</併文清單>');
            }
        }
        else
            items.push('<是否為彙併案>否</是否為彙併案>');
        items.push('</彙併案資訊>');

        if (e.引用案件資訊) {
            var re = e.引用案件資訊.引用案件;
            items.push('<引用案件資訊>');
            Ext.Array.each(re, function (r) {
                items.push('<引用案件 狀態="' + r.狀態 + '"' + ' 公文文號="' + r.公文文號 + '"' + ' 引用人="' + r.引用人 +
                    '"' + ' 引用時間="' + r.引用時間 + '"' + ' 刪除人="' + r.刪除人 + '"' + ' 刪除時間="' + r.刪除時間 + '"/>');
            });
            items.push('</引用案件資訊>');
        }
        var folderTag = '<簽核文件夾 ' + '公文文號="' + e.簽核文件夾.公文文號 + '"' +
            ' 預設開啟文稿="' + defaultNo + '" Number="' + papers.length + '">';
        items.push(folderTag);
        // var wk = OA.common.Global.getCurrentWKContent();
        // var lv = OA.common.Utils.getWKText(wk, '決行層級');
        // if(papers.代碼 == paperNo) {
        //     papers.決行層級 = lv
        // }

        Ext.Array.forEach(papers, function (r) {
            var files = r.檔案清單;
            var paperOrder = r.排序 || 1;
            var otherName = r.別名 || '';
            if (r.名稱 == '來文') {
                var p = '<文稿 代碼="' + r.代碼 + '"' + ' 發文文號="" 排序="' + paperOrder + '"' + ' 別名="' + otherName + '">';
                items.push(p);
            } else {
                var p = '<文稿 代碼="' + r.代碼 + '"' + ' 發文文號="' + r.發文文號 + '" 排序="' + paperOrder + '"' + ' 別名="' + otherName + '">';
                items.push(p);
            }

            items.push('<名稱>' + r.名稱 + '</名稱>');
            items.push('<文稿類型>' + r.文稿類型 + '</文稿類型>');
            if (r.名稱 !== '來文') {
                /*
                if (r.決行層級 == undefined) {
                    r.決行層級 = '董事長'
                }
                */
                items.push('<決行層級>' + r.決行層級 + '</決行層級>');

                if (r.發文方式 && r.發文方式 != 'undefined' && r.發文方式 != undefined) {
                    items.push('<發文方式>' + r.發文方式 + '</發文方式>');
                }
            }

            items.push('<來文時戳 />');

            items.push('<檔案清單>');

            if (files.檔案) {
                if (!files.檔案.length) files.檔案 = [files.檔案];
                Ext.Array.forEach(files.檔案, function (f) {
                    var s = '';
                    if (doSno) {
                        if (r.代碼 == paperNo) {
                            var src = doSno + '_' + r.代碼 + '_' + e.版號 + '.' + f.檔案格式.toLowerCase();

                            if (f.檔案格式.toUpperCase() == 'PDF') {
                                src = f.Src; //來文PDF時
                            }

                            if (f.ID && f.fileNo) {
                                src = f.Src; //來文DI時
                            }

                            s = Ext.String.format('<檔案 ID="{0}" fileNo="{1}" 種類="{2}" 檔案格式="{3}" 名稱="{4}" Src="{5}"/>',
                                (f.ID) ? f.ID : '', (f.fileNo) ? f.fileNo : '', f.種類, f.檔案格式, src, src);

                            //如果不reload vi檔，造成版次取得有誤，要更新按鈕狀態
                            if (f.Src !== src) {
                                f.名稱 = src;
                                f.Src = src;
                            }

                        } else {
                            s = Ext.String.format('<檔案 ID="{0}" fileNo="{1}" 種類="{2}" 檔案格式="{3}" 名稱="{4}" Src="{5}"/>',
                                (f.ID) ? f.ID : '', (f.fileNo) ? f.fileNo : '', f.種類, f.檔案格式, f.名稱, f.Src);
                        }
                    } else {
                        s = Ext.String.format('<檔案 ID="{0}" fileNo="{1}" 種類="{2}" 檔案格式="{3}" 名稱="{4}" Src="{5}"/>',
                            (f.ID) ? f.ID : '', (f.fileNo) ? f.fileNo : '', f.種類, f.檔案格式, f.名稱, f.Src);
                    }
                    items.push(s);
                });
            }

            var _currentAttachs = (r.代碼 == paperNo) ? currentAttachs : null
            var attachs = me.getAttachItems(paras, _currentAttachs, files);
            Ext.Array.forEach(attachs, function (p) {
                items.push(p);
            });

            items.push('</檔案清單>');

            var docPapers = r.文稿頁面;
            if (docPapers) {
                items.push('<文稿頁面>');
                if (docPapers.檔案) {
                    if (!docPapers.檔案.length) docPapers.檔案 = [docPapers.檔案];
                    Ext.Array.forEach(docPapers.檔案, function (f) {
                        items.push(Ext.String.format('<檔案 ID="{0}" fileNo="{1}" 種類="{2}" 檔案格式="{3}" Src="{4}"/>',
                            (f.ID) ? f.ID : '', (f.fileNo) ? f.fileNo : '', f.種類, f.檔案格式, f.Src));
                    });
                }
                items.push('</文稿頁面>');
            }
            if (r.批示意見) {
                var str = '';
                if (r.批示意見.content && r.批示意見.content.length > 0)
                    str = r.批示意見.content.toString();
                items.push(Ext.String.format('<批示意見 lastTime="{0}">{1}</批示意見>'
                    , r.批示意見.lastTime, str));
            }
            else {
                //建立新的文稿批示意見
                if (r.代碼 == paperNo) {
                    items.push('<批示意見 lastTime=""></批示意見>');
                }
            }
            items.push('</文稿>');
        });

        items.push('</簽核文件夾>');

        var p = e.簽核人員;
        if (p) {
            items.push('<簽核人員>');
            items.push('<所屬機構>' + p.所屬機構 + '</所屬機構>');
            items.push('<所屬機構代碼>' + p.所屬機構代碼 + '</所屬機構代碼>');
            items.push('<機構代碼>' + p.機構代碼 + '</機構代碼>');
            items.push('<服務單位>' + p.服務單位 + '</服務單位>');
            items.push('<單位代碼>' + p.單位代碼 + '</單位代碼>');
            items.push('<府發文字 />');
            items.push('<上級機關發文字>' + p.上級機關發文字 + '</上級機關發文字>');
            items.push('<本機關發文字>' + p.上級機關發文字 + '</本機關發文字>');
            items.push('<使用者帳號>' + p.使用者帳號 + '</使用者帳號>');
            if (qs.isRole15) {
                items.push('<使用者名稱>' + OA.common.Global.getSourceUser().empName + '</使用者名稱>');
            } else {
                items.push('<使用者名稱>' + p.使用者名稱 + '</使用者名稱>');
            }
            items.push('<使用者職務代碼>' + p.使用者職務代碼 + '</使用者職務代碼>');
            //核稿秘書
            if (qs.isRole15) {
                items.push('<使用者職稱>長官室秘書</使用者職稱>');
            } else {
                items.push('<使用者職稱>' + p.使用者職稱 + '</使用者職稱>');
            }
            items.push('<是否為代理>' + p.是否為代理 + '</是否為代理>');
            items.push('<是否會辦>' + p.是否會辦 + '</是否會辦>');
            items.push('<代理名稱>' + p.代理名稱 + '</代理名稱>');
            items.push('<代理職稱>' + p.代理職稱 + '</代理職稱>');
            items.push('<簽核權限>' + p.簽核權限 + '</簽核權限>');
            items.push('<機關地址>' + p.機關地址 + '</機關地址>');
            items.push('<簽核代碼>' + (p.簽核代碼 || '') + '</簽核代碼>');
            items.push('<使用者職務角色>' + (p.使用者職務角色 || '') + '</使用者職務角色>');
            if (p.聯絡方式) {
                var ways = p.聯絡方式;
                if (!Ext.isArray(ways)) ways = [ways];
                Ext.Array.forEach(ways, function (c) {
                    items.push('<聯絡方式 名稱="' + c.名稱 + '">' + c.content + '</聯絡方式>');
                });
            }
            items.push('</簽核人員>');
        }

        if (e.簽核動作) {
            items.push('<簽核動作>');
            var actions = [];
            if (e.簽核動作.動作) if (!e.簽核動作.動作.length) actions = [e.簽核動作.動作];

            Ext.Array.forEach(actions, function (a) {
                items.push('<動作 名稱="' + a.名稱 + '" 是否加簽="' + a.是否加簽 + '" BeforeScript="doBefore" BeforeScriptParams="'
                    + a.BeforeScriptParams + '" AfterScript="doAfter" AfterScriptParams="' + a.AfterScriptParams + '" />');
            });
            items.push('</簽核動作>');
        }

        if (e.卡片使用狀態) {
            items.push('<卡片使用狀態>');
            items.push('<狀態>' + e.卡片使用狀態.狀態 + '</狀態>');
            items.push('</卡片使用狀態>');
        }

        if (e.線上簽核資訊) {
            items.push('<線上簽核資訊>');
            if (qs.app == 'buchen') e.線上簽核資訊.簽核流程.異動別 = '補核';//補核
            items.push('<簽核流程 異動別="' + e.線上簽核資訊.簽核流程.異動別 + '" />');
            var str = '';
            if (e.線上簽核資訊.簽核意見 && e.線上簽核資訊.簽核意見.length > 0)
                str = e.線上簽核資訊.簽核意見.replace(/&/g, '＆').replace(/</g, '＜').replace(/>/g, '＞').toString();
            items.push('<簽核意見>' + str + '</簽核意見>');
            items.push('</線上簽核資訊>');
        }

        if (e.會辦簽稿) {
            items.push('<會辦簽稿>');
            var units = e.會辦簽稿.單位;
            if (!Ext.isArray(units)) units = [units];

            Ext.Array.forEach(units, function (unit) {
                var refPaperNo = '', parl = '', parlOver = 'N';
                if (unit.單位) {
                    parlOver = (unit.目前 == 'Y' && paras.status == 'parallel') ? 'Y' : unit.會畢;
                    items.push('<單位 名稱="' + unit.名稱 + '" 會畢="' + parlOver + '">');
                    var subUnits = unit.單位;
                    if (!Ext.isArray(subUnits)) subUnits = [subUnits];
                    Ext.Array.forEach(subUnits, function (sub) {
                        if (paras.qParallel) {
                            refPaperNo = (sub.目前 == 'Y') ? paras.paperNo : sub.文稿代碼;
                        } else {
                            refPaperNo = sub.文稿代碼;
                        }
                        parl = (sub.會辦) ? sub.會辦 : '';
                        parlOver = (sub.目前 == 'Y' && paras.status == 'parallel') ? 'Y' : sub.會畢;
                        items.push('<單位 名稱="' + sub.名稱 + '" 單位代碼="' + sub.單位代碼 + '" 文稿代碼="' + refPaperNo +
                            '" 會畢="' + parlOver + '" 目前="' + sub.目前 + '" 會辦="' + parl + '"/>');
                    });
                    items.push('</單位>');
                } else {
                    if (paras.qParallel) {
                        refPaperNo = (unit.目前 == 'Y') ? paras.paperNo : unit.文稿代碼;
                    } else {
                        refPaperNo = unit.文稿代碼;
                    }
                    parl = (unit.會辦) ? unit.會辦 : '';
                    parlOver = (unit.目前 == 'Y' && paras.status == 'parallel') ? 'Y' : unit.會畢;
                    items.push('<單位 名稱="' + unit.名稱 + '" 單位代碼="' + unit.單位代碼 + '" 文稿代碼="' + refPaperNo +
                        '" 會畢="' + parlOver + '" 目前="' + unit.目前 + '" 會辦="' + unit.會辦 + '"/>');
                }
            });
            items.push('</會辦簽稿>');
        }

        if (e.驗證碼) {
            items.push('<驗證碼>' + e.驗證碼 + '</驗證碼>');
        }
        if (OA.common.VIMgr.getViContent().主旨) {
            items.push('<主旨>');
            items.push('<文字>' + OA.common.VIMgr.getViContent().主旨.replace('&', '＆') + '</文字>');
            items.push('</主旨>');
        }
        items.push('</版次>');
        return items.join('');
    },

    getSignatureXVI: function (lastEditions, signFlowDefine, signX509) {
        var me = this;
        var paras = OA.common.Global.getInitParas();
        var doSno = paras.doSno, paperNo = paras.paperNo, defaultNo = paras.paperNo;
        var e = lastEditions;
        var papers = [e.簽核文件夾.文稿];
        /**
        if (papers) {
            if (!papers.length) papers = [papers];
        } else {
            papers = [];
        }

        //線上製作加入新文稿，離線製作不採用
        if (paras.paper) {
            papers.push(paras.paper);
        }


        if (!defaultNo) defaultNo = papers[0].代碼;

        if (paras.status == 'forward') {
            defaultNo = '';
            var firstPaper;
            Ext.Array.forEach(papers, function (paper) {
                var paperType = paper.文稿類型;
                var notNeed = ['會辦簽', '來文'].indexOf(paper.名稱) < 0;
                if (notNeed) {
                    if (!firstPaper) firstPaper = paper
                }
                //var isNote = ['簽', '便簽', '便箋'].indexOf(paperType) >= 0;
                var isNote = OA.common.Utils.isNoteDoc(paperType);
                if (isNote) {
                    defaultNo = paper.代碼;
                    return false;
                }
            });
            if (firstPaper) {
                if (!defaultNo) defaultNo = firstPaper.代碼;
            } else {
                defaultNo = papers[0].代碼;
            }
        }
        **/

        var items = [];

        var hasExchange = false;
        hasExchange = e.交換狀態 != undefined && e.交換狀態 === '1';
        if (!hasExchange)
            hasExchange = paras.isExchange != undefined && paras.isExchange === '1';
        var exChangeType = hasExchange ? ' 交換狀態="1"' : ' 交換狀態="0"';

        items.push('<?xml version="1.0" encoding="UTF-8"?>');
        var parentVersion = e.ParentVersion || 0;
        items.push('<版次 版號="' + e.版號 + '" 最後更新時間="' + e.最後更新時間 +
            '" 簽核狀態="1"' + exChangeType + ' ParentVersion="' + parentVersion + '">');
        items.push('<彙併案資訊>');
        if (e.彙併案資訊.併文清單) {
            items.push('<是否為彙併案>是</是否為彙併案>');
            var combineList = e.彙併案資訊.併文清單;
            if (combineList) {
                items.push('<併文清單>');
                Ext.Array.each(combineList.母文, function (son) {
                    //console.log(son.content);
                    items.push('<母文 doDeptno="' + son.doDeptno + '">' + son.content.toString() + '</母文>');
                });

                Ext.Array.each(combineList.子文, function (son) {
                    //console.log(son.content);
                    items.push('<子文 doDeptno="' + son.doDeptno + '">' + son.content.toString() + '</子文>');
                });
                items.push('</併文清單>');
            }
        }
        else
            items.push('<是否為彙併案>否</是否為彙併案>');
        items.push('</彙併案資訊>');

        if (e.引用案件資訊) {
            var re = e.引用案件資訊.引用案件;
            //console.log(re);
            items.push('<引用案件資訊>');
            Ext.Array.each(re, function (r) {
                items.push('<引用案件 狀態="' + r.狀態 + '"' + ' 公文文號="' + r.公文文號 + '"' + ' 引用人="' + r.引用人 +
                    '"' + ' 引用時間="' + r.引用時間 + '"' + ' 刪除人="' + r.刪除人 + '"' + ' 刪除時間="' + r.刪除時間 + '"/>');
            });
            items.push('</引用案件資訊>');
        }

        var folderTag = '<簽核文件夾 ' + '公文文號="' + e.簽核文件夾.公文文號 + '"' +
            ' 預設開啟文稿="' + e.簽核文件夾.預設開啟文稿 + '" Number="' + papers.length + '">';
        items.push(folderTag);
        Ext.Array.forEach(papers, function (r) {
            var files = r.檔案清單;
            var paperOrder = r.排序 || 1;
            var p = '<文稿 代碼="' + r.代碼 + '"' + ' 發文文號="' + r.發文文號 + '" 排序="' + paperOrder + '">';
            items.push(p);

            items.push('<名稱>' + r.名稱 + '</名稱>');
            items.push('<文稿類型>' + r.文稿類型 + '</文稿類型>');
            items.push('<來文時戳 />');

            items.push('<檔案清單>');

            if (files.檔案) {
                if (!files.檔案.length) files.檔案 = [files.檔案];
                Ext.Array.forEach(files.檔案, function (f) {
                    var s = '';
                    /*
                    if (doSno) {
                        if (r.代碼 == paperNo) {
                            var src = doSno + '_' + r.代碼 + '_' + e.版號 + '.' + f.檔案格式.toLowerCase();
                            if (f.檔案格式.toUpperCase() == 'PDF') src = f.Src; //來文PDF時

                            s = Ext.String.format('<檔案 ID="{0}" fileNo="{1}" 種類="{2}" 檔案格式="{3}" 名稱="{4}" Src="{5}"/>',
                                (f.ID) ? f.ID : '', (f.fileNo) ? f.fileNo : '', f.種類, f.檔案格式, src, src);

                            //如果不reload vi檔，造成版次取得有誤，要更新按鈕狀態
                            if (f.Src !== src) {
                                f.名稱 = src;
                                f.Src = src;
                            }

                        } else {
                            s = Ext.String.format('<檔案 ID="{0}" fileNo="{1}" 種類="{2}" 檔案格式="{3}" 名稱="{4}" Src="{5}"/>',
                                (f.ID) ? f.ID : '', (f.fileNo) ? f.fileNo : '', f.種類, f.檔案格式, f.名稱, f.Src);
                        }
                    } else {
                    **/
                    s = Ext.String.format('<檔案 ID="{0}" fileNo="{1}" 種類="{2}" 檔案格式="{3}" 名稱="{4}" Src="{5}"/>',
                        (f.ID) ? f.ID : '', (f.fileNo) ? f.fileNo : '', f.種類, f.檔案格式, f.名稱, f.Src);
                    //}
                    items.push(s);
                });
            }

            var attachs = me.getAttachItems(paras, null, files);

            Ext.Array.forEach(attachs, function (p) {
                items.push(p);
            });

            items.push('</檔案清單>');

            var docPapers = r.文稿頁面;
            if (docPapers) {
                items.push('<文稿頁面>');
                if (docPapers.檔案) {
                    if (!docPapers.檔案.length) docPapers.檔案 = [docPapers.檔案];
                    Ext.Array.forEach(docPapers.檔案, function (f) {
                        items.push(Ext.String.format('<檔案 ID="{0}" fileNo="{1}" 種類="{2}" 檔案格式="{3}" Src="{4}"/>',
                            (f.ID) ? f.ID : '', (f.fileNo) ? f.fileNo : '', f.種類, f.檔案格式, f.Src));
                    });
                }
                items.push('</文稿頁面>');
            }
            if (r.批示意見) {
                var str = '';
                if (r.批示意見.content && r.批示意見.content.length > 0)
                    str = r.批示意見.content.toString();
                items.push(Ext.String.format('<批示意見 lastTime="{0}">{1}</批示意見>'
                    , r.批示意見.lastTime, str));
            }
            else {
                //建立新的文稿批示意見
                if (r.代碼 == paperNo) {
                    items.push('<批示意見 lastTime=""></批示意見>');
                }
            }
            items.push('</文稿>');
        });

        items.push('</簽核文件夾>');

        var p = e.簽核人員;
        if (p) {
            items.push('<簽核人員>');
            items.push('<所屬機構>' + p.所屬機構 + '</所屬機構>');
            items.push('<所屬機構代碼>' + p.所屬機構代碼 + '</所屬機構代碼>');
            items.push('<機構代碼>' + p.機構代碼 + '</機構代碼>');
            items.push('<服務單位>' + p.服務單位 + '</服務單位>');
            items.push('<單位代碼>' + p.單位代碼 + '</單位代碼>');
            items.push('<府發文字 />');
            items.push('<上級機關發文字>' + p.上級機關發文字 + '</上級機關發文字>');
            items.push('<本機關發文字>' + p.上級機關發文字 + '</本機關發文字>');
            items.push('<使用者帳號>' + p.使用者帳號 + '</使用者帳號>');
            items.push('<使用者名稱>' + p.使用者名稱 + '</使用者名稱>');
            items.push('<使用者職務代碼>' + p.使用者職務代碼 + '</使用者職務代碼>');
            items.push('<使用者職稱>' + p.使用者職稱 + '</使用者職稱>');
            items.push('<是否為代理>' + p.是否為代理 + '</是否為代理>');
            items.push('<是否會辦>' + p.是否會辦 + '</是否會辦>');
            items.push('<代理名稱>' + p.代理名稱 + '</代理名稱>');
            items.push('<代理職稱>' + p.代理職稱 + '</代理職稱>');
            items.push('<簽核權限>' + p.簽核權限 + '</簽核權限>');
            items.push('<機關地址>' + p.機關地址 + '</機關地址>');
            items.push('<簽核代碼>' + (p.簽核代碼 || '') + '</簽核代碼>');
            items.push('<使用者職務角色>' + (p.使用者職務角色 || '') + '</使用者職務角色>');
            if (p.聯絡方式) {
                var ways = p.聯絡方式;
                if (!Ext.isArray(ways)) ways = [ways];
                Ext.Array.forEach(ways, function (c) {
                    items.push('<聯絡方式 名稱="' + c.名稱 + '">' + c.content + '</聯絡方式>');
                });
            }
            items.push('</簽核人員>');
        }

        if (e.簽核動作) {
            items.push('<簽核動作>');
            var actions = [];
            if (e.簽核動作.動作) if (!e.簽核動作.動作.length) actions = [e.簽核動作.動作];

            Ext.Array.forEach(actions, function (a) {
                items.push('<動作 名稱="' + a.名稱 + '" 是否加簽="' + a.是否加簽 + '" BeforeScript="doBefore" BeforeScriptParams="'
                    + a.BeforeScriptParams + '" AfterScript="doAfter" AfterScriptParams="' + a.AfterScriptParams + '" />');
            });
            items.push('</簽核動作>');
        }

        if (e.卡片使用狀態) {
            items.push('<卡片使用狀態>');
            items.push('<狀態>' + e.卡片使用狀態.狀態 + '</狀態>');
            items.push('</卡片使用狀態>');
        }

        if (e.線上簽核資訊) {
            items.push('<線上簽核資訊>');
            items.push('<簽核流程 異動別="' + e.線上簽核資訊.簽核流程.異動別 + '" />');
            var str = '';
            if (e.線上簽核資訊.簽核意見 && e.線上簽核資訊.簽核意見.length > 0)
                str = e.線上簽核資訊.簽核意見.replace(/&/g, '＆').replace(/</g, '＜').replace(/>/g, '＞').toString();
            items.push('<簽核意見>' + str + '</簽核意見>');
            items.push('</線上簽核資訊>');
        }

        if (e.會辦簽稿) {
            items.push('<會辦簽稿>');
            var units = e.會辦簽稿.單位;
            if (!Ext.isArray(units)) units = [units];

            Ext.Array.forEach(units, function (unit) {
                var refPaperNo = '', parl = '', parlOver = 'N';
                if (unit.單位) {
                    parlOver = (unit.目前 == 'Y' && paras.status == 'parallel') ? 'Y' : unit.會畢;
                    items.push('<單位 名稱="' + unit.名稱 + '" 會畢="' + parlOver + '">');
                    var subUnits = unit.單位;
                    if (!Ext.isArray(subUnits)) subUnits = [subUnits];
                    Ext.Array.forEach(subUnits, function (sub) {
                        if (paras.qParallel) {
                            refPaperNo = (sub.目前 == 'Y') ? paras.paperNo : sub.文稿代碼;
                        } else {
                            refPaperNo = sub.文稿代碼;
                        }
                        parl = (sub.會辦) ? sub.會辦 : '';
                        parlOver = (sub.目前 == 'Y' && paras.status == 'parallel') ? 'Y' : sub.會畢;
                        items.push('<單位 名稱="' + sub.名稱 + '" 單位代碼="' + sub.單位代碼 + '" 文稿代碼="' + refPaperNo +
                            '" 會畢="' + parlOver + '" 目前="' + sub.目前 + '" 會辦="' + parl + '"/>');
                    });
                    items.push('</單位>');
                } else {
                    if (paras.qParallel) {
                        refPaperNo = (unit.目前 == 'Y') ? paras.paperNo : unit.文稿代碼;
                    } else {
                        refPaperNo = unit.文稿代碼;
                    }
                    parl = (unit.會辦) ? unit.會辦 : '';
                    parlOver = (unit.目前 == 'Y' && paras.status == 'parallel') ? 'Y' : unit.會畢;
                    items.push('<單位 名稱="' + unit.名稱 + '" 單位代碼="' + unit.單位代碼 + '" 文稿代碼="' + refPaperNo +
                        '" 會畢="' + parlOver + '" 目前="' + unit.目前 + '" 會辦="' + unit.會辦 + '"/>');
                }
            });
            items.push('</會辦簽稿>');
        }

        if (e.驗證碼) {
            items.push('<驗證碼>' + e.驗證碼 + '</驗證碼>');
        }
        if (OA.common.VIMgr.getViContent().主旨) {
            items.push('<主旨>');
            items.push('<文字>' + OA.common.VIMgr.getViContent().主旨.replace('&', '＆') + '</文字>');
            items.push('</主旨>');
        }
        items.push('<SignatureData>');
        items.push(Ext.String.format('<簽核點定義 URI="{0}" Id="{1}" />', signFlowDefine.URI, signFlowDefine.Id));
        items.push('<CN></CN>');
        items.push('<SDN></SDN>');
        items.push('<IDN></IDN>');
        items.push('<SerialNumber></SerialNumber>');
        items.push('<ValidateDate>0</ValidateDate>');
        items.push(Ext.String.format('<SignDateTime>{0}</SignDateTime>', e.最後更新時間));
        //items.push(Ext.String.format('-----BEGIN CERTIFICATE-----'));
        items.push(Ext.String.format('<X509Data>-----BEGIN CERTIFICATE-----{0}-----END CERTIFICATE-----</X509Data>', signX509.textContent));
        //items.push(Ext.String.format('-----END CERTIFICATE-----'));
        items.push('</SignatureData>');




        /**
        <SignatureData>
            <簽核點定義 URI="#FlowUri_00705595320)" Id="FlowId_00705595320" />
            <CN>
                <![CDATA[測試自然人1]]>
                                        </CN>
            <SDN>
                <![CDATA[SERIALNUMBER=0243168420097927, CN=測試自然人1, C=TW]]>
                                        </SDN>
            <IDN>OU=(測試用) 政府測試憑證管理中心, O=行政院, C=TW</IDN>
            <SerialNumber>C7DE5501CD056190368921BCE169F310</SerialNumber>
            <ValidateDate>0</ValidateDate>
            <SignDateTime>108/01/21 14:43:54</SignDateTime>
            <X509Data>-----BEGIN CERTIFICATE-----
             MIIFDDCCA/SgAwIBAgIRAMfeVQHNBWGQNokhvOFp8xAwDQYJKoZIhvcNAQELBQAwVjELMAkGA1UEBhMCVFcxEjAQBgNVBAoMCeihjOaUv+mZojEzMDEGA1UECwwqKOa4rOippueUqCkg5pS/5bqc5ris6Kmm5oaR6K2J566h55CG5Lit5b+DMB4XDTE4MDgxMDA3MDYzMloXDTE5MDIxMDA3MDYzMlowQzELMAkGA1UEBhMCVFcxGTAXBgNVBAMMEOa4rOippuiHqueEtuS6ujExGTAXBgNVBAUTEDAyNDMxNjg0MjAwOTc5MjcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDIj6EXnm7YDQGdrT0zaxPhalPpn3MWKDB5WFnoiG8IwT0zwfCMddg42dVNsiFgPvxXHzEa6TuEfkztbENgRGe161RKzjvN5P3uUbjGBX1IVPbIeUkxFzmYq60B354I4Y9pLtWr3NJY+jP+sEUNDVeQjutwwGzMB1RFErrJaHbD1T2RnGJjSmzp7aSEYI4Y/aLn3HwVJL9zbhvYUkFQXm+eBF9k9wYl9HnbxwJHjhGzQ5C5L1Kt/xXKA/Gphec0C84meM8APHV6J99Uvu/EPvY909+R345cDbnuQuv6Boy7aZUf4+LpxrTOLv3cOaPymGFFkzVc2K+pYXRa0NhKKouRAgMBAAGjggHmMIIB4jAfBgNVHSMEGDAWgBR3r9Blh+4dyKn2l6AlRw7JldpxqzAdBgNVHQ4EFgQUS4hnK1Cs1YeNaq+n0AOFmZaD86QwDgYDVR0PAQH/BAQDAgeAMBQGA1UdIAQNMAswCQYHYIZ2ZQADADAZBgNVHREEEjAQgQ5rZEB0ZXN0LmNvbS50dzAzBgNVHQkELDAqMBUGB2CGdgFkAgExCgYIYIZ2AWQDAQEwEQYHYIZ2AWQCMzEGDAQ2Nzg5MIGGBgNVHR8EfzB9MECgPqA8hjpodHRwOi8vZ3Rlc3RjYS5uYXQuZ292LnR3L2NybC9HVGVzdENBMi84ODg4LTEvY29tcGxldGUuY3JsMDmgN6A1hjNodHRwOi8vZ3Rlc3RjYS5uYXQuZ292LnR3L2NybC9HVGVzdENBMi9jb21wbGV0ZS5jcmwwIAYDVR0lAQH/BBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMEMH8GCCsGAQUFBwEBBHMwcTA+BggrBgEFBQcwAoYyaHR0cDovL2d0ZXN0Y2EubmF0Lmdvdi50dy9jZXJ0cy9Jc3N1ZWRUb1RoaXNDQS5wN2IwLwYIKwYBBQUHMAGGI2h0dHA6Ly9ndGVzdGNhLm5hdC5nb3YudHcvT0NTUC9vY3NwMA0GCSqGSIb3DQEBCwUAA4IBAQBZkDYqRWcgQ0brjTUERZTolyLNJb9Yubtksck68yTXwbgymjUNjO7k10b87vTbdf2pZi9YgihfIwTKnZytvJB+dHk2SK+WDuBGixMJECt2RS261nKPRRBzaYc9Ks7Ae5YqLs3UZ0mPwuCrJek2GfCGGjQ1isJWwk95nkPeAI97PALb0iFVrZZtO5v32qecOP4Y/4rLJfqxBdSGhH0xJUZpGOwPyYjPhvNtZFYAas6Dfu1jDXZij2h/QO5Az2SuVN8QFkokQNyKbw4ylYKjBC+OYMscd6VLg+x7ZZ/xTWw2lZWdSBjWsrlF4A5jmi6KBKSikXx6Kfj1OyxmQH/Oemhc
             -----END CERTIFICATE-----</X509Data>
        </SignatureData>
        **/


        items.push('</版次>');
        return items.join('');
    },
    getNewXVI: function (docType, paras, currentAttachs) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var items = [];
        items.push('<?xml version="1.0" encoding="UTF-8"?>');
        items.push('<版本資訊 作業文號="" 作業版本="0">');
        items.push('<版次 版號="0" 最後更新時間="' + OA.common.Utils.getChineseDate() + '">');
        items.push('<彙併案資訊>');
        items.push('<是否為彙併案>否</是否為彙併案>');
        items.push('</彙併案資訊>');
        items.push('<簽核文件夾 公文文號="" 預設開啟文稿="1">');
        items.push('<文稿 代碼="1" 發文文號="">');
        items.push('<名稱>創稿</名稱>');
        items.push('<文稿類型>' + docType + '</文稿類型>');
        items.push('<來文時戳/>');
        items.push('<檔案清單>');
        items.push('<檔案 ID="" fileNo="" 種類="本文" 檔案格式="DI" 名稱="' + paras.version + '.di" Src="' + paras.version + '.di"/>');
        items.push('<檔案 ID="" fileNo="" 種類="SW" 檔案格式="SW" 名稱="' + paras.version + '.sw" Src="' + paras.version + '.sw"/>');

        //附件清單
        Ext.Array.forEach(me.getAttachItems(paras, currentAttachs), function (p) {
            items.push(p);
        });

        items.push('</檔案清單>');
        items.push('</文稿>');
        items.push('</簽核文件夾>');
        items.push('</版次>');

        if (qs.projNo && qs.docDesc) {
            items.push('<專案主旨>');
            items.push('<文字>' + (qs.docDesc + '').replace('&', '＆') + '</文字>');
            items.push('</專案主旨>');
        }

        items.push('</版本資訊>');
        return items.join('');
    },
    getAttachItems: function (paras, currentAttachs, xfiles) {
        var items = [];
        items.push('<附件清單>');
        var attachList = [], attachRef = [], attachBig = [];

        if (xfiles) {
            if (xfiles.附件清單) {
                if (xfiles.附件清單.附件) {
                    attachList = xfiles.附件清單.附件;
                    if (!attachList.length) attachList = [attachList];
                }
                if (xfiles.附件清單.參考附件) {
                    attachRef = xfiles.附件清單.參考附件;
                    if (!attachRef.length) attachRef = [attachRef];
                }
                if (xfiles.附件清單.大型附件) {
                    attachBig = xfiles.附件清單.大型附件;
                    if (!attachBig.length) attachBig = [attachBig];
                }
            }
        }


        if (currentAttachs) {
            attachList = [];
            attachRef = [];
            attachBig = [];
            Ext.Array.forEach(currentAttachs, function (f) {
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
                    filePath: f.filePath || '',
                    otherFileName: f.otherFileName || ''    //0918 來文附件中新增別名紀錄VI Chloe.sia
                };

                if (f.folderName == "attach") {
                    attachList.push(item);
                } else if (f.folderName == "ref") {
                    attachRef.push(item);
                } else if (f.folderName == "big") {
                    attachBig.push(item);
                }
            });
        }

        Ext.Array.forEach(attachList, function (f) {
            var s = Ext.String.format('<附件 ID="{0}" jobNo="{1}" 名稱="{2}" Src="{3}" 檔案格式="{4}" status="{5}" ' +
                'empNo="{6}" empName="{7}" version="{8}" uploadTime="{9}" delEmpNo="{10}" delEmpName="{11}" ' +
                'delVersion="{12}" delTime="{13}" fileSize="{14}" depName="{15}" addDepName="{16}" addTime="{17}" addEmpName="{18}" ' +
                'reTime="{19}" reEmpName="{20}" reDepName="{21}" filePath="{22}" otherFileName="{23}"/>', f.ID, f.jobNo, f.名稱, f.Src, f.檔案格式, f.status,
                f.empNo, f.empName, f.version, f.uploadTime, f.delEmpNo, f.delEmpName, f.delVersion, f.delTime, f.fileSize,
                f.depName, f.addDepName, f.addTime, f.addEmpName, f.reTime, f.reEmpName, f.reDepName, f.filePath, f.otherFileName);
            if (f.Src) items.push(s);
        });
        Ext.Array.forEach(attachRef, function (f) {
            var s = Ext.String.format('<參考附件 ID="{0}" jobNo="{1}" 名稱="{2}" Src="{3}" 檔案格式="{4}" status="{5}" ' +
                'empNo="{6}" empName="{7}" version="{8}" uploadTime="{9}" delEmpNo="{10}" delEmpName="{11}" ' +
                'delVersion="{12}" delTime="{13}" fileSize="{14}" depName="{15}" addDepName="{16}" addTime="{17}" addEmpName="{18}" ' +
                'reTime="{19}" reEmpName="{20}" reDepName="{21}" filePath="{22}" />', f.ID, f.jobNo, f.名稱, f.Src, f.檔案格式, f.status,
                f.empNo, f.empName, f.version, f.uploadTime, f.delEmpNo, f.delEmpName, f.delVersion, f.delTime, f.fileSize,
                f.depName, f.addDepName, f.addTime, f.addEmpName, f.reTime, f.reEmpName, f.reDepName, f.filePath);
            if (f.Src) items.push(s);
        });
        Ext.Array.forEach(attachBig, function (f) {
            var s = Ext.String.format('<大型附件 ID="{0}" jobNo="{1}" 名稱="{2}" Src="{3}" 檔案格式="{4}" status="{5}" ' +
                'empNo="{6}" empName="{7}" version="{8}" uploadTime="{9}" delEmpNo="{10}" delEmpName="{11}" ' +
                'delVersion="{12}" delTime="{13}" fileSize="{14}" depName="{15}" addDepName="{16}" addTime="{17}" addEmpName="{18}" ' +
                'reTime="{19}" reEmpName="{20}" reDepName="{21}" filePath="{22}" />', f.ID, f.jobNo, f.名稱, f.Src, f.檔案格式, f.status,
                f.empNo, f.empName, f.version, f.uploadTime, f.delEmpNo, f.delEmpName, f.delVersion, f.delTime, f.fileSize,
                f.depName, f.addDepName, f.addTime, f.addEmpName, f.reTime, f.reEmpName, f.reDepName, f.filePath);
            if (f.Src) items.push(s);
        });
        items.push('</附件清單>');
        return items;
    },
    getAttachPaper: function (paperNo, paras, xfiles, currentAttachs, folderName) {
        var items = [];
        var _attachs = xfiles;
        if (currentAttachs) {
            _attachs = [];
            Ext.Array.forEach(currentAttachs, function (f) {
                if (f.folderName == folderName) {
                    _attachs.push({
                        ID: padLeft(OA.common.Utils.getRandom(0, 9999999999), 10),
                        jobNo: (paras.jobNo) ? paras.jobNo : '',
                        名稱: (f.fileKey) ? f.fileKey : '',
                        Src: (f.fileName) ? f.fileName : '',
                        檔案格式: (f.fileType) ? f.fileType : '',
                        empNo: (paras.empNo) ? paras.empNo : '',
                        otherFileName: (f.otherFileName) ? f.otherFileName : ''
                    });
                }
            });
        }
        if (_attachs.length > 0) {
            items.push('<文稿 代碼="' + paperNo + '">');
            Ext.Array.forEach(_attachs, function (f) {
                var s = Ext.String.format('<附件 ID="{0}" jobNo="{1}" 名稱="{2}" Src="{3}" 檔案格式="{4}" empNo="{5}" otherFileName="{6}"/>'
                    , f.ID, f.jobNo, f.名稱, f.Src, f.檔案格式, f.empNo, f.otherFileName);
                items.push(s);
            });
            items.push('</文稿>');
        }
        return items;
    },
    getXSW: function (data, hasSendAtt) {
        var items = [];
        items.push('<?xml version="1.0" encoding="utf-8"?>');
        items.push('<!DOCTYPE 交換表單 SYSTEM "104_roster_utf8.dtd">');
        items.push('<交換表單>');
        Ext.Array.each(data, function (d) {
            var item = (d.data) ? d.data : d;
            if (item.children) {
                var child = [];
                if (Ext.isArray(item.children)) {
                    child = item.children;
                } else {
                    child = JSON.parse(item.children);
                }
                //是否有除外
                var except = [];
                if (item.except && item.except.length > 0) {
                    except = item.except.split('、');
                }
                Ext.Array.each(child, function (ch) {
                    //                    if (except.indexOf(ch.dep3Name) < 0)  {                    
                    if ((except.indexOf(ch.dep3Name) < 0) && (items.indexOf(Ext.String.format('<全銜>{0}</全銜>', ch.dep3Name)) < 0)) {
                        items.push(Ext.String.format('<全銜>{0}</全銜>', (ch.dep3Name + '').trim()));
                        items.push(Ext.String.format('<機關代碼>{0}</機關代碼>', ch.dep3No));
                        if (hasSendAtt && item.KEY === '副本')
                            items.push(Ext.String.format('<含附件>{0}</含附件>', item.ATTACH == 'Y' ? '含附件' : '不含附件'));

                        items.push('<本別>');
                        if (item.KEY === '副本')
                            items.push(Ext.String.format('<收發處理本別 代碼="{0}" />', item.KEY));
                        else
                            items.push(Ext.String.format('<收發處理本別 代碼="{0}" />', '正本'));
                        items.push('</本別>');
                    }
                });
            } else {
                if (items.indexOf(Ext.String.format('<全銜>{0}</全銜>', item.CODENAME)) < 0) {
                    items.push(Ext.String.format('<全銜>{0}</全銜>', (item.CODENAME + '').trim()));
                    items.push(Ext.String.format('<機關代碼>{0}</機關代碼>', item.CODE));
                    if (hasSendAtt && item.KEY === '副本')
                        items.push(Ext.String.format('<含附件>{0}</含附件>', item.ATTACH == 'Y' ? '含附件' : '不含附件'));

                    items.push('<本別>');
                    if (item.KEY === '副本')
                        items.push(Ext.String.format('<收發處理本別 代碼="{0}" />', item.KEY));
                    else
                        items.push(Ext.String.format('<收發處理本別 代碼="{0}" />', '正本'));
                    items.push('</本別>');
                }
            }
        });
        items.push('</交換表單>');
        return items.join('');
    },
    getXSWSend: function () {
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        if (!vm.ContactList) return '';

        var attachItem = OA.common.InitParas.getAttachItem(wk.orgNo);
        var _attachsAdd = attachItem.vi.where("( el, i, res, param ) =>el.folderName =='attach'&&el.status!='0'");
        var hasAttach = _attachsAdd.length > 0;

        var qs = OA.common.Global.getQ();
        if (qs.app === 'offline') {
            cansend = vm.ContactList;
        } else {
            var cansend = Ext.Array.filter(vm.ContactList, function (item) {
                return (item.TRANSTYPE.toString() == '9');
            });
        }
        return OA.common.VIMgr.getXSW(cansend, hasAttach);
    },
    getXAttchNew: function (paras, currentAttachs) {
        var me = this;
        var items = [];
        items.push('<?xml version="1.0" encoding="utf-8"?>');
        items.push('<版本資訊>');

        items.push('<參考附件>');
        Ext.Array.forEach(me.getAttachPaper(1, paras, null, currentAttachs, 'ref'), function (p) {
            items.push(p);
        });
        items.push('</參考附件>');

        items.push('<大型附件>');
        Ext.Array.forEach(me.getAttachPaper(1, paras, null, currentAttachs, 'big'), function (p) {
            items.push(p);
        });
        items.push('</大型附件>');

        items.push('</版本資訊>');
        return items.join('');
    },
    getXAttch: function (paras, currentAttachs) {
        var me = this;
        var paperNo = paras.paperNo;
        var e = OA.common.VIMgr.getCurrentEdition();
        var papers = e.簽核文件夾.文稿;
        if (papers) {
            if (!papers.length) papers = [papers];
        } else {
            papers = [];
        }

        var items = [];
        items.push('<?xml version="1.0" encoding="utf-8"?>');
        items.push('<版本資訊>');

        items.push('<參考附件>');
        Ext.Array.forEach(papers, function (r) {
            var files = r.檔案清單;
            var attachRef = [];
            if (files.附件清單) {
                if (files.附件清單.參考附件) {
                    attachRef = files.附件清單.參考附件;
                    if (!attachRef.length) attachRef = [attachRef];
                }
            }

            if (r.代碼 == paperNo) {
                Ext.Array.forEach(me.getAttachPaper(r.代碼, paras, attachRef, currentAttachs, 'ref'), function (p) {
                    items.push(p);
                });
            }
            else {
                Ext.Array.forEach(me.getAttachPaper(r.代碼, paras, attachRef), function (p) {
                    items.push(p);
                });
            }
        });
        items.push('</參考附件>');

        items.push('<大型附件>');
        Ext.Array.forEach(papers, function (r) {
            var files = r.檔案清單;
            var attachBig = [];
            if (files.附件清單) {
                if (files.附件清單.大型附件) {
                    attachBig = files.附件清單.大型附件;
                    if (!attachBig.length) attachBig = [attachBig];
                }
            }
            if (r.代碼 == paperNo) {
                Ext.Array.forEach(me.getAttachPaper(r.代碼, paras, attachBig, currentAttachs, 'big'), function (p) {
                    items.push(p);
                });
            }
            else {
                Ext.Array.forEach(me.getAttachPaper(r.代碼, paras, attachBig), function (p) {
                    items.push(p);
                });
            }
        });
        items.push('</大型附件>');

        items.push('</版本資訊>');
        return items.join('');
    },
    getXDM: function (type, value) {
        var items = [];
        items.push('<?xml version="1.0" encoding="utf-8"?>');
        items.push('<!DOCTYPE 文書訊息表單 SYSTEM "104_DM_utf8.dtd">');
        items.push('<文書訊息表單>');
        items.push(Ext.String.format('<文書訊息代碼>{0}</文書訊息代碼>', type));
        items.push(Ext.String.format('<訊息備註>{0}</訊息備註>', value));
        items.push('</文書訊息表單>');
        return items.join('');
    },
    getFollowFiles: function () {
        var vi = OA.common.VIMgr.getViContent();
        var editionFirst = vi.版次.where("( el, i, res, param ) => el.版號===0")[0];
        var editionFirstPapers = editionFirst.簽核文件夾.文稿;
        if (!Ext.isArray(editionFirstPapers)) editionFirstPapers = [editionFirstPapers];
        var files = editionFirstPapers[0].檔案清單.檔案;
        if (!files) {
            if (vi.版次.length && vi.版次.length > 1) {
                var editionSecond = vi.版次[0];
                var editionSecondPapers = editionSecond.簽核文件夾.文稿;
                if (!Ext.isArray(editionSecondPapers)) editionSecondPapers = [editionSecondPapers];
                files = editionSecondPapers[0].檔案清單.檔案;
            } else {
                return null;
            }
        }

        if (!Ext.isArray(files)) files = [files];
        var paperFiles = [];
        Ext.Array.each(files, function (f) {
            paperFiles.push({
                fileKey: f.ID,
                fileName: f.Src,
                folderName: '',
                fileType: f.檔案格式,
                fileContent: null
            });
        });
        return paperFiles;
    },
    hadApproved: function () {
        var o = OA.common.VIMgr.getViContent();
        var hadApproved = false;
        Ext.Array.forEach(o.版次, function (edition) {
            if (edition.線上簽核資訊 && edition.線上簽核資訊.簽核流程.異動別 === '決行') hadApproved = true;
        });
        return hadApproved;
    },
    //決行後有送陳
    hadApprovedBack: function () {
        var current = OA.common.VIMgr.getCurrentEdition();
        var hadCurrentForward = false;
        if (this.hadApproved()) {
            if (current.簽核動作 && current.簽核動作.動作) {
                var actions = current.簽核動作.動作;
                if (!Ext.isArray(actions)) actions = [actions];
                Ext.Array.forEach(actions, function (action) {
                    if (action.名稱 === '送陳/會') hadCurrentForward = true;
                });
            }
        }
        return hadCurrentForward;
    },
    //簽核動作是否有轉交換
    hadExchange: function () {
        var current = OA.common.VIMgr.getCurrentEdition();
        var hasButton = false;
        if (current && current.簽核動作 && current.簽核動作.動作) {
            var actions = current.簽核動作.動作;
            if (!Ext.isArray(actions)) actions = [actions];
            Ext.Array.forEach(actions, function (action) {
                if (action.名稱 === '轉交換') hasButton = true;
            });
        }
        return hasButton;
    },
    //簽核動作是否有退稿
    hadBackDraft: function () {
        var current = OA.common.VIMgr.getCurrentEdition();
        var hasButton = false;
        if (current && current.簽核動作 && current.簽核動作.動作) {
            var actions = current.簽核動作.動作;
            if (!Ext.isArray(actions)) actions = [actions];
            Ext.Array.forEach(actions, function (action) {
                if (action.名稱 === '退稿') hasButton = true;
            });
        }
        return hasButton;
    },
    //會辦簽稿: 會辦時，無單位簽，自動創會辦意見簽 （同科室只開一張，不同科室判斷是否會畢)
    isParallel: function () {
        var current = OA.common.VIMgr.getCurrentEdition();
        return current && current.簽核人員 && current.簽核人員.是否會辦 == '是';
    },
    //會辦頭
    isParallelFirst: function () {
        var current = OA.common.VIMgr.getCurrentEdition();
        return this.isParallel() && current.簽核人員.會辦序號 != undefined && current.簽核人員.會辦序號 == 0;
    },
    isOnlyFollow: function () {
        var pages = OA.common.VIMgr.getCurrentEditionPapers();
        var paper = pages[0];
        if (paper && paper.名稱 == '來文') {
            return pages.length == 1;
        } else {
            return false;
        }
    },
    hadParallelDraft: function () {
        var me = this;
        var current = OA.common.VIMgr.getCurrentEdition();

        if (me.isParallel()) {
            var unitNote = { 文稿代碼: '' };
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
                                if (sub.文稿代碼) isFindCurrent = true;
                            }
                        });
                    } else {
                        if (unit.目前 == 'Y') {
                            unitNote = unit;
                            if (unit.文稿代碼) isFindCurrent = true;
                        }
                    }
                });
            }
            return isFindCurrent;
        }
        return false;
    },
    isParallelDraftNoCurrent: function () {
        var me = this;
        var current = OA.common.VIMgr.getCurrentEdition();
        if (!current.會辦簽稿) return false;

        var find = false;
        var units = current.會辦簽稿.單位;
        if (!Ext.isArray(units)) units = [units];
        Ext.Array.forEach(units, function (unit) {
            if (unit.單位) {
                var subUnits = unit.單位;
                if (!Ext.isArray(subUnits)) subUnits = [subUnits];
                Ext.Array.forEach(subUnits, function (sub) {
                    if (sub.目前 == 'Y') find = true;
                });
            } else {
                if (unit.目前 == 'Y') find = true;
            }
        });

        return !find;

    },
    getFollowFile: function () {
        var vi = OA.common.VIMgr.getViContent();
        var editionFirst = vi.版次.where("( el, i, res, param ) => el.版號==0")[0];
        var editionFirstPapers = editionFirst.簽核文件夾.文稿;
        if (!Ext.isArray(editionFirstPapers)) editionFirstPapers = [editionFirstPapers];
        var files = editionFirstPapers[0].檔案清單.檔案;
        if (!Ext.isArray(files)) files = [files];
        return files[0];
    }, isFollowPDF: function () {
        var vi = OA.common.VIMgr.getViContent();
        var editionFirst = vi.版次.where("( el, i, res, param ) => el.版號==0")[0];
        var editionFirstPapers = editionFirst.簽核文件夾.文稿;
        if (!Ext.isArray(editionFirstPapers)) editionFirstPapers = [editionFirstPapers];
        var files = editionFirstPapers[0].檔案清單.檔案;
        if (!Ext.isArray(files)) files = [files];
        return files[0].檔案格式.toUpperCase() === 'PDF';
    },
    //有轉交換按鈕，多稿時，且發文文號不為11碼，自動取支號
    needAutoSubNo: function () {
        var initParas = OA.common.Global.getInitParas();
        var isExchangeAndMorePages = OA.common.VIMgr.hadExchange() && OA.common.DIMgr.getDraftCount() > 1;
        var len = (initParas.sendNo) ? initParas.sendNo.toString().length : 0;
        var isMoreSend = len < 11 && OA.common.DIMgr.getDraftCount() > 1; //預提10碼，多稿需重給支號
        var needAutoSubNo = (isExchangeAndMorePages && !initParas.sendNo) || isMoreSend;
        return needAutoSubNo;
    },

    checkLockDoc: function (docs) {
        /* 
         * 評議中心規則公文一但決行後就不能做任何修改（只能打意見）
         * 總發不鎖
         * 決行後抽回不鎖
         * 續辦後不鎖
         * 
         */

        var o = OA.common.VIMgr.getViContent();
        var qs = OA.common.Global.getQ();
        var qd = OA.common.Global.getQueryDefault();
        var edition = OA.common.VIMgr.getCurrentEdition();
        //總發不鎖改稿權限、登記桌
        var unLockID = false;
        var isParallel = false;
        var dcsnDate = '';
        var Role = OA.common.Global.getCurrentRole();
        if (Role && '02'.indexOf(Role.roleId) >= 0) unLockID = true;
        if (edition.簽核人員 && edition.簽核人員.是否會辦 == '是') isParallel = true;
        if (qd && qd.交換資訊 && qd.交換資訊.決行日期 && (qd.交換資訊.決行日期 + '').length > 0) dcsnDate = qd.交換資訊.決行日期;

        Ext.Array.each(docs, function (doc) {
            //console.log(doc);
            if (doc.kind && doc.kind == '來文') return true;

            if (dcsnDate.length > 0) {
                doc.isDecision = true; //決行註記

            }

            if (isParallel) {
                doc.isLockDoc = true; //不能改稿
            }

            //決行後紙本一律可改
            if (doc.isDecision) {
                if (OA.common.Utils.checkEpaper()) {
                    doc.isLockDoc = true;
                } else {
                    doc.isLockDoc = false;
                }
            }

            if (unLockID) {
                doc.isLockDoc = false; //可改稿
            }

            //console.log('this');



        });
    },
    //決行的文稿，改稿權限(舊規則不適合評議中心用)
    checkLockDocOLD: function (docs) {
        var o = OA.common.VIMgr.getViContent();
        var qs = OA.common.Global.getQ();
        //總發不鎖改稿權限
        var unLockID = false;
        var Role = OA.common.Global.getCurrentRole();
        if (Role && '02'.indexOf(Role.roleId) >= 0) unLockID = true;

        var oldApproved = [];
        Ext.Array.forEach(o.版次, function (oldEdition) {
            if (oldEdition.線上簽核資訊 && oldEdition.線上簽核資訊.簽核流程.異動別 === '決行')
                oldApproved.push(oldEdition);
        });

        if (oldApproved && oldApproved.length > 0) {
            var edition = OA.common.VIMgr.getCurrentEdition();
            var role = OA.common.Global.getCurrentRole();
            var isContinued = false;//承辦人、長官
            var isParallel = false;//會辦單位

            if (edition.簽核動作 && edition.簽核動作.動作) {
                var actions = edition.簽核動作.動作;
                if (!Ext.isArray(actions)) actions = [actions];
                Ext.Array.forEach(actions, function (action) {
                    if (['送陳/會', '決行'].indexOf(action.名稱) !== -1) isContinued = true;
                });
            }
            Ext.Array.each(oldApproved, function (oldApp) {

                Ext.Array.each(oldApp.簽核文件夾.文稿, function (item) {
                    Ext.Array.each(docs, function (doc) {
                        if (item.代碼 === doc.paperNo) {
                            doc.isDecision = true;//已決行文稿
                        }
                    });
                });

                if (edition.簽核人員 && edition.簽核人員.是否會辦 == '是') isParallel = true;
                if (isParallel) return;

                if (isContinued) {
                    if (!unLockID) {
                        //續辦狀態重新送陳會，或決行抽回，非歷史決行版次文稿不鎖定按鈕
                        if (edition.版號 !== oldApp.版號) {
                            var oldappDoc = oldApp.簽核文件夾.文稿;
                            if (oldappDoc) {
                                Ext.Array.each(oldappDoc, function (item) {
                                    Ext.Array.each(docs, function (doc) {
                                        if (item.代碼 === doc.paperNo) {
                                            doc.isLockDoc = true;//不能改稿                                            
                                        }
                                    });
                                });
                            }
                        }
                    }
                } else {
                    //待結案要抓最後一次決行的版次的文稿不鎖定
                    if (!unLockID) {
                        var lastEdition = oldApproved[oldApproved.length - 1];
                        if (lastEdition.版號 !== oldApp.版號) {
                            var oldappDoc = oldApp.簽核文件夾.文稿;
                            if (oldappDoc) {
                                Ext.Array.each(oldappDoc, function (item) {
                                    Ext.Array.each(docs, function (doc) {
                                        if (item.代碼 === doc.paperNo) {
                                            doc.isLockDoc = true;//不能改稿
                                        }
                                    });
                                });
                            }
                        }
                    }
                }
            });
        }
    },
    getParentVersion: function (version) {
        var VI = OA.common.VIMgr.getViContent();
        var viItems = VI.版次;
        if (viItems.length > 0) {
            Ext.Array.each(viItems, function (item) {
                if (item.版號 == version) {
                    return item;
                }
            })
        }
        return false;
    }
});