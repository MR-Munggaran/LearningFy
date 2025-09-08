import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

// router.get("/tags", tagList);
// router.post("/tags", protectRoute, createTag);
// router.delete('/tags/:id', protectRoute, deleteTag);

// app.use('/api/v1/category', categoryRoutes)

const useTags = () => {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();
  
  const listTags = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/category/tags`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tags");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (data) => {
    if (!authUser) return;
    try {
      setLoading(true);
      const res = await axios.post(`/api/v1/category/tags`, data, {
        withCredentials: true,
      });
      toast.success("Tag created successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create tag");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteTag = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/category/tags/${id}`, {
        withCredentials: true,
      });
      toast.success("Tag deleted successfully");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete tag");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getTagsByCourse = async (courseId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/category/courses/${courseId}/tags`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch tags");
      return [];
    } finally {
      setLoading(false);
    }
  };


  return {
    loading,
    listTags,
    createTag,
    deleteTag,
    getTagsByCourse
  };
};

export default useTags;
