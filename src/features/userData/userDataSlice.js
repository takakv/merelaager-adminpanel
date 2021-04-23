import { createSlice } from "@reduxjs/toolkit";

const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    name: "külaline",
    role: "user",
    shift: 0,
  },
  reducers: {
    setData: (state, action) => {
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.shift = action.payload.shift;
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
  },
});

export const { setData, setRole, setShift, setName } = userDataSlice.actions;

export const getData = (state) => {
  return {
    name: state.userData.name,
    role: state.userData.role,
    shift: state.userData.shift,
  };
};
export const getName = (state) => state.userData.name;
export const getRole = (state) => state.userData.role;
export const getShift = (state) => state.userData.shift;

export default userDataSlice.reducer;
