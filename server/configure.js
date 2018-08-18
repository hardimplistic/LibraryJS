/*
Server Level Configuration
*/

var path = require('path');
var rootdir = path.normalize(__dirname)

module.exports = {
	development: {
		// Application Root Folder
		rootdir: rootdir

		// Server port
		, listenport: 8088

		// , proxy: {
		// 	enabled: true,
		// 	uri: '/rest/',
		// 	target: 'http://localhost:8889/rest/'
		// }

		// Server start event
		, serverevent: path.join(rootdir, 'app/event')

		// Application Level Configuration
		// , appconfig: path.join(rootdir, 'app/R')

		// Views File Path
		, views: path.join(rootdir, 'views')

		// View engine
		, vengine: 'ejs'

		// browser get static file folder
		, staticfile: path.join(rootdir, 'public')

		, uploadDir: {
			  tmp:    path.join(rootdir, 'public/upload/tmp')
			, avatar: path.join(rootdir, 'public/upload/avatar')
			, weixin: path.join(rootdir, 'public/wx')
		}

		// controllers
		, controllers: path.join(rootdir, 'app/controllers')

		// Interceptor
		, interceptors : path.join(rootdir, 'app/interceptors')

		// default Interceptor
		//默认拦截器(全局拦截器),可以为null/单独/组
		, defaultinter: 'default'

	}
}