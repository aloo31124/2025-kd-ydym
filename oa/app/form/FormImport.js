/*
 滙入
 */

Ext.define('OA.form.FormImport', {
    extend: 'Ext.Panel',
    alias: 'widget.FormImport',
    xtype: "FormImport",
    config: {
        width: 400,
        height: 240,
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
                    {
                        id: 'butFileImExport',
                        text: '選擇檔案',
                        action: 'new'         //initialize  addEventListener('click')
                    },
                    /*
                    {
                        xtype: 'selectfield',
                        name: 'fileExt',
                        valueField: 'key',
                        displayField: 'value',
                        store: {
                            data: [
                                //  {value: 'xdi', key: 'xdi'},
                                //{ value: 'di', key: 'di' },
                                { value: 'bin', key: 'bin' }
                            ]
                        },
                        listeners: {
                            change: function (ctr, Value) {
                                console.log(Value);
                            }
                        },
                        value: 'di'
                    },
                    */
                    { xtype: 'spacer' },
                    {
                        ui: 'plain', text: '✖', action: 'no',
                        handler: function (button) {
                            button.up('panel').hide();
                            var store = Ext.getStore('Attach');
                            if (store) store.clearFilter();
                        }
                    },
                ]
            },
            {
                id: 'labFilePath',
                xtype: 'label',
                html: '未選擇任何檔案',
                centered: true
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [                   
                    {xtype: 'spacer'},
                    {
                        text: '確定',
                        action: 'yes',
                        ui: 'confirm',
                        handler: function (button, e, eOpts) {
                            var panel = button.up('panel');
                            var xml = panel.getXmlContent();

                            var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');

                            if (Ext.getCmp('labFilePath').getHtml() === '未選擇任何檔案') {
                                Ext.Msg.alert('提示', '請選擇檔案');
                            } else {
                                ctrWK.updateDocAreaHidden('clearPaper');
                                ctrWK.updateDocAreaHidden('edit', 'edit');

                                var fileType = panel.getFileType();
                                if (fileType) {
                                    if (fileType == 'bin') {
                                        if (!OA.common.Paper.main()) {
                                            Ext.Msg.alert('提醒', '須先創文稿！');
                                            return;
                                        }
                                    } 
                                    OA.common.Paper.main().importXML(xml, fileType);
                                    panel.hide();
                                }
                            }
                        }
                    }
                ]
            }
        ],
        xmlContent: null,
        fileType:''
    },
    initialize: function () {
        var me = this;
        //var ctrFileExt = me.query('selectfield[name=fileExt]')[0];

        var r = new Resumable({ target: 'index.html', fileType: ['bin','di'], maxFiles: 1 });

        var again = false;
        var reader = new FileReader();

        me.setXmlContent(null);  //初始化

        reader.onloadend = function () {
            var name = reader.source.name;
            var xml = reader.result;

            if (name.indexOf('.bin') >= 0) { //0610 判別檔案是否為bin檔 Chloe.sia
                Ext.getCmp('labFilePath').setHtml(name);
                var dom = parseXmlString(xml);
                var verWork = dom.querySelector("VerWork");
                var xmlWK = verWork.getAttribute('DocumentType');
                var dataWK = OA.common.Global.getCurrentWKContent().DocumentType;

                if (xmlWK != dataWK) {  //0610 判別目前文稿類型 DocumentType 是否與bin檔 DocumentType 是否一致 Chloe.sia
                    Ext.Msg.alert('提示', '請選擇與文稿格式相同的bin檔！');
                    Ext.getCmp('labFilePath').setHtml('未選擇任何檔案');
                    return;
                }
                me.setFileType('bin')
            } else {
                me.setFileType('di')
            }

            if (!again) {
                var isbig5 = xml.indexOf('encoding="big5"') >= 0;
                if (isbig5) {
                    reader.readAsText(reader.source, 'big5');
                    again = true;
                }
            }
            Ext.getCmp('labFilePath').setHtml(name);
            me.setXmlContent(xml);
        };

        var ctr = Ext.getCmp('butFileImExport');
        r.assignBrowse(ctr.element.dom);           // addEventListener('click')
        r.on('fileAdded', function (file, event) {
            r.upload();
        });
        r.on('fileSuccess', function (rf) {
            again = false;
            reader.source = rf.file;
            //var fileExt = ctrFileExt.getValue();
            reader.readAsText(rf.file);
            r.removeFile(rf);
        });
        r.on('error', function (message, rf) {
        });
        //r.on('fileProgress', function (rf) {
        //});
    },
    create: function () {
        Ext.getCmp('labFilePath').setHtml('未選擇任何檔案');
    }
});