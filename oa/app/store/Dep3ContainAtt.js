Ext.define("OA.store.Dep3ContainAtt", {
    extend: 'Ext.data.TreeStore',
    requires: ['OA.model.Contact'],
    config: {
        model: 'OA.model.Contact'
    }
});