MediaPlayer = (function () {

    let _mediaPlayer = $('#musicPlayer')[0];

    function _playSong(evt) {
        const songid = parseInt($(evt.currentTarget).attr('songid')); // target gives the clicked element, currentTarget gives the element the event is attached to
        const url = $(evt.currentTarget).attr('url');
        _play(url);
    }

    function _play(url) {
        if (url)
            $(_mediaPlayer).attr('src', url);
        
        if (!$(_mediaPlayer).attr('src'))
            return;

        _mediaPlayer.play();
        $('#nowPlaying').show();
    }

    function _pause() {
        if (_mediaPlayer.paused && _mediaPlayer.currentTime != 0)
            _play()
        else {
            _mediaPlayer.pause();
            $('#nowPlaying').hide();
        }
    }

    function _stop() {
        _mediaPlayer.pause();
        _mediaPlayer.currentTime = 0;
        $('#nowPlaying').hide();
    }

    function _previous() {
        alert('not implemented');
    }

    function _next() {
        alert('not implemented');
    }

    function _shuffle() {
        alert('not implemented');
    }

    return {
        PlaySong: _playSong,
        Play: _play,
        Pause: _pause,
        Stop: _stop,
        Previous: _previous,
        Next: _next,
        Shuffle: _shuffle
    };
})();