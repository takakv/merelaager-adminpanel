import React from "react";
import { Route, Switch } from "react-router-dom";

import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import PageTitle from "../components/PageTitle";
import UserBox from "../components/UserBox";
import RegistrationList from "../features/registrationList/RegistrationList";
import BillGen from "../components/BillGen";
import TentList from "../components/TentList";
import TeamList from "../components/TeamList";
import useToken from "../useToken";
import { useDispatch } from "react-redux";
import { setData } from "../features/userData/userDataSlice";
import Shirts from "../features/thisrts/Tshirts";
import ShiftInfo from "../features/camperInfo/CamperInfo";
import Mailer from "../components/Mailer";
import Hamburger from "../components/Hamburger";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

export default function App() {
  const dispatch = useDispatch();
  const {token, setToken} = useToken();

  const silentTokenRefresh = async () => {
    const credentials = JSON.parse(localStorage.getItem("credentials"));
    const refreshToken = credentials["refreshToken"];
    const response = await fetch(`${apiURL}/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({token: refreshToken}),
    }).then((data) => data.json());
    credentials.accessToken = response.accessToken;
    localStorage.setItem("credentials", JSON.stringify(credentials));
  };

  if (!token) {
    return <Login setToken={setToken}/>;
  } else {
    setInterval(silentTokenRefresh, 1200000);
    silentTokenRefresh().catch((err) => {
      alert("Sessioon on aegunud.");
      localStorage.clear();
      location.reload();
      console.log(err);
      // alert("Autentimisega on probleeme. Palun anna Taanielile teada.");
    });
    const credentials = JSON.parse(localStorage.getItem("credentials"));
    dispatch(setData(credentials.user));
  }

  return (
    <div className="admin-page">
      <Hamburger/>
      <Sidebar/>
      <PageTitle/>
      <UserBox/>
      <main role="main" className="c-content">
        <Switch>
          <Route path="/" exact={true}>
            <p>
              Kambüüsi uus versioon on veel töös, nii et võib esineda veidraid
              tõrkeid, ent uus versioon peaks olema kiirem, mugavam ning
              sujuvam, kui seda oli vana.
            </p>
          </Route>
          <Route path="/lapsed/">
            <ShiftInfo title="Lapsed"/>
          </Route>
          <Route path="/meeskonnad/">
            <TeamList title="Meeskonnad"/>
          </Route>
          <Route path="/telgid/">
            <TentList title="Telgid"/>
          </Route>
          <Route path="/meil/">
            <Mailer title="Meil"/>
          </Route>
          <Route path="/nimekiri/">
            <RegistrationList title="Nimekiri"/>
          </Route>
          <Route path="/arvegeneraator/">
            <BillGen title="Arvegeneraator"/>
          </Route>
          <Route path="/sargid/">
            <Shirts title="Särgid"/>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
