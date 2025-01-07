/**
 * 文稿編輯
 */

Ext.define("OA.components.PaperEditor", {
    extend: "Ext.Container",
    xtype: "oaEditor",
    config: {
        items: [
            {
//                html: '<div id="content-container"><div id="editor-wrapper"><div id="formatting-container"><button title="Strikethrough" class="ql-format-button ql-strike">Strike</button></div><div id="editor-container"></div></div></div>'
//                html: '<textarea id="editor" data-autosave="editor-content" autofocus></textarea>'
//                html: '<textarea id="editor" class="textarea" placeholder="Enter text2 ..."></textarea>'
//                style:'width: 100%; height: 200px; font-size: 14px; line-height: 18px;'
            }
        ],
        listeners: {
            painted: function (element, eOpts) {
//                alert("painted");
                this.element.setHtml('<textarea id="editor" placeholder="Enter text5 ..." style="width: 100%; height: 200px; font-size: 14px; line-height: 18px;"></textarea>');

                var dom =this.element.down("#editor").dom;
                $(dom).wysihtml5();
//                $('#editor').wysihtml5();


//                var editor = new Quill('#editor-container');

//                var editor = new Quill('#editor-container', {
//                    theme: 'snow'
//                    modules: {
//                        'toolbar': { container: '#formatting-container' }
////                        'image-tooltip': true,
////                        'link-tooltip': true
//                    }
//                });


//                var dom = this.element.down("#editor").dom;
//                var editor = new Simditor({
//                    textarea: dom
//                });
//                editor.on('valuechanged',function(e){
//                    alert('valuechanged');
//                });



//                element.setHtml('<p>本文1</p><textarea id="editor" data-autosave="editor-content" autofocus"></textarea>');
//                var dom =this.element.down("#editor").dom;
//                var editor = new Simditor({
//                    textarea: dom
//                });


//                 editor.on('valuechanged',function(e){
//                    alert('valuechanged');
//                });


//                var dom =this.element.down("#editor").dom;
//                var editor = new Simditor({
//                    textarea: dom
//                    placeholder: '請輸入本文內容3'
//                });


            }
        }
    },
    initialize : function() {

    }

});