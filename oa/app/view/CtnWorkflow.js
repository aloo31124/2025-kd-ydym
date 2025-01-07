Ext.define('OA.view.CtnWorkflow', {
    extend: 'Ext.Container',
    xtype: "ctnWorkflow",
    requires: ['OA.view.CtnJointPaper','Ext.plugin.SortableList'],
    config: {
        layout: "card",
        ui: 'light',
        isEdit:false,
        items: [
            {
                label: '流程：',
                xtype: 'list',
                id: 'fieldWorkFlow',
                scrollable: 'vertical',
                disableSelection: true,
                store: 'WorkFlow',
                cls: 'workflowList',
                itemTpl: new Ext.XTemplate(

                    '<tpl if="this.isDest(JobNo)">',
                    '<p style="font-size:110%;color:red">',
                    '<tpl else>',
                    '<p style="font-size:110%;">',
                    '</tpl>',


                    '<tpl if="(isDelete)">',
                      '<span class="flow-delete">&nbsp;</span>',
                    '<tpl else>',
                      '<tpl if="this.isCurrent(Flag)">',
                        '<span class="flow-dest">&nbsp;</span>',
                      '<tpl else>',
                        '<tpl if="this.isDest(JobNo)">',
                          '<span class="flow-me"></span>',
                        '<tpl else>',
                          '&nbsp;&nbsp;&nbsp;&nbsp;',
                        '</tpl>',
                      '</tpl>',
                    '</tpl>',

                    ' {NodeTypeDesc} ',
                    ' {EmpName} ',

                    '<tpl if="this.isSync(NodeMethod)">',
                    '順送',
                    '<tpl else>',
                    '併送',
                    '</tpl>',

                    ' ({JobName}) ',
                    '<tpl if="(isDelete)">',
                      '<span class="flow-move"></span>',
                    '</tpl>',

                    '</p>',

                    {
                        isSync: function (NodeMethod) {
                            return ('1' == NodeMethod);
                        },
                        isAsync: function (NodeMethod) {
                            return ('2' == NodeMethod);
                        },
                        isCurrent: function (Flag) {
                            return ('目前' == Flag);
                        },
                        isDest: function (JobNo) {
                            return (OA.common.Global.getDestJobNo() == JobNo);
                        }
                    }
                ),
                plugins: [{xclass: 'Ext.plugin.SortableList', handleSelector: '.flow-move'}],
                infinite: true,
                variableHeights: true
            },
            {
                xtype: 'ctnJointPaper'
            }
        ]
    }
});