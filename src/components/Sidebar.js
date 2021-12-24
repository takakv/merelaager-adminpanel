import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { getUserInfo } from "../features/userAuth/userAuthSlice";
import ShiftSwitcher from "./ShiftSwitcher";

// _link classnames serve as identifiers when to
// close the navigation menu on mobile.
const Navigation = () => {
  const dispatch = useDispatch();
  const role = useSelector(getUserInfo);

  return (
    <nav className="c-admin-nav">
      <ul className="u-list-blank">
        <li className="last">
          <Link
            className="_link"
            to="/"
            onClick={() => dispatch(setTitle("Kambüüs"))}
          >
            Kambüüs
          </Link>
        </li>
        {role === "op" ? (
          ""
        ) : (
          <li>
            <Link
              className="_link"
              to="/lapsed/"
              onClick={() => dispatch(setTitle("Lapsed"))}
            >
              Lapsed
            </Link>
          </li>
        )}
        <li>
          <Link
            className="_link"
            to="/telgid/"
            onClick={() => dispatch(setTitle("Telgid"))}
          >
            Telgid
          </Link>
        </li>
        <li>
          <Link
            className="_link"
            to="/meeskonnad/"
            onClick={() => dispatch(setTitle("Meeskonnad"))}
          >
            Meeskonnad
          </Link>
        </li>
        <li className="last">
          <Link
            className="_link"
            to="/taimer/"
            onClick={() => dispatch(setTitle("Taimer"))}
          >
            Taimer
          </Link>
        </li>
        {role === "op" ? (
          ""
        ) : (
          <li>
            <Link
              className="_link"
              to="/nimekiri/"
              onClick={() => dispatch(setTitle("Nimekiri"))}
            >
              Nimekiri
            </Link>
          </li>
        )}
        {role === "op" ? (
          ""
        ) : (
          <li>
            <Link
              className="_link"
              to="/meil/"
              onClick={() => dispatch(setTitle("Meil"))}
            >
              Meil
            </Link>
          </li>
        )}
        {role === "op" ? (
          ""
        ) : (
          <li>
            <Link
              className="_link"
              to="/arvegeneraator/"
              onClick={() => dispatch(setTitle("Arvegeneraator"))}
            >
              Arvegeneraator
            </Link>
          </li>
        )}
        {role === "op" ? (
          ""
        ) : (
          <li>
            <Link
              className="_link"
              to="/sargid/"
              onClick={() => dispatch(setTitle("Särgid"))}
            >
              Särgid
            </Link>
          </li>
        )}
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
