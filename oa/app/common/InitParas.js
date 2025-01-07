Ext.define('OA.common.InitParas', {
    singleton: true,
    alias: 'common.InitParas',
    config: {},
    constructor: function (config) {
        this.initConfig(config);
    },
    readVI: function (data) {
        var empNo = OA.common.Global.getCurrentUser().empNo;
        var empName = OA.common.Global.getCurrentUser().empName;
        var dept = OA.common.Global.getCurrentDept();
        var role = OA.common.Global.getCurrentRole();

        // var version = padLeft(OA.common.Utils.getRandom(0, 9999999999), 11);
        var paras
        if (role != undefined) {
            paras = {
                "sid1": "sid1",
                "sid2": "sid2",
                "hashcode": "",
                "doDeptno": dept.doDeptno,
                "depNo": dept.depNo,
                "empNo": empNo,
                "jobNo": role.jobNo,
                "orgNo": dept.orgNo,
                "orgId": dept.orgId,
                "agentEmplNo": role.agentEmplNo,
                "odaf20Id": role.odaf20Id,
                "genDocNo": "",
                // "version": version.toString(),
                "roleId": role.roleId,
                "empName": empName
            };

        } else {
            paras = {
                "sid1": "sid1",
                "sid2": "sid2",
                "hashcode": "",
                "doDeptno": dept.doDeptno,
                "depNo": dept.depNo,
                "empNo": empNo,
                "jobNo": "",
                "orgNo": dept.orgNo,
                "orgId": dept.orgId,
                "agentEmplNo": "",
                "odaf20Id": "",
                "genDocNo": "",
                // "version": version.toString(),
                "roleId": "",
                "empName": empName
            };

        }
        Ext.apply(paras, data);
        OA.common.Global.setInitParas(paras);
        return paras;
    },
    readWK: function (data) {
        var paras = OA.common.Global.getInitParas() || {};
        Ext.apply(paras, data);
        OA.common.Global.setInitParas(paras);
        return paras;
    },
    getAttachItem: function () {
        var qs = OA.common.Global.getQ();
        var hasExCG = OA.common.VIMgr.hadExchange();
        var _attachsVI = [];
        var _attachsAdd = [];
        var store = Ext.getStore('Attach');
        store.clearFilter();
        Ext.Array.each(store.data.all, function (p) {
            var file = p.get('file');
            var isMoveBig = p.get('sort') === 'big' && file.folderName !== p.get('sort');
            if (isMoveBig) {
                //轉交換再搬
                if (hasExCG) {
                    var f = Ext.clone(file);
                    f.modType = 'MOVEBIG';
                    _attachsAdd.push(f);
                } else {
                    if (file.fileContent) _attachsAdd.push(file);
                }
            } else {
                //草稿附件一律塞，上傳前沒有fileContent再重新載入附件
                if (qs.app == 'draft') {
                    _attachsAdd.push(file);
                } else if (file.fileContent) {
                    _attachsAdd.push(file);
                }
            }
            //轉交換再搬
            if (isMoveBig && hasExCG) file.folderName = 'big';
            _attachsVI.push(file);
        });
        //store.each(function (p) {
        //    var file = p.get('file');
        //    var isMoveBig = p.get('sort') === 'big' && file.folderName !== p.get('sort');
        //    if (isMoveBig) {
        //        //轉交換再搬
        //        if (hasExCG) {
        //            var f = Ext.clone(file);
        //            f.modType = 'MOVEBIG';
        //            _attachsAdd.push(f);
        //        } else {
        //            if (file.fileContent) _attachsAdd.push(file);
        //        }                
        //    } else {
        //        if (file.fileContent) _attachsAdd.push(file);
        //    }
        //    //轉交換再搬
        //    if (isMoveBig && hasExCG) file.folderName = 'big';
        //    _attachsVI.push(file);
        //});
        store.filterBy(function (rec) {
            return (rec.data.file.status != '0');
        });

        return {
            vi: _attachsVI,
            add: _attachsAdd
        }
    },
    createOdbf01VO: function (diName) {
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        var qs = OA.common.Global.getQ();
        if (!wk) return;
        var attachItem = this.getAttachItem(wk.orgNo);
        var _attachsVI = attachItem.vi;
        var vi = OA.common.VIMgr.getViContent();
        var speed = '普通件';
        if (vm.速別 != undefined) speed = vm.速別;

        var odbf01VO = {};
        odbf01VO.fsYear = vm.年度;
        odbf01VO.fsKindno = vm.分類號;
        odbf01VO.caseno = vm.案次號;
        odbf01VO.fsYrlimit = vm.保存年限;
        odbf01VO.doSno = wk.doSno;
        odbf01VO.ioDateBf = Ext.util.Format.date(new Date(), "Ymd");  //收文日期 {0:000}{1:00}{2:00}
        odbf01VO.ioTimeBf = Ext.util.Format.date(new Date(), "His");  //收文時間 hhmmss
        odbf01VO.efMediumType = '1'; //發文時的本文媒體型式
        odbf01VO.efMediunQty = '1'; //發文時的本文媒體數量
        odbf01VO.efMediunUnit = '1'; //發文時的本文媒體單位
        odbf01VO.ioDep3Name = '';  //來文機關名稱  (開會通知單:主持人、出席者、列席者,簽:敬陳 , else 正本
        odbf01VO.orgOtDate = Ext.util.Format.date(new Date(), "Ymd");  //來文日期 {0}{1:00}{2:00}
        odbf01VO.security = vm.密等;
        odbf01VO.releaCont = vm.解密條件或保密期限;
        odbf01VO.securityDate = Ext.util.Format.date(vm.解密日期, "Ymd");  //解密日期,保密期限 {0:000}{1:00}{2:00};
        if (odbf01VO.securityDate.length > 7) {
            odbf01VO.securityDate = odbf01VO.securityDate.substring(1, 8);
        }
        //console.log(vm);
        odbf01VO.releaContItic = ''; //解密說明
        if (vm.解密條件或保密期限 == '其他') {
            odbf01VO.releaContItic = vm.其他 || '';
        } else if (vm.解密條件或保密期限 == '本件至某年某月某日解密') {
            odbf01VO.releaContItic = vm.本件至某年某月某日解密文;
        }
        if (qs.projNo && qs.docDesc) {
            odbf01VO.abstractMain = qs.docDesc;
        } else {
            //console.log(vi);
            if (vi.專案主旨 && vi.專案主旨.文字) {
                odbf01VO.abstractMain = vi.專案主旨.文字;
            } else {
                odbf01VO.abstractMain = vi.主旨 ? vi.主旨 : vm.主旨;
            }
        }
        odbf01VO.abstractSecret = ''; //密件主旨
        odbf01VO.doQuality = '1'; //公文性質
        odbf01VO.doQualCase = speed; //公文性質-案件別
        odbf01VO.speed = speed;

        odbf01VO.inType = '1'; //本別
        odbf01VO.ioDep1No = wk.doDeptno; //承辦單位
        odbf01VO.encloseNo = vm.附件;
        odbf01VO.encloseNum = _attachsVI.where("( el, i, res, param ) =>el.status !='0'").length;
        odbf01VO.doTYPE = '2'; //1=來文,2創簽稿
        odbf01VO.doDeptno = wk.doDeptno; //收文單位
        odbf01VO.loginNo = wk.empNo; //收文者代碼
        odbf01VO.orgId = wk.orgId; //承辦機關代碼(內部)
        // odbf01VO.editFileid = ''; //開公文製作/線上簽核ID
        odbf01VO.mcode = '23'; //狀態       
        odbf01VO.makerDcsnLevel = '';//預設決行層級
      
        if (vm && vm.決行層級_title) {
            try {
                var level = parseInt(vm.決行層級_title);
                if (level != NaN) {
                    vm.決行層級_title = KangDaAppConfig().DCSNS[level].ofDesc
                }
            } catch (ex) {

            }

            var tmps = [-1, -2, -3, -4];
            Ext.Array.each(tmps, function (dcsns) {
                //console.log(dcsns);
                if (KangDaAppConfig().DCSNS[dcsns].ofDesc == vm.決行層級_title) {
                    odbf01VO.makerDcsnLevel = KangDaAppConfig().DCSNS[dcsns].ofCode + '';
                    return false;
                }
            });
        }

        //console.log(odbf01VO.makerDcsnLevel);

        odbf01VO.diName = diName; //DI檔名

        // 1.公文資料(含創稿) 區分二層(下拉代碼條件OF_CODE.of_type='02' and len(of_code)=1 or 2)
        // 第一層 odbf01.type1
        // 第二層 odbf01.type1_1 (若無二層填入第一層)
        // 2.發文資料 (下拉代碼條件OF_CODE.of_type='02' and dcsn_level='2')
        // odef01.type1 (第二層為主, 若無第二層以一層為主)
        // 3.歸檔資料 (下拉代碼條件OF_CODE.of_type='02' and dcsn_level='2')
        // of_cip.type1 (第二層為主, 若無第二層以一層為主)
        odbf01VO.type1 = wk.DocumentType;  //文別1
        odbf01VO.type1_1 = wk.DocumentType;//文別2

        odbf01VO.epaper = (qs.epaper === 'N') ? 'N' : 'Y'; //EPAPER是否為線上陳核       

        //console.log(odbf01VO);

         //評議專案用
        if (qs.projNo) {           
            odbf01VO.doQuality = qs.doQuality || '';
            odbf01VO.doQualCase = qs.doQualCase || '';
            odbf01VO.qualityCode = qs.qualityCode || '';
            odbf01VO.projNo = qs.projNo || '';
        }

        return odbf01VO;
    },
    doWK: function (values) {
        var me = this;
        values = values || {};
        var action = values.action;
        if (action === 'create' || action === 'add' || action ==='draft') {
            return me.createWK(action, values.qParallel);
        } else if (action === 'upload') {
            return me.uploadWK();
        } else if (action === 'delete') {
            return me.deleteWK(values);
        } else {
            return me.saveWK(action);  //action==='save' || action==='edit'
        }
    },
    createWK: function (status, qParallel) {
        console.log('this');
        var me = this;
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        var qs = OA.common.Global.getQ();
        var _version = '', _paperNo = 1, _paperOrder = 1, xvi = '', xattach = '', diName = '', swFileName = '', wkFileName = '';

        var attachItem = this.getAttachItem(wk.orgNo);
        var _attachsVI = attachItem.vi;
        var _attachsAdd = attachItem.add;

        var paras = {};
        paras.documentType = wk.DocumentType;
        paras.jobNo = wk.jobNo;
        paras.empNo = wk.empNo;
        if (status === 'create' || status =='draft') {
            _version = padLeft(OA.common.Utils.getRandom(1000000000, 9999999999), 11);
            paras.version = _version + '';
            if (wk) wk.Version = '0';
            xvi = OA.common.VIMgr.getNewXVI(wk.DocumentType, paras, _attachsVI);
            xattach = OA.common.VIMgr.getXAttchNew(paras, _attachsVI);

            if (vm && vm.主旨) {
                var vi = OA.common.VIMgr.getViContent();
                if (vi) {
                    vi.主旨 = vm.主旨;
                }
            }
            
        } else {
            if (qs.sFlag == 'Y' && !OA.common.FileMgr.getOpenDialogPath()) {
                var isNote = OA.common.Utils.isNoteDoc(wk.DocumentType);
                var newVI = Ext.clone(OA.common.VIMgr.TEMPLATE.sFlagvi);
                //var isNote = ['簽', '便簽', '便箋'].indexOf(wk.DocumentType) >= 0;
                //newVI.版次[0].簽核文件夾.文稿.名稱 = (isNote) ? '創簽' : '創稿';
                //newVI.版次[0].簽核文件夾.文稿.文稿類型 = wk.DocumentType;
                newVI.版次[0].最後更新時間 = OA.common.Utils.getChineseDate();
                OA.common.VIMgr.load(newVI);
                OA.common.VIMgr.setViContent(newVI);
                //if (typeof require !== 'undefined') {
                //    Papa = require("./resources/thirdparty/PapaParse/papaparse.min.js");
                //    Papa
                //}
            } else {
                _version = wk.Version + '';
                paras.doSno = wk.doSno;
                paras.version = wk.Version + '';
                var ce = OA.common.VIMgr.getCurrentEdition();
                var papers = ce.簽核文件夾.文稿;
                if (papers) {
                    if (!papers.length) papers = [papers];
                    _paperNo = papers[papers.length - 1].代碼 + 1;
                    //_paperOrder = papers[papers.length - 1].排序 + 1;
                    //要放在最後                    
                    _paperOrder = _paperNo;
                    //要檢核是否ViMgr的paperNo
                    var mgrNo = OA.common.VIMgr.getPaperNo();
                    if (mgrNo != '' && _paperNo == '') {   //0706 如果有_paperNo將讀取最新_paperNo不clone Chloe.sia
                        _paperNo = Ext.clone(parseInt(mgrNo)) + 1;
                    }
                } else {
                    papers = [];
                    _paperNo = 1;
                }
                paras.paperNo = _paperNo;
                paras.paperOrder = _paperOrder;

                var isEditor = qs.app === 'offline' || qs.app === 'editor' || qs.sFlag === 'Y';
                if (!isEditor) {
                    var isNote = OA.common.Utils.isNoteDoc(wk.DocumentType);

                    if (status == 'add' && !isNote) {
                        /*
                        //新增文稿時不給支號，發文轉交換時才給
                        var year = paras.doSno.substring(0, 3);
                        var flow = paras.doSno.substring(3);
                        var draftCount = OA.common.DIMgr.getDraftCount();
                        var strFlowNo = OA.common.DIMgr.flowNoPlus(flow, draftCount);
                        var count = strFlowNo.toString().length;
                        //var strFlow = draftCount == 0 ? strFlowNo : strFlowNo.toString().substring(0, count - 2);
                        //var strSub = draftCount == 0 ? "" : strFlowNo.toString().substring(count - 1);
                        var strFlow =strFlowNo.toString().substring(0, count - 2);
                        var strSub = strFlowNo.toString().substring(count - 1);
                        */
                        snedNo = paras.doSno;
                    }
                    //var isNote = ['簽', '便簽', '便箋', '出席會議報告單'].indexOf(wk.DocumentType) >= 0;
                    paras.paper = {
                        代碼: _paperNo,
                        排序: _paperOrder,
                        來文時戳: '',
                        名稱: (isNote) ? '創簽' : '創稿',
                        文稿類型: wk.DocumentType,
                        檔案清單: {
                            檔案: [
                                { ID: "", Src: "", fileNo: "", 名稱: "", 檔案格式: "DI", 種類: "本文" },
                                { ID: "", Src: "", fileNo: "", 名稱: "", 檔案格式: "SW", 種類: "SW" }]
                        },
                        //發文文號: '' // wk.doSno + flowNo
                        發文文號: (isNote) ? '' : snedNo // wk.doSno + flowNo
                    };
                }
                paras.qParallel = qParallel;
                //console.log(_attachsVI);
                xvi = OA.common.VIMgr.getXVI(paras, _attachsVI);
                xattach = OA.common.VIMgr.getXAttch(paras, _attachsVI);
            }
        }

        if (wk.doSno && status != 'draft') {
            diName = wk.doSno + '_' + _paperNo + "_" + _version + '.di';
            swFileName = wk.doSno + '_' + _paperNo + "_" + _version + '.sw';
            wkFileName = wk.doSno + '_' + _paperNo + '.xml';
            if (status == 'create' && qs.app == 'draft') {
                diName = _version + '.di';
                swFileName = _version + '.sw';
                wkFileName = _paperNo + '.xml';
            }
        } else {
            var isDestop = Ext.os.deviceType === 'Desktop';
            //var doOffline = (qs.app === 'editor' || qs.app === 'offline' || qs.sFlag === 'Y') && isDestop;
            /*
            if (doOffline || status == 'draft') {
                diName = _paperNo + '.di';
                swFileName = _paperNo + '.sw';
                wkFileName = _paperNo + '.xml';
            } else {
            */
                diName = _version + '.di';
                swFileName = _version + '.sw';
                wkFileName = _paperNo + '.xml';
            //}
        }

        var xdi = OA.common.DIMgr.generateXDI({swFileName: swFileName});
        var xsw = OA.common.VIMgr.getXSW();
        var data = {};
        data.sid1 = 'sid1';
        data.sid2 = 'sid2';
        data.hashcode = '';
        data.dialogType = '2'; //製作
        if (status == 'draft') {
            data.doSno = '';
        } else {
            data.doSno = wk.doSno;
        }
        data.doDeptno = wk.doDeptno;
        data.depNo = wk.depNo;
        data.empNo = wk.empNo;
        data.jobNo = wk.jobNo;
        data.roleId = wk.roleId;
        data.orgNo = wk.orgNo;
        data.orgId = wk.orgId;
        data.genDocNo = wk.genDocNo;
        data.doNextFlow = 'N';
        data.verifyStatus = 0;
        data.version = _version;
        data.paperNo = _paperNo;
        data.attachs = _attachsAdd;
        var paperFiles = [];
        paperFiles.push({
            fileKey: '',
            fileName: '0_Attch.xml', //from svc
            folderName: 'XC',
            fileType: 'attch',
            fileContent: B64.encode(xattach)
        });
        paperFiles.push({
            fileKey: '',
            fileName: '0.vi', //from svc
            folderName: 'XC',
            fileType: 'vi',
            fileContent: B64.encode(xvi)
        });
        paperFiles.push({
            fileKey: '',
            fileName: wkFileName,
            folderName: 'WK',
            fileType: 'wk',
            fileContent: B64.encode(JSON.stringify(wk)) //from svc json to xml
            // fileContent: JSON.stringify(wk) //from svc json to xml
        });
        paperFiles.push({
            fileKey: '',
            fileName: diName,
            folderName: '',
            fileType: 'di',
            fileContent: B64.encode(xdi)
        });
        paperFiles.push({
            fileKey: '',
            fileName: swFileName,
            folderName: 'attch',
            fileType: 'sw',
            fileContent: B64.encode(xsw)
        });
        data.files = paperFiles;

        if (status === 'create') {
            var dep2List = [];
            //組會辦單位給管理給單位代碼即可
            if (vm && vm.會辦單位 && vm.會辦單位.length > 0) {
                var depts = vm.會辦單位.split('、');
                var deptAll = Ext.getStore('DeptAll');
                //console.log(deptAll);
                if (deptAll) {
                    Ext.Array.each(depts, function (d) {
                        Ext.Array.each(deptAll.data.all, function (dept) {
                            if (dept) {
                                if (d == dept.data.depName) {
                                    dep2List.push(dept.data.depNo)
                                } else if (dept.data.children && dept.data.children.length > 0) {
                                    if (d == dept.data.children[0].depName) {
                                        dep2List.push(dept.data.children[0].depNo);
                                    }
                                }
                            }
                        });
                    })
                }
            }

            if (dep2List && dep2List.length > 0) {
                data.dep2List = dep2List.join(',');
            }
        }

        if (status === 'create' || status == 'draft') {
            var odbf01VO = me.createOdbf01VO(diName);
            data.json = JSON.stringify({odbf01VO: odbf01VO});
        }

        OA.common.Global.setInitParas(data);
        return data;
    },
    uploadWK: function () {
        var me = this;
        var qs = OA.common.Global.getQ();
        var items = [];
        var paperFiles = [];
        var edition = OA.common.VIMgr.getCurrentEdition();
        var papers = edition.簽核文件夾.文稿;
        paperFiles.push({
            fileKey: '',
            fileName: '0.vi',
            folderName: 'XC',
            fileType: 'vi',
            fileContent: null
        });
        paperFiles.push({
            fileKey: '',
            fileName: '0_Attch.xml',
            folderName: 'XC',
            fileType: 'attch',
            fileContent: null
        });

        var draftNo = 0;
        Ext.Array.each(papers, function (paper) {
            //在取號前做為稿號之用
            var needDraftNo = ['來文'].indexOf(paper.名稱) < 0 && ['簽', '便簽', '便箋', '簡簽', 'A4空白簽'].indexOf(paper.文稿類型) < 0;
            if (needDraftNo) draftNo++;

            paperFiles.push({
                fileKey: (needDraftNo) ? draftNo : '',
                fileName: paper.代碼 + '.xml',
                folderName: 'WK',
                fileType: 'wk',
                fileContent: null
            });

            var files = paper.檔案清單.檔案;
            Ext.Array.each(files, function (f) {
                paperFiles.push({
                    fileKey: f.ID,
                    fileName: f.Src,
                    folderName: (f.檔案格式 == 'SW') ? 'attch' : '',
                    fileType: f.檔案格式,
                    fileContent: null
                });
            });

            Ext.Array.each(paper.檔案清單.附件清單.附件, function (attach) {
                items.push({
                    fileKey: attach.名稱,
                    fileName: attach.Src,
                    folderName: 'attach',
                    fileType: attach.檔案格式,
                    fileContent: null,
                    filePath: attach.filePath || ''
                });
            });
            Ext.Array.each(paper.檔案清單.附件清單.參考附件, function (attach) {
                items.push({
                    fileKey: attach.名稱,
                    fileName: attach.Src,
                    folderName: 'ref',
                    fileType: attach.檔案格式,
                    fileContent: null,
                    filePath: attach.filePath || ''
                });
            });
            Ext.Array.each(paper.檔案清單.附件清單.大型附件, function (big) {
                items.push({
                    fileKey: big.名稱,
                    fileName: big.Src,
                    folderName: 'big',
                    fileType: big.檔案格式,
                    fileContent: null,
                    filePath: big.filePath || ''
                });
            });
        });

        var wk = OA.common.Global.getCurrentWKContent();
        var p = OA.common.Global.getInitParas();

        var data = {};
        data.sid1 = 'sid1';
        data.sid2 = 'sid2';
        data.hashcode = '';
        data.dialogType = '2'; //製作
        data.hashvi=OA.common.VIMgr.getViContent().檔案雜湊值;
        
        data.doSno = (wk) ? wk.doSno : p.doSno;
        data.doDeptno = (wk) ? wk.doDeptno : p.doDeptno;
        data.depNo = (wk) ? wk.depNo : p.depNo;
        data.empNo = (wk) ? wk.empNo : p.empNo;
        data.jobNo = (wk) ? wk.jobNo : p.jobNo;
        data.roleId = (wk) ? wk.roleId : p.roleId;
        data.orgNo = (wk) ? wk.orgNo : p.orgNo;
        data.orgId = (wk) ? wk.orgId : p.orgId;
        data.genDocNo = (wk) ? wk.genDocNo : p.genDocNo;
        data.doNextFlow = 'N';
        data.verifyStatus = 0;
        data.version = '0';
        data.attachs = items;

        if (qs.genDocNo !== '2')
            data.files = paperFiles;
        else {
            var oldData = OA.common.Global.getInitParas();
            data.files = oldData.files;
            data.genDocNo = '2';
        }
        var odbf01VO = me.createOdbf01VO('1.di');
        data.json = JSON.stringify({ odbf01VO: odbf01VO });
        OA.common.Global.setInitParas(data);
        return data;
    },
    saveWK: function (status) {
        var me = this;
        var paras = OA.common.Global.getInitParas();
        var edition = OA.common.VIMgr.getCurrentEdition();
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        var version = edition.版號 + '';
        var qs = OA.common.Global.getQ();
        var u15 = OA.common.Global.getSourceUser();

        var viFileName = '', wkFileName = '', diFileName = '', swFileName = '', attchFileName = '';
        if (paras.doSno && qs.app !=='draft') {
            diFileName = paras.doSno + '_' + paras.paperNo + '_' + version + '.di';
            swFileName = paras.doSno + '_' + paras.paperNo + '_' + version + '.sw';
            wkFileName = paras.doSno + "_" + paras.paperNo + ".xml";
            viFileName = paras.doSno + ".vi";
            attchFileName = paras.doSno + "_Attch.xml"
        } else {
            if (status == 'save' && qs.app == 'draft') {
                paras.paperNo = wk.Version;
                paras.version = wk.Version;
            }
            diFileName = paras.paperNo + '.di';
            swFileName = paras.paperNo + '.sw';
            wkFileName = paras.paperNo + ".xml";
            viFileName = "0.vi";
            attchFileName = "0_Attch.xml"
        }

        paras.status = status;
        paras.isTemp = edition.isTemp == 'Y';

        var item = this.getAttachItem();
        var _attachsVI = item.vi;
        var _attachsAdd = item.add;
        var xdi = OA.common.DIMgr.generateXDI({swFileName: swFileName});
        var xsw = OA.common.VIMgr.getXSW();
        var xvi;
        if (status && status == 'signFlag') {
            paras.status = 'save';
            xvi = OA.common.VIMgr.getXVI(paras, _attachsVI, null, true);
        } else {
            if (qs.app == 'draft') {
                xvi = OA.common.VIMgr.getNewXVI(wk.DocumentType, paras, _attachsVI);
            } else {
                xvi = OA.common.VIMgr.getXVI(paras, _attachsVI);
            }
        }
        
        var xattach = OA.common.VIMgr.getXAttch(paras, _attachsVI);
        var data = {};


        data.version = version + '';
        data.attachs = _attachsAdd;

        data.signEmpNo = (qs.isRole15) ? u15.empNo : paras.empNo;
        data.hashvi = OA.common.VIMgr.getViContent().檔案雜湊值;
        var vi = OA.common.VIMgr.getViContent();

        var paperFiles = [];
        paperFiles.push({
            fileKey: '',
            fileName: attchFileName,
            folderName: 'XC',
            fileType: 'attch',
            fileContent: B64.encode(xattach)
        });
        paperFiles.push({
            fileKey: '',
            fileName: viFileName,
            folderName: 'XC',
            fileType: 'vi',
            fileContent: B64.encode(xvi)
        });

        if (status === 'save' || status === 'saveas' || status === 'edit' || status === 'signFlag') {
            paperFiles.push({
                fileKey: '',
                fileName: wkFileName,
                folderName: 'WK',
                fileType: 'wk',
                fileContent: B64.encode(JSON.stringify(wk)) //from svc json to xml
            });
            paperFiles.push({
                fileKey: '',
                fileName: diFileName,
                folderName: '',
                fileType: 'di',
                fileContent: B64.encode(xdi)
            });
            paperFiles.push({
                fileKey: '',
                fileName: swFileName,
                folderName: 'attch',
                fileType: 'sw',
                fileContent: B64.encode(xsw)
            });
        } else {
            var papers = edition.簽核文件夾.文稿;
            Ext.Array.each(papers, function (paper) {
                if (qs.app !== 'genpages') {
                    paperFiles.push({
                        fileKey: '',
                        fileName: paras.doSno + "_" + paper.代碼 + ".xml",
                        folderName: 'WK',
                        fileType: 'wk',
                        fileContent: ''  //from server
                        //fileContent: B64.encode(JSON.stringify(wk))
                    });
                }

                Ext.Array.each(paper.檔案清單.檔案, function (f) {

                    // paperFiles.push({
                    //     fileKey: f.名稱,
                    //     fileName: f.Src,
                    //     folderName: '',
                    //     fileType: f.檔案格式,
                    //     fileContent: ''
                    // });

                    if (paper.代碼 == paras.paperNo) {
                        paperFiles.push({
                            fileKey: '',
                            fileName: f.Src,
                            folderName: '',
                            fileType: f.檔案格式.toLowerCase(),
                            fileContent: B64.encode(xdi)
                        });
                    } else {
                        paperFiles.push({
                            fileKey: f.名稱,
                            fileName: f.Src,
                            folderName: '',
                            fileType: f.檔案格式.toLowerCase(),
                            fileContent: ''
                        });
                    }

                });
            });
        }
        data.files = paperFiles;
        //取得主稿
        var editPages = OA.common.VIMgr.getCurrentEditionPapers();
        var paper = editPages.where("( el, i, res, param ) => el.排序==1");
        var mainPaper = paper[0];
        if (mainPaper && mainPaper.名稱 == '來文')  mainPaper = editPages.where("( el, i, res, param ) => el.排序==2")[0];
        if (!mainPaper) mainPaper = editPages[0];
        var isMainPaper = paras.paperNo == mainPaper.代碼;

        //草稿只有單稿直接設為主稿
        if (qs.app == 'draft') {
            mainPaper = editPages[0];
            isMainPaper = true;
        }

        if (isMainPaper) {
            var odbf01VO = me.createOdbf01VO(diFileName);
            data.json = JSON.stringify({odbf01VO: odbf01VO});
        } else {
            data.json = JSON.stringify({
                odbf01VO: {
                    fsYear: vm.年度,
                    fsKindno: vm.分類號,
                    caseno: vm.案次號,
                    fsYrlimit: vm.保存年限
                }
            });
        }

        var dep2List = [];
        //組會辦單位給管理給單位代碼即可
        if (vm.會辦單位 && vm.會辦單位.length > 0) {
            var depts = vm.會辦單位.split('、');
            var deptAll = Ext.getStore('DeptAll');
            //console.log(deptAll);
            if (deptAll) {
                Ext.Array.each(depts, function (d) {
                    Ext.Array.each(deptAll.data.all, function (dept) {
                        if (dept) {
                            if (d == dept.data.depName) {
                                dep2List.push(dept.data.depNo);
                            } else if (dept.data.children && dept.data.children.length > 0) {
                                if (d == dept.data.children[0].depName) {
                                    dep2List.push(dept.data.children[0].depNo);
                                }
                            }
                        }
                    });
                })
            }
        }

        if (dep2List && dep2List.length > 0) {
            paras.dep2List = dep2List.join(',')
        }

        Ext.apply(paras, data);
        OA.common.Global.setInitParas(paras);
        return paras;
    },
    deleteWK: function (values) {
        var paras = OA.common.Global.getInitParas();
        var current = OA.common.VIMgr.getCurrentEdition();
        var version = current.版號 + '';
        var item = this.getAttachItem(paras.orgNo);
        var _attachsVI = item.vi;

        var delList = [paras.paperNo];
        if (values) delList = values.list;
        //console.log(_attachsVI);
        var xvi = OA.common.VIMgr.getXVI(paras, _attachsVI, delList);
        var data = {};
        data.version = version;

        var doSno = paras.doSno || '0';
        var paperFiles = [];
        paperFiles.push({
            fileKey: '',
            fileName: doSno + ".vi",
            folderName: 'XC',
            fileType: 'vi',
            fileContent: B64.encode(xvi)
        });

        data.files = paperFiles;
        Ext.apply(paras, data);
        OA.common.Global.setInitParas(paras);
        return paras;
    },
    writeBack: function (lastEdition) {
        var paras = OA.common.Global.getInitParas();
        var data = {};
        data.version = lastEdition.version;

        var doSno = paras.doSno || '0';
        var paperFiles = [];
        paperFiles.push({
            fileKey: '',
            fileName: doSno + ".vi",
            folderName: 'XC',
            fileType: 'vi',
            fileContent: B64.encode(lastEdition)
        });

        data.files = paperFiles;
        Ext.apply(paras, data);
        return paras;
    },
    doExchange: function () {
        var me = this;
        var wk = OA.common.Global.getCurrentWKContent();
        var ce = OA.common.VIMgr.getCurrentEdition();
        var qs = OA.common.Global.getQ();
        var Role = OA.common.Global.getCurrentRole();

        var sendData;
        if (Ext.getCmp('selectSendType')) {
            var sendtype = Ext.getCmp('selectSendType').getRecord().getData().name;  //發文模式
            var sendne = (Ext.getCmp('chkSendNE').getValue() == '1');                //署名寫入
            var sendlv = (Ext.getCmp('chkSendLV').getValue() == '1');                //分層負責寫入
            var senddm = qs.reOt === 'Y' || qs.reOt === 'F' ? Ext.getCmp('selectReSend').getRecord().raw.type : '';//重新發文狀態
            var senddmv = qs.reOt === 'Y' || qs.reOt === 'F' ? Ext.getCmp('selectReSend').getRecord().getData().value : '';//重新發文備註
            var sendshowall = (Ext.getCmp('chkShowAll').getValue() == '1'); 
            //console.log(sendshowall);
            var sendlist = [];
            var internallist = [];

            //重新發文
            if (qs.reOt === 'Y' || qs.reOt === 'F') {
                var Dep3Child = Ext.getStore('Dep3Child');
                if (Dep3Child) {
                    Ext.Array.each(Dep3Child.data.all, function (dep3) {
                        if (dep3.data.isElect && (dep3.get('transType') + '') !== '8') {
                            sendlist.push({
                                VALUE: dep3.get('dep3Name'),
                                CODENAME: dep3.get('dep3Name'),
                                CODE: dep3.get('dep3No'),
                                ATTACH: dep3.get('ATTACH'),
                                KEY: dep3.get('KEY')
                                
                            });
                        } else {
                            internallist.push({
                                VALUE: dep3.get('dep3Name'),
                                CODENAME: dep3.get('dep3Name'),
                                CODE: dep3.get('dep3No'),
                                ATTACH: dep3.get('ATTACH'),
                                KEY: dep3.get('KEY')
                            });
                        }
                    });
                }
            } else {
                Ext.Array.each(Ext.getCmp('sendList').getStore().getData().all, function (r) {
                    sendlist.push(r.data);  //要轉交換的資料
                });
            }


            if (sendtype == '一文多發') {
                sendData = {
                    sendType: sendtype,
                    sendList: sendlist,
                    sendNE: sendne,
                    sendLV: sendlv,
                    sendDM: senddm,
                    sendDMV: senddmv
                };
            } else {
                sendData = {
                    sendType: sendtype,
                    sendList: sendlist,
                    sendNE: sendne,
                    sendLV: sendlv,
                    sendDM: senddm,
                    sendDMV: senddmv,
                    sendSA: sendshowall
                };
            }
          
        } else {
            sendData = {
                sendType: '一文多發',
                sendList: [],
                sendNE: true,
                sendLV: false,
                sendDM: '',
                sendDMV: ''
            };
        }

        var _paperNo = OA.common.Global.getInitParas().paperNo;
        var diName = '', swFileName = '', dmFileName = '';
        var attachItem = this.getAttachItem(wk.orgNo);
        

        var _attachsVI = attachItem.vi;
        var _attachsAdd = _attachsVI.where("( el, i, res, param ) =>el.folderName =='attach'&&el.status!='0'");

        if (_attachsAdd && _attachsAdd.length > 0) {
            Ext.Array.each(_attachsAdd, function (file) {
                file.sendChoose = '';
            })
        }

        var _version = ce.版號 + '';
        wk.Version = _version;

        var paras = {};
        paras.documentType = wk.DocumentType;
        paras.jobNo = wk.jobNo;
        paras.empNo = wk.empNo;
        paras.doSno = wk.doSno;
        paras.version = _version;
        paras.isExchange = '1';


        var papers = ce.簽核文件夾.文稿;
        if (papers) {
            if (!papers.length) papers = [papers];
        } else {
            papers = [];
        }

        paras.paperNo = _paperNo;
        //console.log(_attachsVI);
        var xvi = OA.common.VIMgr.getXVI(paras, _attachsVI);
        var xattach = OA.common.VIMgr.getXAttch(paras, _attachsVI);
        var viName = wk.doSno + '.vi';
        var wkName = wk.doSno + '_' + _paperNo + '.xml';

        var data = {};
        data.sid1 = 'sid1';
        data.sid2 = 'sid2';
        data.hashcode = '';
        data.dialogType = '2'; //製作
        data.doSno = wk.doSno;
        data.doDeptno = wk.doDeptno;
        data.depNo = wk.depNo;
        data.empNo = wk.empNo;
        data.jobNo = wk.jobNo;
        data.roleId = wk.roleId;
        data.orgNo = wk.orgNo;
        data.orgId = wk.orgId;
        data.genDocNo = wk.genDocNo;
        data.doNextFlow = 'N';
        data.verifyStatus = 0;
        data.version = _version;
        data.paperNo = _paperNo;

        var u15 = OA.common.Global.getSourceUser();
        data.signEmpNo = (qs.isRole15) ? u15.empNo : paras.empNo;
        data.hashvi = OA.common.VIMgr.getViContent().檔案雜湊值;

        data.attachs = _attachsAdd;
        var paperFiles = [];
        paperFiles.push({
            fileKey: '',
            fileName: 'AttchNames.xml', //from svc(AttchNames.xml)
            folderName: '',
            fileType: 'sf',
            fileContent: B64.encode(xattach)
        });

        //重新發文reOt=F，不上傳VI、WK檔
        if (qs.reOt !== 'F') {
            paperFiles.push({
                fileKey: '',
                fileName: '', //from svc(dosno.vi)
                folderName: 'XC',
                fileType: 'vi',
                fileContent: B64.encode(xvi)
            });

            paperFiles.push({
                fileKey: '',
                fileName: wkName,
                folderName: 'WK',
                fileType: 'wk',
                fileContent: B64.encode(JSON.stringify(wk)) //from svc json to xml
            });
        }
        data.isBatchExchange = false;
        if (sendData && sendData.sendList.length > 0) {
            if (sendData.sendType == '一文多發') {

                var noAtt = [];
                var hasAtt = [];

                var hasBigAtt = false;
                var _attachsVI = attachItem.vi;
                if (_attachsVI.where("( el, i, res, param ) =>el.folderName =='big'").length > 0) {
                    Ext.Array.each(_attachsVI.where("( el, i, res, param ) =>el.folderName =='big'"), function (bigatt) {
                        if (bigatt.status == 1) {
                            hasBigAtt = true;
                        }
                    });
                }

                if (hasBigAtt || _attachsAdd.length > 0) {
                    Ext.Array.each(sendData.sendList, function (item, idx) {
                        if (item.ATTACH === 'N')
                            noAtt.push(item);
                        else
                            hasAtt.push(item);
                    });
                }

                var options = {
                    swFileName: swFileName,
                    data: null,
                    sendType: sendData.sendType,
                    sendNE: sendData.sendNE,
                    sendLV: sendData.sendLV,
                    sendDM: sendData.sendDM,
                    sendDMV: sendData.sendDMV,
                    attachsAdd: data.attachs
                };

                if (noAtt.length > 0) {
                    data.isBatchExchange = true;
                    var hasAttxdi = OA.common.DIMgr.generateXDI(options, true);
                    var noAttxdi = OA.common.DIMgr.generateXDI(options, false);
                    var hasAttxsw = OA.common.VIMgr.getXSW(hasAtt, true);
                    var noAttxsw = OA.common.VIMgr.getXSW(noAtt, true);

                    if (hasAtt.length > 0) {
                        paperFiles.push({
                            fileKey: '',
                            fileName: '1.di',
                            folderName: '',
                            fileType: 'di',
                            fileContent: B64.encode(hasAttxdi)
                        });
                    }
                    paperFiles.push({
                        fileKey: '',
                        fileName: '2.di',
                        folderName: '',
                        fileType: 'di',
                        fileContent: B64.encode(noAttxdi)
                    });

                    if (hasAtt.length > 0) {
                        paperFiles.push({
                            fileKey: '',
                            fileName: '1.sw',
                            folderName: 'attch',
                            fileType: 'sw',
                            fileContent: B64.encode(hasAttxsw)
                        });
                    }
                    paperFiles.push({
                        fileKey: '',
                        fileName: '2.sw',
                        folderName: 'attch',
                        fileType: 'sw',
                        fileContent: B64.encode(noAttxsw)
                    });

                    //要果是重新發文DM檔也要補兩個
                    if (sendData.sendDM) {
                        var xdm = OA.common.VIMgr.getXDM(sendData.sendDM, sendData.sendDMV);
                        if (hasAtt.length > 0) {
                            paperFiles.push({
                                fileKey: '',
                                fileName: '1.dm',
                                folderName: 'attch',
                                fileType: 'dm',
                                fileContent: B64.encode(xdm)
                            });
                        }

                        paperFiles.push({
                            fileKey: '',
                            fileName: '2.dm',
                            folderName: 'attch',
                            fileType: 'dm',
                            fileContent: B64.encode(xdm)
                        });
                    }

                } else {
                    diName = '1.di';
                    swFileName = '1.sw';
                    var xdi = OA.common.DIMgr.generateXDI(options, true);
                    var xsw = OA.common.VIMgr.getXSW(sendData.sendList, (data.attachs.length > 0));

                    paperFiles.push({
                        fileKey: '',
                        fileName: diName,
                        folderName: '',
                        fileType: 'di',
                        fileContent: B64.encode(xdi)
                    });
                    paperFiles.push({
                        fileKey: '',
                        fileName: swFileName,
                        folderName: 'attch',
                        fileType: 'sw',
                        fileContent: B64.encode(xsw)
                    });

                    //DM
                    if (sendData.sendDM) {
                        var xdm = OA.common.VIMgr.getXDM(sendData.sendDM, sendData.sendDMV);
                        paperFiles.push({
                            fileKey: '',
                            fileName: '1.dm',
                            folderName: 'attch',
                            fileType: 'dm',
                            fileContent: B64.encode(xdm)
                        });
                    }
                }
            } else {
                data.isBatchExchange = true;
                Ext.Array.each(sendData.sendList, function (item, idx) {
                    //console.log(item);
                    diName = (idx + 1) + '.di';
                    swFileName = (idx + 1) + '.sw';
                    dmFileName = (idx + 1) + '.dm';

                    var chooseAtt = item.chooseAtt || '';
                    var chooseAttAdd = [];
                    Ext.Array.each(data.attachs, function (att) {
                        if (chooseAtt && chooseAtt.length > 0 && data.attachs.length > 0) {
                            var chooseAtts = chooseAtt.split('、');
                            if (chooseAtts.indexOf(att.fileKey) != -1) {
                                chooseAttAdd.push(Ext.clone(att));
                                if (att.sendChoose == '') {
                                    att.sendChoose = diName;
                                } else {
                                    att.sendChoose = att.sendChoose + '、' + diName;
                                }
                            }
                        } else {
                            if (att.sendChoose == '') {
                                att.sendChoose = diName;
                            } else {
                                att.sendChoose = att.sendChoose + '、' + diName;
                            }
                        }  
                    })

                    //console.log(data.attachs);
                    var options = {
                        swFileName: swFileName,
                        data: item,
                        sendType: sendData.sendType,
                        sendNE: sendData.sendNE,
                        sendLV: sendData.sendLV,
                        sendDM: sendData.sendDM,
                        sendDMV: sendData.sendDMV,
                        sendSA: sendData.sendSA,
                        attachsAdd: chooseAttAdd.length > 0 ? chooseAttAdd : data.attachs
                    };
                    var xdi = OA.common.DIMgr.generateXDI(options, (data.attachs.length > 0));
                    //console.log(xdi);
                    var xsw = OA.common.VIMgr.getXSW(item, (data.attachs.length > 0));

                    paperFiles.push({
                        fileKey: '',
                        fileName: diName,
                        folderName: '',
                        fileType: 'di',
                        fileContent: B64.encode(xdi)
                    });


                    //DM
                    if (sendData.sendDM) {
                        var xdm = OA.common.VIMgr.getXDM(sendData.sendDM, sendData.sendDMV);
                        paperFiles.push({
                            fileKey: '',
                            fileName: dmFileName,
                            folderName: 'attch',
                            fileType: 'dm',
                            fileContent: B64.encode(xdm)
                        });
                    }

                    paperFiles.push({
                        fileKey: '',
                        fileName: swFileName,
                        folderName: 'attch',
                        fileType: 'sw',
                        fileContent: B64.encode(xsw)
                    });
                });
            }
        } else {
            /*
            diName = _paperNo + '.di';
            swFileName = _paperNo + '.sw';

            paperFiles.push({
                fileKey: '',
                fileName: diName,
                folderName: '',
                fileType: 'di',
                fileContent: B64.encode(OA.common.DIMgr.generateXDI({ swFileName: swFileName }))
            });

            if (OA.common.VIMgr.getXSWSend()) {
                paperFiles.push({
                    fileKey: '',
                    fileName: swFileName,
                    folderName: 'attch',
                    fileType: 'sw',
                    fileContent: B64.encode(OA.common.VIMgr.getXSWSend())
                });
            }

            sendData = {
                sendType: '一文多發',
                sendList: [],
                sendNE: true,
                sendLV: false,
                sendDM: '',
                sendDMV: ''
            };
            */

            
        }
        
        data.files = paperFiles;

        //總發文才產
        if (Role && Role.roleId == '02') {
            //產一份DI檔當抄本用mail發送
            var mailPaperFiles = [];
            var maildiName = '1.di';
            sendData.mailPDF = 'N';
            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
            if (ctrWK) {
                var mailOSVG = ctrWK.toMailSvgXml();
                if (wk && wk.DocumentType == '電子信箱回覆函') {
                    if (wk) {
                        maildiName = '1.svg';
                        mailPaperFiles.push({
                            fileKey: '',
                            fileName: maildiName,
                            folderName: '',
                            fileType: 'svg',
                            fileContent: B64.encode(mailOSVG)
                        });
                    }
                } else {

                    var mailOp = {
                        sendType: '一文多發',
                        msendDM: '',
                        data: null,
                        sendNE: sendData.sendNE,
                        sendLV: sendData.sendLV,
                        attachsAdd: data.attachs,
                        isMailSend: true
                    }

                    var mailxdi = OA.common.DIMgr.generateXDI(mailOp, (data.attachs.length > 0));

                    mailPaperFiles.push({
                        fileKey: '',
                        fileName: maildiName,
                        folderName: '',
                        fileType: 'di',
                        fileContent: B64.encode(mailxdi)
                    });
                }

                data.mailSendfiles = mailPaperFiles;
            }
        }

        //update table
        var tb = {};
        //var isOnlyFollow = OA.common.VIMgr.isOnlyFollow();   //簡易來文簽辦不送受文者
        //if (isOnlyFollow) {
        //    tb.odef01VO = me.createFollowOdef01VO(sendData);
        //} else {
        //console.log(sendData);
            tb.odef01VO = me.createOdef01VO(sendData);
            tb.odef05Array = me.createOdef05Array(sendData);
        //}

        data.json = JSON.stringify(tb);
        //console.log(data);
        return data;
    },
    doExport: function (paras) {
        var wk = OA.common.Global.getCurrentWKContent();
        var data = {};

        var attachItem = this.getAttachItem(wk.orgNo);
        var _attachsVI = attachItem.vi;
        var _attachsAdd = _attachsVI.where("( el, i, res, param ) =>el.status!='0'");

        var items=[];
        Ext.Array.each(_attachsAdd,function(item){
            var isChangeRef =paras.fileExt=='change' && item.folderName=='ref';
            if (!isChangeRef) items.push(item);
        });
        data.attachs = items;

        var options = {
            swFileName: paras.fileName,
            data: null,
            sendType: '一文多發',
            attachsAdd: data.attachs
        };

        var xdi = OA.common.DIMgr.generateXDI(options, (data.attachs.length > 0));

        var i = 1;
        Ext.Array.each(_attachsAdd, function (att) {
            if (att.folderName === 'attach') {
                xdi = xdi.replace('#ATTCHNAME' + i + '#', att.fileName);
                if (i < 10)
                    xdi = xdi.replace('#ATTCHNO' + i + '#', 'ATTCH' + i);
                else
                    xdi = xdi.replace('#ATTCHN' + i + '#', 'ATTCH' + i);
                i = i + 1;
            }
        });

        xdi = xdi.replace('#SW#', paras.fileName + '.sw');
        var xsw = OA.common.VIMgr.getXSWSend();
        var paperFiles = [];

        paperFiles.push({
            fileKey: '',
            fileName: paras.fileName + '.di',
            folderName: '',
            fileType: 'di',
            fileContent: B64.encode(xdi)
        });
        paperFiles.push({
            fileKey: '',
            fileName: paras.fileName + '.sw',
            folderName: '',
            fileType: 'sw',
            fileContent: B64.encode(xsw)
        });

        data.files = paperFiles;

        return data;
    },
    createOdef01VO: function (sendData) {
        //console.log('createOdef01VO');
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        var qs = OA.common.Global.getQ();
        var attachItem = this.getAttachItem(wk.orgNo);
        var _attachsVI = attachItem.vi;
        var _attachsAdd = _attachsVI.where("( el, i, res, param ) =>el.folderName =='attach'&&el.status!='0'");

        var odef01VO = {};

        odef01VO.otSno = wk.發文文號;
        if (odef01VO.otSno == '0' || odef01VO.otSno == '') odef01VO.otSno = wk.doSno;
        odef01VO.fsYear = vm.年度;
        odef01VO.speed = vm.速別;
        odef01VO.docDesc = vm.附件;  //附件說明
        odef01VO.encloseNum = _attachsAdd.length;  //附件數
        odef01VO.typeNo = wk.DocumentType; //公文格式       
        odef01VO.sendType = '1';
        odef01VO.odType = 'A';
        if (sendData && sendData.sendType == '分址分文') {
            odef01VO.sendType = '2';
        }
        if (wk.DocumentType === '令') {
            if (wk.DocumentTemplate === '獎懲令(1人格式)' || wk.DocumentTemplate === '獎懲令(多人格式)') {
                odef01VO.typeNo = '獎懲令';
            } else if (wk.DocumentTemplate === '派免令(1人格式)' || wk.DocumentTemplate === '派免令(多人格式)') {
                odef01VO.typeNo = '派免令';
            }

        } else if (wk.DocumentType === '公告') {
            if (wk.DocumentTemplate == '受文者公告') {
                odef01VO.typeNo = wk.DocumentTemplate;
            } else if(wk.DocumentTemplate == '代辦處公告'){
                odef01VO.typeNo = wk.DocumentTemplate;
            }
        }

        odef01VO.typeNoFull = wk.DocumentTemplate;
        //console.log(odef01VO.typeNo);
        odef01VO.abstractMain = vm.主旨;
        odef01VO.securityDate = Ext.util.Format.date(vm.解密日期, "Ymd");  //解密日期,保密期限 {0:000}{1:00}{2:00};
        odef01VO.releaCont = vm.解密條件或保密期限;//要從WK中拿
        odef01VO.otOrgno = vm.機關代碼_1;//發文機關代碼(主辦) ，要從WK中拿
        odef01VO.security = vm.密等;//要從WK中拿
        odef01VO.jobNo = wk.jobNo;
        odef01VO.useBound = '';
        odef01VO.orgId = wk.orgId;
        if (qs.reOt === 'F') odef01VO.otFlag = 'F';//重新發文，不寫VI、WK檔
        odef01VO.otDeptno = wk.doDeptno;
        odef01VO.acDeptno = wk.doDeptno;

        odef01VO.otWord = vm.發文字號_字_1;//發文（字）號  ， 要從WK中拿

        //TODO: vm.發文日期 ='中華民國99年2月29日' BUG;
        var dt = OA.common.Utils.toChineseDateTime(vm.發文日期);
        if (dt) {
            var year = parseInt(dt.getFullYear()) - 1911;
            var monthDate = padLeft(dt.getMonth() + 1, 2);
            var day = padLeft(dt.getDate(), 2);
            odef01VO.otDate = year + monthDate + day; //民國7碼
        } else if (wk.DocumentType === '簽') {
            var toDay = OA.common.Utils.getChineseDate();
            odef01VO.otDate = (toDay.split(' ')[0]).replace(/\//g, '');
        }
        odef01VO.inType = 'A';
        odef01VO.efMediunQty = '1';
        odef01VO.efMediunUnit = '1';
        odef01VO.doQuality = '1';

        odef01VO.fsKindno = vm.分類號;
        odef01VO.caseno = vm.案次號;
        odef01VO.fsYrlimit = vm.保存年限;
        odef01VO.publishDay = '';
        if (vm.發文層級) odef01VO.otType = vm.發文層級 + '';


        if (sendData && sendData.mailPDF) {
            odef01VO.mailPDF = sendData.mailPDF;
        }

        //重新發文傳值
        if (qs.reOt === 'F' || qs.reOt === 'Y') {
            if (sendData) {
                odef01VO.reSendCode = sendData.sendDM || '';
                odef01VO.reSendMessage = sendData.sendDMV || '';
            }
        }

        //傳送方式 0:非電子、1:電子
        var transFile = '0';
        if (vm.ContactList) {
            Ext.Array.each(vm.ContactList, function (item) {
                if (item.TRANSTYPE == '9' || item.TRANSTYPE == '6') transFile = '1';
            });
        }
        odef01VO.transFile = transFile;

        if (vm.年月日) {
            var strDate = vm.年月日.replace('中華民國', '');
            strDate = strDate.replace('日期：', '');
            strDate = strDate.trim();
            if (strDate) {
                var y = strDate.split('年');
                var m = y[1].split('月');
                var d = m[1].split('日');
                odef01VO.meetingDate = y[0] + Ext.String.leftPad(m[0], 2, '0') + Ext.String.leftPad(d[0], 2, '0');
            }
        }

        //是否含大型附件
        if (_attachsVI.where("( el, i, res, param ) =>el.folderName =='big'").length > 0) {
            var bigAttach = [];
            Ext.Array.each(_attachsVI.where("( el, i, res, param ) =>el.folderName =='big'"), function (bigatt) {
                if (bigatt.status == 1) {
                    bigAttach.push({
                        attachType: 'big',
                        fileName: bigatt.fileName,
                        fileKey: bigatt.fileKey
                    });
                }
            });
            odef01VO.attachArray = bigAttach;
            var current = OA.common.VIMgr.getCurrentEdition();
            if (current.驗證碼) odef01VO.checkNumber = current.驗證碼;
        }

        return odef01VO;
    },
    createFollowOdef01VO: function (sendData) {
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        var qs = OA.common.Global.getQ();

        var odef01VO = {};
        odef01VO.otSno = wk.doSno;
        odef01VO.encloseNum = 0;  //附件數
        odef01VO.abstractMain = vm.主旨;
        odef01VO.jobNo = wk.jobNo;
        odef01VO.useBound = '';
        odef01VO.orgId = wk.orgId;
        if (qs.reOt === 'F') odef01VO.otFlag = 'F';//重新發文，不寫VI、WK檔
        odef01VO.otDeptno = wk.doDeptno;
        odef01VO.acDeptno = wk.doDeptno;
        odef01VO.inType = 'A';
        odef01VO.efMediunQty = '1';
        odef01VO.efMediunUnit = '1';
        odef01VO.doQuality = '1';
        odef01VO.publishDay = '';
        if (vm.發文層級) odef01VO.otType = vm.發文層級 + '';
        //重新發文傳值
        if (qs.reOt === 'F' || qs.reOt === 'Y') {
            if (sendData) {
                odef01VO.reSendCode = sendData.sendDM || '';
                odef01VO.reSendMessage = sendData.sendDMV || '';
            }
        }

        // odef01VO.typeNo = wk.DocumentType; //公文格式

        return odef01VO;
    },
    createOdef05Array: function (sendData) {
        console.log(sendData);
        var me = this;
        var vm = OA.common.Global.getCurrentViewModel();
        var qs = OA.common.Global.getQ();
        var contactlist = [];
        if (vm.ContactList && vm.ContactList.length > 0) {
            Ext.Array.each(vm.ContactList, function (item) {

                var except = [];
                if (item.except && item.except.length > 0) {
                    except = item.except.split('、');
                }
                //有群組發文除外時要整個展開
                if (except.length > 0 && item.children) {
                    var children = [];

                    if (Ext.isArray(item.children)) {
                        children = item.children;
                    } else {
                        children = JSON.parse(item.children)
                    }

                    Ext.Array.each(children, function (child) {
                        if (except.indexOf(child.dep3Name) < 0) {
                            var contact = {
                                rsType: me.getRsTypeCode(item.KEY) || '',
                                ioDep3No: child.dep3No || '',
                                ioDep3Name: child.dep3Name || '',  //item.CODENAME
                                addr: child.dep3Addr || '',
                                transferType: item.TRANSTYPE || '',
                                arceNo: child.dep3Zone || '',
                                attach: '',//之後要補資料
                                ioDep3Addr: child.dep3Addr || ''
                            };

                            if (sendData) {
                                var isSend = sendData.sendList.where("( el, i, res, param ) => el.CODE=='" + item.CODE + "'  &&" +
                                        "el.VALUE=='" + item.VALUE + "'").length > 0;

                                //重新發文VALUE跟CODENAME可能會不一致，重新只判斷CODE
                                if (qs.reOt === 'Y' || qs.reOt === 'F') {
                                    //isSend = sendData.sendList.where("( el, i, res, param ) => el.CODE=='" + item.CODE + "'  &&" +
                                    //                                "el.VALUE=='" + item.CODENAME + "'").length > 0;
                                    isSend = sendData.sendList.where("( el, i, res, param ) => el.CODE=='" + item.CODE + "'").length > 0;
                                }

                                //增加重新發文群組內部分發文
                                if (item.children && item.children.length > 0 && !isSend) {
                                    var children = [];
                                    if (Ext.isArray(item.children)) {
                                        children = item.children;
                                    } else {
                                        children = JSON.parse(item.children)
                                    }
                                    var isHas = false;
                                    Ext.Array.each(sendData.sendList, function (send) {
                                        Ext.Array.each(children, function (child) {
                                            if (send.CODE == child.dep3No && send.VALUE == child.dep3Name)
                                                isHas = true;
                                        });
                                    });
                                    isSend = isHas;
                                }

                                if (isSend) { // 轉交換就寫Y，不轉交換就寫N
                                    contact.transferType2 = 'Y';
                                } else {
                                    contact.transferType2 = 'N';
                                }
                            } else {
                                contact.transferType2 = '';
                            }
                            contactlist.push(contact);
                        }
                    });
                } else {
                    var contact = {
                        rsType: me.getRsTypeCode(item.KEY) || '',
                        ioDep3No: item.CODE || '',
                        ioDep3Name: item.VALUE || '',  //item.CODENAME
                        addr: item.ADDR || '',
                        transferType: item.TRANSTYPE || '',
                        arceNo: item.ARCENO || '',
                        attach: '',//之後要補資料
                        ioDep3Addr: item.ADDR || ''
                    };

                    //判斷是否轉交換，有轉過不列印
                    if (sendData) {
                        var isSend = sendData.sendList.where("( el, i, res, param ) => el.CODE=='" + item.CODE + "'  &&" +
                                "el.VALUE=='" + item.VALUE + "'").length > 0;


                        //重新發文VALUE跟CODENAME可能會不一致，重新只判斷CODE
                        if (qs.reOt === 'Y' || qs.reOt === 'F') {
                            //isSend = sendData.sendList.where("( el, i, res, param ) => el.CODE=='" + item.CODE + "'  &&" +
                            //                                "el.VALUE=='" + item.CODENAME + "'").length > 0;
                            isSend = sendData.sendList.where("( el, i, res, param ) => el.CODE=='" + item.CODE + "'").length > 0;
                        }

                        //增加重新發文群組內部分發文
                        if (item.children && item.children.length > 0 && !isSend) {
                            var children = [];
                            if (Ext.isArray(item.children)) {
                                children = item.children;
                            } else {
                                children = JSON.parse(item.children)
                            }
                            var isHas = false;
                            Ext.Array.each(sendData.sendList, function (send) {
                                Ext.Array.each(children, function (child) {
                                    if (send.CODE == child.dep3No && send.VALUE == child.dep3Name)
                                        isHas = true;
                                });
                            });
                            isSend = isHas;
                        }

                        if (isSend) { // 轉交換就寫Y，不轉交換就寫N
                            contact.transferType2 = 'Y';
                        } else {
                            contact.transferType2 = 'N';
                        }
                        //console.log('send:' + isSend);
                    } else {
                        contact.transferType2 = '';
                    }
                    contactlist.push(contact);
                }
            });
        }
        return contactlist;
    },
    getRsTypeCode: function (key) {
        var code = '0';
        switch (key) {
            case '正本':
                code = '1';
                break;
            case '主持人':
                code = '1';
                break;
            case '出席者':
                code = '1';
                break;
            case '列席者':
                code = '1';
                break;
            case '副本':
                code = '2';
                break;
            case '抄本':
                code = '3';
                break;
            case '影本':
                code = '4';
                break;
            case '譯本':
                code = '5';
                break;
            case '稿本':
                code = 'A';
                break;
            case '草稿':
                code = 'B';
                break;
            case '定稿':
                code = 'C';
                break;
            case '底圖':
                code = 'D';
                break;
            case '藍圖':
                code = 'E';
                break;
        }

        return code;
    }
});

