import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ShiftSwitcher from "./ShiftSwitcher";
import { getRole } from "../features/userData/userDataSlice";
import constants from "../utils/constants";

const getHomePage = () => (
  <li className="last">
    <Link className="_link" to="/">
      Kambüüs
    </Link>
  </li>
);

const getDocumentsPage = () => (
  <li>
    <Link className="_link" to="/mapp/">
      Mapp
    </Link>
  </li>
);

const getChildInfoPage = (role) => {
  if (role !== "root" && role !== "master") return "";
  return (
    <li>
      <Link className="_link" to="/lapsed/">
        Lapsed
      </Link>
    </li>
  );
};

const getTentPage = () => (
  <li>
    <Link className="_link" to="/telgid/">
      Telgid
    </Link>
  </li>
);

const getTeamsPage = () => (
  <li>
    <Link className="_link" to="/meeskonnad/">
      Meeskonnad
    </Link>
  </li>
);

const getTimerPage = () => (
  <li className="last">
    <Link className="_link" to="/taimer/">
      Taimer
    </Link>
  </li>
);

const getRegistrationPage = () => (
  <li>
    <Link className="_link" to="/nimekiri/">
      Nimekiri
    </Link>
  </li>
);

const getMailSendPage = (role) => {
  if (role !== "root" && role !== "master") return "";
  return (
    <li>
      <Link className="_link" to="/meil/">
        Meil
      </Link>
    </li>
  );
};

const getBillGenPage = (role) => {
  if (role !== constants.SHIFT_ROLE_BOSS && role !== constants.SHIFT_ROLE_ROOT)
    return "";
  return (
    <li>
      <Link className="_link" to="/arvegeneraator/">
        Arvegeneraator
      </Link>
    </li>
  );
};

const getTShirtPage = (role) => {
  if (role !== "root") return "";
  return (
    <li>
      <Link className="_link" to="/sargid/">
        Särgid
      </Link>
    </li>
  );
};

// _link classnames serve as identifiers when to
// close the navigation menu on mobile.
const Navigation = () => {
  const role = useSelector(getRole);

  return (
    <nav className="c-admin-nav">
      <ul className="u-list-blank">
        {getHomePage(role)}
        {getChildInfoPage(role)}
        {getTentPage(role)}
        {getTeamsPage(role)}
        {getTimerPage(role)}
        {getRegistrationPage(role)}
        {getMailSendPage(role)}
        {getBillGenPage(role)}
        {getTShirtPage(role)}
        {getDocumentsPage()}
      </ul>
    </nav>
  );
};

const Sidebar = () => (
  <div className="c-sidebar">
    <Link to="/" className="c-sidebar-title">
      <img
        className="_link"
        alt="Logo"
        src="https://merelaager.ee/img/merelaager_ship.svg"
        width="50px"
      />
    </Link>
    <Navigation />
    <ShiftSwitcher />
  </div>
);

export default Sidebar;
