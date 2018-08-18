var express = require('express');
var cookieParser = require('cookie-parser');
var connect = require('connect');
var app = express();

module.exports = function(configure) {
	// all environments
	app.set('port', configure.listenport);
	app.set('views', configure.views);
	app.set('view engine', configure.vengine);
	// app.use(express.favicon());
	// app.use(express.logger('dev'));
	app.use(express.json());
	// app.use(express.bodyParser({uploadDir: configure.uploadDir.tmp}));
	// app.use(express.urlencoded());
	// app.use(express.methodOverride());
	// app.use(express.cookieParser('sctalk admin manager'));
	// app.use(express.cookieParser());
	// app.use(express.cookieSession({ secret: 'sso', cookie: { maxAge: 8 * 60 * 60 * 1000 }}));// 8小时
	app.use(cookieParser());
    app.use(connect.session({ secret: 'web.front', key: 'NSESSIONID', cookie: { maxAge: 8 * 60 * 60 * 1000 }}));// 8小时
	// app.use(express.session());
	// app.use(app.router);
	// app.use(express.static(configure.staticfile));
	app.use(express.static(configure.staticfile));

	// development only
	// if ('development' == app.get('env')) {
	// 	app.use(express.errorHandler());
	// }

	return app;
}