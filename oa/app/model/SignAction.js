Ext.define('OA.model.SignAction', {
    extend: 'Ext.data.Model',
    alias: 'model.SignAction',
    config: {
        fields: [

            //{name: "名稱", type: "string"},
            //{name: "是否加簽", type: "string"},

            {name: "name", type: "string"},
            {name: "isSign", type: "bool"},

            {name: "AfterScript", type: "string"},
            {name: "AfterScriptParams", type: "string"},
            {name: "BeforeScript", type: "string"},
            {name: "BeforeScriptParams", type: "string"},
            {name: "methodId", type: "string"}
        ]
    }
});