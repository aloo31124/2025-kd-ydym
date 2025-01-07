/**
 * 出席會議摘要單
 */

Ext.define('OA.model.wk.ImportantMeetingReport', {
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
            {name: "json", type: "string"}, //mapping Odbf01VO

            //Layout Config
            {
                name: 'layout', mapping: function () {
                return [
                    {
                        key: '檔號', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageWidth() * 0.6, feature: 'file_no', size: 16 };
                    }
                    },
                    {
                        key: '保存年限', wk: true, showCaption: false, getPos: function () {
                            return { feature: 'file_year', size: 16 };
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
                        key: '稿面註記', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, feature: 'draftNote', size: 15 };
                        }
                    },
                    {
                        key: '機關名稱', onlyTitle: true, getPos: function () {
                            return {size: 28, feature: 'top_center'};
                        }
                    },
                    {
                        key: '決行層級', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left,interval: '9%', feature: '', size: 16 };
                        }
                    },
                    {
                        key: '應用限制', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, feature: 'todoWay', size: 15 };
                        }
                    },
                    {
                        key: '擬辦方式', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, feature: 'todoWay', size: 15 };
                        }
                    },
                    //{
                    //    key: '校對監印發文', wk: true, getPos: function () {
                    //        return { y: 130, x: OA.common.DIMgr.getPageMargin().left, size: 14 };
                    //    }
                    //},
                    {
                        key: '參加會議人員姓名', getPos: function () {
                            return {x: OA.common.DIMgr.getPageMargin().left, interval: '4%', size: 21, feature: 'attn_block'};
                        }
                    },
                    {
                        key: '部室別', getPos: function () {
                        return {feature: 'follow_caption_block', interval: '1%', size: 21};
                    }
                    },
                    {
                        key: '會議名稱', getPos: function () {
                        return {feature: 'follow_caption_block', interval: '1%', size: 21};
                    }
                    },
                    {
                        key: '會議主辦機關', getPos: function () {
                        return {feature: 'follow_caption_block', interval: '1%', size: 21};
                    }
                    },
                    {
                        key: '會議主席', getPos: function () {
                        return {feature: 'follow_caption_block', interval: '1%', size: 21};
                    }
                    },
                    {
                        key: '開會時間', getPos: function () {
                        return {feature: 'follow_caption_block', interval: '1%', size: 21};
                    }
                    },
                    {
                        key: '開會地點', getPos: function () {
                        return {feature: 'follow_caption_block',interval: '1%', size: 21};
                    }
                    },
                    {
                        key: 'KDRichTextBlock', getPos: function () {
                        return {
                            x: OA.common.DIMgr.getPageMargin().left, size: 22,
                            feature: 'paragraph_block'
                        };
                    }
                    },                  
                    {
                        key: '署名', getPos: function () {
                            return { size: 27 };
                    }
                    },
                    {
                        key: '分層負責', wk: true, getPos: function () {
                            return { size: 19, interval: '7%' };
                            //return { size: 19 };
                    }
                    },
                    {
                        key: '會辦單位', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, feature: 'follow_caption_block', interval: '3%', size: 16 };
                        }
                    },
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
                name: '機關名稱', mapping: function (node) {
                    var title = '  出席會議摘要單';
                    var name = OA.common.Utils.getWKChildren(node, '機關名稱')[1];
                    return (name.indexOf(title) < 0) ? name + title : name;
                }
            },
            {
                name: '校對監印發文', mapping: function () {
                return '';
            }
            },
            {
                name: '決行層級', mapping: function (node) {
                    return OA.common.Utils.getApproveLV(node);
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
                name: '參加會議人員姓名', mapping: function (node) {
                    return {items: OA.common.Utils.getWKChildren(node, '參加會議人員姓名')};
                }
            },
            {
                name: '部室別', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '部室別')};
            }
            },
            {
                name: '會議名稱', mapping: function (node) {
                return {items: OA.common.Utils.getWKChildren(node, '會議名稱')};
            }
            },
            {
                name: '會議主辦機關', mapping: function (node) {
                    return {items: OA.common.Utils.getWKChildren(node, '會議主辦機關')};
                }
            },
            {
                name: '會議主席', mapping: function (node) {
                return {items: OA.common.Utils.getWKSeparate(node, '會議主席')};
            }
            },
            {
                name: '開會時間', mapping: function (node) {
                    return {items: OA.common.Utils.getYMD2(node, '開會時間')};
                }
            },
            {
                name: '開會地點', mapping: function (node) {
                    return {items: OA.common.Utils.getWKChildren(node, '開會地點')};
                }
            },
            {
                name: 'KDRichTextBlock', mapping: function (node) {
                return {items: OA.common.Utils.getKDRichTextBlock(node)};
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
                name: '分層負責', mapping: function (node) {
                return OA.common.Utils.getStratify(node);
            }
            },
            {name: '會辦單位', mapping: function (node) {
                    return {items: OA.common.Utils.getWKSeparate(node, '會辦單位')};
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