/*
 var a = [1,2,3,4,5,6,7,8,9,10];

 // return everything
 a.where( "( ) => true" ) ;
 --> [1,2,3,4,5,6,7,8,9,10]

 // return even numbers
 a.where( "( n, i ) => n % 2 == 0" ) ;
 --> [2,4,6,8,10]

 // query first 6 products whose category begins with 'con' using extra param and regular expression
 products.where( "( el, i, res, param ) => res.length <= 6 && param.test( el.cat )", /^con/i);

 // using customer table data from SQL Server's northwind database...
 customers.where( "( el, i, res, param ) => el.country == param", "USA" );

 */


function lambda(l) {
    var fn = l.match(/\((.*)\)\s*=>\s*(.*)/);
    var p = [];
    var b = "";

    if (fn.length > 0) fn.shift();
    if (fn.length > 0) b = fn.pop();
    if (fn.length > 0) p = fn.pop()
        .replace(/^\s*|\s(?=\s)|\s*$|,/g, '').split(' ');

    // prepend a return if not already there.
    fn = ( ( !/\s*return\s+/.test(b) ) ? "return " : "" ) + b;

    p.push(fn);

    try {
        return Function.apply({}, p);
    }
    catch (e) {
        return null;
    }
}

Array.prototype.where =
    function (f) {
        var fn = f;
        // if type of parameter is string
        if (typeof f == "string")
        // try to make it into a function
            if (( fn = lambda(fn) ) == null)
            // if fail, throw exception
                throw "Syntax error in lambda string: " + f;
        // initialize result array
        var res = [];
        var l = this.length;
        // set up parameters for filter function call
        var p = [0, 0, res];
        // append any pass-through parameters to parameter array
        for (var i = 1; i < arguments.length; i++) p.push(arguments[i]);
        // for each array element, pass to filter function
        for (var i = 0; i < l; i++) {
            // skip missing elements
            if (typeof this[i] == "undefined") continue;
            // param1 = array element
            p[0] = this[i];
            // param2 = current indeex
            p[1] = i;
            // call filter function. if return true, copy element to results
            if (!!fn.apply(this, p)) res.push(this[i]);
        }
        // return filtered result
        return res;
    };

String.prototype.Right = function (n) {
    if (n <= 0)
        return "";
    else if (n > String(this).length)
        return this;
    else {
        var iLen = String(this).length;
        return String(this).substring(iLen, iLen - n);
    }
};

/*
 * 把半形字串轉成全形
 * @return 全形字串
 */
String.prototype.halfToFull = function halfToFull() {
    var temp = "";
    for (var i = 0; i < this.toString().length; i++) {
        var charCode = this.toString().charCodeAt(i);
        if (charCode <= 126 && charCode >= 33) {
            charCode += 65248;
        } else if (charCode == 32) { // 半形空白轉全形
            charCode = 12288;
        }
        temp = temp + String.fromCharCode(charCode);
    }
    return temp;
};

/* 左邊補0 */
function padLeft(str, len) {
    str = '' + str;
    return str.length >= len ? str : new Array(len - str.length + 1).join("0") + str;
}
//useLowerType，中文數字分大小寫，true為小寫，false為大寫
//var obj = new ChineseNumberString(/*useLowerType*/true);
//obj.getResult(/*number*/123);
function ChineseNumberString(useLowerType) {
    var obj = this;//待回傳的物件
    var numLower = Array('○', '一', '二', '三', '四', '五', '六', '七', '八', '九');//小寫中文
    var numUpper = Array('零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖');//大寫中文
    var numTarget = useLowerType ? numLower : numUpper;//指定要用哪一個中文（大小寫）
    var numLowerUnit1 = Array('', '十', '百', '千');//小寫中文小單位
    var numLowerUnit2 = Array('', '拾', '佰', '仟');//大寫中文小單位
    var numLowerTarget = useLowerType ? numLowerUnit1 : numLowerUnit2;//指定要用哪一個中文（小單位）
    var numLowerUnitLength = 4;//小單位長度
    var numLargeUnit = Array('', '萬', '億', '兆', '京', '垓', '秭', '穰', '溝', '澗', '正', '載', '極');//中文大單位
    var numNegative = "-";//負值
    //判斷是否為數值型態
    obj.checkIsNumber = function (number) {
        return !isNaN(parseInt(number));
    }
    obj.getResult = function (number) {
        //如果不是數值，則擲出例外
        if (!this.checkIsNumber(number)) {
            Error("輸入的形態不是Number");
            throw new Error("輸入的形態不是Number");
        }
        //如果是零，則直接輸出
        else if (number == 0) return numTarget[0];
        //如果是10，則直接輸出
        else if (number == 10) return numLowerUnit1[1];
        //轉成字串(使用絕對值避免處理負號)
        var numberString = String(Math.abs(number));
        //準備輸出的字串
        var output = "";
        //小單位(四位數)的傳回值(傳入數字字串)
        var getCurrentPart = function (numString) {
            //拆解成陣列
            numString = numString.split("");
            //預設回傳結果
            var result = "";
            //是否輸出過1-9
            var isLastNumberNonZero = false;
            //從後往前掃
            //1011一千○一十一
            for (var index = numString.length - 1; index >= 0; index--) {
                //目前位數
                var currentDigit = numString.length - index;
                //目前的數字
                var currentNumber = numString[index] - '0';
                //上一個位數為非0
                //剛開始為false(沒有上一個位數)，之後會偵測上一個位數(之前的小位數)是否為非0
                isLastNumberNonZero = ((index + 1) == numString.length) ? false : (numString[index + 1] - '0' > 0);
                //剛開始遇到零不處理，除非有之後遇到1-9
                if (isLastNumberNonZero || currentNumber > 0)
                    if (isLastNumberNonZero && numString.length == 2 && numString[0] == 1) {
                        //總長度為2，有上一位數且上一位數為1，為十一~十九
                        result = numLowerTarget[1]//十位數
                            + result
                    } else {
                        result = numTarget[currentNumber]//數字
                            + (currentNumber > 0 ? numLowerTarget[(currentDigit - 1) % numLowerUnitLength] : "")//小單位(個十百千) 大於0才會輸出
                            + result;//上一個位數
                    }
            }
            return result;
        };
        //剛開始小單位長度(前面多出的部份)，Ex 10000，多出的部份為1
        var initialPartLegth = numberString.length % numLowerUnitLength;
        if (initialPartLegth > 0)
            output = getCurrentPart(numberString.substr(0, initialPartLegth)) + numLargeUnit[Math.floor(numberString.length / 4)];
        //之後每次掃四個位數
        for (var i = initialPartLegth; i < numberString.length; i += numLowerUnitLength) {
            var partResult = getCurrentPart(numberString.substr(i, numLowerUnitLength));
            output += partResult + (partResult != "" ? numLargeUnit[(numberString.length - i) / 4 - 1] : "");
        }
        //回傳時如有負值，則加上-
        return (number < 0 ? numNegative : "") + output;
    }
    //回傳物件
    return obj;
}

