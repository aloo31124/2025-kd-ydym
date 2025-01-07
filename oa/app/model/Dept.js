Ext.define('OA.model.Dept', {
    extend: 'Ext.data.Model',
    alias: 'model.Dept',
    config: {
        fields: [
            {name: "depNo", type: "string"},
            {name: "depName", type: "string"},
            {name: "orgId", type: "string"},
            {name: "orgNo", type: "string"},
            {name: "doDeptno", type: "string"},
            {name: "orgName", type: "string"}
        ]
    }
});