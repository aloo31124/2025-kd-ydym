Ext.define('OA.model.WorkFlow', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'DepName', 'DepNo', 'Description', 'EmpName', 'Flag', 'JobName', 'JobNo', 'JobType',
            'NodeMethod', 'NodeType', 'NodeTypeDesc', 'online',

            //View Model
            'isDelete','isMove'
        ],
        autoSync:true
    }
});