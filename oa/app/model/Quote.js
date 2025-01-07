/**
 * 結案列表
 */
Ext.define('OA.model.Quote', {
    extend: 'Ext.data.Model',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [
            {name: "isEdit", type: "bool"},'doSno','addName','addTime','delName','delTime'
        ]
    }
});