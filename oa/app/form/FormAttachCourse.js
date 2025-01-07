/**
 * 附件歷程
 */

Ext.define('OA.form.FormAttachCourse', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormAttachCourse',
    xtype: "FormAttachCourse",
    config: {
        width: '65%',
        height: '60%',
        modal: true,
        centered: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    { xtype: 'spacer' },
                    {
                        ui: 'plain', text: '✖', action: 'no',
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    },
                ]
            },
            {
                height: 500,
                xtype: 'list',
                scrollable: 'vertical',
                id: 'listAttachCourse',
                itemTpl: new Ext.XTemplate(
                    '<p style="font-size:130%;">',
                    '{fileName}　',
                    '<td width="5%">',
                    '<tpl if="this.isGen(folderName)"><span class="speed-normal">承辦</span></tpl>',
                    '<tpl if="this.isRef(folderName)"><span class="speed-normal">參考</span></tpl>',
                    '<tpl if="this.isBig(folderName)"><span class="speed-normal">大型</span></tpl>',
                    '</td>',
                    '</p>',
                    '<tpl if="(addTime)">',
                    '<p style="color:#00BBFF">',
                    '　{addEmpName}({addDepName})　{addTime}　新增',
                    '</p>',
                    '</tpl>',
                    '<tpl if="(reTime)">',
                    '<p style="color:#66DD00">',
                    '　{reEmpName}({reDepName})　{reTime}　更名',
                    '</p>',
                    '</tpl>',
                    '<tpl if="(isDel)">',
                    '<p style="color:#FF8800">',
                    '　{personnel}({depName})　{operateTime}　刪除',
                    '</p>',
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
                )
            }
        ]
    },
    create: function () {
        var store = Ext.getStore('Attach');
        if (store) {
            var courseData = [];
            Ext.Array.each(store.data.all, function (item) {
                if (item.data.file.status !== 'undefined') {
                    var data = {
                        isDel: item.data.file.status == '1' ? false : true,
                        status: item.data.file.status == '1' ? '新增' : '刪除',
                        personnel: item.data.file.personnel == 'undefined' ? '' : item.data.file.personnel,
                        depName: item.data.file.depName == 'undefined' ? '' : item.data.file.depName,
                        fileName: item.data.file.fileKey == 'undefined' ? '' : item.data.file.fileKey,
                        operateTime: item.data.file.operateTime == 'undefined' ? '' : item.data.file.operateTime,
                        folderName: item.data.file.folderName == 'undefined' ? '' : item.data.file.folderName,
                        addTime: item.data.file.status == '1' ? item.data.file.operateTime : item.data.file.addTime,
                        addDepName: item.data.file.status == '1' ? item.data.file.depName : item.data.file.addDepName,
                        addEmpName: item.data.file.status == '1' ? item.data.file.personnel : item.data.file.addEmpName,
                        reTime: item.data.file.reTime == 'undefined' ? '' : item.data.file.reTime,
                        reDepName: item.data.file.reDepName == 'undefined' ? '' : item.data.file.reDepName,
                        reEmpName: item.data.file.reEmpName == 'undefined' ? '' : item.data.file.reEmpName
                    }
                    courseData.push(data);
                }
            });
            var attachCourse = Ext.create("Ext.data.Store", {
                id: 'attachCourse',
                autoLoad: true,
                autoSync: true,
                data: courseData.length > 0 ? courseData : null
            });
            Ext.getCmp('listAttachCourse').setStore(attachCourse);

            OA.common.Utils.indicatorWith('listAttachCourse');
        }
    }
});