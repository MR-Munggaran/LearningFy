import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setLoading(true);
    try {
      // Kalau backend punya endpoint logout
      await axios.post("/api/v1/auth/logout", {}, {
        headers: { "Content-Type": "application/json" }
      });

      // Hapus localStorage
      localStorage.removeItem("learning_token");

      // Reset context
      setAuthUser(null);

      toast.success("Logout successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, logout };
};