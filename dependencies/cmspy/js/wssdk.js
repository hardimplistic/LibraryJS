//客户端API从这里开始
function WSClient() {
    this.socket = null;
    this.events = {};
}

WSClient.prototype.connect = function(options) {
    var defaultSetting = {
        username: "",
        callback: function(event, data) {
            console.log('response', event, data);
        }
    };
    var opts = $.extend(defaultSetting, options);
    var that = this;

    var cid = uuid().replace(/-/g, '');

    var url = ['{0}//{1}'.format(location.protocol, location.host)];
    if (location.port) {
        url.push(':' + location.port);
    }
    url.push('?cid=' + cid);
    url.push('&username=' + opts.username);

    that.socket = io.connect(url.join(''));
    var socket = that.socket;

    if (socket != null) {
        socket.on('connect', function(data) {
            opts.callback('connect', data);
        });

        socket.on('connected', function(data) {
            opts.callback('connected', data);
        });

        socket.on('messagereply', function(data) {
            opts.callback('messagereply', data);
        });

        socket.on('message', function(data) {
            var callback = that.events[data.event];
            if (callback) {
                callback(data);
            } else {
                opts.callback('message', data);
            }
        });
    }
};

WSClient.prototype.sendEvent = function(event, message) {
    var socket = this.socket;
    console.log('sendEvent', event, message);
    socket.emit(event, message);
};

WSClient.prototype.sendEventMessage = function(event, data) {
    this.sendEvent('message', {
        event: event,
        data: $.toJSON(data),
        time: Date.now()
    });
};

WSClient.prototype.seeEvent = function() {
    for (var event in this.events) {
        console.log('event', event);
    }
};

WSClient.prototype.onEvent = function(event, callback) {
    this.events[event] = callback;
};

/**
 * 通知客服，有新的任务分配
 */
WSClient.prototype.onEventTaskAssign = function(callback) {
    this.onEvent('task.assign', callback);
};

/**
 * 通知客服，微博回复结果
 */
WSClient.prototype.onEventTaskReplyResponse = function(callback) {
    this.onEvent('task.reply.response', callback);
};

/**
 * 通知经理，客服上线
 */
WSClient.prototype.onEventAgentOnline = function(callback) {
    this.onEvent('agent.online', callback);
};