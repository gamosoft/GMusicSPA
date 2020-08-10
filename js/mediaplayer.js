MediaPlayer = (function () {

    function _playSong(evt) {
        const id = parseInt($(evt.currentTarget).attr('id')); // target gives the clicked element, currentTarget gives the element the event is attached to
        const url = $(evt.currentTarget).attr('url');
        _play(url);
    }

    function _play(url) {
        if (url)
            $('#musicPlayer').attr('src', url);
        
        if (!$('#musicPlayer').attr('src'))
            return;
            
        $('#musicPlayer')[0].play();
        $('#nowPlaying').show();
    }

    function _pause() {
        $('#musicPlayer')[0].pause();
        $('#nowPlaying').hide();
    }

    function _stop() {
        $('#musicPlayer')[0].pause();
        $('#musicPlayer')[0].currentTime = 0;
        $('#nowPlaying').hide();
    }

    function _previous() {
        alert('not implemented');
    }

    function _next() {
        alert('not implemented');
    }

    return {
        PlaySong: _playSong,
        Play: _play,
        Pause: _pause,
        Stop: _stop,
        Previous: _previous,
        Next: _next,
    };
})();