/*
 * Usage: stringFill3("abc", 2) == "abcabc"
 * http://stackoverflow.com/questions/202605/repeat-string-javascript
 */

function stringFill3(x, n) {
    var s = '';
    for (; ;) {
        if (n & 1) s += x;
        n >>= 1;
        if (n) x += x;
        else break;
    }
    return s;
}

function xmlToString(xmlData) { // this functions waits jQuery XML
    var xmlString = undefined;
    if (window.ActiveXObject) {
        xmlString = xmlData[0].xml;
    }
    if (xmlString === undefined) {
        var oSerializer = new XMLSerializer();
        xmlString = oSerializer.serializeToString(xmlData[0]);
    }
    return xmlString;
}


/*
 Copyright Vassilis Petroulias [DRDigit]

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
var B64 = {
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    lookup: null,
    ie: /MSIE /.test(navigator.userAgent),
    ieo: /MSIE [67]/.test(navigator.userAgent),
    encode: function (s) {
        /* jshint bitwise:false */
        var buffer = B64.toUtf8(s),
            position = -1,
            result,
            len = buffer.length,
            nan0, nan1, nan2, enc = [, , ,];

        if (B64.ie) {
            result = [];
            while (++position < len) {
                nan0 = buffer[position];
                nan1 = buffer[++position];
                enc[0] = nan0 >> 2;
                enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
                if (isNaN(nan1))
                    enc[2] = enc[3] = 64;
                else {
                    nan2 = buffer[++position];
                    enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
                    enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
                }
                result.push(B64.alphabet.charAt(enc[0]), B64.alphabet.charAt(enc[1]), B64.alphabet.charAt(enc[2]), B64.alphabet.charAt(enc[3]));
            }
            return result.join('');
        } else {
            // result = '';
            // while (++position < len) {
            //     nan0 = buffer[position];
            //     nan1 = buffer[++position];
            //     enc[0] = nan0 >> 2;
            //     enc[1] = ((nan0 & 3) << 4) | (nan1 >> 4);
            //     if (isNaN(nan1))
            //         enc[2] = enc[3] = 64;
            //     else {
            //         nan2 = buffer[++position];
            //         enc[2] = ((nan1 & 15) << 2) | (nan2 >> 6);
            //         enc[3] = (isNaN(nan2)) ? 64 : nan2 & 63;
            //     }
            //     result += B64.alphabet[enc[0]] + B64.alphabet[enc[1]] + B64.alphabet[enc[2]] + B64.alphabet[enc[3]];
            // }
            // return result;

            // 為處理罕用字（Unicode）改用新方式轉碼 - by yi-chi chiu
            return window.btoa(unescape(encodeURIComponent(s)));
        }
    },
    decode: function (s) {
        /* jshint bitwise:false */
        s = s.replace(/\s/g, '');
        if (s.length % 4)
            throw new Error('InvalidLengthError: decode failed: The string to be decoded is not the correct length for a base64 encoded string.');
        if (/[^A-Za-z0-9+\/=\s]/g.test(s))
            throw new Error('InvalidCharacterError: decode failed: The string contains characters invalid in a base64 encoded string.');

        var buffer = B64.fromUtf8(s),
            position = 0,
            result,
            len = buffer.length;

        if (B64.ieo) {
            result = [];
            while (position < len) {
                if (buffer[position] < 128)
                    result.push(String.fromCharCode(buffer[position++]));
                else if (buffer[position] > 191 && buffer[position] < 224)
                    result.push(String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63)));
                else
                    result.push(String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63)));
            }
            return result.join('');
        } else {
            // result = '';
            // while (position < len) {
            //     if (buffer[position] < 128)
            //         result += String.fromCharCode(buffer[position++]);
            //     else if (buffer[position] > 191 && buffer[position] < 224)
            //         result += String.fromCharCode(((buffer[position++] & 31) << 6) | (buffer[position++] & 63));
            //     else
            //         result += String.fromCharCode(((buffer[position++] & 15) << 12) | ((buffer[position++] & 63) << 6) | (buffer[position++] & 63));
            // }
            // return result;

            // 為處理罕用字（Unicode）改用新方式轉碼 - by yi-chi chiu
            return decodeURIComponent(escape(window.atob(s)));
        }
    },
    toUtf8: function (s) {
        /* jshint bitwise:false */
        var position = -1,
            len = s.length,
            chr, buffer = [];
        if (/^[\x00-\x7f]*$/.test(s)) while (++position < len)
            buffer.push(s.charCodeAt(position));
        else while (++position < len) {
            chr = s.charCodeAt(position);
            if (chr < 128)
                buffer.push(chr);
            else if (chr < 2048)
                buffer.push((chr >> 6) | 192, (chr & 63) | 128);
            else
                buffer.push((chr >> 12) | 224, ((chr >> 6) & 63) | 128, (chr & 63) | 128);
        }
        return buffer;
    },
    fromUtf8: function (s) {
        /* jshint bitwise:false */
        var position = -1,
            len, buffer = [],
            enc = [, , ,];
        if (!B64.lookup) {
            len = B64.alphabet.length;
            B64.lookup = {};
            while (++position < len)
                B64.lookup[B64.alphabet.charAt(position)] = position;
            position = -1;
        }
        len = s.length;
        while (++position < len) {
            enc[0] = B64.lookup[s.charAt(position)];
            enc[1] = B64.lookup[s.charAt(++position)];
            buffer.push((enc[0] << 2) | (enc[1] >> 4));
            enc[2] = B64.lookup[s.charAt(++position)];
            if (enc[2] === 64)
                break;
            buffer.push(((enc[1] & 15) << 4) | (enc[2] >> 2));
            enc[3] = B64.lookup[s.charAt(++position)];
            if (enc[3] === 64)
                break;
            buffer.push(((enc[2] & 3) << 6) | enc[3]);
        }
        return buffer;
    },
    toBlob: function (b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {type: contentType});
    }
};

