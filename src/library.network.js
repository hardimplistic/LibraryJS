
function getSearchParameter(key, defValue) {
    if (location.search && location.search.substring(1)) {
        var arr, reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        if (arr = location.search.substring(1).match(reg))
            return unescape(arr[2]);
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
    return PJsonCall(url, parameter);
}

function PBodyCall(url, parameter) {
    return PJsonCall(url, parameter);
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

























