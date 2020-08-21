function setActiveLink(item) {
    $('.nav-item').removeClass('active');
    $(item).addClass('active');
}

let app = $.sammy(function () {

    // showLoader doesn't seem to work here
    // this.before({except: {path: '#/route'}}, async function() {
    //     $('.toggle-section').hide();
    //     showLoader();
    // });
    // this.after(async function() {
    //     hideLoader();
    // });

    this.get('#/albums', async function () {
        showLoader();
        $('.toggle-section').hide();
        setActiveLink('#albumsLink');
        const albumsData = await API.LoadAlbums();
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
        $('#albumsList').show();
        hideLoader();
    });
    this.get('#/albums/:albumId', async function(context) {
        showLoader();
        const albumId = this.params['albumId'];
        $('.toggle-section').hide();
        setActiveLink('#albumsLink');
        const albumData = await API.LoadAlbum(albumId);
        const songsData = await API.LoadSongs(albumId);
        MediaPlayer.LoadAlbums(albumData);
        MediaPlayer.SortField('trackNo'); // Default sort in album view
        MediaPlayer.SortOrder(true); // Default sort ascending
        MediaPlayer.LoadSongs(songsData);
        MediaPlayer.IsSongsView(false);
        $('#albumDetail').show();
        $('#songsList').show();
        hideLoader();
      });
    this.get('#/artists', async function () {
        showLoader();
        $('.toggle-section').hide();
        setActiveLink('#artistsLink');
        const artistsData = await API.LoadArtists();
        MediaPlayer.LoadArtists(artistsData);
        MediaPlayer.IsSongsView(false);
        $('#artistsList').show();
        hideLoader();
    });
    this.get('#/artists/:artistId', async function () {
        showLoader();
        const artistId = this.params['artistId'];
        $('.toggle-section').hide();
        setActiveLink('#artistsLink');
        const albumsData = await API.LoadAlbums(artistId);
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
        $('#albumsList').show();
        hideLoader();
    });
    this.get('#/songs', async function () {
        showLoader();
        $('.toggle-section').hide();
        setActiveLink('#songsLink');
        MediaPlayer.IsSongsView(true);
        const songsData = await API.LoadSongs();
        MediaPlayer.LoadSongs(songsData);
        $('#songsList').show();
        hideLoader();
    });
    this.get('#/songs/:artistId', async function () {
        showLoader();
        const artistId = this.params['artistId'];
        $('.toggle-section').hide();
        setActiveLink('#songsLink');
        MediaPlayer.IsSongsView(true);
        const songsData = await API.LoadArtistSongs(artistId);
        MediaPlayer.LoadSongs(songsData);
        $('#songsList').show();
        hideLoader();
    });
    this.notFound = function () {
        app.setLocation('#/albums');
    }
});