Ext.define('OA.model.Dcsn', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'dcsnEmplNo', // 決行長官
            'dcsnLevel',  // 決行層級 A11,A12,A21,A31,A41
            'dcsnDate',   // 決行日期
            'dcsnTime',   // 決行時間
            'dcsnDesc'    // 決行說明
        ]
    }
});