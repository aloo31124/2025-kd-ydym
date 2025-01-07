/*
 （目前沒用到）
 */
Ext.define('OA.form.PanelWinOpen', {
    extend: 'Ext.Panel',
    xtype: "PanelWinOpen",
    alias: 'widget.PanelWinOpen',
    requires: [],
    config: {
        layout: "vbox",
        ui: 'light',
        floating: true,
        items: {
            html: '<iframe id="winOpenFrame" height="" width="100%"></iframe>'
        }
    },
    open: function (src, name, options) {
        var me = this;

        var win = Ext.Viewport.down('PanelWinOpen');
        win.show();

        var frame = document.getElementById('winOpenFrame');
        if (!frame) return;
        
        // me.setMasked({xtype: 'loadmask', message: '處理中...'});
        var items;
        if (options)
            items = options.split(',');
        Ext.Array.each(items, function (item) {
            var p = item.split('=');
            var key = p[0].trim();
            var value = p[1].trim();

            if (key == 'width') {
                me.width = value;
                frame.style.width = document['body'].offsetWidth + 'px';
            } else if (key == 'height') {
                me.height = value;
                frame.style.height = document['body'].offsetHeight + 'px';
            }
        });
        frame.src = src;
        //console.log(frame);

    }
});