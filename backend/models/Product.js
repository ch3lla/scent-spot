const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
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
  price: {
    type: Number,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
  }
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

productSchema.listenerCount("toJSON", {
  virtuals: true,
});

const Product = model("Product", productSchema);
module.exports = Product;
