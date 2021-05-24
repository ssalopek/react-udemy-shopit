const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

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
        avatar: {
            public_id: '',
            url: ''
        }
    })

    sendToken(user, 200, res)
})

//Forgot password -> /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then just ignore it.`

    try {

        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500))
    }

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