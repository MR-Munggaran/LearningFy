import express from "express";
import {
  updateProgress,
  getProgressByEnrollment,
  getProgressByModule,
  deleteProgress,
} from "../controllers/progress.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

// Update / insert progress (per module)
router.post("/progress", protectRoute, updateProgress);

// Ambil semua progress by enrollment (per kursus)
router.get("/progress/enrollment/:enrollmentId", protectRoute, getProgressByEnrollment);

// Ambil progress per module
router.get("/progress/module/:moduleId", protectRoute, getProgressByModule);

// Hapus progress tertentu
router.delete("/progress/:id", protectRoute, deleteProgress);

export default router;

/*
- POST   /progress                       → update status module (completed/in_progress)
- GET    /progress/enrollment/:enrollmentId → progress per kursus
- GET    /progress/module/:moduleId         → progress module tertentu
- DELETE /progress/:id                      → hapus progress
*/
