import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useSignup from "../hooks/useSignUp";

export default function SignUp() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const { loading, signup } = useSignup();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputs.password !== inputs.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    await signup(inputs);
  };

  return (
    <div className="py-16 my-[10vh]">
      <div className="flex bg-white rounded-2xl shadow-xl overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        {/* Left Side Image */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=667&q=80')",
          }}
        ></div>

        {/* Right Side Form */}
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-3xl font-bold text-blue-600 text-center">
            CodeLearn
          </h2>
          <p className="text-lg text-gray-600 text-center">
            Create your account 🚀
          </p>

          {/* Divider */}
          <div className="mt-6 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4 border-gray-300"></span>
            <span className="text-xs text-center text-gray-500 uppercase">
              register with email
            </span>
            <span className="border-b w-1/5 lg:w-1/4 border-gray-300"></span>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Name
              </label>
              <input
                name="name"
                value={inputs.name}
                onChange={handleChange}
                className="bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg py-2 px-4 block w-full transition"
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            {/* Email Input */}
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                name="email"
                value={inputs.email}
                onChange={handleChange}
                className="bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg py-2 px-4 block w-full transition"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Role Radio */}
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-semibold mb-3">
                Select Role
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={inputs.role === "student"}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Student</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={inputs.role === "teacher"}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Teacher</span>
                </label>
              </div>
            </div>

            {/* Password Input */}
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                name="password"
                value={inputs.password}
                onChange={handleChange}
                className="bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg py-2 px-4 block w-full transition"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="mt-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                value={inputs.confirmPassword}
                onChange={handleChange}
                className="bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-lg py-2 px-4 block w-full transition"
                type="password"
                placeholder="Confirm your password"
                required
              />
            </div>

            {/* Register Button */}
            <div className="mt-8">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className={`${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-bold py-3 px-4 w-full rounded-lg shadow transition`}
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </div>
          </form>

          {/* Divider Sign In */}
          <div className="mt-6 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4 border-gray-300"></span>
            <p className="text-xs text-gray-500 uppercase">or sign in</p>
            <span className="border-b w-1/5 md:w-1/4 border-gray-300"></span>
          </div>

          {/* Login Button */}
          <div className="mt-6">
            <Link
              to="/login"
              className="flex bg-green-600 text-white font-bold py-3 px-4 w-full rounded-lg shadow hover:bg-green-700 transition justify-center"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
