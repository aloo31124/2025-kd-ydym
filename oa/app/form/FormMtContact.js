/*

開會通知單/聯絡人及電話

 */
Ext.define('OA.form.FormMtContact', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormMtContact',
    xtype: "FormMtContact",
    config: {
        width: 600,
        height: 600,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        sourceData: null,
        fsCount: 0
    },
    create: function (data) {
        var me = this;
        this.removeAll(true, true);

        var items = [], i = 0;
        var member = (data['聯絡人及電話']) ? data['聯絡人及電話'].split('、') : '';
        var values = {};

        items.push({
            xtype: 'toolbar',
            cls: 'segdoc-selector',
            docked: 'top',
            items: [
                {
                    text: '新增',
                    action: 'add',
                    width: '15%',
                    handler: function (button, e, eOpts) {
                        me.addFieldsetSent();
                    }
                },
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
        })
        Ext.Array.each(member, function (p) {
            i++;
            var item = me.creatFieldsetSent(i);
            items.push(item);

            var info = p.split(' ');
            var phone = '';
            Ext.Array.each(info, function (p1, idx) {
                var name = '';
                if (idx == 0) {
                    name = 'EmpName_' + i;
                    values[name] = p1;
                } else if (idx == 1) {
                    name = 'Job_' + i;
                    values[name] = p1;
                }

                if (idx > 1) {
                    name = 'Tel_' + i;
                    phone = phone.length > 0 ? phone + ' ' + p1 : phone + p1;
                    values[name] = phone;
                }

                //else if (idx == 2) {
                //    name ='Tel_' + i ;
                //    values[name]=p1;
                //}
            });

        });

        me.setFsCount(i);
        items.push(me.getButtomToolbar());
        me.setItems(items);
        me.setValues(values);
        me.setSourceData(values);
    },
    getButtomToolbar: function () {
        var me = this;
        return {
            xtype: 'toolbar',
            docked: 'bottom',
            scrollable: {
                direction: 'horizontal',
                directionLock: true
            },
            items: [
                { xtype: 'spacer' },
                {
                    ui: 'confirm',
                    text: '確定',
                    action: 'ok',
                    width: '15%',
                    handler: function (button, e, eOpts) {
                        var form = button.up('formpanel');
                        var count = me.getFsCount();
                        var values = me.getValues();
                        var items = [];
                        for (var i = 1; i <= count; i++) {
                            var name = 'EmpName_' + i;
                            var job = 'Job_' + i;
                            var tel = 'Tel_' + i;

                            items.push(values[name] + ' ' + values[job] + ' ' + values[tel].replace('、', '#'));
                        }
                        var data = { 聯絡人及電話: items.join('、') };

                        OA.common.Paper.main().updateContent(data);
                        form.hide();
                        // 判斷已存檔功能 - by yi-chi chiu
                        OA.app.isSavedFlag = false;
                    }
                }
            ]
        }
    },
    creatFieldsetSent: function (idx) {
        var me = this;
        var _id = 'fieldsetSent' + idx.toString();
        return {
            id: _id,
            xtype: 'fieldset',
            items: [
                {
                    xtype: 'titlebar',
                    title: '人員' + idx.toString(),
                    items: [
                        {
                            text: '刪除',
                            align: 'right',
                            handler: function (button, e, eOpts) {
                                me.removeFieldsetSent(_id);
                            }
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'EmpName_' + idx.toString(),
                    label: '單位及姓名'
                },
                {
                    xtype: 'textfield',
                    name: 'Job_' + idx.toString(),
                    label: '職稱'
                },
                {
                    xtype: 'textfield',
                    name: 'Tel_' + idx.toString(),
                    label: '電話'
                }
            ]
        };
    },
    addFieldsetSent: function () {
        var me = this;
        var idx = me.getFsCount() + 1;
        var item = me.creatFieldsetSent(idx);
        me.add(item);
        me.setFsCount(idx);
    },
    removeFieldsetSent: function (_id) {
        var me = this;
        var field = me.query('#' + _id)[0];
        me.remove(field);
        me.setFsCount(me.getFsCount() - 1);

        //修正名稱序號
        var all = me.query('fieldset');
        Ext.Array.each(all, function (n, idx) {
            Ext.Array.each(n.getInnerItems(), function (n1) {
                var no = (idx + 1);
                if (typeof n1.getTitle === "function") {
                    n1.setTitle('人員' + no);
                }
                if (typeof n1.getName === "function") {
                    var items = n1.getName().split('_');
                    var newName = items[0] + '_' + no;
                    n1.setName(newName);
                }
            });
        });
    }
});