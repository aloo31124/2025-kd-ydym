/**
 * Phrase Client
 */

Ext.define('OA.client.Phrase', {
    alias: 'client.Phrase',
    singleton: true,
    requires: ['OA.common.UrlMgr', 'OA.model.Phrase'],
    /**
     * 執行模型 ， 異步返回 callback
     *
     * @param {String} options
     * @param {Function} callback
     */
    excute: function (options, callback) {
        var me = this;

        var client = Ext.create('OA.model.Phrase', options);
        var methodId = options.action;
        client.getProxy().setUrl(OA.common.UrlMgr.restUrl('editor', "phrase/" + methodId));
        client.getProxy().setExtraParams({token: OA.common.UrlMgr.getToken()});
        
        //Post phrase/query/  Phrase
        Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });
        //console.log('處理中...');
        client.save({
            success: function (record, operation) {
                Ext.Viewport.setMasked(false);
                var resp = (Ext.JSON.decode(operation.getResponse().responseText)).data;
                if (resp) {
                    if (options.kindNo === '027') { //單位詞庫 處理
                        var commPhrae = ['如擬', '可', '發', '同意'];
                        var inputPhrae = [];
                        Ext.Array.each(commPhrae, function (data) {
                            if(!resp.children) return; //單位詞庫無效處理,可[刪除,修改]後刷新詞庫。
                            var has= Ext.Array.filter(resp.children, function (item) {
                                if (item.phrase == data) return true;
                            });
                            if (has.length == 0)
                                inputPhrae.push({ phrase: data, phraseId: '', phraseNo: '' });
                        });
                        if (inputPhrae.length > 0)
                            resp.children = inputPhrae.concat(resp.children);;                       
                    }
                    Ext.getStore('Phrase').setData(resp.children);
                    if (callback) Ext.callback(callback(resp));
                }
            },
            failure: function (record, operation) {
                Ext.Viewport.setMasked(false);
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
    }
});