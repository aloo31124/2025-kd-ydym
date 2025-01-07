/**
 * DI / WK 管理器
 */

Ext.define('OA.common.DIMgr', {
    alias: 'common.DIMgr',
    singleton: true,
    requires: ['OA.common.UrlMgr', 'OA.model.seal.*'],
    FORMATS: {
        Letter: '函',
        BookLetter: '書函',
        Meeting: '開會通知單',
        Notes: '簽',
        NoteSticky: '便簽',
        Publish: '公告',
        Order: '令',
        Notice: '公示送達',
        SurveyNotice: '會勘通知單',
        ProposalLetter: '獎懲建議函',
        AssignedNotice: '交辦案件通知單',
        IssuesNotice: '交議案件通知單',
        RemindersNotice: '催辦案件通知單',
        MoveNotice: '移文單',
        ProposalNotice: '機密文書機密等級變更或註銷建議單',
        ExchangeNotice: '機密文書機密等級變更或註銷通知單',
        ProposalNoticeRecord: '機密文書機密等級變更或註銷紀錄單',
        ExchangeNoticeOpinion: '機密文書機密等級變更或註銷處理意見表',
        TribunalBook: '行政裁處書',
        FactionLetter: '派免建議函',
        NotesVerify: '會辦單',
        Other: '其他',
        properties: {} // by KangDaAppConfig().FORMATS
    },
    TEMPLATE: {
        Header: {
            檔號: {
                "BeginX": 380,
                "Index": 0,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": '',
                        "Key": "年度",
                        "tagName": "Property"
                    },
                    {
                        "Value": '',
                        "Key": "分類號",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "案次號",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "目次號",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "檔號",
                "LineHeight": 2,
                "Title": "檔　　號："
            },
            輸入擬辦方式: {
                "BeginX": 0,
                "Index": 1,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": '(輸入擬辦方式)', // 預設值
                        "Key": "輸入擬辦方式",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 22,
                "Alignment": "Left",
                "TagCaption": "輸入擬辦方式",
                "LineHeight": 2,
                "Title": " " // 欄位名稱空白
            },

            保存年限: {
                "BeginX": 380,
                "Index": 1,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": '',
                        "Key": "保存年限",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "保存年限",
                "LineHeight": 2,
                "Title": "保存年限："
            },
            稿面註記: {
                "BeginX": 0,
                "Index": 2,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "稿面註記",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "稿面註記",
                "LineHeight": 5,
                "Title": ""
            },
            應用限制: {
                "BeginX": 0,
                "Index": 2,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "應用限制",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "應用限制",
                "LineHeight": 5,
                "Title": ""
            },
            擬辦方式: {
                "BeginX": 0,
                "Index": 2,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "擬辦方式",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "擬辦方式",
                "LineHeight": 5,
                "Title": ""
            },
            處理級別: {
                "BeginX": 0,
                "Index": 2,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "處理級別",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "處理級別",
                "LineHeight": 5,
                "Title": ""
            },
            發文機關: {
                "BeginX": 0,
                "Index": 3,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "發文層級",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 26,
                "Alignment": "Center",
                "TagCaption": "發文機關",
                "LineHeight": 15,
                "Title": ""
            },
            地址: {
                "BeginX": 330,
                "Index": 5,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "地址",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "辦公地址",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "地址",
                "LineHeight": 0,
                "Title": "地址："
            },
            聯絡方式: {
                "BeginX": 330,
                "Index": 6,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "承辦人",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "電話",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "傳真",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "電子信箱",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "聯絡方式",
                "LineHeight": 0,
                "Title": ""
            },
            受文者: {
                "BeginX": 0,
                "Index": 10,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "受文者",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 22,
                "Alignment": "Left",
                "TagCaption": "受文者",
                "LineHeight": 10,
                "Title": "受文者："
            },
            發文日期: {
                "BeginX": 0,
                "Index": 11,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "發文日期",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "發文日期",
                "LineHeight": 0,
                "Title": "發文日期："
            },
            發文字號: {
                "BeginX": 0,
                "Index": 12,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "發文字號_字",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "發文字號_年度",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "發文字號_流水號",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "發文字號_支號",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "發文字號",
                "LineHeight": 0,
                "Title": "發文字號："
            },
            速別: {
                "BeginX": 0,
                "Index": 15,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "普通件",
                        "Key": "速別",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "速別",
                "LineHeight": 0,
                "Title": "速別："
            },
            密等及解密條件或保密期限: {
                "BeginX": 0,
                "Index": 16,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "密等",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "解密條件或保密期限",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "密等及解密條件或保密期限",
                "LineHeight": 0,
                "Title": "密等及解密條件或保密期限："
            },
            附件: {
                "BeginX": 0,
                "Index": 17,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "附件",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "附件",
                "LineHeight": 0,
                "Title": "附件："
            },
            承辦單位: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "承辦單位",
                "Title": "承辦單位：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "承辦單位",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },


            年月日: {  //簽
                "Alignment": "Left",
                "BeginX": 55,
                "FontSize": 18,
                "Index": 3,
                "LineHeight": 0,
                "TagCaption": "年月日",
                "Title": "",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "年月日",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            機關: {
                "Alignment": "Left",
                "BeginX": 55,
                "FontSize": 18,
                "Index": 4,
                "LineHeight": 0,
                "TagCaption": "機關",
                "Title": "",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            註記: {
                "Alignment": "Left",
                "BeginX": 55,
                "FontSize": 18,
                "Index": 4,
                "LineHeight": 0,
                "TagCaption": "註記",
                "Title": "",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "註記",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            結尾自稱語: {
                "Alignment": "Left",
                "BeginX": 55,
                "FontSize": 18,
                "Index": 4,
                "LineHeight": 0,
                "TagCaption": "結尾自稱語",
                "Title": "",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            //上行簽
            敬會: {
                "Alignment": "Left",
                "BeginX": 55,
                "FontSize": 18,
                "Index": 4,
                "LineHeight": 0,
                "TagCaption": "敬會",
                "Title": "敬會",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "敬會",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },

            開會事由: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "開會事由",
                "Title": "開會事由：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "開會事由",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            開會時間: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "開會時間",
                "Title": "開會時間：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "年月日",
                        "Value": "",
                        "tagName": "Property"
                    },
                    {
                        "Key": "星期",
                        "Value": "",
                        "tagName": "Property"
                    },
                    {
                        "Key": "時分",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            開會地點: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "開會地點",
                "Title": "開會地點：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "開會地點",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            聯絡人及電話: {
                "Alignment": "Left",
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "聯絡人及電話",
                "Title": "聯絡人及電話：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "姓名",
                        "Value": "",
                        "tagName": "Property"
                    },
                    {
                        "Key": "職稱",
                        "Value": "",
                        "tagName": "Property"
                    },
                    {
                        "Key": "電話",
                        "Value": "",
                        "tagName": "Property"
                    }
                ]
            },

            會勘事由: {
                "BeginX": 0,
                "FontSize": 22,
                "Index": 10,
                "LineHeight": 5,
                "TagCaption": "會勘事由",
                "Title": "會勘事由：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "會勘事由",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            會勘時間: {
                "BeginX": 0,
                "FontSize": 22,
                "Index": 10,
                "LineHeight": 5,
                "TagCaption": "會勘時間",
                "Title": "會勘時間：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "年月日",
                        "Value": "",
                        "tagName": "Property"
                    },
                    {
                        "Key": "星期",
                        "Value": "",
                        "tagName": "Property"
                    },
                    {
                        "Key": "時分",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            會勘地點: {
                "BeginX": 0,
                "FontSize": 22,
                "Index": 10,
                "LineHeight": 5,
                "TagCaption": "會勘地點",
                "Title": "會勘地點：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "會勘地點",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            聯絡單位: {
                "BeginX": 0,
                "FontSize": 22,
                "Index": 10,
                "LineHeight": 5,
                "TagCaption": "聯絡單位",
                "Title": "聯絡單位：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "聯絡單位",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            主持人: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "主持人",
                "Title": "主持人：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [],
                "Alignment": "Left"
            },
            出席者: {
                "BeginX": 0,
                "FontSize": 16,
                "Index": 10,
                "LineHeight": 0,
                "TagCaption": "出席者",
                "Title": "出席者：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [],
                "Alignment": "Left"
            },
            列席者: {
                "BeginX": 0,
                "FontSize": 16,
                "Index": 10,
                "LineHeight": 0,
                "TagCaption": "列席者",
                "Title": "列席者：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [],
                "Alignment": "Left"
            },

            機關單位: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "機關單位",
                "Title": "機關單位：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "機關單位",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            //簽稿會核單
            機關名稱: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "機關名稱",
                "Title": "機關名稱",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "機關名稱",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            案情摘要: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "案情摘要",
                "Title": "案情摘要：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "案情摘要",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            主辦單位: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "主辦單位",
                "Title": "主辦單位：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "主辦單位",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            總收文號: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "總收文號",
                "Title": "總收文號：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "總收文號",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            受會單位: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "受會單位",
                "Title": "受會單位：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "受會單位",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            主辦機關: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "主辦機關",
                "Title": "主辦機關：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "主辦機關",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            //任免、遷調、核薪通知書
            核薪副本: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "核薪副本",
                "Title": "核薪副本：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "核薪副本",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            核薪發文字號: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "核薪發文字號",
                "Title": "核薪發文字號：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "核薪發文字號",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            姓名1: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "姓名1",
                "Title": "姓名1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "姓名1",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            身分證字號1: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "身分證字號1",
                "Title": "身分證字號1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "身分證字號1",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任服務單位1: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任服務單位1",
                "Title": "原任服務單位1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任服務單位1",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任職稱1: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任職稱1",
                "Title": "原任職稱1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任職稱1",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            異動類別1: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "異動類別1",
                "Title": "異動類別1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "異動類別1",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任服務單位1: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任服務單位1",
                "Title": "新任服務單位1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任服務單位1",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任職稱1: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任職稱1",
                "Title": "新任職稱1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任職稱1",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            暫實支俸級1: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "暫實支俸級1",
                "Title": "暫實支俸級1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "暫實支俸級1",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            生效日期1: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "生效日期1",
                "Title": "生效日期1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "生效日期1",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            姓名2: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "姓名2",
                "Title": "姓名2：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "姓名2",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            身分證字號2: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "身分證字號2",
                "Title": "身分證字號2：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "身分證字號2",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任服務單位2: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任服務單位2",
                "Title": "原任服務單位2：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任服務單位2",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任職稱2: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任職稱2",
                "Title": "原任職稱2：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任職稱2",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            異動類別2: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "異動類別2",
                "Title": "異動類別2：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "異動類別2",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任服務單位2: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任服務單位2",
                "Title": "新任服務單位2：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任服務單位2",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任職稱2: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任職稱2",
                "Title": "新任職稱2：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任職稱2",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            暫實支俸級2: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "暫實支俸級2",
                "Title": "暫實支俸級2：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "暫實支俸級2",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            生效日期2: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "生效日期2",
                "Title": "生效日期2：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "生效日期2",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            姓名3: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "姓名3",
                "Title": "姓名3：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "姓名3",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            身分證字號3: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "身分證字號3",
                "Title": "身分證字號3：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "身分證字號3",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任服務單位3: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任服務單位3",
                "Title": "原任服務單位3：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任服務單位3",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任職稱3: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任職稱3",
                "Title": "原任職稱3：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任職稱3",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            異動類別3: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "異動類別3",
                "Title": "異動類別3：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "異動類別3",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任服務單位3: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任服務單位3",
                "Title": "新任服務單位3：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任服務單位3",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任職稱3: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任職稱3",
                "Title": "新任職稱3：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任職稱3",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            暫實支俸級3: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "暫實支俸級3",
                "Title": "暫實支俸級3：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "暫實支俸級3",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            生效日期3: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "生效日期3",
                "Title": "生效日期3：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "生效日期3",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            姓名4: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "姓名4",
                "Title": "姓名4：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "姓名4",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            身分證字號4: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "身分證字號4",
                "Title": "身分證字號4：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "身分證字號4",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任服務單位4: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任服務單位4",
                "Title": "原任服務單位4：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任服務單位4",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任職稱4: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任職稱4",
                "Title": "原任職稱4：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任職稱4",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            異動類別4: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "異動類別4",
                "Title": "異動類別4：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "異動類別4",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任服務單位4: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任服務單位4",
                "Title": "新任服務單位4：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任服務單位4",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任職稱4: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任職稱4",
                "Title": "新任職稱4：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任職稱4",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            暫實支俸級4: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "暫實支俸級4",
                "Title": "暫實支俸級4：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "暫實支俸級4",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            生效日期4: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "生效日期4",
                "Title": "生效日期4：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "生效日期4",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            姓名5: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "姓名5",
                "Title": "姓名5：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "姓名5",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            身分證字號5: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "身分證字號5",
                "Title": "身分證字號5：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "身分證字號5",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任服務單位5: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任服務單位5",
                "Title": "原任服務單位1：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任服務單位5",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原任職稱5: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原任職稱5",
                "Title": "原任職稱5：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原任職稱5",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            異動類別5: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "異動類別5",
                "Title": "異動類別5：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "異動類別5",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任服務單位5: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任服務單位5",
                "Title": "新任服務單位5：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任服務單位5",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新任職稱5: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新任職稱5",
                "Title": "新任職稱5：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新任職稱5",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            暫實支俸級5: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "暫實支俸級5",
                "Title": "暫實支俸級5：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "暫實支俸級5",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            生效日期5: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "生效日期5",
                "Title": "生效日期5：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "生效日期5",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            //出席會議摘要單
            部室別: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "部室別",
                "Title": "部(室)別：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "部室別",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            會議名稱: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "會議名稱",
                "Title": "會議名稱：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "會議名稱",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            會議主辦機關: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "會議主辦機關",
                "Title": "會議主辦機關：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "會議主辦機關",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            // 地點: {
            //     "BeginX": 0,
            //     "FontSize": 21,
            //     "Index": 10,
            //     "LineHeight": 2,
            //     "TagCaption": "地點",
            //     "Title": "地點：",
            //     "VisibleState": "Visible",
            //     "tagName": "Text",
            //     "childNodes": [
            //         {
            //             "Key": "地點",
            //             "Value": "",
            //             "tagName": "Property"
            //         }
            //     ],
            //     "Alignment": "Left"
            // },
            出列席機關人員: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "出列席機關人員",
                "Title": "出(列)席機關人員：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [],
                "Alignment": "Left"
            },


            //林務局各單位參加處(所)外會議請示單
            參加會議人員姓名: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "參加會議人員姓名",
                "Title": "參加會議人員姓名：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "參加會議人員姓名",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            會議主席: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "會議主席",
                "Title": "會議主席：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "會議主席",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            //電子信箱回覆函
            聯絡人: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "聯絡人",
                "Title": "聯絡人：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "聯絡人",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            電話: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "電話",
                "Title": "電話：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "電話",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            協調事項: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "協調事項",
                "Title": "協調事項：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "協調事項",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            通話內容: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "通話內容",
                "Title": "通話內容：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "通話內容",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            發話人單位: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "發話人單位",
                "Title": "發話人單位：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "發話人單位",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            發話人職稱: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "發話人職稱",
                "Title": "發話人職稱：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "發話人職稱",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            發話人姓名: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "發話人姓名",
                "Title": "發話人姓名：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "發話人姓名",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            受話人單位: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "受話人單位",
                "Title": "受話人單位",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "受話人單位",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            受話人職稱: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "受話人職稱",
                "Title": "受話人職稱：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "受話人職稱",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            受話人姓名: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "受話人姓名",
                "Title": "受話人姓名：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "受話人姓名",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            通話時間: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "通話時間",
                "Title": "通話時間：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    //{
                    //    "Key": "通話時間",
                    //    "Value": "",
                    //    "tagName": "Property"
                    //}
                    {
                        "Key": "年月日",
                        "Value": "",
                        "tagName": "Property"
                    },
                    {
                        "Key": "時分",
                        "Value": "",
                        "tagName": "Property"
                    },
                    {
                        "Key": "年月日止",
                        "Value": "",
                        "tagName": "Property"
                    },
                    {
                        "Key": "時分止",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            備註: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "備註",
                "Title": "備註：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "備註",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            //機密文書
            通知機關: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "通知機關",
                "Title": "通知機關：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "通知機關",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            通知機關發文日期: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "通知機關發文日期",
                "Title": "通知機關發文日期：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "通知機關發文日期",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            通知機關發文字號: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "通知機關發文字號",
                "Title": "通知機關發文字號：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "通知機關發文字號",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原機密案件發文日期: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原機密案件發文日期",
                "Title": "原機密案件發文日期：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原機密案件發文日期",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原機密案件發文字號: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原機密案件發文字號",
                "Title": "原機密案件發文字號：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原機密案件發文字號",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新等級或註銷: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新等級或註銷",
                "Title": "新等級或註銷：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新等級或註銷",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原機密案件日期: {
                "Alignment": "Left",
                "BeginX": 55,
                "FontSize": 18,
                "Index": 3,
                "LineHeight": 0,
                "TagCaption": "原機密案件日期",
                "Title": "",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "原機密案件日期",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            文號: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "文號",
                "Title": "文號：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "文號",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            文別: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "文別",
                "Title": "文別：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "文別",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            機關名稱: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "機關名稱",
                "Title": "機關名稱",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "機關名稱",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            案由: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "案由",
                "Title": "案由：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "案由",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            受文機關: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "受文機關",
                "Title": "受文機關：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "受文機關",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            抄送副本機關: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "抄送副本機關",
                "Title": "抄送副本機關：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "抄送副本機關",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            原機密等級: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "原機密等級",
                "Title": "原機密等級：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "原機密等級",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            新機密等級或註銷: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "新機密等級或註銷",
                "Title": "新機密等級或註銷：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "新機密等級或註銷",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            變更機密等級或理由: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "變更機密等級或理由",
                "Title": "變更機密等級或理由：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "變更機密等級或理由",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            備考: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "備考",
                "Title": "備考：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "備考",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            陳核: {
                "BeginX": 0,
                "FontSize": 21,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "陳核",
                "Title": "陳核：",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "陳核",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },

            //--ReplyContact--//
            機關地址: {
                "BeginX": 0,
                "Index": 15,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "臺北市湖口街1號",
                        "Key": "機關地址",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "機關地址",
                "LineHeight": 0,
                "Title": "機關地址："
            },
            發文單位: {
                "BeginX": 0,
                "Index": 15,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "貿易服務組",
                        "Key": "發文單位",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "發文單位",
                "LineHeight": 0,
                "Title": "發文單位："
            },
            聯絡人: {
                "BeginX": 0,
                "Index": 15,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "O副組長OO",
                        "Key": "聯絡人",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "聯絡人",
                "LineHeight": 0,
                "Title": "聯絡人："
            },
            電話1: {
                "BeginX": 0,
                "Index": 15,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "(02)23977343",
                        "Key": "電話1",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "電話1",
                "LineHeight": 0,
                "Title": "電話1："
            },
            傳真: {
                "BeginX": 0,
                "Index": 15,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "(02)23970522",
                        "Key": "傳真",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "傳真",
                "LineHeight": 0,
                "Title": "傳真："
            },
            承辦人: {
                "BeginX": 0,
                "Index": 15,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "王大明",
                        "Key": "承辦人",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "承辦人",
                "LineHeight": 0,
                "Title": "承辦人："
            },
            電話2: {
                "BeginX": 0,
                "Index": 15,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "(02)23977123",
                        "Key": "電話2",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "電話2",
                "LineHeight": 0,
                "Title": "電話2："
            }
        },
        Footer: {
            正本: {
                "BeginX": 0,
                "Index": 0,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "全銜",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "正本",
                "LineHeight": 0,
                "Title": "正本："
            },
            副本: {
                "BeginX": 0,
                "Index": 1,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "全銜",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "副本",
                "LineHeight": 0,
                "Title": "副本："
            },
            抄本: {
                "BeginX": 0,
                "Index": 2,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "全銜",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "抄本",
                "LineHeight": 0,
                "Title": "抄本："
            },
            署名: {
                "BeginX": 0,
                "Index": 3,
                "VisibleState": "Collapsed",
                "tagName": "Text",
                "childNodes": [],
                "FontSize": 21,
                "Alignment": "Left",
                "TagCaption": "署名",
                "LineHeight": 10,
                "Title": ""
            },
            稿署名: {
                "BeginX": 0,
                "Index": 4,
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [],
                "FontSize": 21,
                "Alignment": "Left",
                "TagCaption": "稿署名",
                "LineHeight": 10,
                "Title": ""
            },
            會辦單位: {
                "BeginX": 0,
                "Index": 6,
                "VisibleState": "Collapsed",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": "",
                        "Key": "會辦單位",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "會辦單位",
                "LineHeight": 5,
                "Title": "會辦單位："
            },
            決行層級: {
                "BeginX": 0,
                "Index": 7,
                "VisibleState": "Collapsed",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Value": -1,
                        "Key": "決行層級",
                        "tagName": "Property"
                    },
                    {
                        "Value": "",
                        "Key": "分層負責",
                        "tagName": "Property"
                    }
                ],
                "FontSize": 16,
                "Alignment": "Left",
                "TagCaption": "決行層級",
                "LineHeight": 5,
                "Title": ""
            },
            末啟詞: {
                "BeginX": 0,
                "FontSize": 22,
                "Index": 10,
                "LineHeight": 2,
                "TagCaption": "末啟詞",
                "Title": "",
                "VisibleState": "Visible",
                "tagName": "Text",
                "childNodes": [
                    {
                        "Key": "末啟詞",
                        "Value": "健康快樂",
                        "tagName": "Property"
                    }
                ],
                "Alignment": "Left"
            },
            敬陳: {
                "Alignment": "Left",
                "BeginX": 120,
                "FontSize": 21,
                "Index": 1,
                "LineHeight": 50,
                "TagCaption": "敬陳",
                "Title": "敬陳",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "敬陳",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            副總經理: {
                "Alignment": "Left",
                "BeginX": 0,
                "FontSize": 21,
                "Index": 2,
                "LineHeight": 30,
                "TagCaption": "副總經理",
                "Title": "副總經理",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "副總經理",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            總經理: {
                "Alignment": "Left",
                "BeginX": 0,
                "FontSize": 21,
                "Index": 2,
                "LineHeight": 30,
                "TagCaption": "總經理",
                "Title": "總經理",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "總經理",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            /*
            董事長: {
                "Alignment": "Left",
                "BeginX": 0,
                "FontSize": 21,
                "Index": 4,
                "LineHeight": 10,
                "TagCaption": "董事長",
                "Title": "董事長",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "董事長",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            */
            敬致: {
                "Alignment": "Left",
                "BeginX": 120,
                "FontSize": 21,
                "Index": 1,
                "LineHeight": 50,
                "TagCaption": "敬致",
                "Title": "敬致",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "敬致",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            核示: {
                "Alignment": "Left",
                "BeginX": 120,
                "FontSize": 21,
                "Index": 1,
                "LineHeight": 50,
                "TagCaption": "核示",
                "Title": "",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "核示",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            後會: {
                "Alignment": "Left",
                "BeginX": 350,
                "FontSize": 16,
                "Index": 5,
                "LineHeight": 10,
                "TagCaption": "後會",
                "Title": "後會",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "後會",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            職: {
                "Alignment": "Left",
                "BeginX": 350,
                "FontSize": 16,
                "Index": 5,
                "LineHeight": 10,
                "TagCaption": "職",
                "Title": "職",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "職",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            謹簽: {
                "Alignment": "Left",
                "BeginX": 550,
                "FontSize": 16,
                "Index": 6,
                "LineHeight": 10,
                "TagCaption": "謹簽",
                "Title": "謹簽",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "謹簽",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
            局處單位: {
                "Alignment": "Left",
                "BeginX": 550,
                "FontSize": 16,
                "Index": 6,
                "LineHeight": 10,
                "TagCaption": "局處單位",
                "Title": "局處單位",
                "VisibleState": "Visible",
                "childNodes": [
                    {
                        "Key": "局處單位",
                        "Value": "",
                        "tagName": "Property"
                    }
                ],
                "tagName": "Text"
            },
        },

        /* 階層說明
         * 

          "BulletText": "　二、",

          "BulletNo": "二、"
         
          "LvNumber": 1.2,       （主旨、說明、擬辦)為0   一、為1.1  （一）、為2.1    二、為1.2   （二）、為2.2

          "ParagraphNumber": 1,   主旨層0  說明層為1  擬辦層為3  例：說明層的所有條例都為1，擬辦層所有條例為2

          "MainLayerNumber": 2,  （主旨、說明、擬辦)為0  一、為1     二、為2    三、為3   (一)為1

          "ThisLayer": 1,        （主旨、說明、擬辦)為0  一、二、三、為1  （一）、（二）、（三）、為2

          "ThisLayerNumber": 2,  （主旨、說明、擬辦)為0  一、（一）、1.為1    二、（二）、2.為2

         *
         */

        KDRichTextBlock: [
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "主旨"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_Copy: [
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "主旨"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "這裡開始"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_Letterhead: [//令、便箋、會辦簽、箋函、
            {
                "BulletNo": "",
                "BulletText": "",
                "BulletType": "Text",
                "DisplayPanelName": "Context",
                "FontSize": 21,
                "Insert": "None",
                "LvNumber": 0,
                "MainLayerNumber": 0,
                "ParagraphNumber": 1,
                "Style": "B1",
                "ThisLayer": 0,
                "ThisLayerNumber": 0,
                "tagName": "Bullet"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ], KDRichTextBlock_NoteOriginal: [//令、A4空白簽
            {
                "BulletNo": "",
                "BulletText": "",
                "BulletType": "Text",
                "DisplayPanelName": "Context",
                "FontSize": 21,
                "Insert": "None",
                "LvNumber": 0,
                "MainLayerNumber": 0,
                "ParagraphNumber": 1,
                "Style": "B1",
                "ThisLayer": 0,
                "ThisLayerNumber": 0,
                "tagName": "Bullet"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
        ],
        KDRichTextBlock_MainLetterhead: [//箋函
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 22,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "〇〇〇〇勛鑒："
                ],
                "FontSize": 22
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "承"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "〇〇〇〇。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_MayorNote: [   //電子信箱回覆函
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 22,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "來文主旨：",
                "BulletNo": "來文主旨："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 22
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "回覆意見：",
                "BulletNo": "回覆意見："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 22
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "〇先生（小姐、君），您好："
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 3.1,
                "ParagraphNumber": 3,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "有關〇〇〇〇〇〇〇〇〇〇〇〇〇〇一案，謹說明如下："
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 4.1,
                "ParagraphNumber": 4,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "有關臺端〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_NoteSticky: [ //便簽
            {
                "BulletNo": "",
                "BulletText": "",
                "BulletType": "Text",
                "DisplayPanelName": "Context",
                "FontSize": 21,
                "Insert": "None",
                "LvNumber": 0,
                "MainLayerNumber": 0,
                "ParagraphNumber": 1,
                "Style": "B1",
                "ThisLayer": 0,
                "ThisLayerNumber": 0,
                "tagName": "Bullet"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "擬辦：",
                "BulletNo": "擬辦："
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_NoteEasy: [ //簡簽
            //第一段（不要段名，可分段，不縮排）
            // {
            //     "Insert": "None",
            //     "Style": "B1",
            //     "LvNumber": 0,
            //     "ParagraphNumber": 0,
            //     "FontSize": 21,
            //     "MainLayerNumber": 0,
            //     "tagName": "Bullet",
            //     "BulletType": "Text",
            //     "ThisLayer": 0,
            //     "DisplayPanelName": "Context",
            //     "ThisLayerNumber": 0,
            //     "BulletText": "",
            //     "BulletNo": ""
            // },
            // {
            //     "Insert": "None",
            //     "Strike": "None",
            //     "Underline": "",
            //     "tagName": "Text",
            //     "Style": "B1",
            //     "FontWeight": "Normal",
            //     "Highlight": "None",
            //     "childNodes": [
            //         ""
            //     ],
            //     "FontSize": 21
            // },
            // {
            //     "Type": "Text",
            //     "tagName": "Newline"
            // },
            //第二段，要段名，要可自動縮排
            {
                "BulletNo": "",
                "BulletText": "",
                "BulletType": "Text",
                "DisplayPanelName": "Context",
                "FontSize": 21,
                "Insert": "None",
                "LvNumber": 0,
                "MainLayerNumber": 0,
                "ParagraphNumber": 1,
                "Style": "B1",
                "ThisLayer": 0,
                "ThisLayerNumber": 0,
                "tagName": "Bullet"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            // {
            //     "Insert": "None",
            //     "Style": "B1",
            //     "LvNumber": 1.2,
            //     "ParagraphNumber": 1,
            //     "FontSize": 21,
            //     "MainLayerNumber": 2,
            //     "tagName": "Bullet",
            //     "BulletType": "Indent",
            //     "ThisLayer": 1,
            //     "DisplayPanelName": "Context",
            //     "ThisLayerNumber": 2,
            //     "BulletText": "　二、",
            //     "BulletNo": "二、"
            // },
            // {
            //     "Insert": "None",
            //     "Strike": "None",
            //     "Underline": "",
            //     "tagName": "Text",
            //     "Style": "B1",
            //     "FontWeight": "Normal",
            //     "Highlight": "None",
            //     "childNodes": [
            //         "擬辦：本案擬"
            //     ],
            //     "FontSize": 21
            // },
            // {
            //     "Type": "Indent",
            //     "tagName": "Newline"
            // },
            //第三段（不要段名，可分段，不縮排）
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_Note: [
            {
                "BulletNo": "備註：",
                "BulletText": "備註：",
                "BulletType": "Text",
                "DisplayPanelName": "Context",
                "FontSize": 21,
                "Insert": "None",
                "LvNumber": 0,
                "MainLayerNumber": 0,
                "Order": 1,
                "ParagraphNumber": 1,
                "Style": "B1",
                "ThisLayer": 0,
                "ThisLayerNumber": 0,
                "tagName": "Bullet"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Order": 2,
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline",
                "Order": 3
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "落實節能減碳，請自備環保杯、茶具及餐具。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
        ],
        KDRichTextBlock_Notes: [//簽
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0, //條例
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0, //二層
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "主旨"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "擬辦：",
                "BulletNo": "擬辦："
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_Notes_Copy: [//簽
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0, //條例
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0, //二層
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "主旨"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "這裡開始"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
        ],
        KDRichTextBlock_FactionLetter: [//派免建議函
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "○○○一員擬異動如下，請　　核示。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓　　名（國民身分證統一编號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "異動類別：　　　（代碼），民國　年　月　日　生效"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "現職：服務機關（代碼），單位，職稱（代碼），職務列等（代碼），職務编號（　　　　　　　　）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 3,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　三、",
                "BulletNo": "三、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "新職：服務機關（代碼），單位，職稱（代碼)，職務列等（代碼），職務编號（　　　　　　　　），職系（代碼），暫支俸級，俸點。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 4,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　四、",
                "BulletNo": "四、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "所具資格條件："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.5,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 5,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　五、",
                "BulletNo": "五、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
        ],
        KDRichTextBlock_ProposalLetter: [//獎懲建議函
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "核定○○○1員擬獎懲如下，請  核示。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓名（國民身分證統一編號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "現職：服務機關（代碼），單位職稱（代碼），官職等（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲：　　　　　（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 3,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　三、",
                "BulletNo": "三、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲事由：　　　（類別代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 4,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　四、",
                "BulletNo": "四、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "法令依據："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.5,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 5,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　五、",
                "BulletNo": "五、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項：【備供加註說明用】："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "【依據或補充說明】"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_ProposalLetterPlural: [//獎懲建議函多人
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "○○○等員擬獎懲如下，請核示。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓名（國民身分證統一編號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(一)",
                "BulletNo": "(一)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "現(原)職：服務機關(代碼)，職稱(代碼)，官職等(代碼)。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(二)",
                "BulletNo": "(二)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲：　　　　　（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　(三)",
                "BulletNo": "(三)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲事由：　　　（類別代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　(四)",
                "BulletNo": "(四)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "法令依據："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.5,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　(五)",
                "BulletNo": "(五)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項：【備供加註說明用】："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓名（國民身分證統一編號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(一)",
                "BulletNo": "(一)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "現(原)職：服務機關(代碼)，職稱(代碼)，官職等(代碼)。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(二)",
                "BulletNo": "(二)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲：　　　　　（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　(三)",
                "BulletNo": "(三)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲事由：　　　（類別代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　(四)",
                "BulletNo": "(四)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "法令依據："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.5,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　(五)",
                "BulletNo": "(五)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項：【備供加註說明用】："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "【依據或補充說明】"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_ProposalOrder: [//獎懲令
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "核定○○○1員獎懲如下："
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓名（國民身分證統一編號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "現(原)職：服務機關(代碼)，職稱(代碼)，官職等(代碼)。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲：　　　　　（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 3,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　三、",
                "BulletNo": "三、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲事由：　　　（類別代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 4,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　四、",
                "BulletNo": "四、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "法令依據："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.5,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 5,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　五、",
                "BulletNo": "五、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項：【備供加註說明用】："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "【依據或補充說明】"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 3,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "附註：",
                "BulletNo": "附註："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_ProposalOrderPlural: [//獎懲令多人
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "核定○○○等員獎懲如下："
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓名（國民身分證統一編號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(一)",
                "BulletNo": "(一)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "現(原)職：服務機關(代碼)，職稱(代碼)，官職等(代碼)。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(二)",
                "BulletNo": "(二)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲：　　　　　（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　(三)",
                "BulletNo": "(三)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲事由：　　　（類別代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　(四)",
                "BulletNo": "(四)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "法令依據："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.5,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　(五)",
                "BulletNo": "(五)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項：【備供加註說明用】："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓名（國民身分證統一編號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(一)",
                "BulletNo": "(一)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "現(原)職：服務機關(代碼)，職稱(代碼)，官職等(代碼)。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(二)",
                "BulletNo": "(二)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲：　　　　　（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　(三)",
                "BulletNo": "(三)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "獎懲事由：　　　（類別代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　(四)",
                "BulletNo": "(四)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "法令依據："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.5,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　(五)",
                "BulletNo": "(五)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項：【備供加註說明用】："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "【依據或補充說明】"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 3,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "附註：",
                "BulletNo": "附註："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_Publish: [//公告
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主　　旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "主旨"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "依據：",
                "BulletNo": "依　　據："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "公告事項：",
                "BulletNo": "公告事項："
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_Notice: [//公示送達
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "依據：",
                "BulletNo": "依據："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "公告事項：",
                "BulletNo": "公告事項："
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_AppointOrder: [//派免兼令
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "核定　　　1員派免如下，請　核示"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓名（國民身分證統一編號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "異動類別：調派代（代碼），同令發布日生效。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "原職：服務機關（代碼），單位職稱（代碼），官職等（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 3,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　三、",
                "BulletNo": "三、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "兼職：服務機關（代碼），單位職稱（代碼），官職等（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 4,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　四、",
                "BulletNo": "四、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項：空白。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "【備供加註說明用】"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_AppointOrderPlural: [//派免兼令多人
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "核定　　　等 員派免如下，請　核示。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": ""
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓名（國民身分證統一編號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(一)",
                "BulletNo": "(一)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "異動類別：調派代（代碼），同令發布日生效。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(二)",
                "BulletNo": "(二)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "原職：服務機關（代碼），單位職稱（代碼），官職等（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　(三)",
                "BulletNo": "(三)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "兼職：服務機關（代碼），單位職稱（代碼），官職等（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　(四)",
                "BulletNo": "(四)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項：空白。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "姓名（國民身分證統一編號）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(一)",
                "BulletNo": "(一)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "異動類別：調派代（代碼），同令發布日生效。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(二)",
                "BulletNo": "(二)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "原職：服務機關（代碼），單位職稱（代碼），官職等（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　(三)",
                "BulletNo": "(三)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "兼職：服務機關（代碼），單位職稱（代碼），官職等（代碼）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　(四)",
                "BulletNo": "(四)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "其他事項：空白。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "【依據或補充說明】"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
        KDRichTextBlock_ExchangeNoticeOpinion: [  //機密文書機密等級變更或註銷處理意見表
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": "一、已辦之機密文書資料，已失保密時效，或因有關機關之建議，其機密等級應予註"
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": "    銷或變更者，先提出審查後，填此表陳核。"
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 3,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": "二、國家機密之變更或解密者，依國家機密保護法第十條第一項規定為之。一般公務"
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 4,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": "機密文書，由原核定主管核定之。"
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            }
        ],

        KDRichTextBlock_ProposalNoticeRecord: [  //機密文書機密等級變更或註銷記錄單
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": "一、機密文書機密等級奉准變更或註銷時先調出原卷核對。"
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 2,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": "二、將原案封面或公文紙上所標機密等級以雙線劃去，再於明顯處浮貼已列明資料"
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 3,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": "經登記人簽章之紀錄單。"
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 4,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "",
                "BulletNo": "三、原案照變更之等級或非機密文件保管。"
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            }
        ],

        KDRichTextBlock_ProposalNotice: [ //機密文書機密等級變更或註銷建議單
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "檢送〇〇〇年度貴部（會）密級以上公文清冊一份（如附件），建請辦理機密等級變換或註銷其機密等級。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },

            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "依據「機密檔案管理辦法」規定辦理。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            }
        ],

        KDRichTextBlock_ExchangeNotice: [ //機密文書機密等級變更或註銷通知單
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "（原發文機關）０００年０月０日００字第００００００號（文別），有關（案由）乙案原為（原機密等級），已無保密必要，請惠予（變換為新機密等級或註銷）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },

            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "復貴部（會）０００年０月０日００字第００００００號（文別）。"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            }
        ],

        KDRichTextBlock_TribunalBook: [//行政裁處書
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "受裁處人基本資料："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(一)",
                "BulletNo": "(一)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "受處罰人：　　　　　　　　身分證字號："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(二)",
                "BulletNo": "(二)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "出生日期：民國　　年　　月　　日　　性別："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　(三)",
                "BulletNo": "(三)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "聯絡電話："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　(四)",
                "BulletNo": "(四)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "法定代理人："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.5,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　(五)",
                "BulletNo": "(五)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "戶籍地址："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.6,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　(六)",
                "BulletNo": "(六)"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "裁處書送達地點："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "違法事實："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 3,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　三、",
                "BulletNo": "三、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "法令依據："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 4,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　四、",
                "BulletNo": "四、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "附註："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],

        KDRichTextBlock_ReplyContact: [
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 0,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "主旨：",
                "BulletNo": "主旨："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "通關疑義暨權責機關答覆聯絡單"
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": "說明：",
                "BulletNo": "說明："
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    ""
                ],
                "FontSize": 21
            },
            {
                "Type": "Text",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 1,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　一、",
                "BulletNo": "一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "案情摘要及疑問："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 2,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　二、",
                "BulletNo": "二、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "關別："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 3,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　三、",
                "BulletNo": "三、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "進／出口／別：01一般進口／02一般出口／03簡易進口／04簡物出口／05郵包進口／07入境旅客"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 4,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　四、",
                "BulletNo": "四、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "報單號碼："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.5,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 5,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 5,
                "BulletText": "　五、",
                "BulletNo": "五、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "主提單號碼："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.6,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 6,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 6,
                "BulletText": "　六、",
                "BulletNo": "六、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "分提單號碼："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.7,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 7,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 7,
                "BulletText": "　七、",
                "BulletNo": "七、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "郵件號碼："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.8,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 8,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 8,
                "BulletText": "　八、",
                "BulletNo": "八、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "DF單號："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.9,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 9,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 9,
                "BulletText": "　九、",
                "BulletNo": "九、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "DF項次："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.10,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 10,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 10,
                "BulletText": "　十、",
                "BulletNo": "十、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "DF回文單位：（例：台北關業務一組）"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 1.11,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 1,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 11,
                "BulletText": "　十一、",
                "BulletNo": "十一、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "例稿："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(一)、",
                "BulletNo": "(一)、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "是否涉及逃避管制：□否□是"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(二)、",
                "BulletNo": "(二)、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "通知進口人補送輸入許可文件情形："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 3.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 3,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　１、",
                "BulletNo": "１、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "⬜未通告："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 3.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 3,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　２、",
                "BulletNo": "２、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "⬜通知函件已於	年	月	日送達，是否逾補送期限：是⬜否⬜"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.3,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 3,
                "BulletText": "　(三)、",
                "BulletNo": "(三)、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "處分情型："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 3.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 3,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　１、",
                "BulletNo": "１、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "未涉及逃避管制"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 4.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 4,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(１)、",
                "BulletNo": "(１)、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "⬜尚未核發退運處分書"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 4.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 4,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(２)、",
                "BulletNo": "(２)、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "已於	年	月	日核發退運處分書"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 3.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 3,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　２、",
                "BulletNo": "２、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "涉及逃避管制"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 4.1,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 4,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 1,
                "BulletText": "　(１)、",
                "BulletNo": "(１)、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "⬜尚未核發處分書"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 4.2,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 4,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 2,
                "BulletText": "　(２)、",
                "BulletNo": "(２)、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "已於	年	月	日核發處分書但處分尚未確定"
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            },
            {
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 2.4,
                "ParagraphNumber": 1,
                "FontSize": 21,
                "MainLayerNumber": 11,
                "tagName": "Bullet",
                "BulletType": "Indent",
                "ThisLayer": 2,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 4,
                "BulletText": "　(四)、",
                "BulletNo": "(四)、"
            },
            {
                "Insert": "None",
                "Strike": "None",
                "Underline": "",
                "tagName": "Text",
                "Style": "B1",
                "FontWeight": "Normal",
                "Highlight": "None",
                "childNodes": [
                    "查驗情形："
                ],
                "FontSize": 21
            },
            {
                "Type": "Indent",
                "tagName": "Newline"
            }
        ],
    },
    config: {
        pixel: 0,
        pageWidth: 0.0,
        pageHeight: 0.0,
        pageMargin: null,
        pageInterval: 0.0,
        svgHeight: 0.0,
        defaultFontSize: 0,
        defaultText: '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="{4}">{5}</text>',
        defaultTextColor: '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="{4}" fill="{5}">{6}</text>',
        defaultHiddenText: '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="{4}" style="visibility:hidden">{5}</text>',
        rowHeight: 20.0,
        barcodeHeight: 0.0,
        sealY: 0.0,
        sealHeight: 0.0,
        sealLocation: '',
        sealXml: ''
    },
    constructor: function () {
        this.FORMATS = KangDaAppConfig().FORMATS;

        /*
         Horizontal size = ((210mm) / (25.4mm/in)) x (300 pixels/in) = 2480.3150 ≅ 2481
         Vertical size   = ((297mm) / (25.4mm/in)) x (300 pixels/in) = 3507.8740 ≅ 3508
         */
        this.config.pixel = 96;  // test 72dpi
        this.config.pageWidth = 210 / 25.4 * this.config.pixel;
        this.config.pageHeight = 297 / 25.4 * this.config.pixel + this.revisePrint().revisePageHeight;
        this.config.pageMargin = {
            left: 23 / 25.4 * this.config.pixel,//原比照筆硯left: 20 / 25.4 * this.config.pixel，2018/06/29要求調回規範
            right: 23 / 25.4 * this.config.pixel,//原比照筆硯right: 20 / 25.4 * this.config.pixel，2018/06/29要求調回規範
            top: 23 / 25.4 * this.config.pixel,//原比照筆硯top: 20 / 25.4 * this.config.pixel，2018/06/29要求調回規範
            bottom: 30 / 25.4 * this.config.pixel
        };
        this.config.pageInterval = 2 / 25.4 * this.config.pixel;
        this.config.defaultFontSize = 16;
        this.config.svgHeight = this.config.pageHeight * 100 + this.config.pageInterval * (100 - 1);
        this.config.barcodeHeight = this.config.pageHeight * 0.056;
        this.initConfig(this.config);

        return this;
    },
    /**
     * 跨流覽器造成偏差
     */
    revisePrint: function (options) {
        var me = this;
        var setting = options || {};
        //列印引起頁面高差
        //setting.revisePageHeight = (Ext.browser.is.IE) ? -8 : 3;


        //TODO:macos
        setting.revisePageHeight = 3.8;//win_chrome。108.12.30(change the setting old is 3.8)lien.chiu

        //離線版特徵
        if (typeof require !== 'undefined') {
            setting.revisePageHeight = -7.2;//offline
        }
        //列印引起換頁差
        if (setting.hasOwnProperty('page')) {
            var _startPadding = 7.75, _intervalPadding = KangDaAppConfig().printPadding;
            var _upperPadding = _startPadding + (setting.page * _intervalPadding);
            setting.heightWithPadding = setting.maxMargin + setting.marginBottom + _upperPadding;
        }

        //TODO:edge 有邊界固定問題
        return setting;
    },
    /**
     * 對應文稿中文名稱,取得系統Model名稱
     *
     * OA.common.DIMgr.getModelName('wk','函')
     * return 'OA.model.wk.Letter'
     *
     * OA.common.DIMgr.getModelName('wk','函','Unit')
     * return 'OA.model.wk.Unit.Letter'
     *
     * OA.common.DIMgr.getModelName('wk','函')
     * return 'OA.model.wk.Letter'
     *
     * @param {String} fileType 文稿檔案格式
     * @param {String} docType 文稿格式名稱
     * @return {String}
     */
    getModelName: function (fileType, docType) {
        var s = 'OA.model.' + fileType + '.';

        var format = this.FORMATS[docType];
        // if (!format) return 'FORMATS_NOT_FOUND';
        if (!format) format = this.FORMATS['其他'];
        var name = format.name;
        var unit = format.unit;

        if (unit)
            s = s + unit + '.' + name;
        else
            s = s + name;
        return s;
    },
    /**
     * 建立 svg XML String
     *
     * var xml =this.generateSvg('OA.model.wk.Letter',record);
     *
     * @param {String} modelName 文稿模型
     * @param {record} record 來源資料取得 layout 定義UI
     * @param options
     * @return {object} XML String
     */
    generateSvg: function (modelName, record, options) {
        var me = this;
        var formatDef = this.getDefaultText();
        var size = this.getDefaultFontSize();
        var rowH = this.getRowHeight();
        options = options || {};
        var chapters = options.approveSeal || '';
        //console.log(options);
        //console.log(record);

        var seal = Ext.create('OA.model.seal.' + KangDaAppConfig().unit);
        //console.log(seal);
        if (options.previewMode) seal.set('mode', options.previewMode);
        if (options.meta) seal.set('dialogType', options.meta.DialogType);

        var rows = this.createDefaultRows(seal);

        var layout = record.data['layout'];
        var lost = this.verifyFields(modelName, layout);
        if (lost.length > 0) console.log('Error : generateSvg lost field: ' + lost);

        var isDocReceived = record.data['kind'] == '來文';
        //console.log(record);
        if (KangDaAppConfig().logo && !isDocReceived) {
            var org = layout.where("( el, i, res, param ) => el.key=='發文機關'")[0];
            if (org) {
                if (modelName && modelName.indexOf('NoteSticky') >= 0 || modelName && modelName == 'OA.model.wk.Notes' || modelName && modelName == 'OA.model.wk.NotesAuditReports') {  //不顯示聯徵LOGO
                    // console.log('不顯示抬頭圖章')
                } else {
                    var idx = layout.indexOf(org);
                    layout.splice(idx + 1, 0, {
                        key: "LOGO", wk: true, getPos: function () {
                            return { feature: 'logo' }
                        }
                    });
                    layout.splice(idx + 2, 0, {
                        key: "LOGOTEXT", wk: true, getPos: function () {
                            return { feature: 'logoText' }
                        }
                    });
                }
            } else if (modelName == 'OA.model.wk.ImportantMeetingReport') {  //出席會議摘要單
                var org2 = layout.where("( el, i, res, param ) => el.key=='機關名稱'")[0];
                var idx = layout.indexOf(org2);
                layout.splice(idx + 1, 0, {
                    key: "LOGO", wk: true, getPos: function () {
                        return { feature: 'logo' }
                    }
                });
                layout.splice(idx + 2, 0, {
                    key: "LOGOTEXT", wk: true, getPos: function () {
                        return { feature: 'logoText' }
                    }
                });
            }
        }

        layout = OA.common.Utils.removeSupport(layout);

        var i = 2, x = 0, y = 38, id = '', _multiFormat = [], _contactFields = [], vm = {}, KDRichTextBlockList = [];
        layout.forEach(function (p) {
            var pos = (p.getPos) ? p.getPos() : {};
            var items = me.getDefaultItems(record, p.key);

            if (p.group) {
                vm[p.key] = record.data[p.key];
                items = [];
            }

            var _feature = (pos) ? pos.feature : null;
            var c = _feature || 'normal';

            var j = 0, s = '', layerChange = '', parentLayerId = '', oldId = '', nowId = '';
            Ext.Array.each(items, function (item) {
                //console.log(item);
                if (item && item.class == 'table') {
                    rows.push('<g id="gTable" class="table"></g>');
                    return true;
                }

                i++;
                j++;
                y = y + rowH;

                if (j == 1) {
                    id = p.key + '_title';
                }
                else {
                    //發文字號及署名稿署名;簽（敬會、敬陳、敬致、局處單位）一份文稿可能會有多筆
                    if (items.length <= 2 && ['發文字號', '署名', '稿署名', '敬會', '敬陳', '敬致', '局處單位'].indexOf(p.key) == -1)
                        id = p.key;
                    else
                        id = p.key + '_' + (j - 1);
                }

                if (p.key === '聯絡方式') {
                    id = item.toString().split('：')[0];
                    if (id) {
                        rows.push(Ext.String.format(formatDef, id + '_title', x.toString(), y.toString(), size,
                            'contact_block', id + '：'));
                        vm[id + '_title'] = id + '：';
                        _contactFields.push(id);
                    }
                } else if (p.key == 'KDRichTextBlock') {
                    //item from OA.common.Utils.getKDRichTextBlock() Mapping
                    if (item.layerNo == '0' && item.layer == '0') {
                        id = p.key + '_' + item.paragraph;
                    } else {

                        //一段落無子系，二段落有子系，造成父系誤判
                        if (layerChange != item.layer) {
                            parentLayerId = oldId.split('-')[1];
                        }
                        //儲存目前ID資料到下面_id做使用
                        id = nowId = me.defId(p.key, item, parentLayerId);
                    }

                    if (layerChange != item.layer) {
                        parentLayerId = id.split('-')[1];
                    }

                    if (item.layer == 0) {
                        KDRichTextBlockList.push({ id: id, parentid: '' });
                    } else if (item.layer == 1) {
                        KDRichTextBlockList.push({ id: id, parentid: 'KDRichTextBlock_' + item.paragraph });
                    } else if (item.layer == 2) {
                        KDRichTextBlockList.push({ id: id, parentid: 'KDRichTextBlock-' + item.mainLayer });
                    } else if (item.layer == 3) {
                        KDRichTextBlockList.push({
                            id: id,
                            parentid: 'KDRichTextBlock-' + item.mainLayer + '.' + item.secLayer
                        });
                    } else {
                        KDRichTextBlockList.push({
                            id: id,
                            parentid: 'KDRichTextBlock-' + parentLayerId + '.' + item.layerNo
                        });
                    }

                    layerChange = item.layer;
                    oldId = id;
                }

                //tag: x,y,size
                size = me.getDefaultFontSize();
                if (pos) {
                    if (pos.x) x = pos.x;
                    if (pos.y) y = pos.y;
                    if (pos.size) size = pos.size;
                }

                //text
                if (p.showCaption) {
                    s = Ext.String.format('{0}：{1}', p.key, item);
                } else {
                    s = item;
                    if (p.key === '聯絡方式') {
                        var a = item.toString().split('：')[1];
                        s = (a) ? a : '';
                    } else if (p.key === '地址') {
                        var ads = item.toString().split('|');
                        if (ads[1]) {
                            s = ads[0] + '（' + ads[1] + '）';
                        } else {
                            s = ads[0];
                        }
                    } else if (p.key === 'LOGOTEXT') {
                        s = KangDaAppConfig().logoText;
                    }
                }


                // class rename in follow block
                if (j > 1) {
                    if (_feature == 'follow_caption_block')
                        c = 'follow_wrap';
                    else if (_feature == 'follow_align_block')
                        c = 'align_wrap';
                    else if (_feature == 'attn_block')
                        c = 'attn_wrap';
                    else if (_feature == 'file_no')
                        c = 'follow';
                    else if (_feature == 'file_year')
                        c = 'follow';

                    if (p.key === '聯絡方式') c = 'contact_wrap';
                }
                if (_feature == 'addr') c = 'addr';

                //modify Paragraph Block
                if (_feature && _feature.indexOf('paragraph_block') >= 0) {

                    c = me.defClassName(item, true);
                    //item.no=''時要留，因id="KDRichTextBlock_1"為第一個要設定該段落初始值。
                    rows.push(Ext.String.format(formatDef, id, x.toString(), y.toString(), size, c, item.no));

                    //註記條例數
                    var listCount = items.filter(function (element) {
                        return (element.paragraph == item.paragraph) && element.layer != 0;
                    }).length;
                    vm[id] = s;
                    vm['條例數'] = listCount;

                    j++;
                    //修正_context階層錯誤導致文字無法正常顯示
                    var _id = nowId;
                    nowId = "";
                    //var _id = me.defId(p.key, item, parentLayerId);
                    // console.log(_id);
                    // console.log(parentLayerId);
                    // console.log(item);
                    if (_id)
                        id = _id + '_context';
                    else
                        id = id + '_context';
                    s = item.text || '';
                    s = Ext.util.Format.htmlEncode(item.text) || '';
                    c = me.defClassName(item, false, listCount);
                }

                if (typeof item != "undefined" && item.multiFormat != "undefined" && item.multiFormat != null && item.multiFormat.length > 0) {
                    _multiFormat.push({ bindId: id, multiFormat: item.multiFormat });
                }

                // console.log(p.key);
                // console.log(id);
                // console.log(item);
                // console.log('----------');
                if (id) {
                    if (id == 'LOGO_title') {   //聯徵LOGO
                        var fImage = '<image id="{0}" x="{1}" y="{2}" width="50" height="50"/>';
                        var tag = Ext.String.format(fImage, id, x.toString(), y.toString());
                        rows.push(tag);
                    } else if (p.key == '校對監印發文') {
                        rows.push(Ext.String.format('<g id="gCornerSeal" opacity="0">'));
                        rows.push(Ext.String.format(formatDef, '', x.toString(), y.toString(), 14, '', '校對'));
                        rows.push(Ext.String.format(formatDef, '', x.toString(), y + 24, 14, '', '監印'));
                        rows.push(Ext.String.format(formatDef, '', x.toString(), y + 48, 14, '', '發文'));
                        rows.push(Ext.String.format('</g>'));
                    } else if (id == 'LOGOTEXT_title') { //聯徵LOGO
                        var format_copy_text = '<text font-size="18" id="{0}" stroke-width="0" stroke="#342771" fill="#342771" x="{1}" y="{2}">{3}</text>';
                        var logotext = Ext.String.format(format_copy_text, id, x, y.toString() - 65, 'Joint Credit Information Center');
                        rows.push(logotext);
                    } else {
                        s = s || ' ';
                        // <![CDATA[This is the content]]>
                        rows.push(Ext.String.format(formatDef, id, x.toString(), y.toString(), size, c, s));
                    }
                    if (p.key === '地址') {
                        vm['地址'] = item.toString().split('|')[0];
                        vm['辦公地址'] = item.toString().split('|')[1];
                    }
                    else {
                        vm[id] = s;
                    }
                }
            });
        });

        vm['KDRichTextBlockList'] = KDRichTextBlockList; //段落ID List

        if (record.data['templateUrl']) vm.templateUrl = record.data['templateUrl']; //表單模版


        Ext.apply(vm, record.data['Extend']);

        var isSealHidden = record.data['seal'] == false;
        if (!isSealHidden) {
            vm.chapters = chapters;
            rows = this.createSealRows(rows, vm, seal);
        }

        // rows = this.createPadRows(rows, vm.WritingPad);
        var svgString = this.closeTagToSvg(rows);

        return { xml: svgString, multiFormat: _multiFormat, vm: vm, contactFields: _contactFields };
    },
    /**
     * 建立 簽辦意見 svg XML String
     */
    generateOpinionSvg: function (dom) {
        //console.log(dom);
        var formatDef = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="{4}" fill="{5}">{6}</text>';
        var size = this.getDefaultFontSize();
        var rowH = this.getRowHeight();
        var pageMargin = this.getPageMargin();
        var rows = this.createDefaultRows();

        var _x = pageMargin.left;
        var _y = pageMargin.top;

        var doSno = '';
        if (OA.common.Global.getInitParas()) {
            if (OA.common.Global.getInitParas().doSno) doSno = OA.common.Global.getInitParas().doSno + '';
        }
        var txt = '公文文號：' + doSno;
        rows.push(Ext.String.format(formatDef, '文號', _x, _y, size, 'normal', 'black', txt));

        _y = _y + rowH;
        txt = '主旨：' + dom.getAttribute('案情摘要');
        rows.push(Ext.String.format(formatDef, '主旨', _x, _y, size, 'paragraph_desc', 'black', txt));

        _y = _y + rowH;
        txt = ' ';
        rows.push(Ext.String.format(formatDef, 'bar', _x, _y, size, 'normal', 'black', txt));

        _y = _y + rowH;
        txt = '★意見欄';
        rows.push(Ext.String.format(formatDef, '意見欄', _x, _y, size, 'normal', 'black', txt));

        var idxPeople = 0;
        var idxOpinion = 0;
        var opinions = dom.querySelectorAll('批示意見 > 意見');
        var color = 'black';
        Ext.Array.each(opinions, function (opinion) {
            idxPeople++;
            _y = _y + rowH;
            txt = opinion.getAttribute('BulletText');
            var spaceIndex = txt.indexOf(" ");
            rows.push(Ext.String.format(formatDef, 'by' + idxPeople, _x, _y, size, 'normal', color, txt));
            idxOpinion++;
            _y = _y + rowH;

            var elem = opinion.querySelector('文字');
            if (elem) {
                var lines = elem.textContent.split('\n');
                Ext.Array.each(lines, function (p) {
                    rows.push(Ext.String.format(formatDef, 'op' + idxOpinion, _x, _y, size, 'paragraph_desc', color, p));
                })
            }
        });
        var svgString = this.closeTagToSvg(rows);
        return { xml: svgString };
    },
    generateOpinionSvg2: function (dom) {
        var qd = OA.common.Global.getQueryDefault();
        //console.log(q);

        //console.log(dom);
        var formatDef = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="{4}" fill="{5}">{6}</text>';

        //
        var format_line_h = '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="#8e8e8e" opacity="{4}" stroke-width="1" fill="none" class="opinionline_h" />';
        var format_line_k = '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="#8e8e8e" opacity="{4}" stroke-width="1" fill="none" class="opinionline_k" />';
        var format_line_v = '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="#8e8e8e" opacity="{4}" stroke-width="1" fill="none" class="opinionline_v" />';
        var format_second_h = '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="#ff0000" opacity="{4}" stroke-width="1" fill="none" class="second_h" />';
        var format_second_v = '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="#ff0000" opacity="{4}" stroke-width="1" fill="none" class="second_v" />';

        var format_sign = '<text xml:space="preserve" font-size="xx-small" x="{0}" y="{1}" class="sealText">{2}</text>';
        var format_image = '<image x="{0}" y="{1}" width="{2}" height="{3}" xlink:href="{4}" opacity="{5}" />';

        var size = this.getDefaultFontSize();
        var rowH = this.getRowHeight();
        var pageMargin = this.getPageMargin();
        var rows = this.createDefaultRows();
        var pageWidth = this.getPageWidth()


        var _x = pageMargin.left;
        var _y = pageMargin.top;
        var _y2 = pageMargin.bottom;
        var _x2 = pageWidth - pageMargin.right;
        var _x3 = pageWidth - 250;
        var _x4 = _x3 + 50; //簽辦人員 
        var _x5 = _x3 + 6;  // 職章位置

        var doSno = '';
        if (OA.common.Global.getInitParas()) {
            if (OA.common.Global.getInitParas().doSno) doSno = OA.common.Global.getInitParas().doSno + '';
        }
        var txt = '公文文號：' + doSno;
        rows.push(Ext.String.format(formatDef, '文號', _x, _y, size, 'normal', 'black', txt));

        //_y = _y + rowH;
        txt = '主旨：' + dom.getAttribute('案情摘要');
        rows.push(Ext.String.format(formatDef, '主旨', _x, _y, size, 'paragraph_desc', 'black', txt));

        _y = _y + rowH;
        txt = ' ';
        rows.push(Ext.String.format(format_line_h, _x, _y, _x2, _y, '1'));
        rows.push(Ext.String.format(formatDef, '意見', (pageWidth / 2) - 90, _y, 18, 'normal', 'black', '意見'));
        rows.push(Ext.String.format(formatDef, '簽辦人員', _x4, _y, 18, 'normal', 'black', '簽辦人員'));

        rows.push(Ext.String.format(formatDef, 'bar', _x, _y, size, 'normal', 'black', txt));

        _y = _y + rowH;
        rows.push(Ext.String.format(format_line_v, _x, _y, _x, _y, '1'));
        rows.push(Ext.String.format(format_line_v, _x3, _y, _x3, _y, '1'));
        rows.push(Ext.String.format(format_line_v, _x2, _y, _x2, _y, '1'));
        //top_line '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="#8e8e8e" opacity="{4}" stroke-width="1" stroke-dasharray="1.5" fill="none" class="opinionline" />';

        //txt = '★意見欄';
        //rows.push(Ext.String.format(formatDef, '意見欄', _x, _y, size, 'normal', 'black', txt));

        var idxPeople = 0;
        var idxOpinion = 0;
        //console.log(dom);
        var opinions = dom.querySelectorAll('批示意見 > 意見');
        var color = 'black';
        rows.push(Ext.String.format(format_line_h, _x, _y, _x2, _y, '1'));
        Ext.Array.each(opinions, function (opinion) {
            rows.push(Ext.String.format(format_line_k, _x, _y2, _x2, _y2, '1'));
            //console.log(opinion);
            idxPeople++;
            _y = _y + rowH;
            txt = opinion.getAttribute('BulletText');
            var spaceIndex = txt.indexOf(" ");
            rows.push(Ext.String.format(formatDef, 'by' + idxPeople, _x, _y, size, 'normal', color, txt));


            var h = 44;
            var depname = opinion.getAttribute('depName');
            var jobname = opinion.getAttribute('jobName');
            var empname = opinion.getAttribute('empName');

            // Druadruatj Tjautuau
            // Insay Kungkuwan
            // 韃虎.伊斯瑪哈單.伊斯立端
            //empname = 'Insay Kungkuwan';
            /*
            if (idxPeople == 1) {
                empname = '洪顥砡';
            } else if (idxPeople == 2) {
                empname = '張順能測';
            } else if (idxPeople == 3) {
                empname = '張順能測';
            } else if (idxPeople == 4) {
                empname = '陳小明';
            } else if (idxPeople == 5) {
                empname = '林陳小明';
            }
            */

            //depname = '中山樓管理所辦公室';
            /*
            depname = '作業科';
            if (idxPeople == 1) {
                depname = '作業科';
            } else if (idxPeople == 2) {
                depname = '作業科';
            } else if (idxPeople == 3) {
                depname = '集水區治理科';
            } else if (idxPeople == 4) {
                depname = '集水區治理科';
            } else if (idxPeople == 5) {
                depname = '集水區治理科';
            }
            */
            //var depCount = 0;
            //var depCount2 = 0;
            //if (depname.length > 6) {
            //    var depCount = Math.ceil(depname.length / 6);
            //    h = h + (depCount * 10);
            //}

            //var w = (5 * 13.5) + (empname.length * 26);//推持寬度
            w = 151.5;
            var namew = _x5 + (5 * 11.8);
            var time = opinion.getAttribute('logTime');
            if (time == '') {  //logTime為空，則取 BulletText 的時間
                var timeIndex = txt.indexOf(':') - 12
                time = txt.substring(timeIndex, txt.length)
            }


            if (txt.indexOf('代理') != -1) {
                time = time + '（代）'
            }

            //if (empname.length > 4) {  //10/05 列印簽辦意見簽辦人員仿章大小調整  Chloe.sia
            //    h = 40;
            //    depCount2 = Math.ceil(empname.length / 4);
            //    h = h + (depCount2 * 2);
            //    w = (5 * 13.5) + 80;
            //}

            var format_SealTitleAndName_rect = '<rect id="Chaptersbox" class="{0}" height="{1}" width="{2}" y="{3}" x="{4}" fill-opacity="null" stroke-opacity="null" stroke-width="1.5" stroke="#ff0000" fill="#fff"/>';
            rows.push(Ext.String.format(format_SealTitleAndName_rect, 'Chaptersbox', h, w, _y, _x5));
            var format_Chapters_text = '<text id="Chapterstext" class="{0}"  xml:space="preserve" text-anchor="start" font-family="BiauKai,標楷體" y="{1}" x="{2}" font-size="{3}" stroke-opacity="null" stroke-width="0" stroke="{4}" fill="{5}">{6}</text>';
            //if (depCount > 0) {
            //    var words = [];
            //    for (var i = 0; i < depCount; i++) {
            //        if (i == depCount) {
            //            words.push(depname.substring(i * 5, depname.length))
            //        } else {
            //            words.push(depname.substring(i * 5, (i + 1) * 5));
            //        }
            //    }
            //    var fontsize = 20 / words.length;

            //    Ext.Array.each(words, function (word) {
            //        rows.push(Ext.String.format(format_Chapters_text, 'Chapters_depname', _y + 14, _x5 + 4, fontsize, '#ff0000', '#ff0000', word));
            //    });
            //    //rows.push(Ext.String.format(format_Chapters_text, 'Chapters_depname', _y + 1, _x5 + 4, fontsize, '#ff0000', '#ff0000', depname));
            //} else {
            if (depname.length > 5) {
                rows.push(Ext.String.format(format_Chapters_text, 'Chapters_depname', _y + 14, _x5 + 4, 10, '#ff0000', '#ff0000', depname));
            } else {
                rows.push(Ext.String.format(format_Chapters_text, 'Chapters_depname', _y + 14, _x5 + 4, 12, '#ff0000', '#ff0000', depname));
            }
            //}

            //jobname = '編審兼臺灣研究中心組長'
            /*
            jobname = '自僱人員';
            if (idxPeople == 1) {
                jobname = '自僱人員';
            } else if (idxPeople == 2) {
                jobname = '自僱人員';
            } else if (idxPeople == 3) {
                jobname = '自僱人員(協辦) ';
            } else if (idxPeople == 4) {
                jobname = '行政組承辧人';
            } else if (idxPeople == 5) {
                jobname = '行政組承辧人';
            }
            */

            if (jobname.length > 5) {
                if (jobname.length > 6) {
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_jobname', _y + 30, _x5 + 4, 10, '#ff0000', '#ff0000', jobname.substring(0, 6)));
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_jobname', _y + 30, _x5 + 4, 10, '#ff0000', '#ff0000', jobname.substring(6)));
                    //console.log(rows);
                } else {
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_jobname', _y + 30, _x5 + 4, 10, '#ff0000', '#ff0000', jobname));
                }
            } else {
                rows.push(Ext.String.format(format_Chapters_text, 'Chapters_jobname', _y + 28, _x5 + 4, 14, '#ff0000', '#ff0000', jobname));
            }


            var new_x = namew;

            if (depname.length > 3 || jobname.length > 5) new_x = namew + 11;

            if (depname.length > 7) {
                if (empname.length > 8) {
                    new_x = namew + 13;
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 16, '#ff0000', '#ff0000', empname.substring(0, 4)));
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 16, '#ff0000', '#ff0000', empname.substring(4, 8)));
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 16, '#ff0000', '#ff0000', empname.substring(8)));
                } else if (empname.length > 4) {
                    new_x = namew + 13;
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 16, '#ff0000', '#ff0000', empname.substring(0, 4)));
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 16, '#ff0000', '#ff0000', empname.substring(4)));
                } else if (empname.length > 3) {
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 20, '#ff0000', '#ff0000', empname));
                } else {
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 22, '#ff0000', '#ff0000', empname));
                }
            } else {
                if (empname.length > 8) {
                    new_x = namew + 11;

                    if (empname.indexOf('．') != -1) {
                        var empnameArr = empname.split('．');
                        Ext.Array.each(empnameArr, function (emp, index) {
                            if (index != empnameArr.length - 1) {
                                rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 14, '#ff0000', '#ff0000', emp + '．'));
                            } else {
                                rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 14, '#ff0000', '#ff0000', emp));
                            }
                        })
                    } else if (empname.indexOf(' ') != -1) {
                        var empnameArr = empname.split(' ');
                        Ext.Array.each(empnameArr, function (emp, index) {
                            rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 14, '#ff0000', '#ff0000', emp));
                        });
                    } else {
                        rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 14, '#ff0000', '#ff0000', empname.substring(0, 5)));
                        if (empname.length > 10) {
                            rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 14, '#ff0000', '#ff0000', empname.substring(5, 10)));
                            rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 14, '#ff0000', '#ff0000', empname.substring(10)));
                        } else {
                            rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 14, '#ff0000', '#ff0000', empname.substring(5)));
                        }
                    }
                    //rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 16, '#ff0000', '#ff0000', empname.substring(10)));
                } else if (empname.length > 4) {
                    new_x = namew + 14;
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 16, '#ff0000', '#ff0000', empname.substring(0, 4)));
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 16, '#ff0000', '#ff0000', empname.substring(4)));
                } else if (empname.length > 3) {
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 20, '#ff0000', '#ff0000', empname));
                } else {
                    rows.push(Ext.String.format(format_Chapters_text, 'Chapters_empname', _y + 25, new_x, 24, '#ff0000', '#ff0000', empname));
                }
            }

            if (txt.indexOf('代理') != -1) {
                rows.push(Ext.String.format(format_Chapters_text, 'Chapters_time', _y + 50, _x5 + 9, 13, 'black', 'black', time));
            } else {
                rows.push(Ext.String.format(format_Chapters_text, 'Chapters_time', _y + 50, _x5 + 18, 13, 'black', 'black', time));
            }

            idxOpinion++;
            _y = _y + rowH;
            var elem = opinion.querySelector('文字');
            if (elem) {
                var lines = elem.textContent.split('\n');
                Ext.Array.each(lines, function (p) {
                    rows.push(Ext.String.format(formatDef, 'op' + idxOpinion, _x, _y, size, 'paragraph_desc', color, p));
                })
            }
            rows.push(Ext.String.format(format_line_v, _x, _y, _x, _y, '1'));
            rows.push(Ext.String.format(format_line_v, _x3, _y, _x3, _y, '1'));
            rows.push(Ext.String.format(format_line_v, _x2, _y, _x2, _y, '1'));
            rows.push(Ext.String.format(format_line_h, _x, _y, _x2, _y, '1'));
        });


        var wk = OA.common.Global.getCurrentWKContent()
        if (wk != null) {

            txt = '★便利貼：';
            rows.push(Ext.String.format(formatDef, '便利貼', _x, _y, size, 'normal', 'black', txt));


            var wkStickyNote = OA.common.Utils.getWKStickyNote(wk); //取得目前文稿StickyNote
            var idxPeople = 0;
            var idxOpinion = 0;
            var color = 'black';
            Ext.Array.each(wkStickyNote, function (Sticky) { //0928 列印 簽辦意見便利貼顯示 Chloe.sia
                idxPeople++;
                _y = _y + rowH;
                txt = idxPeople + ' ' + Sticky.jobName + ' ' + Sticky.empName
                // var spaceIndex = txt.indexOf(" ");
                rows.push(Ext.String.format(formatDef, 'job' + idxPeople, _x, _y, size, 'normal', color, txt));
                idxOpinion++;
                _y = _y + rowH;
                var elem = Sticky.text
                if (elem) {
                    // var lines = elem.textContent.split('\n');
                    Ext.Array.each(elem, function (p) {
                        rows.push(Ext.String.format(formatDef, 'text' + idxOpinion, _x, _y, size, 'paragraph_desc', color, p));
                    })
                }
            });
        }

        var svgString = this.closeTagToSvg(rows);
        return { xml: svgString };
    },
    generateTidyOpinion2: function (options) {
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var title = '', doSno = '', doDeptno = '';
        if (docflow) {
            title = docflow.get('title') || '';
            unit = docflow.get('depName') || '';
            doSno = docflow.get('doSno') || '';
            doDeptno = docflow.get('doDeptno') || '';
        }
        var vi = OA.common.VIMgr.getViContent();
        OA.common.VIMgr.doEdition(vi.作業版本);
        OA.common.VIMgr.setSuggestionStore(vi);
        var formatKind = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="kind" fill="black" font-weight="bold">{4}</text>';
        var formatPaper = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="paper" fill="black" font-style="italic">{4}</text>';
        var formatText = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="{4}" fill="black">{5}</text>';

        var size = this.getDefaultFontSize();
        var rowH = this.getRowHeight();

        var pageWidth = this.getPageWidth();
        var pageMargin = this.getPageMargin();
        var rows = this.createDefaultRows();

        var _x = pageMargin.left;
        var _y = pageMargin.top;

        var txt = '公文文號：' + doDeptno + doSno;
        rows.push(Ext.String.format(formatText, '文號', _x, _y, size, 'normal', txt));

        _y = _y + rowH;
        txt = '主旨：' + title;
        rows.push(Ext.String.format(formatText, '主旨', _x, _y, size, 'paragraph_desc', txt));

        _y = _y + rowH;
        txt = ' ';
        rows.push(Ext.String.format(formatText, 'bar', _x, _y, size, 'normal', txt));

        _y = _y + rowH;
        txt = '★意見欄';
        rows.push(Ext.String.format(formatText, '意見欄', _x, _y, size, 'normal', txt));

        var paperEdits = [];
        var brandVI = Ext.clone(vi.版次);
        var brand = brandVI.reverse();
        var lastPush = 0;
        Ext.Array.each(brand, function (edition) {
            if (edition.版號 == 0 || edition.isTemp == 'Y') return true;
            var who = edition.簽核人員;
            var isParallel = false;
            if (who.是否會辦 == '是') isParallel = true;

            if (options.filters.length == 1) {
                var filter = options.filters[0];
                if (filter.key == '承辦') {
                    if (who.是否會辦 == '是') return true;
                } else if (filter.key == '會辦') {
                    if (filter.depNo == filter.upDepNo) {
                        if (who.所屬機構代碼 !== filter.depNo) return true;
                    } else {
                        if (who.單位代碼 !== filter.depNo) return true;
                    }
                }
                isParallel = false;
            }

            var last,
                lastWho;

            if (!isParallel) { //不是會辦的直接push
                if (options.filters.length == 1 && filter.key == '會辦' && paperEdits.length > 0) {
                    last = paperEdits[paperEdits.length - 1];
                    lastWho = last.簽核人員;
                    if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                        //剔掉最後一筆
                        paperEdits.splice(paperEdits.length - 1, 1, edition);
                    } else {
                        paperEdits.push(edition);
                    }
                } else {
                    paperEdits.push(edition);
                }
                lastPush++;
            } else {
                var lastApprove = -1;
                Ext.Array.each(paperEdits, function (item, index) {
                    var doType = item.線上簽核資訊.簽核流程.異動別;
                    if (doType == '決行') {
                        lastApprove = index;
                    }
                });

                if (lastApprove != -1) {
                    //抓出目前陣列最後一次決行後最後一筆同單位會辦
                    var lastParallel = -1;
                    Ext.Array.each(paperEdits, function (item, index) {
                        var who1 = item.簽核人員;
                        if (index > lastApprove) {
                            if (who1.單位代碼 == who.單位代碼) {
                                lastParallel = index;
                            }
                        }
                    });

                    if (lastParallel != -1) {
                        if (lastParallel > lastPush) {
                            last = paperEdits[lastParallel];
                            lastWho = last.簽核人員;
                            if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                                //剔掉最後一筆
                                paperEdits.splice(lastParallel, 1, edition);
                            } else {
                                paperEdits.splice(lastParallel + 1, 0, edition);
                            }
                        } else {
                            //判斷是否為後會
                            if (lastParallel == lastPush && lastParallel > lastApprove) {
                                //抓出同單位最後一筆會辦人員，與目前who人員是否為同一人
                                var beforeParallel = paperEdits[lastParallel];
                                var beforeWho = beforeParallel.簽核人員;
                                if (beforeWho.使用者職務代碼 == who.使用者職務代碼 && beforeWho.單位代碼 == who.單位代碼) {
                                    //同一人
                                    last = paperEdits[paperEdits.length - 1];
                                    lastWho = last.簽核人員;
                                    if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                                        //剔掉最後一筆
                                        paperEdits.splice(paperEdits.length - 1, 1, edition);
                                    } else {
                                        paperEdits.push(edition);
                                    }
                                } else {
                                    //不同人
                                    paperEdits.splice(lastParallel + 1, 0, edition);
                                }
                            } else {
                                last = paperEdits[paperEdits.length - 1];
                                lastWho = last.簽核人員;
                                if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                                    //剔掉最後一筆
                                    paperEdits.splice(paperEdits.length - 1, 1, edition);
                                } else {
                                    paperEdits.push(edition);
                                }
                            }
                        }
                    } else {
                        paperEdits.push(edition);
                    }
                } else {
                    var lastParallel = -1;
                    Ext.Array.each(paperEdits, function (item, index) {
                        var who1 = item.簽核人員;
                        if (who1.單位代碼 == who.單位代碼) {
                            lastParallel = index;
                        }
                    });

                    if (lastParallel != -1) {
                        last = paperEdits[lastParallel];
                        if (last.線上簽核資訊 &&
                            last.線上簽核資訊.簽核流程 &&
                            last.線上簽核資訊.簽核流程.異動別 &&
                            (last.線上簽核資訊.簽核流程.異動別 == '會畢' ||
                                last.線上簽核資訊.簽核流程.異動別 == '退文')) {
                            paperEdits.push(edition);
                        } else {
                            paperEdits.splice(lastParallel + 1, 0, edition);
                        }
                        //if (lastParallel > lastPush) {
                        //    last = paperEdits[lastParallel];
                        //    lastWho = last.簽核人員;
                        //    if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                        //        //剔掉最後一筆
                        //        paperEdits.splice(lastParallel, 1, edition);
                        //    } else {
                        //        paperEdits.splice(lastParallel + 1, 0, edition);
                        //    }
                        //} else {
                        //    last = paperEdits[paperEdits.length - 1];
                        //    lastWho = last.簽核人員;
                        //    if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                        //        //剔掉最後一筆
                        //        paperEdits.splice(paperEdits.length - 1, 1, edition);
                        //    } else {
                        //        paperEdits.push(edition);
                        //    }
                        //}
                    } else {
                        paperEdits.push(edition);
                    }
                }
            }
        });

        Ext.Array.each(options.papers, function (p) {
            var no = 0;
            // if (p.text == '來文' && !isOnlyFollow) return true;
            var hasData = false;
            rows.push(Ext.String.format(formatPaper, 'p' + p.paperNo, _x, _y, size * 1.4, p.text));
            Ext.Array.each(paperEdits, function (edition, idx) {
                var who = edition.簽核人員;
                Ext.Array.each(edition.簽核文件夾.文稿, function (paper) {
                    if (paper.代碼 == p.paperNo) {
                        no++;
                        _y = _y + rowH;

                        var doType = edition.線上簽核資訊.簽核流程.異動別;

                        if (who.代理名稱)
                            txt = Ext.String.format('{0}.{1} {2} {3} (代理：{4} {5})  {6} {7}', no, who.所屬機構, who.服務單位, who.使用者名稱, who.代理職稱, who.代理名稱, edition.最後更新時間, doType);
                        else
                            txt = Ext.String.format('{0}.{1} {2} {3} {4}　{5} {6}', no, who.所屬機構, who.服務單位, who.使用者職稱, who.使用者名稱, edition.最後更新時間, doType);

                        if (who.是否會辦 == '是') {
                            rows.push(Ext.String.format(formatText, 'by' + idx, _x + 20, _y, size, 'paragraph_desc', txt));
                        } else {
                            rows.push(Ext.String.format(formatText, 'by' + idx, _x, _y, size, 'paragraph_desc', txt));
                        }

                        _y = _y + rowH;
                        txt = paper.批示意見.content || '';

                        var lines = (txt + '').split('\n');
                        Ext.Array.each(lines, function (p) {
                            if (who.是否會辦 == '是') {
                                rows.push(Ext.String.format(formatText, 'op' + idx, _x + 20, _y, size, 'paragraph_desc', p));
                            } else {
                                rows.push(Ext.String.format(formatText, 'op' + idx, _x, _y, size, 'paragraph_desc', p));
                            }
                        });

                        if (doType == '決行') {
                            rows.push(Ext.String.format(formatKind, p.paperNo + '-' + no, _x, _y, size, ''));
                            rows.push(Ext.String.format(formatText, 'op' + idx, _x, _y, size, 'normal', ''));
                        } else {
                            if (txt != '')
                                rows.push(Ext.String.format(formatText, 'op' + idx, _x, _y, size, 'normal', ''));
                        }
                    }
                });
                hasData = true;
            });

            if (hasData == false) rows.pop();
        });

        var svgString = this.closeTagToSvg(rows);

        return { xml: svgString };
    },
    /**
     * 建立 綜整簽辦意見 svg XML String
     */
    generateTidyOpinion: function (options) {
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var title = '', unit = '', doSno = '', doDeptno = '';
        if (docflow) {
            title = docflow.get('title') || '';
            unit = docflow.get('depName') || '';
            doSno = docflow.get('doSno') || '';
            doDeptno = docflow.get('doDeptno') || '';
        }

        var paras = OA.common.Global.getInitParas();
        var vi = OA.common.VIMgr.getViContent();
        OA.common.VIMgr.doEdition(vi.作業版本);
        OA.common.VIMgr.setSuggestionStore(vi);
        var store = Ext.getStore('Suggestion');
        var formatKind = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="kind" fill="black" font-weight="bold">{4}</text>';
        var formatPaper = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="paper" fill="black" font-style="italic">{4}</text>';
        var formatText = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="{4}" fill="black">{5}</text>';

        var format_line = '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="black" opacity="{4}" stroke-width="1" class="line"/>'
        var size = this.getDefaultFontSize();
        var rowH = this.getRowHeight();

        var pageWidth = this.getPageWidth();
        var pageMargin = this.getPageMargin();
        var rows = this.createDefaultRows();

        var _x = pageMargin.left;
        var _y = pageMargin.top;

        var txt = '公文文號：' + doDeptno + doSno;
        rows.push(Ext.String.format(formatText, '文號', _x, _y, size, 'normal', txt));

        _y = _y + rowH;
        txt = '主旨：' + title;
        rows.push(Ext.String.format(formatText, '主旨', _x, _y, size, 'paragraph_desc', txt));

        _y = _y + rowH;
        txt = ' ';
        rows.push(Ext.String.format(formatText, 'bar', _x, _y, size, 'normal', txt));

        _y = _y + rowH;
        txt = '★意見欄';
        rows.push(Ext.String.format(formatText, '意見欄', _x, _y, size, 'normal', txt));

        var isForceShow = true;
        //var isOnlyFollow = OA.common.VIMgr.isOnlyFollow();
        //var isOnePaper = options.papers.length == 1;
        Ext.Array.each(options.papers, function (p) {
            // if (p.text == '來文' && !isOnlyFollow) return true;            
            var hasData = false;
            rows.push(Ext.String.format(formatPaper, 'p' + p.paperNo, _x, _y, size * 1.4, p.text));
            Ext.Array.each(options.filters, function (ft) {
                var filter = { paperNo: p.paperNo };
                Ext.apply(filter, ft);
                store.doFilter(filter);

                /*2019.11.1  簽辦意見因該部顯示 lien.chiu
                 * 之前決定意見要分主稿才顯示的，來亂的
                 *
                //沒有會辦簽，第一個簽或稿輸入，簽稿併陳時則限制在第一個簽輸入意見
                var isShow = ft.key != '會辦';
                if (ft.key == '會辦') {
                    if (p.status == 'first') isShow = true;
                    var hasPapeOne = options.papers.where("( el, i, res, param ) =>el.paperNo ==1");
                    var hasFirst = options.papers.where("( el, i, res, param ) =>el.status =='first'");
                    if (hasFirst.length == 0 && hasPapeOne.length == 0) {
                        var notes = options.papers.where("( el, i, res, param ) =>el.text =='簽'");
                        if (notes && notes.length > 0) {
                            if (notes[0].paperNo == p.paperNo) isShow = true;
                        }
                    }
                }
                //if (isOnePaper) isShow = true;
                */

                //if (isShow) {
                var tmp = [];
                var count = store.getData().length;
                if (count != 0) rows.push(Ext.String.format(formatKind, p.paperNo + '-' + ft.key, _x, _y, size * 1.2, ft.key)); //意見種類


                // let arr=[];
                // store.getData().all.forEach(function(item){  //0203 判別重複資料  Chloe.sia
                //     if(arr.length==0){
                //         arr.push(item)
                //     }else if(arr.length!=0){
                //         let num = 0
                //         arr.forEach(function (item2,index) {
                //             if(item.getData().最後更新時間==item2.getData().最後更新時間&&
                //                item.getData().簽核人員.使用者名稱==item2.getData().簽核人員.使用者名稱&&
                //                item.getData().簽核人員.使用者職稱==item2.getData().簽核人員.使用者職稱&&
                //                item.getData().簽核人員.服務單位==item2.getData().簽核人員.服務單位
                //               ){
                //              num++;
                //                 if(item.getData().批示意見.content){
                //                     // arr2[index].getData().批示意見=item.getData().批示意見.content
                //                     item2.getData().批示意見.content = item.getData().批示意見.content
                //                 }
                //             }
                //
                //         })
                //         if(num == 0){
                //             arr.push(item)
                //         }
                //     }
                // })


                Ext.Array.each(store.getData().all, function (r, idx) {
                    //store.each(function (r, idx) {
                    var who = r.get('簽核人員');
                    if (r.get('show') === 'last' || r.get('show') === 'show' || isForceShow) {
                        //會辦時，標明機關
                        // if (ft.key == '會辦') rows.push(Ext.String.format(formatPaper, 'dep' + idx, _x, _y, size * 1.2, who.服務單位));
                        _y = _y + rowH;
                        txt = r.get('批示意見').content || '';
                        // rows.push(Ext.String.format(formatText, 'op' + idx, _x, _y, size, 'paragraph_desc', txt));

                        var lines = (txt + '').split('\n');
                        Ext.Array.each(lines, function (p) {
                            rows.push(Ext.String.format(formatText, 'op' + idx, _x, _y, size, 'paragraph_desc', p));
                        })
                    }

                    _y = _y + rowH;

                    var doType = r.get('線上簽核資訊').簽核流程.異動別;
                    //  console.log(who);
                    if (who.代理名稱)
                        txt = Ext.String.format('{0} {1} (代理：{2} {3})  {4} {5}', who.服務單位, who.使用者名稱, who.代理職稱, who.代理名稱, r.get('最後更新時間'), doType);
                    else
                        txt = Ext.String.format('{0} {1} {2}　{3} {4}', who.服務單位, who.使用者職稱, who.使用者名稱, r.get('最後更新時間'), doType);

                    rows.push(Ext.String.format(formatText, 'by' + idx, _x, _y, size * 0.8, 'normal', txt));

                    // tmp.push({
                    //     '代碼': r.get('代碼'),
                    //     '意見分類': r.get('意見分類'),
                    //     '使用者名稱': r.get('簽核人員').使用者名稱,
                    //     '批示意見': r.get('批示意見').content,
                    //     'show': r.get('show'),
                    //     'depNo': r.get('簽核人員').單位代碼
                    // })
                });
                hasData = true;
                // console.table(tmp);
                //}
            });

            if (hasData == false) rows.pop();
        });

        var svgString = this.closeTagToSvg(rows);

        return { xml: svgString };
    },
    generateTidyOpinion2: function (options) {
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var title = '', doSno = '', doDeptno = '';
        if (docflow) {
            title = docflow.get('title') || '';
            unit = docflow.get('depName') || '';
            doSno = docflow.get('doSno') || '';
            doDeptno = docflow.get('doDeptno') || '';
        }
        var vi = OA.common.VIMgr.getViContent();
        OA.common.VIMgr.doEdition(vi.作業版本);
        OA.common.VIMgr.setSuggestionStore(vi);
        var formatKind = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="kind" fill="black" font-weight="bold">{4}</text>';
        var formatPaper = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="paper" fill="black" font-style="italic">{4}</text>';
        var formatText = '<text xml:space="preserve" id="{0}" x="{1}" y="{2}" font-size="{3}" class="{4}" fill="black">{5}</text>';

        var size = this.getDefaultFontSize();
        var rowH = this.getRowHeight();

        var pageWidth = this.getPageWidth();
        var pageMargin = this.getPageMargin();
        var rows = this.createDefaultRows();

        var _x = pageMargin.left;
        var _y = pageMargin.top;

        var txt = '公文文號：' + doDeptno + doSno;
        rows.push(Ext.String.format(formatText, '文號', _x, _y, size, 'normal', txt));

        _y = _y + rowH;
        txt = '主旨：' + title;
        rows.push(Ext.String.format(formatText, '主旨', _x, _y, size, 'paragraph_desc', txt));

        _y = _y + rowH;
        txt = ' ';
        rows.push(Ext.String.format(formatText, 'bar', _x, _y, size, 'normal', txt));

        _y = _y + rowH;
        txt = '★意見欄';
        rows.push(Ext.String.format(formatText, '意見欄', _x, _y, size, 'normal', txt));

        var paperEdits = [];
        var brandVI = Ext.clone(vi.版次);
        var brand = brandVI.reverse();
        var lastPush = 0;
        Ext.Array.each(brand, function (edition) {
            if (edition.版號 == 0 || edition.isTemp == 'Y') return true;
            var who = edition.簽核人員;
            var isParallel = false;
            if (who.是否會辦 == '是') isParallel = true;

            if (options.filters.length == 1) {
                var filter = options.filters[0];
                if (filter.key == '承辦') {
                    if (who.是否會辦 == '是') return true;
                } else if (filter.key == '會辦') {
                    if (filter.depNo == filter.upDepNo) {
                        if (who.所屬機構代碼 !== filter.depNo) return true;
                    } else {
                        if (who.單位代碼 !== filter.depNo) return true;
                    }
                }
                isParallel = false;
            }

            var last,
                lastWho;

            if (!isParallel) { //不是會辦的直接push
                if (options.filters.length == 1 && filter.key == '會辦' && paperEdits.length > 0) {
                    last = paperEdits[paperEdits.length - 1];
                    lastWho = last.簽核人員;
                    if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                        //剔掉最後一筆
                        paperEdits.splice(paperEdits.length - 1, 1, edition);
                    } else {
                        paperEdits.push(edition);
                    }
                } else {
                    paperEdits.push(edition);
                }
                lastPush++;
            } else {
                var lastApprove = -1;
                Ext.Array.each(paperEdits, function (item, index) {
                    var doType = item.線上簽核資訊.簽核流程.異動別;
                    if (doType == '決行') {
                        lastApprove = index;
                    }
                });

                if (lastApprove != -1) {
                    //抓出目前陣列最後一次決行後最後一筆同單位會辦
                    var lastParallel = -1;
                    Ext.Array.each(paperEdits, function (item, index) {
                        var who1 = item.簽核人員;
                        if (index > lastApprove) {
                            if (who1.單位代碼 == who.單位代碼) {
                                lastParallel = index;
                            }
                        }
                    });

                    if (lastParallel != -1) {
                        if (lastParallel > lastPush) {
                            last = paperEdits[lastParallel];
                            lastWho = last.簽核人員;
                            if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                                //剔掉最後一筆
                                paperEdits.splice(lastParallel, 1, edition);
                            } else {
                                paperEdits.splice(lastParallel + 1, 0, edition);
                            }
                        } else {
                            //判斷是否為後會
                            if (lastParallel == lastPush && lastParallel > lastApprove) {
                                //抓出同單位最後一筆會辦人員，與目前who人員是否為同一人
                                var beforeParallel = paperEdits[lastParallel];
                                var beforeWho = beforeParallel.簽核人員;
                                if (beforeWho.使用者職務代碼 == who.使用者職務代碼 && beforeWho.單位代碼 == who.單位代碼) {
                                    //同一人
                                    last = paperEdits[paperEdits.length - 1];
                                    lastWho = last.簽核人員;
                                    if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                                        //剔掉最後一筆
                                        paperEdits.splice(paperEdits.length - 1, 1, edition);
                                    } else {
                                        paperEdits.push(edition);
                                    }
                                } else {
                                    //不同人
                                    paperEdits.splice(lastParallel + 1, 0, edition);
                                }
                            } else {
                                last = paperEdits[paperEdits.length - 1];
                                lastWho = last.簽核人員;
                                if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                                    //剔掉最後一筆
                                    paperEdits.splice(paperEdits.length - 1, 1, edition);
                                } else {
                                    paperEdits.push(edition);
                                }
                            }
                        }
                    } else {
                        paperEdits.push(edition);
                    }
                } else {
                    var lastParallel = -1;
                    Ext.Array.each(paperEdits, function (item, index) {
                        var who1 = item.簽核人員;
                        if (who1.單位代碼 == who.單位代碼) {
                            lastParallel = index;
                        }
                    });

                    if (lastParallel != -1) {
                        if (lastParallel > lastPush) {
                            last = paperEdits[lastParallel];
                            lastWho = last.簽核人員;
                            if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                                //剔掉最後一筆
                                paperEdits.splice(lastParallel, 1, edition);
                            } else {
                                paperEdits.splice(lastParallel + 1, 0, edition);
                            }
                        } else {
                            last = paperEdits[paperEdits.length - 1];
                            lastWho = last.簽核人員;
                            if (lastWho.使用者職務代碼 == who.使用者職務代碼 && lastWho.單位代碼 == who.單位代碼) {
                                //剔掉最後一筆
                                paperEdits.splice(paperEdits.length - 1, 1, edition);
                            } else {
                                paperEdits.push(edition);
                            }
                        }
                    } else {
                        paperEdits.push(edition);
                    }
                }
            }
        });

        Ext.Array.each(options.papers, function (p) {
            var no = 0;
            // if (p.text == '來文' && !isOnlyFollow) return true;
            var hasData = false;
            rows.push(Ext.String.format(formatPaper, 'p' + p.paperNo, _x, _y, size * 1.4, p.text));
            Ext.Array.each(paperEdits, function (edition, idx) {
                var who = edition.簽核人員;
                Ext.Array.each(edition.簽核文件夾.文稿, function (paper) {
                    if (paper.代碼 == p.paperNo) {
                        no++;
                        _y = _y + rowH;

                        var doType = edition.線上簽核資訊.簽核流程.異動別;

                        if (who.代理名稱)
                            txt = Ext.String.format('{0}.{1} {2} {3} (代理：{4} {5})  {6} {7}', no, who.所屬機構, who.服務單位, who.使用者名稱, who.代理職稱, who.代理名稱, edition.最後更新時間, doType);
                        else
                            txt = Ext.String.format('{0}.{1} {2} {3} {4}　{5} {6}', no, who.所屬機構, who.服務單位, who.使用者職稱, who.使用者名稱, edition.最後更新時間, doType);

                        if (who.是否會辦 == '是') {
                            rows.push(Ext.String.format(formatText, 'by' + idx, _x + 20, _y, size, 'paragraph_desc', txt));
                        } else {
                            rows.push(Ext.String.format(formatText, 'by' + idx, _x, _y, size, 'paragraph_desc', txt));
                        }

                        _y = _y + rowH;
                        txt = paper.批示意見.content || '';

                        var lines = (txt + '').split('\n');
                        Ext.Array.each(lines, function (p) {
                            if (who.是否會辦 == '是') {
                                rows.push(Ext.String.format(formatText, 'op' + idx, _x + 20, _y, size, 'paragraph_desc', p));
                            } else {
                                rows.push(Ext.String.format(formatText, 'op' + idx, _x, _y, size, 'paragraph_desc', p));
                            }
                        });

                        if (doType == '決行') {
                            rows.push(Ext.String.format(formatKind, p.paperNo + '-' + no, _x, _y, size, ''));
                            rows.push(Ext.String.format(formatText, 'op' + idx, _x, _y, size, 'normal', ''));
                        } else {
                            if (txt != '')
                                rows.push(Ext.String.format(formatText, 'op' + idx, _x, _y, size, 'normal', ''));
                        }
                    }
                });
                hasData = true;
            });

            if (hasData == false) rows.pop();
        });

        var svgString = this.closeTagToSvg(rows);

        return { xml: svgString };
    },
    /**
     * current wk to di
     *
     * @param {String} swFileName sw檔案名，無時預設 類型.sw，如:函.sw
     * @return {String}
     */
    generateXDI: function (options, att) {
        //console.log(options);
        var me = this;
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();

        options = options || {};
        var swFileName = options.swFileName;
        var data = options.data;
        var sendType = options.sendType;
        var sendNE = options.sendNE;
        var sendLV = options.sendLV;
        var attachsAdd = options.attachsAdd;
        var sendDM = options.sendDM;
        var isAddr = options.isAddr;

        var isExport = false;
        if (options.isExport) isExport = true;

        if (!swFileName) swFileName = wk.DocumentType + '.sw';

        var ctr = OA.common.Paper.main();
        var fs = OA.common.Paper.getActiveFields();
        if (!fs) {
            var modelName = OA.common.DIMgr.getModelName('wk', wk.DocumentType);
            var record = Ext.create(modelName);
            fs = record.getFields().map['layout'].config.mapping();
        }
        var diFields = Ext.Array.filter(fs, function (item) {
            return !item.wk || ((item.key === '檔號' || item.key === '保存年限' || item.key === '稿面註記' || item.key === '承辦單位' || item.key === '決行層級' || item.key === '處理級別') && isExport);
        });

        var docType = this.getDocType(wk.DocumentType);
        var items = [], i = 0;
        items.push('<?xml version="1.0" encoding="utf-8"?>' + this.getDIDtd(docType));

        var attachItem = OA.common.InitParas.getAttachItem();
        var _attachsVI = attachItem.vi;
        if (!attachsAdd) {
            attachsAdd = _attachsVI.where("( el, i, res, param ) =>el.folderName =='attach'&&el.status!='0'");
        }

        var attachsAddDesc = [];
        if (options.isMailSend) {
        } else {
            var isAddAttach = (options.sendType != '分址分文' || options.data && options.data.KEY !== '副本') && attachsAdd.length > 0;
            var isCopyHasAttach = (options.data && options.data.KEY === '副本' && options.data.ATTACH === 'Y') && attachsAdd.length > 0;
            if (isCopyHasAttach) isAddAttach = true;
            // <!ENTITY ATTCH1 SYSTEM "21329930_10670274800A0C_ATTCH1.doc" NDATA _X>           
            if (attachsAdd.length > 0) {
                if (options.sendType) {
                    if (isAddAttach && att) {
                        if (options.sendType == '分址分文') {
                            var allAtt = _attachsVI.where("( el, i, res, param ) =>el.folderName =='attach'&&el.status!='0'");
                            if (options.data && options.data.chooseAtt != undefined) {
                                var chooseAtts = options.data.chooseAtt.split('、');
                                Ext.Array.forEach(allAtt, function (item, idx) {
                                    //console.log('this');
                                    if (chooseAtts.indexOf(item.fileKey) != -1) {
                                        items.push(Ext.String.format('<!ENTITY #ATTCHNO{0}# SYSTEM "#ATTCHNAME{0}#" NDATA _X>', idx + 1));
                                        attachsAddDesc.push('ATTCH' + (idx + 1));
                                    }
                                });
                            } else {
                                Ext.Array.forEach(attachsAdd, function (item, idx) {
                                    items.push(Ext.String.format('<!ENTITY #ATTCHNO{0}# SYSTEM "#ATTCHNAME{0}#" NDATA _X>', idx + 1));
                                    attachsAddDesc.push('ATTCH' + (idx + 1));
                                });
                            }
                        } else {
                            Ext.Array.forEach(attachsAdd, function (item, idx) {
                                items.push(Ext.String.format('<!ENTITY #ATTCHNO{0}# SYSTEM "#ATTCHNAME{0}#" NDATA _X>', idx + 1));
                                attachsAddDesc.push('ATTCH' + (idx + 1));
                            });
                        }
                    }
                } else {
                    Ext.Array.forEach(attachsAdd, function (item, idx) {
                        items.push(Ext.String.format('<!ENTITY ATTCH{0} SYSTEM "{1}" NDATA _X>', idx + 1, item.fileName));
                        attachsAddDesc.push('ATTCH' + (idx + 1));
                    })
                }
            }

            if (options.sendType) {
                items.push(Ext.String.format('<!ENTITY 表單 SYSTEM "#SW#" NDATA DI>', swFileName));
            } else {
                items.push(Ext.String.format('<!ENTITY 表單 SYSTEM "{0}" NDATA DI>', swFileName));
            }

            if (sendDM)
                items.push(Ext.String.format('<!ENTITY 文書訊息表單 SYSTEM "#DM#" NDATA DM>'));

            items.push('<!NOTATION DI SYSTEM "">');
            items.push('<!NOTATION _X SYSTEM "">');

            if (sendDM)
                items.push('<!NOTATION DM SYSTEM "">');

        }

        items.push(']>');
        items.push(Ext.String.format('<{0}>', docType));
        //console.log(vm)
        Ext.Array.forEach(diFields, function (item) {
            if (item.key === '發文機關') {
                for (i = 1; i <= vm.機關數; i++) {
                    items.push(Ext.String.format('<{0}>', item.key));
                    items.push(Ext.String.format('<全銜>{0}</全銜>', vm['發文機關_' + i]));
                    items.push(Ext.String.format('<機關代碼>{0}</機關代碼>', vm['機關代碼_' + i]));
                    items.push(Ext.String.format('</{0}>', item.key));
                }
                if (docType == '函' || docType == '令') {
                    items.push(Ext.String.format('<{0}類別 代碼="{1}" />', docType, wk.DocumentType));
                }
            }
            else if (item.key === '檔號') {
                var no1 = vm.年度;
                var no2 = vm.分類號;
                var no3 = vm.案次號;
                items.push(Ext.String.format('<{0}>', item.key));
                if (vm.年度 && vm.年度.toString().trim()) items.push(Ext.String.format('<年度>{0}</年度>', no1.trim()));
                if (vm.分類號 && vm.分類號.toString().trim()) items.push(Ext.String.format('<分類號>{0}</分類號>', no2.trim()));
                if (vm.案次號 && vm.案次號.toString().trim()) items.push(Ext.String.format('<案次號>{0}</案次號>', no3.trim()));
                items.push(Ext.String.format('</{0}>', item.key));
            }
            //新增匯出DI檔，檔號 保存年限 0303 Chloe.Sia
            else if (item.key === '保存年限') {
                if (vm.保存年限) items.push(Ext.String.format('<保存年限>{0}</保存年限>', vm.保存年限));
            }
            /*
            else if (item.key === '稿面註記') {
                // items.push(Ext.String.format('<稿面註記>{0}</稿面註記>', vm.稿面註記_title));
                items.push(Ext.String.format('<{0}>', item.key));
                items.push(Ext.String.format('<擬辦方式>{0}</擬辦方式>', vm.擬辦方式_title));
                items.push(Ext.String.format('  '));
                items.push(Ext.String.format('  '));
                items.push(Ext.String.format('<應用限制>{0}</應用限制>', vm.應用限制_title));
                items.push(Ext.String.format('</{0}>', item.key));
            }
            */
            else if (item.key === '決行層級') {
                if (vm.稿面註記_title.length > 1) { items.push(Ext.String.format('<決行層級>{0}</決行層級>', vm.決行層級_title)); }
            } else if (item.key === '處理級別') {
                items.push(Ext.String.format('<處理級別>{0}</處理級別>', vm.處理級別_title));
            }
            else if (item.key === '聯絡方式') {
                //if (isExport) items.push(Ext.String.format('<{0}>', item.key));
                if (vm.承辦人) items.push(Ext.String.format('<聯絡方式>承辦人：{0}</聯絡方式>', vm.承辦人));
                if (vm.電話 && vm.電話.toString().trim()) items.push(Ext.String.format('<聯絡方式>電話：{0}</聯絡方式>', vm.電話));
                if (vm.傳真 && vm.傳真.toString().trim()) items.push(Ext.String.format('<聯絡方式>傳真：{0}</聯絡方式>', vm.傳真));
                if (vm.電子信箱 && vm.電子信箱.toString().trim()) items.push(Ext.String.format('<聯絡方式>電子信箱：{0}</聯絡方式>', vm.電子信箱));
                //if (isExport) items.push(Ext.String.format('</{0}>', item.key));
            }
            /*
            else if (item.key === '承辦單位') {
                items.push(Ext.String.format('<{0}>', item.key));
                items.push(Ext.String.format('<文字>{0}</文字>', vm[item.key]));
                items.push(Ext.String.format('</{0}>', item.key));
            }
            */
            else if (item.key === '受文者') {
                items.push(Ext.String.format('<{0}>', item.key));
                var name = '';
                if (sendType) name = '如行文單位';
                items.push(Ext.String.format('<交換表 交換表單="表單">{0}</交換表>', name));
                items.push(Ext.String.format('</{0}>', item.key));
            }
            else if (item.key === '發文日期') {
                items.push(Ext.String.format('<{0}>', item.key));
                items.push(Ext.String.format('<年月日>{0}</年月日>', vm.發文日期));
                items.push(Ext.String.format('</{0}>', item.key));
            } else if (item.key === '發文字號') {
                for (i = 1; i <= vm.機關數; i++) {
                    items.push(Ext.String.format('<{0}>', item.key));
                    items.push(Ext.String.format('<字>{0}</字>', vm['發文字號_字_' + i]));
                    items.push(Ext.String.format('<文號>'));
                    items.push(Ext.String.format('<年度>{0}</年度>', vm['發文字號_年度_' + i]));
                    items.push(Ext.String.format('<流水號>{0}</流水號>', vm['發文字號_流水號_' + i]));
                    items.push(Ext.String.format('<支號>{0}</支號>', vm['發文字號_支號_' + i]));
                    items.push(Ext.String.format('</文號>'));
                    items.push(Ext.String.format('</{0}>', item.key));
                }
            }
            else if (item.key === '速別') {
                var speed = (vm.速別) ? vm.速別 : '普通件';
                if ((speed + '').trim() == '') speed = '普通件'
                items.push(Ext.String.format('<速別 代碼="{0}" />', speed));
            }
            else if (item.key === '密等及解密條件或保密期限') {
                var s1 = vm.密等 || '';
                var s2 = vm.解密條件或保密期限 || '';
                items.push(Ext.String.format('<{0}>', item.key));
                items.push(Ext.String.format('<密等>{0}</密等>', s1.trim()));
                items.push(Ext.String.format('<解密條件或保密期限>{0}</解密條件或保密期限>', s2.trim()));
                items.push(Ext.String.format('</{0}>', item.key));
            }
            else if (item.key === '附件') {
                var hasBig = false;
                var store = Ext.getStore('Attach');
                if (store) {
                    Ext.Array.each(store.data.all, function (t) {
                        if (t.data.sort && t.data.file.status == '1' && t.data.sort === 'big') {
                            hasBig = true;
                            return false;
                        }
                    });
                }

                items.push(Ext.String.format('<附件>', item.key));
                if (data) {
                    //分址分文
                    if (data.ATTACH !== 'N')
                        items.push(Ext.String.format('<文字>{0}</文字>', vm[item.key]));
                    else {
                        if (hasBig && sendType)
                            items.push(Ext.String.format('<文字></文字>'));
                        else
                            items.push(Ext.String.format('<文字>{0}</文字>', vm[item.key]));
                    }
                } else {
                    //一文多發
                    if (att)
                        items.push(Ext.String.format('<文字>{0}</文字>', vm[item.key]));
                    else {
                        if (hasBig && sendType)
                            items.push(Ext.String.format('<文字>{0}</文字>', ''));
                        else
                            items.push(Ext.String.format('<文字>{0}</文字>', vm[item.key]));
                    }
                }
                if (isAddAttach && att)
                    items.push(Ext.String.format('<附件檔名 附件名="{0}"/>', attachsAddDesc.join(' ')));
                items.push(Ext.String.format('</附件>', item.key));
            } else if (item.key === '開會事由' || item.key === '開會地點' || item.key === '會勘事由' || item.key === '會勘地點') {
                items.push(Ext.String.format('<{0}>', item.key));
                items.push(Ext.String.format('<文字>{0}</文字>', vm[item.key]));
                items.push(Ext.String.format('</{0}>', item.key));
            }
            else if (item.key === 'KDRichTextBlock') {
                vm.DocumentType = wk.DocumentType;
                items = me.doKDRichTextBlockList(items, vm, sendType ? true : false);
            }
            else if (item.key === '署名') {
                if (sendNE) {
                    //署名寫入
                    for (i = 1; i <= vm.署名數1; i++) {
                        items.push(Ext.String.format('<署名>{0}</署名>', vm['署名1_' + i]));
                    }
                }
                else
                    items.push('<署名 />');

                if (sendLV) {
                    //分層負責寫入
                    items.push('<署名 />');
                    items.push(Ext.String.format('<署名>{0}</署名>', vm['分層負責_' + 'title']));
                }
            }
            else if (item.key === '地址') {
                var addr = vm.地址;
                if (vm.辦公地址) addr = addr + '（' + vm.辦公地址 + '）';
                items.push(Ext.String.format('<地址>{0}</地址>', addr));
            }
            else if (item.key === '正本' || item.key === '副本' || item.key === '出席者' || item.key === '列席者') {

                if (options.sendType) {
                    if (item.key === '抄本') return;
                }

                if (vm[item.key]) {
                    if (data) {
                        //分址分文
                        if (item.key == data.KEY) {
                            items.push(Ext.String.format('<{0}>', item.key));
                            // items.push(Ext.String.format('<全銜>{0}</全銜>', data.CODENAME));
                            // 分址分文正副本受文者全銜修正 - by yi-chi chiu
                            items.push(Ext.String.format('<全銜>{0}</全銜>', (data.VALUE + '').trim()));
                            items.push(Ext.String.format('</{0}>', item.key));
                        } else {
                            if (data.KEY == '副本') {

                                if (options.sendSA) {
                                    var books = vm[item.key].split('、');
                                    items.push(Ext.String.format('<{0}>', item.key));
                                    Ext.Array.forEach(books, function (b) {
                                        items.push(Ext.String.format('<全銜>{0}</全銜>', b));
                                    });
                                    items.push(Ext.String.format('</{0}>', item.key));
                                } else {
                                    if (item.key == '正本' || item.key === '出席者')
                                        items.push(Ext.String.format('<{0}><全銜> </全銜></{1}>', item.key, item.key));
                                    else
                                        items.push(Ext.String.format('<{0} />', item.key));
                                }
                            } else {

                                if (item.key == '正本' || item.key === '出席者')
                                    items.push(Ext.String.format('<{0}><全銜> </全銜></{1}>', item.key, item.key));
                                else
                                    items.push(Ext.String.format('<{0} />', item.key));
                            }
                        }
                    } else {
                        //一文多發                          
                        if ((vm[item.key] + '').trim().length > 0) {//檢核空白受文者
                            if (wk) {
                                var tagText = OA.common.Utils.getTagText(wk, item.key);
                                if (tagText) {
                                    items.push(Ext.String.format('<{0}>', item.key));
                                    Ext.Array.each(tagText.childNodes, function (t) {
                                        if (item.key == '副本') {
                                            var secondary = vm.ContactList.where("( el, i, res, param ) =>el.KEY=='副本'");
                                            if (secondary) {
                                                secondary.filter(function (n1) {
                                                    if (n1.VALUE == t.Value && n1.ATTACH == 'Y')
                                                        t.Value = (t.Value + '').trim() + '（含附件）';
                                                });
                                            }
                                        }
                                        if (isAddr) {//DI（含地址）
                                            var addrValue = vm.ContactList.where("( el, i, res, param ) =>el.KEY=='" + item.key + "'" + "&&el.VALUE=='" + t.Value + "'");
                                            if (addrValue && addrValue.length > 0) {
                                                items.push(Ext.String.format('<全銜 發文方式="{0}">{1}', addrValue[0].TRANSTYPENAME == '電子' ? '電子交換' : addrValue[0].TRANSTYPENAME, (t.Value + '').trim() || ''));
                                                items.push(Ext.String.format('<傳送方式>{0}</傳送方式>', addrValue[0].TRANSTYPENAME));
                                                items.push(Ext.String.format('<郵遞區號>{0}</郵遞區號>', addrValue[0].ARCENO || ''));
                                                items.push(Ext.String.format('<地址>{0}</地址>', addrValue[0].ADDR || ''));
                                                items.push(Ext.String.format('<通訊錄名稱 機關代碼="{0}" 單位代碼="">{1}</通訊錄名稱>', addrValue[0].CODE || '', addrValue[0].CODENAME || ''));
                                                items.push('</全銜>');
                                            }
                                        } else {
                                            items.push(Ext.String.format('<全銜>{0}</全銜>', (t.Value + '').trim()));
                                        }
                                    });
                                    items.push(Ext.String.format('</{0}>', item.key));
                                } else
                                    items.push(Ext.String.format('<{0} />', item.key));
                            } else {
                                if (isAddr) {//DI（含地址）
                                    var addrValue = vm.ContactList.where("( el, i, res, param ) =>el.KEY=='" + item.key + "'" + "&&el.VALUE=='" + t.Value + "'");
                                    if (addrValue && addrValue.length > 0) {
                                        items.push(Ext.String.format('<全銜 發文方式="{0}">{1}', addrValue[0].TRANSTYPENAME == '電子' ? '電子交換' : addrValue[0].TRANSTYPENAME, (t.Value + '').trim() || ''));
                                        items.push(Ext.String.format('<郵遞區號>{0}</郵遞區號>', addrValue[0].ARCENO || ''));
                                        items.push(Ext.String.format('<地址>{0}</地址>', addrValue[0].ADDR || ''));
                                        items.push(Ext.String.format('<通訊錄名稱 機關代碼="{0}" 單位代碼="">{1}</通訊錄名稱>', addrValue[0].CODE || '', addrValue[0].CODENAME || ''));
                                        items.push('</全銜>');
                                    }
                                } else {
                                    var books = vm[item.key].split('、');
                                    items.push(Ext.String.format('<{0}>', item.key));
                                    Ext.Array.forEach(books, function (b) {
                                        items.push(Ext.String.format('<全銜>{0}</全銜>', b));
                                    });
                                }
                                items.push(Ext.String.format('</{0}>', item.key));
                            }
                        } else {
                            if (item.key == '正本') {
                                items.push(Ext.String.format('<{0}><全銜> </全銜></{1}>', item.key, item.key));
                            } else {
                                items.push(Ext.String.format('<{0} />', item.key));
                            }
                        }
                    }
                }
            } else if (item.key === '聯絡人及電話') {
                //需插入在受文者下方
                if (vm.聯絡人及電話) {
                    var g = vm.聯絡人及電話.split('、');
                    var child = [];
                    //console.log(g);
                    child.push(Ext.String.format('<{0}>', item.key));
                    Ext.Array.forEach(g, function (t) {
                        var f = t.split(' ');
                        child.push(Ext.String.format('<姓名>{0}</姓名>', f[0] || ''));
                        child.push(Ext.String.format('<職稱>{0}</職稱>', f[1] || ''));
                        var phone = '';
                        Ext.Array.each(f, function (ff, index) {
                            if (index > 1) {
                                phone = phone.length > 0 ? phone + ' ' + ff : phone + ff;
                            }
                        });
                        //child.push(Ext.String.format('<電話>{0}</電話>', f[2] || ''));
                        child.push(Ext.String.format('<電話>{0}</電話>', phone || ''));
                        //console.log(phone);
                    });
                    child.push(Ext.String.format('</{0}>', item.key));
                    var index = items.indexOf('</受文者>');
                    if (index !== -1)
                        items.splice(index + 1, 0, child.join(''));
                }
            } else if (item.key === '開會時間' || item.key === '會勘時間') {
                var week = (vm.星期) ? vm.星期.replace('星期', '') : '';
                items.push(Ext.String.format('<{0}>', item.key));
                items.push(Ext.String.format('<年月日>{0}</年月日>', vm.年月日));
                items.push(Ext.String.format('<星期>{0}</星期>', week));
                items.push(Ext.String.format('<時分>{0}</時分>', vm.時分));
                items.push(Ext.String.format('</{0}>', item.key));
            } else if (item.key === '通話時間') {
                items.push(Ext.String.format('<{0}>', item.key));
                var dts = OA.common.Utils.getDateData(wk, item.key);
                if (dts) {

                    items.push(Ext.String.format('<年月日>{0}</年月日>', dts.年月日));
                    items.push(Ext.String.format('<時分>{0}</時分>', dts.時分));
                    items.push(Ext.String.format('<年月日止>{0}</年月日止>', dts.年月日止));
                    items.push(Ext.String.format('<時分止>{0}</時分止>', dts.時分止));
                }
                items.push(Ext.String.format('</{0}>', item.key));
            } else if (item.key === '主持人') {
                items.push(Ext.String.format('<{0}>', item.key));
                items.push(Ext.String.format('<姓名>{0}</姓名>', vm[item.key]));
                items.push(Ext.String.format('</{0}>', item.key));
            } else if (item.key === '年月日') {
                items.push(Ext.String.format('<{0}>{1}</{2}>', item.key, vm[item.key + '_title'], item.key));
            } else if (item.key === '機關') {
                if (vm[item.key]) {
                    items.push(Ext.String.format('<{0}>', item.key));
                    items.push(Ext.String.format('<全銜>{0}</全銜>', vm[item.key].replace('於', '').trim()));
                    items.push(Ext.String.format('</{0}>', item.key));
                }
            } else if (item.key === '結尾自稱語') {
                if (vm[item.key]) {
                    items.push(Ext.String.format('<{0}>', item.key));
                    items.push(Ext.String.format('<全銜>{0}</全銜>', vm[item.key]));
                    items.push(Ext.String.format('</{0}>', item.key));
                }
            }
            else { //會勘事由,會勘地點,聯絡單位

                if (options.sendType) {
                    if (item.key === '抄本') return;
                }
                var content = (vm[item.key]) ? vm[item.key] : '';
                items.push(Ext.String.format('<{0}>{1}</{2}>', item.key, content, item.key));
            }
        });

        items.push(Ext.String.format('</{0}>', docType));

        return items.join('');
    },
    /**
     * generate wk json object
     * @return {Object}
     * @param _childNodesHeader
     * @param _childNodesKRB
     * @param _childNodesFooter
     * @param values
     */
    generateWK: function (_childNodesHeader, _childNodesKRB, _childNodesFooter, values) {
        var d = OA.common.Global.getCurrentDept();
        var r = OA.common.Global.getCurrentRole();
        var u = OA.common.Global.getCurrentUser();
        var p = OA.common.Global.getInitParas();
        var f = OA.common.Global.getCurrentDocFlowRecord();
        var qs = OA.common.Global.getQ();

        var defaultSubj = '主旨';
        if (_childNodesKRB && _childNodesKRB.length > 1) {
            if (_childNodesKRB[0].BulletNo && _childNodesKRB[0].BulletNo == '主旨：') {
                if (_childNodesKRB[1].childNodes && _childNodesKRB[1].childNodes.length > 0) {
                    defaultSubj = _childNodesKRB[1].childNodes[0] || '主旨';
                }
            }

        }

        var version = '0', sentNo = '', doSno = '';
        if (!d) {
            d = {
                orgNo: p.orgNo,
                depName: p.depName,
                orgId: p.orgId
            }
        }
        if (!r) {
            r = {
                jobNo: p.jobNo,
                roleId: p.roleId
            }
        }

        if (!u) {
            u = {
                userId: p.userId,
                depNo: d.depNo,
                empName: p.empName
            }
        }

        //非創稿，新文稿帶目前
        if (!values.qIsNew) {
            if (OA.common.VIMgr) {
                if (OA.common.VIMgr.getCurrentEdition()) version = OA.common.VIMgr.getCurrentEdition().版號.toString();
            }
        }

        if (p) doSno = (p.doSno) ? p.doSno : '';

        var wkContent = {
            "發文文號": sentNo,
            "doSno": doSno,
            "orgNo": d.orgNo,
            "depName": d.depName,
            "empNo": u.userId,
            "childNodes": [
                {
                    "tagName": "TextDisplay",
                    "childNodes": [],
                    "DisplayPanelName": "Header"
                },
                {
                    "tagName": "KDRichTextBlock",
                    "childNodes": [],
                    "LineHeight": 1.1
                },
                {
                    "tagName": "TextDisplay",
                    "childNodes": [],
                    "DisplayPanelName": "Footer"
                },
                {
                    "tagName": "手寫板"
                },
                {
                    "tagName": "主旨",
                    "childNodes": [
                        {
                            "tagName": "文字",
                            "childNodes": [defaultSubj]
                        }
                    ]
                },
                {
                    "tagName": "附件清單"
                },
                {
                    "tagName": "批示意見",
                    "childNodes": [
                        {
                            "tagName": "文字"
                        }
                    ],
                    "Version": "0"
                },
                {
                    "tagName": "案情摘要",
                    "childNodes": [
                        {
                            "tagName": "文字"
                        }
                    ]
                },
                {
                    "tagName": "核章區文字",
                    "childNodes": [
                        {
                            "tagName": "文字",
                            "childNodes": [
                                {
                                    "Key": '承辦單位電話',
                                    "Value": values.tel,
                                    "tagName": "Property"
                                }
                            ]
                        }
                    ]
                }
            ],
            // "depNo": u.depNo,
            "depNo": d.depNo,
            "LastUpdateTime": OA.common.Utils.getChineseDate(),
            "DocumentTemplate": values.qTemplate,
            "orgId": d.orgId,
            "doDeptno": (f) ? f.get('doDeptno') : '',
            "empName": u.empName,
            "給號方式": (values.qNumberWay == '1') ? '自動給號' : '預先提號',
            "AssigneeJob": "",
            "tagName": "VerWork",
            "SeqNumber": '0',
            "AssigneeName": "",
            // "jobNo": padLeft(r.jobNo, 7),
            "jobNo": r.jobNo,
            "DocumentType": values.qFormat,
            "Version": version,
            "roleId": r.roleId,
            "genDocNo": values.qNumberWay,
            "mainSno": (qs.mainSno) ? qs.mainSno : ''
        };

        wkContent.childNodes[0].childNodes = _childNodesHeader;
        wkContent.childNodes[1].childNodes = _childNodesKRB;
        wkContent.childNodes[2].childNodes = _childNodesFooter;
        return wkContent;
    },
    /**
     * generate wk json object
     * @param {Array} fields 欄位
     * @param values
     * @return {Object}
     */
    generateNewWK: function (fields, values) {
        var me = this;
        var qd = OA.common.Global.getQueryDefault();
        var p = OA.common.Global.getInitParas();
        var d = OA.common.Global.getCurrentDept();
        var vm = OA.common.Global.getCurrentViewModel();
        var qs = OA.common.Global.getQ();
        var sentNo = '0';

        //發文機關
        var sentOrg = Ext.Array.filter(qd.交換資訊.發文機關.機關, function (p) {
            //console.log(p);
            if (p.預設 == "Y") return true;
        })[0];

        //聯絡方式
        var contact = [];
        Ext.Array.forEach(qd.交換資訊.聯絡方式, function (way) {
            var t = (way.Title) ? way.Title : '';
            var c = (way.content) ? way.content : '';
            contact.push(t + c);
            if (way.Title == '電話：') values.tel = way.content;
        });



        var member1 = [];
        var member2 = [];

        // 1103 條戳顯示 Chloe.sia
        if (values.qFormat == '開會通知單' || values.qFormat == '書函' || values.qFormat == '會勘通知單' || values.qFormat == '箋函'
            || values.qFormat == '交辦案件通知單' || values.qFormat == '催辦案件通知單' || values.qFormat == '交議案件通知單' || values.qFormat == '移文單'
            || values.qFormat == '機密文書機密等級變更或註銷建議單' || values.qFormat == '機密文書機密等級變更或註銷通知單') {
            //if (q.條戳) {
            //    member1.push('(　' + q.條戳.split('').join('　') + '　條　戳　)');
            //}

            //if (q.稿戳) {
            //    member2.push('(　' + q.稿戳.split('').join('　') + '　稿　戳　)');
            //}


            if (qd.交換資訊.條戳) {
                member1.push(qd.交換資訊.條戳.field2);
                member2.push(qd.交換資訊.條戳.field1);
            }
        } else {
            // 1103 署名 稿署名 顯示 Chloe.sia
            //member1 = q.發文機關.機關[0].署名.人員;
            //member2 = q.發文機關.機關[0].稿署名.人員;
            //console.log(sentOrg);
            if (Ext.isArray(sentOrg.署名.人員)) {
                member1 = sentOrg.署名.人員;
            } else {
                if (sentOrg.署名.人員) member1.push(sentOrg.署名.人員);
            }

            if (Ext.isArray(sentOrg.稿署名.人員)) {
                member2 = sentOrg.稿署名.人員;
            } else {
                if (sentOrg.稿署名.人員) member2.push(sentOrg.稿署名.人員);
            }
        }

        // if(Ext.getCmp('officialFormat') != undefined ) {
        //     var officialFormat = Ext.getCmp('officialFormat').getValues();
        //     if(officialFormat.中心全銜_title == true){
        //         member1 = ["財團法人金融聯合徵信中心"];
        //         member2 = ["財團法人金融聯合OOOO"];
        //     }else {
        //         if(officialFormat.決行層級_title == '董事長') {
        //             member1 = [q.署名.人員[0]];
        //             member2 = [q.稿署名.人員[0]];
        //         } else if (officialFormat.決行層級_title == '總經理') {
        //             member1 = [q.署名.人員[1]];
        //             member2 = [q.稿署名.人員[1]];
        //         } else if (officialFormat.決行層級_title == '副總經理') {
        //             member1 = [q.署名.人員[2]];
        //             member2 = [q.稿署名.人員[2]];
        //         }  else if (officialFormat.決行層級_title == '經理') {
        //             member1 = [q.署名.人員[3]];
        //             member2 = [q.稿署名.人員[3]];
        //         }
        //     }
        // }else {
        //    member1 = [q.署名.人員];
        //    member2 = [q.稿署名.人員];
        // }

        if (member1 && member1.length <= 0) member1.push('');
        if (member2 && member2.length <= 0) member2.push('');

        if (member1 && member1.length != 0) {
            //署名,稿署名
            var names = [];
            Ext.Array.forEach(member1, function (p) {
                names.push({
                    "Value": p,
                    "Key": "署名",
                    "Type": sentOrg.名稱,
                    "tagName": "Property"
                });
            });
        }

        if (member2 && member2.length != 0) {
            Ext.Array.forEach(member2, function (p) {
                names.push({
                    "Value": p,
                    "Key": "稿署名",
                    "Type": sentOrg.名稱,
                    "tagName": "Property"
                });
            });
        }

        //日期
        var wkDate = OA.common.Utils.toWkDates(new Date());

        var _childNodesHeader = [], _childNodesFooter = [], idxHeader = 0, idxFooter = 0;
        Ext.Array.forEach(fields, function (f) {
            var header = Ext.clone(me.TEMPLATE.Header[f.key]);
            if (header) {
                if (f.key == '檔號') {
                    if (!values.qIsNew) {
                        if (vm) {
                            header.childNodes[0].Value = vm.年度;
                            header.childNodes[1].Value = vm.分類號;
                            header.childNodes[2].Value = (vm.案次號) ? vm.案次號 : '';
                        }
                    }
                } else if (f.key == '保存年限') {
                    if (!values.qIsNew) {
                        if (vm) {
                            header.childNodes[0].Value = vm.保存年限;
                        }
                    }
                } else if (f.key == '發文機關') {
                    header.childNodes[0].Key = qd.交換資訊.發文機關全銜 + '；' + qd.交換資訊.發文機關全銜;
                    header.childNodes[0].Value = qd.交換資訊.發文機關代碼;
                    header.childNodes[1].Value = sentOrg.level; //發文層級預設本機關
                } else if (f.key == '機關名稱' || f.key == '主辦機關') {
                    header.childNodes[0].Value = qd.交換資訊.發文機關全銜;
                } else if (f.key == '主辦單位') {
                    header.childNodes[0].Value = qd.交換資訊.所屬局處;
                } else if (f.key == '總收文號') {
                    header.childNodes[0].Value = qd.交換資訊.來文文號;
                } else if (f.key == '地址') {
                    header.childNodes[0].Value = qd.交換資訊.地址 || '';
                    header.childNodes[1].Value = qd.交換資訊.辦公地址 || '';
                } else if (f.key == '聯絡人及電話') {
                    var uName = OA.common.Global.getCurrentUser().empName || '';
                    var uJob = OA.common.Global.getCurrentRole().jobName || '';
                    var uTel = OA.common.Global.getCurrentUser().telNo || '';
                    uTel = uTel.replace('、', '#');
                    header.childNodes[0].Value = uName;
                    header.childNodes[1].Value = uJob;
                    header.childNodes[2].Value = uTel;
                } else if (f.key == '聯絡方式') {
                    header.childNodes[0].Value = contact[0];
                    header.childNodes[1].Value = contact[1];
                    header.childNodes[2].Value = contact[2];
                    header.childNodes[3].Value = contact[3];
                    if (qd && qd.交換資訊.股別) {
                        header.childNodes[0].Value = "承辦人：" + qd.交換資訊.股別;
                    }
                    /*
                    if(Ext.getCmp('officialFormat') != undefined ) {
                        var officialFormat = Ext.getCmp('officialFormat').getValues();
                        if(officialFormat.承辦人簡稱_title == true){
                            header.childNodes[0].Value = "承辦人：" + q.承辦人.簡稱;
                            header.childNodes[1].Value = contact[1];
                            header.childNodes[2].Value = contact[2];
                            header.childNodes[3].Value = contact[3];
                        }
                    }
                    */
                } else if (f.key == '末啟詞') {
                    if (values.qFormat == '電子信箱回覆函') {
                        header.childNodes[0].Value = '健康平安';
                    }
                } else if (f.key == '結尾自稱語') {
                    if (values.qFormat == '箋函') {
                        header.childNodes[0].Key = '勛綏';
                        header.childNodes[0].Value = '勛綏';
                    }
                } else if (f.key == '敬復') {
                    header.childNodes[0].Value = qd.交換資訊.機構名稱 + '　敬復';
                } else if (f.key == '年月日') {
                    header.childNodes[0].Value = wkDate[0];
                } else if (f.key == '機關') {
                    if (values.名稱) {
                        header.childNodes[0].Key = values.名稱;
                        header.childNodes[0].Value = values.單位代碼;
                    } else {
                        //header.childNodes[0].Key = q.所屬局處;
                        header.childNodes[0].Key = d.depName;
                        header.childNodes[0].Value = qd.交換資訊.局處代碼;
                    }
                } else if (f.key == '承辦單位') {
                    //console.log(header);
                    header.childNodes[0].Value = d.depName || '';
                } else if (f.key == '發文字號') {
                    header.childNodes[0].Value = sentOrg.發文字;
                    if (values.qIsNew) {
                        var docflow = OA.common.Global.getCurrentDocFlowRecord();
                        if (qs.genDocNo === '2') {
                            p.doSno = qs.doSno;
                        } else if (docflow && docflow.get('doSno')) {
                            p.doSno = docflow.get('doSno');
                        }
                    }
                    console.log(values);
                    if (!values.qIsNew) { // add paper
                        if (p && p.doSno) {
                            var year = p.doSno.substring(0, 3);
                            //var flow = p.doSno.substring(3, (p.doSno + '').length - 1);
                            var flow = p.doSno.substring(3);

                            header.childNodes[1].Value = year;
                            var draftCount = me.getDraftCount();
                            var strFlowNo = me.flowNoPlus(flow, draftCount);
                            var count = strFlowNo.toString().length;
                            //var strFlow = draftCount == 0 ? strFlowNo : strFlowNo.toString().substring(0, count - 1);
                            //var strSub = draftCount == 0 ? "0" : strFlowNo.toString().substring(count - 1);
                            var strFlow = strFlowNo.toString().substring(0, count - 1);
                            var strSub = strFlowNo.toString().substring(count - 1);

                            header.childNodes[2].Value = strFlow;


                            //轉交換前不給發文支號
                            //header.childNodes[3].Value = strSub;
                            //if (vm && vm.發文文號) vm.發文文號 = year + strFlow + strSub;
                            if (vm && vm.發文文號) vm.發文文號 = year + strFlow
                        }
                    }
                }
                header.Index = idxHeader;
                _childNodesHeader.push(header);
                idxHeader++;
            } else {
                var footer = Ext.clone(me.TEMPLATE.Footer[f.key]);
                if (footer) {
                    if (f.key == '署名') {
                        footer.childNodes = names;
                    } else if (f.key == '稿署名') {
                        footer.childNodes = names;
                    } else if (f.key === '開會時間' || f.key === '會勘時間') {

                    } else if (f.key === '職') {
                        if (d) {
                            footer.childNodes[0].Value = d.depName;
                        }
                    }
                    else if (f.key === '敬陳' || f.key === '核示' || f.key === '敬致') { //0827 簽(工作站用) 簽(處(所)用) 簽(呈局用) 敬陳

                    } else if (f.key === '決行層級') {
                        if (values.qJobTitle) {
                            footer.childNodes[0].Value = values.qJobTitle
                        }
                    }
                    if (values && values.action && (values.action == "create" || values.action == "add")) {
                        if (values.ContactList && values.ContactList.length > 0) {
                            var copySender = '';
                            var pojSender = '';
                            Ext.Array.each(values.ContactList, function (contact) {
                                if (contact.KEY == '正本') {
                                    if (pojSender == '') {
                                        pojSender = contact.CODENAME;
                                    } else {
                                        pojSender = pojSender + '、' + contact.CODENAME
                                    }
                                } else if (contact.KEY == '抄本') {
                                    copySender = contact.CODENAME
                                }
                            })

                            if (f.key == '抄本') {
                                footer.childNodes[0].Value = copySender;
                            } else if (f.key == '正本') {
                                footer.childNodes[0].Value = pojSender;
                            }
                        }
                    }

                    footer.Index = idxFooter;

                    _childNodesFooter.push(footer);
                    idxFooter++;
                }
            }
        });
        var _childNodesKRB = [];
        if (values.qFormat == '開會通知單' || values.qFormat == '會勘通知單')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_Note);
        else if (values.qFormat == '會辦簽' || values.qFormat == '受文者令' || values.qFormat == '代辦處令' ||
            values.qFormat == '便箋')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_Letterhead);
        else if (values.qFormat == 'A4空白簽' || values.qFormat == '令')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_NoteOriginal);
        else if (values.qFormat == '箋函')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_MainLetterhead);
        else if (values.qFormat == '便簽')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_NoteSticky);
        else if (values.qFormat == '簡簽')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_NoteEasy);
        else if (values.qFormat == '簽' || values.qFormat == '報告' || values.qFormat == '上行簽')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_Notes);
        else if (values.qFormat == '出席會議報告單')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_Attend);
        else if (values.qFormat == '訴願答辯書')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ReplyBook);
        else if (values.qFormat == '行政訴訟答辯書')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_LitigationReplyBook);
        else if (values.qFormat == '派免建議函')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_FactionLetter);
        else if (values.qFormat == '獎懲建議函') {
            if (values.qTemplate == '獎懲建議函(1人格式)')
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ProposalLetter);
            else
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ProposalLetterPlural);
        }
        else if (values.qFormat == '獎懲令') {
            if (values.qTemplate == '獎懲令(1人格式)')
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ProposalOrder);
            else
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ProposalOrderPlural);
        }
        else if (values.qFormat == '派免兼令') {
            if (values.qTemplate == '派免兼令(1人格式)')
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_SecondmentOrder);
            else
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_SecondmentOrderPlural);
        }
        else if (values.qFormat == '派免遷調令') {
            if (values.qTemplate == '派免遷調令(1人格式)')
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_PromotionOrder);
            else
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_PromotionOrderPlural);
        }
        else if (values.qFormat == '派免令') {
            if (values.qTemplate == '派免令(1人格式)')
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_AppointOrder);
            else
                _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_AppointOrderPlural);
        }
        else if (values.qFormat == '公告' || values.qFormat == '受文者公告' || values.qFormat == '代辦處公告')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_Publish);
        else if (values.qFormat == '機密文書機密等級變更或註銷處理意見表')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ExchangeNoticeOpinion);
        else if (values.qFormat == '機密文書機密等級變更或註銷記錄單')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ProposalNoticeRecord);
        else if (values.qFormat == '機密文書機密等級變更或註銷通知單')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ExchangeNotice);
        else if (values.qFormat == '機密文書機密等級變更或註銷建議單')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ProposalNotice);
        else if (values.qFormat == '電子信箱回覆函')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_MayorNote);
        else if (values.qFormat == '公示送達')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_Notice);
        else if (values.qFormat == '林務局各單位參加處所會議請示單')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_MeetingReport);
        else if (values.qFormat == '出席會議摘要單')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ImportantMeetingReport);
        else if (values.qFormat == '行政裁處書')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_TribunalBook);
        else if (values.qFormat == '通關疑義暨權責機關答覆聯絡單')
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock_ReplyContact);
        else
            _childNodesKRB = Ext.clone(me.TEMPLATE.KDRichTextBlock);

        //自動引用來文主旨
        if (values.copyPaper) {
            //var comeSubject = OA.common.Global.getCurrentDocFlowRecord().get('title') || '';
            var comeSubject = OA.common.Global.getQueryDefault().交換資訊.來文主旨 || '';
            Ext.Array.forEach(_childNodesKRB, function (node) {
                if (node.childNodes != undefined) {
                    if (node.childNodes[0] == '主旨') {
                        noSubject = false;
                        node.childNodes[0] = comeSubject;
                    }
                }
            });
            /*
            //引用發文日期、發文字號至說明一       
            var comeDate = OA.common.Global.getQueryDefault().來文日期 || '';
            var comeCode = OA.common.Global.getQueryDefault().來文文號 || '';
            Ext.Array.forEach(_childNodesKRB, function (node) {
                if (node.childNodes != undefined) {
                    if (node.childNodes[0] == '這裡開始') {
                        noPart = false;
                        node.childNodes[0] = comeDate + comeCode;
                    }
                }
            });            
            if (noSubject || noPart) {
                Ext.Msg.alert('提示', '此格式不含（主旨、說明）欄位，將不分段引用');
                _childNodesKRB[1].childNodes = comeSubject + comeDate + comeCode;
            }
            */

        } else {
            //console.log(values.qFormat)
            if (values.qFormat == '開會通知單' || values.qFormat == '會勘通知單')
                _childNodesKRB[1].childNodes[0] = '';
            else if (values.qFormat != '箋函' && values.qFormat != '行政訴訟答辯書' &&
                values.qFormat != '便簽' && values.qFormat != 'A4空白簽' && values.qFormat != '令' && values.qFormat != '簡簽' && values.qFormat != '便箋' && values.qFormat != '會辦簽' && values.qFormat != '獎懲建議函' && values.qFormat != '派免建議函' &&
                values.qFormat != '獎懲令' && values.qFormat != '派免令' && values.qFormat != '派免遷調令' && values.qFormat != '派免兼令' &&
                values.qFormat != '令' && values.qFormat != '受文者令' && values.qFormat != '代辦處令' && values.qFormat != '機密文書機密等級變更或註銷處理意見表' &&
                values.qFormat != '機密文書機密等級變更或註銷記錄單' && values.qFormat != '機密文書機密等級變更或註銷通知單' &&
                values.qFormat != '機密文書機密等級變更或註銷建議單' && values.qFormat != '公示送達'
                && values.qFormat != '林務局各單位參加處所會議請示單' && values.qFormat != '出席會議摘要單' && values.qFormat != '行政裁處書') {

                if (values.qFormat === '電子信箱回覆函') {
                    _childNodesKRB[1].childNodes = '';
                } else {
                    if (values.qFormat != '通關疑義暨權責機關答覆聯絡單')
                        _childNodesKRB[1].childNodes[0] = '';
                }
            }
            else if (values.qFormat == '受文者令' || values.qFormat == '代辦處令') {
                _childNodesKRB[1].childNodes = '在這裡輸入';
            }
        }

        var wkContent = me.generateWK(_childNodesHeader, _childNodesKRB, _childNodesFooter, values);
        return wkContent;
    },
    flowNoPlus: function (flowNo, draftCount) {
        //console.log('this');
        var items = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        //var items = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'.split('');
        if (draftCount >= 62) draftCount = 62;
        var strSub = draftCount == 0 ? "0" : items[draftCount - 1].toString();
        var count = flowNo.toString().length;
        var strFlow = flowNo.toString().substring(0, count);
        //var idx = items.indexOf(strSub);
        //if (idx >= 60) idx = 59;
        //strFlow = strFlow + items[idx + 1];
        strFlow = strFlow + strSub;
        return strFlow
    },
    flowNoPlus2: function (draftCount) {
        //console.log('this');
        var items = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        //var items = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789'.split('');
        if (draftCount >= 62) draftCount = 62;
        var strSub = draftCount == 0 ? "0" : items[draftCount].toString();
        return strSub
    },

    /**
     * KDRichTextBox Items
     * @param {object} $xml
     * @param {Boolean} hasPurpose
     * @return {Array}
     */
    getChildNodesKRB: function ($xml, hasPurpose, kind, checkEmpty, qFormat, qIstemp) {
        var qs = OA.common.Global.getQ();
        var qd = OA.common.Global.getQueryDefault();
        var pojSender = [];
        if (qd && qd.交換資訊 && qd.交換資訊.評議案件受文者 && qd.交換資訊.評議案件受文者.受文者) {
            if (Ext.isArray(qd.交換資訊.評議案件受文者.受文者)) {
                pojSender = qd.交換資訊.評議案件受文者.受文者

            } else {
                pojSender = [qd.交換資訊.評議案件受文者.受文者];
            }
        }
        //var y = Ext.Date.add(new Date(), Ext.Date.YEAR, -1911);
        //console.log(y);

        function parseXRow($xml, paragraph, layer, mainLayer) {
            var subItems = [];
            layer++;
            var no = 0;
            $xml.children('條列').each(function (i, row) {
                if (layer == 1) mainLayer++;
                var $row = $(row);
                var bulletText = $row.attr('序號');
                var rowText = $row.find(' > 文字').text();
                if (rowText.trim() == '' && kind !== '來文') {
                    Ext.Msg.alert('提示', 'DI檔內含有空白條例，為避免文稿內容錯誤，此條例將不匯入，匯入後請檢查文稿內容是否完整！');
                    return true;
                }
                no = no + 1;
                subItems.push({
                    "Insert": "None",
                    "Style": "B1",
                    "LvNumber": layer + '.' + no,
                    "ParagraphNumber": paragraph,
                    "FontSize": 21,
                    "MainLayerNumber": mainLayer,
                    "tagName": "Bullet",
                    "BulletType": "Indent",
                    "ThisLayer": layer,
                    "DisplayPanelName": "Context",
                    "ThisLayerNumber": no,
                    "BulletText": Ext.String.repeat('　', layer) + bulletText,
                    "BulletNo": bulletText
                });
                subItems.push({
                    "Insert": "None",
                    "Strike": "None",
                    "Underline": "",
                    "tagName": "Text",
                    "Style": "B1",
                    "FontWeight": "Normal",
                    "Highlight": "None",
                    "childNodes": [rowText],
                    "FontSize": 21
                });
                subItems.push({
                    "Type": "Indent",
                    "tagName": "Newline"
                });

                var count = $row.children('條列').length;
                if (count > 0) {
                    var rows = parseXRow($row, paragraph, layer, mainLayer);
                    subItems = subItems.concat(rows);
                }
            });
            return subItems;
        }

        var items = [];
        if (hasPurpose) {
            var Mayor = $xml.find('電子信箱回覆函').text();
            if (Mayor) {  //1014 電子信箱回覆函主旨直接帶入 Chloe.sia
                var purpose = $xml.find('主旨 > 文字').text();
                purpose = Ext.util.Format.htmlEncode(purpose);
                items.push({
                    "Insert": "None",
                    "Style": "B1",
                    "LvNumber": 0,
                    "ParagraphNumber": 0,
                    "FontSize": 21,
                    "MainLayerNumber": 0,
                    "tagName": "Bullet",
                    "BulletType": "Text",
                    "ThisLayer": 0,
                    "DisplayPanelName": "Context",
                    "ThisLayerNumber": 0,
                    "BulletText": "",
                    "BulletNo": ""
                });
                items.push({
                    "Insert": "None",
                    "Strike": "None",
                    "Underline": "",
                    "tagName": "Text",
                    "Style": "B1",
                    "FontWeight": "Normal",
                    "Highlight": "None",
                    "childNodes": [purpose],
                    "FontSize": 21
                });
                items.push({
                    "Type": "Text",
                    "tagName": "Newline"
                });
            } else {
                var purpose = $xml.find('主旨 > 文字').text();

                if (qIstemp) {
                    if (pojSender && pojSender.length > 0) {
                        var parties = '';
                        var privies = '';

                        /*
                        Ext.Array.each(pojSender, function (peo) {
                            if (peo && peo.相對人 != undefined) {
                                //console.log(peo);
                                if (peo.相對人 == '') {
                                    purpose = purpose.replace('*相對人*', peo.名稱);
                                } else {
                                    purpose = purpose.replace('*相對人1*', peo.名稱);
                                }
                            }
                        });
                        */

                        Ext.Array.each(pojSender, function (peo) {
                            if (peo && peo.相對人 != undefined) {
                                if (peo.相對人 == '') {
                                    if ((peo.名稱 + '').indexOf('之代理人') != -1) {
                                        var indexEnd = (peo.名稱 + '').indexOf('之代理人');

                                        if (privies == '') {
                                            privies = (peo.名稱 + '').substring(0, indexEnd);
                                        } else {
                                            privies = privies + "、" + (peo.名稱 + '').substring(0, indexEnd);
                                        }

                                    } else if ((peo.名稱 + '').indexOf('代理人') != -1) {
                                        var indexEnd = (peo.名稱 + '').indexOf('代理人');
                                        if (privies == '') {
                                            privies = (peo.名稱 + '').substring(0, indexEnd);
                                        } else {
                                            privies = privies + "、" + (peo.名稱 + '').substring(0, indexEnd);
                                        }
                                    } else {
                                        if (privies == '') {
                                            privies = peo.名稱;
                                        } else {
                                            privies = privies + "、" + peo.名稱;
                                        }
                                    }
                                } else {
                                    if ((peo.名稱 + '').indexOf('之代理人') != -1) {
                                        var indexEnd = (peo.名稱 + '').indexOf('之代理人');
                                        if (parties == '') {
                                            parties = (peo.名稱 + '').substring(0, indexEnd);
                                        } else {
                                            parties = parties + "、" + (peo.名稱 + '').substring(0, indexEnd);
                                        }

                                    } else if ((peo.名稱 + '').indexOf('代理人') != -1) {

                                        var indexEnd = (peo.名稱 + '').indexOf('代理人');
                                        if (parties == '') {
                                            parties = (peo.名稱 + '').substring(0, indexEnd);
                                        } else {
                                            parties = parties + "、" + (peo.名稱 + '').substring(0, indexEnd);
                                        }
                                    } else {
                                        if (parties == '') {
                                            parties = peo.名稱;
                                        } else {
                                            parties = parties + "、" + peo.名稱;
                                        }
                                    }
                                }

                            }
                        });
                        purpose = purpose.replace('*相對人*', privies);
                        purpose = purpose.replace('*相對人1*', parties);
                    }

                    if (qs.projNo && qs.projNo != undefined && qs.projNo != '') {
                        purpose = purpose.replace('*案號*', qs.projNo);
                    }


                    if (qs.docNo && qs.docNo != undefined && qs.docNo != '') {
                        purpose = purpose.replace('*文號*', qs.docNo);
                    }
                }

                purpose = Ext.util.Format.htmlEncode(purpose);
                items.push({
                    "Insert": "None",
                    "Style": "B1",
                    "LvNumber": 0,
                    "ParagraphNumber": 0,
                    "FontSize": 21,
                    "MainLayerNumber": 0,
                    "tagName": "Bullet",
                    "BulletType": "Text",
                    "ThisLayer": 0,
                    "DisplayPanelName": "Context",
                    "ThisLayerNumber": 0,
                    "BulletText": "主旨：",
                    "BulletNo": "主旨："
                });
                items.push({
                    "Insert": "None",
                    "Strike": "None",
                    "Underline": "",
                    "tagName": "Text",
                    "Style": "B1",
                    "FontWeight": "Normal",
                    "Highlight": "None",
                    "childNodes": [purpose],
                    "FontSize": 21
                });
                items.push({
                    "Type": "Text",
                    "tagName": "Newline"
                });
            }
        }

        var idx = 0;
        $xml.find('段落').each(function (i, ph) {
            var $ph = $(ph);
            var phName = $ph.attr('段名') || '　';
            var phText = $ph.find(' > 文字').text();

            if ((phName + '').trim() === '' && phText === '' && kind !== '來文') {
                // Ext.Msg.alert('提示', 'DI檔內含空白段名，且內容空白為避免文稿內容錯誤，此段落將不匯入，匯入後請檢查文稿內容是否完整！');
                if (checkEmpty) return true;//獎懲令不檢核
            }

            // var paragraphNumber = i + 1;

            var paragraphNumber = idx + 1;
            idx++;
            //console.log(phName);
            if ($ph[0].parentNode.nodeName === '備註') phName = '備註：';

            items.push({
                "Insert": "None",
                "Style": "B1",
                "LvNumber": 0,
                "ParagraphNumber": paragraphNumber,
                "FontSize": 21,
                "MainLayerNumber": 0,
                "tagName": "Bullet",
                "BulletType": "Text",
                "ThisLayer": 0,
                "DisplayPanelName": "Context",
                "ThisLayerNumber": 0,
                "BulletText": phName,
                "BulletNo": phName
            });
            items.push({
                "Type": "Text",
                "tagName": "Newline"
            });


            //檢核單一條例
            if (!checkEmpty && phName == '附註：') {
                var numText = $ph.find('條列');
                if (numText && numText.length == 1) {
                    //合併至段名例
                    if (phText == '') {
                        $numText = $(numText)
                        var nText = $numText.find(' > 文字').text();
                        if (nText && nText != '') {
                            phText = nText;
                            $numText.remove();
                        }
                    }
                }
            }

            if (phText) {
                items.push({
                    "Insert": "None",
                    "Strike": "None",
                    "Underline": "",
                    "tagName": "Text",
                    "Style": "B1",
                    "FontWeight": "Normal",
                    "Highlight": "None",
                    "childNodes": [phText],
                    "FontSize": 21
                });
                items.push({
                    "Type": "Indent",
                    "tagName": "Newline"
                });
            }

            var rows = parseXRow($ph, paragraphNumber, 0, 0);
            items = items.concat(rows);
        });
        return items;
    },
    /**
     * 處理WK資料共用
     * @param {String} qFormat , ex:函
     * @param {json}    wkContent
     * @param options
     * @return {Object} modelName
     */
    doWkCommon: function (qFormat, wkContent, options) {
        var me = this;
        var modelName = me.getModelName('wk', qFormat);
        if (modelName === 'FORMATS_NOT_FOUND') return { err: '找不到文稿格式模型', code: modelName };

        var vm = OA.common.Global.getCurrentViewModel();

        //set preview sealXml
        //if (options && options.sealXml) {
        //    console.log(modelName);
        //    OA.common.DIMgr.setSealXml(options.sealXml);
        //}

        var record = Ext.create(modelName);
        var fields = record.getFields().map['layout'].config.mapping();
        OA.client.WK.setCurrentModelName(modelName);

        var ret = {
            model: modelName,
            record: record,
            fields: fields
        };

        if (options && options.names == 0) {
            ret.fields = Ext.Array.filter(ret.fields, function (p) {
                return p.key != '署名';
            });
        }

        if (wkContent) {
            //var rs = record.getProxy().getReader().readRecords(Ext.clone(wkContent)).getRecords()[0];

            var normalizedWk = wkContent.hasOwnProperty('data') ? wkContent : { data: wkContent };
            // 使用 normalizedWk 來讀取記錄
            var readResult = record.getProxy().getReader().readRecords(Ext.clone(normalizedWk));
            // 調試並檢查讀取結果
            console.log("readResult:", readResult);
            if (readResult && readResult.getRecords) {
                var records = readResult.getRecords();
                if (records.length > 0) {
                    readResult = Ext.clone(records[0]);
                    console.log("rs:", readResult); // 檢查 readResult 是否包含期望數據
                } else {
                    console.warn("No records found in readResult.");
                }
            } else {
                console.error("Failed to read records from wk.");
            }

            //console.log(rs);
            if (options && options.names == 0) {
                readResult.data.署名 = {};
                readResult.data.稿署名 = {};
            }
            if (options && options.level == 0) readResult.data.分層負責 = '';

            ret.oSVG = me.generateSvg(modelName, readResult, options);
        }

        return ret;
    },
    /**
     *  匯入DI
     */
    ImportDI: function (xml, options, callbak) {
        console.log(options);
        var qd = OA.common.Global.getQueryDefault();
        var qs = OA.common.Global.getQ();
        var paras = OA.common.Global.getInitParas();
        options = options || {};
        var me = this;
        var sendData = [];
        var isPenink = false;//筆硯匯入


        xml = xml.replace(/#SW#/g, '');
        xml = xml.replace(/&/g, '＆');

        //處理來文DI附件宣告含中文字
        if (options && options.kind && options.kind == '來文') {
            try {
                xml = xml.replace(/<!ENTITY ATTCH[^>]*>/g, '').replace(/<!ENTITY 附件[^>]*>/g, '').replace(/<!ENTITY 表單[^>]*>/g, '').replace(/<!ENTITY 名單[^>]*>/g, '');
            } catch (err) {
                if (err) console.log(err);
                return { err: err };
            }
        }
        // xml = xml.replace(/&#55378;&#57055;/g, '𤫟');
        // console.log(new String('\ud852\udedf'));

        var xmlDoc = '';
        try {
            xmlDoc = $.parseXML(xml);
        } catch (err) {
            if (err) console.log(err);
            return { err: err };
        }

        var $xml = $(xmlDoc);
        var qFormat = options.qFormat;
        if (!qFormat) qFormat = $xml.context.documentElement.nodeName;
        qFormat = qFormat.trim();

        var commonData = me.doWkCommon(qFormat);
        if (commonData.err) return commonData;
        var _childNodesHeader = [], _childNodesKRB = [], _childNodesFooter = [], idxHeader = 0, idxFooter = 0;
        Ext.Array.forEach(commonData.fields, function (f) {
            var _key = '', _value = '';
            if (f.key == 'KDRichTextBlock') {
                var hasPurpose = true;
                var checkEmpty = true;
                if (qFormat == '開會通知單' || qFormat == '會勘通知單' || qFormat == '便簽' || qFormat == 'A4空白簽' || qFormat == '便箋' || qFormat == '簡簽' ||
                    qFormat == '令' || qFormat == '受文者令' || qFormat == '代辦處令'
                    || qFormat === '會銜令' || qFormat === '會銜受文者令') hasPurpose = false;
                if (qFormat == '獎懲令' || qFormat == '派免遷調令' || qFormat == '派免令') checkEmpty = false;

                if (options.qIstemp) {
                    _childNodesKRB = me.getChildNodesKRB($xml, hasPurpose, options.kind, checkEmpty, qFormat, true);
                } else {
                    _childNodesKRB = me.getChildNodesKRB($xml, hasPurpose, options.kind, checkEmpty, qFormat);
                }
                //console.log(_childNodesKRB);
            } else {
                var header = Ext.clone(me.TEMPLATE.Header[f.key]);
                //console.log(header);
                if (header) {
                    if (f.key == '發文機關') {
                        if (options.kind === '來文') {
                            _key = $xml.find(f.key + ' > 全銜').text();
                            _value = $xml.find(f.key + ' > 機關代碼').text();
                            header.childNodes[0].Key = _key + '；' + _key;
                            header.childNodes[0].Value = _value;
                        } else {
                            var sentOrg = Ext.Array.filter(qd.交換資訊.發文機關.機關, function (p) {
                                if (p.預設 == "Y") return true;
                            })[0];
                            header.childNodes[0].Key = qd.交換資訊.發文機關全銜 + '；' + qd.交換資訊.發文機關全銜;
                            header.childNodes[0].Value = qd.交換資訊.發文機關代碼;
                            header.childNodes[1].Value = sentOrg.level;
                        }
                    } else if (f.key == '檔號') {
                        var dept = OA.common.Global.getCurrentDept();
                        if (dept && dept.depNo == 'A301' && options.qIstemp) {
                            var y = Ext.Date.add(new Date(), Ext.Date.YEAR, -1911);
                            header.childNodes[0].Value = (y.getFullYear() + '');
                            header.childNodes[1].Value = '1000';
                            header.childNodes[2].Value = '001';
                        } else if (dept && dept.depNo == 'A301' && qs.projNo) {
                            var y = Ext.Date.add(new Date(), Ext.Date.YEAR, -1911);
                            header.childNodes[0].Value = (y.getFullYear() + '');
                            header.childNodes[1].Value = '1000';
                            header.childNodes[2].Value = '001';
                        }
                    } else if (f.key == '保存年限') {
                        var dept = OA.common.Global.getCurrentDept();
                        if (dept && dept.depNo == 'A301' && options.qIstemp) {
                            header.childNodes[0].Value = '5';
                        } else if (dept && dept.depNo == 'A301' && qs.projNo) {
                            header.childNodes[0].Value = '5';
                        }
                    } else if (f.key == '地址') {
                        if (options.kind === '來文') {
                            _value = $xml.find(f.key).text();
                            header.childNodes[0].Value = _value;
                        } else {
                            header.childNodes[0].Value = qd.交換資訊.地址 || '';
                            header.childNodes[1].Value = qd.交換資訊.辦公地址 || ''
                        }
                    } else if (f.key == '聯絡方式') {
                        var items = [];
                        if (options.kind === '來文') {
                            $xml.find(f.key).each(function (i, el) {
                                var contact = $(el).text().split('：');
                                items.push({
                                    "Value": $(el).text(),
                                    "Key": contact[0],
                                    "tagName": "Property"
                                })
                            });
                            header.childNodes = items;
                        } else {
                            Ext.Array.forEach(qd.交換資訊.聯絡方式, function (node) {
                                var k = node.Title.toString().split('：')[0];
                                var v = node.content || '';
                                if (k == '承辦人' && qd && qd.交換資訊.股別) {
                                    v = qd.交換資訊.股別;
                                }

                                items.push({
                                    "Value": node.Title + v,
                                    "Key": k,
                                    "tagName": "Property"
                                });
                            });
                            header.childNodes = items;
                        }
                    } else if (f.key == '受文者') {
                        if (options.kind === '來文') {
                            _value = $xml.find(f.key + ' > 文換表').text();
                            if (!_value) _value = $xml.find(f.key + ' > 全銜').text() || '';
                            header.childNodes[0].Value = _value;
                        }
                    } else if (f.key == '發文日期') {
                        if (options.kind === '來文')
                            header.childNodes[0].Value = $xml.find(f.key + ' > 年月日').text();
                    } else if (f.key == '發文字號') {
                        //匯入DI發文字要重組
                        //console.log('xml');
                        if (options.kind === '來文') {
                            header.childNodes[0].Value = $xml.find(f.key + ' > 字').text();
                            header.childNodes[1].Value = $xml.find(f.key + ' > 文號 > 年度').text();
                            header.childNodes[2].Value = $xml.find(f.key + ' > 文號 > 流水號').text();
                            header.childNodes[3].Value = $xml.find(f.key + ' > 文號 > 支號').text();
                        } else {
                            var Paras = OA.common.Global.getInitParas();
                            var word = qd.交換資訊.本機關發文字 || ''
                            if (Paras && Paras.doSno != undefined && qs.app !== 'draft') {
                                var sNo = Paras.doSno + '';
                                var yearNo = sNo.substring(0, 3) || '';
                                var num = sNo.substring(3) || '';
                                var draftCount = me.getDraftCount() || '';
                                var numNo = draftCount;
                                header.childNodes[0].Value = word;
                                header.childNodes[1].Value = yearNo;
                                header.childNodes[2].Value = num;
                                //支號不帶入轉交換後再補
                                header.childNodes[3].Value = '';
                            } else {
                                header.childNodes[0].Value = word;
                                header.childNodes[1].Value = '';
                                header.childNodes[2].Value = '';
                                header.childNodes[3].Value = '';
                            }
                        }
                    } else if (f.key == '速別') {
                        header.childNodes[0].Value = $xml.find(f.key).attr('代碼');
                    } else if (f.key == '密等及解密條件或保密期限') {
                        header.childNodes[0].Value = $xml.find(f.key + ' > 密等').text();
                        header.childNodes[1].Value = $xml.find(f.key + ' > 解密條件或保密期限').text();
                    } else if (f.key == '附件') {
                        header.childNodes[0].Value = $xml.find(f.key + ' > 文字').text();
                    } else if (f.key == '機關') {
                        header.childNodes[0].Key = $xml.find(f.key + ' > 全銜').text();
                    } else if (f.key == '結尾自稱語') {
                        header.childNodes[0].Key = $xml.find(f.key + ' > 全銜').text();
                    } else if (f.key == '開會事由' || f.key == '開會地點') {
                        if (options.qIstemp) {
                            var temptext = $xml.find(f.key + ' > 文字').text();
                            if (f.key == '開會地點') {
                                header.childNodes[0].Value = temptext;
                            } else {

                                if (qs.docNo && qs.docNo != undefined && qs.docNo != '') {
                                    //解base64
                                    var docNo = '';
                                    try {
                                        docNo = B64.decode(qs.docNo);
                                    } catch (err) {
                                        docNo = (qs.docNo + '');
                                    }
                                    temptext = temptext.replace('*案號*', docNo);
                                }


                                /*
                                if (qs.docDesc && qs.docDesc != undefined && qs.docDesc != '') {
                                    temptext = temptext.replace('*案號*', (qs.docDesc + ''));;
                                }
                                */

                                header.childNodes[0].Value = temptext;
                            }
                        } else {
                            header.childNodes[0].Value = $xml.find(f.key + ' > 文字').text();
                        }
                    } else if (f.key == '開會時間') {
                        header.childNodes[0].Value = $xml.find(f.key + ' > 年月日').text();
                        header.childNodes[1].Value = $xml.find(f.key + ' > 星期').text();
                        header.childNodes[2].Value = $xml.find(f.key + ' > 時分').text();
                    } else if (f.key == '通話時間') {
                        header.childNodes[0].Value = $xml.find(f.key + ' > 年月日').text();
                        header.childNodes[1].Value = $xml.find(f.key + ' > 時分').text();
                        header.childNodes[2].Value = $xml.find(f.key + ' > 年月日止').text();
                        header.childNodes[3].Value = $xml.find(f.key + ' > 時分止').text();
                    } else if (f.key == '聯絡人及電話') {
                        var contacts = [];
                        $xml.find(f.key).each(function (i, el) {
                            $(el).children().each(function (j, child) {
                                contacts.push({
                                    "Key": $(child).prop("tagName"),
                                    "Value": $(child).text(),
                                    "tagName": "Property"
                                });
                            });
                        });
                        header.childNodes = contacts;
                    } else if (f.key == '主持人') {
                        var hosts = [];
                        $xml.find(f.key + ' > 姓名').each(function (i, el) {
                            if (el.attributes && el.attributes.length > 0 && el.attributes[0].nodeName == '發文方式') {
                                isPenink = true;
                                attendants.push({
                                    "Value": el.firstChild.textContent.trim(),
                                    "Key": f.key,
                                    "tagName": "Property"
                                });
                                sendData.push(me.importPeninkDoc(el, f.key, true));
                            } else {
                                hosts.push({
                                    "Value": $(el).text(),
                                    "Key": f.key,
                                    "tagName": "Property"
                                })
                                sendData.push({
                                    "Value": $(el).text(),
                                    "Key": f.key
                                });
                            }
                        });
                        header.childNodes = hosts;
                        //if (hosts.length > 0) hosts.forEach(function (p) {
                        //    if (p.Value.trim().length > 0)
                        //        sendData.push(p);
                        //});
                    } else if (f.key == '出席者' || f.key == '列席者') {
                        var attendants = [];
                        $xml.find(f.key + ' > 全銜').each(function (i, el) {
                            if (el.attributes && el.attributes.length > 0 && el.attributes[0].nodeName == '發文方式') {
                                isPenink = true;
                                attendants.push({
                                    "Value": el.firstChild.textContent.trim(),
                                    "Key": f.key,
                                    "tagName": "Property"
                                });
                                sendData.push(me.importPeninkDoc(el, f.key, true));
                            } else {
                                if (options.qIstemp && f.key == '出席者') {
                                    var checkText = $(el).text();
                                    
                                        attendants.push({
                                            "Value": $(el).text(),
                                            "Key": f.key,
                                            "tagName": "Property"
                                        })
                                        sendData.push({
                                            "Value": $(el).text(),
                                            "Key": f.key
                                        });
                                    
                                } else {
                                    attendants.push({
                                        "Value": $(el).text(),
                                        "Key": f.key,
                                        "tagName": "Property"
                                    })
                                    sendData.push({
                                        "Value": $(el).text(),
                                        "Key": f.key
                                    });
                                }
                            }
                        });




                        header.childNodes = attendants;
                        //if (attendants.length > 0) attendants.forEach(function (p) {
                        //    if (p.Value.trim().length > 0)
                        //        sendData.push(p);
                        //});
                    } else if (f.key == '敬會') {
                        //console.log(header);
                        header.childNodes[0].Value = $xml.find(f.key).text();
                    } else { //年月日
                        //2023.08.09 變更需求自動帶入當天_lien.chiu

                        if (f.key == '年月日') {
                            var y = Ext.Date.add(new Date(), Ext.Date.YEAR, -1911);
                            var ymd = y.getFullYear() + '年' + Ext.Date.format(new Date(), 'n月j日');
                            _value = ymd;
                        } else {
                            _value = $xml.find(f.key).text();
                        }

                        //_value = $xml.find(f.key).text();
                        if (_value) header.childNodes[0].Value = _value;
                    }

                    header.Index = idxHeader;
                    _childNodesHeader.push(header);
                    idxHeader++;
                } else {
                    //var footer = (me.TEMPLATE.Footer[f.key]);
                    var footer = Ext.clone(me.TEMPLATE.Footer[f.key]);
                    if (footer) {
                        if (f.key == '署名') {
                            var names1 = [];
                            $xml.find(f.key).each(function (i, el) {
                                names1.push({
                                    "Value": $(el).text(),
                                    "Key": "署名",
                                    "Type": $xml.find('發文機關 > 全銜').text(),
                                    "tagName": "Property"
                                });
                            });
                            footer.childNodes = names1;
                        } else if (f.key == '決行層級') {
                            if (options.qJobTitle) {
                                footer.childNodes[0].Value = options.qJobTitle;
                            } else {
                                if ($xml.find(f.key).text() === '一層決行') {
                                    footer.childNodes[0].Value = -1;
                                } else if ($xml.find(f.key).text() === '二層決行') {
                                    footer.childNodes[0].Value = -2;
                                } else if ($xml.find(f.key).text() === '三層決行') {
                                    footer.childNodes[0].Value = -3;
                                } else if ($xml.find(f.key).text() === '四層決行') {
                                    footer.childNodes[0].Value = -4;
                                }
                                else if ($xml.find(f.key).text() === '') {
                                    footer.childNodes[0].Value = $xml.find(f.key).text();
                                }
                            }
                        }
                        else if (f.key == '正本' || f.key == '副本') {
                            var copy1 = [];
                            if (options.qIstemp) {
                                var hasAtt = 'N';
                                if (f.key == '正本') hasAtt = 'Y';
                                var checkText = ($xml.find(f.key).text() + '').trim(); 
                            } else {
                                var hasAtt = true;
                                $xml.find(f.key + ' > 全銜').each(function (i, el) {
                                    if (el.attributes && el.attributes.length > 0 && el.attributes[0].nodeName == '發文方式') {
                                        isPenink = true;
                                        copy1.push({
                                            "Value": el.firstChild.textContent.trim(),
                                            "Key": f.key,
                                            "tagName": "Property"
                                        });
                                        if (f.key == '副本') {
                                            hasAtt = false;
                                            if (el.nextElementSibling && el.nextElementSibling.tagName == '含附件') hasAtt = true;
                                            //$xml.find(f.key + ' > 含附件').each(function (i, ell) {
                                            //    if (ell.firstChild.textContent.trim() === '含附件') hasAtt = true
                                            //});
                                        }
                                        sendData.push(me.importPeninkDoc(el, f.key, hasAtt));
                                    } else {
                                        copy1.push({
                                            "Value": $(el).text(),
                                            "Key": f.key,
                                            "tagName": "Property"
                                        });
                                        sendData.push({
                                            "Value": $(el).text(),
                                            "Key": f.key
                                        });

                                    }
                                });
                            }

                            footer.childNodes = copy1;
                        } else if (f.key == '敬陳' || f.key == '核示' || f.key == '敬致' || f.key == '局處單位') {
                            footer.childNodes[0].Value = $xml.find(f.key).text();
                        } else {

                        }
                        footer.Index = idxFooter;
                        _childNodesFooter.push(footer);
                        idxFooter++;
                    }
                }
            }
        });
        var values = {
            qFormat: qFormat,
            qTemplate: me.FORMATS[qFormat].template[0].value,
            qNumberWay: 1
        };

        if (options.qIstemp && options.qTemplate) {
            values.qTemplate = options.qTemplate;
        }

        var wkContent = me.generateWK(_childNodesHeader, _childNodesKRB, _childNodesFooter, values);
        //var rs = commonData.record.getProxy().getReader().readRecords(Ext.clone(wkContent)).getRecords()[0];
        var normalizedWk = wkContent.hasOwnProperty('data') ? wkContent : { data: wkContent };
        // 使用 normalizedWk 來讀取記錄
        var readResult = commonData.record.getProxy().getReader().readRecords(Ext.clone(normalizedWk));
        // 調試並檢查讀取結果
        console.log("readResult:", readResult);
        if (readResult && readResult.getRecords) {
            var records = readResult.getRecords();
            if (records.length > 0) {
                readResult = Ext.clone(records[0]);
                console.log("rs:", readResult); // 檢查 readResult 是否包含期望數據
            } else {
                console.warn("No records found in readResult.");
            }
        } else {
            console.error("Failed to read records from wk.");
        }
        readResult.data['kind'] = options.kind;
        var oSVG = me.generateSvg(commonData.model, readResult);
        if (sendData.length > 0) {
            var items = [];
            Ext.Array.each(sendData, function (data) {
                if (data.KEY && data.KEY == '抄本') {
                    items.push(data);
                } else {
                    if (qd && qd.交換資訊 && qd.交換資訊.評議案件受文者 && qd.交換資訊.評議案件受文者.受文者 && data.KEY) {
                        items.push(data);
                    } else {
                        if (data.VALUE) {
                            items.push(data);
                        } else {
                            items.push({
                                ADDR: data.ADDR ? data.ADDR : '',
                                ARCENO: data.ARCENO ? data.ARCENO : '',
                                CODE: data.CODE ? data.CODE : '',
                                CODENAME: data.CODENAME ? data.CODENAME : data.Value,
                                GROUP: "",
                                GROUPLIST: "",
                                KEY: data.Key,
                                PEOPLESEND: '',
                                REALTRANSTYPE: data.TRANSTYPENAME == '電子' ? '9' : '2',
                                TRANSTYPE: data.TRANSTYPENAME == '電子' ? '9' : '2',
                                TRANSTYPENAME: data.TRANSTYPENAME ? data.TRANSTYPENAME : '紙本',
                                TYPE: 1,
                                VALUE: data.Value,
                                tagName: "Contact",
                                ATTACH: data.Key !== '副本' ? 'Y' : data.ATTACH === 'Y' ? 'Y' : 'N',
                                isEdit: true,
                                editAtt: (data.Key == '副本'),
                                isChange: data.TRANSTYPENAME == '電子' ? 'Y' : 'N'
                            });
                        }
                    }
                }
            });
            oSVG.vm.ContactList = items;
            //console.log(items);
            wkContent.childNodes[0].childNodes.push({
                tagName: "ContactList",
                childNodes: items
            })
        }

        if (options.kind == 'draft') {
            if (sendData && sendData.length > 0) {
                Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });
                var items = [];
                Ext.Array.each(sendData, function (con) {
                    //console.log(con);
                    var data = {};
                    data.qType = '0';
                    data.start = 0;
                    data.limit = 1;
                    data.depNo = paras.depNo;
                    data.empNo = paras.empNo;
                    data.oldName = Ext.clone(con.Value ? con.Value : con.VALUE);
                    data.dep3ChnName = (con.Value + '').replace('（含附件）', '').replace('（含附錄）', '').replace('(含附錄)', '');
                    //console.log(data);

                    OA.client.Member.search(data, function (ret) {
                        //console.log(ret)
                        if (ret.length != 0 && ret[0]) {
                            var child = ret[0];
                            items.push({
                                ADDR: child.get('dep3Addr') || '',
                                ARCENO: child.get('dep3Zone') || '',
                                ATTACH: "",
                                CODE: child.get('dep3No') || '',
                                CODENAME: child.get('dep3Name') || '',
                                GROUP: "",
                                GROUPLIST: "",
                                KEY: con.Key,
                                PEOPLESEND: '',
                                REALTRANSTYPE: '2',
                                TRANSTYPE: '2',
                                TRANSTYPENAME: '紙本',
                                TYPE: 1,
                                VALUE: data.oldName || '',
                                editAtt: (con.Key == '副本'),
                                isChange: "N",
                                isEdit: true,
                                tagName: "Contact"
                            });
                        } else {
                            items.push({
                                ADDR: '',
                                ARCENO: '',
                                ATTACH: "",
                                CODE: '',
                                CODENAME: data.oldName || '',
                                GROUP: "",
                                GROUPLIST: "",
                                KEY: con.Key,
                                PEOPLESEND: '',
                                REALTRANSTYPE: '2',
                                TRANSTYPE: '2',
                                TRANSTYPENAME: '紙本',
                                TYPE: 1,
                                VALUE: data.oldName || '',
                                editAtt: (con.Key == '副本'),
                                isChange: "N",
                                isEdit: true,
                                tagName: "Contact"
                            });
                        }

                        //console.log(items);
                        if (items.length == sendData.length) {
                            Ext.Viewport.setMasked(false);
                            oSVG.vm.ContactList = items;
                            //console.log(items);
                            var last = wkContent.childNodes[0].childNodes.length - 1;
                            //console.log(wkContent.childNodes[0])
                            wkContent.childNodes[0].childNodes[last].childNodes = items;

                            var retWK = {
                                wkContent: wkContent,
                                oSVG: oSVG,
                                fields: commonData.fields,
                                isPenink: isPenink
                            };

                            if (callbak) {
                                callbak(retWK)
                            }

                        }
                    })


                });
            } else {
                var retWK = {
                    wkContent: wkContent,
                    oSVG: oSVG,
                    fields: commonData.fields,
                    isPenink: isPenink
                };

                if (callbak) {
                    callbak(retWK)
                }
            }

        } else {
            return {
                wkContent: wkContent,
                oSVG: oSVG,
                fields: commonData.fields,
                isPenink: isPenink
            };
        }
    },
    /**
     *  匯入BIN
     */
    ImportBin: function (xml) {
        console.log(xml);

        var me = this;
        var qs = OA.common.Global.getQ();
        var qd = OA.common.Global.getQueryDefault();
        var init = OA.common.Global.getInitParas();
        var nowWk = Ext.clone(OA.common.Global.getCurrentWKContent());
        //console.log(init);

        //console.log(Ext.clone(init));
        var s1 = '', s2 = '', s3 = '', s4 = '';

        s1 = qd.交換資訊.本機關發文字 || '';
        if (init.doSno) {
            s2 = (init.doSno + '').substring(0, 3);
            s3 = (init.doSno + '').substring(3);
        }


        /*匯入封包不補支號,發文轉交換再補
        if (nowWk) {
            var nowDoSno = OA.common.Utils.getTagText(nowWk, '發文字號');
            if (nowDoSno && nowDoSno.childNodes && nowDoSno.childNodes.length > 3) {
                s4 = nowDoSno.childNodes[3].Value;
            }
        } else {
            if (init && init.doSno) {
                var draftCount = me.getDraftCount();
                s4 = (draftCount + '');
            }
        }
        */

        var dom = parseXmlString(xml);
        var verWork = dom.querySelector("VerWork");
        var wk = JSON.parse(xml2json(verWork));

        // 手寫板,附件清單,批示意見,案情摘要 文字可能會null 要重組
        Ext.Array.each(wk.childNodes, function (node, index) {
            if (node.tagName) {
                if (node.tagName == '手寫板') {
                    wk.childNodes[index] = { tagName: "手寫板" }
                } else if (node.tagName == '附件清單') {
                    wk.childNodes[index] = { tagName: "附件清單" }
                } else if (node.tagName == '批示意見') {
                    if (node.childNodes) {
                        node.childNodes[0] = { tagName: "文字" }
                    }
                } else if (node.tagName == '案情摘要') {
                    if (node.childNodes) {
                        node.childNodes[0] = { tagName: "文字" }
                    }
                }
            }
        })

        var tagDoSno = OA.common.Utils.getTagText(wk, '發文字號');
        if (tagDoSno) {
            //重組發文文號及判斷是否有稿署名
            var nos = [];
            nos.push({ Key: "發文字號_字", Value: s1, tagName: "Property" });
            nos.push({ Key: "發文字號_年度", Value: s2, tagName: "Property" });
            nos.push({ Key: "發文字號_流水號", Value: s3, tagName: "Property" });
            nos.push({ Key: "發文字號_支號", Value: s4, tagName: "Property" });
            tagDoSno.childNodes = nos;
        }

        var tagSendDate = OA.common.Utils.getTagText(wk, '發文日期');
        if (tagSendDate) {
            if (tagSendDate.childNodes && tagSendDate.childNodes.length > 0) {
                tagSendDate.childNodes[0].Value = '';
            }
        }

        //簽的年月日自動帶入今天
        var tagYMD = OA.common.Utils.getTagText(wk, '年月日');
        if (tagYMD) {
            if (tagYMD.childNodes && tagYMD.childNodes.length > 0) {
                var y = Ext.Date.add(new Date(), Ext.Date.YEAR, -1911);
                var ymd = y.getFullYear() + '年' + Ext.Date.format(new Date(), 'n月j日');
                tagYMD.childNodes[0].Value = ymd;
            }
        }

        wk.doSno = '';  //匯包匯入清除文號
        //console.log(wk);
        wk.genDocNo = qs.genDocNo || '1';
        wk.Version = init.version;

        var AttachList = dom.querySelector("AttachList");
        var jAttachs = JSON.parse(xml2json(AttachList));
        var attachs = [];
        if (jAttachs) {
            Ext.Array.each(jAttachs.childNodes, function (att) {
                var name = att.DisplayName;
                var ext = name.split('.')[1].toLowerCase();
                var url = ''; //檔未上傳
                var file = {
                    fileKey: name,
                    fileName: att.FileName,
                    folderName: 'attach',
                    fileType: ext,
                    fileContent: att.Attach
                };
                attachs.push({ name: name, url: url, format: ext, sort: 'attach', file: file, isEdit: true });
            });
        }

        var commonData = me.doWkCommon(wk.DocumentType, wk);
        //console.log(commonData);
        return {
            wkContent: wk,
            oSVG: commonData.oSVG,
            fields: commonData.fields,
            attachs: attachs
        };
    },
    /**
     *  Silverlgiht 介接
     */
    ImportSL: function (xml, mode) {
        var me = this;
        var dom = parseXmlString(xml);
        if (!dom) return;
        var domMeta = dom.querySelector("Root > Metadata");
        var domParas = dom.querySelector("Root > InitParams");
        // var domPlus = dom.querySelector("Root > Plusdatas");
        var meta = JSON.parse(xml2json(domMeta));
        var paras = JSON.parse(xml2json(domParas));
        // var plus = JSON.parse(xml2json(domPlus));
        OA.common.Global.setInitParas({ doSno: paras.doSno, ComeMark: meta.ComeMark });

        if (mode === 'init') {
            return { meta: meta };
        }
        else if (mode === 'Opinion') {
            var plusdatas = dom.querySelector('Root > Plusdatas');
            return {
                oSVG: me.generateOpinionSvg(plusdatas)
            };
        } else {
            //非稿面皆以函格式輸出
            var tagMode = (mode !== 'Draft') ? 'Normal' : mode;
            var verWork = dom.querySelector('Root > ' + tagMode + ' > RootWork > VerWork');

            if (!verWork) {
                Ext.Msg.alert('ERROR', '找不到 Root > ' + tagMode + ' > RootWork > VerWork');
            }

            var wk = JSON.parse(xml2json(verWork));
            var options = { previewMode: mode, meta: meta };
            var commonData = me.doWkCommon(wk.DocumentType, wk, options);

            OA.common.Global.setCurrentWKContent(wk);
            OA.common.Global.setCurrentViewModel(commonData.oSVG.vm);

            return {
                wkContent: wk,
                oSVG: commonData.oSVG,
                fields: commonData.fields
            };
        }
    },
    /**
     *  svg 重定ID
     */
    defId: function (key, item, parentLayerId) {
        var id = '';
        var layerId = (item.paragraph * 1000) + item.mainLayer;
        var wk = OA.common.Global.getCurrentWKContent();
        if (item.layer == 1) {
            layerId = (item.paragraph * 1000) + item.layerNo;
            id = key + '-' + layerId;
        } else if (item.layer == 2) {
            //修正二階錯誤（公告才修正）
            if (parentLayerId && wk && wk.DocumentType == '公告') {
                //108.09.24  修正缺少條例問題lien.chiu
                id = key + '-' + parentLayerId + '.' + item.layerNo;

                //因多階造成
                if (item.layerNo == 1) {
                    id = key + '-' + parentLayerId + '.' + item.layerNo;
                } else {
                    var i = parentLayerId.lastIndexOf('.');
                    var ss = parentLayerId.split('.');
                    var nums = ss.slice(0, item.layer - 1);
                    id = key + '-' + nums.join('.') + '.' + item.layerNo;
                }
            } else
                //id = key + '-' + layerId + '.' + item.secLayer; 追蹤修訂欄位顯示錯誤修正
                id = key + '-' + layerId + '.' + item.layerNo;
        } else if (item.layer == 3) {
            if (parentLayerId && wk && wk.DocumentType == '公告') {    //（公告才修正）
                //108.09.24  修正缺少條例問題lien.chiu
                id = key + '-' + parentLayerId + '.' + item.layerNo;

                //因多階造成
                if (item.layerNo == 1) {
                    id = key + '-' + parentLayerId + '.' + item.layerNo;
                    // console.log(id);
                    // console.log(parentLayerId);
                } else {
                    var i = parentLayerId.lastIndexOf('.');
                    var ss = parentLayerId.split('.');
                    var nums = ss.slice(0, item.layer - 1);
                    id = key + '-' + nums.join('.') + '.' + item.layerNo;
                }
            } else {
                //追蹤修訂欄位顯示錯誤修正
                var i = parentLayerId.lastIndexOf('.');
                var ss = parentLayerId.split('.');
                var nums = ss.slice(0, item.layer - 1);
                id = key + '-' + nums.join('.') + '.' + item.layerNo;
            }
        } else {
            // console.log(item);

            if (parentLayerId) {
                // id = key + '-' + parentLayerId + '.' + item.layerNo;

                if (item.layer == 4) {
                    var i = parentLayerId.lastIndexOf('.');
                    var ss = parentLayerId.split('.');
                    var nums = ss.slice(0, item.layer - 1);
                    id = key + '-' + nums.join('.') + '.' + item.layerNo;
                } else {
                    //因多階造成
                    if (item.layerNo == 1) {
                        id = key + '-' + parentLayerId + '.' + item.layerNo;
                        // console.log(id);
                        // console.log(parentLayerId);
                    } else {
                        var i = parentLayerId.lastIndexOf('.');
                        var ss = parentLayerId.split('.');
                        var nums = ss.slice(0, item.layer - 1);
                        id = key + '-' + nums.join('.') + '.' + item.layerNo;
                    }
                }
            }
        }

        return id;
    },


    /**
     * 重新條列定義 svg css 名稱
     *
     * defClassName(item.tag, true)  // return  indent-2 (縮2)
     * defClassName(item.tag, false)  // return follow_wrap (跟隨前文)
     *
     * 說明內容 換行 縮1
     * 條列n , 縮排n
     * no:縮排n , text : 換行 跟隨前一
     *
     * @param item
     * @param {Boolean} isNo 是為標題數字
     * @param listCount
     * @return {String} XML String
     */
    defClassName: function (item, isNo, listCount) {
        var c = item.tag || 'normal';
        // console.log('tag= ' + item.tag + ' layer = ' + item.layer + ' isNo= ' + isNo);
        //標題數字控制縮排
        if (isNo) {
            //c = 'indent-' + item.layer;
            // if (item.mainLayer == 0) {
            if (item.layer == 0) {
                c = 'indent-0';
            } else {
                // if (item.lv) c = 'indent-' + item.lv;
                // item.lv有mapping 去尾數0的bug
                c = 'indent-' + item.layer + '.' + item.layerNo;
            }
        }
        else {
            //有條例
            if (listCount > 0) {
                c = 'follow_wrap';
            } else {
                c = 'paragraph_desc'
            }
        }

        // console.log(item);
        // console.log(c);

        return c;
    },

    /**
     * 組文稿共用起始部份 ，必須加 closeTagToSvg 閉合
     *
     * var rows_start =createDefaultRows();
     *
     * var rows_finish = rows_start + .... + closeTagToSvg()
     *
     *
     * @return {Array} 共用部分 rows
     */
    createDefaultRows: function (seal) {
        var rows = [];
        var pageWidth = this.getPageWidth();
        var pageHeight = this.getPageHeight();
        var pageMargin = this.getPageMargin();
        var pageInterval = this.getPageInterval();
        var svgHeight = this.getSvgHeight();
        var barcodeX = pageWidth - pageMargin.right - 200;
        var barcodeY = pageHeight - pageMargin.bottom + 25;

        var workWidth = pageWidth - pageMargin.left - pageMargin.right;
        var workHeight = pageHeight - pageMargin.top - pageMargin.bottom;
        var line_x = (pageMargin.left / 2) + 7;//原比照筆硯留1.2CM(+2)，2018/06/29要求改回規範1.5CM(+7);
        var x_lt = line_x - 6;
        var y_lt2 = (pageHeight - 12) / 2;

        rows.push(Ext.String.format('<svg width="{0}" height="{1}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink= "http://www.w3.org/1999/xlink" version="1.1" >',
            pageWidth, svgHeight));
        rows.push('<style type="text/css" >');
        rows.push('<![CDATA[');
        rows.push('text  {font-family:"Times New Roman",BiauKai,標楷體;}');

        rows.push('@page { margin: 0cm 0cm 0cm 0cm; }');

        rows.push(']]>');
        rows.push('</style>');
        rows.push('<g class="gBackground g1">');

        rows.push('    <title>background</title>');
        rows.push(Ext.String.format('<rect fill="#ffffff" id="canvas_background" width="100%" height="100%"/>'));
        //裝訂線        
        var opa = (KangDaAppConfig().gutterShow) ? '1' : '0';
        //var ctr = Ext.getCmp('ctnPreview');
        //if (ctr && KangDaAppConfig().gutterShow) opa = '1';
        rows.push('<g id="canvas_gutter_1" class="gGutter">');
        rows.push(Ext.String.format('<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="#8e8e8e" opacity="{4}" stroke-width="1" stroke-dasharray="1.5" fill="none" class="gutterMargin"/>',
            line_x, pageMargin.top / 2, line_x, pageHeight - (pageMargin.bottom / 2), opa));
        rows.push(Ext.String.format('<text font-size="12" fill="#8e8e8e" x="{0}" y="{1}" opacity="{2}" class="gutterMargin">裝</text>',
            x_lt, y_lt2 * 0.68, opa));
        rows.push(Ext.String.format('<text font-size="12" fill="#8e8e8e" x="{0}" y="{1}" opacity="{2}" class="gutterMargin">訂</text>',
            x_lt, y_lt2 * 1.02, opa));
        rows.push(Ext.String.format('<text font-size="12" fill="#8e8e8e" x="{0}" y="{1}" opacity="{2}" class="gutterMargin">線</text>',
            x_lt, y_lt2 * 1.36, opa));
        rows.push('</g>');

        //騎縫章
        if (seal) rows = seal.createPagingSeal(rows);


        //浮水印(8/31台北市來文不加浮水印)
        //rows.push('<text id="canvas_watermark_1" class="canvaWatermark" x="250"  y="440" fill="#ffcccc"  opacity="0" style="font-size:300px;" >來</text>');
        //rows.push('<text id="canvas_watermark_2" class="canvaWatermark" x="250"  y="840" fill="#ffcccc"  opacity="0" style="font-size:300px;" >文</text>');

        ////Taipei浮水印（離線版不要浮水印）
        //if (typeof require == 'undefined') {
        //    var taipeiWaterMark = 'data:image/bmp;base64,Qk3yQwMAAAAAADYAAAAoAAAA+wAAABsBAAABABgAAAAAALxDAwAAAAAAAAAAAAAAAAAAAAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+6+vr7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t7Ozs9/f3////////////////////////////////////////////////09PT1NTU////////////////////////////6+vr7e3t7e3t7e3t7e3t7e3t7e3t7Ozs+fn5////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz8zMzM0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ09PT1dXV0tLS0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ1NTU1dXV1dXV0dHR6+vr////////////////////////////////////////////////09PT1NTU////////////////////9vb2z8/P1dXV1dXV1dXV09PT1NTU1dXV1dXV1dXV1NTUz8/P+vr6AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp09PT8vLy////////////////////////////////29vb1NTU09PT4ODg////////////////////////////////////////////////////09PT1NTU////////////////////6enp1dXV19fX09PT0dHR7u7u3t7e0dHR09PT1tbW19fX1tbW3t7eAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp09PT8vLy////////////////////////////////////6Ojo6urq////////////////////zMzM7+/v////////////////////////////09PT1NTU////////////////////6urq1dXV0tLS////////////////////////3Nzc1tbW1NTU+vr6AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////zc3N0dHR0dHR0dHR0dHR0dHR0dHR0dHR1dXV19fX09PT0dHR0dHR0dHR0dHR0tLS09PT09PT0NDQ7u7u////////////////////////5+fn1dXV1NTU4eHh7Ozs////////////////////09PT1NTU////////////////////6urq09PT7u7u////////////////////////////0dHR09PT////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4+Pj5eXl7Ozs6urq6urq6urq6urq6urq7Ozs39/f1dXV4+Pj6+vr6urq6urq7Ozs3Nzc1tbW19fX1NTU3t7e////////////////////////2dnZ1NTU1dXV1dXV1dXV0tLS7e3t////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////3d3dz8/P////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3Nzc1NTU////////////////////////////6urq09PT8vLy////////////////////2tra1dXV5eXl////////////////////////////////6Ojo7Ozs3d3d0tLS1NTU0tLS0tLS7e3t////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////9fX15+fn////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0tLS19fX1NTU09PT09PT09PT09PT09PT09PT1tbW1tbW5OTk7Ozs////////////////////09PT1dXV+Pj4////////////////////////////////////////////9vb26urq0NDQ09PT1NTU19fX1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg0dHR09PT09PT09PT09PT19fX19fX1NTU09PT09PT09PT09PT0tLS0dHR0NDQ4uLi7u7u3d3d1tbW1NTU9/f3////////////////////////////////////////////////////////6enp0dHR19fX1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0dHR19fX////////////////9PT06enp6+vr7+/v1NTU1dXV1NTU0tLS4ODg////////////////////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6+vr////////////////////////////5OTk1NTU5OTk////////////////////////zs7O0tLS09PT6+vr+Pj4////////////////////////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4+Pj0tLS1tbW////////////////////////////09PT1NTU4+Pj////////////////////+/v7////////////////////////zc3N+/v7////////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4uLi09PT1NTU8vLy////1tbWzs7Oz8/Pz8/Pz8/P09PT09PT0dHRz8/Pz8/Pz8/Pz8/Pz8/P0NDQ0dHR1NTU1NTU0tLS39/f////3Nzc0tLS+vr6////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy09PT1tbW////////////////////////////////////////////////////////////9vb209PT19fX1tbW7Ozs////6urq1NTU4uLi////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2tra19fX7+/v7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7+/v4eHh1dXV5eXl8PDw7u7u4ODg1tbW1tbW0tLS+Pj4////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7e3t7+/v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx1NTU0NDQ0NDQ0tLS1dXV0dHR0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0tLS1tbW1dXV0dHR0NDQ0tLS1tbW1tbW0dHR9/f3////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6+vr5OTk+vr6/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f390NDQ////////9vb21NTU////////////////////////////////////////////////////3t7e4+Pj+/v7////////2dnZ3t7e+Pj4////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7u7u////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5OTk1NTU4+Pj6+vr6urq6urq6urq6urq6urq6urq6urq6urq6urq6+vr6+vr1NTU09PT7e3t////////////////////////////////////////////////////////////////////09PT1NTU////////////////////6urq1dXV1dXV0dHR7e3t////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5eXl1NTU4eHh6Ojo5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn6Ojo1dXV1dXV7+/v////////////////////////////////////////////////////////////////////09PT1NTU////////////////////6urq1NTU4uLi39/f0NDQ09PT7e3t////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5eXl09PT9fX1////////////////////////////////////////////////09PT1tbW4+Pj////////////////////////////////5eXl0NDQ0tLS0tLS0tLS0tLS0tLS0tLS0tLS19fX1NTU////////////////////6urq09PT7e3t////9/f30NDQ0tLS4ODg+fn5////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2NjY9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5eXl1dXV09PT0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1tbW19fX09PT////////////////////////////////8vLy6Ojo6enp6enp6enp6enp6enp6enp6urq1dXV1NTU////////////////////6urq09PT7Ozs////////9vb23Nzc1NTU0dHR+/v7////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb23d3d9fX12NjY7Ozs////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5ubm1NTU7e3t6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr6+vr7e3t3t7e1dXV7e3t////////////////////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////29vb1tbW0dHR+/v7////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ4+Pj39/f1dXV3t7e////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz7e3t4ODg8fHx8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw7+/v4+Pj8fHx7Ozs9/f3////////////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////z8/P19fX1dXVz8/P////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj44eHh4eHh1dXV39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4eHhzs7O0tLS0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ09PT1dXV1NTU0NDQ0NDQ0NDQ0NDQ0NDQ1NTU1tbW1dXV0tLS7Ozs////////////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////9/f30dHR09PT29vb////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////29vb5OTk4uLi1dXV39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6Ojo1dXV2NjY////////////////////2dnZ1tbW1tbW0dHR9/f3////////////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////8/Pz9PT0////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ2tra3d3d1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY////////////////////////3d3d4+Pj////////////////////////////////////////////////////////////////////09PT1NTU////////////////////6urq09PT7Ozs////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX10tLS1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4eHhzs7O0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ1NTU19fX19fX0dHR0NDQ0NDQ0NDQ0NDQ0dHR09PT1NTU1dXV1dXV1dXV09PT////////////////////////////////////////////////////09PT1NTU/Pz8////////////////6urq09PT7u7u////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/f1dXV39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6Ojo1dXV19fX/v7+////////////////////////8/Pz0dHR19fX09PT39/f////////////////////////////////////////////////////09PT19fX0dHR////////////////6urq1dXV09PT+fn5////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f392tra1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5eXl09PT0tLS3t7e////////////////////////////8/Pzz8/P6urq////////////////////////////////////////////////////////zs7O0tLS3d3d9fX1////////////6enp09PT0NDQ6Ojo////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT00tLS1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx5ubm9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz5eXl////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3t7e1dXV3t7e////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/f1NTU7Ozs////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3t7e////3d3d1tbW1tbW4ODg////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp////39/f1tbW1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb21NTU19fX1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT03t7e+Pj40dHR2NjY1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX119fX////+vr61NTU1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb20tLS5eXl1dXV19fX1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn51NTU1tbW19fX2NjY1tbW4ODg////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////7Ozs1NTU1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1NTU5+fn////////////3t7e1NTU1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1NTU5ubm////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////29vb1dXV1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW0tLS/Pz83d3d1tbW19fX2NjY2NjY2NjY19fX19fX1tbW1tbW1tbW1tbW1tbW1tbW1tbW1dXV3t7e////////////////////////////+Pj409PT1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW09PT9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f390tLS1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1NTU////////////////////6Ojo1NTU1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1NTU7e3tAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1dXV6Ojo////////////+Pj41dXV19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX09PT////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX11NTU19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX////3d3d1tbW2NjY2NjY2NjY2NjY2NjY19fX19fX19fX19fX19fX19fX19fX19fX1tbW39/f////////////////////////////+Pj409PT19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1dXV////////////////////6enp1dXV19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV5ubm////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////29vb1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU6+vr////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////7u7u1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3t7e/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f392NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ/v7+////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT9PT0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////7+/v1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5ubm/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz819fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////9/f31NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT01NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3t7e////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3Nzc1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////+fn51NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3d3d////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT01NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////4eHh1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS////////////////////////////////////////////////////////////////////////////////////////////////////////////////6urq1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6urq////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////7+/v1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV5+fn/////////////////////////////////////////////////////////////////////////////////////////////////////////v7+19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY/v7+////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg+fn5z8/P7u7u3t7e9fX1////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV7u7u8PDw7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v8PDw5+fn1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU6+vr////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////6urq7Ozs3d3d9vb2////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1dXV09PT////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ/v7+////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////3Nzc9vb2////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX6Ojo5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5ubm5eXl////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////+Pj43d3d3Nzc9PT0////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+Pj4////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////3d3d5+fn////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////+Pj41NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////3d3d7u7u////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+Pj4////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi8vLy1NTU2NjY/v7+////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////7+/v1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3t7e3Nzc19fX09PT9vb2////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3t7e3t7e19fX1NTU+fn5////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////7e3t1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY/f39////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX2NjY1tbW4eHh9vb2+/v7////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU6+vr////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fXz8/P9fX1////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9/f3/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////7u7u1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY/v7+////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW6enp8fHx8PDw8vLy/////////////////////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////9/f31dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6+vr////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY1dXV+fn5+fn51NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1dXV1dXV1NTU1dXV2NjY2tra8fHx/f39/////////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5+fn/////v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+////9fX11dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+vr6////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU7+/v+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX19fX1NTU19fX2tra9PT0/////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY8/Pz8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw7+/v////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////+Pj41tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU////////////////////////////////////////////////////////////////3Nzc1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW29vb/Pz81NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX1NTU2dnZ/v7+/////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1NTU0tLS////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1/////////////////////////////////////////////////////////v7+2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+Pj4////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+vr6+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW2NjY/////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////7e3t1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3d3d////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3d3d+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW2NjY/////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS////////////////////////////////////////////////////////2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW2NjY/f39/////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////7e3t1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV5+fn////////////////////////////////////////////////9vb21NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY/f39////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6enp/////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU/v7+////////////////////////////////////////////29vb1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU6+vr////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8PDw1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT9fX1/////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1/////////////////////////////////////////v7+2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW6Ojo1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW2tra/////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////+fn51dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3d3d////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6+vr////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV09PT09PT09PT09PT09PT1dXV1tbW1tbW1tbW1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX/v7+/////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////4eHh1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS////////////////////////////////////////2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+/v7////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8/Pz/////f39/f39/f39////6+vr5OTk5eXl5eXl4+Pj0tLS1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo/////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////8fHx1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV5+fn////////////////////////////////9fX11dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1/////////////////////////////////////////v7+7e3t2NjY1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX/////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU/v7+////////////////////////////29vb1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////6urq1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ/////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1dXV09PT////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////7u7u1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1/////////////////////////v7+2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV8/Pz/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX5ubm5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5OTk4+Pj////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////////19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3d3d////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////+fn509PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS/////////////////////f3919fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////f392dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////////+Pj41dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV5ubm////////////////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6urq////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////////5OTk1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3t7e////////////////3Nzc1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi4uLi1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////////4+Pj1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////////////+Pj41dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT9PT0////////9PT01NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6+vr////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj4uLi1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////////5OTk1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////////////////1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5OTk////////6urq1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0/////////////////////////////////////////////////////////Pz81dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////////////////7e3t1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV/////v7+19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi5eXl1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////////////////////1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo9vb21NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+Pj4////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi6urq1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////3Nzc1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8fHx/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////////////////////////////7u7u1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg+/v709PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////39/f1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW9/f3/////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA////////////////////////////////////////////////////////////////////////7+/v1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6urq////////////////////////////////////////////////////////////////////////////////////////9/f31dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+Pj4////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////3t7e1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9vb2////////////////////////////////////////////7u7u19fX1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY/////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra1tbW/v7+////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6+vr8/Pz8vLy8vLy8vLy8vLy8vLy8vLy9PT04eHh2dnZ2dnZ1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh/////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX29vb2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2tra2NjY////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX0tLS/v7+////////////////+Pj41dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU6urq////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV1NTU1NTU1NTU1NTU1NTU1NTU1NTU1NTU1tbW19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy/////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX1NTU////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/v7+////////////////////4eHh1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX/v7+////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////3t7e1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX/////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/v7+////////////////////8fHx1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6+vr////////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////5+fn1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU7u7u/////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/v7+////////////////////////19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY/v7+////////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX/////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/v7+////////////////////////7e3t1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////9vb209PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW9fX1/////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/v7+////////////////////////////2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+Pj4////////////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////3t7e1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV4ODg/////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/v7+////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT39/f/////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/v7+////////////////////////////+Pj41dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+Pj4////////////////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW1NTU9PT0/////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/v7+////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh////////////////////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////3d3d1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW09PT3Nzc9PT0/////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/v7+////////////////////////////////8fHx1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6urq////////////////////////////////////////////////////////////////////////////////////////////////////3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////9vb21NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW1tbW1NTU1dXV4uLi8/Pz/////////////////////////////////////////////f3909PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7u7uAAAA09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PTz8/P/v7+////////////////////////////////////1dXV09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1dXV////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ0tLS09PT09PT1dXV19fX2NjY2NjY19fX2NjY1tbW1NTU2NjY19fX1NTU1NTU3d3d////////+fn51NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1dXV5OTk4eHh9PT0/Pz8/////////////////////////////////////////////////////f39z8/P09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0dHR////////////////////5+fn0dHR09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0dHR7OzsAAAA+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+vr6////////////////////////////////////////+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7/f39////////////////////////////////////////////////////////////////////////////////////////////////////////+/v7+/v7+/v7/Pz88/Pz29vb19fX1NTU3d3d1NTU4ODg9/f31NTU29vb/f395ubm9vb2////////+Pj409PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb+vr6+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7////////////////////////////////////////////////////////////////////////+vr6+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+vr6/////////////////////f39+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7/f39AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4+Pj1dXV1NTU9fX1/Pz83d3d3Nzc/Pz819fX09PT+Pj4/////////////////v7+29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT9fX1////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9/f31NTU1NTU+fn5/////Pz8zs7O+/v73d3d0dHR7+/v////////////////9/f30tLS2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb21NTU1NTU/f394uLi19fX3Nzc////////5+fn5ubm////////////////////3t7e1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX11NTU1tbW5eXl5ubm6enp6+vr5ubm5OTk8/Pz////////////////////////3d3d1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr619fX1tbW4ODg/Pz80dHR1dXV2NjY19fX29vb////////////////////////9fX11NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn53d3d1dXV3t7e////4eHh3Nzc09PT0NDQ9vb2////////////////////////+/v71NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3t7e2NjY/Pz8////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2NjY1dXV1NTU+Pj49/f3zs7O29vb/v7++Pj48vLy/f39////9/f39/f3////////4eHh1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV4eHh////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2tra0tLS/Pz8/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+3d3d1dXV4+Pj////+fn5+/v7////+fn5zc3N9/f3+Pj40NDQ0dHR+Pj4////5ubm1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3d3d////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ0tLS/v7+6enp5OTk////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3Nzc1dXV4ODg////////////////39/f0NDQ9vb2////5ubm3t7e+fn5////8fHx1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY2tra8PDw////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3d3d1dXV19fX////9/f38/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz09PT1dXV+/v77Ozs6+vr////9fX15eXl////////////////////////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+7Ozs1tbW1dXV7u7u////3Nzc4eHh////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz7+/v3t7e1tbW/Pz8+Pj4////8vLy////+vr69vb2////////////////////+fn51NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3d3d////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////29vb1NTU19fX1tbW5+fn7+/v09PT6urq/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39/f393t7e4ODg////29vb2NjY09PT29vb1NTU3d3d////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3d3d////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+19fX19fX2NjY2NjY1tbW1dXV0tLS/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////29vb1NTU/f3939/f1tbW2NjY19fX1tbW29vb////////////////////9/f309PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3d3d////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx1NTU2NjY2NjY2NjY2NjY1dXV3d3d/f39/////////////////////////////////f398/Pz+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////9PT009PT1NTU/Pz83t7e1dXV2NjY19fX2tra39/f+Pj4////////////////////3Nzc1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX4uLi////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz1NTU2NjY2NjY2NjY1tbW4ODg////////////////////////////////////9/f36+vr0tLS09PT/Pz8////////////////////////////////////////////////////////////////////////////////////////////////////+fn51tbW09PT+/v76Ojo3t7e1NTU19fX3d3d////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f396urq1dXV2NjY2NjY19fX2tra/v7+////7u7u2dnZ8fHx////////////////////19fX1dXV2NjY1NTU9PT0////////////////////////////////////////////////////////////////////////////////////////////////////////5eXl0tLS+vr6////////8vLy1dXV09PT+fn5////////////8PDw2dnZ2dnZ2dnZ1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx0tLS2NjY2NjY2NjY19fX2tra3t7e3d3d1tbW1tbW0dHR9vb2////7e3t8/Pz3Nzc1tbW2NjY2NjY1dXV6urq////////////////////////////////////////////////////////////////////////////////////////////////////////+fn50tLS4+Pj////////+Pj41NTU19fX2NjY9/f3////////5eXl3d3d9PT09vb219fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ6enp////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz1NTU2NjY2NjY2NjY2NjY19fX19fX19fX19fX2NjY19fX19fX3t7e1tbW1NTU1tbW2NjY2NjY2NjY19fX29vb+/v7////////////////////////////////////////////////////////////////////////////////////////////////////3t7e0tLS39/f////////7+/v09PT19fX2tra////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY5eXl////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz89fX16+vr1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY09PT+vr6/////////////////////////////////////////////////////////////////////////////////////////////////////Pz87Ozs3d3d////////5OTk4uLi2dnZ1dXV4uLi////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx0NDQ1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+/v7////////////////////////////////////////////////////////////////////////////////////////////////////+fn509PT3Nzc/////////////f393d3d1dXV39/f////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU7u7u////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy2tra2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9vb2////////////////////////////////////////////////////////////////////////////////////////////////////7+/v1NTU09PT9/f3////////2tra09PT1tbW4ODg////////////////////////3d3d1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6+vr2dnZ2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW5ubm////////////////////////////////////////////////////////////////////////////////////////////////2dnZ1dXV1NTU+fn5////////5+fn8PDw1dXV1dXV+Pj4////////////////////9fX11NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3d3d1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh/////////////////////////////////////////////////////////////////////////////////////////////////f393d3d1NTU8vLy////////9fX129vb1NTU1dXV/Pz84eHh7u7u9vb2////+fn58fHx1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj41dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////3d3d1dXV3Nzc////+Pj40NDQ1dXV6urq7Ozs////9PT029vb5ubm5+fn1dXV1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////5OTk19fX6enp////////9PT00tLS8vLy29vb////////////////4+Pj0dHR1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3d3d9fX12NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////////////////////+Pj41NTU9PT0////+fn52tra0tLS+vr629vb7Ozs/////////////////f395ubm1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2NjY2tra1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY7e3t2dnZ+/v7////////////////////////////////////////////////////////////////////////////////////////+Pj41NTU0dHR+fn59/f3z8/P3t7e/////f39+fn5////////////////4uLi7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn50NDQ8/Pz1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV0tLS+vr6////////////////////////////////////////////////////////////////////////////////////////8fHx1dXV1NTU+Pj4////8fHx1NTU9PT04eHh+Pj4////////////////8/Pz0tLS19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz83Nzc1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU/v7+////////////////////////////////////////////////////////////////////////////////////////29vb1tbW1NTU+Pj4////+Pj41NTU1dXV0tLS9/f3////////////////+Pj42tra3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb8vLy////////////////////////////////////////////////////////////////////////////////////7e3t1dXV1NTU+fn5////9/f309PT2NjY1NTU+vr6////////////////9/f3zc3N6+vr1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f397e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX0tLS5eXl////////////////////////////////////////////////////////////////////////////////2tra19fX1dXV8PDw////+/v739/f19fX19fX3d3d3t7e3d3d5OTk/////v7++Pj49/f30dHR2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3d3d////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8PDw0tLS2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6enp////////////////////////////////////////////////////////////////////////////9/f30tLS1tbW19fX1NTU/Pz86+vr3t7e19fX2NjY19fX1tbW1tbW1dXV+/v7////////////8/Pz1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW8fHx////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb21dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo/////////////////////////////////////////////////////////////////////////////////f393d3d1dXV4ODg////+Pj409PT2NjY1dXV1dXV2NjY2NjY1tbW4uLi////4uLi8/Pz9fX11NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v7////29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3t7e////////////////////////////////////////////////////////////////////////////////////3Nzc1dXV3d3d////9vb20dHR1dXV9fX18vLy09PT2NjY19fX29vb////29vb29vb39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX19/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8PDw1dXV2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+/v7////////////////////////////////////////////////////////////////////////////////8vLy1NTU09PT+fn5////8PDw0tLS4uLi////4+Pj1tbW2NjY0tLS9/f3+vr6+vr69PT01NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr629vb3t7e09PT1NTU39/f+fn59vb2////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX109PT19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1////////////////////////////////////////////////////////////////////////////////+vr61tbW1NTU8PDw/v7+////2tra0dHR8PDw9PT01NTU1tbW29vb+fn5////////+fn51NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj429vb39/f////////////////+/v75ubm3d3d39/f2NjY1tbW1tbW2NjY19fX1tbW1NTU1tbW8fHx3d3d3Nzc8fHx////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8PDw1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////////////////////////4ODg1tbW09PT+fn5/////Pz83Nzc0dHR9fX1////3Nzc09PT0NDQ+Pj4////+Pj409PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3d3d////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX19/f3+Pj45ubm7+/v4uLi1dXV1dXV2NjY9fX19/f3+fn54ODg1NTU1tbW1tbW19fX2NjY2NjY2NjY2NjY2NjY19fX2NjY2tra1tbW1NTU7u7u////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3Nzc1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////+fn51dXV1tbW4ODg////////////8/Pz+vr6+Pj4+vr68/Pz7u7u+Pj4////////+vr61tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////////////////////////////////////////////////////////////////////////////9vb29vb2/v7+////+vr69fX1/v7+////+fn50NDQ1NTU1NTU1dXV1dXV1tbW2NjY2NjY1tbW29vb09PT1NTU1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX2NjY1tbW6urq3d3d+fn59/f39vb2////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////+fn51NTU1tbW39/f////////9vb20tLS9PT0z8/P5OTk5eXlz8/P3Nzc5OTk////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV4eHh////////////////////////////////////////////////////////////////////////////////////////////////5eXl0tLS09PT29vb4ODg19fX09PT29vb4ODg2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW1tbW1NTU1NTU09PT////////+/v7/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT0////2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////8/Pz09PT39/f////+Pj49/f309PT3Nzc09PT+vr6////8/Pz0tLS2tra////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU9vb2////////////////////////////////////////////////////////////////////////////////////+Pj429vb1dXV2NjY2NjY19fX1tbW19fX2NjY19fX1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra4ODg19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp2NjY1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW+/v7////////////////////////////////////////////////////////////////////////////////9/f30tLS39/f////2NjY2NjY19fX19fX1NTU8vLy////////+vr69PT0////////3d3d1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////+Pj439/f1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW19fX1dXV+vr69/f39/f39/f39/f39/f39/f39vb2////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW+/v7////////////////////////////////////////////////////////////////////////////////+fn50tLS3t7e////+fn58fHx1dXV2NjY1dXV29vb////////////2dnZ9/f3////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi/////////////////////////////////////////////////////////////////////////////Pz85eXl0tLS1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU1NTU1NTU1NTU1NTU1NTU1NTU0tLS////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx0tLS19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////////+/v74uLi9PT0////8fHx09PT1dXV3Nzc+/v7////////39/f19fX////////+/v71tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9vb2////////////////////////////////////////////////////////////////////////////1NTU1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f397+/v1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////8fHx29vb////9PT03t7e4uLi9PT0////////+Pj42NjY9PT0+fn5/f39////4uLi1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9vb2////////////////////////////////////////////////////////////////////6urq3d3d1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX39/f6+vr////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2tra19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+fn5////////////////////////////////////////////////////////////////////////////////////4ODg09PT1dXV/Pz85OTk9/f3+vr629vb////////////////////19fX9PT0////3d3d1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////5ubm2NjY1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW1dXV7e3t3Nzc6+vr////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj48PDw1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////8vLy1NTU3d3d////8PDw3d3d9vb209PT+/v7////7e3t5eXl2tra8PDw////+fn53Nzc19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT8/Pz/////////////////////////////////////////////////////Pz829vb1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV1tbW0tLS8fHx////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj4+fn56Ojo+fn59/f3+/v7////////////////////////////////////////////1dXV1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////6Ojo09PT4ODg////9/f31tbW2NjY1dXV5eXl////7Ozs9PT04ODg////////////5ubm1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////9/f309PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7e3t////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1NTU1NTU1dXV1NTU09PT1dXV/Pz8////////////////////////////////////////3t7e1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////2tra29vb////+fn51tbW1tbW19fX2NjY3d3d+vr6////+Pj43Nzc4+Pj////9PT01NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1////////////////////////////////////////////////5ubm19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6Ojo////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7e3t5+fn/Pz829vb1dXV19fX2NjY2NjY2NjY2NjY19fX1tbW+Pj4+vr64ODg3d3d9fX1////////////////////7+/v1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+/v7////////////////////////////////////////////////////////////////////////////////////////5OTk19fX9vb2////3d3d3Nzc2NjY19fX09PT9/f3////29vb0tLS8fHx////5eXl1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8PDw/////////////////////////////////////////////f390dHR19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT+/v7/f39////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7u7u39/f1dXV1dXV1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU1NTU1tbW1tbW0NDQ/v7+////////////////1NTU1NTU1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV5+fn////////////////////////////////////////////////////////////////////////////////////////////////////////9/f3////5eXl1dXV1NTU+Pj4+Pj409PT1NTU8vLy////5ubm19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////+/v79fX13t7e39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT19fX////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz8+fn54ODg1NTU1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1////////////////9/f39fX15+fn1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////////////////////////////+vr6+fn54eHh/////////v7++fn53Nzc09PT+Pj4+/v71dXV1dXV4uLi////////5ubm1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3d3d////////////////////////////6urq1tbW1NTU1tbW1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX0dHR////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj4+Pj4+vr66enp0tLS1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0dHR+fn5////////////////8/Pz09PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8PDw////////////////////////////////////////////////////////////////////////////////////+fn50tLS29vb0dHR+Pj4////9fX10NDQ19fX1NTU+fn5////5OTk1NTU5ubm////////+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc/Pz8+vr69/f3+vr6/Pz89fX13t7e2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5+fn////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7++/v709PT09PT1NTU1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg/////////////v7+7e3t1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////////////////////////9vb20dHR19fX1tbW5OTk////////29vb1dXV1dXV4uLi/////Pz81dXV1dXV+fn5////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV5OTk4+Pj0tLS1tbW2NjY1NTU1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7Ozs////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ09PT19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU5+fn////////7Ozs09PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi/////////////////////////////////////////////////////////////////////////////////////v7+7u7u09PT1tbW3t7e////////9PT04uLi3t7e0tLS8fHx////4ODg0tLS9/f3////+Pj409PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX4ODg2tra19fX19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU/v7+////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3t7e4ODg29vb1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT7Ozs////29vb1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////4uLi1dXV4ODg////+vr63Nzc1dXV19fX1tbW4eHh////39/f09PT+vr6/////f3919fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////9/f3////////+Pj4+/v74ODg1dXV1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra3t7e////4ODg3Nzc19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////5OTk1dXV19fX8PDwzs7O19fX2NjY2NjY1dXV9PT0/Pz83t7e1tbW3t7e4ODg4uLi2tra19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////ysrK////////0tLS09PT1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT9/f3/f399vb21dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////7Ozs1NTU29vb/f397+/v0dHR19fX2NjY2NjY1dXV1NTU19fX2NjY19fX1tbW1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6+vr////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////9PT0////+/v71tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU0tLS3Nzc19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////4eHh1tbW09PT+fn5////+Pj43t7e19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT8fHx////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////0tLS19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5OTk4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////////////+fn51NTU1tbW5eXl////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5+fn////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////3d3d4eHh19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW6enp5OTk1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX+/v7////////////////////////////////////////////////////////////////////////////////////////9vb209PT1tbW3t7e////////5OTk1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7Ozs////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////4uLi1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////////////////////////////////////////////////////////////////////////////////////////3Nzc1dXV39/f////////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX0tLS/v7+////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////4ODg1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////3t7e1dXV39/f////9vb20NDQ3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT6+vr////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+/v7////////////////////////////////////////////////////////////////////////////////////////////4uLi1dXV3d3d////+fn50tLS3d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5ubm////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////6Ojo1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV5+fn////////////////////////////////////////////////////////////////////////////////////////////9PT01NTU09PT9vb2////+fn58fHx1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU+/v7////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////7+/v09PT19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY7Ozs1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW1NTU+fn5////////4+Pj1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ7+/v////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////Pz809PT19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5ubm8/Pz1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////+vr61tbW1dXV5eXl////+fn54eHh7+/v1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6+vr////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////8/Pz0dHR19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+Pj42NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////4ODg1dXV39/f////6Ojo5OTk2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV1NTU1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT8vLy////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////v7+6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8/Pz1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////+/v73Nzc1tbW19fX/f393Nzc1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW7+/v9/f38vLy1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT6+vr////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////7e3t09PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV2tra+/v76enp1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////+fn51NTU09PT9/f3+/v729vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3d3d/////////f391dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV5eXl/Pz8////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////8vLy29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU5OTk////1tbW1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////+Pj41dXV29vb+vr6////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW+vr6////////5+fn19fX1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW29vb/f39////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////7Ozs1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU39/f////////29vb1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1NTU3t7e////9PT01dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh////////////5+fn29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX3Nzc////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////7+/v19fX1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5eXl+vr6////////////4ODg19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2tra4ODg09PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb/////////////////v7+1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0dHR////////////////4uLi8vLy3Nzc19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW19fX1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc////////////////+vr609PT19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////9fX13d3d19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU4+Pj////////////////09PT5ubm3Nzc19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW+Pj4////////////+/v72tra19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////8vLy2tra1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV1tbW5OTk////////////////////9vb27Ozs19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////5eXl1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////+fn519fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7Ozs////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////7+/v0dHR1tbW19fX19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU5OTk+/v7////////////////////////////2tra1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////////////////+fn53t7e1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8fHx////////////////////7Ozs29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU2NjY////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////9vb22tra3Nzc3Nzc2NjY1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5eXl/////////////////////////////////////v7+19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX/Pz8////////////////////////////////////////////////////////////////////////////////////////////9/f31tbW1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////4uLi1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV6enp////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////Pz89vb22dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU7e3t////////////////////////////////////8PDw0tLS2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9vb2////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////4eHh1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////7e3t09PT1dXV1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh+fn5////////////////////////////////////////5+fn1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////////////////////////////////////////+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT9PT0////////////////9PT01NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW4ODg////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////+/v75+fn5eXl+fn51tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5OTk////////////////////////////////////9PT07Ozs2tra19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8fHx////////////////+/v71NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU4+Pj////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////0tLS19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT9/f3////////////////////////////////////8vLy0tLS19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////9vb20dHR2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra/////////////////f391NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX1dXV2dnZ1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5eXl/Pz8////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb21dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////////////7u7u1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////9/f309PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW+Pj4/////////f396Ojo1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX19fX19fX29vb7Ozs////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV/f39////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////29vb1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+Pj4////////////////////////////////////////2NjY1tbW2NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////////////////+Pj42NjY19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9vb2////////4eHh1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX2NjY19fX1NTU1NTU2dnZ3Nzc29vb3t7e////+vr6////6Ojo19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra9PT0////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5+fn1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV/////////////////////////////////////////////f39/Pz82tra19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY/Pz8////////////////////////////////////////////////////////////////////////////////////////////////+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi/////Pz82NjY19fX2NjY2NjY2NjY2NjY2NjY19fX19fX1dXV1tbW1tbW19fX09PT19fX9/f38/Pz/v7+/////////////Pz81NTU/Pz8////5ubm1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU2NjY////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5ubm////////////////////////////////////////////////////2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////////////////////////////////////////////////////////////////////////////////////////////9/f31NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ////+/v709PT19fX2NjY19fX19fX19fX1tbW1dXV2tra7u7u4uLi7u7u+/v78/Pz9PT0////////////////////////////////////////6Ojo19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV5eXl9PT0////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////4eHh4ODg/f39////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT6Ojo////////////////////////////////////////////9fX15eXl19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////9/f31NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7+/v////////9vb21NTU1NTU1dXV3Nzc29vb3d3d9/f3////////////////////////////////////////////////////////////////////////6enp1dXV2NjY19fX19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW1tbW/f39////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////6urq0NDQ0NDQ6enp////////////////////1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////8PDw1tbW7Ozs1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+/v7////////////////////////////////////////////////////////////////////////////////////////////////9/f31NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj/f39/f39////+Pj48/Pz9fX1////////////////////////////////////////////////////////////////////////////////////////////09PT1tbW2dnZ29vb29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX19fX19fX1NTU1tbW/v7+////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////+vr68/Pz8vLy////////////////////////1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX0dHR/////////////////////////////////////////////////////f3929vb39/f19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6enp////////////////////////////////////////////////////////////////////////////////////////////////9vb209PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXVzs7O8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////9/f32dnZ////////////0NDQ1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX1dXV2NjY09PT29vb9fX1/Pz8////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////3t7e7u7u////////////////0tLS1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW2tra4uLi////////////////////////////////////////////////////////////2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh////////////////////////////////////////////////////////////////////////////////////////////////////3Nzc19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT039/f09PT19fX19fX19fX19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX19fX2NjY19fX19fX19fX19fX1NTU2dnZ1tbW6urq/Pz88vLy////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////+fn539/f9PT0////////////////9fX129vb19fX19fX19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW19fX2NjY////////////////////////////////////////////////////////////////5eXl19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////3t7e1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj48vLy2dnZ29vb29vb29vb29vb1NTU1NTU1NTU1NTU1NTU19fX1dXV1NTU1NTU1NTU3Nzc19fX1NTU1NTU3Nzc29vb2tra9fX1/f39+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////8PDwysrK////////+/v7+/v7/Pz8////1NTU2dnZ3Nzc29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU4ODg+/v7////////////////////////////////////////////////////////////////////1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////8PDw1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy8/Pz8/Pz8/Pz8/Pz19fX6urq9PT08/Pz8/Pz////+vr68vLy8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////8fHx////9vb20dHR09PT0dHR6Ojo6Ojo5ubm////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW09PT5OTk+vr6////////////////////////////////////////////////////////////////////////6urq1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////9/f309PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ09PT19fX1dXV7+/v8/Pz0tLS3d3d1tbW2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU5OTk8/Pz////////////////////////////////////////////////////////////////////////////////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////////////////////////2tra19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy9PT01tbW1tbW5+fn3t7e19fX19fX2NjY2NjY2NjY2NjY19fX19fX1NTU1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////////8vLy1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY/Pz8////////////////////////////////////////////////////////////////////////////////////////////////////8PDw1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////7Ozs1dXV19fX1tbW19fX2NjY2NjY2NjY2NjY2NjY19fX2dnZ2dnZ8vLy+fn5////////////////////////////////////////////////////////////////////////////////////////////8vLy1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+/v7////////////////////////////////////////////////////////////////////////////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8PDw////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn5/f391tbW1tbW19fX2NjY2NjY2NjY2NjY1tbW0tLS5ubm////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV6enp////////////////////////////////////////////////////////////////////////////////////////////////////9/f31NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2NjY3Nzc19fX19fX2NjY2NjY1tbW4eHh9PT09/f3////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////////////////////////////////////////9/f31NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9/f30tLS1NTU1NTU1NTU1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+fn5////////////////////////////////////////////////////////////////////////////////////////////////9/f31NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn58fHx8vLy8vLy8vLy+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////+Pj41NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3919fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////4uLi1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4+Pj////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////+fn51dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3919fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW2dnZ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW39/f////////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn51tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+fn5////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////4eHh1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6Ojo1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+vr6////////////////////////////////////////////////////////////////////////////////////////////////////+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX11dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj41tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3d3d////////////////////////////////////////////////////////////////////////////////////////////////////+fn51NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW2dnZ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz81dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8fHx////////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6urq19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+/v7////////////////////////////////////////////////////////////////////////////////////////////////////////7+/v1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX11NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+Pj4////////////////////////////////////////////////////////////////////////////////////////////////////////+fn51NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW3t7e////////////////////////////////////////////////////////////////////////////////////////////////////////+fn51dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4eHh/////////////////////////////////////////////////////////////////////////////////////////////////////////f392dnZ19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f391tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////////////////////////////////////////////9/f30dHR2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY0tLS+Pj4/////////////////////////////////////////////////////////////////////////////////////////////////////f396+vr1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5OTk////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////+fn51NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vLy1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj41NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT01NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3919fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6+vr1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8fHx////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/f1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4uLi1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////9/f30dHR2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU7e3t/////////////////////////////////////////////////////////////////////////////////////////////////////////////////f396urq1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz819fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3d3d////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5OTk////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6Ojo09PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj41NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1dXV+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz85ubm1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj40tLS19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz0tLS19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8PDw1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz2dnZ19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY09PT/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn51NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb20tLS19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX0tLS+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9/f309PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8fHx/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6urq1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7+/v1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2tra19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW4ODg////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn51NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5OTk////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX11NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8PDw////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4uLi1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX11NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY6urq////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp5+fn4+Pj1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////19fX1dXV1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX0tLS+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6Ojo1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2tra19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f3919fX1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1dXV7Ozs////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7+/v1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+fn51NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6enp1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT+fn5////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3Nzc1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1tbW1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY2NjY2NjY2NjY1tbW4uLi////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT03Nzc19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2NjY19fX2NjY2NjY2NjY19fX19fX1tbW2NjY19fX19fX2NjY19fX09PT7+/v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4eHh1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9fX109PT19fX2NjY19fX1tbW1tbW4ODg6enp1tbW19fX19fX09PT8PDw////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9vb20tLS1tbW09PT////////5OTk1dXV1dXV8vLy0dHR8fHx////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////1tbW5OTk9/f30NDQ1tbW19fX0tLS/Pz8////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX+vr6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////5eXl1dXV19fX1dXV29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj409PT19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ1NTU0tLS8fHx////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4uLi1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9PT0////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f398vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr609PT2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8PDw////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////v7+29vb19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr61NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj40tLS19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8fHx1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU8fHx////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3d3d1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX+/v7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz2tra1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4uLi1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9fX1////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3t7e09PT19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX0tLS8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7e3t29vb19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX19fX////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pz80dHR1dXV19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT029vb1tbW2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9PT02tra1NTU1dXV19fX19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2dnZ8fHx////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6+vr6enp0tLS1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX09PT8vLy////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2tra19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX29vb////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7+/v1NTU2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX2NjY////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2dnZ1tbW19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU9/f3////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8/Pz2tra1NTU19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY19fX1tbW////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8PDw09PT19fX2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY1NTU5ubm////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4ODg0tLS1dXV2NjY2NjY2NjY2NjY2NjY2NjY2NjY1tbW5OTk+/v7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6Ojo1dXV2NjY2NjY2NjY2NjY2NjY19fX0tLS8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f396+vr////////////////////////////////1NTU2NjY2NjY2NjY2NjY19fX1dXV5ubm////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3t7e1dXV+/v7////////////////8PDw5+fn0tLS2NjY2NjY2NjY2NjY2NjY1tbW2dnZ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/fz8/P9/f3////////////////4ODg1NTU2NjY2NjY2NjY2NjY2NjY1dXV1tbW7+/v////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39zMzM9fX1////////////4uLi1tbW2NjY2NjY2NjY19fX1tbW5OTk/f39////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pj41NTU2dnZ5eXl////////4uLi1tbW2NjY2NjY19fX1dXV0NDQ8/Pz////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3t7e1dXV////////4+Pj1tbW2NjY2NjY1dXV6+vr////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3d3d0dHR1tbW2NjY2NjY19fX19fX2tra////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7e3t09PT19fX2NjY19fX19fX0tLS19fX////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4+Pj1tbW2NjY19fX3Nzc////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA';
        //    rows.push('<g id="canvas_taipeiWaterMark_1">');
        //    rows.push(Ext.String.format('<image x="{0}" y="{1}" width="{2}" height="{3}" xlink:href="{4}" opacity="{5}" />', 150, 300, 500, 500, taipeiWaterMark, '0'));
        //    rows.push('</g>');
        //}
        var modelName = OA.client.WK.getCurrentModelName();
        if (modelName && modelName.indexOf('AccountingReport') >= 0) {
            rows.push(Ext.String.format('<rect id="accountingReportMargin" x="{0}" y="{1}" width="{2}" height="{3}" style="stroke:black;stroke-width: 2;fill-opacity:0" class="test"/>',
                pageMargin.left - 10, pageMargin.top, workWidth + 55, workHeight));
        }


        rows.push('<text id="barcodeOrg" font-size="14" x="640" y="1033.5"></text>');
        //barcode
        rows.push(Ext.String.format('<image id="barcode" x="{0}" y="{1}" width="250" height="50"/>', barcodeX, barcodeY));
        //條碼來文標記
        rows.push(Ext.String.format('<text id="comeMark" xml:space="preserve" font-size="15" x="{0}" y="{1}" class="comeMark"></text>', barcodeX + 23, barcodeY + 40));
        //barcode 條碼  收文日期
        rows.push('<text id="barcodeDate" font-size="16" x="655" y="1078.5"></text>');
        //簽、簡簽（彙併辦）子文文號註記。
        rows.push('<text id="combineSno" font-size="16" x="550" y="1100"></text>');
        //邊界
        rows.push(Ext.String.format('<rect id="canvas_margin" x="{0}" y="{1}" width="{2}" height="{3}" style="stroke: #009900;stroke-width: 0;fill-opacity:0" class="canvasMargin"/>',
            pageMargin.left, pageMargin.top, workWidth, workHeight));
        //分頁線
        rows.push(Ext.String.format('<rect id="canvas_interval_1" x="0" y="{0}" width="{1}" height="{2}" fill="#444444" class="pageInterval" />',
            pageHeight, pageWidth, pageInterval));
        //頁碼
        rows.push('<text id="canvas_page_1" font-size="14" x="255" y="820"  class="canvasPage">第1頁，共1頁</text>');

        rows.push('</g>');

        rows.push('<g class="gContent g1">');
        rows.push('<title>_</title>');
        return rows;
    },

    /**
     * 核章區
     */
    createSealRows: function (rows, vm, seal) {
        var me = this;
        var isClear = false;
        var chapters = vm.chapters;
        if (OA.common.Paper.main()) isClear = OA.common.Paper.main().getIsClearPaper();
        //if (isClear) chapters = [];

        var options = {};

        //console.log(seal);
        //console.log('createSealRows');
        //傳入documentType
        var ctr = Ext.getCmp('ctnPreview');
        if (ctr) {
            options.doctype = ctr.getCurrentDoctype();
            options.tel = vm.承辦單位電話 || '';
            if (ctr.getPreviewMode() == 'Normal') return rows;
            seal.create(rows, chapters, options);
            if (me.getSealXml()) {
                var sealArray = me.getSealXml().split('\n');
                Ext.Array.each(sealArray, function (sealStr) {
                    rows.push(sealStr.trim());
                });
                //console.log(rows);
            }

        }
        else {
            var wk = OA.common.Global.getCurrentWKContent();
            var paras = OA.common.Global.getInitParas();
            options.doctype = (wk) ? wk.DocumentType : paras.documentType;
            options.tel = vm.承辦單位電話 || '';
            seal.create(rows, chapters, options);
            if (me.getSealXml()) {
                var sealArray = me.getSealXml().split('\n');
                Ext.Array.each(sealArray, function (sealStr) {
                    rows.push(sealStr.trim());
                });
                //console.log(rows);
            }
        }

        rows = seal.get('rows');
        this.setSealY(seal.get('sealY'));
        this.setSealHeight(seal.get('sealHeight'));
        this.setSealLocation(seal.get('location'));

        //console.log(seal.get('location'));

        return rows;
    },

    /**
     * 手寫板
     */
    createPadRows: function (rows, writingItems) {
        rows.push(Ext.String.format('<g class="gWritingPad">'));
        Ext.Array.each(writingItems, function (item) {
            Ext.Array.each(item.strokes, function (stroke) {
                rows.push(stroke);
            });
        });
        rows.push('</g>');

        // rows.push('<foreignObject x="10" y="10" width="100" height="150">');
        // rows.push('<body xmlns="http://www.w3.org/1999/xhtml">');
        // rows.push('    <table><tr><td style="border: solid 1px black;">Filed</td><td>123</td></tr></table>');
        // rows.push('</body>');
        // rows.push('</foreignObject>');

        return rows;
    },

    /**
     * 組文稿共用 閉合
     *
     *
     * @return {Array} 共用閉合部分 rows
     */
    closeTagToSvg: function (rows) {
        rows.push('</g>');
        rows.push('</svg>');
        return rows.join('')
    },

    /**
     * 驗證模型 layout 與 mapping 是否有缺少 key
     *
     * 保存年限 , 附件 暫不判斷
     *
     * @param {String} modelName 文稿模型
     * @param {record} layout 來源資料取得 layout 定義UI
     * @return {Array} 缺少欄位
     */
    verifyFields: function (modelName, layout) {
        var lost = [];

        var keys = Ext.ModelMgr.getModel(modelName).getFields().keys;

        layout.forEach(function (p) {

            if (p.key == '保存年限' || p.key == '附件')
                return true;

            if (keys.indexOf(p.key) < 0)
                lost.push(p.key);
        });
        return lost;
    },

    /**
     * 取得預設多筆項目（items），找不到 為空白
     *
     * var items = getDefaultItems(record,'地址')
     *
     * @param {record} record 記錄物件
     * @param {string} tag 欄位
     * @return {Array}
     */
    getDefaultItems: function (record, tag) {
        var ds = [];

        //行動簽核時署名預設取稿署名
        var r;
        if (tag == '署名') {
            var ctr = Ext.getCmp('ctnPreview');
            if (ctr) {
                if (ctr.getPreviewMode() == 'Draft')
                    r = record.data['稿署名'];
                else
                    r = record.data['署名'];
            }
            else {
                r = record.data['稿署名'];
            }
        }
        else {
            r = record.data[tag];
        }

        if (r) {
            if (r.items) {
                ds = r.items;
            } else {
                if (typeof (r) === 'string' || typeof (r) === 'number')
                    ds.push(r);
                else
                    ds.push('');
            }
        } else {
            ds.push('');
        }

        //if (tag=='KDRichTextBlock') {
        //    console.log(record);
        //    console.log(ds);
        //}
        return ds;
    },

    /**
     * 取得doctype ，修正類型
     */
    getDocType: function (doctype) {
        var result = doctype;
        if (doctype === "書函" ||
            doctype === "代辦處書函" ||
            doctype === "交辦案件通知單" ||
            doctype === "交議案件通知單" ||
            doctype === "催辦案件通知單" ||
            doctype === "移文單" ||
            doctype === "機密文書機密等級變更或註銷建議單" ||
            doctype === "機密文書機密等級變更或註銷通知單" ||
            doctype === "機密文書機密等級變更或註銷紀錄單" ||
            doctype === "機密文書機密等級變更或註銷處理意見表" ||
            doctype === "獎懲建議函" ||
            doctype === "派免建議函" ||
            doctype === "執行命令") {
            result = "函";
        } else if (doctype === "獎懲令" || doctype === "派免遷調令" || doctype === "派免令") {
            result = "令";
        }

        return result;
    },

    /**
     * 依公文種類取得電子交換標籤(dtd)
     */
    getDIDtd: function (doctype) {
        var result = '';
        var formatText = KangDaAppConfig().dtdFormatTyle || "utf8";
        if (doctype === '令') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_1_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '函') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_2_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '公告') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_3_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '開會通知單') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_4_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '簽') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_5_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '簽稿會核單') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_6_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '會銜公文會辦單') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_7_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '公文時效統計') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_7_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '會勘通知單') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_B_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '一般公文統計') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_8_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '立法委員質詢案件統計') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_8_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '人民申請案件統計') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_8_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '訴願案件統計') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_8_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '人民陳情案件統計') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_8_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '專案管制案件統計') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_8_{1}.dtd" [', doctype, formatText);
        } else if (doctype === '監察案件統計') {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_8_{1}.dtd" [', doctype, formatText);
        } else {
            result = Ext.String.format('<!DOCTYPE {0} SYSTEM "104_8_{1}.dtd" [', doctype, formatText);
        }

        return result;
    },

    /**
     * KDRichTextBlock Tree to List
     */
    doKDRichTextBlockList: function (items, vm, issend) {
        //console.log(issend);
        unflatten = function (array, parent, tree) {
            tree = typeof tree !== 'undefined' ? tree : [];
            parent = typeof parent !== 'undefined' ? parent : { id: '' };
            var children = Ext.Array.filter(array, function (child) {
                return child.parentid == parent.id;
            });
            if (!Ext.isEmpty(children)) {
                if (parent.id == '') {
                    tree = children;
                } else {
                    parent['children'] = children;
                }
                Ext.Array.forEach(children, function (child) {
                    unflatten(array, child)
                });
            }
            return tree;
        };
        var isNote = ['開會通知單', '會勘通知單'].indexOf(vm.DocumentType) >= 0;

        if (isNote) items.push('<備註>');

        // console.log(vm.KDRichTextBlockList);
        //發文要重組清空白條例及空白段落
        if (issend) {
            var sendKDRichTextBlockTree = [];
            Ext.Array.each(vm.KDRichTextBlockList, function (item) {
                var isPush = true;
                if (item.id !== 'KDRichTextBlock_0') {
                    //段落有條例，判斷條例中有沒有文字，如果有文字加到sendKDRichTextBlockTree
                    if (item.children) {
                        var notEmpty = false;
                        Ext.Array.each(item.children, function (child) {
                            if (vm[child.id].text.trim().length > 0)
                                notEmpty = true;
                        });
                        if (!notEmpty) isPush = false;
                    } else {
                        //判斷子類的父有沒有在sendKDRichTextBlockTree中，沒有表示整個段落都不新增
                        if (item.parentid) {
                            var nodes = sendKDRichTextBlockTree.filter(function (n1) {
                                return n1.id === item.parentid;
                            });
                            if (!nodes) isPush = false;
                        } else if (vm[item.id].text.trim().length == 0) {
                            //段名行，如果字串是空白，要補判斷子條例中，是有字
                            isPush = false;
                            var nodes = vm.KDRichTextBlockList.filter(function (n1) {
                                return n1.parentid === item.id;
                            });
                            if (nodes) {
                                Ext.Array.each(nodes, function (chid) {
                                    if (vm[chid.id].text.trim().length > 0) {
                                        isPush = true;
                                        return false;
                                    }
                                })
                            }
                        }
                    }
                }
                if (isPush) sendKDRichTextBlockTree.push(item);
            });
        }

        var KDRichTextBlockTree = issend ? unflatten(sendKDRichTextBlockTree) : unflatten(vm.KDRichTextBlockList);

        // console.log(KDRichTextBlockTree);
        // This function handles arrays and objects
        eachRecursive = function (obj) {
            // console.log(obj);
            for (var k in obj) {
                // console.log(k);
                if (typeof obj[k] == "object" && obj[k] !== null) {
                    var o = obj[k];
                    var r = vm[o.id];
                    var _context = r.textClear;

                    // console.log(r);
                    // console.log(o);
                    // console.log(_context);

                    if (r.layer == 0) {
                        if (r.mainLayer == 0 && r.paragraph == 0)
                            items.push('<主旨>');
                        else {
                            if (r.paragraph > 1) items.push('</段落>');
                            items.push(Ext.String.format('<段落 段名="{0}">', r.no));
                        }
                    }
                    else {
                        items.push(Ext.String.format('<條列 序號="{0}">', r.no));
                    }

                    items.push(Ext.String.format('<文字>{0}</文字>', _context.replace(/&/g, '&amp;').replace(/</g, '〈').replace(/>/g, '〉')));
                    if (o.children) eachRecursive(o.children);

                    if (r.layer > 0) {
                        items.push('</條列>');
                    }
                    else {
                        if (r.layer == 0 && r.mainLayer == 0 && r.paragraph == 0) {
                            items.push('</主旨>');
                        }
                        else {
                        }
                    }
                }
            }
        };
        eachRecursive(KDRichTextBlockTree);

        if (items.join('').indexOf('<段落') > 0) items.push('</段落>');

        if (isNote) {
            //開會通知單無條例級內容時要補回
            if (KDRichTextBlockTree.length == 0) {
                items.push('<段落 段名="備註：">');
                items.push('<文字></文字>');
                items.push('</段落>');
            }
            items.push('</備註>');
        }
        return items;
    },
    /**
     * 創簽稿
     */
    generateNewDoc: function (values) {
        //wk
        var qs = OA.common.Global.getQ();
        var qd = OA.common.Global.getQueryDefault();
        var modelName = OA.common.DIMgr.getModelName('wk', values.qFormat);
        OA.client.WK.setCurrentModelName(modelName);
        var record = Ext.create(modelName);
        var fields = record.getFields().map['layout'].config.mapping();
        //console.log(fields);

        //高市府先不用自建抄本
        /*
        var hasFild = Ext.Array.filter(fields, function (item) {
            return item.key == '抄本';
        });

        if (hasFild && hasFild.length > 0) {
            var dept = OA.common.Global.getCurrentDept();
            //console.log(dept);
            if (dept) {
                if (dept.depNo == 'A305') {
                    values.ContactList = [{
                        ADDR: '',
                        ARCENO: '',
                        CODE: dept.depNo || '',
                        CODENAME: dept.depName,
                        GROUP: "",
                        GROUPLIST: "",
                        KEY: "抄本",
                        PEOPLESEND: "",
                        REALTRANSTYPE: 5,
                        TRANSTYPE: '5',
                        TRANSTYPENAME: "抄本",
                        TYPE: 1,
                        VALUE: dept.depName,
                        tagName: "Contact",
                        ATTACH: 'Y',
                        isEdit: true,
                        editAtt: false,
                        isChange: 'N',
                        children: ''
                    }];
                } else {
                    values.ContactList = [{
                        ADDR: '',
                        ARCENO: '',
                        CODE: dept.upDeptNo || '',
                        CODENAME: dept.upDeptName || '',
                        GROUP: "",
                        GROUPLIST: "",
                        KEY: "抄本",
                        PEOPLESEND: "",
                        REALTRANSTYPE: 5,
                        TRANSTYPE: '5',
                        TRANSTYPENAME: "抄本",
                        TYPE: 1,
                        VALUE: dept.upDeptName,
                        tagName: "Contact",
                        ATTACH: 'Y',
                        isEdit: true,
                        editAtt: false,
                        isChange: 'N',
                        children: ''
                    }];
                }
                //增加判斷如果有評議受文者加到正本
                if (qd && qd.交換資訊 && qd.交換資訊.評議案件受文者 && qd.交換資訊.評議案件受文者.受文者) {
                    if (!Ext.isArray(qd.評議案件受文者.受文者)) {
                        qd.評議案件受文者.受文者 = [qd.評議案件受文者.受文者];
                    }

                    Ext.Array.each(qd.交換資訊.評議案件受文者.受文者, function (pojSender) {

                        var pojTranstype = '2';
                        var pojIsChange = 'N';
                        var pojSendtype = '紙本';
                        if (pojSender.發文方式 != 2) {
                            pojTranstype = '9';
                            pojIsChange = 'Y';
                            pojSendtype = "電子";
                        }

                        values.ContactList.push({
                            ADDR: pojSender.地址 || '',
                            ARCENO: pojSender.郵遞區號 || '',
                            CODE: pojSender.交換代碼 || '',
                            CODENAME: pojSender.名稱 || '',
                            GROUP: "",
                            GROUPLIST: "",
                            KEY: "正本",
                            PEOPLESEND: "",
                            REALTRANSTYPE: parseInt(pojTranstype),
                            TRANSTYPE: pojTranstype || '',
                            TRANSTYPENAME: pojSendtype,
                            TYPE: 1,
                            VALUE: pojSender.名稱 || '',
                            tagName: "Contact",
                            ATTACH: 'Y',
                            isEdit: true,
                            editAtt: false,
                            isChange: pojIsChange,
                            children: ''
                        })
                    });
                }

            }
        }
        */

        var wkContent = OA.common.DIMgr.generateNewWK(fields, values);

        var security = '', releaCont = '', securityDate = '', releaContItic = '';
        if (qs.security) {
            var securitys = ['', '密', '機密', '極機密', '絕對機密'];
            security = securitys[parseInt(qs.security) - 1];
            var releaConts = ['', '本件於公布時解密', '本件至某年某月某日解密', '', '其他', '保存年限屆滿後解密'];
            releaCont = releaConts[parseInt(qs.releaCont)];
            if (releaCont) {
                if (releaCont == '本件至某年某月某日解密') {
                    if (qs.securityDate) {
                        securityDate = securityDate = qs.securityDate.substring(0, 3) + '/' + qs.securityDate.substring(3, 5) + '/' + qs.securityDate.substring(5, 8);
                    }
                }
            }

            if (qs.releaContItic) {
                releaContItic = qs.releaContItic;
            }
            var tagText = OA.common.Utils.getTagText(wkContent, '密等及解密條件或保密期限');
            if (tagText) {
                Ext.Array.each(tagText.childNodes, function (n3) {
                    if (n3.Key == '密等') {
                        n3.Value = security;
                    } else if (n3.Key == '解密條件或保密期限') {
                        if (security != '') {
                            if (releaCont == '本件至某年某月某日解密') {
                                if (qs.securityDate && qs.releaContItic) {
                                    n3.Value = releaContItic || '';
                                }
                            } else if (releaCont == '其他') {
                                if (qs.releaContItic) {
                                    n3.Value = '其他：' + releaContItic || '';
                                }
                            } else {
                                n3.Value = releaCont || '';
                            }
                        } else {
                            n3.Value = '';
                        }
                    }
                });
            }
        }

        //預帶稿面註記
        var hasLayer = false;
        if (values.action == 'add') {
            var qd = OA.common.Global.getQueryDefault();
            var DraftTopMark = ['稿面註記', '應用限制', '擬辦方式', '其他擬辦', '分層負責', '處理級別'];
            if (qd && qd.交換資訊 && qd.交換資訊.稿面註記) {
                Ext.Array.each(DraftTopMark, function (item) {
                    var tagText = OA.common.Utils.getTagText(wkContent, item);
                    if (tagText) {
                        Ext.Array.each(tagText.childNodes, function (n3) {
                            if (n3.Key == item) {
                                var title = item + '_title';
                                if (qd.交換資訊.稿面註記[title] != undefined) {
                                    n3.Value = qd.交換資訊.稿面註記[title];
                                    if (item == '分層負責') hasLayer = true;
                                }
                            } else if (n3.Key == '分層負責' && !hasLayer) {
                                n3.Value = qd.交換資訊.稿面註記.分層負責_title;
                            }
                        });
                    }
                });
            }
        }

        OA.common.Global.setCurrentWKContent(wkContent);

        //建立文稿
        //var rs = Ext.clone(record.getProxy().getReader().readRecords(Ext.clone(wkContent)).getRecords()[0]);

        var normalizedWk = wkContent.hasOwnProperty('data') ? wkContent : { data: wkContent };
        // 使用 normalizedWk 來讀取記錄
        var readResult = record.getProxy().getReader().readRecords(Ext.clone(normalizedWk));
        // 調試並檢查讀取結果
        console.log("readResult:", readResult);
        if (readResult && readResult.getRecords) {
            var records = readResult.getRecords();
            if (records.length > 0) {
                readResult = Ext.clone(records[0]);
                console.log("rs:", readResult); // 檢查 readResult 是否包含期望數據
            } else {
                console.warn("No records found in readResult.");
            }
        } else {
            console.error("Failed to read records from wk.");
        }

        if (readResult.data['正本']) {
            if (qd && qd.交換資訊 && qd.交換資訊.評議案件受文者 && qd.交換資訊.評議案件受文者.受文者) {
            } else {
                readResult.data['正本'].items = ["正本：", ""];
            }
        }

        if (readResult.data['副本']) {
            if (qd && qd.交換資訊 && qd.交換資訊.評議案件受文者 && qd.交換資訊.評議案件受文者.受文者) {
            } else {
                readResult.data['副本'].items = ["副本：", ""];
            }
        }
        var oSVG = OA.common.DIMgr.generateSvg(modelName, readResult);

        if (security) {
            oSVG.vm.密等 = security;
            oSVG.vm.解密條件或保密期限 = releaCont;
            if (releaCont == '本件至某年某月某日解密') {
                oSVG.vm.本件至某年某月某日解密 = securityDate;
                //console.log(oSVG.vm);
                oSVG.vm.解密日期 = securityDate;
                oSVG.vm.本件至某年某月某日解密文 = releaContItic;
            } else if (releaCont == '其他') {
                oSVG.vm.其他 = releaContItic;
            }
        }

        if (qd && qd.交換資訊 && qd.交換資訊.稿面註記 && qd.交換資訊.稿面註記.分層負責_title != undefined) {
            oSVG.vm.分層負責_title = qd.交換資訊.稿面註記.分層負責_title;
        }

        //console.log(oSVG.vm);

        OA.common.Global.setCurrentViewModel(oSVG.vm);
        return { oSVG: oSVG, fields: fields, record: record };
    },
    generateNewNoteDI: function () {
        var qd = OA.common.Global.getQueryDefault();
        //console.log(q)
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var y = Ext.Date.add(new Date(), Ext.Date.YEAR, -1911);
        var ymd = y.getFullYear() + '年' + Ext.Date.format(new Date(), 'n月j日');
        var items = [];
        items.push('<簽>');
        items.push('<年月日>');
        items.push(ymd);
        items.push('</年月日>');
        items.push('<機關><全銜>');
        items.push(qd.交換資訊.所屬局處);
        items.push('</全銜></機關>');
        items.push('<主旨><文字>');
        items.push(docflow.get('title') || '主旨');
        items.push('</文字></主旨>');
        items.push('<段落 段名="說明："><文字>　</文字></段落><段落 段名="擬辦："><文字>　</文字></段落>');
        items.push('</簽>');
        return items.join('');
    },
    getDraftCount: function () {
        console.log('getDraftCount');
        var papers = OA.common.VIMgr.getCurrentEditionPapers();
        var count = 0;
        if (papers) {
            var p = papers.where("( el, i, res, param ) =>el.名稱!='會辦簽' && el.名稱!='來文' && el.名稱!='會核單' && el.名稱!='創簽'");
            count = p.length;

            if (p.length > 0 && count > 0) {
                Ext.Array.each(p, function (ps) {

                    if (ps.檔案清單) {
                        if (ps.檔案清單.檔案 == undefined || ps.檔案清單.檔案.length == 0) {
                            count = count - 1;
                        }
                    }
                })
            }
        }

        //console.log(count);
        return count;
    },
    wkCleanUp: function (wk, action) {
        wk = Ext.clone(wk);
        var me = this, items = [];
        var nodes = wk.childNodes.filter(function (n1) {
            return (n1 && n1.tagName == 'KDRichTextBlock');
        });
        var isBulletStart = false, _textClear = '', item, swap, item2;
        var childNodes = nodes[0].childNodes;
        Ext.Array.each(childNodes, function (n2, idx) {
            if (n2.tagName == 'Bullet' || n2.tagName == 'KDRichTextBlock') {
                item = items[items.length - 1]; // up
                if (items.length > 1) item2 = items[items.length - 2];
                //清稿去條例,標號按同層補回
                if (idx > 0 && !(_textClear.trim()) && n2.LvNumber !== '1.1' && item.ThisLayer != 0 && item2.Highlight !== 'Exist' && item2.Underline !== 'Underline' && item2.FontWeight !== 'Bold' && item2.FontWeight !== 'Italic') {
                    Ext.Array.remove(items, item);
                    if (n2.ThisLayer == item.ThisLayer) swap = Ext.clone(item);
                }

                if (swap && n2.ThisLayer == swap.ThisLayer) {
                    var tmp = Ext.clone(n2);
                    n2 = swap;
                    swap = tmp;
                }
                items.push(n2);
                isBulletStart = true;
            } else if (n2.tagName == 'Text') {
                if ((n2.Highlight == 'Exist' || n2.Underline == 'Underline' || n2.FontWeight == 'Bold' || n2.FontWeight == 'Italic') && action == "SaveHighlight") {
                    if (_textClear.trim()) {
                        items.push({
                            FontSize: 21,
                            FontWeight: "Normal",
                            BaselineShift: "",
                            Highlight: "None",
                            Insert: "None",
                            Strike: "None",
                            Style: "B1",
                            Underline: "",
                            childNodes: [_textClear],
                            tagName: "Text"
                        });
                    }
                    _textClear = '';
                    if (n2.Highlight != 'Exist' && typeof (n2.childNodes[0]) === 'number') n2.childNodes[0] = _textClear + n2.childNodes[0];
                    else if (n2.Highlight == 'Exist' && typeof (n2.childNodes[1]) === 'number') n2.childNodes[1] = _textClear + n2.childNodes[1];
                    items.push(n2);
                    isBulletStart = true;
                } else {
                    isBulletStart = false;
                }

            } else if (n2.tagName == 'Newline') {
                isBulletStart = false;
                if (_textClear.trim()) {
                    items.push({
                        FontSize: 21,
                        FontWeight: "Normal",
                        BaselineShift: "",
                        Highlight: "None",
                        Insert: "None",
                        Strike: "None",
                        Style: "B1",
                        Underline: "",
                        childNodes: [_textClear],
                        tagName: "Text"
                    });
                    items.push({
                        Type: "Text", tagName: "Newline"
                    });
                } else if (action != "doClearWK") {
                    items.push({
                        Type: "Text", tagName: "Newline"
                    });
                }
            } else {
                isBulletStart = false;
            }

            if (isBulletStart)
                _textClear = '';
            if (n2.tagName == 'KDRichTextBlock') {
                _textClear = _textClear || n2.Text;
            }
            Ext.Array.each(n2.childNodes, function (n3) {
                var data = n3;
                if (typeof (n2.childNodes) === 'object' && n3['#cdata']) data = n3['#cdata'];
                var isIgnore = false;
                //if (n2.Underline == 'Underline' || n2.Strike == 'Exist') isIgnore = true;
                if (n2.Strike == 'Exist' || ((n2.Highlight == 'Exist' || n2.Underline == 'Underline' || n2.FontWeight == 'Bold' || n2.FontWeight == 'Italic') && action == "SaveHighlight")) isIgnore = true;
                if (typeof (data) === 'string' || typeof (data) === 'number') {
                    var text = (data + '').replace("![CDATA[", "").replace("]]", "");
                    if (!isIgnore) _textClear = _textClear + text;
                }
            });

        });

        item = items[items.length - 1];
        if (items.length > 1) item2 = items[items.length - 2];
        if (!(_textClear.trim()) && item && item.ThisLayer != 0 && item2 && item2.Highlight !== 'Exist' && item2.Underline !== 'Underline' && item2.FontWeight !== 'Bold' && item2.FontWeight !== 'Italic') Ext.Array.remove(items, item);

        nodes[0].childNodes = items;

        return wk;
    },
    importPeninkDoc: function (el, key, hasAtt) {//筆硯匯入        
        var peninkData = {};
        if (el.attributes[0].value === '電子交換') {
            peninkData.TRANSTYPENAME = '電子';
        } else if (el.attributes[0].value === '郵寄') {
            peninkData.TRANSTYPENAME = '郵寄';
        } else {
            peninkData.TRANSTYPENAME = '紙本';
        }
        peninkData.Value = el.firstChild.textContent.trim();
        peninkData.Key = key;
        if (el.children && el.children.length > 0) {
            Ext.Array.each(el.children, function (childr) {
                if (childr.tagName === '郵遞區號') {
                    peninkData.ARCENO = childr.textContent;
                } else if (childr.tagName === '地址') {
                    peninkData.ADDR = childr.textContent;
                } else if (childr.tagName === '通訊錄名稱') {
                    peninkData.CODENAME = childr.textContent;
                    if (childr.attributes && childr.attributes.length > 0) {
                        Ext.Array.each(childr.attributes, function (att) {
                            if (att.name === '機關代碼') {
                                peninkData.CODE = att.textContent;
                            } else if (att.name === '單位代碼') {
                                peninkData.CODE = peninkData.CODE + att.textContent;
                            }
                        });
                    }
                }
            });
        }
        if (hasAtt) peninkData.ATTACH = 'Y';
        return peninkData;
    },
    wkToXml: function () {
        var WKContent = OA.common.Global.getCurrentWKContent();
        //console.log(WKContent);

        var items = [];

        items.push('<RootWork>');
        items.push('<VerWork DocumentType = "' + WKContent.DocumentType + '" DocumentTemplate = "' + WKContent.DocumentTemplate + '" orgId = "' + WKContent.orgId + '" orgNo = "' + WKContent.orgNo + '" depNo = "' + WKContent.depNo + '" doDeptno = "' + WKContent.doDeptno + '" SeqNumber = "' + WKContent.SeqNumber + '" LastUpdateTime = "' + WKContent.LastUpdateTime + '" Version = "' + WKContent.Version + '" empNo = "' + WKContent.empNo + '" empName = "' + WKContent.empName + '" depName = "' + WKContent.depName + '" jobNo = "' + WKContent.jobNo + '" roleId = "' + WKContent.roleId + '" doSno = "' + WKContent.doSno + '" AssigneeName = "' + WKContent.AssigneeName + '" AssigneeJob = "' + WKContent.AssigneeJob + '" 發文文號 = "' + WKContent.發文文號 + '" 給號方式 = "' + WKContent.給號方式 + '">');


        //------------------------------WK Header------------------------------
        items.push('<TextDisplay DisplayPanelName="Header">');
        for (var i = 0; i < WKContent.childNodes[0].childNodes.length; i++) {
            var childNode = WKContent.childNodes[0].childNodes[i];


            if (childNode.tagName == 'ContactList') {
                //console.log(childNode);
                items.push('<' + childNode.tagName + '>')
                if (childNode.childNodes && childNode.childNodes.length > 0) {
                    Ext.Array.each(childNode.childNodes, function (co) {
                        items.push(
                            Ext.String.format('<Contact ADDR="{0}" ARCENO="{1}" ATTACH="{2}" CODE="{3}" CODENAME="{4}" GROUP="{5}" GROUPLIST="{6}" KEY="{7}" PEOPLESEND="{8}" REALTRANSTYPE="{9}" TRANSTYPE="{10}" TRANSTYPENAME="{11}" TYPE="{12}" VALUE="{13}" tagName="Contact" />',
                                co.ADDR, co.ARCENO, co.ATTACH, co.CODE, co.CODENAME, co.GROUP, co.GROUPLIST, co.KEY, co.PEOPLESEND, co.REALTRANSTYPE, co.TRANSTYPE, co.TRANSTYPENAME, co.TYPE, co.VALUE));

                    });
                }

            } else {
                items.push('<' + childNode.tagName + ' BeginX = "' + childNode.BeginX + '"' + ' VisibleState = "' + childNode.VisibleState + '"' + ' Alignment= "' + childNode.Alignment + '"' + ' TagCaption= "' + childNode.TagCaption + '"' + ' FontSize = "' + childNode.FontSize + '"' + ' LineHeight= "' + childNode.LineHeight + '"' + ' Title= "' + childNode.Title + '"' + ' Index= "' + childNode.Index + '"' + '>')

                if (WKContent.childNodes[0].childNodes[i].childNodes != undefined) {
                    for (var r = 0; r < WKContent.childNodes[0].childNodes[i].childNodes.length; r++) {
                        var childNode_1 = WKContent.childNodes[0].childNodes[i].childNodes[r];
                        items.push('<' + childNode_1.tagName + ' Value = "' + childNode_1.Value + '"' + ' Key = "' + childNode_1.Key + '"' + '/>');
                    }

                }
            }


            items.push('</' + childNode.tagName + '>')
        }
        items.push('</TextDisplay>');
        //------------------------------WK Header------------------------------


        //------------------------------WK KDRichTextBlock------------------------------
        var WKchildNode = WKContent.childNodes[1].childNodes
        var qqq = []
        var combinnation = []
        // console.log(WKContent.childNodes[1].childNodes)
        for (var q = 0; q < WKchildNode.length; q++) {
            if (WKContent.childNodes[1].childNodes[q].Type == undefined) {
                qqq.push(WKContent.childNodes[1].childNodes[q])
            } else {
                qqq.push(WKContent.childNodes[1].childNodes[q])
                combinnation.push(qqq)
                qqq = []
            }

            // if(q%3==0){
            //     qqq.push(WKContent.childNodes[1].childNodes[q])
            // }else if(q%3==1){
            //     qqq.push(WKContent.childNodes[1].childNodes[q])
            // }else if(q%3==2){
            //     qqq.push(WKContent.childNodes[1].childNodes[q])
            //     if(qqq.length==3){
            //         combinnation.push(qqq)
            //         qqq=[]
            //     }
            // }
        }
        items.push('<KDRichTextBlock LineHeight="1.1">');
        for (var j = 0; j < combinnation.length; j++) {
            var TextBlock = combinnation[j][0]

            items.push('<' + TextBlock.tagName + ' ThisLayer = "' + TextBlock.ThisLayer + '"' + ' BulletType = "' + TextBlock.BulletType + '"' + ' LvNumber= "' + TextBlock.LvNumber + '"' + ' ParagraphNumber= "' + TextBlock.ParagraphNumber + '"' + ' MainLayerNumber = "' + TextBlock.MainLayerNumber + '"' + ' Insert= "' + TextBlock.Insert + '"' + ' BulletNo= "' + TextBlock.BulletNo + '"' + ' ThisLayerNumber= "' + TextBlock.ThisLayerNumber + '"' + ' FontSize= "' + TextBlock.FontSize + '"' + ' BulletText= "' + TextBlock.BulletText + '"' + ' DisplayPanelName= "' + TextBlock.DisplayPanelName + '"' + ' Style= "' + TextBlock.Style + '"' + '/>')

            // var TextBlock_1 = combinnation[j][1]
            //
            // items.push('<'+TextBlock_1.tagName + ' Highlight = "'+ TextBlock_1.Highlight +'"' + ' FontSize = "'+ TextBlock_1.FontSize +'"' + ' Underline= "'+ TextBlock_1.Underline +'"' + ' Strike= "'+ TextBlock_1.Strike +'"' + ' Style = "'+ TextBlock_1.Style +'"' + ' FontWeight= "'+ TextBlock_1.FontWeight +'"' +  ' Insert= "'+ TextBlock_1.Insert +'"' + ' BaselineShift= "'+ TextBlock_1.BaselineShift +'"' + '>')
            // if(combinnation[j][1].childNodes != undefined){
            //     for(var y=0; y < combinnation[j][1].childNodes.length; y++) {
            //         var childNodeWork = combinnation[j][1].childNodes[y];
            //
            //         items.push(childNodeWork + '</'+TextBlock_1.tagName+'>')
            //     }
            // }

            for (var y = 1; y < combinnation[j].length - 1; y++) {
                var childNodeWork = combinnation[j][y];
                items.push('<' + childNodeWork.tagName + ' Style = "' + childNodeWork.Style + '"' + ' FontSize = "' + childNodeWork.FontSize + '"' + ' Insert= "' + childNodeWork.Insert + '"' + ' Highlight= "' + childNodeWork.Highlight + '"' + ' Underline = "' + childNodeWork.Underline + '"' + ' FontWeight= "' + childNodeWork.FontWeight + '"' + '>')

                items.push(childNodeWork.childNodes[0] + '</' + childNodeWork.tagName + '>')
            }



            var TextBlock_2 = combinnation[j][combinnation[j].length - 1]
            items.push('<' + TextBlock_2.tagName + ' Type = "' + TextBlock_2.Type + '"' + '/>')


        }
        items.push('</KDRichTextBlock>');

        //------------------------------WK KDRichTextBlock------------------------------

        //------------------------------WK TextDisplay------------------------------
        items.push('<TextDisplay DisplayPanelName="Footer">');
        for (var t = 0; t < WKContent.childNodes[2].childNodes.length; t++) {
            var footerChildNode = WKContent.childNodes[2].childNodes[t]
            items.push('<' + footerChildNode.tagName + ' BeginX = "' + footerChildNode.BeginX + '"' + ' VisibleState = "' + footerChildNode.VisibleState + '"' + ' Alignment= "' + footerChildNode.Alignment + '"' + ' TagCaption= "' + footerChildNode.TagCaption + '"' + ' FontSize = "' + footerChildNode.FontSize + '"' + ' LineHeight= "' + footerChildNode.LineHeight + '"' + ' Title= "' + footerChildNode.Title + '"' + ' Index= "' + footerChildNode.Index + '"' + '>')

            if (WKContent.childNodes[2].childNodes[t].childNodes != undefined) {
                for (var c = 0; c < WKContent.childNodes[2].childNodes[t].childNodes.length; c++) {
                    var childNode_2 = WKContent.childNodes[2].childNodes[t].childNodes[c];
                    items.push('<' + childNode_2.tagName + ' Value = "' + childNode_2.Value + '"' + ' Key = "' + childNode_2.Key + '"' + '/>');
                }
            }


            items.push('</' + footerChildNode.tagName + '>')
        }
        items.push('</TextDisplay>');
        //------------------------------WK TextDisplay------------------------------


        for (var d = 3; d <= WKContent.childNodes.length - 1; d++) {
            var WKC = WKContent.childNodes[d].tagName
            //console.log(WKC);
            if (WKC == "手寫板") {
                items.push('<' + WKC + '/>')
            } else if (WKC == "主旨") {
                items.push('<' + WKC + '>')
                for (var o = 0; o < WKContent.childNodes[d].childNodes.length; o++) {
                    var childNode_3 = WKContent.childNodes[d].childNodes[o]
                    items.push('<' + childNode_3.tagName + '>')
                    for (var m = 0; m < WKContent.childNodes[d].childNodes[o].childNodes.length; m++) {
                        var childNode_4 = WKContent.childNodes[d].childNodes[o].childNodes[m];
                        items.push(childNode_4);
                    }
                    items.push('</' + childNode_3.tagName + '>')
                }
                items.push('</' + WKC + '>')
            } else if (WKC == "附件清單") {
                items.push('<' + WKC + '/>')
            } else if (WKC == "批示意見") {
                items.push('<' + WKC + ' Version = "' + WKContent.childNodes[d].Version + '"' + '>')
                for (var l = 0; l < WKContent.childNodes[d].childNodes.length; l++) {
                    if (WKContent.childNodes[d].childNodes[l].childNodes != undefined) {
                        items.push('<' + childNode_3.tagName + '>')
                        for (var u = 0; u < WKContent.childNodes[d].childNodes[l].childNodes.length; u++) {
                            var childNode_5 = WKContent.childNodes[d].childNodes[l].childNodes[u];
                            items.push(childNode_5);
                        }
                        items.push('</' + childNode_3.tagName + '>')
                    } else {
                        items.push('<' + "文字" + '/>')
                    }
                }
                items.push('</' + WKC + '>')
            } else if (WKC == "案情摘要") {
                items.push('<' + WKC + '>')
                for (var h = 0; h < WKContent.childNodes[d].childNodes.length; h++) {
                    if (WKContent.childNodes[d].childNodes[h].childNodes != undefined) {
                        items.push('<' + childNode_3.tagName + '>')
                        for (var j = 0; j < WKContent.childNodes[d].childNodes[h].childNodes.length; j++) {
                            var childNode_6 = WKContent.childNodes[d].childNodes[h].childNodes[j];
                            items.push(childNode_6);
                        }
                        items.push('</' + childNode_3.tagName + '>')
                    } else {
                        items.push('<' + "文字" + '/>')
                    }
                }
                items.push('</' + WKC + '>')
            } else if (WKC == "核章區文字") {
                items.push('<' + WKC + '>')
                for (var n = 0; n < WKContent.childNodes[d].childNodes.length; n++) {
                    items.push('<' + childNode_3.tagName + '>')
                    if (WKContent.childNodes[d].childNodes[n].childNodes != undefined) {
                        for (var f = 0; f < WKContent.childNodes[d].childNodes[n].childNodes.length; f++) {
                            var childNode_7 = WKContent.childNodes[d].childNodes[n].childNodes[f];
                            items.push('<' + childNode_7.tagName + ' Value = "' + childNode_7.Value + '"' + ' Key = "' + childNode_7.Key + '"' + '/>');
                        }
                    }

                    items.push('</' + childNode_3.tagName + '>')
                }
                items.push('</' + WKC + '>')
            }

        }
        items.push('</VerWork>');
        items.push('</RootWork>');

        //console.log('WK2XML= ' + items)
        return items.join('');

    }
});