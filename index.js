
// const express = require('express')
// const connectDB = require('./config/DB.js')
// const cors = require('cors')
// require('dotenv').config(); // Make sure dotenv is loaded
// const path = require('path');
// const app = express()

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors('*'));

// // routes import
// const userRoutes = require('./routes/User.routes.js')
// const productRoutes = require('./routes/Product.routes.js')
// const supplierRoutes = require('./routes/Supplier.routes.js')
// const purchaseRoutes = require('./routes/Purchase.routes.js')
// const salesRoutes = require('./routes/Sales.routes.js')
// app.use('/api/v1/user', userRoutes);
// app.use('/api/v1/product', productRoutes);
// app.use('/api/v1/supplier', supplierRoutes);
// app.use('/api/v1/purchases', purchaseRoutes);
// app.use('/api/v1/sales', salesRoutes);

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// connectDB()

// // Use process.env.PORT, fallback to 5000 if not set
// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}!`)
// })


const express = require('express');
const connectDB = require('./config/DB.js');
const cors = require('cors');
require('dotenv').config(); // Make sure dotenv is loaded
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors('*'));

// routes import
const userRoutes = require('./routes/User.routes.js');
const productRoutes = require('./routes/Product.routes.js');
const supplierRoutes = require('./routes/Supplier.routes.js');
const purchaseRoutes = require('./routes/Purchase.routes.js');
const salesRoutes = require('./routes/Sales.routes.js');
const categoryRoutes = require('./routes/category.routes.js');

// API routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/supplier', supplierRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/sales', salesRoutes);

app.use('/api/v1/category', categoryRoutes);

// Serve static files
const receiptPath = path.join(__dirname, 'public', 'receipts');
const barcodePath = path.join(__dirname, 'public', 'barcodes');

// Static file routes for receipts and barcodes
app.use('/public/receipts', express.static(receiptPath));
app.use('/public/barcodes', express.static(barcodePath));

// Home route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Connect to database
connectDB();

// Use process.env.PORT, fallback to 5000 if not set
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
});
