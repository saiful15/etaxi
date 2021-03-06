var mongoose = require( 'mongoose' );
var gracefulShutdown;
mongoose.Promise = global.Promise;
var dbURI = 'mongodb://localhost/etaxiaccounting';
mongoose.connect(dbURI, {
	useMongoClient: true,
});

mongoose.connection.on('connected', function () {
	console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});

gracefulShutdown = function (msg, callback) {
	mongoose.connection.close(function () {
	console.log('Mongoose disconnected through ' + msg);
	callback();
	});
};

// For nodemon restarts
process.once('SIGUSR2', function () {
	gracefulShutdown('nodemon restart', function () {
	process.kill(process.pid, 'SIGUSR2');
	});
});

// For app termination
process.on('SIGINT', function() {
	gracefulShutdown('app termination', function () {
	process.exit(0);
	});
});

// For Heroku app termination
process.on('SIGTERM', function() {
	gracefulShutdown('Heroku app shutdown', function () {
	process.exit(0);
	});
});

/*
|----------------------------------------------------------------
| Requiring schema model.
|----------------------------------------------------------------
 */
require("./users");
require('./business-profile');
require('./insurance');
require('./lisence');
require('./additionalinfo');
require('./incomes');
require('./expenses');
require('./message');
require('./vehicles');
require('./contact');
require('./accountant');
require('./password-reset');
require('./docs');
require('./statements');