var B64url = {
    decode: function (input) {
        // Replace non-url compatible chars with base64 standard chars
        input = input
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        // Pad out with standard base64 required padding characters
        var pad = input.length % 4;
        if (pad) {
            if (pad === 1) {
                throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
            }
            input += new Array(5 - pad).join('=');
        }

        return B64.decode(input);
    },

    encode: function (input) {
        var output = B64.encode(input);
        return output
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .split('=', 1)[0];
    }
};

var parseXmlString = function (xmlDocStr) {
    var isIEParser = window.ActiveXObject || "ActiveXObject" in window;
    if (xmlDocStr === undefined) {
        return null;
    }
    var xmlDoc;
    if (window.DOMParser) {
        var parser = new window.DOMParser();
        var parsererrorNS = null;
        // IE9+ now is here
        if (!isIEParser) {
            try {
                parsererrorNS = parser.parseFromString("INVALID", "text/xml").childNodes[0].namespaceURI;
            }
            catch (err) {
                parsererrorNS = null;
            }
        }
        try {
            xmlDoc = parser.parseFromString(xmlDocStr, "text/xml");
            if (parsererrorNS != null && xmlDoc.getElementsByTagNameNS(parsererrorNS, "parsererror").length > 0) {
                console.log('Error parsing XML: ' + xmlDocStr);
                // xmlDoc = null;
            }
        }
        catch (err) {
            xmlDoc = null;
        }
    }
    else {
        // IE :(
        if (xmlDocStr.indexOf("<?") == 0) {
            xmlDocStr = xmlDocStr.substr(xmlDocStr.indexOf("?>") + 2);
        }
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlDocStr);
    }
    return xmlDoc;
};

function ping(url, callback) {

    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.url = url;
        var _that = this;
        this.img = new Image();
        this.img.onload = function () {
            _that.inUse = false;
            _that.callback('ok');
        };
        this.img.onerror = function (e) {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('error', e);
            }
        };
        this.start = new Date().getTime();
        this.img.src = url;
        this.timer = setTimeout(function () {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout');
            }
        }, 1500);
    }
}