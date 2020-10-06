var wbcache = {
    emotions: null
};

var wb = {
    str62keys: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    int10to62: function(int10) {
        var s62 = '';
        var r = 0;
        while (int10 != 0) {
            r = int10 % 62;
            s62 = this.str62keys.charAt(r) + s62;
            int10 = Math.floor(int10 / 62);
        }
        return s62;
    },
    str62to10: function(str62) {
        var i10 = 0;
        for (var i = 0; i < str62.length; i++) {
            var n = str62.length - i - 1;
            var s = str62.substr(i, 1);  // str62[i]; 字符串用数组方式获取，IE下不支持为“undefined”
            i10 += parseInt(this.str62keys.indexOf(s)) * Math.pow(62, n);
        }
        return i10;
    },
    id2mid: function(id) {
        if (typeof (id) != 'string') {
            return false; // id数值较大，必须为字符串！
        }
        var mid = '';
        for (var i = id.length - 7; i > -7; i = i - 7) //从最后往前以7字节为一组读取mid
        {
            var offset1 = i < 0 ? 0 : i;
            var offset2 = i + 7;
            var num = id.substring(offset1, offset2);
            num = wb.int10to62(num);
            mid = num + mid;
        }
        return mid;
    },
    mid2id: function(mid) {
        var id = '';
        for (var i = mid.length - 4; i > -4; i = i - 4) //从最后往前以4字节为一组读取mid字符
        {
            var offset1 = i < 0 ? 0 : i;
            var len = i < 0 ? parseInt(mid.length % 4) : 4;
            var str = mid.substr(offset1, len);
            str = wb.str62to10(str).toString();
            if (offset1 > 0) //若不是第一组，则不足7位补0
            {
                while (str.length < 7) {
                    str = '0' + str;
                }
            }
            id = str + id;
        }
        return id;
    },
    // 缩略图地址转换thumb150
    thumb150: function(url) {
        var name = url.substring(url.lastIndexOf('/') + 1);
        return 'http://wx3.sinaimg.cn/thumb150/' + name;
    },
    // 缩略图地址转换代理地址thumb150
    proxythumb150: function(url) {
        url = wb.thumb150(url);
        return '/api/resource/image/proxy?url=' + encodeURIComponent(url);
    },
    // 图片代理地址
    proxyimage: function(url) {
        return '/api/resource/image/proxy?url=' + encodeURIComponent(url);
    },
    // 文本框操作
    textarea: {
        // 在光标处插入字符串
        // element    文本框对象
        // value 要插入的值
        insert: function(element, value) {
            //IE support
            if (document.selection) {
                element.focus();
                sel            = document.selection.createRange();
                sel.text    = value;
                sel.select();
            }
            //MOZILLA/NETSCAPE support
            else if (element.selectionStart || element.selectionStart == '0') {
                var startPos    = element.selectionStart;
                var endPos        = element.selectionEnd;
                // save scrollTop before insert
                var restoreTop    = element.scrollTop;
                element.value    = element.value.substring(0, startPos) + value + element.value.substring(endPos, element.value.length);
                if (restoreTop > 0) {
                    // restore previous scrollTop
                    element.scrollTop = restoreTop;
                }
                element.focus();
                element.selectionStart    = startPos + value.length;
                element.selectionEnd    = startPos + value.length;
            } else {
                element.value += value;
                element.focus();
            }
        }
    }
};

