/*
 欄位
 */
Ext.define('OA.form.FormFields', {
    extend: 'Ext.Panel',
    xtype: "FormFields",
    id: "FormFields",
    config: {
        width: 200,
        height: 600,
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
                id: 'listFields',
                xtype: 'list',
                flex: 1,
                mode: "SINGLE",
                listeners: [
                    {
                        event: 'itemtap',
                        fn: function (list, index, item, record, target) {
                            var me = list.up('panel');
                            var cls = target.target.className;
                            if (cls == 'check') {
                                record.set('checked', 'uncheck');
                                me.docFormUpdate();
                                return;
                            } else if (cls == 'uncheck') {
                                record.set('checked', 'check');
                                me.docFormUpdate();
                                return;
                            }
                            OA.common.Fields.popupFromShow(record.get('code'));
                            me.hide();
                        }
                    }
                ]
            }
        ]
    },
    create: function (options) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var ctr = Ext.getCmp('listFields');
        var area = Ext.getCmp('docArea');
        var isDocPaper = area.getActiveItem().config.xtype == 'docPaper';
        var isDocForm = area.getActiveItem().config.xtype == 'docForm';
        options = options || {};
        var fields = options.fields;
        if (!fields) fields = OA.common.Paper.getActiveFields();
        var layout = OA.common.Utils.removeSupport(fields);
        var wk = OA.common.Global.getCurrentWKContent();
        var vm = OA.common.Global.getCurrentViewModel();
        var init = OA.common.Global.getInitParas();

        var isComePaper = (init.kind == '來文' || vm.kind == '來文') ? true : false;

        if (isDocPaper) {
            ctr.setItemTpl('{code}');
        } else {
            ctr.setItemTpl('<div class="item-name"><span class="{checked}"></span>{code}</div>');
        }
        var data = [];
        var items = OA.common.Fields.Enum.properties;
        var paperHide = ['會辦單位'];

        if (isComePaper) {
            var comeItem;
            comeItem = items['檔號'];
            comeItem.checked = 'uncheck';
            data.push(comeItem);
        } else {
            Ext.Array.forEach(layout, function (p) {
                var item;
                if (items.hasOwnProperty(p.key)) {
                    item = items[p.key];
                    item.checked = 'uncheck';
                } else {
                    if (isDocForm) {
                        if (p.key == 'KDRichTextBlock') {
                            item = { checked: "uncheck", code: '本文' };
                        } else if (p.key == 'docCaption') {
                            item = { checked: "uncheck", code: '簽' };
                        }
                        else {
                            item = { checked: "uncheck", code: p.key };
                        }
                    }
                }
                if (isDocForm) {
                    var isDefault = ['發文機關', '機關', 'KDRichTextBlock'].indexOf(p.key) >= 0;
                    if (wk && wk.DocumentType == '開會通知單') {
                        isDefault = ['開會事由', '開會時間', '開會地點', '主持人', '聯絡人及電話'].indexOf(p.key) >= 0;
                    } else if (wk && wk.DocumentType == '會勘通知單') {
                        isDefault = ['會勘事由', '會勘時間', '會勘地點', '主持人', '聯絡人及電話'].indexOf(p.key) >= 0;
                    }

                    if (isDefault) item.checked = 'check';
                }
                if (item) {
                    //if (paperHide.indexOf(p.key) >= 0) {
                    //    if (qs.epaper === 'N' || qs.app == 'offline') data.push(item);
                    //} else
                        data.push(item);
                }
                if(p.key == '署名'){
                    data.push({ checked: "uncheck", code: '稿署名' });
                }
            });
            if (wk && wk.DocumentType == '上行簽') {
                data.push({ checked: "uncheck", code: '會辦單位' });
            }
            // var sealPhon = ['簽', '報告', '便簽' , '簡簽'];
            // if (sealPhon.indexOf(wk.DocumentType) != -1) {
            //     if (!OA.common.Utils.checkEpaper()) {
            //         data.push({ checked: "uncheck", code: '承辦單位電話' });
            //         //console.log(vm);
            //     }
            // }
        }
        var store = ctr.getStore();
        if (store) {
            store.removeAll();
            store.sync();
        }
        ctr.setData(data);

        if (options.action === 'update') me.docFormUpdate();

        OA.common.Utils.indicatorWith(this);
    },
    docFormUpdate: function () {
        var ctr = Ext.getCmp('listFields');
        var area = Ext.getCmp('docArea');
        var items = [];
        var store = ctr.getStore();
        store.filter('checked', 'check');
        store.each(function (r) {
            items.push({ key: r.get('code')});
        });
        store.clearFilter();
        area.getActiveItem().valuesUpdate(items);
    }
});