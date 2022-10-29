import { createSlice } from "@reduxjs/toolkit";

const timerSlice = createSlice({
  name: "timer",
  initialState: {
    // 3min in ms.
    value: 3 * 60 * 1000,
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { set } = timerSlice.actions;

export default timerSlice.reducer;
