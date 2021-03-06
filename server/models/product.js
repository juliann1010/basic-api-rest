var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: { type: String, required: [true, 'The name is required'] },
    price: { type: Number, required: [true, 'Price is required'] },
    description: { type: String, required: false },
    available: { type: Boolean, required: true, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
});


module.exports = mongoose.model('product', productSchema);