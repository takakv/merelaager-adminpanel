import React from "react";

import Login from "../components/Login";
import Root from "./Root";
import useToken from "../useToken";
import { requestTokenRefresh } from "../components/Common/requestAPI";

const App = () => {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }

  const silentTokenRefresh = async () => {
    const refreshIsOk = await requestTokenRefresh();
    if (!refreshIsOk) window.location.reload();
  };

  setInterval(silentTokenRefresh, 1200000);

  silentTokenRefresh().then();

  return <Root />;
};

export default App;
