import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchRegistrationList = createAsyncThunk(
  "registrationList/fetchRegistrationList",
  async () => {
    const response = await makeGetRequest("reglist/fetch/");
    return response.json();
  }
);

const registrationListSlice = createSlice({
  name: "registrationList",
  initialState: {
    data: {},
    status: "idle",
    error: null,
  },
  reducers: {
    updatePaidValue: (state, action) => {
      const { shiftNr, id, value } = action.payload;
      const camper = state.data[shiftNr].campers[id];
      camper.pricePaid = value;
    },
    updateToPayValue: (state, action) => {
      const { shiftNr, id, value } = action.payload;
      const camper = state.data[shiftNr].campers[id];
      camper.priceToPay = value;
    },
    toggleRegistration: (state, action) => {
      const { shiftNr, id, status } = action.payload;
      const isRegistered = !status;
      const shift = state.data[shiftNr];

      // Update camper registration status.
      const camper = shift.campers[id];
      camper.registered = isRegistered;

      // Update shift counters.
      if (isRegistered) {
        shift.totalRegCount += 1;
        shift[camper.gender === "Poiss" ? "regBoyCount" : "regGirlCount"] += 1;
        shift[camper.gender === "Poiss" ? "resBoyCount" : "resGirlCount"] -= 1;
      } else {
        shift.totalRegCount -= 1;
        shift[camper.gender === "Poiss" ? "regBoyCount" : "regGirlCount"] -= 1;
        shift[camper.gender === "Poiss" ? "resBoyCount" : "resGirlCount"] += 1;
      }
    },
    removeCamper: (state, action) => {
      const { shiftNr, id } = action.payload;
      const { campers } = state.data[shiftNr];
      delete campers[id];
    },
  },
  extraReducers: {
    [fetchRegistrationList.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.data = action.payload;
    },
    [fetchRegistrationList.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const {
  updatePaidValue,
  updateToPayValue,
  toggleRegistration,
  removeCamper,
} = registrationListSlice.actions;

export default registrationListSlice.reducer;

export const getAllRegistrationLists = (state) => state.registrationList.data;
