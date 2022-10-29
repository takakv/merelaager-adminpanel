import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  makeDeleteRequest,
  makeGetRequest,
  makePostRequest,
} from "../../components/Common/requestAPI";

export const fetchTeams = createAsyncThunk("teams/fetchTeams", async (data) => {
  const response = await makeGetRequest(
    `/teams/bulk/${data.year}/${data.shiftNr}`
  );
  return response.json();
});

export const createTeam = createAsyncThunk("teams/createTeam", async (data) => {
  const response = await makePostRequest(`/teams/`, data);
  return response.json();
});

export const deleteTeam = createAsyncThunk(
  "teams/deleteTeam",
  async (teamId) => {
    const response = await makeDeleteRequest(`/teams/${teamId}`);
    if (response.ok) return teamId;
    return null;
  }
);

const teamSlice = createSlice({
  name: "teams",
  initialState: {
    data: {},
    teams: [],
    status: "idle",
    error: null,
  },
  extraReducers: {
    [fetchTeams.fulfilled]: (state, action) => {
      state.status = "ok";
      state.teams = action.payload;
    },
    [fetchTeams.rejected]: (state, action) => {
      state.status = "nok";
      state.error = action.error.message;
    },
    [createTeam.fulfilled]: (state, action) => {
      const { id, name, shiftNr } = action.payload;
      state.teams.push({ id, name, shiftNr });
    },
    [deleteTeam.fulfilled]: (state, action) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
    },
  },
});

export default teamSlice.reducer;

export const selectTeams = (state) => state.teams.teams;
