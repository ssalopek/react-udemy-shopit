const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

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

    const token = user.getJwtToken();

    res.status(201).json({
        success: true, 
        token
    })

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

    const token = user.getJwtToken();

    res.status(200).json({
        success: true, 
        token
    })

})