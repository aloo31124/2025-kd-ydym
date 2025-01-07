/*

 機密文書/登記人

 */

Ext.define("OA.form.FormPNRContact", {
    extend: "Ext.form.Panel",
    alias: "widget.FormPNRContact",
    xtype: "FormPNRContact",
    config: {
        width: 600,
        height: 340,
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
        items.push(
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
                        action: 'no',
                        scope: this,
                        hasDisabled: false,
                        handler: function (button) {
                            button.up("formpanel").hide();
                        },
                    }
                ]
            });

        var item = me.creatFieldsetSent();
        items.push(item);
        items.push(me.getButtomToolbar());
        me.setItems(items);
        var values = {
            Level: data["職稱"],
            Name: data["姓名"],
            Date: data["日期"],
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
                    ui: "confirm",
                    text: "確定",
                    action: "ok",
                    width: "15%",
                    handler: function (button, e, eOpts) {
                        var form = button.up("formpanel");
                        var values = me.getValues();
                        var data = {
                            職稱: values["Level"],
                            姓名: values["Name"],
                            日期: values["Date"],
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
                    xtype: "textfield",
                    name: "Level",
                    label: "職稱",
                },
                {
                    xtype: "textfield",
                    name: "Name",
                    label: "姓名",
                },
                {
                    xtype: "textfield",
                    name: "Date",
                    label: "日期",
                },
            ],
        };
    },
});
