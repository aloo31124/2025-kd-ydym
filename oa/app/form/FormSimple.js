/*
 單一欄位
 */

Ext.define('OA.form.FormSimple', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormSimple',
    xtype: "FormSimple",
    config: {
        width: 400,
        height: 200,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            labelWidth: '50%'
        },
        items: [
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
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    }
                ]
            },
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                items: []
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [                   
                    {xtype: 'spacer'},
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '20%',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var name = form.getActiveItem().getActiveItem().getName() || '';
                            var docType = OA.common.Global.getInitParas().documentType || '';
                            var data = form.getValues();
                            if (name === '敬陳' || name === '核示' || name === '敬致' ) {
                                // if (data[name].indexOf(name) < 0) data[name] = name + '　' + data[name];
                                if (data[name].indexOf(name) < 0) data[name] = data[name];  //改成在updateContent在加空格，不然會資料會位移                              
                            }

                            data[name] = (data[name] + '').trim();
                            form.setValues(data);
                            OA.common.Paper.main().updateContent(form.getValues());
                            form.hide();
                            // 判斷已存檔功能 - by yi-chi chiu
                            OA.app.isSavedFlag = false;
                        }
                    }
                ]
            }
        ]
    },
    create: function (key, data) {
        var me = this;
        var field = me.query('fieldset')[0];

        //為何這裡要把敬陳清空？造成敬陳預設有誤,只去掉敬陳跟核示，不然輸入欄會帶入
        var items = ['敬陳', '受文者' , '敬致'];
        if (items.indexOf(key) >= 0) {
            field.setItems([
                {
                    name: key,
                    label: key + ':',
                    xtype: 'textfield'
                }
            ]);
            if (data[key].indexOf(key) >= 0) {
                if (key == '受文者') {
                    data[key] = data[key].replace(key + "：", '').trim();
                } else {
                    data[key] = data[key].replace(key, '').trim();
                }
            }
        } else {
            field.setItems([
                {
                    name: key + '_title',
                    label: key + ':',
                    xtype: 'textfield'
                }
            ]);
        }
        me.setValues(data);
    }
});