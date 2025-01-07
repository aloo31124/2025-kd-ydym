Ext.define("OA.store.Attach", {
    extend: 'Ext.data.Store',
    alias: 'store.Attach',
    requires: ['OA.model.Attach'],
    config: {
        model: 'OA.model.Attach'
    }
});