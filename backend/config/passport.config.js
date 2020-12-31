const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            User.findOne({ email: username }, (err, user) => {
                if (err)
                    return done(err);
                else if (!user)
                    return done(null, false, { message: 'L\'adresse mail n\'existe pas' });
                else
                    if (!user.checkPassword(password))
                        return done(null, false, { message: 'Le mot de passe est incorrect' });
                    else
                        return done(null, user);
            });
        })
);
