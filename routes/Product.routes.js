const express = require('express');
const { addProduct, updateProduct, getAllProducts } = require('../controllers/Product.controller');
const router = express.Router();

// Add a new product
router.post('/add', addProduct);

// Update an existing product by ID
router.patch('/update/:id', updateProduct);

// Get all products
router.get('/', getAllProducts);

module.exports = router;
