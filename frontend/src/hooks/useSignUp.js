import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ name, email, password, confirmPassword, role }) => {
    const success = handleInputErrors({ name, email, password, confirmPassword, role });
    if (!success) return;

    try {
      setLoading(true);
      const res = await axios.post(
        "/api/v1/auth/signup",
        { name, email, password, role },
        { headers: { "Content-Type": "application/json" } }
      );

      const { data } = res;
      console.log(data);

      // Localstorage
      localStorage.setItem("learning_token", JSON.stringify(data));

      // context
      setAuthUser(data);

      toast.success("Signup successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputErrors({ name, email, password, confirmPassword, role }) {
  if (!name || !email || !password || !confirmPassword || !role) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}