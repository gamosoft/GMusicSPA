API = (function () {

    const baseUrl = 'https://my-json-server.typicode.com/gamosoft/GMusicSPA'
    // const baseUrl = 'http://localhost:8888'
    const albumsUrl = `${baseUrl}/albums?_sort=title&_order=asc`;
    const artistsUrl = `${baseUrl}/artists?_sort=name&_order=asc`;
    const songsUrl = `${baseUrl}/songs?_sort=title&_order=asc`;
    
    // Filter like this
    // https://my-json-server.typicode.com/gamosoft/GMusicSPA/songs?title=Juice
    // TODO: Cache of requests
    
    async function _loadAlbum(albumId) {
        // Fetch album information
        const response = await fetch(`${albumsUrl}&albumId=${albumId}`);
        const data = await response.json();
        return data;
    }
    
    async function _loadAlbums(artistId) {
        // Fetch album information
        let url = artistId
                ? `${albumsUrl}&artistId=${artistId}`
                : albumsUrl;
    
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    
    async function _loadArtists() {
        // Fetch artist information
        const response = await fetch(`${artistsUrl}`);
        const data = await response.json();
        return data;
    }
    
    async function _loadSongs(albumId) {
        // Fetch song information
        let url = albumId
                ? `${songsUrl}&albumId=${albumId}`
                : songsUrl;
    
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    return {
        LoadAlbum: _loadAlbum,
        LoadAlbums: _loadAlbums,
        LoadArtists: _loadArtists,
        LoadSongs: _loadSongs
    };
})();