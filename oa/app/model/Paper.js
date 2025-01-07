

Ext.define('OA.model.Paper', {
    extend: 'Ext.data.Model',
    requires: [],
    config: {
        fields: [

            { name: "text", type: "string" },
            { name: "paperNo", type: "int" },
            { name: "paperOrder", type: "int" },
            { name: "source", type: "object" },
            { name: "otherName", type: "string" },
            { name: "isOther", type: "bool" },
            { name: "isChange", type: "bool" }

            // { name: "id", type: "string"},
            // { name: "state", type: "string"},
            // { name: "title", type: "string"},
            // { name: "orgName", type: "string"},
            // { name: "speed", type: "string"},
            // { name: "user", type: "string"},
            // { name: "date", type: "string" }
        ]
        // ,proxy: {
        //     type: 'ajax',
        //     url: OA.common.UrlMgr.restUrl('paper',''),
        //     useDefaultXhrHeader: false,
        //     cors: true
        // }
    }
});


