import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

// Refactors scheduled.

const getRegistrationCategory = (camper) => {
  let registrationCategory = camper["registered"] === "jah" ? "reg" : "res";
  registrationCategory += camper["gender"] === "Poiss" ? "Boys" : "Girls";
  return registrationCategory;
};

const getIndexOfCamper = (state, shiftNr, registrationCategory, camper) => {
  const lookupArray = current(state).data[shiftNr][registrationCategory];
  for (let [index, el] of lookupArray.entries()) {
    if (el.id === camper.id) return index;
  }
  return -1;
};

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
      const { shiftNr, camperData, value } = action.payload;
      const registrationCategory = getRegistrationCategory(camperData);
      const camperIndex = getIndexOfCamper(
        state,
        shiftNr,
        registrationCategory,
        camperData
      );

      // This is never supposed to happen.
      if (camperIndex === -1) {
        console.error("Fatal logic error!");
        alert("Midagi läks väga valesti.");
        return;
      }

      // Update the state outside of immer.
      state.data[shiftNr][registrationCategory][camperIndex].pricePaid = value;
    },
    updateToPayValue: (state, action) => {
      const { shiftNr, camperData, value } = action.payload;
      const registrationCategory = getRegistrationCategory(camperData);
      const camperIndex = getIndexOfCamper(
        state,
        shiftNr,
        registrationCategory,
        camperData
      );

      // This is never supposed to happen.
      if (camperIndex === -1) {
        console.error("Fatal logic error!");
        alert("Midagi läks väga valesti.");
        return;
      }

      // Update the state outside of immer.
      state.data[shiftNr][registrationCategory][camperIndex].priceToPay = value;
    },
    toggleRegistration: (state, action) => {
      console.log(action.payload);
      const { id, status, shiftNr } = action.payload;
      console.log(current(state.data[shiftNr]));
      let camperObject = 0;
      Object.entries(state.data).forEach((obj) => {
        if (obj[1].id === id) camperObject = obj;
      });
      console.log(camperObject);
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
