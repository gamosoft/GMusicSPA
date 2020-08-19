MediaPlayer = (function () {
    let _filterText = ko.observable();
    let _artists = ko.observableArray([]);
    let _albums = ko.observableArray([]);
    let _songs = ko.observableArray([]);
    let _currentSong = ko.observable();
    let _currentSongPosition = ko.observable();
    let _playList = ko.observableArray([]);
    let _shuffleEnabled = ko.observable(false);
    let _muteEnabled = ko.observable(false);
    let _isSongsView = ko.observable(false);
    let _songProgress = ko.observable(0);
    let _volume = ko.observable();
    
    // #region "Observable methods"

    function _loadArtists(artists) {
        _artists([]);
        $.each(artists, function (index, artist) {
            let entry = ko.mapping.fromJS(artist);
            _artists.push(entry);
        });
    }

    let _artistsFiltered = ko.computed(function () {
        if (_filterText() == undefined)
            return _artists();
        else
            return ko.utils.arrayFilter(_artists(), function (artist) {
                return artist.name().toLowerCase().indexOf(_filterText().toLowerCase()) > -1;
            });
    });

    function _loadAlbums(albums) {
        _albums([]);
        $.each(albums, function (index, album) {
            let entry = ko.mapping.fromJS(album);
            _albums.push(entry);
        });
    }

    let _albumsFiltered = ko.computed(function () {
        if (_filterText() == undefined)
            return _albums();
        else
            return ko.utils.arrayFilter(_albums(), function (album) {
                return album.title().toLowerCase().indexOf(_filterText().toLowerCase()) > -1;
            });
    });

    function _loadSongs(songs) {
        _songs([]);
        $.each(songs, function (index, song) {
            let entry = ko.mapping.fromJS(song);
            _songs.push(entry);
        });
    }

    let _songsFiltered = ko.computed(function () {
        if (_filterText() == undefined)
            return _songs();
        else
            return ko.utils.arrayFilter(_songs(), function (song) {
                return song.title().toLowerCase().indexOf(_filterText().toLowerCase()) > -1;
            });
    });

    // let _isSongsView = ko.pureComputed(function () {
    //     return window.location.href.indexOf('#/songs') != -1;
    // }).extend({ notify: 'always' });

    // #endregion

    // #region "Media player methods"
    const _playerRefreshRate = 1000; // Refresh rate of media player in ms
    const _playButtonClass = '.play-button';
    let _mediaPlayer = null;
    let _mediaPlayerSource = null;
    let _updateTimer = null;
    let _repeatOne = false;
    let _repeatAll = false;
    let _playListIndex = 0;

    function _init(mediaPlayerElement) {
        _mediaPlayer = $(mediaPlayerElement)[0];
        _mediaPlayerSource = $(mediaPlayerElement + " > source")[0];
        _volume(_mediaPlayer.volume * 100);

        // When the music stops, attempt to play the next song from the playlist
        $(_mediaPlayer).on('ended', (e) => {
            alert('wtf');
            _next();
        });
    }

    // Playlist management
    function _clearPlayList() {
        _playList([]);
        _currentSong({});
        _playListIndex = 0;
    }

    function _addSong(song) {
        _playList().push(song);
    }

    function _addSongs(songs) {
        _playList(_playList().concat(songs));
    }

    function _playSong(song) {
        // const songId = parseInt($(evt.currentTarget).attr('songId')); // target gives the clicked element, currentTarget gives the element the event is attached to
        // const song = $(evt.currentTarget).attr('url');
        // const song = $(control).attr('url');

        // const song = ko.mapping.toJS(ko.dataFor(control));
        // const song = ko.unwrap(ko.dataFor(control));

        _stop();        
        _clearPlayList();
        _addSong(ko.mapping.toJS(song));
        _play();
    }

    function _play() {
        if (_playList().length == 0)
            return; // TODO: Check to pause after removing from playlist al songs???
        
        let _playButtons = $(_playButtonClass); // All play buttons in the page, need to do it here since it must be reevaluated due to possible new elements
        if (_mediaPlayer.paused) {
            let song = _playList()[_playListIndex];
            if ($(_mediaPlayer).attr('src') != song.url) {// To allow for pause, otherwise resuming starts over
                $(_mediaPlayer).attr('src', song.url);
            }
            // if (_mediaPlayerSource.src != song.url) {// To allow for pause, otherwise resuming starts over
            //     _mediaPlayerSource.src = song.url;
            //     _mediaPlayer.load();
            // }

            _currentSong(song);

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

    async function _playAlbum(album, event, shuffle) { // (control, shuffle) {
        // const album = ko.mapping.toJS(ko.dataFor(control));
        // the event comes from KO

        _stop();
        _clearPlayList();

        const songsData = await API.LoadSongs(album.albumId());
        _addSongs(songsData);

        if (shuffle)
             _shuffle(true);

        _play();
    }

    async function _shuffleAlbum(album, event) {
        await _playAlbum(album, event, true);
    }

    function _stop() {
        let _playButtons = $(_playButtonClass); // All play buttons in the page
        $(_playButtons).removeClass('fa-pause-circle').addClass('fa-play-circle');
        _mediaPlayer.pause();
        _mediaPlayer.currentTime = 0;
        clearInterval(_updateTimer);
        _updateTimer = null;
        $(_mediaPlayer).attr('src', null);
        // _mediaPlayerSource.src = '';

        _songProgress(0);
        _currentSong({});
        _currentSongPosition(`${'0'.toMMSS()} / ${'0'.toMMSS()}`);
    }

    function _updateSongProgress(forceUpdate) {
        if (!forceUpdate && !_updateTimer)
            return;

        let totalTime = _mediaPlayer.duration;
        let currentTime = _mediaPlayer.currentTime;
        let percentage = Math.floor((currentTime / totalTime) * 100);

        _songProgress(percentage);
        _currentSongPosition(`${currentTime.toString().toMMSS()} / ${totalTime.toString().toMMSS()}`);

        if (currentTime >= totalTime) { // Song finished
        // if (_mediaPlayer.ended) { // Song finished (doesn't seem to work)
            _stop();

            if (_playListIndex < _playList.length - 1)
                _next();
            else
                _playListIndex = 0; // If at the end, start over ???
        }
    }

    function _jumpTo(pixel, elementWidth) {
        if (!$(_mediaPlayer).attr('src'))
            return;
        // if (!_mediaPlayerSource.src)
        //     return;
        
        let percentage = (pixel / elementWidth) * 100;
        let totalTime = _mediaPlayer.duration;
        let currentTime = (percentage / 100) * totalTime;
        _mediaPlayer.currentTime = currentTime;
        _songProgress(percentage);
    }

    function _previous() {
        _playListIndex--;
        if (_playListIndex < 0) {
            _playListIndex = 0;
            return;
        }

        _stop();
        _play();
    }

    function _next() {
        _playListIndex++;
        if (_playListIndex >= _playList().length) {
            _playListIndex = _playList().length - 1;
            return;
        }

        _stop();
        _play();
    }

    function _shuffle(shuffle) {
        if (typeof shuffle !== 'boolean') // Check whether it has boolean value passed or not, if invoked from KO will contain the object
            _shuffleEnabled(!_shuffleEnabled());
        else
            _shuffleEnabled(shuffle);
        _playList().shuffle(); // This modifies the original array!
        // TODO: reindex the current song
    }

    function _repeat() {
        alert('not implemented');
    }

    function _setVolume(value) {
        _volume(value);
        _mediaPlayer.volume = _volume() / 100;
    }

    function _toggleMute() {
        _muteEnabled(!_muteEnabled());
        _mediaPlayer.muted = _muteEnabled();
    }

    // #endregion

    return {
        // Data related methods
        FilterText: _filterText,
        ShuffleEnabled: _shuffleEnabled,
        MuteEnabled: _muteEnabled,
        ArtistsFiltered: _artistsFiltered,
        Artists: _artists,
        AlbumsFiltered: _albumsFiltered,
        Albums: _albums,
        SongsFiltered: _songsFiltered,
        Songs: _songs,
        CurrentSong: _currentSong,
        PlayList: _playList,
        IsSongsView: _isSongsView,
        LoadArtists: _loadArtists,
        LoadAlbums: _loadAlbums,
        LoadSongs: _loadSongs,
        // Media player methods
        SongProgress: _songProgress,
        CurrentSongPosition: _currentSongPosition,
        Volume: _volume, // 0 .. 100
        Init: _init,
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
        ToggleMute: _toggleMute,
        Repeat: _repeat,
        SetVolume: _setVolume,
        UpdateSongProgress: _updateSongProgress,
        JumpTo: _jumpTo
    };
})();

/*

TODO: video thumbnail, iOS lock screen

https://stackoverflow.com/questions/54462253/can-html5-in-the-browser-play-continuous-audio-on-ios-lock-screen

Several viewmodels same element?

Maybe use "id" instead of "albumId" for example, if using JSON server to use routes /albums/3 instead of albums?albumId=3

SORT queries:
http://localhost:8888/albums?_sort=title&_order=desc

.ontimeupdate = function
.ended (property and event)
.onpause
.loop

TODO: minify/uglify all CSS and JS files (use maps for variable names?)
https://www.npmjs.com/package/terser#compress-options

*/