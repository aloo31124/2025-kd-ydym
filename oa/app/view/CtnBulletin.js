/*
 （目前沒用到）
 */
Ext.define('OA.view.CtnBulletin', {
    extend: 'Ext.Container',
    id:'ctnBulletin',
    xtype: "ctnBulletin",
    config: {
        //cls: "welcome",
        //centered: true,
        //width: 600,
        //height: 400,
        html: [
            //"<div class='message'>",
            //'<h2>儀表板</em></h2>',
            //'<br/>',
            //"</div>",
            //'<img src="resources/test.png"  height="700" width="1100">'
        ].join("")
    },

    initialize: function () {
        //this.element.on({
        //    tap: {
        //        fn: function () {
        //            this.hide();
        //            Ext.Viewport.toggleMenu("left");
        //        },
        //        single: true,
        //        scope: this
        //    }
        //})
    }
});