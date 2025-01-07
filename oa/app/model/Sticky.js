Ext.define('OA.model.Sticky', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: "caption", type: "string"},
            { name: "voName", type: "string"},
            { name: "positionX", type: "string"},
            { name: "positionY", type: "string"},
            { name: "width", type: "string"},
            { name: "height", type: "string"},
            { name: "empNo", type: "string"},
            { name: "empName", type: "string"},
            { name: "jobName", type: "string"},
            { name: "lastUpdateTime", type: "string"},
            { name: "version", type: "string"},
            { name: "text", type: "string"},
            { name: "byControl", type: "string"}
        ]
    }
});