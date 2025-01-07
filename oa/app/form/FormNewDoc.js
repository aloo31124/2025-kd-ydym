/*

 創簽稿

 OK -> fireEvent OA.controller.Work.onNewDocPaper

 */

Ext.define('OA.form.FormNewDoc', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormNewDoc',
    id: 'FormNewDoc',
    xtype: "FormNewDoc",
    requires: ['OA.form.FormDocTemplates'],
    config: {
        width: 760,
        height: 600,
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
                        id: 'jobTitle',
                        xtype: 'selectfield',
                        name: '決行層級_title',
                        label: '決行層級',
                        valueField: 'value',
                        displayField: 'key',
                        value: '-2',
                        store: {
                            data: [
                                { key: '一層決行', value: '-1' },
                                { key: '二層決行', value: '-2' },
                                { key: '三層決行', value: '-3' },
                                { key: '四層決行', value: '-4' }
                            ]
                        }
                    },
                    { xtype: 'spacer' },  
                    {
                        id: 'doc_ImportDI',
                        text: '匯入DI',
                        handler: function (button) {
                            var r = new Resumable({ target: 'index.html', fileType: ['di'], maxFiles: 1 });
                            var again = false;
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                var name = reader.source.name;
                                var xml = reader.result;
                            }
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
                xtype: 'container',
                layout: {
                    type: 'fit'
                },
                items: [                   
                    {
                        id: 'selectDoc',
                        xtype: 'nestedlist',
                        width: '100%',
                        height: 500,
                        displayField: 'text',
                        backText: '上一頁',
                        layout: {
                            type: 'card',
                            animation: {
                                type: 'fade',
                                duration: 450,
                                direction: 'up'
                            },
                        },
                        getItemTextTpl: function () {
                            var items = [];
                            items.push('<table>');
                            items.push('<tr>');
                            items.push('<td width="90%">');
                            items.push('<p>{text}</p>');
                            items.push('</td>');
                            items.push('</tr>');
                            items.push('</table>');
                            return items.join('');
                        },
                        listeners: {
                            listchange: function (nestedList, list, eOpts) {
                                //defalut left item
                                var me = nestedList.up('formpanel');
                                var addcommonly = Ext.getCmp('AddCommonly');
                                if (addcommonly)
                                    addcommonly.iconElement.dom.style.color = '';
                                var store = list.getStore(), node = store.getAt(0);
                                if (!node) return;
                                if (node.isLeaf() && list.getSelectionCount() == 0) {
                                    list.select(0);
                                    me.isAddCommonly(list.selected.items[0].data.template.value);
                                }

                                // 處理巢狀列表卷軸顯示 - by yi-chi chiu
                                var ctr = Ext.getCmp('selectDoc');
                                //console.log(ctr);
                                OA.common.Utils.indicatorWith(ctr);
                            },
                            leafitemtap: function (nestedList, list, index, target, record, e, eOpts) {
                                OA.client.WK.openTemplate(record.get('template').url);
                                var me = nestedList.up('formpanel');
                                me.isAddCommonly(record.data.template.value);
                            }
                        }
                    },
                    {
                        id: 'doc_ImportDI',
                        text: '匯入DI',
                        handler: function (button) {
                            var r = new Resumable({ target: 'index.html', fileType: ['di'], maxFiles: 1 });
                            var again = false;
                            var reader = new FileReader();
                            reader.onloadend = function () {
                                var name = reader.source.name;
                                var xml = reader.result;
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
                    { xtype: 'spacer' },
                    {
                        id: 'newPaper', text: '確定', action: 'yes', ui: 'confirm', width: '20%',
                        handler: function (button, e, eOpts) {
                            button.up('formpanel').doNewDoc(button);
                        }
                    }
                ]
            }
        ],
        isNew: false
    },
    initialize: function () {

        var reader = new FileReader();
        var again = false;
        var r = new Resumable({ target: 'index.html', fileType: ['di'], maxFiles: 1 });

        reader.onloadend = function () {
            //var name = reader.source.name;
            var xml = reader.result;

            if (!again) {
                var isbig5 = xml.indexOf('encoding="big5"') >= 0;
                if (isbig5) {
                    reader.readAsText(reader.source, 'big5');
                    again = true;
                }
            }
            OA.common.FileMgr.noServiSignDoImport(xml);
        };
        var ctr = Ext.getCmp('doc_ImportDI');
        r.assignBrowse(ctr.element.dom);           // addEventListener('click')
        r.on('fileAdded', function (file, event) {
            r.upload();
        });
        r.on('fileSuccess', function (rf) {
            again = false;
            reader.source = rf.file;
            // var fileExt = ctrFileExt.getValue();
            reader.readAsText(rf.file);
            r.removeFile(rf);
            Ext.getCmp('FormNewDoc').hide();
        });
        r.on('error', function (message, rf) {
        });
    },
    create: function (isNew) {
        var qs = OA.common.Global.getQ();
        if (isNew)
            this.setIsNew(isNew);
        else
            this.setIsNew(false);

        var formats = OA.common.DIMgr.FORMATS;

        var sort = formats.SORT;
        var items = [];
        var defaultItems = [];

        //增加單位範本
        var docTempList = OA.common.Global.getDocTempList() || [];
        //console.log(docTempList);
        if (docTempList && docTempList.length > 0) {
            var templist1 = [];
            var templist = [];
            var childItems2 = [];
            var lastChildText = '';
            Ext.Array.each(docTempList, function (doc, index) {
                //console.log(doc);
                if (doc.indexOf('\\') !== -1 || doc.indexOf('/') !== -1) {
    
                    var childs = doc.split(/[\\/]/); // 使用正規表達式，分割正斜線和反斜線
                    //console.log(childs);

                    var childText = childs[0];
                    var templist2 = []
                    if (childItems2.length == 0) {
                        lastChildText = Ext.clone(childText);

                        templist2.push({
                            name: childs[0],
                            subj: true,
                            value: childs[1],
                            xml: '',
                            docTemp: true
                        })
                        childItems2.push({
                            text: childs[1],
                            leaf: true,
                            format: childs[1],
                            template: templist2
                        });
                    } else {
                        if (childText == lastChildText) {
                            templist2.push({
                                name: childs[0],
                                subj: true,
                                value: childs[1],
                                xml: '',
                                docTemp: true
                            })
                            childItems2.push({
                                text: childs[1],
                                leaf: true,
                                format: childs[1],
                                template: templist2
                            });

                            if (index == docTempList.length - 1) {
                                templist1.push({ text: lastChildText, leaf: false, items: Ext.clone(childItems2) });
                                childItems2 = [];
                            }
                        } else {
                            templist1.push({ text: lastChildText, leaf: false, items: Ext.clone(childItems2) });
                            childItems2 = [];
                            if (templist2.length == 0 && docTempList[index + 1]) {
                                var childsNext = docTempList[index + 1].split(/[\\/]/);
                                if (childsNext[0] !== childText) {
                                    templist2.push({
                                        name: childs[0],
                                        subj: true,
                                        value: childs[1],
                                        xml: '',
                                        docTemp: true
                                    })
                                    childItems2.push({
                                        text: childs[1],
                                        leaf: true,
                                        format: childs[1],
                                        template: templist2
                                    });
                                } else if (childItems2.length == 0) {
                                    templist2.push({
                                        name: childs[0],
                                        subj: true,
                                        value: childs[1],
                                        xml: '',
                                        docTemp: true
                                    })
                                    childItems2.push({
                                        text: childs[1],
                                        leaf: true,
                                        format: childs[1],
                                        template: templist2
                                    });
                                }
                            } else if (docTempList[index + 1] == undefined && childItems2.length == 0 && templist2.length == 0) {
                                lastChildText = Ext.clone(childText);
                                templist2.push({ name: childs[0], subj: true, value: childs[1], xml: '', docTemp: true });
                                childItems2.push({ text: childs[1], leaf: true, format: childs[1], template: templist2 });
                                templist1.push({ text: lastChildText, leaf: false, items: Ext.clone(childItems2) });
                            } 
                            lastChildText = Ext.clone(childText);
                        }
                    }

                } else {
                    if (childItems2.length > 0) {
                        templist1.push({ text: lastChildText, leaf: false, items: Ext.clone(childItems2) });
                        childItems2 = [];
                    }

                    templist = [];

                    templist.push({
                        name: doc,
                        subj: true,
                        value: doc,
                        xml: '',
                        docTemp: true
                    });
                    //console.log(templist);
                    Ext.Array.each(templist, function (p3) {
                        templist1.push({ text: p3.name, leaf: true, format: p3.name, template: p3 });
                    });

                }
            });


            templist1 = templist1.sort(function sortNumber(a, b) {
                return parseInt(a.text) - parseInt(b.text);
            });

             /*
            var dept = OA.common.Global.getCurrentDept();

            //整理排序
           
            var lastTemplist = null;
            if (templist1.length > 0) {
                Ext.Array.each(templist1, function (temp1, index) {
                    if (temp1.text && temp1.text == '評議例稿') {
                        lastTemplist = Ext.clone(temp1);
                        templist1.splice(index, 1);
                        //console.log(templist1);
                        return false;
                    }
                })
            }
            if (lastTemplist != null) {
                templist1.push(lastTemplist);
            }
            if (dept && dept.depName && (dept.depName + '').indexOf('組') != -1) {
                items.push({ text: (dept.depName + '').replace('組', '') + '例稿', leaf: false, items: templist1 });
            } else {
                items.push({ text: '單位例稿', leaf: false, items: templist1 });
            }
            */
            items.push({ text: '單位例稿', leaf: false, items: templist1 });
            defaultItems = Ext.clone(templist1);

        }
        //console.log(defaultItems);
        
        var isProj = false;
        var role = OA.common.Global.getCurrentRole();
        if (qs.projNo && role && role.depNo == 'A301') {
            isProj = true;
        }

        //isProj=true
        Ext.Array.each(sort, function (p1) {
            var desc = p1.text;
            if (p1.items) {
                var items1 = [];
                Ext.Array.each(p1.items, function (p2name) {
                    var p2Items = formats[p2name].template;
                    desc = p2name;
                    var p2Text = formats[p2name].text;
                    if (p2Text) {
                        desc = p2Text;
                    }

                    desc = (formats[p2name].change) ? desc : desc + ' ( 無法電子交換 )';
                    desc = (p2Items[0].url) ? desc + '<i class="newdoc-link"></i> ' : desc + ' ';
                    if (p2Items.length > 1) {
                        var items2 = [];
                        //console.log(p2Items);
                        Ext.Array.each(p2Items, function (p3) {
                            //console.log(p3)
                            items2.push({ text: p3.name, leaf: true, format: p2name, template: p3 });
                        });
                        items1.push({ text: desc, leaf: false, items: items2 })
                    } else {
                        items1.push({ text: desc, leaf: true, format: p2name, template: p2Items[0] });
                    }
                });
                items.push({ text: p1.text, leaf: false, items: items1 });
                if (isProj && (p1.text == '簽' || p1.text == '書函' || p1.text == '函')) {
                    if (p1.text == '簽') {
                        desc = '9' + desc
                    } else if (p1.text == '書函') {
                        desc = '11' + desc
                    } else {
                        desc = '10' + desc
                    }
                    defaultItems.push({ text: p1.text, leaf: false, items: items1 });
                }
            } else {
                var _template = formats[p1.text].template[0];
                desc = (formats[p1.text].change) ? desc : desc + ' ( 無法電子交換 )';
                desc = (_template.url) ? desc + '<i class="newdoc-link"></i> ' : desc + ' ';
                items.push({ text: desc, leaf: true, format: p1.text, template: _template });
                if (isProj && (p1.text == '簽' || p1.text == '書函' || p1.text == '函')) {
                    if (p1.text == '簽') {
                        desc = '9' + desc
                    } else if (p1.text == '書函') {
                        desc = '11' + desc
                    } else {
                        desc = '10' + desc
                    }
                    defaultItems.push({ text: desc, leaf: true, format: p1.text, template: _template });
                }
            }
        });

        Ext.define('ListItem', {
            extend: 'Ext.data.Model',
            config: {
                fields: ['text', 'format', 'template']
            }
        });

        var treeStore;
        if (isProj) {
            treeStore = Ext.create('Ext.data.TreeStore', {
                model: 'ListItem',
                defaultRootProperty: 'items',
                root: { items: defaultItems }
            });

        } else {
            treeStore = Ext.create('Ext.data.TreeStore', {
                model: 'ListItem',
                defaultRootProperty: 'items',
                root: { items: items }
            });
        }

        Ext.getCmp('selectDoc').setStore(treeStore);

        // 卷軸顯示初始化 - by yi-chi chiu
        var selectDoc = Ext.getCmp('selectDoc');
        OA.common.Utils.indicatorWith(selectDoc);

        var jobTitle = Ext.getCmp('jobTitle');
        if (jobTitle) {
            var role = OA.common.Global.getCurrentRole();
            if (role && (role.depNo == 'A305' || role.depNo == 'A301')) {
                jobTitle.setValue(-4);
            }
        }

    },
    doNewDoc: function (button) {
        var form = button.up('formpanel');
        var selectdoc = Ext.getCmp('selectDoc');
        var jobTitle = Ext.getCmp('jobTitle');
        if (!selectdoc) return;
        if (selectdoc.getActiveItem().selected.items.length <= 0) return;
        var seletItem = selectdoc.getActiveItem().selected.items[0].data;       

        if (seletItem.template.docTemp) {
            var fileName = seletItem.template.name + '.di';

            OA.client.DocTempContent.load(fileName, function (content) {

                if (content && content.length > 0) {
                    var xdi = B64.decode(content);
                    //取出檔案格式
                    var doctypeStart = xdi.indexOf('<!DOCTYPE') + 9;
                    var doctypeEnd = xdi.indexOf('SYSTEM "" [');

                    //舊系統轉入DI檔增加判斷
                    if (doctypeEnd == -1) {
                        doctypeEnd = xdi.indexOf('SYSTEM "99_');
                    }

                    if (doctypeEnd == -1) {
                        doctypeEnd = xdi.indexOf('SYSTEM "104_');
                    }

                    if (doctypeEnd == -1) {
                        Ext.Msg.alert("提示", "無法正確取得例稿格式！");
                        return;
                    }
                    var docType = xdi.substring(doctypeStart, doctypeEnd) || '';

                    //要再是否為書函
                    if ((docType+'').trim() == '函') {
                        if (xdi.indexOf('代碼="書函"') != -1) {
                            docType = '書函';
                        }
                    }
                    //console.log(docType);
                    //console.log(doctypeStart);
                    //console.log(doctypeEnd);
                    var idx;
                    if (xdi.indexOf(']>') >= 0) {
                        idx = xdi.indexOf(']>') + 2;
                    } else if (xdi.indexOf('.dtd') >= 0) {
                        idx = xdi.indexOf('.dtd') + 6;
                    }
                    xdi = xdi.substring(idx);



                    var xmlDoc = '';
                    try {
                        xmlDoc = $.parseXML(xdi);
                    } catch (err) {
                        if (err) console.log(err);
                        return { err: err };
                    }
                    var $xml = $(xmlDoc);
                    var qFormat = '';
                    if (docType != '') {
                        qFormat = (docType + '').trim();
                    } else {
                        qFormat = $xml.context.documentElement.nodeName.trim();
                    }

                    var jobtitle = -1;
                    if (jobTitle) {
                        jobtitle = jobTitle.getValue();
                    } 


                    //如果是預審委員指派 增加註記列印時用
                    //console.log(seletItem.template.value);
                    var values;
                    if (Ext.isArray(seletItem.template)) {
                        values = {
                            qc: '2',
                            qFormat: qFormat,
                            qTemplate: seletItem.template[0].value,
                            qIsNew: form.getIsNew(),
                            qNumberWay: '1',
                            qSubj: seletItem.template[0].subj,
                            di: xdi,
                            qJobTitle: jobtitle,
                            qIstemp: true
                        };

                    } else {

                        values = {
                            qc: '2',
                            qFormat: qFormat,
                            qTemplate: seletItem.template.value,
                            qIsNew: form.getIsNew(),
                            qNumberWay: '1',
                            qSubj: seletItem.template.subj,
                            di: xdi,
                            qJobTitle: jobtitle,
                            qIstemp: true
                        };
                    }

                    form.fireEvent('onNewDocPaper', form, values);
                    form.hide();

                }
            });

            return;
        } else if (Ext.isArray(seletItem.template) && seletItem.template[0].docTemp) {
            var fileName = seletItem.template[0].name + '//' + seletItem.template[0].value + '.di';

            OA.client.DocTempContent.load(fileName, function (content) {

                if (content && content.length > 0) {
                    var xdi = B64.decode(content);
                    //取出檔案格式
                    var doctypeStart = xdi.indexOf('<!DOCTYPE') + 9;
                    var doctypeEnd = xdi.indexOf('SYSTEM "" [');                  
                    //舊系統轉入DI檔增加判斷
                    if (doctypeEnd == -1) {
                        doctypeEnd = xdi.indexOf('SYSTEM "99_');
                    }

                    if (doctypeEnd == -1) {
                        doctypeEnd = xdi.indexOf('SYSTEM "104_');
                    }

                    if (doctypeEnd == -1) {
                        Ext.Msg.alert("提示", "無法正確取得例稿格式！");
                        return;
                    }
                    var docType = xdi.substring(doctypeStart, doctypeEnd) || '';

                    //要再是否為書函
                    if ((docType + '').trim() == '函') {
                        if (xdi.indexOf('代碼="書函"') != -1) {
                            docType = '書函';
                        }
                    }
                    //console.log(docType);
                    //console.log(doctypeStart);
                    //console.log(doctypeEnd);
                    var idx;
                    if (xdi.indexOf(']>') >= 0) {
                        idx = xdi.indexOf(']>') + 2;
                    } else if (xdi.indexOf('.dtd') >= 0) {
                        idx = xdi.indexOf('.dtd') + 6;
                    }
                    xdi = xdi.substring(idx);


                    var xmlDoc = '';
                    try {
                        xmlDoc = $.parseXML(xdi);
                    } catch (err) {
                        if (err) console.log(err);
                        return { err: err };
                    }
                    var $xml = $(xmlDoc);
                    var qFormat = '';
                    if (docType != '') {
                        qFormat = (docType + '').trim();
                    } else {
                        qFormat = $xml.context.documentElement.nodeName.trim();
                    }

                    var jobtitle = -1;
                    if (jobTitle) {
                        jobtitle = jobTitle.getValue();
                    } 

                    //如果是預審委員指派 增加註記列印時用
                    //console.log(seletItem.template.value);
                    var values;
                    if (Ext.isArray(seletItem.template)) {
                        values = {
                            qc: '2',
                            qFormat: qFormat,
                            qTemplate: seletItem.template[0].value,
                            qIsNew: form.getIsNew(),
                            qNumberWay: '1',
                            qSubj: seletItem.template[0].subj,
                            di: xdi,
                            qJobTitle: jobtitle,
                            qIstemp: true
                        };

                    } else {

                        values = {
                            qc: '2',
                            qFormat: qFormat,
                            qTemplate: seletItem.template.value,
                            qIsNew: form.getIsNew(),
                            qNumberWay: '1',
                            qSubj: seletItem.template.subj,
                            di: xdi,
                            qJobTitle: jobtitle,
                            qIstemp: true
                        };
                    }


                    form.fireEvent('onNewDocPaper', form, values);
                    form.hide();

                }
            });

            return;
        }

        //函覆創稿，判斷是否有來文，開啟引用來文主旨按鈕
        //自動引用來文主旨，來文日期+來文字號至說明一
        var isCopy = '2';
        var viContent = OA.common.VIMgr.getViContent();
        var isFllow = false;
        if (viContent) {
            Ext.Array.each(viContent.版次[0].簽核文件夾.文稿, function (item) {
                if (item.名稱 == '來文') {
                    isFllow = true;
                    return true;
                }
            })
        }

        if (isFllow && button.getId() != 'AddCommonly') isCopy = '1';
        var values = {
            qc: isCopy,
            qFormat: seletItem.format,
            qTemplate: seletItem.template.value,
            qIsNew: form.getIsNew(),
            qNumberWay: '1',
            qSubj: seletItem.template.subj, //0215 來文狀態有主旨或者說明使用來文引用，
            // 來文時，如有簽稿無主旨、說明或日期等，系統即不要跳出這個詢問是否帶入以上資訊。 chloe.sia
            qJobTitle: jobTitle.getValue()
        };
        if (isFllow) values.qIsNew = false;
        if (button.getId() == 'AddCommonly') {
            var data = [];
            OA.client.Localforage.getCommonlyDoc(function (value) {
                if (value) {
                    data = value;
                    var has = false;
                    Ext.Array.each(data, function (item) {
                        if (item.qTemplate == values.qTemplate) {
                            has = true;
                            return false;
                        }
                    });
                    if (!has) {
                        data.push(values);
                        OA.client.Localforage.setCommonlyDoc(data);
                        button.iconElement.dom.style.color = '#FFFF33';
                        Ext.Msg.alert('提示', '加入成功！');
                    }
                    else
                        Ext.Msg.alert('提示', '已有相同範本！');
                } else {
                    data.push(values);
                    OA.client.Localforage.setCommonlyDoc(data);
                    button.iconElement.dom.style.color = '#FFFF33';
                    Ext.Msg.alert('提示', '加入成功！');
                }
            });
        }
        else {
            if (values.qc === '1') {//0215 來文狀態有主旨或者說明使用來文引用，
                // 來文時，如有簽稿無主旨、說明或日期等，系統即不要跳出這個詢問是否帶入以上資訊。 chloe.sia
                var qs = OA.common.Global.getQ();
                if (qs.sFlag) values.qSubj = false; //密件不引用
                if (values.qSubj == true) {
                    var edition = OA.common.VIMgr.getCurrentEdition();
                    // 更新vi
                    if (edition) {
                        Ext.Msg.confirm("來文引用", "是否引用來文主旨？", function (ok) {
                            if (ok == 'yes') {
                                //values.duplicate = true;
                                values.copyPaper = true;
                                form.fireEvent('onNewDocPaper', this, values);
                                form.hide();
                            } else if (ok == 'no') {
                                //values.duplicate = true;
                                values.copyPaper = false;
                                form.fireEvent('onNewDocPaper', this, values);
                                form.hide();
                            }
                        });

                        /*
                        Ext.Array.each(edition.簽核文件夾.文稿, function (paper) {
                            if (paper.名稱 == '來文') {
                                Ext.Array.each(paper.檔案清單.附件清單, function (att) {
                                    if(att !== ""){
                                        Ext.Msg.confirm("附件引用", "是否引用附件？", function (ok) {
                                            if (ok == 'yes'){
                                                Ext.Msg.confirm("來文引用", "是否引用來文主旨？", function (ok) {
                                                    if (ok == 'yes'){
                                                        values.duplicate = true;
                                                        values.copyPaper = true;
                                                        form.fireEvent('onNewDocPaper', this, values);
                                                        form.hide();
                                                    } else if(ok == 'no'){
                                                        values.duplicate = true;
                                                        values.copyPaper = false;
                                                        form.fireEvent('onNewDocPaper', this, values);
                                                        form.hide();
                                                    }

                                                });
                                            } else if(ok == 'no'){
                                                Ext.Msg.confirm("來文引用", "是否引用來文主旨？", function (ok) {
                                                    if (ok == 'yes') {
                                                        values.duplicate = false;
                                                        values.copyPaper = true;
                                                        form.fireEvent('onNewDocPaper', this, values);
                                                        form.hide();
                                                    } else if(ok == 'no'){
                                                        values.duplicate = false;
                                                        values.copyPaper = false;
                                                        form.fireEvent('onNewDocPaper', this, values);
                                                        form.hide();
                                                    }

                                                });
                                            }

                                        });
                                    } else if(att == ""){
                                        //0215 來文狀態有主旨或者說明使用來文引用，
                                        // 來文時，如有簽稿無主旨、說明或日期等，系統即不要跳出這個詢問是否帶入以上資訊。 chloe.sia
                                        //var hasComepaperDi = OA.common.Global.getCurrentViewModel() != null && OA.common.Global.getCurrentViewModel().kind === '來文';
                                        // if (hasComepaperDi) {
                                        Ext.Msg.confirm("來文引用", "是否引用來文主旨？", function (ok) {
                                            if (ok == 'yes')
                                                values.copyPaper = true;
                                            form.fireEvent('onNewDocPaper', this, values);
                                            form.hide();
                                        });
                                    }
                                });
                            }
                        });
                        */
                    }
                } else {
                    form.fireEvent('onNewDocPaper', this, values);
                    form.hide();
                }
            } else {
                form.fireEvent('onNewDocPaper', this, values);
                form.hide();
            }
        }
    },
    isAddCommonly: function (template) {
        var addcommonly = Ext.getCmp('AddCommonly');
        if (addcommonly) {
            OA.client.Localforage.getCommonlyDoc(function (value) {
                if (value) {
                    data = value;
                    var has = false;
                    Ext.Array.each(data, function (item) {
                        if (item.qTemplate == template) {
                            has = true;
                            return false;
                        }
                    });
                    if (has)
                        addcommonly.iconElement.dom.style.color = '#FFFF33';
                    else
                        addcommonly.iconElement.dom.style.color = '';
                }
            });
        }
    }
});