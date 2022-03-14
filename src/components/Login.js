import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { makePostRequest } from "./Common/requestAPI";
import { getLogin, loginUser } from "../features/login/loginSlice";

/*
const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

 */

/*
const loginUser = async (credentials) =>
  fetch(`${apiURL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
*/

// const Login = ({ setToken }) => {
const Login = () => {
  const dispatch = useDispatch();

  // const login = useSelector(getLogin);
  // const loginStatus = useSelector(state => state.login.status);
  // const loginError = useSelector(state => state.login.error);

  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
    /*
    console.log("Server login response:");
    console.log(response);
    console.log(login);
    /*
    const response = await loginUser({
      username,
      password,
    });
    
    setToken(response);
    */
  };

  const handleReset = async () => {
    const email = window.prompt("Meiliaadress parooli lähtestamiseks");
    if (!email) return;
    const res = await makePostRequest("su/pwd/reset", { email }, false);
    if (!res.ok) {
      window.alert("Lähtestamine läks nihu");
      return;
    }
    window.alert("Meil saadetud");
  };

  const handleResetKey = async ({ key }) => {
    if (key === "Enter") await handleReset();
  };

  return (
    <div className="c-login-wrapper">
      <h1>Kambüüs</h1>
      <form onSubmit={handleSubmit}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          <p>Nimi</p>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          <p>Salasõna</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="c-login-submit">
          <button type="submit">Sisene</button>
          <div
            className="c-login-reset"
            role="button"
            onClick={handleReset}
            tabIndex={0}
            onKeyPress={handleResetKey}
          >
            Unustasid salasõna?
          </div>
        </div>
      </form>
    </div>
  );
};

/*
Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

 */

export default Login;
