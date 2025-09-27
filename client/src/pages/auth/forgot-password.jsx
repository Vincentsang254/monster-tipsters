import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { url } from "@/features/slices/api";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address", { position: "top-center" });
      return;
    }
    
    setLoading(true);

    try {
      const response = await axios.post(`${url}/auth/forgot-password`, {
        email,
      });

      toast.success(response.data.message, { position: "top-center" });
      navigate("/auth/check-email");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
        { position: "top-center" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 bg-white shadow-lg rounded-xl"
      >
        <div className="flex items-center mb-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 transition-colors rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <FiArrowLeft className="text-gray-600" />
          </button>
          <h2 className="ml-2 text-2xl font-bold text-gray-800">Reset Password</h2>
        </div>

        <p className="mb-6 text-gray-600">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleForgotPassword} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="block w-full px-3 py-2 pl-10 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                aria-label="Email Address"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition-colors bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-sm text-center">
          <p className="text-gray-600">
            Remember your password?{" "}
            <Link 
              to="/auth/login" 
              className="font-medium text-blue-600 transition-colors hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;