(function () {
  var audio,
      previews = document.querySelectorAll('.preview')
      addTracksBtn = document.querySelector('#addtracks');

  function play(url) {
    stop();

    audio = new Audio(url);
    audio.play();
  }

  function stop() {
    if (audio) {
      audio.pause();
      audio = null;
    }
  }

  function togglePreviewState(el) {
    if (!audio) {
      el.text = 'Preview';
    } else {
      el.text = 'Stop';
    }
  }

  function previewClick(el) {
    if (el.text === 'Preview') {
      console.log('playing');
      play(el.href);
    } else {
      stop();
      console.log('stopping');
    }

    togglePreviewState(el);
  }

  function addTracks(tracks) {

  }

  Array.prototype.forEach.call(previews, function (el, idx) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      previewClick(e.target);
    });
  });

  addTracksBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var tracks = document.querySelectorAll('.track');
    var trackURIs = Array.prototype.map.call(tracks, function (item) {
      return item.dataset.trackUris;
    });

    var request = new XMLHttpRequest();
    request.open('POST', '/mytracks', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    request.onload = function (e) {
      var data = request.response;
      var redirect = JSON.parse(data);
      window.location = redirect.url;
    }

    request.send(JSON.stringify({tracks: trackURIs}));
  });

}())