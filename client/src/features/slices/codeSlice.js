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

export const fetchCodes = createAsyncThunk(
  "codes/fetchCodes",
  async () => {
    try {
      const response = await axios.get(`${url}/codes/get`, setHeaders());
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      throw error;
    }
  }
);

export const createCode = createAsyncThunk(
  "codes/createCode",
  async (values) => {
    try {
      const response = await axios.post(
        `${url}/codes/create`,
        values,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      throw error;
    }
  }
);

export const deleteCode = createAsyncThunk(
  "codes/deleteCode",
  async (codeId) => {
    try {
      await axios.delete(`${url}/codes/delete/${codeId}`, setHeaders());
      return codeId;
    } catch (error) {
      console.error("Error deleting code:", error);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      throw error;
    }
  }
);

export const updateCode = createAsyncThunk(
  "codes/updateCode",
  async (codeId, formData) => {
    try {
      const response = await axios.put(
        `${url}/codes/update/${codeId}`,
        formData,
        setHeaders()
      );
      toast.success(response.data.message, {
        position: "top-center",
      });
      console.log("response.data", response.data);
      return response.data;
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      throw error;
    }
  }
);

const codeSlice = createSlice({
  name: "codes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCodes.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchCodes.fulfilled, (state, action) => {
        console.log("action.payload", action.payload.data);
        state.list = action.payload.data;
        state.status = "success";
      })
      .addCase(fetchCodes.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(createCode.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.status = "success";
      })
      .addCase(createCode.pending, (state) => {
        state.status = "pending";
      })
      .addCase(createCode.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(deleteCode.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (code) => code.id !== action.payload
        );
        state.status = "success";
      })
      .addCase(deleteCode.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteCode.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      })
      .addCase(updateCode.fulfilled, (state, action) => {
        const updatedCode = action.payload;
        const index = state.list.findIndex(
          (code) => code.id === updatedCode.id
        );
        if (index !== -1) {
          state.list[index] = updatedCode;
        }
     
        state.status = "success";
      })
      .addCase(updateCode.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateCode.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.payload;
      });
  },
});

export default codeSlice.reducer;
