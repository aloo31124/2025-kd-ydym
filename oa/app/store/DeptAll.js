Ext.define("OA.store.DeptAll", {
    extend: 'Ext.data.Store',
    alias: 'store.DeptAll',
    requires: ['OA.model.DeptTree'],
    config: {
        model: 'OA.model.DeptTree'
    }
});