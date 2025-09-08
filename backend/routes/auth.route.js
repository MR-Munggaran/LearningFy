import express from "express";
import { login, signup, logout, profileMe, detailProfile, listUser, updateUser, deleteUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectRoute, profileMe );
router.get('/detail/:id', protectRoute, detailProfile);
router.get('/', protectRoute, listUser);
router.put('/:id', protectRoute, updateUser);
router.delete('/:id', protectRoute, deleteUser);

// - `POST /auth/register` → register user baru
// - `POST /auth/login` → login & dapatkan token
// - `GET /users/me` → profil user yang sedang login
// - `GET /users/:id` → detail user (admin only)
// - `GET /users` → list semua user (admin only)
// - `PUT /users/:id` → update user (admin/self)
// - `DELETE /users/:id` → hapus user (admin only)

export default router;