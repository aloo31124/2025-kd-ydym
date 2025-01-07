Ext.define("OA.store.Role", {
    extend: 'Ext.data.Store',
    alias: 'store.Role',
    requires: ['OA.model.Role'],
    config: {
        model: 'OA.model.Role',
        autoLoad: true
    }
});