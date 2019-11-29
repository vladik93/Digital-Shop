var mongoose = require('mongoose');
var mongoUrl = 'mongodb://localhost:27017/shopping_project_db';

module.exports = function() {
    mongoose.connect(mongoUrl, {useNewUrlParser: true});

    mongoose.connection.on('connected', function() {
        console.log('Mongoose connection open on ' + mongoUrl);
    });

    mongoose.connection.on('error', function(err) {
        console.log('Mongoose connection error: ' + err);
    });

    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose has disconnected');
    });
};

module.exports.toObjectId = (string) => {
    mongoose.Types.ObjectId(string)
};


