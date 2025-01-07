/*
 滙出
 */
Ext.define('OA.form.FormExport', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormExport',
    xtype: "FormExport",
    config: {
        width: 400,
        height: 240,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            labelWidth: '20%'
        },
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    {
                        xtype: 'selectfield',
                        name: 'fileExt',
                        valueField: 'key',
                        displayField: 'value',
                        store: {
                            data: [
                                // {value: 'pdf', key: 'pdf'},
                                { value: 'bin（封包檔）', key: 'bin' },
                                { value: 'di（可再匯入）', key: 'di' },
                                { value: 'di（含地址，可再匯入）', key: 'ADDRdi' },
                                // {value: 'sw', key: 'sw'},
                                // {value: 'jpg', key: 'jpg'},
                                // {value: 'tiff', key: 'tiff'},
                                // {value: 'png', key: 'png'},
                                // {value: 'rtf', key: 'rtf'},
                                // { value: '交換檔', key: 'change' },
                                // { value: 'TXT', key: 'txt' }
                            ]
                        },
                        value: 'di'
                    },
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
                        label: '檔名：',
                        xtype: 'textareafield',
                        name: 'fileName',
                    }
                ]
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [                   
                    { xtype: 'spacer' },                    
                    {
                        text: '確定',
                        action: 'yes',
                        ui: 'confirm',
                        handler: function (button, e, eOpts) {
                            var panel = button.up('panel');
                            panel.doExport();
                            panel.hide();
                        }
                    }
                ]
            }
        ]
    },
    create: function () {
        var ctr = this.query('textfield[name=fileName]')[0];
        var ctrFileExt = this.query('selectfield[name=fileExt]')[0];
        var name = Ext.util.Format.date(new Date(), "mdHi");
        if (ctr) ctr.setValue(name);
        var qd = OA.common.Global.getQueryDefault();
        var isDwPage = qd.頁面檔;

        var data = [];
        if ("Y" == isDwPage) {
            Ext.Array.each(ctrFileExt.getStore().getData().all, function (r) {
                if (r.data.key != 'dwSignFile') data.push(r.data);
            });
            data.push({ value: '匯出簽核檔', key: 'dwSignFile' });
            ctrFileExt.getStore().setData(data);
        }

        var qs = OA.common.Global.getQ();
        if (qs.app === 'offline') {
            data.push({ value: 'di', key: 'di' });
            data.push({ value: 'sw', key: 'sw' });
            data.push({ value: 'xdi', key: 'xdi' });
            data.push({ value: 'di（含地址）', key: 'ADDRdi' });

            // data.push({value: 'pdf', key: 'pdf'});
            // data.push({value: 'jpg', key: 'jpg'});
            // data.push({value: 'tiff', key: 'tiff'});
            // data.push({value: 'png', key: 'png'});
            // data.push({value: 'zip', key: 'zip'});
            data.push({ value: 'rtf', key: 'rtf' });
            data.push({ value: '交換檔', key: 'change' }); //離線用
            ctrFileExt.getStore().setData(data);
        }
    },
    doExport: function () {
        var me = this;
        var qs = OA.common.Global.getQ();
        var success = OA.common.Paper.main().saveKDRichTextBlock();
        if (success == false) return;

        var defaultPath = OA.common.FileMgr.getDefaultPath();
        var openFolder = OA.common.FileMgr.getOpenDialogPath();

        var vm = OA.common.Global.getCurrentViewModel();

        var data = me.getValues() || {};
        data.fullname = data.fileName + '.' + data.fileExt;
        var blob;
        if (data.fileExt == 'di') {
            var options = { isExport: true };
            var xdi = OA.common.DIMgr.generateXDI(options);
            blob = new Blob([xdi], { type: "application/xml;charset=utf-8" });
            saveAs(blob, data.fullname);
        } else if (data.fileExt == 'sw') {
            var xsw = OA.common.VIMgr.getXSWSend();
            blob = new Blob([xsw], { type: "application/xml;charset=utf-8" });
            saveAs(blob, data.fullname);
        } else if (data.fileExt == 'rtf') {
            var html = OA.common.Global.getApp().getController('OA.controller.Work').toPrintXml();
            var xmlDoc = $.parseHTML(html), $xml = $(xmlDoc), item = [], s = '';
            $xml.find(".gContent > text").each(function (i, el) {
                if (el.id.indexOf('會辦單位') >= 0) return true;
                s = s + el.textContent;
                if (el.id.indexOf('_title') <= 0) {
                    var isAppend = true;
                    if (el.id.indexOf('KDRichTextBlock') >= 0 && el.id.indexOf('_context') <= 0) isAppend = false;
                    if (isAppend) {
                        item.push(s.trim());
                        s = '';
                    }
                }
            });
            var richText = item.join('\r\n');
            blob = new Blob([richText], { type: "application/rtf;charset=utf-8" });
            saveAs(blob, data.fullname);
        } else if (data.fileExt == 'xdi') {
            var b64di = B64.encode(OA.common.DIMgr.generateXDI());
            blob = new Blob([b64di], { type: "application/xml;charset=utf-8" });
            saveAs(blob, data.fullname);
        } else if (data.fileExt == 'ADDRdi') {
            var options = { isAddr: true, isExport: true };
            var xdi = OA.common.DIMgr.generateXDI(options);
            blob = new Blob([xdi], { type: "application/xml;charset=utf-8" });
            saveAs(blob, data.fileName + '.di');
        } else if (data.fileExt == 'change') {
            var paras = OA.common.Global.getInitParas();
            if (qs.app === 'offline') {
                var zip = new JSZip();
                var files = [];
                var store = Ext.getStore('Attach');
                Ext.Array.each(store.getData().all, function (attach) {
                    var f = attach.get('file');
                    if (f.status.toString() === '1') files.push(f);
                });
                OA.common.FileMgr.loadAttach({ files: files }, function (ret) {
                    blob = new Blob([OA.common.DIMgr.generateXDI({ swFileName: paras.paperNo + '.sw' })], { type: "application/xml;charset=utf-8" });
                    zip.file(paras.paperNo + '.di', blob);

                    var attach = zip.folder("attch");

                    blob = new Blob([OA.common.VIMgr.getXSWSend()], { type: "application/xml;charset=utf-8" });
                    attach.file(paras.paperNo + '.sw', blob);
                    Ext.Array.each(ret.files, function (raw) {
                        attach.file(raw.fileName, B64.toBlob(raw.fileContent));
                    });

                    zip.generateAsync({ type: "blob" })
                        .then(function (blob) {
                            saveAs(blob, data.fileName + ".zip");
                        });
                });
            } else {
                paras = OA.common.InitParas.doExport(data);
                paras.func = 'doFile';
                paras.action = 'doExport';
                paras.biginfo = OA.common.VIMgr.getViContent().入徑.大型資訊;

                paras.defaultPath = defaultPath;
                paras.folder = openFolder.replace(defaultPath, '');

                // OA.client.File.doFile(paras, function (ret) {
                //     console.log('doExport success!');
                // });
            }

            // OA.common.Funcs.show('FormSend');
        } else if (data.fileExt == 'dwSignFile') {
            //處理下載簽核檔
            var paras = OA.common.InitParas.doExport(data);
            paras.func = 'doFile';
            paras.action = 'doExportDC';
            paras.biginfo = OA.common.VIMgr.getViContent().入徑.大型資訊;
            // OA.client.File.doFile(paras, function (ret) {
            //     console.log('doExport success!');
            // });

        } else if (data.fileExt == 'txt') {
            var options = { isAddr: true, isExport: true };
            var xdi = OA.common.DIMgr.generateXDI(options);
            blob = new Blob([xdi], { type: "application/xml;charset=utf-8" });
            saveAs(blob, data.fileName + '.txt');
        } else if (data.fileExt == 'bin') {
            var newWK = OA.common.DIMgr.wkToXml();
            blob = new Blob([newWK], { type: "application/xml;charset=utf-8" });
            saveAs(blob, data.fileName + '.bin');
        } else {
            //if (qs.app === 'offline') {
            //    OA.common.Global.getApp().getController('OA.controller.Work').exportCanvas(data);
            //} else {
            //    var ctr = OA.common.Global.getApp().getController('OA.controller.Work');
            //    var options = {
            //        func: 'doFile',
            //        action: 'fileto',
            //        xml: ctr.toPrintXml(),
            //        name: data.fullname,
            //        ext: data.fileExt
            //    };
            //    OA.client.File.doFile(options, function (ret) {
            //    });
            //}
            if (qs.app === 'offline') {
                OA.common.Global.getApp().getController('OA.controller.Work').exportCanvas(data);
            } else {
                var ctr = OA.common.Global.getApp().getController('OA.controller.Work');
                ctr.onExportTap(data);
                //var options = {
                //    func: 'doFile',
                //    action: 'fileto',
                //    xml: ctr.toPrintXml(),
                //    name: data.fullname,
                //    ext: data.fileExt
                //};
                //OA.client.File.doFile(options, function (ret) {
                //});
            }
        }
    },
    convertHtmlToRtf: function (html) {
        if (!(typeof html === "string" && html)) {
            return null;
        }
        var tmpRichText, hasHyperlinks;
        var richText = html;

        // Singleton tags
        richText = richText.replace(/<(?:hr)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard \\brdrb \\brdrs \\brdrw10 \\brsp20 \\par}\n{\\pard\\par}\n");
        richText = richText.replace(/<(?:br)(?:\s+[^>]*)?\s*[\/]?>/ig, "{\\pard\\par}\n");

        // Empty tags
        richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?\s*[\/]>/ig, "{\\pard\\par}\n");
        richText = richText.replace(/<(?:[^>]+)\/>/g, "");

        // Hyperlinks
        richText = richText.replace(
            /<a(?:\s+[^>]*)?(?:\s+href=(["'])(?:javascript:void\(0?\);?|#|return false;?|void\(0?\);?|)\1)(?:\s+[^>]*)?>/ig,
            "{{{\n");
        tmpRichText = richText;
        richText = richText.replace(
            /<a(?:\s+[^>]*)?(?:\s+href=(["'])(.+)\1)(?:\s+[^>]*)?>/ig,
            "{\\field{\\*\\fldinst{HYPERLINK\n \"$2\"\n}}{\\fldrslt{\\ul\\cf1\n");
        hasHyperlinks = richText !== tmpRichText;
        richText = richText.replace(/<a(?:\s+[^>]*)?>/ig, "{{{\n");
        richText = richText.replace(/<\/a(?:\s+[^>]*)?>/ig, "\n}}}");

        // Start tags
        richText = richText.replace(/<(?:b|strong)(?:\s+[^>]*)?>/ig, "{\\b\n");
        richText = richText.replace(/<(?:i|em)(?:\s+[^>]*)?>/ig, "{\\i\n");
        richText = richText.replace(/<(?:u|ins)(?:\s+[^>]*)?>/ig, "{\\ul\n");
        richText = richText.replace(/<(?:strike|del)(?:\s+[^>]*)?>/ig, "{\\strike\n");
        richText = richText.replace(/<sup(?:\s+[^>]*)?>/ig, "{\\super\n");
        richText = richText.replace(/<sub(?:\s+[^>]*)?>/ig, "{\\sub\n");
        richText = richText.replace(/<(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "{\\pard\n");

        // End tags
        richText = richText.replace(/<\/(?:p|div|section|article)(?:\s+[^>]*)?>/ig, "\n\\par}\n");
        richText = richText.replace(/<\/(?:b|strong|i|em|u|ins|strike|del|sup|sub)(?:\s+[^>]*)?>/ig, "\n}");

        // Strip any other remaining HTML tags [but leave their contents]
        richText = richText.replace(/<(?:[^>]+)>/g, "");

        // Prefix and suffix the rich text with the necessary syntax
        // richText =
        //     "{\\rtf1\\ansi\n" + (hasHyperlinks ? "{\\colortbl\n;\n\\red0\\green0\\blue255;\n}\n" : "") + richText +
        //     "\n}";
        // richText =
        //     "{\\rtf1\\ansi\\ansicpg950\\cocoartf1504\\cocoasubrtf810{\\fonttbl\\f0\\fnil\\fcharset136 DFKaiShu-SB-Estd-BF;}{\\colortbl;\\red255\\green255\\blue255;}{\\*\\expandedcolortbl;;}\\paperw11900\\paperh16840\\margl1440\\margr1440\\vieww10800\\viewh8400\\viewkind0\\pard\\tx566\\tx1133\\tx1700\\tx2267\\tx2834\\tx3401\\tx3968\\tx4535\\tx5102\\tx5669\\tx6236\\tx6803\\pardirnatural\\partightenfactor0\\f0\\fs24 \\cf0 " + richText + "}";


        return richText;
    }
});