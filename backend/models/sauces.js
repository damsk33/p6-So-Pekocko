const mongoose = require('mongoose');

const saucesSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        default: new mongoose.Types.ObjectId()
    },
    userId: {
        type: String,
        required: 'L\'identifiant utilisateur est obligatoire',
    },
    name: {
        type: String,
        required: 'Le nom est obligatoire',
        unique: true
    },
    manufacturer: {
        type: String,
        required: 'Le manufactureur est obligatoire'
    },
    description: {
        type: String,
        required: 'La description est obligatoire'
    },
    mainPepper: {
        type: String,
        required: 'Le principale ingrédient est obligatoire'
    },
    imageUrl: {
        type: String,
        required: 'Le lien vers l\'image est obligatoire',
        unique: true
    },
    heat: {
        type: Number,
        required: 'Le niveau de piquant est obligatoire',
        min: 1,
        max: 10,
    },
    likes: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },
    dislikes: {
        type: Number,
        min: 0,
        default: 0,
        required: true
    },
    usersLiked: {
        type: [String],
        default: [],
        required: true
    },
    usersDisliked: {
        type: [String],
        default: [],
        required: true
    },
});

module.exports = mongoose.model('Sauces', saucesSchema);
