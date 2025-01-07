Ext.define('OA.model.ChooseAtt', {
    extend: 'Ext.data.Model',
    alias: 'model.ChooseAtt',
    config: {
        fields: [
            { name: "number", type: "string"},
            { name: "attName", type: "string"},
            { name: "isElect", type: "bool"}
        ]
    }
});