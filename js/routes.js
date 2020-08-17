function setActiveLink(item) {
    $('.nav-item').removeClass('active');
    $(item).addClass('active');
}

let app = $.sammy(function () {
    this.get('#/albums', async function () {
        $('.toggle-section').hide();
        $('#albumsList').show();
        setActiveLink('#albumsLink');
        const albumsData = await API.LoadAlbums();
        MediaPlayer.LoadAlbums(albumsData);
    });
    this.get('#/albums/:albumId', async function(context) {
        const albumId = this.params['albumId'];
        $('.toggle-section').hide();
        $('#albumDetail').show();
        $('#songsList').show();
        setActiveLink('#albumsLink');
        const albumData = await API.LoadAlbum(albumId);
        const songsData = await API.LoadSongs(albumId);
        MediaPlayer.LoadAlbums(albumData);
        MediaPlayer.LoadSongs(songsData);
      });
    this.get('#/artists', async function () {
        $('.toggle-section').hide();
        $('#artistsList').show();
        setActiveLink('#artistsLink');
        const artistsData = await API.LoadArtists();
        MediaPlayer.LoadArtists(artistsData);
    });
    this.get('#/artists/:artistId', async function () {
        const artistId = this.params['artistId'];
        $('.toggle-section').hide();
        $('#albumsList').show();
        setActiveLink('#artistsLink');
        const albumsData = await API.LoadAlbums(artistId);
        MediaPlayer.LoadAlbums(albumsData);
    });
    this.get('#/songs', async function () {
        $('.toggle-section').hide();
        $('#songsList').show();
        setActiveLink('#songsLink');
        const songsData = await API.LoadSongs();
        MediaPlayer.LoadSongs(songsData);
    });
    this.notFound = function () {
        // TODO: Handle this with a default page
        // app.redirect('#/albums');
        // alert('not found!');
    }
});