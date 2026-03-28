import { Payment } from "../models/payment.model.js";
import { Order } from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getEsewaPaymentHash,
  verifyEsewaPayment,
  verifyEsewaPaymentFailure,
} from "../services/esewa.js";

import axios from "axios";

const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId, totalPrice } = req.body;

  const order = await Order.findOne({
    _id: orderId,
    totalPrice: Number(totalPrice),
  });
  if (!order) throw new Error("Order not found or price mismatch");

  const exchangeResponse = await axios.get(
    `https://api.exchangerate-api.com/v4/latest/USD`,
  );
  const nprRate = exchangeResponse.data.rates.NPR;
  const nprAmount = Number(order.totalPrice * nprRate).toFixed(2);

  const paymentInitiate = await getEsewaPaymentHash({
    amount: nprAmount,
    transaction_uuid: `${orderId}-${Date.now()}`,
  });

  res.status(200).json({
    status: 200,
    data: { paymentInitiate, order, nprRate },
    msg: "Payment Initiated Successfully",
  });
});

const completePayment = asyncHandler(async (req, res) => {
  const { data } = req.query;
  console.log(data);

  if (!data) throw new Error("Invalid Request!!!");

  const paymentInfo = await verifyEsewaPayment(data);
  const order = await Order.findById(
    paymentInfo.response.transaction_uuid.split("-")[0],
  );

  if (!order) throw new Error("Order not found...");

  const paymentData = await Payment.create({
    pidx: paymentInfo.decodedData.transaction_code,
    transactionId: paymentInfo.decodedData.transaction_code,
    orderId: paymentInfo.response.transaction_uuid.split("-")[0],
    amount: order.totalPrice,
    dataFromVerificationReq: paymentInfo,
    apiQueryFromUser: req.query,
    paymentGateway: "esewa",
    status: "success",
  });

  order.isPaid = true;
  order.paidAt = new Date();
  await order.save();

  res.status(200).json({
    status: 200,
    data: paymentData,
    msg: "Payment Successfull",
  });
});

const failedPayment = asyncHandler(async (req, res) => {
  const { data } = req.query;

  const paymentInfo = await verifyEsewaPaymentFailure(data);

  const order = await Order.findById(
    paymentInfo.response.transaction_uuid.split("-")[0],
  );

  if (!order) throw new Error("Order not found...");

  const paymentData = await Payment.create({
    pidx: paymentInfo.decodedData.transaction_code,
    transactionId: paymentInfo.decodedData.transaction_code,
    orderId: paymentInfo.response.transaction_uuid.split("-")[0],
    amount: order.totalPrice,
    dataFromVerificationReq: paymentInfo,
    apiQueryFromUser: req.query,
    paymentGateway: "esewa",
    status: "failed",
  });

  res.status(200).json({
    status: 200,
    data: paymentData,
    msg: "Payment Failed",
  });
});

export const paymentController = {
  initiatePayment,
  completePayment,
  failedPayment,
};
