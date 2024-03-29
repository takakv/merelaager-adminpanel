import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import ShiftSwitcher from "./ShiftSwitcher";
import { getRole } from "../features/userData/userDataSlice";

const getHomePage = () => {
  const dispatch = useDispatch();
  return (
    <li className="last">
      <Link
        className="_link"
        to="/"
        onClick={() => dispatch(setTitle("Kambüüs"))}
      >
        Kambüüs
      </Link>
    </li>
  );
};

const getDocumentsPage = () => {
  const dispatch = useDispatch();
  return (
    <li>
      <Link
        className="_link"
        to="/mapp/"
        onClick={() => dispatch(setTitle("Mapp"))}
      >
        Mapp
      </Link>
    </li>
  );
};

const getChildInfoPage = (role) => {
  const dispatch = useDispatch();
  if (role !== "root" && role !== "master") return "";
  return (
    <li>
      <Link
        className="_link"
        to="/lapsed/"
        onClick={() => dispatch(setTitle("Lapsed"))}
      >
        Lapsed
      </Link>
    </li>
  );
};

const getTentPage = () => {
  const dispatch = useDispatch();
  return (
    <li>
      <Link
        className="_link"
        to="/telgid/"
        onClick={() => dispatch(setTitle("Telgid"))}
      >
        Telgid
      </Link>
    </li>
  );
};

const getTeamsPage = () => {
  const dispatch = useDispatch();
  return (
    <li>
      <Link
        className="_link"
        to="/meeskonnad/"
        onClick={() => dispatch(setTitle("Meeskonnad"))}
      >
        Meeskonnad
      </Link>
    </li>
  );
};

const getTimerPage = () => {
  const dispatch = useDispatch();
  return (
    <li className="last">
      <Link
        className="_link"
        to="/taimer/"
        onClick={() => dispatch(setTitle("Taimer"))}
      >
        Taimer
      </Link>
    </li>
  );
};

const getRegistrationPage = () => {
  const dispatch = useDispatch();
  return (
    <li>
      <Link
        className="_link"
        to="/nimekiri/"
        onClick={() => dispatch(setTitle("Nimekiri"))}
      >
        Nimekiri
      </Link>
    </li>
  );
};

const getMailSendPage = (role) => {
  const dispatch = useDispatch();
  if (role !== "root" && role !== "master") return "";
  return (
    <li>
      <Link
        className="_link"
        to="/meil/"
        onClick={() => dispatch(setTitle("Meil"))}
      >
        Meil
      </Link>
    </li>
  );
};

const getBillGenPage = (role) => {
  const dispatch = useDispatch();
  if (role !== "root" && role !== "master") return "";
  return (
    <li>
      <Link
        className="_link"
        to="/arvegeneraator/"
        onClick={() => dispatch(setTitle("Arvegeneraator"))}
      >
        Arvegeneraator
      </Link>
    </li>
  );
};

const getTShirtPage = (role) => {
  const dispatch = useDispatch();
  if (role !== "root") return "";
  return (
    <li>
      <Link
        className="_link"
        to="/sargid/"
        onClick={() => dispatch(setTitle("Särgid"))}
      >
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

const Sidebar = () => {
  const dispatch = useDispatch();
  return (
    <div className="c-sidebar">
      <Link
        to="/"
        className="c-sidebar-title"
        onClick={() => dispatch(setTitle("Kambüüs"))}
      >
        <img
          className="_link"
          alt="Logo"
          src="https://merelaager.ee/media/img/merelaager_ship.svg"
          width="50px"
        />
      </Link>
      <Navigation />
      <ShiftSwitcher />
    </div>
  );
};

export default Sidebar;
