import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchTeams = createAsyncThunk(
  "teams/fetchTeams",
  async (shiftNr) => {
    const response = await makeGetRequest(`/teams/fetch/${shiftNr}`);
    return response.json();
  }
);

const teamSlice = createSlice({
  name: "teams",
  initialState: {
    data: {},
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
      state.data = action.payload;
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
