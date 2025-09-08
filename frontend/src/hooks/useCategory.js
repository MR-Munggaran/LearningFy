import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useCategory = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const categoryList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/category/categories`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch category");
      return { category: [] };
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data) => {
    if (!authUser) return;
    try {
      setLoading(true);
      const res = await axios.post(`/api/v1/category/categories`, data, {
        withCredentials: true,
      });
      toast.success("Category created successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create category");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, data) => {
    if (!authUser) return;
    try {
      setLoading(true);
      const res = await axios.put(`/api/v1/category/categories/${id}`, data, {
        withCredentials: true,
      });
      toast.success("Category updated successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/category/categories/${id}`, {
        withCredentials: true,
      });
      toast.success("Category deleted successfully");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createCategory,
    categoryList,
    updateCategory,
    deleteCategory,
  };
};

export default useCategory;
