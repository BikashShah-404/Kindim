import { Router } from "express";
import { subscribtionController } from "../controllers/subscribtion.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", subscribtionController.subscribe);
router.post("/toogle", verifyJWT, subscribtionController.toogleSubscribe);

export default router;
