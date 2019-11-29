var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true
    },
    date_created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cart', cartSchema);