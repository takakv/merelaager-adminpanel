import { createSlice } from "@reduxjs/toolkit";

const getInitialState = () => {
  const tokenString = localStorage.getItem("credentials");
  const userToken = JSON.parse(tokenString);
  return userToken?.accessToken;
};

const initialState = { value: getInitialState() };

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    set(state, action) {
      state.value = action.payload;
    },
  },
});

export const { set } = tokenSlice.actions;

export default tokenSlice.reducer;
