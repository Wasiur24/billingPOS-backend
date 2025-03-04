
// const mongoose = require('mongoose');

// const salesSchema = new mongoose.Schema({
//     products: [
//         {
//             productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//             sku: { type: String },
//             name: { type: String, required: true },
//             quantitySold: { type: Number, required: true },
//             sellingPrice: { type: Number, required: true },
//             mrpprice: { type: Number, required: true },
//             gstnumber: { type: Number, required: false },
//             totalAmount: { type: Number, required: true },
//         },
//     ],
//     totalSaleAmount: { type: Number, required: true },
//     saleDate: { type: Date, default: Date.now },
//     paymentMethod: {
//         type: String,
//         enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other'],
//         default: 'UPI',
//     },
//     customerName: { type: String, default: 'Anonymous',required: false},
//     customerContact: {
//         type: String,
//         // validate: {
//         //     validator: (v) => /^\d{10}$/.test(v),
//         //     message: (props) => `${props.value} is not a valid contact number!`,
//         // },
//         required: false,
//     },
//     billNo: { type: Number },
//     cgstAmount: { type: Number, default: 0 },
//     sgstAmount: { type: Number, default: 0 },
//     savedAmount: { type: Number, default: 0 },
// }, { timestamps: true });

// // Add a pre-save middleware to generate bill number
// salesSchema.pre('save', async function(next) {
//     if (!this.billNo) {
//         try {
//             const lastSale = await this.constructor.findOne({}, {}, { sort: { 'billNo': -1 } });
//             this.billNo = lastSale ? lastSale.billNo + 1 : 1000;
//         } catch (error) {
//             this.billNo = 1000; // Default starting number if no previous sales
//         }
//     }
//     next();
// });

// module.exports = mongoose.model('Sales', salesSchema);

const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            sku: { type: String },
            name: { type: String, required: true },
            quantitySold: { type: Number, required: true },
            sellingPrice: { type: Number, required: true },
            mrpprice: { type: Number, required: true },
            gstnumber: { type: Number, required: false },
            totalAmount: { type: Number, required: true },
        },
    ],
    totalSaleAmount: { type: Number, required: true },
    saleDate: { type: Date, default: Date.now },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other'],
        default: 'UPI',
    },
    customerName: { type: String, default: 'Anonymous', required: false},
    customerContact: {
        type: String,
        required: false,
    },
    billNo: { type: Number },
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    savedAmount: { type: Number, default: 0 },
    cashReceived: { type: Number, required: false },
    changeAmount: { type: Number, required: false }
}, { timestamps: true });

// Add a pre-save middleware to generate bill number
salesSchema.pre('save', async function(next) {
    if (!this.billNo) {
        try {
            const lastSale = await this.constructor.findOne({}, {}, { sort: { 'billNo': -1 } });
            this.billNo = lastSale ? lastSale.billNo + 1 : 1000;
        } catch (error) {
            this.billNo = 1000; // Default starting number if no previous sales
        }
    }
    next();
});

module.exports = mongoose.model('Sales', salesSchema);