// hooks/useLessons.js
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const useLessons = () => {
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const getConfig = () => ({
    withCredentials: true,
  });

  // Helper untuk mengubah plain object menjadi FormData jika ada file
  const preparePayload = (data) => {
    // Jika ada file atau ini adalah request multipart, gunakan FormData
    if (data.file || data.content_type === "pdf") {
      const formData = new FormData();
      
      // Masukkan semua data teks ke FormData
      if (data.title) formData.append("title", data.title);
      if (data.content_type) formData.append("content_type", data.content_type);
      if (data.content) formData.append("content", data.content);
      if (data.position) formData.append("position", data.position);
      if (data.resource_url) formData.append("resource_url", data.resource_url);
      
      // Append file dengan key 'file' (pastikan ini sesuai dengan upload.single('file') di router backend)
      if (data.file) {
        formData.append("resource", data.file);
      }
      
      return formData;
    }
    
    const { file: _file, ...jsonData } = data;
    return jsonData;
  };

  // List lessons by module
  const fetchLessons = async (moduleId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/lesson/modules/${moduleId}/lessons`, getConfig());
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch lessons");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create lesson
  const createLesson = async (moduleId, data) => {
    if (!authUser) return;
    setLoading(true);
    try {
      const payload = preparePayload(data);
      const res = await axios.post(`/api/v1/lesson/modules/${moduleId}/lessons`, payload, getConfig());
      toast.success("Lesson created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create lesson");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update lesson
  const updateLesson = async (id, data) => {
    if (!authUser) return;
    setLoading(true);
    try {
      const payload = preparePayload(data);
      const res = await axios.put(`/api/v1/lesson/lessons/${id}`, payload, getConfig());
      toast.success("Lesson updated successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update lesson");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete lesson
  const deleteLesson = async (id) => {
    if (!authUser) return;
    setLoading(true);
    try {
      await axios.delete(`/api/v1/lesson/lessons/${id}`, getConfig());
      toast.success("Lesson deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lesson");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchLessons,
    createLesson,
    updateLesson,
    deleteLesson,
  };
};