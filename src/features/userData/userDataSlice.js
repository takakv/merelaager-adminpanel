import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    name: "nemo",
    role: "user",
    shift: 0,
  },
  reducers: {
    setData: (state, action) => {
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.shift = action.payload.shiftNr;
      state.shifts = action.payload.shifts;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setShift: (state, action) => {
      state.shift = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setShifts: (state, action) => {
      state.shifts = action.payload;
    },
  },
});

export const { setData, setRole, setShift, setName } = userDataSlice.actions;

export const getData = (state) => ({
  name: state.userData.name,
  role: state.userData.role,
  shift: state.userData.shift,
  shifts: state.userData.shifts,
});

export const getName = (state) => state.userData.name;
export const getRole = (state) => state.userData.role;
export const getShift = (state) => state.userData.shift;
export const getShifts = (state) => state.userData.shifts;

export default userDataSlice.reducer;
