import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useLogin from "../hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, login } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="py-16 my-[15vh]">
      <motion.div
        className="flex bg-white rounded-lg shadow-xl overflow-hidden mx-auto max-w-sm lg:max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Left Side Image */}
        <motion.div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=667&q=80')",
          }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Right Side Form */}
        <motion.div
          className="w-full p-8 lg:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-blue-600 text-center">
            CodeLearn
          </h2>
          <p className="text-lg text-gray-600 text-center">Welcome back! 🚀</p>

          {/* Divider */}
          <div className="mt-6 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4 border-gray-300"></span>
            <span className="text-xs text-center text-gray-500 uppercase">
              or login with email
            </span>
            <span className="border-b w-1/5 lg:w-1/4 border-gray-300"></span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                className="bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg py-2 px-4 block w-full"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex justify-between">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <input
                className="bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg py-2 px-4 block w-full"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>

            {/* Login Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-2 px-4 w-full rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </motion.div>
          </form>

          {/* Divider Sign Up */}
          <div className="mt-6 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4 border-gray-300"></span>
            <p className="text-xs text-gray-500 uppercase">or sign up</p>
            <span className="border-b w-1/5 md:w-1/4 border-gray-300"></span>
          </div>

          {/* Register Button */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Link
              to={"/signup"}
              className="flex justify-center bg-green-600 text-white font-bold py-2 px-4 w-full rounded-lg hover:bg-green-700 transition"
            >
              Register
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
