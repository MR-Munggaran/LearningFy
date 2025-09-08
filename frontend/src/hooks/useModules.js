// hooks/useModules.js
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const useModules = () => {
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const getConfig = () => ({
    withCredentials: true,
  });

  // List modules by course
  const fetchModules = async (courseId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/v1/module/courses/${courseId}/modules`, getConfig());
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch modules");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create module
  const createModule = async (courseId, data) => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await axios.post(`/api/v1/module/courses/${courseId}/modules`, data, getConfig());
      toast.success("Module created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create module");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update module
  const updateModule = async (id, data) => {
    if (!authUser) return;
    setLoading(true);
    try {
      const res = await axios.put(`/api/v1/module/modules/${id}`, data, getConfig());
      toast.success("Module updated successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update module");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete module
  const deleteModule = async (id) => {
    if (!authUser) return;
    setLoading(true);
    try {
      await axios.delete(`/api/v1/module/modules/${id}`, getConfig());
      toast.success("Module deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete module");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchModules,
    createModule,
    updateModule,
    deleteModule,
  };
};
