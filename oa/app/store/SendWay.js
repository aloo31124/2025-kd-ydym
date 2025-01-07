Ext.define("OA.store.SendWay", {
    extend: 'Ext.data.Store',
    alias: 'store.SendWay',
    requires: ['OA.model.SendWay'],
    config: {
        model: 'OA.model.SendWay'
    },
    doInit: function (notCopy) {
        var qd = OA.common.Global.getQueryDefault();
        console.log(qd);
        if (!qd || !qd.交換資訊) return;

        var sendways = qd.交換資訊.傳送方式;
        if (sendways) {
            var ways = [];
            for (var ofkey in sendways) {
                if (sendways.hasOwnProperty(ofkey)) {
                    var way = sendways[ofkey];
                    var isEnable = way.isEnable == 'N';
                    if (notCopy) {
                        if (!isEnable && way.ofDesc !== '抄本') ways.push({ ofDesc: way.ofDesc, ofCode: way.ofCode, dcsnLevel: way.dcsnLevel });
                    } else {
                        ways.push({ ofDesc: way.ofDesc, ofCode: way.ofCode, dcsnLevel: way.dcsnLevel });
                    }
                }
            }
            var store = Ext.getStore('SendWay');
            store.addData(ways);
            store.sort([{
                direction: 'ASC',
                sorterFn: function (r1, r2) {
                    var v1 = parseInt(r1.get('dcsnLevel'));
                    var v2 = parseInt(r2.get('dcsnLevel'));
                    return (v1 > v2) ? 1 : (v1 === v2 ? 0 : -1);
                }
            }]);
        }
    }
});