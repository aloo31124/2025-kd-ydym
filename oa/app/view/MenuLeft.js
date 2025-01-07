Ext.define('OA.view.MenuLeft', {
    extend: 'Ext.Menu',
    xtype: "menuLeft",
    config: {
        ui: 'light',
        layout: "vbox",
        scrollable: 'vertical',
        width: '20%',
        items: [
            {
                docked: 'top',
                flex: 1,
                xtype: 'label',
                id: 'labUser',
                margin: '10 10 5 10'
            },
            {
                docked: 'top',
                flex: 2,
                id: 'selectDept',
                name: 'selectDept',
                xtype: 'selectfield',
                usePicker: true,
                store: 'Dept',
                valueField: 'depNo',
                displayField: 'depName',
                defaultTabletPickerConfig: {
                    doneButton: '確定',
                    cancelButton: '取消',
                    top: 0,
                    width: '50%',
                    enter: 'top',
                    exit: 'top'
                },
                defaultPhonePickerConfig: {
                    top: 0,
                    width: '50%',
                    enter: 'top',
                    exit: 'top',
                    doneButton: {
                        text: '確定'
                    },
                    cancelButton: '取消'
                },
                margin: 3,
                autoSelect:false
            },
            {
                docked: 'top',
                flex: 3,
                id: 'selectRole',
                name: 'selectRole',
                xtype: 'selectfield',
                usePicker: true,
                store: 'Role',
                valueField: 'jobNo',
                displayField: 'roleName',
                defaultTabletPickerConfig: {
                    doneButton: '確定',
                    cancelButton: '取消',
                    top: 0,
                    width: '50%',
                    enter: 'top',
                    exit: 'top'
                },
                defaultPhonePickerConfig: {
                    doneButton: '確定',
                    cancelButton: '取消',
                    top: 0,
                    width: '50%',
                    enter: 'top',
                    exit: 'top'
                },
                margin: '0 3 3 3',
                autoSelect:false
            }
        ]
    },
    init: function () {
        var items = [];
        var q = OA.common.Global.getQ();
        if (!q) return;

        var initMenuId = 'wait';
            //items.push({
            //    text: '訊息公告',
            //    iconCls: 'fa-newspaper-o',
            //    menu: "bulletin",
            //    margin: '10 10 5 10'
            //});
            //initMenuId = 'bulletin';

        OA.common.Global.setCurrentMenu(initMenuId);
        items.push({
            text: '待辦案件',
            iconCls: 'organize',
            menu: "wait",
            margin: '10 10 5 10'
        });
        items.push({
            text: '對方未簽收',
            iconCls: 'time',
            menu: "done",
            margin: '5 10 5 10'
        });
        items.push({
            //text: '其他案件',
            text: '待結案',
            iconCls: 'fa-tasks',
            menu: "others",
            margin: '5 10 5 10',
            hidden: true
        });
        items.push({
            text: '創簽稿',
            iconCls: 'fa-file-text-o',
            menu: "newdoc",
            margin: '5 10 5 10',
            hidden: true
        });
        items.push({
            text: '登出',
            iconCls: 'fa-sign-out',
            menu: "logout",
            margin: '5 10 5 10'
        });

        this.add(items);
    }
});