Ext.define("OA.store.Octet", {
    extend: 'Ext.data.Store',
    alias: 'store.Octet',
    requires: ['OA.model.Octet'],
    config: {
        model: 'OA.model.Octet'
    }
});