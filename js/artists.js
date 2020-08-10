ArtistsViewModel = (function () {
    let _artistFilterText = ko.observable();
    let _artists = ko.observableArray([]);

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
                return artist.artistName().toLowerCase().indexOf(_artistFilterText().toLowerCase()) > -1;
            });
    });

    return {
        ArtistFilterText: _artistFilterText,
        ArtistsFiltered: _artistsFiltered,
        Artists: _artists,
        LoadArtists: _loadArtists
    };
})();