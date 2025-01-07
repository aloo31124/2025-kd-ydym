Ext.define("OA.store.Suggestion", {
    extend: 'Ext.data.Store',
    alias: 'store.Suggestion',
    requires: ['OA.model.Suggestion'],
    config: {
        model: 'OA.model.Suggestion',
        sorters: [{
            property: '最後更新時間',
            direction: 'DESC' // ASC 升序(由舊到新), DESC 降序(由新到舊)
        }]
    },
    doFilter: function (data) {
        //console.log(data);
        //var key = data.key; //承辦、會辦、核決
        var me = this;
        me.clearFilter();

       
        var filters = [];
        filters.push(new Ext.util.Filter({ property: '代碼', value: data.paperNo + '' }));  //同一文稿

         /*
        filters.push(new Ext.util.Filter({ property: '意見分類', value: key }));  //同一意見分類

        //承／會辦
        var current = OA.common.VIMgr.getCurrentEdition();

        var upDept = (current.簽核人員) ? current.簽核人員.所屬機構 : '';
        // var deptNo = (data.depNo) ? data.depNo : current.簽核人員.單位代碼;

        // console.log(current.簽核人員.使用者帳號 + ' ' + current.簽核人員.使用者名稱 + ' ' + current.簽核人員.所屬機構 + ' ' + current.簽核人員.服務單位 + ' ' + current.簽核人員.是否會辦);
        // console.log(current);
        // console.log('-------------------');

        // var qd = OA.common.Global.getQueryDefault();
        // var isMy = current.簽核人員.使用者職務代碼 === qd.承辦人.jobNo;
        // console.log(data);

        //所有找不到目前，當作會畢
        var allWithoutCurrent = OA.common.VIMgr.isParallelDraftNoCurrent();

        filters.push(new Ext.util.Filter({
            filterFn: function (item) {
                var isLook = false;
                var who = item.get('簽核人員');
                var noteInfo = me.hasNotesOpinion(who);    //未歸於會辦簽時，會辦即為主辦意見,同科室會辦
                var isSameUpDept = who.所屬機構 === upDept; //同機關

                // console.log(who);
                // console.log(noteInfo);
                if (noteInfo.isfind) {
                    if (noteInfo.current.會畢 == 'Y' || allWithoutCurrent) {
                        isLook = true;
                        if (isLook && data.depNo) isLook = data.depNo == noteInfo.current.單位代碼;
                        // console.log(who.服務單位 + ' ' + who.使用者名稱 +' ' + isLook);
                    } else if (noteInfo.current.會畢 == 'N') {
                        // console.log(current.簽核人員);
                        // console.log(who);
                        // console.log(data);

                        // 未會畢意見隱藏，僅限機關間隱藏，受會機關內部仍可看未會畢之意見
                        var isSame1 = data.upDepNo && data.upDepNo == who.所屬機構代碼;
                        var isSame2 = current.簽核人員 && current.簽核人員.所屬機構代碼 == who.所屬機構代碼;
                        if (isSame1 == undefined) isSame1 = true;
                        isLook = isSame1 && isSame2;
                    }
                } else {
                    if (data.depNo) {
                        if (data.depNo === data.upDepNo) {
                            isLook = true;
                        } else {
                            if (data.depNo == who.單位代碼) isLook = true;
                        }
                    } else if (item.get('代碼') && data.paperNo) {
                        if (item.get('代碼') == data.paperNo) isLook = true;
                    } else {
                        isLook = true;
                    }

                    // console.log(who.服務單位 + ' ' + who.使用者名稱 +' ' + isLook);
                    // console.log(who.所屬機構);
                    // console.log(upDept);
                    // console.log(isSameUpDept);
                    // if (p.roleId != '16' && p.roleId != '02' && isSameUpDept) isSameUpDept = who.單位代碼 === deptNo; //同機關時判斷到組

                    // isLook = isSameUpDept;
                    // if (data.isOver) isLook = true;
                    // if (isMy) isLook = true;
                    // if (current.簽核人員.所屬機構代碼 === 'AAAA') isLook = true;
                    // if (OA.common.Global.getQ().dialogType == '3') isLook = true;
                }

                //補核意見，只顯示在稿上
                if (item.get('線上簽核資訊').簽核流程.異動別 == '補核') {
                    data.text.indexOf('稿') != -1 ? isLook = true : isLook = false;
                }

                // console.log(isLook);
                return isLook;
            }
        }));
        */
        me.filter(filters);

        // var tmp = [];
        // me.each(function (r) {
        //     tmp.push({
        //         '代碼': r.get('代碼'),
        //         '意見分類': r.get('意見分類'),
        //         '使用者名稱': r.get('簽核人員').使用者名稱,
        //         '批示意見': r.get('批示意見').content,
        //         'depNo': r.get('簽核人員').單位代碼
        //     })
        // });
        // console.table(tmp);

    },
    //是否有會辦簽稿？
    hasNotesOpinion: function (who) {
        var item = {};
        var current = OA.common.VIMgr.getCurrentEdition();
        if (!current.會辦簽稿) return { isfind: false };

        var depNo = who.單位代碼;
        item.isfind = false;
        var units = current.會辦簽稿.單位;
        if (!Ext.isArray(units)) units = [units];

        Ext.Array.forEach(units, function (unit) {
            if (unit.單位) {
                var subUnits = unit.單位;
                if (!Ext.isArray(subUnits)) subUnits = [subUnits];
                Ext.Array.forEach(subUnits, function (sub) {
                    if (sub.單位代碼 == depNo) {
                        item.up = unit;
                        item.current = sub;
                        item.isfind = true;
                    }
                });
            } else {
                //TODO:修正以所屬機構代碼
                // if (who.所屬機構代碼 == unit.單位代碼) {
                //     item.current = unit;
                //     item.isfind = true;
                // }
                var upDeptName = unit.名稱.replace('高雄市政府', '');
                if (who.所屬機構 == upDeptName) {
                    item.current = unit;
                    item.isfind = true;
                }
            }
        });
        return item;
    }
});