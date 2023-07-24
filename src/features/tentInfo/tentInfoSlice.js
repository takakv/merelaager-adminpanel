import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchTentInfo = createAsyncThunk(
  "tentInfo/fetchTentInfo",
  async (tentId) => {
    const response = await makeGetRequest(`/tents/${tentId}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  }
);

const tentInfoSlice = createSlice({
  name: "tentInfo",
  initialState: {
    tentInfo: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchTentInfo.fulfilled]: (state, action) => {
      state.status = "ok";
      state.tentInfo = action.payload;
      console.log(action.payload);
    },
    [fetchTentInfo.rejected]: (state, action) => {
      state.status = "nok";
      state.error = action.error.message;
    },
  },
});

export default tentInfoSlice.reducer;

export const selectTentInfo = (state) => state.tentInfo.tentInfo;
