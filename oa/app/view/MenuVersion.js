Ext.define('OA.view.MenuVersion', {
    id: 'menuVersion',
    extend: 'Ext.Container',
    xtype: 'menuVersion',
    requires: [
        'Ext.dataview.DataView',
        'Ext.dataview.List',
        'OA.model.DocFlow',
        'Ext.plugin.ListPaging',
        'Ext.plugin.PullRefresh'],
    config: {
        layout: "vbox",
        items: [
            {
                xtype: 'toolbar',
                title: '版本資訊',
                cls: 'segFolder-selector',
                style: {
                    'background-color': '#008000',
                    'color': 'white'
                },
                ui: "plain",
                items: [
                    {xtype: 'spacer'},
                    {
                        ui: "plain",
                        right: 0,
                        text: 'X',
                        action: 'close',
                        style: {
                            'color': 'white'
                        }
                    }
                ]
            },
            {
                xtype: 'list',
                flex: 1,
                emptyText: '沒有文件',
                loadingText: "Loading...",
                mode: "SINGLE",
                store: 'History',
                indexBar: false,
                itemTpl: '<p style="font-size:90%;text-align: left;line-height: 200%;" class="version-user"> {[values.簽核人員.服務單位]} {[values.簽核人員.使用者名稱]}</p>' +
                '<p style="font-size:110%;">{[values.版號]} </p>' +
                '<p style="font-size:80%;text-align: right;">{[values.線上簽核資訊.簽核流程.異動別]} {[values.最後更新時間]}</p>',
                grouped: false,
                pinHeaders: false
            }
        ]
    }
});
