/*
 簽類別 敬會、敬陳、敬致、局處單位
 */

Ext.define('OA.form.FormNoteSubmit', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormNoteSubmit',
    xtype: "FormNoteSubmit",
    config: {
        width: 600,
        height: 440,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        KEY: ''
    },
    create: function (key, data) {
        this.setKEY(key);
        this.removeAll(true, true);      
        this.setItems(this.getFormItems(data, key));
        this.setValues(data);        
        OA.common.Utils.indicatorWith(this);
    },
    creatSubmit: function (key) {
        var me = this;
        return {
            id: 'fieldsetSubmit',
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'titlebar',
                    title: key,
                    items: [
                        {
                            text: '+ - ' + key,
                            align: 'right',
                            handler: function (button, e, eOpts) {
                                me.createPaperName(key);
                            }
                        }
                    ]
                }
            ]
        }
    },
    getFormItems: function (data, key) {
        var me = this;
        var items = [], lastItem;
        items.push({
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
                        button.up('formpanel').hide();
                    }
                }
            ]
        });
        
        //console.log(lastItem);
        if (key == '敬會') {
            countName = data['敬會數'];
        } else if (key == '敬陳') {
            countName = data['敬陳數'];
        } else if (key == '敬陳') {
            countName = data['敬陳數'];
        } else if (key == '敬致') {
            countName = data['敬致數'];
        } else if (key == '局處單位') {
            countName = data['局處單位數'];
        }
        lastItem = me.creatSubmit(key);

        for (var i = 1; i <= countName; i++) {
            lastItem.items.push({
                xtype: 'textfield',
                name: key + '_' + i.toString(),
                label: key + i.toString(),
                countName: key + i.toString(),
                listeners: {
                    clearicontap: function (ctr, e, eOpts) {
                        me.removePaperName(ctr,key);
                    }
                }
            });          
        }

        lastItem.items.push({
            xtype: 'spinnerfield',
            stepValue: 1,
            name: key + '數',
            label: key + '數',
            hidden: true
        });

        items.push(lastItem);

        items.push(me.getButtomToolbar());
        return items;
    },
    getButtomToolbar: function () {
        return {
            xtype: 'toolbar',
            docked: 'bottom',
            cls: 'segdoc-selector',
            scrollable: {
                direction: 'horizontal',
                directionLock: true
            },
            items: [
                {xtype: 'spacer'},
                {
                    ui: 'confirm',
                    text: '確定',
                    action: 'ok',
                    width: '15%',
                    handler: function (button, e, eOpts) {
                        var form = button.up('formpanel');
                        OA.common.Paper.main().updateNoteSubmit(form.getValues(), form.getKEY());
                        form.hide();
                        // 判斷已存檔功能 - by yi-chi chiu
                        OA.app.isSavedFlag = false;
                    }
                }
            ]
        };
    },
    createPaperName: function (tag) {
        var me = this;
        var data = me.getValues();
        //檢查上一次新增欄位值是否為空，如果為空則為減去上次筆數
        var checkNum = data[tag + '數'];
        var checkValue = data[tag +  '_' + checkNum];
        if (checkValue == '') {
            if (checkNum !== 1) {
                delete data[tag + '_' + checkNum];
                data[tag + '數'] = checkNum - 1;
            }
        } else {

            var count = data[tag + '數'] + 1;
            var ctr = Ext.getCmp('fieldsetSubmit');
            ctr.add({
                xtype: 'textfield',
                name: tag + '_' + count,
                label: tag + count
            });

            data[tag + '數'] = count;
        }
        me.setValues(data);
        me.create(tag,data);
    },
    removePaperName: function (ctr,key) {
        var me = this;
        if (ctr.getName().indexOf('_1') < 0) {
            var data = me.getValues();
            var revalue = ctr.getName().split('_')[1];
            var Intvalue = parseInt(revalue);

            data[key+'數'] = data[key+'數'] - 1;  // 總筆數-1

            //1118 刪除時，資料重新排序   Chloe.sia
            for (var i = Intvalue; i <= data[key+'數']; i++) {
                var valuecount =i+1;
                var datavalue =data[key +  '_' + valuecount];
                data[key +  '_' + i] = datavalue;
            }

            me.setValues(data);
            ctr.parent.remove(ctr);
            me.create(key,data);
        }
    }
});