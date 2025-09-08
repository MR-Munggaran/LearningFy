import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import { addTagToCourse, categoryList, createCategory, createTag, deleteCategory, deleteTag, getTagsByCourse, removeTagFromCourse, tagList, updateCategory } from "../controllers/category.controller.js";

const router = express.Router();

router.get("/categories", categoryList);
router.post("/categories", protectRoute, createCategory);
router.put('/categories/:id', protectRoute, updateCategory);
router.delete('/categories/:id', protectRoute, deleteCategory);
// ===================================================================
router.get("/tags", tagList);
router.post("/tags", protectRoute, createTag);
router.delete('/tags/:id', protectRoute, deleteTag);
// ======================================================================
router.post("/courses/tags", addTagToCourse); 
router.delete("/courses/tags", removeTagFromCourse); 
router.get("/courses/:courseId/tags", getTagsByCourse);

// - `GET /categories` → list semua kategori
// - `POST /categories` → tambah kategori (admin)
// - `PUT /categories/:id` → update kategori (admin)
// - `DELETE /categories/:id` → hapus kategori (admin)
// - `GET /tags` → list semua tag
// - `POST /tags` → tambah tag (admin/instructor)
// - `DELETE /tags/:id` → hapus tag

export default router;