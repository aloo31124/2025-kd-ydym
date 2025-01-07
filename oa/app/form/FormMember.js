/*
 檔號分類號（目前沒用到）
 */

Ext.define('OA.form.FormMember', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormMember',
    xtype: 'FormMember',
    requires: ['OA.client.Member'],
    config: {
        width: '50%',
        height: 450,
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        scrollable: false,
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
                        scope: this,
                        hasDisabled: false,
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    },
                ]
            },
            {
                height: 400,
                xtype: 'list',
                scrollable: 'vertical',
                itemTpl: new Ext.XTemplate(
                    '<p style="font-size:90%;">',
                    '{dep3Name}',
                    // '{dep3Addr}',
                    '</p>'
                )
            }
        ]
    },
    create: function (data) {
        this.down('list').setData(data);
        OA.common.Utils.indicatorWith(this);
    }
});