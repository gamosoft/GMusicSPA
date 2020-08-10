let app = $.sammy(function () {
    this.get('#/albums', function () {
        $('#ArtistsViewModel').hide();
        $('#AlbumsViewModel').show();
        $('#SongsViewModel').hide();
        $('.nav-item').removeClass('active');
        $('#albumsLink').addClass('active');
        loadAlbums();
        // loadAlbums().then(ko.applyBindings(AlbumsViewModel, document.getElementById('AlbumsViewModel')));
    });
    this.get('#/albums/:albumId', function(context) {
        const albumId = this.params['albumId'];
        $('#ArtistsViewModel').hide();
        $('#AlbumsViewModel').show();
        $('#SongsViewModel').show();
        $('.nav-item').removeClass('active');
        $('#albumsLink').addClass('active');
        loadSongs(albumId);
        // loadSongs(albumId).then(ko.applyBindings(AlbumsViewModel, document.getElementById('AlbumsViewModel')));
      });
    this.get('#/artists', function () {
        $('#ArtistsViewModel').show();
        $('#AlbumsViewModel').hide();
        $('#SongsViewModel').hide();
        $('.nav-item').removeClass('active');
        $('#artistsLink').addClass('active');
        loadArtists();
        // loadArtists().then(ko.applyBindings(ArtistsViewModel, document.getElementById('ArtistsViewModel')));
    });
    this.get('#/artists/:artistId', function () {
        const artistId = this.params['artistId'];
        $('#ArtistsViewModel').hide();
        $('#AlbumsViewModel').show();
        $('#SongsViewModel').hide();
        $('.nav-item').removeClass('active');
        $('#artistsLink').addClass('active');
        loadAlbums(artistId);
        // loadArtists().then(ko.applyBindings(ArtistsViewModel, document.getElementById('ArtistsViewModel')));
    });
    this.get('#/songs', function () {
        $('#ArtistsViewModel').hide();
        $('#AlbumsViewModel').hide();
        $('#SongsViewModel').show();
        $('.nav-item').removeClass('active');
        $('#songsLink').addClass('active');
        loadSongs();
        // loadSongs().then(ko.applyBindings(SongsViewModel, document.getElementById('SongsViewModel')));
    });
    this.notFound = function () {
        // TODO: Handle this with a default page
        // app.redirect('#/albums');
        // alert('not found!');
    }
});