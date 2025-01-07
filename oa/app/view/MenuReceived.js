Ext.define('OA.view.MenuReceived', {
    extend: 'Ext.Menu',
    id: "menuReceived",
    xtype: "menuReceived",
    config: {
        ui: 'light',
        layout: "vbox",
        width: '50%',
        items: [
            {
                xtype: 'container',
                width: '100%',
                height: '100%',
                layout: {
                    type: 'vbox',
                    align: 'center'
                },
                scrollable: {
                    direction: 'both'
                },
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        cls: 'segdoc-selector',
                        items: [
                            {
                                id: 'receivedPlug',
                                ui: 'plain',
                                badgeCls: 'icobadge',
                                badgeText: '1',
                                iconCls: 'fa-paperclip',
                                action: 'plug',
                                listeners: {
                                    tap: function (e) {
                                        //console.log('plug');
                                        OA.common.Fields.popupFromShow('附件上傳');
                                    }
                                }
                            },

                            //{
                            //    xtype: 'selectfield',
                            //    valueField: 'value',
                            //    displayField: 'name',
                            //    width: '70%',
                            //    store: {
                            //        data: [
                            //            {name: '來文', value: '1'},
                            //            {name: '104123480-文稿簽核流程測試案例說明', value: '2'}
                            //        ]
                            //    },
                            //    listeners: {
                            //        change: function (ctr, newValue, oldValue, eOpts) {
                            //            Ext.getCmp('menuReceived').init(newValue);
                            //        }
                            //    }
                            //},
                            {
                                text: '來文引用',
                                ui: 'plain', iconCls: '', action: 'docQuote',
                                right: 0,
                                handler: function (button) {
                                    var svg = Ext.getCmp('menuReceived').getSvgReceived();
                                    var elem = svg.getRootElem().querySelector('#KDRichTextBlock_0_context');
                                    //console.log(elem);

                                    var svgPaper = OA.common.Paper.main().getSvgPaper();
                                    var elemPaper = svgPaper.getRootElem().querySelector('#KDRichTextBlock_0_context');
                                    //console.log(elemPaper);

                                    elemPaper.textContent = elem.textContent;

                                    //svgPaper.clearSelection();
                                    //svgPaper.svgUpdateLayout(svgPaper, selectedElement);
                                    OA.common.Paper.main().typesetting();
                                    //svgPaper.textActions.clear();

                                    //svgPaper.setMode('select');


                                    //var cur =svgPaper.getRootElem().querySelector('#text_cursor');
                                    //if (cur){
                                    //    console.log(cur);
                                    //    cur.setAttribute('visibility','visible');
                                    //}
                                    //svgPaper.textActions.toSelectMode();
                                    //OA.common.Paper.get('main').svgUpdateLayout();  //文字重排
                                    //OA.common.Paper.get('main').updateSvgCanvas();  //視圖重刷
                                    //svgPaper.textActions.toSelectMode();
                                }
                            }
                        ]
                    },
                    {
                        html: '<div id="workareaReceived"><div id="received"></div></div>'
                    }
                ]
            }
        ],
        svgReceived: null
    },
    initialize: function () {
        this.init();
    },
    init: function (fileNo) {
        var w = OA.common.DIMgr.getPageWidth();
        var h = OA.common.DIMgr.getPageHeight();
        var cfg = {
            canvas_expansion: 1,
            dimensions: [w, h],
            initFill: {color: 'fff', opacity: 1},
            initStroke: {width: 1.5, color: '000', opacity: 1},
            initOpacity: 1,
            imgPath: 'thirdparty/method-draw/images/',
            extPath: 'thirdparty/method-draw/extensions/',
            jGraduatePath: 'thirdparty/method-draw/jgraduate/images/',
            extensions: [],
            initTool: 'scroll',
            wireframe: false,
            colorPickerCSS: false,
            gridSnapping: false,
            gridColor: "#000",
            baseUnit: 'px',
            snappingStep: 10,
            showRulers: false,
            show_outside_canvas: false,
            no_save_warning: true,
            initFont: 'Helvetica, Arial, sans-serif'
        };
        var dom = this.element.down("#received").dom;

        while (dom.firstChild) {
            dom.removeChild(dom.firstChild);
        }

        var svgReceived = new $.SvgCanvas(dom, cfg);

        fileNo = fileNo || '1';

        var xhr = new XMLHttpRequest();
        xhr.open('GET', './web/' + fileNo + '.svg', false);
        xhr.send(null);

        svgReceived.setSvgString(xhr.responseText);
        this.setSvgReceived(svgReceived);

        var plug = Ext.getCmp('receivedPlug');
        plug.setBadgeText(fileNo);
    }
});