/*! LibraryJS - v0.0.1 - 2020-10-03 */
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
    return str == null || str.length === 0;
}

function convertEmptyToNull(str) {
    return isNull(str) ? null : str;
}

/**
 * @return {string}
 */
function StringValue(value, defaultValue) {
    if (value === undefined || number == null) {
        return defaultValue ? String(defaultValue) : "";
    }
    return String(value);
}

/**
 * @return {string}
 */
function StringNumber(number, defaultValue) {
    if (number === undefined || number == null) {
        return defaultValue ? String(defaultValue) : "0";
    }
    return String(number);
}

function Timestamp(longTime) {
    var time = longTime > 0 ? longTime : Date.now();
    this.getTime = function() {
        return time;
    };
    this.getDate = function() {
        return new Date(time);
    };
    this.toString = function() {
        return time + '';
    };
    return this;
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

function LocationHref(base) {
    var tmp = '';
    var url = [base];
    this.put = function(key, value) {
        if (value == undefined || value == null || value == '') {
            return;
        }
        tmp = url.join('');
        if (url.length == 1 && tmp.indexOf('?') == -1) {
            url.push('?' + key + '=' + (value ? encodeURIComponent(value) : ''));
        } else {
            url.push('&' + key + '=' + (value ? encodeURIComponent(value) : ''));
        }
    };
    this.get = function() {
        return url.join('');
    };
    this.forward = function() {
        location.href = this.get();
    };
    return this;
}

function LocationHash() {
    var tmp = '';
    var url = ['#'];
    this.put = function(key, value) {
        if (value == undefined || value == null || value == '') {
            return;
        }
        url.push(key + '=' + (value ? encodeURIComponent(value) : ''));
    };
    this.get = function() {
        return url.join('&');
    };
    return this;
}
// Source: src/library.network.js

function getSearchParameter(key, defValue) {
    if (location.search && location.search.substring(1)) {
        var arr, reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        if (arr = location.search.substring(1).match(reg))
            return decodeURIComponent(arr[2]);
        else
            return defValue ? defValue : null;
    } else {
        return defValue ? defValue : null;
    }
}

function getHashParameter(key, defValue) {
    if (location.hash && location.hash.substring(1)) {
        var arr, reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        if (arr = location.hash.substring(1).match(reg))
            return decodeURIComponent(arr[2]);
        else
            return defValue ? defValue : null;
    } else {
        return defValue ? defValue : null;
    }
}

function getStringParameter(string, key, defValue) {
    if (string && string.substring(0, 1) == '#') {
        string = string.substring(1);
    }
    if (string) {
        var arr, reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        if (arr = string.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return defValue ? defValue : null;
    } else {
        return defValue ? defValue : null;
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
        timeout: 500000,         // 超时
        loginStatus: 80403,      // 需要登录
        loginUrl: '/login.html', // 登录地址
        tokenKey: 'token',
        responseInterceptors: [
            // 超时处理
            function(response) {
                return true;
            },
            // 判断状态码
            function(response) {
                return true;
            },
        ]
    },
    appendResponseInterceptors: function(fn) {
        PConfig.ajax.responseInterceptors.push(fn);
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

function PBodyCall(url, parameter) {
    return PJsonCall(url, parameter);
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

function PPostJsonCall(url, parameter) {
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


/** Promise Token AjaxCall */

function PAccessToken(token) {
    if (token === undefined) {
        // get
        return WStorage.getItem('PAccessToken');
    } else {
        // set
        WStorage.setItem('PAccessToken', token);
        return WStorage.getItem('PAccessToken');
    }
}

function PTokenJsonCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "POST",
            url: url,
            data: $.toJSON(parameter),
            dataType: "json",
            contentType : 'application/json;charset=utf-8',
            timeout: PConfig.ajax.timeout,
            headers: (function() {
                var headers = {};
                headers[PConfig.ajax.tokenKey] = PAccessToken();
                return headers;
            })(),
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}

function PTokenBodyCall(url, parameter) {
    return PTokenJsonCall(url, parameter);
}

function PTokenPostCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "POST",
            url: url,
            data: parameter,
            timeout: PConfig.ajax.timeout,
            headers: (function() {
                var headers = {};
                headers[PConfig.ajax.tokenKey] = PAccessToken();
                return headers;
            })(),
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}

function PTokenGetCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "GET",
            url: url,
            data: parameter,
            timeout: PConfig.ajax.timeout,
            headers: (function() {
                var headers = {};
                headers[PConfig.ajax.tokenKey] = PAccessToken();
                return headers;
            })(),
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}

function PTokenPostJsonCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "POST",
            url: url,
            data: $.toJSON(parameter),
            dataType: "json",
            contentType : 'application/json;charset=utf-8',
            timeout: PConfig.ajax.timeout,
            headers: (function() {
                var headers = {};
                headers[PConfig.ajax.tokenKey] = PAccessToken();
                return headers;
            })(),
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}

function PTokenPutJsonCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "PUT",
            url: url,
            data: $.toJSON(parameter),
            dataType: "json",
            contentType : 'application/json;charset=utf-8',
            timeout: PConfig.ajax.timeout,
            headers: (function() {
                var headers = {};
                headers[PConfig.ajax.tokenKey] = PAccessToken();
                return headers;
            })(),
        };
        PAjaxCall(ajaxOptions, resolve, reject);
    });
}

