/*
 併列選項
 */
Ext.define('OA.form.FormParallel', {
    extend: 'Ext.Panel',
    xtype: "FormParallel",
    requires: [],
    config: {
        width: 400,
        height: 400,
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
                itemTpl: new Ext.XTemplate(
                    '<table>',
                    '<tr>',

                    '<td width="70%">',
                    '{text}',
                    '<tpl if="(showOpen)">',
                    '<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:100%;">併例</span>',
                    '</tpl>',
                    '</td>',

                    '<td width="15%">',
                    '<tpl if="(showOpen)">',
                    '<span class="x-button-unhide x-button" style="float:right;bottom:5px;font-size:90%;">另開</span>',
                    '</tpl>',
                    '</td>',

                    '</tr>',
                    '</table>',
                    {
                        isOnline: function (TRANSTYPE) {
                            return ('9' == TRANSTYPE);
                        }
                    }),
                listeners: {
                    itemtap: function (list, index, item, record, event) {
                        var options = record.getData();
                        if (event.getTarget('.x-button-unhide')) {
                            options.isWinOpen = true;
                        }
                        var form = list.up('panel');
                        form.hide();
                        var model = record.get('model_wk');
                        if (model) {
                            OA.common.Global.getApp().getController('OA.controller.Work').doWinParallel(options);
                        } else {
                            Ext.getCmp('oawork').hideParallel(); //關閉併列
                            //要重新讀回原文稿資料
                            var options = OA.common.Global.getInitParas();
                            var items = [];
                            items.model_di = OA.common.DIMgr.getModelName('di', options.documentType);
                            items.model_wk = OA.common.DIMgr.getModelName('wk', options.documentType);
                            items.model_open = 'wk';
                            OA.client.WK.load(items, function (oSVG, recd) {
                            });
                        }
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
        var mode = Ext.getCmp('oawork').getShowMode();
        var isExchange = OA.common.VIMgr.hadExchange();

        var vi = OA.common.VIMgr.getViContent();
        var version = vi.作業版本;   //取得最近決定版次

        //要用目前開啟的版次，非作業版次
        var init = OA.common.Global.getInitParas()
        if (init) {
            version = init.version;
        }

        var showItems = [];
        if (isExchange) { //核稿併列
            var nexts = Ext.Array.filter(vi.版次, function (edition) {
                if (edition.版號 == version) return true;
            });
            var next = nexts[0], isLastApprove = false;
            do {
                if (next.線上簽核資訊) {
                    if (next.線上簽核資訊.簽核流程.異動別 === '決行') {
                        isLastApprove = true;
                    } else {
                        nexts = Ext.Array.filter(vi.版次, function (edition) {
                            if (edition.版號 == next.ParentVersion) return true;
                        });
                        next = nexts[0];
                    }
                } else {
                    isLastApprove = true;
                }
            }
            while (!isLastApprove);

            var itemsApprove = OA.common.VIMgr.getFolderItems(next.版號, next.簽核文件夾);
            Ext.Array.each(itemsApprove, function (p) {
                p.showOpen = true;
                p.text = p.text + ' (決) ';
                if (p.kind != '來文') showItems.push(p);
            });

        } else { // 承辦或核稿併列
            var items = OA.common.VIMgr.doParallelEdition(version); //取得目前版次
            var selectItems = Ext.Array.filter(items, function (p) {
                if (p.form) return true;
            });
            Ext.Array.each(selectItems, function (item) {
                item.showOpen = true;
                showItems.push(item);
            });
        }
        if (mode == 'parallel') showItems.splice(0, 0, {text: '關閉並列顯示'});
        list.setData(showItems);
    }
});