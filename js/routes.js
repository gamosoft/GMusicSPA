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
        const albumsData = await API.RetrieveAlbums();
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
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

        let removeme = []; removeme.push(albumData);
        MediaPlayer.LoadAlbums(removeme);
        //MediaPlayer.LoadAlbums(albumData); // TODO: hack to make it work
        MediaPlayer.LoadSongs(songsData);
        MediaPlayer.SortField('trackNo'); // Default sort in album view
        MediaPlayer.SortOrder(true); // Default sort ascending
        MediaPlayer.IsSongsView(false);
        $('.toggle-section').hide();
        $('#albumDetail').show();
        $('#songsList').show();
        hideLoader();
      });
    this.get('#/artists', async function () {
        showLoader();
        setActiveLink('#artistsLink');
        const artistsData = await API.RetrieveArtists();
        MediaPlayer.LoadArtists(artistsData);
        MediaPlayer.IsSongsView(false);
        $('.toggle-section').hide();
        $('#artistsList').show();
        hideLoader();
    });
    this.get('#/artists/:artistId', async function () {
        showLoader();
        setActiveLink('#artistsLink');
        const artistId = this.params['artistId'];
        // const artistData = await API.RetrieveArtist(artistId);
        const albumsData = await API.RetrieveAlbums(artistId); // TODO: In this case albums are sorted by year descending
        MediaPlayer.LoadAlbums(albumsData);
        MediaPlayer.IsSongsView(false);
        $('.toggle-section').hide();
        $('#albumsList').show();
        hideLoader();
    });
    this.get('#/songs', async function () {
        showLoader();
        setActiveLink('#songsLink');
        const songsData = await API.RetrieveSongs();
        MediaPlayer.LoadSongs(songsData);
        MediaPlayer.IsSongsView(true);
        $('.toggle-section').hide();
        $('#songsList').show();
        hideLoader();
    });
    this.get('#/songs/:artistId', async function () {
        showLoader();
        setActiveLink('#songsLink');
        const artistId = this.params['artistId'];
        const songsData = await API.RetrieveArtistSongs(artistId);
        MediaPlayer.LoadSongs(songsData);
        MediaPlayer.IsSongsView(true);
        $('.toggle-section').hide();
        $('#songsList').show();
        hideLoader();
    });
    this.notFound = function () {
        app.setLocation('#/albums');
    }
});