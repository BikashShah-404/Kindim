import { Router } from "express";
import userRouter from "./user.route.js";
import categoryRouter from "./category.route.js";
import productRouter from "./product.route.js";
import reviewRouter from "./review.route.js";
import orderRouter from "./order.route.js";
import paymentRouter from "./payment.route.js";
import analyticsRouter from "./analytics.route.js";
import subscribtionRouter from "./subscribtion.route.js";

const apiIndex = "/api/v1";
const router = Router();

// userRouter:
router.use(`${apiIndex}/users`, userRouter);
// categoryRouter
router.use(`${apiIndex}/category`, categoryRouter);
// reviewRouter
router.use(`${apiIndex}/reviews`, reviewRouter);
// productRouter
router.use(`${apiIndex}/products`, productRouter);
// orderRouter
router.use(`${apiIndex}/orders`, orderRouter);
// paymentRouter
router.use(`${apiIndex}/payments`, paymentRouter);
// analyticsRouter
router.use(`${apiIndex}/analytics`, analyticsRouter);
// subscribtionROuter
router.use(`${apiIndex}/subscribtion`, subscribtionRouter);

export default router;
