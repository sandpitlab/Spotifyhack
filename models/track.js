var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// create a user model
var Track = new Schema({


	created: { type: Date, default: Date.now }
});

var Track = mongoose.model('Track', Track);
module.exports = Track;
