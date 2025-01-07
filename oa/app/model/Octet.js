Ext.define('OA.model.Octet', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: "caption", type: "string"},
            { name: "positionX", type: "string"},
            { name: "positionY", type: "string"},
            { name: "empNo", type: "string"},
            { name: "empName", type: "string"},
            { name: "jobName", type: "string"},
            { name: "lastUpdateTime", type: "string"},
            { name: "version", type: "string"},
            { name: "text", type: "string"},
            { name: "code", type: "string"},
            { name: "type", type: "string"},
            { name: "ratio", type: "string"}
        ]
    }
});