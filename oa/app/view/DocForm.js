Ext.define('OA.view.DocForm', {
    extend: 'Ext.form.Panel',
    xtype: 'docForm',
    config: {
        width: '100%',
        height: '100%',
        style: 'background-color: transparent; border: 0px;padding:0px',
        fields: [],
        status:''
    },
    create: function (data) {
        this.setFields(data);
        this.valuesUpdate(data);
    },
    valuesUpdate: function (data) {
        this.removeAll(true, true);
        this.setItems(this.getFormItems(data));
        var vm = OA.common.Global.getCurrentViewModel();
        this.setValues(vm);

    },
    getFormItems: function (data) {
        var me = this;
        var items = [];
        var vm = OA.common.Global.getCurrentViewModel();
        //console.log(vm);
        Ext.Array.each(data, function (d) {
            var item = {
                xtype: 'textfield',
                name: d.key,
                label: d.key,
                clearIcon: false,
                labelWidth: '15%',
                readOnly: true,
                listeners: {
                    clearicontap: function (ctr, e, eOpts) {
                        //console.log('clearicontap')
                    }
                }
            };

            // me.element.addCls(Ext.baseCSSPrefix + 'field-clearable');
            // .x-field-clearable .x-clear-icon
            
            if (d.key == 'KDRichTextBlock' || d.key == '本文') {
                var item0 = Ext.clone(item);                
                item.xtype = 'textareafield';
                item.label = '本文';

                if (vm.開會事由 || vm.會勘事由)  item.label = '備註';
                var list = [], max = 0;
                Ext.Array.each(vm.KDRichTextBlockList, function (kb) {
                    var ph = vm[kb.id];
                    //var text = ph.no + ph.text;
                    //要清稿後
                    var text = ph.no + ph.textClear;
                    // console.log(kb.id);
                    if (kb.id == 'KDRichTextBlock_0') {
                        item0.xtype = 'textareafield';
                        item0.label = '主旨';
                        //item0.value = ph.text;
                        //要清稿後
                        //console.log(item0);
                        item0.value = ph.textClear;
                        var words = item0.value.split("");
                        var count = words.length;
                        var line = "";
                        var subList = [];
                        for (var n = 0; n < count; n++) {
                            if (n % 30 != 0) {
                                line = line + words[n];
                                if (n == count-1) subList.push(Ext.clone(line));
                            }
                            else {
                                if (n !== 0) {
                                    subList.push(Ext.clone(line));
                                    line = "";
                                } else {
                                    line = line + words[n];
                                }
                            }
                        }
                        //console.log(subList);
                        item0.value = subList.join('\n');
                        items.push(item0);
                    } else {
                        list.push(text);
                    }
                    max += Math.ceil(text.length / 53);
                });
                item.value = list.join('\n');
                item.maxRows = max;
            } else if (d.key == '發文機關') {
                item.name = '發文機關_title';
                item.value= vm['發文機關_title'];
            }else{
                item.value = vm[d.key] || '';
            }


            if (d.key !== '會辦單位') items.push(item);
        });
        var field = {
            xtype: 'fieldset',
            items: items
        };
        return [field];
    }
});