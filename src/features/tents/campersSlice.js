import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAccessToken } from "../../components/Common/tokens";

export const fetchCampers = createAsyncThunk("tents/fetchTents", async () => {
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

const campersSlice = createSlice({
  name: "tents",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {
    // This reducer uses a hack and the whole logic should probably be rewritten!
    // It is difficult to know where a particular camper is situated in the campers
    // array. The current implementation tries to find the object which contains
    // the camper with the known ID, and then acts on that object. Since the state
    // object passed as an argument behaves in some complicated Redux way,
    // the state.data contains and index (index 0) and the data (index 1).
    updateCamper: (state, action) => {
      const { id, tent } = action.payload;
      let camperObject;
      Object.entries(state.data).forEach((obj) => {
        if (obj[1].id === id) camperObject = obj;
      });
      if (camperObject) camperObject[1].tent = tent;
      else console.error("smh");
      console.log("adding guy");
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
