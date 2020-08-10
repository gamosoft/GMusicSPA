let app = $.sammy(function () {
    this.get('#/albums', function () {
        $('#ArtistsViewModel').hide();
        $('#AlbumsViewModel').show();
        $('#SongsViewModel').hide();
        $('.nav-item').removeClass('active');
        $('#albumsLink').addClass('active');
    });
    this.get('#/albums/:id', function(context) {
        const id = this.params['id'];
        $('#ArtistsViewModel').hide();
        $('#AlbumsViewModel').show();
        $('#SongsViewModel').show();
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
    this.notFound = function () {
        // TODO: Handle this with a default page
        // app.redirect('#/albums');
        // alert('not found!');
    }
});