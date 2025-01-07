/*
 更多
 */

Ext.define('OA.form.FormEditMore', {
    extend: 'Ext.Panel',
    xtype: "FormEditMore",
    requires: ['OA.client.WK'],
    config: {
        width: 200,
        height: 500,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'list',
                flex: 1,
                mode: "SINGLE",
                itemTpl: '{title}',
                disableSelection: true,
                listeners: {
                    itemtap: function (list, index, item, record) {
                        var form = list.up('panel');
                        form.hide();
                        var action = record.get('action');
                        OA.common.Paper.main().executeAction(action);
                    }
                }
            }
        ]
    },
    initialize: function () {
    },
    create: function () {
        var me = this;
        var list = me.child('list');
        var store = list.getStore();
        if (store) store.removeAll();
        var uiActions = Ext.clone(Ext.getCmp('oawork').getExtraActions());

        var wk = OA.common.Global.getCurrentWKContent();
        if (wk) {
            var docConfig = KangDaAppConfig().FORMATS[wk.DocumentType];

            //表單格式增加主旨變更按鈕
            // var needPurpose = ['便簽', 'A4空白簽', '便箋','簡簽', '箋函', 'LINE訊息紀錄單', '公務用電話記錄', '市長用箋', '會銜公文機關印信蓋用續頁表',
            //         '機密文書機密等級變更或註銷紀錄單', '機密文書機密等級變更或註銷處理意見表', '簽稿會核單', '蓋用印信申請表',
            //         '補製換發印信申請表', '印信啟用報備表', '繳銷廢舊印信申報表', '會計報告遞送單','電子信箱回覆函'].indexOf(wk.DocumentType) >= 0;
            //
            // if (needPurpose) {
            //     var init = OA.common.Global.getInitParas();
            //     if (init && init.paperOrder == '1') uiActions.push({
            //         title: '變更主旨',
            //         ui: "plain",
            //         iconCls: '',
            //         action: 'changeSubject'
            //     });
            // }

            if (docConfig.change == true && wk.DocumentType !== '公告') {
                uiActions = uiActions.filter(function (item) {
                    var notWork = ['grid', 'mergeCells', 'deleteRow'].indexOf(item.action) >= 0;
                    return !notWork;
                });
            }
        }

        //console.log(uiActions);
        if (uiActions && uiActions.length > 0) {
            list.setData(uiActions);
        }
        OA.common.Utils.indicatorWith(this);

    }
});