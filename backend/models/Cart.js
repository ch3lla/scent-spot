const { Schema, model } = require("mongoose");
const Order = require('./Order');

const cartSchema =  new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    orderItems: [
        {
            type: Schema.Types.ObjectId,
            ref: Order,
        }
    ]
},{timestamps: true});

const Cart = model("Cart", cartSchema);
module.exports = Cart;