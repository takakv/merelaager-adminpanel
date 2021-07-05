import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { getShift } from "../features/userData/userDataSlice";
import { makePostRequest } from "./Common/requestAPI";

const MainPage = (props) => {
  const { title } = props;
  const [email, setEmail] = useState();
  const dispatch = useDispatch();
  dispatch(setTitle(title));

  const shiftNr = useSelector(getShift);
  const credentials = localStorage.getItem("credentials");
  const { role } = JSON.parse(credentials).user;

  const sendMail = async () => {
    const packet = {
      shiftNr,
      email,
    };
    const response = await makePostRequest("/su/ct/", packet);
    if (response && response.ok) alert("Meil edukalt saadetud");
  };

  if (role === "op") {
    return <p>Siia tekivad asjad, ent neid asju veel pole.</p>;
  }
  return (
    <div>
      <p>Saada kasvatajale ligipääs:</p>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label>
        Meil
        <input onChange={(e) => setEmail(e.target.value)} type="email" />
      </label>
      <button type="button" onClick={sendMail}>
        Saada link
      </button>
    </div>
  );
};

MainPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default MainPage;
