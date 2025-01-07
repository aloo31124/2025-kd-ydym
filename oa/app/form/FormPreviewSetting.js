Ext.define('OA.form.FormPreviewSetting', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormPreviewSetting',
    xtype: 'FormPreviewSetting',
    id: 'formPreviewSetting',
    requires: ['OA.model.Contact'],
    config: {
        width: '90%',
        height: '95%',
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        layout: {
            type: 'hbox'
        },
        scrollable: false,
        pageNum: '',
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    {
                        id: 'selectPreviewType',
                        xtype: 'selectfield',
                        name: 'q_type',
                        valueField: 'value',
                        displayField: 'name',
                        listeners: {
                            change: function (ctr, newValue, oldValue, eOpts) {
                                ctr.up('formpanel').loadContact();
                            }
                        }
                    },
                    {
                        ui: 'plain', text: '全部列印', iconCls: '', action: 'AllPrint',
                        handler: function (button) {
                            var items = [];
                            var storeContact = Ext.getStore('previewContact');
                            storeContact.each(function (r) {
                                items.push(r);
                            });
                            var storePapers = Ext.getStore('previewPapers');
                            storePapers.setData(items);
                        }
                    },
                    {
                        ui: 'plain', text: '全部取消列印', iconCls: '', action: 'UnAllPrint',
                        handler: function (button) {
                            var storePapers = Ext.getStore('previewPapers');
                            storePapers.setData([]);
                        }
                    },
                    {   // 進階設定 增加輸入筆數範圍按鈕 - by joshua kang => 
                        ui: 'plain', text: '批次列印', iconCls: '', action: 'advanceContact',
                        handler: function (button) {
                            //計算總共有多少紙本受文者，並提供輸入列印範圍
                            var me = button.up('formpanel');
                            var ctr = Ext.getCmp('ctnPreview');
                            var initParas = ctr.getInitParas();
                            // 當initParas抓不到值時就從WK抓，解決未取號時批次列印功能無效的問題 - by yi-chi chiu
                            var wkContact = OA.common.Utils.getContactList(OA.common.Global.getCurrentWKContent());
                            var objContactList = (wkContact) ? { childNodes: wkContact } : undefined;
                            var contactList = [];                             

                            var storePapers = Ext.getStore('previewPapers');
                            if (storePapers && storePapers.data.all && storePapers.data.all.length>0) {
                                storePapers.each(function (r) {
                                    contactList.push(r.getData())
                                    //Ext.apply(contactList, r.getData());
                                })
                            } else {
                                contactList = objContactList.childNodes || initParas.contactList;
                            }

                            if (contactList&&contactList.length > 0) {
                                var docItems = [];

                                //依文本內容排序
                                var keySort = ['正本', '副本', '抄本', '主持人', '出席者', '列席者', '會議主席', '出列席機關人員'];
                                Ext.Array.each(keySort, function (key) {
                                    Ext.Array.each(contactList, function (contact) {
                                        if (contact.KEY == key) {
                                            if (contact.TRANSTYPE == '1' || contact.TRANSTYPE == '2') {
                                                if (contact.children) {
                                                    var children = JSON.parse(contact.children);
                                                    var except = contact.except.split('、');
                                                    Ext.Array.each(children, function (child) {
                                                        if (except.indexOf(child.dep3Name) < 0) {
                                                            var item = {
                                                                ADDR: child.dep3Addr,
                                                                ARCENO: child.dep3Zone,
                                                                ATTACH: "",
                                                                CODE: child.dep3No,
                                                                CODENAME: child.dep3Name,
                                                                GROUP: "",
                                                                GROUPLIST: "",
                                                                KEY: contact.KEY,
                                                                PEOPLESEND: contact.PEOPLESEND,
                                                                REALTRANSTYPE: contact.REALTRANSTYPE,
                                                                TRANSTYPE: contact.TRANSTYPE,
                                                                TRANSTYPENAME: contact.TRANSTYPENAME,
                                                                TYPE: contact.TYPE,
                                                                VALUE: child.dep3Name
                                                            };
                                                            docItems.push(item);
                                                        }
                                                    });
                                                } else {
                                                    docItems.push(contact);
                                                }
                                            }
                                        }
                                    });
                                });

                                if (docItems.length > 0) {//依文稿頁數及受文者數量自動切成多個頁籤按鈕，每個頁籤50頁以下
                                    var pageNum = parseInt(me.getPageNum());
                                    var quotient = Math.floor(45 / pageNum);
                                    //依quotient分組受文者
                                    var grouping = [];
                                    var items = [];
                                    for (var i = 0; i < docItems.length; i++) {
                                        items.push(docItems[i]);
                                        if (items.length == quotient) {
                                            var start = 1;
                                            if (grouping.length > 0) {
                                                start = Ext.clone(grouping.length * quotient) + 1;
                                            }
                                            scope = start + '～' + (i + 1);
                                            grouping.push({
                                                scope: scope,
                                                data: Ext.clone(items)
                                            })
                                            items = [];
                                        }
                                        if (i == docItems.length - 1) {
                                            start = Ext.clone(grouping.length * quotient) + 1;
                                            scope = start + '～' + (i + 1);
                                            grouping.push({
                                                scope: scope,
                                                data: Ext.clone(items)
                                            })
                                        }
                                    }
                                    button.up('formpanel').hide();
                                    console.log(grouping);
                                    ctr.doGroupPrevie(grouping)
                                    /*
                                    Ext.Msg.prompt("批次列印", "請輸入列印範圍(開始位置) 1~" + docItems.length + "：", function (bu, txt) {
                                        var startIndex = '';
                                        var endIndex = '';
                                        if (txt != '' && !isNaN(parseInt(txt))) {
                                            startIndex = parseInt(txt);
                                            if (startIndex > docItems.length || startIndex < 1) {
                                                Ext.Msg.alert("超出列印範圍！");
                                            } else {
                                                Ext.Msg.prompt("批次列印", "請輸入列印範圍(結束位置) " + startIndex + "~" + docItems.length + "：", function (bu1, txt1) {
                                                    if (txt1 != '' && !isNaN(parseInt(txt1))) {
                                                        endIndex = parseInt(txt1);
                                                        if (endIndex > docItems.length || endIndex < startIndex) {
                                                            Ext.Msg.alert("超出列印範圍！");
                                                        } else {
                                                            var printItem = docItems.slice(startIndex - 1, endIndex);
                                                            if (printItem && printItem.length > 0) {
                                                                var storePapers = Ext.getStore('previewPapers');
                                                                if (!storePapers) {
                                                                    storePapers = Ext.create("Ext.data.Store", {
                                                                        id: 'previewPapers',
                                                                        model: 'OA.model.Contact',
                                                                        autoSync: true,
                                                                        autoLoad: true,
                                                                        data: printItem
                                                                    });
                                                                } else {
                                                                    storePapers.setData(printItem);
                                                                }
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    */
                                } else {
                                    Ext.Msg.alert("沒有任何紙本受文者！");
                                }

                            }
                        }
                    }, 
                    {
                        text: '<input type="checkbox" id="chkPreviewNE" style="zoom: 2;" checked="true"><label for="chkPreviewNE"> 署名顯示</label></input>',
                        style: "border: 0px;background-image: none;background-color: #1468a2;",
                        type: 'checkbox',
                        name: 'names',
                        forId: 'chkPreviewNE',
                        value: true,
                        handler: function (button) {
                            var ctr = document.querySelector('#' + button.config.forId);
                            button.config.value = !ctr.checked;
                        }
                    },
                    /*
                    {
                        text: '<input type="checkbox" id="chkAddcopy" style="zoom: 2;"><label for="chkAddcopy"> 抄本</label></input>',
                        style: "border: 0px;background-image: none;background-color: #1468a2;",
                        type: 'checkbox',
                        name: 'addCopy',
                        forId: 'chkAddcopy',
                        value: false,
                        handler: function (button) {
                            var ctr = document.querySelector('#' + button.config.forId);
                            button.config.value = !ctr.checked;
                        }
                    },
                    */
                    {
                        text: '<input type="checkbox" id="chkHiddenAddr" style="zoom: 2;"><label for="chkHiddenAddr"> 地址隱藏</label></input>',
                        style: "border: 0px;background-image: none;background-color: #1468a2;",
                        type: 'checkbox',
                        name: 'address',
                        forId: 'chkHiddenAddr',
                        value: false,
                        handler: function (button) {
                            var ctr = document.querySelector('#' + button.config.forId);
                            button.config.value = !ctr.checked;
                        }
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
                        }

                    }
                    // ,{
                    //     id: 'chkPreviewNE',
                    //     xtype: 'togglefield',
                    //     name: 'names',
                    //     value: 1,
                    //     label: '署名顯示'
                    // },
                    // {
                    //     id: 'chkPreviewLV',
                    //     xtype: 'togglefield',
                    //     name: 'level',
                    //     label: '分層負責顯示',
                    //     labelWidth: '50%'
                    // },
                    // {
                    //     id: 'chkHiddenAddr',
                    //     xtype: 'togglefield',
                    //     name: 'address',
                    //     label: '地址隱藏'
                    // }
                   
                ]
            },
            {
                xtype: 'fieldset',
                title: '受文單位',
                layout: 'fit',
                width: '45%',
                items: {
                    id: 'listContact',
                    xtype: 'list',
                    scrollable: 'vertical',
                    disableSelection: true,
                    itemTpl: new Ext.XTemplate(
                        '<table>',
                        '<tr>',

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
                        '</td>',
                        '<td width="15%">',
                        '<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">新增</span>',
                        '</td>',

                        '<td width="15%">',
                        '<tpl if="(isEdit)">',
                        '<span class="x-button-unhide x-button" style="float:right;bottom:5px;font-size:90%;">顯示</span>',
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
                            }
                        }),
                    listeners: {
                        itemtap: function (list, index, item, record, event) {
                            var form = list.up('formpanel');
                            if (event.getTarget('.x-button-normal')) {
                                var isExist = false;
                                Ext.getCmp('listPapers').getStore().each(function (p, index, length) {
                                    if (p.get('VALUE') == record.get('VALUE')) isExist = true;
                                });
                                if (!isExist) {
                                    if (record.data.KEY === '正本')
                                        Ext.getCmp('listPapers').getStore().insert(0, record);
                                    else
                                        Ext.getCmp('listPapers').getStore().add(record);
                                }
                                OA.common.Utils.indicatorWith('listPapers');
                            }
                            else if (event.getTarget('.x-button-unhide')) {
                                var key = record.get('KEY');
                                switch (key) {
                                    case '正本':
                                        record.set('TYPE', '1');
                                        break;
                                    case '副本':
                                        record.set('TYPE', '2');
                                        break;
                                    case '主持人':
                                        record.set('TYPE', '3');
                                        break;
                                    case '出席者':
                                        record.set('TYPE', '4');
                                        break;
                                    case '列席者':
                                        record.set('TYPE', '5');
                                        break;
                                    case '抄本':
                                        record.set('TYPE', '6');
                                        break;
                                }
                                Ext.getCmp('listUnHides').getStore().add(record);
                                OA.common.Utils.indicatorWith('listUnHides');
                            }
                        }
                    }
                }
            },
            {
                id: 'fdsPrintUnit',
                xtype: 'fieldset',
                title: '列印單位',
                layout: 'fit',
                width: '25%',
                items: {
                    id: 'listPapers',
                    xtype: 'list',
                    scrollable: 'vertical',
                    disableSelection: true,
                    itemTpl: new Ext.XTemplate(
                        '<table>',
                        '<tr>',

                        '<td width="5%"><span class="flow-delete">&nbsp;</span></td>',

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
                            if (event.getTarget('.flow-delete')) {
                                list.getStore().remove(record);
                            }
                        }
                    }
                }
            },
            {
                id: 'fdsDivide',
                xtype: 'fieldset',
                title: '分址分文顯示單位',
                layout: 'fit',
                width: '25%',
                instructions: '這些單位在文稿面將不會被隱藏',
                items: {
                    id: 'listUnHides',
                    xtype: 'list',
                    scrollable: 'vertical',
                    disableSelection: true,
                    //store:'previewUnHides',
                    itemTpl: new Ext.XTemplate(
                        '<table>',
                        '<tr>',

                        '<td width="5%"><span class="flow-delete">&nbsp;</span></td>',

                        '<td width="5%">',
                        '<tpl if="this.isOnline(TRANSTYPE)"><span class="speed-fastest">電</span></tpl>',
                        '<tpl if="this.isBulletin(TRANSTYPE)"><span class="speed-faster">貼</span></tpl>',
                        '<tpl if="this.isPaper(TRANSTYPE)"><span class="speed-normal">紙</span></tpl>',
                        '<tpl if="this.isMemo(TRANSTYPE)"><span class="speed-normal" style="background: yellow;">內</span></tpl>',
                        '<tpl if="this.isSelf(TRANSTYPE)"><span class="speed-normal" style="background: gold;">自</span></tpl>',
                        '<tpl if="this.isCopy(TRANSTYPE)"><span class="speed-normal" style="background: green;">抄</span></tpl>',
                        '</td>',

                        '<td width="90%">',
                        '<p style="font-size:110%;">',
                        ' {VALUE} ',
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
                            if (event.getTarget('.flow-delete')) {
                                if (record.data.TYPE !== '3') {
                                    list.getStore().remove(record);
                                }
                            }
                        }
                    }
                },
                hidden: true
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [                   
                    { xtype: 'spacer' },
                    // {
                    //     text: '列印下載',
                    //     action: 'printDownload',
                    //     id:'printDownload',
                    //     hidden:true,
                    //     handler: function (button, e, eOpts) {
                    //         var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                    //         var data = Ext.getCmp('ctnPreview').getCommonData();
                    //         data.previewMode = Ext.getCmp('selectPreviewType').getRecord().getData().value;
                    //         data.cc = Ext.getCmp('ctnPreview').getAdvancedSettings( data.previewMode);
                    //         if (ctrWK) ctrWK.onPrintDownloadTap(button,{type: 'pdf', printData: data});
                    //     }
                    // },
                    {
                        ui: 'plain', text: '全部顯示', iconCls: '', id: 'AllHide', hidden: true,
                        handler: function (button) {
                            var items = [];

                            var storeContact = Ext.getCmp('listContact').getStore();
                            storeContact.each(function (r) {
                                items.push(r);
                            });
                            var storePapers = Ext.getCmp('listUnHides').getStore();
                            storePapers.setData(items);

                            OA.common.Utils.indicatorWith('listContact');
                            OA.common.Utils.indicatorWith('listUnHides');
                        }
                    },
                    {
                        ui: 'plain', text: '全部不顯示', iconCls: '', id: 'UnAllHide', hidden: true,
                        handler: function (button) {
                            var storePapers = Ext.getCmp('listUnHides').getStore();
                            storePapers.setData([]);
                            OA.common.Utils.indicatorWith('listUnHides');
                        }
                    },
                    {
                        ui: 'confirm',
                        text: '確定',
                        action: 'ok',
                        handler: function (button, e, eOpts) {
                            //檢查是否有受文者 沒有受文者列印預覽中進階設定不給修改 
                            var storePapers = Ext.getStore('previewPapers');
                            if (storePapers == undefined || storePapers.data.length === 0) {
                                //沒有受文者
                                //增加檢核有沒有勾選抄本
                                var addCopy = document.querySelector('#chkAddcopy');
                                if (addCopy) {
                                    if (addCopy.checked == true) {
                                        var data = Ext.getCmp('selectPreviewType').getRecord().getData();
                                        Ext.getCmp('ctnPreview').doNewTab({ text: data.name, mode: data.value });
                                        button.up('formpanel').hide();
                                        // ctnPreview.onCreateCopiesCompleted to finish
                                        Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });

                                    } else {
                                        Ext.Msg.alert('提示', '沒有受文者 請選擇！');
                                        return;
                                    }
                                } else {

                                }
                            } else {
                                //有受文者
                                var data = Ext.getCmp('selectPreviewType').getRecord().getData();
                                Ext.getCmp('ctnPreview').doNewTab({ text: data.name, mode: data.value });
                                button.up('formpanel').hide();
                                // ctnPreview.onCreateCopiesCompleted to finish
                                Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });
                            }
                        }
                    }
                ]
            }
        ]
    },
    initialize: function () {
        var modes = Ext.getCmp('ctnPreview').Enum.properties;
        var items = [];
        items.push(modes['Multiple']);
        items.push(modes['Divide']);
        items.push(modes['General']);
        Ext.getCmp('selectPreviewType').setOptions(items);

        var h = (Ext.Viewport.getWindowHeight() * 0.75);
        var ctrFields = this.query('fieldset');
        Ext.Array.each(ctrFields, function (ctr) {
            ctr.setHeight(h);
        });
    },
    create: function (options) {
        // console.log(options);
        var me = this;
        if (options.isDownload && Ext.getCmp('printDownload'))
            Ext.getCmp('printDownload').setHidden(false);

        var qType = this.getValues().q_type;
        var wkContent = OA.common.Global.getCurrentWKContent();
        var tagContactList = OA.common.Utils.getContactListTag(wkContent);

        if (!tagContactList) return;
        if (options.pageNum) me.setPageNum(options.pageNum);
        console.log(options.pageNum);
        var storeContact = Ext.getStore('previewContact');
        if (storeContact) storeContact = null;

        var tags = tagContactList.childNodes.filter(function (item) {
            return ['正本', '副本', '抄本', '主持人', '出席者', '列席者', '會議主持人' , '出列席機關人員' ].indexOf(item.KEY) >= 0;
        });

        var storeContact = Ext.getStore('previewContact');
        if (storeContact) storeContact = null;
        //if (!storeContact) {
        var items = [];
        Ext.Array.each(tags, function (tag) {
            var jsonItems = tag.children;
            if (jsonItems && jsonItems.length > 0) {
                try {
                    var children;
                    if (Ext.isArray(jsonItems)) {
                        children = jsonItems;
                    } else {
                        children = JSON.parse(jsonItems);
                    }
                    var except = [];
                    if (tag.except) {
                        except = tag.except.split('、');
                    }
                    Ext.Array.each(children, function (child) {
                        var isPush = true;
                        if (except.length > 0) {
                            if (except.indexOf(child.dep3Name) != -1) {
                                isPush = false;
                            }
                        }
                        if (isPush) {
                            var item = {
                                ADDR: child.dep3Addr,
                                ARCENO: child.dep3Zone,
                                ATTACH: "",
                                CODE: child.dep3No,
                                CODENAME: child.dep3Name,
                                GROUP: "",
                                GROUPLIST: "",
                                KEY: tag.KEY,
                                PEOPLESEND: tag.PEOPLESEND,
                                REALTRANSTYPE: tag.REALTRANSTYPE,
                                TRANSTYPE: tag.TRANSTYPE,
                                TRANSTYPENAME: tag.TRANSTYPENAME,
                                TYPE: tag.TYPE,
                                VALUE: child.dep3Name,
                                editAtt: false,
                                isChange: "N",
                                isEdit: (qType === 'Divide'),
                                tagName: "Contact"
                            };
                            items.push(item);
                        }
                    });
                } catch (e) {
                    console.log(e);
                    console.log(jsonItems);
                }
            } else {
                tag.isEdit = (qType === 'Divide');
                items.push(tag);
            }
        });
        storeContact = Ext.create("Ext.data.Store", {
            id: 'previewContact',
            model: 'OA.model.Contact',
            autoSync: true,
            autoLoad: true,
            data: items
        });
        Ext.getCmp('listContact').setStore(storeContact);
        OA.common.Utils.indicatorWith('listContact');
        //}

        var storePapers = Ext.getStore('previewPapers');
        if (storePapers) storePapers = null;
        //if (!storePapers) {
        var dataPapers = Ext.Array.filter(items, function (p) {
            if (p.TRANSTYPE == '1' || p.TRANSTYPE == '2') {
                if (p.KEY !== '抄本')
                    return true;
            }
        });
        // console.log(dataPapers);
        storePapers = Ext.create("Ext.data.Store", {
            id: 'previewPapers',
            model: 'OA.model.Contact',
            autoSync: true,
            autoLoad: true,
            data: dataPapers
        });
        Ext.getCmp('listPapers').setStore(storePapers);
        OA.common.Utils.indicatorWith('listPapers');
        //}
        var storeUnHides = Ext.getStore('previewUnHides');
        if (storeUnHides) storeUnHides = null;
        //if (!storeUnHides) {
        storeUnHides = Ext.create("Ext.data.Store", {
            id: 'previewUnHides',
            model: 'OA.model.Contact',
            autoLoad: true,
            autoSync: true
        });
        Ext.getCmp('listUnHides').setStore(storeUnHides);
        OA.common.Utils.indicatorWith('listUnHides')
        //}
        this.loadContact();
    },
    loadContact: function () {
        var qType = this.getValues().q_type;
        if (qType == 'Divide') {
            Ext.getCmp('fdsDivide').setHidden(false);
            Ext.getCmp('AllHide').setHidden(false);
            Ext.getCmp('UnAllHide').setHidden(false);
            Ext.getCmp('fdsPrintUnit').setWidth('25%');
        } else {
            Ext.getCmp('fdsDivide').setHidden(true);
            Ext.getCmp('fdsPrintUnit').setWidth('45%');

            if (Ext.getStore('previewUnHides')) {
                Ext.getStore('previewUnHides').removeAll();
            }
        }

        //評議中心分址分文副本一律都要顯示
        var dup = [];

        var storeContact = Ext.getStore('previewContact');
        if (storeContact) {
            storeContact.each(function (r) {
                if (qType === 'Divide') {
                    r.set('isEdit', true);
                    //主持人預設顯示，不可隱藏
                    /*
                    if (r.data.KEY === '主持人') {
                        dup.push(r.data);
                        //console.log(r.data);
                        //Ext.getCmp('listUnHides').setData(r.data);
                    }
                    */

                    if (r.data.KEY === '主持人' || r.data.KEY == '副本') {
                        dup.push(r.data);
                    }

                } else
                    r.set('isEdit', false);
            });
        }

        if (qType === 'Divide' && dup.length > 0) {
            Ext.getCmp('listUnHides').setData(dup);
        }

    },
    setAlreadyAdd: function (records) {
        Ext.Array.each(OA.common.Utils.getWorkFlowData(), function (n) {
            var r = records.where("( el, i, res, param ) => el.data.jobNo=='" + n.jobNo + "'");
            if (r.length > 0) {
                r[0].set('isAdd', true);
            }
        });
    },
    isAddButton: function (e) {
        var _isButton = false;
        if (!e)
            return _isButton;
        if (e.target.className === 'x-button-normal x-button')
            _isButton = true;
        if (e.target.className === 'x-button-unhide x-button')
            _isButton = true;
        return _isButton;
    }
});