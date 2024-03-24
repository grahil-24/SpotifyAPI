const SpotifyWebApi = require('spotify-web-api-node');
const loginController = require('./loginController');
const spotifyApi = new SpotifyWebApi();

async function getUserPlaylists() {
    try {
        const accessToken = loginController.getAccessToken();
        spotifyApi.setAccessToken(accessToken);

        // Get user's information
        const me = await spotifyApi.getMe();
        console.log('From getUserPlaylists function:');
        console.log(me);

        // Get user's playlists
        const data = await spotifyApi.getUserPlaylists(me.body.id);
        let playlists = [];
        for (let playlist of data.body.items) {
            playlists.push({ name: playlist.name, id: playlist.id });
        }

        return { user: me.body, playlists };
    } catch (error) {
        console.error('From getUserPlaylists function:');
        console.error(error);
        throw error;
    }
}

async function getPlaylistTracks(playlistId) {
    // console.log(playlistId);
    try {

        let tracks = [];
        let offset = 0;
        let limit = 100; // Set your desired limit here

        while (true) {
            const data = await spotifyApi.getPlaylistTracks(playlistId, { limit, offset });
            for (let track_obj of data.body.items) {
                const track = track_obj.track;
                tracks.push({ name: track.name, artist: track.artists[0].name, id: track.id});
            }
            if (data.body.next) {
                offset += limit;
            } else {
                break;
            }
        }

        return tracks;
    } catch (error) {
        console.log('From getPlaylistTrack function: ');
        console.error(error);
        throw error;
    }
}

const getDuplicates = async (req, res) => {
    const playlistID = req.query.playlistID;
    try{
        const tracks = await getPlaylistTracks(playlistID);
        const duplicates = []
        const set = new Set();

        tracks.forEach((track) => {
            if(set.has(track.id)){
                duplicates.push(track);
            }else{
                set.add(track.id);
            }
        })
        console.log(duplicates);
        res.json(duplicates);
    }catch (err){
        console.log(err);
    }
}

module.exports = { getUserPlaylists, getPlaylistTracks, getDuplicates };