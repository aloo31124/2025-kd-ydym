/**
 * 結案
 */

Ext.define('OA.model.Cip', {
    extend: 'Ext.data.Model',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [
            'doSno','doDeptno','jobNo','abstractMain'
        ],
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            reader: {
                type: 'json',
                rootProperty: "children"
            }
        }
    }
});