import { Router } from "express";
import { authorizedAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { orderController } from "../controllers/order.controller.js";

const router = Router();

router
  .route("/")
  .post(verifyJWT, orderController.createOrder)
  .get(verifyJWT, orderController.getOwnOrders);

router
  .route("/all")
  .get(verifyJWT, authorizedAdmin, orderController.getAllOrders);

router.route("/:_id").get(verifyJWT, orderController.getOrderById);

router
  .route("/:_id/deliver")
  .put(verifyJWT, authorizedAdmin, orderController.markOrderAsDelivered);

router
  .route("/:_id/pay")
  .put(verifyJWT, authorizedAdmin, orderController.markOrderAsPaid);

export default router;
