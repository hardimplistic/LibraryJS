var timeStart = new Date();
// var env = process.env.NODE_ENV || 'development';
global.configure = require('./configure')['development'];
// Starting Server
require('./core')(global.configure);
var timeEnd = new Date();
console.log(timeEnd.getTime() - timeStart.getTime() + ' ms');
