var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user_id: {
        type: String,
        minlength: 9,
        maxlength: 9,
        required: true
    },
    cart_id: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    total_cost: {
        type: Number,
        required: false
    },
    shipping_city: {
        type: String,
        required: true,
    },
    shipping_street: {
        type: String,
        required: true
    },
    shipping_date: {
        type: Date,
        required: true
    },
    order_date: {
        type: Date,
        default: Date.now
    },
    credit_card: {
        type: String,
        minlength: 4,
        maxlength: 4,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);