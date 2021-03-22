import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAccessToken } from "../../components/Common/tokens";

export const fetchTents = createAsyncThunk("tents/fetchTents", async () => {
  const response = await fetch(
    "http://localhost:3000/api/tents/fetch/" + `${2}/`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + fetchAccessToken(),
      },
    }
  );
  return await response.json();
});

const tentsSlice = createSlice({
  name: "tents",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchTents.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    },
    [fetchTents.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export default tentsSlice.reducer;

export const getTents = (state) => state.tents.data;
