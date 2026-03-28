import { Router } from "express";
import { authorizedAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import { analyticsController } from "../controllers/analytics.controller.js";

const router = Router();

router
  .route("/dashboard")
  .get(verifyJWT, authorizedAdmin, analyticsController.getDashboardAnalytics);

router
  .route("/revenue-per-day")
  .get(verifyJWT, authorizedAdmin, analyticsController.getRevenuePerDay);

router
  .route("/orders")
  .get(verifyJWT, authorizedAdmin, analyticsController.getOrdersAnalytics);

router
  .route("/top")
  .get(verifyJWT, authorizedAdmin, analyticsController.getTopSellingProducts);

router
  .route("/low-stock")
  .get(verifyJWT, authorizedAdmin, analyticsController.getLowStockProducts);

export default router;
