require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:

const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:

app.get ("/", async (request, response) => {
    response.render("index");
} )

app.get ("/artist-search", async (request, response) => {
    const searchArtist = request.query.artist;

    try {
        const searchResult = await spotifyApi.searchArtists(searchArtist);
        const results = searchResult.body.artists.items;

        console.log("searchResult:", searchResult);
        console.log("results:", results);

        response.render("artist-search-results", {results});

    } catch (error) {
        console.log ("Error when searching artists:", error);
    }
})

app.get ("/albums/:artistId", async (request, response) => {
    const artistId = request.params.artistId;

    try {
        const artistAlbums = await spotifyApi.getArtistAlbums(artistId);
        const albums = artistAlbums.body.items;

        response.render("albums", {albums});

    } catch (error) {
        console.log ("Error when showing Albums:", error);
    }

})

app.get ("/tracks/:albumId", async (request, response) => {
    const albumId = request.params.albumId;

    try {
        const albumTracks = await spotifyApi.getAlbumTracks(albumId);
        const tracks = albumTracks.body.items;

        response.render("tracks", {tracks});

    } catch (error) {
        console.log ("Error when showing tracks:", error);
    }
});

/*
app.use((error, request, response) => {
    console.error(err.stack);
    response.status(400).send("Internal server Error");
});
*/

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
