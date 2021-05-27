const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product')

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id')
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            // if (docs.length >= 0) {
            res.status(200).json(response);
            // }
            // else {
            //     res.status(404).json({
            //         message: "No entries found"
            //     })
            // }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.post('/', (req, res, next) => {
    // const product={
    //     name:req.body.name,
    //     price:req.body.price
    // }
    Product.init()
    // id: new mongoose.Types.ObjectId(),
    const product = new Product({
        name: req.body.name,
        price: req.body.price
    })
    product.save().
        then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });


});
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price_id')
        .exec().
        then(doc => {
            console.log(doc);
            res.status(200).json({
                product: doc,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products"
                }
            });
        }).catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        });
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: 'special id',
    //         id: id
    //     })
    // } else {
    //     res.status(200).json({
    //         message: 'you passed an ID'
    //     })
    // }
});
router.patch('/:productId', (req, res, next) => {
    // res.status(200).json({
    //     message: 'updated product!',
    // });
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    // Product.update({_id:id}, {$set:{name:req.body.newName, price:req.body.newPrice}})
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});
router.delete('/:productId', (req, res, next) => {
    // res.status(200).json({
    //     message: 'deleted product!',
    // });
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

});
module.exports = router;