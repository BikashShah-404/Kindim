import { Router } from "express";
import { authorizedAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { paymentController } from "../controllers/payment.controller.js";

const router = Router();

router.route("/initiate").post(verifyJWT, paymentController.initiatePayment);
router.route("/complete").get(verifyJWT, paymentController.completePayment);
export default router;
