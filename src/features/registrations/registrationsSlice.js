import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  makeGetRequest,
  makePatchRequest,
} from "../../components/Common/requestAPI";

const initialState = {
  registrations: [],
  status: "idle",
  error: null,
};

export const fetchRegistrations = createAsyncThunk(
  "registrations/fetchRegistrations",
  async () => {
    const response = await makeGetRequest("/registrations");
    if (!response.ok) return [];
    return response.json();
  }
);

export const updateRegistration = createAsyncThunk(
  "registrations/updateRegistration",
  async (req) => {
    const response = await makePatchRequest(
      `/registrations/${req.id}`,
      req.data
    );
    if (!response.ok) return {};
    return req;
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
    [updateRegistration.fulfilled]: (state, action) => {
      const { id, field, data } = action.payload;
      const registration = state.registrations.find((entry) => entry.id === id);
      registration[field] = data[field];
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

export const selectGroupRegistrations = (state, shiftNr, registered, gender) =>
  state.registrations.registrations.filter(
    (registration) =>
      registration.shiftNr === shiftNr &&
      registration.registered === registered &&
      registration.gender === gender
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
