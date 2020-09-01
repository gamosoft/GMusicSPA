API = (function () {

    const baseUrl = 'https://my-json-server.typicode.com/gamosoft/GMusicSPA'
    // const baseUrl = 'http://localhost:8888'
    const albumsUrl = `${baseUrl}/albums`;
    const artistsUrl = `${baseUrl}/artists`;
    const songsUrl = `${baseUrl}/songs`;
    const genresUrl = `${baseUrl}/genres`;
    
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
        const url = `${artistsUrl}?_sort=name&_order=asc`;
        return await _fetchData(url);
    }

    async function _retrieveArtist(artistId) {
        const url = `${artistsUrl}/${artistId}?_embed=albums&_embed=songs`; // TODO: Maybe get just headers?
        return await _fetchData(url);
    }

    async function _retrieveAlbums(artistId) {
        const url = artistId
                ? `${albumsUrl}?artistId=${artistId}&_sort=year&_order=desc`
                : `${albumsUrl}?_sort=title&_order=asc`;
        return await _fetchData(url);
    }

    async function _retrieveAlbum(albumId) {
        // TODO: ?_expand=artist => to get artist information so we don't need to denormalize the DB
        const url = `${albumsUrl}/${albumId}?_embed=songs`;
        return await _fetchData(url);
    }

    async function _retrieveSongs() {
        const url = `${songsUrl}?_sort=title&_order=asc`;
        return await _fetchData(url);
    }

    async function _retrieveGenres() {
        const url = `${genresUrl}?_sort=title&_order=asc`; // TODO: Doesn't sort yet. Move to an ID etc
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
