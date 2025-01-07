Ext.define("OA.store.Quote", {
    extend: 'Ext.data.Store',
    alias: 'store.Quote',
    requires: ['OA.model.Quote'],
    config: {
        model: 'OA.model.Quote'
    }
});