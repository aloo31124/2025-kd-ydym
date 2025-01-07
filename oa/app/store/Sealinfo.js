Ext.define("OA.store.Sealinfo", {
    extend: 'Ext.data.Store',
    alias: 'store.Sealinfo',
    requires: ['OA.model.Sealinfo'],
    config: {
        model: 'OA.model.Sealinfo'
    }
});