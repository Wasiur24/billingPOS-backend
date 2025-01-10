const express = require('express');
const router = express.Router();
const { addSupplier, updateSupplier, getAllSuppliers, deleteSupplier } = require('../controllers/Supplier.Controller');

router.post('/add', addSupplier);  // Add new supplier
router.put('/:id', updateSupplier); // Update an existing supplier
router.get('/', getAllSuppliers); // Get all suppliers
router.delete('/delete/:id', deleteSupplier); // Get all suppliers

module.exports = router;
