import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { setTitle } from "../features/pageTitle/pageTitleSlice";
import { getShift } from "../features/userData/userDataSlice";
import { makePostRequest } from "./Common/requestAPI";
import StaffList from "../features/staffList/staffList";

const CurrentDate = () => {
  const [date] = useState(
    new Intl.DateTimeFormat("et-EE", { dateStyle: "full" }).format()
  );
  return (
    <div className="c-card c-dateblock">
      <div>
        <p>{date}</p>
      </div>
    </div>
  );
};

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
    return <StaffList />;
  }
  return (
    <div className="c-landing-grid">
      <CurrentDate />
      <StaffList />
      <div className="c-card c-mailsend">
        <p>Saada kasvatajale ligipääs:</p>
        <div className="c-mailsend-ia">
          <div className="c-mailsend-input">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="usr-mail">Meil</label>
            <input
              id="usr-mail"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div className="c-mailsend-actions">
            <button type="button" onClick={sendMail}>
              Saada link
            </button>
          </div>
        </div>
        <p>
          Ligipääsu piktogramm läheb roheliseks siis, kui kasvataja on endale
          konto loonud.
        </p>
      </div>
    </div>
  );
};

MainPage.propTypes = {
  title: PropTypes.string.isRequired,
};

export default MainPage;
