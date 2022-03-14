import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { fetchInfo, getUserInfo } from "../features/userAuth/userAuthSlice";
import { setData } from "../features/userData/userDataSlice";

import Hamburger from "../components/Hamburger";
import Sidebar from "../components/Sidebar";
import PageTitle from "../components/PageTitle";
import UserBox from "../components/UserBox";
import MainPage from "../components/MainPage";
import ShiftInfo from "../features/camperInfo/CamperInfo";
import TeamsPage from "../components/TeamList";
import TentList from "../components/TentList";
import Mailer from "../components/Mailer";
import RegistrationList from "../features/registrationList/RegistrationList";
import BillGen from "../components/BillGen";
import Shirts from "../features/thisrts/Tshirts";
import TimerList from "../components/TimerList";

const Loader = () => (
  <div className="c-preloader">
    <img
      className="_link"
      alt="Logo"
      src="https://merelaager.ee/media/img/merelaager_ship.svg"
    />
    <p>Laen...</p>
  </div>
);

const Root = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector(getUserInfo);
  const userInfoStatus = useSelector((state) => state.userInfo.status);
  const userInfoError = useSelector((state) => state.userInfo.error);

  useEffect(() => {
    if (userInfoStatus === "idle") dispatch(fetchInfo());
  }, [userInfoStatus, dispatch]);

  if (userInfoStatus === "succeeded") {
    dispatch(setData(userInfo));
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
            <Route path="/telgid/" element={<TentList title="Telgid" />} />
            <Route
              path="/meeskonnad/"
              element={<TeamsPage title="Meeskonnad" />}
            />
            <Route path="/taimer/" element={<TimerList title="Taimer" />} />
            <Route
              path="/nimekiri/"
              element={<RegistrationList title="Nimekiri" />}
            />
            {role === "full" ? (
              ""
            ) : (
              <Route path="/lapsed/" element={<ShiftInfo title="Lapsed" />} />
            )}
            {role === "full" ? (
              ""
            ) : (
              <Route path="/meil/" element={<Mailer title="Meil" />} />
            )}
            {role === "full" ? (
              ""
            ) : (
              <Route
                path="/arvegeneraator/"
                element={<BillGen title="Arvegeneraator" />}
              />
            )}
            {role === "full" ? (
              ""
            ) : (
              <Route path="/sargid/" element={<Shirts title="Särgid" />} />
            )}
          </Routes>
        </main>
      </div>
    );
  }
  if (userInfoStatus === "failed") {
    window.location.reload();
    return <p>{userInfoError}</p>;
  }
  return <Loader />;
};

export default Root;
