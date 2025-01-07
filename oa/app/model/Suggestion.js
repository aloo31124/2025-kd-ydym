Ext.define('OA.model.Suggestion', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: "text", type: 'string'},
            {name: "source", type: 'object'},
            {name: "代碼", type: 'string'},
            {name: "版號", type: 'string'},
            {name: "最後更新時間", type: 'string', sortable: true},
            {name: '簽核人員', type: 'object'},
            {name: '線上簽核資訊', type: 'object'},
            {name: '批示意見', type: 'object'},
            {name: '意見分類', type: 'string'},
            {name: "卡片使用狀態", type: 'string'},
            {name: "承辦單位電話", type: 'string'},
            {name: 'SignatureData', type: 'object'},
            {name: 'show', type: 'string'}
        ]
    }
});