/*! LibraryJS - v0.0.1 - 2018-09-26 */
/*! https://github.com/hardimplistic */
'use strict';


// Source: src/library.polyfill.js
/** Polyfill */
/*! http://mths.be/startswith v0.2.0 by @mathias */
if (!String.prototype.startsWith) {
    (function() {
// needed to support `apply`/`call` with `undefined`/`null`
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

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
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

if (!String.prototype.toInteger) {
    String.prototype.toInteger = function() {
        var args = arguments;
        var value = this.replace(/\s/g, '').replace(/,/g, '');
        if (value != '' && isNaN(value) == false) {
            return parseInt(value, 10);
        }
        return 0;
    };
}

if (!String.prototype.toFloat) {
    String.prototype.toFloat = function() {
        var args = arguments;
        var value = this.replace(/\s/g, '').replace(/,/g, '');
        if (value != '' && isNaN(value) == false) {
            return parseFloat(value, 10);
        }
        return 0.0;
    };
}

if (!String.prototype.toBoolean) {
    String.prototype.toBoolean = function() {
        var args = arguments;
        if (this == 'true') {
            return true;
        }
        return false;
    };
}

if (!String.prototype.toHashCode) {
    String.prototype.toHashCode = function() {
        return javaHashCode(this);
    };
}

/** Polyfill End */
// Source: src/library.common.js

function isNull(str) {
    return str == null || str.value == "";
}

function convertEmptyToNull(str) {
    return isNull(str) ? null : str;
}

function StringNumber(number, defaultValue) {
    if (number == undefined || number == null) {
        return defaultValue ? String(defaultValue) : "0";
    }
    return String(number);
}

// https://developer.mozilla.org/en-US/docs/Web/API/URL
// /en-US/docs/Web/API/URL
// ../en-US/docs/Web/API/URL
// en-US/docs/Web/API/URL
// en-US/docs/Web/API/URL?key=value#hash
function getLocationRedirect(path) {
    if (path.startsWith('http://')
        || path.startsWith('https://')
        || path.startsWith('file://')) {
        return path;
    }

    var href = [];
    href.push(location.protocol);
    href.push('//');
    href.push(location.host);
    if (!path) {
        href.push(location.pathname);
    } else if (path.startsWith('/')) {
        href.push(path);
    } else if (location.pathname.endsWith('/')) {
        href.push(location.pathname);
        href.push(path);
    } else {
        href.push(location.pathname);
        if (!location.pathname.endsWith('/')) {
            href.push('/');
        }
        href.push('../');
        href.push(path);
    }
    var url = new URL(href.join(''));
    return url.href;
}
function LocationRedirect(path, _debugger) {
    var url = getLocationRedirect(path);
    if (_debugger) {
        this._debugger = _debugger;
    }
    if (this._debugger) {
        if (confirm('Location Redirect: ' + url)) {
            location.href = url;
        }
    } else {
        location.href = url;
    }
}
LocationRedirect.prototype._debugger = false;


// Source: src/library.network.js


function getSearchParameter(key) {
    if (location.search && location.search.substring(1)) {
        var arr, reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        if (arr = location.search.substring(1).match(reg))
            return unescape(arr[2]);
        else
            return null;
    } else {
        return null;
    }
}

function getHashParameter(key) {
    if (location.hash && location.hash.substring(1)) {
        var arr, reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        if (arr = location.hash.substring(1).match(reg))
            return unescape(arr[2]);
        else
            return null;
    } else {
        return null;
    }
}

var WConfig = {
    ajax: {
        timeout: 500000,        // 超时
        loginStatus: 80403,     // 需要登录
        loginUrl: '/login.html' // 登录地址
    }
};

var WFail = {
    failHttp: function(data, textStatus, jqXHR, callback, defaultReturn) {
        if (callback && $.isFunction(callback)) {
            if (defaultReturn) {
                callback({
                    data: defaultReturn,
                    status: jqXHR.status,
                    message: jqXHR.statusText
                });
                return;
            }
            callback({
                data: null,
                status: jqXHR.status,
                message: jqXHR.statusText
            });
        }

    },
    failApi: function(data, textStatus, jqXHR, callback, defaultReturn) {
        switch (data.status) {
            case WConfig.ajax.loginStatus:
                location.href = WConfig.ajax.loginUrl;
                break;
        }
        if (callback && $.isFunction(callback)) {
            if (defaultReturn) {
                callback({
                    data: defaultReturn,
                    status: data.status,
                    message: data.message
                });
                return;
            }
            callback({
                data: null,
                status: data.status,
                message: data.message
            });
        }
    },
    failTimeOut: function(data, textStatus, jqXHR, callback, defaultReturn) {
        if (callback && $.isFunction(callback)) {
            if (defaultReturn) {
                callback({
                    data: defaultReturn,
                    status: jqXHR.status,
                    message: jqXHR.statusText
                });
                return;
            }
            callback({
                data: null,
                status: jqXHR.status,
                message: jqXHR.statusText
            });
        }
    },
};

function WAjaxCall(ajaxOptions, callback, defaultReturn) {
    $.ajax(ajaxOptions)
        .done(function(data, textStatus, jqXHR) {
            if (callback && $.isFunction(callback)) {
                if (data.status == 200) {
                    // status: 200
                    callback(data);
                } else {
                    WFail.failApi(data, textStatus, jqXHR, callback, defaultReturn);
                }
            }
        })
        .fail(function( jqXHR, textStatus, errorThrown) {
            if (textStatus == 'timeout') {
                // 超时处理
                WFail.failTimeOut(null, textStatus, jqXHR, callback, defaultReturn);
                return;
            }
            WFail.failHttp(null, textStatus, jqXHR, callback, defaultReturn);
        });
}

function WJsonCall(url, parameter, callback, defaultReturn) {
    var ajaxOptions = {
        type: "POST",
        url: url,
        data: $.toJSON(parameter),
        dataType: "json",
        contentType : 'application/json;charset=utf-8',
        timeout: WConfig.ajax.timeout
    };
    WAjaxCall(ajaxOptions, callback, defaultReturn);
}

function WDeleteJsonCall(url, parameter, callback, defaultReturn) {
    var ajaxOptions = {
        type: "DELETE",
        url: url,
        data: $.toJSON(parameter),
        dataType: "json",
        contentType : 'application/json;charset=utf-8',
        timeout: WConfig.ajax.timeout
    };
    WAjaxCall(ajaxOptions, callback, defaultReturn);
}

function WPutJsonCall(url, parameter, callback, defaultReturn) {
    var ajaxOptions = {
        type: "PUT",
        url: url,
        data: $.toJSON(parameter),
        dataType: "json",
        contentType : 'application/json;charset=utf-8',
        timeout: WConfig.ajax.timeout
    };
    WAjaxCall(ajaxOptions, callback, defaultReturn);
}

function WPostJsonCall(url, parameter, callback, defaultReturn) {
    WJsonCall(url, parameter, callback, defaultReturn);
}

function WBodyCall(url, parameter, callback, defaultReturn) {
    WJsonCall(url, parameter, callback, defaultReturn);
}

function WPostCall(url, parameter, callback, defaultReturn) {
    var ajaxOptions = {
        type: "POST",
        url: url,
        data: parameter,
        timeout: WConfig.ajax.timeout
    };
    WAjaxCall(ajaxOptions, callback, defaultReturn);
}

function WGetCall(url, parameter, callback, defaultReturn) {
    var ajaxOptions = {
        type: "GET",
        url: url,
        data: parameter,
        timeout: WConfig.ajax.timeout
    };
    WAjaxCall(ajaxOptions, callback, defaultReturn);
}

/** Promise AjaxCall */

var PConfig = {
    ajax: {
        timeout: 500000,        // 超时
        loginStatus: 80403,     // 需要登录
        loginUrl: '/login.html' // 登录地址
    }
};

function PAjaxCall(ajaxOptions, resolve, reject) {
    $.ajax(ajaxOptions)
        .done(function(data, textStatus, jqXHR) {
            // 超时处理
            if (textStatus == 'timeout') {
                reject({
                    response: null,
                    textStatus: textStatus,
                    jqXHR: jqXHR,
                    errorThrown: null
                });
            }

            // 判断状态码
            else if (data.status == PConfig.ajax.loginStatus) {
                // 去登录
                location.href = PConfig.ajax.loginUrl;
            }

            else if (data.status != 200) {
                reject({
                    response: data,
                    textStatus: textStatus,
                    jqXHR: jqXHR,
                    errorThrown: data.message
                });
            }

            // 正确执行
            else if (data.status == 200) {
                resolve(data);
            }

            else {
                reject({
                    response: data,
                    textStatus: textStatus,
                    jqXHR: jqXHR,
                    errorThrown: null
                });
            }
        })
        .fail(function( jqXHR, textStatus, errorThrown) {
            reject({
                response: null,
                textStatus: textStatus,
                jqXHR: jqXHR,
                errorThrown: errorThrown
            });
        });
}

function PJsonCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "POST",
            url: url,
            data: $.toJSON(parameter),
            dataType: "json",
            contentType : 'application/json;charset=utf-8',
            timeout: PConfig.ajax.timeout
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}

function PPostJsonCall(url, parameter) {
    PJsonCall(url, parameter);
}

function PBodyCall(url, parameter) {
    PJsonCall(url, parameter);
}

function PDeleteJsonCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "DELETE",
            url: url,
            data: $.toJSON(parameter),
            dataType: "json",
            contentType : 'application/json;charset=utf-8',
            timeout: PConfig.ajax.timeout
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}

function PPostCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "POST",
            url: url,
            data: parameter,
            timeout: PConfig.ajax.timeout
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}

function PGetCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "GET",
            url: url,
            data: parameter,
            timeout: PConfig.ajax.timeout
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}

function PPutJsonCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "PUT",
            url: url,
            data: $.toJSON(parameter),
            dataType: "json",
            contentType : 'application/json;charset=utf-8',
            timeout: PConfig.ajax.timeout
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}


























// Source: src/library.form.js

/**
 * 获得指定表单里的所有值
 * @param $form
 */
function formValue(formJqObj, isFaultTolerant) {
    var eles = formJqObj[0].elements;
    var data = {};
    // 字段
    $.each(eles, function(i, element) {
        var target = $(element);
        var name = target.attr('name');
        if (!name) {
            if (isFaultTolerant === true) {
                var id = target.attr('id');
                if (id)
                    name = id;
                else
                    return;
            } else {
                return;
            }
        }
        data[name] = null;
    });

    // 取值
    $.each(eles, function(i, element) {
        var target = $(element);
        var name = target.attr('name');
        if (!name) {
            if (isFaultTolerant === true) {
                var id = target.attr('id');
                if (id)
                    name = id;
                else
                    return;
            } else {
                return;
            }
        }

        var tag = element.tagName.toLowerCase();
        if (tag === 'select') {
            data[name] = target.val();
            return;
        }
        if (tag === 'textarea') {
            data[name] = target.val();
            return;
        }

        var type = target.attr('type').toLowerCase();
        if (type === 'radio') {
            if(element.checked){
                data[name] = target.val();
            }
            return;
        }
        if (type === 'checkbox') {
            if (element.checked && target.attr('data-multi') === 'true') {
                var d = data[name];
                if (!d) {
                    d = data[name] = []
                }
                d.push(target.val());
            } else if (element.checked) {
                data[name] = target.val();
            }
            return;
        }
        if (['text', 'password', 'hidden'].indexOf(type) > -1) {
            data[name] = target.val();
            return;
        }
        data[name] = target.val();
    });
    return data;
}
function formValueById(formId, isFaultTolerant) {
    return formValue($('#' + formId), isFaultTolerant);
}

