async function loadAlbums() {
    // Fetch album information
    const response = await fetch(`${gameUrl}/status/${gameId}`);
    const data = await response.json();
    AlbumsViewModel.LoadAlbums(data);
}

$(() => {
    loadAlbums().then(ko.applyBindings(AlbumsViewModel, document.getElementById('AlbumsViewModel')));
});