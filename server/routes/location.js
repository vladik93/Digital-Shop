var express = require('express');
var router = express.Router();
var City = require('../models/city');
var Street = require('../models/street');

router.get('/city', async(req, res) => {
    try {
        var cities = await City.find({});
        res.status(200).json(cities);
    } catch(err) {
        res.status(400).json(err);
    }
});

router.get('/street/:city_name', async(req, res) => {
    try {
        var cities = await Street.find({city_name: req.params.city_name});
        res.status(200).json(cities);
    } catch(err) {
        res.status(400).json(err);
    }
});

router.post('/city', async(req, res) => {
    try {
        var city = new City({
            name: req.body.name
        });
        var newCity = await city.save();
        res.status(200).json(newCity);
    } catch(err) {
        res.status(400).json(err);
    }
})

router.post('/street', async(req, res) => {
    try {
        var street = new Street({
            name: req.body.name,
            city_name: req.body.city_name
        });
        var newStreet = await street.save();
        res.status(200).json(newStreet);
    } catch(err) {
        res.status(400).json(err);
    }
});


module.exports = router;