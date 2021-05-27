const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'orders were fetched'
    });
});
router.post('/',(req,res,next)=>{
    const order ={
        productId:req.body.productId,
        quantity:req.body.quantity
    }
    res.status(201).json({
        message:'orders was created',
        order:order
    });
});
router.get('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:'orders details',
        id:req.params.orderId
    });
});
router.get('/:orderId',(req,res,next)=>{
    res.status(200).json({
        message:'orders deleted',
        id:req.params.orderId
    });
});
module.exports = router;