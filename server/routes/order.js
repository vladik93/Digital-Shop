var express = require('express');
var router = express.Router();
var auth = require('../authenticate');
var Order = require('../models/order');
var Cart = require('../models/cart');
var Item = require('../')


router.get('/', auth.authenticate, async(req, res, next) => {
    try {
        var cart = await Cart.findOne({user_id: req.user._id});
        if(!cart) {
            res.status(400).send('Cart not found');
        } else {
            var order = await Order.aggregate([
                { $match: {cart_id: cart._id}},
                { $lookup: {
                    from: 'items',
                    localField: 'cart_id',
                    foreignField: 'cart_id',
                    as: 'item_info'
                }},
                { $unwind: '$item_info'},
                { $lookup: {
                    from: 'products',
                    localField: 'item_info.product_id',
                    foreignField: '_id',
                    as: 'product_info'
                }},
                { $unwind: '$product_info'},
                { $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_info'
                }},
                { $unwind: '$user_info'},
                { $group: {
                    _id: null,
                    order_info: { $addToSet: {
                        order_id: '$_id',
                        cart_id: '$cart_id',
                        shipping_city: '$shipping_city',
                        shipping_street: '$shipping_street',
                        shipping_date: '$shipping_date',
                        order_date: '$order_date',
                        credit_card: '$credit_card'
                    }},
                    user_info: { $addToSet: {
                        user_id: '$user_info._id',
                        name: '$user_info.name',
                        lastname: '$user_info.last_name',
                        email: '$user_info.email',
                        city: '$user_info.city',
                        street: '$user_info.street'
                    }},
                    cart_info: {$push: {
                        product_id: '$product_info._id',
                        product_name: '$product_info.name',
                        product_price: '$product_info.price',
                        item_quantity: '$item_info.quantity',
                        item_total: { $sum: { $multiply: ['$product_info.price', '$item_info.quantity']}}
                    }},
                    grand_total: { $sum: { $multiply: ['$product_info.price', '$item_info.quantity']}},
                }},
            ]);
            res.status(200).json(order);
        }
    } catch(err) {
        res.status(400).json(err);
    }
})

router.get('/count', async(req, res) => {
    try {
        var orderCount = await Order.aggregate([
            { $group: {_id: null, orderCount: {$sum: 1}}},
            { $project: {_id: 0}}
        ]);
        res.status(200).json(orderCount);
    } catch(err) {
        res.status(400).json(err);
    }
})

router.get('/last', auth.authenticate, async(req, res) => {
    try {
        var order = await Order.aggregate([
            { $match: { user_id: req.user._id}},
            { $sort: { order_date: -1}},
            { $limit: 1 }
        ]);
        res.status(200).json(order);
    } catch(err) {
        res.status(400).json(err);
    }
});

router.get('/exist', auth.authenticate, async(req, res) => {
    try {
       var cart = await Cart.findOne({user_id: req.user._id});
       if(!cart) {
           res.status(400).send('Cart not found');
       } else {
           var order = await Order.findOne({cart_id: cart._id});
           if(!order) {
               res.status(400).send('Order not found');
           } else {
               res.status(200).json(order);
           }
       }

    } catch(err) {
        res.status(400).send(err);
    }
})

router.get('/datecheck/:date', async(req, res) => {
    try {
        var date = new Date(req.params.date).setDate(new Date(req.params.date).getDate() + 1);
        var orders = await Order.aggregate([
            {$match: {shipping_date: {$gte: new Date(req.params.date), $lt: new Date(date)}}},
            { $group: { _id: null, shipping_count: { $sum: 1 } } },
            { $project: { _id: 0 } }
        ]);
        console.log(new Date(date) )
        res.status(200).json(orders);
    } catch(err) {
        res.status(400).json(err);
    }
});

router.post('/', auth.authenticate, async(req, res, next) => {
   try {
    var cart = await Cart.findOne({user_id: req.user._id});
    if(!cart) {
        res.status(400).send('Cart not found');
    } else {
        var order = new Order({
            user_id: req.user._id,
            cart_id: cart._id,
            shipping_city: req.body.shipping_city,
            shipping_street: req.body.shipping_street,
            shipping_date: new Date(req.body.shipping_date).setDate(new Date(req.body.shipping_date).getDate() + 1),
            credit_card: req.body.credit_card
        });
        var newOrder = await order.save();
        res.status(200).json(newOrder);
    }

   } catch(err) {
       res.status(400).json(err);
   }  
});



module.exports = router;









