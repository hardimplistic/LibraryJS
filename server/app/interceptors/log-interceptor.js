//日志记录

//拦截器实现
exports.func = function(req, res, next) {
	// console.log('[ log ]', req.url);
	next();
};