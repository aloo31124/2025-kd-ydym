Ext.define('OA.model.CaseNo', {
    extend: 'Ext.data.Model',
    alias: 'model.CaseNo',
    config: {
        fields: [
            { name: "fsKindno", type: "string" },   //分類號
            { name: "fsKindname", type: "string" }, //類目名稱
            { name: "fsYrlimit", type: "string" },  //保存年限
            { name: "kindLevel", type: "string" },  //類目層級
            { name: "startDate", type: "string" },  //起用日期
            { name: "caseno", type: "string" },     //案次號
            { name: "kindName", type: "string" },   //分類名
            { name: "casenoName", type: "string" }  //案次名


            //年度號 fsYear
            //案次號 caseno
            //案名   casename
            //卷次號 portfoliono
            //目次號 aceano

        ]
    }
});