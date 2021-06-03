const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    // res.status(200).json({
    //     message: 'orders were fetched'
    // });
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc.id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/order/" + doc._id
                        }
                    }
                }),

            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});
router.post('/', (req, res, next) => {
    // const order ={
    //     productId:req.body.productId,
    //     quantity:req.body.quantity
    // }
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found!'
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            return order.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    quantity: result.quantity,
                    product: result.product
                },
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/order/" + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            })
        });

    // res.status(201).json({
    //     message: 'orders was created',
    //     order: order
    // });
});
router.get('/:orderId', (req, res, next) => {
    // res.status(200).json({
    //     message: 'orders details',
    //     id: req.params.orderId
    // });
    Order.findById(req.params.orderId)
    .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/order'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});
router.delete('/:orderId', (req, res, next) => {
    // res.status(200).json({
    //     message: 'orders deleted',
    //     id: req.params.orderId
    // });
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json(
                {
                    message: 'Order deleted',
                    request: {
                        type: 'POST',
                        url: "http://localhost:3000/order",
                        body: { productId: "ID", quantity: "Number" }
                    }
                }
            )
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            })
        })
});
module.exports = router;