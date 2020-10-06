(function($) {
	'use strict';

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
