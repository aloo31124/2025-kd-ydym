Ext.define("OA.store.Cip", {
    extend: 'Ext.data.Store',
    alias: 'store.Cip',
    requires: ['OA.model.Cip'],
    config: {
        model: 'OA.model.Cip'
    }
});