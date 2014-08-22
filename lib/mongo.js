var mongoose = require('mongoose'),
	symbol = require('log-symbols'),
	configFile = require('config'); // more: https://github.com/lorenwest/node-config

// CONFIG
var config = configFile.get('Pitspot');
var dbName = config.db.name;
var dbPort = config.db.port;
var dbHost = config.db.host;

module.exports = function() {

	mongoose.connect('mongodb://' + dbHost + ':' + dbPort + '/' + dbName, function(err) {
		if (err) {
			log(symbol.warning, "Run 'mongod' and try again");
			process.exit(1);
		}
	});

}
