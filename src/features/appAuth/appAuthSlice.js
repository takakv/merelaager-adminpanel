import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {makePostRequest, requestTokenRefresh} from "../../components/Common/requestAPI";

export const authenticate = createAsyncThunk("appAuth/authenticate", async () => {
  const response = await requestTokenRefresh();
  console.log("I am authenticating");
  console.log(response);

  return response.json();
});

const appAuthSlice = createSlice({
  name: "appAuth",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  extraReducers: {
    [authenticate.fulfilled]: (state, action) => {
      state.status = "authenticated";
      state.data = action.payload;
    },
    [authenticate.rejected]: (state, action) => {
      state.status = "forbidden";
      state.error = action.error.message;
    },
  },
});

export const getAppAuth = (state) => state.appAuth.data;

export default appAuthSlice.reducer;
