var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    product_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    cart_id: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});

itemSchema.index({product_id: 1, cart_id: 1}, {unique: true});

module.exports = mongoose.model('Item', itemSchema);