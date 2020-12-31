require('./config/config');
require('./config/database');
require('./config/passport.config');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const jwtVerify = require('./config/jwt.verify');
const passport = require('passport'); //*
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(passport.initialize());

// Routes
const authRouter = require('./routers/auth.router');
const saucesRouter = require('./routers/sauces.router');

app.use('/api/auth', authRouter);
app.use('/api/sauces', jwtVerify.verifyJwtToken, saucesRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));


// Run the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

exports = app;
