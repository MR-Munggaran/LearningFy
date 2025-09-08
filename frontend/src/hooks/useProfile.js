import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

// router.get("/me", protectRoute, profileMe );
// router.get('/detail/:id', protectRoute, detailProfile);
// router.get('/', protectRoute, listUser);
// router.put('/:id', protectRoute, updateUser);
// router.delete('/:id', protectRoute, deleteUser);
// app.use('/api/v1/auth', authRoutes)

const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  // Get profile of logged in user
  const profileMe = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/auth/me', {
        withCredentials: true,
      });
      setAuthUser(res.data);
      console.log(res.data)
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load profile");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get detail user by id
  const detailUser = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/auth/detail/${id}`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load user detail");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get all users
  const listUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/v1/auth/`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Update user (by id)
  const updateUser = async (id, data) => {
    try {
      setLoading(true);
      const res = await axios.put(`/api/v1/auth/${id}`, data, {
        withCredentials: true,
      });
      toast.success("User updated successfully");
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete user (by id)
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/auth/${id}`, {
        withCredentials: true,
      });
      toast.success("User deleted successfully");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profileMe,
    detailUser,
    listUser,
    updateUser,
    deleteUser,
  };
};

export default useProfile;