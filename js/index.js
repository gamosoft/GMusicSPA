function trim(value, length) {
    return value.length > length
        ? value.substring(0, length - 3) + "..."
        : value;
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

String.prototype.toMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var minutes = Math.floor(sec_num / 60);
    var seconds = sec_num - (minutes * 60);

    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};

$(() => {
    app.run('#/albums');
    $('#nowPlaying').hide();
    ko.applyBindings(AlbumsViewModel, document.getElementById('albumsList'));
    ko.applyBindings(AlbumsViewModel, document.getElementById('albumDetail'));
    ko.applyBindings(ArtistsViewModel, document.getElementById('artistsList'));
    ko.applyBindings(SongsViewModel, document.getElementById('songsList'));

    $('#progressBar').click(function(e) { 
        // element that has been clicked. 
        var elm = $(this); 
        // getting the respective coordinates of location. 
        x = e.pageX - elm.offset().left; 
        y = e.pageY - elm.offset().top; 
        MediaPlayer.JumpTo(x);
    });

    $('#albumCoverModal').on('show.bs.modal', function (evt) {
        const cover = $(evt.relatedTarget).attr('src');
        $('#modalAlbumImage').attr('src', cover);
    });
});