const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const vendorRoutes = require('./routes/vendorRoutes');
const app = express();
const productRoutes = require('./routes/productRoutes');
dotenv.config();
const path = require('path');
const firmRoutes = require('./routes/firmRoutes');
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
}); 
app.use(bodyParser.json());
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory
const port = process.env.port ||  4000;
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
app.use('/',(req,res)=>{
    res.send('Welcome to the Home Page');
})