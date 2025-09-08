import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createLesson, deleteLesson, listLessonFromModule, updateLesson } from "../controllers/lesson.controller.js";
import { upload } from '../utils/upload.js'

const router = express.Router();

router.get("/modules/:moduleId/lessons", listLessonFromModule);
router.post("/modules/:moduleId/lessons", protectRoute, upload.single('resource') ,createLesson);
router.put("/lessons/:id", protectRoute, upload.single("resource"), updateLesson);
router.delete("/lessons/:id", protectRoute, deleteLesson);

export default router;

// - `GET /modules/:moduleId/lessons` → list lesson dari modul
// - `POST /modules/:moduleId/lessons` → tambah lesson (instructor)
// - `PUT /lessons/:id` → update lesson
// - `DELETE /lessons/:id` → hapus lesson