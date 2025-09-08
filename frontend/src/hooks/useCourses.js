// hooks/useCourses.js
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const useCourses = () => {
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const getConfig = () => ({
    withCredentials: true,
  });

  const fetchCourses = async (query = {}) => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams(query).toString();
      const res = await axios.get(`/api/v1/course/?${queryString}`, getConfig());
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch courses");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetail = async (id) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/course/${id}`, getConfig());
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch course detail");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (data) => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/v1/course", data, getConfig());
      toast.success("Course created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (id, data) => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await axios.put(`/api/v1/course/${id}`, data, getConfig());
      toast.success("Course updated successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!authUser) return;
    setLoading(true);
    try {
      await axios.delete(`/api/v1/course/${id}`, getConfig());
      toast.success("Course deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchCourses,
    fetchCourseDetail,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
