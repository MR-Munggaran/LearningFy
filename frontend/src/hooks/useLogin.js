import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async ({email, password }) => {

    setLoading(true);
    try {
      const res = await axios.post(
        "/api/v1/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { data } = res;
      console.log(data);
      
      // Localstorage
      localStorage.setItem("learning_token", JSON.stringify(data));
      
      // context
      setAuthUser(data);
      console.log(data.token);
      
      toast.success("Sign in successful!");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};

export default useLogin;