// Source: src/library.storage.js

var WStorage = {
    setItem: function(key, valueObject) {
        var type = $.type(valueObject);
        switch (type) {
            case 'object':
            case 'array':
                localStorage.setItem('_type_' + key, type);
                localStorage.setItem(key, $.toJSON(valueObject));
                break;
            default:
                localStorage.setItem('_type_' + key, type);
                localStorage.setItem(key, valueObject);
        }
    },
    getItem: function(key) {
        var type = localStorage.getItem('_type_' + key);
        var valueObject = localStorage.getItem(key);
        switch (type) {
            case 'object':
            case 'array':
                valueObject = $.parseJSON(valueObject);
            default:
                return valueObject;
        }
    },
    removeItem: function(key) {
        localStorage.removeItem('_type_' + key);
        localStorage.removeItem(key)
    }
};

var WCookie = {
    setItem: function(key, valueObject) {
        var type = $.type(valueObject);
        switch (type) {
            case 'object':
            case 'array':
                localStorage.setItem('_type_c_' + key, type);
                $.cookie(key, $.toJSON(valueObject), {path: '/'});
                break;
            default:
                localStorage.setItem('_type_c_' + key, type);
                $.cookie(key, valueObject, {path: '/'});
        }
    },
    getItem: function(key) {
        var type = localStorage.getItem('_type_c_' + key);
        var valueObject = localStorage.getItem(key);
        switch (type) {
            case 'object':
            case 'array':
                valueObject = $.parseJSON($.cookie(key));
            default:
                return valueObject;
        }
    },
    removeItem: function(key) {
        localStorage.removeItem('_type_c_' + key);
        localStorage.removeItem(key)
    }
};

// Source: src/library.chain.js

