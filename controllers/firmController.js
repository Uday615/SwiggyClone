const Firm= require('../models/Firm');
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.WhatIsYourName;
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });



const addFirm = async (req, res) => {
    try{
        const { firmName, area, category, region, offer } = req.body;
    const image = req.file ? req.file.path : null; // Assuming the image is uploaded using multer and available in req.file // 'image' is the field name in the form

    const vendorId = await Vendor.findById(req.vendorId); // Use req.vendorId set by verifyToken
    if (!vendorId) {
        return res.status(400).json({ message: 'Vendor not found' });
    }
    const firm = new Firm({
        firmName,
        area,
        category,
        region,
        offer,
        image,
        vendor: vendorId ? [vendorId._id] : [] // Add the vendor ID to the firm
    });
    const savedFirm= await firm.save();
    vendorId.firm.push(savedFirm._id); // Add the firm ID to the vendor's firm array
    await vendorId.save(); // Save the updated vendor
    return res.status(201).json({ message: 'Firm added successfully', firm });
    }
    catch (error) {
        console.error('Error adding firm:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}   

module.exports = {
    addFirm: [upload.single('image'), addFirm]
    // Add other firm-related functions here
};