
function isNull(str) {
    return str == null || str.value == "";
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

