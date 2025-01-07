Ext.define('OA.components.AutocompleteField', {
    extend: 'Ext.field.Text',
    xtype: 'autocompletefield',
    config: {
        component: {
            xtype: 'input',
            type: 'text'
        }
    },
    requires: ['OA.common.UrlMgr'],
    currentSelectedValue: null,
    currentShownValue: '',
    isSelectedItem: false,
    currentRecord: null,
    recordsTemp:[],

    setValue: function (newShownValue, newSelectedValue) {
        var value = this.getComponent().getValue();
        if (value && value.indexOf(',') != -1) {
            var index = value.lastIndexOf(',') + 1;
            var subStr = value.substr(0, index);
            newShownValue = subStr + newShownValue;
        }

        this.currentShownValue = newShownValue;
        this.getComponent().setValue(newShownValue);
        this.currentSelectedValue = newSelectedValue;
        if (!this.isSelectedItem) this.currentRecord = null;
    },

    getValue: function (getShownValue) {
        //return (getShownValue || !this.isSelectedItem ? this.getComponent().getValue() : this.currentSelectedValue);

        var value = (getShownValue || !this.isSelectedItem ? this.getComponent().getValue() : this.currentSelectedValue);
        if (value && value.indexOf(',') != -1) {
            var index = value.lastIndexOf(',');
            if (index > 0) {
                index = index + 1;
                var subStr = value.substr(index, value.length);
                return subStr;
            }
        }
        return value;
    },

    getRecord: function () {
        return this.currentRecord;
    },
    setRecord: function (record) {

        this.currentRecord = record;

        var value = this.getComponent().getValue();
        if (record != null && this.recordsTemp.length == 0) this.recordsTemp.push(Ext.apply({}, record.raw));
        if (value && value.indexOf(',') != -1) {
            if (record != null) {
                this.recordsTemp.push(Ext.apply({}, record.raw));
            }
        }
    },

    initialize: function () {
        var that = this;
        if (!that.config.config.resultsHeight) that.config.config.resultsHeight = 200;

        this.resultsStore = Ext.getStore(that.config.config.store);
        this.resultsStore.setProxy(that.config.config.proxy);

        this.resultsList = Ext.create('Ext.List', {
            store: that.resultsStore,
            itemTpl: '<span class="x-list-label">{dep3Name}</span>'
        });

        this.listPanel = Ext.create('Ext.Panel', Ext.apply({
            left: 0,
            top: 0,
            cls: Ext.baseCSSPrefix + 'select-overlay',
            layout: 'fit',
            hideOnMaskTap: true,
            width: '200px',
            height: that.config.config.resultsHeight,
            items: that.resultsList
        }, that.config.config));

        var blurTimeout = false;
        var searchTimeout = false;

        var doSearchWithTimeout = function () {
            if (blurTimeout) clearTimeout(blurTimeout);
            if (searchTimeout) clearTimeout(searchTimeout);
        
            if (that.isSelectedItem || that.getComponent().getValue() == '') {
                that.currentSelectedValue = that.currentShownValue;
                return;
            }
        
            searchTimeout = setTimeout(function () {
                that.isSelectedItem = false;
                that.currentRecord = null;
        
                var input = that.getValue(true);
                var hasChinese = input.toString().match(/[\u3400-\u9FBF]/);
                var data = {};
                if (hasChinese) {
                    data.dep3No = '';
                    data.dep3ChnName = input;
                } else {
                    data.dep3No = input;
                    data.dep3ChnName = '';
                }
        
                var paras = OA.common.Global.getInitParas();
                data.qType = '0';
                data.start = 0;
                data.limit = 50;
                data.depNo = paras.depNo;
                data.empNo = paras.empNo;
        
                var qs = OA.common.Global.getQ();
                if (qs.app === 'offline') {
                    var rows = OA.client.Member.getDep3Rows(data);
                    that.resultsStore.setData(rows);
                    that.listPanel.setWidth(that.element.getWidth(true));
                    that.listPanel.showBy(that.getComponent());
                    that.listPanel.setMasked(false);
                    return;
                } else {
                    // 為代理設置 headers
                    var proxy = that.resultsStore.getProxy();
                    proxy.setUrl(OA.common.UrlMgr.restUrl('editor', 'g2b'));
                    proxy.setExtraParams(data); // 將查詢參數傳遞給 Proxy
                    proxy.setHeaders({
                        'Authorization': 'Bearer ' + sessionStorage.getItem('access_token'),
                        'Content-Type': 'application/json',
                    });
        
                    that.resultsStore.load({
                        callback: function (records, operation, success) {
                            if (!success) {
                                console.error("Failed to load records:", operation.getError());
                                return;
                            }
                    
                            // 手動解析 responseText
                            try {
                                const response = JSON.parse(operation.getResponse().responseText);
                                if (response.success && response.message) {
                                    const parsedData = JSON.parse(response.message);
                    
                                    // 將 parsedData.children 作為新的 records 資料
                                    records = parsedData.children || [];
                    
                                    // 判斷是否需要添加到 recordsTemp
                                    if (records.length > 0 && hasChinese) {
                                        let isPush = true;
                    
                                        Ext.Array.each(that.recordsTemp, function (temp) {
                                            if (temp.dep3Name === data.dep3ChnName) {
                                                isPush = false;
                                                return false;
                                            }
                                        });
                    
                                        if (isPush) {
                                            Ext.Array.each(records, function (record) {
                                                if (record.dep3Name === data.dep3ChnName) {
                                                    that.recordsTemp.push(Ext.apply({}, record));
                                                    return false;
                                                }
                                            });
                                        }
                                    }
                                    that.listPanel.setMasked(false);
                                    // 更新 resultsStore 的資料
                                    that.resultsStore.setData(records);
                                } else {
                                    console.warn("Invalid server response structure:", response);
                                }
                            } catch (e) {
                                console.error("Error parsing responseText:", e);
                            }
                        }
                       
                    });
                }
        
                 // 移除遮罩並顯示列表
                that.listPanel.setWidth(that.element.getWidth(true));
                that.listPanel.showBy(that.getComponent());
                that.listPanel.setMasked(true);
            }, 300);
        };
        

        /*
        var doSearchWithTimeout = function () {
            if (blurTimeout) clearTimeout(blurTimeout);
            if (searchTimeout) clearTimeout(searchTimeout);

            if (that.isSelectedItem || that.getComponent().getValue() == '') {
                that.currentSelectedValue = that.currentShownValue;
                return;
            }

            searchTimeout = setTimeout(function () {
                that.isSelectedItem = false;
                that.currentRecord = null;

                var input = that.getValue(true);
                var hasChinese = input.toString().match(/[\u3400-\u9FBF]/);
                var data = {};
                if (hasChinese) {
                    data.dep3No = '';
                    data.dep3ChnName = input;
                } else {
                    data.dep3No = input;
                    data.dep3ChnName = '';
                }

                var paras = OA.common.Global.getInitParas();
                data.qType = '0';
                data.start = 0;
                data.limit = 50;
                data.depNo = paras.depNo;
                data.empNo = paras.empNo;

                var qs = OA.common.Global.getQ();
                if (qs.app === 'offline') {
                    var rows = OA.client.Member.getDep3Rows(data);
                    that.resultsStore.setData(rows);
                    that.listPanel.setWidth(that.element.getWidth(true));
                    that.listPanel.showBy(that.getComponent());
                    that.listPanel.setMasked(false);
                    return;
                } else {
                    that.resultsStore.getProxy().setUrl(OA.common.UrlMgr.restUrl('editor', 'g2b'));

                    var pageSize = that.resultsStore.getPageSize();
                    data.page = that.resultsStore.currentPage;
                    data.start = (that.resultsStore.currentPage - 1) * pageSize;
                    data.limit = pageSize;

                    that.resultsStore.load({
                        params: data,
                        callback: function (records, operation, success) {
                            if (records.length > 0 && hasChinese) {
                                var isPush = true;
                                Ext.Array.each(that.recordsTemp, function (temp) {
                                    if (temp.dep3Name == data.dep3ChnName) {
                                        isPush = false;
                                        return false;
                                    }
                                });
                                if (isPush) {//�[�JrecordsTemp��
                                    Ext.Array.each(records, function (record) {
                                        if (record.raw.dep3Name == data.dep3ChnName) {
                                            that.recordsTemp.push(Ext.apply({}, record.raw));
                                            return false;
                                        }
                                    });
                                }
                            }
                            that.listPanel.setMasked(false);
                        }
                    });
                }

                that.listPanel.setWidth(that.element.getWidth(true));
                that.listPanel.showBy(that.getComponent());
                that.listPanel.setMasked(true);
            }, 300);
        };
        */

        this.resultsList.on('itemtouchend', function () {
            if (blurTimeout) clearTimeout(blurTimeout);
        });

        this.resultsList.onScroll = function () {
        };

        this.resultsList.on('itemtap', function (self, index, target, record) {
            that.isSelectedItem = true;
            if (that.getId() == "OrgName") {
                that.setValue(record.get('dep3Name'), record.get('dep3Name'));
                that.parent.items.items[2].setValue(record.get('dep3No'));
            } else if (that.getId() == 'codename') {
                that.setValue(record.get('dep3Name'), record.get('dep3Name'));
                that.setRecord(record);
            } else {
                that.setValue(record.get('dep3Name'), record.get('dep3No'));
                that.setRecord(record);
            }
            that.fireAction('select', [that, record], 'doItemSelect');
            blurTimeout = setTimeout(function () {
                that.listPanel.hide();
            }, 500);
        });

        this.getComponent().on('focus', doSearchWithTimeout);
        this.getComponent().on('keyup', function () {
            that.isSelectedItem = false;
            doSearchWithTimeout();
        });

        this.getComponent().on('blur', function (event) {
            if (searchTimeout) clearTimeout(searchTimeout);

            blurTimeout = setTimeout(function () {
                that.listPanel.hide();
            }, 500);
        });

        this.getComponent().on('change', function (ctr, newValue, oldValue, eOpts) {
            if (that.getId() == 'OrgName') {
                var formSentPaper = that.up('formpanel');
                if (formSentPaper) formSentPaper.change();
            }
        });

        this.getComponent().input.dom.style = 'color:black';
    }
});