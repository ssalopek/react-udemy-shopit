const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name is too long']
    },
    email: {
        type: String,
        required: [true, 'Please enter your name'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid e-mail']
    },
    password: {
        type: String,
        required: [true, 'Please enter you password'],
        minLength: [6, 'Your password is too weak'],
        select: false //don't display password to user
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

module.exports = mongoose.model('User', userSchema);
