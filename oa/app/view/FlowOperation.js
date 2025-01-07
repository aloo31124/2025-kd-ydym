Ext.define('OA.view.FlowOperation', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FlowOperation',
    xtype: 'flowOperation',
    config: {
        left: 0,
        top: 0,
        width: 800,
        height: 650,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        scrollable: false,
        items: [
            {
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        width:'50%',
                        label: '動作：',
                        xtype: 'selectfield',
                        name: 'nodeType',
                        store: {
                            data: [
                                {NodeType: '1', NodeTypeDesc: '陳核'},
                                {NodeType: '2', NodeTypeDesc: '會辦'},
                                {NodeType: '4', NodeTypeDesc: '複閱'},
                                {NodeType: '6', NodeTypeDesc: '送回'}
                            ]
                        },
                        displayField: 'NodeTypeDesc',
                        valueField: 'NodeType'
                    },
                    {
                        width:'25%',
                        xtype: 'radiofield',
                        name: 'nodeMothed',
                        label: '順行',
                        value: '1',
                        checked: true
                    },
                    {
                        width:'25%',
                        xtype: 'radiofield',
                        name: 'nodeMothed',
                        label: '併行',
                        value: '2'
                    }
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'nestedlist',
                        width: '50%',
                        height: 400,
                        displayField: 'depName',
                        store: 'DeptTree',
                        emptyText: '沒有資料',
                        loadingText: "Loading...",
                        getItemTextTpl: function () {

                            var items = [];

                            items.push('<p style="font-size:110%;">');
                            items.push('{' + this.getDisplayField() + '}');
                            items.push('<tpl if="(isAdd)">');
                            items.push('<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">已加</span>');
                            items.push('<tpl else>');
                            items.push('<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">新增</span>');
                            items.push('</tpl>');
                            items.push('</p>');

                            return items.join('');
                        }
                    },
                    {
                        xtype: 'list',
                        emptyText: '沒有人員',
                        loadingText: "Loading...",
                        mode: "SINGLE",
                        store: 'Emp',
                        width: '50%',
                        itemTpl: new Ext.XTemplate(
                            '<p style="font-size:110%;">',
                            '{empName} ( {jobName} ) ',
                            '<tpl if="(isAdd)">',
                            '<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">已加</span>',
                            '<tpl else>',
                            '<span class="x-button-normal x-button" style="float:right;bottom:5px;font-size:90%;">新增</span>',
                            '</tpl>',
                            '</p>'
                        )
                    }
                ]
            },
            {
                xtype: 'textareafield',
                height:'5%'
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {
                        text: '取消', action: 'no', width: '20%'
                    },
                    {xtype: 'spacer'},
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '20%'
                    }
                ]
            }
        ]
    }

});