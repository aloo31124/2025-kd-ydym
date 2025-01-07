Ext.define("OA.store.DeptList", {
    extend: 'Ext.data.Store',
    alias: 'store.DeptList',
    requires: ['OA.model.DeptTree'],
    config: {
        model: 'OA.model.DeptTree'
    }
});