// 微博展示UI
var wbui = {
    getWeiboCard: function(data, options) {
        var defaultOptions = {
            // 模式
            //   view   只读模式
            //   assign 分配模式
            //   reply  回复模式
            mode: 'view',
            // 对话记录 on打开, off关闭
            sessionRecord: 'on',
            // 选择框 on打开, off关闭
            checkbox: 'on',
            onLoadMoreCardEvent: function() {}
        };
        var opts = $.extend(defaultOptions, options);
        var fn = '';
        switch (wbui.getWeiboFromType(data.task)) {
            case 'statuses':
                fn = wbui.statuses;
                break;
            case 'retweet':
                fn = wbui.retweet;
                break;
            case 'comment':
                fn = wbui.comment;
                break;
            default:
                fn = function() {
                    return ''
                };
        }
        // parse json
        data.task.picUrls && (data.task.picUrls = $.parseJSON(data.task.picUrls));
        data.task.retweetedStatus && (data.task.retweetedStatus = $.parseJSON(data.task.retweetedStatus));
        data.task.commentStatus && (data.task.commentStatus = $.parseJSON(data.task.commentStatus));
        data.task.geo && (data.task.geo = $.parseJSON(data.task.geo));

        return fn(data, opts);
    },
    getWeiboFromType: function(task) {
        var type = '';
        switch (task.type) {
            case 'MyStatuses':
            case 'Statuses':
                type = 'statuses';
                break;
            case 'MyRetweeted':
            case 'Retweeted':
                type = 'retweet';
                break;
            case 'AtMeComments':
            case 'ToMeComments':
                type = 'comment';
                break;
            case 'Keywords':
                switch (task.subType) {
                    case 'KeywordRetweeted':
                        type = 'retweet';
                        break;
                    case 'KeywordStatuses':
                        type = 'statuses';
                        break;
                }
                break;
        }
        return type;
    },
    // 用户信息
    userHeader: function(user, options) {
        var html = '';
        html += '<div class="card-header">';
        html += '    <div class="user-block">';
        html += '        <img class="img-circle" src="{0}" alt="User Image">'.format(wb.proxyimage(user.profileImageUrl));
        html += '        <span class="username"><a target="_blank" href="{1}">{0}</a></span>'.format(user.screenName, 'https://m.weibo.cn/u/' + user.idstr);
        html += '        <span class="description">';
        html += '            关注({0})'.format(user.friendsCount);
        html += '            粉丝({0})'.format(user.followersCount);
        html += '            微博({0})'.format(user.statusesCount);
        html += '        </span>';
        html += '    </div>';
        html += '    <div class="card-tools">';
        html += '        <button type="button" class="btn btn-tool" data-toggle="tooltip" title="微博用户设置" data-action="weibo-user-settings">';
        html += '            设置备注';
        html += '        </button>';
        html += '    </div>';
        html += '</div>';
        var element = $(html);
        element.data(user);
        element.find('[data-action]').click(function() {
            var user = $(this).closest('.card-header').data();
            var action = $(this).data('action');
            switch (action) {
                // 设置备注
                case 'weibo-user-settings':
                    MDialog.openWbUserSettingsDialog({
                        idstr: user.idstr
                    });
                    break;
            }
        });

        return element;
    },
    // 来源
    weiboFrom: function(task) {
        // Unknown("Unknown", "未知"),
        // MyStatuses("MyStatuses", "我的原创"),
        // MyRetweeted("MyRetweeted", "我的转发"),
        // Retweeted("Retweeted", "转发微博"),
        // Statuses("Statuses", "原创微博"),
        //
        // AtMeComments("AtMeComments", "at我的评论"),
        // ToMeComments("ToMeComments", "评论"),
        //
        // Keywords("Keywords", "关键词"),
        // // Keyword 子类型
        // KeywordRetweeted("KeywordRetweeted", "关键词_转发微博"),
        // KeywordStatuses("KeywordStatuses", "关键词_原创微博"),
        var source = '';
        switch (task.type) {
            case 'MyStatuses':
                source = '我的原创';
                break;
            case 'MyRetweeted':
                source = '我的转发';
                break;
            case 'Retweeted':
                source = '转发微博';
                break;
            case 'Statuses':
                source = '原创微博';
                break;
            case 'AtMeComments':
                source = 'at我的评论';
                break;
            case 'ToMeComments':
                source = '评论';
                break;
            case 'Keywords':
                switch (task.subType) {
                    case 'KeywordRetweeted':
                        source = '关键词转发微博';
                        break;
                    case 'KeywordStatuses':
                        source = '关键词原创微博';
                        break;
                }
                break;
        }
        // var html = '';
        // html += '<div class="card-body" style="border-bottom: 1px dashed rgba(0,0,0,.125);">';
        // html += '    <span class="text-muted">微博唯一编号：{0}</span>'.format(task.midShort);
        // html += '    <span class="float-right text-muted">来源：{0}</span>'.format(source);
        // html += '</div>';
        return '<span class="text-muted"><i class="fas fa-tags"></i> {0}</span>'.format(source);
    },
    // 微博时间，抓取时间
    atTime: function(task) {
        // 微博时间
        if (task.pubdate) {
            return '<span class="text-muted"><i class="far fa-clock"></i> {0}</span>'.format(moment(task.pubdate).format('YYYY-MM-DD HH:mm:ss'));
        }
        // 抓取时间
        else if (task.createAt) {
            return '<span class="text-muted"><i class="far fa-clock"></i> {0}</span>'.format(moment(task.createAt).format('YYYY-MM-DD HH:mm:ss'));
        }
        return '<span class="text-muted"><i class="far fa-clock"></i> 未知</span>';
    },
    // 微博唯一编号
    uniqueMid: function(task) {
        return '<span class="text-muted"><i class="fas fa-anchor"></i> {0}</span>'.format(task.midShort);
    },
    // 分配信息
    assignInfo: function(data) {
        if (!data.manager || !data.agent) {
            return '';
        }
        if (data.agent.unwantedAssign === 'true') {
            return '<span class="text-muted"><i class="fas fa-angle-double-right"></i> {0}设置为无需分配</span>'.format(data.manager.realName);
        }
        return '<span class="text-muted"><i class="fas fa-angle-double-right"></i> {0}分配给{1}</span>'.format(data.manager.realName, data.agent.realName);
    },
    // 任务状态
    taskStatus: function(data) {
        var status = '';
        if (data.agent && data.agent.unwantedAssign === 'true') {
            // status = '无需分配';
            return '';
        }
        else if (data.status) {
            if (data.status.processResult === 1) {
                status = '已回复';
            } else if (data.status.processResult === 2) {
                status = '无需回复';
            } else {
                if ([2, 5].indexOf(data.status.assignStatus) > -1) {
                    status = '已分配';
                } else {
                    status = '未分配';
                }
            }
        }
        if (!status) {
            return '';
        }
        return '<span class="text-muted"><i class="fas fa-tasks"></i> {0}</span>'.format(status);
    },
    // 选择框
    checkbox: function(task, options) {
        if (options.checkbox === 'off') {
            return '';
        }
        var id = CreateID();
        var checkbox = '';
        checkbox += '<div class="custom-control custom-checkbox" style="float: right;">';
        checkbox += '    <input class="custom-control-input checkbox-item" type="checkbox" id="{0}" value="{1}">'.format(id, task.idstr);
        checkbox += '    <label for="{0}" class="custom-control-label" style="font-weight: 400; cursor: pointer;">选择</label>'.format(id);
        checkbox += '</div>';
        var element = $(checkbox);
        element.find('.checkbox-item')
            .data(task)
            .change(function() {
                if (!this.checked) {
                    $('.task-toolbar [data-action="select-all"]')
                        .removeClass('selected')
                        .html('批量选择');
                }
            });
        return element;
    },
    // 照片内容，视频内容
    mediaBody: function(task) {
        var body = $('<div/>');

        if (task.picUrls && task.picUrls.length) {
            // 多张图片
            var picUrls = task.picUrls;
            var rowSize = 3;
            if (picUrls.length === 4) {
                rowSize = 2;
            }
            var picUrlsElement = $('<div/>');
            var row = null;
            picUrls.forEach(function(pic, idx) {
                if (!row || idx % rowSize === 0) {
                    row = $('<div class="wb-image-container type-image-4"/>').appendTo(picUrlsElement);
                }
                // /api/resource/image/proxy?url=http%3A%2F%2Fwx3.sinaimg.cn%2Fthumb150%2F9d28c723gy1gd4xmw3sg9j23402c0b29.jpg
                var url = wb.proxythumb150(pic.thumbnail_pic);
                var html = '';
                html += '<div class="wb-image-inner">';
                html += '    <div>';
                html += '        <img src="{0}">'.format(url);
                html += '    </div>';
                html += '</div>';
                row.append(html);
            });
            body.append(picUrlsElement);
        } else if (task.thumbnailPic || task.thumbnail_pic) {
            var thumbnail = task.thumbnailPic || task.thumbnail_pic;
            // 单张图片
            var url = wb.proxythumb150(thumbnail);
            var html = '';
            html += '<div class="wb-image-container">';
            html += '    <div class="wb-image-inner">';
            html += '        <div>';
            html += '            <img src="{0}">'.format(url);
            html += '        </div>';
            html += '    </div>';
            html += '</div>';
            body.append(html);
        }
        return body;
    },
    // 操作栏
    toolsbar: function(data, options) {
        var html = '';
        html += '<div class="card-body toolsbar" style="border-top: 1px dashed rgba(0,0,0,.125);">';
        html += '    <div class="btn-group float-sm-left">';
        html += '        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="original-weibo">微博原文</button>';
        if (options.sessionRecord === 'on') {
            html += '        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="session-record">对话记录</button>';
        }
        // html += '        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80 dropdown-toggle dropdown-icon"';
        // html += '            data-toggle="dropdown" aria-expanded="false">';
        // html += '            添加到';
        // html += '            <div class="dropdown-menu" role="menu" x-placement="bottom-start" style="position: absolute; will-change: transform; top: 0px; left: 0px; transform: translate3d(-1px, 37px, 0px);">';
        // html += '                <a class="dropdown-item" href="#" data-action="follow-user">关注用户</a>';
        // html += '                <a class="dropdown-item" href="#" data-action="follow-content">关注内容</a>';
        // html += '            </div>';
        // html += '        </button>';
        html += '    </div>';
        html += '    <div class="btn-group float-sm-right">';
        if (options.mode === 'assign') {
            html += '<button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="assign-unwanted">无需分配</button>';
            html += '<button type="button" class="btn btn-outline-secondary btn-xs btn-width-80 dropdown-toggle dropdown-icon" data-action="assign" data-toggle="dropdown" aria-expanded="false">';
            html += '    立即分配 <span class="sr-only">Toggle Dropdown</span>';
            html += '    <div class="dropdown-menu" role="menu" x-placement="bottom-start">';
            // html += '        <a class="dropdown-item" href="#">无需分配</a>';
            html += '    </div>';
            html += '</button>';
        } else if (options.mode === 'reply') {
            html += '<button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="reply-unwanted">无需回复</button>';
            html += '<button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="reply">立即回复</button>';
        }
        html += '    </div>';
        html += '</div>';
        var elements = $(html).data(data);
        elements.attr('data-idstr', data.task.idstr);
        elements.attr('data-userIdstr', data.task.userIdstr);
        elements.find('[data-action]').click(function() {
            var thatElement = $(this);
            var data = thatElement.closest('.toolsbar').data();
            var action = thatElement.data('action');
            switch (action) {
                // 无需分配
                case 'assign-unwanted':
                    var idstr = thatElement.closest('.toolsbar').data('idstr');
                    apis.batchUnwantedTask([idstr])
                        .then(function(response) {
                            var card = $('.card-widget[data-idstr="{0}"]'.format(idstr));
                            card.slideUp(160, function() {
                                card.remove();
                                options.onLoadMoreCardEvent();
                            })
                        });
                    break;
                // 分配
                case 'assign':
                    apis.getOnlineAgents()
                        .then(function(response) {
                            var onlineAgents = response.data;
                            var dropdownElement = $('.dropdown-menu', thatElement).empty();
                            $('<a class="dropdown-item" href="#" data-unwanted="true">无需分配</a>').appendTo(dropdownElement);
                            $('<div class="dropdown-divider"></div>').appendTo(dropdownElement);
                            // $('<a class="dropdown-item" href="#"><i style="color: grey;">自动分配</i></a>').appendTo(dropdownElement);
                            // $('<div class="dropdown-divider"></div>').appendTo(dropdownElement);
                            onlineAgents.forEach(function (agent) {
                                $('<a class="dropdown-item" href="#" data-unwanted="false"/>')
                                    .attr('data-username', agent.userName)
                                    .html('{0} ({1})'.format(agent.realName, agent.userName))
                                    .appendTo(dropdownElement);
                            });
                            if (onlineAgents.length === 0) {
                                $('<a class="dropdown-item" href="#"/>')
                                    .html('<i style="color: grey;">暂无客服在线</i>')
                                    .appendTo(dropdownElement);
                            }
                            dropdownElement.find('.dropdown-item').click(function() {
                                var isUnwanted = $(this).data('unwanted');
                                var userName   = $(this).data('username');
                                var idstr      = $(this).closest('.toolsbar').data('idstr');
                                console.log(isUnwanted, userName, idstr);
                                var fn = apis.batchAssignTask;
                                if (isUnwanted === true) {
                                    fn = apis.batchUnwantedTask;
                                }
                                fn([idstr], userName)
                                    .then(function(response) {
                                        var card = $('.card-widget[data-idstr="{0}"]'.format(idstr));
                                        card.slideUp(160, function() {
                                            card.remove();
                                            options.onLoadMoreCardEvent();
                                        })
                                    });
                                return false;
                            });
                        });
                    break;
                // 回复
                case 'reply':
                    var replyboxElement = thatElement.closest('.card').find('.replybox');
                    if (replyboxElement.is(':hidden')) {
                        replyboxElement.slideDown();
                    }
                    break;
                // 无需回复
                case 'reply-unwanted':
                    var idstr = thatElement.closest('.toolsbar').data('idstr');
                    apis.batchUnwantedReply([idstr])
                        .then(function(response) {
                            var card = $('.card-widget[data-idstr="{0}"]'.format(idstr));
                            card.slideUp(160, function() {
                                card.remove();
                                options.onLoadMoreCardEvent();
                            })
                        });
                    break;
                // 对话记录
                case 'session-record':
                    var timelineElement = thatElement.closest('.card').find('.direct-chat-messages')
                    if (timelineElement.is(':hidden')) {
                        timelineElement.empty();
                        var task = thatElement.closest('.card').data();
                        console.log('task', task);
                        var statusesIdstr = null;
                        var commentsIdstr = null;
                        switch (task.type) {
                            case 'MyStatuses':
                            case 'MyRetweeted':
                            case 'Retweeted':
                            case 'Statuses':
                            case 'Keywords':
                                statusesIdstr = task.idstr;
                                break;
                            case 'AtMeComments':
                            case 'ToMeComments':
                                commentsIdstr = task.idstr;
                                break;
                        }
                        apis.getTimelineReply(statusesIdstr, commentsIdstr)
                            .then(function(response) {
                                var systemUserIdstr = WApp.getPropSystemUserIdstr();
                                var list = response.data;
                                list.forEach(function(item) {
                                    if (!item.comments) {
                                        return;
                                    }
                                    var html = '';
                                    html += '    <div class="direct-chat-msg">';
                                    html += '        <div class="direct-chat-infos clearfix">';
                                    html += '            <span class="direct-chat-name float-left">{0}</span>'.format(item.user.screenName);
                                    html += '            <span class="direct-chat-timestamp float-right">{0}</span>'.format(moment(item.comments.pubdate).format('YYYY/MM/DD HH:mm:ss'));
                                    html += '        </div>';
                                    html += '        <img class="direct-chat-img" src="{0}" alt="message user image">'.format(wb.proxyimage(item.user.profileImageUrl));
                                    html += '        <div class="direct-chat-text">';
                                    html += '            ' + item.comments.text;
                                    html += '        </div>';
                                    html += '    </div>';
                                    var msgElement = $(html);
                                    if (item.user.idstr === systemUserIdstr) {
                                        msgElement.addClass('right');
                                    }
                                    timelineElement.append(msgElement);
                                });
                                if (timelineElement.find('.direct-chat-msg').length === 0) {
                                    var html = '';
                                    html += '    <div class="direct-chat-msg" style="text-align: center; margin-bottom: 0px;">';
                                    html += '        <i>暂无对话记录</i>';
                                    html += '    </div>';
                                    timelineElement.append(html);
                                }
                                timelineElement.slideDown('slow');
                            });
                    } else {
                        timelineElement.slideUp();
                    }
                    break;
                // 微博原文
                case 'original-weibo':
                    var user = data.task.idstr;
                    var weiboid = data.task.idstr;
                    if (data.task.commentStatus) {
                        user = data.task.commentStatus.user.id;
                        weiboid = data.task.commentStatus.idstr;
                    }
                    // wbui.plugin.virtual.browser.target({
                    //     title: '微博原文',
                    //     url: 'https://m.weibo.cn/detail/' + id
                    // });
                    // window.open('https://m.weibo.cn/detail/' + id);
                    // window.open('https://weibo.com/{0}/{1}'.format(data.user.idstr, data.task.midShort));
                    var url = 'https://weibo.com/{0}/{1}'.format(user, wb.id2mid(weiboid));
                    window.open(url);
                    break;
            }
        });
        return elements;
    },
    // 对话记录
    timeline: function(data, options) {
        var html = '';
        html += '<div class="direct-chat-messages direct-chat-warning" style="border-top: 1px dashed rgba(0,0,0,.125); display: none;">';
        html += '    <div class="direct-chat-msg">';
        html += '        <div class="direct-chat-infos clearfix">';
        html += '            <span class="direct-chat-name float-left">Alexander Pierce</span>';
        html += '            <span class="direct-chat-timestamp float-right">23 Jan 2:00 pm</span>';
        html += '        </div>';
        html += '        <img class="direct-chat-img" src="/api/resource/image/proxy?url=https%3A%2F%2Ftvax1.sinaimg.cn%2Fcrop.0.0.996.996.180%2F6b948f49ly8gdiva7fk2uj20ro0rowha.jpg%3FKID%3Dimgbed%2Ctva%26Expires%3D1587987333%26ssig%3D0Fwva%252BedXi" alt="message user image">';
        html += '        <div class="direct-chat-text">';
        html += '            Is this template really for free? That';
        html += '        </div>';
        html += '    </div>';
        html += '    <div class="direct-chat-msg right">';
        html += '        <div class="direct-chat-infos clearfix">';
        html += '            <span class="direct-chat-name float-right">Sarah Bullock</span>';
        html += '            <span class="direct-chat-timestamp float-left">23 Jan 2:05 pm</span>';
        html += '        </div>';
        html += '        <img class="direct-chat-img" src="/api/resource/image/proxy?url=https%3A%2F%2Ftvax1.sinaimg.cn%2Fcrop.0.0.996.996.180%2F6b948f49ly8gdiva7fk2uj20ro0rowha.jpg%3FKID%3Dimgbed%2Ctva%26Expires%3D1587987333%26ssig%3D0Fwva%252BedXi" alt="message user image">';
        html += '        <div class="direct-chat-text">';
        html += '            You better believe it!';
        html += '        </div>';
        html += '    </div>';
        html += '</div>';
        var element = $(html);
        return element;
    },
    // 回复框
    replyBox: function(data, options) {
        var html = '';
        html += '<div class="card-footer replybox" style="display: none;">';
        html += '	<form onsubmit="return false">';
        html += '		<img class="img-fluid img-circle img-sm" src="{0}">'.format(WApp.getPropSystemUserImg());
        html += '		<div class="img-push">';
        html += '			<textarea name="replyContent" class="form-control form-control-sm" placeholder="回复内容" rows="5"></textarea>';
        html += '		    <div style="margin-top: 10px;">';
        html += '		        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="insert-emoji">插入表情</button>';
        html += '		        <button type="button" class="btn btn-outline-secondary btn-xs btn-width-80" data-action="fast-reply">快捷回复</button>';
        html += '		        <button type="button" class="btn btn-secondary btn-xs btn-width-80" style="float: right;" data-action="send-reply">发送</button>';
        html += '		    </div>';
        html += '		</div>';
        html += '	</form>';
        html += '</div>';
        var elements = $(html);
        elements.data(data);
        elements.find('[data-action]').click(function() {
            var thatElement = $(this);
            var data = thatElement.closest('.replybox').data();
            var action = thatElement.data('action');
            switch (action) {
                // 插入表情
                case 'insert-emoji':

                    thatElement.parent().find('.card-quickreply-box').fadeOut(180);

                    if (thatElement.parent().find('.card-face-box').length) {
                        thatElement.parent().find('.card-face-box').fadeIn(180);
                        return;
                    }

                    var emojiCard = '';
                    emojiCard += '<div class="card card-primary card-outline card-face-box">';
                    emojiCard += '<div class="card-header">';
                    emojiCard += '  <h3 class="card-title">微博表情</h3>';
                    emojiCard += '  <div class="card-tools">';
                    emojiCard += '    <button type="button" class="btn btn-tool btn-face-card-remove"><i class="fas fa-times"></i>';
                    emojiCard += '    </button>';
                    emojiCard += '  </div>';
                    emojiCard += '</div>';
                    emojiCard += '  <div class="card-body pad">';
                    // emojiCard += '    <div class="face-inner">';
                    // emojiCard += '      <img src="http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/2018new_weixioa02_org.png" />';
                    // emojiCard += '    </div>';
                    emojiCard += '  </div>';
                    emojiCard += '</div>';
                    var emojiCardElements = $(emojiCard);
                    emojiCardElements.find('.btn-face-card-remove').click(function() {
                        $(this).closest('.card-face-box').fadeOut(180);
                    });

                    var position = thatElement.position();
                    emojiCardElements.css('position', 'absolute');
                    emojiCardElements.css('top', position.top + 26);
                    emojiCardElements.css('left', position.left);
                    emojiCardElements.css('width', '400px');
                    emojiCardElements.css('height', '300px');
                    emojiCardElements.css('z-index', '99999');

                    thatElement.parent().append(emojiCardElements);

                    var returnEmotions = function(emotions) {

                        var emojiBody = emojiCardElements.find('.card-body');
                        emotions.forEach(function(emoji) {
                            if (['face'/*, 'ani'*/].indexOf(emoji.type) === -1) {
                                return;
                            }
                            var face = $('<div class="face-inner"><img src="{0}" onerror="$(this).parent().remove()" /></div>'.format(wb.proxyimage(emoji.icon)))
                                .data(emoji)
                                .appendTo(emojiBody);
                            face.click(function() {
                                var emoji = $(this).data();
                                console.log(emoji);
                                var textareaElement = thatElement.closest('.card').find('textarea[name="replyContent"]')[0];
                                wb.textarea.insert(textareaElement, emoji.phrase);
                            });
                        })
                    };

                    if (wbcache.emotions) {
                        returnEmotions(wbcache.emotions);
                    } else {
                        apis.emotions()
                            .then(function (response) {
                                var emotions = response.data;
                                wbcache.emotions = emotions;
                                returnEmotions(wbcache.emotions);
                            });
                    }

                    break;
                // 快捷回复
                case 'fast-reply':
                    thatElement.parent().find('.card-face-box').fadeOut(180);

                    if (thatElement.parent().find('.card-quickreply-box').length) {
                        thatElement.parent().find('.card-quickreply-box').fadeIn(180);
                        return;
                    }

                    var emojiCard = '';
                    emojiCard += '<div class="card card-primary card-outline card-quickreply-box">';
                    emojiCard += '<div class="card-header">';
                    emojiCard += '  <h3 class="card-title">快速回复</h3>';
                    emojiCard += '  <div class="card-tools">';
                    emojiCard += '    <button type="button" class="btn btn-tool btn-quickreply-card-remove"><i class="fas fa-times"></i>';
                    emojiCard += '    </button>';
                    emojiCard += '  </div>';
                    emojiCard += '</div>';
                    emojiCard += '  <div class="card-body pad" style="padding: 10px;">';

                    emojiCard += '  </div>';
                    emojiCard += '</div>';
                    var emojiCardElements = $(emojiCard);
                    emojiCardElements.find('.btn-quickreply-card-remove').click(function() {
                        $(this).closest('.card-quickreply-box').fadeOut(180);
                    });

                    var position = thatElement.position();
                    emojiCardElements.css('position', 'absolute');
                    emojiCardElements.css('top', position.top + 26);
                    emojiCardElements.css('left', position.left);
                    emojiCardElements.css('width', '400px');
                    emojiCardElements.css('height', '300px');
                    emojiCardElements.css('z-index', '99999');

                    thatElement.parent().append(emojiCardElements);

                    var returnQuickreplys = function(list) {

                        var listBody = emojiCardElements.find('.card-body');
                        list.forEach(function(item) {
                            var itemElement = $('<div class="quickreply-inner">{0}</div>'.format(item.associate))
                                .data(item)
                                .appendTo(listBody);
                            itemElement.click(function() {
                                var item = $(this).data();
                                console.log(item);
                                var textareaElement = thatElement.closest('.card').find('textarea[name="replyContent"]')[0];
                                wb.textarea.insert(textareaElement, item.text);
                                thatElement.parent().find('.card-quickreply-box').fadeOut(180);
                            });
                        })
                    };

                    if (wbcache.quickreplys) {
                        returnQuickreplys(wbcache.quickreplys);
                    } else {
                        apis.quickreplys()
                            .then(function (response) {
                                var list = response.data;
                                wbcache.quickreplys = list;
                                returnQuickreplys(wbcache.quickreplys);
                            });
                    }

                    break;
                // 发送
                case 'send-reply':
                    // Unknown("Unknown", "未知"),
                    // MyStatuses("MyStatuses", "我的原创"),
                    // MyRetweeted("MyRetweeted", "我的转发"),
                    // Retweeted("Retweeted", "转发微博"),
                    // Statuses("Statuses", "原创微博"),
                    //
                    // AtMeComments("AtMeComments", "at我的评论"),
                    // ToMeComments("ToMeComments", "评论"),
                    //
                    // Keywords("Keywords", "关键词"),
                    // // Keyword 子类型
                    // KeywordRetweeted("KeywordRetweeted", "关键词_转发微博"),
                    // KeywordStatuses("KeywordStatuses", "关键词_原创微博"),
                    var api = null;
                    switch (data.task.type) {
                        case 'MyStatuses':
                        case 'MyRetweeted':
                        case 'Retweeted':
                        case 'Statuses':
                            api = apis.replyStatuses;
                            break;
                        case 'Keywords':
                        case 'KeywordRetweeted':
                        case 'KeywordStatuses':
                            api = apis.replyStatuses;
                            break;
                        case 'AtMeComments':
                        case 'ToMeComments':
                            api = apis.replyComments;
                            break;
                    }

                    var textareaElement = thatElement.closest('.card').find('textarea[name="replyContent"]');
                    textareaElement.attr('readonly', true);
                    thatElement.attr('disabled', true);
                    wbui.plugin.fastoast({
                        icon: 'info',
                        title: '正在处理',
                        timer: 0,
                    });
                    var taskId = data.task.id;
                    var comment = textareaElement.val();
                    api(taskId, comment)
                        .then(function(response) {
                            textareaElement.val('');
                            textareaElement.removeAttr('readonly');
                            thatElement.removeAttr('disabled');
                            wbui.plugin.fastoast({
                                icon: 'success',
                                title: '处理结束'
                            });

                            var card = textareaElement.closest('.card');
                            card.slideUp(160, function() {
                                card.remove();
                                options.onLoadMoreCardEvent();
                            })
                        });

                    break;
            }
        });
        return elements;
    },
    // 原创微博
    statuses: function(data, options) {
        console.log('原创微博', data);
        var container = $('<div class="card card-widget"/>');
        container.attr('data-idstr', data.task.idstr);
        container.data(data.task);
        // 用户信息
        container.append(wbui.userHeader(data.user, options));

        // 微博信息
        var body = $('<div class="card-body"/>').appendTo(container);
        body.append(wbui.checkbox(data.task, options));
        var wbContainer = $('<div class="wb-container"/>').appendTo(body);
        wbContainer.append('<div class="wb-text">{0}</div>'.format(data.task.text));
        wbContainer.append(wbui.mediaBody(data.task));

        // 微博时间, 抓取时间
        body.append(wbui.atTime(data.task));

        // 来源
        body.append(wbui.weiboFrom(data.task));

        // 微博唯一编号
        body.append(wbui.uniqueMid(data.task));

        // 分配信息
        body.append(wbui.assignInfo(data));

        // 任务状态
        body.append(wbui.taskStatus(data));

        // 操作栏
        container.append(wbui.toolsbar(data, options));

        // 对话记录
        container.append(wbui.timeline(data, options));

        // 回复框
        container.append(wbui.replyBox(data, options));

        return container;
    },
    // 转发微博
    retweet: function(data, options) {
        console.log('转发微博', data);
        var container = $('<div class="card card-widget"/>');
        container.attr('data-idstr', data.task.idstr);
        container.data(data.task);
        // 用户信息
        container.append(wbui.userHeader(data.user, options));

        // 微博信息
        var body = $('<div class="card-body"/>').appendTo(container);
        body.append(wbui.checkbox(data.task, options));
        var wbContainer = $('<div class="wb-container"/>').appendTo(body);
        wbContainer.append('<div class="wb-text">{0}</div>'.format(data.task.text));

        var retweetTask = data.task.retweetedStatus;
        var retweetContainer = $('<div class="wb-container wb-container-retweet"/>').appendTo(wbContainer);

        retweetContainer.append('<div class="wb-text">{0}</div>'.format(retweetTask.text));
        retweetContainer.append(wbui.mediaBody(retweetTask));

        // 微博时间, 抓取时间
        body.append(wbui.atTime(data.task));

        // 来源
        body.append(wbui.weiboFrom(data.task));

        // 微博唯一编号
        body.append(wbui.uniqueMid(data.task));

        // 分配信息
        body.append(wbui.assignInfo(data));

        // 任务状态
        body.append(wbui.taskStatus(data));

        // 操作栏
        container.append(wbui.toolsbar(data, options));

        // 对话记录
        container.append(wbui.timeline(data, options));

        // 回复框
        container.append(wbui.replyBox(data, options));

        return container;
    },
    // 微博评论
    comment: function(data, options) {
        console.log('微博评论', data);
        var container = $('<div class="card card-widget"/>');
        container.attr('data-idstr', data.task.idstr);
        container.data(data.task);
        // 用户信息
        container.append(wbui.userHeader(data.user, options));

        // 微博信息
        var body = $('<div class="card-body"/>').appendTo(container);
        body.append(wbui.checkbox(data.task, options));
        var wbContainer = $('<div class="wb-container"/>').appendTo(body);
        wbContainer.append('<div class="wb-text">{0}</div>'.format(data.task.text));

        var commentTask = data.task.commentStatus;
        var commentContainer = $('<div class="wb-container wb-container-retweet"/>').appendTo(wbContainer);

        commentContainer.append('<div class="wb-text">{0}</div>'.format(commentTask.text));
        commentContainer.append(wbui.mediaBody(commentTask));

        // 微博时间, 抓取时间
        body.append(wbui.atTime(data.task));

        // 来源
        body.append(wbui.weiboFrom(data.task));

        // 微博唯一编号
        body.append(wbui.uniqueMid(data.task));

        // 分配信息
        body.append(wbui.assignInfo(data));

        // 任务状态
        body.append(wbui.taskStatus(data));

        // 操作栏
        container.append(wbui.toolsbar(data, options));

        // 对话记录
        container.append(wbui.timeline(data, options));

        // 回复框
        container.append(wbui.replyBox(data, options));

        return container;
    },

    // 插件
    plugin: {
        // 手机浏览模拟器，微博官网显示组件
        virtual: {
            browser: {
                instance: null,
                instanceIframe: null,
                build: function() {
                    if (wbui.plugin.virtual.browser.instanceIframe) {
                        return;
                    }
                    var html = '';
                    html += '<div class="plugin-virtual-browser">';
                    html += '    <div>';
                    html += '        <iframe src="/pages/plugins/virtual-browser.html"></iframe>';
                    html += '        <div class="browser-navbar">';
                    html += '            <span class="title"></span>';
                    html += '            <span class="close">';
                    html += '                <i class="nav-icon fab fa-slack"></i>';
                    html += '            </span>';
                    html += '        </div>';
                    html += '    </div>';
                    html += '</div>';
                    var browser = $(html);
                    wbui.plugin.virtual.browser.instance = browser;
                    var iframe = browser.find('iframe')[0];
                    wbui.plugin.virtual.browser.instanceIframe = iframe;
                    browser.appendTo('body');
                    browser.hide();
                    var onload = function() {
                        console.log('页面加载完成', iframe.src);
                        // $(iframe.contentWindow.document).find('.nav-left').remove();
                    };
                    if (iframe.attachEvent) {
                        iframe.attachEvent("onload", onload);
                    } else {
                        iframe.onload = onload;
                    }
                    browser.find('.close').click(function() {
                        wbui.plugin.virtual.browser.close();
                    });
                },
                open: function() {
                    if (!wbui.plugin.virtual.browser.instanceIframe) {
                        wbui.plugin.virtual.browser.build();
                    }
                    wbui.plugin.virtual.browser.instance.fadeIn(150);
                },
                close: function() {
                    if (!wbui.plugin.virtual.browser.instanceIframe) {
                        wbui.plugin.virtual.browser.build();
                    }
                    wbui.plugin.virtual.browser.instanceIframe.src = '/pages/plugins/virtual-browser.html';
                    wbui.plugin.virtual.browser.instance.fadeOut(150);
                },
                target: function(options) {
                    var defaultOptions = {
                        utl: '',
                        title: ''
                    };
                    var opts = $.extend(defaultOptions, options);
                    if (!wbui.plugin.virtual.browser.instanceIframe) {
                        wbui.plugin.virtual.browser.build();
                        wbui.plugin.virtual.browser.open();
                        wbui.plugin.virtual.browser.instance.find('.title').html('正在加载');
                        setTimeout(function() {
                            wbui.plugin.virtual.browser.instanceIframe.src = opts.url;
                            wbui.plugin.virtual.browser.instance.find('.title').html(opts.title);
                        }, 300);
                    } else {
                        wbui.plugin.virtual.browser.open();
                        wbui.plugin.virtual.browser.instance.find('.title').html('正在加载');
                        setTimeout(function() {
                            wbui.plugin.virtual.browser.instanceIframe.src = opts.url;
                            wbui.plugin.virtual.browser.instance.find('.title').html(opts.title);
                        }, 300);
                    }
                }
            }
        },

        // // 提示框
        // toast: Swal.mixin({
        //     toast: false,
        //     icon: 'success',
        //     // position: 'top-end',
        //     showConfirmButton: false,
        //     timer: 1500,
        //     timerProgressBar: true,
        //     onOpen: function (toast) {
        //         toast.addEventListener('mouseenter', Swal.stopTimer)
        //         toast.addEventListener('mouseleave', Swal.resumeTimer)
        //     }
        // }),

        // 提示框
        fastoast: function (options) {
            var defaultSettings = {
                icon: 'info',
                title: '正在处理',
                timer: 1500,
                onClose: function () {

                }
            };
            var opts = $.extend(defaultSettings, options);
            var mask = $('.fastoast-mask');
            var ins;
            if (mask.length) {
                ins = $('.fastoast');
            } else {
                var html = '';
                html += '<div class="fastoast-mask" style="display: none;">';
                html += '    <div class="fastoast">';
                html += '        <div class="fastoast-inner">';
                html += '            <div class="fastoast-icon">';
                html += '                <span class="fas fa-info-circle"></span>';
                html += '            </div>';
                html += '            <div class="fastoast-text">';
                html += '                正在处理';
                html += '            </div>';
                html += '        </div>';
                html += '    </div>';
                html += '</div>';
                $('body').append(html);
                mask = $('.fastoast-mask');
                ins = $('.fastoast');
            }

            var iconMap = {
                // 信息
                // <span class="fas fa-info-circle"></span>
                'info': 'fas fa-info-circle',
                // 发送
                // <span class="fas fa-paper-plane"></span>
                // <span class="fas fa-arrow-circle-up"></span>
                'send': 'fas fa-arrow-circle-up',
                // 下载
                // <span class="fas fa-arrow-circle-down"></span>
                // <span class="fas fa-file-download"></span>
                'download': 'fas fa-file-download',
                // 打包
                // <span class="fas fa-save"></span>
                'package': 'fas fa-save',
                // 保存
                // <span class="fas fa-file-archive"></span>
                'save': 'fas fa-file-archive',
                // 成功
                // <span class="fas fa-check-circle"></span>
                'success': 'fas fa-check-circle',
                // 失败
                // <span class="fas fa-times-circle"></span>
                'fail': 'fas fa-times-circle',
                // 警告
                // <span class="fas fa-exclamation-circle"></span>
                // <span class="fas fa-exclamation-triangle"></span>
                'warn': 'fas fa-exclamation-circle',
                // 移除
                // <span class="fas fa-trash-alt"></span>
                'remove': 'fas fa-trash-alt',
                // 加入购物车
                // <span class="fas fa-cart-arrow-down"></span>
                'cartdown': 'fas fa-cart-arrow-down',
                // 成功
                // <span class="fas fa-laugh-wink"></span>
                'success2': 'fas fa-laugh-wink',
                // 发生错误
                // <span class="fas fa-sad-tear"></span>
                'error': 'fas fa-sad-tear',
                // 正在维修
                // <span class="fas fa-cogs"></span>
                'setting': 'fas fa-cogs',
            };
            ins.find('.fastoast-icon > span').attr('class', iconMap[opts.icon]);
            ins.find('.fastoast-text').html(opts.title);
            mask.fadeIn('fast');

            if (opts.timer > 0) {
                setTimeout(function () {
                    mask.fadeOut('fast');
                    opts.onClose();
                }, opts.timer);
            }

            return {
                close: function() {
                    mask.fadeOut('fast');
                }
            };
        }
    }
};

