import { createSlice } from "@reduxjs/toolkit";

const pageTitleSlice = createSlice({
  name: "pageTitle",
  initialState: {
    value: "Kambüüs",
  },
  reducers: {
    setTitle: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setTitle } = pageTitleSlice.actions;

export const getTitle = (state) => state.pageTitle.value;

export default pageTitleSlice.reducer;
