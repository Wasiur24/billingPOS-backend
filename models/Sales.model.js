const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            sku: { type: String },
            quantitySold: { type: Number, required: true },
            totalAmount: { type: Number, required: true },
        },
    ],
    totalSaleAmount: { type: Number, required: true },  // New field for total sale amount
    saleDate: { type: Date, default: Date.now },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other'],
        default: 'Cash',
    },
    customerName: { type: String, default: 'Anonymous' },
    customerContact: {
        type: String,
        validate: {
            validator: (v) => /^\d{10}$/.test(v),
            message: (props) => `${props.value} is not a valid contact number!`,
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('Sales', salesSchema);
