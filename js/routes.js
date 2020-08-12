function setActiveLink(item) {
    $('.nav-item').removeClass('active');
    $(item).addClass('active');
}

let app = $.sammy(function () {
    this.get('#/albums', function () {
        $('.toggle-section').hide();
        $('#albumsList').show();
        setActiveLink('#albumsLink');
        API.LoadAlbums();
    });
    this.get('#/albums/:albumId', function(context) {
        const albumId = this.params['albumId'];
        $('.toggle-section').hide();
        $('#albumDetail').show();
        $('#songsList').show();
        setActiveLink('#albumsLink');
        API.LoadAlbum(albumId);
        API.LoadSongs(albumId);
      });
    this.get('#/artists', function () {
        $('.toggle-section').hide();
        $('#artistsList').show();
        setActiveLink('#artistsLink');
        API.LoadArtists();
    });
    this.get('#/artists/:artistId', function () {
        const artistId = this.params['artistId'];
        $('.toggle-section').hide();
        $('#albumsList').show();
        setActiveLink('#artistsLink');
        API.LoadAlbums(artistId);
    });
    this.get('#/songs', function () {
        $('.toggle-section').hide();
        $('#songsList').show();
        setActiveLink('#songsLink');
        API.LoadSongs();
    });
    this.notFound = function () {
        // TODO: Handle this with a default page
        // app.redirect('#/albums');
        // alert('not found!');
    }
});