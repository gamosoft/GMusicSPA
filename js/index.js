const albumUrl = 'https://my-json-server.typicode.com/gamosoft/GMusicSPA/albums';

function trim(value, length) {
    return value.length > length
            ? value.substring(0, length - 3) + "..."
            : value;
}

async function loadAlbums() {
    // Fetch album information
    const response = await fetch(`${albumUrl}`);
    const data = await response.json();
    AlbumsViewModel.LoadAlbums(data);
}

$(() => {
    loadAlbums().then(ko.applyBindings(AlbumsViewModel, document.getElementById('AlbumsViewModel')));
});