const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
// const User = require('./users');

let Schema = mongoose.Schema;

let categorySchema =  new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'User is required'],
        ref: 'user'
    }
})

categorySchema.plugin(uniqueValidator, {
    message: '{PATH} must be unique'
})

module.exports = mongoose.model('category', categorySchema);