Ext.define("OA.store.Dep3Tree", {
    extend: 'Ext.data.TreeStore',
    requires: ['OA.model.Dep3Tree'],
    config: {
        model: 'OA.model.Dep3Tree'
    }
});