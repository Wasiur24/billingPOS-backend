const express = require('express');
const { addProduct, updateProduct, getAllProducts, deleteProduct ,getAllProductsCategory } = require('../controllers/Product.controller');
const router = express.Router();

// Add a new product
router.post('/add', addProduct);

// Update an existing product by ID
router.patch('/update/:id', updateProduct);

// Get all products
router.get('/', getAllProducts);
router.get('/getAllProductsCategory', getAllProductsCategory);
// router.delete('/:id',  deleteProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
