Ext.define('OA.model.SendWay', {
    extend: 'Ext.data.Model',
    alias: 'model.SendWay',
    config: {
        fields: [
            {name: "dcsnLevel", type: "string"},
            {name: "ofCode", type: "string"},
            {name: "ofDesc", type: "string"}
        ]
    }
});