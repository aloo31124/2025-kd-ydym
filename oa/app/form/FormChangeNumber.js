/*
 數位轉換（目前沒用到）
 */

Ext.define('OA.form.FormChangeNumber', {
    extend: 'Ext.Panel',
    xtype: "FormChangeNumber",
    config: {
        width: 300,
        height: 450,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        scrollable: {
            direction: 'vertical'
        },
        items: [
            {
                xtype: 'list',
                flex: 1,
                mode: "SINGLE",
                itemTpl: '{title}',
                data: [
                    {title: '轉小寫數字(123)', formats: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9','10']},
                    {title: '轉大寫數字(１２３)', formats: ['０', '１', '２', '３', '４', '５', '６', '７', '８', '９','１０']},
                    {title: '轉中文數字(一二三)', formats: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '百', '千']},
                    {title: '轉中文數字(壹貳參)', formats: ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖', '拾', '佰', '仟']},
                    {title: '日期時間文字數值轉換', formats: 'change'}
                ],
                listeners: {
                    itemtap: function (list, index, item, record, event) {
                        OA.common.Paper.main().editActions().changeNumberText(record.get('formats'));
                        list.up('panel').hide();
                        // 判斷已存檔功能 - by yi-chi chiu
                        OA.app.isSavedFlag = false;
                    }
                }
            }
        ]
    },
    initialize: function () {
    },
    create: function () {
    }
});