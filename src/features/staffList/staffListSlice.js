import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchStaff = createAsyncThunk(
  "staff/fetchStaffList",
  async (shiftNr) => {
    const response = await makeGetRequest(`staff/${shiftNr}/`);
    return response.json();
  }
);

const staffListSlice = createSlice({
  name: "staffList",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchStaff.fulfilled]: (state, action) => {
      state.status = "ok";
      state.data = action.payload;
    },
    [fetchStaff.rejected]: (state, action) => {
      state.status = "fail";
      state.error = action.error.message;
    },
  },
});

export default staffListSlice.reducer;

export const getStaffList = (state) => state.staffList.data;
