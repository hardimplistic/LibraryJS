
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