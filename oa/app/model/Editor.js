Ext.define('OA.model.Editor', {
    extend: 'Ext.data.Model',
    alias: 'model.Editor',
    config: {
        fields: [
            'empNo', 'depNo', 'doSno', 'gbDocflowId', 'dialogType', 'jobNo', 'roleId', 'doDeptno', 'mainSno','projNo'
        ],
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            reader: {
                type: 'json',
                rootProperty: "InputEditor"
            },
            writer: {
                type: 'json',
                rootProperty: "InputEditor"
                //encode: true
            }
        }
    }
});