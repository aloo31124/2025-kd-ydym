/*

 公務電話紀錄/發話人/受話人（目前沒用到）

 */

Ext.define("OA.form.FormPhoneContact", {
    extend: "Ext.form.Panel",
    alias: "widget.FormPhoneContact",
    xtype: "FormPhoneContact",
    config: {
        width: 600,
        height: 550,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        sourceData: null,
        fsCount: 0,
    },
    create: function (data) {
        var me = this;
        this.removeAll(true, true);
        var items = [];
        var item = me.creatFieldsetSent();
        items.push(item);
        items.push(me.getButtomToolbar());
        me.setItems(items);
        var values = {
            sendEmpName: data["發話人單位"],
            sendJob: data["發話人職稱"],
            sendName: data["發話人姓名"],
            receiveEmpName: data["受話人單位"],
            receiveJob: data["受話人職稱"],
            receiveName: data["受話人姓名"],
        };
        me.setValues(values);
        me.setSourceData();
    },
    getButtomToolbar: function () {
        var me = this;
        return {
            xtype: "toolbar",
            docked: "bottom",
            scrollable: {
                direction: "horizontal",
                directionLock: true,
            },
            items: [
                { xtype: "spacer" },
                {
                    text: "取消",
                    action: "no",
                    width: "15%",
                    scope: this,
                    hasDisabled: false,
                    handler: function (button) {
                        button.up("formpanel").hide();
                    },
                },
                {
                    ui: "confirm",
                    text: "確定",
                    action: "ok",
                    width: "15%",
                    handler: function (button, e, eOpts) {
                        var form = button.up("formpanel");
                        var values = me.getValues();
                        var data = {
                            發話人單位: values["sendEmpName"],
                            發話人職稱: values["sendJob"],
                            發話人姓名: values["sendName"],
                            受話人單位: values["receiveEmpName"],
                            受話人職稱: values["receiveJob"],
                            受話人姓名: values["receiveName"],
                        };
                        OA.common.Paper.main().updateContent(data);
                        form.hide();
                        // 判斷已存檔功能 - by yi-chi chiu
                        OA.app.isSavedFlag = false;
                    },
                },
            ],
        };
    },
    creatFieldsetSent: function () {
        var me = this;
        var _id = "fieldsetSent";
        return {
            xtype: "fieldset",
            items: [
                {
                    xtype: "titlebar",
                    title: "發話人",
                },
                {
                    xtype: "textfield",
                    name: "sendEmpName",
                    label: "單位",
                },
                {
                    xtype: "textfield",
                    name: "sendJob",
                    label: "職稱",
                },
                {
                    xtype: "textfield",
                    name: "sendName",
                    label: "姓名",
                },
                {
                    xtype: "titlebar",
                    title: "受話人",
                },
                {
                    xtype: "textfield",
                    name: "receiveEmpName",
                    label: "單位",
                },
                {
                    xtype: "textfield",
                    name: "receiveJob",
                    label: "職稱",
                },
                {
                    xtype: "textfield",
                    name: "receiveName",
                    label: "姓名",
                },
            ],
        };
    },
});
