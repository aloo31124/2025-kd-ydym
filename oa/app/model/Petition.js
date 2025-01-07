Ext.define('OA.model.Petition', {
    extend: 'Ext.data.Model',
    alias: 'model.Petition',
    config: {
        fields: [
            {name: "ofType", type: "string"},
            {name: "ofCode", type: "string"},
            {name: "ofDesc", type: "string"}
        ]
    }
});