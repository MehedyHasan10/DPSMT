
const { Schema, model } = require('mongoose');
const User = require("../models/userModel");
const Product = require("../models/productModel");

const orderSchema = new Schema(
  {
    nidNo: {
      type: String,
      required: [true, 'NID number is required'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 1,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = model('Order', orderSchema);
module.exports = Order;
