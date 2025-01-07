Ext.define('OA.view.DocPaper', {
    extend: 'Ext.Container',
    xtype: 'docPaper',
    requires: ['Ext.SegmentedButton', 'Ext.Toolbar', 'OA.view.CtnPaper'],
    config: {
        layout: {
            type: 'hbox',
            pack: 'center'
        },
        ui: 'plain',
        items: [
            {
                flex: 1,
                xtype: 'ctnPaper',
                hidden: true
            },
            //附件
            {
                xtype: 'dataview',
                inline: {
                    wrap: true
                },
                style: 'font-size:20px',
                itemTpl: new Ext.XTemplate(
                    '<tpl if="(file.status !== 0)">',
                    '<div href="{url}" target="_blank" style="padding:5px;font-size:28px;cursor: pointer;">',
                    '<tpl if="this.isGen(sort)"><span class="label label-primary" style="background: yellow;font-size:20px;padding:5px">{name}</span></tpl>',
                    '<tpl if="this.isRef(sort)"><span class="label label-primary" style="background: gainsboro;font-size:20px;padding:5px">{name}</span></tpl>',
                    '<tpl if="this.isBig(sort)"><span class="label label-primary" style="background: yellow;font-size:20px;padding:5px">{name}</span></tpl>',
                    '</div>',
                    '</tpl>',
                    {
                        isGen: function (folderName) {
                            return ('attach' == folderName);
                        },
                        isRef: function (folderName) {
                            return ('ref' == folderName);
                        },
                        isBig: function (folderName) {
                            return ('big' == folderName);
                        }
                    }
                ),
                store: 'Attach',
                left: 5,
                minHeight: 50,
                width: 0
            },
            {
                id: 'butNext',
                xtype: 'button',
                ui: 'plain',
                iconCls: 'fa-share',
                text: '下一關',
                action: 'next',
                style: 'font-size:20px',
                top: 5,
                right: 5,
                hidden: true
            }
        ]
    }
});