const express = require("express");
const router = express.Router();
const Product = require('../models/Product.js')

router.get('/', async (req, res) => {
    
    try {
        const productList = await Product.find().lean();
        
    } catch (err) {
        res.status(500).json({
            error: err,
            success: false
        });
    }
});

router.post('/', (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    });
    console.log(newProduct);
    newProduct.save().then((createdProduct) => {
        res.status(200).json(createdProduct);
    }).catch((err) => {
        res.status(500).json({
            error: err,
            success: false
        });
    });
    
});


module.exports = router;