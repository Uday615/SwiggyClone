const Product = require('../models/Product');
const Firm = require('../models/Firm');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const addProduct = async (req, res) => {
    try{
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.path : null; // Assuming the image is uploaded using multer and available in req.file

        const firmId = req.params.firmId; // Get firmId from request parameters
        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return res.status(400).json({ message: 'Invalid firm ID' });
        }

        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: 'Firm not found' });
        }

        const product = new Product({
            productName,
            price,
            category,
            bestSeller,
            description, 
            image,
            firm: firm._id // Associate the product with the firm
        });

        const savedProduct = await product.save();
        firm.products.push(savedProduct._id); // Add the product ID to the firm's product array
        await firm.save(); // Save the updated firm

        return res.status(201).json({ message: 'Product added successfully', product: savedProduct });
    }
    catch(error){
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const getProductByFirm= async (req, res) => {
    try {
        const firmId = req.params.firmId; // Get firmId from request parameters
        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return res.status(400).json({ message: 'Invalid firm ID' });
        }

        const firm = await Firm.findById(firmId).populate('products');
        if (!firm) {
            return res.status(404).json({ message: 'Firm not found' });
        }
        const restaurantName = firm.firmName; // Assuming firm has a field 'firmName'
        const products=await Product.find({ firm: firmId });
        res.status(200).json({  restaurantName,products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.productId; // Get productId from request parameters
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Optionally, remove the product reference from the firm
        await Firm.updateMany({ products: productId }, { $pull: { products: productId } });

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    addProduct: [upload.single('image'), addProduct], getProductByFirm
};