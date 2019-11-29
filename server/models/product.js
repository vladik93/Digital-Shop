var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category_id: {
      type: Schema.Types.ObjectId, // FK
      required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: 'images/no_image.jpg'
    }
})


module.exports = mongoose.model('Product', productSchema);












