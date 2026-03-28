import { Subscription } from "../models/subscribtion.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await Subscription.findOne({ email });
  if (existing)
    return res.status(200).json({
      status: 200,
      data: {},
      msg: "You are already subscribed with us",
    });
  else {
    const response = await Subscription.create({ email, isSubscribed: true });
    return res.status(200).json({
      status: 200,
      data: response,
      msg: "Thank u for connecting with us",
    });
  }
});

const toogleSubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existing = await Subscription.findOne({ email });
  if (!existing) {
    const response = await Subscription.create({ email, isSubscribed: true });
    return res.status(200).json({
      status: 200,
      data: response,
      msg: "Thank u for connecting with us",
    });
  }

  existing.isSubscribed = !existing.isSubscribed;

  const updated = await existing.save();

  res.status(200).json({
    status: 200,
    data: updated,
    msg: updated.isSubscribed
      ? "Thank u for connecting with us"
      : "Sad to see u Disconnect",
  });
});

export const subscribtionController = { subscribe, toogleSubscribe };
