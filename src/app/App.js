import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import Login from "../components/Login";
import Root from "./Root";
import { refreshToken } from "../features/appAuth/appAuthSlice";

const App = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.appAuth.status);

  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("Fetching refresh token");
      if (authStatus === "ok") dispatch(refreshToken());
    }, 1200000);

    dispatch(refreshToken());

    return () => clearInterval(interval);
  }, [authStatus, dispatch]);

  if (authStatus === "ok") {
    return <Root />;
  }

  return <Login />;
};

export default App;
