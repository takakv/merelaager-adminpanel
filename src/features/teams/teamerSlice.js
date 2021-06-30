import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (shiftNr) => {
    const response = await makeGetRequest("teams/fetch/" + `${shiftNr}/`);
    return await response.json();
  }
);

const teamSlice = createSlice({
  name: "teams",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchTeams.fulfilled]: (state, action) => {
      state.status = "ok";
      state.data = action.payload;
    },
    [fetchTeams.rejected]: (state, action) => {
      state.status = "nok";
      state.error = action.error.message;
    },
  },
});

export default teamSlice.reducer;

export const getTeams = (state) => state.teams.data;
