import { configureStore } from "@reduxjs/toolkit";
import pageTitleReducer from "../features/pageTitle/pageTitleSlice";
import campersReducer from "../features/tents/campersSlice";
import userDataReducer from "../features/userData/userDataSlice";
import registrationListReducer from "../features/registrationList/registrationListSlice";
import shirtsReducer from "../features/thisrts/tshirtsSlice";
import camperInfoReducer from "../features/camperInfo/camperInfoSlice";
import teamsReducer from "../features/teams/teamerSlice";
import staffListReducer from "../features/staffList/staffListSlice";

export default configureStore({
  reducer: {
    pageTitle: pageTitleReducer,
    campers: campersReducer,
    userData: userDataReducer,
    registrationList: registrationListReducer,
    shirts: shirtsReducer,
    camperInfo: camperInfoReducer,
    teams: teamsReducer,
    staffList: staffListReducer,
  },
});
