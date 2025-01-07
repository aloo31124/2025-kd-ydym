Ext.define('OA.view.MenuEdition', {
    id: 'menuEdition',
    extend: 'Ext.Container',
    xtype: 'menuEdition',
    requires: ['OA.components.TouchTreeGrid'],
    config: {
        layout: "vbox",
        items: [
            {
                xtype: 'toolbar',
                scrollable: {
                    direction: 'horizontal',
                    indicators: false
                },
                cls: 'segdoc-selector',
                items: [
                    { ui: 'plain', iconCls: 'fa-toggle-on', action: 'editionFolding' },
                    { xtype: 'spacer' },
                    { id: 'toolbarMenuEdition', xtype: 'label' },
                    { xtype: 'spacer' }
                ]
            },
            {
                flex: 1,
                xtype: 'touchtreegrid',
                store: 'TaskAccordion',
                columns: [
                    {
                        dataIndex: 'text',
                        width: '95%',
                        style: 'text-align: left;font-size: 18px;',
                        categStyle: 'font-size: 18px; padding-top: .2em; text-align: left;padding-bottom: .1em;'
                    }
                ],
                style: 'border-bottom:0px;',
                includeFooter: false,
                includeFooterLevels: false,
                includeHeader: false,
                applyDefaultCollapseLevel: false,
                singleExpand: false
            }
        ]
    },
    initialize: function () {
        var toolbarMenuEdition = Ext.getCmp('toolbarMenuEdition');
        if (toolbarMenuEdition) {
            var dosno = OA.common.Global.getInitParas().doSno || '';
            toolbarMenuEdition.setHtml(
                '<p style="font-size:120%;margin:-10px 0 8px -40px;font-weight:normal;">版本資訊</p>' +
                '<p style="font-size:80%;margin:-8px 0 0 -40px;font-weight:normal;">' + dosno + '</p>');
        }
        // 避免一開始出現卷軸而註解 - by yi-chi chiu
        //OA.common.Utils.indicatorWith(this);
    }
});
