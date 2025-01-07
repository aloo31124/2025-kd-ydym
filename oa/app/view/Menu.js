Ext.define('OA.view.Menu', {
    extend: 'Ext.Container',
    id: 'viewMenu',
    xtype: "oamenu",
    requires: [
        'Ext.Menu',
        'OA.view.MenuLeft',
        'OA.view.MenuList',
        'OA.view.MenuVersion'
    ],
    config: {
        layout: "card",
        ui: 'light',
        items: [
            {
                xtype: 'menuList'
            },
            {
                xtype: 'menuVersion'
            }
        ]
    },
    initialize: function () {
        this.create();
    },
    create: function () {
        var menuRoot = Ext.create("OA.view.MenuLeft");
        menuRoot.init();
        Ext.Viewport.setMenu(menuRoot, {
            side: 'left',
            reveal: true
        });

        //公告為首頁時，預設開啟左側功能
        var menuId =OA.common.Global.getCurrentMenu();
        if (menuId=='bulletin') Ext.Viewport.showMenu("left");
    }
});