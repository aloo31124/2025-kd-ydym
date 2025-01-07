Ext.define('OA.model.Memcahce', {
    extend: 'Ext.data.Model',
    alias: 'model.Memcahce',
    config: {
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            reader: {
                type: 'json',
                rootProperty: "Memcahce"
            }
        }
    }
});