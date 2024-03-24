const express = require('express');
const viewController = require('./../controller/viewController');
const loginController = require('./../controller/loginController');
const userRouter = express.Router();
const {getPlaylistTracks, getDuplicates} = require('../controller/dataController');

userRouter.get('/', viewController.getLoginPage);
userRouter.get('/login', loginController.login);
userRouter.get('/callback', loginController.initializeSpotifyAuth);
userRouter.get('/home', viewController.getHomepage);

userRouter.get('/home/getSongs', getDuplicates);

module.exports = userRouter;    