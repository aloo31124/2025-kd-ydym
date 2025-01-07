/**
 * 橋接
 */

Ext.define('OA.common.Bridge', {
    alias: 'common.Bridge',
    requires: ['OA.client.File'],
    statics: {
        /**
         * android / ios callback
         */
        callback: function (base64JsonString) {
            var jsonString = B64.decode(base64JsonString);
            var options = JSON.parse(jsonString);
            //console.log(options.status);
            //console.log(options.message);

            if (options.status.toString() == '1') {
                console.log('callback status = 1 ');                
                OA.common.Bridge.goToManagement(options);
            } else {
                console.log('callback status != 1 ');
                //不提示自動臨憑
                options.tmpCard = 'Y';
                options.status = '';
                options.message = '';
                OA.client.File.doService(options, function (ret) {
                    OA.common.Bridge.goToManagement(options);
                });
                /*
                Ext.Msg.confirm("臨時憑證", "是否使用臨時憑證？", function (ok) {
                    if ('yes' == ok) {
                        options.tmpCard = 'Y';
                        options.status = '';
                        options.message = '';
                        OA.client.File.doService(options, function (ret) {
                            OA.common.Bridge.goToManagement(options);
                        });
                    }
                });
                */
            }
        },
        /**
         * 回到管理頁面
         */
        goToManagement: function (options) {
            var me = this;
            var action = options.methodId;
            var isAuto = options.isAuto;
            var jsonObj = null;
            Ext.getStore('SignAction').each(function (item) {
                if (item.get('methodId') == action) {
                    jsonObj = eval("(" + item.get('BeforeScriptParams') + ")");
                }
            });

            if (action == 'sealDone' || action==='backDraft' || action==='checkDone') { //監印完畢 , 退稿 , 校畢
                // 系統自動關閉不提示訊息 - by yi-chi chiu
                OA.app.autoClose = true;
                localStorage.setItem('oa_isAutoClose', 'true');
                setTimeout(function () {
                    me.doClose();
                }, 500);
                return;
            }
            
            var win = OA.common.Global.getWinOpener();
			var topKdmaker = win.kdMaker;
			var dtreeContent = topKdmaker.getDTreeContent();
            if (action == 'doReview') { //複閱
                dtreeContent.doReview(options.gbDocflowId);
                 // 系統自動關閉不提示訊息 - by yi-chi chiu
                 OA.app.autoClose = true;
                 localStorage.setItem('oa_isAutoClose', 'true');
                setTimeout(function () {
                    me.doClose();
                }, 2000);
                return;
            }

            var $form1 = $("#form1", dtreeContent.document);
            var $online = $("#online", $form1);
            if ($online.length == 0) {
                $form1.append("<input type='hidden' id='online' name='online' value='Y'>");
            } else {
                $online.val("Y");  //標記為線上簽核 online = Y
            }
            if (isAuto) {
                var $isAuto = $("#isauto", $form1);
                if ($isAuto.length == 0) {
                    $form1.append("<input type='hidden' id='isauto' name='isauto' value='Y'>");
                } else {
                    $isAuto.val("Y"); //自動submit
                }
            }

            //批示意見
            var qDesnDescId = '';
            if (action === 'forward' || action === 'approve' || action === 'parallel') qDesnDescId = 'q_dcsnDesc';
            if (qDesnDescId && options.retDesc) {
                var $message = $("input[name='q_dcsnDesc']", $form1);
                var retDesc = options.retDesc;
                if ($message.length == 0) {
                    var h = Ext.String.format("<input type='hidden' id='q_dcsnDesc' name='q_dcsnDesc' value='{0}'>", retDesc);
                    $form1.append(h);
                } else {
                    $message.val(retDesc);
                }
            }

            //下一關
            if (dtreeContent.gbActionButtonFireEvent) {
                Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });
                //console.log('處理中...');
                var reValue = dtreeContent.gbActionButtonFireEvent(jsonObj.buttonName, jsonObj);
                if (!reValue) {
                    Ext.Viewport.setMasked(false);
                    window.focus();
                } else {
                    var qs = OA.common.Global.getQ();
                    qs.reload='N';
                     // 系統自動關閉不提示訊息 - by yi-chi chiu
                OA.app.autoClose = true;
                localStorage.setItem('oa_isAutoClose', 'true');
                    setTimeout(function () {
                        me.doClose();
                    }, 2000);
                }
            } else {
                Ext.Viewport.setMasked(false);
            }
        },
        doExit: function () {
            window.isWarnNotFinished = false;
            var win = OA.common.Global.getWinOpener();
            var topKdmaker = win.kdMaker;
            var dtreeContent = topKdmaker.getDTreeContent();
            // 系統自動關閉不提示訊息 - by yi-chi chiu
            OA.app.autoClose = true;
            localStorage.setItem('oa_isAutoClose', 'true');
            dtreeContent.kdMaker.doExit();
            if (win.showBy == 'parent') {
                if (topKdmaker) topKdmaker.doClose(window); // iframe close
            } else {
                window.close();
            }
        },
        /*
         * 處理 [公文編輯] 確認關閉後, 關閉 前後台 [公文編輯]父子層 dialog 
         */
        doClose: function () {
            // 系統自動關閉不提示訊息 - by yi-chi chiu
            OA.app.autoClose = true;
            localStorage.setItem('oa_isAutoClose', 'true');
            window.isWarnNotFinished = false;
            var win = OA.common.Global.getWinOpener();
            if (win.showBy == 'parent') {
                var topKdmaker = win.kdMaker;
                if (topKdmaker) topKdmaker.doClose(window); // iframe close
            } else {
                window.close();
            }
            parent.document.getElementById('docMaker').style.display = "none"; // 關閉後台 tdym_ap 之 父層
        }
    }
});
