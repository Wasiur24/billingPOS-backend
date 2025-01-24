// const express = require('express');
// const { createSale, getAllSales, getSaleById, createSaleBySKU, getSalesBySKU, getTotalSales } = require('../controllers/Sales.controller');

// const router = express.Router();

// router.post('/sales', createSale); // Create a sale
// router.get('/sales', getAllSales); // Get all sales
// router.get('/sales/:id', getSaleById); // Get sale by ID
// router.post('/sku/sales', createSaleBySKU);
// router.get('/total', getTotalSales);

// // Route to get sales by SKU
// router.get('/sales/:sku', getSalesBySKU);

// module.exports = router;

const express = require('express');
const { 
    createSale, 
    getAllSales, 
    getSaleById, 
    createSaleBySKU, 
    getSalesBySKU, 
    getTotalSales, 
    updateSale, 
    deleteSale  
} = require('../controllers/Sales.controller');

const router = express.Router();

router.post('/sales', createSale); 
router.get('/sales', getAllSales); 
router.get('/sales/:id', getSaleById); 
router.post('/sku/sales', createSaleBySKU); 
router.get('/total', getTotalSales); 
router.get('/sales/:sku', getSalesBySKU); 
router.put('/sales/:id', updateSale); 
router.delete('/sales/:id', deleteSale); 

module.exports = router;
