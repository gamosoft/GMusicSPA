function trim(value, length) {
    return value.length > length
        ? value.substring(0, length - 3) + "..."
        : value;
}

$(() => {
    app.run('#/albums');
    $('#nowPlaying').hide();
    ko.applyBindings(AlbumsViewModel, document.getElementById('albumsList'));
    ko.applyBindings(ArtistsViewModel, document.getElementById('artistsList'));
    ko.applyBindings(SongsViewModel, document.getElementById('songsList'));
});