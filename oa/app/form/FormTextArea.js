/*
 
 */
Ext.define('OA.form.FormTextArea', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormTextArea',
    xtype: "FormTextArea",
    config: {
        width: 600,
        height: 240,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            //margin: '5',
            labelWidth: '40%'
        },
        scrollable: false,
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
                items: []
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
                            var fields = form.getFields();
                            var vm = OA.common.Global.getCurrentViewModel();
                            var initParas = OA.common.Global.getInitParas().documentType;
                            for (var name in fields) {
                                if (name === '電話' && initParas!='電子信箱回覆函') {
                                    fields[name].setValue('(電話：' + fields[name].getValue() + ')')
                                }else if(name === '電話' && initParas == '電子信箱回覆函'){
                                    fields[name].setValue(fields[name].getValue())
                                }

                                if (name === '主辦機關') {
                                    
                                    var items = [];
                                    items.push(form.getValues().主辦機關);
                                    if (vm.會辦機關) {
                                        var i = 0;
                                        Ext.Array.each(vm.會辦機關.split('、'), function (value) {
                                            if (i > 0) items.push(value);
                                            i = i + 1;
                                        });
                                    }
                                    OA.common.Paper.main().doDraftVerify('會辦機關', items);
                                    vm['會辦機關'] = items.join('、');
                                    OA.common.Paper.main().saveWKField('會辦機關', items.join('、'));                                    
                                    form.hide();
                                    // 判斷已存檔功能 - by yi-chi chiu
                                    OA.app.isSavedFlag = false;
                                    return;
                                }

                                if (name === '發文字號') {
                                    //存入WK的流水號中，同步VM發文文號
                                    var wk = OA.common.Global.getCurrentWKContent();
                                    if (wk) {
                                        var tagText = OA.common.Utils.getTagText(wk, '發文字號');
                                        if (tagText) {
                                            Ext.Array.each(tagText.childNodes, function (n3, a, b) {
                                                if (n3.Key === '發文字號_流水號') {
                                                    n3.Value = fields[name].getValue();
                                                    vm.發文文號 = fields[name].getValue();
                                                } else {
                                                    n3.Value = '';
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            var doHide = true;
                            doHide = OA.common.Paper.main().updateContent(form.getValues());
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                            doHide = doHide == undefined ? true : doHide;
                            if (doHide) form.hide();
                        }
                    }
                ]
            }
        ]
    },
    create: function (key, data) {
        var me = this;
        var field = me.query('fieldset')[0];
        var title = '';

        if (key === '會銜公文') {
            title = '格式';
            if (data['會銜公文']) data['會銜公文'] = data['會銜公文'].replace('會銜', '').replace('會辦單', '');
        } else if (key === '電話') {
            title = '電話';

            if (data.hasOwnProperty(key) && data['電話'] != undefined) {
                data['電話'] = data['電話'].replace('電話', '').replace(')', '').replace('(', '').replace('：', '');
            } else if (data.hasOwnProperty('承辦單位電話')) {
                data['電話'] = data['承辦單位電話']
            }
        } else if (key === '主辦機關') {
            title = key;
            if (data.會辦機關) {
                if (data.會辦機關.indexOf('、')) {
                    var arr = data.會辦機關.split('、');
                    if (Ext.isArray(arr)) {
                        data[title] = arr[0];
                    }
                }
            }
        } else if (key === '發文字號') {
            //從WK拿
            title = key;
            data['發文字號'] = '';
            var wk = OA.common.Global.getCurrentWKContent();
            if (wk) {
                if (wk) {
                    var items = OA.common.Utils.getDoSnoForWebsvg(wk);
                    if (items && items.length > 1) {
                        data['發文字號'] = items[1];
                    }
                }
            } 
            //if (data.hasOwnProperty(key) && data['發文字號'] != undefined) {
            //    data['發文字號'] = data['發文字號'].replace('發文字號', '').replace('：', '');
            //} else if (data.hasOwnProperty('發文字號')) {
            //    data['發文字號'] = '(' + data['發文字號'] + ')'
            //}
        } else
            title = key;

        //去多餘空白
        if (data[title] != undefined)
            data[title] = data[title] + ''.trim();

        if (key == '職') {
            //console.log(data);
            field.setItems([
                {
                    name: key,
                    label: '謹簽:',
                    xtype: 'textareafield',
                    value: data['職_title'],
                }
            ]);

        } else {
            field.setItems([
                {
                    name: key,
                    label: title + ':',
                    xtype: 'textareafield'
                }
            ]);
        }

       

        me.setValues(data);
    }
});