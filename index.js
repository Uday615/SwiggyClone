const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
//const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors= require('cors');
const app = express();
const port = process.env.port ||  4000;
dotenv.config();
app.use(cors())
app.use(express.json()); // Parse JSON bodies before routes
 

const path = require('path');

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
}); 
//app.use(bodyParser.json());
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory
 // Parse JSON bodies
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
app.use('/',(req,res)=>{
    res.send('Welcome to the Home Page');
})