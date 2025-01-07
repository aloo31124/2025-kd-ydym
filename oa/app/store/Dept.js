Ext.define("OA.store.Dept", {
    extend: 'Ext.data.Store',
    alias: 'store.Dept',
    requires: ['OA.model.Dept'],
    config: {
        model: 'OA.model.Dept',
        autoLoad: true
    }
});