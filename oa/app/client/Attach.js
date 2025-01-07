/**
 * Attach Client
 */

Ext.define('OA.client.Attach', {
    alias: 'client.Attach',
    singleton: true,
    requires: [
        'OA.common.UrlMgr'
    ],
    MIME: {
        doc: 'application/msword',
        dot: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        dotx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
        docm: 'application/vnd.ms-word.document.macroEnabled.12',
        dotm: 'application/vnd.ms-word.template.macroEnabled.12',
        xls: 'application/vnd.ms-excel',
        xlt: 'application/vnd.ms-excel',
        xla: 'application/vnd.ms-excel',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        xltx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
        xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
        xltm: 'application/vnd.ms-excel.template.macroEnabled.12',
        xlam: 'application/vnd.ms-excel.addin.macroEnabled.12',
        xlsb: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
        ppt: 'application/vnd.ms-powerpoint',
        pot: 'application/vnd.ms-powerpoint',
        pps: 'application/vnd.ms-powerpoint',
        ppa: 'application/vnd.ms-powerpoint',
        pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        potx: 'application/vnd.openxmlformats-officedocument.presentationml.template',
        ppsx: 'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
        ppam: 'application/vnd.ms-powerpoint.addin.macroEnabled.12',
        pptm: 'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
        potm: 'application/vnd.ms-powerpoint.template.macroEnabled.12',
        ppsm: 'application/vnd.ms-powerpoint.slideshow.macroEnabled.12',

        odc: 'application/vnd.oasis.opendocument.chart',
        odf: 'application/vnd.oasis.opendocument.formula',
        odg: 'application/vnd.oasis.opendocument.graphics',
        odi: 'application/vnd.oasis.opendocument.image',
        odp: 'application/vnd.oasis.opendocument.presentation',
        ods: 'application/vnd.oasis.opendocument.spreadsheet',
        odt: 'application/vnd.oasis.opendocument.text',

        pdf: 'application/pdf',
        txt: 'text/plain',
        png: 'image/png',
        gif: 'image/gif',
        jpeg: 'image/jpeg',
        jpg: 'image/jpg',
        pcx: 'image/pcx',
        jbig: 'image/jbig',
        tiff: 'image/tiff',
        tif: 'image/tif'
    },
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    load: function (data, callback, download) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var paras = OA.common.Global.getInitParas();
        if (qs.app == 'draft') {
            var orgNo = OA.common.Global.getCurrentDept().orgNo || '';
            paras.orgNo = orgNo;
        }   
        paras.attachs = [data]; // 後端規格為陣列
        var client = Ext.create('OA.model.Attach', paras);
        if (!client) {
            OA.common.Utils.error('OA.model.Attach not found!!');
            Ext.callback(callback(null));
            return;
        }
        //Post attach/getData/  InitParas
        // var url = OA.common.UrlMgr.getHostMake() + 'attach/getData/';
        var url = OA.common.UrlMgr.restUrl('editor', 'attach');
        client.getProxy().setUrl(url);
        client.getProxy().setExtraParams({token: OA.common.UrlMgr.getToken()});
        client.save({
            success: function (record) {
                var att = record.get('attachs')[0];
                if (!att.fileType) att.fileType = att.fileKey.split('.')[1];
                //console.log(record);

                try {
                    var iframe = document.createElement('<iframe name="ifrAtt"></iframe>');
                } catch (e) {
                    var iframe = document.createElement('iframe');
                    iframe.name = 'ifr';
                }

                // 儲存附件 base64 內容
                var reader = client.getProxy().getReader();
                att.fileContent = reader.rawData.data[0].fileContent;

                var fileType = (att.fileType + '').toLowerCase();
                if (fileType == 'pdf' && !download) {
                    var src = me.getDataUriSrc(att);
                    var winSetting = 'width=800,height=600,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no';
                    var popupWindow;
                    popupWindow = window.open(src, 'ifrAtt', winSetting);
                    popupWindow.focus();
                } else {
                    var blob = OA.client.Attach.getBlob(att);
                    saveAs(blob, att.fileKey);
                }
                return;
            },
            failure: function (record, operation) {
                Ext.Viewport.setMasked(false);
                var menuLeft = Ext.Viewport.getMenus().left; //左側nemu     
                if (menuLeft) menuLeft.setMasked(false);
                var message = '';

                if (operation.getResponse() == null) {
                    message = '未正確連線!請檢查網路!';
                } else {
                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                }
                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
            }
        });
    },
    /**
     * 執行模型 ， 異步返回 callback
     */
    upload: function (data, callback) {
        var paras = OA.common.Global.getInitParas();
        paras.attachs = data;
        var client = Ext.create('OA.model.Attach', paras);
        if (!client) {
            OA.common.Utils.error('OA.model.Attach not found!!');
            Ext.callback(callback(null));
            return;
        }
        //Post attach/getData/  InitParas
        var url = OA.common.UrlMgr.getHost() + 'attach/upload/';
        client.getProxy().setUrl(url);
        client.getProxy().setExtraParams({token: OA.common.UrlMgr.getToken()});
        client.save(callback);
    },

    //草稿附件
    loadDraftfFileContent: function (data, callback) {
        var qs = OA.common.Global.getQ();
        var paras = Ext.clone(OA.common.Global.getInitParas());
        paras.doSno = qs.doSno;
        var orgNo = OA.common.Global.getCurrentDept().orgNo || '';
        paras.orgNo = orgNo;

        //console.log(paras);
        paras.attachs = data;
        var client = Ext.create('OA.model.Attach', paras);
        if (!client) {
            OA.common.Utils.error('OA.model.Attach not found!!');
            Ext.callback(callback(null));
            return;
        }
        //Post attach/getData/  InitParas
        // var url = OA.common.UrlMgr.getHostMake() + 'attach/getData/';
        var url = OA.common.UrlMgr.getHost() + 'attach/getDraftData/';

        client.getProxy().setUrl(url);
        client.getProxy().setExtraParams({ token: OA.common.UrlMgr.getToken() });
        client.save({
            success: function (record) {
                var att = record.get('attachs')[0];
                if (callback) callback(att);
            },
            failure: function (record, operation) {
                Ext.Viewport.setMasked(false);
                var menuLeft = Ext.Viewport.getMenus().left; //左側nemu     
                if (menuLeft) menuLeft.setMasked(false);
                var message = '';

                if (operation.getResponse() == null) {
                    message = '未正確連線!請檢查網路!';
                } else {
                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                }
                Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
            }
        });

    },
    /*
    openFile: function (file, callback) {
        var qs = OA.common.Global.getQ();
        var me = this;
        var downloadFile = {}
        var isLocal = false;
        if (file.fileContent)
            isLocal = true;

        Ext.apply(downloadFile, file);
        // 桌面版附件下載一律用簽章元件 - by yi-chi chiu
        //if (downloadFile.folderName !== 'ref' && !isLocal) {

        if (qs.app === 'editor' || qs.app === 'draft' || qs.app === 'offline' || qs.sFlag === 'Y') {
            isLocal = true;
        }

        if (!isLocal) {
            if (Ext.os.is.Desktop) {
                if (file.folderName == 'ref')
                    downloadFile.folderName = 'refAttach';
                //file.folderName = 'big';               
                console.log(file);
               // downloadFile.folderName = 'big';
                OA.common.FileMgr.downloadBig({
                    file: downloadFile
                });
                return;
            }
        }

        if (file.folderName === 'big') {
            downloadFile.folderName = 'attach';
            me.load([file], {
                success: function (record) {
                    var att = record.get('attachs')[0];
                    if (!att.fileType) att.fileType = downloadFile.fileType;
                    if (!att.fileContent) {
                        //先用一般附件去開，找不到內容再用大型附件去處理
                        downloadFile.folderName = 'big';
                        OA.common.FileMgr.downloadBig({ file: downloadFile });
                        if (callback) callback();
                        return;
                    }
                    if (!att.fileType) att.fileType = att.fileKey.split('.')[1];
                    if (getAttachWay === 'dataUri') {
                        if ((Ext.os.deviceType === 'Desktop' && Ext.browser.is.Chrome) || Ext.browser.is.Safari) {
                            var src = me.getDataUriSrc(att);
                            var a = $("<a style='display: none;'/>");
                            a.attr("href", src);
                            a.attr("download", att.fileKey);
                            $("body").append(a);
                            a[0].click();
                            window.URL.revokeObjectURL(file.url);
                            a.remove();
                            // var reader = new FileReader();
                            // reader.onload = function (e) {
                            //     window.location.href = reader.result;
                            // };
                            // reader.readAsDataURL(me.getBlob(att));

                            // safari.self.tab.dispatchMessage('openUrlInNewTab', 'http://www.example.com/');
                            // var newTab =safari.self.browserWindow.openTab();
                        } else if (Ext.os.is.iOS || Ext.os.is.Android) {
                        //    var wnd = window.parent.open('about:blank', '_system');
                        //    var reader = new FileReader();
                        //    reader.onload = function(e) {
                        //        wnd.location.href = reader.result;
                           	
                        //    };
                        //    reader.readAsDataURL(me.getBlob(att));
                        	
                       	// ios === 'trash';
                       	// var tempForm = document.createElement("form");
                       	// tempForm.id = "tmpForm";
                       	// tempForm.method = "post";
                       	// tempForm.action = "../home/docFileDownload.jsp";     
                       	// tempForm.target = "fake";
                       	
                       	// var filePath = document.createElement("input");     
                       	// filePath.type = "hidden";
                       	// filePath.name = "filePath";
                       	// filePath.value = att.filePath;
                       	// tempForm.appendChild(filePath); 
                       	
                       	// var fileName = document.createElement("input");     
                       	// fileName.type = "hidden";
                       	// fileName.name = "fileName";
                       	// fileName.value = att.fileName;
                       	// tempForm.appendChild(fileName); 
                       	
                       	// var fileDisplayName = document.createElement("input");     
                       	// fileDisplayName.type = "hidden";
                       	// fileDisplayName.name = "fileDisplayName";
                       	// fileDisplayName.value = att.fileKey;
                       	// tempForm.appendChild(fileDisplayName); 
                       	
                       	// var fileType = document.createElement("input");     
                       	// fileType.type = "hidden";
                       	// fileType.name = "fileType";
                       	// fileType.value = att.fileType;
                       	// tempForm.appendChild(fileType);      
                       	
                       	// tempForm.addEventListener("submit",function(){ openWindow("fake"); }); 
                       	// document.body.appendChild(tempForm);
                       	// tempForm.submit(); 
                       	// document.body.removeChild(tempForm);   
                       	
                       	// function openWindow(name) {     
                       	// 	window.open('about:blank',name,'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');
                       	// }
                        	
                        	var queryString = "?filePath=" + encodeURIComponent (att.filePath)+ "&fileName=" + encodeURIComponent (att.fileName) + "&fileDisplayName=" + encodeURIComponent (att.fileKey) + "&fileType=" + encodeURIComponent (att.fileType);
                        	var wnd = window.open("../home/docFileDownload.jsp" + queryString);
                        	
                        } else {
                            var blob = me.getBlob(att);
                            saveAs(blob, att.fileKey);
                        }
                    } else if (getAttachWay === 'file') {
                        console.log(att.fileName);
                    }
                    if (callback) callback();
                },
                failure: function (record, operation) {
                    var message = '';
                    if (operation.getResponse() == null) {
                        message = '未正確連線!請檢查網路!';
                    } else {
                        var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                        message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                    }
                    Ext.Msg.show({ message: message, buttons: Ext.MessageBox.YES });
                }
            });           
            return;
        }

        // var getAttachWay = 'url';
        var getAttachWay = 'dataUri';
        if (qs.app === 'editor' || qs.app === 'draft' || qs.app === 'offline' || qs.sFlag === 'Y') {
            OA.common.FileMgr.exec({file: file});
            return;
        }

        var winSetting = 'width=800,height=600,location=yes,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no';
        var popupWindow;
        if (getAttachWay === 'url') {
            popupWindow = window.open(file.url, '附件', winSetting);
            popupWindow.focus();
            return;
        }
        
        me.load([file], {
            success: function (record) {
                var att = record.get('attachs')[0];
                if (!att.fileType) att.fileType = file.fileType;
                if (!att.fileContent) {                    
                    //Ext.Msg.alert('提示', '取不到內容！');
                    //先用一般附件去開，找不到內容再用大型附件去處理
                    downloadFile.folderName = 'big';
                    OA.common.FileMgr.downloadBig({ file: downloadFile });
                    if (callback) callback();
                    return;
                }
                if (!att.fileType) att.fileType = att.fileKey.split('.')[1];
                if (getAttachWay === 'dataUri') {
                    if ((Ext.os.deviceType === 'Desktop' && Ext.browser.is.Chrome) || Ext.browser.is.Safari) {
                        var src = me.getDataUriSrc(att);
                        var a = $("<a style='display: none;'/>");
                        a.attr("href", src);
                        a.attr("download", att.fileKey);
                        $("body").append(a);
                        a[0].click();
                        window.URL.revokeObjectURL(file.url);
                        a.remove();
                        // var reader = new FileReader();
                        // reader.onload = function (e) {
                        //     window.location.href = reader.result;
                        // };
                        // reader.readAsDataURL(me.getBlob(att));

                        // safari.self.tab.dispatchMessage('openUrlInNewTab', 'http://www.example.com/');
                        // var newTab =safari.self.browserWindow.openTab();
                    } else if (Ext.os.is.iOS || Ext.os.is.Android) {
                        //    var wnd = window.parent.open('about:blank', '_system');
                        //    var reader = new FileReader();
                        //    reader.onload = function(e) {
                        //        wnd.location.href = reader.result;
                           	
                        //    };
                        //    reader.readAsDataURL(me.getBlob(att));
                        	
                       	// ios === 'trash';
                       	// var tempForm = document.createElement("form");
                       	// tempForm.id = "tmpForm";
                       	// tempForm.method = "post";
                       	// tempForm.action = "../home/docFileDownload.jsp";     
                       	// tempForm.target = "fake";
                       	
                       	// var filePath = document.createElement("input");     
                       	// filePath.type = "hidden";
                       	// filePath.name = "filePath";
                       	// filePath.value = att.filePath;
                       	// tempForm.appendChild(filePath); 
                       	
                       	// var fileName = document.createElement("input");     
                       	// fileName.type = "hidden";
                       	// fileName.name = "fileName";
                       	// fileName.value = att.fileName;
                       	// tempForm.appendChild(fileName); 
                       	
                       	// var fileDisplayName = document.createElement("input");     
                       	// fileDisplayName.type = "hidden";
                       	// fileDisplayName.name = "fileDisplayName";
                       	// fileDisplayName.value = att.fileKey;
                       	// tempForm.appendChild(fileDisplayName); 
                       	
                       	// var fileType = document.createElement("input");     
                       	// fileType.type = "hidden";
                       	// fileType.name = "fileType";
                       	// fileType.value = att.fileType;
                       	// tempForm.appendChild(fileType);      
                       	
                       	// tempForm.addEventListener("submit",function(){ openWindow("fake"); }); 
                       	// document.body.appendChild(tempForm);
                       	// tempForm.submit(); 
                       	// document.body.removeChild(tempForm);   
                       	
                       	// function openWindow(name) {     
                       	// 	window.open('about:blank',name,'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes');
                       	// }
                        	
                    var queryString = "?filePath=" + encodeURIComponent (att.filePath)+ "&fileName=" + encodeURIComponent (att.fileName) + "&fileDisplayName=" + encodeURIComponent (att.fileKey) + "&fileType=" + encodeURIComponent (att.fileType);
                    var wnd = window.open("../home/docFileDownload.jsp" + queryString);

                    } else {
                        var blob = me.getBlob(att);
                        saveAs(blob, att.fileKey);
                    }
                } else if (getAttachWay === 'file') {
                    console.log(att.fileName);
                }
                if (callback) callback();
            },
            failure: function (record, operation) {
                var message = '';
                if (operation.getResponse() == null) {
                    message = '未正確連線!請檢查網路!';
                } else {
                    var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                    message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                }
                Ext.Msg.show({message: message, buttons: Ext.MessageBox.YES});
            }
        });
    },
    */
    getDataUriSrc: function (att) {
        var _fileType = att.fileType.toLowerCase();
        var _fileContent = att.fileContent;
        var mime = this.MIME[_fileType];
        //http://stackoverflow.com/questions/695151/data-protocol-url-size-limitations
        if (!mime) mime = 'application/' + _fileType;
        var blob = this.b64toBlob(_fileContent, mime);
        //Console.log(URL.createObjectURL(blob));
        return URL.createObjectURL(blob);
       
    },
    getBlob: function (att) {
        var _fileType = att.fileType.toLowerCase();
        var mime = this.MIME[_fileType];
        if (!mime) mime = 'application/' + _fileType;
        return this.b64toBlob(att.fileContent, mime);
    },
    iframeReadAsDataURL: function (att, iframe) {
        var blob = this.getBlob(att);
        var reader = new FileReader();
        reader.onload = function(e) {
        	// 解決行動版pdf無法載入問題 - by yi-chi chiu
        	if(!reader.result.indexOf('application/pdf') || Ext.os.is.IOS)
        		frames[0].location.href = reader.result;
        };
        reader.readAsDataURL(blob);
         // 解決行動版pdf無法載入問題 - by yi-chi chiu
         if (reader.result.indexOf('application/pdf')) {
            // IOS PDF另開新視窗 - by yi-chi chiu
            var iBody = '<a href="' + URL.createObjectURL(blob) + '" download" >點此下載/載入PDF</a>';
            // document.getElementById("subFrame").contentWindow.document.body.innerHTML = iBody;
            if(!Ext.os.is.ios) {
                document.getElementById("subFrame").contentWindow.document.body.innerHTML = iBody;
            }
            else {
                document.getElementById("subFrame").contentWindow.document.body.innerHTML = "欲開啟來文PDF請從版本資訊開啟";
                if(OA.app.initExcept > 0)
                    document.getElementById("subFrame").contentWindow.open(URL.createObjectURL(blob));
                OA.app.initExcept++;
            }
        }
    },
    showByFrame: function (att, iframe) {
        try {
            if (Ext.os.is.Android || Ext.os.is.iOS) {
                this.iframeReadAsDataURL(att, iframe);
            } else {
                iframe.src = this.getDataUriSrc(att);
            }
        }
        catch (e) {  // not support
            var blob = OA.client.Attach.getBlob(att);
            saveAs(blob, att.fileKey);
        }
    },
    windowOpenDataUri: function (file) {
        var src = this.getDataUriSrc(file);
        var popupWindow = window.open(src, file.fileKey);
        if (popupWindow) popupWindow.focus();
    },
    saveData: function (att) {

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";

        return function (data, fileName) {
            var json = JSON.stringify(data),
                blob = new Blob([json], {type: "octet/stream"}),
                url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    },
    b64toBlob: function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

});