Ext.define('OA.model.AsyncWK', {
    extend: 'Ext.data.Model',
    alias: 'model.AsyncWK',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [

            //Rest Post paras
            'sid1', 'sid2', 'hashcode','hashvi', 'dialogType', 'doSno', 'doDeptno', 'depNo', 'empNo', 'jobNo',
            'orgNo', 'orgId', 'genDocNo', 'version', 'paperNo','agentEmplNo',
            'gbDocflowId','docType','epaper','empName',
            'roleId','folderId','actionId',
            'subRoleId', 'subFolderId', 'subActionId','flowUri'
        ],
        proxy: {
            type: 'ajax',
            useDefaultXhrHeader: false,
            withCredentials: true,
            cors: true,
            writer: {
                type: 'json',
                writeAllFields: true
            },
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }

});