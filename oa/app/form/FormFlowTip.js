/*
 流程提示
 */
Ext.define('OA.form.FormFlowTip', {
    extend: 'Ext.Panel',
    alias: 'widget.FormFlowTip',
    xtype: "FormFlowTip",
    config: {
        width: 500,
        height: 45,
        style: 'background-color: transparent; border: 0px;padding:0px',
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'toolbar',
                style: {
                    background: '#6c9804'
                },
                items: [
                    {
                        ui: 'plain', iconCls: 'fa-chevron-circle-up', action: '',
                        handler: function (button, e, eOpts) {

                        }
                    },
                    {xtype: 'label', html: '<p style="font-size:120%;">下一關：到底是誰？？？</p>'},
                    {xtype: 'spacer'},
                    {
                        ui: "plain", iconCls: 'fa-times', action: 'close',
                        handler: function (button, e, eOpts) {
                            button.up('panel').hide();
                        }
                    }
                ]
            }
        ]
    },
    create: function () {
        var ctr = Ext.getCmp('oawork');
        var h = (Ext.Viewport.getWindowHeight() - 105);
        var w = (ctr.element.dom.clientWidth - 400) / 2;
        this.setTop(h);
        this.setLeft(w);

        var label = this.query('label')[0];

        var uiBarriers = OA.common.VIMgr.getBarriers('forward');
        //console.log(uiBarriers);


        label.setHtml('<p style="font-size:120%;">下一關：到底是誰？？？    變更流程</p>');

    }
});