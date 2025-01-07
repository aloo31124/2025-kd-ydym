Ext.define("OA.store.Sticky", {
    extend: 'Ext.data.Store',
    alias: 'store.Sticky',
    requires: ['OA.model.Sticky'],
    config: {
        model: 'OA.model.Sticky'
    }
});