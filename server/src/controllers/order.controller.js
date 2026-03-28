import { Order } from "../models/order.model.js";
import { Product } from "../models/product.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function calculatePrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );

  const shippingPrice = itemsPrice > 500 ? 0 : 10;
  const taxRate = 0.18;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;
  if (orderItems && orderItems.length === 0) {
    throw new Error("No order items");
  }

  const itemsFromDB = await Product.find({
    _id: { $in: orderItems.map((eachItem) => eachItem._id) },
  });

  const dbOrderItems = orderItems.map((itemFromClient) => {
    const matchingItemFromDB = itemsFromDB.find(
      (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id,
    );

    if (!matchingItemFromDB)
      throw new Error(`Product not found : ${itemFromClient._id}`);

    return {
      ...itemFromClient,
      product: itemFromClient._id,
      price: matchingItemFromDB.price,
      _id: undefined,
    };
  });

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
    calculatePrices(dbOrderItems);

  const order = new Order({
    orderItems: dbOrderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  res.status(200).json({
    status: 200,
    data: order,
    msg: "Order created successfully",
  });
});

const getOwnOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  console.log(orders);

  res
    .status(200)
    .json({ status: 200, data: orders, msg: "Orders Fetched Successfully" });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, keyword = "recent" } = req.query;

  const DBquery = [];
  DBquery.push(
    {
      $match: {},
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$user",
    },
  );

  const orders = await Order.aggregatePaginate(Order.aggregate(DBquery), {
    page: +page,
    limit: +limit,
  });

  res.status(200).json({
    sattus: 200,
    data: {
      orders: orders.docs,
      currentPage: +page,
      limit: +limit,
      totalDocs: orders.totalDocs || 0,
      totalPages: orders.totalPages,
      nextPage: orders.nextPage,
    },
    msg: "All Orders Fetched Successfully",
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params._id).populate(
    "user",
    "_id email username",
  );
  if (!order) throw new Error("Order not found");

  res.status(200).json({
    staus: 200,
    data: order,
    msg: "Order fetched successfully",
  });
});

const markOrderAsDelivered = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params._id,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    { new: true },
  );
  if (!updatedOrder)
    throw new Error("Error while updating the order to delivered");

  res.status(200).json({
    status: 200,
    data: updatedOrder,
    msg: "Order marked as delivered successfully",
  });
});

const markOrderAsPaid = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params._id,
    {
      isPaid: true,
      paidAt: Date.now(),
    },
    { new: true },
  );
  if (!updatedOrder) throw new Error("Error while updating the order to paid");

  res.status(200).json({
    status: 200,
    data: updatedOrder,
    msg: "Order marked as paid successfully",
  });
});

export const orderController = {
  createOrder,
  getOwnOrders,

  // Admin Only :
  getAllOrders,
  getOrderById,
  markOrderAsDelivered,
  markOrderAsPaid,
};
