const baseUrl = 'https://my-json-server.typicode.com/gamosoft/GMusicSPA'
const albumsUrl = `${baseUrl}/albums`;
const artistsUrl = `${baseUrl}/artists`;
const songsUrl = `${baseUrl}/songs`;

// Filter like this
// https://my-json-server.typicode.com/gamosoft/GMusicSPA/songs?title=Juice
// TODO: Cache of requests

function trim(value, length) {
    return value.length > length
        ? value.substring(0, length - 3) + "..."
        : value;
}

async function loadAlbums(artistId, albumId) {
    // Fetch album information
    let url = artistId
            ? `${albumsUrl}?artistid=${artistId}`
            : albumsUrl;

    url = albumId
            ? `${url}&id=${albumId}`
            : url;

    const response = await fetch(url);
    const data = await response.json();
    AlbumsViewModel.LoadAlbums(data);
}

async function loadArtists() {
    // Fetch artist information
    const response = await fetch(`${artistsUrl}`);
    const data = await response.json();
    ArtistsViewModel.LoadArtists(data);
}

async function loadSongs(albumId) {
    // Fetch song information
    let url = albumId
            ? `${songsUrl}?albumid=${albumId}`
            : songsUrl;

    const response = await fetch(url);
    const data = await response.json();
    SongsViewModel.LoadSongs(data);
    $('.song').click(MediaPlayer.PlaySong);
}

$(() => {
    app.run('#/albums');
    $('#nowPlaying').hide();
    ko.applyBindings(AlbumsViewModel, document.getElementById('AlbumsViewModel'));
    ko.applyBindings(ArtistsViewModel, document.getElementById('ArtistsViewModel'));
    ko.applyBindings(SongsViewModel, document.getElementById('SongsViewModel'));
});