// 链条工具类
function Chain(){
    var self = this;
    self.index = 0;
    self.chain = [];
    self.reset = function(){
        self.index = 0;
    };
    self.clear = function(){
        self.chain = [];
        self.index = 0;
    };
    self.method = function(fn){
        self.chain.push(fn);
    };
    self.start = function(){
        if(self.chain.length == 0){
            return;
        }
        var next = function(data){
            var fn = self.chain[++self.index];
            if(fn){
                fn(next, data);
            }
        };
        self.chain[0](next);
    };
    return self;
}
// Source: src/library.asyncqueue.js

// 并行工具类
function AsyncQueue() {
    var self = this;
    self.queue = [];
    self.countdown = 0;
    self._finish = function() {};
    self.reset = function(){
        self.countdown = 0;
    };
    self.action = function(fn){
        self.queue.push(fn);
    };
    self.finish = function(fn){
        self._finish = fn;
    };
    self.start = function(){
        if(self.queue.length == 0){
            return;
        }
        var finish = function(){
            if (++ self.countdown == self.queue.length) {
                self._finish();
            }
        };
        for (var i in self.queue) {
            self.queue[i](finish);
        }
    };
}

// Source: src/library.data.js


// 获取对象中多个层级的值
// param dataObject object/array 数据对象，数组、对象或复杂结构对象
// param depthKey string 访问路径
// param defaultValue 默认值
// return 指定路径的值，或者默认值
function depthValue(dataObject, depthKey, defaultValue) {
    var _depthKey = null;
    if (typeof depthKey == 'string') {
        _depthKey = depthKey.split('.');
    } else {
        _depthKey = depthKey;
    }
    var current = dataObject;
    var keyCount = _depthKey.length;
    for (var i = 0; i < keyCount; i++) {
        if (typeof current != 'object') {
            break;
        }
        var key = _depthKey.shift();
        current = current[key];
        if (current == undefined) {
            return defaultValue == undefined ? null : defaultValue;
        }
    }
    return current;
}


// 统计一个集合中所有对象某一个字段（属性）的合计值
// param arr 集合
// param column string 字段名称
// return number 合计值
function arrayObjectColumnSumToNumber(arr, column) {
    if (!arr || arr.length == 0) {
        return 0;
    }
    var sum = 0;
    for (var i in arr) {
        var o = arr[i];
        var v = depthValue(o, column);
        if (v == undefined || typeof v == 'object') {
            continue;
        }
        if (typeof v == 'string') {
            sum += v.toFloat();
            continue;
        }
        if (typeof v == 'number') {
            sum += v;
            continue;
        }
    }
    return sum;
}

// 类似string的join方法，将一个集合中所有对象某一个字段（属性）的值，用指定的连接符号拼接
// param arr 集合
// param column string 字段名称
// param separator string 连接符号
// return string
function arrayObjectColumnSumToString(arr, column, separator) {
    if (!arr || arr.length == 0) {
        return '';
    }
    separator = separator ? separator : ', ';
    var sum = '';
    for (var i in arr) {
        var o = arr[i];
        var v = depthValue(o, column);
        if (v == undefined || typeof v == 'object') {
            continue;
        }
        if (sum.length > 0) {
            sum += separator;
        }
        sum += v;
    }
    return sum;
}

// 将一个集合中所有对象某一个字段（属性）的值，通过指定开始值和结束值条件，返回符合的集合，返回的集合是符合条件的对象本身
// param arr 集合
// param column string 字段名称
// param startValue number 开始值
// param endValue number 结束值
// return [{}, {}, ...] 对象集合
function arrayObjectColumnNumberValueSubArray(arr, column, startValue, endValue) {
    if (!arr || arr.length == 0) {
        return [];
    }
    var _arr = [];
    for (var i in arr) {
        var o = arr[i];
        var v = depthValue(o, column);
        if (v == undefined || typeof v == 'object') {
            continue;
        }
        if (v >= startValue && v <= endValue) {
            _arr.push(o);
        }
    }
    return _arr;
}

// 将一个集合中所有对象某一个字段（属性）的值，通过指定枚举集合条件，返回符合的集合，返回的集合是符合条件的对象本身
// param arr 集合
// param column string 字段名称
// param values array 枚举集合
// return [{}, {}, ...] 对象集合
function arrayObjectColumnInNumberValueSubArray(arr, column, values) {
    if (!arr || arr.length == 0) {
        return [];
    }
    var _arr = [];
    for (var i in arr) {
        var o = arr[i];
        var v = depthValue(o, column);
        if (v == undefined || typeof v == 'object') {
            continue;
        }
        if (values.indexOf(v) > -1) {
            _arr.push(o);
        }
    }
    return _arr;
}

