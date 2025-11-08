// ...existing code...
const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    addProduct, 
    updateProduct, // Impor fungsi ini dari controller
    deleteProduct  // Impor fungsi ini dari controller
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, admin, addProduct); // Hanya admin yang terotentikasi bisa POST

router.route('/:id')
    .put(protect, admin, updateProduct)    // Hanya admin yang bisa PUT
    .delete(protect, admin, deleteProduct); // Hanya admin yang bisa DELETE

module.exports = router;
// ...existing code...