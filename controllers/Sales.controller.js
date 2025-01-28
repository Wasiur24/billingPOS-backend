
const Product = require('../models/Product.model');
const Sales = require('../models/Sales.model');


const escpos = require('escpos');
escpos.USB = require('escpos-usb');
// escpos.Image = require('escpos-image'); // Required for saving as image

const path = require('path');
const fs = require('fs');
const { createCanvas } = require('canvas'); // Used for image rendering




const createSale = async (req, res) => {
    const { products, paymentMethod, customerName, customerContact } = req.body;

    try {
        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required.' });
        }

        let totalSaleAmount = 0;
        const productUpdates = [];
        const productDetails = [];
        let totalCGST = 0;
        let totalSGST = 0;
        let savedAmount = 0;

        // Calculate GST and saved amount
        for (const item of products) {
            const { sku, quantitySold, name, sellingPrice, mrpprice, gstnumber } = item;

            let product = await Product.findOne({ sku });

            if (!product) {
                return res.status(404).json({ message: `Product not found for sku ${sku}.` });
            }

            if (product.quantity < quantitySold) {
                return res.status(400).json({
                    message: `Insufficient stock for product ${name || sku}.`,
                });
            }

            const productTotal = sellingPrice * quantitySold;
            totalSaleAmount += productTotal;

            // Calculate GST
            if (gstnumber) {
                const gstRate = gstnumber / 2;
                const gstAmount = (productTotal * gstRate) / 100;
                totalCGST += gstAmount;
                totalSGST += gstAmount;
            }

            // Calculate saved amount
            savedAmount += (mrpprice - sellingPrice) * quantitySold;

            product.quantity -= quantitySold;
            productUpdates.push(product.save());

            productDetails.push({
                productId: product._id,
                sku,
                name,
                quantitySold,
                sellingPrice,
                mrpprice,
                gstnumber,
                totalAmount: productTotal,
            });
        }

        // Create the sale record with all details
        const sale = await Sales.create({
            products: productDetails,
            totalSaleAmount,
            paymentMethod: paymentMethod || 'UPI',
            customerName: customerName || 'Anonymous',
            customerContact: customerContact || 'N/A',
            cgstAmount: totalCGST,
            sgstAmount: totalSGST,
            savedAmount,
        });

        await Promise.all(productUpdates);

        res.status(201).json({
            message: 'Sale recorded successfully.',
            sale,
        });
    } catch (error) {
        console.error('Error creating sale:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update getSaleById to populate all necessary fields
const getSaleById = async (req, res) => {
    const { id } = req.params;

    try {
        const sale = await Sales.findById(id)
            .populate('products.productId');

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        res.status(200).json(sale);
    } catch (error) {
        console.error('Error fetching sale by ID:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getAllSales = async (req, res) => {
    try {
        const sales = await Sales.find().populate('products.productId');
        res.status(200).json(sales);
    } catch (error) {
        console.error('Error fetching all sales:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// // Get Sale by ID
// const getSaleById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         const sale = await Sales.findById(id).populate('products.productId');

//         if (!sale) {
//             return res.status(404).json({ message: 'Sale not found' });
//         }

//         res.status(200).json(sale);
//     } catch (error) {
//         console.error('Error fetching sale by ID:', error.message);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// Create Sale by SKU
const createSaleBySKU = async (req, res) => {
    const { sku, quantitySold, paymentMethod, customerName, customerContact } = req.body;

    try {
        const product = await Product.findOne({ sku });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantitySold) {
            return res.status(400).json({ message: 'Insufficient stock available' });
        }

        const totalAmount = quantitySold * product.sellingPrice;

        const sale = new Sales({
            products: [
                {
                    productId: product._id,
                    sku: product.sku,
                    quantitySold,
                    totalAmount,
                },
            ],
            paymentMethod: paymentMethod || 'Cash',
            customerName: customerName || 'Anonymous',
            customerContact: customerContact || 'N/A',
        });

        await sale.save();

        product.quantity -= quantitySold;
        await product.save();

        res.status(201).json({
            message: 'Sale recorded successfully.',
            sale,
        });
    } catch (error) {
        console.error('Error creating sale by SKU:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Sales by SKU
const getSalesBySKU = async (req, res) => {
    const { sku } = req.params;

    try {
        const sales = await Sales.find({ 'products.sku': sku }).populate('products.productId');

        if (sales.length === 0) {
            return res.status(404).json({ message: 'No sales found for the given SKU.' });
        }

        res.status(200).json({
            message: 'Sales retrieved successfully.',
            sales,
        });
    } catch (error) {
        console.error('Error fetching sales by SKU:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




const getTotalSales = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        // Build query object for filtering by date
        const query = {};

        if (startDate || endDate) {
            query.saleDate = {};
            if (startDate) {
                query.saleDate.$gte = new Date(startDate); // Sales on or after startDate
            }
            if (endDate) {
                query.saleDate.$lte = new Date(endDate); // Sales on or before endDate
            }
        }

        // Fetch sales based on query
        const sales = await Sales.find(query).populate('products.productId', 'name price sku');

        if (!sales || sales.length === 0) {
            return res.status(404).json({ message: 'No sales found for the given criteria.' });
        }

        // Calculate total sales amount
        const totalSalesAmount = sales.reduce((total, sale) => total + sale.totalSaleAmount, 0);

        res.status(200).json({
            message: 'Sales data retrieved successfully.',
            totalSalesAmount,
            sales,
        });
    } catch (error) {
        console.error('Error fetching total sales:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateSale = async (req, res) => {
    const { id } = req.params; // Sale ID
    const { products, paymentMethod, customerName, customerContact } = req.body;

    try {
        // Find the sale to update
        const sale = await Sales.findById(id);

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Restore stock from the current sale
        for (const item of sale.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.quantity += item.quantitySold;
                await product.save();
            }
        }

        // Update sale details
        let totalSaleAmount = 0;
        const updatedProductDetails = [];

        for (const item of products) {
            const { sku, quantitySold } = item;

            const product = await Product.findOne({ sku });
            if (!product) {
                return res.status(404).json({ message: `Product not found for SKU: ${sku}` });
            }

            if (product.quantity < quantitySold) {
                return res.status(400).json({ message: `Insufficient stock for SKU: ${sku}` });
            }

            const productTotal = product.sellingPrice * quantitySold;
            totalSaleAmount += productTotal;

            product.quantity -= quantitySold;
            await product.save();

            updatedProductDetails.push({
                productId: product._id,
                sku: product.sku,
                productName: product.name,
                quantitySold,
                totalAmount: productTotal,
            });
        }

        sale.products = updatedProductDetails;
        sale.totalSaleAmount = totalSaleAmount;
        sale.paymentMethod = paymentMethod || sale.paymentMethod;
        sale.customerName = customerName || sale.customerName;
        sale.customerContact = customerContact || sale.customerContact;

        await sale.save();

        res.status(200).json({ message: 'Sale updated successfully.', sale });
    } catch (error) {
        console.error('Error updating sale:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
const deleteSale = async (req, res) => {
    const { id } = req.params;

    try {
        const sale = await Sales.findById(id);

        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        // Restore stock for the deleted sale
        for (const item of sale.products) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.quantity += item.quantitySold;
                await product.save();
            }
        }

        await Sales.findByIdAndDelete(id);

        res.status(200).json({ message: 'Sale deleted successfully.' });
    } catch (error) {
        console.error('Error deleting sale:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    createSaleBySKU,
    getSalesBySKU,
    getTotalSales,
    updateSale,
    deleteSale,
};