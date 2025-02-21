


const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String,  },
    contactPerson: { type: String },
    phone: { type: String  },
    email: { type: String, unique: true },
    address: { type: String},
    city: { type: String},
    state: { type: String },
    pincode: { type: String },
    country: { type: String },
    productsSupplied: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
        productName: { type: String},
    }],
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
