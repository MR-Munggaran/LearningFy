// hooks/useProgress.js
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const useProgress = () => {
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const getConfig = () => ({
    withCredentials: true,
  });

  // List lessons by module
  const getCourseProgress  = async (enrollmentId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/progress/progress/enrollment/${enrollmentId}`, getConfig());
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch lessons");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create lesson
  const updateLessonProgress  = async (enrollmentId, moduleId, status) => {
    if (!authUser) return;
    setLoading(true);
    try {
    const res = await axios.post("/api/v1/progress/progress", {
        enrollment_id: enrollmentId,
        module_id: moduleId,
        status,
      }, getConfig());

      toast.success("Progress berhasil diperbarui!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lesson");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // GET /progress/lesson/:lessonId → progress lesson tertentu
  const getModuleProgress = async (moduleId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/progress/progress/module/${moduleId}`, getConfig());
      return res.data;
    } catch (error) {
      console.error("Error getLessonProgress:", error);
      toast.error(error.response?.data?.message || "Gagal mengambil progress lesson");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getCourseProgress,
    getModuleProgress,
    updateLessonProgress,
  };
};
