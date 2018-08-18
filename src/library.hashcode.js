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
