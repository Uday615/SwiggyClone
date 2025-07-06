const Vendor= require('../models/Vendor');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.WhatIsYourName;
const verifyToken = async (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        const vendor = await Vendor.findById(decoded.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found.' });
        }
        req.vendorId = vendor._id; // Attach the vendor to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error);
       return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = verifyToken;