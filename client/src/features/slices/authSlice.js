import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { url } from "./api";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

// Initial state for the auth slice
const initialState = {
  user: null,
  accessToken: null,
  registerStatus: "",
  registerError: "",
  loginStatus: "",
  loginError: "",
  userLoaded: false,
};
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/auth/signup`, {
        email: values.email,
        phoneNumber: values.phoneNumber,
        name: values.name,
        password: values.password,
      });

      toast.success(response.data.message, {
        position: "top-center",
      });

      console.log("return data from registerUser function",response.data);
      // Return only the necessary information (e.g., user details)
      return { userData: response.data, message: response.data.message };
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/auth/login`,
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );

      toast.success(response.data.message, {
        position: "top-center",
      });

      console.log("return data from loginUser function", response.data);
      //return response.data;
      return {
        user: response.data.data,
        accessToken: response.data.accessToken,
      };
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  const response = await axios.post(`${url}/auth/logout`, {}, { withCredentials: true });
  toast.success(response.data.message, { position: "top-center" });
  return null;
});

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/auth/refresh-token`, {}, { withCredentials: true });
      return {
        user: res.data.data,
        accessToken: res.data.accessToken,
      };
    } catch (error) {
      toast.error(error.response?.data?.message, {
        position: "top-center",
      });
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUser(state, action) {
      state.user = action.payload;
      state.accessToken = action.payload;
      state.userLoaded = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "pending";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = "success";
        state.user = action.payload.data;
        console.log("user data after signup", action.payload.data);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "rejected";
        state.registerError = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = "pending";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = "success";
        state.user = action.payload.data;
        state.accessToken = action.payload.accessToken;
        state.userLoaded = true;
        console.log("user login data", action.payload.data);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = "rejected";
        state.loginError = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.userLoaded = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload?.data;
        state.accessToken = action.payload;
        state.userLoaded = true;
        console.log("user refresh data", action.payload);
      });
  },
});

// Exporting actions and reducer
export const { loadUser } = authSlice.actions;
export default authSlice.reducer;
