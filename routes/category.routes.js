const express = require('express');
const router = express.Router();

const {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
} = require('../controllers/category.controller');

// Route to create a new category
router.post('/', createCategory);

// Route to get all categories
router.get('/', getAllCategories);

// Route to update a category by ID
router.put('/:id', updateCategory);

// Route to delete a category by ID
router.delete('/:id', deleteCategory);

module.exports = router;
