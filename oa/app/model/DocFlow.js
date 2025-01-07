Ext.define('OA.model.DocFlow', {
    extend: 'Ext.data.Model',
    requires: [

    ],
    config: {
        // idProperty: 'doSno',
        fields: [
            { name: "doSno", type: "string"},
            { name: "doDeptno", type: "string"},
            { name: "depName", type: "string"},
            { name: "dialogType", type: "string"},
            { name: "state", type: "string"},
            { name: "title", type: "string"},
            { name: "orgName", type: "string"},
            { name: "speed", type: "string"},
            { name: "user", type: "string"},
            { name: "userId", type: "string"},
            { name: "date", type: "string" },       //收文日
            { name: "gbDocflowId", type: "string" },
            { name: "docType", type: "string" },
            { name: "roleId", type: "string" },
            { name: "folderId", type: "string" },
            { name: "actionId", type: "string" },
            { name: "status1", type: "string" },    //第一碼表:公文類別 1=來文 2=創稿 3=創簽 4=表單
            { name: "status2", type: "string" },    //第二碼表:陳核狀態 1=非續辦 2=續辦
            { name: "status3", type: "string" },    //第三碼表:陳核狀態 1=陳核中 2=已完成
            { name: "status4", type: "string" },    //第四碼表:陳核方式 1=紙本陳核 2=線上陳核
            { name: "status5", type: "string" },    //第五碼表:陳核類別 0=待辦 1=陳核 2=內會 3=外會 4=補核
            { name: "status6", type: "string" },    //第六碼表:是否退文 1=否 2=是
            { name: "status7", type: "string" },    //第七碼表:是否主檔 1=主案 2=子案
            { name: "rsvEndDate", type: "string" }, //限辦日
            { name: "epaper", type: "string" },
            { name: "dcsnLevel", type: "string" }   //決行層級
        ]
    }
});