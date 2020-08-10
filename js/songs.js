SongsViewModel = (function () {
    let _songFilterText = ko.observable();
    let _songs = ko.observableArray([]);

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

    return {
        SongFilterText: _songFilterText,
        SongsFiltered: _songsFiltered,
        Songs: _songs,
        LoadSongs: _loadSongs
    };
})();