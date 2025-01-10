const Supplier = require("../models/Supplier.model");

const Product = require("../models/Product.model"); // Import Product model

// const addSupplier = async (req, res) => {
//     const { name, contactPerson, phone, email, address, city, state, pincode, country, productsSupplied } = req.body;

//     try {
//         // Check if supplier already exists
//         const existingSupplier = await Supplier.findOne({ email });
//         if (existingSupplier) {
//             return res.status(400).json({ message: 'Supplier with this email already exists' });
//         }

//         // Check if productsSupplied is not empty and products exist in the Product collection
//         const productIds = productsSupplied.map(product => product.productId);
//         const existingProducts = await Product.find({ '_id': { $in: productIds } });

//         // If any product doesn't exist, return an error
//         if (existingProducts.length !== productsSupplied.length) {
//             return res.status(400).json({ message: 'Some products in the supplied list do not exist' });
//         }

//         // Create new supplier with the proper structure for 'contact' and 'productsSupplied'
//         const newSupplier = new Supplier({
//             name,
//             contactPerson,
//             phone,
//             email,
//             address,
//             city,
//             state,
//             pincode,
//             country,
//             contact: {
//                 phone,
//                 email,
//             },
//             productsSupplied: productsSupplied.map(product => ({
//                 productId: product.productId,
//                 productName: product.productName,
//             })),
//         });

//         // Save the new supplier
//         const savedSupplier = await newSupplier.save();
//         res.status(201).json({ message: 'Supplier added successfully', supplier: savedSupplier });
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding supplier', error: error.message });
//     }
// };


const addSupplier = async (req, res) => {
    const { name, contactPerson, phone, email, address, city, state, pincode, country } = req.body;

    try {
        // Check if supplier already exists
        const existingSupplier = await Supplier.findOne({ email });
        if (existingSupplier) {
            return res.status(400).json({ message: 'Supplier with this email already exists' });
        }

        // Create new supplier
        const newSupplier = new Supplier({
            name,
            contactPerson,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            country,
            contact: {
                phone,
                email,
            },
            productsSupplied: [],  // Empty initially, will be updated after adding products
        });

        // Save the new supplier
        const savedSupplier = await newSupplier.save();

        res.status(201).json({ message: 'Supplier added successfully', supplier: savedSupplier });
    } catch (error) {
        res.status(500).json({ message: 'Error adding supplier', error: error.message });
    }
};





const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, contactPerson, phone, email, address, city, state, pincode, country } = req.body;

    try {
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Update supplier fields
        supplier.name = name || supplier.name;
        supplier.contactPerson = contactPerson || supplier.contactPerson;
        supplier.phone = phone || supplier.phone;
        supplier.email = email || supplier.email;
        supplier.address = address || supplier.address;
        supplier.city = city || supplier.city;
        supplier.state = state || supplier.state;
        supplier.pincode = pincode || supplier.pincode;
        supplier.country = country || supplier.country;

        const updatedSupplier = await supplier.save();
        res.status(200).json({ message: 'Supplier updated successfully', supplier: updatedSupplier });
    } catch (error) {
        res.status(500).json({ message: 'Error updating supplier', error: error.message });
    }
};

const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching suppliers', error: error.message });
    }
};
const deleteSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findById(id);
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        // Delete the supplier
        await Supplier.findByIdAndDelete(id);
        res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting supplier', error: error.message });
    }
};


module.exports = {
    addSupplier,
    updateSupplier,
    getAllSuppliers,
    deleteSupplier,  // Added this function for deleting a supplier by ID.
};
