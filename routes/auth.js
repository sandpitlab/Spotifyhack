module.exports = function(app, passport) {

	// route for spotify authentication and login
	app.get('/auth/spotify', passport.authenticate('spotify', {
		scope: 'playlist-modify-public playlist-modify-private'
	}));

	// handle the callback after spotify has authenticated the user
	app.get('/auth/spotify/callback',
		passport.authenticate('spotify', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}), function(req, res) {
			log('HELLO!')
		});
};
