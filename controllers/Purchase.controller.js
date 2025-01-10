const Purchase = require('../models/Purchase.model'); // Make sure this path is correct
const Product = require('../models/Product.model');
const Supplier = require('../models/Supplier.model');

const addPurchase = async (req, res) => {
    const { productId, supplierId, quantity, pricePerUnit } = req.body;

    try {
        // Validate if the product and supplier exist
        const product = await Product.findById(productId);
        const supplier = await Supplier.findById(supplierId);
        console.log(product);
        console.log(supplier);

        if (!product) {
            return res.status(400).json({ message: 'Product not found' });
        }

        if (!supplier) {
            return res.status(400).json({ message: 'Supplier not found' });
        }

        // Calculate total cost
        const totalCost = quantity * pricePerUnit;

        // Create a new purchase entry
        const newPurchase = new Purchase({
            productId,
            supplierId,
            quantity,
            pricePerUnit,
            totalCost,
        });

        const savedPurchase = await newPurchase.save();
        res.status(201).json({ message: 'Purchase added successfully', purchase: savedPurchase });
    } catch (error) {
        res.status(500).json({ message: 'Error adding purchase', error: error.message });
    }
};




const updatePurchase = async (req, res) => {
    const { id } = req.params;
    const { productId, Supplier, quantity, pricePerUnit } = req.body;

    try {
        const purchase = await Purchase.findById(id);
        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        // Update purchase fields
        purchase.productId = productId || purchase.productId;
        purchase.Supplier = Supplier || purchase.Supplier;
        purchase.quantity = quantity || purchase.quantity;
        purchase.pricePerUnit = pricePerUnit || purchase.pricePerUnit;
        purchase.totalCost = quantity * pricePerUnit || purchase.totalCost;

        const updatedPurchase = await purchase.save();
        res.status(200).json({ message: 'Purchase updated successfully', purchase: updatedPurchase });
    } catch (error) {
        res.status(500).json({ message: 'Error updating purchase', error: error.message });
    }
};

const getAllPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.find()
            .populate('productId') // Populate the product details
            .populate('supplierId'); // Populate the supplier details (correct field name)
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchases', error: error.message });
    }
};


const getPurchaseById = async (req, res) => {
    const { id } = req.params;

    try {
        const purchase = await Purchase.findById(id)
            .populate('productId') // Populate the product details
            .populate('supplierId'); // Populate the supplier details (correct field name)

        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }
        res.status(200).json(purchase);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchase', error: error.message });
    }
};

module.exports = {
    addPurchase,
    updatePurchase,
    getAllPurchases,
    getPurchaseById,
};
