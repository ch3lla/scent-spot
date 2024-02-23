const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  badge: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.listenerCount('toJSON', {
  virtuals: true,
});

const Product = model('Product', productSchema);
module.exports = Product;
