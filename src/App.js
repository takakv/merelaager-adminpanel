import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import PageTitle from "./components/PageTitle";
import Userbox from "./components/userbox";
import RegList from "./components/RegList/RegList";
import BillGen from "./components/BillGen";
import useToken from "./useToken";

export default function App() {
  const { token, setToken } = useToken();

  const silentTokenRefresh = async () => {
    const credentials = JSON.parse(localStorage.getItem("credentials"));
    const refreshToken = credentials["refreshToken"];
    const response = await fetch("http://localhost:3000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: refreshToken }),
    }).then((data) => data.json());
    credentials.accessToken = response.accessToken;
    localStorage.setItem("credentials", JSON.stringify(credentials));
  };

  if (!token) {
    return <Login setToken={setToken} />;
  } else {
    setInterval(silentTokenRefresh, 1700000);
  }

  return (
    <div className="admin-page">
      <Sidebar />
      <PageTitle title="kambüüs_beta" />
      <Userbox />
      <main role="main" className="c-content">
        <Switch>
          <Route path="/nimekiri/">
            <RegList />
          </Route>
          <Route path="/arvegeneraator/">
            <BillGen />
          </Route>
          <Route path="/telgid/"/>
        </Switch>
      </main>
    </div>
  );
}
