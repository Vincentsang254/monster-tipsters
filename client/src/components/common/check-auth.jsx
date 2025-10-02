/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { loadUser, logoutUser, refreshToken } from "@/features/slices/authSlice";
import Loader from "./Loader";

const CheckAuth = ({ children, requireAuth = false, requireAdmin = false }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  // Pull directly from Redux
  const userType = useSelector((state) => state.auth.user?.userType);
  const isAuthenticated = useSelector((state) => Boolean(state.auth.user));
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // ✅ Dispatch refreshToken thunk instead of manual axios call
        const resultAction = await dispatch(refreshToken());

        if (refreshToken.fulfilled.match(resultAction)) {
          // resultAction.payload = { user, accessToken }
          const { user, accessToken } = resultAction.payload;
          dispatch(loadUser({ ...user, token: accessToken }));
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
