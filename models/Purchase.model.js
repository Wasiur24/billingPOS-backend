


const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
}, { timestamps: true });

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
