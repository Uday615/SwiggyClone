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
        type: {
            type: String,
            enum: ['Veg', 'Non-Veg']
        }
    },
    region: {
        type: [
            {
                type: String,
                enum: ['North-Indian', 'South-Indian', 'Chinese', 'Bakery']
            }
        ]
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