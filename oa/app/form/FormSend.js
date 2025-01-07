/*
 發文
 */
Ext.define('OA.form.FormSend', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormSend',
    xtype: 'FormSend',
    id: 'formSend',
    requires: ['OA.model.Contact', 'OA.client.Exchange'],
    config: {
        width: '95%',
        height: '95%',
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        layout: {
            type: 'hbox'
        },
        scrollable: false,
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    {
                        id: 'selectSendType',
                        xtype: 'selectfield',
                        name: 'q_type',
                        valueField: 'value',
                        displayField: 'name',
                        listeners: {
                            change: function (ctr, newValue, oldValue, eOpts) {
                                var me = Ext.getCmp('formSend');
                                if (newValue == 'Multiple') {
                                    me.choose('一文多發');
                                } else {
                                    me.choose('分址分文');
                                }
                            }
                        }
                    },
                    {
                        id: 'chkShowAll',
                        xtype: 'togglefield',
                        name: 'names',
                        label: '副本顯示所有受文者',
                        labelWidth: '60%',
                        hidden: true
                    },
                    { xtype: 'spacer' },                   
                    {
                        id: 'selectReSend',
                        xtype: 'selectfield',
                        name: 'q_type',
                        valueField: 'value',
                        displayField: 'name',
                        hidden: true
                    },                  
                    { xtype: 'spacer' },                     
                    {
                        id: 'chkSendNE',
                        xtype: 'togglefield',
                        name: 'names',
                        label: '署名寫入'
                    },
                    {
                        id: 'chkSendLV',
                        xtype: 'togglefield',
                        name: 'level',
                        label: '分層負責寫入',
                        labelWidth: '50%'
                    },
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
                        action: 'no',
                        scope: this,
                        hasDisabled: false,
                        handler: function (button) {
                            button.up('formpanel').hide();
                            Ext.Viewport.setMasked(false);
                        }
                    }
                ]
            },
            {
                xtype: 'fieldset',
                title: '轉交換',
                layout: 'fit',
                width: '40%',
                items: {
                    id: 'sendList',
                    xtype: 'list',
                    scrollable: 'vertical',
                    disableSelection: true,
                    itemTpl: new Ext.XTemplate(
                        '<table>',
                        '<tr>',
                        '<td width="5%">',
                        '<tpl if="(isEdit)">',
                        '<span class="flow-delete">&nbsp;</span>',
                        '</td>',
                        '</tpl>',
                        '<td width="5%">',
                        '<tpl if="this.isOnline(TRANSTYPE)"><span class="speed-fastest">電</span></tpl>',
                        '<tpl if="this.isBulletin(TRANSTYPE)"><span class="speed-faster">貼</span></tpl>',
                        '<tpl if="this.isPaper(TRANSTYPE)"><span class="speed-normal">紙</span></tpl>',
                        '<tpl if="this.isMemo(TRANSTYPE)"><span class="speed-normal" style="background: yellow;">內</span></tpl>',
                        '<tpl if="this.isSelf(TRANSTYPE)"><span class="speed-normal" style="background: gold;">自</span></tpl>',
                        '<tpl if="this.isCopy(TRANSTYPE)"><span class="speed-normal" style="background: green;">抄</span></tpl>',
                        '</td>',

                        '<td width="65%">',
                        '<p style="font-size:110%;">',
                        ' {VALUE} ',
                        ' （{KEY}） ',
                        '</p>',
                        '<p>',
                        '<tpl if="this.hasAddr(ADDR)">（{ADDR}）</tpl>',
                        // ' （{ADDR}） ',
                        '</p>',
                        '</td>',

                        '<td width="15%">',
                        '<tpl if="(editAtt)">',
                        '<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">',
                        '<p>',
                        '選擇<br>附件',
                        '</p>',
                        '</tpl>',
                        '</td>',

                        '</tr>',
                        '</table>',
                        {
                            isOnline: function (TRANSTYPE) {
                                return ('9' == TRANSTYPE);
                            },
                            isBulletin: function (TRANSTYPE) {
                                return ('6' == TRANSTYPE);
                            },
                            isPaper: function (TRANSTYPE) {
                                return ('2' == TRANSTYPE);
                            },
                            isMemo: function (TRANSTYPE) {
                                return ('8' == TRANSTYPE);
                            },
                            isSelf: function (TRANSTYPE) {
                                return ('7' == TRANSTYPE);
                            },
                            isCopy: function (TRANSTYPE) {
                                return ('5' == TRANSTYPE);
                            },
                            hasAddr: function (ADDR) {
                                return (ADDR);
                            }
                        }),
                    listeners: {
                        itemtap: function (list, index, item, record, event) {
                            var form = list.up('formpanel');
                            var me = Ext.getCmp('formSend');
                            if (event.getTarget('.flow-delete')) {
                                //先增加再刪除不然會拋錯...
                                me.updataVM(record, 'unChange');
                                Ext.getCmp('unsendList').getStore().add(record);
                                list.getStore().remove(record);
                            }
                            if (event.getTarget('.x-button-normal')) {
                                OA.common.Funcs.show('FormChooseAtt', null, record);  
                            }
                        }
                    }
                }
            },
            {
                xtype: 'fieldset',
                title: '不轉交換',
                layout: 'fit',
                width: '30%',
                items: {
                    id: 'unsendList',
                    xtype: 'list',
                    scrollable: 'vertical',
                    disableSelection: true,
                    itemTpl: new Ext.XTemplate(
                        '<table>',
                        '<tr>',
                        '<td width="5%">',
                        '<tpl if="(isEdit)">',
                        '<span class="flow-delete">&nbsp;</span>',
                        '</td>',
                        '</tpl>',

                        '<td width="5%">',
                        '<tpl if="this.isOnline(TRANSTYPE)"><span class="speed-fastest">電</span></tpl>',
                        '<tpl if="this.isBulletin(TRANSTYPE)"><span class="speed-faster">貼</span></tpl>',
                        '<tpl if="this.isPaper(TRANSTYPE)"><span class="speed-normal">紙</span></tpl>',
                        '<tpl if="this.isMemo(TRANSTYPE)"><span class="speed-normal" style="background: yellow;">內</span></tpl>',
                        '<tpl if="this.isSelf(TRANSTYPE)"><span class="speed-normal" style="background: gold;">自</span></tpl>',
                        '<tpl if="this.isCopy(TRANSTYPE)"><span class="speed-normal" style="background: green;">抄</span></tpl>',
                        '</td>',

                        '<td width="70%">',
                        '<p style="font-size:110%;">',
                        ' {VALUE} ',
                        '</p>',
                        '<p>',
                        ' （{KEY}） ',
                        '</p>',
                        '</td>',

                        //'<td width="15%">',
                        //'<tpl if="(editAtt)">',
                        //'<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">含附件</span>',
                        //'</tpl>',
                        //'</td>',

                        '</tr>',
                        '</table>',
                        {
                            isOnline: function (TRANSTYPE) {
                                return ('9' == TRANSTYPE);
                            },
                            isBulletin: function (TRANSTYPE) {
                                return ('6' == TRANSTYPE);
                            },
                            isPaper: function (TRANSTYPE) {
                                return ('2' == TRANSTYPE);
                            },
                            isMemo: function (TRANSTYPE) {
                                return ('8' == TRANSTYPE);
                            },
                            isSelf: function (TRANSTYPE) {
                                return ('7' == TRANSTYPE);
                            },
                            isCopy: function (TRANSTYPE) {
                                return ('5' == TRANSTYPE);
                            }
                        }),
                    listeners: {
                        itemtap: function (list, index, item, record, event) {
                            var me = Ext.getCmp('formSend');
                            if (event.getTarget('.flow-delete')) {
                                me.updataVM(record, 'onChange');

                                //先增加再刪除不然會拋錯...
                                Ext.getCmp('sendList').getStore().add(record);
                                list.getStore().remove(record);
                            }
                            if (event.getTarget('.x-button-normal')) {
                                var hasatt = Ext.getCmp('hasAttList').getStore();
                                var repeat = false;
                                Ext.Array.each(hasatt.data.all, function (att) {
                                    if (att.data == record.data) repeat = true;
                                });
                                if (!repeat) {
                                    hasatt.add(record);
                                    me.updataVM(record, 'onAtt');
                                }
                            }
                        }
                    }
                }
            },
            {
                
                xtype: 'fieldset',
                title: '含附件',
                layout: 'fit',
                width: '30%',
                items: {
                    id: 'hasAttList',
                    xtype: 'list',
                    scrollable: 'vertical',
                    disableSelection: true,
                    itemTpl: new Ext.XTemplate(
                        '<table>',
                        '<tr>',
                        //'<td width="5%">',
                        //'<tpl if="(editAtt)">',
                        //'<span class="flow-delete">&nbsp;</span>',
                        //'</td>',
                        //'</tpl>',
                        '<td width="5%">',
                        '<tpl if="this.isOnline(TRANSTYPE)"><span class="speed-fastest">電</span></tpl>',
                        '<tpl if="this.isBulletin(TRANSTYPE)"><span class="speed-faster">貼</span></tpl>',
                        '<tpl if="this.isPaper(TRANSTYPE)"><span class="speed-normal">紙</span></tpl>',
                        '<tpl if="this.isMemo(TRANSTYPE)"><span class="speed-normal" style="background: yellow;">內</span></tpl>',
                        '<tpl if="this.isSelf(TRANSTYPE)"><span class="speed-normal" style="background: gold;">自</span></tpl>',
                        '<tpl if="this.isCopy(TRANSTYPE)"><span class="speed-normal" style="background: green;">抄</span></tpl>',
                        '</td>',

                        '<td width="70%">',
                        '<p style="font-size:110%;">',
                        ' {VALUE} ',
                        '</p>',
                        '<p>',
                        ' （{KEY}） ',
                        '</p>',
                        '</td>',

                        '</tr>',
                        '</table>',
                        {
                            isOnline: function (TRANSTYPE) {
                                return ('9' == TRANSTYPE);
                            },
                            isBulletin: function (TRANSTYPE) {
                                return ('6' == TRANSTYPE);
                            },
                            isPaper: function (TRANSTYPE) {
                                return ('2' == TRANSTYPE);
                            },
                            isMemo: function (TRANSTYPE) {
                                return ('8' == TRANSTYPE);
                            },
                            isSelf: function (TRANSTYPE) {
                                return ('7' == TRANSTYPE);
                            },
                            isCopy: function (TRANSTYPE) {
                                return ('5' == TRANSTYPE);
                            }
                        }),
                    listeners: {
                        itemtap: function (list, index, item, record, event) {
                            var form = list.up('formpanel');
                            var me = Ext.getCmp('formSend');
                            if (event.getTarget('.flow-delete')) {
                                me.updataVM(record, 'unAtt');
                                list.getStore().remove(record);
                            }
                        }
                    }
                }
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    { xtype: 'spacer' },
                    {
                        text: '列印',
                        action: 'print',
                        handler: function (button, e, eOpts) {
                            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                            if (ctrWK) ctrWK.onPrintTap(true);
                        }
                    },
                    {
                        id:'sendDataBut',
                        ui: 'confirm',
                        text: '發文資料上傳',
                        action: 'ok',
                        handler: function (button, e, eOpts) {
                            //var edition = OA.common.VIMgr.getCurrentEdition();
                            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                            var qs = OA.common.Global.getQ();
                            if (!ctrWK) return;
                            var doSend = true;

                            //檢核是否有電子收受者
                            var vm = OA.common.Global.getCurrentViewModel();
                            var checkSendCount = false;
                            if (vm && vm.ContactList && vm.ContactList.length > 0) {
                                Ext.Array.each(vm.ContactList, function (list) {
                                    if (list.TRANSTYPE + '' == '9') checkSendCount = true;
                                    return false;
                                });
                            }
                            var SendCount = checkSendCount ? 0 : 1;

                            Ext.Array.each(Ext.getCmp('sendList').getStore().getData().all, function (r) {
                                ++SendCount;
                                if (r.get('TRANSTYPE') == 9) {
                                    if (r.get('CODE') === undefined || r.get('CODE') === '' || r.get('CODENAME') === undefined || r.get('CODENAME') === '') {
                                        Ext.Msg.alert("提示", "電子交換（" + r.get('VALUE') + "）受文者全銜及機關代碼不可為空！");
                                        doSend = false;
                                        return false;
                                    } else if ((r.get('CODE') + '').length < 10) {
                                        Ext.Msg.alert("提示", "電子交換（" + r.get('VALUE') + "）機關代碼小於10碼不可轉交換！");
                                        doSend = false;
                                        return false;
                                    }
                                }
                            });

                            if (!doSend) return;

                            //記錄文稿發文方式
                            var edition = OA.common.VIMgr.getCurrentEdition();
                            var init = OA.common.Global.getInitParas();
                            //console.log(edition);
                            if (edition.簽核文件夾 && edition.簽核文件夾.文稿 && edition.簽核文件夾.文稿.length > 0) {
                                Ext.Array.each(edition.簽核文件夾.文稿, function (doc) {
                                    if (doc.代碼==init.paperNo) {
                                        doc.發文方式 = Ext.getCmp('selectSendType').getRecord().getData().name;
                                        //console.log(doc);
                                    }
                                });
                            }
                            

                            //SendCount = 1; //不提示

                            //if (edition.isTemp && edition.isTemp == 'Y') {//轉交換強制存檔
                            ctrWK.doSave({ action: 'save' }, function () {
                                Ext.Viewport.setMasked(false);
                                if (qs.reOt === 'Y' || qs.reOt === 'F') {
                                    Ext.Msg.prompt("重新發文備註", "請輸備註：", function (bu, txt) {
                                        if (bu === 'cancel') return;
                                        Ext.getCmp('selectReSend').getRecord().getData().value = txt;
                                        var group = [];
                                        Ext.Array.each(Ext.getCmp('sendList').getStore().getData().all, function (r) {
                                            if (r.data.children && r.data.children.length > 0) {
                                                //sam.hsu 20180711 排除機關不可選
                                                var except = [];
                                                if (r.data.except && r.data.except.length > 0) {
                                                    except = r.data.except.split('、');
                                                }
                                                var child = JSON.parse(r.data.children);
                                                Ext.Array.each(child, function (item) {
                                                    if (except.indexOf(item.dep3Name) < 0) {
                                                        item.ATTACH = r.data.ATTACH;
                                                        item.KEY = r.data.KEY
                                                        item.isEdit = true;
                                                        item.isElect = false;
                                                        group.push(item);
                                                    }
                                                });
                                            } else {
                                                group.push({
                                                    dep3Name: r.data.VALUE,
                                                    dep3No: r.data.CODE,
                                                    dep3Zone: r.data.ARCENO,
                                                    dep3Addr: r.data.ADDR,
                                                    peopleSend: r.data.PEOPLESEND,
                                                    transType: r.data.TRANSTYPE,
                                                    ATTACH: r.data.ATTACH,
                                                    KEY: r.data.KEY,
                                                    isEdit: true,
                                                    isElect: false
                                                });
                                            }
                                        });
                                        if (group.length > 0) {
                                            OA.common.Funcs.show('FormReSendSelect', null, group);
                                        } else {
                                            if (SendCount == 0) {
                                                Ext.Msg.confirm("提醒", "「轉交換」受文者中無電子交換機關，請確認？", function (ok) {
                                                    if (ok == 'yes') {
                                                        button.up('formpanel').doSend();
                                                    } else {
                                                        return;
                                                    }
                                                });
                                            } else {
                                                button.up('formpanel').doSend();
                                            }
                                        }
                                    }, this, 400, '');
                                } else {
                                    if (SendCount == 0) {
                                        Ext.Msg.confirm("提醒", "「轉交換」受文者中無電子交換機關，請確認？", function (ok) {
                                            if (ok == 'yes') {
                                                button.up('formpanel').doSend();
                                            } else {
                                                return;
                                            }
                                        });
                                    } else {
                                        button.up('formpanel').doSend();
                                    }
                                }
                            });
                        }
                    },
                   
                ]
            }
        ]
    },
    initialize: function () {
        var items = [];
        items.push({value: 'Multiple', name: '一文多發'});
        items.push({value: 'Divide', name: '分址分文'});
        Ext.getCmp('selectSendType').setOptions(items);

        items = [];
        items.push({ value: '', name: '文書本文修正重發', type: '1' });
        items.push({ value: '', name: '文書本文修正重發', type: '2' });
        items.push({ value: '', name: '附件修正重發', type: '3' });
        items.push({ value: '', name: '本文附件修正重發', type: '4' });
        items.push({ value: '', name: '錯發', type: '5' });
        items.push({ value: '', name: '測試', type: '6' });
        Ext.getCmp('selectReSend').setOptions(items);

        var h = (Ext.Viewport.getWindowHeight() * 0.75);
        var ctrFields = this.query('fieldset');
        Ext.Array.each(ctrFields, function (ctr) {
            ctr.setHeight(h);
        });

        var sendContact = Ext.getStore('sendContact');
        if (!sendContact) {
            sendContact = Ext.create("Ext.data.Store", {
                id: 'sendContact',
                model: 'OA.model.Contact',
                autoSync: true,
                autoLoad: true
            });
        }
        Ext.getCmp('sendList').setStore(sendContact);

        var unsendContact = Ext.getStore('unsendContact');
        if (!unsendContact) {
            unsendContact = Ext.create("Ext.data.Store", {
                id: 'unsendContact',
                model: 'OA.model.Contact',
                autoSync: true,
                autoLoad: true
            });
        }
        Ext.getCmp('unsendList').setStore(unsendContact);

        var hasAttContact = Ext.getStore('hasAttContact');
        if (!hasAttContact) {
            hasAttContact = Ext.create("Ext.data.Store", {
                id: 'hasAttContact',
                model: 'OA.model.Contact',
                autoSync: true,
                autoLoad: true
            });
        }
        Ext.getCmp('hasAttList').setStore(hasAttContact);
    },
    create: function (list) {
        var me = this;
        var edition = OA.common.VIMgr.getCurrentEdition();
        var init = OA.common.Global.getInitParas();


        var sendTypeValue = '';
        if (edition && edition.簽核文件夾 && edition.簽核文件夾.文稿 && edition.簽核文件夾.文稿.length > 0) {
            Ext.Array.each(edition.簽核文件夾.文稿, function (doc) {
                if (doc.代碼 == init.paperNo) {
                    if (doc.發文方式 && doc.發文方式 != 'undefined' && doc.發文方式 != undefined) {
                        sendTypeValue = doc.發文方式
                    }
                }
            });
        }

        if (sendTypeValue != '') {
            var sendType = Ext.getCmp('selectSendType');
            if (sendType) {
                if (sendTypeValue == '分址分文') {
                    sendType.setValue('Divide');
                } else {
                    sendType.setValue('Multiple');
                }
            }
        }

        var sendContact = Ext.getStore('sendContact');
        sendContact.setData(null);
        var unsendContact = Ext.getStore('unsendContact');
        unsendContact.setData(null);
        var hasAttContact = Ext.getStore('hasAttContact');
        hasAttContact.setData(null);
        if (!list) return;

        var qs = OA.common.Global.getQ();

        //reOT:F不寫檔只上傳資料
        if (qs.reOt === 'Y' || qs.reOt === 'F')
            Ext.getCmp('selectReSend').setHidden(false);

        //有一般附件跟大型附件才開啟含附件欄位       
        var hasSendAtt = false;
        var editAtt = false;
        var attachItem = OA.common.InitParas.getAttachItem();
        if (attachItem && attachItem.vi) {
            var attachsAdd = attachItem.vi.where("( el, i, res, param ) =>el.folderName =='attach'&&el.status!='0'");
            if (attachsAdd && attachsAdd.length > 0) {
                hasSendAtt = true;
                if (attachsAdd.length > 1 && sendTypeValue=='分址分文') {
                    editAtt = true;
                }
            }

            //再補判斷有沒有大型附件
            if (!hasSendAtt) {
                if (attachItem.vi.where("( el, i, res, param ) =>el.folderName =='big'").length > 0) {
                    Ext.Array.each(attachItem.vi.where("( el, i, res, param ) =>el.folderName =='big'"), function (bigatt) {
                        if (bigatt.status == 1) {
                            hasSendAtt = true;
                        }
                    });
                }
            }
        }

        var cansend = [];
        var cannotsend = [];
        var hasatt = [];
        var num = 0;
        Ext.Array.each(list, function (item) {

            if (qs.reOt === 'Y' || qs.reOt === 'F') {   //重新發文濾掉內部傳遞
                if ((item.TRANSTYPE + '') == '8') return true;
            }
            if ((item.TRANSTYPE + '') !== '9' && (item.TRANSTYPE + '') !== '8') {
                item.isEdit = false;
            } else {
                item.isEdit = true;
            }

             //要發文且附件大於一才顯示選擇附件按鈕
            if (editAtt && item.ATTACH == 'Y') {
                item.editAtt = true;
            } else {
                item.editAtt = false;
            }          
           


            if (item.isChange == 'Y' || item.TRANSTYPE == '9') {
                if (item.children != null && item.children.length > 0) {
                    //console.log(item.children);
                    Ext.Array.each(item.children, function (child) {
                        num++;
                        if (child.TRANSTYPE == '9') {

                            cansend.push({
                                number: num,
                                ADDR: child.ADDR,
                                ARCENO: child.ARCENO,
                                ATTACH: item.ATTACH,
                                CODE: child.CODE,
                                CODENAME: child.CODENAME,
                                GROUP: "",
                                GROUPLIST: "",
                                KEY: item.KEY,
                                PEOPLESEND: item.PEOPLESEND,
                                REALTRANSTYPE: item.REALTRANSTYPE,
                                TRANSTYPE: child.TRANSTYPE,
                                TRANSTYPENAME: child.TRANSTYPENAME,
                                TYPE: item.TYPE,
                                VALUE: child.CODENAME,
                                allowDrag: item.allowDrag,
                                allowDrop: item.allowDrop,
                                checked: item.checked,
                                cls: item.cls,
                                depth: item.depth,
                                editAtt: item.editAtt,
                                expandable: item.expandable,
                                expanded: item.expanded,
                                isEdit: true,
                                tagName: "Contact",
                            });
                        } else {
                            cannotsend.push({
                                number: num,
                                ADDR: child.ADDR,
                                ARCENO: child.ARCENO,
                                ATTACH: item.ATTACH,
                                CODE: child.CODE,
                                CODENAME: child.CODENAME,
                                GROUP: "",
                                GROUPLIST: "",
                                KEY: item.KEY,
                                PEOPLESEND: item.PEOPLESEND,
                                REALTRANSTYPE: item.REALTRANSTYPE,
                                TRANSTYPE: child.TRANSTYPE,
                                TRANSTYPENAME: child.TRANSTYPENAME,
                                TYPE: item.TYPE,
                                VALUE: child.CODENAME,
                                allowDrag: item.allowDrag,
                                allowDrop: item.allowDrop,
                                checked: item.checked,
                                cls: item.cls,
                                depth: item.depth,
                                editAtt: item.editAtt,
                                expandable: item.expandable,
                                expanded: item.expanded,
                                isEdit: false,
                                tagName: "Contact",
                            });
                        }
                    })

                } else {
                    num++;
                    item.number = num;
                    cansend.push(item);
                }
            } else {
                item.editAtt = false;
                cannotsend.push(item);
            }
            if (item.ATTACH == 'Y' && hasSendAtt) hasatt.push(item);
        });
        //console.log(cansend);
        sendContact.setData(cansend);
        unsendContact.setData(cannotsend);
        hasAttContact.setData(hasatt);
        //console.log(sendTypeValue);

        var selectSendType = Ext.getCmp('selectSendType');
        if (selectSendType) {
            var value = selectSendType.getValue();
            if (value == 'Divide') {
                me.choose('分址分文');
            } else {
                me.choose('一文多發');
            }
        }
       
        OA.common.Utils.indicatorWith('sendList');
        OA.common.Utils.indicatorWith('unsendList');
        OA.common.Utils.indicatorWith('hasAttList');
    },
    updataVM: function (record, key) {
        var vm = OA.common.Global.getCurrentViewModel();
        var wkContent = OA.common.Global.getCurrentWKContent();
        var paper = OA.common.Paper.main();
        //vm
        var substr;
        var relstr;
        var item = vm.ContactList.where("( el, i, res, param ) =>el.CODE=='" + record.data.CODE + "'");
        if (item) {
            switch (key) {
                case 'unChange':
                    item[0].isChange = 'N';
                    break;
                case 'onChange':
                    item[0].isChange = 'Y';
                    break;
                case 'unAtt':
                    item[0].ATTACH = 'N';
                    substr = record.data.CODENAME + '(含附件)';
                    relstr = record.data.CODENAME;
                    item[0].Value = relstr;
                    break;
                case 'onAtt':
                    item[0].ATTACH = 'Y';
                    substr = record.data.CODENAME;
                    relstr = record.data.CODENAME + '(含附件)';
                    item[0].Value = relstr;
                    break;
            }
            if (record.data.KEY == '副本' && (key == 'unAtt' || key == 'onAtt')) {
                //wk
                var tagContactList = OA.common.Utils.getContactListTag(wkContent);
                if (tagContactList) {
                    Ext.Array.each(tagContactList.childNodes, function (child) {
                        if (child.CODE == record.data.CODE) {
                            child.VALUE = relstr;
                        }
                    })
                }
                //view
                var tagText = OA.common.Utils.getTagText(wkContent, '副本');
                Ext.Array.each(tagText.childNodes, function (tag) {
                    if (tag.Value == substr)
                        tag.Value = relstr;
                });
                var svgElem = paper.getSvgPaper().getElem('副本');
                svgElem.textContent = svgElem.textContent.replace(substr, relstr);
                paper.svgUpdateLayout();
            }
        }
    },
    choose: function (sendtype) {
        //有一般附件才開啟含附件欄位       
        var editAtt = false;
        var attachItem = OA.common.InitParas.getAttachItem();
        if (attachItem && attachItem.vi) {
            var attachsAdd = attachItem.vi.where("( el, i, res, param ) =>el.folderName =='attach'&&el.status!='0'");
            if (attachsAdd && attachsAdd.length > 0) {
                editAtt = true;
            }
        }
        if (editAtt) {
            var sendContact = Ext.getStore('sendContact');
            if (sendContact) {
                Ext.Array.each(sendContact.data.all, function (data) {
                    if (sendtype == '分址分文' && data.get('ATTACH')=='Y') {
                        data.set('editAtt', true);
                    } else {
                        data.set('editAtt', false);
                    }
                })
            }
        }

        var chkShowAll = Ext.getCmp('chkShowAll');
        if (sendtype == '分址分文') {
            if (chkShowAll) {
                chkShowAll.setHidden(false);
                //chkDupShowAll.setValue(true);
            }
        } else {
            if (chkShowAll) {
                chkShowAll.setHidden(true);
                //chkDupShowAll.setValue(false);
            }
        }

    },
    doSend: function () {
        var me = this;
        var sdb = Ext.getCmp('sendDataBut');
        if (sdb) {
            sdb.setDisabled(true)
        }
        var qs = OA.common.Global.getQ();
        //紙本公文、重新發文，不簽章，不寫SignFlag
        var SignFlag = false;
        if (OA.common.Utils.checkEpaper() && !qs.reOt) SignFlag = true;

        var paras = OA.common.InitParas.doExchange(SignFlag);  //轉交換
          
        paras.methodId = 'exchange';
        paras.form = me;
        var Role = OA.common.Global.getCurrentRole();
        var checkBig = false;
        //Role.roleId = '02';
        if (Role && Role.roleId == '02') {
            var attachItem = OA.common.InitParas.getAttachItem();
            if (attachItem && attachItem.vi) {
                if (attachItem.vi.where("( el, i, res, param ) =>el.folderName =='big'").length > 0) {
                    Ext.Array.each(attachItem.vi.where("( el, i, res, param ) =>el.folderName =='big'"), function (bigatt) {
                        if (bigatt.status == 1) {
                            checkBig = true;
                            return false;
                        }
                    });
                }                
            }            
        }

        OA.client.Exchange.excute(paras, function (r) {
            var newSendNo = r.get('發文字號_字');
            var vm = OA.common.Global.getCurrentViewModel();
            var edition = OA.common.VIMgr.getCurrentEdition();
            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
            edition.交換狀態 = '1';
            ctrWK.set('sendDataChange', false);
            if (newSendNo) {
                vm.發文字號_字_1 = newSendNo;
                //Ext.getCmp('cpaper').sendNoUpdate();
                Ext.getCmp('cpaper').setStatus('edit');

                var wk = OA.common.Global.getCurrentWKContent();
                var tagText = OA.common.Utils.getTagText(wk, '發文字號');
                tagText.childNodes[0].Value = newSendNo;
            }

            me.hide();
            if (Role && Role.roleId == '02') {
                //console.log('this');
                if (vm && vm.kind !== '來文' && vm.ContactList && vm.ContactList.length > 0) {
                    var docTotal = vm.ContactList.where("( el, i, res, param ) => el.TRANSTYPE=='1'||el.TRANSTYPE=='2'");
                    if (docTotal && docTotal.length > 0) {
                        //不提示自動帶入列印
                        qs.sendtype = Ext.getCmp('selectSendType').getRecord().getData();   ////0904  轉交換上傳後，判斷分址分文狀態按鈕  Chloe.sia
                        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                        if (ctrWK) ctrWK.onPrintTap(true);

                        /*
                        Ext.Msg.confirm("提醒", "發文資料上傳完成！將自動帶入發文列印？", function (ok) {
                            if (ok == 'yes') {
                                qs.sendtype = Ext.getCmp('selectSendType').getRecord().getData();   ////0904  轉交換上傳後，判斷分址分文狀態按鈕  Chloe.sia
                                var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                                if (ctrWK) ctrWK.onPrintTap();
                            } else {
                                return;
                            }
                        });
                        */
                    } else {
                        //檢核是否含大型附件，增加提示給總發
                        if (checkBig) {
                            Ext.Msg.alert('提示', '發文資料上傳完成。請下載大型附件，並上傳至金融交換附件下載區」!');
                        } else {
                            Ext.Msg.alert('提示', '發文資料上傳完成！');
                        }
                    }
                } else {
                    //檢核是否含大型附件，增加提示給總發
                    if (checkBig) {
                        Ext.Msg.alert('提示', '發文資料上傳完成。請下載大型附件，並上傳至金融交換附件下載區」!');
                    } else {
                        Ext.Msg.alert('提示', '發文資料上傳完成！');
                    }
                }
            }
            if (sdb) {
                sdb.setDisabled(false)
            }
        });
    }
});