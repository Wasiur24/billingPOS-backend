const express = require('express');
const { createUser, loginUser, getProfile, updateUser, deleteUser } = require('../controllers/User.controller');
const { handleValidationErrors, validateUser } = require('../validators/userValidators');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// User registration route with validation
router.post('/register', handleValidationErrors, validateUser, createUser);

// User login route
router.post('/login', loginUser);
// Protected route to fetch user profile
router.get('/profile', authMiddleware, getProfile);
router.put('/update/:id', updateUser);   // Update user by ID
router.delete('/delete/:id', authMiddleware, deleteUser
);

module.exports = router;
