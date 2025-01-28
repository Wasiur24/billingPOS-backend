const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,  // Ensures category names are unique
    },
    description: {
        type: String,
        required: false,
    },
    gstnumber: {    
        type: Number,
        required: false,
        default: 0,
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