// 将多个集合合并成一个对象集合
// params ['column1', 'column2', 'column3'], [1, 2], [1, 2], [1, 2]
//        第一个参数为字段定义，从第二个参数开始均为数据，个数和第一个参数的字段定义个数相同
//        第二个参数及以后的数据长度应该要一样长
// return [{column1: 1, column2: 1, column3: 1}, {column1: 2, column2: 2, column3: 2}]
function arraysMergeToArrayObject() {
    var args = arguments;

    if (args < 2) {
        return [];
    }

    var _ArrObject = [];

    var columnNameArray = args[0];
    var rowIndex = args[1];

    for (var i = 0; i < rowIndex.length; i++) {
        var _Object = {};

        for (var n in columnNameArray) {
            var column = columnNameArray[n];
            var value  = args[n.toInteger() + 1][i];
            _Object[column] = value;
        }

        _ArrObject.push(_Object);
    }

    return _ArrObject;
}

// 给集合中所有对象添加一个属性，并设置值
// param arr 集合
// param column string 字段名称
// param value 枚举集合
// return param arr 集合
function arrayObjectAppendColumn(arr, column, value) {
    for (var i in arr) {
        arr[i][column] = value;
    }
    return arr;
}

// 取出集合中所有指定字段的值
// param arr 集合
// param column string 字段名称
// return arr 集合
function arrayObjectValuesByColumn(arr, column) {
    var _arr = [];
    for (var i in arr) {
        var d = arr[i];
        _arr.push(d[column]);
    }
    return _arr;
}

// 取出集合中所有指定字段的值
// param arrObj 集合
// param column string 字段名称
// return map
function arrayObjectToMapByColumn(arrObj, column) {
    var map = {};
    for (var i in arrObj) {
        map[arrObj[i][column]] = arrObj[i];
    }
    return map;
}
// Source: src/library.uuid.js

//// 8 character ID (base=2)
//uuid(8, 2)  //  "01001010"
//// 8 character ID (base=10)
//uuid(8, 10) // "47473046"
//// 8 character ID (base=16)
//uuid(8, 16) // "098F4D35"
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}

function CreateID(prefix){
    if(!prefix) prefix = 'ID';
    return '{0}_{1}_{2}'.format(prefix, uuid(8, 16), Math.round( Math.random() * 100 ));
}

// Source: src/library.hashcode.js
/**
 * 将js页面的number类型转换为java的int类型
 * @param num
 * @return intValue
 */
function javaIntValue(num) {
    var MAX_VALUE = 0x7fffffff;
    var MIN_VALUE = -0x80000000;
    if (num > MAX_VALUE || num < MIN_VALUE) {
        return num &= 0xFFFFFFFF;
    }
    return num;
}

/**
 * java String hashCode 的实现
 * @param strKey
 * @return javaIntValue
 */
function javaHashCode(strKey) {
    var hash = 0;
    if (!isNull(strKey)) {
        for (var i = 0; i < strKey.length; i++) {
            hash = hash * 31 + strKey.charCodeAt(i);
            hash = javaIntValue(hash);
        }
    }
    return hash;
}

// Source: src/library.assert.js
var AssertJS = {
    active: false,
    Utils: {
        isDebugModeInSearchQuery: function() {
            if (location.search && location.search.substring(1)) {
                var key = 'debugger';
                var arr, reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
                if (arr = location.search.substring(1).match(reg))
                    return AssertJS.Utils.equals(unescape(arr[2]));
            }
            return false;
        },
        equals: function(v1, v2) {
            return v1 == v2;
        },
        isNull: function(o) {
            return o == null;
        },
        isGreaterThan: function(v, r) {
            return v > r;
        },
        isLessThan: function(v, r) {
            return v < r;
        },
        isStringEmpty: function(o) {
            return AssertJS.Utils.isNull(o)
                || AssertJS.Utils.equals(o.length, 0);
        },
        isObjectEmpty: function(o) {
            if (AssertJS.Utils.isNull(o))
                return true;
            var count = 0;
            for (var i in o) {
                count ++;
                break;
            }
            return AssertJS.Utils.equals(count, 0);
        },
        isArrayEmpty: function(o) {
            return AssertJS.Utils.isNull(o)
                || AssertJS.Utils.equals(o.length, 0);
        }
    },
    Debug: {
        isDebugMode: function() {
            if (AssertJS.active == true)
                return true
            // FIXME
            return false;
        },
        isNull: function(data) {
            if (AssertJS.Debug.isDebugMode())
                if (AssertJS.Utils.isNull(data))
                    debugger;
        },
        isArrayEmpty: function(data) {
            if (AssertJS.Debug.isDebugMode())
                if (AssertJS.Utils.isArrayEmpty(data))
                    debugger;
        }
    }
};