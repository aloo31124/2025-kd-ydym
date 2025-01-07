Ext.define('OA.model.Barrier', {
    extend: 'Ext.data.Model',
    alias: 'model.Barrier',
    requires: ['OA.model.WorkFlow'],
    config: {
        fields: [
            //Rest Post paras
            'sid1', 'sid2', 'hashcode','hashvi', 'dialogType', 'doSno', 'doDeptno', 'depNo', 'empNo', 'jobNo',
            'orgNo', 'orgId', 'genDocNo', 'version', 'paperNo',
            'userIP','empName','gbDocflowId','docType','agentEmplNo','odaf20Id',
            'roleId', 'actionId','folderId','parlPaperNo',

            'subRoleId','subFolderId','subActionId',

            {name: "workFlowNodes", type: "array"},
            {name: "subGbDocflowList", type: "array"},
            {name: "dcsns", type: "array"},
            {name: "files", type: "array"},

            'oddf02Id','dcsnNo','retDesc',

            //show
            'lv','code',
            'selectItems',
            'message'
        ],
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            cors: true,
            writer: {
                type: 'json',
                rootProperty: "input"
            },
            reader: {
                type: 'json'
            }
        }
    }
});