Ext.define('OA.model.Role', {
    extend: 'Ext.data.Model',
    alias: 'model.Role',
    config: {
        fields: [
            {name: "depNo", type: "string"},
            {name: "roleId", type: "string"},
            {name: "roleName", type: "string"},
            {name: "jobNo", type: "string"},
            {name: "agentEmplNo", type: "string"},
            {name: "odaf20Id", type: "string"}
        ]
    }

});