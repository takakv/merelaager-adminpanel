import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

export const fetchRegistrationList = createAsyncThunk(
  "registrationList/fetchRegistrationList",
  async () => {
    const response = await makeGetRequest("reglist/fetch/");
    return await response.json();
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
        shift.totalRegCount++;
        ++shift[camper.gender === "Poiss" ? "regBoyCount" : "regGirlCount"];
        --shift[camper.gender === "Poiss" ? "resBoyCount" : "resGirlCount"];
      } else {
        shift.totalRegCount--;
        --shift[camper.gender === "Poiss" ? "regBoyCount" : "regGirlCount"];
        ++shift[camper.gender === "Poiss" ? "resBoyCount" : "resGirlCount"];
      }
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
} = registrationListSlice.actions;

export default registrationListSlice.reducer;

export const getAllRegistrationLists = (state) => state.registrationList.data;
