/**
 *
 */

Ext.define('OA.model.InitParas', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: "sid1", type: "string" },
            { name: "sid2", type: "string" },
            { name: "hashcode", type: "string" },
            { name: "dialogType", type: "string" },
            { name: "doSno", type: "string" },
            { name: "doDeptno", type: "string" },
            { name: "depNo", type: "string" },
            { name: "empNo", type: "string" },
            { name: "jobNo", type: "string" },
            { name: "roleId", type: "string" },
            { name: "orgNo", type: "string" },
            { name: "orgId", type: "string" },
            { name: "genDocNo", type: "string" },
            { name: "version", type: "string" },
            { name: "paperNo", type: "string" },
            { name: "docType", type: "string" },
            { name: "approveSeal", type: "string" },
            { name: "mayorNoteStr", type: "string" },
            { name: "dep2List", type: "string" },
            { name: "canSend", type: "string" },
            { name: "sendCnt", type: "string" },
            { name: "review", type: "string" },

        ]
    }
});