API = (function () {

    const baseUrl = 'https://my-json-server.typicode.com/gamosoft/GMusicSPA'
    // const baseUrl = 'http://localhost:8888'
    const albumsUrl = `${baseUrl}/albums`; // ?_sort=title&_order=asc`;
    const artistsUrl = `${baseUrl}/artists`; // ?_sort=name&_order=asc`;
    const songsUrl = `${baseUrl}/songs`; // ?_sort=title&_order=asc`;
    
    // Filter like this
    // https://my-json-server.typicode.com/gamosoft/GMusicSPA/songs?title=Juice
    // TODO: Cache of requests

    // Get all albums and songs by U2
    // http://localhost:8888/artists/9?_embed=albums&_embed=songs
    // Get artists AND their songs
    // http://localhost:8888/artists?_embed=songs&_embed=albums
    // Get artists AND their albums
    // http://localhost:8888/artists?_embed=albums
    // Get albums AND their songs
    // http://localhost:8888/albums?_embed=songs
    // Get one album and its songs
    // http://localhost:8888/albums/1?_embed=songs

    // TODO: Add default sorting when changing views???

    async function _fetchData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    
    async function _retrieveArtists() {
        return await _fetchData(artistsUrl);
    }

    async function _retrieveArtist(artistId) {
        const url = `${artistsUrl}/${artistId}?_embed=albums&_embed=songs`; // TODO: Maybe get just headers?
        return await _fetchData(url);
    }

    async function _retrieveAlbums(artistId) {
        const url = artistId
                ? `${albumsUrl}?artistId=${artistId}`
                : albumsUrl;
        return await _fetchData(url);
    }

    async function _retrieveAlbum(albumId) {
        const url = `${albumsUrl}/${albumId}?_embed=songs`;
        return await _fetchData(url);
    }

    async function _retrieveSongs() {
        return await _fetchData(songsUrl);
    }

    async function _retrieveGenres() {
        alert('not implemented');
        return;
        const url = albumId // TODO: Change this
                ? `${songsUrl}?albumId=${albumId}`
                : songsUrl;
        return await _fetchData(url);
    }

    return {
        RetrieveArtist: _retrieveArtist,
        RetrieveArtists: _retrieveArtists,
        RetrieveAlbum: _retrieveAlbum,
        RetrieveAlbums: _retrieveAlbums,
        RetrieveSongs: _retrieveSongs,
        RetrieveGenres: _retrieveGenres
    };
})();
