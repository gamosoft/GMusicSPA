AlbumsViewModel = (function () {
    let _albumFilterText = ko.observable();
    let _albums = ko.observableArray([]);

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

    return {
        AlbumFilterText: _albumFilterText,
        AlbumsFiltered: _albumsFiltered,
        Albums: _albums,
        LoadAlbums: _loadAlbums
    };
})();