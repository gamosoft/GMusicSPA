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

async function loadArtists() {
    // Fetch artist information
    const response = await fetch(`${artistsUrl}`);
    const data = await response.json();
    ArtistsViewModel.LoadArtists(data);
}

async function loadSongs() {
    // Fetch song information
    const response = await fetch(`${songsUrl}`);
    const data = await response.json();
    SongsViewModel.LoadSongs(data);
    $('.song').click(songClicked);
}

function songClicked(evt) {
    const id = parseInt($(evt.currentTarget).attr('id')); // target gives the clicked element, currentTarget gives the element the event is attached to
    const url = $(evt.currentTarget).attr('url');
    play(url);
}

function play(url) {
    $('#musicPlayer').attr('src', url);
    $('#musicPlayer')[0].play();
}

function pause() {
    $('#musicPlayer')[0].pause();
}

function stop() {
    $('#musicPlayer')[0].pause(); // TODO: Stop?
}

$(() => {
    loadAlbums().then(ko.applyBindings(AlbumsViewModel, document.getElementById('AlbumsViewModel')));
    loadArtists().then(ko.applyBindings(ArtistsViewModel, document.getElementById('ArtistsViewModel')));
    loadSongs().then(ko.applyBindings(SongsViewModel, document.getElementById('SongsViewModel')));
});