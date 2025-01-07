/**
 * 引用案件
 */
Ext.define('OA.form.PanelReference', {
    extend: 'Ext.Panel',
    xtype: "PanelReference",
    alias: 'widget.PanelReference',
    id: 'PanelReference',
    requires: ['Ext.SegmentedButton', 'Ext.Toolbar', 'OA.client.Cip'],
    config: {
        ui: 'dark',
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        width: '70%',
        height: '50%',
        style: 'font-size:20px',
        activeTab: 1,
        defaults: {
            scrollable: true
        },
        layout: 'vbox',
        items: [
            //分類
            {
                id: 'toolbarReferenceSort',
                xtype: 'toolbar',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector',
                items: [
                    {
                        id: 'butPanelReferenceAdd',
                        text: '新增',
                        action: 'new',
                        handler: function (button) {
                            Ext.Msg.prompt('請輸入文號', '文號: ' + '<br>' + '（歸檔後案件才可引用）', function (key, value) {
                                if (key !== 'ok') return;
                                var paras = OA.common.Global.getInitParas();
                                var data = {};
                                data.doSno = (value.length >= 14) ? value.substring(4) : value;
                                data.jobNo = paras.jobNo;
                                data.doDeptno = paras.doDeptno;
                                var empName = OA.common.Global.getCurrentUser().empName || '';
                                var depName = OA.common.Global.getCurrentDept().depName || '';
                                OA.client.Cip.load(data, function (ret) {
                                    if (!ret) {
                                        Ext.Msg.alert('找不到此已結案公文！');
                                        return;
                                    }
                                    var addData = {
                                        isEdit: true,
                                        doSno: data.doSno,
                                        addName: Ext.String.format('{0} {1}', empName, depName),
                                        addTime: OA.common.Utils.getChineseDate(),
                                        delName: '',
                                        delTime: ''
                                    };
                                    var store = Ext.getStore('Quote');
                                    store.add(addData);
                                })
                            }, this, false);
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
                        action: 'no',
                        handler: function (button) {
                            button.up('panel').hide();
                        }

                    }
                ],
                defaults: {
                    handler: function (button) {

                    }
                }
            },
            //列表
            {
                flex: 1,
                xtype: 'list',
                id: 'listReference',
                scrollable: 'vertical',
                store: 'Quote',
                disableSelection: true,
                itemTpl: new Ext.XTemplate(
                    '<table>',
                    '<tr>',
                    '<tpl if="(isEdit)&&(!delName)">',
                    '<td width="5%"><span class="flow-delete">&nbsp;</span></td>',
                    '</tpl>',
                    '<td width="55%">',
                    '<p style="font-size:110%">',
                    ' {status}',
                    ' {doSno}',
                    ' 引用人（{addName}）',
                    ' {addTime}',
                    '</p>',

                    '<tpl if="(!isEdit)&&(delName)">',
                    '<p style="font-size:110%;color:red">',
                    ' 刪除人（{delName}）',
                    ' {delTime}',
                    '</p>',
                    '</tpl>',
                    '</td>',

                    '<tpl if="(isEdit)||(!delName)">',
                    '<td width="15%">',
                    '<span class="x-button-normal x-button open" style="float:right;bottom:5px;font-size:90%;">開啟</span>',
                    '</td>',
                    '</tpl>',

                    '</tr>',
                    '</table>'
                ),
                infinite: true,
                variableHeights: true,
                listeners: {
                    itemtap: function (list, index, item, record, event) {
                        if (event.getTarget('.flow-delete')) {
                            var delName = OA.common.Global.getCurrentUser().empName;
                            var store = Ext.getStore('Quote');
                            if (store) {
                                Ext.Array.each(store.data.all, function (mem) {
                                    if (mem.data.doSno == record.data.doSno) {
                                        record.set('isEdit', false);
                                        record.set('delName', delName);
                                        record.set('delTime', OA.common.Utils.getChineseDate())
                                    }
                                });
                            }
                        } else if (event.getTarget('.open')) {
                            window.open('../oa/index.html?app=check&dialogType=3&showType=ref', "", "_blank");
                            window.getCurrentUser = function () {
                                var initParas = OA.common.Global.getInitParas();
                                var paras = Ext.apply({}, initParas);
                                paras.doSno = record.get('doSno').toString();
                                paras.gbDocflowId = undefined;
                                return paras;
                            };
                        }
                    }
                }
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [                    
                    {
                        xtype: 'label',
                        id: 'ReferenceCapacity'
                    },
                    {xtype: 'spacer'},
                    {
                        id: 'butPanelReferenceConfirm',
                        text: '確定',
                        action: 'yes',
                        ui: 'confirm',
                        handler: function (button) {
                            var store = Ext.getStore('Quote');
                            var items = [];
                            store.each(function (r) {
                                items.push({
                                    狀態: (r.get('isEdit')) ? '引用' : '刪除',
                                    公文文號: r.get('doSno'),
                                    引用人: r.get('addName'),
                                    引用時間: r.get('addTime'),
                                    刪除人: r.get('delName'),
                                    刪除時間: r.get('delTime')
                                });
                            });
                            var current = OA.common.VIMgr.getCurrentEdition();
                            current.引用案件資訊 = {};
                            current.引用案件資訊.引用案件 = items;
                            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                            ctrWK.doSave({ action: 'save' });
                            button.up('panel').hide();
                        }
                    }
                ]
            }
        ]
    },
    create: function () {
        var courseData = [];
        var qs = OA.common.Global.getQ();
        var noEdit = ['check', 'review'].indexOf(qs.app) >= 0;
        if (noEdit) {
            Ext.getCmp('butPanelReferenceConfirm').setHidden(true);
            Ext.getCmp('butPanelReferenceAdd').setHidden(true);
        }

        var current = OA.common.VIMgr.getCurrentEdition();
        if (current.引用案件資訊 != undefined) {
            var res = current.引用案件資訊.引用案件;
            Ext.Array.each(res, function (r) {
                if (noEdit) r.狀態 = '';
                var oldData = {
                    isEdit: (r.狀態 == '引用'),
                    doSno: r.公文文號,
                    addName: r.引用人,
                    addTime: r.引用時間,
                    delName: r.刪除人,
                    delTime: r.刪除時間
                };
                courseData.push(oldData);
            });
        }
        var store = Ext.getStore('Quote');
        store.setData(courseData);

        OA.common.Utils.indicatorWith('listReference');
    }
});