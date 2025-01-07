/**
 * 共用欄位
 */

Ext.define('OA.common.Fields', {
    singleton: true,
    alias: 'common.Fields',
    config: {},
    Enum: {
        FormTodoWay: '擬辦方式',
        FormDraftTopMark: '輸入擬辦方式',
        FormSpeed: '速別',
        FormAddress: '地址',
        FormSentDate: '發文日期',
        FormContact: '聯絡方式',
        FormSentPaperOrg: '發文機關',
        FormSentPaperNo: '發文字號',
        FormApproveLevel: '決行層級',
        FormSentPaperName: '署名',
        FormFileNo: '檔號',
        FormYear: '保存年限',
        FormSecurity: '密等及解密條件或保密期限',
        FormCoOrg: '會辦單位',
        FromOriginalDoc: '正本',
        FromDuplicateDoc: '副本',
        FromCopyDoc: '抄本',
        FormMtReason: '開會事由',
        pickerMtDateTime: '開會時間',
        FormMtAddress: '開會地點',
        FormMtContact: '聯絡人及電話',
        FormYMD: '年月日',
        FormOrg: '機關',
        FormSincerely: '核示',
        FormAppellation: '稱謂',
        FormAppellationEnd: '結尾敬辭',
        FormAppellationSelf: '結尾自稱語',
        FormOrgNotesOtherName: '註記',
        FormUrgencyLevels: '處理級別',
        FormOfficialFormat: '公文格式',
        properties: {
            //函、令
            檔號: { by: "FormFileYear", code: "檔號", value: 1 },
            保存年限: { by: "FormFileYear", code: "保存年限", value: 2 },
            擬辦方式: { by: "FormDraftTopMark", code: "擬辦方式", value: 3 },
            發文機關: { by: "FormSentPaper", code: "發文機關", value: 4 },
            地址: { by: "FormAddress", code: "地址", value: 5 },
            聯絡方式: { by: "FormPopup", code: "聯絡方式", value: 6 },
            發文日期: { by: "pickerDateTime", code: "發文日期", value: 7 },
            發文字號: { by: "FormSentPaper", code: "發文字號", value: 8 },
            速別: { by: "FormSpeed", code: "速別", value: 9 },
            密等及解密條件或保密期限: { by: "FormSecurity", code: "密等及解密條件或保密期限", value: 10 },
            附件上傳: { by: "PanelAttach", code: "附件上傳", value: 11 },
            附件: { by: "FormAttachDesc", code: "附件", value: 12 },
            附件歷程: { by: "FormAttachCourse", code: "附件歷程", value: 13 },
            正本: { by: "PanelChange", code: "正本", value: 14 },
            副本: { by: "PanelChange", code: "副本", value: 15 },
            抄本: { by: "PanelChange", code: "抄本", value: 16 },
            署名: { by: "FormSentPaper", code: "署名", value: 17 },
            稿署名: { by: "FormSentPaper", code: "稿署名", value: 89 },
            會辦單位: { by: "FormCoOrg", code: "會辦單位", value: 18 },
            //決行層級: { by: "FormApproveLevel", code: "決行層級", value: 19 },
            決行層級: { by: "FormDraftTopMark", code: "決行層級", value: 19 },
            受文者: { by: "FormSimple", code: "受文者", value: 20 },
            //應用限制: { by: "FormDraftTopMark", code: "應用限制", value: 21 },
            承辦單位: { by: "FormTextArea", code: "承辦單位", value: 22 },

            //會通知單
            開會事由: { by: "FormMtReason", code: "開會事由", value: 23 },
            開會時間: { by: "pickerMtDateTime", code: "開會時間", value: 24 },
            開會地點: { by: "FormMtAddress", code: "開會地點", value: 25 },
            聯絡人及電話: { by: "FormMtContact", code: "聯絡人及電話", value: 26 },
            主持人: { by: "PanelChange", code: "主持人", value: 28 },
            出席者: { by: "PanelChange", code: "出席者", value: 29 },
            列席者: { by: "PanelChange", code: "列席者", value: 30 },

            //簽
            處理級別: { by: "FormDraftTopMark", code: "處理級別", value: 87 },
            註記: { by: "FormOrgNotesOtherName", code: "註記", value: 67 },
            年月日: { by: "pickerDateTime", code: "年月日", value: 31 },
            機關: { by: "FormOrg", code: "機關", value: 32 },
            敬陳: { by: "FormNoteSubmit", code: "敬陳", value: 33 },
            核示: { by: "FormSimple", code: "核示", value: 34 },
            敬會: { by: "FormCoOrg", code: "敬會", value: 50 },
            // 職: { by: "FormTextArea", code: "職", value: 85 },
            敬致: { by: "FormCoOrg", code: "敬致", value: 88 },
            局處單位: { by: "FormNoteSubmit", code: "局處單位", value: 90 },


            //會勘通知單
            會勘事由: { by: "FormTextArea", code: "會勘事由", value: 35 },
            會勘時間: { by: "pickerMtDateTime", code: "會勘時間", value: 36 },
            會勘地點: { by: "FormTextArea", code: "會勘地點", value: 37 },

            //簽稿會核單、會銜會辦單，會銜印信蓋用
            機關名稱: { by: "FormSimple", code: "機關名稱", value: 39 },
            案情摘要: { by: "FormTextArea", code: "案情摘要", value: 40 },
            主辦單位: { by: "FormTextArea", code: "主辦單位", value: 41 },
            總收文號: { by: "FormTextArea", code: "總收文號", value: 42 },
            會銜主旨: { by: "FormTextArea", code: "會銜主旨", value: 43 },
            主辦單位: { by: "FormTextArea", code: "主辦單位", value: 44 },
            會銜公文: { by: "FormTextArea", code: "會銜公文", value: 45 },
            主辦機關: { by: "FormTextArea", code: "主辦機關", value: 46 },
            會辦機關: { by: "FormCoOrgTextArea", code: "會辦機關", value: 47 },
            受會單位: { by: "FormCoOrg", code: "受會單位", value: 48 },
            會銜發文字號: { by: "FormTextArea", code: "會銜發文字號", value: 85 },


            //機密文書
            通知機關: { by: "FormTextArea", code: "通知機關", value: 67 },
            通知機關發文日期: { by: "pickerDateTime", code: "通知機關發文日期", value: 68 },
            通知機關發文字號: { by: "FormTextArea", code: "通知機關發文字號", value: 69 },
            原機密案件發文日期: { by: "pickerDateTime", code: "原機密案件發文日期", value: 70 },
            原機密案件發文字號: { by: "FormTextArea", code: "原機密案件發文字號", value: 71 },
            新等級或註銷: { by: "FormTextArea", code: "新機密或註銷", value: 72 },
            登記人: { by: "FormPNRContact", code: "登記人", value: 73 },
            原機密案件日期: { by: "pickerDateTime", code: "原機密案件日期", value: 74 },

            文號: { by: "FormTextArea", code: "文號", value: 75 },
            文別: { by: "FormTextArea", code: "文別", value: 76 },
            案由: { by: "FormTextArea", code: "案由", value: 77 },
            受文機關: { by: "FormTextArea", code: "受文機關", value: 78 },
            抄送副本機關: { by: "FormTextArea", code: "抄送副本機關", value: 79 },
            原機密等級: { by: "FormTextArea", code: "原機密等級", value: 80 },
            新機密等級或註銷: { by: "FormTextArea", code: "新機密等級或註銷", value: 81 },
            變更機密等級或理由: { by: "FormTextArea", code: "變更機密等級或理由", value: 82 },
            備考: { by: "FormTextArea", code: "備考", value: 83 },
            陳核: { by: "FormTextArea", code: "陳核", value: 84 },
            輸入擬辦方式: { by: "FormDraftTopMark", code: "輸入擬辦方式", value: 85 }
        }
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    /**
     * 開啟欄位表單視窗
     */
    popupFromShow: function (key) {
        //console.log(key);
        var notEdit = true;
        var qs = OA.common.Global.getQ();
        var ctr = OA.common.Paper.main();
        var init = OA.common.Global.getInitParas();
        var role = OA.common.Global.getCurrentRole();
        if (ctr) {
            var svg = ctr.getSvgPaper();
            if (svg && svg.getMode() == 'textedit') svg.setMode('select');
            notEdit = !ctr.getIsFieldEdit();  //要有編輯權限
        }

        // if (key == '稿署名') key = '署名';
        //if (key == '會辦單位' && OA.common.Utils.checkEpaper()) notEdit = true;  //非紙本簽核不改會辦單位
        //if (key == '會辦單位' && qs.app === 'offline') notEdit = false;

        if (key == '密等及解密條件或保密期限') {    //非紙本或密件簽核不能改密件
            if (OA.common.Utils.checkEpaper()) {
                notEdit = true;
            }
            if (qs.sFlag == "Y") notEdit = false; 

            if (qs.app == "offline") notEdit = false; 
        }       


        if (['附件上傳', '附件歷程', '發文機關','發文字號'].indexOf(key) >= 0) {
            //if (qs.roleId == '02')
                notEdit = false;
        }


        if (qs.app == 'approve' || qs.app == 'editor') {
            if (!OA.common.Utils.checkEpaper()) {
                if (['正本', '副本', '抄本', '出席者', '列席者', '主持人', '檔號', '保存年限', '發文機關', '發文字號'].indexOf(key) >= 0) {
                    notEdit = false;
                }
            }
        }


        if (qs.reOt === 'F') {
            if (role && role.roleId == '02') {
                if (['附件上傳', '附件歷程', '發文機關', '正本', '副本', '抄本', '出席者', '列席者', '主持人', '檔號', '保存年限', '發文日期'].indexOf(key) >= 0) {
                    notEdit = false;
                } else {
                    notEdit = true;
                }
            } else {
                notEdit = true;
            }
        }

        //notEdit = false;
        ////核稿秘書給附件編輯權限、發文、繕校、監印，開附件權限、會辦單位開附件權限
        //if (qs.isRole15 && ['附件上傳', '附件歷程'].indexOf(key) >= 0)
        //    notEdit = false;

        ////
        //if (qs.roleId === '02' && ['附件上傳', '附件歷程'].indexOf(key) >= 0)
        //    notEdit = false;

        //會辦單位開附件權限
        //if (OA.common.VIMgr.isParallel() && '附件上傳'.indexOf(key) >= 0)
        //    notEdit = false;

        //已有大型附件時，附件說明不可編輯
        //if (key === '附件') {
        //    var store = Ext.getStore('Attach');
        //    var isMoveBig = false;
        //    Ext.Array.each(store.data.all, function (r) {
        //        if (r.get('file').status.toString() !== '0' && r.get('sort') == 'big') isMoveBig = true;
        //    });
        //    //store.each(function (r) {
        //    //    if (r.get('file').status.toString() !== '0' && r.get('sort') == 'big') isMoveBig = true;
        //    //});
        //    if (isMoveBig) notEdit = true;
        //}


        //重新發文不可編輯發文日期
        //if (key === '發文日期' && qs.reOt) notEdit = true;

        if (notEdit) return;

        var isKDRichTextBlock = (key) ? key.indexOf('KDRichTextBlock') >= 0 : false;
        if (isKDRichTextBlock) {
            var elem = svgedit.utilities.getElem(key);
            if (elem) {
                Ext.Msg.prompt('', '', function (key, value) {
                    if (key === 'ok') {
                        elem.textContent = value;
                    }
                }, this, false, elem.textContent);
            }
            return;
        }

        var field = OA.common.Fields.Enum.properties[key];

        /*
        if (init.documentType !== "簽稿會核單") {
            if (field && field.by === 'PanelChange') {

                var vm = OA.common.Global.getCurrentViewModel();
                var contact = vm.ContactList;
                console.log(contact)
                //var layout = OA.common.Utils.removeSupport(ctr.getFields());
                //form.create(key, layout, data);

                if (contact && contact.length > 0) {

                    var reLoadDep3 = [];
                    Ext.Array.each(contact, function (con) {
                        if ((con.TRANSTYPE + '') == '2' && (con.ADDR + '').trim() == '' && (con.GROUP + '') == '1') {
                            reLoadDep3.push(con);
                        }
                    });

                    if (reLoadDep3.length > 0) {
                        //重新比對地址簿
                        var index = 0;
                        Ext.Array.each(reLoadDep3, function (dep3) {
                            var data = {};
                            data.qType = '0';
                            data.start = 0;
                            data.limit = 1;
                            data.depNo = init.depNo;
                            data.empNo = init.empNo;
                            data.dep3ChnName = (dep3.CODENAME + '').replace('（含附件）', '').replace('（含附錄）', '');
                            console.log(data);

                            OA.client.Member.search(data, function (ret) {
                                index++;
                                console.log(ret)
                                if (ret.length != 0 && ret[0]) {
                                    var child = ret[0];
                                    console.log(child);
                                    Ext.Array.each(contact, function (con) {
                                        console.log(con);
                                        if (dep3.CODENAME == con.CODENAME) {
                                            con.CODE = child.get('dep3No') || '';
                                            con.ADDR = child.get('dep3Addr') || '';
                                            con.ARCENO = child.get('dep3Zone') || '';
                                        }
                                    })
                                }
                                if (index == reLoadDep3.length) {
                                    var popOdaf05 = window.open('../docMaker/subForm/popOdaf05.jsp',
                                        '',
                                        "width=1000,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
                                    popOdaf05.opener.getPopOdaf05Data = function (json) {
                                        console.log(json);
                                        var jsonArray = JSON.parse(json);
                                        var child = [];
                                        Ext.Array.each(jsonArray, function (r) {
                                            child.push({
                                                ADDR: r.ADDR || '',
                                                ARCENO: r.ARCENO || '',
                                                CODE: r.CODE || '',
                                                CODENAME: r.CODENAME || '',
                                                GROUP: r.GROUP || '',
                                                GROUPLIST: r.GROUPLIST || '',
                                                KEY: r.KEY || '',
                                                PEOPLESEND: r.PEOPLESEND || '',
                                                REALTRANSTYPE: r.REALTRANSTYPE || '',
                                                TRANSTYPE: r.TRANSTYPE || '',
                                                TRANSTYPENAME: r.TRANSTYPENAME || '',
                                                TYPE: r.TYPE || '',
                                                VALUE: r.VALUE || '',
                                                ATTACH: r.ATTACH || '',
                                                tagName: "Contact"
                                            });
                                        });


                                        var contact = Ext.getStore('Contact');
                                        contact.clearFilter();
                                        contact.setData(null);
                                        contact.addData(child);
                                        console.log(contact);

                                        var data = {};
                                        var tagNames = ['正本', '副本','抄本', '出席者', '列席者', '主持人']
                                        Ext.Array.each(tagNames, function (name) {
                                            var items = [];
                                            Ext.Array.each(contact.data.all, function (r) {
                                                if (r.get('KEY') == name) {
                                                    var otherTag = '';

                                                    if (r.get('KEY') === '副本' && r.get('ATTACH') === 'Y')
                                                        otherTag += '（含附件）';

                                                    if (r.get('TRANSTYPE') == '2' && r.get('ADDR') && r.get('ADDR').length > 0)
                                                        otherTag

                                                    items.push(r.get('VALUE') + otherTag)
                                                }
                                                data[name] = items.join('、');
                                            });

                                        })
                                        contact.clearFilter();
                                        OA.common.Paper.main().updateWKContactList(data);
                                    }

                                    popOdaf05.opener.setPopOdaf05Data = function () {
                                        //直接拿Contact組JSON給管理store可能沒有資料要拿VM裡的           
                                        var vm = OA.common.Global.getCurrentViewModel();
                                        var contact = vm.ContactList;
                                        jsonData = JSON.stringify(contact);
                                        console.log(jsonData);
                                        return jsonData;

                                    }
                                }
                            });
                        });

                    } else {
                        var popOdaf05 = window.open('../docMaker/subForm/popOdaf05.jsp',
                            '',
                            "width=1000,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
                        popOdaf05.opener.getPopOdaf05Data = function (json) {
                            console.log(json);
                            var jsonArray = JSON.parse(json);
                            var child = [];
                            Ext.Array.each(jsonArray, function (r) {
                                child.push({
                                    ADDR: r.ADDR || '',
                                    ARCENO: r.ARCENO || '',
                                    CODE: r.CODE || '',
                                    CODENAME: r.CODENAME || '',
                                    GROUP: r.GROUP || '',
                                    GROUPLIST: r.GROUPLIST || '',
                                    KEY: r.KEY || '',
                                    PEOPLESEND: r.PEOPLESEND || '',
                                    REALTRANSTYPE: r.REALTRANSTYPE || '',
                                    TRANSTYPE: r.TRANSTYPE || '',
                                    TRANSTYPENAME: r.TRANSTYPENAME || '',
                                    TYPE: r.TYPE || '',
                                    VALUE: r.VALUE || '',
                                    ATTACH: r.ATTACH || '',
                                    tagName: "Contact"
                                });
                            });


                            var contact = Ext.getStore('Contact');
                            contact.clearFilter();
                            contact.setData(null);
                            contact.addData(child);
                            console.log(contact);

                            var data = {};
                            var tagNames = ['正本', '副本', '抄本', '出席者', '列席者', '主持人']
                            Ext.Array.each(tagNames, function (name) {
                                var items = [];
                                Ext.Array.each(contact.data.all, function (r) {
                                    if (r.get('KEY') == name) {
                                        var otherTag = '';

                                        if (r.get('KEY') === '副本' && r.get('ATTACH') === 'Y')
                                            otherTag += '（含附件）';

                                        if (r.get('TRANSTYPE') == '2' && r.get('ADDR') && r.get('ADDR').length > 0)
                                            otherTag

                                        items.push(r.get('VALUE') + otherTag)
                                    }
                                    data[name] = items.join('、');
                                });

                            })
                            contact.clearFilter();
                            OA.common.Paper.main().updateWKContactList(data);
                        }

                        popOdaf05.opener.setPopOdaf05Data = function () {
                            //直接拿Contact組JSON給管理store可能沒有資料要拿VM裡的
                            //var contact = Ext.getStore('Contact');
                            var vm = OA.common.Global.getCurrentViewModel();
                            var contact = vm.ContactList;
                            jsonData = JSON.stringify(contact);
                            console.log(jsonData);
                            return jsonData;
                        }
                    }
                } else {

                    var popOdaf05 = window.open('../docMaker/subForm/popOdaf05.jsp',
                        '',
                        "width=1000,height=600,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,toolbar=no");
                    popOdaf05.opener.getPopOdaf05Data = function (json) {
                        console.log(json);
                        var jsonArray = JSON.parse(json);
                        var child = [];
                        Ext.Array.each(jsonArray, function (r) {
                            child.push({
                                ADDR: r.ADDR || '',
                                ARCENO: r.ARCENO || '',
                                CODE: r.CODE || '',
                                CODENAME: r.CODENAME || '',
                                GROUP: r.GROUP || '',
                                GROUPLIST: r.GROUPLIST || '',
                                KEY: r.KEY || '',
                                PEOPLESEND: r.PEOPLESEND || '',
                                REALTRANSTYPE: r.REALTRANSTYPE || '',
                                TRANSTYPE: r.TRANSTYPE || '',
                                TRANSTYPENAME: r.TRANSTYPENAME || '',
                                TYPE: r.TYPE || '',
                                VALUE: r.VALUE || '',
                                ATTACH: r.ATTACH || '',
                                tagName: "Contact"
                            });
                        });


                        var contact = Ext.getStore('Contact');
                        contact.clearFilter();
                        contact.setData(null);
                        contact.addData(child);
                        console.log(contact);

                        var data = {};
                        var tagNames = ['正本', '副本', '抄本', '出席者', '列席者', '主持人']
                        Ext.Array.each(tagNames, function (name) {
                            var items = [];
                            Ext.Array.each(contact.data.all, function (r) {
                                if (r.get('KEY') == name) {
                                    var otherTag = '';

                                    if (r.get('KEY') === '副本' && r.get('ATTACH') === 'Y')
                                        otherTag += '（含附件）';

                                    if (r.get('TRANSTYPE') == '2' && r.get('ADDR') && r.get('ADDR').length > 0)
                                        otherTag

                                    items.push(r.get('VALUE') + otherTag)
                                }
                                data[name] = items.join('、');
                            });

                        })
                        contact.clearFilter();
                        OA.common.Paper.main().updateWKContactList(data);
                    }

                    popOdaf05.opener.setPopOdaf05Data = function () {
                        //直接拿Contact組JSON給管理store可能沒有資料要拿VM裡的
                        //var contact = Ext.getStore('Contact');
                        var vm = OA.common.Global.getCurrentViewModel();
                        var contact = vm.ContactList;
                        jsonData = JSON.stringify(contact);
                        console.log(jsonData);
                        return jsonData;
                    }
                }
                return;
            }
        }*/

        if (key === '稿面註記')
            field = { by: "FormDraftTopMark", code: "稿面註記" };

        if (key == '請說明' && init) {
            if (init.documentType == '蓋用印信申請表') {
                var exp = svgedit.utilities.getElem('請說明');
                var desc = '';
                if (exp) {
                    var idx = exp.textContent.lastIndexOf('）');
                    if (idx > 0) {
                        desc = exp.textContent.substring(0, idx);
                        if (desc.length > 0) {
                            Ext.Msg.prompt('', '請說明: ', function (ok, value) {
                                if (ok === 'ok') {
                                    ctr.updateCheckboxFiled('其他', value, false);
                                    return;
                                }
                            }, this, false, desc);
                        }
                    }
                }
            }
        }
        //console.log(init.documentType);

        if (!field) return;
        //var init = OA.common.Global.getInitParas();
        if (init && (init.documentType == '蓋用印信申請表') && key == '發文字號')
            field.by = 'FormTextArea';

        if (field.by === 'pickerDateTime') {
            ctr.openPickerDate(key);
            return;
        } else if (field.by === 'pickerMtDateTime') {
            if (Ext.os.deviceType == 'Phone') {
                ctr.openPickerDateTimeMobile(key);
            } else {
                ctr.openPickerDateTime(key);
            }
            return;
        } else if (field.by === 'pickerBetweenDateTime') {
            ctr.pickerBetweenDateTime(key);
            return;
        } else if (field.by === 'checkbox') {
            ctr.doCheckboxFiled(key);
            return;
        }

        var form = Ext.Viewport.down(field.by);
        if (!form) {
            form = Ext.create('widget.' + field.by);
            Ext.Viewport.add(form);
        }
        if (key == OA.common.Fields.Enum.FormContact) {
            var formfields = [];
            Ext.each(ctr.getContactFields(), function (p) {
                formfields.push({
                    label: p,
                    xtype: 'textfield',
                    name: p
                });
            });
            form.create(formfields);
            var h = (formfields.length * 120);
            form.setHeight(h);
        }

        var isDataFrom = ['FormSentPaper', 'FormMtContact', 'PanelAttach', 'FormAttachCourse',
                'PanelOverprint', 'FormLineContact', 'FormPNRContact', 'FormPhoneContact',
            'FormSealWordNo', 'FormDraftTopMark', 'FormOrgNotesOtherName','FormApproveLevel'].indexOf(field.by) >= 0;
        var data = OA.common.Global.getCurrentViewModel();
        if (isDataFrom) {
            form.create(data);
        } else if (field.by === 'PanelChange') {
            var layout = OA.common.Utils.removeSupport(ctr.getFields());
            form.create(key, layout, data);
            //window.open('../docMaker/subForm/popOdaf05.jsp?source=hid_json&target=hid_contact&js=opener.doChooseAddresseeComplete');
            //return;
        } else if (field.by === 'FormSimple' || field.by === 'FormTextArea' || field.by === 'FormCoOrgTextArea'
            || field.by === 'FormCoOrg' || field.by === 'FormPetition' || field.by === 'FormSalaryNoticeTextArea' ||
            field.by =='FormNoteSubmit') {
            form.create(key, data);
        } else if (field.by === 'FormOrg') {
            var d = Ext.util.Format.trim(data[OA.common.Fields.Enum.FormOrg].replace(' 於     ', ''));
            data[OA.common.Fields.Enum.FormOrg] = d;
            var initParas = OA.common.Global.getInitParas();
            data.sendNo = initParas.sendNo;
            form.setValues(data);
        }else if (field.by === 'FormAppellationSelf') {
            // var FormOrgNotesOtherName = Ext.util.Format.trim(data[OA.common.Fields.Enum.FormOrgNotesOtherName]);
            // data[OA.common.Fields.Enum.FormOrgNotesOtherName] = FormOrgNotesOtherName;
            form.setValues(data);
        } else if (field.by === 'FormFileYear') {
            let yearNo = '';
            const isInitField = (!data.年度 || data.年度.toString().trim().length === 0);
            if (isInitField) { // 初始 年度檔案視窗 欄位資料
                yearNo = (new Date()).getFullYear() - 1911; // 取當前年度
            } else {
                yearNo = data.年度;
            }

            OA.client.Member.loadCaseNo(OA.common.Global.getInitParas().depNo, yearNo, (updateInfo) => {
                if(isInitField && updateInfo.length === 0) {
                    data.年度 = yearNo;
                    Ext.Msg.alert("", yearNo + "年度, 尚無資料");
                } else if(isInitField) {
                    data.年度 = updateInfo[0].startDate || '';
                    data.分類號 = updateInfo[0].fsKindno || '';
                    data.案次號 = updateInfo[0].caseno || '';
                    data.保存年限 = updateInfo[0].fsYrlimit || '';
                }
                form.create(data);
            });
        } else {
            data[key] = (data[key]) ? data[key].toString().trim() : '';
            form.setValues(data);
        }

        var menuLeft = Ext.Viewport.getMenus().left;
        var isMenuLeftHidden = (menuLeft) ? menuLeft.getHidden() : true;
        if (isMenuLeftHidden == false) {
            form.setLeft('5%');
            form.setTop('10%');
            form.setMaxWidth('70%');
        } else {
            form.setMaxWidth('100%');
        }
        form.show();
    },
    /**
     * 開啟欄位表單視窗
     */
    popupFromGrid: function (field) {
        var isShow = false;
        var data = {};
        if (field.by === 'FormSealApprovalsGrid') {
            isShow = field.key.indexOf('申請機關') >= 0 || field.key.indexOf('組織法規') >= 0 || field.key.indexOf('請發事由') >= 0
                || field.key.indexOf('等級') >= 0 || field.key.indexOf('審核意見') >= 0 || field.key.indexOf('備考') >= 0;
            data.foucsId = field.key;
        }

        if (!isShow) {
            this.popupFromShow(field.key);
            return;
        }
        var form = Ext.Viewport.down(field.by);
        if (!form) {
            form = Ext.create('widget.' + field.by);
            Ext.Viewport.add(form);
        }

        form.create(data);
        form.show();
    }
});

