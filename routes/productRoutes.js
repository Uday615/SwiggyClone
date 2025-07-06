const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.post('/add-product/:firmId', productController.addProduct); // Add product with firmId
router.get('/:firmId/products', productController.getProductByFirm); // Get products by firmId
router.get('/uploads/:imageName', (req, res) => {
    const imagename = req.params.imageName;
    res.headersSent('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname,'..', 'uploads', imageName));
});

router.delete(':/productId', productController.deleteProductById); // Delete product by productId

module.exports = router;