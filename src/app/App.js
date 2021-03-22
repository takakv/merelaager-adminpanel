import React from "react";
import { Switch, Route } from "react-router-dom";

import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import PageTitle from "../components/PageTitle";
import UserBox from "../components/UserBox";
import RegList from "../components/RegList/RegList";
import BillGen from "../components/BillGen";
import TentList from "../components/TentList";
import useToken from "../useToken";

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
    setInterval(silentTokenRefresh, 1200000);
  }

  silentTokenRefresh().catch((err) => {
    alert("Autentimisega on probleeme. Palun anna Taanielile teada.");
    console.log(err);
  });

  return (
    <div className="admin-page">
      <Sidebar />
      <PageTitle />
      <UserBox />
      <main role="main" className="c-content">
        <Switch>
          <Route path="/" exact={true}>
            <p>
              Kambüüsi uus versioon on veel töös, nii et võib esineda veidraid
              tõrkeid, ent uus versioon peaks olema kiirem, mugavam ning
              sujuvam, kui seda oli vana.
            </p>
          </Route>
          <Route path="/nimekiri/">
            <RegList title="Nimekiri" />
          </Route>
          <Route path="/arvegeneraator/">
            <BillGen title="Arvegeneraator" />
          </Route>
          <Route path="/telgid/">
            <TentList title="Telgid" />
          </Route>
        </Switch>
      </main>
    </div>
  );
}
