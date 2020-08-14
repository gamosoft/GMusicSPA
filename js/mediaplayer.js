MediaPlayer = (function () {

    const _playerRefreshRate = 1000; // Refresh rate of media player in ms
    const _playButtonClass = '.play-button';
    let _mediaPlayer = $('#musicPlayer')[0];
    let _updateTimer = null;
    let _shuffleEnabled = false;
    let _repeatOne = false;
    let _repeatAll = false;

    let _playList = [];
    let _currentSong = 0;

    // Playlist management
    function _clearPlayList() {
        _playList = [];
        _currentSong = 0;
    }

    function _addSong(song) {
        _playList.push(song);
    }

    function _addSongs(songs) {
        _playList = _playList.concat(songs);
    }

    function _playSong(control) {
        // const songid = parseInt($(evt.currentTarget).attr('songid')); // target gives the clicked element, currentTarget gives the element the event is attached to
        // const song = $(evt.currentTarget).attr('url');
        // const song = $(control).attr('url');

        const song = ko.mapping.toJS(ko.dataFor(control));
        // const song = ko.unwrap(ko.dataFor(control));

        _stop();        
        _clearPlayList();
        _addSong(song);
        _play();
    }

    function _play() {
        if (_playList.length == 0)
            return; // TODO: Check to pause after removing from playlist al songs???
        
        let _playButtons = $(_playButtonClass); // All play buttons in the page, need to do it here since it must be reevaluated due to possible new elements
        if (_mediaPlayer.paused) {
            let song = _playList[_currentSong];
            if ($(_mediaPlayer).attr('src') != song.url) {// To allow for pause, otherwise resuming starts over
                $(_mediaPlayer).attr('src', song.url);

            }

            $('#currentSong').text(song.title); // TODO: Figure this out maybe with bindings
            $('#currentArtist').text(song.artistid); // TODO: Figure this out maybe with bindings
            $('#currentAlbum').text(song.artistid); // TODO: Figure this out maybe with bindings

            $(_playButtons).removeClass('fa-play-circle').addClass('fa-pause-circle');
            _mediaPlayer.play();
            _updateTimer = setInterval(_updateSongProgress, _playerRefreshRate);
        } else {    
            $(_playButtons).removeClass('fa-pause-circle').addClass('fa-play-circle');
            _mediaPlayer.pause();
            clearInterval(_updateTimer);
            _updateTimer = null;
        }
    }

    async function _playAlbum(control, shuffle) {
        const album = ko.mapping.toJS(ko.dataFor(control));
        const albumId = album.albumid; // Watch our for lowercase, etc

        _stop();
        _clearPlayList();

        const songsData = await API.LoadSongs(albumId);
        _addSongs(songsData);

        if (shuffle)
            _shuffle();

        _play();
    }

    async function _shuffleAlbum(control) {
        await _playAlbum(control, true);
    }

    function _stop() {
        let _playButtons = $(_playButtonClass); // All play buttons in the page
        $(_playButtons).removeClass('fa-pause-circle').addClass('fa-play-circle');
        _mediaPlayer.pause();
        _mediaPlayer.currentTime = 0;
        clearInterval(_updateTimer);
        _updateTimer = null;
        $('#songProgress').css('width', '0%');

        $('#currentSong').html('&nbsp'); // To keep the spacing
        $('#currentArtist').html('&nbsp'); // TODO: Remove this after bindings in place
        $('#currentAlbum').html('&nbsp'); // To keep the spacing

        $('#currentSongDuration').text(`${'0'.toMMSS()} / ${'0'.toMMSS()}`);
    }

    function _updateSongProgress(forceUpdate) {
        if (!forceUpdate && !_updateTimer)
            return;

        let totalTime = _mediaPlayer.duration;
        let currentTime = _mediaPlayer.currentTime;
        let percentage = Math.floor((currentTime / totalTime) * 100);

        $('#songProgress').css('width', `${percentage}%`);

        $('#currentSongDuration').text(`${currentTime.toString().toMMSS()} / ${totalTime.toString().toMMSS()}`);

        if (currentTime >= totalTime) { // Song finished
            _stop();

            if (_currentSong < _playList.length - 1)
                _next();
            else
                _currentSong = 0; // If at the end, start over
        }
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
        _currentSong--;
        if (_currentSong < 0) {
            _currentSong = 0;
            return;
        }

        _stop();
        _play();
    }

    function _next() {
        _currentSong++;
        if (_currentSong >= _playList.length) {
            _currentSong = _playList.length - 1;
            return;
        }

        _stop();
        _play();
    }

    function _shuffle() {
        _shuffleEnabled = !_shuffleEnabled;
        _playList.shuffle(); // This modifies the original array!
        // TODO: reindex the current song
    }

    function _repeat() {
        alert('not implemented');
    }

    // When the music stops, attempt to play the next song from the playlist
    $(_mediaPlayer).on('ended', (e) => {
        _next();
    });

    return {
        PlaySong: _playSong, // Adds and plays
        PlayAlbum: _playAlbum, // Adds and plays
        ShuffleAlbum: _shuffleAlbum, // Adds, shuffles and plays
        ClearPlayList: _clearPlayList,
        AddSong: _addSong,
        AddSongs: _addSongs,
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