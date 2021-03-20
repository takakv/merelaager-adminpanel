import React, { useState } from "react";
import PropTypes from "prop-types";

const loginUser = async (credentials) => {
  return fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
};

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    setToken(token);
  };

  return (
    <div className="c-login-wrapper">
      <h3>Kambüüs</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nimi</label>
        <input
          type="text"
          id="name"
          name="username"
          required
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="password">Salsõna</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="c-btn" type="submit">
          Sisene
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
