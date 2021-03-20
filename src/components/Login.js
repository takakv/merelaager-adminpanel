import React, { useState } from "react";
import PropTypes from "prop-types";

const loginUser = async (credentials) => {
  return fetch("http://localhost:3000/api/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser({
      username,
      password,
    });
    setToken(response);
  };

  return (
    <div className="c-login-wrapper">
      <h1>Kambüüs</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Nimi</p>
          <input type="text" onChange={(e) => setUserName(e.target.value)} />
        </label>
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
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
