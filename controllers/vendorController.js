const Vendor=require('../models/Vendor');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();
const secretKey=process.env.WhatIsYourName;
const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Register Body:", req.body);
    console.log("password:", password);
    try {
        const vendorEmail = await Vendor.findOne({ email });
        if (vendorEmail) {
            return res.status(400).json({ message: 'Vendor already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVendor.save();
        res.status(201).json({ message: 'Vendor registered successfully' });
        console.log('Vendor registered successfully');
    } catch (error) {
        console.error('Error registering vendor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {    
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: '1h' });
        const vendorId= vendor._id;
        res.status(200).json({ message: 'Vendor logged in successfully', token,vendorId });
        console.log('email:', email);
    }
    catch (error) {
        console.error('Error logging in vendor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({}, '-password').populate('firm'); // Exclude password field
        res.status(200).json({ vendors });
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getVendorById=async(req,res)=>{
    const vendorId= req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate({
            path: 'firm',
            populate: {
                path: 'products'
            }
        });
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        const vendorFirmId = vendor.firm.length > 0 ? vendor.firm[0]._id : null;
        const { password, ...vendorDetails } = vendor.toObject();
        res.status(200).json({ ...vendorDetails, vendorFirmId });
        console.log('Vendor Firm ID:', vendorFirmId);
        
    } catch (error) {
        console.error('Error fetching vendor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    vendorRegister,
    vendorLogin,
    getAllVendors,
    getVendorById
    // Add other vendor-related functions here
};