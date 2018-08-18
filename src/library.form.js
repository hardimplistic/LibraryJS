
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
