ViewModel = (function () {
    let _filterText = ko.observable();
    let _artists = ko.observableArray([]);
    let _albums = ko.observableArray([]);
    let _songs = ko.observableArray([]);
    let _currentSong = ko.observable();

    let _shuffleEnabled = ko.observable(false);
    
    // #region "Private methods"

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

    // #endregion

    return {
        FilterText: _filterText,
        ArtistsFiltered: _artistsFiltered,
        Artists: _artists,
        LoadArtists: _loadArtists,
        AlbumsFiltered: _albumsFiltered,
        Albums: _albums,
        LoadAlbums: _loadAlbums,
        SongsFiltered: _songsFiltered,
        Songs: _songs,
        LoadSongs: _loadSongs,
        CurrentSong: _currentSong,
        ShuffleEnabled: _shuffleEnabled
    };
})();