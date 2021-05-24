const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        minlength: [6, 'Your password is too weak'],
        select: false //don't display password to user
    },
    avatar: {
        public_id: {
            type: String,
            required: false
        },
        url: {
            type: String,
            required: false
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

//Encrypting password before saving user
userSchema.pre('save', async function(next){ //before saving user do something. Alson can't use arrow function here for some reason
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10); //10 is recomended number for salt value
})

//Compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password); //comapre given password 'enteredPasword' with given hash
}

//Return JSON Web Token 
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

module.exports = mongoose.model('User', userSchema);
