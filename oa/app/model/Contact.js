Ext.define('OA.model.Contact', {
    extend: 'Ext.data.Model',
    config: {
        // idProperty: 'dep3No',
        fields: [
            'ADDR', 'ARCENO', 'CODE', 'CODENAME', 'GROUP', 'GROUPLIST', 'KEY', 'PEOPLESEND', 'REALTRANSTYPE',
            'TRANSTYPE', 'TRANSTYPENAME', 'TYPE', 'VALUE', 'tagName', 'isEdit', 'ATTACH', 'editAtt', 'isChange',
            'except','number','chooseAtt',
            {name: "children", type: "array"}
        ]
        // ,autoSync:true
    }
});