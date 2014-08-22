var SpotifyStrategy = require('passport-spotify').Strategy;

// load up the user model
var User = require('../models/user.js');
var symbol = require('log-symbols');

// load the auth variables
var configFile = require('config');
var config = configFile.get('Pitspot');

module.exports = function(passport) {

	// used to serialize the user for the session
		passport.serializeUser(function(user, done) {
				done(null, user.id);
		});

		// used to deserialize the user
		passport.deserializeUser(function(id, done) {
				User.findById(id, function(err, user) {
						done(err, user);
				});
		});


		passport.use(new SpotifyStrategy({
			clientID: config.spotify.clientID,
			clientSecret: config.spotify.clientSecret,
			callbackURL: config.spotify.callbackURL

		}, function(token, refreshToken, profile, done) {

		process.nextTick(function() {

			User.findOne({ 'spotify.id' : profile.id }, function(err, user) {
				if (err) { return done(err); }

				if (user) {
					user.spotify.token = token;
					user.save(function (err) {
						if (err)
							throw err;

						return done(null, user);
					});
				} else {
					var newUser = new User();
					newUser.spotify.id = profile.id
					newUser.spotify.token = token

					// save to db
					newUser.save(function(err) {
						if (err)
							throw err;

						log(symbol.success, "User created!");

						// if successful, return the new user
						return done(null, newUser);
					});
				}

			});
		});

	}));

};
