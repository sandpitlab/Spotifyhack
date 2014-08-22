var request = require('request');
var config = require('config').get('Pitspot');
var spotify = require('../lib/spotifyApi');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

module.exports = function (app) {

	// route for home page
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// route for showing the profile page
	app.get('/profile', isLoggedIn, function (req, res) {
		spotify.getTracksFromPlaylists(req.user, function (err, playlistTrackInfo) {
			if (err) {
				res.status(502).send(err);
			} else {
				res.render('profile.ejs', playlistTrackInfo);
			}
		});
	});

	// route for logging out
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});
}