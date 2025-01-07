Ext.define("OA.store.Dep3List", {
    extend: 'Ext.data.Store',
    alias: 'store.Dep3List',
    requires: ['OA.model.Dep3Tree'],
    config: {
        model: 'OA.model.Dep3Tree'
    }
});