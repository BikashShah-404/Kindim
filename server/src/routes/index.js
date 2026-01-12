import { Router } from "express";
import userRouter from "./user.route.js";
import categoryRouter from "./category.route.js";

const apiIndex = "/api/v1";
const router = Router();

// userRouter:
router.use(`${apiIndex}/users`, userRouter);
// categoryRouter
router.use(`${apiIndex}/category`, categoryRouter);

export default router;
