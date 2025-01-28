const Product = require("../models/Product.model");
const bwipjs = require('bwip-js');
const Supplier = require("../models/Supplier.model");
const fs = require('fs');
const path = require('path');
const Category = require("../models/category.model");


const addProduct = async (req, res) => {
    const products = req.body; // Array of products

    try {
        // Array to store successfully added products
        const addedProducts = [];

        // Process each product in the request body
        for (const product of products) {
            let {
                name,
                description,
                category, // Category should be a name here
                mrpprice,
                purchasePrice,
                sellingPrice,
                quantity,
                email, // Supplier email from the request payload
                sku, // SKU might not be provided
                manufacturingDate,
                expiryDate,
                weight,
            } = product;

            // If SKU is not provided, generate a random one
            if (!sku) {
                sku = generateRandomSKU();
            }

            // Find the supplier by email
            const supplier = await Supplier.findOne({ email });
            if (!supplier) {
                return res.status(400).json({ message: `Supplier with email ${email} not found` });
            }

            // Check if a product with the same SKU already exists
            const existingProduct = await Product.findOne({ sku });
            if (existingProduct) {
                return res.status(400).json({ message: `Product with SKU ${sku} already exists` });
            }

            // Find the category by name
            const categoryDoc = await Category.findOne({ name: category });
            if (!categoryDoc) {
                return res.status(400).json({ message: `Category with name ${category} not found` });
            }

            // Generate and save the barcode
            const barcodeImagePath = await generateBarcodeAndSave(sku);
            const barcodeImageURL = `/barcodes/${sku}.png`; // Public URL for the barcode image

            // Create a new product
            const newProduct = new Product({
                name,
                description,
                category: categoryDoc._id, // Use category _id
                mrpprice,
                purchasePrice,
                sellingPrice,
                quantity,
                supplier: supplier._id, // Link supplier by ID
                sku,
                barcodeImagePath, // Save file system path of the barcode image
                barcodeImageURL,  // Save public URL of the barcode image
                manufacturingDate,
                expiryDate,
                weight,
            });

            // Save the product in the database
            const savedProduct = await newProduct.save();

            // Update the supplier's productsSupplied array
            supplier.productsSupplied.push({
                productId: savedProduct._id,
                productName: savedProduct.name,
            });
            await supplier.save();

            // Add the saved product to the response array
            addedProducts.push(savedProduct);
        }

        res.status(201).json({
            message: 'Products added successfully',
            products: addedProducts,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding products', error: error.message });
    }
};

// Function to generate a random SKU (e.g., a combination of letters and numbers)
const generateRandomSKU = () => {
    const prefix = 'SKU';
    const randomString = Math.random().toString(36).substr(2, 9).toUpperCase(); // Random alphanumeric string
    return `${prefix}-${randomString}`;
};

// Generate and save the barcode image
const generateBarcodeAndSave = async (sku) => {
    return new Promise((resolve, reject) => {
        bwipjs.toBuffer(
            {
                bcid: 'code128',  // Barcode type
                text: sku,        // Barcode text
                scale: 3,         // Scale factor
                height: 10,       // Height of the barcode
                includetext: true, // Include text below the barcode
                textxalign: 'center', // Align text at the center
            },
            (err, png) => {
                if (err) {
                    reject(err);
                } else {
                    const barcodeDir = path.join(__dirname, '..', 'public', 'barcodes'); // Adjust path
                    const filePath = path.join(barcodeDir, `${sku}.png`);

                    // Ensure the directory exists
                    if (!fs.existsSync(barcodeDir)) {
                        fs.mkdirSync(barcodeDir, { recursive: true });
                    }

                    // Write the barcode image to a file
                    fs.writeFile(filePath, png, (writeErr) => {
                        if (writeErr) {
                            reject(writeErr);
                        } else {
                            resolve(filePath); // Return the file system path
                        }
                    });
                }
            }
        );
    });
};







const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        description,
        category,
        mrpprice,
        purchasePrice,
        sellingPrice,
        quantity,
        supplier,
        sku,
        manufacturingDate,
        expiryDate,
        weight
    } = req.body;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if SKU changed, and regenerate the barcode if needed
        if (sku && sku !== product.sku) {
            product.barcode = await generateBarcode(sku); // Regenerate barcode for the updated SKU
        }

        // Update product fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.mrpprice = mrpprice || product.mrpprice;
        product.purchasePrice = purchasePrice || product.purchasePrice;
        product.sellingPrice = sellingPrice || product.sellingPrice;
        product.quantity = quantity || product.quantity;
        product.supplier = supplier || product.supplier;
        product.sku = sku || product.sku;
        product.manufacturingDate = manufacturingDate || product.manufacturingDate;
        product.expiryDate = expiryDate || product.expiryDate;
        product.weight = weight || product.weight;

        const updatedProduct = await product.save();
        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Get All Products Controller
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        // Return products with their respective barcode images
        const productsWithBarcodes = products.map(product => ({
            ...product.toObject(),
            barcode: product.barcode || null,  // Ensure barcode is included
        }));

        res.status(200).json(productsWithBarcodes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

const getAllProductsCategory = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('category')  // This will populate the category data

        // Return products with their respective barcode images
        const productsWithBarcodes = products.map(product => ({
            ...product.toObject(),
            barcode: product.barcode || null,  // Ensure barcode is included
        }));

        res.status(200).json(productsWithBarcodes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Function to generate barcode image from SKU
// const generateBarcode = async (sku) => {
//     return new Promise((resolve, reject) => {
//         bwipjs.toBuffer(
//             {
//                 bcid: 'code128',  // Barcode type
//                 text: sku,        // Barcode text (e.g., SKU)
//                 scale: 3,         // Scale factor for the barcode image
//                 height: 10,       // Height of the barcode
//                 includetext: true, // Include text below the barcode
//                 textxalign: 'center', // Align text at the center
//             },
//             (err, png) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     // Convert the PNG buffer to a base64-encoded string
//                     const barcodeBase64 = png.toString('base64');
//                     const barcodeImage = `data:image/png;base64,${barcodeBase64}`;
//                     resolve(barcodeImage); // Return the base64 barcode image URL
//                 }
//             }
//         );
//     });
// };
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the product to delete
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove the product from the supplier's productsSupplied list
        const supplier = await Supplier.findById(product.supplier);
        if (supplier) {
            supplier.productsSupplied = supplier.productsSupplied.filter(
                (productInfo) => productInfo.productId.toString() !== product._id.toString()
            );
            await supplier.save();
        }

        // Delete the product
        await Product.findByIdAndDelete(id);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};


module.exports = {
    addProduct,
    updateProduct,
    getAllProducts,
    deleteProduct,
    getAllProductsCategory,
};
