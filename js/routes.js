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
        setActiveLink('#albumsLink');
        const albumsData = await API.LoadAlbums();
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
        $('.toggle-section').hide();
        $('#albumsList').show();
        hideLoader();
    });
    this.get('#/albums/:albumId', async function(context) {
        showLoader();
        const albumId = this.params['albumId'];
        setActiveLink('#albumsLink');
        const albumData = await API.LoadAlbum(albumId);
        const songsData = await API.LoadSongs(albumId);
        MediaPlayer.LoadAlbums(albumData);
        MediaPlayer.SortField('trackNo'); // Default sort in album view
        MediaPlayer.SortOrder(true); // Default sort ascending
        MediaPlayer.LoadSongs(songsData);
        MediaPlayer.IsSongsView(false);
        $('.toggle-section').hide();
        $('#albumDetail').show();
        $('#songsList').show();
        hideLoader();
      });
    this.get('#/artists', async function () {
        showLoader();
        setActiveLink('#artistsLink');
        const artistsData = await API.LoadArtists();
        MediaPlayer.LoadArtists(artistsData);
        MediaPlayer.IsSongsView(false);
        $('.toggle-section').hide();
        $('#artistsList').show();
        hideLoader();
    });
    this.get('#/artists/:artistId', async function () {
        showLoader();
        const artistId = this.params['artistId'];
        setActiveLink('#artistsLink');
        const albumsData = await API.LoadAlbums(artistId);
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
        $('.toggle-section').hide();
        $('#albumsList').show();
        hideLoader();
    });
    this.get('#/songs', async function () {
        showLoader();
        setActiveLink('#songsLink');
        MediaPlayer.IsSongsView(true);
        const songsData = await API.LoadSongs();
        MediaPlayer.LoadSongs(songsData);
        $('.toggle-section').hide();
        $('#songsList').show();
        hideLoader();
    });
    this.get('#/songs/:artistId', async function () {
        showLoader();
        const artistId = this.params['artistId'];
        setActiveLink('#songsLink');
        MediaPlayer.IsSongsView(true);
        const songsData = await API.LoadArtistSongs(artistId);
        MediaPlayer.LoadSongs(songsData);
        $('.toggle-section').hide();
        $('#songsList').show();
        hideLoader();
    });
    this.notFound = function () {
        app.setLocation('#/albums');
    }
});