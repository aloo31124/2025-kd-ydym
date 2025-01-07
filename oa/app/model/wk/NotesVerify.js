/**
 * 會辦單
 */

Ext.define('OA.model.wk.NotesVerify', {
    extend: 'Ext.data.Model',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [
            //Rest Post paras
            'sid1', 'sid2', 'hashcode', 'hashvi','dialogType', 'doSno', 'doDeptno', 'depNo', 'empNo', 'jobNo', 'roleId',
            'orgNo', 'orgId', 'genDocNo', 'version', 'paperNo', 'kind', 'dep2List', 'canSend','sendCnt', 'review','signText',
            { name: "files", type: "array" },
            { name: "attachs", type: "array" },
            { name: "json", type: "string" }, //mapping Odbf01VO

            //表格模版
            {
                name: 'templateUrl', mapping: function () {
                    return 'web/NotesVerify.svg';
                }
            },

            //Layout Config
            {
                name: 'layout', mapping: function () {
                    return [
                        { key: '承辦機關' },
                        { key: '承辦人' },
                        { key: '會辦機關' }
                    ];
                }
            },
            //Mapping
            // {
            //     name: '機關名稱', mapping: function (node) {
            //         return OA.common.Utils.getWKChildren(node);
            //     }
            // },
            // {
            //     name: '檔號', mapping: function (node) {
            //         return { items: OA.common.Utils.getFileNo(node) };
            //     }
            // },
            // {
            //     name: '保存年限', mapping: function (node) {
            //         return { items: OA.common.Utils.getWKNames(node, '保存年限') };
            //     }
            // },
            // {
            //     name: '主辦單位', mapping: function (node) {
            //         return { items: OA.common.Utils.getWKChildren(node, '主辦單位') };
            //     }
            // },
            // {
            //     name: '主辦機關', mapping: function (node) {
            //         return { items: OA.common.Utils.getWKChildren(node, '主辦機關') };
            //     }
            // },
            {
                name: '會辦機關', mapping: function (node) {
                    return {items: OA.common.Utils.getWKSeparate(node, '會辦機關')};
                }
            },
            {
                name: '承辦機關', mapping: function (node) {
                    return {items: OA.common.Utils.getWKSeparate(node, '承辦機關')};
                }
            },
            {
                name: '承辦人', mapping: function (node) {
                    return {items: OA.common.Utils.getWKSeparate(node, '承辦人')};
                }
            },
            {
                name: 'StickyNote', mapping: function (node) {
                    return OA.common.Utils.getWKStickyNote(node);
                }
            },
            {
                name: 'Sealinfo', mapping: function (node) {
                    return OA.common.Utils.getWKSealNote(node);
                }
            },
            {
                name: 'Extend', mapping: function (node) {
                    return OA.common.Utils.getExtendData(node); // apply to ViewModel
                }
            }
        ],
        proxy: {
            type: 'ajax',
            useDefaultXhrHeader: false,
            withCredentials: true,
            cors: true,
            writer: {
                type: 'json',
                writeAllFields: true // 保證所有字段都會被序列化
            },
            reader: {
                type: 'json',
                rootProperty: 'data' // 指定根屬性以便自動解析 data
            }
        }
    }
});