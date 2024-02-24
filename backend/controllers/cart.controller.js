/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
// eslint-disable-next-line import/order
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// GET CART FROM DB
const getCart = async (req, res) => {
  const { _id } = req.user;
  try {
    let userCart = await Cart.findOne({ userId: _id });
    if (userCart === null || userCart.orderItems.length === 0) {
      return;
    }
    if (userCart.orderItems && userCart.orderItems.length > 0) {
      userCart = await userCart.populate({
        path: 'orderItems',
        populate: {
          path: 'products',
          populate: {
            path: 'productId',
            select: '-countInStock',
          },
        },
      });
    }
    res.status(200).json({ userCart });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

const checkoutCart = async (req, res) => {
  const { _id } = req.user;
  // console.log(req.body);
  try {
    /* let userCart = await Cart.findOne({ userId: _id });
    if (userCart === null) { return; }

    if (userCart.orderItems && userCart.orderItems.length > 0) {
      userCart = await userCart.populate({
        path: 'orderItems',
        populate: {
          path: 'products',
          populate: {
            path: 'productId',
            select: '-countInStock, -__v',
          },
        },
      });
    }

    const lineItems = [];

    userCart.orderItems.forEach((item) => {
      item.products.forEach((product) => {
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
    const lineItems = [];
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.productName,
          images: [product.image],
        },
        unit_amount: product.price * 100,
      },
      quantity: req.body.products[0].quantity,
    }); */
    const lineItems = await Promise.all(req.body.products.map(async (productItem) => {
      const product = await Product.findById(productItem.productId);
      if (!product) {
        // console.log(`Product with ID ${productItem.productId} not found`);
        return null;
      }
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.productName,
            images: [product.image],
          },
          unit_amount: product.price * 100,
        },
        quantity: productItem.quantity,
      };
    }));
    const filteredLineItems = lineItems.filter((item) => item !== null);
    // console.log(filteredLineItems);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: filteredLineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/cart?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?success=failed`,
    });

    res.json({ url: session.url });
  } catch (Error) {
    res.status(500).json({ message: `${Error.type}: ${Error.raw.message}` });
  }
};

module.exports = {
  getCart,
  checkoutCart,
};
