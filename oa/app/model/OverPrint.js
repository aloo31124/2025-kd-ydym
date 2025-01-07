Ext.define('OA.model.OverPrint', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'name',      // 受文者
            'category',  // 本別
            'docNo',     // 文號
            'addNo',     // 郵遞區號
            'addr',      // 地址
            'signname',  // 署名
            'level',     // 分層負責
            'variable',  // 變數
            'original',  // 正本
            'duplicate'  // 副本
            
        ]
    }
});