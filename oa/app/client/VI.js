/**
 * VI Client (AJAX Version)
 */

Ext.define('OA.client.VI', {
    alias: 'client.VI',
    singleton: true,
    requires: [
        'OA.common.UrlMgr', 'OA.client.Editor'
    ],
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    /**
     * 登入 ， 異步返回 callback
     *
     * @param {Object} record
     * @param {Function} callback
     */
    load: function (record, callback) {
    console.log(record);
    
     // 定義一個幫助函數來根據 record 的結構來存取屬性
    function getRecordField(record, field) {
    // 先嘗試直接使用 record[field]
    if (record[field] !== undefined && record[field] !== null) {
        return record[field];
    }
    // 如果沒有，且 record 有 get 方法，則使用 record.get(field)
    if (record.get) {
        return record.get(field) || '';
    }
    // 如果以上都沒有，返回空字串
        return '';
    }

    
    // 使用 getRecordField 來獲取資料
    var doSno = getRecordField(record, 'doSno');
    var dialogType = getRecordField(record, 'dialogType');
        var gbDocflowId = getRecordField(record, 'gbDocflowId');
        var docType = getRecordField(record, 'docType');
        var roleId = getRecordField(record, 'roleId');
        var folderId = getRecordField(record, 'folderId');
        var actionId = getRecordField(record, 'actionId');
        var version = getRecordField(record, 'version');
    
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var epaper = docflow.get('epaper') || '';
        var doDeptno = docflow.get('doDeptno') || '';
        var fileName = docflow.get('fileName') || '';
    
        var initParas = OA.common.Global.getInitParas();
        if (!epaper && initParas) epaper = initParas.epaper;
        if (!doDeptno && initParas) doDeptno = initParas.doDeptno;
        if (!fileName && initParas) fileName = initParas.fileName;
    
        var empName, jobName;
        if (roleId === '15' && getRecordField(record, 'empName')) {
            empName = getRecordField(record, 'empName');
        }
        jobName = getRecordField(record, 'jobName');
    
        if (docflow.get('docType') && !docType) docType = docflow.get('docType');
    
        var qs = OA.common.Global.getQ();
        // 構建發送到後端的數據
        var data = {
            dialogType: dialogType,
            doSno: doSno,
            folderId: folderId,
            actionId: actionId,
            subRoleId: roleId,
            subEmpName: empName,
            subFolderId: folderId,
            subActionId: actionId,
            gbDocflowId: gbDocflowId,
            docType: docType,
            epaper: epaper,
            doDeptno: doDeptno,
            version: version,
            jobName: jobName,
            fileName: fileName,
            reOt: qs.reOt || ''
        };
    
        var paras = OA.common.InitParas.readVI(data);
        var client = Ext.create('OA.model.VI', paras);
    
        var params = {
            token: OA.common.UrlMgr.getToken(),
            reOt: qs.reOt || '',
            app: qs.app || ''
        };
    
        // 設置代理的 URL 和參數
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('editor', 'vi'));
        client.getProxy().setExtraParams(params);
    
        // 發送 POST 請求，並處理回調
        client.save(callback);
    },
     

    loadByEditor: function (initParas, callback) {
        var me = this;
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        var ctrMenu = OA.common.Global.getApp().getController('OA.controller.Menu');
        OA.client.Editor.load(initParas, function (resp, r) {
            var version = r.get('version');
            if (!version) version = padLeft(OA.common.Utils.getRandom(0, 9999999999), 11);
            r.set('version', version);
            Ext.Viewport.setMasked({ xtype: 'loadmask', transparent: true, message: '讀取VI中...' });

            me.load(r, function (result, success) {
                Ext.Viewport.setMasked(false);
                if (success) {
                    var viContent = result.viContent;
                    ctrMenu.initColors(viContent);      // 色版初始化
                    var items = OA.common.VIMgr.load(viContent);
                    items = items.where("(el, i, res, param) => el.action !== 'procnotes'");
                    if (callback) callback(items);
                } else {
                    Ext.Msg.alert('錯誤', '讀取VI失敗');
                }
            });
        });
    }
});
