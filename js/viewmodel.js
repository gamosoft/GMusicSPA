ViewModel = (function () {
    let _artistFilterText = ko.observable();
    let _artists = ko.observableArray([]);
    let _albumFilterText = ko.observable();
    let _albums = ko.observableArray([]);
    let _songFilterText = ko.observable();
    let _songs = ko.observableArray([]);
    
    // #region "Private methods"

    function _loadArtists(artists) {
        _artists([]);
        $.each(artists, function (index, artist) {
            let entry = ko.mapping.fromJS(artist);
            _artists.push(entry);
        });
    }

    let _artistsFiltered = ko.computed(function () {
        if (_artistFilterText() == undefined)
            return _artists();
        else
            return ko.utils.arrayFilter(_artists(), function (artist) {
                return artist.name().toLowerCase().indexOf(_artistFilterText().toLowerCase()) > -1;
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
        if (_albumFilterText() == undefined)
            return _albums();
        else
            return ko.utils.arrayFilter(_albums(), function (album) {
                return album.title().toLowerCase().indexOf(_albumFilterText().toLowerCase()) > -1;
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
        if (_songFilterText() == undefined)
            return _songs();
        else
            return ko.utils.arrayFilter(_songs(), function (song) {
                return song.title().toLowerCase().indexOf(_songFilterText().toLowerCase()) > -1;
            });
    });

    // #endregion

    return {
        AlbumFilterText: _albumFilterText,
        AlbumsFiltered: _albumsFiltered,
        Albums: _albums,
        LoadAlbums: _loadAlbums,
        ArtistFilterText: _artistFilterText,
        ArtistsFiltered: _artistsFiltered,
        Artists: _artists,
        LoadArtists: _loadArtists,
        SongFilterText: _songFilterText,
        SongsFiltered: _songsFiltered,
        Songs: _songs,
        LoadSongs: _loadSongs
    };
})();