var mongoose = require('mongoose');
var Schema = mongoose.Schema;

categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    }
});


module.exports = mongoose.model('Category', categorySchema);

