import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchShirts = createAsyncThunk("shirts/fetchShirts", async () => {
  const response = await makeGetRequest("shirts/fetch/");
  return await response.json();
});

const shirtsSlice = createSlice({
  name: "shirts",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchShirts.fulfilled]: (state, action) => {
      state.status = "ok";
      state.data = action.payload;
    },
    [fetchShirts.rejected]: (state, action) => {
      state.status = "nok";
      state.error = action.error.message;
    },
  },
});

export default shirtsSlice.reducer;

export const getShirts = (state) => state.shirts.data;
