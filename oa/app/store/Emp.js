Ext.define("OA.store.Emp", {
    extend: 'Ext.data.Store',
    alias: 'store.Emp',
    requires: ['OA.model.Emp'],
    config: {
        model: 'OA.model.Emp',
        autoLoad: false,
        clearOnPageLoad: true,
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            cors: true,
            headers: {
                'Accept': 'application/json'
            },
            reader: {
                type: 'json'
            }
        }
    }
});