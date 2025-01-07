Ext.define("OA.store.CaseNo", {
    extend: 'Ext.data.Store',
    alias: 'store.CaseNo',
    requires: ['OA.model.CaseNo'],
    config: {
        model: 'OA.model.CaseNo',
        proxy: {
            type: 'ajax',  // 使用 ajax 代理
            url: '',  // 將根據條件動態設置 URL
            method: 'GET',  // 預設為 GET，若需要 POST 可修改
            useDefaultXhrHeader: false,
            cors: true,
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
                'Content-Type': 'application/json'
            },
            reader: {
                type: 'json'
            }
        }
    }
});