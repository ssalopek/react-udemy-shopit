const express = require('express');
const router = express.Router();

const {
    newOrder, 
    getSingleOrder, 
    myOrders,
    allOrders,
    updateOrder} = require('../controllers/orderController');

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth');

//Create new order
router.route('/order/new').post(isAuthenticatedUser, newOrder);

//Get single order
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);

//Get users order (my orders)
router.route('/orders/me').get(isAuthenticatedUser, myOrders);

//ADMIN Get all orders
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), allOrders);

//ADMIN Update processed order
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder);

module.exports = router;