/*
 個人詞彙
 */
Ext.define('OA.form.FormThesaurus', {
    extend: 'Ext.Panel',
    xtype: "FormThesaurus",
    alias: 'widget.FormThesaurus',
    id: 'FormDocTemplates',
    requires: ['Ext.SegmentedButton', 'Ext.Toolbar', 'Ext.plugin.SortableList', 'OA.client.Phrase'],
    config: {
        ui: 'dark',
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        width: '60%',
        height: '60%',
        style: 'font-size:20px',
        activeTab: 1,
        defaults: {
            scrollable: true
        },
        layout: 'vbox',
        items: [
            {
                id: 'toolbarThesaurusSort',
                xtype: 'toolbar',
                docked: 'top',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector',
                items: [
                    {
                        text: '新增', action: 'add', width: '15%',
                        handler: function (button) {
                            var panel = button.up('panel');
                            Ext.Msg.prompt('', '請輸入詞彙: ', function (key, value) {
                                if (key === 'ok') {
                                    panel.doExcute('create', { phrase: value });
                                }
                            }, this, false);
                        }
                    },
                    {
                        text: '刪除', action: 'del', width: '15%',
                        handler: function (button) {
                            var panel = button.up('panel');
                            var r = panel.getCurrentReocrd();
                            if(r.get('phraseId') === '') {
                                Ext.Msg.show({ message: "預設單位詞庫無法刪除", buttons: Ext.MessageBox.YES });
                                return;
                            }
                            if (r)
                                panel.doExcute('delete', { phraseId: r.get('phraseId') });
                        }
                    },
                    {
                        text: '修改', action: 'rev', width: '15%',
                        handler: function (button) {
                            var panel = button.up('panel');
                            var r = panel.getCurrentReocrd();
                            if(r.get('phraseId') === '') {
                                Ext.Msg.show({ message: "預設單位詞庫無法修改", buttons: Ext.MessageBox.YES });
                                return;
                            }
                            if (r) {
                                Ext.Msg.prompt('', '請輸入詞彙: ', function (key, value) {
                                    if (key === 'ok') {
                                        panel.doExcute('update', { phraseId: r.get('phraseId'), phrase: value });
                                    }
                                }, this, false, r.get('phrase'));
                            }
                        }
                    },
                    { xtype: 'spacer' },
                    { text: '個人', kindNo: '028' },
                    { text: '單位', kindNo: '027' },
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
                        action: 'close',
                        handler: function (button, e, eOpts) {
                            button.up('panel').hide();
                        }
                    }
                    // ,{text: '匯出', action: 'export', width: '20%'},
                    // {text: '匯入', action: 'import', width: '20%'}
                ],
                defaults: {
                    handler: function (button, e, eOpts) {
                        var panel = button.up('panel');
                        panel.doToolbarThesaurus(button.config);
                    }
                }
            },
            {
                flex: 1,
                xtype: 'list',
                scrollable: 'vertical',
                id: 'thesaurusList',
                store: 'Phrase',
                itemTpl: new Ext.XTemplate(
                    '<table>',
                    '<tr>',
                    '<td width="55%">',
                    '<p style="font-size:110%;">',
                    ' {phrase} ',
                    '</p>',
                    '</td>',
                    '</tr>',
                    '</table>'
                ),
                infinite: true,
                variableHeights: true,
                listeners: {
                    itemtap: function (list, index, item, record, event) {
                        var panel = list.up('panel');
                        panel.setCurrentReocrd(record);
                    }
                }
            },
            {
                id: 'ctrThesaurus',
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    { xtype: 'spacer' },
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '20%',
                        handler: function (button, e, eOpts) {
                            var select = Ext.getCmp('thesaurusList');
                            var panel = button.up('panel');
                            var isSelect = select && select.selected.items.length > 0;
                            if (!isSelect) return;

                            if (panel.getKey() != 'paper') { //意見欄
                                var floatingPanel;
                                if (panel.getKey() && panel.getKey().indexOf('-stricky') >= 0) {
                                    floatingPanel = Ext.getCmp(panel.getKey());
                                } else {
                                    floatingPanel = Ext.getCmp('suggestionText');
                                }
                                if (!floatingPanel) return;
                                var textarea = floatingPanel.element.dom.querySelector('textarea');
                                if (textarea) {
                                    var prefixStr = textarea.value.substring(0, textarea.selectionStart);
                                    var suffixStr = textarea.value.substring(textarea.selectionEnd);
                                    textarea.value = prefixStr + select.selected.items[0].data.phrase + suffixStr;
                                    // 強制常用詞append時store更新  - by yi-chi chiu
                                    var i = 0;
                                    // 排除不是由便利貼進入時造成UI的錯誤 - by yi-chi chiu
                                    if (Ext.getStore('Sticky').getRange()[i] && Ext.getStore('Sticky').getRange()[i]['data'])
                                        while (Ext.getStore('Sticky').getRange()[i]['data']['lastUpdateTime'] && Ext.getCmp(panel.getKey())) {
                                            if (Ext.getStore('Sticky').getRange()[i]['data']['lastUpdateTime'] === Ext.getCmp(panel.getKey()).getData()['lastUpdateTime']) {
                                                Ext.getStore('Sticky').getRange()[i].data['text'] = textarea.value;
                                                break;
                                            }
                                            i++;
                                        }
                                }
                                textarea.focus();
                            } else {  //本文
                                //OA.common.Paper.main().editActions().insertWord(select.selected.items[0].data.phrase);
                                OA.common.Paper.main().editActions().insertWordSymbols(select.selected.items[0].data.phrase);
                                // 判斷已存檔功能 - by yi-chi chiu
                                OA.app.isSavedFlag = false;
                            }
                            panel.hide();
                        }
                    }
                ]
            }
        ],
        key: '',
        currentKindNo: '028',
        currentReocrd: null
    },
    create: function (key) {
        var me = this;
        me.setKey(key);
        me.changeKind();
    },
    doToolbarThesaurus: function (data) {
        var me = this;
        if (data.action == 'export') {

        } else if (data.action == 'import') {

        } else {
            me.changeKind(data.kindNo);
        }
    },
    changeKind: function (kindNo) {
        var ctr = Ext.getCmp('ctrThesaurus');
        if (ctr && kindNo) {
            var isHinde = kindNo === '027' ? true : false;
            Ext.Array.each(ctr.getInnerItems(), function (item) {
                if (item.getInitialConfig('xtype') !== 'spacer' && item.getText() !== '確定') {
                    item.setHidden(isHinde);
                }
            });
        }

        if (!kindNo) kindNo = this.getCurrentKindNo();

        Ext.getCmp('toolbarThesaurusSort').getItems().each(function (item) {
            if (item.config.kindNo == kindNo)
                item.setUi('confirm');
            else
                if (item.config.kindNo)
                    item.setUi('action');
        });

        this.setCurrentKindNo(kindNo);
        this.doExcute('query');
    },
    doExcute: function (action, data, callback) {
        var me = this;
        var paras = OA.common.Global.getInitParas();
        var input = {};
        input.action = action;
        input.kindNo = this.getCurrentKindNo();

        if (input.kindNo == '027') {
            input.empNo = paras.depNo; // 使用 單位代碼depNo, 非 機關代碼orgId
        } else {
            input.empNo = paras.empNo;
        }

        if (action == 'create') {
            input.phrase = data.phrase;
        } else if (action == 'delete') {
            input.phraseId = data.phraseId;
        } else if (action == 'update') {
            input.phraseId = data.phraseId;
            input.phrase = data.phrase;
        }

        //input.phraseType = paras.orgId;
        OA.client.Phrase.excute(input, function (resp) {
            if (callback) {
                callback();
            } else {
                if (action !== 'query') me.doExcute('query');
            }

            OA.common.Utils.indicatorWith(me);
        });
    }
});