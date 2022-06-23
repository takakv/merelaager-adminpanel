import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
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
  return response.ok;
});

const teamSlice = createSlice({
  name: "teams",
  initialState: {
    data: {},
    teams: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addMember: (state, action) => {
      const { member, teamId } = action.payload;
      state.data.teams[teamId].members.push(member);
      state.data.teamless = state.data.teamless.filter(
        (entry) => entry.id !== member.id
      );
    },
    removeMember: (state, action) => {
      const { member, currentTeam } = action.payload;
      state.data.teamless.push(member);
      state.data.teams[currentTeam].members = state.data.teams[
        currentTeam
      ].members.filter((entry) => entry.id !== member.id);
    },
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
  },
});

export const { addMember, removeMember } = teamSlice.actions;

export default teamSlice.reducer;

export const getTeams = (state) => state.teams.data;

export const selectTeams = (state) => state.teams.teams;
