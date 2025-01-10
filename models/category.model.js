const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,  // Ensures category names are unique
    },
    description: {
        type: String,
        required: true,
    },
    gstnumber: {    
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
