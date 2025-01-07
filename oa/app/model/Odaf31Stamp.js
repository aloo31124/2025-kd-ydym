Ext.define('OA.model.Odaf31Stamp', {
    extend: 'Ext.data.Model',
    alias: 'model.Odaf31Stamp',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [
            //Rest Post paras
            'depNo'
        ],
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            reader: {
                type: 'json'
                , rootProperty: 'input'
            },
            writer: {
                type: 'json',
                rootProperty: "input"
                //encode: true
            }
        }
    }

});