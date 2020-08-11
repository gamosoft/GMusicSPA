MediaPlayer = (function () {

    const _playButtonClass = '.play-button';
    let _mediaPlayer = $('#musicPlayer')[0];
    let _updateTimer = null;

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

        let _playButtons = $(_playButtonClass); // All play buttons in the page, need to do it here since it must be reevaluated due to possible new elements
        if (_mediaPlayer.paused) {
            $('#nowPlaying').show();
            $(_playButtons).removeClass('fa-play-circle').addClass('fa-pause-circle');
            _mediaPlayer.play();
            _updateTimer = setInterval(_updateSongProgress, 1000); // Refresh time in milliseconds
        } else {
            $('#nowPlaying').hide();
            $(_playButtons).removeClass('fa-pause-circle').addClass('fa-play-circle');
            _mediaPlayer.pause();
            clearInterval(_updateTimer);
            _updateTimer = null;
        }
    }

    function _stop() {
        let _playButtons = $(_playButtonClass); // All play buttons in the page
        $('#nowPlaying').hide();
        $(_playButtons).removeClass('fa-pause-circle').addClass('fa-play-circle');
        _mediaPlayer.pause();
        _mediaPlayer.currentTime = 0;
        clearInterval(_updateTimer);
        _updateTimer = null;
        _updateSongProgress(true);
    }

    function _updateSongProgress(forceUpdate) {
        if (!forceUpdate && !_updateTimer)
            return;

        let totalTime = _mediaPlayer.duration;
        let currentTime = _mediaPlayer.currentTime;
        let percentage = Math.floor((currentTime / totalTime) * 100);

        $('#songProgress').css('width', `${percentage}%`);
    }

    function _playAlbum(albumId) {
        alert('not implemented');
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

    function _repeat() {
        alert('not implemented');
    }

    return {
        PlaySong: _playSong,
        PlayAlbum: _playAlbum,
        Play: _play,
        Stop: _stop,
        Previous: _previous,
        Next: _next,
        Shuffle: _shuffle,
        Repeat: _repeat,
        UpdateSongProgress: _updateSongProgress
    };
})();