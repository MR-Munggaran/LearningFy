// hooks/useReview.js
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const useReview = () => {
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const getConfig = () => ({
    withCredentials: true,
  });

  // ✅ GET /courses/:id/reviews → list review kursus
  const getCourseReviews = async (courseId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/review/courses/${courseId}/reviews`, getConfig());
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengambil review");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ POST /courses/:id/reviews → tambah review kursus
  const createReview = async (courseId, payload) => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/v1/review/courses/${courseId}/reviews`,
        payload,
        getConfig()
      );
      toast.success("Review berhasil ditambahkan!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menambahkan review");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ PUT /reviews/:id → update review
  const updateReview = async (reviewId, payload) => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await axios.put(`/api/v1/review/reviews/${reviewId}`, payload, getConfig());
      toast.success("Review berhasil diperbarui!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui review");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ DELETE /reviews/:id → hapus review
  const deleteReview = async (reviewId) => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await axios.delete(`/api/v1/review/reviews/${reviewId}`, getConfig());
      toast.success("Review berhasil dihapus!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus review");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getCourseReviews,
    createReview,
    updateReview,
    deleteReview,
  };
};
