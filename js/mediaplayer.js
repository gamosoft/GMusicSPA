MediaPlayer = (function () {

    const _playerRefreshRate = 1000; // Refresh rate of media player in ms
    const _playButtonClass = '.play-button';
    let _mediaPlayer = $('#musicPlayer')[0];
    let _updateTimer = null;
    let _shuffleEnabled = false;

    let _playList = []; // TODO: This will have all the song info, for now it's just a url
    let _currentSong = 0;

    // Playlist management
    function _clearPlayList() {
        _playList = [];
    }

    function _addSong(song) {
        _playList.push(song);
    }

    function _addSongs(songs) {
        _playList = _playList.concat(songs);
    }

    function _playSong(evt) {
        const songid = parseInt($(evt.currentTarget).attr('songid')); // target gives the clicked element, currentTarget gives the element the event is attached to
        const song = $(evt.currentTarget).attr('url');
        _play(song);
    }

    function _playAlbum(albumId) {
        alert('not implemented');
    }

    function _play(song) {
        if (song)
            $(_mediaPlayer).attr('src', song);
        
        if (!$(_mediaPlayer).attr('src'))
            return;

        let _playButtons = $(_playButtonClass); // All play buttons in the page, need to do it here since it must be reevaluated due to possible new elements
        if (_mediaPlayer.paused) {
            $('#nowPlaying').show();
            $(_playButtons).removeClass('fa-play-circle').addClass('fa-pause-circle');
            _mediaPlayer.play();
            _updateTimer = setInterval(_updateSongProgress, _playerRefreshRate);
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
        $('#songProgress').css('width', '0%');
    }

    function _updateSongProgress(forceUpdate) {
        if (!forceUpdate && !_updateTimer)
            return;

        let totalTime = _mediaPlayer.duration;
        let currentTime = _mediaPlayer.currentTime;
        let percentage = Math.floor((currentTime / totalTime) * 100);

        $('#songProgress').css('width', `${percentage}%`);

        if (currentTime >= totalTime)
            _stop(); // TODO: Only if nothing more on playlist
    }

    function _jumpTo(pixel) {
        if (!$(_mediaPlayer).attr('src'))
            return;

        let width = parseInt($('#progressBar').css('width'));
        let percentage = (pixel / width) * 100;
        let totalTime = _mediaPlayer.duration;
        let currentTime = (percentage / 100) * totalTime;
        _mediaPlayer.currentTime = currentTime;
        $('#songProgress').css('width', `${percentage}%`);
    }

    function _previous() {
        _stop();
        // const next = _playList.pop();
        const previous = _shuffleEnabled ? 1 : _currentSong--;
        if (previous <= 0) {
            _currentSong = 0;
            return;
        }

        _play(_playList[previous]);
    }

    function _next() {
        _stop();
        // const next = _playList.pop();
        const next = _shuffleEnabled ? 1 : _currentSong++;
        if (next >= _playList.length) {
            _currentSong = _playList.length - 1;
            return;
        }

        _play(_playList[next]);
    }

    function _shuffle() {
        _shuffleEnabled = !_shuffleEnabled;
    }

    function _repeat() {
        alert('not implemented');
    }

    _addSong('./mp3/sample1.mp3');
    _addSong('./mp3/sample2.mp3');
    _addSong('./mp3/sample3.mp3');
    _addSong('./mp3/sample4.mp3');

    // When the music stops, attempt to play the next song from the playlist
    $(_mediaPlayer).on('ended', (e) => {
        _next();
    });

    return {
        PlaySong: _playSong, // Adds and plays
        ClearPlayList: _clearPlayList,
        AddSong: _addSong,
        AddSongs: _addSongs,
        PlayAlbum: _playAlbum,
        Play: _play,
        Stop: _stop,
        Previous: _previous,
        Next: _next,
        Shuffle: _shuffle,
        Repeat: _repeat,
        UpdateSongProgress: _updateSongProgress,
        JumpTo: _jumpTo
    };
})();