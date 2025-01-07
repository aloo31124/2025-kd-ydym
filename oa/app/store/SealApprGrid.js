Ext.define("OA.store.SealApprGrid", {
    extend: 'Ext.data.Store',
    alias: 'store.SealApprGrid',
    requires: ['OA.model.SealApprGrid'],
    config: {
        model: 'OA.model.SealApprGrid'
    }
});