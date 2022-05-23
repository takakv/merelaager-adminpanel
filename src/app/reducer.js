import pageTitleReducer from "../features/pageTitle/pageTitleSlice";
import campersReducer from "../features/tents/campersSlice";
import userDataReducer from "../features/userData/userDataSlice";
import shirtsReducer from "../features/thisrts/tshirtsSlice";
import camperInfoReducer from "../features/camperInfo/camperInfoSlice";
import teamsReducer from "../features/teams/teamerSlice";
import staffListReducer from "../features/staffList/staffListSlice";
import timerReducer from "../features/timer/timerSlice";
import userInfoReducer from "../features/userAuth/userAuthSlice";
import appAuthReducer from "../features/appAuth/appAuthSlice";

import registrationsReducer from "../features/registrations/registrationsSlice";

const rootReducer = () => ({
  pageTitle: pageTitleReducer,
  campers: campersReducer,
  userData: userDataReducer,
  shirts: shirtsReducer,
  camperInfo: camperInfoReducer,
  teams: teamsReducer,
  staffList: staffListReducer,
  timer: timerReducer,
  userInfo: userInfoReducer,
  appAuth: appAuthReducer,
  registrations: registrationsReducer,
});

export default rootReducer();
