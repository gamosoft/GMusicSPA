function setActiveLink(item) {
    $('.nav-item').removeClass('active');
    $(item).addClass('active');
}

let app = $.sammy(function () {
    this.get('#/albums', async function () {
        $('.toggle-section').hide();
        setActiveLink('#albumsLink');
        const albumsData = await API.LoadAlbums();
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
        $('#albumsList').show();
    });
    this.get('#/albums/:albumId', async function(context) {
        const albumId = this.params['albumId'];
        $('.toggle-section').hide();
        setActiveLink('#albumsLink');
        const albumData = await API.LoadAlbum(albumId);
        const songsData = await API.LoadSongs(albumId);
        MediaPlayer.LoadAlbums(albumData);
        MediaPlayer.SortField('trackNo'); // Default sort in album view
        MediaPlayer.LoadSongs(songsData);
        MediaPlayer.IsSongsView(false);
        $('#albumDetail').show();
        $('#songsList').show();
      });
    this.get('#/artists', async function () {
        $('.toggle-section').hide();
        setActiveLink('#artistsLink');
        const artistsData = await API.LoadArtists();
        MediaPlayer.LoadArtists(artistsData);
        MediaPlayer.IsSongsView(false);
        $('#artistsList').show();
    });
    this.get('#/artists/:artistId', async function () {
        const artistId = this.params['artistId'];
        $('.toggle-section').hide();
        setActiveLink('#artistsLink');
        const albumsData = await API.LoadAlbums(artistId);
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
        $('#albumsList').show();
    });
    this.get('#/songs', async function () {
        $('.toggle-section').hide();
        setActiveLink('#songsLink');
        MediaPlayer.IsSongsView(true);
        const songsData = await API.LoadSongs();
        MediaPlayer.LoadSongs(songsData);
        $('#songsList').show();
    });
    this.get('#/songs/:artistId', async function () {
        const artistId = this.params['artistId'];
        $('.toggle-section').hide();
        setActiveLink('#songsLink');
        MediaPlayer.IsSongsView(true);
        const songsData = await API.LoadArtistSongs(artistId);
        MediaPlayer.LoadSongs(songsData);
        $('#songsList').show();
    });
    this.notFound = function () {
        app.setLocation('#/albums');
    }
});