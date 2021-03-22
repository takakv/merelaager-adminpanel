import { configureStore } from "@reduxjs/toolkit";
import pageTitleReducer from "../features/pageTitle/pageTitleSlice";
import campersReducer from "../features/tents/campersSlice";
import userDataReducer from "../features/userData/userDataSlice";
import registrationListReducer from "../features/registrationList/registrationListSlice";

export default configureStore({
  reducer: {
    pageTitle: pageTitleReducer,
    campers: campersReducer,
    userData: userDataReducer,
    registrationList: registrationListReducer,
  },
});
