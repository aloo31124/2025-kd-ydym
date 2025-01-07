/*
 發文機關

 1. model/wk/Letter -> name: 'SentPaper', mapping:  OA.common.Utils.getSentPaperData(node);
 2. apply SentPaperData to CurrentViewModel
 3. Paper.svgInit.fieldSelected --> crate Paer.FIELDS.name ,and set source from CurrentViewModel
 4. Paper.updateSentPaper(form.getValues()); (to update viewmodel , wk , dom)

 */

Ext.define('OA.form.FormSentPaper', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormSpentPaper',
    xtype: "FormSentPaper",
    config: {
        width: 800,
        height: 700,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        sourceData: null
    },
    create: function (data) {
        //console.log(data);
        var count = OA.common.DIMgr.getDraftCount();
        //if (count <= 1) data['發文字號_支號_1'] = '';

        this.removeAll(true, true);
        this.setItems(this.getFormItems(data));
        this.setValues(data);
        this.setSourceData(data);

        OA.common.Utils.indicatorWith(this);
    },
    getFormItems: function (data) {
        var me = this;
        var items = [], lastItem;
        var countOrg = data['機關數'];
        var modelName = OA.client.WK.getCurrentModelName();
        var countAndAlias = true;
        if (modelName.indexOf('MayorNote') >= 0 || modelName.indexOf('Letterhead') >= 0) {
            noCountandAlias = false;
        }

        items.push({
            xtype: 'toolbar',
            cls: 'segdoc-selector',
            docked: 'top',
            items: [
                { xtype: 'spacer' },
                {
                    ui: 'plain',
                    text: '✖',
                    action: 'no',
                    scope: this,
                    hasDisabled: false,
                    handler: function (button) {
                        button.up('formpanel').hide();
                    }
                }
            ]
        });
        items.push(me.creatBanner(data));
        if (countAndAlias) {
            for (var i = 1; i <= countOrg; i++) {

                lastItem = me.creatSubOrg(i);
                var countName = data['署名數' + i.toString()];
                var countAlias = data['稿署名數' + i.toString()];

                for (var j = 1; j <= countName; j++) {

                    lastItem.items.push({
                        xtype: 'textfield',
                        name: '署名' + i.toString() + '_' + j.toString(),
                        label: '署名' + j.toString(),
                        countName: '署名數' + i.toString(),
                        listeners: {
                            clearicontap: function (ctr, e, eOpts) {
                                me.removePaperName(ctr);
                            }
                        }
                    });
                }



                for (var k = 1; k <= countAlias; k++) {
                    lastItem.items.push({
                        xtype: 'textfield',
                        name: '稿署名' + i.toString() + '_' + k.toString(),
                        label: '稿署名' + k.toString(),
                        countName: '稿署名數' + i.toString(),
                        listeners: {
                            clearicontap: function (ctr, e, eOpts) {
                                me.removePaperName(ctr);
                            }
                        }
                    });
                }

                lastItem.items.push({
                    xtype: 'spinnerfield',
                    stepValue: 1,
                    name: '署名數' + i.toString(),
                    label: '署名數',
                    hidden: true
                });
                lastItem.items.push({
                    xtype: 'spinnerfield',
                    stepValue: 1,
                    name: '稿署名數' + i.toString(),
                    label: '稿署名數',
                    hidden: true
                });

                items.push(lastItem);
            }
        }
        items.push(me.getButtomToolbar());
        return items;
    },
    getButtomToolbar: function () {
        return {
            xtype: 'toolbar',
            docked: 'bottom',
            cls: 'segdoc-selector',
            scrollable: {
                direction: 'horizontal',
                directionLock: true
            },
            items: [
                { xtype: 'spacer' },
                {
                    ui: 'confirm',
                    text: '確定',
                    action: 'ok',
                    width: '15%',
                    handler: function (button, e, eOpts) {
                        var form = button.up('formpanel');
                        //開放年度流水號輸入，檢核是否與系統文號相同
                        var sysDoSno = OA.common.Global.getInitParas().doSno || '';
                        var isReture = false;
                        var values = form.getValues();
                        if (sysDoSno) {
                            // if (sysDoSno.length > 10) sysDoSno = sysDoSno.toString().substr(0, 10);
                            // var values = form.getValues();
                            // var keyinYearNo = '';
                            // var keyinNumber = '';
                            // for (var name in values) {
                            //     if (name === '發文字號_年度_1') {
                            //         keyinYearNo = values[name];
                            //     } else if (name === '發文字號_流水號_1') {
                            //         keyinNumber = values[name];
                            //     }
                            // }
                            //
                            // var newDoSno=keyinYearNo + keyinNumber;
                            // if (newDoSno.length > 10) newDoSno = newDoSno.toString().substr(0, 10);
                            //
                            //
                            // //表單newDoSno通常為空，不驗證
                            // if (sysDoSno !== newDoSno && newDoSno!=='') {
                            //     Ext.Msg.alert('提示', '發文文號前10碼不可與公文文號相異！');
                            //     return;
                            // }

                            //檢核支號是否重覆
                            var papers = OA.common.VIMgr.getCurrentEditionPapers();
                            var init = OA.common.Global.getInitParas();

                            if (papers.length > 0 && init) {
                                Ext.Array.each(papers, function (paper) {
                                    if (paper.發文文號) {
                                        if ((paper.發文文號 + '').length > 10) {
                                            var no = (paper.發文文號 + '').substr(10, 1);
                                            if (values['發文字號_支號_1'] && no) {
                                                if (values['發文字號_支號_1'] == no && paper.名稱 != '來文' && (init.paperNo + '') !== (paper.代碼 + '')) {
                                                    Ext.Msg.alert("提醒", "支號重覆！");
                                                    isReture = true;
                                                    return false;
                                                }
                                            }
                                        }
                                    }
                                });
                                if (isReture) return;
                            }
                        }
                        OA.common.Paper.main().updateSentPaper(form.getValues());
                        form.hide();
                        // 判斷已存檔功能 - by yi-chi chiu
                        OA.app.isSavedFlag = false;
                    }
                }
            ]
        };
    },
    creatBanner: function (data) {
        var me = this;
        var orgs = OA.common.Global.getQueryDefault().交換資訊.發文機關.機關;
        var _data = [];
        Ext.Array.each(orgs, function (p) {
            var item = { text: p.名稱, value: p.level, source: p };
            if (p.發文字) _data.push(item);
        });

        return {
            xtype: 'fieldset',
            title: '機關全銜<span class="formSentPaperTitleStyle">同一公文號，發文層級需相同</span>',
            items: [
                {
                    id: 'selectSentOrg',
                    xtype: 'selectfield',
                    name: '發文層級',
                    label: '發文層級',
                    valueField: 'value',
                    displayField: 'text',
                    options: _data,
                    listeners: {
                        change: function (ctr, newValue, oldValue, eOpts) {
                            if (ctr._value.raw != null) {
                                Ext.Array.each(orgs, function (org) {
                                    if (org.level == ctr._value.raw.value) {
                                        var data = ctr.up('panel').getValues();
                                        data['發文字號_字_1'] = org.發文字;
                                        data['發文機關_1'] = org.名稱;
                                        data['機關代碼_1'] = org.代碼;
                                        data['發文定義'] = org.名稱;
                                        data['發文機關'] = org.代碼;

                                        var modelName = OA.client.WK.getCurrentModelName();
                                        if (modelName.indexOf('BookLetter') >= 0 || modelName.indexOf('Meeting') >= 0
                                            || modelName.indexOf('MayorNote') >= 0 || modelName.indexOf('Letterhead') >= 0) {
                                            data['稿署名1_1'] = '(　' + org.名稱.split('').join('　') + '　稿　戳　)';
                                            data['署名1_1'] = '(　' + org.名稱.split('').join('　') + '　條　戳　)';
                                        }

                                        ctr.up('panel').setValues(data);
                                    }
                                })
                            }
                        }
                    }
                },
                {
                    id: 'txtSentDefine',
                    xtype: 'textfield',
                    name: '發文定義',
                    label: '發文機關全銜',
                    readOnly: true
                },
                {
                    id: 'spinSentCount',
                    xtype: 'spinnerfield',
                    stepValue: 1,
                    name: '機關數',
                    label: '機關數',
                    listeners: {
                        spin: function (ctr, value, direction, eOpts) {
                            var items;
                            if (direction == 'up') {
                                me.add(me.creatSubOrg(value));
                            } else {
                                items = me.query('#fieldsetSent' + (value + 1).toString());
                                me.remove(items[0], true);
                            }

                            var s = [], key = '';
                            for (var i = 1; i <= value; i++) {
                                key = '發文機關_' + i.toString();
                                s.push(me.getValues()[key]);
                            }

                            items = me.query('#txtSentDefine');
                            items[0].setValue(s.join('、'));
                        }
                    }

                }
            ]
        };
    },
    creatSubOrg: function (idx) {
        var me = this;
        var _id = 'fieldsetSent' + idx.toString();
        var _mainOrgName = '主辦' + idx.toString();

        var isReadOnly = true;
        var qs = OA.common.Global.getQ();
        var FlowRecord = OA.common.Global.getCurrentDocFlowRecord();
        if (FlowRecord) {
            var epaper = FlowRecord.get('epaper');
            isReadOnly = epaper === 'N' ? false : true;
        } else {
            isReadOnly = qs.epaper === 'N' ? false : true;
        }
        if (qs.app === 'offline' || qs.genDocNo === '2') isReadOnly = false;

        return {
            id: _id,
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'titlebar',
                    title: '機關' + idx.toString(),
                    items: [
                        {
                            xtype: 'checkboxfield',
                            name: _mainOrgName,
                            align: 'left',
                            labelWidth: '50%',
                            label: '主辦',
                            labelAlign: 'right',
                            cls: 'checkboxOnly',
                            clearIcon: false,
                            style: 'padding:.1em;width:100px;height:35px;',
                            listeners: {
                                check: function (ctr, e, eOpts) {
                                    var group = Ext.ComponentQuery.query('checkboxfield');
                                    Ext.Array.each(group, function (item) {
                                        if (item.getName() == _mainOrgName)
                                            item.check();
                                        else
                                            item.uncheck();
                                    });
                                },
                                uncheck: function (ctr, e, eOpts) {
                                }
                            }
                        },
                        {
                            text: '+ 稿署名',
                            align: 'right',
                            handler: function (button, e, eOpts) {
                                me.createPaperTagName('稿署名', _id, idx);
                            }
                        },
                        {
                            text: '- 稿署名',
                            align: 'right',
                            handler: function (button, e, eOpts) {
                                me.removePaperTagName('稿署名', _id, idx);
                            }
                        },
                        {
                            text: '+ 署名',
                            align: 'right',
                            handler: function (button, e, eOpts) {
                                me.createPaperTagName('署名', _id, idx);
                            }
                        },
                        {
                            text: '- 署名',
                            align: 'right',
                            handler: function (button, e, eOpts) {
                                me.removePaperTagName('署名', _id, idx);
                            }
                        }
                    ]
                },
                {
                    xtype: 'autocompletefield',
                    name: '發文機關_' + idx.toString(),
                    label: '機關名稱',
                    action: 'change',
                    value: '機關',
                    id: 'OrgName',
                    config: {
                        store: 'Dep3List',
                        proxy: {
                            type: 'rest',
                            useDefaultXhrHeader: false,
                            withCredentials: true,
                            writer: {
                                type: 'json',
                                encodeRequest: true
                            },
                            reader: {
                                type: 'json',
                                rootProperty: 'children'
                            }
                        },
                        resultsHeight: 300
                    },
                    listeners: {
                        select: function (ctr, record, eOpts) {

                            var items = me.query('textfield[action=change]');
                            var s = [];
                            Ext.Array.each(items, function (item) {
                                s.push(item.getValue());
                            });
                            me.query('#txtSentDefine')[0].setValue(s.join('、'));
                        }
                    }
                },
                {
                    xtype: 'textfield',
                    name: '機關代碼_' + idx.toString(),
                    label: '機關代碼'
                },
                {
                    xtype: 'textfield',
                    name: '發文字號_字_' + idx.toString(),
                    label: '字號',
                    readOnly: isReadOnly
                },
                {
                    xtype: 'textfield',
                    name: '發文字號_年度_' + idx.toString(),
                    label: '年度',
                    maxLength: 3,
                    readOnly: isReadOnly
                },
                {
                    xtype: 'textfield',
                    name: '發文字號_流水號_' + idx.toString(),
                    label: '流水號',
                    maxLength: 7,
                    readOnly: isReadOnly
                },
                {
                    xtype: 'textfield',
                    name: '發文字號_支號_' + idx.toString(),
                    label: '支號',
                    maxLength: 1,
                    listeners: {
                        change: function (ctr, Value) {
                            // var isSingle = OA.common.DIMgr.getDraftCount() == 1;
                            // if (isSingle){
                            //     Ext.Msg.alert('提示', '單稿不能給支號');
                            //     ctr.setValue('');
                            // }
                        }
                    }
                }
            ]
        };
    },
    createPaperName: function (tag, _id, idx) {
        var me = this;
        var data = me.getValues();
        //檢查上一次新增欄位值是否為空，如果為空則為減去上次筆數
        var checkNum = data[tag + '數' + idx];
        var checkValue = data[tag + idx + '_' + checkNum];
        if (checkValue == '') {
            delete data[tag + idx + '_' + checkNum];
            data[tag + '數' + idx] = checkNum - 1;
        } else {

            var count = data[tag + '數' + idx] + 1;
            var ctr = Ext.getCmp(_id);
            ctr.add({
                xtype: 'textfield',
                name: tag + idx + '_' + count,
                label: tag + count
            });

            data[tag + '數' + idx] = count;
        }
        me.setValues(data);
        me.create(data);
    },
    createPaperTagName: function (tag, _id, idx) {
        var me = this;
        var data = me.getValues();
        var qd = OA.common.Global.getQueryDefault();
        //檢查上一次新增欄位值是否為空，如果為空則為減去上次筆數
        var checkNum = data[tag + '數' + idx];
        //var checkValue = data[tag + idx + '_' + checkNum];
        var count = data[tag + '數' + idx] + 1;

        if (checkNum <= 0) {
            count = 1;
        }
        var ctr = Ext.getCmp(_id);
        var nodes = [];
        var last = [];

        if (qd && qd.交換資訊) {
            if (tag == '稿署名' && qd.交換資訊.稿署名 && qd.交換資訊.稿署名.人員) {
                if (!Ext.isArray(qd.交換資訊.稿署名.人員)) {
                    last.push(qd.交換資訊.稿署名.人員)
                } else {
                    last = qd.交換資訊.稿署名.人員
                }
            } else if (tag == '署名' && qd.交換資訊.署名 && qd.交換資訊.署名.人員) {
                if (!Ext.isArray(qd.交換資訊.署名.人員)) {
                    last.push(qd.交換資訊.署名.人員)
                } else {
                    last = qd.交換資訊.署名.人員
                }
            }
        }

        Ext.Array.each(last, function (l) {
            nodes.push({ text: l, value: l });
        });

        nodes.push({ text: '本案授權單位主管決行', value: '本案授權單位主管決行' });

        ctr.add({
            xtype: 'selectfield',
            name: tag + idx + '_' + count,
            label: tag + count,
            valueField: 'value',
            displayField: 'text',
            options: nodes,
            listeners: {
                change: function (ctr, newValue, oldValue, eOpts) {
                }
            }
        });

        data[tag + '數' + idx] = count;
        me.setValues(data);
        // me.create(data);
    },
    removePaperTagName: function (tag, _id, idx) {
        var me = this;
        var data = me.getValues();
        var checkNum = data[tag + '數' + idx];
        if (checkNum <= 1) {
            Ext.Msg.alert("提醒", tag + "不可少於一筆");
            return;
        } else {
            var checkValue = data[tag + idx + '_' + checkNum];
            if (checkValue !== '') {
                delete data[tag + idx + '_' + checkNum];
                data[tag + '數' + idx] = checkNum - 1;
                me.setValues(data);
                me.create(data);
            }
        }
    },
    removePaperName: function (ctr) {
        var me = this;
        var tag = ctr.config.countName;
        if (ctr.getName().indexOf('_1') < 0) {
            var data = me.getValues();
            data[tag] = data[tag] - 1;
            me.setValues(data);
            ctr.parent.remove(ctr);
        }
    },
    change: function () {
        var me = this;
        var items = me.query('textfield[action=change]');
        var s = [];
        Ext.Array.each(items, function (item) {
            s.push(item.getComponent().getValue());
        });
        me.query('#txtSentDefine')[0].setValue(s.join('、'));
    }
});