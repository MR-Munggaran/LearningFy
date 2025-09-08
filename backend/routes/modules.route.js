import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { createModule, deleteModule, listModuleFromCourse, updateModule } from "../controllers/modules.controller.js";

const router = express.Router();

router.get("/courses/:courseId/modules", listModuleFromCourse);
router.post("/courses/:courseId/modules", protectRoute, createModule);
router.put("/modules/:id", protectRoute, updateModule);
router.delete("/modules/:id", protectRoute, deleteModule);

export default router;

// - `GET /courses/:courseId/modules` → list modul dari kursus
// - `POST /courses/:courseId/modules` → tambah modul (instructor)
// - `PUT /modules/:id` → update modul
// - `DELETE /modules/:id` → hapus modul