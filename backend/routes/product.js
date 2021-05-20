const express = require('express')
const router = express.Router();

const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController')

//GET
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);

//POST
router.route('/admin/product/new').post(newProduct);

//PUT
router.route('/admin/product/:id').put(updateProduct);

//DELETE
router.route('/admin/product/:id').delete(deleteProduct);

module.exports = router;