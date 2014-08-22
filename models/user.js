var mongoose = require('mongoose'),
	bcrypt   = require('bcrypt-nodejs'),
	Schema = mongoose.Schema;

// create a user model
var User = new Schema({

	spotify: {
		id: String,
		token: String
	},
	created: { type: Date, default: Date.now }

});


// generating a hash
User.methods.generateHash = function(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
		return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', User);

module.exports = User;
