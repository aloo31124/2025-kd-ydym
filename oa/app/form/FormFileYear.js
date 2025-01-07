/*
 檔號及年限
 */

Ext.define('OA.form.FormFileYear', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormFileYear',
    xtype: "FormFileYear",
    id: "FormFileYear",
    config: {
        width: 440,
        height: 330,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
            {
                docked: 'top',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {
                        id: 'openCaseNoTemplate', iconCls: 'fa-book', action: 'copy', ui: 'plain', hidden: true,
                        handler: function (button, e, eOpts) {
                            OA.common.Funcs.show('FormCaseNoTemplates');
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        id: 'AddCommonlyCaseNo', iconCls: 'favorites', action: 'AddCommonlyCaseNo', ui: 'plain', hidden: true,
                        handler: function (button, e, eOpts) {
                            //取得個人常用檔號
                            var form = button.up('formpanel');
                            var values = form.getValues();
                            OA.client.Member.verifyCaseNo(values, function (data) {
                                var casenoName = data.filter(function (n) {
                                    return n.fsKindno == values.分類號 && n.caseno == values.案次號;
                                });

                                var item = {
                                    fsKindname: casenoName ? casenoName[0].fsKindname : '分類號：' + values.分類號,
                                    startDate: values.年度,
                                    fsKindno: values.分類號,
                                    fsYrlimit: values.保存年限,
                                    caseno: values.案次號
                                };

                                item.empNo = OA.common.Global.getCurrentUser().empNo;
                                item.depNo = OA.common.Global.getCurrentDept().depNo;
                                item.orgId = OA.common.Global.getCurrentDept().orgId;

                                // OA.client.Localforage.initCommonlyCaseNo(item);
                                // 常用檔號移至資料庫 - by yi-chi chiu
                                OA.client.Localforage.initCommonlyCaseNo2(item);
                                var addcommonly = Ext.getCmp('AddCommonlyCaseNo');
                                if (addcommonly) {
                                    addcommonly.iconElement.dom.style.color = '#FFFF33';
                                }
                            })
                        }
                    },
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
                        action: 'no',
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }

                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                items: [
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                label: '年度：',
                                xtype: 'textfield',
                                name: '年度',
                                labelWidth: 116,
                                width: 360
                            },
                            {
                                xtype: 'button',
                                ui: 'plain',
                                text: '▼',
                                margin: '5 0 0 0',
                                handler: function (button) {
                                    OA.common.Funcs.show('FormCaseNo');
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                id: 'txtKindno',
                                label: '分類號：',
                                xtype: 'textfield',
                                name: '分類號',
                                labelWidth: 116,
                                width: 360,
                                listeners: {
                                    keyup: function (ctr, e, eOpts) {
                                        var form = ctr.up('formpanel');
                                        if (form && form.getValues()) {
                                            var values = form.getValues();
                                            if ((values.年度 + '').trim() == '') {
                                                var dt = new Date();
                                                values.年度 = dt.getFullYear() - 1911;
                                                form.setValues(values);
                                            }
                                        }
                                        form.checkCommonly(ctr.getValue());
                                        var store = Ext.getStore('CaseNo');
                                        if (store) {
                                            Ext.Array.each(store.data.all, function (code) {
                                                if (code.data.fsKindno === ctr.getValue()) {

                                                    yrlimit = Ext.getCmp('yearLimit');
                                                    yrlimit.setValue(code.data.fsYrlimit);
                                                    return false;
                                                }
                                            });
                                        }
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                ui: 'plain',
                                text: '▼',
                                margin: '5 0 0 0',
                                handler: function (button) {
                                    var txtKindno = Ext.getCmp('txtKindno');
                                    if (txtKindno) {
                                        var data = { key: 'kind', value: txtKindno.getValue() };

                                        var fileyearForm = Ext.getCmp('FormFileYear');
                                        var yearNo = '';
                                        if (fileyearForm) {
                                            var values = fileyearForm.getValues();
                                            if (values && values.年度 && values.年度.trim().length > 0) {
                                                yearNo = values.年度.trim();
                                            } else {
                                                var dt = new Date();
                                                yearNo = dt.getFullYear() - 1911;
                                            }
                                        }

                                        OA.client.Member.loadCaseNo(OA.common.Global.getCurrentDept().depNo, yearNo, function () {
                                            OA.common.Funcs.show('FormCaseNo', null, data);
                                        });

                                        // OA.common.Funcs.show('FormCaseNo', null, data);
                                    }
                                }
                            }
                        ]
                    },
                    //{
                    //    label: '分類號：',
                    //    xtype: 'textfield',
                    //    name: '分類號',
                    //    listeners: {
                    //        keyup: function (ctr, e, eOpts) {
                    //            var form = ctr.up('formpanel');
                    //            form.checkCommonly(ctr.getValue());
                    //            var store = Ext.getStore('CaseNo');
                    //            if (store) {
                    //                Ext.Array.each(store.data.all, function (code) {
                    //                    if (code.data.fsKindno === ctr.getValue()) {
                    //                        yrlimit = Ext.getCmp('yearLimit');
                    //                        yrlimit.setValue(code.data.fsYrlimit);
                    //                        return false;
                    //                    }
                    //                });
                    //            }
                    //        }
                    //    }
                    //},
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                label: '案次號：',
                                xtype: 'textfield',
                                name: '案次號',
                                labelWidth: 116,
                                width: 360
                            },
                            {
                                xtype: 'button',
                                ui: 'plain',
                                text: '▼',
                                margin: '5 0 0 0',
                                handler: function (button) {
                                    var txtKindno = Ext.getCmp('txtKindno');
                                    if (txtKindno) {
                                        var data = { key: 'case', value: txtKindno.getValue() };

                                        var fileyearForm = Ext.getCmp('FormFileYear');
                                        var yearNo = '';
                                        if (fileyearForm) {
                                            var values = fileyearForm.getValues();
                                            if (values && values.年度 && values.年度.trim().length > 0) {
                                                yearNo = values.年度.trim();
                                            } else {
                                                var dt = new Date();
                                                yearNo = dt.getFullYear() - 1911;
                                            }
                                        }

                                        OA.client.Member.loadCaseNo(OA.common.Global.getCurrentDept().depNo, yearNo, function () {
                                            OA.common.Funcs.show('FormCaseNo', null, data);
                                        });

                                        // OA.common.Funcs.show('FormCaseNo', null, data);
                                    }
                                }
                            }
                        ]
                    },
                    //{
                    //    label: '案次號：',
                    //    xtype: 'textfield',
                    //    name: '案次號'

                    //},
                    {
                        label: '保存年限：',
                        xtype: 'textfield',
                        name: '保存年限',
                        id: 'yearLimit',
                        labelWidth: 116,
                        width: 360
                    },
                    {
                        label: '目次號：',
                        xtype: 'textfield',
                        name: '目次號',
                        id: 'txtOrderno',
                        labelWidth: 116,
                        width: 360,
                        hidden: true
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    { xtype: 'spacer' },
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '20%',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            form.doOK(form);
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                        }
                    }
                ]
            }
        ]
    },
    create: function (data) {
        var qs = OA.common.Global.getQ();
        var queryBtn = Ext.getCmp('fileYearQuery');
        if (qs.app === 'offline' && queryBtn) queryBtn.setHidden(true);
        var me = this;
        //console.log(data.保存年限);
        if (data.保存年限 && data.保存年限 == '99') data.保存年限 = '永久';
        //機密文書機密等級變更或註銷處理意見表，增加目次號輸入欄位
        if (data.templateUrl && data.templateUrl == 'web/ExchangeNoticeOpinion.svg') {
            Ext.getCmp('txtOrderno').setHidden(false);
            me.setHeight(390);
        } else {
            if (data.目次號) data.目次號 = '';
            Ext.getCmp('txtOrderno').setHidden(true);
            Ext.getCmp('txtOrderno').setValue('');
            me.setHeight(330);
        }
        me.setValues(data);
        var valus = me.getValues();
        
        //暫時不用常用檔號功能
        //me.checkCommonly(valus.分類號);
        //me.checkCommonly(valus.分類號 + valus.案次號);



    },
    checkCommonly: function (kindno) {

        // 常用檔號移至資料庫 - by yi-chi chiu
        OA.client.Localforage.getCommonlyCaseNo2(function (value) {
            if (!value) {
                return;
            }

            var has = false;
            Ext.Array.each(value, function (used) {
                var _item = JSON.parse(B64.decode(used.phrase));
                //=> 修正 兩個以上案次號 檔案無法加入我的最愛 by joshua kang
                if (_item.empNo == OA.common.Global.getCurrentUser().empNo && _item.depNo == OA.common.Global.getCurrentDept().depNo && _item.fsKindno + _item.caseno === kindno) {
                    has = true;
                    return false;
                }
            });
            var addcommonly = Ext.getCmp('AddCommonlyCaseNo');
            if (addcommonly) {
                if (has) {
                    addcommonly.iconElement.dom.style.color = '#FFFF33';
                }
                else {
                    addcommonly.iconElement.dom.style.color = '';
                }

            }
        });
    },
    doOK: function (form) {
        var qs = OA.common.Global.getQ();
        var me = this;
        var values = me.getValues();
        if (values && (values.年度 + '').trim() == '') {
            Ext.Msg.alert("提示", "年度不可空白！");
            return;
        }

        values['年度'] = (values['年度'] + '').trim();
        values['分類號'] = (values['分類號'] + '').trim();
        values['案次號'] = (values['案次號'] + '').trim();
        values['保存年限'] = (values['保存年限'] + '').trim();

        if (qs.app === 'offline') {
            me.doUpdate(values);
        } else {
            OA.client.Member.verifyCaseNo(values, function () {
                me.doUpdate(values);
            })
        }
    },
    doUpdate: function (values) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var qd = OA.common.Global.getQueryDefault();
        if (values['保存年限'] == '永久') values['保存年限'] = 99;
        //if (OA.common.Utils.checkEpaper() && parseInt(values['保存年限']) >= 99) {
        //    Ext.Msg.alert('提示', '保存年限永久不可採線上簽核，請改紙本陳核。');
        //} else {
        if (qd && qd.交換資訊 && qd.交換資訊.檔號) {
            qd.交換資訊.檔號.fsYear = values['年度'] || '';
            qd.交換資訊.檔號.fsKindno = values['分類號'] || '';
            qd.交換資訊.檔號.fsYrlimit = values['保存年限'] || '';
            qd.交換資訊.檔號.caseno = values['案次號'] || '';
        }
        //console.log(values);
        OA.common.Paper.main().updateFileYear(values);
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        var qs = OA.common.Global.getQ();
        if (qs.isImport && qs.isImport === 'Y') {
            me.hide();
            return;
        }
        if (qs.app === 'editor' || qs.app === 'offline') {
            //ctrWK.doSaveFolder({ action: 'save', isNotPopup: true });
        } else {
            ctrWK.doSave({ action: 'save' });
        }
        me.hide();
        //}
    }
});