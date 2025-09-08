import express from "express";
import { createReview, getCourseReviews, updateReview, deleteReview } from "../controllers/review.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/courses/:id/reviews", protectRoute, createReview);
router.get("/courses/:id/reviews", getCourseReviews);
router.put("/reviews/:id", protectRoute, updateReview);
router.delete("/reviews/:id", protectRoute, deleteReview);
// - `POST /courses/:id/reviews` → tambah review kursus (student only)
// - `GET /courses/:id/reviews` → list review kursus
// - `PUT /reviews/:id` → update review (owner)
// - `DELETE /reviews/:id` → hapus review
export default router;
