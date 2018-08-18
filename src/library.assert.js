AssertJS = {
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