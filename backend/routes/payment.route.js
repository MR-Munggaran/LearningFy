import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { checkoutPayment, notificationHandler, getPayment, getCourse } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/payments/checkout", protectRoute, checkoutPayment);
// webhook, biasanya tidak pakai protectRoute
router.post("/payments/notification", notificationHandler); 
router.get("/payments/:id", protectRoute, getPayment);
router.get("/testing/enroll", protectRoute, getCourse);

export default router;
