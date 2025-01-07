/**
 * 會辦意見簽
 */

Ext.define('OA.model.wk.NotesOpinion', {
    extend: 'Ext.data.Model',
    requires: [
        'OA.common.Utils', 'OA.common.UrlMgr'
    ],
    config: {
        fields: [

            //Rest Post paras
            'sid1', 'sid2', 'hashcode', 'hashvi','dialogType', 'doSno', 'doDeptno', 'depNo', 'empNo', 'jobNo', 'roleId',
            'orgNo', 'orgId', 'genDocNo', 'version', 'paperNo', 'kind', 'dep2List', 'canSend', 'sendCnt', 'review','signText',
            {name: "files", type: "array"},
            {name: "attachs", type: "array"},
            {name: "json", type: "string"},    //mapping Odbf01VO

            //Layout Config
            {
                name: 'layout', mapping: function () {
                return [
                    //{
                    //    key: '會辦單位', wk: true, getPos: function () {
                    //        return { x: OA.common.DIMgr.getPageMargin().left, feature: 'follow_caption_block', size: 16 };
                    //}
                    //},
                    // {
                    //     key: '檔號', wk: true, getPos: function () {
                    //     return {x: OA.common.DIMgr.getPageWidth() * 0.6, feature: 'file_no'};
                    // }
                    // },
                    // {
                    //     key: '保存年限', wk: true, getPos: function () {
                    //     return {feature: 'file_year'};
                    // }
                    // },
                    {
                        key: '擬辦方式', wk: true, getPos: function () {
                            return {feature: 'todoWay'};
                        }
                    },
                    {
                        key: '輸入擬辦方式', wk: true, getPos: function () {
                            return {
                                x: OA.common.DIMgr.getPageWidth() * 0.11,
                                feature: 'input_todoWay' ,
                                size: 16
                            }; //標題後左對齊區
                        }
                    },
                    {
                        key: 'docCaption', wk: true, getPos: function () {
                        return {
                            x: OA.common.DIMgr.getPageMargin().left,
                            y: OA.common.DIMgr.getPageMargin().top * 1.2,
                            size: 26
                        };
                    }
                    },
                    {
                        key: '於', wk: true, getPos: function () {
                        return {
                            x: OA.common.DIMgr.getPageMargin().left + 55,
                            y: OA.common.DIMgr.getPageMargin().top * 1.3,
                            size: 18
                        };
                    }
                    },
                    {
                        key: '年月日', getPos: function () {
                        return {
                            x: OA.common.DIMgr.getPageWidth() * 0.7 - 40,
                            y: OA.common.DIMgr.getPageMargin().top * 1.3,
                            size: 18
                        };
                    }
                    },
                    {
                        key: '機關', getPos: function () {
                        return {
                            x: OA.common.DIMgr.getPageWidth() * 0.2,
                            size: 22,
                            y: OA.common.DIMgr.getPageMargin().top + 42,
                            feature: 'follow_caption_wrap'
                        };
                    }
                    },
                    {
                        key: 'KDRichTextBlock', getPos: function () {
                        return {
                            x: OA.common.DIMgr.getPageMargin().left, interval: '2%', size: 22,
                            feature: 'paragraph_block'
                        };
                    }
                    },
                    {
                        key: '敬陳', wk: true, getPos: function () {
                        return {
                            x: OA.common.DIMgr.getPageMargin().left,
                            size: 21,
                            interval: '2%',
                            //feature: 'follow_caption_block'
                        };
                    }
                    },
                    {
                        key: '決行層級', wk: true, getPos: function () {
                        return {interval: '1%'};
                    }
                    }
                ];
            }
            },

            //Mapping
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
                name: '擬辦方式', mapping: function (node) {
                return OA.common.Utils.getWKText(node, '擬辦方式');
            }
            },
            {
                name: 'docCaption', mapping: function (node) {
                return '便簽';
            }
            },
            {
                name: '於', mapping: function () {
                return '於';
            }
            },
            {
                name: '機關', mapping: function (node) {
                return {items: OA.common.Utils.getWKNotesItems(node, '機關', '     ')};
            }
            },
            {
                name: 'KDRichTextBlock', mapping: function (node) {
                return {items: OA.common.Utils.getKDRichTextBlock(node)};
            }
            },
            {
                name: '敬陳', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '敬陳')};
            }
            },
            {
                name: '署名', mapping: function (node) {
                return {items: OA.common.Utils.getWKNames(node, '署名')};
            }
            },
            {
                name: '稿署名', mapping: function (node) {
                return {items: OA.common.Utils.getWKNames(node, '稿署名')};
            }
            },
            {
                name: '年月日', mapping: function (node) {
                return OA.common.Utils.getYMD(node, '年月日');
            }
            },
            //{
            //    name: '會辦單位', mapping: function (node) {
            //    return {items: OA.common.Utils.getWKSeparate(node, '會辦單位')};
            //}
            //},
            {
                name: '決行層級', mapping: function (node) {
                return OA.common.Utils.getApproveLV(node);
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