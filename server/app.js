var express = require('express');
var morgan = require('morgan');
var passport = require('passport');
var cors = require('cors');
var session = require('express-session');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200',],
    credentials: true,
    
}));

app.use(session({
    name: 'mysession.sid',
    secret: 'itsasecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 36000000,
        httpOnly: false,
        secure: false
    }
}));


app.use(passport.initialize());
app.use(passport.session());

// MongoDb connection
require('./mongo')();
require('./passport');

// Routes
var userRoute = require('./routes/user');
var productRoute = require('./routes/product');
var cartRoute = require('./routes/cart');
var orderRoute = require('./routes/order');
var locationRoute = require('./routes/location');

app.use('/shopping/api/user', userRoute);
app.use('/shopping/api/product', productRoute);
app.use('/shopping/api/cart', cartRoute);
app.use('/shopping/api/order', orderRoute);
app.use('/shopping/api/location', locationRoute);





app.listen(port, function() {
    console.log('Connected to port ' + port);
})