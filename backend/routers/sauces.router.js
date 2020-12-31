const saucesController = require('../controllers/sauces.controller');
const express = require('express');
const router = express.Router();

router.post('', saucesController.createSauce);
router.get('', saucesController.getAllSauces);
router.get('/:id', saucesController.getSauceById);
router.put('/:id', saucesController.updateSauceById);
router.delete('/:id', saucesController.deleteSauceById);
router.post('/:id/like', saucesController.setSaucesAdvise);

module.exports = router;
