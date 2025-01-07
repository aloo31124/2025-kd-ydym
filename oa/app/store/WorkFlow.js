Ext.define("OA.store.WorkFlow", {
    extend: 'Ext.data.Store',
    alias: 'store.WorkFlow',
    requires: ['OA.model.WorkFlow'],
    config: {
        model: 'OA.model.WorkFlow'
    }
});