function songClicked(evt) {
    const id = parseInt($(evt.currentTarget).attr('id')); // target gives the clicked element, currentTarget gives the element the event is attached to
    const url = $(evt.currentTarget).attr('url');
    play(url);
}

function play() {
    $('#musicPlayer')[0].play();
    $('#nowPlaying').show();
}

function play(url) {
    $('#musicPlayer').attr('src', url);
    $('#musicPlayer')[0].play();
    $('#nowPlaying').show();
}

function pause() {
    $('#musicPlayer')[0].pause();
    $('#nowPlaying').hide();
}

function stop() {
    $('#musicPlayer')[0].pause();
    $('#musicPlayer')[0].currentTime = 0;
    $('#nowPlaying').hide();
}

function previous() {
    alert('not implemented');
}

function next() {
    alert('not implemented');
}