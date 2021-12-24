import React, { useState } from "react";
import PropTypes from "prop-types";

const apiURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://merelaager.ee";

const loginUser = async (credentials) =>
  fetch(`${apiURL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());

const Login = ({ setToken }) => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser({
      username,
      password,
    });
    console.log(username);
    console.log(password);
    console.log(response);
    setToken(response);
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
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
