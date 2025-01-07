Ext.define("OA.store.Dep3Child", {
    extend: 'Ext.data.TreeStore',
    requires: ['OA.model.Dep3Tree'],
    config: {
        model: 'OA.model.Dep3Tree'
    }
});