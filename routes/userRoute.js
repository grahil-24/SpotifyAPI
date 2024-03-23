const express = require('express');
const viewController = require('./../controller/viewController');
const userController = require('./../controller/userController');
const loginController = require('./../controller/loginController');
const userRouter = express.Router();
const {getPlaylistTracks} = require('../controller/getUserData');

userRouter.get('/', viewController.getLoginPage);
userRouter.get('/login', loginController.login);
userRouter.get('/callback', loginController.initializeSpotifyAuth);
userRouter.get('/home', viewController.getHomepage);

userRouter.get('/home/getSongs', async (req, res) => {
    const playlistID = req.query.playlistID;
    try{
        const tracks = await getPlaylistTracks(playlistID);
        console.log(tracks);
        res.json(tracks);
    }catch (err){
        console.log(err);
    }

})

module.exports = userRouter;    