const Sauces = require('../models/sauces');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const sauceImgURL = 'http://localhost:3000/images/sauces/';
const sauceImgPath = '..\\images\\sauces\\';

// Used for create sauce and update sauce for image uploading
const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/sauces');
    },
    filename: (req, file, cb) => {
        const id = req.params.id ? 'temp-' : '' + new mongoose.Types.ObjectId();
        const ext = path.extname(file.originalname);
        req.body.file = { id: id, ext: ext };
        cb(null, id + ext);
    }
});

/**
 * Get all sauces.
 * Expected: nothing 
 */
exports.getAllSauces = (req, res, next) => {
    console.log('Action -> Sauces get all : ', req.body);
    Sauces.find((err, sauces) => {
        if (!sauces) {
            res.status(404).json([]);
        } else {
            res.status(200).json(sauces);
        }
    });
}

/**
 * Get a sauce provided by :id.
 * Expected: an id in the url 
 */
exports.getSauceById = (req, res, next) => {
    console.log('Action -> Sauces get one : ', req.body);
    Sauces.findOne({ _id: req.params.id }, (err, sauce) => {
        if (!sauce) {
            res.status(404).json({});
        } else {
            res.status(200).json(sauce);
        }
    });
}

/**
 * Create a new sauce.
 * Expected: { sauce : Chaîne, image : Fichier }
 */
exports.createSauce = (req, res) => {
    console.log('Action -> Sauces create : ', req.body);
    let upload = multer({ storage: storageImage }).any()
    upload(req, res, (err) => {
        if (err) {
            res.status(400).json({ messages: error.message });
        } else {
            const sauceData = JSON.parse(req.body.sauce);
            const sauce = new Sauces();
            sauce.id = req.body.file.id
            sauce.userId = sauceData.userId;
            sauce.name = sauceData.name;
            sauce.manufacturer = sauceData.manufacturer;
            sauce.description = sauceData.description;
            sauce.mainPepper = sauceData.mainPepper;
            sauce.heat = sauceData.heat;
            sauce.imageUrl = sauceImgURL + req.body.file.id + req.body.file.ext;

            sauce.save().then(
                (newSauce) => {
                    res.status(201).json({ message: 'Sauce created successfully.' });
                }
            ).catch(
                (error) => {
                    fs.unlink(path.join(__dirname, sauceImgPath + req.body.file.id + req.body.file.ext), (err, data) => {
                        res.status(400).json({ messages: error.message });
                    });
                }
            );
        }
    });
}

/**
 * Update a sauce provided by :id
 * Expected 1: an id in the url 
 * Expected 2: SOIT Sauce comme JSON OU { sauce : Chaîne, image : Fichier }
 */
exports.updateSauceById = (req, res, next) => {
    console.log('Action -> Sauces update : ', req.body);
    Sauces.findOne({ _id: req.params.id }, (err, sauce) => {
        if (!sauce) {
            res.status(404).json({ message: 'Sauce not found.' });
        } else {
            let upload = multer({ storage: storageImage }).any()
            upload(req, res, (err) => {
                if (err) {
                    res.status(400).json({ messages: error.message });
                } else {
                    // If file then body.sauce, otherwise just the body
                    const sauceData = req.body.file ? JSON.parse(req.body.sauce) : req.body;
                    sauce.name = sauceData.name;
                    sauce.manufacturer = sauceData.manufacturer;
                    sauce.description = sauceData.description;
                    sauce.mainPepper = sauceData.mainPepper;
                    sauce.heat = sauceData.heat;
                    if (req.body.file) { // There is a file
                        sauce.imageUrl = sauceImgURL + sauce.id + req.body.file.ext;
                    }
                    sauce.save().then(
                        (theSauce) => {
                            if (req.body.file) { // There is a file
                                let actualImgName = theSauce.imageUrl.replace(sauceImgURL, '');
                                let uploadedImgName = req.body.file.id + req.body.file.ext;
                                let newImgName = theSauce.id + req.body.file.ext;
                                // Delete the old image
                                fs.unlink(path.join(__dirname, sauceImgPath + actualImgName), (err, data) => {
                                    // Rename the new temp image to the name of the previous deleted
                                    fs.rename(path.join(__dirname, sauceImgPath + uploadedImgName), path.join(__dirname, sauceImgPath + newImgName), (err, data) => {
                                        res.status(200).json({ message: 'Sauce updated with success.' });
                                    });
                                });
                            } else {
                                res.status(200).json({ message: 'Sauce updated with success.' });
                            }
                        }
                    ).catch(
                        (error) => {
                            if (req.body.file) { // There is a file
                                fs.unlink(path.join(__dirname, sauceImgPath + req.body.file.id + req.body.file.ext), (err, data) => {
                                    res.status(400).json({ message: error.message });
                                });
                            } else {
                                res.status(400).json({ message: error.message });
                            }
                        }
                    );
                }
            });
        }
    });
};

/**
 * Delete a sauce provided by :id
 * Expected: an id in the url 
 */
exports.deleteSauceById = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id }, (err, sauce) => {
        if (!sauce) {
            res.status(404).json({ message: 'Sauce not found.' });
        } else {
            sauce.delete().then(
                () => {
                    let lastSlash = sauce.imageUrl.lastIndexOf('/');
                    let name = sauce.imageUrl.substring(lastSlash + 1);
                    fs.unlink(path.join(__dirname, sauceImgPath + name), (err, data) => {
                        res.status(200).json({ message: 'Sauce deleted with success.' });
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({ message: error.message });
                }
            );
        }
    });
};

/**
 * Set a sauce advise by :id
 * Expected 1: an id in the url 
 * Expected 2: { userId: Chaîne, like : Nombre }
 * Use cases: like == 1 => like | like == 0 => no advise | like == -1 => dislike
 */
exports.setSaucesAdvise = (req, res, next) => {
    console.log('Action -> Sauces like/dislike : ', req.body);
    Sauces.findOne({ _id: req.params.id }, (err, sauce) => {
        if (!sauce) {
            res.status(404).json({ message: 'Sauce not found.' });
        } else {
            switch (req.body.like) {
                case -1:
                    if (!sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.usersDisliked.push(req.body.userId);
                        sauce.dislikes++;

                        if (sauce.usersLiked.includes(req.body.userId)) {
                            sauce.usersLiked = sauce.usersLiked.filter(el => el != req.body.userId);
                            sauce.likes--;
                        }
                    }
                    break;
                case 0:
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauce.usersDisliked = sauce.usersDisliked.filter(el => el != req.body.userId);
                        sauce.dislikes--;
                    } else if (sauce.usersLiked.includes(req.body.userId)) {
                        sauce.usersLiked = sauce.usersLiked.filter(el => el != req.body.userId);
                        sauce.likes--;
                    }
                    break;
                case 1:
                    if (!sauce.usersLiked.includes(req.body.userId)) {
                        sauce.usersLiked.push(req.body.userId);
                        sauce.likes++;

                        if (sauce.usersDisliked.includes(req.body.userId)) {
                            sauce.usersDisliked = sauce.usersDisliked.filter(el => el != req.body.userId);
                            sauce.dislikes--;
                        }
                    }
                    break;
            }
            sauce.save().then(
                () => {
                    res.status(200).json({ message: 'Sauce rate updated with success.' });
                }
            ).catch(
                (error) => {
                    res.status(400).json({ message: error.message });
                }
            );
        }
    });
};
