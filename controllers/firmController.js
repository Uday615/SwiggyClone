const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const addFirm = async (req, res) => {
    try {
        const { firmName, firmArea, firmCategory, firmRegion, firmOffer } = req.body;
        
        const image = req.files && req.files.length > 0 ? req.files[0].path : null;

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        if(vendor.firm.length >0) {
            return res.status(400).json({ message: 'Vendor already has a firm' });
        }
        const firm = new Firm({
            firmName,
            area: firmArea,
            category: firmCategory,
            region: firmRegion,
            offer: firmOffer,
            image,
            vendor: vendor._id
        });

        const savedFirm = await firm.save();
        const firmId = savedFirm._id;
        vendor.firm.push(savedFirm._id);
        await vendor.save();
        
        return res.status(201).json({ message: 'Firm added successfully', firmId });
    } catch (error) {
        console.error('Error adding firm:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return res.status(400).json({ message: 'Invalid firm ID' });
        }

        const deletedFirm = await Firm.findByIdAndDelete(firmId);
        if (!deletedFirm) {
            return res.status(404).json({ message: 'Firm not found' });
        }

        await Vendor.updateMany(
            { firm: firmId },
            { $pull: { firm: firmId } }
        );

        return res.status(200).json({ message: 'Firm deleted successfully' });
    } catch (error) {
        console.error('Error deleting firm:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addFirm,
    deleteFirmById
};