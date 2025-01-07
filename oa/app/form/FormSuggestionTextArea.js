/*
 我的意見
 */
Ext.define('OA.form.FormSuggestionTextArea', {
    extend: 'Ext.form.Panel',
    alias: 'widget.FormSuggestionTextArea',
    xtype: "FormSuggestionTextArea",
    config: {
        width: 600,
        height: 460,
        centered: true,
        modal: true,
        hideOnMaskTap: true,
        layout: {
            type: 'vbox'
        },
        defaults: {
            //margin: '5',
            labelWidth: '40%'
        },
        scrollable: false,
        items: [
            {
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                docked: 'top',
                items: [
                    { xtype: 'spacer' },
                    {
                        ui: 'plain',
                        text: '✖',
                        action: 'no',
                        handler: function (button) {
                            button.up('formpanel').hide();
                        }
                    }
                ]
            },
            {
                id: 'SuggestionSymbols',
                html: '',
                height: 70,
                listeners: {
                    element: 'element',
                    tap: function (e, target) {
                        var text = (target.tagName === 'SPAN' || target.tagName === 'P') ? target.textContent : '';
                        var suggestiontext = Ext.getCmp('SuggestionTextArea');
                        if (suggestiontext) {
                            var textarea = suggestiontext.getComponent().input.dom;
                            if (textarea) {
                                var prefixStr = textarea.value.substring(0, textarea.selectionStart);
                                var suffixStr = textarea.value.substring(textarea.selectionEnd);
                                textarea.value = prefixStr + text + suffixStr;
                                textarea.selectionStart = prefixStr.length + 1;
                                textarea.selectionEnd = prefixStr.length + 1;
                                textarea.focus();
                            }
                        }
                    }
                }
            },
            {
                xtype: 'fieldset',
                itemId: 'fieldset',
                items: []
            },
            {
                docked: 'bottom',
                xtype: 'toolbar',
                cls: 'segdoc-selector',
                items: [
                    {xtype: 'spacer'},
                    {
                        text: '確定', action: 'yes', ui: 'confirm', width: '20%',
                        handler: function (button, e, eOpts) {
                            var form = button.up('formpanel');
                            var suggestionTextArea = Ext.getCmp('SuggestionTextArea');
                            if (suggestionTextArea) {
                                var suggestionText = Ext.getCmp('suggestionText');
                                if (suggestionText) {
                                    suggestionText.setValue(suggestionTextArea.getValue());
                                }
                            }
                            form.hide();
                        }
                    }
                ]
            }
        ]
    },
    create: function (data) {
        var me = this;
        var field = me.query('fieldset')[0];

        field.setItems([
            {
                id: 'SuggestionTextArea',
                label: '我的意見：',
                xtype: 'textareafield',
                clearIcon: false,
                height: 260,
                labelWidth: '20%',
                cls: 'textareafield-notresize',
                value: data
            }
        ]);

        var items = [], n = 0;
        items.push('<div style="padding:3px;color: blue;">');       
        symbols = '，、：；！。‧？○—＿【】（）「」『』〔〕〈〉《》$&@…一二三四五六七八九十０１２３４５６７８９零壹貳參肆伍陸柒捌玖拾佰仟萬億'.split('');

        var count = symbols.length;

        for (n = 0; n < count; n++) {
            items.push('<span style="padding:2px;">' + symbols[n] + '</span>');
        }
        items.push('</div>');

        var suggestionSymbols = Ext.getCmp('SuggestionSymbols');
        if (suggestionSymbols) {
            suggestionSymbols.setHtml(items.join(''));
        }
    }
});