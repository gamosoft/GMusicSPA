MediaPlayer = (function () {
    let _filterText = ko.observable();
    let _sortField = ko.observable();
    let _sortOrder = ko.observable(true); // True == ascending
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
    let _currentArtist = ko.observable();
    let _currentAlbum = ko.observable();
    
    // #region "Observable methods"

    function _loadArtists(artists) {
        _artists([]);
        let tempArray = [];
        $.each(artists, function (index, artist) {
            let entry = ko.mapping.fromJS(artist);
            tempArray.push(entry);
        });
        _artists(tempArray);
    }

    let _artistsFiltered = ko.computed(function () {
        if (_filterText() == undefined)
            return _artists();
        else {
            let lowerCaseFilter = _filterText().toLowerCase();
            return ko.utils.arrayFilter(_artists(), function (artist) {
                return artist.name().toLowerCase().indexOf(lowerCaseFilter) > -1;
            });
        }
    });

    function _loadAlbums(albums) {
        _albums([]);
        let tempArray = [];
        $.each(albums, function (index, album) {
            let entry = ko.mapping.fromJS(album);
            tempArray.push(entry);
        });
        _albums(tempArray);
    }

    let _albumsFiltered = ko.computed(function () {
        if (_filterText() == undefined)
            return _albums();
        else {
            let lowerCaseFilter = _filterText().toLowerCase();
            return ko.utils.arrayFilter(_albums(), function (album) {
                return album.title().toLowerCase().indexOf(lowerCaseFilter) > -1;
            });
        }
    });

    function _loadSongs(songs) {
        _songs([]);
        let tempArray = [];
        $.each(songs, function (index, song) {
            let entry = ko.mapping.fromJS(song);
            tempArray.push(entry); // Use a temporary array because if we add items to the observable directly, the computed below fires EVERY TIME
        });
        _songs(tempArray);
    }

    let _songsFiltered = ko.computed(function () {
        // This event fires AS MANY TIMES as items in the list if added individually
        // As items are added to the array on load, this gets invoked, so best using a temporary array to add 
        let results;
        if (_filterText() == undefined)
            results = _songs();
        else {
            let lowerCaseFilter = _filterText().toLowerCase();
            results = ko.utils.arrayFilter(_songs(), function (song) {
                return song.title().toLowerCase().indexOf(lowerCaseFilter) > -1;
            });
        }
        return _sortArray(results);
    });

    function _sortArray(results) {
        if (_sortField())
            results = results.sort((a, b) => b[_sortField()]().toLowerCase() > a[_sortField()]().toLowerCase() ? -1 : 1);
        return _sortOrder() ? results : results.reverse();
    }

    let _toggleOrder = function (vm, control) {
        // vm is the entire viewmodel
        // const songId = parseInt($(evt.currentTarget).attr('id')); // target gives the clicked element, currentTarget gives the element the event is attached to
        // const song = $(evt.currentTarget).attr('url');
        let newOrder = $(control.currentTarget).attr('sortField');
        if (newOrder == _sortField()) {
            _sortOrder(!_sortOrder()); // Inverse order
        } else {
            _sortField(newOrder);
            _sortOrder(true); // Start again with ascending
        }        
    }

    let _sortOrderClass = function (field) {
        if (field != _sortField())
            return '';
            
        return _sortOrder() ? "fa-arrow-up" : "fa-arrow-down";
    };

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
        // const songId = parseInt($(evt.currentTarget).attr('id')); // target gives the clicked element, currentTarget gives the element the event is attached to
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

        const songsData = await API.LoadSongs(album.id());
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
        SortField: _sortField,
        SortOrder: _sortOrder,
        SortOrderClass: _sortOrderClass,
        ToggleOrder: _toggleOrder,
        ShuffleEnabled: _shuffleEnabled,
        MuteEnabled: _muteEnabled,
        ArtistsFiltered: _artistsFiltered,
        Artists: _artists,
        AlbumsFiltered: _albumsFiltered,
        Albums: _albums,
        SongsFiltered: _songsFiltered,
        Songs: _songs,
        CurrentSong: _currentSong,
        CurrentArtist: _currentArtist,
        CurrentAlbum: _currentAlbum,
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

Changing views, if something in the search textbox it STILL filters

Hyperlinks with NO href don't show hand icon on over

SORT queries:
http://localhost:8888/albums?_sort=title&_order=desc

Sorting by numbers does alphabetically (1, 10, 11, 12, 3, 4, ...)
Same for duration?

.ontimeupdate = function
.ended (property and event)
.onpause
.loop

TODO: minify/uglify all CSS and JS files (use maps for variable names?)
https://www.npmjs.com/package/terser#compress-options

*/