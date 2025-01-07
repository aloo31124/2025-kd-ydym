Ext.define('OA.model.Emp', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            'empName',	//莫少蔥
            'depName',	//特藏文獻組辦公室
            'empNo',	//elva3
            'depNo',	//3710
            'jobNo',	//3710008
            'jobName',	//測試主管
            'isOpen',	//Y
            {name: "isAdd", type: "bool"}
        ]
    }
});