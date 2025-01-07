/*
 職名章 （目前沒用到）
 */
Ext.define('OA.form.FormStamps', {
    extend: 'Ext.Panel',
    xtype: "FormStamps",
    requires: [],
    config: {
        width: 400,
        height: 400,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
            {
                id: 'StampsList',
                store: 'Stamps',
                xtype: 'list',
                flex: 1,
                mode: "SINGLE",
                itemTpl: new Ext.XTemplate(                     
                    '<tr>',
                    '<img src="{stamp}" height="60px" width="360px" >',               
                    '</tr>',
                ),
                listeners: {
                    itemtap: function (list, index, item, record, event) {
                        var form = list.up('panel');
                        //console.log(item);
                        //console.log(record);
                        var cpaper = OA.common.Paper.main();
                        if (cpaper) {
                            cpaper.addStamps(record.raw);
                        }
                        form.hide();
       
                    }
                }
            }
        ]
    },
    initialize: function () {
    },
    create: function () {
    }
});