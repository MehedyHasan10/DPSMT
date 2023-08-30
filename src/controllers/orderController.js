const createError = require("http-errors");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { successResponse, errorResponse } = require("./responseController");

const placeOrder = async (req, res, next) => {
  try {
    const { nidNo, productId, quantity,totalPrice } = req.body;

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Calculate total ordered quantity within the last 24 hours
    const totalOrdered = await Order.aggregate([
      { $match: { nidNo: nidNo, orderDate: { $gte: last24Hours } } },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);

    const currentOrderedQuantity =
      totalOrdered.length > 0 ? totalOrdered[0].totalQuantity : 0;

    if (currentOrderedQuantity + quantity > 2) {
      throw createError(400, "Order limit exceeded (max 2 liters per day)");
    }

    const order = await Order.create({
      nidNo,
      productId,
      quantity,
      totalPrice,
      orderDate: Date.now(),
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Order placed successfully...",
      payload: { order },
    });
  } catch (error) {
    next(error);
  }
};

const getSingleOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id);
    return successResponse(res, {
      statusCode: 200,
      message: "Order is returned...",
      payload: { order },
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deleteOrder = await Order.findByIdAndDelete(id);
    if (!deleteOrder) {
      throw createError(404, "No order found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Order is delete successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      $or: [{ nidNo: { $regex: searchRegExp } }],
    };

    const orders = await Order.find(filter)
      //.populate("category")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const count = await Order.find(filter).countDocuments();

    if (orders.length === 0) {
      throw createError(404, "Order Not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Order was returned successfully...",
      payload: {
        products: orders,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1,
          nextPAge: page + 1,
          totalNumberOfProducts: count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, deleteOrderById, getSingleOrder, getOrders };
