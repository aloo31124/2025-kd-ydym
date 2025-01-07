Ext.define('OA.model.VI', {
    extend: 'Ext.data.Model',
    alias: 'model.VI',
    requires: [
        'OA.common.Utils',
        'OA.common.UrlMgr'
    ],
    config: {
        fields: [
            'sid1', 'sid2', 'hashcode', 'hashvi', 'dialogType', 'doSno', 'doDeptno', 'depNo', 'empNo', 'jobNo',
            'orgNo', 'orgId', 'genDocNo', 'version', 'paperNo', 'agentEmplNo',
            'gbDocflowId', 'docType', 'epaper', 'empName', 'jobName',
            'roleId', 'folderId', 'actionId',
            'subRoleId', 'subFolderId', 'subActionId', 'subEmpName', 'subJobName', 'reOt',
            {
                name: 'viContent',
                mapping: function (o) {
                    try {
                        // 檢查 B64 和 fxp 是否已經定義
                        if (typeof B64 !== 'undefined' && typeof fxp !== 'undefined') {
                            var xmlString = B64.decode(o.data);  // 解碼 Base64 字串得到 XML 字符串

                            var parser = new fxp.XMLParser({
                                ignoreAttributes: false,  // 保留 XML 中的屬性
                                attributeNamePrefix: ""   // 使用空前綴來表示屬性
                            });
                            var result = parser.parse(xmlString);  // 解析 XML 字串為 JSON

                            // 調試用的日誌
                            console.log("成功解析的 JSON：", result.版本資訊);

                            return result.版本資訊;  // 返回 JSON 對象的版本資訊部分
                        } else {
                            // 如果 fxp 或 B64 未定義，直接返回原始值
                            return o.版本資訊;
                        }
                    } catch (e) {
                        console.error("解析失敗: ", e.message);
                        return null;
                    }
                }
            }
        ],
        proxy: {
            type: 'ajax',
            useDefaultXhrHeader: false,
            withCredentials: true,
            cors: true,
            writer: {
                type: 'json',
                writeAllFields: true
            },
            reader: {
                type: 'json',
                rootProperty: 'data'
            }
        }
    }
});
