import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  return (
    <nav className="c-admin-nav">
      <ul className="u-list-blank">
        <li className="last">
          <Link to="/" onClick={() => dispatch(setTitle("Kambüüs"))}>
            Kambüüs
          </Link>
        </li>
        <li>
          <Link to="/lapsed/" onClick={() => dispatch(setTitle("Lapsed"))}>
            Lapsed
          </Link>
        </li>
        <li className="last">
          <Link to="/telgid/" onClick={() => dispatch(setTitle("Telgid"))}>
            Telgid
          </Link>
        </li>
        <li>
          <Link
            to="/nimekiri/"
            onClick={() => dispatch(setTitle("Nimekiri"))}
          >
            Nimekiri
          </Link>
        </li>
        <li>
          <Link
            to="/meil/"
            onClick={() => dispatch(setTitle("Meil"))}>
            Meil
          </Link>
        </li>
        <li>
          <Link
            to="/arvegeneraator/"
            onClick={() => dispatch(setTitle("Arvegeneraator"))}
          >
            Arvegeneraator
          </Link>
        </li>
        <li>
          <Link to="/sargid/" onClick={() => dispatch(setTitle("Särgid"))}>
            Särgid
          </Link>
        </li>
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
          alt="Logo"
          src="https://merelaager.ee/media/img/merelaager_ship.svg"
          width="50px"
        />
      </Link>
      <Navigation/>
    </div>
  );
};

export default Sidebar;
