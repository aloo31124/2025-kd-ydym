Ext.define("OA.store.DocFlow", {
    extend: 'Ext.data.Store',
    alias: 'store.DocFlow',
    config: {
        model: 'OA.model.DocFlow',
        autoLoad: false,
        clearOnPageLoad: true,
        pageSize: 10,
        proxy: {
            type: 'rest',
            useDefaultXhrHeader: false,
            cors: true,
            headers: {
                'Accept': 'application/json'
            },
            reader: {
                type: 'json',
                rootProperty: 'items'
            }
        }
    },
    update: function (jobno) {
        var url = OA.common.UrlMgr.restUrl('docflow',jobno);

        this.setProxy({url:url});
        this.currentPage=1;
        this.load();
    }

});
