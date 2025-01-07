/*
  公文格式 （目前沒用到）
 */
Ext.define('OA.form.FormOfficialFormat', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormOfficialFormat',
    xtype: "FormOfficialFormat",
    id: "officialFormat",
    config: {
        width: 800,
        height: 380,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            labelWidth: '50%'
        },
        items: [
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                items: [ 
                    /*
                    {
                        id: 'deptSample',
                        xtype: 'selectfield',
                        name: '單位範本_title',
                        label: '單位範本',
                        valueField: 'value',
                        displayField: 'key',
                        hidden: true,   //預設隱藏
                        store: {
                            data: [
                                { key: '', value: '' },
                            ]
                        },
                        listeners: {
                            focus: function (ctr, e, eOpts) {
                                var me = ctr.up('formpanel');
                                var select = me.query('selectfield[name=單位範本_title]')[0];
                                if(select.getStore().getData().length == 1){
                                    var paras = OA.common.Global.getInitParas();
                                    OA.client.DocTemp.load(paras, function (tempRet) {
                                        Ext.Array.each(tempRet.arrList, function (p) {
                                            var item = { key: p, value: p };
                                            select.getStore().addData(item);
                                            select.reset();
                                        });
                                    });
                                }
                            },
                            }
                    },
                    */
                    // {
                    //        xtype: 'textareafield',
                    //        name: '分層負責_title',
                    //        label: '分層負責',
                    //        hidden: true
                    // },
                    {
                        id: 'jobTitle',
                        xtype: 'selectfield',
                        name: '決行層級_title',
                        label: '決行層級',
                        valueField: 'value',
                        displayField: 'key',
                         store: {
                             data: [
                                 { key: '一層決行', value: '一層決行' },
                                 { key: '二層決行', value: '二層決行' },
                                 { key: '三層決行', value: '三層決行' },
                                 { key: '四層決行', value: '四層決行' }
                             ]
                         }
                    },{
                        xtype: 'checkboxfield',
                        name: '中心全銜_title',
                        label: '中心全銜',
                        checked: false,
                        listeners: {
                            check: function (ctr, e, eOpts) {
                                $('#jobTitle').find('.x-unsized').attr('hidden', true);
                            },
                            uncheck: function (ctr, e, eOpts) {
                                $('#jobTitle').find('.x-unsized').attr('hidden', false);
                            }
                        }
                    },
                    {
                        xtype: 'checkboxfield',
                        name: '承辦人簡稱_title',
                        label: '承辦人簡稱',
                        checked: false,
                        listeners: {
                            check: function (ctr, e, eOpts) {
                            },
                            uncheck: function (ctr, e, eOpts) {
                            }
                        }
                    },
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {
                        text: '取消', action: 'no', width: '20%',
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    },
                    {xtype: 'spacer'},
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '20%',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var data = form.getValues();
                            // if(data.單位範本_title !== ''){
                            //     var paras = OA.common.Global.getInitParas();
                            //     paras.fileName = data.單位範本_title
                            //     OA.client.DocTempContent.load(paras, function (tempDiRet) {
                            //
                            //         var idx;
                            //         if (tempDiRet.DocTempDi.indexOf(']>') >= 0) {
                            //             idx = tempDiRet.DocTempDi.indexOf(']>') + 2;
                            //         } else if (tempDiRet.DocTempDi.indexOf('.dtd') >= 0) {
                            //             idx = tempDiRet.DocTempDi.indexOf('.dtd') + 6;
                            //         }
                            //         tempDiRet.DocTempDi = tempDiRet.DocTempDi.substring(idx);
                            //
                            //         var values = {
                            //             action: "add",
                            //             qFormat: "函",
                            //             qNumberWay: "1",
                            //             qTemplate: "函",
                            //             qc: "2",
                            //             qIsNew: false,
                            //             di: tempDiRet.DocTempDi,
                            //             attachs: [],
                            //             // ret: ret
                            //         };
                            //
                            //     OA.common.Global.getApp().getController('OA.controller.Work').onNewDocPaper(null, values);
                            //
                            //     });
                            //     form.hide();
                            //     Ext.getCmp('FormNewDoc').hide();
                            // }else {
                                form.hide();
                            // }
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                        }
                    }
                ]
            }
        ]
    },
    create: function (data) {
        var me = this;
        var Dept = OA.common.Global.getCurrentDept();

        //if(Dept.depName == '業務部'){
        //    // var ur = data['單位範本_title'] || '';
        //    var deptSample = Ext.getCmp('deptSample');
        //    if (deptSample) {
        //        deptSample.setHidden(false);
        //        // deptSample.setValue(ur);
        //    }
        //}else {
        //    var deptSample = Ext.getCmp('deptSample');
        //    if (deptSample) {
        //        deptSample.setHidden(true);
        //    }
        //}
        me.setValues(data);
    }
});