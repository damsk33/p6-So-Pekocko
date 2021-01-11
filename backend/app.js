require('dotenv').config();
require('./config/config');
require('./config/database');
require('./config/passport.config');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const jwtVerify = require('./config/jwt.verify');
const passport = require('passport');
const helmet = require('helmet');
const path = require('path');
const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(passport.initialize());

// Routes
const authRouter = require('./routers/auth.router');
const saucesRouter = require('./routers/sauces.router');

app.use('/api/auth', authRouter);
app.use('/api/sauces', jwtVerify.verifyJwtToken, saucesRouter);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
