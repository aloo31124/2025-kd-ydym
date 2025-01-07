/*
 單機版User/（目前沒用到）
 */

Ext.define('OA.form.FormUser', {
    extend: 'Ext.Panel',
    xtype: "FormUser",
    requires: [],
    config: {
        width: 200,
        height: 100,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'list',
                flex: 1,
                mode: "SINGLE",
                itemTpl: '{title}',
                disableSelection: true,
                data: [
                    {title: '登出', action: 'layout'}
                ],
                listeners: {
                    itemtap: function (list, index, item, record) {
                        var action = record.get('action');
                        if (action == 'layout') {

                            // OA.client.Localforage.setSetting({defaultPath:'',savePath:''});
                            
                            var win = require('electron').remote.getCurrentWindow();
                            win.webContents.session.clearStorageData(function () {
                                Ext.Msg.alert('登出', '清除記錄成功!', function () {
                                    win.reload();
                                });
                            });
                        }
                    }
                }
            }
        ]
    }
});