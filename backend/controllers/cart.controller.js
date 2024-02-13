const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const Cart = require("../models/cart");
const { verifyToken, verifyTokenAndAdmin } = require("../utils/verifyToken");
const mongoose = require("mongoose");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



// GET CART FROM DB
router.get('/', verifyToken, async (req, res) => {
    const { _id } = req.user;
    try {
        let userCart = await Cart.findOne({userId: _id});
        if (userCart === null || userCart.orderItems.length === 0 ){
            return;
        }
        if (userCart.orderItems && userCart.orderItems.length > 0){
            userCart = await userCart.populate({
                path: 'orderItems',
                populate: {
                    path: 'products',
                    populate: {
                        path: 'productId',
                        select: '-countInStock'
                    },
                },
            });
        }
        res.status(200).json({userCart});
    } catch (err) {
        res.status(500).json({error: err});
    }
});

// PAY FOR CART
/*router.post('/cart', verifyToken, async (req, res) => {
    try {
        const {_id} = req.user;
        const {shippingAddress, totalPrice} = req.body;

        const order = await Order.findByIdAndUpdate(_id, {shippingAddress, totalPrice}, {new: true});
        res.status(200);
    } catch (err) {
        res.status(500).json(err);
      }
}); */

router.post('/create-checkout-session', verifyToken, async (req, res) => {
    const { _id } = req.user;

    try {
        let userCart = await Cart.findOne({userId: _id});
        if (userCart === null){ return;}

        if (userCart.orderItems && userCart.orderItems.length > 0){
            userCart = await userCart.populate({
                path: 'orderItems',
                populate: {
                    path: 'products',
                    populate: {
                        path: 'productId',
                        select: '-countInStock, -__v'
                    },
                },
            });
        }

        const lineItems = [];

        userCart.orderItems.forEach(item => {
            item.products.forEach(product => {
                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.productId.name,
                            images: [product.productId.image],
                        },
                        unit_amount: product.productId.price,
                    },
                    quantity: product.quantity * 100,
                });
            });
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/checkout-sucess`,
            cancel_url: `${process.env.BASE_URL}/cart`,
        });

        res.json({url: session.url});

    } catch (Error) {
        res.status(500).json({message: `${Error.type}: ${Error.raw.message}`});
    }
});


module.exports = router 