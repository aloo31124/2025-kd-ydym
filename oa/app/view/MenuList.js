Ext.define('OA.view.MenuList', {
    id: 'vList',
    extend: 'Ext.Container',
    xtype: 'menuList',
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
                id: 'menuListToolBar',
                xtype: 'toolbar',
                title: '',
                cls: 'segFolder-selector',
                items: [
                    {
                        id: 'butListLeft',
                        iconCls: "fa-bars",
                        ui: "plain",
                        left: 0
                    },
                    {xtype: 'spacer'},
                    {
                        xtype: 'segmentedbutton'
                    },
                    {xtype: 'spacer'},
                    {
                        id: 'butListRight',
                        iconCls: "fa-book",
                        ui: "plain",
                        right: 0
                    }
                ]
            },
            {
                xtype: 'list',
                flex: 1,
                emptyText: '沒有文件',
                loadingText: "Loading...",
                mode: "SINGLE",
                store: 'DocFlow',
                itemTpl: new Ext.XTemplate(
                    '<p style="font-size:90%;">{doSno} ',
                    '<tpl if="this.isNormal(speed)"><span class="speed-normal">普</span></tpl>',
                    '<tpl if="this.isFaster(speed)"><span class="speed-faster">速</span></tpl>',
                    '<tpl if="this.isFastest(speed)"><span class="speed-fastest">最</span></tpl>',
                    ' ',
                    '{state}',
                    '   限{rsvEndDate}',
                    '</p>',
                    '<p style="font-size:110%;">{title}</p>',
                    '<p style="font-size:80%;">{depName} {user}</p>',
                    {
                        isNormal: function (speed) {
                            return ('1' == speed);
                        },
                        isFaster: function (speed) {
                            return ('2' == speed);
                        },
                        isFastest: function (speed) {
                            return ('3' == speed);
                        }
                    }
                ),
                plugins: [
                    {xclass: 'Ext.plugin.ListPaging', loadMoreText: '更多...', autoPaging: true},
                    {xclass: 'Ext.plugin.PullRefresh', pullText: '下拉重新讀取 ...', releaseText: '重新讀取...',
                        refreshFn: function() {
                            //console.log("Boom");
                            //Ext.getStore('BeerStore').load();
                        }}
                ]
            }
        ]
    },
    setToolbarTitle: function (title) {
        var toolbar = Ext.getCmp('menuListToolBar');
        toolbar.setTitle(title);
    }
});
