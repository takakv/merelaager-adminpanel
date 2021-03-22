import { configureStore } from "@reduxjs/toolkit";
import pageTitleReducer from "../features/pageTitle/pageTitleSlice";
import campersReducer from "../features/tents/campersSlice";

export default configureStore({
  reducer: {
    pageTitle: pageTitleReducer,
    campers: campersReducer,
  },
});
