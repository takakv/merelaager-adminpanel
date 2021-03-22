import { configureStore } from "@reduxjs/toolkit";
import pageTitleReducer from "../features/pageTitle/pageTitleSlice";
import tentsReducer from "../features/tents/tentsSlice";

export default configureStore({
  reducer: {
    pageTitle: pageTitleReducer,
    tents: tentsReducer,
  },
});
