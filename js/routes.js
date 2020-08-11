let app = $.sammy(function () {
    this.get('#/albums', function () {
        $('#artistsList').hide();
        $('#albumsList').show();
        $('#albumDetail').hide();
        $('#songsList').hide();
        $('.nav-item').removeClass('active');
        $('#albumsLink').addClass('active');
        API.LoadAlbums();
    });
    this.get('#/albums/:albumId', function(context) {
        const albumId = this.params['albumId'];
        $('#artistsList').hide();
        $('#albumsList').hide();
        $('#albumDetail').show();
        $('#songsList').show();
        $('.nav-item').removeClass('active');
        $('#albumsLink').addClass('active');
        API.LoadAlbum(albumId);
        API.LoadSongs(albumId);
      });
    this.get('#/artists', function () {
        $('#artistsList').show();
        $('#albumsList').hide();
        $('#albumDetail').hide();
        $('#songsList').hide();
        $('.nav-item').removeClass('active');
        $('#artistsLink').addClass('active');
        API.LoadArtists();
    });
    this.get('#/artists/:artistId', function () {
        const artistId = this.params['artistId'];
        $('#artistsList').hide();
        $('#albumsList').show();
        $('#albumDetail').hide();
        $('#songsList').hide();
        $('.nav-item').removeClass('active');
        $('#artistsLink').addClass('active');
        API.LoadAlbums(artistId, null);
    });
    this.get('#/songs', function () {
        $('#artistsList').hide();
        $('#albumsList').hide();
        $('#albumDetail').hide();
        $('#songsList').show();
        $('.nav-item').removeClass('active');
        $('#songsLink').addClass('active');
        API.LoadSongs();
    });
    this.notFound = function () {
        // TODO: Handle this with a default page
        // app.redirect('#/albums');
        // alert('not found!');
    }
});