const albumUrl = 'http://my-json-server.typicode.com/gamosoft/GMusicSPA/albums';

async function loadAlbums() {
    // Fetch album information
    const response = await fetch(`${albumUrl}`);
    const data = await response.json();
    AlbumsViewModel.LoadAlbums(data);
}

$(() => {
    loadAlbums().then(ko.applyBindings(AlbumsViewModel, document.getElementById('AlbumsViewModel')));
});