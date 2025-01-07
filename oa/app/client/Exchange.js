/**
 * Exchange Client
 */
Ext.define('OA.client.Exchange', {
    alias: 'client.Exchange',
    singleton: true,
    requires: [
        'OA.common.UrlMgr','OA.model.Exchange'
    ],
    constructor: function (config) {
        this.initConfig(config);
        return this;
    },
    /**
     * epaper  N 紙本交轉換不簽章
     * tmpCard Y 臨憑簽章 N預備簽章SI，待簽章元件簽章
     */
    excute: function (options, callback) {
        var dr = OA.common.Global.getCurrentDocFlowRecord();
        var epaper = dr.get('epaper');
        var tmpCard = options.tmpCard;
        var methodId = (options.methodId) ? options.methodId : 'excute';

        var p =[];
        if (options.tmpCard) p.push('tmpCard=' + tmpCard);
        if (options.isBatchExchange) p.push('isBatchExchange=Y');
        var url = OA.common.UrlMgr.restUrl('exchange', methodId) + '?epaper=' + epaper + '&' + p.join('&');
        var client = Ext.create('OA.model.Exchange', options);
        client.getProxy().setUrl(url);       
        client.getProxy().setExtraParams({token: OA.common.UrlMgr.getToken()});
        client.getProxy().setTimeout(1800000);
        // console.log(options);
        // return;

        var form =options.form || Ext.Viewport;
        form.setMasked({ xtype: 'loadmask', message: '轉交換處理中...' });
        var menuLeft = Ext.Viewport.getMenus().left;
        if (menuLeft) menuLeft.setMasked(true);
        client.save({
            success: function (record, operation) {
                if (options.methodId == 'exchange') {
                    form.setMasked(false);
                    var menuLeft = Ext.Viewport.getMenus().left;
                    if (menuLeft) menuLeft.setMasked(false);
                }
                if (callback) {
                    callback(record);
                } else {
                    Ext.Msg.alert('完成!');
                }
            },
            failure: function (record, operation) {
                form.setMasked(false);
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