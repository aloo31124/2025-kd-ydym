/*
 單機版設定（目前沒用到）
 */
Ext.define('OA.form.FormSetting', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormSetting',
    xtype: 'FormSetting',
    requires: [],
    config: {
        width: '50%',
        height: '60%',
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        scrollable: false
    },
    initialize: function () {
    },
    create: function () {
        var me = this;
        me.removeAll(true, true);

        OA.client.Localforage.getSetting(function (value) {
            me.setItems(me.getFormItems(value));
            me.setValues(value);

            //入徑選擇
            $('#inputSelectFolder').off('click');
            $('#inputSelectFolder').on('click', function () {
                var dialog = require('electron').remote.dialog;
                dialog.showOpenDialog({
                    properties: ['openDirectory']
                }, function (fileNames) {
                    var ctr = me.query('textfield[name=savePath]')[0];
                    ctr.setValue(fileNames[0]);
                });
            })
        });
    },
    getFormItems: function (data) {
        var me = this;
        var items = [];
        var options = [];
        var users = [];

        var qs = OA.common.Global.getQ();
        var qd = OA.common.Global.getQueryDefault();

        options.push({
            xtype: 'selectfield',
            name: 'autoSave',
            label: '自動儲存',
            valueField: 'value',
            displayField: 'text',
            options: [
                { text: '不自動', value: 0 },
                { text: '3分鐘', value: 3 },
                { text: '5分鐘', value: 5 },
                { text: '10分鐘', value: 10 }
            ],
            value: 0
        });
        if (qs.app === 'offline') {
            options.push({
                xtype: 'textfield',
                name: 'savePath',
                label: '存檔路徑<input type = "button" id="inputSelectFolder" value = "選擇"/>',
                value: ''
            });
            options.push({
                xtype: 'togglefield',
                name: 'devTools',
                label: '開發人員工具',
                style: 'font-size:12px',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        if (typeof require === 'undefined') return;
                        var win = require('electron').remote.getCurrentWindow();
                        if (newValue) {
                            win.webContents.openDevTools();
                        } else {
                            win.webContents.closeDevTools();
                        }
                    }
                }
            });

            //使用者資訊
            if (qd && qd.交換資訊) { //queryDefault機關，預設Y
                Ext.Array.each(qd.交換資訊.發文機關.機關, function (item) {
                    if (item.預設 === 'Y') {
                        users.push({
                            xtype: 'textfield',
                            name: 'orgName',
                            label: '發文機關',
                            value: item.名稱 || ''
                        });
                        users.push({
                            xtype: 'textfield',
                            name: 'orgNo',
                            label: '發文機關代碼',
                            value: item.代碼 || ''
                        });
                        users.push({
                            xtype: 'textfield',
                            name: 'sendNo',
                            label: '發文字',
                            value: item.發文字 || ''
                        });
                    }
                });

                users.push({
                    xtype: 'textfield',
                    name: 'addr',
                    label: '地址',
                    value: qd.交換資訊.地址 || ''
                });

                users.push({
                    xtype: 'textfield',
                    name: 'officeaddr',
                    label: '辦公地址',
                    value: qd.交換資訊.辦公地址 || ''
                });

                //queryDefault聯絡方式
                Ext.Array.each(qd.交換資訊.聯絡方式, function (item) {
                    if (item.Title === '承辦人：') {
                        users.push({
                            xtype: 'textfield',
                            name: 'name',
                            label: '承辦人',
                            value: item.content || ''
                        });
                    }
                    if (item.Title === '電話：') {
                        users.push({
                            xtype: 'textfield',
                            name: 'phone',
                            label: '電話',
                            value: item.content || ''
                        });
                    }

                    if (item.Title === '傳真：') {
                        users.push({
                            xtype: 'textfield',
                            name: 'tex',
                            label: '傳真',
                            value: item.content || ''
                        });
                    }

                    if (item.Title === '電子信箱：') {
                        users.push({
                            xtype: 'textfield',
                            name: 'mail',
                            label: '電子信箱',
                            value: item.content || ''
                        });
                    }
                });
            }
        }

        if (qs.app === 'offline' && queryDefault) {
            items.push({
                xtype: 'fieldset',
                defaults: {
                    labelWidth: '50%'
                },
                title: '使用者資料',
                items: users
            });
        }

        items.push({
            xtype: 'fieldset',
            defaults: {
                labelWidth: '50%'
            },
            title: '基本設定',
            items: options
        });

        items.push(me.getButtomToolbar());
        return items;
    },
    getButtomToolbar: function () {
        var me = this;

        return {
            xtype: 'toolbar',
            docked: 'bottom',
            cls: 'segdoc-selector',
            scrollable: {
                direction: 'horizontal',
                directionLock: true
            },
            items: [
                {
                    text: '取消',
                    action: 'no',
                    width: '20%',
                    scope: this,
                    hasDisabled: false,
                    handler: function (button) {
                        button.up('formpanel').hide();
                    }
                },
                { xtype: 'spacer' },
                {
                    ui: 'confirm',
                    text: '儲存',
                    action: 'ok',
                    width: '20%',
                    handler: function (button, e, eOpts) {
                        var form = button.up('formpanel');
                        var values = me.getValues();
                        values.defaultPath = values.savePath;
                        OA.client.Localforage.setSetting(values, function () {
                            OA.common.FileMgr.init(function () {
                                var ctrWK = OA.common.Global.getApp().getController('OA.controller.Work');
                                if (ctrWK) ctrWK.doAutoSaveStart();
                            });

                            //回寫QueryDefault
                            if (OA.common.Global.getQ().app === 'offline') {
                                var qd = OA.common.Global.getQueryDefault();
                                if (qd && qd.交換資訊 && qd.交換資訊.發文機關 && qd.交換資訊.發文機關.機關) {
                                    Ext.Array.each(qd.交換資訊.發文機關.機關, function (item) {
                                        if (item.預設 === 'Y') {
                                            item.名稱 = values['orgName'];
                                            item.代碼 = values['orgNo'];
                                            item.發文字 = values['sendNo'];
                                        }
                                    });

                                    if (qd.交換資訊.聯絡方式) {
                                        Ext.Array.each(qd.交換資訊.聯絡方式, function (item) {
                                            switch (item.Title) {
                                                case '承辦人：':
                                                    item.content = values['name'];
                                                    break;
                                                case '電話：':
                                                    item.content = values['phone'];
                                                    break;
                                                case '傳真：':
                                                    item.content = values['tex'];
                                                    break
                                                case '電子信箱：':
                                                    item.content = values['mail'];
                                                    break
                                            }
                                        });
                                        qd.交換資訊.發文機關全銜 = values['orgName'];
                                        qd.交換資訊.發文機關代碼 = values['orgNo'];
                                        qd.交換資訊.地址 = values['addr'];
                                        qd.交換資訊.辦公地址 = values['officeaddr'];
                                    }
                                }
                            }
                            form.hide();
                        });
                    }
                }
            ]
        };
    }
});