const express = require('express')
const router = express.Router();

const { 
    getProducts, 
    newProduct, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct, 
    createReview,
    getProductReviews,
    deleteReview } = require('../controllers/productController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

/*TODO:
GET routes must have isAuthenticatedUser property just like all routes. 
But when is that included I get blocked in browser. 
Works in postman because I can login/logout. But in browser I can't see list of products because I need to login first !!?? 
Like WTF. This is silly "bug" and FIX IT LATER  !!!! */

//GET ALL AND SINGLE
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);

//POST
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProduct);

//PUT
router.route('/admin/product/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct);

//DELETE
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

//Create review
router.route('/review').put(isAuthenticatedUser, createReview);

//Get product review
router.route('/admin/reviews').get(isAuthenticatedUser, getProductReviews);

//Delete product review
router.route('/reviews').delete(isAuthenticatedUser, deleteReview)

module.exports = router;