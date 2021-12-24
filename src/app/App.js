import React from "react";

import Login from "../components/Login";
import Root from "./Root";
import useToken from "../useToken";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

const App = () => {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />;
  }

  const silentTokenRefresh = async () => {
    const credentials = JSON.parse(localStorage.getItem("credentials"));
    const { refreshToken } = credentials;

    const response = await fetch(`${apiURL}/api/auth/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    }).then((data) => data.json());
    credentials.accessToken = response.accessToken;
    localStorage.setItem("credentials", JSON.stringify(credentials));
  };

  setInterval(silentTokenRefresh, 1200000);
  silentTokenRefresh().catch((err) => {
    alert("Sessioon on aegunud.");
    localStorage.clear();
    location.reload();
    console.log(err);
    // alert("Autentimisega on probleeme. Palun anna Taanielile teada.");
  });

  return <Root />;
};

export default App;
