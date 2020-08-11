API = (function () {

    const baseUrl = 'https://my-json-server.typicode.com/gamosoft/GMusicSPA'
    const albumsUrl = `${baseUrl}/albums`;
    const artistsUrl = `${baseUrl}/artists`;
    const songsUrl = `${baseUrl}/songs`;
    
    // Filter like this
    // https://my-json-server.typicode.com/gamosoft/GMusicSPA/songs?title=Juice
    // TODO: Cache of requests
    
    async function _loadAlbum(albumId) {
        // Fetch album information
        const response = await fetch(`${url}?albumid=${albumId}`);
        const data = await response.json();
        AlbumsViewModel.LoadAlbums(data);
    }
    
    async function _loadAlbums(artistId) {
        // Fetch album information
        let url = artistId
                ? `${albumsUrl}?artistid=${artistId}`
                : albumsUrl;
    
        const response = await fetch(url);
        const data = await response.json();
        AlbumsViewModel.LoadAlbums(data);
    }
    
    async function _loadArtists() {
        // Fetch artist information
        const response = await fetch(`${artistsUrl}`);
        const data = await response.json();
        ArtistsViewModel.LoadArtists(data);
    }
    
    async function _loadSongs(albumId) {
        // Fetch song information
        let url = albumId
                ? `${songsUrl}?albumid=${albumId}`
                : songsUrl;
    
        const response = await fetch(url);
        const data = await response.json();
        SongsViewModel.LoadSongs(data);
        $('.song').click(MediaPlayer.PlaySong);
    }

    return {
        LoadAlbum: _loadAlbum,
        LoadAlbums: _loadAlbums,
        LoadArtists: _loadArtists,
        LoadSongs: _loadSongs
    };
})();