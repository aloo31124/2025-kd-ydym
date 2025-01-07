Ext.define('OA.controller.Approve', {
    extend: 'Ext.app.Controller',
    requires: ['OA.client.Barrier', 'OA.client.Member', 'OA.model.WorkFlow', 'OA.view.FlowOperation'],
    config: {
        refs: {
            approveSelect: 'approveSelect',
            approveConfirm: '#approveConfirm',//'StageApprove > container > container',
            butOK: 'StageApprove > container > button[action=ok]',
            butNo: 'StageApprove > container > button[action=no]',
            butShow: 'approveWorkflow > toolbar > button[action=show]',
            butNew: 'approveWorkflow > toolbar > button[action=new]',
            butEdit: 'approveWorkflow > toolbar > button[action=edit]',
            workflowList: 'ctnWorkflow > list',
            approveWorkflow: 'approveWorkflow',
            ctnWorkflow: 'ctnWorkflow',
            fieldActions: '#fieldActions',
            fieldBarriers: '#fieldBarriers',
            fieldNote: '#fieldNote', //approveSelect > textareafield
            fieldNoteTip: 'approveSelect > container > dataview',
            fieldWorkFlow: '#fieldWorkFlow',
            jointPaper: 'jointPaper',
            nodeTypeSelect: 'flowOperation > container > selectfield',
            nodeMothedSelect: 'flowOperation > container > radiofield[name=nodeMothed]',
            depList: 'flowOperation > container > nestedlist',
            empList: 'flowOperation > container > list',
            textAreaOrg: 'flowOperation > textareafield',
            butFlowOperationOK: 'flowOperation > container > button[action=yes]',
            butFlowOperationNO: 'flowOperation > container > button[action=no]'
        },
        control: {
            butOK: {
                tap: 'onDoActionOK'
            },
            butNo: {
                tap: 'onDoActionNO'
            },
            fieldActions: {
                change: 'onFieldActionsChanged'
            },
            fieldBarriers: {
                change: 'onFieldBarriersChanged'
            },
            fieldNoteTip: {
                itemtap: function (list, index, item, record, event) {
                    var note = this.getFieldNote().getValue();
                    note = note + record.get('text');
                    this.getFieldNote().setValue(note);
                }
            },
            butShow: {
                tap: 'onButShowTap'
            },
            butEdit: {
                tap: 'onButEditTap'
            },
            butNew: {
                tap: 'onButNewTap'
            },
            workflowList: {
                itemtap: function (list, index, item, record, event) {
                    var me = this;
                    if (event.getTarget('.flow-delete')) {
                        Ext.Msg.confirm("確定刪除？", "你確定要刪除此資料 " + record.get('EmpName') + ' 嗎？', function (ok) {
                            if ('yes' == ok) {
                                Ext.getStore('WorkFlow').remove(record);
                            }
                        });

                    }
                },
                dragsort: function (list, row, from, to) {
                    //console.log(row);
                    //console.log(from + '-->' + to);
                    var store = Ext.getStore('WorkFlow');
                    var currentIdx = store.find('Flag', '目前');
                    var item = store.getAt(currentIdx + 1);

                    OA.common.Global.setDestJobNo(item.get('JobNo'));
                }
            },
            depList: {
                itemtap: function (nestedList, list, index, target, record, e, eOpts) {
                    var me = this;
                    if (this.isAddButton(e)) {
                        if (!record.get('isAdd')) {
                            record.set('leaf', true);
                            this.doOrgAdd(record);
                        } else {
                            me.removeTextAreaItem(record);
                        }
                    } else {
                        if (null == record.get('children')) {
                            record.set('leaf', true);
                        } else {
                            record.set('leaf', false);
                        }
                    }
                },
                leafitemtap: function (nestedList, list, index, target, record, e, eOpts) {
                    var me = this;
                    if (record.get('isAdd') || this.isAddButton(e))
                        return;
                    var _nodeType = me.getNodeTypeSelect().getRecord().get('NodeType');
                    OA.client.Member.loadEmps({
                        depNo: record.get('depNo'),
                        nodeType: _nodeType,
                        empNo: OA.common.Global.getCurrentUser().empNo,
                        callback: function (records, operation, success) {
                            me.setAlreadyAdd(records);
                        }
                    });
                }
            },
            empList: {
                itemtap: function (list, index, item, record, e) {
                    if (this.isAddButton(e)) {
                        if (!record.get('isAdd'))
                            this.doOrgAdd(record);
                        else {
                            this.removeTextAreaItem(record);
                        }
                    }
                }
            },
            nodeTypeSelect: {
                change: 'onNodeTypeSelectChanged'
            },
            butFlowOperationOK: {
                tap: 'onFlowOperationOK'
            },
            butFlowOperationNO: {
                tap: 'onFlowOperationNO'
            },
            textAreaOrg: {
                clearicontap: function (field, e, eOpts) {
                    console.log('clearicontap');
                    this.setOrgSelectItems([]);

                    //current org already add to clear
                }
            }
        },
        pictureState: false,
        orgSelectItems: []
    },
    uiSetting: function () {
        var me = this;
        var q = OA.common.Global.getQ();
        if (!q)
            return;
        if (q.v >= '1.0.1') {
            me.getButShow().setHidden(false);
            me.getButNew().setHidden(false);
            me.getButEdit().setHidden(false);
        }
    },
    /**
     * 動作選項改變
     */
    onFieldActionsChanged: function (button, newValue, oldValue, eOpts) {
        if (newValue == null) return; //not finished
        var me = this;

        var qs = OA.common.Global.getQ();
        if (qs.app !== '') return;

        //下一關流程
        var uiBarriers = OA.common.VIMgr.getBarriers(newValue);
        var sotreBarrier = me.getFieldBarriers().getStore();
        sotreBarrier.setData(null);
        sotreBarrier.setData(uiBarriers.items);
        me.getFieldBarriers().setValue(uiBarriers.selected);
    },
    /**
     * 下一關選項改變
     */
    onFieldBarriersChanged: function (button, newValue, oldValue, eOpts) {
        if (newValue == null)  return; //not finished
        var me = this;
        var r = me.getFieldBarriers().getRecord();
        var destJobNo = r.get('jobNo');
        var data = r.getData().selectItems;
        OA.common.Global.setDestJobNo(destJobNo);

        Ext.getStore('WorkFlow').setData(data);
        if (me.getPictureState()) me.getJointPaper().createJointGraph();
    },
    /**
     * 執行
     */
    onDoActionOK: function (button, e, eOpts) {
        if (!this.getFieldActions().getRecord()) return;

        var me = this;
        var selectActionData = this.getFieldActions().getRecord().getData();
        var selectBarrierData;
        if (this.getFieldBarriers().getRecord()) {
            selectBarrierData = this.getFieldBarriers().getRecord().getData();
        } else {
            selectBarrierData = null;
        }

        var selectBarrierVal = this.getFieldBarriers().getValue();
        if (!selectActionData) return;

        var data = Ext.JSON.decode(selectActionData.BeforeScriptParams);

        var paras = OA.common.Global.getInitParas();

        paras.version = OA.common.VIMgr.getCurrentEdition().版號; //簽核動作採用新版次
        paras.files = OA.common.VIMgr.getCurrentEditionFiles();

        paras.subRoleId = data.subRoleId;
        paras.subActionId = data.subActionId;
        paras.subFolderId = data.subFolderId;

        var note = this.getFieldNote().getValue();
        var workflows = OA.common.Utils.getWorkFlowData();

        if (selectActionData.methodId == 'forward') {
            paras.workFlowNodes = workflows;
            paras.dcsns = null;
            paras.oddf02Id = null;
            paras.retDesc = note;
        } else if (selectActionData.methodId == 'approve') {
            paras.workFlowNodes = workflows;

            //下一關為陳核，提早決清除後面流程
            var index = Ext.Array.map(paras.workFlowNodes, function (d) {
                return d['flag'];
            }).indexOf('目前');

            if (index >= 0) {
                var idx = index + 1;
                if (idx < paras.workFlowNodes.length) {
                    var _next = paras.workFlowNodes[idx];
                    if (_next.nodeType == '1')
                        paras.workFlowNodes = paras.workFlowNodes.where("( el, i, res, param ) => el.flag!='保留'");
                }
            }

            paras.dcsns = [{
                'dcsnEmplNo': paras.empNo, // 決行長官
                'dcsnLevel': selectBarrierVal,  // 決行層級 A11,A12,A21,A31,A41
                'dcsnDate': '',   // 決行日期 (紙本可修)
                'dcsnTime': '',   // 決行時間 (紙本可修)
                'dcsnDesc': note    // 決行說明
            }];

        } else if (selectActionData.methodId == 'backward') {
            paras.workFlowNodes = null;
            paras.dcsns = null;
            paras.oddf02Id = selectBarrierVal; //退回流程 id
            paras.dcsnNo = selectBarrierData.dcsnNo.toString();
            paras.retDesc = note;  //退文說明
        } else if (selectActionData.methodId == 'parallel') {
            paras.workFlowNodes = null;
            paras.dcsns = [{
                'dcsnEmplNo': paras.empNo, // 決行長官
                'dcsnLevel': '',  // 決行層級 A11,A12,A21,A31,A41
                'dcsnDate': '',   // 決行日期 (紙本可修)
                'dcsnTime': '',   // 決行時間 (紙本可修)
                'dcsnDesc': note    // 決行說明
            }];
        } else if (selectActionData.methodId == 'read') {
            var barriers = OA.common.VIMgr.getBarriers('read');
            paras.workFlowNodes = OA.common.Utils.toWorkFlowNodes(barriers.items);

            paras.dcsns = null;
        }

        var qs = OA.common.Global.getQ();
        if (qs.app === 'approve') {

            paras.func = 'doSign';
            paras.url = OA.common.UrlMgr.restUrl('barrier', selectActionData.methodId) +
                '?token=' + OA.common.UrlMgr.getToken() + '&by=ap';

            OA.client.File.doFile(paras, function (ret) {
                me.gotoHome();
            });


            // var socket = io.connect(KangDaAppConfig().host_sign);
            // socket.on('connect', function () {
            //     socket.emit('doSign', paras, function (ret) {
            //         console.log(ret);
            //     });
            //     socket.on('private message', function (response) {
            //         console.log(response);
            //     });
            //     socket.on('disconnect', function () {
            //         io.emit('user disconnected');
            //     });
            // });
            // Postmate.debug = true;
            // var handshake = new Postmate({
            //     container: document.body,
            //     url: KangDaAppConfig().host_sign,
            //     model: paras
            // }).then(function (child) {
            //     child.on('validated', function (response) {
            //         console.log(response);
            //         child.destroy();
            //     });
            //     child.get('doValidate');
            // });

        } else {
            var main = Ext.getCmp('main');
            var sotreCase = Ext.getStore('DocFlow');

            Ext.Viewport.setMasked({ xtype: 'loadmask', message: '處理中...' });
            console.log('處理中...');
            OA.client.Barrier.load(selectActionData.methodId, paras, {
                success: function (record, operation) {
                    Ext.Viewport.setMasked(false);
                    var message = record.get('message');
                    if (message) {
                        Ext.Msg.show({message: message, buttons: Ext.MessageBox.YES});
                        return;
                    }

                    main.setActiveItem('StageOfficialDoc');
                    sotreCase.remove(OA.common.Global.getCurrentDocFlowRecord());

                    //var _response = Ext.JSON.decode(operation.getResponse().responseText);
                    me.getApplication().getController('OA.controller.Menu').updateDocAreaHidden('hideAll');

                    Ext.Msg.alert(paras.doSno + ' 完成!');
                },
                failure: function (record, operation) {
                    Ext.Viewport.setMasked(false);
                    var message = '';
                    if (operation.getResponse() == null) {
                        message = '未正確連線!請檢查網路!';
                    } else {
                        var faliureResponse = Ext.JSON.decode(operation.getResponse().responseText);
                        message = faliureResponse.message + ' Error Code:' + faliureResponse.code;
                    }
                    Ext.Msg.show({message: message, buttons: Ext.MessageBox.YES});
                }
            });
        }
    },
    /**
     * 取消
     */
    onDoActionNO: function (button, e, eOpts) {
        this.gotoHome();
    },
    gotoHome: function () {
        var qs = OA.common.Global.getQ();
        if (qs.app === 'editor' || qs.app === 'draft' || qs.app === 'approve' || qs.app === 'review') {
            Ext.getCmp('main').setActiveItem('StageEditor');
        } else {
            Ext.getCmp('main').setActiveItem('StageOfficialDoc');
        }
    },
    /**
     * 流程圖模式
     */
    onButShowTap: function (button, e, eOpts) {
        var me = this;
        if (me.getPictureState()) {
            me.setPictureState(false);
            me.getButShow().setIconCls('fa-picture-o');
            me.getCtnWorkflow().setActiveItem(0);
        } else {
            me.setPictureState(true);
            me.getButShow().setIconCls('fa-list-alt');
            me.getCtnWorkflow().setActiveItem(1);

            me.getJointPaper().createJointGraph();
        }
    },
    /**
     * 編輯
     */
    onButEditTap: function (button, e, eOpts) {
        var me = this;
        var sotreWorkFlow = Ext.getStore('WorkFlow');

        if (me.getCtnWorkflow().getIsEdit()) { //將完成
            me.getButEdit().setText('編輯');
            me.getCtnWorkflow().setIsEdit(false);
            me.getWorkflowList().setDisableSelection(true);
            me.getApproveSelect().setMasked(false);
            me.getApproveConfirm().setMasked(false);
            me.getButNew().setDisabled(false);
            me.getButShow().setDisabled(false);

            //console.log(sotreWorkFlow.getData());
            sotreWorkFlow.each(function (record) {
                record.set('isDelete', false);
                record.set('isMove', false);

                //TODO: finished to save workflow and barrier
                //if (record.get('JobNo') ==OA.common.Global.getDestJobNo()){
                //    var b =me.getFieldBarriers().getRecord();
                //
                //    var idx =parseInt(b.get('code'), 10);
                //
                //    var storeBarrier = Ext.getStore('Barrier');
                //    var data =storeBarrier.getAt(idx);
                //    var items =sotreWorkFlow.getData();
                //
                //    //data.set('selectItems',?????)
                //
                //    console.log(items);
                //    console.log(record);
                //    console.log(b);
                //    console.log(data);
                //
                //    //b.set('lv',record.get('EmpName'));
                //}

            });

        } else { //編輯
            me.getButEdit().setText('完成');
            me.getCtnWorkflow().setIsEdit(true);
            me.getWorkflowList().setDisableSelection(false);

            me.getApproveSelect().setMasked(true);
            me.getApproveConfirm().setMasked(true);
            me.getButNew().setDisabled(true);
            me.getButShow().setDisabled(true);
            var isStart = false;
            sotreWorkFlow.each(function (record) {
                if (isStart) {
                    record.set('isDelete', true);
                    record.set('isMove', true);
                }

                if (record.get('Flag') == '目前') {
                    isStart = true;
                }

            });
        }
    },
    /**
     * 新增
     */
    onButNewTap: function (button, e, eOpts) {
        this.setOrgSelectItems([]);

        this.loadDept();
        OA.common.Funcs.widget('FlowOperation', button);
        this.getTextAreaOrg().setValue('');
    },
    /**
     * 人員新增
     */
    doOrgAdd: function (record) {
        var me = this;
        record.set('isAdd', true);
        var r = this.getNodeTypeSelect().getRecord();
        var _nodeMothed = me.getNodeMothedSelect().getGroupValue();
        var newItems = {
            'DepName': record.get('depName'),
            'DepNo': record.get('depNo'),
            'Description': '',
            'EmpName': record.get('empName'),
            'Flag': '保留',
            'JobName': record.get('jobName'),
            'JobNo': record.get('jobNo'),
            'JobType': '人員',
            'NodeMethod': _nodeMothed,
            'NodeType': r.get('NodeType'),
            'NodeTypeDesc': r.get('NodeTypeDesc'),
            'online': 'Y'
        };

        me.getOrgSelectItems().push(newItems);
        me.showTextArea();
    },
    showTextArea: function () {
        var items = [];
        Ext.Array.each(this.getOrgSelectItems(), function (n) {
            items.push(n.EmpName);
        });
        this.getTextAreaOrg().setValue(items.join(','));
    },
    removeTextAreaItem: function (record) {
        var me = this;
        record.set('isAdd', false);

        Ext.Array.each(me.getOrgSelectItems(), function (n) {
            if (n.JobNo == record.get('jobNo')) {
                Ext.Array.remove(me.getOrgSelectItems(), n);
            }
        });
        me.showTextArea();
    },
    /**
     * 是否為新增鈕
     */
    isAddButton: function (e) {
        var _isButton = false;
        if (!e)
            return _isButton;
        if (e.target.className === 'x-button-normal x-button')
            _isButton = true;
        return _isButton;
    },
    /**
     * 組織選擇:設定已新增
     */
    setAlreadyAdd: function (records) {
        Ext.Array.each(OA.common.Utils.getWorkFlowData(), function (n) {
            var r = records.where("( el, i, res, param ) => el.data.jobNo=='" + n.jobNo + "'");
            if (r.length > 0) {
                //console.log(r);
                r[0].set('isAdd', true);
            }
        });
    },
    /**
     * 組織選擇：簽核動作改變
     */
    onNodeTypeSelectChanged: function (button, e, eOpts) {
        if (e == null) //not finished
            return;
        this.loadDept();
    },
    /**
     * 取得組織成員
     */
    loadDept: function () {
        var me = this;
        var _nodeType = 1;

        if (me.getNodeTypeSelect())
            _nodeType = me.getNodeTypeSelect().getValue();

        var depNo = KangDaAppConfig().rootDeptNo;
        OA.client.Member.loadDept(depNo, _nodeType, {
            callback: function (records, operation, success) {
                me.setAlreadyAdd(records);

                var store = Ext.getStore('WorkFlow');
                var currentIdx = store.find('Flag', '目前');
                var item = store.getAt(currentIdx);

                var depNo = item.get('DepNo').toString();

                var idx = Ext.getStore('DeptTree').findBy(function (record, id) {
                    var isFind = false;
                    Ext.Array.each(record.getData().children, function (n) {
                        if (n.depNo == depNo) {
                            isFind = true;
                        }
                    });
                    if (isFind)
                        return true;
                });
                var node = Ext.getStore('DeptTree').getAt(idx);
                me.getDepList().goToNode(node);
                me.getDepList().getActiveItem().select(0);
                var r = Ext.create('OA.model.DeptTree', {
                    'depNo': item.get('DepNo')
                });

                me.getDepList().fireEvent("leafitemtap", null, null, 0, null, r, null);
            }
        });
    },
    /**
     * 組織選擇確定
     */
    onFlowOperationOK: function (button, e, eOpts) {
        var me = this;
        var ctr = this.getOrgSelectItems()[0];
        if (!ctr) return;

        var jobNo = ctr.JobNo;

        var store = Ext.getStore('WorkFlow');
        var currentIdx = store.find('Flag', '目前');
        var preItems = store.getRange(0, currentIdx);
        var lastItems = store.getRange(currentIdx + 1, store.getCount() - 1);
        var data = preItems.concat(this.getOrgSelectItems());
        var empName = this.getOrgSelectItems()[0].EmpName;
        if (lastItems[0]) {
            data = data.concat(lastItems);

            var storeBarrier = Ext.getStore('Barrier');
            var code = storeBarrier.getCount() + 1;

            var newData = {
                jobNo: jobNo,
                lv: empName,
                selectItems: data,
                code: code
            };

            storeBarrier.add(newData);
            me.getFieldBarriers().setValue(code);  //fire onFieldBarriersChanged()
        } else {

            var vi = OA.common.VIMgr.getViContent();
            vi.下一關.送陳 = {陳核流程: {Index: 2, JobNo: jobNo, 決行層級: empName, 收件者: data}};

            //動作
            var uiActions = OA.common.VIMgr.getActions('sign');
            var sotreSignAction = Ext.getStore('SignAction');
            sotreSignAction.setData(null);  //onFieldActionsChanged
            sotreSignAction.setData(uiActions);
            me.getFieldActions().setValue('forward');
        }

        button.up('panel').hide();
    },
    /**
     * 組織選擇取消
     */
    onFlowOperationNO: function (button, e, eOpts) {
        button.up('panel').hide();
    }
});
