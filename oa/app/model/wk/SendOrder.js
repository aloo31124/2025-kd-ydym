/**
 * 受文者令
 */

Ext.define('OA.model.wk.SendOrder', {
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

            //Layout Config
            {
                name: 'layout', mapping: function () {
                return [
                    {
                        key: '檔號',wk:true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageWidth() * 0.6, feature: 'file_no', size: 16 };
                    }
                    },
                    {
                        key: '保存年限',wk:true, getPos: function () {
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
                        key: '發文機關', getPos: function () {
                            return {size: 28, feature: 'top_center'}; //置頂居中
                        }
                    },
                    {
                        key: '承辦單位', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left,feature: 'follow_align_block', size: 15 };
                        }
                    },
                    {
                        key: '決行層級', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, feature: '', size: 16 };
                        }
                    },
                    {
                        key: '稿面註記', wk: true, getPos: function () {
                        return {feature: 'draftNote', size: 14};
                        }
                    },
                    {
                        key: '應用限制', wk: true, getPos: function () {
                            return { feature: 'todoWay' };
                        }
                    },
                    {
                        key: '擬辦方式', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, feature: 'todoWay', size: 15};
                        }
                    },
                    // {
                    //     key: '校對監印發文', wk: true, getPos: function () {
                    //         return { y: 120, x: OA.common.DIMgr.getPageMargin().left, size: 14 };
                    // }
                    // },
                    {
                        key: '受文者郵遞區號', wk: true,getPos: function () {
                            return {
                                y: OA.common.DIMgr.getPageMargin().top + 125,
                                x: OA.common.DIMgr.getPageMargin().left,
                                //interval: '1%',
                                size: 16
                            };
                        }
                    },
                    {
                        key: '受文者地址', wk: true,getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, interval: '1%', size: 16 , feature: 'addr'};
                        }
                    },
                    {
                        key: '受文者', getPos: function () {
                        return {x: OA.common.DIMgr.getPageMargin().left, size: 21, feature: 'attn_block'};
                    }
                    },
                    {
                        key: '發文日期', getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, interval: '1%', feature: 'follow_align_block', size: 16 };
                    }
                    },
                    {
                        key: '發文字號', getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, feature: 'follow_align_block', size: 16 }; //標題後左對齊區
                    }
                    },
                    {
                        key: '附件', getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, feature: 'follow_caption_block', size: 16 };
                        }
                    },
                    {
                        key: 'KDRichTextBlock', getPos: function () {
                            return {
                                x: OA.common.DIMgr.getPageMargin().left, size: 22,interval: '23%',
                                feature: 'paragraph_block'
                            };
                        }
                    },
                    {
                        key: '正本', getPos: function () {
                        return { interval: '1.5%', feature: 'follow_caption_block' };
                    }
                    },
                    {
                        key: '副本', getPos: function () {
                        return { feature: 'follow_caption_block' };
                    }
                    },
                    {
                        key: '抄本',  wk: true,getPos: function () {
                        return { feature: 'follow_caption_block' };
                    }
                    },
                    {
                        key: '署名', getPos: function () {
                            return { size: 27};
                    }
                    },
                    {
                        key: '會辦單位', wk: true, getPos: function () {
                            return { x: OA.common.DIMgr.getPageMargin().left, feature: 'follow_caption_block', interval: '3%', size: 16 };
                        }
                    },
                    {
                        key: '分層負責', wk: true, getPos: function () {
                            //return { size: 19, interval: '7%' };
                            return { size: 19 };
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
                name: '承辦單位', mapping: function (node) {
                    return { items: OA.common.Utils.getWKNames(node, '承辦單位') };
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
                name: '發文機關', mapping: function (node) {
                return OA.common.Utils.getWKCaption(node, '發文機關');
            }
            },
            {
                name: '校對監印發文', mapping: function () {
                return '';
            }
            },
            {
                name: '受文者郵遞區號', mapping: function () {
                    return '';
                }
            },
            {
                name: '受文者地址', mapping: function () {
                    return '';
                }
            },
            {
                name: '受文者', mapping: function (node) {
                return {items: OA.common.Utils.getWKTextItems(node, '受文者',null,'{0}')};
            }
            },
            {
                name: '發文日期', mapping: function (node) {
                return {items: OA.common.Utils.getWKNames(node, '發文日期')};
            }
            },
            {
                name: '發文字號', mapping: function (node) {
                return  {items:OA.common.Utils.getDoSno(node)};
            }
            },
            {
                name: '附件', mapping: function (node) {
                    return { items: OA.common.Utils.getWKSeparate(node, '附件') };
                }
            },
            {
                name: 'KDRichTextBlock', mapping: function (node) {
                return {items: OA.common.Utils.getKDRichTextBlock(node)};
            }
            },
            {
                name: '正本', mapping: function (node) {
                return { items: OA.common.Utils.getWKSeparate(node, '正本') };
            }
            },
            {
                name: '副本', mapping: function (node) {
                return { items: OA.common.Utils.getWKSeparate(node, '副本') };
            }
            },
            {
                name: '抄本', mapping: function (node) {
                return { items: OA.common.Utils.getWKSeparate(node, '抄本') };
            }
            },
            {
                name: '署名', mapping: function (node) {
                return { items: OA.common.Utils.getWKNames(node, '署名') };
            }
            },
            {
                name: '稿署名', mapping: function (node) {
                return { items: OA.common.Utils.getWKNames(node, '稿署名') };
            }
            },
            {
                name: '會辦單位', mapping: function (node) {
                return {items: OA.common.Utils.getWKSeparate(node, '會辦單位')};
            }
            },
            {
                name: '決行層級', mapping: function (node) {
                return  OA.common.Utils.getApproveLV(node);
            }
            },
            {
                name: '分層負責', mapping: function (node) {
                    return OA.common.Utils.getStratify(node);
                }
            },
            {name: 'StickyNote', mapping: function (node) {
                return OA.common.Utils.getWKStickyNote(node);
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