function KangDaAppConfig() {

    //台北
    var tcqb = {
        environment: 'dev',  //dev , testing , production , to use host_xxx url
        unit: 'TCQB',
        useSSL: true,       //true to use host_xxx_ssl
        version: '1.0.33',
        appMode: '', //spa,mpa,preview
        disableEditorCloseNotification: false, //  製作關閉提示開關

        host_development: 'localhost:8080/tcqb/rest/',
        host_testing: 'localhost:8080/tcqb/rest/',
        host_production: '../rest/',
        host_make: '../rest/',
        host_ssoHome: '172.16.55.22:8080/tbpx_sso/indexm.jsp',
        host_ssoSvc: '172.16.55.22:8080/tbpx/oa/jsonSSO.jsp',
        host_sign: 'http://localhost:16888/doPostMsg',

        host_development_ssl: 'io.kangdainfo.com/tcqb/rest/',
        host_testing_ssl: 'doctest.gov.taipei/tcqb/rest/',
        host_production_ssl: '../rest/',
        host_make_ssl: '../rest/',
        host_ssoHome_ssl: '../tbpx_sso/indexm.jsp',
        host_ssoSvc_ssl: '../tcqb/oa/jsonSSO.jsp',

        printPadding: 0,
        gutterShow: true,      //裝訂線
        autoLogin: true,       //自動登入
        welcome: false,        //歡迎頁
        dtdFormatTyle: 'utf8', //di dtd

        /*
         自動換下一動作

         空白不執行
         next (下一關)
         edit (編輯)
         OA.form.PanelChange  (正副本)
         OA.form.FormNewDoc   (創簽稿)
         OA.form.FormCaseNo   (檔號查詢)
         OA.form.PanelAttach  (附件管理)
         OA.form.FormOrgNo    (機關代碼)
         OA.form.FormImport   (滙入)

         */
        // nextStep: '',
        nextStep: '稿-市長用箋',

        logo: '',
        logoText: '',

        rootDeptNo: '', //AAAA
        //set OA.common.DIMgr.FORMATS ，  template:value必需要與Silverlight樣本對應
        FORMATS: {
            SORT: [
                {value: '1', text: '簽', items: ['簽', '便簽']},
                {
                    value: '2', text: '函式公文', items: ['函', '書函', '移文單', '獎懲建議函', '交辦案件通知單', '交議案件通知單',
                    '催辦案件通知單']
                },
                {value: '3', text: '開會通知單'},
                {value: '4', text: '會勘通知單'},
                {value: '5', text: '簽稿會核單'},
                {value: '6', text: '令', items: ['令', '獎懲令', '受文者令']},
                {value: '7', text: '公告', items: ['公告', '受文者公告']},
                {
                    value: '8', text: '機密文書', items: ['機密文書機密等級變更或註銷紀錄單', '機密文書機密等級變更或註銷建議單',
                    '機密文書機密等級變更或註銷通知單', '機密文書機密等級變更或註銷處理意見表']
                },
                {
                    value: '7', text: '會銜公文', items: ['會銜函', '會銜令', '會銜受文者令', '會銜公告', '會銜受文者公告',
                    '會銜公文會辦單', '會銜公文機關印信蓋用續頁表']
                },
                {value: '8', text: '呈'},
                {value: '9', text: '印信管理表單', items: ['蓋用印信申請表', '補製換發印信申請表', '印信啟用報備表', '繳銷廢舊印信申報表']},
                {
                    value: 'A', text: '其他類別', items: ['LINE訊息紀錄單', '箋函', '市長用箋', '公務電話紀錄', '報告', '出席會議報告單', '府裁處書格式',
                    '機關裁處書格式', '訴願答辯書', '行政訴訟答辯書', '各機關國賠應拒絕賠償簽辦單', '會計報告遞送單']
                }
            ],
            令: {
                name: "Order", value: '1', change: true, template: [
                    {name: '空白令', value: '空白令', xml: ''}
                ]
            },
            會銜令: {
                name: "MultiOgnOrder", value: '1', change: true, template: [
                    {name: '空白令', value: '空白令', xml: ''}
                ]
            },
            獎懲令: {
                name: "Order", value: '2', change: true, template: [
                    {name: '獎懲令(1人格式)', value: '獎懲令(1人格式)', xml: ''},
                    {name: '獎懲令(多人格式)', value: '獎懲令(多人格式)', xml: ''}
                ]
            },
            派免令: {
                name: "Order", value: '3', change: true, template: [
                    {name: '派免令(1人格式)', value: '派免令(1人格式)', xml: ''},
                    {name: '派免令(多人格式)', value: '派免令(多人格式)', xml: ''}
                ]
            },
            受文者令: {
                name: "SendOrder", value: '1', change: false, template: [
                    {name: '空白令', value: '空白令', xml: ''}
                ]
            },
            會銜受文者令: {
                name: "MultiOgnSendOrder", value: '1', change: false, template: [
                    {name: '空白令', value: '空白令', xml: ''}
                ]
            },

            函: {
                name: "Letter", value: '21', change: true, template: [
                    {name: '空白函稿', value: '空白函稿', xml: ''}
                ]
            },
            會銜函: {
                name: "Letter", value: '21', change: true, template: [
                    {name: '空白函稿', value: '空白函稿', xml: ''}
                ]
            },
            書函: {
                name: "BookLetter", value: '22', change: true, template: [
                    {name: '空白書函', value: '空白書函', xml: ''}
                ]
            },
            交辦案件通知單: {
                name: "AssignedNotice", value: '23', change: true, template: [
                    {name: '空白交辦案件通知單', value: '空白交辦案件通知單', xml: ''}
                ]
            },
            交議案件通知單: {
                name: "IssuesNotice", value: '24', change: true, template: [
                    {name: '空白交議案件通知單', value: '空白交議案件通知單', xml: ''}
                ]
            },
            催辦案件通知單: {
                name: "RemindersNotice", value: '25', change: true, template: [
                    {name: '空白催辦案件通知單', value: '空白催辦案件通知單', xml: ''}
                ]
            },
            移文單: {
                name: "MoveNotice", value: '26', change: true, template: [
                    {name: '空白移文單', value: '空白移文單', xml: ''}
                ]
            },
            機密文書機密等級變更或註銷紀錄單: {
                name: "ProposalNoticeRecord", value: '27', change: false, template: [
                    {name: '機密文書機密等級變更或註銷紀錄單', value: '機密文書機密等級變更或註銷紀錄單', xml: ''}
                ]
            },
            機密文書機密等級變更或註銷建議單: {
                name: "ProposalNotice", value: '27', change: true, template: [
                    {name: '空白機密文書機密等級變更或註銷建議單', value: '空白機密文書機密等級變更或註銷建議單', xml: ''}
                ]
            },
            機密文書機密等級變更或註銷通知單: {
                name: "ExchangeNotice", value: '28', change: true, template: [
                    {name: '空白機密文書機密等級變更或註銷通知單', value: '空白機密文書機密等級變更或註銷通知單', xml: ''}
                ]
            },
            機密文書機密等級變更或註銷處理意見表: {
                name: "ExchangeNoticeOpinion", value: '28', change: false, template: [
                    {name: '機密文書機密等級變更或註銷處理意見表', value: '機密文書機密等級變更或註銷處理意見表', xml: ''}
                ]
            },
            執行命令: {
                name: "DoOrder", value: '29', change: true, template: [
                    {name: '空白執行命令', value: '空白執行命令', xml: ''}
                ]
            },
            獎懲建議函: {
                name: "ProposalLetter", value: '2A', change: true, template: [
                    {name: '空白獎懲建議函(1人格式)', value: '空白獎懲建議函(1人格式)', xml: ''},
                    {name: '空白獎懲建議函(多人格式)', value: '空白獎懲建議函(多人格式)', xml: ''}
                ]
            },

            公告: {
                name: "Publish", value: 7, change: true, template: [
                    {name: '空白公告', value: '空白公告', xml: ''}
                ]
            },
            會銜公告: {
                name: "Publish", value: 7, change: true, template: [
                    {name: '空白公告', value: '空白公告', xml: ''}
                ]
            },
            受文者公告: {
                name: "SendPublish", value: 7, change: false, template: [
                    {name: '空白公告', value: '空白公告', xml: ''}
                ]
            },
            會銜受文者公告: {
                name: "SendPublish", value: 7, change: false, template: [
                    {name: '空白公告', value: '空白公告', xml: ''}
                ]
            },

            開會通知單: {
                name: "Meeting", value: 3, change: true, template: [
                    {name: '空白開會通知單', value: '空白開會通知單', xml: ''}
                ]
            },
            簽: {
                name: "Notes", value: 4, change: false, unit: '', template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            簽稿會核單: {
                name: "DraftVerify", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            會銜公文會辦單: {
                name: "MultiOgnUnit", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            公文時效統計: {
                name: "Notes", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            呈: {
                name: "Letter", value: 4, change: false, template: [
                    {name: '空白函稿', value: '空白函稿', xml: ''}
                ]
            },
            咨: {
                name: "Notes", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },

            便簽: {
                name: "NoteSticky", value: 5, change: false, unit: '', template: [
                    {name: '空白便簽', value: '空白便簽', xml: ''}
                ]
            },
            公示送達: {
                name: "Notice", value: 9, change: false, template: [
                    {name: '空白公示送達', value: '空白公示送達', xml: ''}
                ]
            },
            會勘通知單: {
                name: "SurveyNotice", value: 10, change: true, template: [
                    {name: '空白會勘通知單', value: '空白會勘通知單', xml: ''}
                ]
            },
            行政裁處書: {
                name: "TribunalBook", value: 18, change: false, template: [
                    {name: '行政裁處書', value: '行政裁處書', xml: ''}
                ]
            },
            派免建議函: {
                name: "FactionLetter", value: 19, change: true, template: [
                    {name: '派免建議函', value: '派免建議函', xml: ''}
                ]
            },
            動支第二預備金核定通知: {
                name: "SecondAdvanceNotice", value: 22, change: false, unit: 'tbpx', template: [
                    {name: '空白動支第二預備金核定通知', value: '空白動支第二預備金核定通知', xml: ''}
                ]
            },
            動支墊付款核定通知: {
                name: "ReimbursedPayNotice", value: 23, change: false, unit: 'tbpx', template: [
                    {name: '空白動支墊付款核定通知', value: '空白動支墊付款核定通知', xml: ''}
                ]
            },
            動支災害準備金核定通知: {
                name: "CalamityAdvanceNotice", value: 24, change: false, unit: 'tbpx', template: [
                    {name: '空白動支災害準備金核定通知', value: '空白動支災害準備金核定通知', xml: ''}
                ]
            },
            會銜公文機關印信蓋用續頁表: {
                name: "SealContinuationSheet", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            蓋用印信申請表: {
                name: "SealCoverApply", value: 4, change: false, unit: '', template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            補製換發印信申請表: {
                name: "SealMakeReplace", value: 4, change: false, unit: '', template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            印信啟用報備表: {
                name: "SealEnableReport", value: 4, change: false, unit: '', template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            繳銷廢舊印信申報表: {
                name: "SealDestroyReport", value: 4, change: false, unit: '', template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            公務電話紀錄: {
                name: "PhoneRecord", value: 4, change: false, unit: '', template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            LINE訊息紀錄單: {
                name: "Line", value: 4, change: false, unit: '', template: [
                    {name: 'LINE訊息紀錄單', value: 'LINE訊息紀錄單', xml: ''}
                ]
            },
            箋函: {
                name: "Letter", value: 6, change: false, template: [
                    {name: '空白函稿', value: '空白函稿', xml: ''}
                ]
            },
            出席會議報告單: {
                name: "Attend", value: 4, change: false, unit: '', template: [
                    {name: '空白出席會議報告單', value: '空白出席會議報告單', xml: ''}
                ]
            },
            報告: {
                name: "Notes", value: 4, change: false, unit: '', template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            府裁處書格式: {
                name: "Notes", value: 4, change: false, unit: 'tbpx', text: '（府）裁處書格式', template: [
                    {name: '空白簽', value: '空白簽', xml: '', url: '府裁處書-法務局已確認105.10.13.doc'}
                ]
            },
            機關裁處書格式: {
                name: "Notes", value: 4, change: false, unit: 'tbpx', text: '（機關）裁處書格式', template: [
                    {name: '空白簽', value: '空白簽', xml: '', url: '局處裁處書-法務局已確認105.10.13.doc'}
                ]
            },
            市長用箋: {
                name: "MayorNote", value: 4, change: false, unit: 'tbpx', template: [
                    {name: '空白市長用箋', value: '空白市長用箋', xml: ''}
                ]
            },
            訴願答辯書: {
                name: "ReplyBook", value: 4, change: false, unit: '', template: [
                    {name: '空白訴願答辯書', value: '空白訴願答辯書', xml: '', url: '訴願答辯書-法務局網站公告105.2.23.doc'}
                ]
            },
            行政訴訟答辯書: {
                name: "LitigationReplyBook", value: 4, change: false, unit: '', template: [
                    {name: '空白行政訴訟答辯書', value: '空白行政訴訟答辯書', xml: '', url: '行政訴訟答辯書-法務局網站公告105.2.23.doc'}
                ]
            },
            各機關國賠應拒絕賠償簽辦單: {
                name: "Notes", value: 4, change: false, unit: 'tbpx', template: [
                    {name: '空白簽', value: '空白簽', xml: '', url: '國賠拒賠簽辦單.doc'}
                ]
            },
            會計報告遞送單: {
                name: "AccountingReport", value: 4, change: false, unit: 'tbpx', text: '會計報告遞送單(稿)', template: [
                    {name: '空白會計報告遞送單', value: '空白會計報告遞送單', xml: ''}
                ]
            },
            會辦簽: {
                name: "NotesOpinion", value: 5, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            }
        },

        //決行層級及分層負責文字
        DCSNS: {
            '-1': {name: '一層決行', value: -1, ofCode: 1, ofDesc: '本案依分層負責規定授權業務主管決行'},
            '-2': {name: '二層決行', value: -2, ofCode: 2, ofDesc: '本案依分層負責規定授權業務主管決行'},
            '-3': {name: '三層決行', value: -3, ofCode: 3, ofDesc: '本案依分層負責規定授權業務主管決行'},
            '-4': {name: '四層決行', value: -4, ofCode: 4, ofDesc: '本案依分層負責規定授權承辦人決行'}
        },
        //台北市用騎縫章
        pagingSeal: 'data:image/png;base64,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',

        //忽略欄位
        ignoreFields: []
    };

    //屏東
    var tbpx = {
        environment: 'production',  //dev , testing , production , to use host_xxx url
        unit: 'TBPX',
        useSSL: false,       //true to use host_xxx_ssl
        version: '1.0.0',
        appMode: '', //spa,mpa,preview

        host_development: 'localhost:8080/tcqb/rest/',
        host_testing: '172.16.55.15:8080/tbpx/rest/',
        host_production: '../rest/',
        host_make: '172.16.55.15:8080/make/',
        host_ssoHome: '172.16.55.15:8080/tbpx_sso/indexm.jsp',
        host_ssoSvc: '172.16.55.15:8080/tbpx/oa/jsonSSO.jsp',
        host_sign: 'http://localhost:16888/doPostMsg',

        host_development_ssl: 'io.kangdainfo.com/tcqb/rest/',
        host_testing_ssl: 'io.kangdainfo.com/tcqb/rest/',
        host_production_ssl: '../rest/',
        host_make_ssl: '172.16.55.15:8080/make/',
        host_ssoHome_ssl: 'io.kangdainfo.com/tbpx_sso/indexm.jsp',
        host_ssoSvc_ssl: 'io.kangdainfo.com/tbpx/oa/jsonSSO.jsp',

        printPadding: 0,
        gutterShow: true,      //裝訂線
        autoLogin: true,       //自動登入
        welcome: false,        //歡迎頁
        dtdFormatTyle: 'utf8', //di dtd
        nextStep: '',

        logo: '',
        logoText: '',

        rootDeptNo: '0000',
        //set OA.common.DIMgr.FORMATS ，  template:value必需要與Silverlight樣本對應
        FORMATS: {
            SORT: [
                {value: '1', text: '令', items: ['令', '獎懲令']},
                {
                    value: '2', text: '函', items: ['函', '書函', '交辦案件通知單', '交議案件通知單',
                    '催辦案件通知單', '移文單', '機密文書機密等級變更或註銷建議單', '機密文書機密等級變更或註銷通知單',
                    '執行命令', '獎懲建議函']
                },
                {value: '3', text: '公告'},
                {value: '4', text: '開會通知單'},
                {value: '5', text: '簽'},
                {value: '6', text: '簽稿會核單'},
                {value: '7', text: '會銜公文會辦單'},
                {value: '8', text: '公文時效統計'},
                {value: '9', text: '呈'},
                {value: 'A', text: '咨'},
                {
                    value: 'Z', text: '其他', items: ['便簽', '箋函', '公示送達', '會勘通知單', '行政裁處書', '派免建議函',
                    '動支第二預備金核定通知', '動支墊付款核定通知', '動支災害準備金核定通知']
                }
            ],
            令: {
                name: "Order", value: '1', change: true, template: [
                    {name: '空白令', value: '空白令', xml: ''}
                ]
            },
            獎懲令: {
                name: "ProposalOrder", value: '2', change: true, template: [
                    {name: '獎懲令(1人格式)', value: '獎懲令(1人格式)', xml: 'tpl_Order_1.xml'},
                    {name: '獎懲令(多人格式)', value: '獎懲令(多人格式)', xml: 'tpl_Order_2.xml'},
                    {name: '派免令(1人格式)', value: '派免令(1人格式)', xml: 'tpl_Order_3.xml'},
                    {name: '派免令(多人格式)', value: '派免令(多人格式)', xml: 'tpl_Order_4.xml'}
                ]
            },

            函: {
                name: "Letter", value: '21', change: true, template: [
                    {name: '空白函稿', value: '空白函稿', xml: ''}
                ]
            },
            書函: {
                name: "BookLetter", value: '22', change: true, template: [
                    {name: '空白書函', value: '空白書函', xml: ''}
                ]
            },
            交辦案件通知單: {
                name: "AssignedNotice", value: '23', change: true, template: [
                    {name: '空白交辦案件通知單', value: '空白交辦案件通知單', xml: ''}
                ]
            },
            交議案件通知單: {
                name: "IssuesNotice", value: '24', change: true, template: [
                    {name: '空白交議案件通知單', value: '空白交議案件通知單', xml: ''}
                ]
            },
            催辦案件通知單: {
                name: "RemindersNotice", value: '25', change: true, template: [
                    {name: '空白催辦案件通知單', value: '空白催辦案件通知單', xml: ''}
                ]
            },
            移文單: {
                name: "MoveNotice", value: '26', change: true, template: [
                    {name: '空白移文單', value: '空白移文單', xml: ''}
                ]
            },
            機密文書機密等級變更或註銷建議單: {
                name: "ProposalNotice", value: '27', change: true, template: [
                    {name: '空白機密文書機密等級變更或註銷建議單', value: '空白機密文書機密等級變更或註銷建議單', xml: ''}
                ]
            },
            機密文書機密等級變更或註銷通知單: {
                name: "ExchangeNotice", value: '28', change: true, template: [
                    {name: '空白機密文書機密等級變更或註銷通知單', value: '空白機密文書機密等級變更或註銷通知單', xml: ''}
                ]
            },
            執行命令: {
                name: "DoOrder", value: '29', change: true, template: [
                    {name: '空白執行命令', value: '空白執行命令', xml: ''}
                ]
            },
            獎懲建議函: {
                name: "ProposalLetter", value: '2A', change: true, template: [
                    {name: '空白獎懲建議函(1人格式)', value: '空白獎懲建議函(1人格式)', xml: ''},
                    {name: '空白獎懲建議函(多人格式)', value: '空白獎懲建議函(多人格式)', xml: ''}
                ]
            },

            公告: {
                name: "Publish", value: 7, change: true, template: [
                    {name: '空白公告', value: '空白公告', xml: ''}
                ]
            },
            開會通知單: {
                name: "Meeting", value: 3, change: true, template: [
                    {name: '空白開會通知單', value: '空白開會通知單', xml: ''}
                ]
            },
            簽: {
                name: "Notes", value: 4, change: false, unit: 'tbpx', template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            簽稿會核單: {
                name: "Notes", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            會銜公文會辦單: {
                name: "Notes", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            公文時效統計: {
                name: "Notes", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            呈: {
                name: "Notes", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            咨: {
                name: "Notes", value: 4, change: false, template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },

            便簽: {
                name: "NoteSticky", value: 5, change: false, unit: 'tbpx', template: [
                    {name: '空白便簽', value: '空白便簽', xml: ''}
                ]
            },
            箋函: {
                name: "Letterhead", value: 6, change: false, template: [
                    {name: '空白箋函', value: '空白箋函', xml: ''}
                ]
            },
            公示送達: {
                name: "Notice", value: 9, change: false, template: [
                    {name: '空白公示送達', value: '空白公示送達', xml: ''}
                ]
            },
            會勘通知單: {
                name: "SurveyNotice", value: 10, change: true, template: [
                    {name: '空白會勘通知單', value: '空白會勘通知單', xml: ''}
                ]
            },
            行政裁處書: {
                name: "TribunalBook", value: 18, change: false, template: [
                    {name: '行政裁處書', value: '行政裁處書', xml: ''}
                ]
            },
            派免建議函: {
                name: "FactionLetter", value: 19, change: true, template: [
                    {name: '派免建議函', value: '派免建議函', xml: ''}
                ]
            },
            動支第二預備金核定通知: {
                name: "SecondAdvanceNotice", value: 22, change: false, unit: 'tbpx', template: [
                    {name: '空白動支第二預備金核定通知', value: '空白動支第二預備金核定通知', xml: ''}
                ]
            },
            動支墊付款核定通知: {
                name: "ReimbursedPayNotice", value: 23, change: false, unit: 'tbpx', template: [
                    {name: '空白動支墊付款核定通知', value: '空白動支墊付款核定通知', xml: ''}
                ]
            },
            動支災害準備金核定通知: {
                name: "CalamityAdvanceNotice", value: 24, change: false, unit: 'tbpx', template: [
                    {name: '空白動支災害準備金核定通知', value: '空白動支災害準備金核定通知', xml: ''}
                ]
            }
        },

        //決行層級及分層負責文字
        DCSNS: {
            '-1': {name: '一層決行', value: -1, ofCode: 1, ofDesc: '本案依分層負責規定授權業務主管決行'},
            '-2': {name: '二層決行', value: -2, ofCode: 2, ofDesc: '本案依分層負責規定授權業務主管決行'},
            '-3': {name: '三層決行', value: -3, ofCode: 3, ofDesc: '本案依分層負責規定授權業務主管決行'},
            '-4': {name: '四層決行', value: -4, ofCode: 4, ofDesc: '本案依分層負責規定授權承辦人決行'}
        },

        //忽略欄位
        ignoreFields: [],
        //限制角色
        allowRoles: ['16'],
        //限制iPad
        allowDevices: ['iPad'],
        // allowDeviceType:['Phone','Tablet','Desktop'],
        //屏東用騎縫章
        pagingSeal: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA1CAYAAADh5qNwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAOWElEQVRoQ62aCfRN1RfHzy8iDZJSpBTKUJKpQqNMjRSWBkWFZciQSilJpSLzkGhFxSKRBskQKsPSjKKFypQKDUjGVM5/f7b/vt1737vvvV///17rrffeveece/b03cO5eV7I/ZeWLl3qvv/+exe6ZLcyfufl5bkCBQq4v/76K6fxNog5fP7888+cn3nEEUe4ggUL6rMOHTqk84oUKeKuueYaV7hwYV06D6Z+/fVX17hxY7d8+XIdwCZzJcay+P79+13RokVzZgxmdu/erY859thjdXPZhAlDBw4c0GcwB+LZCIXPyy+/7Nq0aeNYyJ9xxhn+uOOO82vWrOFvvmnz5s3+3HPPzfe8oUOHYiX5mvfRRx/pnIEDB0bm3XfffXpdrM27CRMm6J+///47ZfFvv/02pwd+9tlnusZXX32V03gGrV+/3leoUCHClGjBT548Oe0aixcv9lWrVtXxFStW1O+bbrrJb9++PRh/7733etGgd9xo3rx5ZKFPPvnElyhRwh955JH+pJNO8m+88UbGzf7222+BlHLh6oEHHtDxRx99tH6PGzdOp82aNUv///TTT5FlJk2apNfLlSvnN23apPfmz5+v184++2wvJqjXfvjhB73mGjRo4B988MFgkSVLlhy+Efug9iQS39Dx48ePz8qTmdwjjzyiY8877zyd+/XXX/v3338/rWlx/4477khZm7niZ37Pnj16T7BB/7tGjRr5+++/Xy/u3LlTF61cubLevP766/3IkSN9w4YN/Ycffpi44d9//13njR49OiNTGzdu1HGtW7eOjLvgggv0+i+//OJr166tv1999VXPupAJ+K677lKrwW9ee+01vd6vX79gLeYLcEWZ6tOnT2Dj2CYTcyFBPp33wgsvZByOzzEOYYVpzJgxev3NN9/0Bw8e9ALP+l+g25966ql+27Zt/uabb/bHHHNMigUJ2qmWTVMpTLFQx44ddYBArgdEstHevXsVIJjbo0cPRVB8zKQcn29aueeee/yyZcs8m2JutWrVIkPnzp3rr776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'
    };

    //聯徵
    var tchy = {
        environment: 'testing',  //dev , testing , production
        unit: 'TCHY',
        useSSL: false,       //true to use  host_xxx_ssl
        version: '1.0.2',
        host_development: 'localhost:8080/tchy/rest/',
        host_testing: '172.16.30.117/tchy/rest/',
        host_production: 'apps.kangdainfo.com/tchy/rest/',
        host_make: '172.16.30.117/make/',

        host_development_ssl: 'localhost:8443/tchy/rest/',
        host_testing_ssl: '172.16.30.97:443/tchy/rest/',
        host_production_ssl: '59.120.255.188:8443/tchy/rest/',
        host_make_ssl: '172.16.30.97:443/make/',

        gutterShow: true,      //裝訂線
        autoLogin: true,       //自動登入
        welcome: false,        //歡迎頁
        dtdFormatTyle: 'utf8', //di dtd
        nextStep: '',

        //聯徵LOGO
        logo: "data:image/png;base64,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",
        logoText: 'Joint Credit Information Center',

        rootDeptNo: '0000',
        //set OA.common.DIMgr.FORMATS ，  template:value必需要與Silverlight樣本對應
        FORMATS: {
            函: {
                name: "Letter", value: 1, change: true, template: [
                    {name: '空白函稿', value: '空白函稿', xml: ''},
                    {name: 'M119橫-查稅籍資料稿', value: 'M119橫-查稅籍資料稿', xml: ''},
                    {name: 'M120橫-未變更處分書稿', value: 'M120橫-未變更處分書稿', xml: ''},
                    {name: 'M121橫-無照處分書稿', value: 'M121橫-無照處分書稿', xml: ''},
                    {name: 'M122橫-未變更罰款處分書稿', value: 'M122橫-未變更罰款處分書稿', xml: ''},
                    {name: 'M129橫-庫款支付月報稿', value: 'M129橫-庫款支付月報稿', xml: ''},
                    {name: 'M136函稿(道路工程-申請補助)', value: 'M136函稿(道路工程-申請補助)', xml: ''},
                    {name: 'M137函稿(漁筏漁業執照)', value: 'M137函稿(漁筏漁業執照)', xml: ''},
                    {name: 'M138函稿-申請補助油槽', value: 'M138函稿-申請補助油槽', xml: ''},
                    {name: 'M139函稿-換發小船執照', value: 'M139函稿-換發小船執照', xml: ''},
                    {name: 'M140函稿-僱用外籍船員名冊', value: 'M140函稿-僱用外籍船員名冊', xml: ''},
                    {name: 'M141函稿-僱用外籍船員名冊(乙)', value: 'M141函稿-僱用外籍船員名冊(乙)', xml: ''}
                ]
            },
            書函: {
                name: "BookLetter", value: 2, change: true, template: [
                    {name: '空白書函', value: '空白書函', xml: ''}
                ]
            },
            開會通知單: {
                name: "Meeting", value: 3, change: true, template: [
                    {name: '空白開會通知單', value: '空白開會通知單', xml: ''}
                ]
            },
            簽: {
                name: "Notes", value: 4, change: false, unit: 'tchy', template: [
                    {name: '空白簽', value: '空白簽', xml: ''}
                ]
            },
            便簽: {
                name: "NoteSticky", value: 5, change: false, template: [
                    {name: '空白便簽', value: '空白便簽', xml: ''}
                ]
            },
            箋函: {
                name: "Letterhead", value: 6, change: false, template: [
                    {name: '空白箋函', value: '空白箋函', xml: ''}
                ]
            },
            公告: {
                name: "Publish", value: 7, change: true, template: [
                    {name: '空白公告', value: '空白公告', xml: ''}
                ]
            },
            令: {
                name: "Order", value: 8, change: true, template: [
                    {name: '空白令', value: '空白令', xml: ''},
                    {name: '獎懲令(1人格式)', value: '獎懲令(1人格式)', xml: 'tpl_Order_1.xml'},
                    {name: '獎懲令(多人格式)', value: '獎懲令(多人格式)', xml: 'tpl_Order_2.xml'},
                    {name: '派免令(1人格式)', value: '派免令(1人格式)', xml: 'tpl_Order_3.xml'},
                    {name: '派免令(多人格式)', value: '派免令(多人格式)', xml: 'tpl_Order_4.xml'}
                ]
            },
            公示送達: {
                name: "Notice", value: 9, change: false, template: [
                    {name: '空白公示送達', value: '空白公示送達', xml: ''}
                ]
            },
            會勘通知單: {
                name: "SurveyNotice", value: 10, change: false, template: [
                    {name: '空白會勘通知單', value: '空白會勘通知單', xml: ''}
                ]
            },
            獎懲建議函: {
                name: "ProposalLetter", value: 11, change: true, template: [
                    {name: '空白獎懲建議函(1人格式)', value: '空白獎懲建議函(1人格式)', xml: ''},
                    {name: '空白獎懲建議函(多人格式)', value: '空白獎懲建議函(多人格式)', xml: ''}
                ]
            },
            交辦案件通知單: {
                name: "AssignedNotice", value: 12, change: true, template: [
                    {name: '空白交辦案件通知單', value: '空白交辦案件通知單', xml: ''}
                ]
            },
            交議案件通知單: {
                name: "IssuesNotice", value: 13, change: true, template: [
                    {name: '空白交議案件通知單', value: '空白交議案件通知單', xml: ''}
                ]
            },
            催辦案件通知單: {
                name: "RemindersNotice", value: 14, change: true, template: [
                    {name: '空白催辦案件通知單', value: '空白催辦案件通知單', xml: ''}
                ]
            },
            移文單: {
                name: "MoveNotice", value: 15, change: true, template: [
                    {name: '空白移文單', value: '空白移文單', xml: ''}
                ]
            },
            機密文書機密等級變更或註銷建議單: {
                name: "ProposalNotice", value: 16, change: true, template: [
                    {name: '空白機密文書機密等級變更或註銷建議單', value: '空白機密文書機密等級變更或註銷建議單', xml: ''}
                ]
            },
            機密文書機密等級變更或註銷通知單: {
                name: "ExchangeNotice", value: 17, change: true, template: [
                    {name: '空白機密文書機密等級變更或註銷通知單', value: '空白機密文書機密等級變更或註銷通知單', xml: ''}
                ]
            },
            行政裁處書: {
                name: "TribunalBook", value: 18, change: false, template: [
                    {name: '行政裁處書', value: '行政裁處書', xml: ''}
                ]
            },
            派免建議函: {
                name: "FactionLetter", value: 19, change: true, template: [
                    {name: '派免建議函', value: '派免建議函', xml: ''}
                ]
            },
            電子郵件: {
                name: "EmailLetter", value: 20, change: false, template: [
                    {name: '空白電子郵件', value: '空白電子郵件', xml: ''}
                ]
            },  //不電子發文
            簡便行文表: {
                name: "EasyLetter", value: 21, change: false, template: [
                    {name: '空白簡便行文表', value: '空白簡便行文表', xml: ''}
                ]
            }
        },

        //決行層級及分層負責文字
        DCSNS: {
            '-1': {name: '一層決行', value: -1, ofCode: 1, ofDesc: '本案依分層負責規定授權業務主管決行'},
            '-2': {name: '二層決行', value: -2, ofCode: 2, ofDesc: '本案依分層負責規定授權業務主管決行'},
            '-3': {name: '三層決行', value: -3, ofCode: 3, ofDesc: '本案依分層負責規定授權業務主管決行'},
            '-4': {name: '四層決行', value: -4, ofCode: 4, ofDesc: '本案依分層負責規定授權承辦人決行'}
        },

        //聯徵不支援決行層級,分層負責欄位
        ignoreFields: ['決行層級', '分層負責', '承辦單位', '應用限制', '擬辦方式', '稿面註記']
    };

    return tcqb;
}