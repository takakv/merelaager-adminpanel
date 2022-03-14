import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { makeGetRequest } from "../../components/Common/requestAPI";

const initialState = {
  registrations: null,
  status: "idle",
  error: null,
};

export const fetchRegistrations = createAsyncThunk(
  "registrations/fetchRegistrations",
  async () => {
    const response = await makeGetRequest("/registrations/fetch");
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
});

export default registrationsSlice.reducer;
