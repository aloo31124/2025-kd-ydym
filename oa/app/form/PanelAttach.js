/**
 * 附件管理
 */

Ext.define('OA.form.PanelAttach', {
    extend: 'Ext.Panel',
    xtype: "PanelAttach",
    alias: 'widget.PanelAttach',
    id: 'PanelAttach',
    requires: ['Ext.SegmentedButton', 'Ext.Toolbar', 'OA.client.Attach', 'OA.client.WK'],
    config: {
        ui: 'dark',
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        width: '70%',
        height: '50%',
        style: 'font-size:20px',
        activeTab: 1,
        layout: 'vbox',
        items: [
            //分類
            {
                id: 'toolbarAttachSort',
                xtype: 'toolbar',
                docked: 'top',
                cls: 'segdoc-selector',
                items: [],
                defaults: {
                    handler: function (button) {
                        if (button.getText() == '附件歷程')
                            OA.common.Fields.popupFromShow('附件歷程');
                        else if (button.getText() == '全部刪除') {
                            var me = Ext.getCmp('PanelAttach');
                            var nowKey = me.getKey();
                            var empName = OA.common.Global.getCurrentUser().empName || '';
                            var depName = OA.common.Global.getCurrentDept().depName || '';
                            var store = Ext.getStore('Attach');
                            Ext.Array.each(store.data.all, function (attach) {
                                if (attach.data.sort == nowKey) {
                                    attach.data.file.addDepName = attach.data.file.depName;
                                    attach.data.file.addTime = attach.data.file.operateTime;
                                    attach.data.file.addEmpName = attach.data.file.personnel;
                                    attach.data.file.status = '0';
                                    attach.data.file.personnel = empName;
                                    attach.data.file.depName = depName;
                                    attach.data.isTemp = true;
                                    attach.data.file.operateTime = OA.common.Utils.getChineseDate();
                                }
                            });
                            me.changeSort(nowKey);
                        } else {
                            if (button.config.sort) {
                                Ext.getCmp('PanelAttach').changeSort(button.config.sort);
                            }

                            /*
                            var chkBig = document.querySelector('#checkBigAttach');
                            if (chkBig && button.config.sort === 'big') {
                                if (chkBig.checked) {
                                    Ext.getCmp('PanelAttach').changeSort('attach');
                                }else
                                    Ext.getCmp('PanelAttach').changeSort('big');
                                return;
                            } else {
                                if (chkBig) chkBig.checked = false;
                            
                            }
                            */

                        }
                    }
                }
            },
            //列表
            {
                flex: 1,
                xtype: 'list',
                scrollable: 'vertical',
                store: 'Attach',
                itemTpl: new Ext.XTemplate(
                    // 修改圖示td所占寬度(parent 5% -> 2%)並加入table class方便CSS樣式定位 - by yi-chi chiu
                    '<table class="attach_list">',
                    '<tr>',
                    '<tpl if="(isEdit)">',
                    '<td width="2%"><span class="flow-delete">&nbsp;</span></td>',
                    '</tpl>',

                    '<td width="55%">',
                    '<p style="font-size:110%;">',
                    ' {name} ',
                    '</p>',
                    '<p style="font-size:110%;">',
                    '  {otherFileName}',
                    '</p>',
                    '</td>',

                    '<td width="8%"><button style="font-size:110%;" class="download">下載</button></td>',

                    '<tpl if="(isEdit)">',
                    '<td width="5%"><span class="flow-rename"></span></td>',
                    '<td width="5%"><span class="flow-move"></span></td>',
                    '</tpl>',

                    '<tpl if="(isCome)">',
                    '<td width="8%"><button style="font-size:110%;" class="other-name">別名</button></td>',
                    '</tpl>',

                    '</tr>',
                    '</table>'
                ),
                infinite: true,
                variableHeights: true,
                plugins: [{ xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move' }],
                listeners: [{
                    event: 'itemtap',
                    fn: function (list, index, item, record, event) {
                        var store = list.getStore();
                        var me = Ext.getCmp('PanelAttach');
                        var f = record.get('file');
                        var currentUser = OA.common.Global.getCurrentUser();
                        var currentDept = OA.common.Global.getCurrentDept();

                        var empName = (currentUser && currentUser.empName) || '';
                        var depName = (currentDept && currentDept.depName) || '';
                        if (event.getTarget('.flow-delete')) {
                            Ext.Array.each(store.data.all, function (attach) {
                                if (record.data == attach.data) {
                                    //記錄新增人員
                                    attach.data.file.addDepName = attach.data.file.depName;
                                    attach.data.file.addTime = attach.data.file.operateTime;
                                    attach.data.file.addEmpName = attach.data.file.personnel;
                                    //設定狀態為刪除：0，更新刪除時間
                                    attach.data.file.status = '0';
                                    attach.data.file.personnel = empName;
                                    attach.data.file.depName = depName;
                                    attach.data.isTemp = true;
                                    attach.data.file.operateTime = OA.common.Utils.getChineseDate();
                                    me.changeSort(record.data.sort);
                                    return false;
                                }
                            });
                        } else if (event.getTarget('.flow-rename')) {
                            var defalutName = record.get('name').split('.')[0];
                            Ext.Msg.prompt("修改附件名稱", "請輸入附件名稱：", function (bu, txt) {
                                if (bu == 'cancel' || txt.trim() == '') return;
                                var newName = txt + '.' + record.get('format');
                                record.set('name', newName);
                                f.fileKey = newName;
                                f.reTime = OA.common.Utils.getChineseDate();
                                f.reEmpName = empName;
                                f.reDepName = depName;
                            }, this, 400, defalutName);
                        } else if (event.getTarget('.other-name')) {  //0918 在來文附件中新增別名按鈕 Chloe.sia
                            var defalutName2 = record.get('name').split('.')[0];
                            Ext.Msg.prompt(defalutName2, '請輸入別名', function (key, value) {
                                if (key === 'ok') {
                                    record.set('otherFileName', value);
                                    f.otherFileName = value;
                                    var edition = OA.common.VIMgr.getCurrentEdition();
                                    // 更新vi
                                    if (edition) {
                                        Ext.Array.each(edition.簽核文件夾.文稿, function (paper) {
                                            if (paper.名稱 == '來文') {
                                                Ext.Array.each(paper.檔案清單.附件清單, function (att) {
                                                    if (att.附件.Src == f.fileName) {
                                                        att.附件.otherFileName = value;
                                                        return false;
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            }, this, false, record.get('otherFileName'));
                        } else if (event.getTarget('.download')) {
                            OA.client.Attach.load(f, null, true);
                        } else {
                            //console.log(f);
                            //OA.client.Attach.openFile(f);
                            //附件下載透過呼叫管理透過service下載
                            OA.client.Attach.load(f);
                        }
                    }
                }]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {
                        xtype: 'label',
                        id: 'attachCapacity'
                    },
                    { xtype: 'spacer' },
                    {
                        id: 'butPanelAttachConfirm',
                        text: '確定',
                        action: 'yes',
                        ui: 'confirm',
                        handler: function (button) {
                            var me = button.up('panel');
                            // 先上鎖，避免附件過大使用者誤動作造成文稿異常 - by yi-chi chiu
                            Ext.Viewport.setMasked(true);
                            me.doOK(button);
                            me.hide();
                        }
                    }
                ]
            }
        ],
        listeners: {
            hide: function (ctr) {
                ctr.doHide();
            }
        },
        key: '',
        resumable: null
    },
    initialize: function () {
        var me = this;
        var qs = OA.common.Global.getQ();
        var ctrAdd = Ext.getCmp('butPanelAttachAdd');
        function addClick() {

            var me = Ext.getCmp('PanelAttach');
            if (ctrAdd) ctrAdd.setDisabled(true);
            var qs = OA.common.Global.getQ();
            var qd = OA.common.Global.getQueryDefault();

            //var isEO = qs.app === 'editor' || qs.app === 'offline';
            //if (!isEO) return;


            var empName = OA.common.Global.getCurrentUser().empName || '';
            var depName = OA.common.Global.getCurrentDept().depName || '';
            var options = { sort: me.getKey() };

            OA.common.FileMgr.openDialog(options, function (files) {
                //console.log(files);
                var store = Ext.getStore('Attach');
                Ext.Array.each(files, function (f) {

                    //檢查相同名稱附件
                    var identicalAtt = false;
                    Ext.Array.each(store.data.all, function (d) {
                        if (d.data.file.fileKey == f.fileKey && data.file.status == 1) {
                            Ext.Msg.alert('提示', '已有相同名稱附件，請修改附件名稱後重新上傳！');
                            identicalAtt = true;
                            return false;
                        }
                    });
                    if (identicalAtt) return;

                    if (!OA.common.Utils.checkSymbolStr(f.fileKey + '')) return;


                    if (['di', 'sw', 'exe'].indexOf((f.fileType + '').toLowerCase()) !== -1) {
                        Ext.Msg.alert('提示', '上傳附件不可為(di、sw、exe)檔，請修改副檔名後重新上傳！');
                        return;
                    }

                    //if (me.getKey() == "attach" || me.getKey() == "big") {

                    //    if (q.電子交換附件格式 && q.電子交換附件格式 != '') {
                    //        var attChangeType = q.電子交換附件格式.split(',');
                    //        if (attChangeType && attChangeType.length > 0) {
                    //            if (attChangeType.indexOf(((f.fileType + '').toUpperCase())) == -1) {
                    //                Ext.Msg.alert("提示", "可上傳的附件格式為「" + attChangeType.join('、') + "」。");
                    //                return
                    //            }
                    //        }
                    //    } else {
                    //        if (['di', 'sw', 'exe'].indexOf((f.fileType + '').toLowerCase()) !== -1) {
                    //            Ext.Msg.alert('提示', '上傳附件不可為(di、sw、exe)檔，請修改副檔名後重新上傳！');
                    //            return;
                    //        }
                    //    }
                    //} else {
                    //    if (['di', 'sw', 'exe'].indexOf((f.fileType + '').toLowerCase()) !== -1) {
                    //        Ext.Msg.alert('提示', '上傳附件不可為(di、sw、exe)檔，請修改副檔名後重新上傳！');
                    //        return;
                    //    }
                    //}

                    if ((f.fileSize / 1024 / 1024) > qd.交換資訊.大型附件.總計) {
                        Ext.Msg.alert('提示', '附件已超出最大上傳限制' + qd.交換資訊.大型附件.總計 + 'MB，無法上傳此附件：' + f.fileKey);
                        if (ctrAdd) ctrAdd.setDisabled(false);
                        return;
                    }

                    f.folderName = me.getKey();
                    f.status = '1';
                    f.personnel = empName;
                    f.depName = depName;
                    if (me.computing(me.getKey(), f.fileSize ? f.fileSize : 0, f)) {
                        store.add({
                            name: f.fileKey,
                            url: '',
                            format: f.fileType,
                            sort: me.getKey(),
                            file: f,
                            isEdit: true,
                            isTemp: true
                        });
                    }
                });
                me.changeSort(me.getKey());
                ctrAdd.setDisabled(false);
            });
        }
    },
    readerOnloadend: function (e) {
        var qd = OA.common.Global.getQueryDefault();
        var me = Ext.getCmp('PanelAttach');
        var reader = e.target;
        var base64Content = reader.result.split('base64,')[1];
        var _name = reader.source.name;
        var _fileType = _name.substring(_name.lastIndexOf('.') + 1);
        var _attachType = reader.key;
        var _size = reader.source.size;
        var store = Ext.getStore('Attach');

        //檢查相同名稱附件
        var identicalAtt = false;
        Ext.Array.each(store.data.all, function (d) {
            if (d.data.file.fileKey == _name && d.data.file.status == 1) {
                Ext.Msg.alert('提示', '已有相同名稱附件，請修改附件名稱後重新上傳！');
                identicalAtt = true;
                return false;
            }
        });

        if (identicalAtt) return;

        if (!OA.common.Utils.checkSymbolStr(_name + '')) return;


        //if (me.getKey() == "attach" || me.getKey() == "big") {
        //    q.電子交換附件格式 = 'PDF,ODT,ODS,ODP,ODG,ODF,ODB';
        //    if (q.電子交換附件格式 && q.電子交換附件格式 != '') {
        //        var attChangeType = q.電子交換附件格式.split(',');
        //        if (attChangeType && attChangeType.length > 0) {
        //            if (attChangeType.indexOf(((_fileType + '').toUpperCase())) == -1) {
        //                Ext.Msg.alert("提示", "可上傳的附件格式為「" + attChangeType.join('、') + "」。");
        //                return
        //            }
        //        }
        //    } else {
        //        if (['di', 'sw', 'exe'].indexOf((_fileType + '').toLowerCase()) !== -1) {
        //            Ext.Msg.alert('提示', '上傳附件不可為(di、sw、exe)檔，請修改副檔名後重新上傳！');
        //            return;
        //        }
        //    }
        //} else {
        if (['di', 'sw', 'exe'].indexOf((_fileType + '').toLowerCase()) !== -1) {
            Ext.Msg.alert('提示', '上傳附件不可為(di、sw、exe)檔，請修改副檔名後重新上傳！');
            return;
        }
        //}


        if (qd.交換資訊.大型附件.總計 && qd.交換資訊.大型附件.總計.length > 0 && 
            (_size / 1024 / 1024) > qd.交換資訊.大型附件.總計) {
            Ext.Msg.alert('提示', '已超出最大上傳限制' + qd.交換資訊.大型附件.總計 + 'MB，無法上傳此附件：' + _name);
            return;
        }
         
        var p = OA.common.Global.getInitParas();
        var empName = OA.common.Global.getCurrentUser().empName || '';
        var depName = OA.common.Global.getCurrentDept().depName || '';
        var orgNo = OA.common.Global.getCurrentDept().orgNo || '';

        var ext = _name.split('.').pop();
        var _src = orgNo + '_' + padLeft(OA.common.Utils.getRandom(0, 9999999999), 11) + '.' + ext;
        var file = {
            fileKey: _name,
            fileName: _src,
            folderName: _attachType,
            fileType: _fileType,
            fileContent: base64Content,
            fileSize: _size,
            status: '1',
            personnel: empName,
            depName: depName,
            operateTime: OA.common.Utils.getChineseDate()
        };
        if (me.computing(reader.key, reader.source.size, file)) {
            store.add({
                name: file.fileKey,
                format: file.fileType,
                sort: file.folderName,
                file: file,
                isEdit: true,
                isTemp: true
            })
        }
        me.changeSort(_attachType);
    },
    create: function () {
        var me = this;
        var qs = OA.common.Global.getQ();
        var init = OA.common.Global.getInitParas();
        var ctr = Ext.getCmp('toolbarAttachSort');
        var items = [];

        items.push(
            {
                id: 'butPanelAttachAdd',
                text: '新增',
                action: 'new'     //initialize  addEventListener('click')
            },
            /*
            {
                id: 'butPanelAttachBigAdd', //大型附件專用
                text: '新增附件',
                hidden: true,
                handler: function (button) {
                    button.setDisabled(true);
                    var me = button.up('panel');
                    var options = {sort: me.getKey()};
                    OA.common.FileMgr.openBig(options, function (files) {
                        var store = Ext.getStore('Attach');
                        Ext.Array.each(files, function (f) {
                            if (me.computing(me.getKey(), f.fileSize ? f.fileSize : 0, f)) {
                                f.folderName = me.getKey();
                                f.status = '1';
                                f.personnel = OA.common.Global.getCurrentUser().empName || '';
                                f.depName = OA.common.Global.getCurrentDept().depName || '';
                                store.add({
                                    name: f.fileKey,
                                    url: '',
                                    format: f.fileType,
                                    sort: me.getKey(),
                                    file: f,
                                    isEdit: true,
                                    isTemp: true
                                });
                            }
                        });
                        button.setDisabled(false);
                    });
                }
            },
            */
        );

        items.push({ text: '承辦附件 ', sort: 'attach' });

        if (init && init.kind && init.kind === '來文') {
            ctr.setItems(items);
            this.changeSort('attach');
            return;
        }

        if (qs.app != 'editor' && qs.app != 'draft') {
            items.push({ text: '參考附件', sort: 'ref' });
            items.push({ text: '大型附件', sort: 'big' });
        }

        /*移到大附件      
        if (OA.common.VIMgr.hadExchange() && qs.dialogType != 4) {

            var store = Ext.getStore('Attach');
            var isMoveBig = false;
            Ext.Array.each(store.data.all, function (r) {
                if (r.get('file').status + '' !== '0' && r.get('sort') == 'big') isMoveBig = true;
            });
            //store.each(function (r) {
            //    if (r.get('file').status+'' !== '0' && r.get('sort') == 'big') isMoveBig = true;
            //});
            var html = [];
            html.push('<input type="checkbox" id="checkBigAttach" style="zoom: 2;" ');
            if (isMoveBig) html.push('checked=' + isMoveBig);
            html.push(' >');
            html.push('<label for="checkBigAttach"> 移至大附件下載區</label></input>');
            items.push({
                text: html.join(''),
                sort: 'big',
                style: "border: 0px;background-image: none;background-color: #1468a2;",
                id: 'checkBigAttachBtn'
            });

        }*/

        items.push({ xtype: 'spacer' });
        items.push({ text: '全部刪除', id: 'delAll' });
        items.push({ text: '附件歷程' });
        items.push({ xtype: 'spacer' });
        items.push({
            ui: 'plain',
            text: '✖',
            action: 'no',
            scope: this,
            hasDisabled: false,
            handler: function (button) {
                var me = button.up('panel');
                me.doHide();
                me.hide();
                Ext.Viewport.setMasked(false);
            }
        })
        ctr.setItems(items);
        this.changeSort('attach');


        var ctrAdd = Ext.getCmp('butPanelAttachAdd');
        var r = new Resumable({ target: 'index.html' });
        this.setResumable(r);
        // var reader = new FileReader();
        // reader.onloadend = this.readerOnloadend;
        r.assignBrowse(ctrAdd.element.dom); // addEventListener('click')
        r.on('fileSuccess', function (rf) {
            var reader = new FileReader();
            reader.onloadend = me.readerOnloadend;
            reader.source = rf.file;
            reader.key = me.getKey();
            reader.readAsDataURL(rf.file);

            r.removeFile(rf);
        });
        r.on('fileAdded', function (file, event) {
            r.upload();
        });
        r.on('error', function (message, rf) {
            Ext.Msg.alert("上傳錯誤", message);
        });


        // r.on('fileProgress', function (rf) {
        // });
    },
    doOK: function (button) {
        //var chkBig = document.querySelector('#checkBigAttach');
        var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
        if (!ctrWK) return;
        //var check = false;
        //if (chkBig && chkBig.checked) check = true;
        ctrWK.doPanelAttachOK();
    },

    update: function (data) {
        var key = this.getKey();
        var store = Ext.getStore('Attach');
        store.addData(data);
        store.filter('sort', key);
    },
    changeSort: function (key) {
        //console.log(key);
        var me = this;
        var qs = OA.common.Global.getQ();
        var qd = OA.common.Global.getQueryDefault();
        var store = Ext.getStore('Attach');
        //重新排序store不然會造成排序失效
        var keyAtt = [];
        var otherAtt = [];
        var isDelAtt = [];

        Ext.Array.each(store.data.all, function (att) {
            if (att.data.sort === key) {
                if (att.data.file.status != 0) {
                    keyAtt.push(att.data);
                } else {
                    isDelAtt.push(att.data);
                }
            } else {
                otherAtt.push(att.data)
            }
            if (att.data.file.status != 0) isNoAttach = false;
        });

        //先增加firstAtt，再增加otherAtt，最後isDelAtt
        var sortAtt = keyAtt.concat(otherAtt, isDelAtt);
        store.setData(sortAtt);
        me.setKey(key);
        var isDcsn = false;
        var vi = OA.common.VIMgr.getViContent();
        var current = OA.common.VIMgr.getCurrentEdition();
        var init = OA.common.Global.getInitParas();
        //console.log(vi)
        //console.log(init)
        //console.log(current);
        if (current && vi) {
            var isHidden = true;
            if (vi.作業版本 === '0')
                isHidden = isDcsn;
            else if (vi.isTemp == 'Y' || current.isTemp == 'Y')
                isHidden = isDcsn;
            else if (init.version == current.版號) {
                isHidden = isDcsn;
                //會辦單位不能更改本稿附件
                if (current.簽核人員 && current.簽核人員.是否會辦 && current.簽核人員.是否會辦 == '是') {
                    if (init) isHidden = init.documentType !== '會辦簽';
                }
            }

            //init.kind = '來文';
            //來文一律都不能改附件，判斷要放在最後           
            if (init && init.kind === '來文') isHidden = true;

            if (qs.app === 'check' || qs.app === 'review') isHidden = true;

            if (isHidden) {
                //評議中心會辦單位可夾參考附件             
                var isParallel = OA.common.VIMgr.isParallel();

                if (init && init.kind !== '來文' && key == 'ref' && isParallel && init.version == current.版號) {
                    Ext.getCmp('butPanelAttachAdd').setHidden(false);
                    Ext.getCmp('butPanelAttachConfirm').setHidden(false);
                    var btnDelAll = Ext.getCmp('delAll');
                    if (btnDelAll) btnDelAll.setHidden(true);
                    Ext.Array.each(store.data.all, function (r) {
                        r.set('isEdit', true);
                    });

                } else {
                    //console.log('this');
                    Ext.getCmp('butPanelAttachAdd').setHidden(true);
                    Ext.getCmp('butPanelAttachConfirm').setHidden(true);

                    var btnDelAll = Ext.getCmp('delAll');
                    if (btnDelAll) btnDelAll.setHidden(true);
                    Ext.Array.each(store.data.all, function (r) {
                        r.set('isEdit', false);
                    });

                    if (init.kind == '來文' && key == 'attach') {
                        Ext.Array.each(store.data.all, function (r) {
                            r.set('isCome', true);
                        });
                    } else {
                        Ext.Array.each(store.data.all, function (r) {
                            r.set('isCome', false);
                        });
                    }
                }
            } else {
                var dcsnDate = '';
                if (qd && qd.交換資訊 && qd.交換資訊.決行日期 && (qd.交換資訊.決行日期 + '').length > 0) dcsnDate = qd.交換資訊.決行日期;
                var Role = OA.common.Global.getCurrentRole();
                //已決行除了總發跟紙本文都不能改附件
                if (dcsnDate !== '') {
                    if (Role && '02'.indexOf(Role.roleId) >= 0) {
                        Ext.getCmp('butPanelAttachAdd').setHidden(false);
                        Ext.getCmp('butPanelAttachConfirm').setHidden(false);
                        var btnDelAll = Ext.getCmp('delAll');
                        if (btnDelAll) btnDelAll.setHidden(false);
                        Ext.Array.each(store.data.all, function (r) {
                            r.set('isEdit', true);
                        });

                    } else if (!OA.common.Utils.checkEpaper()) {
                        Ext.getCmp('butPanelAttachAdd').setHidden(false);
                        Ext.getCmp('butPanelAttachConfirm').setHidden(false);
                        var btnDelAll = Ext.getCmp('delAll');
                        if (btnDelAll) btnDelAll.setHidden(false);
                        Ext.Array.each(store.data.all, function (r) {
                            r.set('isEdit', true);
                        });
                    } else {
                        Ext.getCmp('butPanelAttachAdd').setHidden(true);
                        Ext.getCmp('butPanelAttachConfirm').setHidden(false);

                        var btnDelAll = Ext.getCmp('delAll');
                        if (btnDelAll) btnDelAll.setHidden(true);
                        Ext.Array.each(store.data.all, function (r) {
                            r.set('isEdit', false);
                        });

                        if (init.kind == '來文' && key == 'attach') {
                            Ext.Array.each(store.data.all, function (r) {
                                r.set('isCome', true);
                            });
                        } else {
                            Ext.Array.each(store.data.all, function (r) {
                                r.set('isCome', false);
                            });
                        }
                    }

                } else {
                    if (qs.app == 'review' || qs.app == 'check') {
                        Ext.getCmp('butPanelAttachAdd').setHidden(true);
                        Ext.getCmp('butPanelAttachConfirm').setHidden(false);

                        var btnDelAll = Ext.getCmp('delAll');
                        if (btnDelAll) btnDelAll.setHidden(true);
                        Ext.Array.each(store.data.all, function (r) {
                            r.set('isEdit', false);
                        });

                        if (init.kind == '來文' && key == 'attach') {
                            Ext.Array.each(store.data.all, function (r) {
                                r.set('isCome', true);
                            });
                        } else {
                            Ext.Array.each(store.data.all, function (r) {
                                r.set('isCome', false);
                            });
                        }

                    } else {
                        Ext.getCmp('butPanelAttachAdd').setHidden(false);
                        Ext.getCmp('butPanelAttachConfirm').setHidden(false);
                        var btnDelAll = Ext.getCmp('delAll');
                        if (btnDelAll) btnDelAll.setHidden(false);
                        Ext.Array.each(store.data.all, function (r) {
                            r.set('isEdit', true);
                        });
                    }
                }
            }
        }

        Ext.getCmp('toolbarAttachSort').getItems().each(function (item) {
            if (item.config.sort) {
                if (item.config.sort == key)
                    item.setUi('confirm');
                else
                    item.setUi('action');
            }
        });

        store.clearFilter();
        store.filterBy(function (r) {
            var canUse = r.get('file').status != '0';
            var sameType = r.get('sort') == key;
            //if (r.get('sort') != 'ref' && key != 'ref')  sameType = true;
            return canUse && sameType;
        });

        me.computing(key, 0);

        OA.common.Utils.indicatorWith(this);
    },
    computing: function (key, size, file) {
        var me = this;
        var qd = OA.common.Global.getQueryDefault();
        var total = 0;
        var limit = 0;
        var amount = 0;

        var qs = OA.common.Global.getQ();
        if (qs.app == 'tidy') return true;

        var chkBig = document.querySelector('#checkBigAttach');

        var store = Ext.getStore('Attach');
        Ext.Array.each(store.data.items, function (ite) {
            if (ite.data.ite != '0') amount += (ite.data.file.fileSize);
        });

        //一般附件限制固定
        if (key === 'attach') {
            total = 10;
            limit = 0;
        }

        if (qd && qd.交換資訊) {
            if (key === 'ref' && qd.交換資訊.參考附件) {
                if (qd.交換資訊.參考附件.總計)
                    total = qd.交換資訊.參考附件.總計;
                if (qd.交換資訊.參考附件.單檔 && qd.交換資訊.參考附件.單檔 != 0)
                    limit = qd.交換資訊.參考附件.單檔;
                //大型附件
            } else if (key == 'big' && qd.交換資訊.大型附件) {
                if (qd.交換資訊.大型附件.總計)
                    total = qd.交換資訊.大型附件.總計;
                if (qd.交換資訊.大型附件.單檔 && qd.交換資訊.大型附件.單檔 != 0)
                    limit = qd.交換資訊.大型附件.單檔;
            }


            //單一檔案容量限制
            if (limit != 0 && (size / 1024 / 1024) > limit) {
                if (key == 'attach' && qs.app !== 'editor' && qd.交換資訊.大型附件.總計) {
                    Ext.Msg.alert('提示', '單檔上傳限制在' + limit + 'MB，自動轉入大型附件！');
                    //file.folderName = 'big';
                    if (!(((amount += size) / 1024 / 1024) > qd.交換資訊.大型附件.總計)) {
                        Ext.Array.each(store.data.all, function (r) {
                            if (r.get('sort') === 'attach') r.set('sort', 'big');
                        });
                        //store.each(function (r) {
                        //    if (r.get('sort') === 'attach') r.set('sort', 'big');
                        //});
                        //store.add({ name: file.fileKey, url: '', format: file.fileType, sort: 'big', file: file, isEdit: true });
                        if (file) {
                            file.folderName = 'big';
                            store.add({
                                name: file.fileKey,
                                format: file.fileType,
                                sort: 'big',
                                file: file,
                                isEdit: true,
                                isTemp: true
                            });
                        }
                        me.changeSort('big');
                        if (chkBig) chkBig.checked = true;
                        return false;
                    } else {
                        Ext.Msg.alert('提示', '已超過大型附件上傳總容' + qd.交換資訊.大型附件.總計 + 'MB，不可再上傳附件');
                        return false;
                    }
                } else {
                    Ext.Msg.alert('提示', '單檔上傳限制在' + limit + 'MB');
                    return false;
                }
            } else {//總容量限制
                amount += size;
                if ((amount / 1024 / 1024) > total) {
                    if (key !== 'big' && qs.app !== 'editor' && qd.交換資訊.參考附件.總計) {
                        //Ext.Msg.confirm("提示", '總容量上傳限制在' + total + 'MB，是否將所有附件自動轉入大型附件區？', function (ok) {
                        //    if (ok == 'yes') {

                        if (key == 'ref') {
                            Ext.Msg.alert('提示', '已超過參考附件上傳總容' + qd.交換資訊.參考附件.總計 + 'MB，不可再上傳參考附件');
                            return false;
                        }

                        Ext.Array.each(store.data.all, function (r) {
                            if (r.get('sort') === 'attach') r.set('sort', 'big');
                        });
                        //store.each(function (r) {
                        //    if (r.get('sort') === 'attach') r.set('sort', 'big');
                        //});

                        if ((amount / 1024 / 1024) > qd.交換資訊.大型附件.總計) {
                            Ext.Msg.alert('提示', '已超過大型附件上傳總容' + qd.交換資訊.大型附件.總計 + 'MB，不可再上傳附件');
                            return false;
                        }
                        if (file) {
                            file.folderName = 'big';
                            store.add({
                                name: file.fileKey,
                                format: file.fileType,
                                sort: 'big',
                                file: file,
                                isEdit: true,
                                isTemp: true
                            });
                        }
                        if (chkBig) chkBig.checked = true;
                        me.changeSort('big');
                        return false;
                        //    } else {                            
                        //        if (size == 0) {
                        //            Ext.Msg.alert('提示', '已超出承辦附件總容量' + total + 'MB限制，無法轉為承辦附件');
                        //            me.changeSort('big');
                        //            if (chkBig) chkBig.checked = true;
                        //            return false;
                        //        } else {
                        //            Ext.Msg.alert('提示', '已超出總容量' + total + 'MB限制，無法上傳附件！');
                        //            return false;
                        //        }                            
                        //    }
                        //});
                        //return false;
                    } else {
                        Ext.Msg.alert('提示', '已超出總容量' + total + 'MB限制，不可再上傳附件');
                        return false;
                    }
                }
            }

            if (amount / 1024 / 1024 >= 1 || amount == 0) {
                amount = (amount / 1024 / 1024).toFixed(2) + 'MB';
            } else {
                amount = (amount / 1024).toFixed(2) + 'KB';
            }

            if (amount !== 'NaNKB') {
                var title = '';
                if (me.getKey() == 'big') title = '(大型附件)';

                var str = '目前共上傳' + amount + '，總計可上傳' + total + 'MB，' + title + '單一檔案限制' + limit + 'MB';

                Ext.getCmp('attachCapacity').setHtml(str);
            }
        }

        return true;
    },
    doHide: function () {
        //新增：先判斷是不是為暫存，如果是暫存要清掉, 刪除：要從刪除記錄中補回來
        var store = Ext.getStore('Attach');
        Ext.Array.each(store.getData().all, function (item) {
            if (item && item.data.file.status == '0' && item.data.isTemp) {
                item.data.isTemp = false;
                item.data.file.status = '1';
                item.data.file.operateTime = '';
                item.data.file.addTime = '';
                item.data.file.addDepName = '';
                item.data.file.addEmpName = '';

            }
            else if (item && item.data.isTemp)
                store.remove(item);
        });
        Ext.getStore('Attach').clearFilter();
    }
});