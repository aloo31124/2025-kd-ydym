Ext.define('OA.model.Lzwzip', {
    extend: 'Ext.data.Model',
    alias: 'model.Lzwzip',
    config: {
        fields: [
            'code', 'source', 'address'
        ],
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            reader: {
                type: 'json'
            },
            writer: {
                type: 'json',
                rootProperty: "InputLzwzip"
            }
        }
    }
});