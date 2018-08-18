

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

var WConfig = {
    ajax: {
        timeout: 500000,        // 超时
        loginStatus: 80403,     // 需要登录
        loginUrl: '/index.html' // 登录地址
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


function PAjaxCall(ajaxOptions, then) {

}