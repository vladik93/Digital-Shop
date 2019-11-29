var express = require('express');
var router = express.Router();


var Product = require('../models/product');
var Category = require('../models/category');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

router.get('/', async(req, res) => {
    try {
        var products = await Product.aggregate([
            {"$lookup": {
                "from": "categories",
                "localField": "category_id",
                "foreignField": "_id",
                "as": "category_info"
            }}
        ]);
        res.status(200).json(products);
    } catch(err) {
        res.status(400).json(err);
    }
    
})



router.get('/category/:product_category', async(req, res) => {
    try {
        var products = await Product.aggregate([
            {'$match': {category_id: ObjectId(req.params.product_category)}},
            {'$lookup': {
                'from': 'categories',
                'localField': 'category_id',
                'foreignField': '_id',
                'as': 'category_info'
            }}
        ]);
        res.status(200).json(products);

    } catch(err) {
        res.status(400).send('Error retrieving products');
    } 
})

// router.get('/name/:product_name', async(req, res) => {
//     try {
//         var product = await Product.find({name: new RegExp(req.params.product_name, 'i')}); // Works for finding incomplete strings
//         if(!product) {
//             res.status(400).send('Product not found');
//         } else {
//             res.status(200).json(product);
//         }
//     } catch(err) {
//         res.status(400).json(err);
//     }

// });

router.get('/count', async(req, res) => {
    try { 
        var productCount = await Product.aggregate([
            { $group: { _id: null, productCount: {$sum: 1}}},
            { $project: {_id: 0}}
        ]);
        res.status(200).json(productCount);
    } catch(err) {
        res.status(400).json(err);
    }
})

router.get('/name/:product_name', async(req, res) => {
    try {
        var product = await Product.aggregate([
            {$match: {name: new RegExp(req.params.product_name, 'i')}},

            {$lookup: {
                from: "categories",
                localField: "category_id",
                foreignField: "_id",
                as: "category_info"
            }}
        ]);

        if(!product) {
            res.status(400).send('Product not found');
        } else {
            res.status(200).json(product);
        }
        
    } catch(err) {
        res.status(400).json(err);
    }
})

router.post('/', async(req, res) => {
    var product = new Product({
        name: req.body.name,
        category_id: ObjectId(req.body.category_id),
        price: req.body.price,
        image: req.body.image
    });
    try {
        var result = await Category.findById(product.category_id);
        if(!result) {
            return res.status(400).send('Category ID not found');
        } else {
            var newProduct = await product.save();
            res.status(200).json(newProduct);
        }
    } catch(err) {
        res.status(400).json(err);
    }
    
})

router.get('/category', async(req, res) => {
    try {
        var categories = await Category.find({});
        res.status(200).json(categories);

    } catch(err) {
        res.status(400).json(err)
    }
});

router.post('/category', async(req, res) => {
    var category = new Category({
        name: req.body.name
    });

    try {
        var newCategory = await category.save();
        res.json(newCategory);
    } catch(err) {
        res.json(err);
    }
});


router.get('/:id', async(req, res) => {
    try {
        var product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch(err) {
        res.status(400).json(err);
    }
})

router.put('/:id', async(req, res) => {
    try {
        var product = {
            name: req.body.name,
            category_id: req.body.category_id,
            price: req.body.price,
            image: req.body.image
        };
        var updated = await Product.updateOne({_id: req.params.id}, product);
        res.status(200).json(updated);
    } catch(err) {
        res.status(400).json(err);
    }
})








module.exports = router;