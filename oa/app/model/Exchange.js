/**
 * 轉交換
 */

Ext.define('OA.model.Exchange', {
    extend: 'Ext.data.Model',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [
            //Rest Post paras
            'orgId','empNo','depNo','doDeptno','doSno', 'roleId', 'version','paperNo','發文字號_字','jobNo',
            {name: "files", type: "array"},
            {name: "attachs", type: "array"},
            { name: "json", type: "string" }, //mapping Odbf01VO
            { name: "mailSendfiles", type: "array" } //mail傳遞
        ],
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            withCredentials: true,
            writer: {
                type: 'json',
                rootProperty: "input"
                //encode: true
            },
            reader: {
                type: 'json'
            }
        }
    }
});