Ext.define('OA.model.Attach', {
    extend: 'Ext.data.Model',
    alias: 'model.Attach',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [
            'sid1', 'sid2', 'hashcode','hashvi', 'dialogType', 'doSno', 'doDeptno', 'depNo', 'empNo', 'jobNo',
            'orgNo', 'orgId', 'genDocNo', 'version', 'paperNo','agentEmplNo',
            'gbDocflowId','docType','epaper','empName',
            'roleId','folderId','actionId',
            'subRoleId', 'subFolderId', 'subActionId','flowUri',
            {name: "attachs", type: "array"},
            { name: "name", type: "string"},
            { name: "url", type: "string"},
            { name: "format", type: "string"},
            { name: "sort", type: "string"},
            { name: "file", type: "object"},
            { name: "isEdit", type: "bool" },
            { name: "isTemp", type: "bool" },
            { name: "isCome", type: "bool" },
            { name: "otherFileName", type: "string" }
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