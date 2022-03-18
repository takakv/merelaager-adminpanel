import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makePostRequest } from "../../components/Common/requestAPI";

export const fetchInfo = createAsyncThunk("userAuth/fetchInfo", async () => {
  const response = await makePostRequest("/su/info");
  return response.json();
});

const userAuthSlice = createSlice({
  name: "userInfo",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  extraReducers: {
    [fetchInfo.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    },
    [fetchInfo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const getUserInfo = (state) => state.userInfo.data;

export default userAuthSlice.reducer;
