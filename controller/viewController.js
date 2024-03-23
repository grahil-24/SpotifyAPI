const { getUserPlaylists, getPlaylistTracks } = require('./getUserData');
exports.getLoginPage = async(req, res, next) =>{
    res.status(200).render('loginpage', {
        title: 'Login Page'
    });
}

exports.getHomepage = async(req, res, next) =>{
    try {
        const userData = await getUserPlaylists();
        console.log('From getHomePage function: ');
        console.log(userData);
        res.render('home', { userData });
        } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}