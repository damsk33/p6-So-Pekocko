const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        default: new mongoose.Types.ObjectId()
    },
    email: {
        type: String,
        required: 'L\'email est obligatoire',
        unique: true
    },
    password: {
        type: String,
        required: 'Le mot de passe est obligatoire',
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
    }
});

// Verify email structure with regex | maintenant dans le controller avant de le crypter
//userSchema.path('email').validate((val) => {
//    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//    return emailRegex.test(val);
//}, 'L\'email n\'est pas valide');

// Crypting with passport for security
userSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.hashPassword = function (password) {
    const saltRounds = 10;
    const hashedPassword = new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                reject(err)
            }
            resolve(hash)
        });
    })
    return hashedPassword
};

// Generate JavaWebToken for security
userSchema.methods.generateJwt = (id) => {
    return jwt.sign({ _id: id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXP }
    );
};

module.exports = mongoose.model('User', userSchema);
