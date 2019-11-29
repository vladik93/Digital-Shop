var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var streetSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    city_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Street', streetSchema);