const mongoose = require('mongoose');
const firmSchema = new mongoose.Schema({
    firmName: {
        type: String,
        required: true,
        unique: true
    },
    area: {
        type: String,
        required: true
    },
    category: {
        type: [String],
        enum: ['veg', 'non-veg']
    },
    region: {
        type: [String],
        enum: ['north-indian', 'south-indian', 'chinese', 'bakery']
    },
    offer: {
        type: String
    },
    image:{
        type: String
        
    },
    vendor:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor'
        }
    ],
    products:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }]
});

const Firm = mongoose.model('Firm', firmSchema);
module.exports = Firm;