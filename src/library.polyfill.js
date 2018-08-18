/** Polyfill */
/*! http://mths.be/startswith v0.2.0 by @mathias */
if (!String.prototype.startsWith) {
    (function() {
        'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
        var defineProperty = (function() {
            // IE 8 only supports `Object.defineProperty` on DOM elements
            try {
                var object = {};
                var $defineProperty = Object.defineProperty;
                var result = $defineProperty(object, object, object) && $defineProperty;
            } catch(error) {}
            return result;
        }());
        var toString = {}.toString;
        var startsWith = function(search) {
            if (this == null) {
                throw TypeError();
            }
            var string = String(this);
            if (search && toString.call(search) == '[object RegExp]') {
                throw TypeError();
            }
            var stringLength = string.length;
            var searchString = String(search);
            var searchLength = searchString.length;
            var position = arguments.length > 1 ? arguments[1] : undefined;
            // `ToInteger`
            var pos = position ? Number(position) : 0;
            if (pos != pos) { // better `isNaN`
                pos = 0;
            }
            var start = Math.min(Math.max(pos, 0), stringLength);
            // Avoid the `indexOf` call if no match is possible
            if (searchLength + start > stringLength) {
                return false;
            }
            var index = -1;
            while (++index < searchLength) {
                if (string.charCodeAt(start + index) != searchString.charCodeAt(index)) {
                    return false;
                }
            }
            return true;
        };
        if (defineProperty) {
            defineProperty(String.prototype, 'startsWith', {
                'value': startsWith,
                'configurable': true,
                'writable': true
            });
        } else {
            String.prototype.startsWith = startsWith;
        }
    }());
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(search, this_len) {
        if (this_len === undefined || this_len > this.length) {
            this_len = this.length;
        }
        return this.substring(this_len - search.length, this_len) === search;
    };
}

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

if (!Date.prototype.format) {
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
}

/** Polyfill End */