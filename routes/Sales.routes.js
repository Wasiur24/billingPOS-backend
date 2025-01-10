const express = require('express');
const { createSale, getAllSales, getSaleById, createSaleBySKU, getSalesBySKU, getTotalSales } = require('../controllers/Sales.controller');

const router = express.Router();

router.post('/sales', createSale); // Create a sale
router.get('/sales', getAllSales); // Get all sales
router.get('/sales/:id', getSaleById); // Get sale by ID
router.post('/sku/sales', createSaleBySKU);
router.get('/total', getTotalSales);

// Route to get sales by SKU
router.get('/sales/:sku', getSalesBySKU);

module.exports = router;
