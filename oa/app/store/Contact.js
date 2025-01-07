Ext.define("OA.store.Contact", {
    extend: 'Ext.data.Store',
    alias: 'store.Contact',
    requires: ['OA.model.Contact'],
    config: {
        model: 'OA.model.Contact',
        autoSync:true
        //autoDestroy: true,
        //syncRemovedRecords: false
        //destroyRemovedRecords: false
    }
});