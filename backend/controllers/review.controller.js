import { ReviewModel } from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id: course_id } = req.params;
    const user_id = req.user.id; // asumsi ada auth

    if (req.user.role !== "student") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating harus antara 1 - 5" });
    }

    const review = await ReviewModel.create({ user_id, course_id, rating, comment });
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error create review:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getCourseReviews = async (req, res) => {
  try {
    const { id: course_id } = req.params;
    const reviews = await ReviewModel.findByCourse(course_id);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error("Error get reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.id;

    const existing = await ReviewModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    if (existing.user_id !== user_id) {
      return res.status(403).json({ message: "Tidak boleh edit review orang lain" });
    }

    const review = await ReviewModel.update({ 
        id, 
        rating: rating ?? existing.rating, 
        comment: comment ?? existing.comment
    });
    
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error update review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const existing = await ReviewModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Review tidak ditemukan" });
    }

    if (existing.user_id !== user_id) {
      return res.status(403).json({ message: "Tidak boleh hapus review orang lain" });
    }

    await ReviewModel.delete(id);
    res.json({ success: true, message: "Review dihapus" });
  } catch (error) {
    console.error("Error delete review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
