Ext.define('OA.model.Phrase', {
    extend: 'Ext.data.Model',
    alias: 'model.Phrase',
    config: {
        fields: [
            'phraseId', 'sortNo', 'phraseNo', 'phrase', 'status', 'kindNo', 'phraseType', 'empNo'
        ],
        proxy: {
            type: 'ajax',
            useDefaultXhrHeader: false,
            withCredentials: true,
            cors: true,
            writer: {
                type: 'json',
                writeAllFields: true
            },
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});