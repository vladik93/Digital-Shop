var express = require('express');
var cors = require('cors');
var router = express.Router();
var mongoose = require('mongoose');
var auth = require('../authenticate');
var ObjectId = mongoose.Types.ObjectId;
var Cart = require('../models/cart');
var Item = require('../models/item');

router.options('*', cors());

router.get('/', auth.authenticate, async(req, res) => {
    try {
        var foundCart = await Cart.findOne({user_id: req.user._id});
        if(!foundCart) {
            return res.status(400).send('Cart not found');
        } else {
            var items = await Item.aggregate([
                { $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product_info'
                }},
                { $match: { cart_id: foundCart._id} },
                { $unwind: '$product_info'},
                
                { $group: {
                    _id: null, 
                    data: 
                        {$push: {
                            item_id: '$_id',
                            name: '$product_info.name', 
                            quantity: '$quantity', 
                            price: '$product_info.price', 
                            image: '$product_info.image',
                            total: {$sum: {$multiply: ['$quantity', '$product_info.price']}}
                        }
                    },
                    grand_total: {$sum: {$multiply: ['$quantity', '$product_info.price']}}
                }}
                
            ])
            if(!items) {
                return res.status(400).send('Items were not found in the cart');
            } else {
                res.status(200).json(items);
            }
        }
    } catch(err) {
        res.status(400).json(err);
    }
});

router.get('/valid', async(req, res) => {
    try {
        var cart = await Cart.findOne({user_id: req.user._id});
        if (!cart) {
            res.status(400).send('Cart not found');
        } else {
            res.status(200).json(cart);
        }
    } catch(err) {
        res.status(400).json(err);
    }
})

router.post('/', auth.authenticate, async(req, res) => {
    try {
        var foundCart = await Cart.findOne({user_id: req.user._id});
        if(!foundCart) {
            return res.status(400).send('Cart not found');
        } else {
            // res.status(200).json(foundCart);
            var item = new Item({
                product_id: req.body.product_id,
                cart_id: foundCart._id,
                quantity: req.body.quantity
            });
            var newItem = await item.save();
            res.status(200).json(newItem);
        }
    } catch(err) {
        res.status(400).json(err);
    }
});

router.put('/:item_id', auth.authenticate, async(req, res) => {
    try {
        var foundCart = await Cart.findOne({user_id: req.user._id});
        if(!foundCart) {
            res.status(400).send('Cart not found');
        } else {
            var foundItem = await Item.findOne({_id: req.params.item_id});
            if(!foundItem) {
                res.status(400).send('Item not found in cart');
            } else {
                var updatedItem = await Item.updateOne({_id: foundItem._id}, {$set: { "quantity": req.body.quantity}});
                res.status(200).json(updatedItem);
            }

        }
    } catch(err) {
        res.status(400).json(err);
    }
})

router.get('/new', auth.authenticate, async(req, res) => {
    var cart = new Cart({
        user_id: req.user._id
    });
    try {
        var newCart = await cart.save();
        res.status(200).json(newCart);
    } catch(err) {
        res.status(400).json(err);
    }
});

router.delete('/', auth.authenticate, async(req, res) => {
    try {
        var cart = await Cart.findOne({user_id: req.user._id});
        if(!cart) {
            res.status(400).send('Cart not found');
        } else {
            var cartDeleted = await Cart.findOneAndDelete({_id: cart._id});
            res.status(200).json(cartDeleted);
        }
    } catch(err) {
        res.status(400).json(err);
    }
});

router.delete('/all', auth.authenticate, async(req, res) => {
    var cart = await Cart.findOne({user_id: req.user._id});
    if(!cart) {
        res.status(400).send('Cart not found');
    } else {
       var items = await Item.remove({cart_id: cart._id});
       res.status(200).json(items);
    }
});

router.delete('/:item_id', auth.authenticate, async(req, res) => {
    try {
        var cart = await Cart.findOne({user_id: req.user._id});
        if(!cart) {
            res.status(400).send('Cart not found');
        } else {
            var item = await Item.findByIdAndDelete(req.params.item_id);
            res.status(200).json(item);
        }
    } catch(err) {
        res.status(400).json(err);
    }
})















module.exports = router;