/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { loadUser, logoutUser, refreshToken } from "@/features/slices/authSlice";
import Loader from "./Loader";

const CheckAuth = ({ children, requireAuth = false, requireAdmin = false }) => {
  const location = useLocation();
  const dispatch = useDispatch();

   // ✅ Pull directly from Redux state
  const user = useSelector((state) => state.auth.user);
  const userType = user?.userType;
  const isAuthenticated = Boolean(user);
  const [checkingToken, setCheckingToken] = useState(true);

  console.log("user from check auth", user)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const resultAction = await dispatch(refreshToken());

        if (refreshToken.fulfilled.match(resultAction)) {
          
          const { user, accessToken } = resultAction.payload;
          dispatch(loadUser({ user, accessToken }));
        } else {
          dispatch(logoutUser());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
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
