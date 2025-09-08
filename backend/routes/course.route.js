import express from "express";
import {
  courseList,
  detailCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import { upload } from '../utils/upload.js'

const router = express.Router();

router.get("/", courseList);
router.get("/:id", detailCourse);
router.post("/", upload.single("image") ,protectRoute, createCourse);
router.put("/:id", upload.single("image"), protectRoute, updateCourse);
router.delete("/:id", protectRoute, deleteCourse);

export default router;

// - `GET /courses` → list semua kursus (+ filter kategori/tag/instructor)
// - `GET /courses/:id` → detail kursus
// - `POST /courses` → buat kursus baru (instructor)
// - `PUT /courses/:id` → update kursus (instructor/admin)
// - `DELETE /courses/:id` → hapus kursus