/**
 *
 */

Ext.define('OA.model.seal.BASE', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: "basePos", type: "object" },
            { name: "mode", type: "string" },
            { name: "location", type: "string" },
            { name: "sealY", type: "float" },
            { name: "sealHeight", type: "float" },
            { name: "rows", type: "array" },
            { name: "dialogType", type: "string" }
        ]
    },
    constructor: function () {
        this.callParent(arguments);
        this.set('basePos', this.getBasePos());
    },
    getBasePos: function () {
        var rowH = OA.common.DIMgr.getRowHeight();
        var pageWidth = OA.common.DIMgr.getPageWidth();
        var pageHeight = OA.common.DIMgr.getPageHeight();
        var pageMargin = OA.common.DIMgr.getPageMargin();
        var pageInterval = OA.common.DIMgr.getPageInterval();
        var paddingBottom = 2 * rowH;
        var pageBottom = pageHeight - pageMargin.bottom;
        var sealHeight = (OA.common.DIMgr.getPageHeight() / 4.2);
        var sealWidth = pageWidth - pageMargin.left - pageMargin.right;
        var sealBannerY = pageBottom - sealHeight + rowH + 10 - paddingBottom;

        var p = {
            x1: pageMargin.left - 5, y1: pageBottom - sealHeight - paddingBottom + 30,
            x2: pageMargin.left - 5 + sealWidth, y2: pageBottom - sealHeight - paddingBottom + 30,
            x3: pageMargin.left - 5 + sealWidth, y3: pageBottom - paddingBottom,
            x4: pageMargin.left - 5, y4: pageBottom - paddingBottom,
            x5: pageMargin.left - 5, y5: sealBannerY,
            x6: pageMargin.left - 5 + sealWidth, y6: sealBannerY
        };

        pageMargin.top

        return {
            rowHeight: rowH,
            pageWidth: pageWidth,
            pageHeight: pageHeight,
            pageMargin: pageMargin,
            paddingBottom: paddingBottom,
            pageBottom: pageBottom,
            sealHeight: sealHeight,
            sealWidth: sealWidth,
            sealBannerY: sealBannerY,
            pageInterval: pageInterval,

            format_line: '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="black" opacity="{4}" stroke-width="1" class="sealLine"/>',
            format_dash: '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" stroke="black" opacity="{4}" stroke-width="1" stroke-dasharray="1 1" fill="none" class="sealLine"/>',
            format_text: '<text xml:space="preserve" font-size="16" x="{0}" y="{1}" opacity="{2}" class="sealText">{3}</text>',
            format_sign: '<text xml:space="preserve" font-size="xx-small" x="{0}" y="{1}" class="sealText">{2}</text>',
            format_image: '<image x="{0}" y="{1}" width="{2}" height="{3}" xlink:href="{4}" opacity="{5}" />',
            posFrame: p
        }
    }
});