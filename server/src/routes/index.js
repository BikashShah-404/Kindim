import { Router } from "express";
import userRouter from "./user.route.js";

const apiIndex = "/api/v1";
const router = Router();

// userRouter:
router.use(`${apiIndex}/users`, userRouter);

export default router;
