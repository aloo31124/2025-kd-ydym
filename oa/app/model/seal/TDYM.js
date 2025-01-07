/**
 *
 */

Ext.define('OA.model.seal.TDYM', {
    extend: 'OA.model.seal.BASE',
    requires: [
        'OA.model.seal.BASE'
    ],
    create: function (rows, chapters) {
        var me = this;
        var info = me.get('basePos');
        var rowH = info.rowHeight;
        var pageWidth = info.pageWidth;
        var pageMargin = info.pageMargin;
        var sealBannerY = info.sealBannerY;
        var paddingBottom = 2 * rowH;
        var p = info.posFrame;

        p.y3 += paddingBottom;
        p.y4 += paddingBottom;
        this.set('location', 'top');
        rows.push(Ext.String.format('<g id="gSeal" class="top">'));

        rows.push(Ext.String.format(info.format_dash, p.x5, p.y5, p.x6, p.y6, 1)); //top
        rows.push(Ext.String.format(info.format_dash, p.x2, p.y2, p.x3, p.y3, 1)); //right
        rows.push(Ext.String.format(info.format_dash, p.x3, p.y3, p.x4, p.y4, 1)); //bottom
        rows.push(Ext.String.format(info.format_dash, p.x4, p.y4, p.x1, p.y1, 1)); //left
        rows.push(Ext.String.format(info.format_dash, p.x5, p.y5 + 30, p.x6, p.y6 + 30, 1)); //middle

        rows.push(Ext.String.format(info.format_text, pageMargin.left + 1, sealBannerY + rowH * 2.5, 1, '承辦單位'));
        rows.push(Ext.String.format(info.format_text, pageWidth / 2.8, sealBannerY + rowH * 2.5, 1, '會辦單位'));
        rows.push(Ext.String.format(info.format_text, pageWidth / 5 * 3.2, sealBannerY + rowH * 2.5, 1, '決行'));

        var format_total = '<text xml:space="preserve" id="totalnumber" font-size="14" x="{0}" y="{1}" class="sealText">{2}</text>';
        rows.push(Ext.String.format(format_total, pageMargin.left, p.y3 + 12, '歸檔總頁數共　  頁，附件共  　頁'));

        var lastrowY = p.y3 + rowH + 5;

        rows.push('</g>');

        var h = lastrowY + rowH - p.y2;

        this.set('rows', rows);
        this.set('sealY', p.y1);
        this.set('sealHeight', h);
    },
    createPagingSeal: function (rows) {
        var me = this;
        var qs = OA.common.Global.getQ();
        var info = me.get('basePos');
        var pageWidth = info.pageWidth;
        var pageHeight = info.pageHeight;
        var pageMargin = info.pageMargin;

        //通用騎縫章
        var rightSeal = KangDaAppConfig().Seal_A_1;
        var leftSeal = KangDaAppConfig().Seal_A_2;

        var random = Math.floor(Math.random() * 100000000).toString();
        var groupCount = 5;
        var iSum = 0;
        if (random && random.length > 0) {
            for (var i = 0; i < random.length; i++) {
                iSum += parseInt(random[i]);
            }
        }
        if (iSum > groupCount) iSum = iSum % groupCount;
        var sHeight = pageHeight * 1 / 4;
        switch (iSum) {
            case 1:
                sHeight = pageHeight * 1 / 3;
                break;
            case 2:
                sHeight = pageHeight * 1 / 2;
                break;
            case 3:
                sHeight = pageHeight - (pageHeight * 1 / 3);
                break;
            case 4:
                sHeight = pageHeight - (pageHeight * 1 / 4);
                break;
        }

        //騎縫章（image）
        rows.push('<g id="canvas_pagingSeal_0">');//左章
        rows.push(Ext.String.format(info.format_image, 29, sHeight + pageHeight, 52, 76, leftSeal, '0.8'));
        rows.push('</g>');

        rows.push('<g id="canvas_pagingSeal_1">');//右章
        rows.push(Ext.String.format(info.format_image, pageWidth - 80, sHeight, 52, 76, rightSeal, '0.8'));
        rows.push('</g>');

        //章戳
        var stamps = Ext.getStore('Stamps');
        if (stamps) {
            Ext.Array.each(stamps.data.all, function (item) {
                if (item) {
                    rows.push('<g id="Stamp' + item.get('type') + '">');
                    rows.push(Ext.String.format(info.format_image, 200, 300, 380, 120, item.get('stamp'), '0'));
                    rows.push('</g>');
                }
            });
        }


        //抄本
        rows.push('<g id="canvas_copySeal" opacity="0" class="gCopySeal">');
        var format_copy_rect = '<rect stroke="#000" fill="none" stroke-width="1.5" x="{0}" y="{1}" height="100" width="50" />';
        var _xMargin = pageWidth - pageMargin.right;
        var _yMargin = pageMargin.top - 60;
        rows.push(Ext.String.format(format_copy_rect, pageWidth - pageMargin.right, _yMargin));
        var format_copy_text = '<text font-size="38" stroke-width="0" stroke="#000" fill="#000000" x="{0}" y="{1}">{2}</text>';
        rows.push(Ext.String.format(format_copy_text, _xMargin + 5, _yMargin + 35, '抄'));
        rows.push(Ext.String.format(format_copy_text, _xMargin + 5, _yMargin + 90, '本'));
        rows.push('</g>');

        //電子佈告欄
        var dialog = me.get('dialogType');
        var _opacity = (dialog == 'Third') ? '1' : '0';
        var format_third_g = '<g id="canvas_thirdSeal" opacity="{0}" class="gThirdSeal">';
        rows.push(Ext.String.format(format_third_g, _opacity));
        var format_third_rect = '<rect stroke="#000" fill="none" stroke-width="1.5" x="{0}" y="{1}" height="28" width="125" />';
        rows.push(Ext.String.format(format_third_rect, pageMargin.left, pageMargin.top - 30));
        var format_third_text = '<text font-size="22" stroke-width="0" stroke="#000" fill="#000000" x="{0}" y="{1}">{2}</text>';
        rows.push(Ext.String.format(format_third_text, pageMargin.left + 5, pageMargin.top - 10, '電子佈告欄'));
        rows.push('</g>');

        //本別標註
        var _xMargin = pageMargin.left;
        var _yMargin = pageMargin.top - 50;
        var format_copy_text = '<text id="canvas_typeMark" class="test" opacity="1" font-size="18" stroke-width="0" stroke="#000" fill="#000000" x="{0}" y="{1}">{2}</text>';
        rows.push(Ext.String.format(format_copy_text, _xMargin, _yMargin, ''));


        /*
        //機關浮水印（離線版不增加）
        if (typeof require == 'undefined') {
            var waterMark = 'data:image/png;base64,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';
            rows.push('<g id="canvas_watermark_1">');
            rows.push(Ext.String.format(info.format_image, 150, 300, 500, 500, waterMark, '0'));

            //調閱浮水印增加調閱帳號+調閱時間
            if (qs.borrow && qs.borrow == "Y") {
                var watermark_Word = '';
                if (qs.bempNo && qs.datetime) {
                    watermark_Word = qs.bempNo + qs.datetime;
                }
                var format_watermarkWord_text = '<text id="canvas_watermarkWord_1" class="test" opacity="0" font-size="70" stroke-width="3" stroke="red" fill="red" x="{0}" y="{1}" transform="rotate(-25 0,0)" >{2}</text>';
                rows.push(Ext.String.format(format_watermarkWord_text, -230, 700, watermark_Word));
            }
            rows.push('</g>');
        }
        */

        return rows;
    }
});