const baseUrl = 'https://my-json-server.typicode.com/gamosoft/GMusicSPA'
const albumsUrl = `${baseUrl}/albums`;
const artistsUrl = `${baseUrl}/artists`;
const songsUrl = `${baseUrl}/songs`;

let app = $.sammy(function() {
    this.get('#/albums', function () {
        $('#ArtistsViewModel').hide();
        $('#AlbumsViewModel').show();
        $('#SongsViewModel').hide();
        $('.nav-item').removeClass('active');
        $('#albumsLink').addClass('active');
    });
    this.get('#/artists', function () {
        $('#ArtistsViewModel').show();
        $('#AlbumsViewModel').hide();
        $('#SongsViewModel').hide();
        $('.nav-item').removeClass('active');
        $('#artistsLink').addClass('active');
    });
    this.get('#/songs', function () {
        $('#ArtistsViewModel').hide();
        $('#AlbumsViewModel').hide();
        $('#SongsViewModel').show();
        $('.nav-item').removeClass('active');
        $('#songsLink').addClass('active');
    });
});

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
    $('.song').click(MediaPlayer.PlaySong);
}

$(() => {
    app.run('#/albums');
    $('#nowPlaying').hide();
    loadAlbums().then(ko.applyBindings(AlbumsViewModel, document.getElementById('AlbumsViewModel')));
    loadArtists().then(ko.applyBindings(ArtistsViewModel, document.getElementById('ArtistsViewModel')));
    loadSongs().then(ko.applyBindings(SongsViewModel, document.getElementById('SongsViewModel')));
});