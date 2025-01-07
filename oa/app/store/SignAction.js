Ext.define("OA.store.SignAction", {
    extend: 'Ext.data.Store',
    alias: 'store.SignAction',
    requires: ['OA.model.SignAction'],
    config: {
        model: 'OA.model.SignAction',
        autoLoad: true
    }
});