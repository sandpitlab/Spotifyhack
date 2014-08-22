module.exports = exports = {};

var request = require('request');

exports.getTracksFromPlaylists = function (user, callback) {
	var opts = {
		url: 'https://api.spotify.com/v1/users/' + user.spotify.id + '/playlists',
		headers: {
			'Authorization': 'Bearer ' + user.spotify.token
		},
		json: true
	};

	request.get(opts, function (err, res, playlists) {
		var playlistId;

		if (err) {
			callback(err);
		} else {
			playlistId = playlists.items[1].id;

			opts.url = 'https://api.spotify.com/v1/users/' + user.spotify.id + '/playlists/' + playlistId + '/tracks';

			request.get(opts, function (err, res, tracks) {
				if (err) {
					callback(err);
				} else {
					tracks = tracks.items.map(function (item) {
						return item.track;
					});

					callback(null, {
						user : user,
						playlist: playlists.items[1],
						tracks: tracks
					});
				}
			})
		}
	});
}