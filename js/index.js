const baseUrl = 'https://my-json-server.typicode.com/gamosoft/GMusicSPA'
const albumsUrl = `${baseUrl}/albums`;
const artistsUrl = `${baseUrl}/artists`;
const songsUrl = `${baseUrl}/songs`;

// Filter like this
// https://my-json-server.typicode.com/gamosoft/GMusicSPA/songs?title=Juice

function trim(value, length) {
    return value.length > length
            ? value.substring(0, length - 3) + "..."
            : value;
}

async function loadAlbums() {
    // Fetch album information
    const response = await fetch(`${albumsUrl}`);
    const data = await response.json();
    AlbumsViewModel.LoadAlbums(data);
}

async function loadSongs() {
    // Fetch song information
    const response = await fetch(`${songsUrl}`);
    const data = await response.json();
    SongsViewModel.LoadSongs(data);
}

$(() => {
    loadAlbums().then(ko.applyBindings(AlbumsViewModel, document.getElementById('AlbumsViewModel')));
    loadSongs().then(ko.applyBindings(SongsViewModel, document.getElementById('SongsViewModel')));
});