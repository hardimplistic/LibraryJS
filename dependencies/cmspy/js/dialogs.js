
// =====================================================================================================================

function DialogPromise(fn) {
    var that = this;
    this.resultStatus = 0;
    this.result = {
        value: null,
        dialog: null
    };
    this.resolveCallback = function() {};
    this.rejectCallback = function() {};
    this.resolve = function(value, dialog) {
        that.resultStatus = 1;
        that.result = {
            value: value,
            dialog: dialog
        };
        if (that.resolveCallback) {
            that.resolveCallback(value, dialog);
        }
    };
    this.reject = function(value, dialog) {
        this.resultStatus = 2;
        this.result = {
            value: value,
            dialog: dialog
        };
        if (that.rejectCallback) {
            that.rejectCallback(value, dialog);
        }
    };
    this.then = function(resolveCallback, rejectCallback) {
        that.resolveCallback = resolveCallback;
        that.rejectCallback = rejectCallback;
        if (that.resultStatus === 1) {
            that.resolveCallback && that.resolveCallback(
                this.result.value,
                this.result.dialog
            );
        } else if (that.resultStatus === 2) {
            that.rejectCallback && that.rejectCallback(
                that.result.value,
                that.result.dialog
            );
        }
    };

    fn(this.resolve, this.reject);
}

// =====================================================================================================================

var MDialog = {
    cacheContainerId: 'm-dialog-cache-template-container',
    hideTask: [],
    hideTaskIntervalId: 0,
    Close: function(m) {
        if (m) {
            m.remove();
        }
    }
};

// =====================================================================================================================

// MDialog.load = false;
MDialog.template = function(templateId, callback) {
    var template = $('#' + templateId).html();
    if (template) {
        callback(template);
        return;
    }
    var container = $('#m-dialog-cache-template-container');
    if (container.length === 0) {
        container = $('<div id="m-dialog-cache-template-container" style="display: none;"/>')
            .appendTo('body');
        container.load('/dialogs.html?v=' + Date.now(), function() {
            console.log('container loaded');
            var template = $('#m-dialog-cache-template-container #' + templateId).html();
            callback(template);
        });
    } else {
        var template = $('#m-dialog-cache-template-container #' + templateId).html();
        callback(template);
    }
};
MDialog.templateByUrl = function(url, callback) {
    var id = 'TMP' + javaHashCode(url);
    var container = $('#' + id);
    if (container.length === 0) {
        container = $('<div id="' + id + '" style="display: none;"/>').appendTo('body');
        container.load(url + '?v=' + Date.now(), function() {
            console.log('container loaded');
            callback();
        });
    } else {
        callback();
    }
};

// =====================================================================================================================

MDialog.Alert = function(options) {
    var defaultOptions = {
        title: '',
        message: ''
    };
    var opts = $.extend(defaultOptions, options);
    return new DialogPromise(function(resolve, reject) {
        MDialog.template('m-dialog-alert', function(template) {
            var m = $(template).appendTo('body');

            // ------------------------------------------------------------

            $('.modal-title', m).html(opts.title ? opts.title : '消息');
            $('.modal-body', m).html(opts.message);

            $('.btn-primary', m).click(function(e) {
                m.modal('hide');
                resolve();
            });

            // ------------------------------------------------------------

            m.on('show.bs.modal', function (e) {
                console.log('show.bs.modal');
            });
            m.on('shown.bs.modal', function (e) {
                console.log('shown.bs.modal');
            });
            m.on('hide.bs.modal', function (e) {
                console.log('hide.bs.modal');
            });
            m.on('hidden.bs.modal', function (e) {
                console.log('hidden.bs.modal');
                m.remove();
            });

            m.modal({
                backdrop: false,
                keyboard: false,
                show: true
            });

            // ------------------------------------------------------------

        });
    });
};

// =====================================================================================================================

MDialog.Confirm = function(options) {
    var defaultOptions = {
        title: '',
        message: ''
    };
    var opts = $.extend(defaultOptions, options);
    return new DialogPromise(function(resolve, reject) {
        MDialog.template('m-dialog-confirm', function(template) {
            var m = $(template).appendTo('body');

            // ------------------------------------------------------------

            $('.modal-title', m).html(opts.title ? opts.title : '消息');
            $('.modal-body', m).html(opts.message);

            $('.btn-primary', m).click(function(e) {
                m.modal('hide');
                resolve();
            });
            $('.btn-default', m).click(function(e) {
                m.modal('hide');
                reject();
            });

            // ------------------------------------------------------------

            m.on('show.bs.modal', function (e) {
                console.log('show.bs.modal');
            });
            m.on('shown.bs.modal', function (e) {
                console.log('shown.bs.modal');
            });
            m.on('hide.bs.modal', function (e) {
                console.log('hide.bs.modal');
            });
            m.on('hidden.bs.modal', function (e) {
                console.log('hidden.bs.modal');
                m.remove();
            });

            m.modal({
                backdrop: false,
                keyboard: false,
                show: true
            });

            // ------------------------------------------------------------

        });
    });
};
