$(() => {
    MediaPlayer.Init('#mediaPlayer');

    ko.applyBindings(MediaPlayer, document.getElementById('body'));

    MediaPlayer.CurrentSong({
        title: "Some song",
        artist: "Steve Vai",
        album: "This is the album",
        image: "https://upload.wikimedia.org/wikipedia/en/6/6d/SteveVaiAlienLoveSecrets.jpg"
    }); // TODO: Hack to make the progressbar fix. Will go away after proper markup

    app.run('#/albums');

    $('#progressBar').click(function(e) {
        // element that has been clicked. 
        var elm = $(this);
        let width = parseInt($(elm).css('width'));
        // getting the respective coordinates of location. 
        x = e.pageX - elm.offset().left; 
        y = e.pageY - elm.offset().top; 
        MediaPlayer.JumpTo(x, width);
    });

    $('#volumeSlider')[0].oninput = function () {
        MediaPlayer.SetVolume(this.value);
    }

    $('#albumCoverModal').on('show.bs.modal', function (evt) {
        const cover = $(evt.relatedTarget).attr('src');
        $('#modalAlbumImage').attr('src', cover);
    });

});