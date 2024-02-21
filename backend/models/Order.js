const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  products: [
    {
      _id: false,
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  shippingAddress: {
    type: String,
    required: false,
  },
  totalPrice: {
    type: Number,
    required: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

const Order = model('Order', orderSchema);
module.exports = Order;
