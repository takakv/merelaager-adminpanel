import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

const initialState = {
  registrations: [],
  status: "idle",
  error: null,
};

export const fetchRegistrations = createAsyncThunk(
  "registrations/fetchRegistrations",
  async () => {
    const response = await makeGetRequest("/registrations");
    return response.json();
  }
);

const registrationsSlice = createSlice({
  name: "registrations",
  initialState,
  reducers: {
    paymentUpdated: (state, action) => {
      const { id, type, value } = action.payload;
      const entry = state.registrations[id];
      entry[type] = value;
    },
    registrationToggled: (state, action) => {
      const { id } = action.payload;
      const entry = state.registrations[id];
      entry.registered = !entry.registered;
    },
    entryRemoved: (state, action) => {
      const { id } = action.payload;
      delete state.registrations[id];
    },
  },
  extraReducers: {
    [fetchRegistrations.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.registrations = action.payload.value;
    },
    [fetchRegistrations.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const { paymentUpdate, registrationToggled, entryRemoved } =
  registrationsSlice.actions;

export const selectAllRegistrations = (state) =>
  state.registrations.registrations;

export const selectShiftRegistrations = (state, shiftNr) =>
  state.registrations.registrations.filter(
    (registration) => registration.shiftNr === shiftNr
  );

export const selectRegistrationsByShift = (state, shiftNr) =>
  state.registrations.registrations.find(
    (registration) => registration.shiftNr === shiftNr
  );

export const selectRegistrationById = (state, registrationId) =>
  state.registrations.registrations.find(
    (registration) => registration.id === registrationId
  );

export default registrationsSlice.reducer;
