/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { loadUser, logoutUser } from "@/features/slices/authSlice";
import Loader from "./Loader";
import axios from "axios";

const CheckAuth = ({ children, requireAuth = false, requireAdmin = false }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth.userType);
  const isAuthenticated = useSelector((state) => Boolean(state.auth.token));
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Call backend refresh endpoint, cookies will be sent automatically
        const res = await axios.get("/api/auth/refresh", { withCredentials: true });

        if (res.data?.accessToken) {
          // Save token in Redux (not in localStorage)
          dispatch(loadUser({
            token: res.data.accessToken,
            ...res.data.user
          }));
        } else {
          dispatch(logoutUser());
        }
      } catch (error) {
        console.error("Auth check failed:", error.response?.data || error.message);
        dispatch(logoutUser());
      } finally {
        setCheckingToken(false);
      }
    };

    verifyAuth();
  }, [dispatch]);

  if (checkingToken) {
    return <Loader />;
  }

  // Define public paths
  const publicPaths = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/verify-otp",
    "/auth/check-email",
    "/auth/reset-password"
  ];

  const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));
  const isResetPasswordPath = location.pathname.startsWith("/auth/reset-password");

  if (isResetPasswordPath) return children;

  if (isAuthenticated && isPublicPath) {
    return userType === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/user/dashboard" replace />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireAuth && requireAdmin && userType !== "admin") {
    return <Navigate to="/unauth-page" replace />;
  }

  if (location.pathname === "/") {
    if (isAuthenticated) {
      return userType === "admin"
        ? <Navigate to="/admin/dashboard" replace />
        : <Navigate to="/user/dashboard" replace />;
    }
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default CheckAuth;
