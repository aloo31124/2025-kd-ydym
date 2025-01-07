Ext.define("OA.store.Phrase", {
    extend: 'Ext.data.Store',
    alias: 'store.Phrase',
    requires: ['OA.model.Phrase'],
    config: {
        model: 'OA.model.Phrase'
    }
});