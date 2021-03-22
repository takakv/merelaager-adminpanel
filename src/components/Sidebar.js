import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTitle } from "../features/pageTitle/pageTitleSlice";

const Navigation = () => {
  const dispatch = useDispatch();
  return (
    <nav className="c-admin-nav">
      <ul className="u-list-blank">
        <li>
          <Link to="/nimekiri/" onClick={() => dispatch(setTitle("Nimekiri"))}>
            Nimekiri
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
          <Link to="/telgid/" onClick={() => dispatch(setTitle("Telgid"))}>
            Telgid
          </Link>
        </li>
        <li>
          <Link to="/lapsed/" onClick={() => dispatch(setTitle("Lapsed"))}>
            Lapsed
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
        Kambüüs
      </Link>
      <Navigation />
    </div>
  );
};

export default Sidebar;
