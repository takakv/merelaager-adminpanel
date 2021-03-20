import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navigation extends Component {
  render() {
    return (
      <nav className="c-admin-nav">
        <ul className="u-list-blank">
          <li>
            <Link to="/nimekiri/">Nimekiri</Link>
          </li>
          <li>
            <Link to="/arvegeneraator/">Arvegeneraator</Link>
          </li>
          <li>
            <Link to="/telgid/">Telgid</Link>
          </li>
          <li>
            <Link to="/lapsed/">Lapsed</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default class Sidebar extends Component {
  render() {
    return (
      <div className="c-sidebar">
        <Link to="/" className="c-sidebar-title">
          Kambüüs
        </Link>
        <Navigation />
      </div>
    );
  }
}
