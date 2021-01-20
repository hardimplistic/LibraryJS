

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

// 查找集合中所有对象指定属性，找到并返回对象
// param arrObj 集合
// param column string 字段名称
// param value 目标值
function arrayObjectSearchByColumn(arrObj, column, value) {
    var obj = null;
    for (var i in arrObj) {
        if (arrObj[i][column] == value) {
            obj = arrObj[i];
            break;
        }
    }
    return obj;
}
