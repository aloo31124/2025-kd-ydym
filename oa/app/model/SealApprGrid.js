Ext.define('OA.model.SealApprGrid', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: "id", type: "string"},
            {name: "申請機關", type: "string"},
            {name: "組織法規", type: "string"},
            {name: "請發事由", type: "string"},
            {name: "等級", type: "string"},
            {name: "審核意見", type: "string"},
            {name: "備考", type: "string"}
        ]
    }
});






