/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { loadUser, logoutUser } from "@/features/slices/authSlice";
import Loader from "./Loader";

const CheckAuth = ({ children, requireAuth = false, requireAdmin = false }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { 
    userType, 
    status,
    isAuthenticated 
  } = useSelector((state) => state.auth);
  
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const tokenFromStorage = localStorage.getItem("token");
      
      // If no token, we're done checking
      if (!tokenFromStorage) {
        setIsChecking(false);
        return;
      }

      try {
        // Validate token
        const decodedToken = jwtDecode(tokenFromStorage);
        
        // Check token expiration
        if (decodedToken.exp * 1000 < Date.now()) {
          dispatch(logoutUser());
          setIsChecking(false);
          return;
        }

        // If we have a valid token, load user data if not already loaded
        if (status === 'idle' || status === 'pending') {
          await dispatch(loadUser());
        }
        
      } catch (error) {
        console.error("Token validation failed:", error);
        dispatch(logoutUser());
      } finally {
        // Always stop checking after processing
        setIsChecking(false);
      }
    };

    initializeAuth();
  }, [dispatch, status]);

  // Show loader while initializing authentication
  if (isChecking) {
    return <Loader />;
  }

  // Define public paths that don't require authentication
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/verify-otp",
    "/auth/check-email",
    "/auth/reset-password"
  ];

  // Check if current path is public
  const isPublicPath = publicPaths.some(path => 
    location.pathname.startsWith(path)
  );

  // Check if current path is reset password
  const isResetPasswordPath = location.pathname.startsWith("/auth/reset-password");

  // 1. Handle reset password path specially (always allow)
  if (isResetPasswordPath) {
    return children;
  }

  // 2. If user is authenticated and tries to access public path, redirect to dashboard
  if (isAuthenticated && isPublicPath) {
    const redirectPath = userType === "admin" ? "/admin/dashboard" : "/user/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  // 3. If auth is required but user isn't authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 4. If admin role is required but user isn't admin
  if (requireAuth && requireAdmin && userType !== "admin") {
    return <Navigate to="/unauth-page" replace />;
  }

  // 5. Handle root path redirect
  if (location.pathname === "/") {
    if (isAuthenticated) {
      const redirectPath = userType === "admin" ? "/admin/dashboard" : "/user/dashboard";
      return <Navigate to={redirectPath} replace />;
    }
    return <Navigate to="/auth/login" replace />;
  }

  // 6. Default case - allow access
  return children;
};

export default CheckAuth;