const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcryptjs');

/**
 * Sign-up a new user.
 * Expected : { email: string, password: string }
 */
exports.signup = (req, res) => {
    console.log('Action -> Sign-up : ', req.body);
    const user = new User();
    user.email = req.body.email;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            user.password = hash;
            user.save().then(
                (newUser) => {
                    res.status(201).json({ messages: 'Your account have been registered successfully.' });
                }
            ).catch(
                (error) => {
                    if (error.code === 11000) {
                        res.status(442).json({ messages: 'An account with this email address already exists.' });
                    } else {
                        res.status(400).json({ messages: error.message });
                    }
                }
            );
        });
    });
};

/**
 * Login a user.
 * Expected : { email: string, password: string }
 */
exports.login = (req, res) => {
    console.log('Action -> Login : ', req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(400).json(err);
        } else if (user) {
            const token = user.generateJwt();
            res.status(200).json({ userId: user.userId, token: token });
        } else {
            res.status(404).json({ userId: null, token: null });
        }
    })(req, res);
};
