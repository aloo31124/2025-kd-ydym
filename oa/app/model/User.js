Ext.define('OA.model.User', {
    extend: 'Ext.data.Model',
    alias: 'model.User',
    config: {
        fields: [
            {name: "username", type: "string"},
            {name: "password", type: "string"}

            //key: 'key1',
            //device: {
            //    os: 'iOS',
            //    browser: 'Chrome',
            //    deviceType: 'Tablet',
            //    engineName: 'WebKit',
            //    engineVersion: '537.36'
            //}
        ],
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            reader: {
                type: 'json',
                rootProperty: "User"
            },
            writer: {
                type: 'json',
                rootProperty: "User"
                //encode: true
            }
        }
    }
});