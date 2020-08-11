MediaPlayer = (function () {

    const _playButtonClass = '.play-button';
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

        let _playButtons = $(_playButtonClass); // All play buttons in the page, need to do it here since it must be reevaluated due to possible new elements
        if (_mediaPlayer.paused) {
            $('#nowPlaying').show();
            $(_playButtons).removeClass('fa-play-circle').addClass('fa-pause-circle');
            _mediaPlayer.play();
        } else {
            $('#nowPlaying').hide();
            $(_playButtons).removeClass('fa-pause-circle').addClass('fa-play-circle');
            _mediaPlayer.pause();
        }
    }

    function _stop() {
        let _playButtons = $(_playButtonClass); // All play buttons in the page
        _mediaPlayer.pause();
        _mediaPlayer.currentTime = 0;
        $('#nowPlaying').hide();
        $(_playButtons).removeClass('fa-pause-circle');
        $(_playButtons).addClass('fa-play-circle');        
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
        Repeat: _repeat
    };
})();