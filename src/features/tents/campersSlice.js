import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchCampers = createAsyncThunk(
  "campers/fetchTents",
  async (shiftNr) => {
    const response = await makeGetRequest("tents/fetch/" + `${shiftNr}/`);
    return await response.json();
  }
);

const campersSlice = createSlice({
  name: "campers",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {
    updateCamper: (state, action) => {
      const { id, tentNr, currentNr } = action.payload;
      // The camper was assigned a tent.
      if (tentNr) {
        // Double iteration is not very efficient
        // but avoids nasty index calculations.
        const child = state.data.tentless.find((child) => child.id === id);
        state.data.tentless = state.data.tentless.filter(
          (child) => child.id !== id
        );
        state.data.tents[tentNr - 1].push(child);
      }
      // The camper was removed from their tent.
      else {
        const child = state.data.tents[currentNr].find(
          (child) => child.id === id
        );
        state.data.tents[currentNr] = state.data.tents[currentNr].filter(
          (child) => child.id !== id
        );
        state.data.tentless.push(child);
      }
    },
  },
  extraReducers: {
    [fetchCampers.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    },
    [fetchCampers.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const { updateCamper } = campersSlice.actions;

export default campersSlice.reducer;

export const getCampers = (state) => state.campers.data;
