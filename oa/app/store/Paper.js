Ext.define("OA.store.Paper", {
    extend: 'Ext.data.Store',
    alias: 'store.Paper',
    requires: ['OA.model.Paper'],
    config: {
        model: 'OA.model.Paper'
    }
});