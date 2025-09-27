import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CheckEmail = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50"
    >
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center space-y-6 border border-gray-100">
        <div className="flex justify-center">
          <div className="p-4 bg-green-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-12 h-12 text-green-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-800">
            Check Your Email
          </h2>
          <p className="text-gray-600">
            We've sent a password reset link to your email address.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-left border border-blue-100">
          <div className="flex items-start space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-blue-700">
              Can't find the email? Check your spam folder or wait a few minutes. 
              If you still don't see it, try resending the link.
            </p>
          </div>
        </div>
        
        <div className="pt-4">
          <Link
            to="/auth/login"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckEmail;