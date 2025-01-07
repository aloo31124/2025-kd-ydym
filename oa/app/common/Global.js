Ext.define('OA.common.Global', {
    singleton : true,
    alias : 'common.Global',
    mixins: ['Ext.mixin.Observable'],
    config: {
        app: null,
        q: null,
        isMgr: 'N',                 //管理者
        sourceUser: null,           //來源使用者，從管理來
        currentUser: null,          //使用者
        currentDept: null,          //機關
        currentRole: null,          //角色
        currentMenu: null,          //左方功能
        currentDocFlowRecord: null, //目前公文資料夾Record
        currentWKContent: null,     //WK Raw Data
        currentViewModel: null,    //WK View Model
        Plusdatas: null,
        initParas: null,            //共用初始化參數
        parallelWin: null,        //併列稿
        destJobNo: null,            //指向下一關或上一關 JobNo
        verifyConfig: null,         // 系統管理>系統參數設定>製作跟簽核的設定檔
        queryDefault: null,         //預存交換資訊
        refreshDocflow: null,      //強制 docflow refresh
        database: null,
        domColors: null,
        layer: null,
        winOpener: null,
        followPdfUrl: null,

        initParasList: [], //初始化參數list

        // 避免重複註冊卷軸拖拉事件 - by yi-chi chiu
        dragList: [],

        // 簽核(1)、製作(2)、函覆(4)、轉紙本(5)、草稿(8) , 查閱(3)、第三類公佈欄(6)
        //dialogType :'3'

        //決行章
        approveSeal: '',

        //單位範本清單
        docTempList: [],

        //非即時追蹤修訂文稿集合
        oSvgAsync: []   

        //草稿用oSVG
        //draftSVG: null
    },
    constructor: function(config) {
        this.initConfig(config);
    }
});

