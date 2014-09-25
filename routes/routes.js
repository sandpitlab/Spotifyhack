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
	var user;

	// route for home page
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// route for showing the profile page
	app.get('/profile', isLoggedIn, function (req, res) {
		user = user || req.user;
		spotify.getTopTracksFromPlaylists(user, 20, function (err, tracks) {
			if (err) {
				res.status(500).send(err);
			} else {
				res.render('profile.ejs', {user: user, tracks: tracks});
			}
		});
	});

	app.post('/mytracks', isLoggedIn, function (req, res) {
		user = user || req.user;

		spotify.addTracksToPlaylist(req.body.tracks, function (err, playlistId) {
			if (err) {
				res.status(500).send(err);
			} else {
				console.log('redirecting to /pitspot/' + playlistId);
				res.send({url: '/pitspot/' + playlistId});
			}
		});
	});

	app.get('/pitspot/:id', isLoggedIn, function (req, res) {
		user = user || req.user;

		spotify.getAllTracksFromPlaylist(user.spotify.id, req.params.id, function (err, tracks) {
			if (err) {
				res.status(500).send(err);
			} else {
				console.log('all done');
				res.render('pitspot.ejs', {playlist: 'The PitSpot', tracks: tracks});
			};
		});
	});

	// route for logging out
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});
}