


const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Create a new user
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password, phone, address, pincode, city, state, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({
            name,
            email,
            password,
            phone,
            address,
            pincode,
            city,
            state,
            role: role || 'user', // Default to 'user' if role is not provided
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Update an existing user
const updateUser = async (req, res) => {
    const { name, email, password, phone, address, pincode, city, state, role } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is being updated and if it's already in use by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        // If password is provided, hash it before saving
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.pincode = pincode || user.pincode;
        user.city = city || user.city;
        user.state = state || user.state;
        user.role = role || user.role;

        // Save the updated user
        const updatedUser = await user.save();
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// User login
// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required' });
//     }

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
//         if (!isMatch) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 role: user.role, // Include role in the token
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: process.env.JWT_SECRET_EXPIRY }
//         );

//         res.status(200).json({
//             message: 'Login successful',
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 phone: user.phone,
//                 address: user.address,
//                 pincode: user.pincode,
//                 city: user.city,
//                 state: user.state,
//                 role: user.role,
//             },
//         });
//     } catch (error) {
//         res.status(500).json({ message: 'Error logging in', error: error.message });
//     }
// };

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password.trim(), user.password.trim());
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_SECRET_EXPIRY }
        );

        res.status(200).json({
            message: 'Login successful',
            token,  // Send token to be stored in sessionStorage
            user: { id: user._id, name: user.name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

module.exports = {
    createUser,
    loginUser,
    getProfile,
    deleteUser,
    updateUser,
};
