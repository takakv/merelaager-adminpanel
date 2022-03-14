import React from "react";

import { useSelector } from "react-redux";
import Login from "../components/Login";
import Root from "./Root";

const App = () => {
  const loginStatus = useSelector((state) => state.login.status);

  /*
  const silentTokenRefresh = async () => {
    const refreshIsOk = await requestTokenRefresh();
    if (!refreshIsOk) window.location.reload();
  };
  */

  if (loginStatus === "ok") {
    // setInterval(silentTokenRefresh, 1200000);
    // silentTokenRefresh().then();

    // return <p>{accessToken}</p>;
    return <Root />;
  }

  return <Login />;
};

export default App;
