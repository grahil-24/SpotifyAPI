const express = require('express');
const app = express();
const userRouter = require('./routes/userRoute');
const path = require('path');

app.use('/', userRouter);

// setting pug as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

module.exports = app;