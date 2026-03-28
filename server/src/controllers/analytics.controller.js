import { Order } from "../models/order.model.js";
import { Product } from "../models/product.modal.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  console.log(today, tomorrow);

  const [
    totalOrders,
    totalOrdersToday,
    totalRevenue,
    totalUsers,
    totalProducts,
  ] = await Promise.all([
    Order.countDocuments({ isPaid: true }),
    Order.countDocuments({
      isPaid: true,
      paidAt: { $gte: today, $lt: tomorrow },
    }),
    Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: { _id: null, total: { $sum: "$totalPrice" } },
      },
    ]),
    User.countDocuments(),
    Product.countDocuments(),
  ]);

  res.status(200).json({
    status: 200,
    data: {
      totalOrders,
      totalOrdersToday,
      totalRevenue: totalRevenue[0].total.toFixed(2),
      totalUsers,
      totalProducts,
    },
    msg: "Total Analytics Fetched Successfully",
  });
});

const getRevenuePerDay = asyncHandler(async (req, res) => {
  const start = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const end = new Date();

  const DBquery = [];
  DBquery.push(
    { $match: { isPaid: true, paidAt: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$paidAt" } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalOrders: 1,
        totalRevenue: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  );

  const salesPerDay = await Order.aggregate(DBquery);

  res.status(200).json({
    status: 200,
    data: salesPerDay,
    msg: "Sales per day fetched successfully",
  });
});

const getOrdersAnalytics = asyncHandler(async (req, res) => {
  const [paidStatus, paidOrderDeliveryStatus] = await Promise.all([
    Order.aggregate([
      {
        $group: {
          _id: "$isPaid",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          isPaid: "$_id",
          count: 1,
        },
      },
    ]),

    Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: "$isDelivered",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          isDelivered: "$_id",
          count: 1,
        },
      },
    ]),
  ]);
  console.log(paidStatus, paidOrderDeliveryStatus);

  const responseToBeSent = [];

  paidStatus.map(({ count, isPaid }) =>
    isPaid
      ? responseToBeSent.push({ name: "Paid", value: count })
      : responseToBeSent.push({ name: "Unpaid", value: count }),
  );

  paidOrderDeliveryStatus.map(({ count, isDelivered }) =>
    isDelivered
      ? responseToBeSent.push({ name: "Paid & Delivered", value: count })
      : responseToBeSent.push({ name: "Paid & Not Delivered", value: count }),
  );

  console.log(responseToBeSent);

  res.status(200).json({
    status: 200,
    data: responseToBeSent,
    msg: "Order Analytics Fetched Successfully",
  });
});

const getTopSellingProducts = asyncHandler(async (req, res) => {
  const DBquery = [];

  DBquery.push(
    {
      $match: { isPaid: true },
    },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        sold: { $sum: "$orderItems.qty" },
      },
    },
    { $sort: { sold: -1 } },
    { $limit: 6 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
        pipeline: [
          {
            $project: {
              name: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        product: { $first: "$product.name" },
      },
    },
  );

  const topProducts = await Order.aggregate(DBquery);
  console.log(topProducts);

  res.status(200).json({
    status: 200,
    data: topProducts,
    msg: "Top Selling Products Fetched Successfully",
  });
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const lowStockCount = 15;

  const lowStockProducts = await Product.find({
    countInStock: { $lte: lowStockCount },
  })
    .sort({ countInStock: 1 })
    .limit(6)
    .select("name countInStock image");

  res.status(200).json({
    status: 200,
    data: lowStockProducts.map((eachProduct) => ({
      name: eachProduct.name,
      stock: eachProduct.countInStock,
    })),
    msg: "Low Stock Products Fetched Successfully",
  });
});

export const analyticsController = {
  getDashboardAnalytics,
  getRevenuePerDay,
  getOrdersAnalytics,
  getTopSellingProducts,
  getLowStockProducts,
};
