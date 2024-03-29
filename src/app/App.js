import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import Login from "../components/Login";
import Root from "./Root";
import { refreshToken } from "../features/appAuth/appAuthSlice";
import Loader from "../components/Loader";

const App = () => {
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.appAuth.status);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (authStatus === "ok") dispatch(refreshToken());
    }, 240000);

    dispatch(refreshToken());

    return () => clearInterval(interval);
  }, [authStatus, dispatch]);

  switch (authStatus) {
    case "ok":
      return <Root />;
    case "forbidden":
      return <Login />;
    default:
      return <Loader />;
  }
};

export default App;
