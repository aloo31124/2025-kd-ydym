Ext.define('OA.model.Odaf03Dtl', {
    extend: 'Ext.data.Model',
    alias: 'model.Odaf03Dtl',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [
            //Rest Post paras
            'empNo','jsonArrayString'
        ],
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            reader: {
                type: 'json'
                , rootProperty: 'Input'
            },
            writer: {
                type: 'json',
                rootProperty: "Input"
                //encode: true
            }
        }
    }

});