var commonui = {
    pagination: function(options) {
        var defaultOptions = {
            // horizontal 横向
            // vertical 纵向
            style: 'horizontal',
            pageIndex: 0,
            pageSize: 10,
            totalSize: 0,
            clickCallback: function(index) { }
        };
        var opts = $.extend(defaultOptions, options);
        opts.totalSize = opts.totalSize ? opts.totalSize : 1;
        var page = Math.floor(opts.totalSize / opts.pageSize) + ((opts.totalSize % opts.pageSize) > 0 ? 1 : 0);

        var pIndex = opts.pageIndex;
        var sliceBegin = pIndex - 5;
        var sliceEnd = pIndex + 5 + 1;
        var maxIndex = page - 1;

        if (sliceBegin < 0) {
            sliceEnd += Math.abs(sliceBegin);
            sliceBegin = 0;
        }

        var list = [];
        for (var i = 0 ; i < page ; ++ i) {
            list.push(i);
        }

        // console.log('pagination info:', 'opts', opts);
        // console.log('pagination info:', 'page', page);
        // console.log('pagination info:', 'pIndex', pIndex);
        // console.log('pagination info:', 'sliceBegin', sliceBegin);
        // console.log('pagination info:', 'sliceEnd', sliceEnd);

        var element = $('<div/>');
        var element1 = null;
        var element2 = null;
        var element3 = null;
        switch (opts.style) {
            case 'vertical':
                element1 = $('<div class="btn-group-vertical btn-block"/>').appendTo(element);
                element2 = $('<div class="btn-group-vertical btn-block"/>').appendTo(element);
                element3 = $('<div class="btn-group-vertical btn-block"/>').appendTo(element);
                break;
            case 'horizontal':
            default:
                element1 = $('<div class="btn-group"/>').css('margin-right', '6px').appendTo(element);
                element2 = $('<div class="btn-group"/>').css('margin-right', '6px').appendTo(element);
                element3 = $('<div class="btn-group"/>').css('margin-right', '6px').appendTo(element);
                break;
        }

        element1.append('<button type="button" class="btn btn-block btn-warning" data-index="0">首页</button>');
        element1.append(
            $('<button type="button" class="btn btn-block btn-warning">上一页</button>')
                .attr('data-index', (function() {
                    if (opts.pageIndex - 1 < 0) {
                        return 0;
                    }
                    return opts.pageIndex - 1;
                })())
        );
        list.slice(sliceBegin, sliceEnd).forEach(function(m, i) {
            if (m === opts.pageIndex) {
                element2.append(
                    $('<button type="button" class="btn btn-block btn-success" style="font-weight: bold;"/>')
                        .attr('data-index', m)
                        .html(m + 1)
                );
            } else {
                element2.append(
                    $('<button type="button" class="btn btn-block btn-default"/>')
                        .attr('data-index', m)
                        .html(m + 1)
                );
            }
        });

        element3.append(
            $('<button type="button" class="btn btn-block btn-warning">下一页</button>')
                .attr('data-index', (function() {
                    if (opts.pageIndex + 1 > maxIndex) {
                        return -1;
                    }
                    return opts.pageIndex + 1;
                })())
        );

        if (opts.pageIndex < maxIndex) {
            element3.append(
                $('<button type="button" class="btn btn-block btn-warning">尾页</button>')
                    .attr('data-index', (function() {
                        return maxIndex;
                    })())
            );
        } else {
            element3.append(
                $('<button type="button" class="btn btn-block btn-warning">尾页</button>')
                    .attr('data-index', -1)
            );
        }

        if (opts.style === 'horizontal') {
            $('button', element).removeClass('btn-block');
        }

        $('button', element).click(function(e) {
            var index = $(this).data('index');
            console.log('pagination index:', index);
            if (index == -1) {
                return;
            }
            opts.clickCallback(index);
        });
        return element;
    }
};

























