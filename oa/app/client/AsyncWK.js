/**
 * WK Client
 */

Ext.define('OA.client.AsyncWK', {
    alias: 'client.AsyncWK',
    singleton: true,
    requires: [
        'OA.common.UrlMgr', 'OA.model.AsyncWK'
    ],
    config: {},
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },

    /**
     * 執行模型 ， 異步返回 callback
     *
     * OA.common.DIMgr.asynExcute('OA.model.wk.Letter', '10300010001.di', function (xSVG, record) {})
     *
     * @param {String} options
     * @param {Function} callback
     */
    load: function (record, callback) {
        var doSno = record.get('doSno');
        var dialogType = record.get('dialogType');
        var gbDocflowId = record.get('gbDocflowId');
        var docType = record.get('docType');

        var roleId = record.get('roleId');
        var folderId = record.get('folderId');
        var actionId = record.get('actionId');
        var FlowUri = record.get('FlowUri');

        var version = record.get('version');
        var docflow = OA.common.Global.getCurrentDocFlowRecord();
        var epaper = docflow.get('epaper');
        var doDeptno = docflow.get('doDeptno');
        var paperNo = record.get('paperNo');
        var initParas = OA.common.Global.getInitParas();
        if (!documentType && initParas) var documentType = initParas.documentType;
        if (!kind && initParas) var kind = initParas.kind;
        if (!epaper && initParas) epaper = initParas.epaper;
        if (!doDeptno && initParas) doDeptno = initParas.doDeptno;

        if (docflow.get('docType') && !docType) docType = docflow.get('docType');

        var data = {
            "dialogType": dialogType,
            "doSno": doSno,
            'folderId': folderId,
            'actionId': actionId,
            'subRoleId': roleId,
            'subFolderId': folderId,
            'subActionId': actionId,
            "gbDocflowId": gbDocflowId,
            "docType": docType,
            "epaper": epaper,
            'doDeptno': doDeptno,
            'version': version,
            'flowUri': FlowUri,
            'paperNo': paperNo + '',
            'documentType': documentType,
            'kind': kind
        };

        var paras = OA.common.InitParas.readVI(data);
        var client = Ext.create('OA.model.AsyncWK', paras);

        //Post wk/getData/  InitParas
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('editor','AsyncWK'));
        //console.log(client.getProxy().getUrl());
        client.getProxy().setExtraParams({ token: OA.common.UrlMgr.getToken() });
        client.getProxy().setTimeout(1800000);
        client.save({
            success: function (record, operation) {
                var reader = record.getProxy().getReader();
                var asyncWK = reader.rawData.data.asyncWK


                var unPush = [];
                //先滤出VI中的會辦版號，跟版號0的部份
                var vi = OA.common.VIMgr.getViContent();
                if (vi) {
                    Ext.Array.each(vi.版次, function (item) {
                        //console.log(item);
                        // 取號前的版本, [追修] 不顯示
                        unPush.push('0');
                        if (item.簽核人員) {
                            if (item.簽核人員.是否會辦 && item.簽核人員.是否會辦 == '是') {
                                unPush.push(item.版號);
                            }
                        }
                    })
                }

                //console.log(unPush);

                var oSvgAsync = [];
                //console.log(asyncWK);
                xmlDoc = $.parseXML(asyncWK);
                //var dom = parseXmlString(asyncWK);
                var $xml = $(xmlDoc);
                $xml.find('ContactList').each(function (i, ph) {
                    ph.parentNode.removeChild(ph);
                });

                var wks = JSON.parse(xml2json(xmlDoc));
                var asyncrs = [];//準備接收等等的rs內容
                //console.log(wks);
                if (wks && wks.childNodes && wks.childNodes.length > 0) {
                    Ext.Array.each(wks.childNodes, function (wk, index) {
                        if (wk.childNodes == undefined && wk.VerWork) {
                            wk.childNodes = wk.VerWork;
                        }

                        wk = OA.common.DIMgr.wkCleanUp(wk);
                        if (unPush.indexOf(wk.Version) != -1) return true;
                        var modelName = OA.common.DIMgr.getModelName('wk', wk.DocumentType);
                        if (modelName === 'FORMATS_NOT_FOUND') return { err: '找不到文稿格式模型', code: modelName };

                        var asyncRecord = Ext.create(modelName);
                        var fields = asyncRecord.getFields().map['layout'].config.mapping();
                        OA.client.WK.setCurrentModelName(modelName);
                        var normalizedWk = wk.hasOwnProperty('data') ? wk : { data: wk };
                        // 使用 normalizedWk 來讀取記錄
                        var readResult = asyncRecord.getProxy().getReader().readRecords(Ext.clone(normalizedWk));
                        // 調試並檢查讀取結果
                        console.log("readResult:", readResult);
                        if (readResult && readResult.getRecords) {
                            var records = readResult.getRecords();
                            if (records.length > 0) {
                                readResult = Ext.clone(records[0]);
                                console.log("rs:", readResult); // 檢查 readResult 是否包含期望數據
                            } else {
                                console.warn("No records found in readResult.");
                            }
                        } else {
                            console.error("Failed to read records from wk.");
                        }
                        //var rs = asyncRecord.getProxy().getReader().readRecords(Ext.clone(wk)).getRecords()[0];
                        var domColors = OA.common.Global.getDomColors();
                        //var domColor = domColors.querySelector("Root > Color[Version='" + wk.Version + "']");
                        //console.log(domColor);
                        readResult.data.KDRichTextBlock.items[0].tag != "" ? "" : readResult.data.KDRichTextBlock.items = [];
                        asyncrs.push(readResult);//讓所有出現的內容存近來
                        var oSVG = OA.common.DIMgr.generateSvg(modelName, readResult, { isAsync: true });
                        oSVG.wk = wk;
                        oSVG.domColors = domColors;
                        oSVG.fields = fields;
                        oSVG.index = index;
                        oSVG.rs = readResult;
                        oSVG.modelName = modelName;
                        oSvgAsync.push(oSVG);
                    });
                    OA.common.Global.setOSvgAsync(oSvgAsync);
                    //console.log(OA.common.Global.getOSvgAsync());
                    Ext.callback(callback());
                }
                window.asyncrs = asyncrs;//把asyncrs內容存放到window裡面讓追蹤修訂視窗做使用
                window.getasyncrs = function () {//在 window開一個function使我們抓地到asyncrs資料
                    return asyncrs;
                };
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
    }
});