Ext.define('OA.model.SI', {
    extend: 'Ext.data.Model',
    alias: 'model.SI',
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
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            reader: {
                type: 'json'
                , rootProperty: 'input'
            },
            writer: {
                type: 'json',
                rootProperty: "input"
                //encode: true
            }
        }
    }

});