//访问权限控制
//判断是否已经登录

//拦截器名[authority]-interceptor.js
//必须是exports.func,一个文件只能是一个拦截器

//拦截器实现
exports.func = function(req, res, next) {
	if (req.session.login) {
		next();
	} else {
        res.send({
            data: '',
            status: 80403,
            message: '未登录'
        });
	}
};