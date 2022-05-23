import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makePostRequest } from "./Common/requestAPI";
import { loginUser } from "../features/appAuth/appAuthSlice";

const Login = () => {
  const dispatch = useDispatch();

  const loginError = useSelector((state) => state.appAuth.errorCode);

  const handleSubmit = async (e) => {
    const username = e.target.username.value;
    const password = e.target.password.value;
    e.preventDefault();
    dispatch(loginUser({ username, password }));
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

  const getErrorMessage = (code) => {
    switch (code) {
      case 403:
        return "Vale salasõna või parool";
      default:
        return "Süsteemiviga";
    }
  };

  const errorMessage = (
    <div className="c-login-error">
      <p>{getErrorMessage(loginError)}</p>
    </div>
  );

  return (
    <div className="c-login-wrapper">
      <h1>Kambüüs</h1>
      {loginError ? errorMessage : ""}
      <form className="c-login-form" onSubmit={handleSubmit}>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          <p>Kasutajanimi</p>
          <input type="text" name="username" />
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label>
          <p>Salasõna</p>
          <input type="password" name="password" />
        </label>
        <div className="c-login-submit">
          <button className="o-button c-login-form__button" type="submit">
            Sisene
          </button>
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

export default Login;
