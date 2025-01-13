const express = require('express');
const router = express.Router();
const {
    addPurchase,
    updatePurchase,
    getAllPurchases,
    getPurchaseById,
    deletePurchase,
} = require('../controllers/Purchase.controller'); // Ensure path to controller is correct

// Route to add a purchase
router.post('/add', addPurchase);

// Route to update a purchase by ID
router.put('/update/:id', updatePurchase);

// Route to get all purchases
router.get('/all', getAllPurchases);

// Route to get a purchase by ID
router.get('/:id', getPurchaseById);

router.delete('/:id', deletePurchase);

module.exports = router;