function PTokenDeleteJsonCall(url, parameter) {
    return new Promise(function(resolve, reject) {
        var ajaxOptions = {
            type: "DELETE",
            url: url,
            data: $.toJSON(parameter),
            dataType: "json",
            contentType : 'application/json;charset=utf-8',
            timeout: PConfig.ajax.timeout,
            headers: (function() {
                var headers = {};
                headers[PConfig.ajax.tokenKey] = PAccessToken();
                return headers;
            })(),
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
    },
    clear: function() {
        localStorage.clear();
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

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function CreateID(prefix){
    if(!prefix) prefix = 'ID';
    return '{0}_{1}_{2}'.format(prefix, uuid(8, 16), Math.round( Math.random() * 100 ));
}

function uniqueid(prefix, delimiter) {
    prefix = prefix ? prefix : '';
    delimiter = delimiter ? delimiter : '';
    var seed = new Date().getTime().toString(16).toUpperCase();
    var salt = Math.random().toString(16).substring(2).toUpperCase();
    return prefix + delimiter + seed + ',' + salt;
}

// Source: src/library.cache.js


var MediaCache = {};

MediaCache.ImageLoad = function(urlArray, progress, __debugger__) {

    var map = new Map();

    var container = $('#MediaCacheImageContainer');
    if (container.length === 0) {
        container = $('<div id="MediaCacheImageContainer"/>').hide();
    }

    urlArray.forEach(function(url, idx) {
        map.set(url, false);
        var src = url;
        if (__debugger__ === true) {
            if (src.indexOf('?') === -1) {
                src += '?v=' + new Date().getTime();
            } else {
                src += '&v=' + new Date().getTime();
            }
        }
        var id = CreateID();
        var jQImage = $('<img/>')
            .attr('id', id)
            .attr('src', src)
            .attr('data-src', url)
        ;
        jQImage[0].onload = function() {
            var url = $(this).data('src');
            map.set(url, true);
            progress && progress(url, map);
        };
        container.append(jQImage);
    });

    $('body').append(container);

};

MediaCache.AudioLoad = function(urlArray, progress, __debugger__) {

    var map = new Map();

    var container = $('#MediaCacheAudioContainer');
    if (container.length === 0) {
        container = $('<div id="MediaCacheAudioContainer"/>').hide();
    }

    urlArray.forEach(function(url, idx) {
        map.set(url, false);
        var id = CreateID();
        var jQAudio = $('<audio preload="auto" muted/>')
            .attr('id', id)
            .attr('data-src', url)
        ;
        if (__debugger__ === true) {
            if (url.indexOf('?') === -1) {
                url += '?v=' + new Date().getTime();
            } else {
                url += '&v=' + new Date().getTime();
            }
        }
        var jQSource = $('<source src="" type="audio/mpeg"/>').attr('src', url);
        jQAudio.append(jQSource);
        var audio = jQAudio[0];
        audio.load();
        audio.addEventListener("canplaythrough",
            function() {
                var url = $(this).data('src');
                map.set(url, true);
                progress && progress(url, map);
            },
            false);
        container.append(jQAudio);
    });

    $('body').append(container);

};

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
// Source: dependencies/cmspy/js/dialogs.js

// =====================================================================================================================

function DialogPromise(fn) {
    var that = this;
    this.resultStatus = 0;
    this.result = {
        value: null,
        dialog: null
    };
    this.resolveCallback = function() {};
    this.rejectCallback = function() {};
    this.resolve = function(value, dialog) {
        that.resultStatus = 1;
        that.result = {
            value: value,
            dialog: dialog
        };
        if (that.resolveCallback) {
            that.resolveCallback(value, dialog);
        }
    };
    this.reject = function(value, dialog) {
        this.resultStatus = 2;
        this.result = {
            value: value,
            dialog: dialog
        };
        if (that.rejectCallback) {
            that.rejectCallback(value, dialog);
        }
    };
    this.then = function(resolveCallback, rejectCallback) {
        that.resolveCallback = resolveCallback;
        that.rejectCallback = rejectCallback;
        if (that.resultStatus === 1) {
            that.resolveCallback && that.resolveCallback(
                this.result.value,
                this.result.dialog
            );
        } else if (that.resultStatus === 2) {
            that.rejectCallback && that.rejectCallback(
                that.result.value,
                that.result.dialog
            );
        }
    };

    fn(this.resolve, this.reject);
}

// =====================================================================================================================

var MDialog = {
    cacheContainerId: 'm-dialog-cache-template-container',
    hideTask: [],
    hideTaskIntervalId: 0,
    Close: function(m) {
        if (m) {
            m.remove();
        }
    }
};

// =====================================================================================================================

// MDialog.load = false;
MDialog.template = function(templateId, callback) {
    var template = $('#' + templateId).html();
    if (template) {
        callback(template);
        return;
    }
    var container = $('#m-dialog-cache-template-container');
    if (container.length === 0) {
        container = $('<div id="m-dialog-cache-template-container" style="display: none;"/>')
            .appendTo('body');
        container.load('/dialogs.html?v=' + Date.now(), function() {
            console.log('container loaded');
            var template = $('#m-dialog-cache-template-container #' + templateId).html();
            callback(template);
        });
    } else {
        var template = $('#m-dialog-cache-template-container #' + templateId).html();
        callback(template);
    }
};
MDialog.templateByUrl = function(url, callback) {
    var id = 'TMP' + javaHashCode(url);
    var container = $('#' + id);
    if (container.length === 0) {
        container = $('<div id="' + id + '" style="display: none;"/>').appendTo('body');
        container.load(url + '?v=' + Date.now(), function() {
            console.log('container loaded');
            callback();
        });
    } else {
        callback();
    }
};

// =====================================================================================================================

MDialog.Alert = function(options) {
    var defaultOptions = {
        title: '',
        message: ''
    };
    var opts = $.extend(defaultOptions, options);
    return new DialogPromise(function(resolve, reject) {
        MDialog.template('m-dialog-alert', function(template) {
            var m = $(template).appendTo('body');

            // ------------------------------------------------------------

            $('.modal-title', m).html(opts.title ? opts.title : '消息');
            $('.modal-body', m).html(opts.message);

            $('.btn-primary', m).click(function(e) {
                m.modal('hide');
                resolve();
            });

            // ------------------------------------------------------------

            m.on('show.bs.modal', function (e) {
                console.log('show.bs.modal');
            });
            m.on('shown.bs.modal', function (e) {
                console.log('shown.bs.modal');
            });
            m.on('hide.bs.modal', function (e) {
                console.log('hide.bs.modal');
            });
            m.on('hidden.bs.modal', function (e) {
                console.log('hidden.bs.modal');
                m.remove();
            });

            m.modal({
                backdrop: false,
                keyboard: false,
                show: true
            });

            // ------------------------------------------------------------

        });
    });
};

// =====================================================================================================================

MDialog.Confirm = function(options) {
    var defaultOptions = {
        title: '',
        message: ''
    };
    var opts = $.extend(defaultOptions, options);
    return new DialogPromise(function(resolve, reject) {
        MDialog.template('m-dialog-confirm', function(template) {
            var m = $(template).appendTo('body');

            // ------------------------------------------------------------

            $('.modal-title', m).html(opts.title ? opts.title : '消息');
            $('.modal-body', m).html(opts.message);

            $('.btn-primary', m).click(function(e) {
                m.modal('hide');
                resolve();
            });
            $('.btn-default', m).click(function(e) {
                m.modal('hide');
                reject();
            });

            // ------------------------------------------------------------

            m.on('show.bs.modal', function (e) {
                console.log('show.bs.modal');
            });
            m.on('shown.bs.modal', function (e) {
                console.log('shown.bs.modal');
            });
            m.on('hide.bs.modal', function (e) {
                console.log('hide.bs.modal');
            });
            m.on('hidden.bs.modal', function (e) {
                console.log('hidden.bs.modal');
                m.remove();
            });

            m.modal({
                backdrop: false,
                keyboard: false,
                show: true
            });

            // ------------------------------------------------------------

        });
    });
};

// Source: dependencies/cmspy/js/wbutils.js
var wbcache = {
    emotions: null
};

var wb = {
    str62keys: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    int10to62: function(int10) {
        var s62 = '';
        var r = 0;
        while (int10 != 0) {
            r = int10 % 62;
            s62 = this.str62keys.charAt(r) + s62;
            int10 = Math.floor(int10 / 62);
        }
        return s62;
    },
    str62to10: function(str62) {
        var i10 = 0;
        for (var i = 0; i < str62.length; i++) {
            var n = str62.length - i - 1;
            var s = str62.substr(i, 1);  // str62[i]; 字符串用数组方式获取，IE下不支持为“undefined”
            i10 += parseInt(this.str62keys.indexOf(s)) * Math.pow(62, n);
        }
        return i10;
    },
    id2mid: function(id) {
        if (typeof (id) != 'string') {
            return false; // id数值较大，必须为字符串！
        }
        var mid = '';
        for (var i = id.length - 7; i > -7; i = i - 7) //从最后往前以7字节为一组读取mid
        {
            var offset1 = i < 0 ? 0 : i;
            var offset2 = i + 7;
            var num = id.substring(offset1, offset2);
            num = wb.int10to62(num);
            mid = num + mid;
        }
        return mid;
    },
    mid2id: function(mid) {
        var id = '';
        for (var i = mid.length - 4; i > -4; i = i - 4) //从最后往前以4字节为一组读取mid字符
        {
            var offset1 = i < 0 ? 0 : i;
            var len = i < 0 ? parseInt(mid.length % 4) : 4;
            var str = mid.substr(offset1, len);
            str = wb.str62to10(str).toString();
            if (offset1 > 0) //若不是第一组，则不足7位补0
            {
                while (str.length < 7) {
                    str = '0' + str;
                }
            }
            id = str + id;
        }
        return id;
    },
    // 缩略图地址转换thumb150
    thumb150: function(url) {
        var name = url.substring(url.lastIndexOf('/') + 1);
        return 'http://wx3.sinaimg.cn/thumb150/' + name;
    },
    // 缩略图地址转换代理地址thumb150
    proxythumb150: function(url) {
        url = wb.thumb150(url);
        return '/api/resource/image/proxy?url=' + encodeURIComponent(url);
    },
    // 图片代理地址
    proxyimage: function(url) {
        return '/api/resource/image/proxy?url=' + encodeURIComponent(url);
    },
    // 文本框操作
    textarea: {
        // 在光标处插入字符串
        // element    文本框对象
        // value 要插入的值
        insert: function(element, value) {
            //IE support
            if (document.selection) {
                element.focus();
                sel            = document.selection.createRange();
                sel.text    = value;
                sel.select();
            }
            //MOZILLA/NETSCAPE support
            else if (element.selectionStart || element.selectionStart == '0') {
                var startPos    = element.selectionStart;
                var endPos        = element.selectionEnd;
                // save scrollTop before insert
                var restoreTop    = element.scrollTop;
                element.value    = element.value.substring(0, startPos) + value + element.value.substring(endPos, element.value.length);
                if (restoreTop > 0) {
                    // restore previous scrollTop
                    element.scrollTop = restoreTop;
                }
                element.focus();
                element.selectionStart    = startPos + value.length;
                element.selectionEnd    = startPos + value.length;
            } else {
                element.value += value;
                element.focus();
            }
        }
    }
};

// 微博展示UI
var wbui = {
    getWeiboCard: function(data, options) {
        var defaultOptions = {
            // 模式
            //   view   只读模式
            //   assign 分配模式
            //   reply  回复模式
            mode: 'view',
            // 对话记录 on打开, off关闭
            sessionRecord: 'on',
            // 选择框 on打开, off关闭
            checkbox: 'on',
            onLoadMoreCardEvent: function() {}
        };
        var opts = $.extend(defaultOptions, options);
        var fn = '';
        switch (wbui.getWeiboFromType(data.task)) {
            case 'statuses':
                fn = wbui.statuses;
                break;
            case 'retweet':
                fn = wbui.retweet;
                break;
            case 'comment':
                fn = wbui.comment;
                break;
            default:
                fn = function() {
                    return ''
                };
        }
        // parse json
        data.task.picUrls && (data.task.picUrls = $.parseJSON(data.task.picUrls));
        data.task.retweetedStatus && (data.task.retweetedStatus = $.parseJSON(data.task.retweetedStatus));
        data.task.commentStatus && (data.task.commentStatus = $.parseJSON(data.task.commentStatus));
        data.task.geo && (data.task.geo = $.parseJSON(data.task.geo));

        return fn(data, opts);
    },
    getWeiboFromType: function(task) {
        var type = '';
        switch (task.type) {
            case 'MyStatuses':
            case 'Statuses':
                type = 'statuses';
                break;
            case 'MyRetweeted':
            case 'Retweeted':
                type = 'retweet';
                break;
            case 'AtMeComments':
            case 'ToMeComments':
                type = 'comment';
                break;
            case 'Keywords':
                switch (task.subType) {
                    case 'KeywordRetweeted':
                        type = 'retweet';
                        break;
                    case 'KeywordStatuses':
                        type = 'statuses';
                        break;
                }
                break;
        }
        return type;
    },
    // 用户信息
    userHeader: function(user, options) {
        var html = '';
        html += '<div class="card-header">';
        html += '    <div class="user-block">';
        html += '        <img class="img-circle" src="{0}" alt="User Image">'.format(wb.proxyimage(user.profileImageUrl));
        html += '        <span class="username"><a target="_blank" href="{1}">{0}</a></span>'.format(user.screenName, 'https://m.weibo.cn/u/' + user.idstr);
        html += '        <span class="description">';
        html += '            关注({0})'.format(user.friendsCount);
        html += '            粉丝({0})'.format(user.followersCount);
        html += '            微博({0})'.format(user.statusesCount);
        html += '        </span>';
        html += '    </div>';
        html += '    <div class="card-tools">';
        html += '        <button type="button" class="btn btn-tool" data-toggle="tooltip" title="微博用户设置" data-action="weibo-user-settings">';
        html += '            设置备注';
        html += '        </button>';
        html += '    </div>';
        html += '</div>';
        var element = $(html);
        element.data(user);
        element.find('[data-action]').click(function() {
            var user = $(this).closest('.card-header').data();
            var action = $(this).data('action');
            switch (action) {
                // 设置备注
                case 'weibo-user-settings':
                    MDialog.openWbUserSettingsDialog({
                        idstr: user.idstr
                    });
                    break;
            }
        });

        return element;
    },
    // 来源
    weiboFrom: function(task) {
        // Unknown("Unknown", "未知"),
        // MyStatuses("MyStatuses", "我的原创"),
        // MyRetweeted("MyRetweeted", "我的转发"),
        // Retweeted("Retweeted", "转发微博"),
        // Statuses("Statuses", "原创微博"),
        //
        // AtMeComments("AtMeComments", "at我的评论"),
        // ToMeComments("ToMeComments", "评论"),
        //
        // Keywords("Keywords", "关键词"),
        // // Keyword 子类型
        // KeywordRetweeted("KeywordRetweeted", "关键词_转发微博"),
        // KeywordStatuses("KeywordStatuses", "关键词_原创微博"),
        var source = '';
        switch (task.type) {
            case 'MyStatuses':
                source = '我的原创';
                break;
            case 'MyRetweeted':
                source = '我的转发';
                break;
            case 'Retweeted':
                source = '转发微博';
                break;
            case 'Statuses':
                source = '原创微博';
                break;
            case 'AtMeComments':
                source = 'at我的评论';
                break;
            case 'ToMeComments':
                source = '评论';
                break;
            case 'Keywords':
                switch (task.subType) {
                    case 'KeywordRetweeted':
                        source = '关键词转发微博';
                        break;
                    case 'KeywordStatuses':
                        source = '关键词原创微博';
                        break;
                }
                break;
        }
        // var html = '';
        // html += '<div class="card-body" style="border-bottom: 1px dashed rgba(0,0,0,.125);">';
        // html += '    <span class="text-muted">微博唯一编号：{0}</span>'.format(task.midShort);
        // html += '    <span class="float-right text-muted">来源：{0}</span>'.format(source);
        // html += '</div>';
        return '<span class="text-muted"><i class="fas fa-tags"></i> {0}</span>'.format(source);
    },
    // 微博时间，抓取时间
    atTime: function(task) {
        // 微博时间
        if (task.pubdate) {
            return '<span class="text-muted"><i class="far fa-clock"></i> {0}</span>'.format(moment(task.pubdate).format('YYYY-MM-DD HH:mm:ss'));
        }
        // 抓取时间
        else if (task.createAt) {
            return '<span class="text-muted"><i class="far fa-clock"></i> {0}</span>'.format(moment(task.createAt).format('YYYY-MM-DD HH:mm:ss'));
        }
        return '<span class="text-muted"><i class="far fa-clock"></i> 未知</span>';
    },
    // 微博唯一编号
    uniqueMid: function(task) {
        return '<span class="text-muted"><i class="fas fa-anchor"></i> {0}</span>'.format(task.midShort);
    },
    // 分配信息
    assignInfo: function(data) {
        if (!data.manager || !data.agent) {
            return '';
        }
        if (data.agent.unwantedAssign === 'true') {
            return '<span class="text-muted"><i class="fas fa-angle-double-right"></i> {0}设置为无需分配</span>'.format(data.manager.realName);
        }
        return '<span class="text-muted"><i class="fas fa-angle-double-right"></i> {0}分配给{1}</span>'.format(data.manager.realName, data.agent.realName);
    },
    // 任务状态
    taskStatus: function(data) {
        var status = '';
        if (data.agent && data.agent.unwantedAssign === 'true') {
            // status = '无需分配';
            return '';
        }
        else if (data.status) {
            if (data.status.processResult === 1) {
                status = '已回复';
            } else if (data.status.processResult === 2) {
                status = '无需回复';
            } else {
                if ([2, 5].indexOf(data.status.assignStatus) > -1) {
                    status = '已分配';
                } else {
                    status = '未分配';
                }
            }
        }
        if (!status) {
            return '';
        }
        return '<span class="text-muted"><i class="fas fa-tasks"></i> {0}</span>'.format(status);
    },
    // 选择框
    checkbox: function(task, options) {
        if (options.checkbox === 'off') {
            return '';
        }
        var id = CreateID();
        var checkbox = '';
        checkbox += '<div class="custom-control custom-checkbox" style="float: right;">';
        checkbox += '    <input class="custom-control-input checkbox-item" type="checkbox" id="{0}" value="{1}">'.format(id, task.idstr);
        checkbox += '    <label for="{0}" class="custom-control-label" style="font-weight: 400; cursor: pointer;">选择</label>'.format(id);
        checkbox += '</div>';
        var element = $(checkbox);
        element.find('.checkbox-item')
            .data(task)
            .change(function() {
                if (!this.checked) {
                    $('.task-toolbar [data-action="select-all"]')
                        .removeClass('selected')
                        .html('批量选择');
                }
            });
        return element;
    },
    // 照片内容，视频内容
    mediaBody: function(task) {
        var body = $('<div/>');

        if (task.picUrls && task.picUrls.length) {
            // 多张图片
            var picUrls = task.picUrls;
            var rowSize = 3;
            if (picUrls.length === 4) {
                rowSize = 2;
            }
            var picUrlsElement = $('<div/>');
            var row = null;
            picUrls.forEach(function(pic, idx) {
                if (!row || idx % rowSize === 0) {
                    row = $('<div class="wb-image-container type-image-4"/>').appendTo(picUrlsElement);
                }
                // /api/resource/image/proxy?url=http%3A%2F%2Fwx3.sinaimg.cn%2Fthumb150%2F9d28c723gy1gd4xmw3sg9j23402c0b29.jpg
                var url = wb.proxythumb150(pic.thumbnail_pic);
                var html = '';
                html += '<div class="wb-image-inner">';
                html += '    <div>';
                html += '        <img src="{0}">'.format(url);
                html += '    </div>';
                html += '</div>';
                row.append(html);
            });
            body.append(picUrlsElement);
        } else if (task.thumbnailPic || task.thumbnail_pic) {
            var thumbnail = task.thumbnailPic || task.thumbnail_pic;
            // 单张图片
            var url = wb.proxythumb150(thumbnail);
            var html = '';
            html += '<div class="wb-image-container">';
            html += '    <div class="wb-image-inner">';
            html += '        <div>';
            html += '            <img src="{0}">'.format(url);
            html += '        </div>';
            html += '    </div>';
            html += '</div>';
            body.append(html);
        }
        return body;
    },
    // 操作栏
    toolsbar: function(data, options) {
        var html = '';
        html += '<div class="card-body toolsbar" style="border-top: 1px dashed rgba(0,0,0,.125);">';
        html += '    <div class="btn-group float-sm-left">';
        html += '        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="original-weibo">微博原文</button>';
        if (options.sessionRecord === 'on') {
            html += '        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="session-record">对话记录</button>';
        }
        // html += '        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80 dropdown-toggle dropdown-icon"';
        // html += '            data-toggle="dropdown" aria-expanded="false">';
        // html += '            添加到';
        // html += '            <div class="dropdown-menu" role="menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-1px, 37px, 0px);">';
        // html += '                <a class="dropdown-item" href="#" data-action="follow-user">关注用户</a>';
        // html += '                <a class="dropdown-item" href="#" data-action="follow-content">关注内容</a>';
        // html += '            </div>';
        // html += '        </button>';
        html += '    </div>';
        html += '    <div class="btn-group float-sm-right">';
        if (options.mode === 'assign') {
            html += '<button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="assign-unwanted">无需分配</button>';
            html += '<button type="button" class="btn btn-outline-secondary btn-xs btn-width-80 dropdown-toggle dropdown-icon" data-action="assign" data-toggle="dropdown" aria-expanded="false">';
            html += '    立即分配 <span class="sr-only">Toggle Dropdown</span>';
            html += '    <div class="dropdown-menu" role="menu" x-placement="bottom-start">';
            // html += '        <a class="dropdown-item" href="#">无需分配</a>';
            html += '    </div>';
            html += '</button>';
        } else if (options.mode === 'reply') {
            html += '<button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="reply-unwanted">无需回复</button>';
            html += '<button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="reply">立即回复</button>';
        }
        html += '    </div>';
        html += '</div>';
        var elements = $(html).data(data);
        elements.attr('data-idstr', data.task.idstr);
        elements.attr('data-userIdstr', data.task.userIdstr);
        elements.find('[data-action]').click(function() {
            var thatElement = $(this);
            var data = thatElement.closest('.toolsbar').data();
            var action = thatElement.data('action');
            switch (action) {
                // 无需分配
                case 'assign-unwanted':
                    var idstr = thatElement.closest('.toolsbar').data('idstr');
                    apis.batchUnwantedTask([idstr])
                        .then(function(response) {
                            var card = $('.card-widget[data-idstr="{0}"]'.format(idstr));
                            card.slideUp(160, function() {
                                card.remove();
                                options.onLoadMoreCardEvent();
                            })
                        });
                    break;
                // 分配
                case 'assign':
                    apis.getOnlineAgents()
                        .then(function(response) {
                            var onlineAgents = response.data;
                            var dropdownElement = $('.dropdown-menu', thatElement).empty();
                            $('<a class="dropdown-item" href="#" data-unwanted="true">无需分配</a>').appendTo(dropdownElement);
                            $('<div class="dropdown-divider"></div>').appendTo(dropdownElement);
                            // $('<a class="dropdown-item" href="#"><i style="color: grey;">自动分配</i></a>').appendTo(dropdownElement);
                            // $('<div class="dropdown-divider"></div>').appendTo(dropdownElement);
                            onlineAgents.forEach(function (agent) {
                                $('<a class="dropdown-item" href="#" data-unwanted="false"/>')
                                    .attr('data-username', agent.userName)
                                    .html('{0} ({1})'.format(agent.realName, agent.userName))
                                    .appendTo(dropdownElement);
                            });
                            if (onlineAgents.length === 0) {
                                $('<a class="dropdown-item" href="#"/>')
                                    .html('<i style="color: grey;">暂无客服在线</i>')
                                    .appendTo(dropdownElement);
                            }
                            dropdownElement.find('.dropdown-item').click(function() {
                                var isUnwanted = $(this).data('unwanted');
                                var userName   = $(this).data('username');
                                var idstr      = $(this).closest('.toolsbar').data('idstr');
                                console.log(isUnwanted, userName, idstr);
                                var fn = apis.batchAssignTask;
                                if (isUnwanted === true) {
                                    fn = apis.batchUnwantedTask;
                                }
                                fn([idstr], userName)
                                    .then(function(response) {
                                        var card = $('.card-widget[data-idstr="{0}"]'.format(idstr));
                                        card.slideUp(160, function() {
                                            card.remove();
                                            options.onLoadMoreCardEvent();
                                        })
                                    });
                                return false;
                            });
                        });
                    break;
                // 回复
                case 'reply':
                    var replyboxElement = thatElement.closest('.card').find('.replybox');
                    if (replyboxElement.is(':hidden')) {
                        replyboxElement.slideDown();
                    }
                    break;
                // 无需回复
                case 'reply-unwanted':
                    var idstr = thatElement.closest('.toolsbar').data('idstr');
                    apis.batchUnwantedReply([idstr])
                        .then(function(response) {
                            var card = $('.card-widget[data-idstr="{0}"]'.format(idstr));
                            card.slideUp(160, function() {
                                card.remove();
                                options.onLoadMoreCardEvent();
                            })
                        });
                    break;
                // 对话记录
                case 'session-record':
                    var timelineElement = thatElement.closest('.card').find('.direct-chat-messages')
                    if (timelineElement.is(':hidden')) {
                        timelineElement.empty();
                        var task = thatElement.closest('.card').data();
                        console.log('task', task);
                        var statusesIdstr = null;
                        var commentsIdstr = null;
                        switch (task.type) {
                            case 'MyStatuses':
                            case 'MyRetweeted':
                            case 'Retweeted':
                            case 'Statuses':
                            case 'Keywords':
                                statusesIdstr = task.idstr;
                                break;
                            case 'AtMeComments':
                            case 'ToMeComments':
                                commentsIdstr = task.idstr;
                                break;
                        }
                        apis.getTimelineReply(statusesIdstr, commentsIdstr)
                            .then(function(response) {
                                var systemUserIdstr = WApp.getPropSystemUserIdstr();
                                var list = response.data;
                                list.forEach(function(item) {
                                    if (!item.comments) {
                                        return;
                                    }
                                    var html = '';
                                    html += '    <div class="direct-chat-msg">';
                                    html += '        <div class="direct-chat-infos clearfix">';
                                    html += '            <span class="direct-chat-name float-left">{0}</span>'.format(item.user.screenName);
                                    html += '            <span class="direct-chat-timestamp float-right">{0}</span>'.format(moment(item.comments.pubdate).format('YYYY/MM/DD HH:mm:ss'));
                                    html += '        </div>';
                                    html += '        <img class="direct-chat-img" src="{0}" alt="message user image">'.format(wb.proxyimage(item.user.profileImageUrl));
                                    html += '        <div class="direct-chat-text">';
                                    html += '            ' + item.comments.text;
                                    html += '        </div>';
                                    html += '    </div>';
                                    var msgElement = $(html);
                                    if (item.user.idstr === systemUserIdstr) {
                                        msgElement.addClass('right');
                                    }
                                    timelineElement.append(msgElement);
                                });
                                if (timelineElement.find('.direct-chat-msg').length === 0) {
                                    var html = '';
                                    html += '    <div class="direct-chat-msg" style="text-align: center; margin-bottom: 0px;">';
                                    html += '        <i>暂无对话记录</i>';
                                    html += '    </div>';
                                    timelineElement.append(html);
                                }
                                timelineElement.slideDown('slow');
                            });
                    } else {
                        timelineElement.slideUp();
                    }
                    break;
                // 微博原文
                case 'original-weibo':
                    var user = data.task.idstr;
                    var weiboid = data.task.idstr;
                    if (data.task.commentStatus) {
                        user = data.task.commentStatus.user.id;
                        weiboid = data.task.commentStatus.idstr;
                    }
                    // wbui.plugin.virtual.browser.target({
                    //     title: '微博原文',
                    //     url: 'https://m.weibo.cn/detail/' + id
                    // });
                    // window.open('https://m.weibo.cn/detail/' + id);
                    // window.open('https://weibo.com/{0}/{1}'.format(data.user.idstr, data.task.midShort));
                    var url = 'https://weibo.com/{0}/{1}'.format(user, wb.id2mid(weiboid));
                    window.open(url);
                    break;
            }
        });
        return elements;
    },
    // 对话记录
    timeline: function(data, options) {
        var html = '';
        html += '<div class="direct-chat-messages direct-chat-warning" style="border-top: 1px dashed rgba(0,0,0,.125); display: none;">';
        html += '    <div class="direct-chat-msg">';
        html += '        <div class="direct-chat-infos clearfix">';
        html += '            <span class="direct-chat-name float-left">Alexander Pierce</span>';
        html += '            <span class="direct-chat-timestamp float-right">23 Jan 2:00 pm</span>';
        html += '        </div>';
        html += '        <img class="direct-chat-img" src="/api/resource/image/proxy?url=https%3A%2F%2Ftvax1.sinaimg.cn%2Fcrop.0.0.996.996.180%2F6b948f49ly8gdiva7fk2uj20ro0rowha.jpg%3FKID%3Dimgbed%2Ctva%26Expires%3D1587987333%26ssig%3D0Fwva%252BedXi" alt="message user image">';
        html += '        <div class="direct-chat-text">';
        html += '            Is this template really for free? That';
        html += '        </div>';
        html += '    </div>';
        html += '    <div class="direct-chat-msg right">';
        html += '        <div class="direct-chat-infos clearfix">';
        html += '            <span class="direct-chat-name float-right">Sarah Bullock</span>';
        html += '            <span class="direct-chat-timestamp float-left">23 Jan 2:05 pm</span>';
        html += '        </div>';
        html += '        <img class="direct-chat-img" src="/api/resource/image/proxy?url=https%3A%2F%2Ftvax1.sinaimg.cn%2Fcrop.0.0.996.996.180%2F6b948f49ly8gdiva7fk2uj20ro0rowha.jpg%3FKID%3Dimgbed%2Ctva%26Expires%3D1587987333%26ssig%3D0Fwva%252BedXi" alt="message user image">';
        html += '        <div class="direct-chat-text">';
        html += '            You better believe it!';
        html += '        </div>';
        html += '    </div>';
        html += '</div>';
        var element = $(html);
        return element;
    },
    // 回复框
    replyBox: function(data, options) {
        var html = '';
        html += '<div class="card-footer replybox" style="display: none;">';
        html += '	<form onsubmit="return false">';
        html += '		<img class="img-fluid img-circle img-sm" src="{0}">'.format(WApp.getPropSystemUserImg());
        html += '		<div class="img-push">';
        html += '			<textarea name="replyContent" class="form-control form-control-sm" placeholder="回复内容" rows="5"></textarea>';
        html += '		    <div style="margin-top: 10px;">';
        html += '		        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="insert-emoji">插入表情</button>';
        html += '		        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="fast-reply">快捷回复</button>';
        html += '		        <button type="button" class="btn btn-secondary btn-xs btn-width-80" style="float: right;" data-action="send-reply">发送</button>';
        html += '		    </div>';
        html += '		</div>';
        html += '	</form>';
        html += '</div>';
        var elements = $(html);
        elements.data(data);
        elements.find('[data-action]').click(function() {
            var thatElement = $(this);
            var data = thatElement.closest('.replybox').data();
            var action = thatElement.data('action');
            switch (action) {
                // 插入表情
                case 'insert-emoji':

                    thatElement.parent().find('.card-quickreply-box').fadeOut(180);

                    if (thatElement.parent().find('.card-face-box').length) {
                        thatElement.parent().find('.card-face-box').fadeIn(180);
                        return;
                    }

                    var emojiCard = '';
                    emojiCard += '<div class="card card-primary card-outline card-face-box">';
                    emojiCard += '<div class="card-header">';
                    emojiCard += '  <h3 class="card-title">微博表情</h3>';
                    emojiCard += '  <div class="card-tools">';
                    emojiCard += '    <button type="button" class="btn btn-tool btn-face-card-remove"><i class="fas fa-times"></i>';
                    emojiCard += '    </button>';
                    emojiCard += '  </div>';
                    emojiCard += '</div>';
                    emojiCard += '  <div class="card-body pad">';
                    // emojiCard += '    <div class="face-inner">';
                    // emojiCard += '      <img src="http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/2018new_weixioa02_org.png" />';
                    // emojiCard += '    </div>';
                    emojiCard += '  </div>';
                    emojiCard += '</div>';
                    var emojiCardElements = $(emojiCard);
                    emojiCardElements.find('.btn-face-card-remove').click(function() {
                        $(this).closest('.card-face-box').fadeOut(180);
                    });

                    var position = thatElement.position();
                    emojiCardElements.css('position', 'absolute');
                    emojiCardElements.css('top', position.top + 26);
                    emojiCardElements.css('left', position.left);
                    emojiCardElements.css('width', '400px');
                    emojiCardElements.css('height', '300px');
                    emojiCardElements.css('z-index', '99999');

                    thatElement.parent().append(emojiCardElements);

                    var returnEmotions = function(emotions) {

                        var emojiBody = emojiCardElements.find('.card-body');
                        emotions.forEach(function(emoji) {
                            if (['face'/*, 'ani'*/].indexOf(emoji.type) === -1) {
                                return;
                            }
                            var face = $('<div class="face-inner"><img src="{0}" onerror="$(this).parent().remove()" /></div>'.format(wb.proxyimage(emoji.icon)))
                                .data(emoji)
                                .appendTo(emojiBody);
                            face.click(function() {
                                var emoji = $(this).data();
                                console.log(emoji);
                                var textareaElement = thatElement.closest('.card').find('textarea[name="replyContent"]')[0];
                                wb.textarea.insert(textareaElement, emoji.phrase);
                            });
                        })
                    };

                    if (wbcache.emotions) {
                        returnEmotions(wbcache.emotions);
                    } else {
                        apis.emotions()
                            .then(function (response) {
                                var emotions = response.data;
                                wbcache.emotions = emotions;
                                returnEmotions(wbcache.emotions);
                            });
                    }

                    break;
                // 快捷回复
                case 'fast-reply':
                    thatElement.parent().find('.card-face-box').fadeOut(180);

                    if (thatElement.parent().find('.card-quickreply-box').length) {
                        thatElement.parent().find('.card-quickreply-box').fadeIn(180);
                        return;
                    }

                    var emojiCard = '';
                    emojiCard += '<div class="card card-primary card-outline card-quickreply-box">';
                    emojiCard += '<div class="card-header">';
                    emojiCard += '  <h3 class="card-title">快速回复</h3>';
                    emojiCard += '  <div class="card-tools">';
                    emojiCard += '    <button type="button" class="btn btn-tool btn-quickreply-card-remove"><i class="fas fa-times"></i>';
                    emojiCard += '    </button>';
                    emojiCard += '  </div>';
                    emojiCard += '</div>';
                    emojiCard += '  <div class="card-body pad" style="padding: 10px;">';

                    emojiCard += '  </div>';
                    emojiCard += '</div>';
                    var emojiCardElements = $(emojiCard);
                    emojiCardElements.find('.btn-quickreply-card-remove').click(function() {
                        $(this).closest('.card-quickreply-box').fadeOut(180);
                    });

                    var position = thatElement.position();
                    emojiCardElements.css('position', 'absolute');
                    emojiCardElements.css('top', position.top + 26);
                    emojiCardElements.css('left', position.left);
                    emojiCardElements.css('width', '400px');
                    emojiCardElements.css('height', '300px');
                    emojiCardElements.css('z-index', '99999');

                    thatElement.parent().append(emojiCardElements);

                    var returnQuickreplys = function(list) {

                        var listBody = emojiCardElements.find('.card-body');
                        list.forEach(function(item) {
                            var itemElement = $('<div class="quickreply-inner">{0}</div>'.format(item.associate))
                                .data(item)
                                .appendTo(listBody);
                            itemElement.click(function() {
                                var item = $(this).data();
                                console.log(item);
                                var textareaElement = thatElement.closest('.card').find('textarea[name="replyContent"]')[0];
                                wb.textarea.insert(textareaElement, item.text);
                                thatElement.parent().find('.card-quickreply-box').fadeOut(180);
                            });
                        })
                    };

                    if (wbcache.quickreplys) {
                        returnQuickreplys(wbcache.quickreplys);
                    } else {
                        apis.quickreplys()
                            .then(function (response) {
                                var list = response.data;
                                wbcache.quickreplys = list;
                                returnQuickreplys(wbcache.quickreplys);
                            });
                    }

                    break;
                // 发送
                case 'send-reply':
                    // Unknown("Unknown", "未知"),
                    // MyStatuses("MyStatuses", "我的原创"),
                    // MyRetweeted("MyRetweeted", "我的转发"),
                    // Retweeted("Retweeted", "转发微博"),
                    // Statuses("Statuses", "原创微博"),
                    //
                    // AtMeComments("AtMeComments", "at我的评论"),
                    // ToMeComments("ToMeComments", "评论"),
                    //
                    // Keywords("Keywords", "关键词"),
                    // // Keyword 子类型
                    // KeywordRetweeted("KeywordRetweeted", "关键词_转发微博"),
                    // KeywordStatuses("KeywordStatuses", "关键词_原创微博"),
                    var api = null;
                    switch (data.task.type) {
                        case 'MyStatuses':
                        case 'MyRetweeted':
                        case 'Retweeted':
                        case 'Statuses':
                            api = apis.replyStatuses;
                            break;
                        case 'Keywords':
                        case 'KeywordRetweeted':
                        case 'KeywordStatuses':
                            api = apis.replyStatuses;
                            break;
                        case 'AtMeComments':
                        case 'ToMeComments':
                            api = apis.replyComments;
                            break;
                    }

                    var textareaElement = thatElement.closest('.card').find('textarea[name="replyContent"]');
                    textareaElement.attr('readonly', true);
                    thatElement.attr('disabled', true);
                    wbui.plugin.fastoast({
                        icon: 'info',
                        title: '正在处理',
                        timer: 0,
                    });
                    var taskId = data.task.id;
                    var comment = textareaElement.val();
                    api(taskId, comment)
                        .then(function(response) {
                            textareaElement.val('');
                            textareaElement.removeAttr('readonly');
                            thatElement.removeAttr('disabled');
                            wbui.plugin.fastoast({
                                icon: 'success',
                                title: '处理结束'
                            });

                            var card = textareaElement.closest('.card');
                            card.slideUp(160, function() {
                                card.remove();
                                options.onLoadMoreCardEvent();
                            })
                        });

                    break;
            }
        });
        return elements;
    },
    // 原创微博
    statuses: function(data, options) {
        console.log('原创微博', data);
        var container = $('<div class="card card-widget"/>');
        container.attr('data-idstr', data.task.idstr);
        container.data(data.task);
        // 用户信息
        container.append(wbui.userHeader(data.user, options));

        // 微博信息
        var body = $('<div class="card-body"/>').appendTo(container);
        body.append(wbui.checkbox(data.task, options));
        var wbContainer = $('<div class="wb-container"/>').appendTo(body);
        wbContainer.append('<div class="wb-text">{0}</div>'.format(data.task.text));
        wbContainer.append(wbui.mediaBody(data.task));

        // 微博时间, 抓取时间
        body.append(wbui.atTime(data.task));

        // 来源
        body.append(wbui.weiboFrom(data.task));

        // 微博唯一编号
        body.append(wbui.uniqueMid(data.task));

        // 分配信息
        body.append(wbui.assignInfo(data));

        // 任务状态
        body.append(wbui.taskStatus(data));

        // 操作栏
        container.append(wbui.toolsbar(data, options));

        // 对话记录
        container.append(wbui.timeline(data, options));

        // 回复框
        container.append(wbui.replyBox(data, options));

        return container;
    },
    // 转发微博
    retweet: function(data, options) {
        console.log('转发微博', data);
        var container = $('<div class="card card-widget"/>');
        container.attr('data-idstr', data.task.idstr);
        container.data(data.task);
        // 用户信息
        container.append(wbui.userHeader(data.user, options));

        // 微博信息
        var body = $('<div class="card-body"/>').appendTo(container);
        body.append(wbui.checkbox(data.task, options));
        var wbContainer = $('<div class="wb-container"/>').appendTo(body);
        wbContainer.append('<div class="wb-text">{0}</div>'.format(data.task.text));

        var retweetTask = data.task.retweetedStatus;
        var retweetContainer = $('<div class="wb-container wb-container-retweet"/>').appendTo(wbContainer);

        retweetContainer.append('<div class="wb-text">{0}</div>'.format(retweetTask.text));
        retweetContainer.append(wbui.mediaBody(retweetTask));

        // 微博时间, 抓取时间
        body.append(wbui.atTime(data.task));

        // 来源
        body.append(wbui.weiboFrom(data.task));

        // 微博唯一编号
        body.append(wbui.uniqueMid(data.task));

        // 分配信息
        body.append(wbui.assignInfo(data));

        // 任务状态
        body.append(wbui.taskStatus(data));

        // 操作栏
        container.append(wbui.toolsbar(data, options));

        // 对话记录
        container.append(wbui.timeline(data, options));

        // 回复框
        container.append(wbui.replyBox(data, options));

        return container;
    },
    // 微博评论
    comment: function(data, options) {
        console.log('微博评论', data);
        var container = $('<div class="card card-widget"/>');
        container.attr('data-idstr', data.task.idstr);
        container.data(data.task);
        // 用户信息
        container.append(wbui.userHeader(data.user, options));

        // 微博信息
        var body = $('<div class="card-body"/>').appendTo(container);
        body.append(wbui.checkbox(data.task, options));
        var wbContainer = $('<div class="wb-container"/>').appendTo(body);
        wbContainer.append('<div class="wb-text">{0}</div>'.format(data.task.text));

        var commentTask = data.task.commentStatus;
        var commentContainer = $('<div class="wb-container wb-container-retweet"/>').appendTo(wbContainer);

        commentContainer.append('<div class="wb-text">{0}</div>'.format(commentTask.text));
        commentContainer.append(wbui.mediaBody(commentTask));

        // 微博时间, 抓取时间
        body.append(wbui.atTime(data.task));

        // 来源
        body.append(wbui.weiboFrom(data.task));

        // 微博唯一编号
        body.append(wbui.uniqueMid(data.task));

        // 分配信息
        body.append(wbui.assignInfo(data));

        // 任务状态
        body.append(wbui.taskStatus(data));

        // 操作栏
        container.append(wbui.toolsbar(data, options));

        // 对话记录
        container.append(wbui.timeline(data, options));

        // 回复框
        container.append(wbui.replyBox(data, options));

        return container;
    },

    // 插件
    plugin: {
        // 手机浏览模拟器，微博官网显示组件
        virtual: {
            browser: {
                instance: null,
                instanceIframe: null,
                build: function() {
                    if (wbui.plugin.virtual.browser.instanceIframe) {
                        return;
                    }
                    var html = '';
                    html += '<div class="plugin-virtual-browser">';
                    html += '    <div>';
                    html += '        <iframe src="/pages/plugins/virtual-browser.html"></iframe>';
                    html += '        <div class="browser-navbar">';
                    html += '            <span class="title"></span>';
                    html += '            <span class="close">';
                    html += '                <i class="nav-icon fab fa-slack"></i>';
                    html += '            </span>';
                    html += '        </div>';
                    html += '    </div>';
                    html += '</div>';
                    var browser = $(html);
                    wbui.plugin.virtual.browser.instance = browser;
                    var iframe = browser.find('iframe')[0];
                    wbui.plugin.virtual.browser.instanceIframe = iframe;
                    browser.appendTo('body');
                    browser.hide();
                    var onload = function() {
                        console.log('页面加载完成', iframe.src);
                        // $(iframe.contentWindow.document).find('.nav-left').remove();
                    };
                    if (iframe.attachEvent) {
                        iframe.attachEvent("onload", onload);
                    } else {
                        iframe.onload = onload;
                    }
                    browser.find('.close').click(function() {
                        wbui.plugin.virtual.browser.close();
                    });
                },
                open: function() {
                    if (!wbui.plugin.virtual.browser.instanceIframe) {
                        wbui.plugin.virtual.browser.build();
                    }
                    wbui.plugin.virtual.browser.instance.fadeIn(150);
                },
                close: function() {
                    if (!wbui.plugin.virtual.browser.instanceIframe) {
                        wbui.plugin.virtual.browser.build();
                    }
                    wbui.plugin.virtual.browser.instanceIframe.src = '/pages/plugins/virtual-browser.html';
                    wbui.plugin.virtual.browser.instance.fadeOut(150);
                },
                target: function(options) {
                    var defaultOptions = {
                        utl: '',
                        title: ''
                    };
                    var opts = $.extend(defaultOptions, options);
                    if (!wbui.plugin.virtual.browser.instanceIframe) {
                        wbui.plugin.virtual.browser.build();
                        wbui.plugin.virtual.browser.open();
                        wbui.plugin.virtual.browser.instance.find('.title').html('正在加载');
                        setTimeout(function() {
                            wbui.plugin.virtual.browser.instanceIframe.src = opts.url;
                            wbui.plugin.virtual.browser.instance.find('.title').html(opts.title);
                        }, 300);
                    } else {
                        wbui.plugin.virtual.browser.open();
                        wbui.plugin.virtual.browser.instance.find('.title').html('正在加载');
                        setTimeout(function() {
                            wbui.plugin.virtual.browser.instanceIframe.src = opts.url;
                            wbui.plugin.virtual.browser.instance.find('.title').html(opts.title);
                        }, 300);
                    }
                }
            }
        },

        // // 提示框
        // toast: Swal.mixin({
        //     toast: false,
        //     icon: 'success',
        //     // position: 'top-end',
        //     showConfirmButton: false,
        //     timer: 1500,
        //     timerProgressBar: true,
        //     onOpen: function (toast) {
        //         toast.addEventListener('mouseenter', Swal.stopTimer)
        //         toast.addEventListener('mouseleave', Swal.resumeTimer)
        //     }
        // }),

        // 提示框
        fastoast: function (options) {
            var defaultSettings = {
                icon: 'info',
                title: '正在处理',
                timer: 1500,
                onClose: function () {

                }
            };
            var opts = $.extend(defaultSettings, options);
            var mask = $('.fastoast-mask');
            var ins;
            if (mask.length) {
                ins = $('.fastoast');
            } else {
                var html = '';
                html += '<div class="fastoast-mask" style="display: none;">';
                html += '    <div class="fastoast">';
                html += '        <div class="fastoast-inner">';
                html += '            <div class="fastoast-icon">';
                html += '                <span class="fas fa-info-circle"></span>';
                html += '            </div>';
                html += '            <div class="fastoast-text">';
                html += '                正在处理';
                html += '            </div>';
                html += '        </div>';
                html += '    </div>';
                html += '</div>';
                $('body').append(html);
                mask = $('.fastoast-mask');
                ins = $('.fastoast');
            }

            var iconMap = {
                // 信息
                // <span class="fas fa-info-circle"></span>
                'info': 'fas fa-info-circle',
                // 发送
                // <span class="fas fa-paper-plane"></span>
                // <span class="fas fa-arrow-circle-up"></span>
                'send': 'fas fa-arrow-circle-up',
                // 下载
                // <span class="fas fa-arrow-circle-down"></span>
                // <span class="fas fa-file-download"></span>
                'download': 'fas fa-file-download',
                // 打包
                // <span class="fas fa-save"></span>
                'package': 'fas fa-save',
                // 保存
                // <span class="fas fa-file-archive"></span>
                'save': 'fas fa-file-archive',
                // 成功
                // <span class="fas fa-check-circle"></span>
                'success': 'fas fa-check-circle',
                // 失败
                // <span class="fas fa-times-circle"></span>
                'fail': 'fas fa-times-circle',
                // 警告
                // <span class="fas fa-exclamation-circle"></span>
                // <span class="fas fa-exclamation-triangle"></span>
                'warn': 'fas fa-exclamation-circle',
                // 移除
                // <span class="fas fa-trash-alt"></span>
                'remove': 'fas fa-trash-alt',
                // 加入购物车
                // <span class="fas fa-cart-arrow-down"></span>
                'cartdown': 'fas fa-cart-arrow-down',
                // 成功
                // <span class="fas fa-laugh-wink"></span>
                'success2': 'fas fa-laugh-wink',
                // 发生错误
                // <span class="fas fa-sad-tear"></span>
                'error': 'fas fa-sad-tear',
                // 正在维修
                // <span class="fas fa-cogs"></span>
                'setting': 'fas fa-cogs',
            };
            ins.find('.fastoast-icon > span').attr('class', iconMap[opts.icon]);
            ins.find('.fastoast-text').html(opts.title);
            mask.fadeIn('fast');

            if (opts.timer > 0) {
                setTimeout(function () {
                    mask.fadeOut('fast');
                    opts.onClose();
                }, opts.timer);
            }

            return {
                close: function() {
                    mask.fadeOut('fast');
                }
            };
        }
    }
};

var commonui = {
    pagination: function(options) {
        var defaultOptions = {
            // horizontal 横向
            // vertical 纵向
            style: 'horizontal',
            pageIndex: 0,
            pageSize: 10,
            totalSize: 0,
            clickCallback: function(index) { }
        };
        var opts = $.extend(defaultOptions, options);
        opts.totalSize = opts.totalSize ? opts.totalSize : 1;
        var page = Math.floor(opts.totalSize / opts.pageSize) + ((opts.totalSize % opts.pageSize) > 0 ? 1 : 0);

        var pIndex = opts.pageIndex;
        var sliceBegin = pIndex - 5;
        var sliceEnd = pIndex + 5 + 1;
        var maxIndex = page - 1;

        if (sliceBegin < 0) {
            sliceEnd += Math.abs(sliceBegin);
            sliceBegin = 0;
        }

        var list = [];
        for (var i = 0 ; i < page ; ++ i) {
            list.push(i);
        }

        // console.log('pagination info:', 'opts', opts);
        // console.log('pagination info:', 'page', page);
        // console.log('pagination info:', 'pIndex', pIndex);
        // console.log('pagination info:', 'sliceBegin', sliceBegin);
        // console.log('pagination info:', 'sliceEnd', sliceEnd);

        var element = $('<div/>');
        var element1 = null;
        var element2 = null;
        var element3 = null;
        switch (opts.style) {
            case 'vertical':
                element1 = $('<div class="btn-group-vertical btn-block"/>').appendTo(element);
                element2 = $('<div class="btn-group-vertical btn-block"/>').appendTo(element);
                element3 = $('<div class="btn-group-vertical btn-block"/>').appendTo(element);
                break;
            case 'horizontal':
            default:
                element1 = $('<div class="btn-group"/>').css('margin-right', '6px').appendTo(element);
                element2 = $('<div class="btn-group"/>').css('margin-right', '6px').appendTo(element);
                element3 = $('<div class="btn-group"/>').css('margin-right', '6px').appendTo(element);
                break;
        }

        element1.append('<button type="button" class="btn btn-block btn-warning" data-index="0">首页</button>');
        element1.append(
            $('<button type="button" class="btn btn-block btn-warning">上一页</button>')
                .attr('data-index', (function() {
                    if (opts.pageIndex - 1 < 0) {
                        return 0;
                    }
                    return opts.pageIndex - 1;
                })())
        );
        list.slice(sliceBegin, sliceEnd).forEach(function(m, i) {
            if (m === opts.pageIndex) {
                element2.append(
                    $('<button type="button" class="btn btn-block btn-success" style="font-weight: bold;"/>')
                        .attr('data-index', m)
                        .html(m + 1)
                );
            } else {
                element2.append(
                    $('<button type="button" class="btn btn-block btn-default"/>')
                        .attr('data-index', m)
                        .html(m + 1)
                );
            }
        });

        element3.append(
            $('<button type="button" class="btn btn-block btn-warning">下一页</button>')
                .attr('data-index', (function() {
                    if (opts.pageIndex + 1 > maxIndex) {
                        return -1;
                    }
                    return opts.pageIndex + 1;
                })())
        );

        if (opts.pageIndex < maxIndex) {
            element3.append(
                $('<button type="button" class="btn btn-block btn-warning">尾页</button>')
                    .attr('data-index', (function() {
                        return maxIndex;
                    })())
            );
        } else {
            element3.append(
                $('<button type="button" class="btn btn-block btn-warning">尾页</button>')
                    .attr('data-index', -1)
            );
        }

        if (opts.style === 'horizontal') {
            $('button', element).removeClass('btn-block');
        }

        $('button', element).click(function(e) {
            var index = $(this).data('index');
            console.log('pagination index:', index);
            if (index == -1) {
                return;
            }
            opts.clickCallback(index);
        });
        return element;
    }
};


























// Source: dependencies/cmspy/js/wssdk.js
//客户端API从这里开始
function WSClient() {
    this.socket = null;
    this.events = {};
}

WSClient.prototype.connect = function(options) {
    var defaultSetting = {
        username: "",
        callback: function(event, data) {
            console.log('response', event, data);
        }
    };
    var opts = $.extend(defaultSetting, options);
    var that = this;

    var cid = uuid().replace(/-/g, '');

    var url = ['{0}//{1}'.format(location.protocol, location.host)];
    if (location.port) {
        url.push(':' + location.port);
    }
    url.push('?cid=' + cid);
    url.push('&username=' + opts.username);

    that.socket = io.connect(url.join(''));
    var socket = that.socket;

    if (socket != null) {
        socket.on('connect', function(data) {
            opts.callback('connect', data);
        });

        socket.on('connected', function(data) {
            opts.callback('connected', data);
        });

        socket.on('messagereply', function(data) {
            opts.callback('messagereply', data);
        });

        socket.on('message', function(data) {
            var callback = that.events[data.event];
            if (callback) {
                callback(data);
            } else {
                opts.callback('message', data);
            }
        });
    }
};

WSClient.prototype.sendEvent = function(event, message) {
    var socket = this.socket;
    console.log('sendEvent', event, message);
    socket.emit(event, message);
};

WSClient.prototype.sendEventMessage = function(event, data) {
    this.sendEvent('message', {
        event: event,
        data: $.toJSON(data),
        time: Date.now()
    });
};

WSClient.prototype.seeEvent = function() {
    for (var event in this.events) {
        console.log('event', event);
    }
};

WSClient.prototype.onEvent = function(event, callback) {
    this.events[event] = callback;
};

/**
 * 通知客服，有新的任务分配
 */
WSClient.prototype.onEventTaskAssign = function(callback) {
    this.onEvent('task.assign', callback);
};

/**
 * 通知客服，微博回复结果
 */
WSClient.prototype.onEventTaskReplyResponse = function(callback) {
    this.onEvent('task.reply.response', callback);
};

/**
 * 通知经理，客服上线
 */
WSClient.prototype.onEventAgentOnline = function(callback) {
    this.onEvent('agent.online', callback);
};
// Source: dependencies/cmspy/js/fcloud-upload.js
(function($) {
$.fn.FCloudUpload = function (options) {
        var settings = {
            id: '',
            url: 'upload',
            autoUpload: true,   // 自动上传
    	    multipart: true,    // 多文件上传
//    	    uploadedBytes: 10240, // 限制文件大小byte
//          messages: {        // 消息设置
//              uploadedBytes: 'Uploaded bytes exceed file size' // 文件限制超出消息
//          },
            upload: function(data) {/* data.submit(); */},
            onFormData: function (form) {return form.serializeArray();},
            onChange: function (e, data) {},
            onAppend: function (e, data, uniqueId, file) {},
            onProgress: function (e, data, uniqueId, file, progress) {},
            onProgressAll: function (e, data, progress) {},
            onDoneAll: function (e, data) {},
            onDone: function (e, data, uniqueId, file, response_data) {},
            onFail: function (e, data) {},
            onAlways: function (e, data) {},
        };

    	var onChangeTime = 0;
    	var onProgress = 0;

        var core = {
            elementSelf: null,
            create: function(element) {
                core.elementSelf = element;
                core.init(element);
            },
            init: function(element) {

                var fileSelect = $(element).fileupload({
                    url: settings.url,
                	multipart: settings.multipart,
                	autoUpload: settings.autoUpload,
                    dataType: 'json',
                    formData: function (form) {
//                        // return form.serializeArray();
//                    	return $('#DataForm').serializeArray();
                        return settings.onFormData(form);
                    },
                    change: function (e, data) {
                    	onChangeTime = Date.now();
                    	onProgress = 0;
                        settings.onChange(e, data);
                    },
                    add: function (e, data) {

                        if (e.isDefaultPrevented()) {
                            return false;
                        }

                        var files = data.files;
                        for (var i in files) {
                            var file = files[i];
                            var uniqueId = 'hc' + onChangeTime + file.lastModified + javaHashCode(file.name);
                            settings.onAppend(e, data, uniqueId, file);
                        }

                        if (data.autoUpload || (data.autoUpload !== false &&
                                $(this).fileupload('option', 'autoUpload'))) {
                            data.process().done(function () {
                                data.submit();
                            });
                        } else {
                            data.process().done(function () {
                                if (settings.upload) {
                                    settings.upload(data);
                                }
                            });
                        }

                    },
                    progress: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        var files = data.files;
                        for (var i in files) {
                            var file = files[i];
                            var uniqueId = 'hc' + onChangeTime + file.lastModified + javaHashCode(file.name);
                            settings.onProgress(e, data, uniqueId, file, progress);
                        }
                    },
                    progressall: function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        settings.onProgressAll(e, data, progress);
                        if (progress == 100) {
                        	onProgress = progress;
                        }
                    },
                    done: function (e, data) {

                    	var files = data.files;
                        for (var i in files) {
                            var file = files[i];
                            var uniqueId = 'hc' + onChangeTime + file.lastModified + javaHashCode(file.name);
                            settings.onDone(e, data, uniqueId, file, data.result);
                        }

                        if (onProgress == 100) {
                        	settings.onDoneAll(e, data);
                        }
                        
                    },
                    fail: function (e, data) {
                        settings.onFail(e, data);
                    	// console.log('fail', data);
                    },
                    always: function (e, data) {
                        settings.onAlways(e, data);
                    	// console.log('always', data);
                    },
                });
                // .prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled')
            }
        };

        this.each(function(i, element) {

            $.extend(settings, options);

            core.create(element);
        });

        return core;
    };

})(jQuery);
