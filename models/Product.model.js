const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',  // Now references the Category model
        required: true,
    },
   mrpprice:{
    type:Number,
    required:true,
    
   },
    purchasePrice: {
        type: Number,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    barcode: {
        type: String, // Optional field for the base64 barcode data
    },
    barcodeImagePath: {
        type: String, // File system path of the saved barcode image
    },
    barcodeImageURL: {
        type: String, // Public URL path of the saved barcode image
    },
    manufacturingDate: {
        type: Date,
        required: false,
    },
    expiryDate: {
        type: Date,
    },
    weight: {
        type: Number, // Weight in kilograms or grams (you can specify in documentation)
        required: false,
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
