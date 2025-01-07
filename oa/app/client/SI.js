/**
 * SI Client
 */

Ext.define('OA.client.SI', {
    alias: 'client.SI',
    singleton: true,
    requires: [
        'OA.model.SI', 'OA.common.UrlMgr'
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
        var doSno = record.get('doSno');
        var dialogType = record.get('dialogType');
        var gbDocflowId = record.get('gbDocflowId');
        var docType = record.get('docType');

        var roleId = record.get('roleId');
        var folderId = record.get('folderId');
        var actionId = record.get('actionId');
        var FlowUri = record.get('FlowUri');

        var status4 = record.get('status4');
        var version = record.get('version');
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var epaper = docflow.get('epaper');
        var doDeptno = docflow.get('doDeptno');
        var fileName = docflow.get('fileName');


        var initParas =OA.common.Global.getInitParas();
        if (!epaper && initParas) epaper = initParas.epaper;
        if (!doDeptno && initParas) doDeptno = initParas.doDeptno;
        if (!fileName && initParas) fileName = initParas.fileName;

        if (docflow.get('docType') && !docType) docType = docflow.get('docType');

        var data = {
            "dialogType": dialogType,
            "doSno": doSno,
            'folderId': folderId,
            'actionId': actionId,
            'subRoleId': roleId,
            'subFolderId': folderId,
            'subActionId': actionId,
            "gbDocflowId": gbDocflowId,
            "docType": docType,
            "epaper": epaper,
            'doDeptno': doDeptno,
            'version': version,
            'flowUri': FlowUri,
            'fileName': fileName,
        };

        var paras = OA.common.InitParas.readVI(data);
        var client = Ext.create('OA.model.SI', paras);
        var qs = OA.common.Global.getQ();

        var params = {token: OA.common.UrlMgr.getToken()};
        if (qs.reOt) params.reOt = qs.reOt;
        params.app = qs.app;

        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('getSiSignature'));
        client.getProxy().setExtraParams(params);
        client.save(callback); //POST /getSiSignature/   InitParas
    }
});