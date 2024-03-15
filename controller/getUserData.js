const SpotifyWebApi = require('spotify-web-api-node');
const loginController = require('./loginController');
const spotifyApi = new SpotifyWebApi();

async function getMyData(constraint) {
    try {
        const accessToken = loginController.getAccessToken();
        spotifyApi.setAccessToken(accessToken);
        const me = await spotifyApi.getMe();
        console.log(me);
        const playlists = await getUserPlaylists(me.body.id, constraint);
        return { user: me.body, playlists };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getUserPlaylists(userName, constraint) {
    try {
        let playlists = [];
        let offset = 0;
        let limit = 50; // Set your desired limit here

        while (true) {
            const data = await spotifyApi.getUserPlaylists(userName, { limit, offset });
            for (let playlist of data.body.items) {
                if (constraint === "get_playlist") {
                    playlists.push({ name: playlist.name, id: playlist.id });
                } else {
                    let tracks = await getPlaylistTracks(playlist.id);
                    playlists.push({ name: playlist.name, id: playlist.id, tracks });
                }
            }
            if (data.body.next) {
                offset += limit;
            } else {
                break;
            }
        }

        return playlists;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getPlaylistTracks(playlistId) {
    try {
        let tracks = [];
        let offset = 0;
        let limit = 100; // Set your desired limit here

        while (true) {
            const data = await spotifyApi.getPlaylistTracks(playlistId, { limit, offset });
            for (let track_obj of data.body.items) {
                const track = track_obj.track;
                tracks.push({ name: track.name, artist: track.artists[0].name });
            }
            if (data.body.next) {
                offset += limit;
            } else {
                break;
            }
        }

        return tracks;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = getMyData;
