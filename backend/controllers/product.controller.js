const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/cart");
const { verifyToken, verifyTokenAndAdmin } = require("../utils/verifyToken");
const mongoose = require("mongoose");


// GET PRODUCTS FROM DB
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({}, { countInStock: 0 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({message: err});
    }
});

// ADD PRODUCTS TO CART OR ORDER
router.post('/products', verifyToken, async (req, res) => {
    const { _id } = req.user;
    const { productId, quantity } = req.body;
    try {

        const orderItems = productId.map((id, index) => ({
            productId: id,
            quantity: quantity[index]
        }));

        let userOrder = await Order.findOne({userId: _id, isPaid: false});
        if (userOrder === null){
            userOrder = new Order({
                userId: _id,
                products: orderItems,
            });
        } else {
            orderItems.forEach(item => {
                userOrder.products.push(item);
            });
        }
        await userOrder.save();
        
        let userCart = await Cart.findOne({ userId: _id });

        if (userCart === null) {
            userCart = new Cart({
                userId: _id,
                orderItems: userOrder._id
            });
        } else if (!userCart.orderItems || userCart.orderItems.length === 0) {
            userCart.orderItems = userOrder._id;
        }
        
        await userCart.save();
        res.status(200).json({messaged: "Added to cart."});
    } catch (error) {
        if (error._message === "Order validation failed"){
            res.status(400).json({Error: "Invalid product id"});
        }
        res.status(500).json({error: error});
      }
});

// UPDATE PRODUCTS
router.put('/updateProducts', verifyTokenAndAdmin, async (req, res) => {
    try {
        const { productId, name,  description, price, countInStock } = req.body;

        if (!mongoose.isValidObjectId(productId)){
            res.status(400).json({message: 'Invalid product id.'});
            return;
        }

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.description = description;
        if (price) updatedFields.price = price;
        if (countInStock) updatedFields.countInStock = countInStock;

        const updatedProduct = await Product.findByIdAndUpdate(productId, updatedFields, {new: true});

        if (!updatedProduct) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
          res.status(500).json({error: error.message});
    }
});

// DELETE PRODUCTS
router.delete('/products/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        
        if (!mongoose.isValidObjectId(productId)){
            res.status(400).json({message: 'Invalid product id.'});
            return;
        }
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
module.exports = router 