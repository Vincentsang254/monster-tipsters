/* eslint-disable no-undef */
/** @format */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setHeaders, url } from "./api";

const initialState = {
  list: [],
  status: null,
  error: null,
};

export const fetchTips = createAsyncThunk("tips/fetchTips", async (_, {rejectWithValue}) => {
  try {
    const headers = await setHeaders()
    const response = await axios.get(`${url}/tips/get`, headers);
    toast.success(response.data.message, {
      position: "top-center",
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tips:", response?.data.data.message); // Log the error if any
    toast.error(error.response.data.message, {
      position: "top-center",
    });
    return rejectWithValue(error.response.data.message)
  }
});

export const fetchSingleTip = createAsyncThunk(
  "tips/fetchSingleTip",
  async (tipId, {rejectWithValue}) => {
    try {
      const headers = await setHeaders()
      const response = await axios.get(
        `${url}/tips/get/${tipId}`,
        headers
      );
      toast.success(response.data.message, {
        position: "top-center",
      });
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      return rejectWithValue(error.response.data.message)
    }
  }
);
export const createTip = createAsyncThunk("tips/createTip", async (values, {rejectWithValue}) => {
  try {
    const headers = await setHeaders()
    const response = await axios.post(
      `${url}/tips/create`,
      values,
      headers
    );
    toast.success(response.data.message, {
      position: "top-center",
    });
    return response.data;
  } catch (error) {
    toast.error(error.response.data.message, {
      position: "top-center",
    });
    return rejectWithValue(error.response.data.message)
  }
});

export const deleteTip = createAsyncThunk("tips/deleteTip", async (tipId, {rejectWithValue}) => {
  try {
    const headers = await setHeaders()
    const response = await axios.delete(
      `${url}/tips/delete/${tipId}`,
      headers
    );
    toast.success(response.data.message, {
      position: "top-center",
    });
    return tipId;
  } catch (error) {
    toast.error(error.response.data.message, {
      position: "top-center",
    });
    return rejectWithValue(error.response.data.message)
  }
});

export const updateTip = createAsyncThunk(
  "tips/updateTip",
  async ({ tipId, formData }, {rejectWithValue}) => {
    try {
      const headers = await setHeaders()
      const response = await axios.put(
        `${url}/tips/update/${tipId}`,
        formData,
        headers
      );
      toast.success(response.data.message, {
        position: "top-center",
      });
      return response.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      return rejectWithValue(error.response.data.message)
    }
  }
);

const tipsSlice = createSlice({
  name: "tips",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSingleTip.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchSingleTip.fulfilled, (state, action) => {
        state.status = "success";
        state.singleTip = action.payload.data;
      })
      .addCase(fetchSingleTip.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload.message;
      })

      .addCase(fetchTips.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.status = "success";
      })
      .addCase(fetchTips.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchTips.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload.message;
      })
      .addCase(createTip.fulfilled, (state, action) => {
        state.list.push(action.payload);
        // state.list = action.payload.data;
        state.status = "success";
      })
      .addCase(createTip.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createTip.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload.message;
      })
      .addCase(deleteTip.fulfilled, (state, action) => {
        state.list = state.list.filter((tip) => tip.id !== action.payload);
        state.status = "success";
      })
      .addCase(deleteTip.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteTip.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload.message;
      })
      .addCase(updateTip.fulfilled, (state, action) => {
        const updatedTip = action.payload;
        const index = state.list.findIndex((tip) => tip.id === updatedTip.id);

        if (index !== -1) {
          state.list[index] = updatedTip;
        }
        state.status = "success";
      })
      .addCase(updateTip.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateTip.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload.message;
      });
  },
});

export default tipsSlice.reducer;
