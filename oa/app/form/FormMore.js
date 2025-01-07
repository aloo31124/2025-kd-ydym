/*
 更多
 */

Ext.define('OA.form.FormMore', {
    extend: 'Ext.Panel',
    xtype: "FormMore",
    requires: ['OA.client.WK'],
    config: {
        width: 200,
        height: 300,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
            {
                id: 'listMore',
                xtype: 'list',
                flex: 1,
                mode: "SINGLE",
                itemTpl: '{title}',
                listeners: {
                    itemtap: function (list, index, item, record) {
                        var form = list.up('panel');
                        form.hide();

                        var act = record.get('action');
                        if (act == 'delete') {
                            OA.common.Paper.setActiveStatus('delete');
                            OA.client.WK.excute(null,function () {
                                OA.common.Global.getApp().getController('OA.controller.Work').onCloseTap();
                            });
                        } else if (act == 'thesaurus') {
                            OA.common.Funcs.show('FormThesaurus');
                        }
                    }
                }
            }
        ]
    },
    initialize: function () {
    },
    create: function () {
        var data = [];
        var uiActions = OA.common.VIMgr.getActions();
        Ext.Array.each(uiActions, function (item) {
            if (item.methodId == 'docDelete') {
                data.push({title: '刪除文稿', action: 'delete'});
            }
        });
        var store = Ext.create("Ext.data.Store", {
            fields: ['title', 'action'],
            autoLoad: true,
            data: data
        });
        Ext.getCmp('listMore').setStore(store);
        OA.common.Utils.indicatorWith(this);
    }
});