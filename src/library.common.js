
function isNull(str) {
    return str == null || str.length === 0;
}

function convertEmptyToNull(str) {
    return isNull(str) ? null : str;
}

function convertNullToEmpty(str) {
    return isNull(str) ? '' : str;
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