const SpotifyWebApi = require('spotify-web-api-node');
const loginController = require('./loginController');
const bodyParser = require("body-parser");
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
            console.log(playlist)
            playlists.push({ name: playlist.name, id: playlist.id, snapshot_id: playlist.snapshot_id});
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
        let count = 0;
        while (true) {
            const data = await spotifyApi.getPlaylistTracks(playlistId, { limit, offset });
            for (let track_obj of data.body.items) {
                const track = track_obj.track;
                tracks.push({ pos: count, name: track.name, artist: track.artists[0].name, id: track.id});
                count+=1;
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
        const map = new Map();

        tracks.forEach((track) => {
            const key = track.artist+"|"+track.name;
            if(set.has(key)){
                duplicates.push(track);
            }else{
                set.add(key);
            }
        })
        console.log(duplicates);
        res.json({duplicates: duplicates, playlistID: playlistID});
    }catch (err){
        console.log(err);
    }
}

const removeDuplicates = async (req, res) => {
    const playlistId = req.query.playlistID;
    const tracks = req.body.songs;
    const snapshot = req.body.snapshot_id;
    console.log(snapshot);
    const trackPos = [];
    tracks.forEach((track)=>{
        trackPos.push(track.pos);
    })
    // console.log(playlistId);
    // console.log(tracks);

    // await spotifyApi.removeTracksFromPlaylist(playlistId, trackURIs).then(function(data) {
    //     console.log('Tracks removed from playlist!');
    // }, function(err) {
    //     console.log('Something went wrong!', err);
    // });

    await spotifyApi.removeTracksFromPlaylistByPosition(playlistId, trackPos, snapshot).then(function(data) {
        console.log('Tracks removed from playlist!');
    }, function(err) {
        console.log('Something went wrong!', err);
    });

}

module.exports = { getUserPlaylists, getPlaylistTracks, getDuplicates, removeDuplicates };