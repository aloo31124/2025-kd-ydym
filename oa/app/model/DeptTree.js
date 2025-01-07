Ext.define('OA.model.DeptTree', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'empName',	//	館長室
            'jobType', //	單位
            'depType', //	2
            'orgNo',
            'children', //	null
            'depName', //	館長室
            'jobNo', //	*100015
            'depNo', //	1000
            'upDepNo', //	0000
            'jobName', //	館長室
            'isOpen', //	N
            'depKind',
            {name: "isAdd", type: "bool"},
            { name: "isDelete", type: "bool" },
            { name: "isAfter", type: "bool" }
        ]
    }
});