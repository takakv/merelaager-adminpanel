import { configureStore } from "@reduxjs/toolkit";
import pageTitleReducer from "../features/pageTitle/pageTitleSlice";

export default configureStore({
  reducer: {
    pageTitle: pageTitleReducer,
  },
});
