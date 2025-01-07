/*
 密等
 */

Ext.define('OA.form.FormSecurity', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormSecurity',
    xtype: "FormSecurity",
    config: {
        width: 500,
        height: 340,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
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
                defaults: {
                    labelWidth: '50%'
                },
                items: [                    
                    {
                        xtype: 'selectfield',
                        name: '密等',
                        label: '密等：',
                        valueField: 'key',
                        displayField: 'value',
                        store: {
                            data: [
                                {value: ' ', key: ' '},
                                {value: '密', key: '密'},
                                {value: '機密', key: '機密'},
                                {value: '極機密', key: '極機密'},
                                {value: '絕對機密', key: '絕對機密'}
                            ]
                        },
                        listeners: {
                            change: function (ctr, newValue, oldValue, eOpts) {
                                var select = ctr.up('formpanel').query('selectfield[name=解密條件或保密期限]')[0];
                                if (newValue !== ' ') {
                                    var data = [
                                        { value: ' ', key: ' ' },
                                        { value: '本件於公布時解密', key: '本件於公布時解密' },
                                        { value: '本件至某年某月某日解密', key: '本件至某年某月某日解密' },
                                        { value: '保存年限屆滿後解密', key: '保存年限屆滿後解密' },
                                        { value: '附件抽存後解密', key: '附件抽存後解密' },                                        
                                        { value: '其他', key: '其他' }
                                    ];
                                    select.getStore().setData(data);
                                } else {
                                    select.getStore().setData([]);
                                    select.reset();
                                }
                            }
                        }
                    },
                    {
                        xtype: 'selectfield',
                        name: '解密條件或保密期限',
                        label: '解密條件或保密期限：',
                        valueField: 'value',
                        displayField: 'key',
                        store: {
                            data: [
                                {value: ' ', key: ' '}
                            ]
                        },
                        listeners: {
                            change: function (ctr, newValue) {
                                var txtOther = Ext.ComponentQuery.query('textareafield[name=其他]')[0];
                                var pickerDate = Ext.ComponentQuery.query('textfield[name=本件至某年某月某日解密]')[0];
                                if (newValue == '本件至某年某月某日解密') {
                                    txtOther.setHidden(true);
                                    txtOther.setValue(' ');
                                    pickerDate.setHidden(false);
                                } else if (newValue == '其他') {
                                    txtOther.setHidden(false);
                                    pickerDate.setHidden(true);
                                    pickerDate.setValue('');
                                } else {
                                    txtOther.setHidden(true);
                                    txtOther.setValue(' ');
                                    pickerDate.setHidden(true);
                                    pickerDate.setValue('');
                                }
                            }
                        }
                    },
                    {
                        label: '本件至某年某月某日解密',
                        xtype: 'textfield',
                        // dateFormat: 'Y/m/d',
                        name: '本件至某年某月某日解密',
                        hidden: true,
                        listeners: {
                            focus: function (ctr, e, eOpts) {
                                var index = ctr.getValue().indexOf("/");
                                var oValue = ctr.getValue();
                                if (index > -1 || ctr.getValue() == '') {
                                    if(index > -1)
                                    var testDate = (parseInt(ctr.getValue().slice(0, index)) + 1911).toString() + ctr.getValue().slice(index);
                                    ctr.setValue(testDate);
                                 }
                                OA.common.Paper.main().openSecurityDate(ctr);
                                ctr.setValue(oValue);
                            }
                        }
                    },
                    {
                        xtype: 'textareafield',
                        name: '其他',
                        label: '其他',
                        hidden: true
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {xtype: 'spacer'},
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '20%',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var data = form.getValues();
                            if (data['解密條件或保密期限'] == '本件至某年某月某日解密') {
                                var picker = Ext.ComponentQuery.query('textfield[name=本件至某年某月某日解密]')[0];
                                if (picker.getValue()) {
                                    // var v = Ext.Date.add(new Date(picker.getValue()), Ext.Date.YEAR, -1911);
                                    var v = Ext.Date.add(new Date(picker.getValue()), Ext.Date.YEAR, 0);
                                    var m = Ext.util.Format.date(v, 'm');
                                    var d = Ext.util.Format.date(v, 'd');
                                    if (m.indexOf(0) == 0) m = m.substr(1, 1);
                                    if (d.indexOf(0) == 0) d = d.substr(1, 1);
                                    var v1 = v.getFullYear() + '年' + m + '月' + d + '日';
                                    data['本件至某年某月某日解密文'] = '本件至' + v1 + '解密';
                                    data['解密日期'] = v;
                                } else {
                                    data['解密條件或保密期限'] = ' ';
                                    data['本件至某年某月某日解密'] = '';
                                    data['本件至某年某月某日解密文'] = '';
                                    data['解密日期'] = null;
                                }
                            }

                            if (data['解密條件或保密期限'] == null) data['解密條件或保密期限'] = ' ';
                            OA.common.Paper.main().updateSecurity(data);

                            //if(data['密等'] !== ' '){
                            //    Ext.getCmp('takeNumber').hide();
                            //}else {
                            //    Ext.getCmp('takeNumber').show();
                            //}

                            form.hide();
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                        }
                    }
                ]
            }
        ]
    }
});