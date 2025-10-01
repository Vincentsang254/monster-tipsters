/** @format */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle, HiEye, HiEyeOff, HiMail, HiUser, HiPhone } from "react-icons/hi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { registerUser } from "../../features/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuthRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registerStatus, registerError } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values) => {
    dispatch(registerUser(values));
  };

  useEffect(() => {
    if (registerStatus === "success") {
      navigate("/auth/login");
    }
  }, [registerStatus, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be at least 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(4, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4"
          >
            <HiUser className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">Join Us Today</h2>
          <p className="mt-2 text-gray-600">Create your account to get started</p>
        </div>

        {/* Alert */}
        {registerStatus === "rejected" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6"
          >
            <Alert variant="danger" className="flex items-start">
              <HiInformationCircle className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
              <span className="font-medium">{registerError}</span>
            </Alert>
          </motion.div>
        )}

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-8 sm:px-8">
            <Formik
              initialValues={{ name: "", email: "", phoneNumber: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <HiUser className="w-5 h-5 text-gray-400" />
                      </div>
                      <Field
                        as={Input}
                        id="name"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <ErrorMessage name="name">
                      {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Email Field */}
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email address
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <HiMail className="w-5 h-5 text-gray-400" />
                      </div>
                      <Field
                        as={Input}
                        id="email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <ErrorMessage name="email">
                      {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Phone Field */}
                  <div>
                    <Label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <HiPhone className="w-5 h-5 text-gray-400" />
                      </div>
                      <Field
                        as={Input}
                        id="phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        placeholder="1234567890"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phoneNumber}
                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <ErrorMessage name="phoneNumber">
                      {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Password Field */}
                  <div>
                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        className="block w-full pr-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                        >
                          {showPassword ? (
                            <HiEyeOff className="w-5 h-5" />
                          ) : (
                            <HiEye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <ErrorMessage name="password">
                      {(msg) => <p className="mt-2 text-sm text-red-600">{msg}</p>}
                    </ErrorMessage>
                  </div>

                  {/* Submit Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full py-3 px-4 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting || registerStatus === "pending"}
                    >
                      {registerStatus === "pending" ? (
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </motion.div>
                </Form>
              )}
            </Formik>
          </div>

          {/* Links Section - Now below the form */}
          <div className="px-6 py-6 bg-gray-50 border-t border-gray-200 sm:px-8">
            <div className="text-center space-y-4">
              {/* Existing account link */}
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Additional links */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Link
                  to="/forgot-password"
                  className="text-center text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
                <Link
                  to="/"
                  className="text-center text-gray-600 hover:text-gray-500 transition-colors duration-200"
                >
                  Back to home
                </Link>
              </div>

              {/* Terms and Privacy */}
              <div className="text-xs text-gray-500 pt-2">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthRegister;