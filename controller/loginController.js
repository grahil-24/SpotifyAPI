// spotifyAuth.js
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: '860060f6eb7743a2b87dcead95d611c3',
    clientSecret: '7c78c9585615427aa481ac10ad013dc7',
    redirectUri: 'http://localhost:8888/callback'
  });


const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];

exports.login = (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
}

exports.initializeSpotifyAuth = async(req, res) => {

    try {
        const error = req.query.error;
        const code = req.query.code;
  
        if (error) {
          console.error('Callback Error:', error);
          res.send(`Callback Error: ${error}`);
          return;
        }
  
        const data = await spotifyApi.authorizationCodeGrant(code);
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
  
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
  
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
  
        console.log(`Successfully retrieved access token. Expires in ${expires_in} s.`);
  
        res.redirect('/home');
  
        setInterval(async () => {
          const refreshTokenData = await spotifyApi.refreshAccessToken();
          const newAccessToken = refreshTokenData.body['access_token'];
  
          console.log('The access token has been refreshed!');
          console.log('access_token:', newAccessToken);
  
          spotifyApi.setAccessToken(newAccessToken);
        }, expires_in / 2 * 1000);
      } catch (error) {
        console.error('Error getting Tokens:', error);
        res.status(500).send(`Error getting Tokens: ${error.message}`);
      }
}

exports.getAccessToken = () => {
  return spotifyApi.getAccessToken();
}
