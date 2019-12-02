/**
 * 微信小程序本地接口封装
 */

var MiniApp = {
    isMiniEnv: function() {
        return window.__wxjs_environment === 'miniprogram';
    },
    Ready: function (callback, isLogin) {
        if (isLogin) {
            // 检查登录

        } else {
            callback();
        }
    }
};