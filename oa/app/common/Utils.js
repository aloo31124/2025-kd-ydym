/**
 * 共用工具
 */

Ext.define('OA.common.Utils', {
    alias: 'common.Utils',
    statics: {
        getRandom: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        /*
         * 檢查字串是否空白, 無效
         */
        checkStringIsEmpty: function(val) {
            if(val === undefined) {
                return true;
            }
            else if(val === null) {
                return true;
            }
            else if(!val) {
                return true;
            }
            else if(val.toString().trim().length > 0) {
                return false; // 有效, 非空白
            }
            return true;
        },
        checkNumber: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for (var i = 0; i < 8; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        },
        //http://stackoverflow.com/questions/4539253/what-is-console-log
        log: function (msg) {
            if (window.console && window.console.log) {
                console.log(msg);
            } else {
                alert(msg);
            }
        },
        error: function (msg) {
            if (window.console && window.console.error) {
                console.error(msg);
            } else {
                alert(msg);
            }
        },
        msg: function (msg) {
            Ext.Msg.alert('提示', msg);
        },
        /*
         * 確認視窗confirm, 並回傳 非同步 Promise 結果
         */
        confirmDialog: function (title, message) {
            return new Promise((resolve) => {
                Ext.Msg.confirm(title, message, function (result) {
                    resolve(result);
                });
            });
        },
        toWorkFlowNodes: function (items) {
            var ret = [];
            Ext.each(items, function (item) {
                ret.push({
                    depName: item.DepName.toString(),
                    depNo: item.DepNo.toString(),
                    description: item.Description.toString(),
                    empName: item.EmpName.toString(),
                    flag: item.Flag.toString(),
                    jobName: item.JobName.toString(),
                    jobNo: padLeft(item.JobNo, 7),
                    jobType: item.JobType.toString(),
                    nodeMethod: item.NodeMethod.toString(),
                    nodeType: item.NodeType.toString(),
                    nodeTypeDesc: item.NodeTypeDesc.toString(),
                    online: item.online.toString()
                });
            });
            return ret;
        },

        /**
         * 節點文字（一筆）
         */
        getNodeText: function (tag, node) {
            //            console.log(tag + ' ' + Ext.DomQuery.selectNode(tag, node));
            var n = Ext.DomQuery.selectNode(tag, node);
            if (n)
                return n.textContent;
            else
                return '';
        },
        /**
         * 節點文字（多筆）
         */
        getNodesText: function (tag, node) {
            var items = [];
            Ext.DomQuery.select(tag, node).forEach(function (p) {
                var item = p.textContent;
                items.push(item);
            });
            return items;
        },
        /**
         * 條列（遞回）
         */
        getRows: function (tag, node_row, items, ph) {
            var me = this;
            var i = 0, nodeNo, r;

            tag = tag + ' > 條列';
            var rs = Ext.DomQuery.select(tag, node_row);

            while (i < rs.length) {
                r = rs[i];
                nodeNo = Ext.DomQuery.selectNode('@序號', r);

                if (!nodeNo)
                    return items;

                i++;
                items.push({
                    tag: tag + ' > ' + i, no: nodeNo.value,
                    text: me.getNodeText('條列 > 文字', r), layer: tag.split('>').length - 1, paragraph: ph
                });

                me.getRows(tag, r, items);
            }

            return items;
        },
        getWKText: function (node, key, properties, format, nullFormat) {
            var tagText = this.getTagText(node, key);
            if (!tagText)
                return;
            if (!properties) {
                properties = [];
                properties.push(key);
            }
            if (!format) {
                format = tagText.Title + '{0}';
            }

            if(key == '處理級別'){   //1112 處理級別若為空，不要有標題   Chloe.sia
                var UrgencyLevels = tagText.childNodes[0].Value;
                if(UrgencyLevels == "" || UrgencyLevels == " "){
                    format = tagText.Title + '{0}';
                }else {
                    format = '速別：' + tagText.Title + '{0}';
                }
            }

            for (var i = 0; i < properties.length; i++) {
                var regEx = new RegExp("\\{" + i + "\\}", "gm");
                Ext.Array.each(tagText.childNodes, function (n3) {
                    if (n3.Key == properties[i]) {
                        var n3Value = n3.Value;
                        format = format.replace(regEx, n3Value);
                        return false;
                    }
                });
            }

            return format;
        },
        getWKTextItems: function (node, key, properties, format) {
            var content = this.getWKText(node, key, properties, format);
            var items = [];
            items.push(key + '：');
            items.push(content);
            return items;
        },
        getLumps: function (_source, multiFormat) {
            if (typeof multiFormat == "undefined" || multiFormat == null || multiFormat.length <= 0)
                return null;

            var _start = 0, _end = 0, _lumps = [];
            Ext.Array.each(multiFormat, function (item) {
                var target = item.data;

                var a = _source.slice(0, item.start - _start);
                var b = _source.substring(item.start - _start, item.end - _start);

                _lumps.push({text: a});
                _lumps.push({text: b, styles: item});
                _source = _source.slice(item.end - _start, _source.length);
                _start = item.end;
            });
            _lumps.push({text: _source});

            _lumps = _lumps.filter(function (element, index, array) {
                return (element.text != '');
            });
            return _lumps;
        },
        getTagText: function (node, tagCaption) {
            if (!node || !node.childNodes) return null;
            if (node.childNodes.length <= 0) return null;

            var tagText = null;
            var hasYDM = false;
            var qs = OA.common.Global.getQ();
            var dept = OA.common.Global.getCurrentDept();
            Ext.Array.each(node.childNodes, function (n1) {
                if (!n1) return true; //contine;
                if (!n1.childNodes) return true; //contine;

                if (n1.DisplayPanelName == 'Header') {
                    Ext.Array.each(n1.childNodes, function (n2) {
                        if (n2.tagName == 'Text') {
                            if (n2.TagCaption == tagCaption) {
                                if (tagCaption == '年月日') {
                                    hasYDM = true;
                                }

                                if (tagCaption == '保存年限') {
                                    if (dept && dept.depNo == 'A301' && qs.projNo) {                                        
                                        if (n2 && n2.childNodes && n2.childNodes.length > 0) {
                                            n2.childNodes[0].Value = '5';
                                        }
                                    }
                                }

                                tagText = n2;
                                return false;
                            }
                        }
                    });
                } else if (n1.DisplayPanelName == 'Footer') {
                    Ext.Array.each(n1.childNodes, function (n2) {
                        if (n2.tagName == 'Text') {
                            if (n2.TagCaption == tagCaption) {
                                if (tagCaption == '年月日') {
                                    if (!hasYDM) {
                                        tagText = n2;
                                    }
                                    return false;
                                } else {
                                    tagText = n2;
                                    return false;
                                }
                            }
                        }
                    });
                } else if (n1.tagName == '核章區文字'){
                    Ext.Array.each(n1.childNodes, function (n2) {
                        //console.log(n2);
                        if (n2.tagName == '文字') {
                            Ext.Array.each(n2.childNodes, function (n3) {
                                if (n3.Key == tagCaption) {
                                    tagText = n3;
                                    return false;
                                }
                            });
                        }
                    });
                }
            });
            return tagText;
        },
        getWKChildren: function (node, key, isDept) {
            var qb = OA.common.Global.getQueryDefault();
            var qs = OA.common.Global.getQ();
            var tagText = this.getTagText(node, key);
            //console.log(tagText);
            if (!tagText) return;

            var isDoKeys = ['敬陳', '核示', '敬會', '職', '註記', '敬致', '局處單位'];

            if (key == '聯絡方式')console.log(tagText)

            if (isDoKeys.indexOf(key) != -1) {
                //console.log(node.DocumentType);
                if ((tagText.childNodes[0].Value + '').trim().length == 0) {
                    //if (node.DocumentType === '簽')
                    //    tagText.childNodes[0].Value = key;
                    //else
                    if (key == '職') {
                        if (isDept) {
                            // var dept = OA.common.Global.getCurrentDept();
                            // if (dept) {
                            //     tagText.childNodes[0].Value = dept.depName || '';
                            // }
                        } else {
                            tagText.childNodes[0].Value = '職';
                        } 
                    } else if (key == '敬陳') {
                        var lv = OA.common.Utils.getWKText(node, '決行層級');
                        var v = parseInt(lv);
                        if (qb && qb.敬陳對象 && qb.敬陳對象.length > 0) {
                            Ext.Array.each(qb.敬陳對象, function (item) {
                                if (item.層級 == v) {
                                    if (item.對象) {
                                        var personnels = (item.對象 + '').split(',');
                                        if (personnels && personnels.length > 0) {
                                            tagText.childNodes = [];
                                            Ext.Array.each(personnels, function (personnel) {
                                                var childNode = {
                                                    Key: "敬陳",
                                                    Value: personnel,
                                                    tagName: "Property"
                                                }
                                                tagText.childNodes.push(childNode);
                                            });
                                        }
                                    }
                                }
                            });
                        }

                    } else if (key =='核示') {
                        tagText.childNodes[0].Value = '核示';
                    } else {
                        tagText.childNodes[0].Value = '';
                    }
                }
            }



            var items = [];
            if (key !== '職' && key !=='註記' && key !=='核示') items.push(tagText.Title);
            Ext.Array.each(tagText.childNodes, function (n3) {

                // 隱藏 聯絡方式電子信箱
                if (key == '聯絡方式') {
                    if (n3.Key == '電子信箱' || n3.Key == '傳真') return true;
                }
                //console.log(n3)
                items.push((n3.Value + '').replace(/&crarr;/g, '\n'));
                //items.push(n3.Value);
            });

            if(key == '局處單位'){  //不顯示局處單位_title 只顯示內容
                items[0] = " "
            }

            //1116 敬會若為空，則顯示按此處新增   Chloe.sia
            if (key == '敬會' && items.length == 2 && items[1] == "") {
                items[0] = "（按此處新增敬會）"
            }

            return items;
        },
        getWKGroup: function (node, groupId) {
            var tagText = this.getTagText(node, groupId);
            if (!tagText) return;
            var items = [];
            Ext.Array.each(tagText.childNodes, function (n3) {
                items.push({key: n3.Key, value: n3.Value, group: groupId, onlyTitle: true});
            });
            return items;
        },
        getWKCaption: function (node, key) {
            var tagText = this.getTagText(node, key);
            if (!tagText) return;
            var keys = tagText.childNodes[0].Key;
            var subKeys = keys.split('；');
            // console.log(key);
            // console.log(node);
            // console.log(tagText);
            // console.log(subKeys);

            //抬頭如果有受文者、會銜、會銜受文者要拿掉
            if (node.DocumentType.indexOf('會銜受文者') > -1)
                node.DocumentType = node.DocumentType.replace('會銜受文者', '');
            else if (node.DocumentType.indexOf('會銜') > -1)
                node.DocumentType = node.DocumentType.replace('會銜', '');
            else if ((node.DocumentType.indexOf('受文者') > -1))
                node.DocumentType = node.DocumentType.replace('受文者', '');
            else if (node.DocumentType.indexOf('獎懲令') > -1)
                node.DocumentType = node.DocumentType.replace('獎懲', '');
            else if (node.DocumentType.indexOf('派免令') > -1)
                node.DocumentType = node.DocumentType.replace('派免', '');

            var unDraft = ['出席會議報告單'];

            var ret = unDraft.indexOf(node.DocumentType) != -1 ? subKeys[1] + '　' + node.DocumentType : subKeys[1] + '　' + node.DocumentType + '（稿）';

            if(node.DocumentTemplate == '通用函'){
                var unDraft = ['通用函'];
                var ret = unDraft.indexOf(node.DocumentType) != -1 ? subKeys[1] + '　' + node.DocumentType : subKeys[1] + '　'  + '（稿）';
            }

            var preview = Ext.getCmp('ctnPreview');
            if (preview) {
                var mode = preview.getPreviewMode();
                var isDraft = false;
                if (mode == 'Send' || mode == 'Send2'){
                    isDraft = false;
                } else {
                    if (mode) isDraft = mode == ('Send') ? false : preview.Enum.properties[mode].isDraft;
                }
              
                if (!isDraft) ret = subKeys[1] + '　' + node.DocumentType;
            }

            return ret;
        },
        getWKNotesItems: function (node, key, prefix) {
            var tagText = this.getTagText(node, key);
            if (!tagText)
                return;
            var items = [];
            items.push('');
            items.push(prefix + tagText.childNodes[0].Key);
            return items;
        },
        //以  |  號分隔地址／辦公地址
        getWKAddress: function (node, key) {

            var tagText = this.getTagText(node, key);
            if (!tagText)
                return;

            var items = [];
            items.push(tagText.Title);

            var s = '', i = 0, isMark = false;
            Ext.Array.each(tagText.childNodes, function (n3) {
                if (i == 0) {
                    s = s + n3.Value;
                }
                else {
                    if (n3.Value) {
                        s = s + '|' + n3.Value;
                        isMark = true;
                    }
                }
                i++;
            });
            items.push(s);
            return items;
        },
        getWKSeparate: function (node, key) {
            //console.log(key);
            var tagText = this.getTagText(node, key);
            if (!tagText) return;
            var preview = Ext.getCmp('ctnPreview');
            var mode = '';
            if (preview) {
                mode = preview.getPreviewMode();
            }
           
            var items = [];
            items.push(tagText.Title);
            var s = '';
            var contactlist;
            if (['正本', '副本', '抄本','出席者','列席者','主持人'].indexOf(key) >= 0) {
                contactlist = this.getContactListTag(node);
            }
            //var contactlist = this.getContactListTag(node);
            //if (key === '副本') {
            //    contactlist = this.getContactListTag(node);
            //}
            Ext.Array.each(tagText.childNodes, function (n3) {
                var otherTag = '';
                if (n3.Value) {
                    //console.log(contactlist);
                    if (contactlist) {
                        var contact = contactlist.childNodes.filter(function (n1) {
                            if (n1.KEY == '副本' && n1.ATTACH == 'Y') {
                                return n1.VALUE + '（含附件）' == n3.Value || n1.VALUE == n3.Value;
                            } else {
                                return n1.VALUE == n3.Value;
                            }
                        });
                        if (contact && contact.length > 0) {
                            if (contact[0].KEY == '副本' && contact[0].ATTACH == 'Y') {
                                if (n3.Value.indexOf('（含附件）') < 0)
                                    otherTag += '（含附件）';
                            }

                            /*
                            if (contact[0].TRANSTYPE == '2' && contact[0].ADDR.length > 0) {                               
                                if (preview) {                                   
                                    if (mode) {
                                        if ('Draft'.indexOf(mode) >= 0)
                                            otherTag += '(' + contact[0].ADDR + ')';  //正本+地址
                                        //otherTag
                                    } else {

                                    }
                                } else {
                                    // otherTag += '(' + contact[0].ADDR + ')';  //正本+地址
                                    otherTag
                                }
                            }
                            */
                        }
                    }

                    /*
                    if (preview) {
                        if (mode) {
                            if ('Draft'.indexOf(mode) == -1) {
                                n3.Value = n3.Value.replace('(含附錄)', '').replace('（含附錄）', '');
                            }
                        }
                    }
                    */
                    otherTag = (otherTag + '').replace('()', '');
                    s = s + '、' + n3.Value + otherTag;
                    //    if (contact.length > 0 && contact[0].ATTACH === 'Y') {
                    //        s = s + '、' + n3.Value + otherTag;
                    //    } else
                    //        s = s + '、' + n3.Value +otherTag;
                    //} else
                    //    s = s + '、' + n3.Value;
                }
            });
            s = s.substring(1);
            items.push(s);
            return items;
        },
        getWKUserPhone: function (node, key) {
            var tagText = this.getTagText(node, key);
            if (!tagText) return;
            var items = [];
            items.push(tagText.Title);
            var s = '';
            Ext.Array.each(tagText.childNodes, function (n3) {
                if (n3.Value) {
                    n3.Value = n3.Value + '';
                    if (n3.Key == '姓名') {
                        s = s + '、' + n3.Value;
                    } else {
                        n3.Value = n3.Value.replace('、', '#');
                        s = s + ' ' + n3.Value;
                    }
                }
            });
            s = s.substring(1);
            items.push(s);
            return items;
        },

        /*
         解析WK中KDRichTextBlock XML DOM ,以Bullet點來判斷區塊，輸出條列及追蹤修訂格式MultiFormat
         */
        getKDRichTextBlock: function (node) {
            //console.log('getKDRichTextBlock');
            var qs = OA.common.Global.getQ();
            var me = this, items = [];
            var nodes = node.childNodes.filter(function (n1) {
                return (n1 && n1.tagName == 'KDRichTextBlock');
            });
            var isBulletStart = false, bulletNo = '', tagindent = '', ly, lyn, ph, lv, mln = 0, sln = 0;
            var _text = '', _textClear = '', multiFormat = [], tb;
            Ext.Array.each(nodes[0].childNodes, function (n2) {
                if (n2.tagName == 'Bullet' || n2.tagName == 'KDRichTextBlock') {
                    //add start
                    if (ph != undefined) {
                        var item = {
                            tag: tagindent, no: bulletNo, text: _text, layer: ly, layerNo: lyn, paragraph: ph,
                            lv: lv, mainLayer: mln, secLayer: sln, textClear: _textClear,
                            multiFormat: me.getLumps(_text, multiFormat)
                        };
                        items.push(item);

                        if (tb != undefined) items.push(tb);
                    }
                    isBulletStart = true;
                } else if (n2.tagName == 'Text') {
                    isBulletStart = false;
                } else if (n2.tagName == 'Newline') {
                    isBulletStart = false;
                } else if (n2.tagName == 'Table') {
                    tb = { class: 'table' };
                    isBulletStart = false;
                } else {
                    isBulletStart = false;
                }

                if (isBulletStart) {
                    if (n2.ThisLayer == 1) {
                        mln++;    //MainLayerNumber xml data error why?                   
                        sln = 0;
                    } else if (n2.ThisLayer == 2) {
                        sln++;
                    }
                    _text = '';
                    _textClear = '';
                    bulletNo = n2.BulletNo;
                    ly = n2.ThisLayer;
                    ph = n2.ParagraphNumber;
                    lyn = n2.ThisLayerNumber;
                    lv = n2.LvNumber;
                    tb = undefined;

                    multiFormat = [];
                    var count = n2.BulletText.replace(/^(\s*).*$/, "$1").length;
                    tagindent = new Array(count + 2).join('>');
                }

                if (n2.tagName == 'KDRichTextBlock') {
                    _text = _text || n2.Text;
                    _textClear = _textClear || n2.Text;
                }

                var data = me.getMultiFormat(n2, _text, _textClear);
                // console.log(_text);
                Ext.Array.each(data.multiFormat, function (d) {
                    multiFormat.push(d);
                });
                _text = data.full;
                _textClear = data.fullClear;

            });

            //add end
            var lastitem = {
                tag: tagindent, no: bulletNo, text: _text, layer: ly, layerNo: lyn, paragraph: ph, lv: lv,
                mainLayer: mln, secLayer: sln, textClear: _textClear,
                multiFormat: me.getLumps(_text, multiFormat)
            };
            items.push(lastitem);

            if (tb != undefined) items.push(tb);

            return items;
        },
        getMultiFormat: function (n2, full, fullClear) {
            //console.log('getMultiFormat');
            var isClear = false;
            if (OA.common.Paper.main()) isClear = OA.common.Paper.main().getIsClearPaper();

            var _multiFormat = [], tags = [];
            Ext.Array.each(n2.childNodes, function (n3) {
                var tag = {};
                if (n3.tagName) {
                    tag = {};
                    tag.action = n3.tagName;
                    tag.lastUpdateTime = n3.LastUpdateTime;
                    tag.name = n3.Name;
                    tag.userId = n3.UserId;
                    tag.userName = n3.UserName;
                    tag.version = n3.Version;
                    tag.brush = n3.Brush;
                    tag.penSpecies = n3.PenSpecies;
                    tags.push(tag);
                }

                var isIgnore = false;

                if (n2.FontWeight == 'Bold') {
                    tag.fontWeight = 'Bold';
                    isIgnore = true;
                }
                if (n2.FontWeight == 'Italic') {
                    tag.fontStyle = 'Italic';
                    isIgnore = true;
                }
                if (n2.BaselineShift) tag.baselineShift = n2.BaselineShift;
                var data = n3;
                if (typeof (n2.childNodes) === 'object') {
                    if (n3['#cdata']) data = n3['#cdata'];
                }


                if (n2.Underline == 'Underline' || n2.Strike == 'Exist') {
                    tag.underline = 'Underline';
                    isIgnore = true;
                }

                //if (n2.Space) {
                //    tag.Space = n2.Space;
                //    tag.start = 0;
                //    _multiFormat.push(tag);
                //}

                if (typeof (data) === 'string' || typeof (data) === 'number') {
                    tag.items = tags;
                    var text = data.toString().replace("![CDATA[", "").replace("]]", "");
                    tag.data = text;
                    tag.start = full.length;

                    if (isClear && isIgnore) {
                        full = full + text;
                        tag.end = full.length;
                        _multiFormat.push(tag);
                    } else {
                        full = full + text;
                        tag.end = full.length;

                        // var isDelete = tag.items[0] && tag.items[0].action == 'StrikeText';
                        // if (!isDelete) fullClear = fullClear + text;

                        //console.log(tag);
                        //console.log(isClear);
                        if (!isClear) {
                            if (tags.length > 0 || tag.fontWeight || tag.underline || tag.baselineShift || tag.fontStyle) {
                                //一個字一個字折開來？用途？
                                if (tag.data.length > 1) {
                                    for (var i = 0; i < tag.data.length; i++) {
                                        var chrTag = Ext.clone(tag);
                                        chrTag.data = tag.data.substring(i, i + 1);
                                        chrTag.start = tag.start + i;
                                        chrTag.end = chrTag.start + 1;
                                        _multiFormat.push(chrTag);
                                    }
                                } else {
                                    _multiFormat.push(tag);
                                }
                            }
                            //console.log(_multiFormat);
                        } else {
                            //2019.06.19 台北市列管需求 保留螢光筆
                            if (tag.items && tag.items.length > 0) {
                                var highlight = [];
                                Ext.Array.each(tag.items, function (item) {
                                    if (item.action && item.action == 'Highlight') {
                                        highlight.push(item);
                                    }
                                });
                                if (highlight.length > 0) {
                                    tag.items = highlight;
                                    _multiFormat.push(tag);
                                }
                            }
                        }
                    }
                    if (!isIgnore) fullClear = fullClear + text;

                    tags = [];
                }
            });
            return { multiFormat: _multiFormat, full: full, fullClear: fullClear };
        },
        getWKStickyNote: function (node) {            
            var me = this, items = [];
            Ext.Array.each(node.childNodes, function (n1) {
                if (n1 && n1.tagName == 'StickyNote') {
                    n1.text = (n1.text + '').replace(/&crarr;/g, '\n');
                    items.push(n1);
                }
            });
            return items;
        },
        getWKSealNote: function (node) {
            var me = this, items = [];
            Ext.Array.each(node.childNodes, function (n1) {
                if (n1 && n1.tagName == 'Sealinfo') {
                    items.push(n1);
                }
            });
            return items;
        },
        getWKOctet: function (node) {
            var me = this, items = [];
            Ext.Array.each(node.childNodes, function (n1) {
                if (n1 && n1.tagName == 'Octet') {
                    items.push(n1);
                }
            });
            return items;
        },
        getFileNo: function (node) {
            //console.log(node);
            var _items = [];
            _items.push('檔　　號：');
            var data = this.getFileNoData(node);
            if (data.年度 && data.分類號) {
                var arr = [];
                arr.push(data.年度);
                arr.push(data.分類號);
                if (data.案次號) arr.push(data.案次號);
                if (data.目次號) arr.push(data.目次號);
                _items.push(arr.join('/'));
            } else {
                _items.push('　');
            }
            return _items;
        },
        getDoSno: function (node) {
            var tagText = this.getTagText(node, '發文字號');
            if (!tagText) return;
            var items = [];
            items.push('發文字號：');
            var s = '';
            Ext.Array.each(tagText.childNodes, function (n3, a, b) {
                if (n3.Key == '發文字號_字') {
                    s = (n3.Value || '') + '字第';
                } else {
                    if (Ext.isNumber(n3.Value)) {
                        s = s + (n3.Value + '');
                    } else {
                        s = s + (n3.Value || '')
                    }
                }

                if (n3.Key == '發文字號_支號') {
                    if (s) items.push(s + '號');
                }
            });
            if (items.length < 2) {
                var w = this.getWKText(node, '發文字號', ['發文字號_字']) || '';
                var no = OA.common.Global.getCurrentDocFlowRecord().get('doSno') || '';
                items.push(w + '字第' + no + '號');
            }
            return items;
        },
        getDoSnoNoTagCaption: function (node) {  //沒有標題的發文字號，只取內容   Chloe.sia
            var tagText = this.getTagText(node, '發文字號');
            if (!tagText) return;
            var items = [];
           // items.push('發文字號：');
            var s = '';
            Ext.Array.each(tagText.childNodes, function (n3, a, b) {
                if (n3.Key == '發文字號_字') {
                    s = (n3.Value || '') + '字第';
                } else {
                    s = s + (n3.Value || '')
                }

                if (n3.Key == '發文字號_支號') {
                    if (s) items.push(s + '號');
                }
            });
            // if (items.length < 2) {
            //     var w = this.getWKText(node, '發文字號', ['發文字號_字']) || '';
            //     var no = OA.common.Global.getCurrentDocFlowRecord().get('doSno') || '';
            //     items.push(w + '字第' + no + '號');
            // }
            return items;
        },
        getDeptName: function (node) {
            var _items = [];
            _items.push('承辦單位：');
            var deptName = node.deptName || '';
            _items.push(deptName);
            return _items;
        },
        getDoSnoForWebsvg: function (node) {
            //console.log(node);
            var tagText = this.getTagText(node, '發文字號');
            if (!tagText) return;
            var items = [];
            items.push('發文字號：');
            var s = '';
            Ext.Array.each(tagText.childNodes, function (n3, a, b) {
                //北市府需求不要字號_2019.07.11 lien.chiu
                //if (n3.Key == '發文字號_字') {
                //    s = (n3.Value || '') + '字第';
                //} else if (n3.Key == '發文字號_支號') {
                //    if (s) items.push(s + '號');
                //} else {
                //    s = s + (n3.Value || '')
                //}
                if (n3.Key == '發文字號_支號') {
                    if (s) items.push(s);
                } else if (n3.Key !== '發文字號_字') {
                    s = s + (n3.Value || '')
                }
                
            });

            if (items.length < 2) {
                //var w = this.getWKText(node, '發文字號', ['發文字號_字']) || '';
                var no = OA.common.Global.getCurrentDocFlowRecord().get('doSno') || '';
                //items.push(w + '字第' + no + '號');
                items.push(no);
            }
            return items;
        },
        getYMD: function (node, tagCaption) {
            if (node.childNodes.length <= 0)
                return null;

            var tagText = null;
            Ext.Array.each(node.childNodes, function (n1) {
                if (!n1 || !n1.childNodes)
                    return true; //contine;

                if (n1.DisplayPanelName == 'Header') {
                    Ext.Array.each(n1.childNodes, function (n2) {
                        if (n2.tagName == 'Text') {

                            if (n2.TagCaption == tagCaption) {
                                tagText = n2;
                                return false;
                            }
                        }
                    });
                }
            });

            var ret = '';
            Ext.Array.each(tagText.childNodes, function (n3) {
                if (n3.Key == '年月日') {
                    ret = n3.Value;
                }
            });

            return ret;
        },
        getYMD2: function (node, tagCaption) {
            var items = [];
            items.push(tagCaption + '：');
            var dts = OA.common.Utils.getDateData(node, tagCaption);
            if (dts.年月日止) {
                if (dts.年月日) items.push(dts.年月日 + dts.時分 + '起至' + dts.年月日止 + dts.時分止 + '止');
            } else {
                if (dts.年月日 != undefined) {
                    if (dts.星期.length > 0)
                        items.push(dts.年月日 + ' (' + dts.星期 + ') ' + dts.時分);
                    else
                        items.push(dts.年月日 + '' + dts.時分);
                } 
            }
            return items;
        },
        getWKNames: function (node, key) {
            var tagText;
            //稿署名另外處理，非Silverlight傳值是會取到空值改取XML中稿署名
            if (key === '稿署名') {
                tagText = this.getTagText(node, '署名');
                if (!tagText)
                    tagText = this.getTagText(node, '稿署名');
            }
            else
                tagText = this.getTagText(node, key);
            if (!tagText)
                return;

            var items = [];
            items.push(tagText.Title);
            Ext.Array.each(tagText.childNodes, function (n3) {
                if (n3.Key == key) {
                    var v = (n3.Value) ? n3.Value : '';
                    items.push(v);
                }
            });
            return items;
        },
        getWKNames2: function (node, key) {//箋函 稿署名 敬啟 Chloe.sia
            var tagText;
            //稿署名另外處理，非Silverlight傳值是會取到空值改取XML中稿署名
            if (key === '稿署名') {
                tagText = this.getTagText(node, '署名');
                if (!tagText)
                    tagText = this.getTagText(node, '稿署名');
            }
            else
                tagText = this.getTagText(node, key);
            if (!tagText)
                return;

            var items = [];
           // items.push(tagText.Title);
            Ext.Array.each(tagText.childNodes, function (n3) {
                if (n3.Key == key) {
                    var v = (n3.Value) ? n3.Value : '';
                    items.push(v);
                }
            });

            if(items.length >= 1){
                return items[0]+'                  敬啟';
            }else {
                return items + '                  敬啟';
            }
        },
        getWKKeyValues: function (node, key) {
            var keys = OA.common.Utils.getWKNames(node, key);
            var subKeys = keys[1].split('；');
            keys[1] = subKeys[1];
            return keys;
        },
        getWKPass: function (node) {
            var tagText = this.getTagText(node, '密等及解密條件或保密期限');
            if (!tagText)
                return;
            var properties = ['密等', '解密條件或保密期限'];
            var ret = '';
            var items = [];
            items.push(tagText.Title);
            for (var i = 0; i < properties.length; i++) {
                Ext.Array.each(tagText.childNodes, function (n3) {
                    if (n3.Key == properties[i]) {
                        if (n3.Key == '解密條件或保密期限') {
                            if (Ext.util.Format.trim(n3.Value) != '')
                                ret = ret + '(' + n3.Value + ')';
                        } else {
                            ret = n3.Value;
                        }
                        return false;
                    }
                });
            }
            items.push(ret);
            return items;
        },
        getApproveLV: function (node) {
            var lv = OA.common.Utils.getWKText(node, '決行層級');

            var v = parseInt(lv);

            if (Ext.isNumeric(lv)) {
                return KangDaAppConfig().DCSNS[lv].name;
            } else {
                return lv;
            }
        },
        getStratify: function (node) {
            var lvItem = OA.common.Utils.getWKText(node, '分層負責', null, '{0}');
            if (!lvItem) {
                var lv = OA.common.Utils.getWKText(node, '決行層級');
                return KangDaAppConfig().DCSNS[lv].ofDesc;
            } else
                return lvItem;
        },
        getWKOverPrint: function (node) {
            //console.log(node);
            var me = this, items = [];
            Ext.Array.each(node.childNodes, function (n1) {
                if (n1 && n1.tagName == 'OverPrint') {
                    items.push(n1);
                }
            });
            return items;
        },
        toLvNumber: function (classId) {
            var arr = classId.split('-');
            if (arr[1]) {
                var lvno = arr[1].split('.');
                var lv = parseInt(lvno[0]);
                var no = parseInt(lvno[1]);
                return {cls: arr[0], lv: lv, no: no};
            } else {
                return null;
            }
        },
        toLvNumberStringPlus: function (classId, intVaule) {
            var l = this.toLvNumber(classId);
            var arr = classId.split('.');
            return arr[0] + '.' + (l.no + intVaule);
        },
        toLvStringPlus: function (classId, intVaule, fixNo) {
            var l = this.toLvNumber(classId); //indent-3.1 =>{cls:'indent',lv:3,no:1}
            //console.log(classId);
            //console.log(l);
            var ret = l.cls + '-' + (l.lv + intVaule) + '.' + l.no;
            if (fixNo) {
                ret = l.cls + '-' + (l.lv + intVaule) + '.' + fixNo;
            }
            return ret;
        },
        dotSplitPlus: function (id, intVaule) {
            var arr = id.split('.');
            var count = arr.length, no = 0, ret = '';
            if (count == 1) {
                arr = id.split('-');
                no = parseInt(arr[1]) + intVaule;
                ret = arr[0] + '-' + no;
            } else if (count == 2) {
                no = parseInt(arr[1]) + intVaule;
                ret = arr[0] + '.' + no;
            } else if (count == 3) {
                no = parseInt(arr[2]) + intVaule;
                ret = arr[0] + '.' + arr[1] + '.' + no;
            } else {
                no = parseInt(arr[count - 1]) + intVaule;
                ret = id.substring(0, id.lastIndexOf(".") + 1) + no;
            }
            //console.log(id + '>' + ret);
            return ret;
        },
        dotJumpSplitPlus: function (id, no) {
            var arr = id.split('.');
            var count = arr.length, ret = '';
            if (count == 1) {
                arr = id.split('-');
                ret = arr[0] + '-' + arr[1] + '.' + no;
            } else {
                Ext.Array.each(arr, function (item) {
                    if (ret == '') {
                        ret = item;
                    } else {
                        ret = ret + '.' + item;
                    }
                });
                ret = ret + '.' + no
            }
            console.log(id + '>' + ret);
            return ret;
        },
        ChineseNumberStringPlus: function (classId, intVaule) {
            var oNumber = this.toLvNumber(classId);
            oNumber.intVaule = intVaule;
            return this.doChineseNumberString(oNumber);
        },
        doChineseNumberString: function (options) {
            var no = options.no + options.intVaule;
            var ret = '';
            var arr1 = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
            var arr2 = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
            if (options.lv == 1) {
                ret = (new ChineseNumberString(true)).getResult(no) + '、';
            } else if (options.lv == 2) {
                ret = '(' + (new ChineseNumberString(true)).getResult(no) + ')';
            } else if (options.lv == 3) {
                ret = no.toString().halfToFull() + '、';
            } else if (options.lv == 4) {
                ret = '(' + no.toString().halfToFull() + ')';
            } else if (options.lv == 5) {
                ret = arr1[no - 1] + '、';
            } else if (options.lv == 6) {
                ret = '(' + arr1[no - 1] + ')';
            } else if (options.lv == 7) {
                ret = arr2[no - 1] + '、';
            } else if (options.lv == 8) {
                ret = '(' + arr2[no - 1] + ')';
            } else {
                //throw new Error("Not Support");
            }

            return ret;
        },
        getWorkFlowData: function () {
            var items = [];
            Ext.each(Ext.getStore('WorkFlow').getData().items, function (p) {
                items.push(p.data);
            });
            return OA.common.Utils.toWorkFlowNodes(items);
        },
        getSentPaperData: function (node) {
            var data = {}, j1 = 0, j2 = 0;
            var tagDoSno = this.getTagText(node, '發文字號');
            if (!tagDoSno) return null;

            //發文文號
            var otSno = '';
            //發文字號
            if (tagDoSno) {
                var i = 0;

                Ext.Array.each(tagDoSno.childNodes, function (n3) {
                    if (n3.Key == '發文字號_字'){
                        i++;
                    }                       
                    else if (i == 1 && n3.Key != '發文字號_支號')//取主辦發文文號
                        otSno += n3.Value;

                    var key = n3.Key + '_' + i.toString();
                    data[key] = n3.Value;
                });
            }
            data['發文字號'] = '('+data['發文字號_字_1'] + '字第' + data['發文字號_年度_1'] + data['發文字號_流水號_1'] + '號)';
            data['發文文號'] = otSno;
            //console.log(data);
            //console.log('getSentPaperData 發文文號:' + data['發文文號']);

            var tagOrg = this.getTagText(node, '發文機關');
            if (!tagOrg) return data;

            var tagPaperNames = this.getTagText(node, '署名');
            if (tagOrg.childNodes.length <= 0) return data;

            var keys = tagOrg.childNodes[0].Key;
            var values = tagOrg.childNodes[0].Value.toString();
            var subKeys = keys.split('；');
            var subValues = values.split('；');
            var names = subKeys[0].split('、');
            var codes = subValues[0].split('、');

            Ext.Array.each(codes, function (code, idx) {
                var key = '機關代碼_' + (idx + 1).toString();
                data[key] = code;
            });

            data['發文定義'] = subKeys[1];
            Ext.Array.each(tagOrg.childNodes, function (n1) {
                if (n1.Key == '發文層級') {
                    data['發文層級'] = n1.Value;
                }
            });

            //取得密件資訊
            Ext.Array.each(names, function (name, idx) {
                var orgNo = (idx + 1).toString();
                var key = '發文機關_' + orgNo;
                data[key] = name;
                j1 = 0;
                j2 = 0;

                if (tagPaperNames) {
                    Ext.Array.each(tagPaperNames.childNodes, function (n1) {
                        if (n1.Type === name) {
                            if (n1.Key == '署名') {
                                j1++;
                                var key1 = '署名' + orgNo + '_' + j1.toString();
                                data[key1] = n1.Value;
                            } else if (n1.Key == '稿署名') {
                                j2++;
                                var key2 = '稿署名' + orgNo + '_' + j2.toString();
                                data[key2] = n1.Value;
                            }
                        }
                    });
                    data['署名數' + orgNo] = j1;
                    data['稿署名數' + orgNo] = j2;
                }
                data['主辦' + orgNo] = ((idx + 1) == 1);
                data['機關數'] = idx + 1;
            });
            return data;
        },
        getNoteSubmitData: function (node) {
            var me = this;
            var data = {};
            var submits = ['敬會', '敬陳', '敬致', '局處單位'];
            Ext.Array.each(submits, function (item) {
                j1 = 0;
                var tagPaperNames = me.getTagText(node, item);
                if (tagPaperNames) {
                    Ext.Array.each(tagPaperNames.childNodes, function (n1) {
                        if (n1.Key == item) {
                            j1++;
                            var key1 = item + '_' + j1.toString();
                            data[key1] = n1.Value;
                        }
                    });
                    data[item + '數'] = j1;
                }
            });
            return data;
        },
        getFileNoData: function (node) {
            var qs = OA.common.Global.getQ();
            var dept = OA.common.Global.getCurrentDept();
            var tagText = this.getTagText(node, '檔號');
            if (!tagText || tagText.childNodes.length <= 0) return null;
            var data = {};
            Ext.Array.each(tagText.childNodes, function (n1) {
                if (n1.Key == '年度') {
                    if (dept && dept.depNo == 'A301' && qs.projNo) {
                        var y = Ext.Date.add(new Date(), Ext.Date.YEAR, -1911);
                        data['年度'] = (y.getFullYear() + '');
                    } else {
                        data['年度'] = (n1.childNodes) ? n1.childNodes[0] : n1.Value;
                    }
                } else if (n1.Key == '分類號') {
                    if (dept && dept.depNo == 'A301' && qs.projNo) {
                        data['分類號'] = '1000';
                    } else {
                        data['分類號'] = (n1.childNodes) ? n1.childNodes[0] : n1.Value;
                    }
                } else if (n1.Key == '案次號') {
                    if (dept && dept.depNo == 'A301' && qs.projNo) {
                        data['案次號'] = '001';
                    } else {
                        data['案次號'] = (n1.childNodes) ? n1.childNodes[0] : n1.Value;
                    }
                } else if (n1.Key == '目次號') {
                    data['目次號'] = (n1.childNodes) ? n1.childNodes[0] : n1.Value;
                }
            });
            return data;
        },
        getDataPass: function (node) {
            var tagText = this.getTagText(node, '密等及解密條件或保密期限');
            if (!tagText || tagText.childNodes.length <= 0) return null;
            var data = {};
            Ext.Array.each(tagText.childNodes, function (n1) {
                if (n1.Key == '密等') {
                    data['密等'] = n1.Value;
                } else if (n1.Key == '解密條件或保密期限') {
                    data['解密條件或保密期限'] = n1.Value;
                }
            });
            return data;
        },
        getDateData: function (node, key) {
            var tagText = this.getTagText(node, key);
            if (!tagText || tagText.childNodes.length <= 0) return null;
            var data = {};
            Ext.Array.each(tagText.childNodes, function (n1) {
                if (n1.Key == '年月日') {
                    data['年月日'] = n1.Value;
                } else if (n1.Key == '星期') {
                    data['星期'] = n1.Value;
                } else if (n1.Key == '時分') {
                    data['時分'] = n1.Value;
                } else if (n1.Key == '年月日止') {
                    data['年月日止'] = n1.Value;
                } else if (n1.Key == '星期止') {
                    data['星期止'] = n1.Value;
                } else if (n1.Key == '時分止') {
                    data['時分止'] = n1.Value;
                }
            });
            return data;
        },
        getGistData: function (node) {
            var data = {};
            Ext.Array.each(node.childNodes, function (n1) {
                if (!n1 || !n1.childNodes) return true; //contine;
                if (n1.tagName == '主旨') {
                    Ext.Array.each(n1.childNodes, function (n2) {
                        if (n2.childNodes) data['主旨'] = n2.childNodes[0];
                    });
                }
            });
            return data;
        },
        getSealData: function (node) {
            var data = {};
            Ext.Array.each(node.childNodes, function (n1) {
                if (!n1 || !n1.childNodes) return true; //contine;
                if (n1.tagName == '核章區文字') {
                    Ext.Array.each(n1.childNodes, function (n2) {
                        Ext.Array.each(n2.childNodes, function (n3) {
                            data[n3.Key] = n3.Value;
                        });
                    });
                }
            });
            return data;
        },
        getPetitionData: function (node) {

            var items = ['表單類型', '處理等級', '業務類別', '回復方式', '不附問卷原因', '其他補充說明', '適法性', '案件類別',
                '延期原因', '延期理由', '提報特殊案件', '存查原因', '擬辦說明', '預定完成日',
                '回復民眾附件書面回復', '受文者書面回復', '地址書面回復'];

            var data = {};
            Ext.Array.each(items, function (item) {
                var keys = OA.common.Utils.getWKNames(node, item);
                if (keys) {
                    var subKeys = keys[1].split('；');
                    data[item] = subKeys[0];
                }
            });

            return data;
        },
        getContactList: function (node) {
            var tagText = this.getContactListTag(node);
            if (!tagText) return null;
            if (tagText.childNodes && tagText.childNodes.length <= 0) return null;
            return tagText.childNodes;
        },
        getGridItems: function (node) {
            var items = [];
            if (node && node.childNodes) {
                var nodes = node.childNodes.filter(function (n1) {
                    return (n1 && n1.tagName === 'Grid');
                });
                items = (nodes[0]) ? nodes[0].childNodes : [];
            }
            return items;
        },
        getContactListTag: function (node) {
            if (!node) return;
            // console.log(node);
            var tagText = null;
            Ext.Array.each(node.childNodes, function (n1) {

                if (!n1) return true;
                if (!n1.childNodes) return true; //contine;

                if (n1.DisplayPanelName == 'Header') {
                    Ext.Array.each(n1.childNodes, function (n2) {
                        if (n2.tagName == 'ContactList') {
                            tagText = n2;
                            return false;
                        }
                    });
                } else if (n1.DisplayPanelName == 'Footer') {
                    Ext.Array.each(n1.childNodes, function (n2) {
                        if (n2.tagName == 'ContactList') {
                            tagText = n2;
                            return false;
                        }
                    });
                }
            });
            return tagText;
        },
        getChapters: function (node) {
            if (!node.childNodes) return null;
            var nodes = node.childNodes.filter(function (n1) {
                return (n1 !== null);
            });
            var items = nodes.where("( el, i, res, param ) => el.tagName=='SealTitleAndName'");
            var list = [];
            Ext.Array.each(items, function (item) {
                item.emptitle = (item.emptitle) ? item.emptitle : '';
                if (item.childNodes) {
                    var n = item.childNodes[0];
                    item.code = (n.childNodes) ? item.childNodes[0].childNodes[0] : n.content;
                    item.childNodes = undefined;
                    if (item) list.push(item);
                } else {
                    if (item) list.push(item);
                }
            });
            var exist = false;
            Ext.Array.each(list, function (item) {
                if (OA.common.Global.getInitParas()) {
                    if (item.jobno == OA.common.Global.getInitParas().jobNo)
                        exist = true;
                }
            });
            if (!exist) {
                var mysign = this.getSign();
                node.childNodes.push(mysign);
                if (mysign) list.push(mysign);
            }
            return {Chapters: list};
        },
        getWritingPad: function (node) {
            if (!node.childNodes) return null;
            var nodes = node.childNodes.filter(function (n1) {
                return (n1 !== null);
            });
            var format_path = '<path fill="none" stroke="{0}" stroke-width="{1}" d="{2}" />';
            var pad = nodes.where("( el, i, res, param ) => el.tagName=='手寫板'")[0];
            if (!pad) return {WritingPad: null};
            if (!pad.childNodes) return {WritingPad: null};
            var list = [];
            var root = pad.childNodes[0];
            if (root.childNodes) {
                Ext.Array.each(root.childNodes, function (item) {
                    var strokeNodesRoot = item.childNodes[0];
                    var strokeNodes = strokeNodesRoot.childNodes;
                    var _strokes = [];
                    Ext.Array.each(strokeNodes, function (stroke) {
                        var strokeAttrs = stroke.childNodes[0].childNodes[0];
                        var strokePonints = stroke.childNodes[1].childNodes[0].childNodes;
                        var _d = 'M' + strokePonints[0].X + ',' + strokePonints[0].Y + ' L ';
                        Ext.Array.each(strokePonints, function (point) {
                            _d = _d + point.X + ',' + point.Y + ' ';
                        });
                        var _color = OA.common.Utils.getBrushColor(strokeAttrs.Color);
                        var _path = Ext.String.format(format_path, _color, strokeAttrs.Width, _d);
                        _strokes.push(_path);
                    });
                    item.strokes = _strokes;
                    item.childNodes = undefined;
                    list.push(item);
                });
            } else {
                var strokeCollection = root.Handwrit.content.StrokeCollection;
                var _strokes = [], item = {};
                Ext.Array.each(strokeCollection, function (item) {
                    var item1 = item.childNodes[0];
                    var strokeAttrs = item1['Stroke.DrawingAttributes'];
                    var _color = OA.common.Utils.getBrushColor(strokeAttrs.Color);
                    var _width = strokeAttrs.Width;
                    var strokePonints = item1['Stroke.StylusPoints'].StylusPointCollection;
                    var _d = 'M' + strokePonints[0].X + ',' + strokePonints[0].Y;
                    Ext.Array.each(strokePonints, function (point, idx) {
                        if (idx != 0) _d = _d + ' L' + point.X + ',' + point.Y + ' ';
                    });
                    _strokes.push(Ext.String.format(format_path, _color, _width, _d));
                });

                item.strokes = _strokes;
                list.push(item);
            }
            return {WritingPad: list};
        },
        getExtendData: function (node) {
            try {
                var me = this;
                var data = {};
                var dataFile = me.getFileNoData(node);
                var dataSent = me.getSentPaperData(node);
                var dataNoteSubmit = me.getNoteSubmitData(node);
                var dataPass = me.getDataPass(node);
                var dataDate1 = me.getDateData(node, '開會時間');
                var dataDate2 = me.getDateData(node, '會勘時間');
                var dataGist = me.getGistData(node);
                var dataContactList = {ContactList: me.getContactList(node)};
                var dataGrid = {Grid: me.getGridItems(node)};
                var dataSeal = me.getSealData(node);
                var dataPetition = me.getPetitionData(node);

                if (dataFile) Ext.apply(data, dataFile);
                if (dataSent) Ext.apply(data, dataSent);
                if (dataNoteSubmit) Ext.apply(data, dataNoteSubmit);
                if (dataDate1) Ext.apply(data, dataDate1);
                if (dataDate2) Ext.apply(data, dataDate2);
                if (dataGist) Ext.apply(data, dataGist);
                if (dataContactList) Ext.apply(data, dataContactList);
                if (dataPass) Ext.apply(data, dataPass);
                if (dataGrid) Ext.apply(data, dataGrid);
                if (dataSeal) Ext.apply(data, dataSeal);
                if (dataPetition) Ext.apply(data, dataPetition);

                /*
                var qs = OA.common.Global.getQ();
                var isEO = qs.app === 'editor' || qs.app === 'offline';
                if (!isEO) {
                    if (qs.sealname === 'Y') {
                        var dataChapters = me.getChapters(node);
                        Ext.apply(data, dataChapters);
                    }
                    var dataWritingPad = me.getWritingPad(node);                    
                    Ext.apply(data, dataWritingPad);
                }
                */
                return data;
            } catch (err) {
                if (err) console.log(err);
            }
        },
        toChineseDateTime: function (strDate, strTime) {
            if (!strDate) return;
            //年月日: "中華民國104年6月4日"
            //時分: "下午3時55分"
            strDate = strDate.replace('中華民國', '');
            strDate = strDate.replace('日期：', '');
            strDate = strDate.trim();
            if (!strDate) return null;

            var y = strDate.split('年');
            var m = y[1].split('月');
            var d = m[1].split('日');

            var year = parseInt(y[0], 10) + 1911;
            var month = parseInt(m[0], 10) - 1; // 0開始
            var day = parseInt(d[0], 10);
            var dt = new Date();
            if (strTime) {
                var pre = strTime.substring(0, 2);
                strTime = strTime.replace(pre, '');

                var h = strTime.split('時');
                var mi = h[1].split('分');
                var hour = parseInt(h, 10);

                if (pre == '凌晨') {
                    hour = 0;
                } else if (pre == '下午') {
                    hour = hour + 12;
                }

                var minute = parseInt(mi[0], 10);
                dt = new Date(year, month, day, hour, minute, 0);
            } else {
                dt = new Date(year, month, day);
            }
            return dt;
        },
        toWkDates: function (dt, preCaption) {
            preCaption = preCaption || '';
            var v = Ext.Date.add(dt, Ext.Date.YEAR, -1911);
            var v1 = preCaption + v.getFullYear() + '年' + Ext.Date.format(dt, 'n月j日');

            //凌晨12時  上午1~11時   中午12時   下午1~11時  0~23
            var pre = '';
            var h = parseInt(dt.getHours());
            if (h == 0) {
                pre = '凌晨12';
            } else if (h > 0 && h < 12) {
                pre = '上午' + h;
            } else if (h == 12) {
                pre = '中午' + h;
            } else if (h > 12 && h < 24) {
                pre = '下午' + (h - 12);
            }
            var v2 = pre + '時' + dt.getMinutes() + '分';
            var v3 = '星期' + Ext.Date.format(dt, 'l');

            var items = [];
            items.push(v1);
            items.push(v2);
            items.push(v3);

            //年月日: "中華民國104年6月4日"
            //時分: "下午3時55分"
            //星期：星期四
            return items;
        },
        removeSupport: function (layout) {
            if (!layout) return;
            layout = Ext.Array.filter(layout, function (p) {
                return KangDaAppConfig().ignoreFields.indexOf(p.key) < 0;
            });
            return layout;
        },
        getBrushColor: function (brush) {
            var _color;
            if (brush.length == 7) {
                _color = brush;
            } else if (brush.length > 9) {
                _color = '#' + brush.substring(4);
            } else {
                _color = '#' + brush.substring(3);
            }
            return _color;
        },
        testRect: function (options) {
            var name = options.name || 'testrect';
            var svg = OA.common.Paper.main().getSvgPaper();
            $(name).remove();
            svg.addSvgElementFromJson({
                "element": "rect",
                "curStyles": true,
                "attr": {
                    "x": options.x,
                    "y": options.y,
                    "width": 1,
                    "height": 1,
                    "fill": 'red'
                }
            });
        },
        testLine: function (name, y) {
            var svg = OA.common.Paper.main().getSvgPaper();
            $(name).remove();
            svg.addSvgElementFromJson({
                "element": "line",
                "curStyles": true,
                "attr": {
                    "id": name,
                    "x1": 0,
                    "y1": y,
                    "x2": 800,
                    "y2": y,
                    'stroke': 'red',
                    "class": 'test'
                }
            });
        },
        testBlueLine: function (name, y) {
            var svg = OA.common.Paper.main().getSvgPaper();
            $(name).remove();
            svg.addSvgElementFromJson({
                "element": "line",
                "curStyles": true,
                "attr": {
                    "id": name,
                    "x1": 0,
                    "y1": y,
                    "x2": 800,
                    "y2": y,
                    'stroke': 'blue',
                    "class": 'test'
                }
            });
        },
        testBlueVLine: function (name, x) {
            var svg = OA.common.Paper.main().getSvgPaper();
            $(name).remove();
            svg.addSvgElementFromJson({
                "element": "line",
                "curStyles": true,
                "attr": {
                    "id": name,
                    "x1": x,
                    "y1": 0,
                    "x2": x,
                    "y2": 800,
                    'stroke': 'blue',
                    "class": 'test'
                }
            });
        },
        addLine: function (name, y, color) {
            var svg = OA.common.Paper.main().getSvgPaper();

            if (!color) color = 'red';

            $(name).remove();
            // var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            // line.setAttribute('id', name);
            // line.setAttribute('stroke', color);
            // line.setAttribute('class', 'test');
            // line.setAttribute('x1', 0);
            // line.setAttribute('y1', y);
            // line.setAttribute('x2', 800);
            // line.setAttribute('y2', y);
            // svg.getRootElem().appendChild(line);

            svg.addSvgElementFromJson({
                "element": "line",
                "curStyles": true,
                "attr": {
                    "id": name,
                    "x1": 0,
                    "y1": y,
                    "x2": 1000,
                    "y2": y,
                    'stroke': color,
                    "class": 'test'
                }
            });
        },
        getSign: function () {
            var d = OA.common.Global.getCurrentDept();
            var r = OA.common.Global.getCurrentRole();
            var u = OA.common.Global.getCurrentUser();

            if (!u) return;

            var mySign = {
                "isDigitalSign": false,
                "empno": u.userId,
                "isassignee": false,
                "isflowfollow": false,
                "roleid": r.roleId,
                "width": "",
                "emptitle": u.empTitle,
                "empname": u.empName,
                "depName": d.depName,
                "ispis": false,
                "positiony": 1280,
                "voname": 6335782417,
                "actionname": "用印",
                "autotype": 1,
                "version": '',
                "depno": d.depNo,
                "height": 50,
                "lastUpdateTime": OA.common.Utils.getChineseDate(),
                "positionx": 80,
                "isApprover": false,
                // "jobno": padLeft(r.jobNo, 7),
                "jobno": r.jobNo,
                "tagName": "SealTitleAndName",
                "signtime": OA.common.Utils.getChineseDate(),
                "orgno": d.orgNo,
                "filetype": ""
            };
            return mySign;
        },
        pickColor: function (version) {
            var qs = OA.common.Global.getQ();
            var domColors = OA.common.Global.getDomColors();
            var color = 'black';
            if (qs.sFlag == 'Y') return color;//密件製作 color = 'black'
            if (domColors) {
                var domColor = domColors.querySelector("Root > Color[Version='" + version + "']");
                if (domColor) {
                    color = domColor.getAttribute("Color");
                    // var strColor = domColor.getAttribute("Color");
                    // color = OA.common.Utils.getBrushColor(strColor);
                } else {

                    domColor = domColors.querySelector("Root > Color[Version='0" + version + "']");
                    if (domColor) {
                        color = domColor.getAttribute("Color");
                        // strColor = domColor.getAttribute("Color");
                        // color = OA.common.Utils.getBrushColor(strColor);
                    }
                }
            }
            return color;
        },
        getOpinion: function () {
            //console.log('function ★意見欄');

            var vi = OA.common.VIMgr.getViContent();
            var currentDeptName = OA.common.Global.getInitParas().name;
            var currentPaperNo = OA.common.Global.getInitParas().paperNo;
            var currentLevel = OA.common.Global.getInitParas().level;
            currentDeptName = currentDeptName.replace('臺北市政府', '');
            var editons = vi.版次;
            var items = [];
            items.push('★意見欄');
            //console.log(editons);
            Ext.Array.each(editons, function (v) {
                var papers = v.簽核文件夾.文稿;
                if (!Ext.isArray(papers)) papers = [papers];
                Ext.Array.each(papers, function (p) {
                    var who = (v.簽核人員) ? v.簽核人員 : {服務單位: ""};
                    var suggestion = (p.批示意見) ? p.批示意見 : {content: '', lastTime: ''};
                    var isFirstOrLast = v.版號 == 0 || v.版號 == vi.作業版本;
                    var isSamePaperNo = p.代碼 == currentPaperNo;
                    var isPorxy = (v.簽核人員 && v.簽核人員.代理名稱) ? v.簽核人員.代理名稱 : '';
                    if (who) {
                        var isSub = who.是否會辦 == '是';

                        var isSameUnit = true;
                        if (currentLevel == 1) {
                            isSameUnit = who.所屬機構 == currentDeptName;
                        } else {
                            isSameUnit = who.服務單位 == currentDeptName;
                        }

                        // console.log('p.' + p.代碼 + ' ' + who.所屬機構 + ' ' + who.服務單位 + ' ' + isSub + ' ' + isSamePaperNo + ' ' + isSameGroup);
                        // if (!isFirstOrLast && isSamePaperNo && isSub && isSameUnit) {
                        if (!isFirstOrLast) {
                            if (isPorxy)
                                items.push(who.服務單位 + ' ' + who.使用者名稱 + ' (代理：' + v.簽核人員.代理職稱 + ' ' + v.簽核人員.代理名稱 + ')' + suggestion.lastTime);
                            else
                                items.push(who.服務單位 + ' ' + who.使用者名稱 + ' ' + suggestion.lastTime);
                            items.push('簽核意見：' + (suggestion.content || ''));
                        }
                    }
                });
            });
            // console.log(items);
            return items;
        },
        getChineseDate: function (dt) { //最後更新時間
            if (!dt) dt = new Date();
            var s2 = Ext.util.Format.date(dt, "/m/d H:i:s");
            var s1 = Ext.util.Format.date(Ext.Date.add(dt, Ext.Date.YEAR, -1911), 'Y').substring(1);
            return s1 + s2;
        },
        getOldEditChineseDate: function (dt) { //符合舊製作格式
            if (!dt) dt = new Date();
            //console.log(dt);
            var s1 = Ext.util.Format.date(dt, "Y/m/d");
            var s2 = Ext.util.Format.date(dt, "h:i:s");
            //console.log(s2);
            var H = Ext.util.Format.date(dt, "H");
            var CH = '上午';
            if (parseInt(H) > 12) CH = '下午';
            

            //var s1 = Ext.util.Format.date(Ext.Date.add(dt, Ext.Date.YEAR), 'Y').substring(3);
            //console.log(Ext.String.format('{0} {1} {2}', s1, CH, s2));
            return Ext.String.format('{0} {1} {2}', s1, CH, s2);
        },
        checkSymbolStr: function (str, values) {//特殊符號
            var unSymbo = ['&', '<', '>'];
            var symboStr = [];
            if (values) {
                for (name in values) {
                    if (values.hasOwnProperty(name)) {
                        if (this.checkSymbolStr(values[name]))
                            return true;
                        else
                            return false;
                    }
                }
            } else {
                unSymbo.filter(function (n1) {
                    if (str.indexOf(n1) >= 0)
                        if (symboStr.indexOf(n1) == -1) symboStr.push(n1);
                })
                if (symboStr.length != 0) {
                    Ext.Msg.alert('提示', '輸入文字中不可含' + symboStr.join('、') + '符號！');
                    return false;
                }
                return true;
            }
        },
        checkEpaper: function () {//是否為紙本流程
            var qs = OA.common.Global.getQ();
            var FlowRecord = OA.common.Global.getCurrentDocFlowRecord();
            var isEpaper = true;
            if (FlowRecord) {
                var Flowepaper = FlowRecord.get('epaper');
                if (Flowepaper === 'N') isEpaper = false;
                if (Flowepaper === undefined || Flowepaper === null) {
                    if (qs.epaper === 'N') isEpaper = false;
                }
            } else {
                if (qs.epaper === 'N') isEpaper = false;
            }
            //isEpaper = false;  //測試密件取號用
            return isEpaper;
        },
        indicatorWith: function (ctr) {
            //console.log(ctr);
            if (!ctr)  {
                return;
            }
            
            if (typeof (ctr) === 'string') {
                ctr = Ext.getCmp(ctr);
            } else {
                //var list = ctr.query('list')[0];
                //if (list)  {
                //    ctr = list;
                //}
                
            	// 處理巢狀列表元件卷軸顯示 - by yi-chi chiu
                var i = 0;
                while(ctr.query('list')[i]){
                	var list = ctr.query('list')[i];
                	var scrollable = list.getScrollable();
                    if (!scrollable)  {
                        return;
                    }
                    
                    var scroller = scrollable.getScroller();
                    var indicator = scrollable.getIndicators().y;
                    if (ctr.getStore && ctr.getStore() && ctr.getStore().getData().items.length == 0) {
                        if (indicator)  {
                            indicator.setAutoHide(true);
                        }
                        
                        scrollable.doHideIndicators();
                        return;
                    }
                    if (indicator) {
                    	// 判斷元素是否綁定拖曳事件 - by yi-chi chiu
                    	var isExist = false;
                    	var j = 0;
                    	while(OA.common.Global.config.dragList[j]) {
                    		if(OA.common.Global.config.dragList[j] === indicator.element)
                    			isExist = true;
                    		j++;
                    	}
                    	if(!isExist) {
                    		new Ext.util.Draggable({
                                element: indicator.element,
                                listeners: {
                                    //drag: function(ctr, e, offsetX, offsetY, eOpts) {
                                    //    var size = scroller.getSize(),
                                    //        cntSize = scroller.getContainerSize();
                                    //    if (offsetY < 0) {
                                    //        scroller.scrollToTop();
                                    //    } else if ((size.y - offsetY) < cntSize.y) {
                                    //        scroller.scrollToEnd();
                                    //    } else {
                                    //        scroller.scrollTo(offsetX, offsetY);
                                    //    }
                                    //}
                                	
                                	// 替換拖曳中的邏輯 - by yi-chi chiu
                                    drag: function (ctr, e, offsetX, offsetY, eOpts) {
                                        //console.log(ctr)
                                        var size = scroller.getSize(),
                                            cntSize = scroller.getContainerSize();
                                        if (offsetY < 0) {
                                            scroller.scrollToTop();
                                        } else if (offsetY >= (cntSize.y - indicator.getLength())) {
                                        	scroller.scrollToTop();
                                            scroller.scrollToEnd();
                                            return;
                                        } else {
                                        	scroller.scrollTo(offsetX, size.y * (offsetY / cntSize.y));
                                        }
                                        //console.log('offsetY: ' + offsetY + ', ' + 'cntSize.y: ' + cntSize.y + ', ' + 'indicator: ' + indicator);
                                    }
                                }
                            });
                            // 紀錄已註冊拖拉事件的元素  - by yi-chi chiu
                            OA.common.Global.config.dragList.push(indicator.element);
                    	}
                    	// 重置卷軸位置 - by yi-chi chiu
                    	//scroller.scrollToEnd();
                        
                        indicator.show();
                        setTimeout(function() {
                            var gap = Math.round(indicator.gapLength);
                            if (gap == 0) {
                                indicator.setAutoHide(true);
                                scrollable.doHideIndicators();
                            } else {
                                indicator.setAutoHide(false);
                            }
                        }, 100);
                    }
                    // 重置卷軸位置 - by yi-chi chiu
                    scroller.scrollToTop();
                	i++;
                }
                return;
            }
            var scrollable = ctr.getScrollable();
            if (!scrollable)  {
                return;
            }
            var scroller = scrollable.getScroller();
            var indicator = scrollable.getIndicators().y;
            if (ctr.getStore && ctr.getStore().getData().items.length == 0) {
                if (indicator)  {
                    indicator.setAutoHide(true);
                }
                
                scrollable.doHideIndicators();
                return;
            }
            if (indicator) {
            	// 判斷元素是否綁定拖曳事件 - by yi-chi chiu
            	var isExist = false;
            	var i = 0;
            	while(OA.common.Global.config.dragList[i]) {
            		if(OA.common.Global.config.dragList[i] === indicator.element)
            			isExist = true;
            		i++;
            	}
            	if(!isExist) {
	                new Ext.util.Draggable({
	                    element: indicator.element,
	                    listeners: {
	                    	//drag: function(ctr, e, offsetX, offsetY, eOpts) {
	                        //    var size = scroller.getSize(),
	                        //        cntSize = scroller.getContainerSize();
	                        //    if (offsetY < 0) {
	                        //        scroller.scrollToTop();
	                        //    } else if ((size.y - offsetY) < cntSize.y) {
	                        //        scroller.scrollToEnd();
	                        //    } else {
	                        //        scroller.scrollTo(offsetX, offsetY);
	                        //    }
	                        //}
	                    	
	                    	// 替換拖曳中的邏輯 - by yi-chi chiu
	                    	drag: function(ctr, e, offsetX, offsetY, eOpts) {
	                            var size = scroller.getSize(),
	                                cntSize = scroller.getContainerSize();
	                            if (offsetY < 0) {
	                                scroller.scrollToTop();
	                            } else if (offsetY >= (cntSize.y - indicator.lastLength)) {
	                            	scroller.scrollToTop();
	                                scroller.scrollToEnd();
	                                return;
	                            } else {
	                            	scroller.scrollTo(offsetX, size.y * (offsetY / cntSize.y));
	                            }
	                            //console.log('offsetY: ' + offsetY + ', ' + 'cntSize.y: ' + cntSize.y + ', ' + 'indicator: ' + indicator);
	                        }
	                    }
	                });
	                // 紀錄已註冊拖拉事件的元素  - by yi-chi chiu
                    OA.common.Global.config.dragList.push(indicator.element);
            	}
            	// 重置卷軸位置 - by yi-chi chiu
                //scroller.scrollToEnd();
                indicator.show();
                setTimeout(function() {
                    var gap = Math.round(indicator.gapLength);
                    if (gap == 0) {
                        indicator.setAutoHide(true);
                        scrollable.doHideIndicators();
                    } else {
                        indicator.setAutoHide(false);
                    }
                }, 100);
            }
        },
        isNoteDoc: function (key) {
            var result = false;
            var wk = OA.common.Global.getCurrentWKContent();
            var noteDoc = ['簽', '便簽', '便箋', '簡簽', '出席會議報告單', '稽核報告簽', '出席會議摘要單', '簽稿會核單'];
            if (key) {
                result = noteDoc.indexOf(key) > -1;
            } else {
                result = noteDoc.indexOf(wk.DocumentType) > -1;
            }
            return result;
        },
        keyPair:function(data){
            if (!data) return [];

            var items=[];
            for (var ofCode in data){
                if (data.hasOwnProperty(ofCode)) {
                    var item = data[ofCode];
                    if (item.ofType && item.ofType == 'RW') {
                        items.push({ value: item.ofDesc, key: ofCode });
                    } else {
                        items.push({ value: ofCode + '-' + item.ofDesc, key: ofCode });
                    }
                }
            }
            return items;
        },
        keyPairTitle: function (data, type) {
            if (!data) return [];
            
            var items=[];
            for (var ofCode in data) {
                var isPush = false;
                if (data.hasOwnProperty(ofCode)) {
                    var item = data[ofCode];
                    if (type == 'Close') {//辦結回復
                        isPush = ['A', 'D'].indexOf(item.ofCode) >= 0;
                    } else if (type == 'Postpone') {//先行回復
                        isPush = ['B', 'C'].indexOf(item.ofCode) >= 0;
                    } else {//存查
                        isPush = ['A'].indexOf(item.ofCode) >= 0;
                    }
                    if (isPush)
                        items.push({ value: ofCode + '-' + item.ofDesc, key: ofCode });
                }
            }
            return items;
        },
        getStampOrSignature: function (layout,doctype) {
            /*
             * 0：機關章
             * 1：署名章
             * 2：代辦局章
            */

            //先檢核是否有署名或條戳格式
            var hasSignature = layout.filter(function (element, index, array) {
                return (element.key == '署名');
            });

            if (hasSignature && hasSignature.length > 0) {
                //判斷是否有授字，如有授字，使用代辦局章
                var isSendWord = OA.common.Paper.main().hasField('發文字號');
                if (isSendWord) {
                    var wk = OA.common.Global.getCurrentWKContent();
                    if (wk) {
                        var senWord = OA.common.Utils.getDoSno(wk);
                        if (senWord.length > 1) {
                            if (senWord[1].indexOf('授') != -1) {
                                return '2';
                            }
                        }
                    }
                }
                var isStamps = ['開會通知單', '書函', '代辦處書函', '會勘通知單',
                    '交辦案件通知單', '催辦案件通知單', '交議案件通知單', '移文單',
                    '機密文書機密等級變更或註銷建議單', '機密文書機密等級變更或註銷通知單'];
                if (isStamps.indexOf(doctype) != -1) {
                    return '0'
                } else {
                    return '1'
                }
            } else {
                return 'null'
            } 
        }
    }
});
