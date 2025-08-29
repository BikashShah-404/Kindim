import { Router } from "express";
import userRouter from "./user.routes.js";

const apiIndex = "/api/v1";

const router = Router();

// userRoutes:
router.use(`${apiIndex}/users/`, userRouter);

export default router;
