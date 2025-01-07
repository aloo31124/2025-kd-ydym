Ext.define("OA.store.History", {
    extend: 'Ext.data.Store',
    alias: 'store.History',
    config: {
        model: 'OA.model.History',
        autoLoad: false,
        clearOnPageLoad: false,
        pageSize: 20,
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            cors: true,
            reader: {
                type: 'json',
                rootProperty: '簽核歷程列表.簽核歷程'

            }
        }
    },
    execute: function (dosno, callback) {

        this.setProxy({url: OA.common.UrlMgr.restUrl('history', dosno)});
        this.currentPage = 1;
        this.load(function (record, operation, success) {
            //console.log(record);
            if (success) {
                Ext.callback(callback(record));
            } else {
                //console.log(operation);

                Ext.callback(callback(null));
            }
        });
    }
});