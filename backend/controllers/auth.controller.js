const User = require('../models/user');
const CryptoJS = require("crypto-js");
const passport = require('passport');

const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

const encrypt = (str) => {
    return CryptoJS.AES.encrypt(str, key, { iv: iv }).toString();
}
const decrypt = (str) => {
    return CryptoJS.AES.decrypt(str, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
}

/**
 * Sign-up a new user.
 * Expected : { email: string, password: string }
 */
exports.signup = (req, res) => {
    console.log('Action -> Sign-up : ', req.body);
    const user = new User();

    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(req.body.email)) {
        user.email = encrypt(req.body.email);
        user.hashPassword(req.body.password).then((hashedPassword, err) => {
            if (err) {
                res.status(400).json({ messages: err.message });
            } else {
                user.password = hashedPassword;
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
            }
        });
    } else {
        return res.status(400).json({ messages: 'Email not valid.' });;
    }
};

/**
 * Login a user.
 * Expected : { email: string, password: string }
 */
exports.login = (req, res) => {
    console.log('Action -> Sign-in : ', req.body);
    req.body.email = encrypt(req.body.email);
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            res.status(400).json(err);
        } else if (user) {
            const token = user.generateJwt();
            res.cookie('token', token, { maxAge: 3600 * 60 * 1000, httpOnly: true });
            res.status(200).json({ userId: user.userId, token: token });
        } else {
            res.status(404).json({ userId: null, token: null });
        }
    })(req, res);
};
