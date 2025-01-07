Ext.define("OA.store.Stamps", {
    extend: 'Ext.data.Store',
    alias: 'store.Stamps',
    requires: ['OA.model.Stamps'],
    config: {
        model: 'OA.model.Stamps'
    }
});