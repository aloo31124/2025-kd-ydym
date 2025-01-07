/*
   稿面註記
 */

Ext.define('OA.form.FormDraftTopMark', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormDraftTopMark',
    xtype: "FormDraftTopMark",
    config: {
        width: 400,
        height: 400,
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
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    { xtype: 'spacer' },
                    {
                        ui: 'plain', text: '✖', action: 'no',
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    },
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                items: [
                    {
                        xtype: 'selectfield',
                        name: '決行層級_title',
                        label: '決行層級',
                        valueField: 'value',
                        displayField: 'key',
                        store: {
                            data: [
                                { key: '', value: '' },
                                { key: '一層決行', value: '一層決行' },
                                { key: '二層決行', value: '二層決行' },
                                { key: '三層決行', value: '三層決行' },
                                { key: '四層決行', value: '四層決行' },
                                //{ key: '其他', value: '其他' }
                            ]
                        },
                        listeners: {
                            change: function (ctr, Value) {
                                var txtOther = Ext.ComponentQuery.query('textareafield[name=分層負責_title]')[0];
                                var vm = OA.common.Global.getCurrentViewModel();
                                var item = vm.分層負責_title || '';

                                if (Value.trim() !== '' && Value.trim() !== '一層決行') {
                                    if (Value === '其他') {
                                        txtOther.setValue('OO局局長OOO決行');
                                    } else {
                                        if (item.trim() && vm.決行層級_title == Value)
                                            txtOther.setValue(item);
                                        else {
                                            var lv;
                                            if (Value == '一層決行')
                                                lv = -1;
                                            else if (Value == '二層決行')
                                                lv = -2;
                                            else if (Value == '三層決行')
                                                lv = -3;
                                            else if (Value == '四層決行')
                                                lv = -4;
                                            txtOther.setValue(KangDaAppConfig().DCSNS[lv].ofDesc);
                                        }
                                    }
                                    txtOther.setHidden(false);
                                } else {
                                    txtOther.setHidden(true);
                                    txtOther.setValue('');
                                }
                            }
                        }
                    },
                    {
                        xtype: 'textareafield',
                        name: '分層負責_title',
                        label: '分層負責',
                        hidden: true
                    },
                    /* 
                    //113年 第 6 次專案工作會議 暫時隱藏
                    {
                        xtype: 'selectfield',
                        name: '應用限制_title',
                        label: '應用限制',
                        valueField: 'value',
                        displayField: 'key',
                        store: {
                            data: [
                                { key: '', value: '' },
                                { key: '開放應用', value: '開放應用' },
                                { key: '不開放應用', value: '不開放應用' },
                                { key: '限制開放', value: '限制開放' }
                            ]
                        }
                    }, 
                    */
                    {
                        xtype: 'selectfield',
                        id: 'todoWaySelect',
                        name: '擬辦方式_title',
                        label: '擬辦方式',
                        valueField: 'key',
                        displayField: 'value',
                        store: {
                            data: [
                                { value: '', key: '' },
                                { value: '先簽後稿', key: '先簽後稿' },
                                { value: '簽稿併陳', key: '簽稿併陳' },
                                { value: '以稿代簽', key: '以稿代簽' },
                                { value: '其他', key: '其他' }
                            ]
                        },
                        listeners: {
                            change: function (ctr, Value) {

                                var txtOther = Ext.ComponentQuery.query('textareafield[name=分層負責_title]')[0];
                                if (Value == '其他') {
                                    var vm = OA.common.Global.getCurrentViewModel();
                                    var item = vm.分層負責_title || '';
                                    txtOther.setValue(item);
                                    txtOther.setHidden(false);
                                } else {
                                    txtOther.setHidden(true);
                                    txtOther.setValue('');
                                }
                            }
                        }
                    },
                    //{
                    //    id:'todoWayText',
                    //    xtype: 'textareafield',
                    //    name: '其他擬辦',
                    //    label: '其他',
                    //    hidden: true
                    //},
                    // {
                    //     id:'urgencyLevelsSelect',
                    //     xtype: 'selectfield',
                    //     name: '處理級別_title',
                    //     label: '速別',
                    //     valueField: 'value',
                    //     displayField: 'key',
                    //     hidden: true,   //預設隱藏
                    //     store: {
                    //         data: [
                    //             { value: ' ', key: ' '},
                    //             { value: '普通件', key: '普通件'},
                    //             { value: '速件', key: '速件'},
                    //             { value: '最速件', key: '最速件'}
                    //         ]
                    //     }
                    // },
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
                            var data = form.getValues();
                            if (data['擬辦方式_title'] == '其他')
                                data['擬辦方式_title'] = data['其他擬辦'];

                            if (data['決行層級_title'] == '其他')
                                data['決行層級_title'] = '';

                            var names = ['擬辦方式_title', '應用限制_title'];
                            var s = '';
                            Ext.Array.each(names, function (item) {
                                if (data[item] && data[item].length > 0)
                                    s = s.length > 0 ? s + '　' + data[item] : s = data[item];
                            });
                            data.稿面註記_title = s;
                            //如果是文稿一記錄稿面註記在預存資料，供創簽稿預帶
                            // var init = OA.common.Global.getInitParas();
                            // if (init.paperNo && init.paperNo == 1) {
                            var qd = OA.common.Global.getQueryDefault();
                            if (qd && qd.交換資訊) {
                                qd.交換資訊.稿面註記 = data;
                                OA.common.Global.setQueryDefault(qd);

                                //更新vi
                                var edition = OA.common.VIMgr.getCurrentEdition();
                                var init = OA.common.Global.getInitParas();
                                if (edition) {
                                    Ext.Array.each(edition.簽核文件夾.文稿, function (paper) {
                                        if (paper.名稱 != '來文') {
                                            if (paper.代碼 == init.paperNo) {
                                                paper.決行層級 = qd.交換資訊.稿面註記.決行層級_title;
                                                //  OA.common.VIMgr.editionList(edition.版號);
                                            }
                                        }
                                    });
                                }


                            }
                            //  }
                            OA.common.Paper.main().updateContent(data);
                            OA.common.Global.getApp().getController('OA.controller.Work').doLevel(true);

                            form.hide();
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                            
                            let vm = OA.common.Global.getCurrentViewModel();
                            vm.分層負責_title = data.分層負責_title;
                            vm.擬辦方式_title = data.擬辦方式_title;
                            vm.決行層級_title = data.決行層級_title;
                            vm.稿面註記_title = data.稿面註記_title;
                            OA.common.Global.setCurrentViewModel(vm);
                        }
                    }
                ]
            }
        ]
    },
    create: function (data) {
        var me = this;
        var lv = data['決行層級_title'] || '';
        var lvItem = data['分層負責_title'] || '';
        var wk = OA.common.Global.getCurrentWKContent().DocumentType;
        if (lv.trim() === '' && lvItem.length > 0) {
            data['決行層級_title'] = '其他'
        }

        if (wk == '簽' || wk == '簡簽' || wk == '便簽' || wk == '上行簽') {   //1112 簽類型稿面註記新增處理級別  Chloe.sia
            var ur = data['處理級別_title'] || '';
            var urgencyLevelsText = Ext.getCmp('urgencyLevelsSelect');
            if (urgencyLevelsText) {
                urgencyLevelsText.setHidden(false);
                urgencyLevelsText.setValue(ur);
            }
        } else {
            var urgencyLevelsText = Ext.getCmp('urgencyLevelsSelect');
            if (urgencyLevelsText) {
                urgencyLevelsText.setHidden(true);
            }
        }

        var td = data['擬辦方式_title'] || '';
        if (td) {
            if (td.trim().length > 0) {
                if (['先簽後稿', '簽稿併陳', '以稿代簽'].indexOf(td) < 0) {
                    data['擬辦方式_title'] = '其他';
                    var todoWayText = Ext.getCmp('todoWayText');
                    if (todoWayText) {
                        todoWayText.setHidden(false);
                        todoWayText.setValue(td);
                    }
                }
            }
        }
        me.setValues(data);
    }
});