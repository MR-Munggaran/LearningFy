import express from "express";
import {
  enrollCourse,
  myEnrollments,
  enrollmentDetail,
  cancelEnrollment,
} from "../controllers/enrollment.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

// - `POST /courses/:id/enroll` → enroll ke kursus (gratis/pending payment)
// - `GET /enrollments/me` → list kursus yang diikuti student login
// - `GET /enrollments/:id` → detail enrollment
// - `PUT /enrollments/:id/cancel` → cancel enrollment

router.post("/courses/:id/enroll", protectRoute, enrollCourse);
router.get("/enrollments/me", protectRoute, myEnrollments);
router.get("/enrollments/:id", protectRoute, enrollmentDetail);
router.put("/enrollments/:id/cancel", protectRoute, cancelEnrollment);

export default router;
