/**
 * 共用功能
 */

Ext.define('OA.common.Funcs', {
    singleton: true,
    alias: 'common.Funcs',
    config: {},
    Enum: {
        FormMore: '更多',
        FormSetting: '設定',

        FormFields: '欄位',
        FormNewDoc: '創簽稿',
        FormImport: '匯入',
        FormExport: '匯出',
        FormCaseNo: '檔號分類號',
        FormChange: '機關代碼交換',
        FormOrgNo: '機關代碼明細',
        FormChildrenOrgNo: '子項機關代碼明細',
        FormEditMore: '編輯更多',

        FlowOperation: '流程新增',
        FormChangeNumber: '轉數字',
        FormPreviewSetting: '預覧進階',
        FormSend: '轉交換',
        FormDocTemplates: '常用範本',
        FormCaseNoTemplates: '常用檔號',
        FormThesaurus: '常用字彙',
        FormParallel: '併列選項',
        FormFlowTip: '流程提示',
        PanelReference: '引用',
        FormAddTable: '插入表格選項',
        FormPaperChange: '文稿排列',
        FormSignData: '憑證資訊',
        FormGenSendNo: '自動編支號',
        FormMember: '群組成員',
        FormSuggestionTextArea: '意見編輯',
        FormChooseAtt: '分址分文選附件',
        FormStamps: '章戳'
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    show: function (name, by, data) {
        var p = Ext.Viewport.down(name);
        if (!p) {
            p = Ext.create('widget.' + name);
            Ext.Viewport.add(p);
        }

        if (data) {
            p.create(data);
        } else {
            if (p.create) p.create();
        }

        var menuLeft = Ext.Viewport.getMenus().left ;
        var isMenuLeftHidden = (menuLeft) ? menuLeft.getHidden() :true;
        if (isMenuLeftHidden==false){
            p.setLeft('5%');
            p.setTop('5%');
            p.setMaxWidth('70%');
            p.setMaxHeight('90%');
        }else{
            p.setMaxWidth('100%');
            p.setMaxHeight('100%');
        }

        if (by){
            p.showBy(by);
        }
        else{
            p.show();
        }
    },
    widget: function (name, by) {
        var fo = Ext.Viewport.down(name);
        if (!fo)
            fo = Ext.widget(name);
        if (fo.create) fo.create(by);
        fo.showBy(by, "tl-bl?");
    }
});

