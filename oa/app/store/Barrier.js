Ext.define("OA.store.Barrier", {
    extend: 'Ext.data.Store',
    alias: 'store.Barrier',
    requires: ['OA.model.Barrier'],
    config: {
        model: 'OA.model.Barrier'
    }
});