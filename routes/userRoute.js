const express = require('express');
const viewController = require('./../controller/viewController');
const userController = require('./../controller/userController');
const loginController = require('./../controller/loginController');
const userRouter = express.Router();

userRouter.get('/', viewController.getLoginPage);
userRouter.get('/login', loginController.login);
userRouter.get('/callback', loginController.initializeSpotifyAuth);
userRouter.get('/home', viewController.getHomepage);

module.exports = userRouter;    