const express = require('express');
const userRouter = require('./routes/userRoute');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
// setting pug as the template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));



app.use('/', userRouter);

module.exports = app;