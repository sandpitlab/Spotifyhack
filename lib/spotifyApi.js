module.exports = exports = {};

exports.getAllTracksFromPlaylist = getAllTracksFromPlaylist;
exports.getTopTracksFromPlaylists = getTopTracksFromPlaylists;
exports.addTracksToPlaylist = addTracksToPlaylist;

var request = require('request');
var async = require('async');
var config = require('config').get('Pitspot');

var userToken, pitspotToken;

(function () {
	var payload = config.spotify.clientID + ":" + config.spotify.clientSecret;
	var encodedPayload = new Buffer(payload).toString("base64");
	
	log(encodedPayload);

	var opts = {
		url: "https://accounts.spotify.com/api/token",
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			"Authorization": "Bearer " + encodedPayload
		},
		body: "grant_type=client_credentials&scope=playlist-modify-public playlist-modify-private"
	};

	request(opts, function (err, res, body) {
		log('error', err);
		log('status', res.statusCode);
		log('body', body);
	});
})();

var getUsersPlaylists = function getUsersPlaylists(userId, callback) {
	var opts = {
		url: 'https://api.spotify.com/v1/users/' + userId + '/playlists',
		json: true,
		headers: {
			'Authorization': 'Bearer ' + userToken
		}
	};

	request(opts, function (err, res, playlists) {
		if (err) {
			callback(err);
		} else {
			callback(null, playlists.items);
		}
	});
}

function getAllTracksFromPlaylist(userId, playListId, callback)  {
	var opts = {
		json: true,
		headers: {
			'Authorization': 'Bearer ' + userToken
		},
		url: 'https://api.spotify.com/v1/users/' + userId + '/playlists/' + playListId + '/tracks'
	};

	request(opts, function (err, res, tracks) {
		if (err) {
			callback(err);
		} else {
			callback(null, tracks.items);
		}
	});
}

var sortAndTrimTracks = function getSortedTracks(tracks, count) {
	var results = tracks.map(function (item) {
		return item.track;
	}).sort(function (a, b) {
		return b.popularity - a.popularity;
	}).slice(0, count);

	return results;
}

var createPitSpotPlaylist = function createPitSpotPlaylist(callback) {
	var opts = {
		url:'https://api.spotify.com/v1/users/thesandpit/playlists',
		method: 'POST',
		headers: {
			'Authorization': 'Bearer ' + pitspotToken
		},
		json: true,
		body: {
			name: 'The PitSpot',
			public: true
		}
	};

	request(opts, function (err, res, playlist) {
		if (err) {
			callback(err);
		} else {
			callback(null, playlist);
		}
	});
}

function addTracksToPlaylist(tracks, callback) {

	createPitSpotPlaylist(function (err, playlist) {
		var opts = {
			url:'https://api.spotify.com/v1/users/thesandpit/playlists/' + playlist.id + '/tracks?uris=' + tracks.join(','),
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + pitspotToken
			}
		};

		request(opts, function (err, res) {
			if (err) {
				callback(err, res.status);
			} else {
				callback(null, playlist.id);
			}
		});
	})
}

var playPlaylist = function playPlaylist() {}

// from all playlists that user owns, gets all tracks, sorts by popularity and returns top <count>
function getTopTracksFromPlaylists(user, count, callback) {
	var playlistIds = [], allTracks = [];
	userToken = user.spotify.token;

	getUsersPlaylists(user.spotify.id, function (err, playlists) {
		if (err) {
			callback(err);
		} else {

			playlists.filter(function (item) {
				return item.owner.id === user.spotify.id;
			}).forEach(function (item) {
				if (item.id !== null) {
					playlistIds.push(item.id);
				}
			});

			async.each(
				playlistIds,
				function (pid, cb) {
					getAllTracksFromPlaylist(user.spotify.id, pid, function (err, tracks) {
						if (err) {
							cb(err)
						} else {
							var trackNames = allTracks.map(function (item) { return item.track.name; });
							tracks.forEach(function (item) {
								if (trackNames.indexOf(item.track.name) === -1) {
									allTracks.push(item);
								}
							});

							cb();
						}
					});
				},
				function (err) {
					if (err) {
						callback(err);
					}	else {
						callback(null, sortAndTrimTracks(allTracks, count));
					}
				}
			);
		}
	});
}
