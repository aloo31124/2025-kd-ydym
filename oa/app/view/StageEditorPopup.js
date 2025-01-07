Ext.define('OA.view.StageEditorPopup', {
    extend: 'Ext.Container',
    xtype: 'StageEditorPopup',
    requires: ['OA.components.PaperEditor'],

    config: {
        layout: "vbox",
        ui: 'plain',
        items: [
            {
                xtype: 'oaEditor'
            },
            {
                xtype: 'container',
                defaults: {
                    xtype: 'button',
                    style: 'margin: .5em',
                    flex: 1
                },
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        text: '取消',
                        scope: this,
                        hasDisabled: false,
                        handler: function (btn) {
                            var m = Ext.getCmp('main');
                            m.setActiveItem('StageOfficialDoc');
                        }
                    },
                    {
                        text: '本文修正',
                        handler: function () {
//                            Ext.getCmp('basicform').reset();
                        }
                    }
                ]
            }
        ]
    }

});
