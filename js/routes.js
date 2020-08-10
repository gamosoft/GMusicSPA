let app = $.sammy(function () {
    this.get('#/albums', function () {
        $('#artistsList').hide();
        $('#albumsList').show();
        $('#albumDetail').hide();
        $('#songsList').hide();
        $('.nav-item').removeClass('active');
        $('#albumsLink').addClass('active');
        loadAlbums();
    });
    this.get('#/albums/:albumId', function(context) {
        const albumId = this.params['albumId'];
        $('#artistsList').hide();
        $('#albumsList').hide();
        $('#albumDetail').show();
        $('#songsList').show();
        $('.nav-item').removeClass('active');
        $('#albumsLink').addClass('active');
        loadAlbums(null, albumId);
        loadSongs(albumId);
      });
    this.get('#/artists', function () {
        $('#artistsList').show();
        $('#albumsList').hide();
        $('#albumDetail').hide();
        $('#songsList').hide();
        $('.nav-item').removeClass('active');
        $('#artistsLink').addClass('active');
        loadArtists();
    });
    this.get('#/artists/:artistId', function () {
        const artistId = this.params['artistId'];
        $('#artistsList').hide();
        $('#albumsList').show();
        $('#albumDetail').hide();
        $('#songsList').hide();
        $('.nav-item').removeClass('active');
        $('#artistsLink').addClass('active');
        loadAlbums(artistId, null);
    });
    this.get('#/songs', function () {
        $('#artistsList').hide();
        $('#albumsList').hide();
        $('#albumDetail').hide();
        $('#songsList').show();
        $('.nav-item').removeClass('active');
        $('#songsLink').addClass('active');
        loadSongs();
    });
    this.notFound = function () {
        // TODO: Handle this with a default page
        // app.redirect('#/albums');
        // alert('not found!');
    }
});