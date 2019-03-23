const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const uniqueRoleValues = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: uniqueRoleValues
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//The following lines allow to modify toJSON method
//This method is always called whenever we want to print or send our schema for example in post requests

userSchema.methods.toJSON = function () {
    
    let usuario = this;
    let userObject = usuario.toObject();
    delete userObject.password; //Don't return password field when sends a response

    return userObject;
}

userSchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
})

module.exports =  mongoose.model('user', userSchema);
