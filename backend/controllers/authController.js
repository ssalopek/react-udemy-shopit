const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

//Register user -> /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avata: {
            public_id: '',
            url: ''
        }
    })

    sendToken(user, 200, res)

})

//Login user -> /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const {email, password} = req.body;

    //Check if email and password is entered by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password'));
    }

    //Find user in database
    const user = await User.findOne({ email })
            .select('+password') //because select value of password is by default 'false' (check models/user.js), .select() with + operator is needed

    if(!user){
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    //Check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res);

})

//Logout user -> /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {

    //Clear cookies
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        succes: true,
        message: 'Logged out'
    })
})