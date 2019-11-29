var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};



var userSchema = new Schema({
    _id: {
        type: String,
        requried: true,
        minlength: 9,
        maxlength: 9,
        validate: /^\d+$/
    },
    name: {
        type: String,
        required: true,
        maxlength: 255,
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 255,
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        unique: true,
        validate: validateEmail
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 500
    },
    admin: {
        type: Boolean,
        default: 0
    },
    city: {
        type: String,
        required: true,
        maxlength: 255
    },
    street: {
        type: String,
        required: true,
        maxlength: 255
    }
});

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

userSchema.index({name: 1, last_name: 1}, {unique: true});
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);