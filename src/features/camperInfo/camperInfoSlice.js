import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchCamperInfo = createAsyncThunk(
  "camperInfo/fetchCamperInfo",
  async (shiftNr) => {
    const response = await makeGetRequest(`/campers/info/fetch/${shiftNr}`);
    return response.json();
  }
);

const camperInfoSlice = createSlice({
  name: "camperInfo",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchCamperInfo.fulfilled]: (state, action) => {
      state.status = "ok";
      state.data = action.payload;
    },
    [fetchCamperInfo.rejected]: (state, action) => {
      state.status = "nok";
      state.error = action.error.message;
    },
  },
});

export default camperInfoSlice.reducer;

export const getCamperInfo = (state) => state.camperInfo.data;
