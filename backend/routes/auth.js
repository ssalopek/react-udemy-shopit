const express = require('express');
const router = express.Router();

const {
    registerUser, 
    loginUser, 
    logout, 
    forgotPassword, 
    resetPassword, 
    getUserProfile,
    updatePassword,
    updateProfile} = require('../controllers/authController');

const { isAuthenticatedUser } = require('../middlewares/auth');

//Register user
router.route('/register').post(registerUser);

//Login user
router.route('/login').post(loginUser);

//Forgot password
router.route('/password/forgot').post(forgotPassword);

//Reset password
router.route('/password/reset/:token').put(resetPassword)

//Update password
router.route('/password/update').put(isAuthenticatedUser, updatePassword);

//Update profile
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

//Get user profile
router.route('/me').get(isAuthenticatedUser, getUserProfile);

//Logout user
router.route('/logout').get(logout);

module.exports = router;
