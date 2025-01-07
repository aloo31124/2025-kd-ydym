Ext.define('OA.model.Print', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: "printData", type: "string"}
        ],
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            cors: true,
            reader: {
                type: 'json'
            },
            writer: {
                type: 'json'
            }
        }
    }
});