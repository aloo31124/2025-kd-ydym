Ext.define('OA.model.History', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: "text", type: "string"},
            {name: "source", type: "object"},
            {name: "nodeType", type: "string"},
            {name: "版號", type: "string"},
            {name: "最後更新時間", type: "string"},
            {name: '簽核人員', type: 'object'},
            {name: '線上簽核資訊', type: 'object'}
        ]
    }
});