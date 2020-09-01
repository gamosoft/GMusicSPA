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
    // ARTISTS
    this.get('#/artists', async function () {
        showLoader();
        setActiveLink('#artistsLink');
        const artistsData = await API.RetrieveArtists();
        MediaPlayer.LoadArtists(artistsData);
        MediaPlayer.IsSongsView(false);
        MediaPlayer.IsAlbumsView(false);
        $('.toggle-section').hide();
        $('#artistsList').show();
        hideLoader();
    });
    this.get('#/artists/:artistId', async function () {
        showLoader();
        setActiveLink('#artistsLink');
        const artistId = this.params['artistId'];
        const artistData = await API.RetrieveArtist(artistId);
        const albumsData = await API.RetrieveAlbums(artistId);
        MediaPlayer.CurrentArtist(artistData);
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
        MediaPlayer.IsAlbumsView(false);
        $('.toggle-section').hide();
        $('#artistDetail').show();
        $('#albumsList').show();
        hideLoader();
    });
    // ALBUMS
    this.get('#/albums', async function () {
        showLoader();
        setActiveLink('#albumsLink');
        const albumsData = await API.RetrieveAlbums();
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
        MediaPlayer.IsAlbumsView(true);
        $('.toggle-section').hide();
        $('#albumsList').show();
        hideLoader();
    });
    this.get('#/albums/:albumId', async function(context) {
        showLoader();
        setActiveLink('#albumsLink');
        const albumId = this.params['albumId'];
        const albumData = await API.RetrieveAlbum(albumId); // This returns a single element, not an array, and the songs INSIDE
        const songsData = albumData.songs;
        MediaPlayer.CurrentAlbum(albumData);
        MediaPlayer.LoadSongs(songsData);
        MediaPlayer.SortField('trackNo'); // Default sort in album view
        MediaPlayer.SortOrder(true); // Default sort ascending
        MediaPlayer.IsSongsView(false);
        MediaPlayer.IsAlbumsView(false);
        $('.toggle-section').hide();
        $('#albumDetail').show();
        $('#songsList').show();
        hideLoader();
    });
    // SONGS
    this.get('#/songs', async function () {
        showLoader();
        setActiveLink('#songsLink');
        const songsData = await API.RetrieveSongs();
        MediaPlayer.LoadSongs(songsData);
        MediaPlayer.IsSongsView(true);
        MediaPlayer.IsAlbumsView(false);
        $('.toggle-section').hide();
        $('#songsList').show();
        hideLoader();
    });
    this.get('#/songs/:artistId', async function () {
        showLoader();
        setActiveLink('#songsLink');
        const artistId = this.params['artistId'];
        const artistData = await API.RetrieveArtist(artistId);
        MediaPlayer.CurrentArtist(artistData);
        MediaPlayer.LoadSongs(artistData.songs);
        MediaPlayer.IsSongsView(true);
        MediaPlayer.IsAlbumsView(false);
        $('.toggle-section').hide();
        $('#songsList').show();
        hideLoader();
    });
    // GENRES
    this.get('#/genres', async function () {
        showLoader();
        setActiveLink('#genresLink');
        const genresData = await API.RetrieveGenres();
        MediaPlayer.LoadGenres(genresData);
        MediaPlayer.IsSongsView(false);
        MediaPlayer.IsAlbumsView(false);
        $('.toggle-section').hide();
        $('#genresList').show();
        hideLoader();
    });
    this.notFound = function () {
        app.setLocation('#/albums');
    }
});