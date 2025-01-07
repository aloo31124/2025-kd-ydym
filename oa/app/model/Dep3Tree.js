Ext.define('OA.model.Dep3Tree', {
    extend: 'Ext.data.Model',
    config: {
        // idProperty: 'dep3No',
        fields: [
            "id",
            "transType",      //"9"
            "dep3No",         //"2013010214121836200"
            "dep3Zone",       //"111",
            "dep3Addr",       //"臺北市士林區士商路189號",
            "peopleSend",     //"N",
            "dep3Name",       //"本館朱館長楠賢",
            "group",
            'children',
            'except',
            'ATTACH',
            'KEY',
            'number',
            { name: "isAdd", type: "bool" },
            { name: "isEdit", type: "bool" },
            { name: "isElect", type: "bool" }
        ]
    }
});