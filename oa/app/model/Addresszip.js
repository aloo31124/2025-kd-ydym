Ext.define('OA.model.Addresszip', {
    extend: 'Ext.data.Model',
    alias: 'model.Addresszip',
    config: {
        fields: [
            'zipCode', 'zipCodeName'
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
            }
        }
    }
});