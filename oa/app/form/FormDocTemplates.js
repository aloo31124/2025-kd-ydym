/*
 常用公文格式範本（目前沒用到）
 */
Ext.define('OA.form.FormDocTemplates', {
    extend: 'Ext.Panel',
    xtype: "FormDocTemplates",
    id: 'FormDocTemplates',
    config: {
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        width: '50%',
        height: '80%',
        style: 'font-size:20px',
        activeTab: 1,
        defaults: {
            scrollable: false
        },
        layout: 'vbox',
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector',

                items: [
                    //{ text: '機關共用範本' },
                    //{ text: '表單' },
                    { ui: 'plain',text: '個人常用範本'}
                ],
                defaults: {
                    handler: function (button, e, eOpts) {

                    }
                }
            },
            {
                height: 400,
                xtype: 'list',
                scrollable: 'vertical',
                id: 'listTemplates',
                itemTpl: new Ext.XTemplate(
                    '<table>',
                    '<tr>',
                    '<td width="55%">',
                    '<p style="font-size:110%;">',
                    ' {qTemplate} ',
                    '</p>',
                    '</td>',
                    '<td width="5%"><span class="flow-move"></span></td>',
                    '</tr>',
                    '</table>'
                ),
                infinite: true,
                variableHeights: true,
                plugins: [{xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move'}],
                listeners: [{
                    event: 'dragsort',
                    fn: function (listObject, row, to, from) {
                        var store = Ext.getCmp('listTemplates').getStore();
                        if (store) {
                            var data = [];
                            Ext.Array.each(store.data.all, function (item) {
                                data.push(item.data);
                            });
                            OA.client.Localforage.setCommonlyDoc(data);
                        }
                    }
                }]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {
                        text: '刪除', ui: 'decline', action: 'del', width: '20%',
                        handler: function (button) {
                            var list = Ext.getCmp('listTemplates');
                            if (list.selected.items.length > 0) {
                                OA.client.Localforage.getCommonlyDoc(function (value) {
                                    if (!value) return;
                                    Ext.Array.each(value, function (item) {
                                        if (item.qTemplate == list.selected.items[0].getData().qTemplate) {
                                            Ext.Array.remove(value, item);
                                            var newdocselect = Ext.getCmp('selectDoc');
                                            if (newdocselect) {
                                                var store = newdocselect.getStore(), node = store.getAt(0);
                                                if (!node.isLeaf() && newdocselect.getActiveItem().selected.items.length > 0) {
                                                    if (newdocselect.getActiveItem().selected.items[0].data.template.value == item.qTemplate) {
                                                        var addcommonly = Ext.getCmp('AddCommonly');
                                                        if(addcommonly)
                                                            addcommonly.iconElement.dom.style.color = '';
                                                    }
                                                }
                                            }
                                        }
                                        OA.client.Localforage.setCommonlyDoc(value, function () {
                                            Ext.getCmp('FormDocTemplates').create();
                                            list.selected.items = [];
                                        });
                                    });
                                });
                            }
                        }
                    },
                    {xtype: 'spacer'},
                    {
                        text: '開啟', action: 'open', ui: 'confirm', width: '20%',
                        handler: function (button) {
                            var list = Ext.getCmp('listTemplates');
                            if (list.selected.items.length > 0) {

                                var data = list.selected.items[0].getData();
                                data.qIsNew = button.up('panel').getIsNew();

                                OA.common.Global.getApp().getController('OA.controller.Work').onNewDocPaper(null, data);
                                button.up('panel').hide();
                                Ext.getCmp('FormNewDoc').hide();
                                // 判斷已存檔功能 - by yi-chi chiu
                                OA.app.isSavedFlag = false;
                            }
                        }
                    },
                    {
                        text: '關閉', action: 'no', width: '20%',
                        handler: function (button) {
                            button.up('panel').hide();
                        }
                    }
                ]
            }
        ],
        isNew: false
    },
    create: function (isNew) {
        if (isNew)
            this.setIsNew(isNew);
        else
            this.setIsNew(false);
        OA.client.Localforage.getCommonlyDoc(function (value) {
            if (!value) return;
            var templatesDoc = Ext.create("Ext.data.Store", {
                id: 'templatesDoc',
                autoLoad: true,
                autoSync: true,
                data: value.length > 0 ? value : null
            });
            Ext.getCmp('listTemplates').setStore(templatesDoc);
            
            OA.common.Utils.indicatorWith(this);
        });
    }
});