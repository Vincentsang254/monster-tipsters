/** @format */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/slices/authSlice";
// import { HiInformationCircle, HiEye, HiEyeOff, HiMail, HiLock } from "react-icons/hi";
import { HiInformationCircle, HiEye, HiEyeOff, HiMail, HiLockClosed } from "react-icons/hi";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

const AuthLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginError, loginStatus } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values) => {
    dispatch(loginUser(values));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          {/* Header with gradient */}
          <div className="p-6 text-center bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-2 text-blue-100">Sign in to your account</p>
          </div>

          <div className="p-8">
            {loginStatus === "rejected" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert variant="danger" className="flex items-start">
                  <HiInformationCircle className="mt-0.5 mr-2 flex-shrink-0" />
                  <span className="font-medium">{loginError}</span>
                </Alert>
              </motion.div>
            )}

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange, handleBlur, isSubmitting }) => (
                <Form className="space-y-5">
                  <div>
                    <Label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                      Email Address
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
                        className="pl-10" // Add padding for icon
                      />
                    </div>
                    <ErrorMessage name="email">
                      {(msg) => <div className="mt-1 text-sm text-red-600">{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div>
                    <Label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <HiLockClosed className="w-5 h-5 text-gray-400" />
                      </div>
                      <Field
                        as={Input}
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        className="pl-10 pr-10" // Add padding for icons
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <HiEyeOff className="w-5 h-5" />
                        ) : (
                          <HiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <ErrorMessage name="password">
                      {(msg) => <div className="mt-1 text-sm text-red-600">{msg}</div>}
                    </ErrorMessage>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <Link
                      to="/auth/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-2"
                    disabled={loginStatus === "pending"}
                  >
                    {loginStatus === "pending" ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* <div className="mt-6">//
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-gray-500 bg-white">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button variant="outline" className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                      clipRule="evenodd"
                    />
                  </svg>
                  GitHub
                </Button>
                <Button variant="outline" className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm4.293 15.707a1 1 0 01-1.414 1.414L10 11.414l-2.879 2.879a1 1 0 01-1.414-1.414L8.586 10 5.707 7.121a1 1 0 011.414-1.414L10 8.586l2.879-2.879a1 1 0 011.414 1.414L11.414 10l2.879 2.879z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Google
                </Button>
              </div>
            </div> */}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLogin;