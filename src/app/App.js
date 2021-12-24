import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Login from "../components/Login";
import Sidebar from "../components/Sidebar";
import PageTitle from "../components/PageTitle";
import UserBox from "../components/UserBox";
import RegistrationList from "../features/registrationList/RegistrationList";
import BillGen from "../components/BillGen";
import TentList from "../components/TentList";
import TeamsPage from "../components/TeamList";
import useToken from "../useToken";
import Shirts from "../features/thisrts/Tshirts";
import ShiftInfo from "../features/camperInfo/CamperInfo";
import Mailer from "../components/Mailer";
import Hamburger from "../components/Hamburger";
import MainPage from "../components/MainPage";
import { setData } from "../features/userData/userDataSlice";
import TimerList from "../components/TimerList";
import { fetchInfo, getUserInfo } from "../features/userAuth/userAuthSlice";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

const App = () => {
  const { token, setToken } = useToken();

  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const userInfoStatus = useSelector((state) => state.userInfo.status);
  const userInfoError = useSelector((state) => state.userInfo.error);

  useEffect(() => {
    if (userInfoStatus === "idle") dispatch(fetchInfo());
  }, [userInfoStatus, dispatch]);

  dispatch(setData(userInfo));

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

  if (userInfoStatus === "succeeded") {
    const { role } = userInfo;

    return (
      <div className="admin-page">
        <Hamburger />
        <Sidebar />
        <PageTitle />
        <UserBox />
        <main role="main" className="c-content">
          <Routes>
            <Route exact path="/" element={<MainPage title="Kambüüs" />} />
            {role === "op" ? (
              ""
            ) : (
              <Route path="/lapsed/" element={<ShiftInfo title="Lapsed" />} />
            )}
            <Route
              path="/meeskonnad/"
              element={<TeamsPage title="Meeskonnad" />}
            />
            <Route path="/telgid/" element={<TentList title="Telgid" />} />
            {role === "op" ? (
              ""
            ) : (
              <Route path="/meil/" element={<Mailer title="Meil" />} />
            )}
            {role === "op" ? (
              ""
            ) : (
              <Route
                path="/nimekiri/"
                element={<RegistrationList title="Nimekiri" />}
              />
            )}
            {role === "op" ? (
              ""
            ) : (
              <Route
                path="/arvegeneraator/"
                element={<BillGen title="Arvegeneraator" />}
              />
            )}
            {role === "op" ? (
              ""
            ) : (
              <Route path="/sargid/" element={<Shirts title="Särgid" />} />
            )}
            <Route path="/taimer/" element={<TimerList title="Taimer" />} />
          </Routes>
        </main>
      </div>
    );
  }
  if (userInfoStatus === "failed") {
    window.location.reload();
    return <p>{userInfoError}</p>;
  }
  return <p>Laen...</p>;
};

export default App;
