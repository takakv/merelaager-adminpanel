import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchCamperInfo = createAsyncThunk(
  "camperInfo/fetchCamperInfo",
  async (shiftNr) => {
    const response = await makeGetRequest(`/campers/${shiftNr}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.value;
  }
);

const camperInfoSlice = createSlice({
  name: "camperInfo",
  initialState: {
    camperInfo: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchCamperInfo.fulfilled]: (state, action) => {
      state.status = "ok";
      state.camperInfo = action.payload;
    },
    [fetchCamperInfo.rejected]: (state, action) => {
      state.status = "nok";
      state.error = action.error.message;
    },
  },
});

export default camperInfoSlice.reducer;

export const selectAllCampersInfo = (state) => state.camperInfo.camperInfo;
