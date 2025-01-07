/**
 * 機密文書機密等級變更或註銷處理意見表
 */

Ext.define('OA.model.wk.ExchangeNoticeOpinion', {
    extend: 'Ext.data.Model',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [
            //Rest Post paras
            'sid1', 'sid2', 'hashcode', 'hashvi','dialogType', 'doSno', 'doDeptno', 'depNo', 'empNo', 'jobNo', 'roleId',
            'orgNo', 'orgId', 'genDocNo', 'version', 'paperNo', 'kind', 'dep2List', 'canSend', 'sendCnt', 'review','signText',
            'actionId',
            {name: "files", type: "array"},
            {name: "attachs", type: "array"},
            {name: "json", type: "string"}, //mapping Odbf01VO

            //表格模版
            {
                name: 'templateUrl', mapping: function () {
                return 'web/ExchangeNoticeOpinion.svg';
            }
            },

            //Layout Config
            {
                name: 'layout', mapping: function () {
                return [
                    {key: '機關名稱', onlyTitle: true, feature: 'center'},
                    {key: '檔號'},
                    {key: '保存年限'},
                    {
                        key: '輸入擬辦方式', wk: true, getPos: function () {
                            return {
                                x: OA.common.DIMgr.getPageWidth() * 0.11,
                                feature: 'input_todoWay' ,
                                size: 16
                            }; //標題後左對齊區
                        }
                    },
                    { key: '決行層級' },
                    { key: '稿面註記' },
                    { key: '應用限制' },
                    { key: '擬辦方式' },
                    {key: '原機密案件日期'},
                    {key: '文號'},
                    {key: '文別'},
                    {key: '案由'},
                    {key: '受文機關'},
                    {key: '抄送副本機關'},
                    {key: '原機密等級'},
                    {key: '新機密等級或註銷'},
                    {key: '變更機密等級或理由'},
                    {key: '備考'},
                    {key: '陳核'},
                    {key: 'KDRichTextBlock'},
                ];
            }
            },
            //Mapping
            {
                name: '機關名稱', mapping: function (node) {
                return OA.common.Utils.getWKChildren(node, '機關名稱')[1];
            }
            },
            {
                name: '檔號', mapping: function (node) {
                return {items: OA.common.Utils.getFileNo(node)};
            }
            },
            {
                name: '保存年限', mapping: function (node) {
                return {items: OA.common.Utils.getWKNames(node, '保存年限')};
                }
            },
            {
                name: '輸入擬辦方式', mapping: function (node) {
                    return { items: OA.common.Utils.getWKNames(node, '輸入擬辦方式') };
                }
            },
            {
                name: '原機密案件日期', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '原機密案件日期')};
            }
            },
            {
                name: '文號', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '文號')};
            }
            },
            {
                name: '文別', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '文別')};
            }
            },
            {
                name: '案由', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '案由')};
            }
            },
            {
                name: '受文機關', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '受文機關')};
            }
            },
            {
                name: '抄送副本機關', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '抄送副本機關')};
            }
            },
            {
                name: '原機密等級', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '原機密等級')};
            }
            },
            {
                name: '新機密等級或註銷', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '新機密等級或註銷')};
            }
            },
            {
                name: '變更機密等級或理由', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '變更機密等級或理由')};
            }
            },
            {
                name: '備考', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '備考')};
            }
            },
            {
                name: '陳核', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '陳核')};
            }
            },
            {
                name: 'KDRichTextBlock', mapping: function (node) {
                return {items: OA.common.Utils.getKDRichTextBlock(node)};
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
            },
            {
                name: '稿面註記', mapping: function (node) {
                    return OA.common.Utils.getWKText(node, '稿面註記');
                }
            },
            {
                name: '應用限制', mapping: function (node) {
                    return OA.common.Utils.getWKText(node, '應用限制');
                }
            },
            {
                name: '擬辦方式', mapping: function (node) {
                    return OA.common.Utils.getWKText(node, '擬辦方式');
                }
            },
            {
                name: '決行層級', mapping: function (node) {
                    return OA.common.Utils.getApproveLV(node);
                }
            },
            {
                name: 'KDRichTextBlock', mapping: function (node) {
                    return { items: OA.common.Utils.getKDRichTextBlock(node) };
                }
            },
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