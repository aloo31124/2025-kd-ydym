Ext.define("OA.store.Petition", {
    extend: 'Ext.data.Store',
    alias: 'store.Petition',
    requires: ['OA.model.Petition'],
    config: {
        model: 'OA.model.Petition'
    },
    CODE_TYPE: {
        FRM_DEAL_LEVEL: 1,
        BUS_CATEGORY: 2,
        SATISFY_NO_CODE: 3,
        CASE_CATEGORY: 4,
        POSTPONE_CODE: 5,
        REFCLOSE_CODE: 6,
        properties: {
            1: { name: '處理等級', value: 1, code: 'FRM_DEAL_LEVEL' },
            2: { name: '業務類別', value: 2, code: 'BUS_CATEGORY' },
            3: { name: '不附問卷原因', value: 3, code: 'SATISFY_NO_CODE' },
            4: { name: '案件類別', value: 4, code: 'CASE_CATEGORY' },
            5: { name: '延期原因', value: 5, code: 'POSTPONE_CODE' },
            6: { name: '存查原因', value: 6, code: 'REFCLOSE_CODE' }
        }
    },
    doInit: function () {
        var qd = OA.common.Global.getQueryDefault();
        if (!qd || !qd.交換資訊) return;

        var modifyTypes = [{ value: '辦結回復', key: 'FrmClose' }, { value: '先行回復', key: 'FrmPostpone' }, { value: '存查', key: 'FrmCloseAsRef' }];
        //var replyMethods = [{ value: 'E-MAIL', key: 'EMAIL' }, { value: '電話', key: 'PHONE' }, { value: '傳真', key: 'FAX' }, { value: '書面', key: 'DOC' }, { value: '回復系統', key: '回復系統' }];
        var replyMethods = [{ value: 'E-MAIL', key: 'EMAIL' }, { value: '電話', key: 'PHONE' }, { value: '傳真', key: 'FAX' }, { value: '書面', key: 'DOC' }];
        //var lawfulness =[{value: '是/ＯＯ法第Ｏ條第Ｏ款', key: 'Ｏ-Ｏ'}];
        var frmItems = {};
        var FrmCloseItems = {};
        FrmCloseItems.表單類型 = modifyTypes;
        FrmCloseItems.處理等級 = OA.common.Utils.keyPairTitle(qd.交換資訊.處理等級, 'Close');
        FrmCloseItems.業務類別 = OA.common.Utils.keyPair(qd.交換資訊.業務類別);
        //FrmCloseItems.回復方式 = replyMethods;
        FrmCloseItems.回復方式 = OA.common.Utils.keyPair(qd.交換資訊.回復方式);
        FrmCloseItems.不附問卷原因 = OA.common.Utils.keyPair(qd.交換資訊.不附問卷原因);
        FrmCloseItems.不附問卷原因.unshift({ key: '', value: '' });
        FrmCloseItems.其他補充說明 = '';
        //FrmCloseItems.適法性 = lawfulness;
        FrmCloseItems.適法性 = '';
        FrmCloseItems.案件類別 = OA.common.Utils.keyPair(qd.交換資訊.案件類別);
        FrmCloseItems.預設回復方式 = OA.common.Utils.keyPair(qd.交換資訊.預設回復方式);
        FrmCloseItems.回復民眾附件書面回復 = '';
        FrmCloseItems.受文者書面回復 = '';
        FrmCloseItems.地址書面回復 = '';


        var FrmPostponeItems = {};
        FrmPostponeItems.表單類型 = modifyTypes;
        FrmPostponeItems.處理等級 = OA.common.Utils.keyPairTitle(qd.交換資訊.處理等級, 'Postpone');
        //=>//帶入先行回復稿「預定完成日期」
        FrmPostponeItems.預定完成日 = qd.交換資訊.預定完成日;
        //=>

        //FrmPostponeItems.回復方式 = replyMethods;
        FrmPostponeItems.回復方式 = OA.common.Utils.keyPair(qd.交換資訊.回復方式);
        FrmPostponeItems.延期原因 = OA.common.Utils.keyPair(qd.交換資訊.延期原因);
        FrmPostponeItems.延期理由 = 'ＯＯＯＯＯ';
        FrmPostponeItems.預設回復方式 = OA.common.Utils.keyPair(qd.交換資訊.預設回復方式);
        FrmPostponeItems.回復民眾附件書面回復 = '';
        FrmPostponeItems.受文者書面回復 = '';
        FrmPostponeItems.地址書面回復 = '';

        var FrmCloseAsRefItems = {};
        FrmCloseAsRefItems.表單類型 = modifyTypes;
        FrmCloseAsRefItems.業務類別 = OA.common.Utils.keyPair(qd.交換資訊.業務類別);
        FrmCloseAsRefItems.提報特殊案件 = [{ value: '否', key: 'N' }, { value: '是', key: 'Y' }];
        FrmCloseAsRefItems.存查原因 = OA.common.Utils.keyPair(qd.交換資訊.存查原因);
        FrmCloseAsRefItems.擬辦說明 = '';

        frmItems.辦結回復 = FrmCloseItems;
        frmItems.先行回復 = FrmPostponeItems;
        frmItems.存查 = FrmCloseAsRefItems;

        this.frmItems = frmItems;

        // 辦理類別: [{value: '辦結回復', key: 'FrmClose'}, {value: '先行回復', key: 'FrmPostpone'}, {value: '存查', key: 'FrmCloseAsRef'}],
        // 處理等級: [{value: 'A-已依案執行完成', key: 'A'}, {value: 'B-已依案未執行完成', key: 'B'}],
        // 業務類別: [{value: '路燈維護-路燈遷移', key: 'A0001'}, {value: '樹木維護-樹木遷移', key: 'A0002'}],
        // 回復方式: [{value: 'E-MAIL', key: 'E-MAIL'}, {value: '電話', key: '電話'}, {value: '傳真', key: '傳真'}, {value: '書面', key: '書面'}, {value: '回復系統', key: '回復系統'}],
        // 滿意度調查表: [{value: '再次陳情而無新事由者', key: 'NO'}, {value: '有事由者', key: 'YES'}],
        // 適法性: [{value: '是/ＯＯ法第Ｏ條第Ｏ款', key: '1-2'}, {value: '是/臺北市XX法第２條第２款', key: '2-2'}],
        // 案件類別: [{value: '行政興革之建議', key: 'suggest'}, {value: '變更之建議', key: 'edit'}]

        // petition.先行回復 = {
        //     辦理類別: [{value: '辦結回復', key: 'FrmClose'}, {value: '先行回復', key: 'FrmPostpone'}, {value: '存查', key: 'FrmCloseAsRef'}],
        //     處理等級: [{value: 'A-已依案執行完成', key: 'A'}, {value: 'B-已依案未執行完成', key: 'B'}],
        //     回復方式: [{value: 'E-MAIL', key: 'E-MAIL'}, {value: '電話', key: '電話'}, {value: '傳真', key: '傳真'}, {value: '書面', key: '書面'}, {value: '回復系統', key: '回復系統'}],
        //     延期原因: [{value: '案情複雜及相關法令需調案查明', key: 'E'}, {value: '案情簡單相關法令需調案查明', key: 'S'}],
        //     延期理由: 'ＯＯＯＯＯ'
        // };
        // petition.存查 = {
        //     辦理類別: [{value: '辦結回復', key: 'FrmClose'}, {value: '先行回復', key: 'FrmPostpone'}, {value: '存查', key: 'FrmCloseAsRef'}],
        //     業務類別: [{value: '路燈維護-路燈遷移', key: 'A0001'}, {value: '樹木維護-樹木遷移', key: 'A0002'}],
        //     提報特殊案件: [{value: '是', key: 'Y'}, {value: '否', key: 'N'}],
        //     存查原因: [{value: '大量陳情案件', key: 'BIG'}, {value: '有問題陳情案件', key: 'PPP'}]
        // };
        // // petition.辦理類別, '處理等級', '業務類別', '回復方式', '滿意度調查表','適法性', '案件類別', '延期原因', '延期理由', '提報特殊案件', '存查原因','預定完成日'
        //
        // qd.陳情案件回復表 = petition;

        // var formData = qd.陳情案件回復表;
        // if (!formData) return;
        //
        // var items = [];
        // for (var ofkey in formData) {
        //     if (formData.hasOwnProperty(ofkey)) {
        //         var selects = formData[ofkey];
        //         for (var sel in selects) {
        //             if (selects.hasOwnProperty(sel)) {
        //                 var opts = selects[sel];
        //                 Ext.Array.each(opts,function(opt){
        //                     items.push({ofType:ofkey,ofDesc: opt.value, ofCode: opt.key});
        //                 });
        //             }
        //         }
        //     }
        // }
        // var store = Ext.getStore('Petition');
        // store.addData(items);
    }
});