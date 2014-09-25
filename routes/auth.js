module.exports = function(app, passport) {
	// handle the callback after spotify has authenticated the user
	app.get('/auth/spotify/callback',
		passport.authenticate('spotify', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}), function(req, res) {
			log('HELLO!')
		});
};
