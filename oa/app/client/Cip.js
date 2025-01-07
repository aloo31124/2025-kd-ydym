/**
 * Cip Client
 */
Ext.define('OA.client.Cip', {
    alias: 'client.Cip',
    singleton: true,
    requires: ['OA.common.UrlMgr','OA.model.Cip'],
    /**
     */
    load: function (options, callback) {
        var h =OA.common.UrlMgr.restUrl('cip',options.jobNo);
        var url = Ext.String.format('{0}?doDeptno={1}&doSno={2}', h,options.doDeptno, options.doSno);

        Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });
        //console.log('處理中...');
        var store = Ext.getStore('Cip');
        store.getProxy().setUrl(url);
        store.load({
            callback: function (records, operation, success) {
                Ext.Viewport.setMasked(false);
                if (success){
                    if (callback) callback(records[0]);
                }else{
                    var message = '';
                    if (operation.getResponse() == null) {
                        message = '未正確連線!請檢查網路!';
                    } else {
                        var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                        message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                    }
                    Ext.Msg.show({message: message, buttons: Ext.MessageBox.YES});
                }
            }
        });
    }
});