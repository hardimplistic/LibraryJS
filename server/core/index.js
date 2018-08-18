module.exports = function(configure) {

	// System Level Configuration
    require('./plugins');

	// Application Level Configuration
    require('../app/R');

	// express
	var app = require('./express')(configure);

	// interceptors
	var interceptors = require('./interceptors')(configure);

	// Combination of interceptor and controller
	require('./controllers')(app, interceptors, configure);

	var port = configure.listenport;

	app.listen(port);

	console.log('application server started on port ' + port);

	exports = module.exports = app;

	// execute server event onec
	require(configure.serverevent)(configure);

}