$(() => {
    ko.applyBindings(MediaPlayerViewModel, document.getElementById('body'));

    MediaPlayerViewModel.CurrentSong({
        title: "Some song",
        artist: "Steve Vai",
        album: "This is the album",
        image: "https://upload.wikimedia.org/wikipedia/en/6/6d/SteveVaiAlienLoveSecrets.jpg"
    }); // TODO: Hack to make the progressbar fix. Will go away after proper markup

    app.run('#/albums');

    $('#progressBar').click(function(e) { 
        // element that has been clicked. 
        var elm = $(this); 
        // getting the respective coordinates of location. 
        x = e.pageX - elm.offset().left; 
        y = e.pageY - elm.offset().top; 
        MediaPlayerViewModel.JumpTo(x);
    });

    $('#albumCoverModal').on('show.bs.modal', function (evt) {
        const cover = $(evt.relatedTarget).attr('src');
        $('#modalAlbumImage').attr('src', cover);
    });

});