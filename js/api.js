API = (function () {

    const baseUrl = 'https://my-json-server.typicode.com/gamosoft/GMusicSPA'
    // const baseUrl = 'http://localhost:8888'
    const albumsUrl = `${baseUrl}/albums?_sort=title&_order=asc`;
    const artistsUrl = `${baseUrl}/artists?_sort=name&_order=asc`;
    const songsUrl = `${baseUrl}/songs?_sort=title&_order=asc`;
    
    // Filter like this
    // https://my-json-server.typicode.com/gamosoft/GMusicSPA/songs?title=Juice
    // TODO: Cache of requests

    // TODO: Add default sorting when changing views???

    async function _fetchData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    
    async function _loadAlbum(albumId) {
        const url = `${albumsUrl}&albumId=${albumId}`;
        return await _fetchData(url);
    }
    
    async function _loadAlbums(artistId) {
        const url = artistId
                ? `${albumsUrl}&artistId=${artistId}`
                : albumsUrl;
        return await _fetchData(url);
    }
    
    async function _loadArtists() {
        return await _fetchData(artistsUrl);
    }
    
    async function _loadSongs(albumId) {
        const url = albumId
                ? `${songsUrl}&albumId=${albumId}`
                : songsUrl;
        return await _fetchData(url);
    }

    async function _loadArtistSongs(artistId) {
        const url = `${songsUrl}&artistId=${artistId}`;
        return await _fetchData(url);
    }

    return {
        LoadAlbum: _loadAlbum,
        LoadAlbums: _loadAlbums,
        LoadArtists: _loadArtists,
        LoadSongs: _loadSongs,
        LoadArtistSongs: _loadArtistSongs,
    };
})();